import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { WIFI_ATTACKS } from "../knowledge/index.js";

// ---- Entropy & crack time calculation helpers ----

function calculateEntropy(psk: string): { bits: number; charset: string; charsetSize: number } {
  let charsetSize = 0;
  const charsets: string[] = [];

  if (/[a-z]/.test(psk)) { charsetSize += 26; charsets.push("lowercase"); }
  if (/[A-Z]/.test(psk)) { charsetSize += 26; charsets.push("uppercase"); }
  if (/[0-9]/.test(psk)) { charsetSize += 10; charsets.push("digits"); }
  if (/[^a-zA-Z0-9]/.test(psk)) { charsetSize += 33; charsets.push("special"); }

  if (charsetSize === 0) charsetSize = 26; // fallback

  const bits = Math.log2(Math.pow(charsetSize, psk.length));
  return { bits, charset: charsets.join(" + "), charsetSize };
}

function parsePskDescription(desc: string): { length: number; charsetSize: number; charset: string } {
  const lower = desc.toLowerCase();
  let length = 8;
  let charsetSize = 26;
  let charset = "lowercase";

  const lenMatch = lower.match(/(\d+)\s*char/);
  if (lenMatch) length = parseInt(lenMatch[1]);

  if (lower.includes("numeric") || lower.includes("digit")) {
    charsetSize = 10; charset = "digits";
  } else if (lower.includes("alpha") && lower.includes("num")) {
    charsetSize = 62; charset = "alphanumeric";
  } else if (lower.includes("upper") && lower.includes("lower")) {
    charsetSize = 52; charset = "mixed case";
  } else if (lower.includes("special") || lower.includes("symbol")) {
    charsetSize = 95; charset = "full printable ASCII";
  } else if (lower.includes("hex")) {
    charsetSize = 16; charset = "hexadecimal";
  }

  return { length, charsetSize, charset };
}

function estimateCrackTime(keyspace: number, hashRate: number): string {
  const seconds = keyspace / hashRate;
  if (seconds < 1) return "< 1 second";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`;
  if (seconds < 86400 * 365) return `${(seconds / 86400).toFixed(1)} days`;
  if (seconds < 86400 * 365 * 1000) return `${(seconds / (86400 * 365)).toFixed(1)} years`;
  if (seconds < 86400 * 365 * 1e6) return `${(seconds / (86400 * 365 * 1000)).toFixed(0)}K years`;
  return "heat death of universe";
}

const wpa_assess_psk_strength: ToolDef = {
  name: "wpa_assess_psk_strength",
  description: "Assess WPA/WPA2/WPA3 PSK (Pre-Shared Key) strength. Analyzes entropy, estimates crack time with various hardware, and provides hardening recommendations.",
  schema: {
    psk: z.string().describe("The PSK itself or a description (e.g. '8 char numeric', 'MyP@ssw0rd!', '12 char alphanumeric')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const psk = args.psk as string;
    const isDescription = /\d+\s*char/i.test(psk) || psk.length < 4;

    let length: number;
    let charsetSize: number;
    let charset: string;
    let entropyBits: number;
    let isActualKey = false;

    if (isDescription) {
      const parsed = parsePskDescription(psk);
      length = parsed.length;
      charsetSize = parsed.charsetSize;
      charset = parsed.charset;
      entropyBits = Math.log2(Math.pow(charsetSize, length));
    } else {
      isActualKey = true;
      length = psk.length;
      const calc = calculateEntropy(psk);
      entropyBits = calc.bits;
      charsetSize = calc.charsetSize;
      charset = calc.charset;
    }

    const keyspace = Math.pow(charsetSize, length);

    // WPA2 PBKDF2-SHA1 hash rates (PMKs/sec)
    const hashRates: Record<string, number> = {
      "CPU (i7-13700K)": 35000,
      "GPU (RTX 3090)": 1300000,
      "GPU (RTX 4090)": 2500000,
      "Cloud (8x A100)": 8000000,
      "ASIC cluster": 50000000,
    };

    const crackTimes: Record<string, string> = {};
    for (const [hw, rate] of Object.entries(hashRates)) {
      crackTimes[hw] = estimateCrackTime(keyspace / 2, rate); // average case = keyspace/2
    }

    // Common password checks
    const commonPatterns: string[] = [];
    if (isActualKey) {
      if (/^[0-9]+$/.test(psk)) commonPatterns.push("Numeric only - extremely weak");
      if (/^[a-z]+$/i.test(psk)) commonPatterns.push("Letters only - weak against dictionary+rules");
      if (length === 8) commonPatterns.push("Minimum WPA length (8 chars) - vulnerable to brute force");
      if (/^(?:[A-Z][a-z]+)+\d{1,4}[!@#$%]?$/.test(psk)) commonPatterns.push("Common pattern: Word+Number+Symbol - in most rule-based attacks");
      if (/password|admin|wifi|network|guest/i.test(psk)) commonPatterns.push("Contains common WiFi password word");
      if (/(.)\1{2,}/.test(psk)) commonPatterns.push("Contains repeated characters");
      if (/^.{8}$/.test(psk)) commonPatterns.push("Exactly 8 chars - minimum length, first target for brute force");
    }

    let strength: string;
    let rating: number; // 1-10
    if (entropyBits < 30) { strength = "CRITICAL - Trivially crackable"; rating = 1; }
    else if (entropyBits < 40) { strength = "VERY WEAK - Crackable in minutes to hours"; rating = 2; }
    else if (entropyBits < 50) { strength = "WEAK - Crackable in hours to days"; rating = 3; }
    else if (entropyBits < 60) { strength = "MODERATE - Crackable in days to weeks"; rating = 5; }
    else if (entropyBits < 75) { strength = "GOOD - Crackable in months to years"; rating = 7; }
    else if (entropyBits < 90) { strength = "STRONG - Computationally infeasible with current hardware"; rating = 8; }
    else { strength = "EXCELLENT - Practically uncrackable"; rating = 10; }

    return json({
      psk_analysis: {
        input: isActualKey ? `[${length}-char key provided]` : psk,
        length,
        charset,
        charset_size: charsetSize,
        entropy_bits: Math.round(entropyBits * 10) / 10,
        keyspace: keyspace > 1e15 ? `~10^${Math.log10(keyspace).toFixed(1)}` : keyspace.toLocaleString(),
        strength,
        rating: `${rating}/10`,
        common_patterns: commonPatterns.length > 0 ? commonPatterns : ["No common weak patterns detected"],
      },
      estimated_crack_times: {
        note: "Average case (50% of keyspace) for WPA2 PBKDF2-SHA1",
        ...crackTimes,
      },
      recommendations: [
        length < 12 ? "CRITICAL: Use at least 12 characters, ideally 20+" : null,
        charsetSize < 62 ? "Use mix of uppercase, lowercase, digits, and special characters" : null,
        entropyBits < 60 ? "Current key is vulnerable to GPU-accelerated cracking" : null,
        "Consider using a random passphrase: 4-5 random words (e.g. 'correct horse battery staple')",
        "For enterprise: migrate to WPA2/WPA3-Enterprise (802.1X) to eliminate shared PSK",
        "WPA3-SAE provides resistance to offline dictionary attacks regardless of PSK strength",
        rating <= 5 ? "URGENT: This PSK should be changed immediately" : null,
      ].filter(Boolean),
    });
  },
};

const wpa_analyze_eap_config: ToolDef = {
  name: "wpa_analyze_eap_config",
  description: "Analyze WPA-Enterprise EAP (Extensible Authentication Protocol) configuration security. Evaluates EAP method, inner authentication, and certificate validation.",
  schema: {
    eap_method: z.string().describe("EAP method (PEAP, EAP-TLS, EAP-TTLS, EAP-FAST, EAP-SIM, EAP-AKA, LEAP)"),
    inner_method: z.string().optional().describe("Inner authentication method (MSCHAPv2, GTC, PAP, CHAP, TLS)"),
    cert_validation: z.boolean().optional().describe("Whether RADIUS server certificate is validated by clients"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const eapMethod = (args.eap_method as string).toUpperCase().trim();
    const innerMethod = args.inner_method ? (args.inner_method as string).toUpperCase().trim() : undefined;
    const certValidation = args.cert_validation as boolean | undefined;

    type VulnEntry = { severity: string; description: string; attack: string; remediation: string };
    const vulnerabilities: VulnEntry[] = [];
    const attackVectors: string[] = [];
    let securityRating: string;
    let score: number;

    switch (eapMethod) {
      case "EAP-TLS":
        score = 90;
        securityRating = "EXCELLENT";
        vulnerabilities.push({
          severity: "low",
          description: "EAP-TLS requires client certificates - strongest EAP method",
          attack: "Certificate theft from compromised endpoint",
          remediation: "Use hardware-backed certificate storage (TPM/Secure Enclave)",
        });
        break;

      case "PEAP":
        score = certValidation ? 65 : 35;
        securityRating = certValidation ? "MODERATE" : "WEAK";
        if (!certValidation || certValidation === undefined) {
          vulnerabilities.push({
            severity: "critical",
            description: "No RADIUS certificate validation - Evil Twin can capture credentials",
            attack: "Evil Twin with rogue RADIUS (eaphammer/hostapd-mana) captures MSCHAPv2 challenge/response",
            remediation: "Pin RADIUS server certificate in all supplicant configurations",
          });
          attackVectors.push("Evil Twin EAP credential capture");
        }
        if (innerMethod === "MSCHAPV2" || innerMethod === "MS-CHAPV2" || !innerMethod) {
          vulnerabilities.push({
            severity: "high",
            description: "MSCHAPv2 is vulnerable to offline cracking (DES-based, always crackable)",
            attack: "Capture challenge/response via Evil Twin, crack with asleap/hashcat -m 5500",
            remediation: "Use EAP-TLS or PEAP with inner TLS. If MSCHAPv2 required, enforce certificate pinning.",
          });
          attackVectors.push("MSCHAPv2 offline crack (100% success with time)");
        }
        if (innerMethod === "GTC") {
          vulnerabilities.push({
            severity: "medium",
            description: "GTC (Generic Token Card) transmits credentials in cleartext inside tunnel",
            attack: "If tunnel is compromised, credentials are exposed in cleartext",
            remediation: "Only use GTC with validated RADIUS certificate",
          });
        }
        break;

      case "EAP-TTLS":
        score = certValidation ? 60 : 30;
        securityRating = certValidation ? "MODERATE" : "WEAK";
        if (!certValidation) {
          vulnerabilities.push({
            severity: "critical",
            description: "No certificate validation allows Evil Twin RADIUS credential capture",
            attack: "Rogue AP with freeradius-wpe captures inner authentication credentials",
            remediation: "Enforce RADIUS certificate pinning on all clients",
          });
        }
        if (innerMethod === "PAP") {
          vulnerabilities.push({
            severity: "critical",
            description: "PAP sends password in cleartext inside TLS tunnel",
            attack: "Evil Twin + TLS interception reveals plaintext password",
            remediation: "Switch to MSCHAPv2 at minimum, EAP-TLS preferred",
          });
          score -= 20;
        }
        break;

      case "EAP-FAST":
        score = 55;
        securityRating = "MODERATE";
        vulnerabilities.push({
          severity: "medium",
          description: "EAP-FAST PAC provisioning can be exploited if anonymous provisioning is enabled",
          attack: "Man-in-the-middle during PAC provisioning phase",
          remediation: "Disable anonymous PAC provisioning, use authenticated provisioning only",
        });
        break;

      case "LEAP":
        score = 10;
        securityRating = "CRITICAL";
        vulnerabilities.push({
          severity: "critical",
          description: "LEAP is completely broken - MS-CHAPv1 based, trivially crackable",
          attack: "Passive capture + asleap cracks in seconds",
          remediation: "IMMEDIATELY migrate to PEAP or EAP-TLS. LEAP should never be used.",
        });
        attackVectors.push("LEAP crack with asleap (seconds)");
        break;

      case "EAP-SIM":
      case "EAP-AKA":
        score = 70;
        securityRating = "GOOD";
        vulnerabilities.push({
          severity: "medium",
          description: `${eapMethod} relies on SIM card security - vulnerable to SIM cloning`,
          attack: "SIM cloning or IMSI catcher attacks",
          remediation: "Use EAP-AKA' (prime) for improved security",
        });
        break;

      default:
        score = 50;
        securityRating = "UNKNOWN";
        vulnerabilities.push({
          severity: "medium",
          description: `Unknown EAP method: ${eapMethod}`,
          attack: "Cannot assess without knowing the method",
          remediation: "Use EAP-TLS for highest security",
        });
    }

    // Find relevant attacks from KB
    const relatedAttacks = WIFI_ATTACKS.filter(
      (a) => a.protocols.includes("EAP") || a.id === "eap_downgrade" || a.id === "evil_twin"
    );

    return json({
      eap_assessment: {
        method: eapMethod,
        inner_method: innerMethod ?? "default (MSCHAPv2 for PEAP/EAP-TTLS)",
        certificate_validation: certValidation ?? "unknown/not enforced",
        security_rating: securityRating,
        score: `${Math.max(0, Math.min(100, score))}/100`,
        vulnerabilities,
        attack_vectors: attackVectors,
        related_kb_attacks: relatedAttacks.map((a) => ({
          id: a.id,
          name: a.name,
          severity: a.severity,
          tools: a.tools,
        })),
        recommendations: [
          eapMethod !== "EAP-TLS" ? "Migrate to EAP-TLS with client certificates for highest security" : null,
          certValidation !== true ? "CRITICAL: Enforce RADIUS server certificate pinning on all clients" : null,
          innerMethod === "PAP" ? "CRITICAL: Replace PAP with MSCHAPv2 or TLS immediately" : null,
          eapMethod === "LEAP" ? "CRITICAL: LEAP is broken. Migrate immediately." : null,
          "Deploy WIDS/WIPS to detect rogue RADIUS servers",
          "Regularly rotate RADIUS shared secrets",
          "Use WPA3-Enterprise 192-bit mode where supported",
          "Implement NAC (Network Access Control) alongside EAP",
        ].filter(Boolean),
      },
    });
  },
};

const wpa_check_pmf: ToolDef = {
  name: "wpa_check_pmf",
  description: "Analyze Protected Management Frames (802.11w/PMF) status and its security implications. Evaluates which attacks are blocked or enabled based on PMF configuration.",
  schema: {
    pmf_status: z.enum(["disabled", "optional", "required"]).describe("PMF configuration: disabled, optional (capable), or required"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const status = args.pmf_status as string;

    const attacksBlockedByPMF = [
      "Deauthentication flood attacks",
      "Disassociation attacks",
      "Channel Switch Announcement (CSA) spoofing",
      "Management frame spoofing for Evil Twin migration",
    ];

    const attacksNotBlockedByPMF = [
      "PMKID extraction (works regardless of PMF)",
      "Rogue AP (if client connects voluntarily)",
      "KRACK (targets handshake, not management frames)",
      "Protocol-level attacks (FragAttacks, Dragonblood)",
      "Passive sniffing and traffic analysis",
    ];

    let assessment: Record<string, unknown> = {};

    switch (status) {
      case "disabled":
        assessment = {
          status: "DISABLED",
          risk_level: "HIGH",
          description: "Management frames are unprotected. All management frame-based attacks are possible.",
          attacks_possible: attacksBlockedByPMF,
          impact: [
            "Deauth attacks can disconnect any client at will",
            "Evil Twin attacks easily force client migration via deauth",
            "CSA spoofing can redirect clients to rogue channels",
            "DoS via management frame flooding",
          ],
          wpa3_compliance: "NON-COMPLIANT - WPA3 requires PMF",
          recommendation: "Enable PMF immediately. Set to 'required' if all clients support it, otherwise 'optional'.",
        };
        break;

      case "optional":
        assessment = {
          status: "OPTIONAL (Capable)",
          risk_level: "MEDIUM",
          description: "PMF is negotiated per-client. Clients that support PMF get protection; legacy clients do not.",
          attacks_possible: [
            "Deauth against legacy clients without PMF",
            "Selective targeting of non-PMF clients",
            "Downgrade by spoofing beacon without PMF capability",
          ],
          attacks_blocked: [
            "Deauth against PMF-capable clients",
            "Management frame spoofing for PMF clients",
          ],
          impact: [
            "Mixed security posture - PMF clients protected, others not",
            "Attacker can still target legacy clients for Evil Twin migration",
            "Beacon spoofing may allow PMF downgrade in some implementations",
          ],
          wpa3_compliance: "PARTIAL - WPA3 requires PMF=required",
          recommendation: "Set PMF to 'required' and upgrade/replace clients that don't support 802.11w.",
        };
        break;

      case "required":
        assessment = {
          status: "REQUIRED",
          risk_level: "LOW",
          description: "All management frames are protected. Deauth and disassociation attacks are blocked.",
          attacks_blocked: attacksBlockedByPMF,
          attacks_still_possible: attacksNotBlockedByPMF,
          impact: [
            "Clients cannot be forcibly deauthenticated",
            "Evil Twin requires voluntary client migration (harder)",
            "Management frame integrity is cryptographically verified",
          ],
          wpa3_compliance: "COMPLIANT",
          caveats: [
            "Legacy clients without 802.11w support cannot connect",
            "Some IoT devices may not support PMF",
            "PMF does not protect against all attack types (see attacks_still_possible)",
          ],
          recommendation: "Maintain PMF=required. Ensure all new devices support 802.11w before deployment.",
        };
        break;
    }

    // Find deauth-related attacks from KB
    const deauthAttacks = WIFI_ATTACKS.filter(
      (a) => a.id === "deauth" || a.id === "evil_twin" || a.id === "channel_switch" || a.category === "dos"
    );

    return json({
      pmf_analysis: {
        ...assessment,
        related_attacks: deauthAttacks.map((a) => ({
          id: a.id,
          name: a.name,
          severity: a.severity,
          pmf_impact: status === "required"
            ? "BLOCKED by PMF"
            : status === "optional"
              ? "Partially mitigated (only for PMF clients)"
              : "FULLY POSSIBLE",
          mitigations: a.mitigations,
        })),
        deployment_guide: {
          cisco: "config t > interface dot11Radio0 > encryption mode ciphers aes-ccm > management frame-protection mandatory",
          ubiquiti: "UniFi Controller > Settings > WiFi > Security > Enable PMF (Required)",
          hostapd: "ieee80211w=2 (in hostapd.conf, 0=disabled, 1=optional, 2=required)",
          windows_gpo: "Computer Configuration > Policies > Windows Settings > Security > Wireless > PMF Required",
        },
      },
    });
  },
};

const wpa_compare_protocols: ToolDef = {
  name: "wpa_compare_protocols",
  description: "Compare WiFi security protocols side by side. Evaluates encryption, authentication, key management, and known vulnerabilities for each protocol.",
  schema: {
    protocols: z.array(z.string()).describe("Array of protocol names to compare (e.g. ['WPA2-PSK', 'WPA3-SAE', 'WPA2-Enterprise'])"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const protocols = args.protocols as string[];

    const protocolDetails: Record<string, Record<string, unknown>> = {
      "WEP": {
        encryption: "RC4 (broken)",
        key_management: "Static shared key",
        authentication: "Open System / Shared Key",
        integrity: "CRC-32 (no cryptographic integrity)",
        key_length: "40-bit or 104-bit",
        pmf: "N/A",
        offline_attack: "Not needed - key recovered from IV analysis",
        security_score: 0,
        status: "DEPRECATED - DO NOT USE",
        known_attacks: ["FMS attack", "PTW attack", "Chopchop", "Fragmentation", "Caffe Latte"],
        crack_time: "2-5 minutes with sufficient traffic",
      },
      "WPA-PSK": {
        encryption: "TKIP (RC4-based with improvements)",
        key_management: "4-way handshake, PSK-derived PMK",
        authentication: "Pre-Shared Key",
        integrity: "Michael MIC (weak)",
        key_length: "256-bit PMK from passphrase",
        pmf: "Not supported",
        offline_attack: "Handshake capture + dictionary/brute-force",
        security_score: 25,
        status: "DEPRECATED",
        known_attacks: ["Handshake crack", "Beck-Tews TKIP attack", "Ohigashi-Morii"],
        crack_time: "Depends on PSK strength",
      },
      "WPA2-PSK": {
        encryption: "CCMP (AES-128)",
        key_management: "4-way handshake, PSK-derived PMK",
        authentication: "Pre-Shared Key",
        integrity: "CCMP (CBC-MAC)",
        key_length: "128-bit encryption key",
        pmf: "Optional (802.11w)",
        offline_attack: "Handshake/PMKID capture + dictionary/brute-force",
        security_score: 55,
        status: "ACCEPTABLE with strong PSK + PMF",
        known_attacks: ["PMKID", "Handshake crack", "KRACK", "Kr00k", "FragAttacks"],
        crack_time: "Depends on PSK strength (GPU: ~2.5M PMKs/sec on RTX 4090)",
      },
      "WPA2-ENTERPRISE": {
        encryption: "CCMP (AES-128)",
        key_management: "4-way handshake, 802.1X-derived PMK (per-user)",
        authentication: "802.1X/EAP (PEAP, EAP-TLS, EAP-TTLS, etc.)",
        integrity: "CCMP (CBC-MAC)",
        key_length: "128-bit encryption key",
        pmf: "Optional (802.11w)",
        offline_attack: "Evil Twin EAP credential capture (depends on EAP method & cert validation)",
        security_score: 70,
        status: "GOOD for enterprise with proper cert validation",
        known_attacks: ["Evil Twin EAP", "KRACK", "FragAttacks", "EAP downgrade"],
        crack_time: "MSCHAPv2: crackable. EAP-TLS: not applicable",
      },
      "WPA3-SAE": {
        encryption: "CCMP (AES-128) or GCMP (AES-256)",
        key_management: "SAE (Dragonfly) handshake - no offline attack possible",
        authentication: "Simultaneous Authentication of Equals (password-based)",
        integrity: "CCMP/GCMP + PMF (mandatory)",
        key_length: "128-bit or 256-bit",
        pmf: "Required (mandatory)",
        offline_attack: "NOT POSSIBLE - SAE provides forward secrecy",
        security_score: 85,
        status: "RECOMMENDED",
        known_attacks: ["Dragonblood (side-channel, patched)", "Transition mode downgrade"],
        crack_time: "Offline cracking not possible. Online only (rate-limited).",
      },
      "WPA3-ENTERPRISE": {
        encryption: "GCMP-256 (192-bit security mode)",
        key_management: "802.1X with CNSA suite",
        authentication: "802.1X/EAP with 192-bit security",
        integrity: "BIP-GMAC-256 + PMF (mandatory)",
        key_length: "256-bit",
        pmf: "Required (mandatory)",
        offline_attack: "Not applicable with EAP-TLS + cert pinning",
        security_score: 95,
        status: "HIGHEST SECURITY",
        known_attacks: ["Theoretical: implementation-specific side-channels"],
        crack_time: "Not applicable",
      },
      "OPEN": {
        encryption: "None",
        key_management: "None",
        authentication: "None",
        integrity: "None",
        key_length: "N/A",
        pmf: "N/A",
        offline_attack: "N/A - no encryption to crack",
        security_score: 0,
        status: "INSECURE - All traffic visible",
        known_attacks: ["Passive sniffing", "ARP spoofing", "DNS spoofing", "SSL stripping", "Session hijacking"],
        crack_time: "N/A",
      },
      "OWE": {
        encryption: "CCMP (AES-128)",
        key_management: "Opportunistic Wireless Encryption (Diffie-Hellman)",
        authentication: "None (but encrypted)",
        integrity: "CCMP",
        key_length: "128-bit",
        pmf: "Required",
        offline_attack: "N/A - no PSK",
        security_score: 40,
        status: "Better than Open, but no authentication",
        known_attacks: ["Rogue AP (no server authentication)", "MitM during DH exchange"],
        crack_time: "N/A",
      },
    };

    // Normalize protocol names for lookup
    const normalize = (p: string): string => {
      const upper = p.toUpperCase().replace(/[-\s]/g, "_").replace("PERSONAL", "SAE");
      if (upper === "WPA2" || upper === "WPA2_PSK") return "WPA2-PSK";
      if (upper === "WPA3" || upper === "WPA3_SAE" || upper === "WPA3_PERSONAL") return "WPA3-SAE";
      if (upper === "WPA_PSK" || upper === "WPA") return "WPA-PSK";
      if (upper.includes("WPA3") && upper.includes("ENT")) return "WPA3-ENTERPRISE";
      if (upper.includes("WPA2") && upper.includes("ENT")) return "WPA2-ENTERPRISE";
      return upper.replace(/_/g, "-");
    };

    const comparison = protocols.map((p) => {
      const key = normalize(p);
      const details = protocolDetails[key];
      if (!details) {
        return { protocol: p, error: `Unknown protocol. Available: ${Object.keys(protocolDetails).join(", ")}` };
      }
      return { protocol: key, ...details };
    });

    // Build comparison matrix
    const validEntries = comparison.filter((c) => !("error" in c));
    const winner = validEntries.sort((a: any, b: any) => (b.security_score || 0) - (a.security_score || 0))[0];

    return json({
      comparison,
      summary: {
        most_secure: winner ? (winner as any).protocol : "N/A",
        recommendation: "Use WPA3-SAE for personal networks, WPA3-Enterprise (192-bit) for corporate environments.",
        migration_priority: [
          "WEP -> WPA2-PSK (minimum) or WPA3-SAE (preferred)",
          "WPA-PSK -> WPA2-PSK or WPA3-SAE",
          "WPA2-PSK -> WPA3-SAE (enable transition mode for compatibility)",
          "Open -> OWE or WPA3-SAE",
          "WPA2-Enterprise -> WPA3-Enterprise 192-bit",
        ],
      },
    });
  },
};

const wpa_crack_time_estimate: ToolDef = {
  name: "wpa_crack_time_estimate",
  description: "Estimate time to crack a WPA/WPA2 handshake or PMKID hash. Calculates based on hash type, hardware specs, and PSK policy.",
  schema: {
    hash_type: z.enum(["PMKID", "handshake"]).describe("Type of captured hash (PMKID or full 4-way handshake)"),
    hardware: z.string().describe("Hardware description (e.g. 'RTX 4090', 'RTX 3090', 'CPU i7', 'cloud 8xA100', or 'generic')"),
    psk_policy: z.string().optional().describe("PSK policy description (e.g. '8 chars numeric', '12 chars alphanumeric', '20 chars full')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const hashType = args.hash_type as string;
    const hardware = (args.hardware as string).toLowerCase();
    const pskPolicy = args.psk_policy as string | undefined;

    // Determine hash rate based on hardware
    // WPA2 uses PBKDF2-SHA1 with 4096 iterations = hashcat mode 22000
    let hashRate: number;
    let hardwareName: string;

    if (hardware.includes("4090")) {
      hashRate = 2500000; hardwareName = "NVIDIA RTX 4090";
    } else if (hardware.includes("4080")) {
      hashRate = 1800000; hardwareName = "NVIDIA RTX 4080";
    } else if (hardware.includes("3090")) {
      hashRate = 1300000; hardwareName = "NVIDIA RTX 3090";
    } else if (hardware.includes("3080")) {
      hashRate = 1000000; hardwareName = "NVIDIA RTX 3080";
    } else if (hardware.includes("a100") || hardware.includes("cloud")) {
      const gpuCountMatch = hardware.match(/(\d+)\s*x/i);
      const gpuCount = gpuCountMatch ? parseInt(gpuCountMatch[1]) : 8;
      hashRate = 1200000 * gpuCount; hardwareName = `${gpuCount}x NVIDIA A100`;
    } else if (hardware.includes("cpu") || hardware.includes("i7") || hardware.includes("i9")) {
      hashRate = 35000; hardwareName = "Intel CPU (i7/i9)";
    } else if (hardware.includes("m1") || hardware.includes("m2") || hardware.includes("m3") || hardware.includes("apple")) {
      hashRate = 50000; hardwareName = "Apple Silicon";
    } else {
      hashRate = 1300000; hardwareName = "Generic mid-range GPU";
    }

    // Determine keyspace from PSK policy
    let analyses: { scenario: string; length: number; charsetSize: number; keyspace: number; avgTime: string; charset: string }[] = [];

    if (pskPolicy) {
      const parsed = parsePskDescription(pskPolicy);
      const keyspace = Math.pow(parsed.charsetSize, parsed.length);
      analyses.push({
        scenario: `${pskPolicy} (${parsed.charset})`,
        length: parsed.length,
        charsetSize: parsed.charsetSize,
        keyspace,
        avgTime: estimateCrackTime(keyspace / 2, hashRate),
        charset: parsed.charset,
      });
    } else {
      // Show common scenarios
      const scenarios = [
        { name: "8-digit numeric PIN", length: 8, charset: 10 },
        { name: "8-char lowercase", length: 8, charset: 26 },
        { name: "8-char alphanumeric", length: 8, charset: 62 },
        { name: "8-char full printable", length: 8, charset: 95 },
        { name: "10-char alphanumeric", length: 10, charset: 62 },
        { name: "12-char alphanumeric", length: 12, charset: 62 },
        { name: "12-char full printable", length: 12, charset: 95 },
        { name: "16-char alphanumeric", length: 16, charset: 62 },
        { name: "20-char full printable", length: 20, charset: 95 },
      ];

      analyses = scenarios.map((s) => {
        const keyspace = Math.pow(s.charset, s.length);
        return {
          scenario: s.name,
          length: s.length,
          charsetSize: s.charset,
          keyspace,
          avgTime: estimateCrackTime(keyspace / 2, hashRate),
          charset: `${s.charset} chars`,
        };
      });
    }

    return json({
      crack_time_estimate: {
        hash_type: hashType,
        hashcat_mode: 22000,
        hardware: hardwareName,
        hash_rate: `${(hashRate / 1000000).toFixed(2)}M PMKs/sec`,
        note: hashType === "PMKID"
          ? "PMKID uses same hash algorithm as handshake (PBKDF2-SHA1). Same crack speed."
          : "Full handshake required for cracking. Same PBKDF2-SHA1 algorithm.",
        scenarios: analyses.map((a) => ({
          scenario: a.scenario,
          keyspace: a.keyspace > 1e15 ? `~10^${Math.log10(a.keyspace).toFixed(1)}` : a.keyspace.toLocaleString(),
          average_crack_time: a.avgTime,
          worst_case: estimateCrackTime(a.keyspace, hashRate),
        })),
      },
      optimization_tips: [
        "Use rule-based attacks: hashcat -m 22000 hash.22000 wordlist.txt -r best64.rule",
        "Combine wordlists: hashcat -m 22000 hash.22000 -a 1 words1.txt words2.txt",
        "Prince attack for passphrases: hashcat -m 22000 hash.22000 --prince=wordlist.txt",
        "Target common WiFi password patterns: Name+Year, Company+digits, etc.",
        "Use hashcat brain for distributed cracking across sessions",
        "Consider kwprocessor for keyboard-walk patterns",
      ],
      attack_priority: [
        "1. Dictionary with top WiFi wordlists (common passwords)",
        "2. Rule-based mutations on dictionaries",
        "3. Targeted wordlist from OSINT (company name, location, etc.)",
        "4. Combinator attack (word+word, word+number)",
        "5. Brute force (only feasible for short/simple keys)",
      ],
    });
  },
};

export const wpaAnalysisTools: ToolDef[] = [
  wpa_assess_psk_strength,
  wpa_analyze_eap_config,
  wpa_check_pmf,
  wpa_compare_protocols,
  wpa_crack_time_estimate,
];

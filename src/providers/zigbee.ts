import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ─── Tool 1: zigbee_analyze ───

const SECURITY_ASSESSMENTS: Record<string, { description: string; risks: string[]; recommendations: string[] }> = {
  none: {
    description: "No Zigbee security enabled — all frames transmitted in plaintext",
    risks: [
      "CRITICAL: All traffic visible to any 802.15.4 sniffer",
      "Complete device control possible by any attacker within RF range",
      "Replay attacks trivial — no frame counters or encryption",
      "Device impersonation with no authentication barrier",
      "Network key not required — no key management in place",
    ],
    recommendations: [
      "IMMEDIATELY enable at minimum network-level security",
      "Migrate to Zigbee 3.0 with Install Code-based joining",
      "Replace coordinator if it does not support security",
      "Consider replacing with a more secure protocol (Thread/Matter)",
    ],
  },
  network: {
    description: "Network-level (NWK) encryption with shared network key. All devices share the same key for encryption.",
    risks: [
      "Network key exposed during device join if using default Trust Center Link Key",
      "All devices share the same network key — compromise of one device exposes all traffic",
      "Frame replay possible if frame counter enforcement is weak",
      "No application-level confidentiality — coordinator can read all messages",
      "OTA key transport may use well-known default key (ZigBeeAlliance09)",
    ],
    recommendations: [
      "Use Install Code-based joining instead of default TC Link Key",
      "Enable frame counter validation on all devices",
      "Rotate network key periodically (may require re-join of all devices)",
      "Enable APS-level encryption for sensitive device pairs",
      "Disable permit-join on coordinator when not adding devices",
    ],
  },
  aps: {
    description: "APS-level (Application Support) encryption with per-link keys between device pairs. Strongest Zigbee security mode.",
    risks: [
      "APS link key establishment still relies on Trust Center — TC is a single point of trust",
      "If TC Link Key is default, APS link keys can be intercepted during establishment",
      "Frame counter resets after re-join may allow limited replay window",
      "APS encryption adds overhead — some constrained devices may not support it",
      "Not all Zigbee devices support APS-level security",
    ],
    recommendations: [
      "Use Install Code-based joining to protect initial APS key exchange",
      "Verify all critical devices support APS encryption",
      "Monitor Trust Center for unauthorized key requests",
      "Implement device allowlist on Trust Center",
      "Regular security audit with KillerBee or equivalent tools",
    ],
  },
};

const zigbeeAnalyze: ToolDef = {
  name: "zigbee_analyze",
  description:
    "Analyze Zigbee network security posture based on security configuration. Returns risk assessment, vulnerabilities, and recommendations.",
  schema: {
    network_key_known: z
      .boolean()
      .describe("Whether the Zigbee network key is known/captured by the assessor"),
    security_level: z
      .enum(["none", "network", "aps"])
      .describe("Zigbee security level in use: none, network (NWK key), or aps (APS link keys)"),
    coordinator_info: z
      .string()
      .optional()
      .describe("Optional coordinator hardware/firmware info for specific advisories"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const keyKnown = args.network_key_known as boolean;
    const securityLevel = args.security_level as string;
    const coordinatorInfo = args.coordinator_info as string | undefined;

    const assessment = SECURITY_ASSESSMENTS[securityLevel];
    if (!assessment) {
      return text(`Unknown security level: ${securityLevel}. Use: none, network, or aps.`);
    }

    const overallRisk = securityLevel === "none" ? "CRITICAL" : keyKnown ? "HIGH" : securityLevel === "network" ? "MEDIUM" : "LOW";

    const keyStatus = keyKnown
      ? {
          status: "COMPROMISED",
          implications: [
            "All network-layer encrypted traffic can be decrypted",
            "Attacker can inject authenticated frames into the network",
            "Device impersonation possible with known key + valid frame counter",
            "Full control of Zigbee devices possible",
          ],
          immediateActions: [
            "Rotate network key immediately (requires coordinator support)",
            "Re-join all devices with new key",
            "Investigate how key was compromised",
            "Deploy 802.15.4 monitoring to detect attacker frames",
          ],
        }
      : {
          status: "SECURE (as far as known)",
          implications: ["Network traffic remains confidential at network layer"],
          immediateActions: ["Continue monitoring for key extraction attempts during device joins"],
        };

    return json({
      securityLevel,
      securityDescription: assessment.description,
      overallRisk,
      networkKeyStatus: keyStatus,
      risks: assessment.risks,
      recommendations: assessment.recommendations,
      coordinatorInfo: coordinatorInfo ?? "not specified",
      zigbeeChannels: "11-26 (2.4 GHz band, 5 MHz spacing)",
      defaultTcLinkKey: "5A:69:67:42:65:65:41:6C:6C:69:61:6E:63:65:30:39 (ZigBeeAlliance09)",
    });
  },
};

// ─── Tool 2: zigbee_sniff_guide ───

const HARDWARE_GUIDES: Record<string, { setupSteps: string[]; firmwareUrl: string; notes: string[] }> = {
  ti_cc2531: {
    setupSteps: [
      "Flash CC2531 USB dongle with sniffer firmware using cc-tool or TI Flash Programmer",
      "Command: cc-tool -e -w CC2531ZNP-Prod.hex",
      "Install KillerBee framework: pip3 install killerbee",
      "Verify detection: zbid (should list CC2531 device)",
      "Alternative: Flash with Zigbee2MQTT coordinator firmware for network analysis",
    ],
    firmwareUrl: "https://github.com/riverloopsec/killerbee",
    notes: [
      "CC2531 supports all Zigbee channels (11-26)",
      "USB HID interface — no driver installation needed on Linux",
      "Can capture raw 802.15.4 frames including malformed packets",
      "Limited to one channel at a time — use zbstumbler to find active channel first",
    ],
  },
  apimote: {
    setupSteps: [
      "Connect ApiMote v4 via USB",
      "Install KillerBee: pip3 install killerbee",
      "Flash ApiMote firmware: killerbee/tools/flash_apimote.sh",
      "Verify: zbid (should show ApiMote device)",
      "ApiMote supports TX — can inject frames (not just passive sniffing)",
    ],
    firmwareUrl: "https://github.com/riverloopsec/apimote",
    notes: [
      "ApiMote v4 supports both RX and TX — full attack capability",
      "Based on TI CC2530 — same Zigbee PHY as production devices",
      "Supports KillerBee packet injection for replay attacks",
      "Better range than CC2531 due to external antenna connector",
    ],
  },
  hackrf: {
    setupSteps: [
      "Install GNU Radio: apt install gnuradio",
      "Install gr-ieee802-15-4: git clone https://github.com/bastibl/gr-ieee802-15-4",
      "Build: cd gr-ieee802-15-4 && mkdir build && cd build && cmake .. && make && sudo make install",
      "Configure for Zigbee channel frequency: 2405 + (channel - 11) * 5 MHz",
      "Run GNU Radio flowgraph for 802.15.4 decoding",
    ],
    firmwareUrl: "https://github.com/greatscottgadgets/hackrf",
    notes: [
      "HackRF provides wider bandwidth than dedicated Zigbee sniffers",
      "Can capture multiple Zigbee channels simultaneously with sufficient bandwidth",
      "Requires GNU Radio for demodulation — more complex setup",
      "Supports TX for frame injection (with gr-ieee802-15-4)",
      "Overkill for basic Zigbee sniffing — CC2531 is simpler",
    ],
  },
};

const zigbeeSniffGuide: ToolDef = {
  name: "zigbee_sniff_guide",
  description:
    "Zigbee traffic sniffing guide with KillerBee and compatible hardware. Returns setup commands, configuration, and channel-specific capture instructions.",
  schema: {
    channel: z
      .number()
      .min(11)
      .max(26)
      .describe("Zigbee channel to sniff (11-26). Each channel is 5 MHz apart starting at 2405 MHz."),
    hardware: z
      .enum(["ti_cc2531", "apimote", "hackrf"])
      .optional()
      .describe("Sniffing hardware to use. Default: ti_cc2531"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const channel = args.channel as number;
    const hardware = (args.hardware as string) ?? "ti_cc2531";

    const frequencyMHz = 2405 + (channel - 11) * 5;

    const guide = HARDWARE_GUIDES[hardware];
    if (!guide) {
      return text(`Unknown hardware: ${hardware}. Supported: ti_cc2531, apimote, hackrf`);
    }

    return json({
      channel,
      frequencyMHz,
      frequencyHz: frequencyMHz * 1_000_000,
      hardware,
      setup: guide.setupSteps,
      firmwareUrl: guide.firmwareUrl,
      captureCommands: [
        { tool: "killerbee", command: `zbstumbler`, description: "Discover active Zigbee networks and channels" },
        { tool: "killerbee", command: `zbdump -f 15 -c ${channel} -w zigbee_ch${channel}.pcap`, description: `Capture Zigbee traffic on channel ${channel}` },
        { tool: "killerbee", command: `zbwireshark -c ${channel}`, description: `Pipe live channel ${channel} traffic to Wireshark` },
        { tool: "wireshark", command: `wireshark -k -Y "zbee_nwk" zigbee_ch${channel}.pcap`, description: "Analyze captured Zigbee traffic in Wireshark" },
        { tool: "wireshark", command: `Edit > Preferences > Protocols > ZigBee > Add network key`, description: "Configure decryption key in Wireshark for traffic decoding" },
      ],
      notes: guide.notes,
      channelMap: Object.fromEntries(
        Array.from({ length: 16 }, (_, i) => [i + 11, `${2405 + i * 5} MHz`]),
      ),
      wiresharkDecryptionTip: "In Wireshark: Edit > Preferences > Protocols > ZigBee NWK > Security Keys > add the network key as a 16-byte hex string",
    });
  },
};

// ─── Tool 3: zigbee_key_extract ───

const KEY_EXTRACTION_METHODS: Record<string, { description: string; methodology: string[]; captureWindow: string; successLikelihood: string; prerequisites: string[]; mitigations: string[] }> = {
  tc_link_key: {
    description: "Capture network key during device join by sniffing the Trust Center Link Key exchange. The default TC Link Key (ZigBeeAlliance09) is publicly known.",
    methodology: [
      "1. Set up 802.15.4 sniffer on the target Zigbee channel",
      "2. Wait for or trigger a device join/rejoin event",
      "3. During join, the coordinator (Trust Center) sends the network key encrypted with the TC Link Key",
      "4. If default TC Link Key is in use, decrypt the transport key frame:",
      "   Default key: 5A:69:67:42:65:65:41:6C:6C:69:61:6E:63:65:30:39",
      "5. Extract the network key from the decrypted APS Transport Key frame",
      "6. Configure Wireshark with the extracted network key to decrypt all traffic",
      "7. KillerBee command: zbdump -c <channel> -w join_capture.pcap",
      "8. Use zbgoodfind to search for key in capture: zbgoodfind -r join_capture.pcap -f keyfile.txt",
    ],
    captureWindow: "Key exchange occurs during the ~2-5 second device join window",
    successLikelihood: "HIGH if default TC Link Key is used (most Zigbee HA/ZLL devices)",
    prerequisites: [
      "802.15.4 sniffer on correct channel BEFORE device join begins",
      "Target network uses default Trust Center Link Key",
      "Ability to trigger device join (physical button press, power cycle, or remove/re-add device)",
    ],
    mitigations: [
      "Use Install Code-based joining (unique per-device pre-shared key)",
      "Use Zigbee 3.0 Distributed Security model",
      "Monitor for unauthorized join events on coordinator",
      "Disable permit-join when not actively adding devices",
    ],
  },
  install_code: {
    description: "Install Code-based joining uses a unique per-device pre-shared key derived from an install code printed on the device. Significantly harder to intercept.",
    methodology: [
      "1. Install Code joining uses a device-specific key — default TC Link Key attack does NOT work",
      "2. The install code is typically a 16-byte code printed on the device or in documentation",
      "3. Attack approaches:",
      "   a. Physical access: Read install code from device label/QR code",
      "   b. Supply chain: Intercept device during shipping to read install code",
      "   c. Side-channel: Attempt power analysis or EM emanation during key derivation",
      "   d. Brute force: Install codes use CRC — reduces effective entropy but still computationally expensive",
      "4. If install code is obtained, derive the link key:",
      "   MMO hash of install code = preconfigured link key",
      "5. Sniff the join process and decrypt with the derived link key",
      "6. Extract network key from the decrypted transport key frame",
    ],
    captureWindow: "Same 2-5 second join window, but requires knowing the install code",
    successLikelihood: "LOW without physical access to device. MEDIUM with physical access.",
    prerequisites: [
      "Physical access to device to read install code, OR",
      "Supply chain interception, OR",
      "Side-channel attack capability",
      "802.15.4 sniffer on correct channel during join",
    ],
    mitigations: [
      "Protect install codes — do not photograph or store digitally",
      "Secure device supply chain",
      "Use out-of-band verification after device join",
      "Prefer Zigbee 3.0 with additional application-layer security",
    ],
  },
};

const zigbeeKeyExtract: ToolDef = {
  name: "zigbee_key_extract",
  description:
    "Guide for extracting Zigbee network keys during device join process. Covers both default Trust Center Link Key and Install Code-based joining methods.",
  schema: {
    join_method: z
      .enum(["tc_link_key", "install_code"])
      .describe("The joining method used by the target Zigbee network"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const joinMethod = args.join_method as string;

    const method = KEY_EXTRACTION_METHODS[joinMethod];
    if (!method) {
      return text(`Unknown join method: ${joinMethod}. Use: tc_link_key or install_code`);
    }

    return json({
      joinMethod,
      description: method.description,
      methodology: method.methodology,
      captureWindow: method.captureWindow,
      successLikelihood: method.successLikelihood,
      prerequisites: method.prerequisites,
      mitigations: method.mitigations,
      defaultTcLinkKey: {
        hex: "5A:69:67:42:65:65:41:6C:6C:69:61:6E:63:65:30:39",
        ascii: "ZigBeeAlliance09",
        note: "This is the well-known default Trust Center Link Key used by most Zigbee HA/ZLL/3.0 devices",
      },
      legalWarning: "Unauthorized interception of Zigbee communications may violate local laws. Ensure proper authorization before testing.",
    });
  },
};

// ─── Tool 4: zigbee_replay_guide ───

const REPLAY_TARGETS: Record<string, { description: string; highValueFrames: string[]; methodology: string[]; challenges: string[]; tools: string[] }> = {
  lock: {
    description: "Smart lock replay — capture and replay unlock/lock commands to control door locks without authorization.",
    highValueFrames: [
      "ZCL Door Lock cluster (0x0101) — Lock/Unlock commands",
      "ZCL On/Off cluster (0x0006) if lock uses basic on/off interface",
      "APS frame containing Lock Door (command ID 0x00) or Unlock Door (command ID 0x01)",
    ],
    methodology: [
      "1. Identify the Zigbee channel used by the lock (zbstumbler)",
      "2. Capture traffic during legitimate lock/unlock operation:",
      "   zbdump -c <channel> -w lock_capture.pcap",
      "3. Identify the unlock command frame in Wireshark (ZCL Door Lock cluster)",
      "4. Check frame counter enforcement:",
      "   - If frame counter is strictly enforced, replay requires counter > last accepted value",
      "   - If counter validation is weak or absent, direct replay will work",
      "5. Attempt replay with KillerBee:",
      "   zbreplay -f lock_capture.pcap -i 15",
      "6. If counter is enforced, attempt counter rollover or re-join-based reset",
      "7. Alternative: If network key is known, craft new frames with valid counter:",
      "   Use scapy-zigbee to construct frames with incremented counter",
    ],
    challenges: [
      "Modern smart locks enforce strict frame counter validation",
      "APS-level security adds per-link encryption — need both NWK and APS keys",
      "Some locks require additional PIN/code at application layer",
      "Lock may alert on rapid frame counter jumps",
    ],
    tools: ["killerbee (zbreplay)", "scapy-zigbee", "wireshark", "zbgoodfind"],
  },
  light: {
    description: "Smart light replay — capture and replay on/off/dim commands to control lighting.",
    highValueFrames: [
      "ZCL On/Off cluster (0x0006) — On/Off/Toggle commands",
      "ZCL Level Control cluster (0x0008) — Move to Level, Step",
      "ZCL Color Control cluster (0x0300) — Move to Hue, Saturation",
    ],
    methodology: [
      "1. Identify Zigbee channel and target light device address",
      "2. Capture on/off command: zbdump -c <channel> -w light_capture.pcap",
      "3. Filter for On/Off cluster in Wireshark: zbee_zcl_general.onoff",
      "4. Replay the captured on/off frame:",
      "   zbreplay -f light_capture.pcap -i 15",
      "5. Lights are more likely to accept replayed frames (less security than locks)",
      "6. Iterate: capture different commands (dim, color change) for full control",
    ],
    challenges: [
      "Frame counter enforcement may still prevent naive replay",
      "Some smart lights use group addressing — replay must target correct group",
      "Impact is limited (annoyance rather than security breach)",
    ],
    tools: ["killerbee (zbreplay)", "wireshark", "scapy-zigbee"],
  },
  sensor: {
    description: "Sensor replay — capture and replay sensor data to inject false readings or suppress alarms.",
    highValueFrames: [
      "ZCL Temperature Measurement cluster (0x0402) — Report Attributes",
      "ZCL IAS Zone cluster (0x0500) — Zone Status Change Notification (alarm/tamper)",
      "ZCL Occupancy Sensing cluster (0x0406) — Occupancy report",
      "Any ZCL Report Attributes frame from the target sensor",
    ],
    methodology: [
      "1. Identify sensor device and capture its periodic reports:",
      "   zbdump -c <channel> -w sensor_capture.pcap",
      "2. Identify report attribute frames in Wireshark",
      "3. For false data injection: replay old sensor readings to mask current conditions",
      "4. For alarm suppression: replay 'all clear' status from IAS Zone sensor",
      "5. For occupancy spoofing: replay occupied/unoccupied notifications",
      "6. Timing: replay during expected reporting interval to avoid detection",
      "7. Advanced: modify payload to inject arbitrary sensor values (requires NWK key)",
    ],
    challenges: [
      "Sensor reports are typically periodic — replayed data may conflict with expected timing",
      "Coordinator may correlate sensor reports with other data sources",
      "IAS Zone sensors often have tamper detection at application layer",
      "Frame counters will eventually expose the replay",
    ],
    tools: ["killerbee (zbreplay, zbdump)", "wireshark", "scapy-zigbee"],
  },
};

const zigbeeReplayGuide: ToolDef = {
  name: "zigbee_replay_guide",
  description:
    "Zigbee frame replay attack guide for specific device types. Returns high-value frames to capture, replay methodology, challenges, and required tools.",
  schema: {
    target_device_type: z
      .enum(["lock", "light", "sensor"])
      .describe("Type of Zigbee device to target with replay attack"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const targetType = args.target_device_type as string;

    const target = REPLAY_TARGETS[targetType];
    if (!target) {
      return text(`Unknown target type: ${targetType}. Use: lock, light, or sensor`);
    }

    return json({
      targetDeviceType: targetType,
      description: target.description,
      highValueFrames: target.highValueFrames,
      methodology: target.methodology,
      challenges: target.challenges,
      tools: target.tools,
      generalNotes: [
        "Frame counter enforcement is the primary defense against replay attacks",
        "If the network key is known, new frames can be crafted instead of replayed",
        "Replay attacks work best on devices with weak or no frame counter validation",
        "APS-level security adds an additional layer that must be defeated for replay",
      ],
      legalWarning: "Unauthorized replay attacks against IoT devices may violate computer fraud laws. Ensure proper authorization before testing.",
    });
  },
};

// ─── Export All Zigbee Tools ───

export const zigbeeTools: ToolDef[] = [
  zigbeeAnalyze,
  zigbeeSniffGuide,
  zigbeeKeyExtract,
  zigbeeReplayGuide,
];

import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ─── Standard GATT Service UUIDs ───

const STANDARD_SERVICES: Record<string, { name: string; risk: string; sensitiveChars: string[] }> = {
  "1800": { name: "Generic Access", risk: "low", sensitiveChars: ["Device Name", "Appearance"] },
  "1801": { name: "Generic Attribute", risk: "low", sensitiveChars: [] },
  "1802": { name: "Immediate Alert", risk: "low", sensitiveChars: ["Alert Level"] },
  "1803": { name: "Link Loss", risk: "low", sensitiveChars: ["Alert Level"] },
  "1804": { name: "Tx Power", risk: "low", sensitiveChars: ["Tx Power Level"] },
  "1805": { name: "Current Time", risk: "medium", sensitiveChars: ["Current Time", "Local Time Info"] },
  "180a": { name: "Device Information", risk: "medium", sensitiveChars: ["Manufacturer Name", "Model Number", "Serial Number", "Firmware Revision"] },
  "180d": { name: "Heart Rate", risk: "high", sensitiveChars: ["Heart Rate Measurement", "Body Sensor Location"] },
  "180f": { name: "Battery Service", risk: "low", sensitiveChars: ["Battery Level"] },
  "1810": { name: "Blood Pressure", risk: "high", sensitiveChars: ["Blood Pressure Measurement"] },
  "1811": { name: "Alert Notification", risk: "medium", sensitiveChars: ["New Alert", "Supported New Alert Category"] },
  "1812": { name: "Human Interface Device", risk: "critical", sensitiveChars: ["Report", "Report Map", "HID Information"] },
  "1813": { name: "Scan Parameters", risk: "low", sensitiveChars: [] },
  "1814": { name: "Running Speed and Cadence", risk: "low", sensitiveChars: ["RSC Measurement"] },
  "1816": { name: "Cycling Speed and Cadence", risk: "low", sensitiveChars: ["CSC Measurement"] },
  "1818": { name: "Cycling Power", risk: "low", sensitiveChars: ["Cycling Power Measurement"] },
  "181a": { name: "Environmental Sensing", risk: "medium", sensitiveChars: ["Temperature", "Humidity", "Pressure"] },
  "181c": { name: "User Data", risk: "critical", sensitiveChars: ["First Name", "Last Name", "Email Address", "Age", "Date of Birth", "Weight", "Height"] },
  "181d": { name: "Weight Scale", risk: "medium", sensitiveChars: ["Weight Measurement"] },
  "181e": { name: "Bond Management", risk: "high", sensitiveChars: ["Bond Management Control Point"] },
  "1822": { name: "Pulse Oximeter", risk: "high", sensitiveChars: ["PLX Spot-Check Measurement", "PLX Continuous Measurement"] },
};

// ─── Tool 1: ble_analyze_gatt ───

const bleAnalyzeGatt: ToolDef = {
  name: "ble_analyze_gatt",
  description:
    "Analyze BLE GATT service security. Takes a JSON array of discovered services with their characteristics and assesses security exposure, data sensitivity, writable characteristics, and missing authentication requirements.",
  schema: {
    services: z
      .string()
      .describe("JSON array of GATT services. Each object should have: uuid (string), characteristics (array of {uuid, properties, value?}). Properties can include: read, write, write-without-response, notify, indicate."),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const servicesRaw = args.services as string;

    let services: any[];
    try {
      services = JSON.parse(servicesRaw);
      if (!Array.isArray(services)) {
        return text("services must be a JSON array of GATT service objects.");
      }
    } catch {
      return text("Invalid JSON. Provide a JSON array of GATT services, e.g.: [{\"uuid\":\"180a\",\"characteristics\":[{\"uuid\":\"2a29\",\"properties\":[\"read\"]}]}]");
    }

    interface ServiceAssessment {
      uuid: string;
      name: string;
      risk: string;
      issues: string[];
      characteristics: {
        uuid: string;
        readable: boolean;
        writable: boolean;
        notifiable: boolean;
        sensitiveData: boolean;
        issues: string[];
      }[];
    }

    const assessments: ServiceAssessment[] = [];
    let overallRisk: "critical" | "high" | "medium" | "low" = "low";
    const riskOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

    for (const svc of services) {
      const uuid = (svc.uuid || "").toString().toLowerCase().replace("0x", "").replace(/-/g, "");
      const shortUuid = uuid.length <= 4 ? uuid.padStart(4, "0") : uuid;
      const knownService = STANDARD_SERVICES[shortUuid];

      const svcName = knownService?.name || `Custom Service (${svc.uuid})`;
      const svcRisk = knownService?.risk || "medium";

      if (riskOrder[svcRisk] > riskOrder[overallRisk]) {
        overallRisk = svcRisk as any;
      }

      const svcIssues: string[] = [];
      const charAssessments: ServiceAssessment["characteristics"] = [];

      if (!knownService) {
        svcIssues.push("Custom/vendor-specific service — often lacks security controls. Requires manual analysis.");
      }

      const chars = svc.characteristics || [];
      for (const ch of chars) {
        const props = (ch.properties || []).map((p: string) => p.toLowerCase());
        const readable = props.includes("read");
        const writable = props.includes("write") || props.includes("write-without-response");
        const notifiable = props.includes("notify") || props.includes("indicate");
        const sensitiveData = knownService?.sensitiveChars.length ? true : !knownService;

        const charIssues: string[] = [];

        if (writable && props.includes("write-without-response")) {
          charIssues.push("Write-without-response enabled — allows unauthenticated writes with no confirmation");
          if (riskOrder[overallRisk] < riskOrder["high"]) overallRisk = "high";
        }

        if (writable && !knownService) {
          charIssues.push("Writable custom characteristic — potential command injection or configuration tampering");
        }

        if (readable && sensitiveData) {
          charIssues.push("Readable sensitive data — potential information disclosure");
        }

        if (notifiable && sensitiveData) {
          charIssues.push("Notification enabled on sensitive data — passive data exfiltration possible");
        }

        // HID service special case
        if (shortUuid === "1812" && writable) {
          charIssues.push("CRITICAL: Writable HID characteristic — keystroke injection possible");
          overallRisk = "critical";
        }

        // Bond Management
        if (shortUuid === "181e" && writable) {
          charIssues.push("CRITICAL: Bond Management writable — can delete bonds and force re-pairing");
          overallRisk = "critical";
        }

        charAssessments.push({
          uuid: ch.uuid || "unknown",
          readable,
          writable,
          notifiable,
          sensitiveData,
          issues: charIssues,
        });
      }

      assessments.push({
        uuid: svc.uuid,
        name: svcName,
        risk: svcRisk,
        issues: svcIssues,
        characteristics: charAssessments,
      });
    }

    const totalChars = assessments.reduce((sum, s) => sum + s.characteristics.length, 0);
    const writableChars = assessments.reduce((sum, s) => sum + s.characteristics.filter((c) => c.writable).length, 0);
    const readableChars = assessments.reduce((sum, s) => sum + s.characteristics.filter((c) => c.readable).length, 0);
    const issueCount = assessments.reduce((sum, s) => sum + s.issues.length + s.characteristics.reduce((cs, c) => cs + c.issues.length, 0), 0);

    return json({
      summary: {
        totalServices: assessments.length,
        totalCharacteristics: totalChars,
        writableCharacteristics: writableChars,
        readableCharacteristics: readableChars,
        totalIssues: issueCount,
        overallRisk,
      },
      services: assessments,
      recommendations: [
        writableChars > 0 ? "Require authentication (pairing) for all writable characteristics" : null,
        readableChars > 0 ? "Implement authorization checks for sensitive readable characteristics" : null,
        "Remove unnecessary GATT services to reduce attack surface",
        "Use BLE Secure Connections for encrypted communication",
        "Implement application-layer encryption for sensitive data",
        "Disable Device Information Service if not required (reduces fingerprinting)",
      ].filter(Boolean),
    });
  },
};

// ─── Tool 2: ble_assess_pairing ───

const bleAssessPairing: ToolDef = {
  name: "ble_assess_pairing",
  description:
    "Assess BLE pairing security. Analyzes the pairing method and IO capabilities of a BLE device to determine vulnerability to MitM attacks, passive eavesdropping, and pairing downgrade attacks.",
  schema: {
    pairing_method: z
      .enum(["JustWorks", "Passkey", "OOB", "NumericComparison"])
      .describe("BLE pairing method in use"),
    io_capabilities: z
      .string()
      .describe("Device IO capabilities: NoInputNoOutput, DisplayOnly, DisplayYesNo, KeyboardOnly, KeyboardDisplay"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const method = args.pairing_method as string;
    const ioCaps = args.io_capabilities as string;

    interface PairingAssessment {
      mitmProtection: boolean;
      eavesdroppingRisk: string;
      pairingDowngradeRisk: string;
      keyStrength: string;
      issues: { severity: string; issue: string; recommendation: string }[];
    }

    const assessment: PairingAssessment = {
      mitmProtection: false,
      eavesdroppingRisk: "low",
      pairingDowngradeRisk: "low",
      keyStrength: "unknown",
      issues: [],
    };

    // IO capabilities mapping for pairing method selection
    const ioCapsNormalized = ioCaps.toLowerCase().replace(/[\s_-]/g, "");

    switch (method) {
      case "JustWorks":
        assessment.mitmProtection = false;
        assessment.eavesdroppingRisk = "high";
        assessment.keyStrength = "128-bit AES (but MitM vulnerable)";
        assessment.issues.push({
          severity: "high",
          issue: "JustWorks provides NO MitM protection. An active attacker can intercept the key exchange.",
          recommendation: "If device has any I/O capability, use Passkey Entry or Numeric Comparison instead.",
        });
        assessment.issues.push({
          severity: "medium",
          issue: "JustWorks pairing can be passively sniffed with BLE sniffer (Ubertooth, nRF52840) and keys can be derived.",
          recommendation: "Use LE Secure Connections (LESC) to upgrade to ECDH key exchange.",
        });
        if (ioCapsNormalized !== "noinputnooutput") {
          assessment.issues.push({
            severity: "high",
            issue: `Device has ${ioCaps} capabilities but uses JustWorks. A more secure pairing method is available.`,
            recommendation: "Switch to Passkey Entry (if keyboard available) or Numeric Comparison (if display+yes/no).",
          });
        }
        break;

      case "Passkey":
        assessment.mitmProtection = true;
        assessment.eavesdroppingRisk = "medium";
        assessment.keyStrength = "128-bit AES with Passkey verification";
        if (ioCapsNormalized === "displayonly") {
          assessment.issues.push({
            severity: "medium",
            issue: "DisplayOnly passkey: user sees passkey on one device and enters on the other. Shoulder-surfing risk.",
            recommendation: "Ensure passkey entry is performed in a private setting.",
          });
        }
        assessment.issues.push({
          severity: "low",
          issue: "Legacy Passkey Entry (without LESC) uses the passkey directly in key confirmation — offline brute-force of 6-digit passkey is feasible (1M combinations).",
          recommendation: "Use LE Secure Connections (LESC) for ECDH-based passkey confirmation.",
        });
        break;

      case "OOB":
        assessment.mitmProtection = true;
        assessment.eavesdroppingRisk = "low";
        assessment.keyStrength = "128-bit AES with OOB key material";
        assessment.issues.push({
          severity: "low",
          issue: "OOB security depends on the out-of-band channel. NFC tap is short-range and good. QR code can be photographed.",
          recommendation: "Use NFC for OOB data transfer. Ensure OOB channel is physically secure.",
        });
        break;

      case "NumericComparison":
        assessment.mitmProtection = true;
        assessment.eavesdroppingRisk = "low";
        assessment.keyStrength = "128-bit AES with ECDH + Numeric Comparison";
        assessment.issues.push({
          severity: "low",
          issue: "Numeric Comparison requires user to verify a 6-digit number on both devices. Users may skip verification.",
          recommendation: "Implement UI that makes numeric comparison prominent and easy. Log comparison failures.",
        });
        if (ioCapsNormalized === "noinputnooutput" || ioCapsNormalized === "displayonly") {
          assessment.issues.push({
            severity: "medium",
            issue: `Device with ${ioCaps} capabilities cannot perform Numeric Comparison properly — may fall back to JustWorks.`,
            recommendation: "Ensure both devices support DisplayYesNo or KeyboardDisplay for Numeric Comparison.",
          });
        }
        break;
    }

    // Common issues
    assessment.pairingDowngradeRisk = method === "JustWorks" ? "low" : "medium";
    if (method !== "JustWorks") {
      assessment.issues.push({
        severity: "medium",
        issue: "Pairing downgrade attack: attacker may force re-pairing and manipulate IO capabilities exchange to downgrade to JustWorks.",
        recommendation: "Implement Secure Connections Only mode. Reject connections that don't meet minimum security level.",
      });
    }

    const overallRisk = method === "JustWorks"
      ? "high"
      : method === "Passkey" ? "medium" : "low";

    return json({
      configuration: {
        pairingMethod: method,
        ioCapabilities: ioCaps,
      },
      assessment: {
        overallRisk,
        mitmProtection: assessment.mitmProtection,
        eavesdroppingRisk: assessment.eavesdroppingRisk,
        pairingDowngradeRisk: assessment.pairingDowngradeRisk,
        keyStrength: assessment.keyStrength,
      },
      issueCount: assessment.issues.length,
      issues: assessment.issues,
      pairingMethodRanking: [
        { method: "OOB (NFC)", security: "highest", mitmProtection: true, notes: "Best security if OOB channel is secure" },
        { method: "Numeric Comparison", security: "high", mitmProtection: true, notes: "Good if user verifies displayed number" },
        { method: "Passkey Entry", security: "medium", mitmProtection: true, notes: "6-digit passkey can be brute-forced without LESC" },
        { method: "JustWorks", security: "low", mitmProtection: false, notes: "No MitM protection, only for NoInput/NoOutput devices" },
      ],
      recommendations: [
        method === "JustWorks" ? "Switch to Passkey Entry, Numeric Comparison, or OOB pairing" : null,
        "Enable LE Secure Connections (LESC) for ECDH-based key exchange",
        "Implement Secure Connections Only mode to reject legacy pairing",
        "Set minimum encryption key size to 16 bytes",
        "Bond devices to avoid repeated pairing (reduces attack window)",
      ].filter(Boolean),
    });
  },
};

// ─── Tool 3: ble_sniff_guide ───

const bleSniffGuide: ToolDef = {
  name: "ble_sniff_guide",
  description:
    "Generate a guide for BLE traffic sniffing. Provides hardware setup instructions (Ubertooth One, nRF52840 Dongle), software configuration (Wireshark, BTLE tools), and Wireshark display filters for targeted BLE analysis.",
  schema: {
    target_address: z
      .string()
      .describe("Target BLE device address (XX:XX:XX:XX:XX:XX) to filter sniffed traffic"),
    protocol_version: z
      .string()
      .optional()
      .describe("BLE protocol version (e.g. '4.0', '4.2', '5.0') for version-specific guidance"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const targetAddress = (args.target_address as string).toUpperCase();
    const protoVersion = args.protocol_version as string | undefined;
    const versionNum = protoVersion ? parseFloat(protoVersion) : undefined;

    const addrFilter = targetAddress.toLowerCase().replace(/:/g, "");

    return json({
      target: targetAddress,
      protocolVersion: protoVersion || "auto-detect",

      hardwareOptions: [
        {
          name: "Ubertooth One",
          price: "$120",
          capabilities: ["BLE advertising channel sniffing", "Connection following", "Spectrum analysis"],
          limitations: versionNum && versionNum >= 5.0
            ? "Limited support for BLE 5.0+ features (2M PHY, Long Range, Extended Advertising)"
            : "Well-supported for BLE 4.x",
          setup: [
            "Install libubertooth: sudo apt install ubertooth",
            "Update firmware: ubertooth-dfu -d bluetooth_rxtx.dfu -r",
            `Follow BLE connection: ubertooth-btle -f -t ${targetAddress}`,
            `Pipe to Wireshark: ubertooth-btle -f -t ${targetAddress} -c capture.pcap`,
          ],
        },
        {
          name: "nRF52840 USB Dongle",
          price: "$10",
          capabilities: ["BLE 5.0 sniffing", "All PHY modes", "Wireshark integration via extcap"],
          limitations: "Requires nRF Sniffer firmware flash",
          setup: [
            "Flash nRF Sniffer firmware: nrfutil dfu usb-serial -p /dev/ttyACM0 -pkg sniffer_firmware.zip",
            "Install Wireshark extcap plugin: cp nrf_sniffer_ble.py ~/.config/wireshark/extcap/",
            "Open Wireshark > Capture > nRF Sniffer for Bluetooth LE",
            `Set device filter to: ${targetAddress}`,
          ],
        },
        {
          name: "TI CC2540 USB Dongle",
          price: "$30",
          capabilities: ["BLE 4.0 sniffing", "SmartRF Packet Sniffer integration"],
          limitations: "BLE 4.0 only, no 5.0 features",
          setup: [
            "Install TI SmartRF Packet Sniffer 2",
            "Flash CC2540 sniffer firmware",
            "Configure for BLE advertising channels (37, 38, 39)",
          ],
        },
      ],

      wiresharkFilters: {
        targetDevice: `btle.advertising_address == ${addrFilter} || btle.initiator_address == ${addrFilter}`,
        advertisingOnly: "btle.advertising_header",
        connectionRequests: "btle.advertising_header.pdu_type == 0x05",
        gattReadRequests: "btatt.opcode == 0x0a",
        gattWriteRequests: "btatt.opcode == 0x12 || btatt.opcode == 0x52",
        gattNotifications: "btatt.opcode == 0x1b",
        gattIndications: "btatt.opcode == 0x1d",
        smpPairing: "btsmp",
        llControlPdu: "btle.control",
        encryptionStart: "btle.control.opcode == 0x03",
        connectionUpdate: "btle.control.opcode == 0x00",
        allDataForTarget: `btle.advertising_address == ${addrFilter}`,
      },

      captureStrategy: [
        {
          phase: "1. Passive Reconnaissance",
          description: "Capture advertising packets to identify services, manufacturer data, and connection parameters",
          commands: [
            `ubertooth-btle -f -t ${targetAddress} -c adv_capture.pcap`,
            "tshark -r adv_capture.pcap -Y 'btle.advertising_header' -T fields -e btle.advertising_address -e btle.advertising_header.pdu_type",
          ],
        },
        {
          phase: "2. Connection Sniffing",
          description: "Follow a connection to capture GATT operations and data exchanges",
          commands: [
            `ubertooth-btle -f -t ${targetAddress} -c conn_capture.pcap`,
            "Monitor for LL_CONNECTION_REQ to get access address and connection parameters",
          ],
        },
        {
          phase: "3. Pairing Capture",
          description: "Capture BLE pairing exchange (SMP) to extract or derive keys",
          commands: [
            "Trigger re-pairing on target device (delete bond)",
            `Capture full SMP exchange: ubertooth-btle -f -t ${targetAddress} -c pairing.pcap`,
            "For JustWorks: crackle -i pairing.pcap (derive LTK from captured exchange)",
          ],
        },
        {
          phase: "4. Decryption (if keys obtained)",
          description: "Decrypt captured BLE traffic using recovered keys",
          commands: [
            "In Wireshark: Edit > Preferences > Protocols > BTLE > Add key",
            "crackle -i encrypted.pcap -o decrypted.pcap -l <LTK>",
          ],
        },
      ],

      keyRecoveryTools: [
        {
          tool: "crackle",
          description: "BLE encryption key cracker. Recovers LTK from captured JustWorks or Legacy Passkey pairing.",
          command: `crackle -i capture.pcap`,
          limitations: "Only works for legacy pairing (not LESC)",
        },
        {
          tool: "BTLE-Sniffer",
          description: "BLE link layer sniffer with connection following",
          command: `python btle_sniffer.py -d ${targetAddress}`,
          limitations: "Requires compatible SDR or Ubertooth",
        },
      ],

      notes: [
        versionNum && versionNum >= 5.0 ? "BLE 5.0+ uses longer PDUs, 2M PHY, and Coded PHY — ensure sniffer supports these modes" : null,
        "BLE advertising uses channels 37, 38, 39 (2402, 2426, 2480 MHz)",
        "Data channels use adaptive frequency hopping across 37 channels",
        "Encrypted connections require key recovery (crackle) or key provisioning for decryption",
        "LESC (LE Secure Connections) uses ECDH — keys cannot be derived from sniffed traffic",
      ].filter(Boolean),
    });
  },
};

// ─── Tool 4: ble_privacy_check ───

const blePrivacyCheck: ToolDef = {
  name: "ble_privacy_check",
  description:
    "Check BLE privacy features and assess tracking risk. Analyzes the address type (public, random static, resolvable private, non-resolvable private) and evaluates how easily the device can be tracked.",
  schema: {
    address_type: z
      .enum(["public", "random", "resolvable"])
      .describe("BLE address type: public (fixed OUI-based), random (static random), or resolvable (RPA, rotates periodically)"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const addressType = args.address_type as string;

    interface PrivacyAssessment {
      trackingRisk: "critical" | "high" | "medium" | "low";
      persistentTracking: boolean;
      crossSessionTracking: boolean;
      description: string;
      mitigations: string[];
      attackScenarios: string[];
    }

    let assessment: PrivacyAssessment;

    switch (addressType) {
      case "public":
        assessment = {
          trackingRisk: "critical",
          persistentTracking: true,
          crossSessionTracking: true,
          description:
            "Public address is a permanent, globally unique identifier based on the device's IEEE OUI. " +
            "It never changes and can be used for persistent tracking across locations and over time. " +
            "The OUI prefix reveals the device manufacturer.",
          mitigations: [
            "Enable BLE Privacy (LE Privacy 1.2+) to use Resolvable Private Addresses (RPA)",
            "If device firmware supports it, switch to random static address",
            "Disable BLE advertising when not actively connecting",
            "Use airplane mode in sensitive locations",
          ],
          attackScenarios: [
            "Deploy BLE scanners at multiple locations to track device movement patterns",
            "Correlate public address with user identity via initial observation",
            "Build historical movement profile from passive BLE scanning logs",
            "OUI lookup reveals manufacturer — aids device fingerprinting",
          ],
        };
        break;

      case "random":
        assessment = {
          trackingRisk: "medium",
          persistentTracking: true,
          crossSessionTracking: true,
          description:
            "Random static address is generated once (typically at boot) and persists for the device session. " +
            "It does not contain an OUI, making manufacturer identification harder. " +
            "However, it remains constant during the session, allowing intra-session tracking. " +
            "Some devices regenerate on every boot, others keep the same random address for the device lifetime.",
          mitigations: [
            "Ensure random address regenerates on each boot (not fixed for device lifetime)",
            "Upgrade to Resolvable Private Addresses (RPA) for periodic rotation",
            "Reduce advertising interval when not actively seeking connections",
          ],
          attackScenarios: [
            "Track device within a single session using the static random address",
            "If address persists across boots, long-term tracking is possible",
            "Correlate with other identifiers (GATT services, advertising data) for fingerprinting",
          ],
        };
        break;

      case "resolvable":
        assessment = {
          trackingRisk: "low",
          persistentTracking: false,
          crossSessionTracking: false,
          description:
            "Resolvable Private Address (RPA) rotates periodically (typically every 15 minutes). " +
            "Only bonded devices with the Identity Resolving Key (IRK) can resolve the address to the device's identity. " +
            "This is the recommended BLE privacy mode (LE Privacy 1.2+).",
          mitigations: [
            "Ensure RPA rotation interval is 15 minutes or less (default is recommended)",
            "Verify IRK distribution is limited to trusted bonded devices only",
            "Monitor for RPA rotation failures (some implementations have bugs)",
            "Consider using non-resolvable private addresses for broadcast-only scenarios",
          ],
          attackScenarios: [
            "If IRK is compromised, all RPAs can be resolved to the device identity",
            "Timing correlation: if RPA rotation is predictable, tracking across rotations may be possible",
            "Advertising payload fingerprinting: even with RPA, unique service UUIDs or manufacturer data can identify the device",
            "Some devices leak the public address in certain states (pairing, error conditions)",
          ],
        };
        break;

      default:
        return text(`Unknown address type '${addressType}'. Use: public, random, or resolvable.`);
    }

    return json({
      addressType,
      assessment: {
        trackingRisk: assessment.trackingRisk,
        persistentTracking: assessment.persistentTracking,
        crossSessionTracking: assessment.crossSessionTracking,
      },
      description: assessment.description,
      attackScenarios: assessment.attackScenarios,
      mitigations: assessment.mitigations,
      addressTypeComparison: [
        { type: "Public", trackingRisk: "critical", rotation: "never", manufacturerExposed: true, blePrivacy: false },
        { type: "Random Static", trackingRisk: "medium", rotation: "per-boot (varies)", manufacturerExposed: false, blePrivacy: false },
        { type: "Resolvable Private (RPA)", trackingRisk: "low", rotation: "every ~15 min", manufacturerExposed: false, blePrivacy: true },
        { type: "Non-Resolvable Private", trackingRisk: "low", rotation: "per-connection", manufacturerExposed: false, blePrivacy: true },
      ],
      recommendations: [
        assessment.trackingRisk === "critical" ? "CRITICAL: Enable BLE Privacy immediately — device is persistently trackable" : null,
        assessment.trackingRisk === "medium" ? "Upgrade to Resolvable Private Addresses for better privacy" : null,
        "Audit advertising payload for unique identifiers (custom UUIDs, manufacturer data)",
        "Test RPA rotation by monitoring address changes over 30+ minutes",
        "Verify that address rotation occurs during both advertising and connected states",
      ].filter(Boolean),
    });
  },
};

// ─── Export All BLE Analysis Tools ───

export const bleAnalysisTools: ToolDef[] = [
  bleAnalyzeGatt,
  bleAssessPairing,
  bleSniffGuide,
  blePrivacyCheck,
];

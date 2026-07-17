import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { BLUETOOTH_ATTACKS } from "../knowledge/index.js";
import { WIRELESS_CVES } from "../knowledge/index.js";

// ─── Helpers ───

interface ParsedBtDevice {
  address: string;
  name: string;
  deviceClass: string;
  rssi: number;
  type: string;
}

function parseDeviceLine(line: string): ParsedBtDevice | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  // Format: XX:XX:XX:XX:XX:XX  Name  Class  RSSI
  const addrMatch = trimmed.match(/([0-9A-Fa-f]{2}(?::[0-9A-Fa-f]{2}){5})/);
  if (!addrMatch) return null;

  const address = addrMatch[1].toUpperCase();
  const rest = trimmed.substring(trimmed.indexOf(address) + address.length).trim();

  // Try to parse RSSI (negative number)
  const rssiMatch = rest.match(/-?\d+\s*(?:dBm)?/);
  const rssi = rssiMatch ? parseInt(rssiMatch[0], 10) : -999;

  // Try to parse device class (0x...)
  const classMatch = rest.match(/0x[0-9A-Fa-f]+/);
  const deviceClass = classMatch ? classMatch[0] : "unknown";

  // Name is typically the first non-address, non-class, non-rssi part
  let name = rest
    .replace(/-?\d+\s*(?:dBm)?/, "")
    .replace(/0x[0-9A-Fa-f]+/, "")
    .trim()
    .replace(/\s+/g, " ") || "unknown";

  // Determine type from OUI prefix
  const oui = address.substring(0, 8);
  const type = determineBtType(oui, deviceClass);

  return { address, name, deviceClass, rssi, type };
}

function determineBtType(oui: string, deviceClass: string): string {
  const classNum = parseInt(deviceClass, 16);
  if (isNaN(classNum)) return "unknown";

  const majorClass = (classNum >> 8) & 0x1f;
  switch (majorClass) {
    case 1: return "Computer";
    case 2: return "Phone";
    case 3: return "LAN/Network Access Point";
    case 4: return "Audio/Video";
    case 5: return "Peripheral";
    case 6: return "Imaging";
    case 7: return "Wearable";
    case 8: return "Toy";
    case 9: return "Health";
    default: return "Miscellaneous";
  }
}

function parseJsonDevices(data: unknown[]): ParsedBtDevice[] {
  return data.map((d: any) => ({
    address: (d.address || d.addr || d.mac || "").toUpperCase(),
    name: d.name || d.device_name || "unknown",
    deviceClass: d.class || d.device_class || d.cod || "unknown",
    rssi: d.rssi ?? d.signal ?? -999,
    type: d.type || determineBtType("", d.class || d.device_class || d.cod || ""),
  }));
}

// ─── BT version vulnerability mapping ───

interface BtVersionInfo {
  version: string;
  fullName: string;
  year: number;
  features: string[];
  vulnerabilities: string[];
}

const BT_VERSIONS: Record<string, BtVersionInfo> = {
  "1.0": { version: "1.0", fullName: "Bluetooth 1.0", year: 1999, features: ["BR (1 Mbps)"], vulnerabilities: ["No encryption enforcement", "BlueBorne (if unpatched)", "BlueSnarf", "BlueBug"] },
  "1.1": { version: "1.1", fullName: "Bluetooth 1.1", year: 2002, features: ["BR (1 Mbps)", "RSSI"], vulnerabilities: ["No encryption enforcement", "BlueBorne (if unpatched)", "BlueSnarf", "BlueBug"] },
  "1.2": { version: "1.2", fullName: "Bluetooth 1.2", year: 2003, features: ["BR (1 Mbps)", "AFH", "Faster connection"], vulnerabilities: ["BlueBorne (if unpatched)", "BlueSnarf", "PIN cracking"] },
  "2.0": { version: "2.0", fullName: "Bluetooth 2.0 + EDR", year: 2004, features: ["EDR (3 Mbps)", "SSP preparation"], vulnerabilities: ["BlueBorne (if unpatched)", "KNOB (pre-patch)", "BIAS", "Pairing downgrade"] },
  "2.1": { version: "2.1", fullName: "Bluetooth 2.1 + EDR", year: 2007, features: ["SSP", "EDR (3 Mbps)", "Sniff Subrating"], vulnerabilities: ["BlueBorne (if unpatched)", "KNOB", "BIAS", "SSP JustWorks MitM"] },
  "3.0": { version: "3.0", fullName: "Bluetooth 3.0 + HS", year: 2009, features: ["High Speed (24 Mbps via WiFi)", "AMP"], vulnerabilities: ["BlueBorne (if unpatched)", "KNOB", "BIAS"] },
  "4.0": { version: "4.0", fullName: "Bluetooth 4.0 (BLE)", year: 2010, features: ["BLE", "Low Energy", "GATT/ATT"], vulnerabilities: ["BlueBorne (if unpatched)", "KNOB", "BLURtooth (CTKD)", "BLE JustWorks", "BLE eavesdropping", "SweynTooth"] },
  "4.1": { version: "4.1", fullName: "Bluetooth 4.1", year: 2013, features: ["BLE + BR/EDR dual", "LE L2CAP", "LE Link Layer topology"], vulnerabilities: ["BlueBorne (if unpatched)", "KNOB", "BLURtooth", "SweynTooth"] },
  "4.2": { version: "4.2", fullName: "Bluetooth 4.2", year: 2014, features: ["LE Secure Connections", "LE Data Length Extension", "LE Privacy 1.2"], vulnerabilities: ["BlueBorne (if unpatched)", "KNOB", "BLURtooth", "BLUFFS"] },
  "5.0": { version: "5.0", fullName: "Bluetooth 5.0", year: 2016, features: ["2x speed (2 Mbps)", "4x range", "8x broadcast"], vulnerabilities: ["KNOB (pre-patch)", "BLURtooth", "BLUFFS", "SweynTooth (some SoCs)"] },
  "5.1": { version: "5.1", fullName: "Bluetooth 5.1", year: 2019, features: ["Direction Finding (AoA/AoD)", "GATT Caching", "Advertising Channel Index"], vulnerabilities: ["BLUFFS (pre-patch)", "Implementation-specific bugs"] },
  "5.2": { version: "5.2", fullName: "Bluetooth 5.2", year: 2020, features: ["LE Audio", "EATT", "LE Isochronous Channels", "LE Power Control"], vulnerabilities: ["BLUFFS (pre-patch)", "Implementation-specific bugs"] },
  "5.3": { version: "5.3", fullName: "Bluetooth 5.3", year: 2021, features: ["Channel Classification Enhancement", "Periodic Advertising Enhancement", "Connection Subrating"], vulnerabilities: ["BLUFFS (pre-patch)", "Implementation-specific bugs"] },
  "5.4": { version: "5.4", fullName: "Bluetooth 5.4", year: 2023, features: ["PAwR (Periodic Advertising with Responses)", "Encrypted Advertising"], vulnerabilities: ["BLUFFS (if unpatched)", "Implementation-specific bugs"] },
};

// ─── Tool 1: bt_scan_devices ───

const btScanDevices: ToolDef = {
  name: "bt_scan_devices",
  description:
    "Parse Bluetooth device scan results. Accepts raw text output from hcitools/bluetoothctl/btscanner or JSON array of device objects. Returns parsed device list with addresses, names, device classes, and RSSI values.",
  schema: {
    scan_data: z
      .string()
      .describe("Raw scan output text (hcitool, bluetoothctl, btscanner) or JSON array of device objects with address/name/class/rssi fields"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const scanData = args.scan_data as string;
    let devices: ParsedBtDevice[];

    // Try JSON parse first
    try {
      const parsed = JSON.parse(scanData);
      if (Array.isArray(parsed)) {
        devices = parseJsonDevices(parsed);
      } else {
        devices = [];
      }
    } catch {
      // Parse as text lines
      const lines = scanData.split("\n");
      devices = lines.map(parseDeviceLine).filter((d): d is ParsedBtDevice => d !== null);
    }

    if (devices.length === 0) {
      return text("No Bluetooth devices found in the provided scan data. Ensure the format includes MAC addresses (XX:XX:XX:XX:XX:XX).");
    }

    const summary = {
      totalDevices: devices.length,
      byType: {} as Record<string, number>,
      strongSignal: devices.filter((d) => d.rssi > -60).length,
      devices,
    };

    for (const d of devices) {
      summary.byType[d.type] = (summary.byType[d.type] || 0) + 1;
    }

    return json(summary);
  },
};

// ─── Tool 2: bt_enumerate_services ───

const btEnumerateServices: ToolDef = {
  name: "bt_enumerate_services",
  description:
    "Enumerate Bluetooth services on a device. For BR/EDR, returns SDP service records. For BLE, returns GATT services and characteristics. Provides commands for enumeration tools.",
  schema: {
    device_address: z
      .string()
      .describe("Target Bluetooth device address (XX:XX:XX:XX:XX:XX)"),
    protocol: z
      .enum(["BR/EDR", "BLE"])
      .describe("Bluetooth protocol type: BR/EDR for classic Bluetooth, BLE for Bluetooth Low Energy"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const address = (args.device_address as string).toUpperCase();
    const protocol = args.protocol as "BR/EDR" | "BLE";

    if (protocol === "BR/EDR") {
      return json({
        target: address,
        protocol: "BR/EDR",
        enumerationMethod: "SDP (Service Discovery Protocol)",
        commonServices: [
          { uuid: "0x1101", name: "Serial Port (SPP)", risk: "high", notes: "Can be used for data exfiltration or command injection" },
          { uuid: "0x1102", name: "LAN Access Using PPP", risk: "high", notes: "Network access through Bluetooth" },
          { uuid: "0x1103", name: "Dialup Networking", risk: "medium", notes: "Modem access" },
          { uuid: "0x1104", name: "IrMC Sync", risk: "low", notes: "Contact/calendar sync" },
          { uuid: "0x1105", name: "OBEX Object Push", risk: "high", notes: "File transfer — BlueSnarf vector" },
          { uuid: "0x1106", name: "OBEX File Transfer", risk: "high", notes: "Full file system access — BlueBug vector" },
          { uuid: "0x1112", name: "Headset", risk: "low", notes: "Audio headset service" },
          { uuid: "0x1115", name: "PANU", risk: "medium", notes: "Personal Area Networking" },
          { uuid: "0x1116", name: "NAP", risk: "medium", notes: "Network Access Point" },
          { uuid: "0x111E", name: "Handsfree", risk: "low", notes: "Hands-free profile" },
          { uuid: "0x111F", name: "Handsfree Audio Gateway", risk: "medium", notes: "Audio gateway — potential eavesdropping" },
          { uuid: "0x112F", name: "PBAP", risk: "high", notes: "Phonebook access — contact exfiltration" },
          { uuid: "0x1132", name: "MAP", risk: "high", notes: "Message access — SMS exfiltration" },
        ],
        commands: [
          { tool: "sdptool", command: `sdptool browse ${address}`, description: "Browse all SDP records" },
          { tool: "sdptool", command: `sdptool search --bdaddr ${address} SP`, description: "Search for Serial Port service" },
          { tool: "bluetoothctl", command: `bluetoothctl info ${address}`, description: "Get device info and service UUIDs" },
          { tool: "bluescan", command: `bluescan -m sdp ${address}`, description: "Comprehensive SDP scan" },
          { tool: "bettercap", command: `bt.enum ${address}`, description: "Enumerate BT services with bettercap" },
        ],
        securityNotes: [
          "OBEX services without authentication allow BlueSnarf attacks",
          "SPP services can be abused for AT command injection (BlueBug)",
          "PBAP/MAP services can leak contacts and messages",
        ],
      });
    }

    // BLE
    return json({
      target: address,
      protocol: "BLE",
      enumerationMethod: "GATT (Generic Attribute Profile)",
      standardServices: [
        { uuid: "0x1800", name: "Generic Access", risk: "low", characteristics: ["Device Name", "Appearance", "Peripheral Privacy Flag"] },
        { uuid: "0x1801", name: "Generic Attribute", risk: "low", characteristics: ["Service Changed"] },
        { uuid: "0x180A", name: "Device Information", risk: "medium", characteristics: ["Manufacturer", "Model", "Serial Number", "Hardware/Software/Firmware Rev"], notes: "Reveals device fingerprint" },
        { uuid: "0x180F", name: "Battery Service", risk: "low", characteristics: ["Battery Level"] },
        { uuid: "0x1811", name: "Alert Notification", risk: "medium", characteristics: ["New Alert", "Alert Category"], notes: "May leak notification data" },
        { uuid: "0x1812", name: "Human Interface Device", risk: "high", characteristics: ["Report", "Report Map"], notes: "HID injection possible" },
        { uuid: "0x1816", name: "Cycling Speed and Cadence", risk: "low", characteristics: ["CSC Measurement", "CSC Feature"] },
        { uuid: "0x181C", name: "User Data", risk: "high", characteristics: ["First Name", "Email", "Age", "Weight"], notes: "PII exposure" },
      ],
      commands: [
        { tool: "gatttool", command: `gatttool -b ${address} --primary`, description: "Discover primary GATT services" },
        { tool: "gatttool", command: `gatttool -b ${address} --characteristics`, description: "List all characteristics" },
        { tool: "gatttool", command: `gatttool -b ${address} --char-desc`, description: "List characteristic descriptors" },
        { tool: "bettercap", command: `ble.enum ${address}`, description: "Full BLE enumeration" },
        { tool: "nrf-connect", command: "Connect > Discover Services", description: "GUI-based GATT exploration (mobile)" },
        { tool: "bleah", command: `bleah -b ${address} -e`, description: "Enumerate BLE device services" },
      ],
      securityNotes: [
        "Check for writable characteristics without authentication",
        "Look for Device Information Service to fingerprint the device",
        "Custom vendor services (128-bit UUIDs) often lack security controls",
        "Notification/indication subscriptions may leak data passively",
      ],
    });
  },
};

// ─── Tool 3: bt_check_security ───

const btCheckSecurity: ToolDef = {
  name: "bt_check_security",
  description:
    "Check Bluetooth security configuration and identify weaknesses. Analyzes Bluetooth version, Secure Connections setting, and pairing mode to produce a security assessment with risk ratings and recommendations.",
  schema: {
    bt_version: z
      .string()
      .describe("Bluetooth version (e.g. '4.2', '5.0', '5.3')"),
    secure_connections: z
      .boolean()
      .describe("Whether Secure Connections (SC) mode is enabled"),
    pairing_mode: z
      .string()
      .describe("Pairing mode in use: JustWorks, Passkey, NumericComparison, OOB, Legacy, or None"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const version = args.bt_version as string;
    const secureConnections = args.secure_connections as boolean;
    const pairingMode = args.pairing_mode as string;

    const issues: { severity: string; issue: string; recommendation: string }[] = [];
    let overallRisk = "low" as string;

    // Version assessment
    const versionNum = parseFloat(version);
    if (versionNum < 4.2) {
      issues.push({
        severity: "critical",
        issue: `Bluetooth ${version} lacks LE Secure Connections and modern key derivation`,
        recommendation: "Upgrade to Bluetooth 4.2+ hardware with LE Secure Connections support",
      });
      overallRisk = "critical";
    } else if (versionNum < 5.1) {
      issues.push({
        severity: "high",
        issue: `Bluetooth ${version} is vulnerable to BLUFFS (CVE-2023-24023) and may be affected by BLURtooth (CVE-2020-15802)`,
        recommendation: "Apply firmware patches for BLUFFS and BLURtooth. Consider upgrading to Bluetooth 5.1+",
      });
      if (overallRisk !== "critical") overallRisk = "high";
    }

    // Secure Connections assessment
    if (!secureConnections) {
      issues.push({
        severity: "high",
        issue: "Secure Connections (SC) mode is disabled. Legacy pairing uses weaker E1/E3 key generation vulnerable to brute-force.",
        recommendation: "Enable Secure Connections mode. SC uses ECDH P-256 for key exchange and AES-CCM for encryption.",
      });
      if (overallRisk === "low" || overallRisk === "medium") overallRisk = "high";
    }

    // Pairing mode assessment
    const mode = pairingMode.toLowerCase().replace(/\s+/g, "");
    switch (mode) {
      case "justworks":
        issues.push({
          severity: "high",
          issue: "JustWorks pairing provides no MitM protection. An attacker can intercept the pairing process.",
          recommendation: "Use Passkey Entry or Numeric Comparison for MitM protection. JustWorks is only acceptable for devices with no I/O capabilities.",
        });
        if (overallRisk === "low" || overallRisk === "medium") overallRisk = "high";
        break;
      case "legacy":
      case "pin":
        issues.push({
          severity: "critical",
          issue: "Legacy PIN-based pairing uses weak E22 key generation. 4-digit PINs are trivially brute-forced.",
          recommendation: "Upgrade to SSP-based pairing (Bluetooth 2.1+). Use Passkey Entry with 6-digit codes at minimum.",
        });
        overallRisk = "critical";
        break;
      case "none":
        issues.push({
          severity: "critical",
          issue: "No pairing/authentication configured. Any device can connect.",
          recommendation: "Enable pairing with at minimum JustWorks, preferably Passkey Entry or Numeric Comparison.",
        });
        overallRisk = "critical";
        break;
      case "passkey":
      case "passkeyentry":
        if (secureConnections) {
          issues.push({
            severity: "low",
            issue: "Passkey Entry with Secure Connections is strong but passkey can be observed during entry.",
            recommendation: "Ensure passkey is entered in a private setting. Consider OOB pairing for highest security.",
          });
        } else {
          issues.push({
            severity: "medium",
            issue: "Passkey Entry without Secure Connections is weaker — uses legacy key derivation.",
            recommendation: "Enable Secure Connections mode alongside Passkey Entry.",
          });
          if (overallRisk === "low") overallRisk = "medium";
        }
        break;
      case "numericcomparison":
        issues.push({
          severity: "low",
          issue: "Numeric Comparison provides good MitM protection when users actually verify the displayed number.",
          recommendation: "Ensure users are trained to verify numeric comparison values and reject mismatches.",
        });
        break;
      case "oob":
        issues.push({
          severity: "low",
          issue: "OOB pairing provides the strongest protection when the OOB channel is secure (e.g., NFC tap).",
          recommendation: "Ensure the OOB channel itself is secure and short-range.",
        });
        break;
    }

    // KNOB attack check
    if (versionNum >= 2.0 && versionNum < 5.1) {
      issues.push({
        severity: "medium",
        issue: "KNOB attack (CVE-2019-9506): Encryption key length can be negotiated down to 1 byte if firmware is unpatched.",
        recommendation: "Apply KNOB patch. Enforce minimum encryption key length of 7 bytes in Bluetooth controller.",
      });
    }

    // Applicable attacks from knowledge base
    const applicableAttacks = BLUETOOTH_ATTACKS.filter((a) => {
      if (versionNum >= 4.0 && a.protocols.includes("BLE")) return true;
      if (a.protocols.includes("BR/EDR")) return true;
      return false;
    }).map((a) => ({
      id: a.id,
      name: a.name,
      severity: a.severity,
      cves: a.cves,
      mitigations: a.mitigations,
    }));

    return json({
      configuration: {
        btVersion: version,
        secureConnections,
        pairingMode,
      },
      overallRisk,
      issueCount: issues.length,
      issues,
      applicableAttacks,
      recommendations: [
        versionNum < 5.1 ? "Upgrade to Bluetooth 5.1+ for latest security features" : null,
        !secureConnections ? "Enable Secure Connections (SC) mode" : null,
        mode === "justworks" ? "Switch to Passkey Entry or Numeric Comparison pairing" : null,
        "Keep Bluetooth firmware up to date",
        "Disable Bluetooth when not in use",
        "Use Bluetooth only in trusted environments",
      ].filter(Boolean),
    });
  },
};

// ─── Tool 4: bt_ble_scan ───

const btBleScan: ToolDef = {
  name: "bt_ble_scan",
  description:
    "Parse BLE advertisement data from scan output. Extracts device addresses, advertised service UUIDs, manufacturer-specific data, TX power levels, and advertisement types for security analysis.",
  schema: {
    adv_data: z
      .string()
      .describe("Raw BLE advertisement scan output text (from hcitool lescan, bettercap, nRF Connect, or similar)"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const advData = args.adv_data as string;
    const lines = advData.split("\n");

    interface BleDevice {
      address: string;
      name: string;
      rssi: number;
      addressType: string;
      serviceUuids: string[];
      manufacturerData: string;
      txPower: number | null;
      connectable: boolean;
      trackingRisk: string;
    }

    const devices = new Map<string, BleDevice>();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      // Extract BLE address
      const addrMatch = trimmed.match(/([0-9A-Fa-f]{2}(?::[0-9A-Fa-f]{2}){5})/);
      if (!addrMatch) continue;

      const address = addrMatch[1].toUpperCase();

      if (!devices.has(address)) {
        devices.set(address, {
          address,
          name: "unknown",
          rssi: -999,
          addressType: "unknown",
          serviceUuids: [],
          manufacturerData: "",
          txPower: null,
          connectable: true,
          trackingRisk: "unknown",
        });
      }

      const device = devices.get(address)!;

      // Parse name
      const nameMatch = trimmed.match(/(?:name|device)[:\s=]+["']?([^"'\n,;]+)/i);
      if (nameMatch && device.name === "unknown") {
        device.name = nameMatch[1].trim();
      }

      // Parse RSSI
      const rssiMatch = trimmed.match(/(?:rssi|signal)[:\s=]+(-?\d+)/i);
      if (rssiMatch) {
        device.rssi = parseInt(rssiMatch[1], 10);
      }

      // Parse address type
      if (/random/i.test(trimmed)) device.addressType = "random";
      else if (/public/i.test(trimmed)) device.addressType = "public";
      else if (/resolvable/i.test(trimmed)) device.addressType = "resolvable";

      // Parse UUIDs
      const uuidMatches = trimmed.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi);
      if (uuidMatches) {
        for (const uuid of uuidMatches) {
          if (!device.serviceUuids.includes(uuid.toLowerCase())) {
            device.serviceUuids.push(uuid.toLowerCase());
          }
        }
      }

      // Parse short UUIDs (0x1800 format)
      const shortUuidMatches = trimmed.match(/0x[0-9A-Fa-f]{4}/g);
      if (shortUuidMatches) {
        for (const uuid of shortUuidMatches) {
          if (!device.serviceUuids.includes(uuid.toLowerCase())) {
            device.serviceUuids.push(uuid.toLowerCase());
          }
        }
      }

      // Parse manufacturer data
      const mfgMatch = trimmed.match(/(?:manufacturer|mfg)[:\s=]+([0-9A-Fa-f\s]+)/i);
      if (mfgMatch) {
        device.manufacturerData = mfgMatch[1].trim();
      }

      // Parse TX Power
      const txMatch = trimmed.match(/(?:tx\s*power)[:\s=]+(-?\d+)/i);
      if (txMatch) {
        device.txPower = parseInt(txMatch[1], 10);
      }

      // Connectable
      if (/non-?connectable/i.test(trimmed)) {
        device.connectable = false;
      }

      // Tracking risk assessment
      if (device.addressType === "public") {
        device.trackingRisk = "high — static public address can be used for persistent tracking";
      } else if (device.addressType === "random") {
        device.trackingRisk = "low — random address rotates";
      } else if (device.addressType === "resolvable") {
        device.trackingRisk = "medium — resolvable by paired devices but opaque to others";
      }
    }

    const deviceList = Array.from(devices.values());

    if (deviceList.length === 0) {
      return text("No BLE devices found in the provided advertisement data. Ensure the format includes MAC addresses.");
    }

    const publicAddresses = deviceList.filter((d) => d.addressType === "public").length;
    const connectableDevices = deviceList.filter((d) => d.connectable).length;

    return json({
      totalDevices: deviceList.length,
      connectableDevices,
      publicAddresses,
      trackingWarning: publicAddresses > 0
        ? `${publicAddresses} device(s) use public addresses and can be tracked persistently`
        : "All devices use random/resolvable addresses",
      devices: deviceList,
      securityNotes: [
        connectableDevices > 0 ? `${connectableDevices} connectable device(s) — potential GATT enumeration targets` : null,
        publicAddresses > 0 ? `${publicAddresses} device(s) with public addresses — trackable` : null,
        "Use bt_enumerate_services to explore GATT services on connectable devices",
        "Use ble_analyze_gatt for security assessment of discovered services",
      ].filter(Boolean),
    });
  },
};

// ─── Tool 5: bt_identify_version ───

const btIdentifyVersion: ToolDef = {
  name: "bt_identify_version",
  description:
    "Identify Bluetooth version and capabilities from device information. Analyzes LMP version, supported features, and maps to known vulnerabilities from the knowledge base.",
  schema: {
    device_info: z
      .string()
      .describe("Device info string containing LMP version, features, or Bluetooth version (e.g. 'LMP Version: 9 (5.0)', 'BT 5.2', or hciconfig output)"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const deviceInfo = args.device_info as string;

    // Map LMP versions to BT versions
    const lmpToBt: Record<number, string> = {
      0: "1.0b", 1: "1.1", 2: "1.2", 3: "2.0", 4: "2.1", 5: "3.0",
      6: "4.0", 7: "4.1", 8: "4.2", 9: "5.0", 10: "5.1", 11: "5.2",
      12: "5.3", 13: "5.4",
    };

    let detectedVersion: string | null = null;

    // Try to extract LMP version number
    const lmpMatch = deviceInfo.match(/LMP\s*(?:Version|ver)[:\s]*(\d+)/i);
    if (lmpMatch) {
      const lmpVer = parseInt(lmpMatch[1], 10);
      detectedVersion = lmpToBt[lmpVer] || null;
    }

    // Try direct BT version reference
    if (!detectedVersion) {
      const btMatch = deviceInfo.match(/(?:Bluetooth|BT|bt)\s*(\d+\.\d+)/i);
      if (btMatch) {
        detectedVersion = btMatch[1];
      }
    }

    // Try version in parentheses (common in hciconfig)
    if (!detectedVersion) {
      const parenMatch = deviceInfo.match(/\((\d+\.\d+)\)/);
      if (parenMatch) {
        detectedVersion = parenMatch[1];
      }
    }

    if (!detectedVersion) {
      return text(
        "Could not identify Bluetooth version from the provided device info. " +
        "Please provide LMP version number (e.g., 'LMP Version: 9') or Bluetooth version (e.g., 'BT 5.0'). " +
        "You can get this from: hciconfig -a, bluetoothctl info, or btmgmt info."
      );
    }

    // Normalize version
    const normalizedVersion = detectedVersion.replace(/^(\d+\.\d+).*/, "$1");
    const versionInfo = BT_VERSIONS[normalizedVersion];

    // Feature detection from device info
    const detectedFeatures: string[] = [];
    if (/secure.?connections/i.test(deviceInfo)) detectedFeatures.push("Secure Connections");
    if (/le.*privacy|privacy.*le/i.test(deviceInfo)) detectedFeatures.push("LE Privacy");
    if (/extended.*adv/i.test(deviceInfo)) detectedFeatures.push("Extended Advertising");
    if (/2m.*phy|le.*2m/i.test(deviceInfo)) detectedFeatures.push("LE 2M PHY");
    if (/coded.*phy/i.test(deviceInfo)) detectedFeatures.push("LE Coded PHY");
    if (/cte|direction.?finding/i.test(deviceInfo)) detectedFeatures.push("Direction Finding (AoA/AoD)");
    if (/eatt/i.test(deviceInfo)) detectedFeatures.push("EATT");
    if (/isoc|le.*audio/i.test(deviceInfo)) detectedFeatures.push("LE Audio / Isochronous Channels");

    // Look up applicable CVEs
    const applicableCves = WIRELESS_CVES.filter(
      (cve) => cve.domain === "bluetooth"
    ).map((cve) => ({
      cveId: cve.cveId,
      name: cve.name,
      severity: cve.severity,
      cvss: cve.cvss,
      patchAvailable: cve.patchAvailable,
      description: cve.description,
    }));

    return json({
      detectedVersion: normalizedVersion,
      fullName: versionInfo?.fullName || `Bluetooth ${normalizedVersion}`,
      releaseYear: versionInfo?.year || "unknown",
      standardFeatures: versionInfo?.features || [],
      detectedFeatures,
      knownVulnerabilities: versionInfo?.vulnerabilities || [],
      applicableCves,
      securityAssessment: {
        overallRisk: parseFloat(normalizedVersion) < 4.2 ? "critical" : parseFloat(normalizedVersion) < 5.1 ? "high" : "medium",
        supportsSecureConnections: parseFloat(normalizedVersion) >= 4.2,
        supportsLePrivacy: parseFloat(normalizedVersion) >= 4.2,
        supportsDirectionFinding: parseFloat(normalizedVersion) >= 5.1,
        supportsEncryptedAdvertising: parseFloat(normalizedVersion) >= 5.4,
      },
      recommendations: [
        parseFloat(normalizedVersion) < 5.1 ? "Upgrade to Bluetooth 5.1+ for latest security features" : null,
        "Ensure Secure Connections mode is enabled",
        "Apply all available firmware patches",
        "Disable unused Bluetooth profiles and services",
        "Monitor for BlueBorne and BLUFFS patches specific to your chipset",
      ].filter(Boolean),
    });
  },
};

// ─── Export All Bluetooth Recon Tools ───

export const bluetoothReconTools: ToolDef[] = [
  btScanDevices,
  btEnumerateServices,
  btCheckSecurity,
  btBleScan,
  btIdentifyVersion,
];

import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { bluetoothReconTools } from "../providers/bluetooth-recon.js";

// ─── Resolve individual tools by name ───

const toolMap = new Map(bluetoothReconTools.map((t) => [t.name, t]));
const scanDevices = toolMap.get("bt_scan_devices")!;
const enumerateServices = toolMap.get("bt_enumerate_services")!;
const checkSecurity = toolMap.get("bt_check_security")!;
const bleScan = toolMap.get("bt_ble_scan")!;
const identifyVersion = toolMap.get("bt_identify_version")!;

// ─── Composite Tool ───

const scanBluetooth: ToolDef = {
  name: "scan_bluetooth",
  description:
    "Bluetooth device reconnaissance — scan devices, enumerate services, analyze BLE GATT, check security configuration, identify Bluetooth version and vulnerabilities.",
  schema: {
    mode: z
      .enum(["scan_devices", "enumerate_services", "check_security", "ble_scan", "identify_version"])
      .describe("Operation mode: scan_devices (parse scan results), enumerate_services (SDP/GATT enum), check_security (config assessment), ble_scan (BLE advertisement parsing), identify_version (version + vuln mapping)"),

    // scan_devices params
    scan_data: z
      .string()
      .optional()
      .describe("[scan_devices, ble_scan] Raw scan output text or JSON array of device objects"),

    // enumerate_services params
    device_address: z
      .string()
      .optional()
      .describe("[enumerate_services] Target Bluetooth device address (XX:XX:XX:XX:XX:XX)"),
    protocol: z
      .enum(["BR/EDR", "BLE"])
      .optional()
      .describe("[enumerate_services] Bluetooth protocol type"),

    // check_security params
    bt_version: z
      .string()
      .optional()
      .describe("[check_security, identify_version] Bluetooth version (e.g. '4.2', '5.0')"),
    secure_connections: z
      .boolean()
      .optional()
      .describe("[check_security] Whether Secure Connections mode is enabled"),
    pairing_mode: z
      .string()
      .optional()
      .describe("[check_security] Pairing mode: JustWorks, Passkey, NumericComparison, OOB, Legacy, None"),

    // identify_version params
    device_info: z
      .string()
      .optional()
      .describe("[identify_version] Device info string with LMP version, features, or BT version"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "scan_devices": {
        if (!args.scan_data) return text("scan_data is required for scan_devices mode.");
        return scanDevices.execute({ scan_data: args.scan_data }, ctx);
      }

      case "enumerate_services": {
        if (!args.device_address) return text("device_address is required for enumerate_services mode.");
        if (!args.protocol) return text("protocol is required for enumerate_services mode (BR/EDR or BLE).");
        return enumerateServices.execute({ device_address: args.device_address, protocol: args.protocol }, ctx);
      }

      case "check_security": {
        if (!args.bt_version) return text("bt_version is required for check_security mode.");
        if (args.secure_connections === undefined) return text("secure_connections (boolean) is required for check_security mode.");
        if (!args.pairing_mode) return text("pairing_mode is required for check_security mode.");
        return checkSecurity.execute({
          bt_version: args.bt_version,
          secure_connections: args.secure_connections,
          pairing_mode: args.pairing_mode,
        }, ctx);
      }

      case "ble_scan": {
        if (!args.scan_data) return text("scan_data (adv_data) is required for ble_scan mode.");
        return bleScan.execute({ adv_data: args.scan_data }, ctx);
      }

      case "identify_version": {
        const info = args.device_info || args.bt_version;
        if (!info) return text("device_info or bt_version is required for identify_version mode.");
        return identifyVersion.execute({ device_info: info }, ctx);
      }

      default:
        return text(`Unknown mode '${mode}'. Valid modes: scan_devices, enumerate_services, check_security, ble_scan, identify_version`);
    }
  },
};

export default scanBluetooth;

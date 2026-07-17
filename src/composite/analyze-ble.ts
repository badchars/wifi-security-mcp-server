import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { bleAnalysisTools } from "../providers/ble-analysis.js";

// ─── Resolve individual tools by name ───

const toolMap = new Map(bleAnalysisTools.map((t) => [t.name, t]));
const analyzeGatt = toolMap.get("ble_analyze_gatt")!;
const assessPairing = toolMap.get("ble_assess_pairing")!;
const sniffGuide = toolMap.get("ble_sniff_guide")!;
const privacyCheck = toolMap.get("ble_privacy_check")!;

// ─── Composite Tool ───

const analyzeBle: ToolDef = {
  name: "analyze_ble",
  description:
    "BLE security analysis — GATT service audit, pairing security assessment, sniffing guide, privacy/tracking analysis.",
  schema: {
    mode: z
      .enum(["gatt_audit", "pairing_security", "sniff_guide", "privacy_check"])
      .describe("Operation mode: gatt_audit (GATT service security), pairing_security (pairing method assessment), sniff_guide (BLE sniffing setup), privacy_check (address tracking risk)"),

    // gatt_audit params
    services: z
      .string()
      .optional()
      .describe("[gatt_audit] JSON array of GATT services with characteristics [{uuid, characteristics: [{uuid, properties: [read,write,...]}]}]"),

    // pairing_security params
    pairing_method: z
      .enum(["JustWorks", "Passkey", "OOB", "NumericComparison"])
      .optional()
      .describe("[pairing_security] BLE pairing method in use"),
    io_capabilities: z
      .string()
      .optional()
      .describe("[pairing_security] Device IO capabilities: NoInputNoOutput, DisplayOnly, DisplayYesNo, KeyboardOnly, KeyboardDisplay"),

    // sniff_guide params
    target_address: z
      .string()
      .optional()
      .describe("[sniff_guide] Target BLE device address (XX:XX:XX:XX:XX:XX)"),
    protocol_version: z
      .string()
      .optional()
      .describe("[sniff_guide] BLE protocol version (e.g. '4.0', '5.0')"),

    // privacy_check params
    address_type: z
      .enum(["public", "random", "resolvable"])
      .optional()
      .describe("[privacy_check] BLE address type"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "gatt_audit": {
        if (!args.services) return text("services (JSON array) is required for gatt_audit mode.");
        return analyzeGatt.execute({ services: args.services }, ctx);
      }

      case "pairing_security": {
        if (!args.pairing_method) return text("pairing_method is required for pairing_security mode.");
        if (!args.io_capabilities) return text("io_capabilities is required for pairing_security mode.");
        return assessPairing.execute({
          pairing_method: args.pairing_method,
          io_capabilities: args.io_capabilities,
        }, ctx);
      }

      case "sniff_guide": {
        if (!args.target_address) return text("target_address is required for sniff_guide mode.");
        return sniffGuide.execute({
          target_address: args.target_address,
          protocol_version: args.protocol_version,
        }, ctx);
      }

      case "privacy_check": {
        if (!args.address_type) return text("address_type is required for privacy_check mode.");
        return privacyCheck.execute({ address_type: args.address_type }, ctx);
      }

      default:
        return text(`Unknown mode '${mode}'. Valid modes: gatt_audit, pairing_security, sniff_guide, privacy_check`);
    }
  },
};

export default analyzeBle;

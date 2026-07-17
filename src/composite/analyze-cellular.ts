import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { cellularTools } from "../providers/cellular.js";

const toolMap = new Map(cellularTools.map((t) => [t.name, t]));

const analyzeCellularSecurity: ToolDef = {
  name: "analyze_cellular_security",
  description:
    "Composite tool for comprehensive cellular network security analysis. Supports modes: lookup (look up attack by ID), search (search attacks by category/severity), imsi_detect (IMSI catcher detection guidance), assess (assess cellular security posture), defense (defense recommendations by threat model).",
  schema: {
    mode: z
      .enum(["lookup", "search", "imsi_detect", "assess", "defense"])
      .describe("Analysis mode: lookup, search, imsi_detect, assess, or defense"),
    attack_id: z
      .string()
      .optional()
      .describe("Attack ID for lookup mode (e.g. 'imsi_catcher', 'ss7_intercept')"),
    category: z
      .enum(["2g", "3g", "4g", "5g", "ss7", "sim", "baseband", "vowifi"])
      .optional()
      .describe("Category filter for search mode"),
    severity: z
      .enum(["critical", "high", "medium", "low"])
      .optional()
      .describe("Severity filter for search mode"),
    device_os: z
      .enum(["android", "ios"])
      .optional()
      .describe("Device OS for imsi_detect mode"),
    network_type: z
      .enum(["2g", "3g", "4g", "5g"])
      .optional()
      .describe("Network type for assess mode"),
    volte_enabled: z
      .boolean()
      .optional()
      .describe("VoLTE status for assess mode"),
    vowifi_enabled: z
      .boolean()
      .optional()
      .describe("VoWiFi status for assess mode"),
    carrier: z
      .string()
      .optional()
      .describe("Carrier name for assess mode"),
    threat_model: z
      .enum(["surveillance", "interception", "tracking"])
      .optional()
      .describe("Threat model for defense mode"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "lookup": {
        const tool = toolMap.get("cell_lookup_attack")!;
        return tool.execute({ attack_id: args.attack_id }, ctx);
      }
      case "search": {
        const tool = toolMap.get("cell_search_attacks")!;
        return tool.execute({ category: args.category, severity: args.severity }, ctx);
      }
      case "imsi_detect": {
        if (!args.device_os) return text("imsi_detect mode requires 'device_os' parameter (android or ios).");
        const tool = toolMap.get("cell_imsi_catcher_detect")!;
        return tool.execute({ device_os: args.device_os }, ctx);
      }
      case "assess": {
        if (!args.network_type || args.volte_enabled === undefined || args.vowifi_enabled === undefined) {
          return text("assess mode requires 'network_type', 'volte_enabled', and 'vowifi_enabled' parameters.");
        }
        const tool = toolMap.get("cell_assess_security")!;
        return tool.execute({
          network_type: args.network_type,
          volte_enabled: args.volte_enabled,
          vowifi_enabled: args.vowifi_enabled,
          carrier: args.carrier,
        }, ctx);
      }
      case "defense": {
        if (!args.threat_model) return text("defense mode requires 'threat_model' parameter (surveillance, interception, or tracking).");
        const tool = toolMap.get("cell_defense")!;
        return tool.execute({ threat_model: args.threat_model }, ctx);
      }
      default:
        return text(`Unknown mode: ${mode}. Use: lookup, search, imsi_detect, assess, or defense.`);
    }
  },
};

export default analyzeCellularSecurity;

import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { airgapTools } from "../providers/airgap.js";

const toolMap = new Map(airgapTools.map((t) => [t.name, t]));

const analyzeAirgap: ToolDef = {
  name: "analyze_airgap",
  description:
    "Composite tool for air-gap exfiltration analysis. Supports modes: techniques (list exfiltration techniques), assess (assess feasibility), detect (detection methods), defense (hardening recommendations).",
  schema: {
    mode: z
      .enum(["techniques", "assess", "detect", "defense"])
      .describe("Mode: techniques, assess, detect, or defense"),
    category: z
      .enum(["electromagnetic", "acoustic", "optical", "thermal", "magnetic"])
      .optional()
      .describe("Technique category filter for techniques mode"),
    target_environment: z
      .enum(["scif", "datacenter", "office", "industrial"])
      .optional()
      .describe("Target environment for assess mode"),
    available_access: z
      .enum(["physical", "supply_chain", "insider"])
      .optional()
      .describe("Available access vector for assess mode"),
    technique_id: z
      .enum(["air_fi", "lantenna", "satanbus", "fansmitter", "diskfiltration", "ultrasonic", "brightness", "led_exfil", "bitwhisper", "magneto", "odini", "power_line", "usb_emanation"])
      .optional()
      .describe("Technique ID for detect mode"),
    threat_level: z
      .enum(["nation_state", "apt", "general"])
      .optional()
      .describe("Threat level for defense mode"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "techniques": {
        const tool = toolMap.get("airgap_techniques")!;
        return tool.execute({ category: args.category }, ctx);
      }
      case "assess": {
        if (!args.target_environment || !args.available_access) {
          return text("assess mode requires 'target_environment' and 'available_access' parameters.");
        }
        const tool = toolMap.get("airgap_assess")!;
        return tool.execute({
          target_environment: args.target_environment,
          available_access: args.available_access,
        }, ctx);
      }
      case "detect": {
        if (!args.technique_id) return text("detect mode requires 'technique_id' parameter.");
        const tool = toolMap.get("airgap_detect")!;
        return tool.execute({ technique_id: args.technique_id }, ctx);
      }
      case "defense": {
        if (!args.threat_level) return text("defense mode requires 'threat_level' parameter (nation_state, apt, or general).");
        const tool = toolMap.get("airgap_defense")!;
        return tool.execute({ threat_level: args.threat_level }, ctx);
      }
      default:
        return text(`Unknown mode: ${mode}. Use: techniques, assess, detect, or defense.`);
    }
  },
};

export default analyzeAirgap;

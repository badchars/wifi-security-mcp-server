import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { uwbTools } from "../providers/uwb.js";

const toolMap = new Map(uwbTools.map((t) => [t.name, t]));

const analyzeUwb: ToolDef = {
  name: "analyze_uwb",
  description:
    "Composite tool for UWB (Ultra-Wideband) security analysis. Supports modes: assess (assess UWB security for a use case), attack (attack techniques including Ghost Peak), defense (secure ranging best practices).",
  schema: {
    mode: z
      .enum(["assess", "attack", "defense"])
      .describe("Mode: assess, attack, or defense"),
    use_case: z
      .enum(["vehicle_unlock", "indoor_tracking", "airdrop", "digital_key"])
      .optional()
      .describe("UWB use case for assess mode"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "assess": {
        if (!args.use_case) return text("assess mode requires 'use_case' parameter (vehicle_unlock, indoor_tracking, airdrop, or digital_key).");
        const tool = toolMap.get("uwb_assess")!;
        return tool.execute({ use_case: args.use_case }, ctx);
      }
      case "attack": {
        const tool = toolMap.get("uwb_attack_guide")!;
        return tool.execute({}, ctx);
      }
      case "defense": {
        const tool = toolMap.get("uwb_defense")!;
        return tool.execute({}, ctx);
      }
      default:
        return text(`Unknown mode: ${mode}. Use: assess, attack, or defense.`);
    }
  },
};

export default analyzeUwb;

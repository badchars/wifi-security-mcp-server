import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { miracastTools } from "../providers/miracast.js";

const toolMap = new Map(miracastTools.map((t) => [t.name, t]));

const analyzeMiracast: ToolDef = {
  name: "analyze_miracast",
  description:
    "Composite tool for wireless display (Miracast/AirPlay/Chromecast) security analysis. Supports modes: assess (assess protocol security), attack (attack techniques), defense (defense recommendations).",
  schema: {
    mode: z
      .enum(["assess", "attack", "defense"])
      .describe("Mode: assess, attack, or defense"),
    protocol: z
      .enum(["miracast", "airplay", "chromecast"])
      .optional()
      .describe("Wireless display protocol for assess and attack modes"),
    pin_required: z
      .boolean()
      .optional()
      .describe("Whether PIN is required (for assess mode)"),
    target_display: z
      .string()
      .optional()
      .describe("Target display name/identifier (for attack mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "assess": {
        if (!args.protocol) return text("assess mode requires 'protocol' parameter (miracast, airplay, or chromecast).");
        const tool = toolMap.get("miracast_assess")!;
        return tool.execute({ protocol: args.protocol, pin_required: args.pin_required }, ctx);
      }
      case "attack": {
        if (!args.protocol || !args.target_display) {
          return text("attack mode requires 'protocol' and 'target_display' parameters.");
        }
        const tool = toolMap.get("miracast_attack")!;
        return tool.execute({ protocol: args.protocol, target_display: args.target_display }, ctx);
      }
      case "defense": {
        const tool = toolMap.get("miracast_defense")!;
        return tool.execute({}, ctx);
      }
      default:
        return text(`Unknown mode: ${mode}. Use: assess, attack, or defense.`);
    }
  },
};

export default analyzeMiracast;

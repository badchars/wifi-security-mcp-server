import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { text } from "../types/index.js";
import { hotspot20Tools } from "../providers/hotspot20.js";

const toolMap: Record<string, ToolDef> = {
  assess: hotspot20Tools[0],
  attack: hotspot20Tools[1],
  defense: hotspot20Tools[2],
};

export const analyzeHotspot20: ToolDef = {
  name: "analyze_hotspot20",
  description:
    "Unified Hotspot 2.0 / Passpoint analysis tool. Modes: assess (security assessment of HS20 configuration), attack (attack techniques and methodologies), defense (defense recommendations and hardening).",
  schema: {
    mode: z.enum(["assess", "attack", "defense"]).describe("Operation mode to execute"),
    hs20_version: z.string().optional().describe("Hotspot 2.0 version (required for assess mode)"),
    auth_method: z.enum(["eap-sim", "eap-aka", "eap-tls", "eap-ttls", "eap-pwd"]).optional().describe("Authentication method (required for assess mode)"),
    osu_enabled: z.boolean().optional().describe("Whether OSU is enabled (used by assess mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;
    const tool = toolMap[mode];

    if (!tool) {
      return text(`Unknown mode: '${mode}'. Valid modes: ${Object.keys(toolMap).join(", ")}`);
    }

    return tool.execute(args, ctx);
  },
};

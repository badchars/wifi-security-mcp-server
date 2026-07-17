import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { wpsTools } from "../providers/wps.js";

export const crackWpsComposite: ToolDef = {
  name: "crack_wps",
  description: "WPS security analysis and attack. Assess WPS vulnerabilities, get attack commands for brute force / Pixie Dust / null PIN, and defense recommendations.",
  schema: {
    mode: z.enum(["assess", "attack_commands", "defense"]).describe("Mode: assess vulnerabilities, get attack commands, or defense recommendations"),
    wps_enabled: z.boolean().optional().describe("WPS enabled status (for assess mode)"),
    wps_version: z.string().optional().describe("WPS version (for assess mode)"),
    wps_locked: z.boolean().optional().describe("WPS lock status (for assess mode)"),
    target_bssid: z.string().optional().describe("Target BSSID (for attack_commands mode)"),
    interface: z.string().optional().describe("Interface name (for attack_commands mode)"),
    method: z.string().optional().describe("Attack method: brute/pixiedust/null_pin (for attack_commands mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    const toolMap: Record<string, string> = {
      assess: "wps_assess",
      attack_commands: "wps_attack_commands",
      defense: "wps_defense",
    };

    const toolName = toolMap[mode];
    if (!toolName) {
      return json({ error: `Unknown mode: ${mode}. Available: ${Object.keys(toolMap).join(", ")}` });
    }

    const tool = wpsTools.find((t) => t.name === toolName);
    if (!tool) {
      return json({ error: `Tool ${toolName} not found in wps provider.` });
    }

    // Validate required params per mode
    switch (mode) {
      case "assess":
        if (args.wps_enabled === undefined || !args.wps_version) {
          return json({ error: "wps_enabled and wps_version are required for assess mode." });
        }
        break;
      case "attack_commands":
        if (!args.target_bssid) {
          return json({ error: "target_bssid is required for attack_commands mode." });
        }
        break;
      // defense mode: no required params
    }

    return tool.execute(args, ctx);
  },
};

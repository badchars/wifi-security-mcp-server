import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { deauthTools } from "../providers/deauth.js";

export const analyzeDeauthComposite: ToolDef = {
  name: "analyze_deauth",
  description: "Deauthentication attack analysis and defense. Analyze feasibility, generate detection rules, get attack commands, recommend defenses.",
  schema: {
    mode: z.enum(["analyze", "detect", "commands", "defense"]).describe("Mode: analyze feasibility, detect attacks, get commands, recommend defenses"),
    target_pmf: z.string().optional().describe("PMF status: enabled/disabled (for analyze mode)"),
    target_band: z.string().optional().describe("Target band: 2.4/5/6 (for analyze mode)"),
    edr_present: z.boolean().optional().describe("Whether WIDS/EDR is present (for analyze mode)"),
    wids_platform: z.string().optional().describe("WIDS platform: Kismet/Snort/Suricata/custom (for detect mode)"),
    target_bssid: z.string().optional().describe("Target BSSID (for commands mode)"),
    client_mac: z.string().optional().describe("Client MAC (for commands mode)"),
    interface: z.string().optional().describe("Interface name (for commands mode)"),
    count: z.number().optional().describe("Deauth frame count (for commands mode)"),
    infrastructure: z.string().optional().describe("Infrastructure description (for defense mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    const toolMap: Record<string, string> = {
      analyze: "deauth_analyze",
      detect: "deauth_detect",
      commands: "deauth_commands",
      defense: "deauth_defense",
    };

    const toolName = toolMap[mode];
    if (!toolName) {
      return json({ error: `Unknown mode: ${mode}. Available: ${Object.keys(toolMap).join(", ")}` });
    }

    const tool = deauthTools.find((t) => t.name === toolName);
    if (!tool) {
      return json({ error: `Tool ${toolName} not found in deauth provider.` });
    }

    // Validate required params per mode
    switch (mode) {
      case "analyze":
        if (!args.target_pmf || !args.target_band || args.edr_present === undefined) {
          return json({ error: "target_pmf, target_band, and edr_present are required for analyze mode." });
        }
        break;
      case "detect":
        if (!args.wids_platform) {
          return json({ error: "wids_platform is required for detect mode (Kismet/Snort/Suricata/custom)." });
        }
        break;
      case "commands":
        if (!args.target_bssid) {
          return json({ error: "target_bssid is required for commands mode." });
        }
        break;
      case "defense":
        if (!args.infrastructure) {
          return json({ error: "infrastructure is required for defense mode." });
        }
        break;
    }

    return tool.execute(args, ctx);
  },
};

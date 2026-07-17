import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { text } from "../types/index.js";
import { wirelessAttckTools } from "../providers/wireless-attck.js";

const toolMap: Record<string, ToolDef> = {
  lookup: wirelessAttckTools[0],
  coverage: wirelessAttckTools[1],
  by_tactic: wirelessAttckTools[2],
  heatmap: wirelessAttckTools[3],
};

export const mapWirelessAttck: ToolDef = {
  name: "map_wireless_attck",
  description:
    "Unified wireless ATT&CK mapping tool. Modes: lookup (lookup technique by ID), coverage (full ATT&CK matrix coverage), by_tactic (attacks for a specific tactic), heatmap (heatmap data for visualization).",
  schema: {
    mode: z.enum(["lookup", "coverage", "by_tactic", "heatmap"]).describe("Operation mode to execute"),
    technique_id: z.string().optional().describe("MITRE ATT&CK technique ID (required for lookup mode)"),
    tactic: z.enum([
      "initial_access", "execution", "persistence", "privilege_escalation",
      "defense_evasion", "credential_access", "discovery", "lateral_movement",
      "collection", "exfiltration", "c2", "impact",
    ]).optional().describe("ATT&CK tactic (required for by_tactic mode)"),
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

import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { pmkidTools } from "../providers/pmkid.js";

export const analyzePmkidComposite: ToolDef = {
  name: "analyze_pmkid",
  description: "PMKID attack analysis. Assess feasibility, get capture commands (hcxdumptool), get cracking commands (hashcat) with optimized settings.",
  schema: {
    mode: z.enum(["assess", "capture_commands", "crack_commands"]).describe("Mode: assess feasibility, get capture commands, or get cracking commands"),
    target_encryption: z.string().optional().describe("Target encryption (for assess mode)"),
    target_roaming: z.boolean().optional().describe("802.11r enabled (for assess mode)"),
    psk_length: z.number().optional().describe("Estimated PSK length (for assess mode)"),
    target_bssid: z.string().optional().describe("Target BSSID (for capture_commands mode)"),
    interface: z.string().optional().describe("Interface name (for capture_commands mode)"),
    hash_file: z.string().optional().describe("Hash file path (for crack_commands mode)"),
    wordlist: z.string().optional().describe("Wordlist path (for crack_commands mode)"),
    rules: z.string().optional().describe("Hashcat rules file (for crack_commands mode)"),
    hardware: z.string().optional().describe("GPU hardware (for crack_commands mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    const toolMap: Record<string, string> = {
      assess: "pmkid_assess",
      capture_commands: "pmkid_capture_commands",
      crack_commands: "pmkid_crack_commands",
    };

    const toolName = toolMap[mode];
    if (!toolName) {
      return json({ error: `Unknown mode: ${mode}. Available: ${Object.keys(toolMap).join(", ")}` });
    }

    const tool = pmkidTools.find((t) => t.name === toolName);
    if (!tool) {
      return json({ error: `Tool ${toolName} not found in pmkid provider.` });
    }

    // Validate required params per mode
    switch (mode) {
      case "assess":
        if (!args.target_encryption || args.target_roaming === undefined) {
          return json({ error: "target_encryption and target_roaming are required for assess mode." });
        }
        break;
      case "capture_commands":
        if (!args.target_bssid) {
          return json({ error: "target_bssid is required for capture_commands mode." });
        }
        break;
      case "crack_commands":
        if (!args.hash_file) {
          return json({ error: "hash_file is required for crack_commands mode." });
        }
        break;
    }

    return tool.execute(args, ctx);
  },
};

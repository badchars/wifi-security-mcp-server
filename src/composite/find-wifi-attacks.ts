import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { wifiAttackTools } from "../providers/wifi-attack.js";

export const findWifiAttacksComposite: ToolDef = {
  name: "find_wifi_attacks",
  description: "Search and explore WiFi attacks in the knowledge base. Look up attacks by ID, search by protocol/category/severity, find by CVE or tool, get attack commands.",
  schema: {
    mode: z.enum(["lookup", "search", "find_by_cve", "find_by_tool", "get_commands"]).describe("Search mode"),
    attack_id: z.string().optional().describe("Attack ID (for lookup and get_commands modes)"),
    protocol: z.string().optional().describe("Protocol filter: WPA/WPA2/WPA3/WEP/WPS/EAP/Open (for search mode)"),
    category: z.string().optional().describe("Category: handshake/protocol/implementation/infrastructure/client/dos/mitm (for search mode)"),
    severity: z.string().optional().describe("Minimum severity: critical/high/medium/low (for search mode)"),
    max_stealth: z.number().optional().describe("Maximum stealth score 1-5 (for search mode)"),
    cve_id: z.string().optional().describe("CVE identifier (for find_by_cve mode)"),
    tool_name: z.string().optional().describe("Tool name (for find_by_tool mode)"),
    target_bssid: z.string().optional().describe("Target BSSID (for get_commands mode)"),
    target_ssid: z.string().optional().describe("Target SSID (for get_commands mode)"),
    client_mac: z.string().optional().describe("Client MAC (for get_commands mode)"),
    interface: z.string().optional().describe("Interface name (for get_commands mode)"),
    channel: z.number().optional().describe("Channel number (for get_commands mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    const toolMap: Record<string, string> = {
      lookup: "wifi_lookup_attack",
      search: "wifi_search_attacks",
      find_by_cve: "wifi_find_by_cve",
      find_by_tool: "wifi_find_by_tool",
      get_commands: "wifi_attack_commands",
    };

    const toolName = toolMap[mode];
    if (!toolName) {
      return json({ error: `Unknown mode: ${mode}. Available: ${Object.keys(toolMap).join(", ")}` });
    }

    const tool = wifiAttackTools.find((t) => t.name === toolName);
    if (!tool) {
      return json({ error: `Tool ${toolName} not found in wifi-attack provider.` });
    }

    // Validate required params per mode
    switch (mode) {
      case "lookup":
        if (!args.attack_id) {
          return json({ error: "attack_id is required for lookup mode." });
        }
        break;
      case "find_by_cve":
        if (!args.cve_id) {
          return json({ error: "cve_id is required for find_by_cve mode." });
        }
        break;
      case "find_by_tool":
        if (!args.tool_name) {
          return json({ error: "tool_name is required for find_by_tool mode." });
        }
        break;
      case "get_commands":
        if (!args.attack_id) {
          return json({ error: "attack_id is required for get_commands mode." });
        }
        break;
      // search mode: all params optional
    }

    return tool.execute(args, ctx);
  },
};

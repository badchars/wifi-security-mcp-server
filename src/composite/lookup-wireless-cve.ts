import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { text } from "../types/index.js";
import { cveLookupTools } from "../providers/cve-lookup.js";

const toolMap: Record<string, ToolDef> = {
  lookup: cveLookupTools[0],
  search: cveLookupTools[1],
  by_product: cveLookupTools[2],
  stats: cveLookupTools[3],
};

export const lookupWirelessCve: ToolDef = {
  name: "lookup_wireless_cve",
  description:
    "Unified wireless CVE lookup tool. Modes: lookup (look up CVE by ID), search (search by domain/severity/exploit), by_product (find CVEs by affected product), stats (database statistics).",
  schema: {
    mode: z.enum(["lookup", "search", "by_product", "stats"]).describe("Operation mode to execute"),
    cve_id: z.string().optional().describe("CVE identifier (required for lookup mode)"),
    domain: z.enum(["wifi", "bluetooth", "nfc", "cellular", "iot", "rf", "uwb"]).optional().describe("Wireless domain filter (used by search mode)"),
    severity: z.enum(["critical", "high", "medium", "low"]).optional().describe("Minimum severity filter (used by search mode)"),
    exploit_available: z.boolean().optional().describe("Filter for CVEs with public exploits (used by search mode)"),
    product: z.string().optional().describe("Product name to search for (required for by_product mode)"),
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

import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { text } from "../types/index.js";
import { reportTools } from "../providers/report.js";

const toolMap: Record<string, ToolDef> = {
  json: reportTools[0],
  markdown: reportTools[1],
  executive_summary: reportTools[2],
  csv: reportTools[3],
};

export const exportReport: ToolDef = {
  name: "export_report",
  description:
    "Unified report export tool. Modes: json (export as JSON), markdown (export as Markdown report), executive_summary (generate executive summary), csv (export as CSV).",
  schema: {
    mode: z.enum(["json", "markdown", "executive_summary", "csv"]).describe("Export format / operation mode"),
    findings: z.string().optional().describe("Findings data as JSON string (required for all modes)"),
    classification: z.string().optional().describe("Report classification marking (used by json mode)"),
    title: z.string().optional().describe("Report title (required for markdown mode)"),
    sections: z.string().optional().describe("JSON array of additional section names (used by markdown mode)"),
    scope: z.string().optional().describe("Assessment scope description (required for executive_summary mode)"),
    risk_rating: z.enum(["critical", "high", "medium", "low"]).optional().describe("Overall risk rating override (used by executive_summary mode)"),
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

import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { text } from "../types/index.js";
import { complianceAuditTools } from "../providers/compliance-audit.js";

const toolMap: Record<string, ToolDef> = {
  check: complianceAuditTools[0],
  gap_analysis: complianceAuditTools[1],
  compare_frameworks: complianceAuditTools[2],
  report: complianceAuditTools[3],
};

export const auditWirelessCompliance: ToolDef = {
  name: "audit_wireless_compliance",
  description:
    "Unified wireless compliance auditing tool. Modes: check (compliance check against framework), gap_analysis (identify gaps in deployed controls), compare_frameworks (compare all frameworks), report (generate compliance report).",
  schema: {
    mode: z.enum(["check", "gap_analysis", "compare_frameworks", "report"]).describe("Operation mode to execute"),
    framework: z.enum(["pci_dss", "nist_800_153", "hipaa", "iso_27001", "cis"]).optional().describe("Compliance framework (required for check, gap_analysis, report modes)"),
    config_data: z.string().optional().describe("Current wireless configuration (used by check mode)"),
    current_controls: z.string().optional().describe("Description of deployed controls (required for gap_analysis mode)"),
    findings: z.string().optional().describe("Assessment findings as JSON array (required for report mode)"),
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

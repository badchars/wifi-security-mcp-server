import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ─── Tool 1: report_json ───

const report_json: ToolDef = {
  name: "report_json",
  description: "Export wireless security findings as formatted JSON. Takes raw findings data and returns structured JSON output with optional classification marking and metadata.",
  schema: {
    findings: z.string().describe("Findings data as JSON string (object or array of findings to export)"),
    classification: z.string().optional().describe("Report classification marking (e.g., 'CONFIDENTIAL', 'INTERNAL', 'PUBLIC')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const findingsRaw = args.findings as string;
    const classification = args.classification as string | undefined;

    let parsedFindings: unknown;
    try {
      parsedFindings = JSON.parse(findingsRaw);
    } catch {
      // Treat as plain text findings
      parsedFindings = { raw_findings: findingsRaw };
    }

    const report = {
      report_metadata: {
        format: "JSON",
        generated_at: new Date().toISOString(),
        generator: "wifi-security-mcp",
        classification: classification ?? "UNCLASSIFIED",
        version: "1.0",
      },
      findings: parsedFindings,
    };

    // Generate statistics if findings is an array
    if (Array.isArray(parsedFindings)) {
      const stats: Record<string, unknown> = {
        total_findings: parsedFindings.length,
      };

      // Count by severity if present
      const severityCounts: Record<string, number> = {};
      for (const finding of parsedFindings) {
        if (typeof finding === "object" && finding !== null) {
          const sev = (finding as Record<string, unknown>).severity as string | undefined;
          if (sev) {
            severityCounts[sev] = (severityCounts[sev] || 0) + 1;
          }
        }
      }
      if (Object.keys(severityCounts).length > 0) {
        stats.by_severity = severityCounts;
      }

      // Count by status if present
      const statusCounts: Record<string, number> = {};
      for (const finding of parsedFindings) {
        if (typeof finding === "object" && finding !== null) {
          const status = (finding as Record<string, unknown>).status as string | undefined;
          if (status) {
            statusCounts[status] = (statusCounts[status] || 0) + 1;
          }
        }
      }
      if (Object.keys(statusCounts).length > 0) {
        stats.by_status = statusCounts;
      }

      (report as Record<string, unknown>).statistics = stats;
    }

    return json(report);
  },
};

// ─── Tool 2: report_markdown ───

const report_markdown: ToolDef = {
  name: "report_markdown",
  description: "Export wireless security findings as a formatted Markdown report. Takes title, findings, and optional section list to produce a structured penetration test or audit report.",
  schema: {
    title: z.string().describe("Report title (e.g., 'Wireless Security Assessment - ACME Corp')"),
    findings: z.string().describe("Findings data as JSON string (array of {title, severity, description, remediation})"),
    sections: z.string().optional().describe("JSON array of additional section names to include (e.g., '[\"Scope\",\"Methodology\",\"Tools\"]')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const title = args.title as string;
    const findingsRaw = args.findings as string;
    const sectionsRaw = args.sections as string | undefined;

    let findings: { title?: string; severity?: string; description?: string; remediation?: string; [key: string]: unknown }[];
    try {
      const parsed = JSON.parse(findingsRaw);
      findings = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      findings = [{ title: "Raw Finding", description: findingsRaw }];
    }

    let additionalSections: string[] = [];
    if (sectionsRaw) {
      try {
        additionalSections = JSON.parse(sectionsRaw);
      } catch {
        additionalSections = sectionsRaw.split(",").map((s) => s.trim());
      }
    }

    const reportDate = new Date().toISOString().split("T")[0];

    // Severity counts
    const severityCounts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    for (const f of findings) {
      const sev = (f.severity || "info").toLowerCase();
      severityCounts[sev] = (severityCounts[sev] || 0) + 1;
    }

    // Overall risk
    let overallRisk = "LOW";
    if (severityCounts.critical > 0) overallRisk = "CRITICAL";
    else if (severityCounts.high > 0) overallRisk = "HIGH";
    else if (severityCounts.medium > 0) overallRisk = "MEDIUM";

    // Severity emoji-less indicators
    const sevIndicator: Record<string, string> = {
      critical: "[!!! CRITICAL]",
      high: "[!! HIGH]",
      medium: "[! MEDIUM]",
      low: "[LOW]",
      info: "[INFO]",
    };

    // Build markdown
    const lines: string[] = [
      `# ${title}`,
      ``,
      `**Date:** ${reportDate}`,
      `**Overall Risk:** ${overallRisk}`,
      `**Total Findings:** ${findings.length}`,
      ``,
      `## Executive Summary`,
      ``,
      `This wireless security assessment identified **${findings.length}** finding(s):`,
      ``,
      `| Severity | Count |`,
      `|----------|-------|`,
      ...Object.entries(severityCounts)
        .filter(([_, count]) => count > 0)
        .map(([sev, count]) => `| ${sev.charAt(0).toUpperCase() + sev.slice(1)} | ${count} |`),
      ``,
    ];

    // Additional sections (placeholders)
    for (const section of additionalSections) {
      lines.push(`## ${section}`, ``, `*[To be completed]*`, ``);
    }

    // Findings section
    lines.push(`## Detailed Findings`, ``);

    findings.forEach((finding, index) => {
      const findingTitle = finding.title || `Finding ${index + 1}`;
      const severity = (finding.severity || "info").toLowerCase();
      const description = finding.description || "No description provided.";
      const remediation = finding.remediation || "Review and address as appropriate.";

      lines.push(
        `### ${index + 1}. ${findingTitle}`,
        ``,
        `**Severity:** ${sevIndicator[severity] || severity}`,
        ``,
        `**Description:**`,
        description,
        ``,
        `**Remediation:**`,
        remediation,
        ``,
        `---`,
        ``,
      );
    });

    // Appendix
    lines.push(
      `## Appendix`,
      ``,
      `### Severity Definitions`,
      ``,
      `| Severity | Definition |`,
      `|----------|-----------|`,
      `| Critical | Immediate exploitation risk with severe impact on confidentiality, integrity, or availability |`,
      `| High | Significant risk that should be remediated within 30 days |`,
      `| Medium | Moderate risk that should be remediated within 90 days |`,
      `| Low | Minor risk or best practice recommendation |`,
      `| Info | Informational finding with no direct security impact |`,
      ``,
    );

    const markdown = lines.join("\n");

    return text(markdown);
  },
};

// ─── Tool 3: report_executive_summary ───

const report_executive_summary: ToolDef = {
  name: "report_executive_summary",
  description: "Generate an executive summary for wireless security findings. Takes findings data, assessment scope, and optional risk rating to produce a non-technical summary for leadership.",
  schema: {
    findings: z.string().describe("Findings data as JSON string (array of findings with severity and description)"),
    scope: z.string().describe("Assessment scope description (e.g., 'Corporate WiFi infrastructure at 3 office locations, 45 APs, 12 SSIDs')"),
    risk_rating: z.enum(["critical", "high", "medium", "low"]).optional().describe("Overall risk rating override (auto-calculated if not provided)"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const findingsRaw = args.findings as string;
    const scope = args.scope as string;
    const riskOverride = args.risk_rating as string | undefined;

    let findings: { title?: string; severity?: string; description?: string; [key: string]: unknown }[];
    try {
      const parsed = JSON.parse(findingsRaw);
      findings = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      findings = [{ title: "Assessment Finding", description: findingsRaw, severity: "medium" }];
    }

    // Calculate risk
    const severityCounts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    for (const f of findings) {
      const sev = (f.severity || "info").toLowerCase();
      severityCounts[sev] = (severityCounts[sev] || 0) + 1;
    }

    let calculatedRisk = "LOW";
    if (severityCounts.critical > 0) calculatedRisk = "CRITICAL";
    else if (severityCounts.high > 0) calculatedRisk = "HIGH";
    else if (severityCounts.medium > 0) calculatedRisk = "MEDIUM";

    const overallRisk = riskOverride?.toUpperCase() || calculatedRisk;

    // Generate business impact
    const businessImpacts: string[] = [];
    if (severityCounts.critical > 0) {
      businessImpacts.push(
        "Immediate risk of unauthorized network access and data breach",
        "Potential regulatory non-compliance (PCI DSS, HIPAA, GDPR)",
        "Risk of business disruption through wireless denial of service",
      );
    }
    if (severityCounts.high > 0) {
      businessImpacts.push(
        "Significant risk of credential theft via wireless attack vectors",
        "Potential for man-in-the-middle attacks on wireless communications",
        "Risk of lateral movement from wireless to internal networks",
      );
    }
    if (severityCounts.medium > 0) {
      businessImpacts.push(
        "Moderate risk of information disclosure through wireless channels",
        "Opportunity for improvement in wireless security posture",
      );
    }
    if (businessImpacts.length === 0) {
      businessImpacts.push(
        "Wireless security posture is acceptable with minor improvement opportunities",
      );
    }

    // Key findings (top 5 by severity)
    const sortedFindings = [...findings].sort((a, b) => {
      const sev: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
      return (sev[(b.severity || "info").toLowerCase()] || 0) - (sev[(a.severity || "info").toLowerCase()] || 0);
    });

    const topFindings = sortedFindings.slice(0, 5).map((f, i) => ({
      rank: i + 1,
      title: f.title || `Finding ${i + 1}`,
      severity: (f.severity || "info").toUpperCase(),
      summary: typeof f.description === "string" ? f.description.substring(0, 200) + (f.description.length > 200 ? "..." : "") : "See detailed report.",
    }));

    // Recommendations
    const recommendations: string[] = [];
    if (overallRisk === "CRITICAL") {
      recommendations.push(
        "IMMEDIATE: Remediate all critical findings within 48 hours",
        "Schedule emergency wireless infrastructure review",
        "Consider engaging wireless security specialist for remediation support",
      );
    }
    if (overallRisk === "CRITICAL" || overallRisk === "HIGH") {
      recommendations.push(
        "Remediate high-severity findings within 30 days",
        "Review and update wireless security policy",
        "Implement continuous wireless monitoring (WIDS/WIPS)",
      );
    }
    recommendations.push(
      "Address all remaining findings per severity-based timeline",
      "Schedule follow-up assessment to validate remediation",
      "Conduct wireless security awareness training for IT staff",
      "Review and update incident response procedures for wireless events",
    );

    return json({
      executive_summary: {
        report_date: new Date().toISOString().split("T")[0],
        assessment_scope: scope,
        overall_risk_rating: overallRisk,
        finding_summary: {
          total: findings.length,
          by_severity: severityCounts,
        },
        business_impact: businessImpacts,
        key_findings: topFindings,
        recommendations,
        next_steps: [
          "1. Review and prioritize findings by business impact",
          "2. Assign remediation owners and timelines",
          "3. Implement remediation per priority schedule",
          "4. Schedule validation assessment",
          "5. Update risk register with wireless security findings",
        ],
      },
    });
  },
};

// ─── Tool 4: report_csv ───

const report_csv: ToolDef = {
  name: "report_csv",
  description: "Export wireless security findings as CSV format. Takes findings data (array of objects) and returns comma-separated values with header row, suitable for spreadsheet import.",
  schema: {
    findings: z.string().describe("Findings data as JSON array of objects to export as CSV"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const findingsRaw = args.findings as string;

    let findings: Record<string, unknown>[];
    try {
      const parsed = JSON.parse(findingsRaw);
      findings = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return text("Error: findings must be a valid JSON array of objects. Example: [{\"title\":\"WEP Found\",\"severity\":\"critical\"}]");
    }

    if (findings.length === 0) {
      return text("No findings to export.");
    }

    // Collect all unique keys for header
    const allKeys = new Set<string>();
    for (const finding of findings) {
      if (typeof finding === "object" && finding !== null) {
        for (const key of Object.keys(finding)) {
          allKeys.add(key);
        }
      }
    }

    const headers = Array.from(allKeys);

    // Escape CSV values
    function escapeCSV(value: unknown): string {
      if (value === null || value === undefined) return "";
      const str = typeof value === "object" ? JSON.stringify(value) : String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }

    // Build CSV
    const csvLines: string[] = [];
    csvLines.push(headers.map(escapeCSV).join(","));

    for (const finding of findings) {
      if (typeof finding !== "object" || finding === null) continue;
      const row = headers.map((header) => escapeCSV((finding as Record<string, unknown>)[header]));
      csvLines.push(row.join(","));
    }

    const csv = csvLines.join("\n");

    return json({
      csv_export: {
        format: "CSV",
        generated_at: new Date().toISOString(),
        total_rows: findings.length,
        columns: headers,
        csv_data: csv,
      },
    });
  },
};

// ─── Export ───

export const reportTools: ToolDef[] = [
  report_json,
  report_markdown,
  report_executive_summary,
  report_csv,
];

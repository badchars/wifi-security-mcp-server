import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { COMPLIANCE_FRAMEWORKS } from "../knowledge/index.js";
import type { ComplianceFramework, ComplianceRequirement } from "../knowledge/index.js";

// ─── Constants ───

const FRAMEWORK_IDS = ["pci_dss", "nist_800_153", "hipaa", "iso_27001", "cis"] as const;

function findFramework(id: string): ComplianceFramework | undefined {
  const normalizedId = id.toLowerCase().replace(/[\s_-]+/g, "-");
  const mappings: Record<string, string> = {
    "pci-dss": "pci-dss-4",
    "pci_dss": "pci-dss-4",
    "nist-800-153": "nist-800-153",
    "nist_800_153": "nist-800-153",
    "hipaa": "hipaa",
    "iso-27001": "iso-27001",
    "iso_27001": "iso-27001",
    "cis": "cis-wireless",
    "cis-wireless": "cis-wireless",
  };
  const frameworkId = mappings[normalizedId] || normalizedId;
  return COMPLIANCE_FRAMEWORKS.find((f) => f.id === frameworkId);
}

// ─── Tool 1: compliance_check ───

const compliance_check: ToolDef = {
  name: "compliance_check",
  description: "Check wireless configuration against a specific compliance framework. Returns compliance status per requirement with pass/fail assessment based on provided configuration data.",
  schema: {
    framework: z.enum(FRAMEWORK_IDS).describe("Compliance framework to check against"),
    config_data: z.string().optional().describe("Current wireless configuration description or data for assessment. If not provided, returns all requirements with guidance."),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const frameworkId = args.framework as string;
    const configData = args.config_data as string | undefined;
    const framework = findFramework(frameworkId);

    if (!framework) {
      return text(`Framework '${frameworkId}' not found. Available: ${COMPLIANCE_FRAMEWORKS.map((f) => f.id).join(", ")}`);
    }

    if (!configData) {
      // Return all requirements with guidance
      return json({
        compliance_check: {
          framework: framework.name,
          full_name: framework.fullName,
          domain: framework.domain,
          total_requirements: framework.wirelessRequirements.length,
          requirements: framework.wirelessRequirements.map((req) => ({
            id: req.id,
            section: req.section,
            title: req.title,
            requirement: req.requirement,
            wireless_relevance: req.wirelessRelevance,
            test_procedure: req.testProcedure,
            severity: req.severity,
            status: "NOT ASSESSED — provide config_data for assessment",
          })),
          references: framework.references,
        },
      });
    }

    // Assess config against requirements
    const lower = configData.toLowerCase();
    const results = framework.wirelessRequirements.map((req) => {
      let status: "PASS" | "FAIL" | "PARTIAL" | "UNKNOWN" = "UNKNOWN";
      let evidence = "";

      // Heuristic-based assessment
      const reqLower = req.requirement.toLowerCase();

      if (reqLower.includes("encryption") || reqLower.includes("cryptography")) {
        if (lower.includes("wpa3") || lower.includes("wpa3-enterprise")) {
          status = "PASS";
          evidence = "WPA3 encryption detected in configuration.";
        } else if (lower.includes("wpa2-enterprise") || lower.includes("wpa2 enterprise")) {
          status = "PASS";
          evidence = "WPA2-Enterprise with AES detected.";
        } else if (lower.includes("wpa2") && lower.includes("aes")) {
          status = "PARTIAL";
          evidence = "WPA2-AES detected but Enterprise mode not confirmed.";
        } else if (lower.includes("wep") || lower.includes("open") || lower.includes("tkip")) {
          status = "FAIL";
          evidence = "Weak or no encryption detected (WEP/Open/TKIP).";
        }
      }

      if (reqLower.includes("rogue") || reqLower.includes("unauthorized")) {
        if (lower.includes("wids") || lower.includes("wips") || lower.includes("rogue detection") || lower.includes("air marshal")) {
          status = "PASS";
          evidence = "WIDS/WIPS or rogue AP detection mechanism present.";
        } else if (lower.includes("scan") || lower.includes("monitor")) {
          status = "PARTIAL";
          evidence = "Some monitoring mentioned but dedicated WIDS not confirmed.";
        } else {
          status = "FAIL";
          evidence = "No rogue AP detection mechanism found in configuration.";
        }
      }

      if (reqLower.includes("default") || reqLower.includes("vendor")) {
        if (lower.includes("changed") || lower.includes("custom") || lower.includes("unique")) {
          status = "PASS";
          evidence = "Default credentials appear to be changed.";
        } else if (lower.includes("default") || lower.includes("admin/admin") || lower.includes("password")) {
          status = "FAIL";
          evidence = "Potential default credentials detected in configuration.";
        }
      }

      if (reqLower.includes("segment") || reqLower.includes("isolat")) {
        if (lower.includes("vlan") || lower.includes("segmentation") || lower.includes("isolated")) {
          status = "PASS";
          evidence = "Network segmentation/VLAN configuration detected.";
        } else {
          status = "FAIL";
          evidence = "No network segmentation evidence found.";
        }
      }

      if (reqLower.includes("access control") || reqLower.includes("authentication")) {
        if (lower.includes("802.1x") || lower.includes("radius") || lower.includes("eap")) {
          status = "PASS";
          evidence = "802.1X/RADIUS authentication configured.";
        } else if (lower.includes("psk") || lower.includes("pre-shared")) {
          status = "PARTIAL";
          evidence = "PSK authentication used — lacks per-user accountability.";
        } else {
          status = "FAIL";
          evidence = "No enterprise authentication mechanism detected.";
        }
      }

      if (reqLower.includes("audit") || reqLower.includes("log")) {
        if (lower.includes("log") || lower.includes("siem") || lower.includes("audit") || lower.includes("accounting")) {
          status = "PASS";
          evidence = "Logging/auditing mechanisms detected.";
        } else {
          status = "FAIL";
          evidence = "No logging or audit trail configuration found.";
        }
      }

      if (reqLower.includes("inventory") || reqLower.includes("asset")) {
        if (lower.includes("inventory") || lower.includes("asset") || lower.includes("cmdb")) {
          status = "PASS";
          evidence = "Asset inventory or management referenced.";
        } else {
          status = "UNKNOWN";
          evidence = "Cannot determine inventory status from configuration.";
        }
      }

      return {
        id: req.id,
        section: req.section,
        title: req.title,
        requirement: req.requirement,
        severity: req.severity,
        status,
        evidence,
        test_procedure: req.testProcedure,
      };
    });

    const passCount = results.filter((r) => r.status === "PASS").length;
    const failCount = results.filter((r) => r.status === "FAIL").length;
    const partialCount = results.filter((r) => r.status === "PARTIAL").length;
    const total = results.length;

    return json({
      compliance_check: {
        framework: framework.name,
        full_name: framework.fullName,
        assessment_summary: {
          total_requirements: total,
          pass: passCount,
          fail: failCount,
          partial: partialCount,
          unknown: results.filter((r) => r.status === "UNKNOWN").length,
          compliance_percentage: `${((passCount / total) * 100).toFixed(1)}%`,
          overall_status: failCount === 0 && partialCount === 0 ? "COMPLIANT" : failCount > 0 ? "NON-COMPLIANT" : "PARTIALLY COMPLIANT",
        },
        requirement_results: results,
        remediation_priority: results
          .filter((r) => r.status === "FAIL")
          .sort((a, b) => {
            const sevOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
            return (sevOrder[b.severity] || 0) - (sevOrder[a.severity] || 0);
          })
          .map((r) => ({ id: r.id, title: r.title, severity: r.severity, evidence: r.evidence })),
      },
    });
  },
};

// ─── Tool 2: compliance_gap_analysis ───

const compliance_gap_analysis: ToolDef = {
  name: "compliance_gap_analysis",
  description: "Perform wireless compliance gap analysis. Compares currently deployed security controls against framework requirements and identifies gaps with remediation recommendations.",
  schema: {
    framework: z.enum(FRAMEWORK_IDS).describe("Compliance framework for gap analysis"),
    current_controls: z.string().describe("Description of currently deployed wireless security controls (e.g., 'WPA2-PSK, no WIDS, single VLAN, Meraki controller, quarterly manual scans')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const frameworkId = args.framework as string;
    const currentControls = args.current_controls as string;
    const framework = findFramework(frameworkId);

    if (!framework) {
      return text(`Framework '${frameworkId}' not found.`);
    }

    const lower = currentControls.toLowerCase();

    // Detect deployed controls
    const deployedControls: { control: string; detected: boolean; evidence: string }[] = [
      { control: "WPA3 Encryption", detected: lower.includes("wpa3"), evidence: lower.includes("wpa3") ? "WPA3 mentioned in controls" : "Not detected" },
      { control: "WPA2-Enterprise", detected: lower.includes("wpa2-enterprise") || lower.includes("802.1x") || lower.includes("radius"), evidence: lower.includes("wpa2-enterprise") || lower.includes("802.1x") ? "Enterprise authentication detected" : "Not detected" },
      { control: "WPA2-PSK", detected: lower.includes("wpa2-psk") || lower.includes("wpa2 psk") || lower.includes("pre-shared"), evidence: lower.includes("psk") ? "PSK mode detected" : "Not detected" },
      { control: "WIDS/WIPS", detected: lower.includes("wids") || lower.includes("wips") || lower.includes("air marshal") || lower.includes("intrusion"), evidence: lower.includes("wids") || lower.includes("wips") ? "WIDS/WIPS mentioned" : "Not detected" },
      { control: "VLAN Segmentation", detected: lower.includes("vlan") || lower.includes("segment"), evidence: lower.includes("vlan") ? "VLAN segmentation mentioned" : "Not detected" },
      { control: "PMF (802.11w)", detected: lower.includes("pmf") || lower.includes("802.11w") || lower.includes("protected management"), evidence: lower.includes("pmf") ? "PMF mentioned" : "Not detected" },
      { control: "Rogue AP Scanning", detected: lower.includes("rogue") || lower.includes("scan") || lower.includes("air marshal"), evidence: lower.includes("rogue") || lower.includes("scan") ? "Rogue scanning mentioned" : "Not detected" },
      { control: "Logging/SIEM", detected: lower.includes("log") || lower.includes("siem") || lower.includes("splunk") || lower.includes("elastic"), evidence: lower.includes("log") || lower.includes("siem") ? "Logging mentioned" : "Not detected" },
      { control: "Client Isolation", detected: lower.includes("isolation") || lower.includes("private") || lower.includes("pvlan"), evidence: lower.includes("isolation") ? "Client isolation mentioned" : "Not detected" },
      { control: "Certificate Auth (EAP-TLS)", detected: lower.includes("eap-tls") || lower.includes("certificate") || lower.includes("mutual"), evidence: lower.includes("eap-tls") ? "Certificate auth mentioned" : "Not detected" },
    ];

    // Identify gaps
    const gaps: { requirement: string; section: string; severity: string; gap_description: string; remediation: string; effort: string }[] = [];

    for (const req of framework.wirelessRequirements) {
      const reqLower = req.requirement.toLowerCase();
      let isGap = false;
      let gapDesc = "";
      let remediation = "";
      let effort = "medium";

      if (reqLower.includes("encrypt") && !deployedControls.find((c) => c.control.includes("WPA") && c.detected)) {
        isGap = true;
        gapDesc = "Strong wireless encryption not confirmed. PSK-only mode does not meet enterprise requirements.";
        remediation = "Deploy WPA2-Enterprise with RADIUS or upgrade to WPA3-Enterprise.";
        effort = "high";
      }

      if (reqLower.includes("rogue") && !deployedControls.find((c) => c.control.includes("Rogue") && c.detected) && !deployedControls.find((c) => c.control.includes("WIDS") && c.detected)) {
        isGap = true;
        gapDesc = "No rogue AP detection mechanism deployed.";
        remediation = "Deploy WIDS/WIPS solution or enable built-in controller rogue detection. Implement quarterly wireless scans.";
        effort = "medium";
      }

      if (reqLower.includes("segment") && !deployedControls.find((c) => c.control.includes("VLAN") && c.detected)) {
        isGap = true;
        gapDesc = "Network segmentation not implemented for wireless networks.";
        remediation = "Implement VLAN segmentation with dedicated VLANs per SSID and inter-VLAN ACLs.";
        effort = "medium";
      }

      if (reqLower.includes("access control") && !deployedControls.find((c) => (c.control.includes("Enterprise") || c.control.includes("EAP-TLS")) && c.detected)) {
        isGap = true;
        gapDesc = "Enterprise-grade access control (802.1X) not deployed.";
        remediation = "Implement 802.1X with RADIUS authentication. Deploy EAP-TLS for strongest security.";
        effort = "high";
      }

      if (reqLower.includes("audit") && !deployedControls.find((c) => c.control.includes("Log") && c.detected)) {
        isGap = true;
        gapDesc = "Wireless audit logging not configured or not forwarded to SIEM.";
        remediation = "Enable RADIUS accounting, controller event logging, and forward to centralized SIEM.";
        effort = "low";
      }

      if (isGap) {
        gaps.push({
          requirement: req.title,
          section: req.section,
          severity: req.severity,
          gap_description: gapDesc,
          remediation,
          effort,
        });
      }
    }

    return json({
      gap_analysis: {
        framework: framework.name,
        current_controls_summary: deployedControls,
        total_requirements: framework.wirelessRequirements.length,
        gaps_identified: gaps.length,
        compliance_gap_rate: `${((gaps.length / framework.wirelessRequirements.length) * 100).toFixed(1)}%`,
        gaps: gaps.sort((a, b) => {
          const sevOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
          return (sevOrder[b.severity] || 0) - (sevOrder[a.severity] || 0);
        }),
        remediation_roadmap: {
          immediate: gaps.filter((g) => g.severity === "critical").map((g) => g.remediation),
          short_term: gaps.filter((g) => g.severity === "high").map((g) => g.remediation),
          medium_term: gaps.filter((g) => g.severity === "medium").map((g) => g.remediation),
          long_term: gaps.filter((g) => g.severity === "low").map((g) => g.remediation),
        },
        estimated_effort: {
          high_effort_items: gaps.filter((g) => g.effort === "high").length,
          medium_effort_items: gaps.filter((g) => g.effort === "medium").length,
          low_effort_items: gaps.filter((g) => g.effort === "low").length,
        },
      },
    });
  },
};

// ─── Tool 3: compliance_all_frameworks ───

const compliance_all_frameworks: ToolDef = {
  name: "compliance_all_frameworks",
  description: "Compare all wireless compliance frameworks side by side. Returns a unified view of wireless security requirements across PCI DSS, NIST 800-153, HIPAA, ISO 27001, and CIS Controls.",
  schema: {},
  async execute(_args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    // Build comparison matrix
    const categories = [
      "Encryption",
      "Authentication",
      "Rogue AP Detection",
      "Network Segmentation",
      "Access Control",
      "Monitoring/Logging",
      "Asset Management",
      "Vendor Defaults",
    ];

    const comparison = categories.map((category) => {
      const catLower = category.toLowerCase();
      const frameworkStatus: Record<string, { required: boolean; requirements: string[]; severity: string }> = {};

      for (const fw of COMPLIANCE_FRAMEWORKS) {
        const matchingReqs = fw.wirelessRequirements.filter((req) => {
          const combined = `${req.title} ${req.requirement} ${req.wirelessRelevance}`.toLowerCase();
          if (catLower.includes("encrypt")) return combined.includes("encrypt") || combined.includes("cryptograph");
          if (catLower.includes("auth")) return combined.includes("authent") || combined.includes("802.1x") || combined.includes("eap");
          if (catLower.includes("rogue")) return combined.includes("rogue") || combined.includes("unauthorized") || combined.includes("wids");
          if (catLower.includes("segment")) return combined.includes("segment") || combined.includes("isolat");
          if (catLower.includes("access")) return combined.includes("access control") || combined.includes("authorization");
          if (catLower.includes("monitor")) return combined.includes("monitor") || combined.includes("log") || combined.includes("audit");
          if (catLower.includes("asset")) return combined.includes("inventory") || combined.includes("asset");
          if (catLower.includes("vendor")) return combined.includes("default") || combined.includes("vendor");
          return false;
        });

        frameworkStatus[fw.name] = {
          required: matchingReqs.length > 0,
          requirements: matchingReqs.map((r) => `${r.section}: ${r.title}`),
          severity: matchingReqs.length > 0 ? matchingReqs.sort((a, b) => {
            const sev: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
            return (sev[b.severity] || 0) - (sev[a.severity] || 0);
          })[0].severity : "n/a",
        };
      }

      return {
        category,
        frameworks: frameworkStatus,
        required_by_count: Object.values(frameworkStatus).filter((v) => v.required).length,
        max_severity: Object.values(frameworkStatus).reduce((max, v) => {
          const sev: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1, "n/a": 0 };
          return (sev[v.severity] || 0) > (sev[max] || 0) ? v.severity : max;
        }, "n/a"),
      };
    });

    return json({
      framework_comparison: {
        frameworks: COMPLIANCE_FRAMEWORKS.map((fw) => ({
          id: fw.id,
          name: fw.name,
          full_name: fw.fullName,
          domain: fw.domain,
          total_wireless_requirements: fw.wirelessRequirements.length,
        })),
        comparison_matrix: comparison,
        universal_requirements: comparison.filter((c) => c.required_by_count >= 3).map((c) => c.category),
        framework_specific: comparison.filter((c) => c.required_by_count === 1).map((c) => ({
          category: c.category,
          unique_to: Object.entries(c.frameworks).find(([_, v]) => v.required)?.[0] ?? "unknown",
        })),
        recommendation: "Implement all 'universal requirements' first as they satisfy multiple frameworks simultaneously. Then address framework-specific requirements for your compliance scope.",
      },
    });
  },
};

// ─── Tool 4: compliance_report ───

const compliance_report: ToolDef = {
  name: "compliance_report",
  description: "Generate a formatted wireless compliance report. Takes framework and assessment findings (pass/fail per requirement) and produces a structured compliance report.",
  schema: {
    framework: z.enum(FRAMEWORK_IDS).describe("Compliance framework for the report"),
    findings: z.string().describe("Assessment findings as JSON array: [{\"requirement_id\": \"pci-1.2.3\", \"status\": \"pass\"|\"fail\", \"notes\": \"...\"}]"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const frameworkId = args.framework as string;
    const findingsRaw = args.findings as string;
    const framework = findFramework(frameworkId);

    if (!framework) {
      return text(`Framework '${frameworkId}' not found.`);
    }

    let findings: { requirement_id: string; status: string; notes?: string }[];
    try {
      findings = JSON.parse(findingsRaw);
    } catch {
      return text("Error: findings must be a valid JSON array. Example: [{\"requirement_id\":\"pci-1.2.3\",\"status\":\"pass\",\"notes\":\"WPA3 configured\"}]");
    }

    // Match findings to requirements
    const reportItems = framework.wirelessRequirements.map((req) => {
      const finding = findings.find(
        (f) => f.requirement_id === req.id || f.requirement_id === req.section
      );

      return {
        requirement_id: req.id,
        section: req.section,
        title: req.title,
        requirement: req.requirement,
        severity: req.severity,
        status: finding?.status?.toUpperCase() ?? "NOT TESTED",
        assessor_notes: finding?.notes ?? "",
        test_procedure: req.testProcedure,
      };
    });

    const passCount = reportItems.filter((r) => r.status === "PASS").length;
    const failCount = reportItems.filter((r) => r.status === "FAIL").length;
    const notTested = reportItems.filter((r) => r.status === "NOT TESTED").length;
    const total = reportItems.length;

    // Generate report
    const reportDate = new Date().toISOString().split("T")[0];
    const overallStatus = failCount === 0 && notTested === 0 ? "COMPLIANT" : failCount > 0 ? "NON-COMPLIANT" : "INCOMPLETE ASSESSMENT";

    const markdownReport = [
      `# Wireless Security Compliance Report`,
      `## ${framework.fullName}`,
      ``,
      `**Report Date:** ${reportDate}`,
      `**Framework:** ${framework.name}`,
      `**Domain:** ${framework.domain}`,
      `**Overall Status:** ${overallStatus}`,
      ``,
      `## Executive Summary`,
      ``,
      `| Metric | Count |`,
      `|--------|-------|`,
      `| Total Requirements | ${total} |`,
      `| Pass | ${passCount} |`,
      `| Fail | ${failCount} |`,
      `| Not Tested | ${notTested} |`,
      `| Compliance Rate | ${((passCount / total) * 100).toFixed(1)}% |`,
      ``,
      `## Detailed Findings`,
      ``,
      ...reportItems.map((item) => [
        `### ${item.section} — ${item.title}`,
        `**Status:** ${item.status} | **Severity:** ${item.severity}`,
        `**Requirement:** ${item.requirement}`,
        item.assessor_notes ? `**Notes:** ${item.assessor_notes}` : "",
        `**Test Procedure:** ${item.test_procedure}`,
        ``,
      ].filter(Boolean).join("\n")),
      `## Remediation Recommendations`,
      ``,
      ...reportItems.filter((r) => r.status === "FAIL").map((r) => `- **${r.section} ${r.title}** (${r.severity}): Address failing requirement`),
      ``,
      `## References`,
      ``,
      ...framework.references.map((r) => `- ${r}`),
    ].join("\n");

    return json({
      compliance_report: {
        framework: framework.name,
        report_date: reportDate,
        overall_status: overallStatus,
        summary: {
          total: total,
          pass: passCount,
          fail: failCount,
          not_tested: notTested,
          compliance_rate: `${((passCount / total) * 100).toFixed(1)}%`,
        },
        detailed_results: reportItems,
        markdown_report: markdownReport,
        failing_requirements: reportItems.filter((r) => r.status === "FAIL"),
      },
    });
  },
};

// ─── Export ───

export const complianceAuditTools: ToolDef[] = [
  compliance_check,
  compliance_gap_analysis,
  compliance_all_frameworks,
  compliance_report,
];

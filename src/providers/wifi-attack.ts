import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { WIFI_ATTACKS } from "../knowledge/index.js";
import type { WifiAttack } from "../knowledge/index.js";

const wifi_lookup_attack: ToolDef = {
  name: "wifi_lookup_attack",
  description: "Look up a specific WiFi attack by its ID from the knowledge base. Returns full attack details including description, tools, commands, mitigations, and severity.",
  schema: {
    attack_id: z.string().describe("Attack ID (e.g. 'krack', 'pmkid', 'evil_twin', 'deauth', 'wps_pin', 'dragonblood')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const attackId = (args.attack_id as string).toLowerCase().trim();

    const attack = WIFI_ATTACKS.find(
      (a) => a.id === attackId || a.id.replace(/_/g, "-") === attackId || a.id.replace(/-/g, "_") === attackId
    );

    if (!attack) {
      const available = WIFI_ATTACKS.map((a) => `${a.id} (${a.name})`).join("\n  - ");
      return json({
        error: `Attack '${attackId}' not found in knowledge base.`,
        available_attacks: available,
        suggestion: "Use wifi_search_attacks to search by protocol, category, or severity.",
      });
    }

    return json({
      attack: {
        ...attack,
        quick_summary: {
          id: attack.id,
          name: attack.name,
          severity: attack.severity,
          stealth: `${attack.stealthScore}/5 (${attack.stealthScore <= 2 ? "stealthy" : attack.stealthScore <= 3 ? "moderate" : "noisy"})`,
          affected_protocols: attack.protocols.join(", "),
          category: attack.category,
          cve_count: attack.cves.length,
          tool_count: attack.tools.length,
          command_count: attack.commands.length,
        },
      },
    });
  },
};

const wifi_search_attacks: ToolDef = {
  name: "wifi_search_attacks",
  description: "Search WiFi attacks in the knowledge base by protocol, category, severity, or maximum stealth score. Returns filtered attack summaries.",
  schema: {
    protocol: z.enum(["WPA", "WPA2", "WPA3", "WEP", "WPS", "EAP", "Open"]).optional().describe("Filter by target protocol"),
    category: z.enum(["handshake", "protocol", "implementation", "infrastructure", "client", "dos", "mitm"]).optional().describe("Filter by attack category"),
    severity: z.enum(["critical", "high", "medium", "low"]).optional().describe("Minimum severity level"),
    max_stealth: z.number().optional().describe("Maximum stealth score (1=stealthy, 5=noisy). Filter for stealthy attacks."),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const protocol = args.protocol as string | undefined;
    const category = args.category as string | undefined;
    const severity = args.severity as string | undefined;
    const maxStealth = args.max_stealth as number | undefined;

    const severityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

    let filtered = [...WIFI_ATTACKS];

    if (protocol) {
      filtered = filtered.filter((a) => a.protocols.includes(protocol as any));
    }

    if (category) {
      filtered = filtered.filter((a) => a.category === category);
    }

    if (severity) {
      const minLevel = severityOrder[severity] || 0;
      filtered = filtered.filter((a) => (severityOrder[a.severity] || 0) >= minLevel);
    }

    if (maxStealth !== undefined) {
      filtered = filtered.filter((a) => a.stealthScore <= maxStealth);
    }

    // Sort by severity desc, then stealth asc
    filtered.sort((a, b) => {
      const sevDiff = (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
      if (sevDiff !== 0) return sevDiff;
      return a.stealthScore - b.stealthScore;
    });

    return json({
      filters: {
        protocol: protocol ?? "any",
        category: category ?? "any",
        min_severity: severity ?? "any",
        max_stealth: maxStealth ?? "any",
      },
      total_matches: filtered.length,
      attacks: filtered.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        protocols: a.protocols,
        severity: a.severity,
        stealth_score: a.stealthScore,
        description: a.description,
        tools: a.tools,
        cve_count: a.cves.length,
        mitigations_count: a.mitigations.length,
      })),
    });
  },
};

const wifi_find_by_cve: ToolDef = {
  name: "wifi_find_by_cve",
  description: "Find WiFi attacks associated with a specific CVE identifier. Returns matching attacks with full details.",
  schema: {
    cve_id: z.string().describe("CVE identifier (e.g. 'CVE-2017-13077', 'CVE-2019-9494')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const cveId = (args.cve_id as string).toUpperCase().trim();

    // Normalize CVE format
    const normalizedCve = cveId.startsWith("CVE-") ? cveId : `CVE-${cveId}`;

    const matching = WIFI_ATTACKS.filter((a) =>
      a.cves.some((c) => c.toUpperCase() === normalizedCve)
    );

    if (matching.length === 0) {
      // Check if CVE exists but in a different format
      const partialMatch = WIFI_ATTACKS.filter((a) =>
        a.cves.some((c) => c.toUpperCase().includes(cveId.replace("CVE-", "")))
      );

      return json({
        cve: normalizedCve,
        matches: 0,
        attacks: [],
        suggestion: partialMatch.length > 0
          ? `Partial matches found for ${normalizedCve}: ${partialMatch.map((a) => a.id).join(", ")}`
          : "No attacks found for this CVE. The CVE may not be in the WiFi attack knowledge base.",
        all_cves_in_kb: [...new Set(WIFI_ATTACKS.flatMap((a) => a.cves))].sort(),
      });
    }

    return json({
      cve: normalizedCve,
      matches: matching.length,
      attacks: matching.map((a) => ({
        id: a.id,
        name: a.name,
        severity: a.severity,
        category: a.category,
        protocols: a.protocols,
        description: a.description,
        all_related_cves: a.cves,
        impact: a.impact,
        mitigations: a.mitigations,
        tools: a.tools,
      })),
    });
  },
};

const wifi_find_by_tool: ToolDef = {
  name: "wifi_find_by_tool",
  description: "Find WiFi attacks that use a specific tool. Returns all attacks where the tool is listed.",
  schema: {
    tool_name: z.string().describe("Tool name (e.g. 'aircrack-ng', 'hashcat', 'wifiphisher', 'mdk4', 'eaphammer')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const toolName = (args.tool_name as string).toLowerCase().trim();

    const matching = WIFI_ATTACKS.filter((a) =>
      a.tools.some((t) => t.toLowerCase().includes(toolName)) ||
      a.commands.some((c) => c.tool.toLowerCase().includes(toolName))
    );

    if (matching.length === 0) {
      const allTools = [...new Set(WIFI_ATTACKS.flatMap((a) => a.tools))].sort();
      return json({
        tool: toolName,
        matches: 0,
        attacks: [],
        available_tools: allTools,
        suggestion: `Tool '${toolName}' not found. Available tools: ${allTools.join(", ")}`,
      });
    }

    return json({
      tool: toolName,
      matches: matching.length,
      attacks: matching.map((a) => ({
        id: a.id,
        name: a.name,
        severity: a.severity,
        category: a.category,
        protocols: a.protocols,
        description: a.description,
        relevant_commands: a.commands
          .filter((c) => c.tool.toLowerCase().includes(toolName))
          .map((c) => ({ command: c.command, description: c.description })),
        all_tools: a.tools,
      })),
    });
  },
};

const wifi_attack_commands: ToolDef = {
  name: "wifi_attack_commands",
  description: "Get ready-to-use commands for a specific WiFi attack with placeholders filled in. Provides step-by-step command sequence.",
  schema: {
    attack_id: z.string().describe("Attack ID from knowledge base (e.g. 'pmkid', 'evil_twin', 'deauth')"),
    target_bssid: z.string().optional().describe("Target AP BSSID (e.g. 'AA:BB:CC:DD:EE:FF')"),
    target_ssid: z.string().optional().describe("Target network SSID"),
    client_mac: z.string().optional().describe("Target client MAC address"),
    interface: z.string().optional().describe("Wireless interface (default: wlan0mon)"),
    channel: z.number().optional().describe("Target channel number"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const attackId = (args.attack_id as string).toLowerCase().trim();
    const bssid = (args.target_bssid as string) || "<target_bssid>";
    const ssid = (args.target_ssid as string) || "<target_ssid>";
    const clientMac = (args.client_mac as string) || "<client_mac>";
    const iface = (args.interface as string) || "wlan0mon";
    const channel = args.channel as number | undefined;
    const channelStr = channel ? String(channel) : "<channel>";

    const attack = WIFI_ATTACKS.find(
      (a) => a.id === attackId || a.id.replace(/_/g, "-") === attackId || a.id.replace(/-/g, "_") === attackId
    );

    if (!attack) {
      return json({
        error: `Attack '${attackId}' not found.`,
        available: WIFI_ATTACKS.map((a) => a.id),
      });
    }

    // Replace placeholders in commands
    const filledCommands = attack.commands.map((cmd) => {
      let filled = cmd.command
        .replace(/<bssid>/gi, bssid)
        .replace(/<target_bssid>/gi, bssid)
        .replace(/<ssid>/gi, ssid)
        .replace(/<target_ssid>/gi, ssid)
        .replace(/'<ssid>'/gi, `'${ssid}'`)
        .replace(/'<target_ssid>'/gi, `'${ssid}'`)
        .replace(/<client_mac>/gi, clientMac)
        .replace(/<channel>/gi, channelStr)
        .replace(/<ch>/gi, channelStr)
        .replace(/wlan0mon/gi, iface)
        .replace(/wlan0/gi, iface.replace("mon", ""));

      return {
        step: cmd.description,
        tool: cmd.tool,
        command: filled,
      };
    });

    // Build prerequisite commands
    const prereqCommands: { step: string; command: string }[] = [
      { step: "Enable monitor mode", command: `airmon-ng start ${iface.replace("mon", "")}` },
    ];

    if (channel) {
      prereqCommands.push({
        step: "Set channel",
        command: `iwconfig ${iface} channel ${channel}`,
      });
    }

    return json({
      attack: {
        id: attack.id,
        name: attack.name,
        severity: attack.severity,
        stealth_score: attack.stealthScore,
      },
      parameters: {
        target_bssid: bssid,
        target_ssid: ssid,
        client_mac: clientMac,
        interface: iface,
        channel: channelStr,
      },
      prerequisites: attack.prerequisites,
      setup_commands: prereqCommands,
      attack_commands: filledCommands,
      required_tools: attack.tools,
      warnings: [
        "Ensure you have written authorization before performing any wireless attacks.",
        "These commands may cause denial of service to legitimate users.",
        attack.stealthScore >= 4
          ? "WARNING: This attack is noisy and likely to be detected by WIDS/WIPS."
          : "This attack has moderate stealth - monitor for WIDS alerts.",
      ],
    });
  },
};

export const wifiAttackTools: ToolDef[] = [
  wifi_lookup_attack,
  wifi_search_attacks,
  wifi_find_by_cve,
  wifi_find_by_tool,
  wifi_attack_commands,
];

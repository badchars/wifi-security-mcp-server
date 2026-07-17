import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import {
  WIFI_ATTACKS,
  BLUETOOTH_ATTACKS,
  RF_ATTACKS,
  NFC_RFID_ATTACKS,
  CELLULAR_ATTACKS,
  IOT_PROTOCOL_ATTACKS,
} from "../knowledge/index.js";

// ─── Helpers ───

type AnyAttack = {
  id: string;
  name: string;
  description: string;
  attckId: string;
  severity: string;
  tools: string[];
  mitigations: string[];
  category: string;
};

function getAttckId(a: Record<string, unknown>): string {
  return (a.attckId as string) ?? "";
}

function getAllAttacks(): AnyAttack[] {
  const all: AnyAttack[] = [];
  for (const a of WIFI_ATTACKS) all.push({ id: a.id, name: a.name, description: a.description, attckId: a.attckId, severity: a.severity, tools: a.tools, mitigations: a.mitigations, category: `wifi/${a.category}` });
  for (const a of BLUETOOTH_ATTACKS) all.push({ id: a.id, name: a.name, description: a.description, attckId: a.attckId, severity: a.severity, tools: a.tools, mitigations: a.mitigations, category: `bluetooth/${a.category}` });
  for (const a of RF_ATTACKS) all.push({ id: a.id, name: a.name, description: a.description, attckId: getAttckId(a as unknown as Record<string, unknown>), severity: a.severity, tools: a.tools, mitigations: a.mitigations, category: `rf/${a.category}` });
  for (const a of NFC_RFID_ATTACKS) all.push({ id: a.id, name: a.name, description: a.description, attckId: getAttckId(a as unknown as Record<string, unknown>), severity: a.severity, tools: a.tools, mitigations: a.mitigations, category: `nfc_rfid/${a.category}` });
  for (const a of CELLULAR_ATTACKS) all.push({ id: a.id, name: a.name, description: a.description, attckId: getAttckId(a as unknown as Record<string, unknown>), severity: a.severity, tools: a.tools, mitigations: a.mitigations, category: `cellular/${a.category}` });
  for (const a of IOT_PROTOCOL_ATTACKS) all.push({ id: a.id, name: a.name, description: a.description, attckId: getAttckId(a as unknown as Record<string, unknown>), severity: a.severity, tools: a.tools, mitigations: a.mitigations, category: `iot/${a.category}` });
  return all;
}

const TACTIC_MAP: Record<string, { name: string; description: string; techniquePatterns: string[] }> = {
  initial_access: { name: "Initial Access", description: "Techniques that use various wireless entry vectors to gain initial foothold in a network.", techniquePatterns: ["T1190", "T1133", "T1200", "T1078"] },
  execution: { name: "Execution", description: "Techniques that result in running adversary-controlled code via wireless vectors.", techniquePatterns: ["T1203", "T1059"] },
  persistence: { name: "Persistence", description: "Techniques used to maintain wireless access through reboots and credential changes.", techniquePatterns: ["T1098", "T1136", "T1556"] },
  privilege_escalation: { name: "Privilege Escalation", description: "Techniques to gain higher-level permissions via wireless exploitation.", techniquePatterns: ["T1068", "T1548"] },
  defense_evasion: { name: "Defense Evasion", description: "Techniques to avoid detection by wireless intrusion detection systems.", techniquePatterns: ["T1027", "T1070", "T1036"] },
  credential_access: { name: "Credential Access", description: "Techniques to steal wireless credentials (PSKs, EAP, RADIUS).", techniquePatterns: ["T1110", "T1557", "T1040", "T1212"] },
  discovery: { name: "Discovery", description: "Techniques used to discover wireless networks, clients, and infrastructure.", techniquePatterns: ["T1046", "T1018", "T1016", "T1049"] },
  lateral_movement: { name: "Lateral Movement", description: "Techniques to move through wireless network segments.", techniquePatterns: ["T1021", "T1563", "T1080"] },
  collection: { name: "Collection", description: "Techniques to gather wireless traffic and data.", techniquePatterns: ["T1560", "T1123", "T1119"] },
  exfiltration: { name: "Exfiltration", description: "Techniques to steal data over wireless channels.", techniquePatterns: ["T1048", "T1041", "T1011"] },
  c2: { name: "Command and Control", description: "Techniques using wireless channels for command and control.", techniquePatterns: ["T1071", "T1572", "T1573", "T1090"] },
  impact: { name: "Impact", description: "Techniques to disrupt wireless services and operations.", techniquePatterns: ["T1499", "T1498", "T1489", "T1561"] },
};

function getTacticForTechnique(techId: string): string[] {
  const tactics: string[] = [];
  for (const [tactic, info] of Object.entries(TACTIC_MAP)) {
    if (info.techniquePatterns.some((pat) => techId.startsWith(pat))) {
      tactics.push(tactic);
    }
  }
  // Fallback mapping for common wireless ATT&CK IDs
  if (tactics.length === 0) {
    if (techId.startsWith("T1557")) tactics.push("credential_access");
    if (techId.startsWith("T1040")) tactics.push("credential_access", "collection");
    if (techId.startsWith("T1110")) tactics.push("credential_access");
    if (techId.startsWith("T1499")) tactics.push("impact");
    if (techId.startsWith("T1200")) tactics.push("initial_access");
    if (techId.startsWith("T1046")) tactics.push("discovery");
  }
  if (tactics.length === 0) tactics.push("unknown");
  return tactics;
}

// ─── Tool 1: wireless_attck_lookup ───

const wireless_attck_lookup: ToolDef = {
  name: "wireless_attck_lookup",
  description: "Look up ATT&CK technique ID and return all wireless attacks mapped to that technique. Returns attack details, tools, and mitigations for the specified MITRE ATT&CK technique.",
  schema: {
    technique_id: z.string().describe("MITRE ATT&CK technique ID (e.g., 'T1557.002', 'T1110', 'T1040', 'T1499.002')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const techId = (args.technique_id as string).toUpperCase();
    const allAttacks = getAllAttacks();

    // Match exact or prefix
    const matches = allAttacks.filter(
      (a) => a.attckId.toUpperCase() === techId || a.attckId.toUpperCase().startsWith(techId)
    );

    if (matches.length === 0) {
      return json({
        technique_id: techId,
        matches: 0,
        message: `No wireless attacks mapped to ATT&CK technique '${techId}'.`,
        available_techniques: [...new Set(allAttacks.map((a) => a.attckId))].sort(),
      });
    }

    const tactics = getTacticForTechnique(techId);

    return json({
      attck_lookup: {
        technique_id: techId,
        mapped_tactics: tactics.map((t) => TACTIC_MAP[t]?.name ?? t),
        total_wireless_attacks: matches.length,
        attacks: matches.map((a) => ({
          id: a.id,
          name: a.name,
          category: a.category,
          severity: a.severity,
          description: a.description,
          attck_id: a.attckId,
          tools: a.tools,
          mitigations: a.mitigations,
        })),
      },
    });
  },
};

// ─── Tool 2: wireless_attck_coverage ───

const wireless_attck_coverage: ToolDef = {
  name: "wireless_attck_coverage",
  description: "Map wireless attack coverage across the full MITRE ATT&CK matrix. Returns how many wireless attacks map to each ATT&CK tactic, identifying coverage and gaps.",
  schema: {},
  async execute(_args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const allAttacks = getAllAttacks();
    const tacticCoverage: Record<string, { tactic_name: string; attack_count: number; technique_ids: string[]; attacks: { id: string; name: string; severity: string }[] }> = {};

    for (const [tacticKey, tacticInfo] of Object.entries(TACTIC_MAP)) {
      tacticCoverage[tacticKey] = {
        tactic_name: tacticInfo.name,
        attack_count: 0,
        technique_ids: [],
        attacks: [],
      };
    }
    tacticCoverage["unknown"] = { tactic_name: "Unmapped", attack_count: 0, technique_ids: [], attacks: [] };

    for (const attack of allAttacks) {
      const tactics = getTacticForTechnique(attack.attckId);
      for (const tactic of tactics) {
        const entry = tacticCoverage[tactic] || tacticCoverage["unknown"];
        entry.attack_count++;
        if (!entry.technique_ids.includes(attack.attckId)) {
          entry.technique_ids.push(attack.attckId);
        }
        entry.attacks.push({ id: attack.id, name: attack.name, severity: attack.severity });
      }
    }

    // Calculate coverage metrics
    const totalTactics = Object.keys(TACTIC_MAP).length;
    const coveredTactics = Object.entries(tacticCoverage)
      .filter(([k, v]) => k !== "unknown" && v.attack_count > 0).length;

    return json({
      attck_coverage: {
        total_wireless_attacks: allAttacks.length,
        total_attck_tactics: totalTactics,
        covered_tactics: coveredTactics,
        coverage_percentage: `${((coveredTactics / totalTactics) * 100).toFixed(1)}%`,
        by_tactic: Object.entries(tacticCoverage)
          .filter(([_, v]) => v.attack_count > 0)
          .sort((a, b) => b[1].attack_count - a[1].attack_count)
          .map(([key, value]) => ({
            tactic: key,
            tactic_name: value.tactic_name,
            attack_count: value.attack_count,
            unique_techniques: value.technique_ids.length,
            technique_ids: value.technique_ids,
          })),
        gaps: Object.entries(tacticCoverage)
          .filter(([k, v]) => k !== "unknown" && v.attack_count === 0)
          .map(([key, value]) => ({
            tactic: key,
            tactic_name: value.tactic_name,
            note: "No wireless attacks currently mapped to this tactic",
          })),
      },
    });
  },
};

// ─── Tool 3: wireless_attck_by_tactic ───

const wireless_attck_by_tactic: ToolDef = {
  name: "wireless_attck_by_tactic",
  description: "Get all wireless attacks mapped to a specific MITRE ATT&CK tactic. Returns detailed attack information organized by ATT&CK technique within the selected tactic.",
  schema: {
    tactic: z.enum([
      "initial_access", "execution", "persistence", "privilege_escalation",
      "defense_evasion", "credential_access", "discovery", "lateral_movement",
      "collection", "exfiltration", "c2", "impact",
    ]).describe("ATT&CK tactic to query"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const tactic = args.tactic as string;
    const tacticInfo = TACTIC_MAP[tactic];

    if (!tacticInfo) {
      return text(`Unknown tactic: '${tactic}'. Valid values: ${Object.keys(TACTIC_MAP).join(", ")}`);
    }

    const allAttacks = getAllAttacks();

    // Find attacks belonging to this tactic
    const tacticAttacks = allAttacks.filter((attack) => {
      const attackTactics = getTacticForTechnique(attack.attckId);
      return attackTactics.includes(tactic);
    });

    // Group by technique
    const byTechnique: Record<string, { technique_id: string; attacks: AnyAttack[] }> = {};
    for (const attack of tacticAttacks) {
      if (!byTechnique[attack.attckId]) {
        byTechnique[attack.attckId] = { technique_id: attack.attckId, attacks: [] };
      }
      byTechnique[attack.attckId].attacks.push(attack);
    }

    return json({
      tactic_attacks: {
        tactic,
        tactic_name: tacticInfo.name,
        description: tacticInfo.description,
        total_attacks: tacticAttacks.length,
        unique_techniques: Object.keys(byTechnique).length,
        by_technique: Object.values(byTechnique).map((group) => ({
          technique_id: group.technique_id,
          attacks: group.attacks.map((a) => ({
            id: a.id,
            name: a.name,
            category: a.category,
            severity: a.severity,
            description: a.description,
            tools: a.tools,
            mitigations: a.mitigations,
          })),
        })),
      },
    });
  },
};

// ─── Tool 4: wireless_attck_heatmap ───

const wireless_attck_heatmap: ToolDef = {
  name: "wireless_attck_heatmap",
  description: "Generate wireless ATT&CK heatmap data showing technique counts per tactic. Returns a structured dataset suitable for heatmap visualization of wireless attack coverage across the ATT&CK framework.",
  schema: {},
  async execute(_args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const allAttacks = getAllAttacks();

    // Build heatmap data: tactic -> technique -> count + severity
    const heatmap: Record<string, { tactic_name: string; techniques: Record<string, { count: number; max_severity: string; attacks: string[] }> }> = {};

    for (const [tacticKey, tacticInfo] of Object.entries(TACTIC_MAP)) {
      heatmap[tacticKey] = { tactic_name: tacticInfo.name, techniques: {} };
    }

    const severityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

    for (const attack of allAttacks) {
      const tactics = getTacticForTechnique(attack.attckId);
      for (const tactic of tactics) {
        if (!heatmap[tactic]) continue;
        if (!heatmap[tactic].techniques[attack.attckId]) {
          heatmap[tactic].techniques[attack.attckId] = { count: 0, max_severity: "low", attacks: [] };
        }
        const entry = heatmap[tactic].techniques[attack.attckId];
        entry.count++;
        entry.attacks.push(attack.name);
        if ((severityOrder[attack.severity] || 0) > (severityOrder[entry.max_severity] || 0)) {
          entry.max_severity = attack.severity;
        }
      }
    }

    // Summary rows for heatmap
    const heatmapRows = Object.entries(heatmap).map(([tacticKey, data]) => {
      const techniqueEntries = Object.entries(data.techniques);
      const totalAttacks = techniqueEntries.reduce((sum, [, t]) => sum + t.count, 0);
      const maxSev = techniqueEntries.reduce((max, [, t]) => {
        return (severityOrder[t.max_severity] || 0) > (severityOrder[max] || 0) ? t.max_severity : max;
      }, "low");

      return {
        tactic: tacticKey,
        tactic_name: data.tactic_name,
        technique_count: techniqueEntries.length,
        total_attacks: totalAttacks,
        max_severity: maxSev,
        intensity: totalAttacks === 0 ? "none" : totalAttacks <= 2 ? "low" : totalAttacks <= 5 ? "medium" : "high",
        techniques: techniqueEntries.map(([techId, info]) => ({
          technique_id: techId,
          attack_count: info.count,
          severity: info.max_severity,
          attacks: info.attacks,
        })),
      };
    });

    return json({
      attck_heatmap: {
        total_attacks: allAttacks.length,
        total_techniques: [...new Set(allAttacks.map((a) => a.attckId))].length,
        heatmap: heatmapRows.sort((a, b) => b.total_attacks - a.total_attacks),
        legend: {
          intensity: { none: "No attacks mapped", low: "1-2 attacks", medium: "3-5 attacks", high: "6+ attacks" },
          severity: { critical: "Critical impact", high: "High impact", medium: "Medium impact", low: "Low impact" },
        },
        most_targeted_tactic: heatmapRows.reduce((max, row) => row.total_attacks > max.total_attacks ? row : max, heatmapRows[0])?.tactic_name ?? "N/A",
        least_covered_tactics: heatmapRows.filter((r) => r.total_attacks === 0).map((r) => r.tactic_name),
      },
    });
  },
};

// ─── Export ───

export const wirelessAttckTools: ToolDef[] = [
  wireless_attck_lookup,
  wireless_attck_coverage,
  wireless_attck_by_tactic,
  wireless_attck_heatmap,
];

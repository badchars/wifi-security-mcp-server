import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { BLUETOOTH_ATTACKS } from "../knowledge/index.js";
import type { BluetoothAttack } from "../knowledge/index.js";

// ─── Helpers ───

function formatAttack(attack: BluetoothAttack) {
  return {
    id: attack.id,
    name: attack.name,
    category: attack.category,
    protocols: attack.protocols,
    cves: attack.cves,
    description: attack.description,
    impact: attack.impact,
    prerequisites: attack.prerequisites,
    tools: attack.tools,
    commands: attack.commands,
    mitigations: attack.mitigations,
    attckId: attack.attckId,
    severity: attack.severity,
    stealthScore: attack.stealthScore,
    references: attack.references,
  };
}

function severityToNum(s: string): number {
  switch (s) {
    case "critical": return 4;
    case "high": return 3;
    case "medium": return 2;
    case "low": return 1;
    default: return 0;
  }
}

// ─── Tool 1: bt_lookup_attack ───

const btLookupAttack: ToolDef = {
  name: "bt_lookup_attack",
  description:
    "Look up a Bluetooth attack by its unique ID from the BLUETOOTH_ATTACKS knowledge base. Returns full attack details including CVEs, prerequisites, tools, commands, and mitigations.",
  schema: {
    attack_id: z
      .string()
      .describe("The attack ID to look up (e.g. 'blueborne', 'knob', 'bluffs', 'bias', 'sweyntooth', 'ble_gatt_abuse')"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const attackId = (args.attack_id as string).toLowerCase().trim();

    const attack = BLUETOOTH_ATTACKS.find((a) => a.id === attackId);
    if (!attack) {
      const available = BLUETOOTH_ATTACKS.map((a) => `${a.id} (${a.name})`).join(", ");
      return text(`Attack '${attackId}' not found. Available Bluetooth attacks: ${available}`);
    }

    return json(formatAttack(attack));
  },
};

// ─── Tool 2: bt_search_attacks ───

const btSearchAttacks: ToolDef = {
  name: "bt_search_attacks",
  description:
    "Search Bluetooth attacks by criteria. Filter by protocol (BR/EDR, BLE, Mesh), category (classic, ble, mesh, protocol, implementation), severity level, or maximum stealth score.",
  schema: {
    protocol: z
      .enum(["BR/EDR", "BLE", "Mesh", "LE Audio"])
      .optional()
      .describe("Filter by Bluetooth protocol: BR/EDR, BLE, Mesh, or LE Audio"),
    category: z
      .enum(["classic", "ble", "mesh", "protocol", "implementation"])
      .optional()
      .describe("Filter by attack category"),
    severity: z
      .enum(["critical", "high", "medium", "low"])
      .optional()
      .describe("Filter by minimum severity level"),
    max_stealth: z
      .number()
      .optional()
      .describe("Filter by maximum stealth score (1=noisy, 5=very stealthy). Returns attacks at or below this stealth level."),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const protocol = args.protocol as string | undefined;
    const category = args.category as string | undefined;
    const severity = args.severity as string | undefined;
    const maxStealth = args.max_stealth as number | undefined;

    let results = [...BLUETOOTH_ATTACKS];

    if (protocol) {
      results = results.filter((a) => a.protocols.includes(protocol as any));
    }

    if (category) {
      results = results.filter((a) => a.category === category);
    }

    if (severity) {
      const minSev = severityToNum(severity);
      results = results.filter((a) => severityToNum(a.severity) >= minSev);
    }

    if (maxStealth !== undefined) {
      results = results.filter((a) => a.stealthScore <= maxStealth);
    }

    if (results.length === 0) {
      return text("No Bluetooth attacks found matching the specified criteria. Try broadening your search filters.");
    }

    // Sort by severity (highest first), then stealth (lowest first)
    results.sort((a, b) => {
      const sevDiff = severityToNum(b.severity) - severityToNum(a.severity);
      if (sevDiff !== 0) return sevDiff;
      return a.stealthScore - b.stealthScore;
    });

    return json({
      totalResults: results.length,
      filters: { protocol, category, severity, maxStealth },
      attacks: results.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        protocols: a.protocols,
        severity: a.severity,
        stealthScore: a.stealthScore,
        cves: a.cves,
        impact: a.impact,
        tools: a.tools,
      })),
    });
  },
};

// ─── Tool 3: bt_find_by_cve ───

const btFindByCve: ToolDef = {
  name: "bt_find_by_cve",
  description:
    "Find Bluetooth attacks associated with a specific CVE ID. Returns all matching attacks from the knowledge base with full details.",
  schema: {
    cve_id: z
      .string()
      .describe("CVE identifier to search for (e.g. 'CVE-2017-0781', 'CVE-2019-9506', 'CVE-2023-24023')"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const cveId = (args.cve_id as string).toUpperCase().trim();

    const matches = BLUETOOTH_ATTACKS.filter((a) =>
      a.cves.some((c) => c.toUpperCase() === cveId)
    );

    if (matches.length === 0) {
      // Check if CVE exists but isn't in Bluetooth attacks
      const allBtCves = BLUETOOTH_ATTACKS.flatMap((a) => a.cves);
      return json({
        cveId,
        found: false,
        message: `No Bluetooth attacks found for ${cveId}. Known Bluetooth CVEs: ${[...new Set(allBtCves)].join(", ") || "none with CVE IDs"}`,
      });
    }

    return json({
      cveId,
      found: true,
      matchCount: matches.length,
      attacks: matches.map(formatAttack),
    });
  },
};

// ─── Tool 4: bt_attack_commands ───

const btAttackCommands: ToolDef = {
  name: "bt_attack_commands",
  description:
    "Get executable attack commands for a specific Bluetooth attack. Optionally template a target address into the commands. Returns tool requirements and step-by-step execution commands.",
  schema: {
    attack_id: z
      .string()
      .describe("The attack ID (e.g. 'blueborne', 'ble_gatt_abuse', 'sweyntooth')"),
    target_address: z
      .string()
      .optional()
      .describe("Optional target Bluetooth address (XX:XX:XX:XX:XX:XX) to substitute into command templates"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const attackId = (args.attack_id as string).toLowerCase().trim();
    const targetAddress = args.target_address as string | undefined;

    const attack = BLUETOOTH_ATTACKS.find((a) => a.id === attackId);
    if (!attack) {
      const available = BLUETOOTH_ATTACKS.map((a) => `${a.id} (${a.name})`).join(", ");
      return text(`Attack '${attackId}' not found. Available: ${available}`);
    }

    // Template target address into commands
    const commands = attack.commands.map((cmd) => {
      let command = cmd.command;
      if (targetAddress) {
        command = command
          .replace(/<target_bt_addr>/g, targetAddress)
          .replace(/<bt_addr>/g, targetAddress)
          .replace(/<ble_addr>/g, targetAddress)
          .replace(/<target>/g, targetAddress)
          .replace(/<handle>/g, "0x0001")
          .replace(/<value>/g, "01");
      }
      return {
        tool: cmd.tool,
        command,
        description: cmd.description,
        targetTemplated: !!targetAddress,
      };
    });

    return json({
      attackId: attack.id,
      attackName: attack.name,
      severity: attack.severity,
      targetAddress: targetAddress || "not specified",
      prerequisites: attack.prerequisites,
      requiredTools: attack.tools,
      commands: commands.length > 0 ? commands : [
        {
          tool: "note",
          command: "No pre-built commands available for this attack.",
          description: "This attack requires custom tooling or manual exploitation. Refer to the references for proof-of-concept code.",
          targetTemplated: false,
        },
      ],
      setupNotes: [
        `Install required tools: ${attack.tools.join(", ")}`,
        "Ensure Bluetooth adapter supports monitor mode (Ubertooth recommended)",
        targetAddress ? `Target: ${targetAddress}` : "Specify target_address for templated commands",
      ],
      references: attack.references,
    });
  },
};

// ─── Tool 5: bt_assess_target ───

const btAssessTarget: ToolDef = {
  name: "bt_assess_target",
  description:
    "Assess Bluetooth attack feasibility against a target device. Analyzes the target's Bluetooth version, protocol, and Secure Connections setting to rank applicable attacks by feasibility.",
  schema: {
    bt_version: z
      .string()
      .describe("Target's Bluetooth version (e.g. '4.2', '5.0', '5.3')"),
    protocol: z
      .enum(["BR/EDR", "BLE", "Mesh"])
      .describe("Primary protocol in use on the target"),
    secure_connections: z
      .boolean()
      .optional()
      .describe("Whether Secure Connections mode is enabled on the target (default: unknown/false)"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const version = args.bt_version as string;
    const protocol = args.protocol as string;
    const secureConnections = (args.secure_connections as boolean) ?? false;
    const versionNum = parseFloat(version);

    interface AttackAssessment {
      id: string;
      name: string;
      severity: string;
      feasibility: "high" | "medium" | "low" | "unlikely";
      reason: string;
      cves: string[];
      tools: string[];
    }

    const assessments: AttackAssessment[] = [];

    for (const attack of BLUETOOTH_ATTACKS) {
      // Check protocol match
      const protocolMatch = attack.protocols.includes(protocol as any);
      if (!protocolMatch && protocol !== "Mesh") continue;

      let feasibility: "high" | "medium" | "low" | "unlikely" = "medium";
      let reason = "";

      // BlueBorne
      if (attack.id === "blueborne") {
        if (versionNum <= 4.2) {
          feasibility = "high";
          reason = "BlueBorne affects unpatched devices up to BT 4.2. Zero-click, no pairing required.";
        } else {
          feasibility = "low";
          reason = "BlueBorne primarily affects older implementations. Check if firmware is patched.";
        }
      }

      // KNOB
      else if (attack.id === "knob") {
        if (protocol === "BR/EDR" && versionNum >= 2.0 && versionNum < 5.1) {
          feasibility = "high";
          reason = "KNOB is a protocol-level flaw in BR/EDR key negotiation for BT 2.0-5.0.";
        } else if (versionNum >= 5.1) {
          feasibility = "low";
          reason = "BT 5.1+ should have KNOB mitigation, but verify firmware patch.";
        } else {
          feasibility = "unlikely";
          reason = "KNOB only affects BR/EDR connections.";
        }
      }

      // BLURtooth
      else if (attack.id === "blurtooth") {
        if (versionNum >= 4.0 && versionNum <= 5.0) {
          feasibility = "high";
          reason = "BLURtooth CTKD flaw affects dual-mode BT 4.0-5.0 devices.";
        } else {
          feasibility = "unlikely";
          reason = "BT 5.1+ has CTKD restrictions.";
        }
      }

      // BLUFFS
      else if (attack.id === "bluffs") {
        if (protocol === "BR/EDR" && versionNum >= 4.2 && versionNum <= 5.4) {
          feasibility = secureConnections ? "medium" : "high";
          reason = secureConnections
            ? "BLUFFS still possible with SC but requires more effort."
            : "BLUFFS is highly effective without Secure Connections on BT 4.2-5.4.";
        } else {
          feasibility = "low";
          reason = "BLUFFS primarily targets BR/EDR sessions.";
        }
      }

      // SweynTooth
      else if (attack.id === "sweyntooth") {
        if (protocol === "BLE" && versionNum >= 4.0) {
          feasibility = "medium";
          reason = "SweynTooth affects specific BLE SoCs. Check if target uses TI, NXP, Cypress, Dialog, STMicro, Microchip, or Telink chipsets.";
        } else {
          feasibility = "unlikely";
          reason = "SweynTooth only affects BLE SoCs.";
        }
      }

      // BIAS
      else if (attack.id === "bias") {
        if (protocol === "BR/EDR" && !secureConnections) {
          feasibility = "high";
          reason = "BIAS exploits legacy authentication. Without SC, impersonation is straightforward.";
        } else if (protocol === "BR/EDR" && secureConnections) {
          feasibility = "medium";
          reason = "BIAS can still work with SC via role-switch downgrade attacks.";
        } else {
          feasibility = "unlikely";
          reason = "BIAS targets BR/EDR authentication only.";
        }
      }

      // BLE GATT Abuse
      else if (attack.id === "ble_gatt_abuse") {
        if (protocol === "BLE") {
          feasibility = secureConnections ? "medium" : "high";
          reason = secureConnections
            ? "GATT abuse may be limited if characteristics require authenticated connections."
            : "Many BLE devices expose GATT services without authentication.";
        } else {
          feasibility = "unlikely";
          reason = "GATT abuse only applies to BLE devices.";
        }
      }

      // BLE Jamming
      else if (attack.id === "ble_jamming") {
        if (protocol === "BLE") {
          feasibility = "high";
          reason = "BLE advertising channel jamming is always feasible with appropriate hardware (Ubertooth/HackRF).";
        } else {
          feasibility = "low";
          reason = "BLE jamming targets advertising channels specifically.";
        }
      }

      // Generic
      else {
        reason = `${attack.name} may apply to BT ${version} (${protocol}).`;
      }

      assessments.push({
        id: attack.id,
        name: attack.name,
        severity: attack.severity,
        feasibility,
        reason,
        cves: attack.cves,
        tools: attack.tools,
      });
    }

    // Sort by feasibility (high > medium > low > unlikely) then severity
    const feasibilityOrder: Record<string, number> = { high: 4, medium: 3, low: 2, unlikely: 1 };
    assessments.sort((a, b) => {
      const feasDiff = feasibilityOrder[b.feasibility] - feasibilityOrder[a.feasibility];
      if (feasDiff !== 0) return feasDiff;
      return severityToNum(b.severity) - severityToNum(a.severity);
    });

    const highFeasibility = assessments.filter((a) => a.feasibility === "high");

    return json({
      target: {
        btVersion: version,
        protocol,
        secureConnections,
      },
      summary: {
        totalApplicable: assessments.length,
        highFeasibility: highFeasibility.length,
        mediumFeasibility: assessments.filter((a) => a.feasibility === "medium").length,
        lowFeasibility: assessments.filter((a) => a.feasibility === "low").length,
        unlikely: assessments.filter((a) => a.feasibility === "unlikely").length,
      },
      overallRisk: highFeasibility.length > 0
        ? (highFeasibility.some((a) => a.severity === "critical") ? "critical" : "high")
        : "medium",
      assessments,
      recommendations: [
        !secureConnections ? "Enable Secure Connections (SC) mode to mitigate BIAS, BLUFFS, and reduce GATT abuse risk" : null,
        versionNum < 5.1 ? `Upgrade from BT ${version} to 5.1+ for KNOB, BLURtooth, and BLUFFS mitigations` : null,
        protocol === "BLE" ? "Audit GATT services for unauthenticated read/write characteristics" : null,
        "Keep firmware and Bluetooth stack up to date",
        "Disable Bluetooth when not actively in use",
      ].filter(Boolean),
    });
  },
};

// ─── Export All Bluetooth Attack Tools ───

export const bluetoothAttackTools: ToolDef[] = [
  btLookupAttack,
  btSearchAttacks,
  btFindByCve,
  btAttackCommands,
  btAssessTarget,
];

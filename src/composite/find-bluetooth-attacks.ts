import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { bluetoothAttackTools } from "../providers/bluetooth-attack.js";

// ─── Resolve individual tools by name ───

const toolMap = new Map(bluetoothAttackTools.map((t) => [t.name, t]));
const lookupAttack = toolMap.get("bt_lookup_attack")!;
const searchAttacks = toolMap.get("bt_search_attacks")!;
const findByCve = toolMap.get("bt_find_by_cve")!;
const attackCommands = toolMap.get("bt_attack_commands")!;
const assessTarget = toolMap.get("bt_assess_target")!;

// ─── Composite Tool ───

const findBluetoothAttacks: ToolDef = {
  name: "find_bluetooth_attacks",
  description:
    "Bluetooth attack technique lookup — search by CVE, protocol (BR/EDR, BLE, Mesh), severity, category. Get attack commands and assess target feasibility.",
  schema: {
    mode: z
      .enum(["lookup", "search", "by_cve", "commands", "assess_target"])
      .describe("Operation mode: lookup (by ID), search (by criteria), by_cve (CVE search), commands (get attack commands), assess_target (feasibility analysis)"),

    // lookup / commands params
    attack_id: z
      .string()
      .optional()
      .describe("[lookup, commands] Attack ID (e.g. 'blueborne', 'knob', 'bluffs', 'ble_gatt_abuse')"),

    // search params
    protocol: z
      .enum(["BR/EDR", "BLE", "Mesh", "LE Audio"])
      .optional()
      .describe("[search, assess_target] Filter by Bluetooth protocol"),
    category: z
      .enum(["classic", "ble", "mesh", "protocol", "implementation"])
      .optional()
      .describe("[search] Filter by attack category"),
    severity: z
      .enum(["critical", "high", "medium", "low"])
      .optional()
      .describe("[search] Filter by minimum severity level"),
    max_stealth: z
      .number()
      .optional()
      .describe("[search] Maximum stealth score (1-5)"),

    // by_cve params
    cve_id: z
      .string()
      .optional()
      .describe("[by_cve] CVE identifier (e.g. 'CVE-2017-0781', 'CVE-2023-24023')"),

    // commands params
    target_address: z
      .string()
      .optional()
      .describe("[commands] Target Bluetooth address for command templating"),

    // assess_target params
    bt_version: z
      .string()
      .optional()
      .describe("[assess_target] Target's Bluetooth version (e.g. '4.2', '5.0')"),
    secure_connections: z
      .boolean()
      .optional()
      .describe("[assess_target] Whether Secure Connections is enabled on target"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "lookup": {
        if (!args.attack_id) return text("attack_id is required for lookup mode.");
        return lookupAttack.execute({ attack_id: args.attack_id }, ctx);
      }

      case "search": {
        return searchAttacks.execute({
          protocol: args.protocol,
          category: args.category,
          severity: args.severity,
          max_stealth: args.max_stealth,
        }, ctx);
      }

      case "by_cve": {
        if (!args.cve_id) return text("cve_id is required for by_cve mode.");
        return findByCve.execute({ cve_id: args.cve_id }, ctx);
      }

      case "commands": {
        if (!args.attack_id) return text("attack_id is required for commands mode.");
        return attackCommands.execute({
          attack_id: args.attack_id,
          target_address: args.target_address,
        }, ctx);
      }

      case "assess_target": {
        if (!args.bt_version) return text("bt_version is required for assess_target mode.");
        if (!args.protocol) return text("protocol is required for assess_target mode (BR/EDR, BLE, or Mesh).");
        return assessTarget.execute({
          bt_version: args.bt_version,
          protocol: args.protocol,
          secure_connections: args.secure_connections,
        }, ctx);
      }

      default:
        return text(`Unknown mode '${mode}'. Valid modes: lookup, search, by_cve, commands, assess_target`);
    }
  },
};

export default findBluetoothAttacks;

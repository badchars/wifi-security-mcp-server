import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { nfcRfidTools } from "../providers/nfc-rfid.js";

// ─── Resolve individual tools by name ───

const toolMap = new Map(nfcRfidTools.map((t) => [t.name, t]));
const lookupAttack = toolMap.get("nfc_lookup_attack")!;
const searchAttacks = toolMap.get("nfc_search_attacks")!;
const cardIdentify = toolMap.get("nfc_card_identify")!;
const cloneGuide = toolMap.get("nfc_clone_guide")!;
const defense = toolMap.get("nfc_defense")!;

// ─── Composite Tool ───

const analyzeNfc: ToolDef = {
  name: "analyze_nfc_security",
  description:
    "NFC/RFID security analysis — card identification, attack lookup, cloning guides (Mifare, HID, EM4100), EMV relay analysis, defense recommendations.",
  schema: {
    mode: z
      .enum(["lookup_attack", "search_attacks", "identify_card", "clone_guide", "defense"])
      .describe("Operation mode: lookup_attack (by ID), search_attacks (by criteria), identify_card (from scan params), clone_guide (step-by-step cloning), defense (security recommendations)"),

    // lookup_attack params
    attack_id: z
      .string()
      .optional()
      .describe("[lookup_attack] NFC/RFID attack ID (e.g. 'mifare_classic_darkside', 'emv_relay', 'lf_clone')"),

    // search_attacks params
    category: z
      .enum(["nfc", "rfid_lf", "rfid_hf", "rfid_uhf", "emv", "access_card"])
      .optional()
      .describe("[search_attacks] Filter by attack category"),
    frequency: z
      .string()
      .optional()
      .describe("[search_attacks] Filter by frequency (e.g. '125 kHz', '13.56 MHz')"),
    protocol: z
      .string()
      .optional()
      .describe("[search_attacks] Filter by protocol name (e.g. 'Mifare', 'HID', 'EM4100')"),

    // identify_card params
    uid_length: z
      .number()
      .optional()
      .describe("[identify_card] UID length in bytes"),
    atqa: z
      .string()
      .optional()
      .describe("[identify_card] ATQA value as hex string (HF cards)"),
    sak: z
      .string()
      .optional()
      .describe("[identify_card] SAK value as hex string (HF cards)"),
    data_rate: z
      .string()
      .optional()
      .describe("[identify_card] Data rate for LF cards"),
    modulation: z
      .string()
      .optional()
      .describe("[identify_card] Modulation type for LF cards"),

    // clone_guide params
    card_type: z
      .enum(["em4100", "hid_prox", "mifare_classic", "mifare_desfire", "iclass", "ntag"])
      .optional()
      .describe("[clone_guide] Card type to clone"),
    known_keys: z
      .string()
      .optional()
      .describe("[clone_guide] Known sector keys as comma-separated hex (for Mifare Classic)"),

    // defense params
    deployment: z
      .enum(["physical_access", "payment", "inventory"])
      .optional()
      .describe("[defense] Deployment type for defense recommendations"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "lookup_attack": {
        if (!args.attack_id) return text("attack_id is required for lookup_attack mode.");
        return lookupAttack.execute({ attack_id: args.attack_id }, ctx);
      }

      case "search_attacks": {
        return searchAttacks.execute({
          category: args.category,
          frequency: args.frequency,
          protocol: args.protocol,
        }, ctx);
      }

      case "identify_card": {
        if (!args.uid_length && !args.atqa && !args.sak && !args.data_rate && !args.modulation) {
          return text("At least one identification parameter is required for identify_card mode: uid_length, atqa, sak, data_rate, or modulation.");
        }
        return cardIdentify.execute({
          uid_length: args.uid_length,
          atqa: args.atqa,
          sak: args.sak,
          data_rate: args.data_rate,
          modulation: args.modulation,
        }, ctx);
      }

      case "clone_guide": {
        if (!args.card_type) return text("card_type is required for clone_guide mode.");
        return cloneGuide.execute({
          card_type: args.card_type,
          known_keys: args.known_keys,
        }, ctx);
      }

      case "defense": {
        if (!args.deployment) return text("deployment is required for defense mode.");
        return defense.execute({ deployment: args.deployment }, ctx);
      }

      default:
        return text(`Unknown mode '${mode}'. Valid modes: lookup_attack, search_attacks, identify_card, clone_guide, defense`);
    }
  },
};

export default analyzeNfc;

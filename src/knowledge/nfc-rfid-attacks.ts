export interface NfcRfidAttack {
  id: string;
  name: string;
  category: "nfc" | "rfid_lf" | "rfid_hf" | "rfid_uhf" | "emv" | "access_card";
  frequency: string;
  protocols: string[];
  cves: string[];
  description: string;
  impact: string;
  prerequisites: string[];
  tools: string[];
  commands: { tool: string; command: string; description: string }[];
  mitigations: string[];
  severity: "critical" | "high" | "medium" | "low";
  stealthScore: number;
  references: string[];
}

export const NFC_RFID_ATTACKS: NfcRfidAttack[] = [
  {
    id: "mifare_classic_darkside",
    name: "Mifare Classic Darkside Attack",
    category: "rfid_hf",
    frequency: "13.56 MHz",
    protocols: ["Mifare Classic", "ISO 14443-A"],
    cves: ["CVE-2008-1751"],
    description: "Exploit weak PRNG in Mifare Classic to recover secret keys without knowing any key. Uses parity bits from failed authentication attempts to derive the crypto key.",
    impact: "Clone access cards, bypass physical access controls, read/write card data",
    prerequisites: ["Proxmark3 or compatible reader", "Physical proximity to card (~5cm)", "Mifare Classic card (not Plus/DESFire)"],
    tools: ["proxmark3", "mfoc", "libnfc", "flipper-zero"],
    commands: [
      { tool: "proxmark3", command: "hf mf darkside", description: "Execute Darkside attack to recover first key" },
      { tool: "proxmark3", command: "hf mf autopwn", description: "Automated key recovery + dump" },
      { tool: "mfoc", command: "mfoc -O card_dump.mfd", description: "Dump entire Mifare Classic card" },
    ],
    mitigations: ["Migrate to Mifare DESFire EV2/EV3", "Use diversified keys per card", "Implement additional server-side validation"],
    severity: "high",
    stealthScore: 1,
    references: ["https://www.cs.ru.nl/~flaviog/publications/Attack.MIFARE.pdf"],
  },
  {
    id: "mifare_hardnested",
    name: "Mifare Classic Hardnested Attack",
    category: "rfid_hf",
    frequency: "13.56 MHz",
    protocols: ["Mifare Classic", "ISO 14443-A"],
    cves: [],
    description: "Advanced key recovery attack for Mifare Classic when one key is known (e.g., default key on one sector). Uses statistical analysis of nested authentication to recover remaining keys.",
    impact: "Recover all sector keys, full card clone, bypass access controls",
    prerequisites: ["At least one known sector key", "Proxmark3", "Physical proximity to card"],
    tools: ["proxmark3", "libnfc"],
    commands: [
      { tool: "proxmark3", command: "hf mf hardnested --blk 0 -a -k FFFFFFFFFFFF --tblk 4 --ta", description: "Hardnested attack from known key to target sector" },
      { tool: "proxmark3", command: "hf mf dump", description: "Dump card with recovered keys" },
      { tool: "proxmark3", command: "hf mf restore", description: "Write dump to blank card (clone)" },
    ],
    mitigations: ["Upgrade to Mifare DESFire", "Remove default keys from all sectors", "Use per-card diversified keys"],
    severity: "high",
    stealthScore: 1,
    references: [],
  },
  {
    id: "hid_iclass_clone",
    name: "HID iCLASS Card Cloning",
    category: "access_card",
    frequency: "13.56 MHz",
    protocols: ["HID iCLASS", "ISO 15693"],
    cves: [],
    description: "Clone HID iCLASS cards using known master keys (loclass attack) or by dumping card data directly. HID iCLASS Standard uses a weak key diversification scheme.",
    impact: "Physical access bypass, clone employee badges, unauthorized building entry",
    prerequisites: ["Proxmark3 with iCLASS support", "Physical proximity to card", "For SE: known master key or loclass attack"],
    tools: ["proxmark3", "chameleon-mini"],
    commands: [
      { tool: "proxmark3", command: "hf iclass dump", description: "Dump iCLASS card data" },
      { tool: "proxmark3", command: "hf iclass clone", description: "Clone iCLASS card to blank" },
      { tool: "proxmark3", command: "hf iclass loclass", description: "Recover iCLASS keys via loclass" },
    ],
    mitigations: ["Upgrade to iCLASS SE/SEOS with Elite keys", "Use multi-factor access (card + PIN)", "Monitor for cloned badge usage patterns"],
    severity: "critical",
    stealthScore: 1,
    references: [],
  },
  {
    id: "emv_relay",
    name: "EMV Contactless Relay Attack",
    category: "emv",
    frequency: "13.56 MHz",
    protocols: ["EMV", "ISO 14443"],
    cves: [],
    description: "Relay NFC communication between a payment terminal and a victim's contactless card over a network link. Attacker's device near card relays to another device near terminal.",
    impact: "Fraudulent contactless payments, bypass distance requirement",
    prerequisites: ["Two NFC-capable devices (Android phones)", "One near victim's card, one near payment terminal", "Low-latency relay link"],
    tools: ["nfcgate", "proxmark3", "custom-android-app"],
    commands: [
      { tool: "nfcgate", command: "NFCGate relay mode — Reader device at terminal, Tag device near victim card", description: "Execute EMV relay via NFCGate Android app" },
    ],
    mitigations: ["Implement distance bounding in EMV protocol", "Use offline PIN for higher amounts", "Transaction velocity checks", "Use payment tokenization"],
    severity: "high",
    stealthScore: 1,
    references: ["https://github.com/nfcgate/nfcgate"],
  },
  {
    id: "lf_clone",
    name: "LF RFID Card Cloning (125 kHz)",
    category: "rfid_lf",
    frequency: "125 kHz",
    protocols: ["EM4100", "HID Prox", "AWID", "Indala"],
    cves: [],
    description: "Clone low-frequency (125 kHz) access cards. These cards transmit a fixed ID with no encryption or authentication. Trivial to clone with inexpensive hardware.",
    impact: "Clone physical access cards, bypass building security",
    prerequisites: ["LF RFID reader (Proxmark3, Flipper Zero)", "Physical proximity to card (~5cm, extendable with antenna)", "Blank T5577 writable cards"],
    tools: ["proxmark3", "flipper-zero", "rfid-cloner"],
    commands: [
      { tool: "proxmark3", command: "lf search", description: "Auto-detect LF card type" },
      { tool: "proxmark3", command: "lf em 410x read", description: "Read EM4100 card ID" },
      { tool: "proxmark3", command: "lf em 410x clone --id <card_id>", description: "Clone EM4100 to T5577 blank" },
      { tool: "proxmark3", command: "lf hid read", description: "Read HID Prox card" },
      { tool: "proxmark3", command: "lf hid clone -w H10301 --fc <facility_code> --cn <card_number>", description: "Clone HID Prox card" },
      { tool: "flipper-zero", command: "125 kHz RFID > Read > Save > Emulate", description: "Read and emulate LF card with Flipper Zero" },
    ],
    mitigations: ["Upgrade to 13.56 MHz encrypted cards (DESFire, SEOS)", "Use multi-factor (card + PIN/biometric)", "Monitor for duplicate card usage"],
    severity: "high",
    stealthScore: 1,
    references: [],
  },
  {
    id: "nfc_ndef_injection",
    name: "NFC NDEF Tag Injection",
    category: "nfc",
    frequency: "13.56 MHz",
    protocols: ["NFC NDEF", "ISO 14443"],
    cves: [],
    description: "Write malicious NDEF records to NFC tags — phishing URLs, WiFi credential prompts, app launch payloads. Exploit auto-action features on smartphones that scan NFC tags.",
    impact: "Phishing via NFC, WiFi credential theft, malicious app launch",
    prerequisites: ["NFC writer device", "Physical access to place/replace NFC tag", "Target smartphone has NFC auto-read enabled"],
    tools: ["proxmark3", "nfc-tools-app", "flipper-zero", "libnfc"],
    commands: [
      { tool: "proxmark3", command: "hf mfu wrbl -b 4 -d <ndef_payload>", description: "Write NDEF payload to NFC tag" },
    ],
    mitigations: ["Disable NFC auto-action on phones", "Verify NFC tag authenticity before acting", "Use NFC tag tamper detection"],
    severity: "medium",
    stealthScore: 1,
    references: [],
  },
];

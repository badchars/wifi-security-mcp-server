import { WIFI_ATTACKS } from "./wifi-attacks.js";
import { BLUETOOTH_ATTACKS } from "./bluetooth-attacks.js";
import { RF_ATTACKS } from "./rf-attacks.js";
import { NFC_RFID_ATTACKS } from "./nfc-rfid-attacks.js";
import { CELLULAR_ATTACKS } from "./cellular-attacks.js";
import { IOT_PROTOCOL_ATTACKS } from "./iot-protocols.js";
import { PENTEST_HARDWARE } from "./hardware-db.js";
import { WIRELESS_CVES } from "./cve-db.js";
import { COMPLIANCE_FRAMEWORKS } from "./compliance.js";

export { WIFI_ATTACKS, BLUETOOTH_ATTACKS, RF_ATTACKS, NFC_RFID_ATTACKS, CELLULAR_ATTACKS, IOT_PROTOCOL_ATTACKS, PENTEST_HARDWARE, WIRELESS_CVES, COMPLIANCE_FRAMEWORKS };

export type { WifiAttack } from "./wifi-attacks.js";
export type { BluetoothAttack } from "./bluetooth-attacks.js";
export type { RfAttack } from "./rf-attacks.js";
export type { NfcRfidAttack } from "./nfc-rfid-attacks.js";
export type { CellularAttack } from "./cellular-attacks.js";
export type { IoTProtocolAttack } from "./iot-protocols.js";
export type { PentestHardware } from "./hardware-db.js";
export type { WirelessCVE } from "./cve-db.js";
export type { ComplianceFramework, ComplianceRequirement } from "./compliance.js";

// Unified search across all knowledge bases
export type WirelessDomain = "wifi" | "bluetooth" | "rf" | "nfc_rfid" | "cellular" | "iot" | "uwb";

export interface KnowledgeSearchResult {
  domain: WirelessDomain;
  type: "attack" | "cve" | "hardware" | "compliance";
  id: string;
  name: string;
  description: string;
  severity?: string;
  relevance: number;
}

export function searchKnowledge(query: string): KnowledgeSearchResult[] {
  const q = query.toLowerCase();
  const results: KnowledgeSearchResult[] = [];

  for (const attack of WIFI_ATTACKS) {
    const text = `${attack.name} ${attack.description} ${attack.tools.join(" ")} ${attack.cves.join(" ")}`.toLowerCase();
    if (text.includes(q)) {
      results.push({ domain: "wifi", type: "attack", id: attack.id, name: attack.name, description: attack.description, severity: attack.severity, relevance: text.split(q).length - 1 });
    }
  }

  for (const attack of BLUETOOTH_ATTACKS) {
    const text = `${attack.name} ${attack.description} ${attack.tools.join(" ")} ${attack.cves.join(" ")}`.toLowerCase();
    if (text.includes(q)) {
      results.push({ domain: "bluetooth", type: "attack", id: attack.id, name: attack.name, description: attack.description, severity: attack.severity, relevance: text.split(q).length - 1 });
    }
  }

  for (const attack of RF_ATTACKS) {
    const text = `${attack.name} ${attack.description} ${attack.tools.join(" ")} ${attack.cves.join(" ")}`.toLowerCase();
    if (text.includes(q)) {
      results.push({ domain: "rf", type: "attack", id: attack.id, name: attack.name, description: attack.description, severity: attack.severity, relevance: text.split(q).length - 1 });
    }
  }

  for (const attack of NFC_RFID_ATTACKS) {
    const text = `${attack.name} ${attack.description} ${attack.tools.join(" ")} ${attack.cves.join(" ")}`.toLowerCase();
    if (text.includes(q)) {
      results.push({ domain: "nfc_rfid", type: "attack", id: attack.id, name: attack.name, description: attack.description, severity: attack.severity, relevance: text.split(q).length - 1 });
    }
  }

  for (const attack of CELLULAR_ATTACKS) {
    const text = `${attack.name} ${attack.description} ${attack.tools.join(" ")} ${attack.cves.join(" ")}`.toLowerCase();
    if (text.includes(q)) {
      results.push({ domain: "cellular", type: "attack", id: attack.id, name: attack.name, description: attack.description, severity: attack.severity, relevance: text.split(q).length - 1 });
    }
  }

  for (const attack of IOT_PROTOCOL_ATTACKS) {
    const text = `${attack.name} ${attack.description} ${attack.tools.join(" ")} ${attack.cves.join(" ")}`.toLowerCase();
    if (text.includes(q)) {
      results.push({ domain: "iot", type: "attack", id: attack.id, name: attack.name, description: attack.description, severity: attack.severity, relevance: text.split(q).length - 1 });
    }
  }

  for (const cve of WIRELESS_CVES) {
    const text = `${cve.cveId} ${cve.name} ${cve.description} ${cve.affectedProducts.join(" ")}`.toLowerCase();
    if (text.includes(q)) {
      results.push({ domain: cve.domain as WirelessDomain, type: "cve", id: cve.id, name: `${cve.cveId}: ${cve.name}`, description: cve.description, severity: cve.severity, relevance: text.split(q).length - 1 });
    }
  }

  for (const hw of PENTEST_HARDWARE) {
    const text = `${hw.name} ${hw.description} ${hw.capabilities.join(" ")} ${hw.protocols.join(" ")}`.toLowerCase();
    if (text.includes(q)) {
      results.push({ domain: hw.category === "multi" ? "rf" : hw.category as WirelessDomain, type: "hardware", id: hw.id, name: hw.name, description: hw.description, relevance: text.split(q).length - 1 });
    }
  }

  return results.sort((a, b) => b.relevance - a.relevance);
}

#!/usr/bin/env node

import type { ToolContext } from "./types/index.js";
import { startMcpStdio } from "./protocol/mcp-server.js";
import { allTools } from "./protocol/tools.js";

// ─── Build ToolContext from Environment ───

function buildToolContext(): ToolContext {
  return {
    config: {
      wigleApiKey: process.env.WIGLE_API_KEY,
      kismetHost: process.env.KISMET_HOST,
      kismetPort: process.env.KISMET_PORT ? parseInt(process.env.KISMET_PORT, 10) : undefined,
      kismetApiKey: process.env.KISMET_API_KEY,
    },
  };
}

// ─── Tool Categories for --list display ───

const TOOL_CATEGORIES: { category: string; names: string[] }[] = [
  { category: "WiFi Scanning & Analysis", names: ["scan_wifi_networks", "analyze_wifi_security", "find_wifi_attacks", "analyze_wpa_security", "analyze_pmkid", "audit_wifi67"] },
  { category: "WiFi Attacks", names: ["simulate_evil_twin", "analyze_deauth", "crack_wps"] },
  { category: "Bluetooth", names: ["scan_bluetooth", "find_bluetooth_attacks", "analyze_ble"] },
  { category: "RF / SDR", names: ["analyze_rf_signal"] },
  { category: "NFC / RFID", names: ["analyze_nfc_security"] },
  { category: "Cellular / 5G", names: ["analyze_cellular_security"] },
  { category: "IoT Protocols", names: ["analyze_zigbee", "scan_iot_wireless", "find_mousejack"] },
  { category: "Advanced Wireless", names: ["analyze_airgap", "analyze_uwb", "analyze_wifi_csi", "analyze_miracast", "analyze_wifi_direct", "analyze_drone_rf"] },
  { category: "Infrastructure", names: ["audit_wlan_controller", "analyze_captive_portal", "detect_mac_randomization", "analyze_hotspot20"] },
  { category: "Intelligence & Reference", names: ["lookup_wireless_cve", "lookup_hardware", "map_wireless_attck", "analyze_medical_wireless"] },
  { category: "Detection & Compliance", names: ["detect_wireless_attack", "audit_wireless_compliance"] },
  { category: "Reporting", names: ["export_report"] },
];

function categorize(toolName: string): string {
  for (const { category, names } of TOOL_CATEGORIES) {
    if (names.includes(toolName)) return category;
  }
  return "Other";
}

// ─── CLI: --help ───

function printHelp(): void {
  console.log(`wifi-security-mcp — Full-Spectrum Wireless Security MCP Server

USAGE:
  wifi-security-mcp-server              Start MCP server on stdio
  wifi-security-mcp-server --help       Show this help message
  wifi-security-mcp-server --list       List all ${allTools.length} composite tools grouped by category

ENVIRONMENT VARIABLES:
  WIGLE_API_KEY              WiGLE API key (WiFi geolocation lookups)
  KISMET_HOST                Kismet server host (default: localhost)
  KISMET_PORT                Kismet server port (default: 2501)
  KISMET_API_KEY             Kismet API key

DOMAINS:
  WiFi (WPA/WPA2/WPA3, KRACK, Dragonblood, PMKID, Evil Twin, Deauth)
  Bluetooth (BlueBorne, KNOB, BLE GATT, BLUFFS, SweynTooth)
  RF/SDR (RollJam, sub-GHz replay, GPS spoofing)
  NFC/RFID (Mifare Classic, HID iCLASS, EMV relay)
  Cellular/5G (IMSI catcher, SS7, 5G-AKA, VoWiFi)
  IoT (Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP)
  Advanced (MouseJack, air-gap, UWB, WiFi CSI, Miracast, drone RF)
  Detection (WIDS/WIPS, Sigma rules, forensics)
  Compliance (PCI DSS, NIST, HIPAA, ISO 27001, CIS Controls)
`);
}

// ─── CLI: --list ───

function printToolList(): void {
  const grouped = new Map<string, typeof allTools>();

  for (const tool of allTools) {
    const cat = categorize(tool.name);
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(tool);
  }

  console.log(`\nwifi-security-mcp — ${allTools.length} tools\n`);

  for (const [category, tools] of grouped) {
    console.log(`━━━ ${category} (${tools.length}) ━━━`);
    for (const tool of tools) {
      const schemaKeys = Object.keys(tool.schema);
      const params = schemaKeys.length > 0 ? `(${schemaKeys.join(", ")})` : "()";
      console.log(`  ${tool.name}${params}`);
      console.log(`    ${tool.description.split(".")[0]}.`);
    }
    console.log();
  }
}

// ─── Main ───

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  if (args.includes("--list") || args.includes("-l")) {
    printToolList();
    return;
  }

  // Default: start MCP server on stdio
  const ctx = buildToolContext();
  await startMcpStdio(ctx);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

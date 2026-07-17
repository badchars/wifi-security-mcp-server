import type { ToolDef } from "../types/index.js";

// ─── Named exports ───
import { scanWifiComposite } from "./scan-wifi.js";
import { analyzeWifiSecurityComposite } from "./analyze-wifi-security.js";
import { findWifiAttacksComposite } from "./find-wifi-attacks.js";
import { simulateEvilTwinComposite } from "./simulate-evil-twin.js";
import { analyzeDeauthComposite } from "./analyze-deauth.js";
import { crackWpsComposite } from "./crack-wps.js";
import { analyzePmkidComposite } from "./analyze-pmkid.js";
import { auditWifi67Composite } from "./audit-wifi67.js";
import { analyzeCaptivePortal } from "./analyze-captive-portal.js";
import { analyzeHotspot20 } from "./analyze-hotspot20.js";
import { detectMacRandomization } from "./detect-mac-randomization.js";
import { auditWlanController } from "./audit-wlan-controller.js";
import { lookupWirelessCve } from "./lookup-wireless-cve.js";
import { lookupHardware } from "./lookup-hardware.js";
import { mapWirelessAttck } from "./map-wireless-attck.js";
import { analyzeMedicalWireless } from "./analyze-medical-wireless.js";
import { detectWirelessAttack } from "./detect-wireless-attack.js";
import { auditWirelessCompliance } from "./audit-wireless-compliance.js";
import { exportReport } from "./export-report.js";

// ─── Default exports ───
import scanBluetooth from "./scan-bluetooth.js";
import findBluetoothAttacks from "./find-bluetooth-attacks.js";
import analyzeBle from "./analyze-ble.js";
import analyzeRf from "./analyze-rf.js";
import analyzeNfc from "./analyze-nfc.js";
import analyzeCellularSecurity from "./analyze-cellular.js";
import analyzeZigbee from "./analyze-zigbee.js";
import scanIotWireless from "./scan-iot.js";
import findMousejack from "./find-mousejack.js";
import analyzeAirgap from "./analyze-airgap.js";
import analyzeUwb from "./analyze-uwb.js";
import analyzeWifiCsi from "./analyze-wifi-csi.js";
import analyzeMiracast from "./analyze-miracast.js";
import analyzeWifiDirect from "./analyze-wifi-direct.js";
import analyzeDroneRf from "./analyze-drone-rf.js";

export const compositeTools: ToolDef[] = [
  // WiFi Core (8)
  scanWifiComposite,
  analyzeWifiSecurityComposite,
  findWifiAttacksComposite,
  simulateEvilTwinComposite,
  analyzeDeauthComposite,
  crackWpsComposite,
  analyzePmkidComposite,
  auditWifi67Composite,
  // Bluetooth & RF (5)
  scanBluetooth,
  findBluetoothAttacks,
  analyzeBle,
  analyzeRf,
  analyzeNfc,
  // Cellular & IoT (4)
  analyzeCellularSecurity,
  analyzeZigbee,
  scanIotWireless,
  findMousejack,
  // Advanced Wireless (5)
  analyzeAirgap,
  analyzeUwb,
  analyzeWifiCsi,
  analyzeMiracast,
  analyzeWifiDirect,
  analyzeDroneRf,
  // Infrastructure (4)
  auditWlanController,
  analyzeCaptivePortal,
  detectMacRandomization,
  analyzeHotspot20,
  // Intelligence & Reference (4)
  lookupWirelessCve,
  lookupHardware,
  mapWirelessAttck,
  analyzeMedicalWireless,
  // Detection & Compliance (2)
  detectWirelessAttack,
  auditWirelessCompliance,
  // Reporting (1)
  exportReport,
];

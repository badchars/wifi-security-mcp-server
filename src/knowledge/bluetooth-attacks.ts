export interface BluetoothAttack {
  id: string;
  name: string;
  category: "classic" | "ble" | "mesh" | "protocol" | "implementation";
  protocols: ("BR/EDR" | "BLE" | "Mesh" | "LE Audio")[];
  cves: string[];
  description: string;
  impact: string;
  prerequisites: string[];
  tools: string[];
  commands: { tool: string; command: string; description: string }[];
  mitigations: string[];
  attckId: string;
  severity: "critical" | "high" | "medium" | "low";
  stealthScore: number;
  references: string[];
}

export const BLUETOOTH_ATTACKS: BluetoothAttack[] = [
  {
    id: "blueborne",
    name: "BlueBorne",
    category: "implementation",
    protocols: ["BR/EDR", "BLE"],
    cves: ["CVE-2017-0781", "CVE-2017-0782", "CVE-2017-0783", "CVE-2017-0785", "CVE-2017-1000251", "CVE-2017-1000250", "CVE-2017-14315", "CVE-2017-8628"],
    description: "Collection of 8 zero-click vulnerabilities in Bluetooth implementations across Android, iOS, Windows, and Linux. Allows remote code execution, MitM, and information disclosure without pairing.",
    impact: "Remote code execution, MitM, information disclosure — no user interaction required",
    prerequisites: ["Bluetooth enabled on target", "Within Bluetooth range (~10m)", "No pairing required"],
    tools: ["blueborne-scanner", "blueborne-exploit", "ubertooth"],
    commands: [
      { tool: "blueborne-scanner", command: "python3 blueborne_scanner.py -t <target_bt_addr>", description: "Scan target for BlueBorne vulnerabilities" },
    ],
    mitigations: ["Update OS and firmware", "Disable Bluetooth when not in use", "Use Bluetooth 5.0+ with secure connections"],
    attckId: "T1190",
    severity: "critical",
    stealthScore: 2,
    references: ["https://www.armis.com/blueborne/"],
  },
  {
    id: "knob",
    name: "KNOB (Key Negotiation of Bluetooth)",
    category: "protocol",
    protocols: ["BR/EDR"],
    cves: ["CVE-2019-9506"],
    description: "Force Bluetooth encryption key length negotiation to minimum (1 byte), making brute-force trivial. Protocol-level flaw — attacker can intercept and modify key length negotiation in real-time.",
    impact: "Brute-force Bluetooth encryption key, decrypt all Bluetooth traffic",
    prerequisites: ["Within Bluetooth range", "MitM position during pairing/reconnection", "Target supports BR/EDR"],
    tools: ["knob-poc", "ubertooth", "internalblue"],
    commands: [
      { tool: "internalblue", command: "python3 internalblue.py --target <bt_addr> --knob", description: "Execute KNOB attack via InternalBlue" },
    ],
    mitigations: ["Update Bluetooth firmware", "Enforce minimum key length >= 7 bytes", "Use Bluetooth 5.1+ with enhanced security"],
    attckId: "T1557",
    severity: "high",
    stealthScore: 2,
    references: ["https://knobattack.com/"],
  },
  {
    id: "blurtooth",
    name: "BLURtooth (BLUR Vulnerability)",
    category: "protocol",
    protocols: ["BR/EDR", "BLE"],
    cves: ["CVE-2020-15802"],
    description: "Flaw in Cross-Transport Key Derivation (CTKD) in Bluetooth 4.0-5.0. Allows an attacker to reduce encryption key strength or overwrite authenticated keys by pairing on one transport and deriving keys for the other.",
    impact: "MitM attacks, key overwrite, authentication bypass",
    prerequisites: ["Dual-mode Bluetooth device (BR/EDR + BLE)", "Within Bluetooth range"],
    tools: ["internalblue", "ubertooth"],
    commands: [],
    mitigations: ["Update to Bluetooth 5.1+ with CTKD restrictions", "Disable dual-mode when not needed"],
    attckId: "T1557",
    severity: "high",
    stealthScore: 2,
    references: ["https://www.bluetooth.com/learn-about-bluetooth/key-attributes/bluetooth-security/blurtooth/"],
  },
  {
    id: "bluffs",
    name: "BLUFFS (Bluetooth Forward and Future Secrecy Attacks)",
    category: "protocol",
    protocols: ["BR/EDR"],
    cves: ["CVE-2023-24023"],
    description: "Six novel attacks on Bluetooth session establishment. Force weak session keys and reuse them across sessions, breaking forward and future secrecy. Affects Bluetooth 4.2 through 5.4.",
    impact: "Break forward/future secrecy, decrypt past and future sessions, device impersonation",
    prerequisites: ["Within Bluetooth range", "One compromised session key"],
    tools: ["bluffs-toolkit"],
    commands: [],
    mitigations: ["Update to patched firmware", "Use Bluetooth 5.4+ with session key diversification"],
    attckId: "T1557",
    severity: "critical",
    stealthScore: 2,
    references: ["https://francozappa.com/publication/2023/bluffs/"],
  },
  {
    id: "sweyntooth",
    name: "SweynTooth (BLE SoC Vulnerabilities)",
    category: "implementation",
    protocols: ["BLE"],
    cves: ["CVE-2019-16336", "CVE-2019-17060", "CVE-2019-17061", "CVE-2019-17517", "CVE-2019-17518", "CVE-2019-17519", "CVE-2019-17520", "CVE-2019-19192", "CVE-2019-19193", "CVE-2019-19194", "CVE-2019-19195", "CVE-2019-19196"],
    description: "12 vulnerabilities across 7 major BLE SoC vendors (Texas Instruments, NXP, Cypress, Dialog, STMicro, Microchip, Telink). Includes crashes, deadlocks, security bypasses in BLE link layer.",
    impact: "Device crashes, security bypass, deadlocks in BLE devices (medical, IoT, wearables)",
    prerequisites: ["BLE-capable attacker device", "Within BLE range", "Target uses vulnerable SoC"],
    tools: ["sweyntooth", "ubertooth", "nrf-sniffer"],
    commands: [
      { tool: "sweyntooth", command: "python3 sweyntooth.py --target <ble_addr> --test all", description: "Test target for SweynTooth vulnerabilities" },
    ],
    mitigations: ["Update SoC firmware", "Monitor BLE stack for crashes", "Implement BLE stack hardening"],
    attckId: "T1499.004",
    severity: "high",
    stealthScore: 3,
    references: ["https://asset-group.github.io/disclosures/sweyntooth/"],
  },
  {
    id: "bias",
    name: "BIAS (Bluetooth Impersonation Attacks)",
    category: "protocol",
    protocols: ["BR/EDR"],
    cves: ["CVE-2020-10135"],
    description: "Exploit flaws in Bluetooth authentication to impersonate previously paired devices. Bypass Secure Connections and legacy authentication by downgrading role switching and exploiting unilateral authentication.",
    impact: "Impersonate any previously paired device, connect without credentials",
    prerequisites: ["Know Bluetooth address of paired device", "Within Bluetooth range", "Target supports legacy secure connections"],
    tools: ["bias-toolkit", "internalblue"],
    commands: [],
    mitigations: ["Enforce mutual authentication", "Update Bluetooth firmware", "Disable legacy pairing modes"],
    attckId: "T1557",
    severity: "high",
    stealthScore: 2,
    references: ["https://francozappa.com/publication/2020/bias/"],
  },
  {
    id: "ble_gatt_abuse",
    name: "BLE GATT Service Abuse",
    category: "ble",
    protocols: ["BLE"],
    cves: [],
    description: "Enumerate and abuse exposed BLE GATT services. Many IoT devices expose sensitive characteristics (read/write) without authentication — unlock locks, read sensor data, modify device configuration.",
    impact: "Unauthorized device control, data exfiltration, configuration tampering",
    prerequisites: ["BLE adapter", "Within BLE range (~50m)", "Target exposes GATT services"],
    tools: ["gatttool", "bettercap", "bleah", "nrf-connect"],
    commands: [
      { tool: "gatttool", command: "gatttool -b <ble_addr> --characteristics", description: "List all GATT characteristics" },
      { tool: "gatttool", command: "gatttool -b <ble_addr> --char-read -a <handle>", description: "Read specific characteristic" },
      { tool: "gatttool", command: "gatttool -b <ble_addr> --char-write-req -a <handle> -n <value>", description: "Write to characteristic" },
      { tool: "bettercap", command: "ble.enum <ble_addr>", description: "Enumerate BLE services and characteristics" },
    ],
    mitigations: ["Require pairing for sensitive characteristics", "Use BLE Secure Connections", "Implement application-layer encryption"],
    attckId: "T1021",
    severity: "medium",
    stealthScore: 1,
    references: [],
  },
  {
    id: "ble_jamming",
    name: "BLE Advertising Channel Jamming",
    category: "ble",
    protocols: ["BLE"],
    cves: [],
    description: "Jam BLE advertising channels (37, 38, 39) to prevent device discovery and connection establishment. Selective jamming can target specific devices while leaving others operational.",
    impact: "Prevent BLE device connections, denial of service for BLE-dependent systems",
    prerequisites: ["SDR or Bluetooth jammer", "Within BLE range"],
    tools: ["ubertooth", "hackrf", "gr-bluetooth"],
    commands: [
      { tool: "ubertooth", command: "ubertooth-btbb -c 37 -j", description: "Jam BLE advertising channel 37" },
    ],
    mitigations: ["Use frequency hopping", "Deploy BLE monitoring", "Have wired fallback for critical devices"],
    attckId: "T1499.002",
    severity: "medium",
    stealthScore: 4,
    references: [],
  },
];

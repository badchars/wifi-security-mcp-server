<p align="center">
  <br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-light.svg">
    <img alt="wifi-security-mcp-server" src="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-dark.svg" width="700">
  </picture>
</p>

<h3 align="center">Wireless security intelligence for AI agents.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Cellular/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drone RF, WIDS/WIPS, Compliance &mdash; unified into a single MCP server.<br>
  Your AI agent gets <b>full-spectrum wireless security analysis on demand</b>, powered by 9 built-in knowledge bases covering 139 individual tools.
</p>

<br>

<p align="center">
  <a href="#the-problem">The Problem</a> &bull;
  <a href="#how-its-different">How It's Different</a> &bull;
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#what-the-ai-can-do">What The AI Can Do</a> &bull;
  <a href="#tools-reference-34-composite-tools">Tools (34)</a> &bull;
  <a href="#knowledge-bases-9">Knowledge Bases</a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="CHANGELOG.md">Changelog</a> &bull;
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/wifi-security-mcp-server"><img src="https://img.shields.io/npm/v/wifi-security-mcp-server.svg" alt="npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <img src="https://img.shields.io/badge/protocol-MCP-8b5cf6" alt="MCP">
  <img src="https://img.shields.io/badge/tools-34-ef4444" alt="34 Tools">
  <img src="https://img.shields.io/badge/knowledge--bases-9-f97316" alt="9 Knowledge Bases">
  <img src="https://img.shields.io/badge/deps-2-22c55e" alt="2 Dependencies">
</p>

---

## The Problem

Wireless security assessment is one of the most fragmented disciplines in offensive security. WiFi auditing requires one set of tools, Bluetooth another, RF/SDR a third, IoT protocols yet another &mdash; and each domain has its own attack surface, its own vulnerabilities, its own compliance requirements. Today you run aircrack-ng for WPA, use Bettercap for BLE, fire up HackRF for SDR, consult different CVE databases for each chipset, reference NIST and PCI-DSS separately, and then spend hours manually correlating findings into a coherent assessment.

```
Traditional wireless security workflow:
  audit WiFi networks              ->  aircrack-ng / Wireshark / Kismet
  test Bluetooth security          ->  Bettercap / btlejack / Ubertooth
  analyze RF signals               ->  HackRF / GNU Radio / GQRX
  check NFC/RFID                   ->  Proxmark3 / libnfc
  assess cellular security         ->  srsRAN / OpenBTS
  test IoT protocols               ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  look up wireless CVEs            ->  NVD / vendor advisories (manual search)
  check compliance                 ->  NIST / PCI-DSS / HIPAA docs (manual)
  map to MITRE ATT&CK              ->  ATT&CK Navigator (manual mapping)
  correlate everything             ->  copy-paste into a report
  ────────────────────────────────
  Total: hours per assessment, most of it context-switching between tools
```

**wifi-security-mcp-server** gives your AI agent 34 composite tools backed by 9 knowledge bases covering 139 individual capabilities via the [Model Context Protocol](https://modelcontextprotocol.io). The agent analyzes networks, identifies vulnerabilities, maps attacks to MITRE ATT&CK, checks compliance, and generates actionable reports &mdash; in a single conversation.

```
With wifi-security-mcp-server:
  You: "Audit the wireless security of our office network running WPA2-Enterprise"

  Agent: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "Your WPA2-Enterprise network has 3 critical findings:
            1. EAP-PEAP without certificate pinning — vulnerable to evil twin
               with hostapd-mana (MITRE T1557.002)
            2. No 802.11w (PMF) — susceptible to deauthentication attacks
               (MITRE T1498.001)
            3. PMKID hash extractable without client interaction — offline
               cracking possible with hashcat mode 22000
            PCI-DSS 4.0: 2 controls non-compliant (4.2.1, 11.2.1).
            Recommended: migrate to WPA3-Enterprise with SAE, enable PMF,
            deploy WIDS for rogue AP detection."
```

---

## How It's Different

Existing tools give you raw packet captures and protocol-specific analysis. wifi-security-mcp-server gives your AI agent the ability to **reason across all wireless domains simultaneously** with deep knowledge-base backing.

<table>
<thead>
<tr>
<th></th>
<th>Traditional Approach</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Interface</b></td>
<td>10+ different CLIs, GUIs, and hardware tools</td>
<td>MCP &mdash; AI agent calls tools conversationally</td>
</tr>
<tr>
<td><b>Coverage</b></td>
<td>One protocol at a time</td>
<td>WiFi, Bluetooth, RF, NFC, Cellular, IoT &mdash; all in one server</td>
</tr>
<tr>
<td><b>Knowledge</b></td>
<td>Manual CVE lookup, manual ATT&CK mapping</td>
<td>9 built-in knowledge bases with 139 pre-mapped items</td>
</tr>
<tr>
<td><b>Attack intel</b></td>
<td>Google search + blog posts + conference talks</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Cellular + 6 IoT attacks catalogued with tools, mitigations, ATT&CK IDs</td>
</tr>
<tr>
<td><b>Compliance</b></td>
<td>Read NIST/PCI-DSS/HIPAA PDFs, map controls manually</td>
<td>Agent checks against 5 compliance frameworks automatically</td>
</tr>
<tr>
<td><b>API keys</b></td>
<td>Various accounts for different services</td>
<td>Zero API keys for core functionality &mdash; knowledge-base driven</td>
</tr>
<tr>
<td><b>Setup</b></td>
<td>Install aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; one command, zero config</td>
</tr>
</tbody>
</table>

---

## Quick Start

### Option 1: npx (no install)

```bash
npx wifi-security-mcp-server
```

All 34 tools work immediately. No API keys required &mdash; core functionality is knowledge-base driven.

### Option 2: Clone

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Environment variables (optional)

```bash
# WiGLE — wardriving database for real-world WiFi network lookups
export WIGLE_API_KEY=your-key

# Kismet — live wireless intrusion detection
export KISMET_HOST=127.0.0.1      # Default: 127.0.0.1
export KISMET_PORT=2501           # Default: 2501
export KISMET_API_KEY=your-key
```

All API keys are optional. Without them, you still get full access to all 34 tools powered by 9 built-in knowledge bases covering WiFi attacks, Bluetooth attacks, RF/SDR, NFC/RFID, cellular, IoT, hardware databases, CVE intelligence, and compliance frameworks.

### Connect to your AI agent

<details open>
<summary><b>Claude Code</b></summary>

```bash
# With npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# With local clone
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "wifi-security": {
      "command": "npx",
      "args": ["-y", "wifi-security-mcp-server"],
      "env": {
        "WIGLE_API_KEY": "optional",
        "KISMET_HOST": "optional",
        "KISMET_PORT": "optional",
        "KISMET_API_KEY": "optional"
      }
    }
  }
}
```

</details>

<details>
<summary><b>Cursor / Windsurf / other MCP clients</b></summary>

Same JSON config format. Point the command to `npx wifi-security-mcp-server` or your local installation path.

</details>

### Start querying

```
You: "What attacks are possible against a WPA3-SAE network and how do I test for them?"
```

That's it. The agent looks up attacks, maps them to MITRE ATT&CK, recommends tools, and provides step-by-step methodology &mdash; all from built-in knowledge bases.

---

## What The AI Can Do

### WiFi Security Assessment

```
You: "Analyze the security of a WPA2-PSK network with WPS enabled"

Agent: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "Critical vulnerabilities found in WPA2-PSK + WPS configuration:
          1. WPS Pixie Dust Attack — PIN recoverable in seconds via
             offline brute-force of E-S1/E-S2 nonces (Reaver + PixieWPS).
             Gives full PSK recovery without client interaction.
          2. PMKID Attack — first packet of 4-way handshake contains
             PMKID hash, crackable offline with hashcat -m 22000.
             No deauth needed, no client needed.
          3. 4-Way Handshake Capture — EAPOL frames capturable with
             airodump-ng + deauth, then offline dictionary attack.
          Priority: Disable WPS immediately (highest risk), enforce
          strong 20+ char PSK, consider migration to WPA3-SAE."
```

### Bluetooth & BLE Analysis

```
You: "What are the security risks of our BLE-based access control system?"

Agent: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "BLE access control system — 4 critical risks identified:
          1. JustWorks Pairing — no MITM protection. Attacker can
             intercept pairing with Ubertooth One (MITRE T1040).
          2. GATT Characteristic Sniffing — unlock commands sent in
             cleartext, replayable with gatttool (MITRE T1212).
          3. BLE Relay/Replay Attack — relay legitimate unlock signal
             using two devices + btlejack (MITRE T1557).
          4. MAC Address Tracking — static BLE MAC enables occupant
             tracking (MITRE T1592.002).
          Recommended: enforce LE Secure Connections (LESC) with
          Numeric Comparison, encrypt GATT characteristics, implement
          rolling nonces for replay protection."
```

### IoT Wireless Audit

```
You: "Assess the wireless security of our smart building IoT deployment"

Agent: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "Smart building IoT wireless assessment — 5 findings:
          1. Zigbee: Default trust center link key (ZigBeeAlliance09)
             allows network join interception with KillerBee (CRITICAL)
          2. MQTT: Broker on port 1883 without TLS — credentials
             and sensor data transmitted in cleartext
          3. Z-Wave: S0 security with known key exchange vulnerability
             — recommend S2 upgrade
          4. MouseJack: 3 Logitech Unifying receivers vulnerable to
             keystroke injection (CVE-2016-10761)
          5. WiFi: IoT devices on same VLAN as corporate — no
             network segmentation
          Priority remediation: MQTT TLS, Zigbee install codes,
          IoT VLAN isolation, replace vulnerable Logitech receivers."
```

### Compliance Audit

```
You: "Check our hospital WiFi against HIPAA wireless requirements"

Agent: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "HIPAA Wireless Compliance Audit — 6 findings:
          3 NON-COMPLIANT controls:
          - 164.312(a)(1): No wireless IDS deployed for rogue AP detection
          - 164.312(e)(1): Medical devices using WPA2-PSK (not Enterprise)
          - 164.312(e)(2): No wireless traffic encryption audit logging
          3 COMPLIANT controls:
          - 164.310(a)(1): Physical AP locations documented
          - 164.312(a)(2): 802.1X with RADIUS authentication
          - 164.312(d): Certificate-based EAP-TLS for staff devices
          Remediation plan: deploy WIDS (Kismet/AirMagnet), migrate
          medical devices to WPA2-Enterprise with MAB, enable wireless
          audit logging on WLAN controller."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; No API key</b></summary>

| Tool | Description |
|------|-------------|
| `scan_wifi_networks` | Scan and analyze WiFi networks &mdash; discover SSIDs, channels, encryption types, signal strength, and security misconfigurations |
| `analyze_wifi_security` | Deep analysis of WiFi security configuration &mdash; encryption strength, authentication method, known weaknesses, attack surface |
| `find_wifi_attacks` | Find applicable attacks for a WiFi target &mdash; returns attack methodology, required tools, MITRE ATT&CK mapping, mitigations |
| `simulate_evil_twin` | Simulate and analyze evil twin AP attack scenarios &mdash; hostapd-mana configuration, captive portal, credential capture methodology |
| `analyze_deauth` | Analyze deauthentication attack vectors &mdash; 802.11w PMF status, deauth detection, countermeasures, WIDS integration |
| `crack_wps` | Analyze WPS cracking attack vectors &mdash; Pixie Dust, brute force, null PIN, default PIN generation, Reaver/Bully methodology |
| `analyze_pmkid` | Analyze PMKID-based attack vectors &mdash; clientless WPA/WPA2 cracking via hcxdumptool + hashcat mode 22000 |
| `audit_wifi67` | Audit WiFi 6 (802.11ax) and WiFi 7 (802.11be) specific security features &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; No API key</b></summary>

| Tool | Description |
|------|-------------|
| `scan_bluetooth` | Scan and analyze Bluetooth devices &mdash; BR/EDR classic and BLE discovery, service enumeration, pairing analysis |
| `find_bluetooth_attacks` | Find applicable Bluetooth attacks &mdash; BlueBorne, KNOB, BIAS, BLE relay, MITM, with tools and mitigations |
| `analyze_ble` | Deep analysis of BLE security &mdash; GATT services, pairing methods, LE Secure Connections, characteristic encryption |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; No API key</b></summary>

| Tool | Description |
|------|-------------|
| `analyze_rf_signal` | Analyze RF signal security &mdash; frequency analysis, modulation identification, replay attack feasibility, SDR tool recommendations |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; No API key</b></summary>

| Tool | Description |
|------|-------------|
| `analyze_nfc_security` | Analyze NFC/RFID security &mdash; card type identification, access control weaknesses, cloning feasibility, Proxmark3 methodology |

</details>

<details>
<summary><b>Cellular/5G (1) &mdash; No API key</b></summary>

| Tool | Description |
|------|-------------|
| `analyze_cellular_security` | Analyze cellular network security &mdash; 2G/3G/4G/5G protocol weaknesses, IMSI catcher detection, fake base station analysis |

</details>

<details>
<summary><b>IoT Wireless (3) &mdash; No API key</b></summary>

| Tool | Description |
|------|-------------|
| `analyze_zigbee` | Analyze Zigbee network security &mdash; trust center policy, network key management, KillerBee attack methodology |
| `scan_iot_wireless` | Scan IoT wireless protocols &mdash; Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP discovery and vulnerability analysis |
| `find_mousejack` | Analyze MouseJack wireless keyboard/mouse vulnerabilities &mdash; keystroke injection, unencrypted HID, vendor-specific bypasses |

</details>

<details>
<summary><b>Advanced Wireless (6) &mdash; No API key</b></summary>

| Tool | Description |
|------|-------------|
| `analyze_airgap` | Analyze air-gap exfiltration techniques &mdash; electromagnetic, acoustic, thermal, optical covert channels and countermeasures |
| `analyze_uwb` | Analyze Ultra-Wideband (UWB) security &mdash; ranging manipulation, relay attacks on car key fobs and AirTags, distance fraud |
| `analyze_wifi_csi` | Analyze WiFi Channel State Information (CSI) security &mdash; passive sensing, activity recognition, keystroke inference risks |
| `analyze_miracast` | Analyze Miracast/WiFi Display security &mdash; WFD session hijacking, screen capture, unauthorized display access |
| `analyze_wifi_direct` | Analyze WiFi Direct (P2P) security &mdash; group owner negotiation attacks, WPS vulnerabilities in P2P, rogue group formation |
| `analyze_drone_rf` | Analyze drone RF security &mdash; control link hijacking, GPS spoofing, video downlink interception, counter-UAS techniques |

</details>

<details>
<summary><b>Infrastructure (4) &mdash; No API key (KISMET_* optional for live WIDS)</b></summary>

| Tool | Description |
|------|-------------|
| `audit_wlan_controller` | Audit WLAN controller configuration &mdash; Cisco WLC, Aruba, Meraki security settings, rogue AP policies, RF management |
| `analyze_captive_portal` | Analyze captive portal security &mdash; bypass techniques, credential harvesting risks, network isolation, guest VLAN security |
| `detect_mac_randomization` | Analyze MAC address randomization &mdash; iOS/Android/Windows implementation differences, tracking resistance, fingerprinting bypasses |
| `analyze_hotspot20` | Analyze Hotspot 2.0 (Passpoint) security &mdash; ANQP, OSU, automatic network selection risks, EAP method analysis |

</details>

<details>
<summary><b>Intelligence (4) &mdash; No API key</b></summary>

| Tool | Description |
|------|-------------|
| `lookup_wireless_cve` | Look up wireless-specific CVEs &mdash; WiFi chipset vulnerabilities, Bluetooth stack CVEs, driver exploits, firmware bugs |
| `lookup_hardware` | Look up wireless security hardware &mdash; WiFi adapters, Bluetooth sniffers, SDR devices, capabilities, chipset compatibility |
| `map_wireless_attck` | Map wireless attacks to MITRE ATT&CK framework &mdash; technique IDs, tactic categories, detection strategies |
| `analyze_medical_wireless` | Analyze medical device wireless security &mdash; infusion pumps, pacemakers, patient monitors, FDA guidance, HIPAA requirements |

</details>

<details>
<summary><b>Detection (2) &mdash; No API key</b></summary>

| Tool | Description |
|------|-------------|
| `detect_wireless_attack` | Detect wireless attacks in progress &mdash; deauth floods, evil twin, KARMA, rogue AP, BLE spoofing, RF jamming indicators |
| `audit_wireless_compliance` | Audit wireless network against compliance frameworks &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, ISO 27001 wireless controls |

</details>

<details>
<summary><b>Reporting (1) &mdash; No API key</b></summary>

| Tool | Description |
|------|-------------|
| `export_report` | Export wireless security assessment report &mdash; findings, risk ratings, compliance status, remediation roadmap, executive summary |

</details>

---

### CLI Usage

```bash
# List all available tools
npx wifi-security-mcp-server --list

# Run any tool directly
npx wifi-security-mcp-server --tool scan_wifi_networks '{"encryption":"WPA2"}'
npx wifi-security-mcp-server --tool find_wifi_attacks '{"target_type":"WPA3-SAE"}'
npx wifi-security-mcp-server --tool analyze_ble '{"pairing_method":"JustWorks"}'
npx wifi-security-mcp-server --tool lookup_wireless_cve '{"keyword":"Broadcom WiFi"}'
npx wifi-security-mcp-server --tool audit_wireless_compliance '{"standard":"PCI-DSS"}'
npx wifi-security-mcp-server --tool analyze_zigbee '{"network_key_type":"default"}'
npx wifi-security-mcp-server --tool export_report '{"format":"json"}'
```

---

## Knowledge Bases (9)

The server ships with 9 built-in knowledge bases &mdash; no API keys, no external dependencies, no rate limits. Every tool query is enriched with structured intelligence from these databases.

| Knowledge Base | Entries | What it provides |
|----------------|---------|-----------------|
| **WiFi Attacks** | 47 attacks | WPA/WPA2/WPA3 attack techniques, evil twin variants, PMKID, KRACK, FragAttacks, deauth, WPS exploits &mdash; each with tools, mitigations, MITRE ATT&CK mapping |
| **Bluetooth Attacks** | 8 attacks | BlueBorne, KNOB, BIAS, BLE relay, MITM, BLE fuzzing, Bluetooth impersonation &mdash; with CVEs and detection strategies |
| **RF/SDR Attacks** | 6 attacks | Replay attacks, jamming, signal injection, SDR-based interception, RF fingerprinting bypass, spectrum analysis techniques |
| **NFC/RFID Attacks** | 6 attacks | Card cloning, relay attacks, MIFARE Classic cracking, NFC skimming, RFID fuzzing, access control bypass with Proxmark3 |
| **Cellular Attacks** | 6 attacks | IMSI catching, fake base station (Stingray), SS7 exploitation, 5G NAS vulnerabilities, downgrade attacks, VoLTE interception |
| **IoT Attacks** | 6 attacks | Zigbee network key sniffing, Z-Wave S0 downgrade, MQTT credential harvesting, LoRaWAN ABP replay, MouseJack, BLE IoT relay |
| **Hardware Database** | 12 devices | WiFi adapters (Alfa, TP-Link), Bluetooth sniffers (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; chipsets, capabilities, monitor mode support |
| **CVE Database** | 17 CVEs | Wireless-specific CVEs for WiFi chipsets (Broadcom, Qualcomm, Intel), Bluetooth stacks, IoT firmware &mdash; severity, affected versions, exploit availability |
| **Compliance Frameworks** | 5 frameworks | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; wireless-specific controls, audit checklists, gap analysis |

---

## Architecture

```
src/
  index.ts                    # CLI entrypoint (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # MCP server setup (stdio transport)
    tools.ts                  # Tool registry — all 34 composite tools assembled here
  types/
    index.ts                  # Shared types (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 built-in knowledge bases
    wifi-attacks.ts           # 47 WiFi attack definitions
    bluetooth-attacks.ts      # 8 Bluetooth attack definitions
    rf-attacks.ts             # 6 RF/SDR attack definitions
    nfc-attacks.ts            # 6 NFC/RFID attack definitions
    cellular-attacks.ts       # 6 Cellular/5G attack definitions
    iot-attacks.ts            # 6 IoT attack definitions
    hardware.ts               # 12 hardware device profiles
    cve-database.ts           # 17 wireless CVEs
    compliance.ts             # 5 compliance frameworks
  wifi/                       # WiFi Core tools (8)
  bluetooth/                  # Bluetooth tools (3)
  rf/                         # RF/SDR tools (1)
  nfc/                        # NFC/RFID tools (1)
  cellular/                   # Cellular/5G tools (1)
  iot/                        # IoT Wireless tools (3)
  advanced/                   # Advanced Wireless tools (6)
  infrastructure/             # Infrastructure tools (4)
  intelligence/               # Intelligence tools (4)
  detection/                  # Detection tools (2)
  reporting/                  # Reporting tools (1)
```

**Design decisions:**

- **Knowledge-base driven** &mdash; Unlike API-dependent tools, core functionality runs entirely offline from 9 built-in databases. No API keys, no rate limits, no external dependencies for the primary workflow.
- **34 composite tools, 139 individual capabilities** &mdash; Each tool is a composite that bundles related analyses. `find_wifi_attacks` doesn't just list attacks &mdash; it returns methodology, required hardware, MITRE ATT&CK mapping, detection strategies, and countermeasures.
- **2 runtime dependencies** &mdash; `@modelcontextprotocol/sdk` and `zod`. Nothing else. No native modules, no binary dependencies, no platform-specific code.
- **Optional live integration** &mdash; WiGLE API for real-world network data, Kismet for live wireless IDS. Core analysis works without either.
- **Compliance-aware** &mdash; Every finding is automatically mapped to relevant compliance frameworks (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) when applicable.
- **MITRE ATT&CK mapped** &mdash; Attack techniques include ATT&CK technique IDs, tactic categories, and detection data sources for SOC integration.

---

## Limitations

- Knowledge bases are point-in-time snapshots &mdash; new attacks/CVEs require package updates
- WiGLE integration requires a free API key for network lookups
- Kismet live WIDS requires a running Kismet instance with API access
- No active wireless transmission &mdash; the server provides intelligence and methodology, not packet injection
- Hardware database covers the most common security research devices, not exhaustive
- Compliance frameworks focus on wireless-specific controls, not full framework coverage
- macOS / Linux tested (Windows not tested)

---

## Part of the MCP Security Suite

| Project | Domain | Tools |
|---|---|---|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Browser-based security testing | 39 tools, Firefox, injection testing |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Cloud security (AWS/Azure/GCP) | 38 tools, 60+ checks |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub security posture | 39 tools, 45 checks |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Vulnerability intelligence | 23 tools, 5 sources |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT & reconnaissance | 37 tools, 12 sources |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark web & threat intelligence | 66 tools, 16 sources |
| **wifi-security-mcp-server** | **Wireless security intelligence** | **34 tools, 9 knowledge bases** |

---

<p align="center">
<b>For authorized security testing and assessment only.</b><br>
Always ensure you have proper authorization before performing wireless security testing on any network or device.<br>
Unauthorized wireless network access or interference is illegal in most jurisdictions.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

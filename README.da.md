<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <strong>Dansk</strong> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.pt-BR.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.el.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.hi.md">हिन्दी</a>
</p>

<p align="center">
  <br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-light.svg">
    <img alt="wifi-security-mcp-server" src="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-dark.svg" width="700">
  </picture>
</p>

<h3 align="center">Trådløs sikkerhedsintelligens for AI-agenter.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Mobil/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drone RF, WIDS/WIPS, Compliance &mdash; samlet i én MCP-server.<br>
  Din AI-agent får <b>fuld-spektrum trådløs sikkerhedsanalyse on demand</b>, drevet af 9 indbyggede videnbaser der dækker 139 individuelle værktøjer.
</p>

<br>

<p align="center">
  <a href="#the-problem">Problemet</a> &bull;
  <a href="#how-its-different">Forskellen</a> &bull;
  <a href="#quick-start">Hurtig Start</a> &bull;
  <a href="#what-the-ai-can-do">Hvad AI'en Kan</a> &bull;
  <a href="#tools-reference-34-composite-tools">Værktøjer (34)</a> &bull;
  <a href="#knowledge-bases-9">Videnbaser</a> &bull;
  <a href="#architecture">Arkitektur</a> &bull;
  <a href="CHANGELOG.md">Changelog</a> &bull;
  <a href="CONTRIBUTING.md">Bidrag</a>
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

Trådløs sikkerhedsvurdering er en af de mest fragmenterede discipliner inden for offensiv sikkerhed. WiFi-audit kræver ét sæt værktøjer, Bluetooth et andet, RF/SDR et tredje, IoT-protokoller endnu et &mdash; og hvert domæne har sin egen angrebsflade, sine egne sårbarheder, sine egne compliance-krav. I dag kører du aircrack-ng til WPA, bruger Bettercap til BLE, starter HackRF til SDR, konsulterer forskellige CVE-databaser for hver chipset, refererer til NIST og PCI-DSS separat, og bruger derefter timer på manuelt at korrelere fund til en sammenhængende vurdering.

```
Traditionel trådløs sikkerhedsworkflow:
  audit WiFi-netværk               ->  aircrack-ng / Wireshark / Kismet
  test Bluetooth-sikkerhed          ->  Bettercap / btlejack / Ubertooth
  analyser RF-signaler              ->  HackRF / GNU Radio / GQRX
  tjek NFC/RFID                     ->  Proxmark3 / libnfc
  vurder mobilsikkerhed             ->  srsRAN / OpenBTS
  test IoT-protokoller              ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  søg trådløse CVE'er               ->  NVD / vendor advisories (manuel søgning)
  tjek compliance                   ->  NIST / PCI-DSS / HIPAA docs (manuelt)
  map til MITRE ATT&CK              ->  ATT&CK Navigator (manuel mapping)
  korreler alt                      ->  kopier-indsæt i en rapport
  ────────────────────────────────
  Total: timer per vurdering, det meste brugt på kontekstskift mellem værktøjer
```

**wifi-security-mcp-server** giver din AI-agent 34 sammensatte værktøjer understøttet af 9 videnbaser der dækker 139 individuelle funktioner via [Model Context Protocol](https://modelcontextprotocol.io). Agenten analyserer netværk, identificerer sårbarheder, mapper angreb til MITRE ATT&CK, tjekker compliance og genererer handlingsrettede rapporter &mdash; i en enkelt samtale.

```
Med wifi-security-mcp-server:
  Dig: "Audit den trådløse sikkerhed i vores kontornetværk der kører WPA2-Enterprise"

  Agent: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "Dit WPA2-Enterprise netværk har 3 kritiske fund:
            1. EAP-PEAP uden certifikat-pinning — sårbar over for evil twin
               med hostapd-mana (MITRE T1557.002)
            2. Ingen 802.11w (PMF) — modtagelig for deautentifikationsangreb
               (MITRE T1498.001)
            3. PMKID-hash kan udtrækkes uden klientinteraktion — offline
               cracking muligt med hashcat mode 22000
            PCI-DSS 4.0: 2 kontroller ikke-konforme (4.2.1, 11.2.1).
            Anbefalet: migrer til WPA3-Enterprise med SAE, aktiver PMF,
            implementer WIDS til rogue AP-detektion."
```

---

## How It's Different

Eksisterende værktøjer giver dig rå pakke-captures og protokolspecifik analyse. wifi-security-mcp-server giver din AI-agent evnen til at **ræsonnere på tværs af alle trådløse domæner samtidigt** med dyb videnbase-understøttelse.

<table>
<thead>
<tr>
<th></th>
<th>Traditionel Tilgang</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Interface</b></td>
<td>10+ forskellige CLI'er, GUI'er og hardwareværktøjer</td>
<td>MCP &mdash; AI-agent kalder værktøjer i samtale</td>
</tr>
<tr>
<td><b>Dækning</b></td>
<td>Én protokol ad gangen</td>
<td>WiFi, Bluetooth, RF, NFC, Mobil, IoT &mdash; alt i én server</td>
</tr>
<tr>
<td><b>Viden</b></td>
<td>Manuel CVE-opslag, manuel ATT&CK-mapping</td>
<td>9 indbyggede videnbaser med 139 prækortlagte elementer</td>
</tr>
<tr>
<td><b>Angrebsintelligens</b></td>
<td>Google-søgning + blogindlæg + konferenceforedrag</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Mobil + 6 IoT angreb katalogiseret med værktøjer, mitigeringer, ATT&CK-ID'er</td>
</tr>
<tr>
<td><b>Compliance</b></td>
<td>Læs NIST/PCI-DSS/HIPAA PDF'er, map kontroller manuelt</td>
<td>Agenten tjekker automatisk mod 5 compliance-rammeværk</td>
</tr>
<tr>
<td><b>API-nøgler</b></td>
<td>Forskellige konti til forskellige tjenester</td>
<td>Nul API-nøgler til kernefunktionalitet &mdash; videnbasedrevet</td>
</tr>
<tr>
<td><b>Opsætning</b></td>
<td>Installer aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; én kommando, nul konfiguration</td>
</tr>
</tbody>
</table>

---

## Quick Start

### Mulighed 1: npx (ingen installation)

```bash
npx wifi-security-mcp-server
```

Alle 34 værktøjer virker med det samme. Ingen API-nøgler påkrævet &mdash; kernefunktionalitet er videnbasedrevet.

### Mulighed 2: Klon

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Miljøvariabler (valgfrit)

```bash
# WiGLE — wardriving-database til opslag af virkelige WiFi-netværk
export WIGLE_API_KEY=your-key

# Kismet — live trådløs indtrængningsdetektion
export KISMET_HOST=127.0.0.1      # Standard: 127.0.0.1
export KISMET_PORT=2501           # Standard: 2501
export KISMET_API_KEY=your-key
```

Alle API-nøgler er valgfrie. Uden dem har du stadig fuld adgang til alle 34 værktøjer drevet af 9 indbyggede videnbaser der dækker WiFi-angreb, Bluetooth-angreb, RF/SDR, NFC/RFID, mobil, IoT, hardwaredatabase, CVE-intelligens og compliance-rammeværk.

### Forbind til din AI-agent

<details open>
<summary><b>Claude Code</b></summary>

```bash
# Med npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# Med lokal klon
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Tilføj til `~/Library/Application Support/Claude/claude_desktop_config.json`:

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
<summary><b>Cursor / Windsurf / andre MCP-klienter</b></summary>

Samme JSON-konfigurationsformat. Peg kommandoen til `npx wifi-security-mcp-server` eller din lokale installationssti.

</details>

### Begynd at forespørge

```
Dig: "Hvilke angreb er mulige mod et WPA3-SAE-netværk og hvordan tester jeg for dem?"
```

Det er det. Agenten slår angreb op, mapper dem til MITRE ATT&CK, anbefaler værktøjer og giver trin-for-trin-metodologi &mdash; alt fra indbyggede videnbaser.

---

## What The AI Can Do

### WiFi-sikkerhedsvurdering

```
Dig: "Analyser sikkerheden af et WPA2-PSK-netværk med WPS aktiveret"

Agent: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "Kritiske sårbarheder fundet i WPA2-PSK + WPS-konfiguration:
          1. WPS Pixie Dust-angreb — PIN gendannes på sekunder via
             offline brute-force af E-S1/E-S2 nonces (Reaver + PixieWPS).
             Fuld PSK-gendannelse uden klientinteraktion.
          2. PMKID-angreb — første pakke i 4-way handshake indeholder
             PMKID-hash, crackes offline med hashcat -m 22000.
             Ingen deauth nødvendig, ingen klient nødvendig.
          3. 4-Way Handshake-capture — EAPOL-frames kan captures med
             airodump-ng + deauth, derefter offline ordbogsangreb.
          Prioritet: Deaktiver WPS straks (højeste risiko), håndhæv
          stærk 20+ tegn PSK, overvej migration til WPA3-SAE."
```

### Bluetooth & BLE-analyse

```
Dig: "Hvad er sikkerhedsrisiciene ved vores BLE-baserede adgangskontrolsystem?"

Agent: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "BLE-adgangskontrolsystem — 4 kritiske risici identificeret:
          1. JustWorks-parring — ingen MITM-beskyttelse. Angriber kan
             opsnappe parring med Ubertooth One (MITRE T1040).
          2. GATT-karakteristik-sniffing — oplåsningskommandoer sendt i
             klartekst, afspilbare med gatttool (MITRE T1212).
          3. BLE-relay/replay-angreb — videresend legitimt oplåsningssignal
             med to enheder + btlejack (MITRE T1557).
          4. MAC-adresse-sporing — statisk BLE-MAC muliggør
             beboersporing (MITRE T1592.002).
          Anbefalet: håndhæv LE Secure Connections (LESC) med
          numerisk sammenligning, krypter GATT-karakteristikker, implementer
          rullende nonces til replay-beskyttelse."
```

### IoT trådløs audit

```
Dig: "Vurder den trådløse sikkerhed i vores smarte bygnings IoT-implementering"

Agent: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "Smart bygning IoT trådløs vurdering — 5 fund:
          1. Zigbee: Standard trust center link-nøgle (ZigBeeAlliance09)
             muliggør netværkstilslutnings-aflytning med KillerBee (KRITISK)
          2. MQTT: Broker på port 1883 uden TLS — legitimationsoplysninger
             og sensordata overført i klartekst
          3. Z-Wave: S0-sikkerhed med kendt nøgleudvekslingssårbarhed
             — S2-opgradering anbefalet
          4. MouseJack: 3 Logitech Unifying-modtagere sårbare over for
             tastetryksindsprøjtning (CVE-2016-10761)
          5. WiFi: IoT-enheder på samme VLAN som virksomhedsnetværk —
             ingen netværkssegmentering
          Prioriteret udbedring: MQTT TLS, Zigbee installationskoder,
          IoT VLAN-isolation, udskift sårbare Logitech-modtagere."
```

### Compliance-audit

```
Dig: "Tjek vores hospitals-WiFi mod HIPAA trådløse krav"

Agent: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "HIPAA Trådløs Compliance-Audit — 6 fund:
          3 IKKE-KONFORME kontroller:
          - 164.312(a)(1): Ingen trådløs IDS implementeret til rogue AP-detektion
          - 164.312(e)(1): Medicinske enheder bruger WPA2-PSK (ikke Enterprise)
          - 164.312(e)(2): Ingen auditlogning af trådløs trafikkryptering
          3 KONFORME kontroller:
          - 164.310(a)(1): Fysiske AP-placeringer dokumenteret
          - 164.312(a)(2): 802.1X med RADIUS-autentifikation
          - 164.312(d): Certifikatbaseret EAP-TLS til personaleenheder
          Udbedringplan: implementer WIDS (Kismet/AirMagnet), migrer
          medicinske enheder til WPA2-Enterprise med MAB, aktiver trådløs
          auditlogning på WLAN-controller."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; Ingen API-nøgle</b></summary>

| Værktøj | Beskrivelse |
|---------|-------------|
| `scan_wifi_networks` | Scan og analyser WiFi-netværk &mdash; opdag SSID'er, kanaler, krypteringstyper, signalstyrke og sikkerhedsfejlkonfigurationer |
| `analyze_wifi_security` | Dybdeanalyse af WiFi-sikkerhedskonfiguration &mdash; krypteringsstyrke, autentifikationsmetode, kendte svagheder, angrebsflade |
| `find_wifi_attacks` | Find anvendelige angreb for et WiFi-mål &mdash; returnerer angrebsmetodologi, krævede værktøjer, MITRE ATT&CK-mapping, mitigeringer |
| `simulate_evil_twin` | Simuler og analyser evil twin AP-angrebsscenarier &mdash; hostapd-mana-konfiguration, captive portal, credential capture-metodologi |
| `analyze_deauth` | Analyser deautentifikationsangrebsvektorer &mdash; 802.11w PMF-status, deauth-detektion, modforanstaltninger, WIDS-integration |
| `crack_wps` | Analyser WPS-cracking-angrebsvektorer &mdash; Pixie Dust, brute force, null PIN, standard PIN-generering, Reaver/Bully-metodologi |
| `analyze_pmkid` | Analyser PMKID-baserede angrebsvektorer &mdash; klientløs WPA/WPA2-cracking via hcxdumptool + hashcat mode 22000 |
| `audit_wifi67` | Audit WiFi 6 (802.11ax) og WiFi 7 (802.11be) specifikke sikkerhedsfunktioner &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; Ingen API-nøgle</b></summary>

| Værktøj | Beskrivelse |
|---------|-------------|
| `scan_bluetooth` | Scan og analyser Bluetooth-enheder &mdash; BR/EDR klassisk og BLE-opdagelse, tjeneste-enumeration, parringsanalyse |
| `find_bluetooth_attacks` | Find anvendelige Bluetooth-angreb &mdash; BlueBorne, KNOB, BIAS, BLE-relay, MITM, med værktøjer og mitigeringer |
| `analyze_ble` | Dybdeanalyse af BLE-sikkerhed &mdash; GATT-tjenester, parringsmetoder, LE Secure Connections, karakteristikkryptering |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; Ingen API-nøgle</b></summary>

| Værktøj | Beskrivelse |
|---------|-------------|
| `analyze_rf_signal` | Analyser RF-signalsikkerhed &mdash; frekvensanalyse, modulationsidentifikation, replay-angrebsgennemførlighed, SDR-værktøjsanbefalinger |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; Ingen API-nøgle</b></summary>

| Værktøj | Beskrivelse |
|---------|-------------|
| `analyze_nfc_security` | Analyser NFC/RFID-sikkerhed &mdash; korttypeidentifikation, adgangskontrolsvagheder, kloningsgennemførlighed, Proxmark3-metodologi |

</details>

<details>
<summary><b>Mobil/5G (1) &mdash; Ingen API-nøgle</b></summary>

| Værktøj | Beskrivelse |
|---------|-------------|
| `analyze_cellular_security` | Analyser mobilnetværkssikkerhed &mdash; 2G/3G/4G/5G-protokolsvagheder, IMSI-catcher-detektion, falsk basestation-analyse |

</details>

<details>
<summary><b>IoT Trådløs (3) &mdash; Ingen API-nøgle</b></summary>

| Værktøj | Beskrivelse |
|---------|-------------|
| `analyze_zigbee` | Analyser Zigbee-netværkssikkerhed &mdash; trust center-politik, netværksnøglehåndtering, KillerBee-angrebsmetodologi |
| `scan_iot_wireless` | Scan IoT trådløse protokoller &mdash; Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP-opdagelse og sårbarhedsanalyse |
| `find_mousejack` | Analyser MouseJack trådløs tastatur/mus-sårbarheder &mdash; tastetryksindsprøjtning, ukrypteret HID, leverandørspecifikke omgåelser |

</details>

<details>
<summary><b>Avanceret Trådløs (6) &mdash; Ingen API-nøgle</b></summary>

| Værktøj | Beskrivelse |
|---------|-------------|
| `analyze_airgap` | Analyser air-gap-eksfiltreringsteknikker &mdash; elektromagnetiske, akustiske, termiske, optiske skjulte kanaler og modforanstaltninger |
| `analyze_uwb` | Analyser Ultra-Wideband (UWB) sikkerhed &mdash; afstandsmålingmanipulation, relay-angreb på bilnøgler og AirTags, afstandssvindel |
| `analyze_wifi_csi` | Analyser WiFi Channel State Information (CSI) sikkerhed &mdash; passiv sensing, aktivitetsgenkendelse, tastaturindtastningsinferensrisici |
| `analyze_miracast` | Analyser Miracast/WiFi Display sikkerhed &mdash; WFD-sessionskapring, skærmfangst, uautoriseret displayadgang |
| `analyze_wifi_direct` | Analyser WiFi Direct (P2P) sikkerhed &mdash; gruppeejernegotiationsangreb, WPS-sårbarheder i P2P, rogue-gruppedannelse |
| `analyze_drone_rf` | Analyser drone RF-sikkerhed &mdash; kontrollink-kapring, GPS-spoofing, video-downlink-aflytning, counter-UAS-teknikker |

</details>

<details>
<summary><b>Infrastruktur (4) &mdash; Ingen API-nøgle (KISMET_* valgfrit til live WIDS)</b></summary>

| Værktøj | Beskrivelse |
|---------|-------------|
| `audit_wlan_controller` | Audit WLAN-controllerkonfiguration &mdash; Cisco WLC, Aruba, Meraki sikkerhedsindstillinger, rogue AP-politikker, RF-styring |
| `analyze_captive_portal` | Analyser captive portal-sikkerhed &mdash; omgåelsesteknikker, credential harvesting-risici, netværksisolation, gæste-VLAN-sikkerhed |
| `detect_mac_randomization` | Analyser MAC-adresse-randomisering &mdash; iOS/Android/Windows-implementeringsforskelle, sporingsmodstand, fingerprinting-omgåelser |
| `analyze_hotspot20` | Analyser Hotspot 2.0 (Passpoint) sikkerhed &mdash; ANQP, OSU, automatisk netværksvalg-risici, EAP-metodeanalyse |

</details>

<details>
<summary><b>Intelligens (4) &mdash; Ingen API-nøgle</b></summary>

| Værktøj | Beskrivelse |
|---------|-------------|
| `lookup_wireless_cve` | Slå trådløs-specifikke CVE'er op &mdash; WiFi-chipset-sårbarheder, Bluetooth-stak-CVE'er, driver-exploits, firmware-fejl |
| `lookup_hardware` | Slå trådløs sikkerhedshardware op &mdash; WiFi-adaptere, Bluetooth-sniffere, SDR-enheder, kapabiliteter, chipset-kompatibilitet |
| `map_wireless_attck` | Map trådløse angreb til MITRE ATT&CK-rammeværk &mdash; teknik-ID'er, taktikkategorier, detektionsstrategier |
| `analyze_medical_wireless` | Analyser medicinsk enhed trådløs sikkerhed &mdash; infusionspumper, pacemakere, patientmonitorer, FDA-vejledning, HIPAA-krav |

</details>

<details>
<summary><b>Detektion (2) &mdash; Ingen API-nøgle</b></summary>

| Værktøj | Beskrivelse |
|---------|-------------|
| `detect_wireless_attack` | Detekter igangværende trådløse angreb &mdash; deauth-oversvømmelser, evil twin, KARMA, rogue AP, BLE-spoofing, RF-jamming-indikatorer |
| `audit_wireless_compliance` | Audit trådløst netværk mod compliance-rammeværk &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, ISO 27001 trådløse kontroller |

</details>

<details>
<summary><b>Rapportering (1) &mdash; Ingen API-nøgle</b></summary>

| Værktøj | Beskrivelse |
|---------|-------------|
| `export_report` | Eksporter trådløs sikkerhedsvurderingsrapport &mdash; fund, risikovurderinger, compliance-status, udbedringskøreplan, ledelsesresumé |

</details>

---

### CLI Usage

```bash
# List alle tilgængelige værktøjer
npx wifi-security-mcp-server --list

# Kør ethvert værktøj direkte
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

Serveren leveres med 9 indbyggede videnbaser &mdash; ingen API-nøgler, ingen eksterne afhængigheder, ingen hastighedsbegrænsninger. Hver værktøjsforespørgsel beriges med struktureret intelligens fra disse databaser.

| Videnbase | Poster | Hvad den leverer |
|-----------|--------|-----------------|
| **WiFi-angreb** | 47 angreb | WPA/WPA2/WPA3-angrebsteknikker, evil twin-varianter, PMKID, KRACK, FragAttacks, deauth, WPS-exploits &mdash; hver med værktøjer, mitigeringer, MITRE ATT&CK-mapping |
| **Bluetooth-angreb** | 8 angreb | BlueBorne, KNOB, BIAS, BLE-relay, MITM, BLE-fuzzing, Bluetooth-imitation &mdash; med CVE'er og detektionsstrategier |
| **RF/SDR-angreb** | 6 angreb | Replay-angreb, jamming, signalinjektion, SDR-baseret aflytning, RF-fingerprinting-omgåelse, spektrumanalyseteknikker |
| **NFC/RFID-angreb** | 6 angreb | Kortkopierung, relay-angreb, MIFARE Classic-cracking, NFC-skimming, RFID-fuzzing, adgangskontrol-omgåelse med Proxmark3 |
| **Mobilangreb** | 6 angreb | IMSI-fangst, falsk basestation (Stingray), SS7-udnyttelse, 5G NAS-sårbarheder, downgrade-angreb, VoLTE-aflytning |
| **IoT-angreb** | 6 angreb | Zigbee-netværksnøgle-sniffing, Z-Wave S0-downgrade, MQTT-credential harvesting, LoRaWAN ABP-replay, MouseJack, BLE IoT-relay |
| **Hardwaredatabase** | 12 enheder | WiFi-adaptere (Alfa, TP-Link), Bluetooth-sniffere (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; chipsets, kapabiliteter, monitortilstandssupport |
| **CVE-database** | 17 CVE'er | Trådløs-specifikke CVE'er for WiFi-chipsets (Broadcom, Qualcomm, Intel), Bluetooth-stakke, IoT-firmware &mdash; alvorlighed, berørte versioner, exploit-tilgængelighed |
| **Compliance-rammeværk** | 5 rammeværk | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; trådløs-specifikke kontroller, audittjeklister, gap-analyse |

---

## Architecture

```
src/
  index.ts                    # CLI-indgangspunkt (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # MCP-server opsætning (stdio transport)
    tools.ts                  # Værktøjsregister — alle 34 sammensatte værktøjer samlet her
  types/
    index.ts                  # Delte typer (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 indbyggede videnbaser
    wifi-attacks.ts           # 47 WiFi-angrebsdefinitioner
    bluetooth-attacks.ts      # 8 Bluetooth-angrebsdefinitioner
    rf-attacks.ts             # 6 RF/SDR-angrebsdefinitioner
    nfc-attacks.ts            # 6 NFC/RFID-angrebsdefinitioner
    cellular-attacks.ts       # 6 Mobil/5G-angrebsdefinitioner
    iot-attacks.ts            # 6 IoT-angrebsdefinitioner
    hardware.ts               # 12 hardwareenhedsprofiler
    cve-database.ts           # 17 trådløse CVE'er
    compliance.ts             # 5 compliance-rammeværk
  wifi/                       # WiFi Core-værktøjer (8)
  bluetooth/                  # Bluetooth-værktøjer (3)
  rf/                         # RF/SDR-værktøjer (1)
  nfc/                        # NFC/RFID-værktøjer (1)
  cellular/                   # Mobil/5G-værktøjer (1)
  iot/                        # IoT trådløse værktøjer (3)
  advanced/                   # Avancerede trådløse værktøjer (6)
  infrastructure/             # Infrastrukturværktøjer (4)
  intelligence/               # Intelligensværktøjer (4)
  detection/                  # Detektionsværktøjer (2)
  reporting/                  # Rapporteringsværktøjer (1)
```

**Designbeslutninger:**

- **Videnbasedrevet** &mdash; I modsætning til API-afhængige værktøjer kører kernefunktionaliteten helt offline fra 9 indbyggede databaser. Ingen API-nøgler, ingen hastighedsbegrænsninger, ingen eksterne afhængigheder for den primære workflow.
- **34 sammensatte værktøjer, 139 individuelle funktioner** &mdash; Hvert værktøj er et komposit der bundler relaterede analyser. `find_wifi_attacks` lister ikke bare angreb &mdash; det returnerer metodologi, krævet hardware, MITRE ATT&CK-mapping, detektionsstrategier og modforanstaltninger.
- **2 runtime-afhængigheder** &mdash; `@modelcontextprotocol/sdk` og `zod`. Intet andet. Ingen native moduler, ingen binære afhængigheder, ingen platformspecifik kode.
- **Valgfri live-integration** &mdash; WiGLE API til virkelige netværksdata, Kismet til live trådløs IDS. Kerneanalyse fungerer uden nogen af dem.
- **Compliance-bevidst** &mdash; Hvert fund mappes automatisk til relevante compliance-rammeværk (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) når relevant.
- **MITRE ATT&CK-mappet** &mdash; Angrebsteknikker inkluderer ATT&CK-teknik-ID'er, taktikkategorier og detektionsdatakilder til SOC-integration.

---

## Limitations

- Videnbaser er tidspunktøjebliksbilleder &mdash; nye angreb/CVE'er kræver pakkeopdateringer
- WiGLE-integration kræver en gratis API-nøgle til netværksopslag
- Kismet live WIDS kræver en kørende Kismet-instans med API-adgang
- Ingen aktiv trådløs transmission &mdash; serveren leverer intelligens og metodologi, ikke pakkeinjektion
- Hardwaredatabasen dækker de mest almindelige sikkerhedsforskningsenheder, ikke udtømmende
- Compliance-rammeværk fokuserer på trådløs-specifikke kontroller, ikke fuld rammeværksdækning
- macOS / Linux testet (Windows ikke testet)

---

## Part of the MCP Security Suite

| Projekt | Domæne | Værktøjer |
|---------|--------|-----------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Browserbaseret sikkerhedstest | 39 værktøjer, Firefox, injektionstest |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Cloud-sikkerhed (AWS/Azure/GCP) | 38 værktøjer, 60+ kontroller |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub-sikkerhedspositur | 39 værktøjer, 45 kontroller |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Sårbarhedsintelligens | 23 værktøjer, 5 kilder |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT & rekognoscering | 37 værktøjer, 12 kilder |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark web & trusselsintelligens | 66 værktøjer, 16 kilder |
| **wifi-security-mcp-server** | **Trådløs sikkerhedsintelligens** | **34 værktøjer, 9 videnbaser** |

---

<p align="center">
<b>Kun til autoriseret sikkerhedstest og vurdering.</b><br>
Sørg altid for at have ordentlig autorisation, før du udfører trådløs sikkerhedstest på netværk eller enheder.<br>
Uautoriseret trådløs netværksadgang eller interferens er ulovligt i de fleste jurisdiktioner.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

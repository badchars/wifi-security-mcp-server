<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <strong>Deutsch</strong> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
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

<h3 align="center">Drahtlose Sicherheitsintelligenz für KI-Agenten.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Mobilfunk/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drohnen-RF, WIDS/WIPS, Compliance &mdash; vereint in einem einzigen MCP-Server.<br>
  Ihr KI-Agent erhält <b>vollständige drahtlose Sicherheitsanalyse auf Abruf</b>, unterstützt durch 9 integrierte Wissensdatenbanken mit 139 einzelnen Tools.
</p>

<br>

<p align="center">
  <a href="#the-problem">Das Problem</a> &bull;
  <a href="#how-its-different">Der Unterschied</a> &bull;
  <a href="#quick-start">Schnellstart</a> &bull;
  <a href="#what-the-ai-can-do">Was die KI kann</a> &bull;
  <a href="#tools-reference-34-composite-tools">Tools (34)</a> &bull;
  <a href="#knowledge-bases-9">Wissensdatenbanken</a> &bull;
  <a href="#architecture">Architektur</a> &bull;
  <a href="CHANGELOG.md">Changelog</a> &bull;
  <a href="CONTRIBUTING.md">Mitwirken</a>
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

Die Bewertung der drahtlosen Sicherheit ist eine der am stärksten fragmentierten Disziplinen in der offensiven Sicherheit. WiFi-Auditing erfordert ein Set von Tools, Bluetooth ein anderes, RF/SDR ein drittes, IoT-Protokolle noch ein weiteres &mdash; und jeder Bereich hat seine eigene Angriffsfläche, seine eigenen Schwachstellen, seine eigenen Compliance-Anforderungen. Heute führen Sie aircrack-ng für WPA aus, verwenden Bettercap für BLE, starten HackRF für SDR, konsultieren verschiedene CVE-Datenbanken für jeden Chipsatz, referenzieren NIST und PCI-DSS separat und verbringen dann Stunden damit, Ergebnisse manuell in eine kohärente Bewertung zu korrelieren.

```
Traditioneller Workflow für drahtlose Sicherheit:
  WiFi-Netzwerke auditieren       ->  aircrack-ng / Wireshark / Kismet
  Bluetooth-Sicherheit testen     ->  Bettercap / btlejack / Ubertooth
  RF-Signale analysieren          ->  HackRF / GNU Radio / GQRX
  NFC/RFID prüfen                 ->  Proxmark3 / libnfc
  Mobilfunksicherheit bewerten    ->  srsRAN / OpenBTS
  IoT-Protokolle testen           ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  Drahtlose CVEs nachschlagen     ->  NVD / vendor advisories (manuelle Suche)
  Compliance prüfen               ->  NIST / PCI-DSS / HIPAA docs (manuell)
  Auf MITRE ATT&CK abbilden       ->  ATT&CK Navigator (manuelles Mapping)
  Alles korrelieren               ->  Kopieren-Einfügen in einen Bericht
  ────────────────────────────────
  Gesamt: Stunden pro Bewertung, der Großteil davon Kontextwechsel zwischen Tools
```

**wifi-security-mcp-server** gibt Ihrem KI-Agenten über das [Model Context Protocol](https://modelcontextprotocol.io) 34 zusammengesetzte Tools, unterstützt durch 9 Wissensdatenbanken mit 139 einzelnen Funktionen. Der Agent analysiert Netzwerke, identifiziert Schwachstellen, bildet Angriffe auf MITRE ATT&CK ab, prüft die Compliance und erstellt umsetzbare Berichte &mdash; in einem einzigen Gespräch.

```
Mit wifi-security-mcp-server:
  Sie: "Auditieren Sie die drahtlose Sicherheit unseres Büronetzwerks mit WPA2-Enterprise"

  Agent: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "Ihr WPA2-Enterprise-Netzwerk hat 3 kritische Befunde:
            1. EAP-PEAP ohne Zertifikat-Pinning — anfällig für Evil Twin
               mit hostapd-mana (MITRE T1557.002)
            2. Kein 802.11w (PMF) — anfällig für Deauthentifizierungsangriffe
               (MITRE T1498.001)
            3. PMKID-Hash ohne Client-Interaktion extrahierbar — Offline-
               Cracking mit hashcat Modus 22000 möglich
            PCI-DSS 4.0: 2 Kontrollen nicht konform (4.2.1, 11.2.1).
            Empfohlen: Migration zu WPA3-Enterprise mit SAE, PMF aktivieren,
            WIDS für Rogue-AP-Erkennung einsetzen."
```

---

## How It's Different

Bestehende Tools liefern Ihnen rohe Paketerfassungen und protokollspezifische Analysen. wifi-security-mcp-server gibt Ihrem KI-Agenten die Fähigkeit, **gleichzeitig über alle drahtlosen Domänen hinweg zu argumentieren**, mit tiefgreifender Wissensdatenbank-Unterstützung.

<table>
<thead>
<tr>
<th></th>
<th>Traditioneller Ansatz</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Schnittstelle</b></td>
<td>10+ verschiedene CLIs, GUIs und Hardware-Tools</td>
<td>MCP &mdash; KI-Agent ruft Tools im Gespräch auf</td>
</tr>
<tr>
<td><b>Abdeckung</b></td>
<td>Ein Protokoll nach dem anderen</td>
<td>WiFi, Bluetooth, RF, NFC, Mobilfunk, IoT &mdash; alles in einem Server</td>
</tr>
<tr>
<td><b>Wissen</b></td>
<td>Manuelles CVE-Nachschlagen, manuelles ATT&CK-Mapping</td>
<td>9 integrierte Wissensdatenbanken mit 139 vorgemappten Einträgen</td>
</tr>
<tr>
<td><b>Angriffsintelligenz</b></td>
<td>Google-Suche + Blogbeiträge + Konferenzvorträge</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Mobilfunk + 6 IoT Angriffe katalogisiert mit Tools, Gegenmaßnahmen, ATT&CK-IDs</td>
</tr>
<tr>
<td><b>Compliance</b></td>
<td>NIST/PCI-DSS/HIPAA-PDFs lesen, Kontrollen manuell zuordnen</td>
<td>Agent prüft automatisch gegen 5 Compliance-Frameworks</td>
</tr>
<tr>
<td><b>API-Schlüssel</b></td>
<td>Verschiedene Konten für verschiedene Dienste</td>
<td>Keine API-Schlüssel für Kernfunktionalität &mdash; wissensdatenbankgesteuert</td>
</tr>
<tr>
<td><b>Einrichtung</b></td>
<td>aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark installieren...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; ein Befehl, keine Konfiguration</td>
</tr>
</tbody>
</table>

---

## Quick Start

### Option 1: npx (keine Installation)

```bash
npx wifi-security-mcp-server
```

Alle 34 Tools funktionieren sofort. Keine API-Schlüssel erforderlich &mdash; Kernfunktionalität ist wissensdatenbankgesteuert.

### Option 2: Klonen

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Umgebungsvariablen (optional)

```bash
# WiGLE — Wardriving-Datenbank für reale WiFi-Netzwerkabfragen
export WIGLE_API_KEY=your-key

# Kismet — Live drahtlose Einbruchserkennung
export KISMET_HOST=127.0.0.1      # Standard: 127.0.0.1
export KISMET_PORT=2501           # Standard: 2501
export KISMET_API_KEY=your-key
```

Alle API-Schlüssel sind optional. Ohne sie haben Sie weiterhin vollen Zugriff auf alle 34 Tools, unterstützt durch 9 integrierte Wissensdatenbanken zu WiFi-Angriffen, Bluetooth-Angriffen, RF/SDR, NFC/RFID, Mobilfunk, IoT, Hardware-Datenbank, CVE-Intelligenz und Compliance-Frameworks.

### Mit Ihrem KI-Agenten verbinden

<details open>
<summary><b>Claude Code</b></summary>

```bash
# Mit npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# Mit lokalem Klon
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Zu `~/Library/Application Support/Claude/claude_desktop_config.json` hinzufügen:

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
<summary><b>Cursor / Windsurf / andere MCP-Clients</b></summary>

Gleiches JSON-Konfigurationsformat. Richten Sie den Befehl auf `npx wifi-security-mcp-server` oder Ihren lokalen Installationspfad.

</details>

### Abfragen starten

```
Sie: "Welche Angriffe sind gegen ein WPA3-SAE-Netzwerk möglich und wie teste ich darauf?"
```

Das war's. Der Agent schlägt Angriffe nach, bildet sie auf MITRE ATT&CK ab, empfiehlt Tools und bietet schrittweise Methodik &mdash; alles aus integrierten Wissensdatenbanken.

---

## What The AI Can Do

### WiFi-Sicherheitsbewertung

```
Sie: "Analysieren Sie die Sicherheit eines WPA2-PSK-Netzwerks mit aktiviertem WPS"

Agent: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "Kritische Schwachstellen in WPA2-PSK + WPS-Konfiguration gefunden:
          1. WPS Pixie Dust Angriff — PIN in Sekunden wiederherstellbar durch
             Offline-Brute-Force der E-S1/E-S2 Nonces (Reaver + PixieWPS).
             Vollständige PSK-Wiederherstellung ohne Client-Interaktion.
          2. PMKID-Angriff — erstes Paket des 4-Way-Handshakes enthält
             PMKID-Hash, offline knackbar mit hashcat -m 22000.
             Kein Deauth nötig, kein Client nötig.
          3. 4-Way-Handshake-Erfassung — EAPOL-Frames erfassbar mit
             airodump-ng + Deauth, dann Offline-Wörterbuchangriff.
          Priorität: WPS sofort deaktivieren (höchstes Risiko), starkes
          20+ Zeichen PSK erzwingen, Migration zu WPA3-SAE erwägen."
```

### Bluetooth & BLE Analyse

```
Sie: "Welche Sicherheitsrisiken hat unser BLE-basiertes Zugangskontrollsystem?"

Agent: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "BLE-Zugangskontrollsystem — 4 kritische Risiken identifiziert:
          1. JustWorks-Pairing — kein MITM-Schutz. Angreifer kann
             Pairing mit Ubertooth One abfangen (MITRE T1040).
          2. GATT-Charakteristik-Sniffing — Entsperrbefehle werden im
             Klartext gesendet, wiederholbar mit gatttool (MITRE T1212).
          3. BLE-Relay/Replay-Angriff — legitimes Entsperrsignal mit
             zwei Geräten + btlejack weiterleiten (MITRE T1557).
          4. MAC-Adress-Tracking — statische BLE-MAC ermöglicht
             Personenverfolgung (MITRE T1592.002).
          Empfohlen: LE Secure Connections (LESC) mit numerischem
          Vergleich erzwingen, GATT-Charakteristiken verschlüsseln,
          Rolling-Nonces für Replay-Schutz implementieren."
```

### IoT-Drahtlos-Audit

```
Sie: "Bewerten Sie die drahtlose Sicherheit unserer Smart-Building-IoT-Bereitstellung"

Agent: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "Smart Building IoT Drahtlosbewertung — 5 Befunde:
          1. Zigbee: Standard Trust Center Link Key (ZigBeeAlliance09)
             ermöglicht Netzwerk-Join-Abfang mit KillerBee (KRITISCH)
          2. MQTT: Broker auf Port 1883 ohne TLS — Anmeldedaten
             und Sensordaten werden im Klartext übertragen
          3. Z-Wave: S0-Sicherheit mit bekannter Schlüsselaustausch-
             Schwachstelle — S2-Upgrade empfohlen
          4. MouseJack: 3 Logitech Unifying-Empfänger anfällig für
             Tastatureingabe-Injektion (CVE-2016-10761)
          5. WiFi: IoT-Geräte im selben VLAN wie Unternehmensnetzwerk
             — keine Netzwerksegmentierung
          Prioritäre Behebung: MQTT TLS, Zigbee Install-Codes,
          IoT-VLAN-Isolation, anfällige Logitech-Empfänger ersetzen."
```

### Compliance-Audit

```
Sie: "Prüfen Sie unser Krankenhaus-WiFi gegen HIPAA-Drahtlosanforderungen"

Agent: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "HIPAA Drahtlos-Compliance-Audit — 6 Befunde:
          3 NICHT-KONFORME Kontrollen:
          - 164.312(a)(1): Keine drahtlose IDS für Rogue-AP-Erkennung eingesetzt
          - 164.312(e)(1): Medizingeräte verwenden WPA2-PSK (nicht Enterprise)
          - 164.312(e)(2): Keine Audit-Protokollierung der drahtlosen Verkehrsverschlüsselung
          3 KONFORME Kontrollen:
          - 164.310(a)(1): Physische AP-Standorte dokumentiert
          - 164.312(a)(2): 802.1X mit RADIUS-Authentifizierung
          - 164.312(d): Zertifikatbasiertes EAP-TLS für Mitarbeitergeräte
          Behebungsplan: WIDS einsetzen (Kismet/AirMagnet), Medizingeräte
          auf WPA2-Enterprise mit MAB migrieren, drahtlose Audit-
          Protokollierung auf WLAN-Controller aktivieren."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; Kein API-Schlüssel</b></summary>

| Tool | Beschreibung |
|------|-------------|
| `scan_wifi_networks` | WiFi-Netzwerke scannen und analysieren &mdash; SSIDs, Kanäle, Verschlüsselungstypen, Signalstärke und Sicherheitsfehlkonfigurationen erkennen |
| `analyze_wifi_security` | Tiefgehende Analyse der WiFi-Sicherheitskonfiguration &mdash; Verschlüsselungsstärke, Authentifizierungsmethode, bekannte Schwachstellen, Angriffsfläche |
| `find_wifi_attacks` | Anwendbare Angriffe für ein WiFi-Ziel finden &mdash; gibt Angriffsmethodik, benötigte Tools, MITRE ATT&CK-Mapping, Gegenmaßnahmen zurück |
| `simulate_evil_twin` | Evil-Twin-AP-Angriffsszenarien simulieren und analysieren &mdash; hostapd-mana-Konfiguration, Captive Portal, Credential-Capture-Methodik |
| `analyze_deauth` | Deauthentifizierungs-Angriffsvektoren analysieren &mdash; 802.11w PMF-Status, Deauth-Erkennung, Gegenmaßnahmen, WIDS-Integration |
| `crack_wps` | WPS-Cracking-Angriffsvektoren analysieren &mdash; Pixie Dust, Brute Force, Null-PIN, Standard-PIN-Generierung, Reaver/Bully-Methodik |
| `analyze_pmkid` | PMKID-basierte Angriffsvektoren analysieren &mdash; clientloses WPA/WPA2-Cracking via hcxdumptool + hashcat Modus 22000 |
| `audit_wifi67` | WiFi 6 (802.11ax) und WiFi 7 (802.11be) spezifische Sicherheitsfunktionen auditieren &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; Kein API-Schlüssel</b></summary>

| Tool | Beschreibung |
|------|-------------|
| `scan_bluetooth` | Bluetooth-Geräte scannen und analysieren &mdash; BR/EDR Classic und BLE Discovery, Dienstenumeration, Pairing-Analyse |
| `find_bluetooth_attacks` | Anwendbare Bluetooth-Angriffe finden &mdash; BlueBorne, KNOB, BIAS, BLE-Relay, MITM, mit Tools und Gegenmaßnahmen |
| `analyze_ble` | Tiefgehende Analyse der BLE-Sicherheit &mdash; GATT-Dienste, Pairing-Methoden, LE Secure Connections, Charakteristik-Verschlüsselung |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; Kein API-Schlüssel</b></summary>

| Tool | Beschreibung |
|------|-------------|
| `analyze_rf_signal` | RF-Signalsicherheit analysieren &mdash; Frequenzanalyse, Modulationsidentifikation, Replay-Angriffsmachbarkeit, SDR-Tool-Empfehlungen |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; Kein API-Schlüssel</b></summary>

| Tool | Beschreibung |
|------|-------------|
| `analyze_nfc_security` | NFC/RFID-Sicherheit analysieren &mdash; Kartentyp-Identifikation, Zugangskontroll-Schwachstellen, Klonierungsmachbarkeit, Proxmark3-Methodik |

</details>

<details>
<summary><b>Mobilfunk/5G (1) &mdash; Kein API-Schlüssel</b></summary>

| Tool | Beschreibung |
|------|-------------|
| `analyze_cellular_security` | Mobilfunknetzwerksicherheit analysieren &mdash; 2G/3G/4G/5G-Protokollschwachstellen, IMSI-Catcher-Erkennung, Fake-Basisstation-Analyse |

</details>

<details>
<summary><b>IoT Drahtlos (3) &mdash; Kein API-Schlüssel</b></summary>

| Tool | Beschreibung |
|------|-------------|
| `analyze_zigbee` | Zigbee-Netzwerksicherheit analysieren &mdash; Trust-Center-Richtlinie, Netzwerkschlüsselverwaltung, KillerBee-Angriffsmethodik |
| `scan_iot_wireless` | IoT-Drahtlosprotokolle scannen &mdash; Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP Discovery und Schwachstellenanalyse |
| `find_mousejack` | MouseJack drahtlose Tastatur/Maus-Schwachstellen analysieren &mdash; Tastatureingabe-Injektion, unverschlüsseltes HID, herstellerspezifische Umgehungen |

</details>

<details>
<summary><b>Erweitert Drahtlos (6) &mdash; Kein API-Schlüssel</b></summary>

| Tool | Beschreibung |
|------|-------------|
| `analyze_airgap` | Air-Gap-Exfiltrationstechniken analysieren &mdash; elektromagnetische, akustische, thermische, optische verdeckte Kanäle und Gegenmaßnahmen |
| `analyze_uwb` | Ultra-Wideband (UWB) Sicherheit analysieren &mdash; Entfernungsmessung-Manipulation, Relay-Angriffe auf Autoschlüssel und AirTags, Distanzbetrug |
| `analyze_wifi_csi` | WiFi Channel State Information (CSI) Sicherheit analysieren &mdash; passives Sensing, Aktivitätserkennung, Tastatureingabe-Inferenzrisiken |
| `analyze_miracast` | Miracast/WiFi Display Sicherheit analysieren &mdash; WFD-Session-Hijacking, Bildschirmerfassung, unbefugter Display-Zugriff |
| `analyze_wifi_direct` | WiFi Direct (P2P) Sicherheit analysieren &mdash; Gruppenbesitzer-Verhandlungsangriffe, WPS-Schwachstellen in P2P, Rogue-Gruppenbildung |
| `analyze_drone_rf` | Drohnen-RF-Sicherheit analysieren &mdash; Steuerlink-Hijacking, GPS-Spoofing, Video-Downlink-Abfang, Counter-UAS-Techniken |

</details>

<details>
<summary><b>Infrastruktur (4) &mdash; Kein API-Schlüssel (KISMET_* optional für Live-WIDS)</b></summary>

| Tool | Beschreibung |
|------|-------------|
| `audit_wlan_controller` | WLAN-Controller-Konfiguration auditieren &mdash; Cisco WLC, Aruba, Meraki Sicherheitseinstellungen, Rogue-AP-Richtlinien, RF-Management |
| `analyze_captive_portal` | Captive-Portal-Sicherheit analysieren &mdash; Umgehungstechniken, Credential-Harvesting-Risiken, Netzwerkisolation, Gast-VLAN-Sicherheit |
| `detect_mac_randomization` | MAC-Adress-Randomisierung analysieren &mdash; iOS/Android/Windows-Implementierungsunterschiede, Tracking-Resistenz, Fingerprinting-Umgehungen |
| `analyze_hotspot20` | Hotspot 2.0 (Passpoint) Sicherheit analysieren &mdash; ANQP, OSU, automatische Netzwerkauswahl-Risiken, EAP-Methodenanalyse |

</details>

<details>
<summary><b>Intelligenz (4) &mdash; Kein API-Schlüssel</b></summary>

| Tool | Beschreibung |
|------|-------------|
| `lookup_wireless_cve` | Drahtlosspezifische CVEs nachschlagen &mdash; WiFi-Chipsatz-Schwachstellen, Bluetooth-Stack-CVEs, Treiber-Exploits, Firmware-Bugs |
| `lookup_hardware` | Drahtlose Sicherheitshardware nachschlagen &mdash; WiFi-Adapter, Bluetooth-Sniffer, SDR-Geräte, Fähigkeiten, Chipsatz-Kompatibilität |
| `map_wireless_attck` | Drahtlose Angriffe auf MITRE ATT&CK-Framework abbilden &mdash; Technik-IDs, Taktik-Kategorien, Erkennungsstrategien |
| `analyze_medical_wireless` | Drahtlose Sicherheit medizinischer Geräte analysieren &mdash; Infusionspumpen, Herzschrittmacher, Patientenmonitore, FDA-Richtlinien, HIPAA-Anforderungen |

</details>

<details>
<summary><b>Erkennung (2) &mdash; Kein API-Schlüssel</b></summary>

| Tool | Beschreibung |
|------|-------------|
| `detect_wireless_attack` | Laufende drahtlose Angriffe erkennen &mdash; Deauth-Floods, Evil Twin, KARMA, Rogue AP, BLE-Spoofing, RF-Jamming-Indikatoren |
| `audit_wireless_compliance` | Drahtlosnetzwerk gegen Compliance-Frameworks auditieren &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, ISO 27001 Drahtloskontrollen |

</details>

<details>
<summary><b>Berichterstattung (1) &mdash; Kein API-Schlüssel</b></summary>

| Tool | Beschreibung |
|------|-------------|
| `export_report` | Drahtlose Sicherheitsbewertungsbericht exportieren &mdash; Befunde, Risikobewertungen, Compliance-Status, Behebungs-Roadmap, Zusammenfassung |

</details>

---

### CLI Usage

```bash
# Alle verfügbaren Tools auflisten
npx wifi-security-mcp-server --list

# Jedes Tool direkt ausführen
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

Der Server wird mit 9 integrierten Wissensdatenbanken ausgeliefert &mdash; keine API-Schlüssel, keine externen Abhängigkeiten, keine Ratenbegrenzungen. Jede Tool-Abfrage wird mit strukturierter Intelligenz aus diesen Datenbanken angereichert.

| Wissensdatenbank | Einträge | Was sie bietet |
|-----------------|----------|----------------|
| **WiFi-Angriffe** | 47 Angriffe | WPA/WPA2/WPA3-Angriffstechniken, Evil-Twin-Varianten, PMKID, KRACK, FragAttacks, Deauth, WPS-Exploits &mdash; jeweils mit Tools, Gegenmaßnahmen, MITRE ATT&CK-Mapping |
| **Bluetooth-Angriffe** | 8 Angriffe | BlueBorne, KNOB, BIAS, BLE-Relay, MITM, BLE-Fuzzing, Bluetooth-Impersonation &mdash; mit CVEs und Erkennungsstrategien |
| **RF/SDR-Angriffe** | 6 Angriffe | Replay-Angriffe, Jamming, Signaleinspeisung, SDR-basiertes Abfangen, RF-Fingerprinting-Umgehung, Spektrumanalysetechniken |
| **NFC/RFID-Angriffe** | 6 Angriffe | Kartenklonung, Relay-Angriffe, MIFARE Classic Cracking, NFC-Skimming, RFID-Fuzzing, Zugangskontrollumgehung mit Proxmark3 |
| **Mobilfunk-Angriffe** | 6 Angriffe | IMSI-Catching, Fake-Basisstation (Stingray), SS7-Ausnutzung, 5G-NAS-Schwachstellen, Downgrade-Angriffe, VoLTE-Abfang |
| **IoT-Angriffe** | 6 Angriffe | Zigbee-Netzwerkschlüssel-Sniffing, Z-Wave S0-Downgrade, MQTT-Credential-Harvesting, LoRaWAN ABP-Replay, MouseJack, BLE IoT-Relay |
| **Hardware-Datenbank** | 12 Geräte | WiFi-Adapter (Alfa, TP-Link), Bluetooth-Sniffer (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; Chipsätze, Fähigkeiten, Monitor-Modus-Unterstützung |
| **CVE-Datenbank** | 17 CVEs | Drahtlosspezifische CVEs für WiFi-Chipsätze (Broadcom, Qualcomm, Intel), Bluetooth-Stacks, IoT-Firmware &mdash; Schweregrad, betroffene Versionen, Exploit-Verfügbarkeit |
| **Compliance-Frameworks** | 5 Frameworks | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; drahtlosspezifische Kontrollen, Audit-Checklisten, Gap-Analyse |

---

## Architecture

```
src/
  index.ts                    # CLI-Einstiegspunkt (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # MCP-Server-Setup (stdio transport)
    tools.ts                  # Tool-Registry — alle 34 zusammengesetzten Tools hier zusammengebaut
  types/
    index.ts                  # Gemeinsame Typen (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 integrierte Wissensdatenbanken
    wifi-attacks.ts           # 47 WiFi-Angriffsdefinitionen
    bluetooth-attacks.ts      # 8 Bluetooth-Angriffsdefinitionen
    rf-attacks.ts             # 6 RF/SDR-Angriffsdefinitionen
    nfc-attacks.ts            # 6 NFC/RFID-Angriffsdefinitionen
    cellular-attacks.ts       # 6 Mobilfunk/5G-Angriffsdefinitionen
    iot-attacks.ts            # 6 IoT-Angriffsdefinitionen
    hardware.ts               # 12 Hardware-Geräteprofile
    cve-database.ts           # 17 drahtlose CVEs
    compliance.ts             # 5 Compliance-Frameworks
  wifi/                       # WiFi Core Tools (8)
  bluetooth/                  # Bluetooth Tools (3)
  rf/                         # RF/SDR Tools (1)
  nfc/                        # NFC/RFID Tools (1)
  cellular/                   # Mobilfunk/5G Tools (1)
  iot/                        # IoT Drahtlos Tools (3)
  advanced/                   # Erweiterte Drahtlos Tools (6)
  infrastructure/             # Infrastruktur Tools (4)
  intelligence/               # Intelligenz Tools (4)
  detection/                  # Erkennungs Tools (2)
  reporting/                  # Berichterstattungs Tools (1)
```

**Designentscheidungen:**

- **Wissensdatenbankgesteuert** &mdash; Im Gegensatz zu API-abhängigen Tools läuft die Kernfunktionalität vollständig offline aus 9 integrierten Datenbanken. Keine API-Schlüssel, keine Ratenbegrenzungen, keine externen Abhängigkeiten für den primären Workflow.
- **34 zusammengesetzte Tools, 139 einzelne Fähigkeiten** &mdash; Jedes Tool ist ein Komposit, das verwandte Analysen bündelt. `find_wifi_attacks` listet nicht nur Angriffe auf &mdash; es gibt Methodik, benötigte Hardware, MITRE ATT&CK-Mapping, Erkennungsstrategien und Gegenmaßnahmen zurück.
- **2 Laufzeitabhängigkeiten** &mdash; `@modelcontextprotocol/sdk` und `zod`. Nichts weiter. Keine nativen Module, keine binären Abhängigkeiten, kein plattformspezifischer Code.
- **Optionale Live-Integration** &mdash; WiGLE API für reale Netzwerkdaten, Kismet für Live-Drahtlos-IDS. Kernanalyse funktioniert ohne beides.
- **Compliance-bewusst** &mdash; Jeder Befund wird automatisch auf relevante Compliance-Frameworks (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) abgebildet, wenn zutreffend.
- **MITRE ATT&CK-gemappt** &mdash; Angriffstechniken enthalten ATT&CK-Technik-IDs, Taktik-Kategorien und Erkennungsdatenquellen für SOC-Integration.

---

## Limitations

- Wissensdatenbanken sind Zeitpunktaufnahmen &mdash; neue Angriffe/CVEs erfordern Paketaktualisierungen
- WiGLE-Integration erfordert einen kostenlosen API-Schlüssel für Netzwerkabfragen
- Kismet Live-WIDS erfordert eine laufende Kismet-Instanz mit API-Zugriff
- Keine aktive drahtlose Übertragung &mdash; der Server liefert Intelligenz und Methodik, keine Paketinjektion
- Hardware-Datenbank deckt die gängigsten Sicherheitsforschungsgeräte ab, nicht vollständig
- Compliance-Frameworks konzentrieren sich auf drahtlosspezifische Kontrollen, nicht auf vollständige Framework-Abdeckung
- macOS / Linux getestet (Windows nicht getestet)

---

## Part of the MCP Security Suite

| Projekt | Bereich | Tools |
|---------|---------|-------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Browserbasierte Sicherheitstests | 39 Tools, Firefox, Injektionstests |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Cloud-Sicherheit (AWS/Azure/GCP) | 38 Tools, 60+ Prüfungen |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub-Sicherheitslage | 39 Tools, 45 Prüfungen |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Schwachstellen-Intelligenz | 23 Tools, 5 Quellen |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT & Aufklärung | 37 Tools, 12 Quellen |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark Web & Bedrohungsintelligenz | 66 Tools, 16 Quellen |
| **wifi-security-mcp-server** | **Drahtlose Sicherheitsintelligenz** | **34 Tools, 9 Wissensdatenbanken** |

---

<p align="center">
<b>Nur für autorisierte Sicherheitstests und -bewertungen.</b><br>
Stellen Sie immer sicher, dass Sie eine ordnungsgemäße Autorisierung haben, bevor Sie drahtlose Sicherheitstests an Netzwerken oder Geräten durchführen.<br>
Unbefugter Zugriff auf drahtlose Netzwerke oder Störungen sind in den meisten Rechtsgebieten illegal.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

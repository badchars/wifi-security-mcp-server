<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <strong>Norsk</strong> |
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

<h3 align="center">Trådløs sikkerhetsintelligens for AI-agenter.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Mobilnett/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drone RF, WIDS/WIPS, Samsvar &mdash; samlet i én enkelt MCP-server.<br>
  Din AI-agent får <b>fullspektrum trådløs sikkerhetsanalyse på forespørsel</b>, drevet av 9 innebygde kunnskapsbaser som dekker 139 individuelle verktøy.
</p>

<br>

<p align="center">
  <a href="#the-problem">Problemet</a> &bull;
  <a href="#how-its-different">Hvordan det er annerledes</a> &bull;
  <a href="#quick-start">Hurtigstart</a> &bull;
  <a href="#what-the-ai-can-do">Hva AI-en kan gjøre</a> &bull;
  <a href="#tools-reference-34-composite-tools">Verktøy (34)</a> &bull;
  <a href="#knowledge-bases-9">Kunnskapsbaser</a> &bull;
  <a href="#architecture">Arkitektur</a> &bull;
  <a href="CHANGELOG.md">Endringslogg</a> &bull;
  <a href="CONTRIBUTING.md">Bidra</a>
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

Vurdering av trådløs sikkerhet er en av de mest fragmenterte disiplinene innen offensiv sikkerhet. WiFi-revisjon krever ett sett med verktøy, Bluetooth et annet, RF/SDR et tredje, IoT-protokoller enda et &mdash; og hvert domene har sin egen angrepsflate, sine egne sårbarheter, sine egne samsvarkrav. I dag kjører du aircrack-ng for WPA, bruker Bettercap for BLE, starter HackRF for SDR, konsulterer ulike CVE-databaser for hver brikke, refererer til NIST og PCI-DSS separat, og bruker deretter timer på å manuelt korrelere funn til en sammenhengende vurdering.

```
Tradisjonell arbeidsflyt for trådløs sikkerhet:
  revisjon av WiFi-nettverk          ->  aircrack-ng / Wireshark / Kismet
  teste Bluetooth-sikkerhet          ->  Bettercap / btlejack / Ubertooth
  analysere RF-signaler              ->  HackRF / GNU Radio / GQRX
  sjekke NFC/RFID                    ->  Proxmark3 / libnfc
  vurdere mobilnettsikkerhet         ->  srsRAN / OpenBTS
  teste IoT-protokoller              ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  slå opp trådløse CVE-er            ->  NVD / vendor advisories (manuelt søk)
  sjekke samsvar                     ->  NIST / PCI-DSS / HIPAA docs (manuelt)
  kartlegge til MITRE ATT&CK         ->  ATT&CK Navigator (manuell kartlegging)
  korrelere alt                      ->  kopier-lim inn i en rapport
  ────────────────────────────────
  Totalt: timer per vurdering, mesteparten brukt på kontekstbytte mellom verktøy
```

**wifi-security-mcp-server** gir AI-agenten din 34 sammensatte verktøy støttet av 9 kunnskapsbaser som dekker 139 individuelle egenskaper via [Model Context Protocol](https://modelcontextprotocol.io). Agenten analyserer nettverk, identifiserer sårbarheter, kartlegger angrep til MITRE ATT&CK, sjekker samsvar og genererer handlingsrettede rapporter &mdash; i én enkelt samtale.

```
Med wifi-security-mcp-server:
  Du: "Revider den trådløse sikkerheten til kontonettverket vårt som kjører WPA2-Enterprise"

  Agent: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "Ditt WPA2-Enterprise-nettverk har 3 kritiske funn:
            1. EAP-PEAP uten sertifikatfesting — sårbar for evil twin
               med hostapd-mana (MITRE T1557.002)
            2. Ingen 802.11w (PMF) — utsatt for deautentiseringsangrep
               (MITRE T1498.001)
            3. PMKID-hash kan hentes uten klientinteraksjon — offline-
               knekking mulig med hashcat modus 22000
            PCI-DSS 4.0: 2 kontroller ikke-samsvarende (4.2.1, 11.2.1).
            Anbefalt: migrer til WPA3-Enterprise med SAE, aktiver PMF,
            distribuer WIDS for deteksjon av uautoriserte tilgangspunkter."
```

---

## How It's Different

Eksisterende verktøy gir deg rå pakkefangster og protokollspesifikk analyse. wifi-security-mcp-server gir AI-agenten din evnen til å **resonnere på tvers av alle trådløse domener samtidig** med dyp kunnskapsbasestøtte.

<table>
<thead>
<tr>
<th></th>
<th>Tradisjonell tilnærming</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Grensesnitt</b></td>
<td>10+ forskjellige CLI-er, GUI-er og maskinvareverktøy</td>
<td>MCP &mdash; AI-agent kaller verktøy gjennom samtale</td>
</tr>
<tr>
<td><b>Dekning</b></td>
<td>Én protokoll om gangen</td>
<td>WiFi, Bluetooth, RF, NFC, Mobilnett, IoT &mdash; alt i én server</td>
</tr>
<tr>
<td><b>Kunnskap</b></td>
<td>Manuelt CVE-oppslag, manuell ATT&CK-kartlegging</td>
<td>9 innebygde kunnskapsbaser med 139 forhåndskartlagte elementer</td>
</tr>
<tr>
<td><b>Angrepsintelligens</b></td>
<td>Google-søk + blogginnlegg + konferanseforedrag</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Mobilnett + 6 IoT-angrep katalogisert med verktøy, mottiltak, ATT&CK-ID-er</td>
</tr>
<tr>
<td><b>Samsvar</b></td>
<td>Lese NIST/PCI-DSS/HIPAA PDF-er, kartlegge kontroller manuelt</td>
<td>Agenten sjekker automatisk mot 5 samsvarsrammeverk</td>
</tr>
<tr>
<td><b>API-nøkler</b></td>
<td>Ulike kontoer for ulike tjenester</td>
<td>Null API-nøkler for kjernefunksjonalitet &mdash; kunnskapsbasedrevet</td>
</tr>
<tr>
<td><b>Oppsett</b></td>
<td>Installer aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; én kommando, null konfigurasjon</td>
</tr>
</tbody>
</table>

---

## Quick Start

### Alternativ 1: npx (ingen installasjon)

```bash
npx wifi-security-mcp-server
```

Alle 34 verktøy fungerer umiddelbart. Ingen API-nøkler nødvendig &mdash; kjernefunksjonaliteten er kunnskapsbasedrevet.

### Alternativ 2: Klon

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Miljøvariabler (valgfritt)

```bash
# WiGLE — wardriving-database for oppslag av virkelige WiFi-nettverk
export WIGLE_API_KEY=your-key

# Kismet — sanntids trådløs inntrengningsdeteksjon
export KISMET_HOST=127.0.0.1      # Standard: 127.0.0.1
export KISMET_PORT=2501           # Standard: 2501
export KISMET_API_KEY=your-key
```

Alle API-nøkler er valgfrie. Uten dem har du fortsatt full tilgang til alle 34 verktøy drevet av 9 innebygde kunnskapsbaser som dekker WiFi-angrep, Bluetooth-angrep, RF/SDR, NFC/RFID, mobilnett, IoT, maskinvaredatabase, CVE-intelligens og samsvarsrammeverk.

### Koble til AI-agenten din

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

Legg til i `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

Samme JSON-konfigurasjonsformat. Pek kommandoen til `npx wifi-security-mcp-server` eller din lokale installasjonssti.

</details>

### Begynn å spørre

```
Du: "Hvilke angrep er mulige mot et WPA3-SAE-nettverk og hvordan tester jeg for dem?"
```

Det er alt. Agenten slår opp angrep, kartlegger dem til MITRE ATT&CK, anbefaler verktøy og gir steg-for-steg-metodikk &mdash; alt fra innebygde kunnskapsbaser.

---

## What The AI Can Do

### WiFi-sikkerhetsvurdering

```
Du: "Analyser sikkerheten til et WPA2-PSK-nettverk med WPS aktivert"

Agent: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "Kritiske sårbarheter funnet i WPA2-PSK + WPS-konfigurasjon:
          1. WPS Pixie Dust-angrep — PIN kan gjenopprettes på sekunder via
             offline brute-force av E-S1/E-S2 nonces (Reaver + PixieWPS).
             Full PSK-gjenoppretting uten klientinteraksjon.
          2. PMKID-angrep — første pakke i 4-veis håndtrykk inneholder
             PMKID-hash, knekkbar offline med hashcat -m 22000.
             Ingen deauth nødvendig, ingen klient nødvendig.
          3. 4-veis håndtrykk-fangst — EAPOL-rammer kan fanges med
             airodump-ng + deauth, deretter offline ordbokangrep.
          Prioritet: Deaktiver WPS umiddelbart (høyest risiko), påtving
          sterkt PSK på 20+ tegn, vurder migrering til WPA3-SAE."
```

### Bluetooth & BLE-analyse

```
Du: "Hva er sikkerhetsrisikoene ved vårt BLE-baserte adgangskontrollsystem?"

Agent: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "BLE-adgangskontrollsystem — 4 kritiske risikoer identifisert:
          1. JustWorks-paring — ingen MITM-beskyttelse. Angriper kan
             avskjære paring med Ubertooth One (MITRE T1040).
          2. GATT Characteristic-sniffing — opplåsingskommandoer sendes i
             klartekst, kan gjenspilles med gatttool (MITRE T1212).
          3. BLE Relay/Replay-angrep — videresend legitimt opplåsingssignal
             med to enheter + btlejack (MITRE T1557).
          4. MAC-adressesporing — statisk BLE MAC muliggjør sporing
             av beboere (MITRE T1592.002).
          Anbefalt: påtving LE Secure Connections (LESC) med numerisk
          sammenligning, krypter GATT-karakteristikker, implementer
          rullende nonces for beskyttelse mot gjentakelsesangrep."
```

### IoT trådløs revisjon

```
Du: "Vurder den trådløse sikkerheten til vår smarte bygning IoT-utrulling"

Agent: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "Smart bygning IoT trådløs vurdering — 5 funn:
          1. Zigbee: Standard trust center link-nøkkel (ZigBeeAlliance09)
             tillater avskjæring av nettverkstilkobling med KillerBee (KRITISK)
          2. MQTT: Megler på port 1883 uten TLS — legitimasjon
             og sensordata overføres i klartekst
          3. Z-Wave: S0-sikkerhet med kjent nøkkelutvekslingssårbarhet
             — S2-oppgradering anbefalt
          4. MouseJack: 3 Logitech Unifying-mottakere sårbare for
             tastaturinjeksjon (CVE-2016-10761)
          5. WiFi: IoT-enheter på samme VLAN som bedriftsnettverket —
             ingen nettverkssegmentering
          Prioritert utbedring: MQTT TLS, Zigbee installasjonskoder,
          IoT VLAN-isolasjon, erstatt sårbare Logitech-mottakere."
```

### Samsvarsrevisjon

```
Du: "Sjekk sykehusets WiFi mot HIPAA trådløse krav"

Agent: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "HIPAA trådløs samsvarsrevisjon — 6 funn:
          3 IKKE-SAMSVARENDE kontroller:
          - 164.312(a)(1): Ingen trådløst IDS distribuert for deteksjon av uautoriserte tilgangspunkter
          - 164.312(e)(1): Medisinske enheter bruker WPA2-PSK (ikke Enterprise)
          - 164.312(e)(2): Ingen revisjonslogging av trådløs trafikk-kryptering
          3 SAMSVARENDE kontroller:
          - 164.310(a)(1): Fysiske AP-plasseringer dokumentert
          - 164.312(a)(2): 802.1X med RADIUS-autentisering
          - 164.312(d): Sertifikatbasert EAP-TLS for ansattes enheter
          Utbedringsplan: distribuer WIDS (Kismet/AirMagnet), migrer
          medisinske enheter til WPA2-Enterprise med MAB, aktiver trådløs
          revisjonslogging på WLAN-kontrolleren."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; Ingen API-nøkkel</b></summary>

| Verktøy | Beskrivelse |
|------|-------------|
| `scan_wifi_networks` | Skann og analyser WiFi-nettverk &mdash; oppdag SSID-er, kanaler, krypteringstyper, signalstyrke og sikkerhetsfeilkonfigurasjoner |
| `analyze_wifi_security` | Dybdeanalyse av WiFi-sikkerhetskonfigurasjon &mdash; krypteringsstyrke, autentiseringsmetode, kjente svakheter, angrepsflate |
| `find_wifi_attacks` | Finn anvendelige angrep for et WiFi-mål &mdash; returnerer angrepsmetodikk, nødvendige verktøy, MITRE ATT&CK-kartlegging, mottiltak |
| `simulate_evil_twin` | Simuler og analyser evil twin AP-angrepsscenarier &mdash; hostapd-mana-konfigurasjon, captive portal, legitimasjonsinnfangsmetodikk |
| `analyze_deauth` | Analyser deautentiserings-angrepsvektorer &mdash; 802.11w PMF-status, deauth-deteksjon, mottiltak, WIDS-integrasjon |
| `crack_wps` | Analyser WPS-knekkingsangrepsvektorer &mdash; Pixie Dust, brute force, null PIN, standard PIN-generering, Reaver/Bully-metodikk |
| `analyze_pmkid` | Analyser PMKID-baserte angrepsvektorer &mdash; klientløs WPA/WPA2-knekking via hcxdumptool + hashcat modus 22000 |
| `audit_wifi67` | Revider WiFi 6 (802.11ax) og WiFi 7 (802.11be) spesifikke sikkerhetsfunksjoner &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; Ingen API-nøkkel</b></summary>

| Verktøy | Beskrivelse |
|------|-------------|
| `scan_bluetooth` | Skann og analyser Bluetooth-enheter &mdash; BR/EDR klassisk og BLE-oppdagelse, tjenesteoppregning, paringsanalyse |
| `find_bluetooth_attacks` | Finn anvendelige Bluetooth-angrep &mdash; BlueBorne, KNOB, BIAS, BLE-relay, MITM, med verktøy og mottiltak |
| `analyze_ble` | Dybdeanalyse av BLE-sikkerhet &mdash; GATT-tjenester, paringsmetoder, LE Secure Connections, karakteristikk-kryptering |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; Ingen API-nøkkel</b></summary>

| Verktøy | Beskrivelse |
|------|-------------|
| `analyze_rf_signal` | Analyser RF-signalsikkerhet &mdash; frekvensanalyse, modulasjonsidentifikasjon, gjentakelsesangrep-gjennomførbarhet, SDR-verktøyanbefalinger |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; Ingen API-nøkkel</b></summary>

| Verktøy | Beskrivelse |
|------|-------------|
| `analyze_nfc_security` | Analyser NFC/RFID-sikkerhet &mdash; korttypeidentifikasjon, adgangskontrollsvakheter, kloningsgjennomførbarhet, Proxmark3-metodikk |

</details>

<details>
<summary><b>Mobilnett/5G (1) &mdash; Ingen API-nøkkel</b></summary>

| Verktøy | Beskrivelse |
|------|-------------|
| `analyze_cellular_security` | Analyser mobilnettsikkerhet &mdash; 2G/3G/4G/5G-protokollsvakheter, IMSI-fanger-deteksjon, falsk basestasjon-analyse |

</details>

<details>
<summary><b>IoT trådløs (3) &mdash; Ingen API-nøkkel</b></summary>

| Verktøy | Beskrivelse |
|------|-------------|
| `analyze_zigbee` | Analyser Zigbee-nettverkssikkerhet &mdash; trust center-policy, nettverksnøkkelhåndtering, KillerBee-angrepsmetodikk |
| `scan_iot_wireless` | Skann IoT trådløse protokoller &mdash; Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP-oppdagelse og sårbarhetsanalyse |
| `find_mousejack` | Analyser MouseJack trådløs tastatur/mus-sårbarheter &mdash; tastaturinjeksjon, ukryptert HID, leverandørspesifikke omgåelser |

</details>

<details>
<summary><b>Avansert trådløs (6) &mdash; Ingen API-nøkkel</b></summary>

| Verktøy | Beskrivelse |
|------|-------------|
| `analyze_airgap` | Analyser air-gap-eksfiltreringsteknikker &mdash; elektromagnetiske, akustiske, termiske, optiske skjulte kanaler og mottiltak |
| `analyze_uwb` | Analyser Ultra-Wideband (UWB) sikkerhet &mdash; avstandsmåling-manipulering, relay-angrep på bilnøkler og AirTags, avstandsbedrageri |
| `analyze_wifi_csi` | Analyser WiFi Channel State Information (CSI) sikkerhet &mdash; passiv sensing, aktivitetsgjenkjenning, tastaturinfreringsrisikoer |
| `analyze_miracast` | Analyser Miracast/WiFi Display-sikkerhet &mdash; WFD-sesjonskapring, skjermfangst, uautorisert skjermtilgang |
| `analyze_wifi_direct` | Analyser WiFi Direct (P2P) sikkerhet &mdash; gruppeeiernegosieringsangrep, WPS-sårbarheter i P2P, uautorisert gruppedannelse |
| `analyze_drone_rf` | Analyser drone RF-sikkerhet &mdash; kontrolllink-kapring, GPS-forfalskning, video-nedlink-avskjæring, counter-UAS-teknikker |

</details>

<details>
<summary><b>Infrastruktur (4) &mdash; Ingen API-nøkkel (KISMET_* valgfritt for sanntids WIDS)</b></summary>

| Verktøy | Beskrivelse |
|------|-------------|
| `audit_wlan_controller` | Revider WLAN-kontrollerkonfigurasjon &mdash; Cisco WLC, Aruba, Meraki sikkerhetsinnstillinger, uautoriserte tilgangspunkt-policyer, RF-styring |
| `analyze_captive_portal` | Analyser captive portal-sikkerhet &mdash; omgåelsesteknikker, legitimasjonsinnsamlingsrisikoer, nettverksisolasjon, gjeste-VLAN-sikkerhet |
| `detect_mac_randomization` | Analyser MAC-adresse-randomisering &mdash; iOS/Android/Windows-implementeringsforskjeller, sporingsmotstand, fingeravtrykk-omgåelser |
| `analyze_hotspot20` | Analyser Hotspot 2.0 (Passpoint) sikkerhet &mdash; ANQP, OSU, automatisk nettverksvalg-risikoer, EAP-metodeanalyse |

</details>

<details>
<summary><b>Intelligens (4) &mdash; Ingen API-nøkkel</b></summary>

| Verktøy | Beskrivelse |
|------|-------------|
| `lookup_wireless_cve` | Slå opp trådløsspesifikke CVE-er &mdash; WiFi-brikkesett-sårbarheter, Bluetooth-stabel-CVE-er, driverutnyttelser, fastvare-feil |
| `lookup_hardware` | Slå opp trådløs sikkerhetsmaskinvare &mdash; WiFi-adaptere, Bluetooth-sniffere, SDR-enheter, egenskaper, brikkesettkompatibilitet |
| `map_wireless_attck` | Kartlegg trådløse angrep til MITRE ATT&CK-rammeverk &mdash; teknikk-ID-er, taktikk-kategorier, deteksjonsstrategier |
| `analyze_medical_wireless` | Analyser trådløs sikkerhet for medisinske enheter &mdash; infusjonspumper, pacemakere, pasientmonitorer, FDA-veiledning, HIPAA-krav |

</details>

<details>
<summary><b>Deteksjon (2) &mdash; Ingen API-nøkkel</b></summary>

| Verktøy | Beskrivelse |
|------|-------------|
| `detect_wireless_attack` | Oppdag pågående trådløse angrep &mdash; deauth-flommer, evil twin, KARMA, uautoriserte tilgangspunkter, BLE-forfalskning, RF-jamming-indikatorer |
| `audit_wireless_compliance` | Revider trådløst nettverk mot samsvarsrammeverk &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, ISO 27001 trådløse kontroller |

</details>

<details>
<summary><b>Rapportering (1) &mdash; Ingen API-nøkkel</b></summary>

| Verktøy | Beskrivelse |
|------|-------------|
| `export_report` | Eksporter rapport for trådløs sikkerhetsvurdering &mdash; funn, risikovurderinger, samsvarstatus, utbedringsveikart, sammendrag |

</details>

---

### CLI Usage

```bash
# List alle tilgjengelige verktøy
npx wifi-security-mcp-server --list

# Kjør et hvilket som helst verktøy direkte
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

Serveren leveres med 9 innebygde kunnskapsbaser &mdash; ingen API-nøkler, ingen eksterne avhengigheter, ingen hastighetsbegrensninger. Hvert verktøyoppslag berikes med strukturert intelligens fra disse databasene.

| Kunnskapsbase | Oppføringer | Hva den tilbyr |
|----------------|---------|-----------------|
| **WiFi-angrep** | 47 angrep | WPA/WPA2/WPA3-angrepsteknikker, evil twin-varianter, PMKID, KRACK, FragAttacks, deauth, WPS-utnyttelser &mdash; hver med verktøy, mottiltak, MITRE ATT&CK-kartlegging |
| **Bluetooth-angrep** | 8 angrep | BlueBorne, KNOB, BIAS, BLE-relay, MITM, BLE-fuzzing, Bluetooth-etterligning &mdash; med CVE-er og deteksjonsstrategier |
| **RF/SDR-angrep** | 6 angrep | Gjentakelsesangrep, jamming, signalinjeksjon, SDR-basert avskjæring, RF-fingeravtrykk-omgåelse, spektrumanalyseteknikker |
| **NFC/RFID-angrep** | 6 angrep | Kortkloning, relay-angrep, MIFARE Classic-knekking, NFC-skimming, RFID-fuzzing, adgangskontrollomgåelse med Proxmark3 |
| **Mobilnettangrep** | 6 angrep | IMSI-fangst, falsk basestasjon (Stingray), SS7-utnyttelse, 5G NAS-sårbarheter, nedgraderingsangrep, VoLTE-avskjæring |
| **IoT-angrep** | 6 angrep | Zigbee nettverksnøkkel-sniffing, Z-Wave S0-nedgradering, MQTT-legitimasjonsinnsamling, LoRaWAN ABP-gjentakelse, MouseJack, BLE IoT-relay |
| **Maskinvaredatabase** | 12 enheter | WiFi-adaptere (Alfa, TP-Link), Bluetooth-sniffere (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; brikkesett, egenskaper, monitormodus-støtte |
| **CVE-database** | 17 CVE-er | Trådløsspesifikke CVE-er for WiFi-brikkesett (Broadcom, Qualcomm, Intel), Bluetooth-stabler, IoT-fastvare &mdash; alvorlighetsgrad, berørte versjoner, utnyttelsestilgjengelighet |
| **Samsvarsrammeverk** | 5 rammeverk | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; trådløsspesifikke kontroller, revisjonsjekklister, gapanalyse |

---

## Architecture

```
src/
  index.ts                    # CLI-inngangspunkt (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # MCP-serveroppsett (stdio transport)
    tools.ts                  # Verktøyregister — alle 34 sammensatte verktøy satt sammen her
  types/
    index.ts                  # Delte typer (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 innebygde kunnskapsbaser
    wifi-attacks.ts           # 47 WiFi-angrepsdefinisjoner
    bluetooth-attacks.ts      # 8 Bluetooth-angrepsdefinisjoner
    rf-attacks.ts             # 6 RF/SDR-angrepsdefinisjoner
    nfc-attacks.ts            # 6 NFC/RFID-angrepsdefinisjoner
    cellular-attacks.ts       # 6 Mobilnett/5G-angrepsdefinisjoner
    iot-attacks.ts            # 6 IoT-angrepsdefinisjoner
    hardware.ts               # 12 maskinvareenhetsprofiler
    cve-database.ts           # 17 trådløse CVE-er
    compliance.ts             # 5 samsvarsrammeverk
  wifi/                       # WiFi Core-verktøy (8)
  bluetooth/                  # Bluetooth-verktøy (3)
  rf/                         # RF/SDR-verktøy (1)
  nfc/                        # NFC/RFID-verktøy (1)
  cellular/                   # Mobilnett/5G-verktøy (1)
  iot/                        # IoT trådløse verktøy (3)
  advanced/                   # Avanserte trådløse verktøy (6)
  infrastructure/             # Infrastrukturverktøy (4)
  intelligence/               # Intelligensverktøy (4)
  detection/                  # Deteksjonsverktøy (2)
  reporting/                  # Rapporteringsverktøy (1)
```

**Designbeslutninger:**

- **Kunnskapsbasedrevet** &mdash; I motsetning til API-avhengige verktøy, kjører kjernefunksjonaliteten helt offline fra 9 innebygde databaser. Ingen API-nøkler, ingen hastighetsbegrensninger, ingen eksterne avhengigheter for den primære arbeidsflyten.
- **34 sammensatte verktøy, 139 individuelle egenskaper** &mdash; Hvert verktøy er et sammensatt som samler relaterte analyser. `find_wifi_attacks` lister ikke bare opp angrep &mdash; det returnerer metodikk, nødvendig maskinvare, MITRE ATT&CK-kartlegging, deteksjonsstrategier og mottiltak.
- **2 kjøretidsavhengigheter** &mdash; `@modelcontextprotocol/sdk` og `zod`. Ingenting annet. Ingen native moduler, ingen binære avhengigheter, ingen plattformspesifikk kode.
- **Valgfri sanntidsintegrasjon** &mdash; WiGLE API for virkelige nettverksdata, Kismet for sanntids trådløst IDS. Kjerneanalyse fungerer uten noen av dem.
- **Samsvarsbevisst** &mdash; Hvert funn kartlegges automatisk til relevante samsvarsrammeverk (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) når det er aktuelt.
- **MITRE ATT&CK-kartlagt** &mdash; Angrepsteknikker inkluderer ATT&CK-teknikk-ID-er, taktikk-kategorier og deteksjonsdatakilder for SOC-integrasjon.

---

## Limitations

- Kunnskapsbaser er tidspunktøyeblikksbilder &mdash; nye angrep/CVE-er krever pakkeoppdateringer
- WiGLE-integrasjon krever en gratis API-nøkkel for nettverksoppslag
- Kismet sanntids WIDS krever en kjørende Kismet-instans med API-tilgang
- Ingen aktiv trådløs overføring &mdash; serveren gir intelligens og metodikk, ikke pakkeinjeksjon
- Maskinvaredatabasen dekker de vanligste sikkerhetsforskerenheter, ikke uttømmende
- Samsvarsrammeverk fokuserer på trådløsspesifikke kontroller, ikke full rammeverkdekning
- macOS / Linux testet (Windows ikke testet)

---

## Part of the MCP Security Suite

| Prosjekt | Domene | Verktøy |
|---|---|---|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Nettleserbasert sikkerhetstesting | 39 verktøy, Firefox, injeksjonstesting |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Skysikkerhet (AWS/Azure/GCP) | 38 verktøy, 60+ sjekker |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub-sikkerhetsstilling | 39 verktøy, 45 sjekker |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Sårbarhetsintelligens | 23 verktøy, 5 kilder |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT og rekognosering | 37 verktøy, 12 kilder |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Mørkt nett og trusselintelligens | 66 verktøy, 16 kilder |
| **wifi-security-mcp-server** | **Trådløs sikkerhetsintelligens** | **34 verktøy, 9 kunnskapsbaser** |

---

<p align="center">
<b>Kun for autorisert sikkerhetstesting og vurdering.</b><br>
Sørg alltid for at du har riktig autorisasjon før du utfører trådløs sikkerhetstesting på ethvert nettverk eller enhet.<br>
Uautorisert trådløs nettverkstilgang eller forstyrrelse er ulovlig i de fleste jurisdiksjoner.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

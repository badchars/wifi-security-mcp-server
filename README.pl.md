<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a> | <a href="README.zh-TW.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | <a href="README.de.md">Deutsch</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.it.md">Italiano</a> | <a href="README.da.md">Dansk</a> | <a href="README.ja.md">日本語</a> | <strong>Polski</strong> | <a href="README.ru.md">Русский</a> | <a href="README.bs.md">Bosanski</a> | <a href="README.ar.md">العربية</a> | <a href="README.no.md">Norsk</a> | <a href="README.pt-BR.md">Português (Brasil)</a> | <a href="README.th.md">ไทย</a> | <a href="README.tr.md">Türkçe</a> | <a href="README.uk.md">Українська</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.el.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a> | <a href="README.hi.md">हिन्दी</a>
</p>

<p align="center"><br><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-light.svg"><img alt="wifi-security-mcp-server" src="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-dark.svg" width="700"></picture></p>

<h3 align="center">Inteligencja bezpieczeństwa bezprzewodowego dla agentów AI.</h3>

<p align="center">WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Komórkowe/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Dron RF, WIDS/WIPS, Zgodność &mdash; zunifikowane w jednym serwerze MCP.<br>Twój agent AI otrzymuje <b>pełnospektrową analizę bezpieczeństwa bezprzewodowego na żądanie</b>, zasilaną przez 9 wbudowanych baz wiedzy obejmujących 139 indywidualnych narzędzi.</p>

<br>

<p align="center"><a href="#the-problem">Problem</a> &bull; <a href="#how-its-different">Różnica</a> &bull; <a href="#quick-start">Szybki Start</a> &bull; <a href="#what-the-ai-can-do">Co Potrafi AI</a> &bull; <a href="#tools-reference-34-composite-tools">Narzędzia (34)</a> &bull; <a href="#knowledge-bases-9">Bazy Wiedzy</a> &bull; <a href="#architecture">Architektura</a> &bull; <a href="CHANGELOG.md">Changelog</a> &bull; <a href="CONTRIBUTING.md">Współpraca</a></p>

<p align="center"><a href="https://www.npmjs.com/package/wifi-security-mcp-server"><img src="https://img.shields.io/npm/v/wifi-security-mcp-server.svg" alt="npm"></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a> <img src="https://img.shields.io/badge/protocol-MCP-8b5cf6" alt="MCP"> <img src="https://img.shields.io/badge/tools-34-ef4444" alt="34 Tools"> <img src="https://img.shields.io/badge/knowledge--bases-9-f97316" alt="9 Knowledge Bases"> <img src="https://img.shields.io/badge/deps-2-22c55e" alt="2 Dependencies"></p>

---

## The Problem

Ocena bezpieczeństwa bezprzewodowego jest jedną z najbardziej fragmentarycznych dyscyplin w bezpieczeństwie ofensywnym. Audyt WiFi wymaga jednego zestawu narzędzi, Bluetooth innego, RF/SDR trzeciego, protokoły IoT jeszcze innego &mdash; a każda domena ma własną powierzchnię ataku, własne podatności, własne wymagania zgodności. Dziś uruchamiasz aircrack-ng dla WPA, używasz Bettercap dla BLE, odpalasz HackRF dla SDR, konsultujesz różne bazy CVE dla każdego chipsetu, odwołujesz się do NIST i PCI-DSS oddzielnie, a potem spędzasz godziny ręcznie korelując wyniki w spójną ocenę.

```
Tradycyjny przepływ pracy bezpieczeństwa bezprzewodowego:
  audyt sieci WiFi                  ->  aircrack-ng / Wireshark / Kismet
  test bezpieczeństwa Bluetooth     ->  Bettercap / btlejack / Ubertooth
  analiza sygnałów RF               ->  HackRF / GNU Radio / GQRX
  sprawdzanie NFC/RFID              ->  Proxmark3 / libnfc
  ocena bezpieczeństwa komórkowego  ->  srsRAN / OpenBTS
  test protokołów IoT               ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  wyszukiwanie CVE bezprzewodowych  ->  NVD / vendor advisories (ręczne wyszukiwanie)
  sprawdzanie zgodności             ->  NIST / PCI-DSS / HIPAA docs (ręcznie)
  mapowanie do MITRE ATT&CK         ->  ATT&CK Navigator (ręczne mapowanie)
  korelowanie wszystkiego           ->  kopiuj-wklej do raportu
  ────────────────────────────────
  Razem: godziny na ocenę, większość na przełączanie kontekstu między narzędziami
```

**wifi-security-mcp-server** zapewnia Twojemu agentowi AI 34 złożone narzędzia wspierane przez 9 baz wiedzy obejmujących 139 indywidualnych możliwości za pośrednictwem [Model Context Protocol](https://modelcontextprotocol.io). Agent analizuje sieci, identyfikuje podatności, mapuje ataki na MITRE ATT&CK, sprawdza zgodność i generuje wykonalne raporty &mdash; w jednej rozmowie.

```
Z wifi-security-mcp-server:
  Ty: "Zaudytuj bezpieczeństwo bezprzewodowe naszej sieci biurowej działającej na WPA2-Enterprise"

  Agent: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "Twoja sieć WPA2-Enterprise ma 3 krytyczne ustalenia:
            1. EAP-PEAP bez przypinania certyfikatu — podatna na evil twin
               z hostapd-mana (MITRE T1557.002)
            2. Brak 802.11w (PMF) — podatna na ataki deautentyfikacji
               (MITRE T1498.001)
            3. Hash PMKID możliwy do wyodrębnienia bez interakcji klienta —
               łamanie offline możliwe z hashcat tryb 22000
            PCI-DSS 4.0: 2 kontrole niezgodne (4.2.1, 11.2.1).
            Zalecane: migracja do WPA3-Enterprise z SAE, włączenie PMF,
            wdrożenie WIDS do wykrywania rogue AP."
```

---

## How It's Different

Istniejące narzędzia dają surowe przechwytywanie pakietów i analizę specyficzną dla protokołu. wifi-security-mcp-server daje Twojemu agentowi AI zdolność do **rozumowania jednocześnie we wszystkich domenach bezprzewodowych** z głębokim wsparciem bazy wiedzy.

<table>
<thead><tr><th></th><th>Tradycyjne Podejście</th><th>wifi-security-mcp-server</th></tr></thead>
<tbody>
<tr><td><b>Interfejs</b></td><td>10+ różnych CLI, GUI i narzędzi sprzętowych</td><td>MCP &mdash; agent AI wywołuje narzędzia konwersacyjnie</td></tr>
<tr><td><b>Pokrycie</b></td><td>Jeden protokół na raz</td><td>WiFi, Bluetooth, RF, NFC, Komórkowe, IoT &mdash; wszystko w jednym serwerze</td></tr>
<tr><td><b>Wiedza</b></td><td>Ręczne wyszukiwanie CVE, ręczne mapowanie ATT&CK</td><td>9 wbudowanych baz wiedzy ze 139 wstępnie zmapowanymi pozycjami</td></tr>
<tr><td><b>Intel. ataków</b></td><td>Wyszukiwanie Google + blogi + prezentacje konferencyjne</td><td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Komórkowe + 6 IoT ataków skatalogowanych z narzędziami, łagodzeniami, ID ATT&CK</td></tr>
<tr><td><b>Zgodność</b></td><td>Czytanie PDF NIST/PCI-DSS/HIPAA, ręczne mapowanie kontroli</td><td>Agent automatycznie sprawdza 5 ram zgodności</td></tr>
<tr><td><b>Klucze API</b></td><td>Różne konta do różnych usług</td><td>Zero kluczy API dla podstawowej funkcjonalności &mdash; napędzane bazą wiedzy</td></tr>
<tr><td><b>Konfiguracja</b></td><td>Zainstaluj aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td><td><code>npx wifi-security-mcp-server</code> &mdash; jedno polecenie, zero konfiguracji</td></tr>
</tbody>
</table>

---

## Quick Start

### Opcja 1: npx (bez instalacji)

```bash
npx wifi-security-mcp-server
```

Wszystkie 34 narzędzia działają natychmiast. Nie są wymagane klucze API &mdash; podstawowa funkcjonalność jest napędzana bazami wiedzy.

### Opcja 2: Klonuj

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Zmienne środowiskowe (opcjonalne)

```bash
# WiGLE — baza wardriving do wyszukiwania rzeczywistych sieci WiFi
export WIGLE_API_KEY=your-key

# Kismet — wykrywanie włamań bezprzewodowych na żywo
export KISMET_HOST=127.0.0.1      # Domyślnie: 127.0.0.1
export KISMET_PORT=2501           # Domyślnie: 2501
export KISMET_API_KEY=your-key
```

Wszystkie klucze API są opcjonalne. Bez nich nadal masz pełny dostęp do wszystkich 34 narzędzi zasilanych przez 9 wbudowanych baz wiedzy obejmujących ataki WiFi, ataki Bluetooth, RF/SDR, NFC/RFID, komórkowe, IoT, bazę sprzętu, inteligencję CVE i ramy zgodności.

### Połącz z agentem AI

<details open><summary><b>Claude Code</b></summary>

```bash
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server
```
</details>

<details><summary><b>Claude Desktop</b></summary>

Dodaj do `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{"mcpServers":{"wifi-security":{"command":"npx","args":["-y","wifi-security-mcp-server"],"env":{"WIGLE_API_KEY":"optional","KISMET_HOST":"optional","KISMET_PORT":"optional","KISMET_API_KEY":"optional"}}}}
```
</details>

<details><summary><b>Cursor / Windsurf / inne klienty MCP</b></summary>

Ten sam format konfiguracji JSON. Wskaż polecenie na `npx wifi-security-mcp-server` lub swoją lokalną ścieżkę instalacji.
</details>

### Rozpocznij zapytania

```
Ty: "Jakie ataki są możliwe na sieć WPA3-SAE i jak je testować?"
```

To wszystko. Agent wyszukuje ataki, mapuje je na MITRE ATT&CK, rekomenduje narzędzia i dostarcza metodologię krok po kroku &mdash; wszystko z wbudowanych baz wiedzy.

---

## What The AI Can Do

### Ocena Bezpieczeństwa WiFi

```
Ty: "Przeanalizuj bezpieczeństwo sieci WPA2-PSK z włączonym WPS"

Agent: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
```

### Analiza Bluetooth & BLE

```
Ty: "Jakie są ryzyka bezpieczeństwa naszego systemu kontroli dostępu opartego na BLE?"

Agent: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
```

### Audyt Bezprzewodowy IoT

```
Ty: "Oceń bezpieczeństwo bezprzewodowe naszego wdrożenia IoT w inteligentnym budynku"

Agent: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
```

### Audyt Zgodności

```
Ty: "Sprawdź nasze WiFi szpitalne pod kątem wymagań bezprzewodowych HIPAA"

Agent: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
```

---

## Tools Reference (34 composite tools)

<details open><summary><b>WiFi Core (8) &mdash; Bez klucza API</b></summary>

| Narzędzie | Opis |
|-----------|------|
| `scan_wifi_networks` | Skanowanie i analiza sieci WiFi &mdash; wykrywanie SSID, kanałów, typów szyfrowania, siły sygnału i błędnych konfiguracji bezpieczeństwa |
| `analyze_wifi_security` | Głęboka analiza konfiguracji bezpieczeństwa WiFi &mdash; siła szyfrowania, metoda uwierzytelniania, znane słabości, powierzchnia ataku |
| `find_wifi_attacks` | Znajdowanie stosownych ataków dla celu WiFi &mdash; zwraca metodologię ataku, wymagane narzędzia, mapowanie MITRE ATT&CK, łagodzenia |
| `simulate_evil_twin` | Symulacja i analiza scenariuszy ataku evil twin AP &mdash; konfiguracja hostapd-mana, portal przechwytujący, metodologia przechwytywania poświadczeń |
| `analyze_deauth` | Analiza wektorów ataku deautentyfikacji &mdash; status 802.11w PMF, wykrywanie deauth, środki zaradcze, integracja WIDS |
| `crack_wps` | Analiza wektorów ataku łamania WPS &mdash; Pixie Dust, brute force, null PIN, generowanie domyślnego PIN, metodologia Reaver/Bully |
| `analyze_pmkid` | Analiza wektorów ataku opartych na PMKID &mdash; bezklientowe łamanie WPA/WPA2 przez hcxdumptool + hashcat tryb 22000 |
| `audit_wifi67` | Audyt funkcji bezpieczeństwa WiFi 6 (802.11ax) i WiFi 7 (802.11be) &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |
</details>

<details><summary><b>Bluetooth (3) &mdash; Bez klucza API</b></summary>

| Narzędzie | Opis |
|-----------|------|
| `scan_bluetooth` | Skanowanie i analiza urządzeń Bluetooth &mdash; odkrywanie BR/EDR klasyczne i BLE, enumeracja usług, analiza parowania |
| `find_bluetooth_attacks` | Znajdowanie ataków Bluetooth &mdash; BlueBorne, KNOB, BIAS, relay BLE, MITM, z narzędziami i łagodzeniami |
| `analyze_ble` | Głęboka analiza bezpieczeństwa BLE &mdash; usługi GATT, metody parowania, LE Secure Connections, szyfrowanie charakterystyk |
</details>

<details><summary><b>RF/SDR (1) &mdash; Bez klucza API</b></summary>

| Narzędzie | Opis |
|-----------|------|
| `analyze_rf_signal` | Analiza bezpieczeństwa sygnału RF &mdash; analiza częstotliwości, identyfikacja modulacji, wykonalność ataku replay, rekomendacje narzędzi SDR |
</details>

<details><summary><b>NFC/RFID (1) &mdash; Bez klucza API</b></summary>

| Narzędzie | Opis |
|-----------|------|
| `analyze_nfc_security` | Analiza bezpieczeństwa NFC/RFID &mdash; identyfikacja typu karty, słabości kontroli dostępu, wykonalność klonowania, metodologia Proxmark3 |
</details>

<details><summary><b>Komórkowe/5G (1) &mdash; Bez klucza API</b></summary>

| Narzędzie | Opis |
|-----------|------|
| `analyze_cellular_security` | Analiza bezpieczeństwa sieci komórkowej &mdash; słabości protokołów 2G/3G/4G/5G, wykrywanie IMSI catcher, analiza fałszywej stacji bazowej |
</details>

<details><summary><b>IoT Bezprzewodowe (3) &mdash; Bez klucza API</b></summary>

| Narzędzie | Opis |
|-----------|------|
| `analyze_zigbee` | Analiza bezpieczeństwa sieci Zigbee &mdash; polityka trust center, zarządzanie kluczami sieciowymi, metodologia ataku KillerBee |
| `scan_iot_wireless` | Skanowanie protokołów bezprzewodowych IoT &mdash; odkrywanie i analiza podatności Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP |
| `find_mousejack` | Analiza podatności MouseJack bezprzewodowej klawiatury/myszy &mdash; wstrzykiwanie klawiszy, niezaszyfrowany HID, obejścia specyficzne dla dostawcy |
</details>

<details><summary><b>Zaawansowane Bezprzewodowe (6) &mdash; Bez klucza API</b></summary>

| Narzędzie | Opis |
|-----------|------|
| `analyze_airgap` | Analiza technik eksfiltracji air-gap &mdash; kanały ukryte elektromagnetyczne, akustyczne, termiczne, optyczne i środki zaradcze |
| `analyze_uwb` | Analiza bezpieczeństwa Ultra-Wideband (UWB) &mdash; manipulacja pomiarem odległości, ataki relay na kluczyki samochodowe i AirTag, oszustwo dystansowe |
| `analyze_wifi_csi` | Analiza bezpieczeństwa WiFi Channel State Information (CSI) &mdash; pasywne wykrywanie, rozpoznawanie aktywności, ryzyko wnioskowania klawiszy |
| `analyze_miracast` | Analiza bezpieczeństwa Miracast/WiFi Display &mdash; przejęcie sesji WFD, przechwytywanie ekranu, nieautoryzowany dostęp do wyświetlacza |
| `analyze_wifi_direct` | Analiza bezpieczeństwa WiFi Direct (P2P) &mdash; ataki negocjacji właściciela grupy, podatności WPS w P2P, tworzenie złośliwej grupy |
| `analyze_drone_rf` | Analiza bezpieczeństwa RF dronów &mdash; przejęcie łącza sterowania, spoofing GPS, przechwytywanie downlinku wideo, techniki counter-UAS |
</details>

<details><summary><b>Infrastruktura (4) &mdash; Bez klucza API (KISMET_* opcjonalny dla WIDS na żywo)</b></summary>

| Narzędzie | Opis |
|-----------|------|
| `audit_wlan_controller` | Audyt konfiguracji kontrolera WLAN &mdash; ustawienia bezpieczeństwa Cisco WLC, Aruba, Meraki, polityki rogue AP, zarządzanie RF |
| `analyze_captive_portal` | Analiza bezpieczeństwa portalu przechwytującego &mdash; techniki obejścia, ryzyko zbierania poświadczeń, izolacja sieci, bezpieczeństwo VLAN gości |
| `detect_mac_randomization` | Analiza randomizacji adresu MAC &mdash; różnice implementacji iOS/Android/Windows, odporność na śledzenie, obejścia fingerprinting |
| `analyze_hotspot20` | Analiza bezpieczeństwa Hotspot 2.0 (Passpoint) &mdash; ANQP, OSU, ryzyko automatycznego wyboru sieci, analiza metody EAP |
</details>

<details><summary><b>Inteligencja (4) &mdash; Bez klucza API</b></summary>

| Narzędzie | Opis |
|-----------|------|
| `lookup_wireless_cve` | Wyszukiwanie CVE specyficznych dla bezprzewodowych &mdash; podatności chipsetów WiFi, CVE stosów Bluetooth, exploity sterowników, błędy firmware |
| `lookup_hardware` | Wyszukiwanie sprzętu bezpieczeństwa bezprzewodowego &mdash; adaptery WiFi, sniffery Bluetooth, urządzenia SDR, możliwości, kompatybilność chipsetów |
| `map_wireless_attck` | Mapowanie ataków bezprzewodowych na framework MITRE ATT&CK &mdash; ID technik, kategorie taktyk, strategie wykrywania |
| `analyze_medical_wireless` | Analiza bezpieczeństwa bezprzewodowego urządzeń medycznych &mdash; pompy infuzyjne, rozruszniki, monitory pacjentów, wytyczne FDA, wymagania HIPAA |
</details>

<details><summary><b>Wykrywanie (2) &mdash; Bez klucza API</b></summary>

| Narzędzie | Opis |
|-----------|------|
| `detect_wireless_attack` | Wykrywanie trwających ataków bezprzewodowych &mdash; flood deauth, evil twin, KARMA, rogue AP, spoofing BLE, wskaźniki zagłuszania RF |
| `audit_wireless_compliance` | Audyt sieci bezprzewodowej względem ram zgodności &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, kontrole bezprzewodowe ISO 27001 |
</details>

<details><summary><b>Raportowanie (1) &mdash; Bez klucza API</b></summary>

| Narzędzie | Opis |
|-----------|------|
| `export_report` | Eksport raportu oceny bezpieczeństwa bezprzewodowego &mdash; ustalenia, oceny ryzyka, status zgodności, mapa drogowa naprawy, podsumowanie wykonawcze |
</details>

---

### CLI Usage

```bash
npx wifi-security-mcp-server --list
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

Serwer jest dostarczany z 9 wbudowanymi bazami wiedzy &mdash; bez kluczy API, bez zewnętrznych zależności, bez limitów częstotliwości. Każde zapytanie narzędzia jest wzbogacane o strukturyzowaną inteligencję z tych baz danych.

| Baza Wiedzy | Wpisy | Co zapewnia |
|-------------|-------|-------------|
| **Ataki WiFi** | 47 ataków | Techniki ataków WPA/WPA2/WPA3, warianty evil twin, PMKID, KRACK, FragAttacks, deauth, exploity WPS &mdash; każdy z narzędziami, łagodzeniami, mapowaniem MITRE ATT&CK |
| **Ataki Bluetooth** | 8 ataków | BlueBorne, KNOB, BIAS, relay BLE, MITM, fuzzing BLE, podszywanie się pod Bluetooth &mdash; z CVE i strategiami wykrywania |
| **Ataki RF/SDR** | 6 ataków | Ataki replay, zagłuszanie, wstrzykiwanie sygnału, przechwytywanie oparte na SDR, obejście fingerprintingu RF, techniki analizy widma |
| **Ataki NFC/RFID** | 6 ataków | Klonowanie kart, ataki relay, łamanie MIFARE Classic, skimming NFC, fuzzing RFID, obejście kontroli dostępu z Proxmark3 |
| **Ataki Komórkowe** | 6 ataków | Przechwytywanie IMSI, fałszywa stacja bazowa (Stingray), eksploitacja SS7, podatności 5G NAS, ataki downgrade, przechwytywanie VoLTE |
| **Ataki IoT** | 6 ataków | Sniffing klucza sieciowego Zigbee, downgrade Z-Wave S0, zbieranie poświadczeń MQTT, replay LoRaWAN ABP, MouseJack, relay BLE IoT |
| **Baza Sprzętu** | 12 urządzeń | Adaptery WiFi (Alfa, TP-Link), sniffery Bluetooth (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; chipsety, możliwości, obsługa trybu monitora |
| **Baza CVE** | 17 CVE | CVE specyficzne dla bezprzewodowych chipsetów WiFi (Broadcom, Qualcomm, Intel), stosów Bluetooth, firmware IoT &mdash; dotkliwość, dotknięte wersje, dostępność exploitów |
| **Ramy Zgodności** | 5 ram | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; kontrole specyficzne dla bezprzewodowych, listy kontrolne audytu, analiza luk |

---

## Architecture

```
src/
  index.ts                    # Punkt wejścia CLI (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # Konfiguracja serwera MCP (stdio transport)
    tools.ts                  # Rejestr narzędzi — wszystkie 34 złożone narzędzia złożone tutaj
  types/
    index.ts                  # Współdzielone typy (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 wbudowanych baz wiedzy
    wifi-attacks.ts           # 47 definicji ataków WiFi
    bluetooth-attacks.ts      # 8 definicji ataków Bluetooth
    rf-attacks.ts             # 6 definicji ataków RF/SDR
    nfc-attacks.ts            # 6 definicji ataków NFC/RFID
    cellular-attacks.ts       # 6 definicji ataków Komórkowych/5G
    iot-attacks.ts            # 6 definicji ataków IoT
    hardware.ts               # 12 profili urządzeń sprzętowych
    cve-database.ts           # 17 bezprzewodowych CVE
    compliance.ts             # 5 ram zgodności
```

**Decyzje projektowe:**

- **Napędzane bazą wiedzy** &mdash; W przeciwieństwie do narzędzi zależnych od API, podstawowa funkcjonalność działa całkowicie offline z 9 wbudowanych baz danych. Bez kluczy API, bez limitów, bez zewnętrznych zależności.
- **34 złożone narzędzia, 139 indywidualnych możliwości** &mdash; Każde narzędzie jest kompozytem grupującym powiązane analizy. `find_wifi_attacks` nie tylko wymienia ataki &mdash; zwraca metodologię, wymagany sprzęt, mapowanie MITRE ATT&CK, strategie wykrywania i środki zaradcze.
- **2 zależności runtime** &mdash; `@modelcontextprotocol/sdk` i `zod`. Nic więcej.
- **Opcjonalna integracja na żywo** &mdash; WiGLE API dla danych sieciowych, Kismet dla WIDS na żywo. Analiza podstawowa działa bez żadnego z nich.
- **Świadomość zgodności** &mdash; Każde ustalenie jest automatycznie mapowane na odpowiednie ramy zgodności (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001).
- **Mapowanie MITRE ATT&CK** &mdash; Techniki ataków zawierają ID technik ATT&CK, kategorie taktyk i źródła danych wykrywania dla integracji SOC.

---

## Limitations

- Bazy wiedzy to migawki punktowe &mdash; nowe ataki/CVE wymagają aktualizacji pakietu
- Integracja WiGLE wymaga darmowego klucza API do wyszukiwania sieci
- Kismet WIDS na żywo wymaga działającej instancji Kismet z dostępem API
- Brak aktywnej transmisji bezprzewodowej &mdash; serwer dostarcza inteligencję i metodologię, nie wstrzykiwanie pakietów
- Baza sprzętu obejmuje najpopularniejsze urządzenia do badań bezpieczeństwa, nie jest wyczerpująca
- Ramy zgodności skupiają się na kontrolach specyficznych dla bezprzewodowych, nie na pełnym pokryciu ram
- macOS / Linux przetestowane (Windows nieprzetestowany)

---

## Part of the MCP Security Suite

| Projekt | Domena | Narzędzia |
|---------|--------|-----------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Testy bezpieczeństwa oparte na przeglądarce | 39 narzędzi, Firefox, testy wstrzykiwania |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Bezpieczeństwo chmury (AWS/Azure/GCP) | 38 narzędzi, 60+ kontroli |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | Postawa bezpieczeństwa GitHub | 39 narzędzi, 45 kontroli |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Inteligencja podatności | 23 narzędzia, 5 źródeł |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT i rozpoznanie | 37 narzędzi, 12 źródeł |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark web i inteligencja zagrożeń | 66 narzędzi, 16 źródeł |
| **wifi-security-mcp-server** | **Inteligencja bezpieczeństwa bezprzewodowego** | **34 narzędzia, 9 baz wiedzy** |

---

<p align="center">
<b>Wyłącznie do autoryzowanych testów i ocen bezpieczeństwa.</b><br>
Zawsze upewnij się, że masz odpowiednie uprawnienia przed wykonywaniem testów bezpieczeństwa bezprzewodowego na jakiejkolwiek sieci lub urządzeniu.<br>
Nieautoryzowany dostęp do sieci bezprzewodowej lub zakłócenia są nielegalne w większości jurysdykcji.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

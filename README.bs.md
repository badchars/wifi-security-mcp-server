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
  <strong>Bosanski</strong> |
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

<h3 align="center">Obavještajna analiza bežične sigurnosti za AI agente.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Mobilne mreže/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Dron RF, WIDS/WIPS, Usklađenost &mdash; objedinjeno u jednom MCP serveru.<br>
  Vaš AI agent dobija <b>sveobuhvatnu analizu bežične sigurnosti na zahtjev</b>, pokretanu sa 9 ugrađenih baza znanja koje pokrivaju 139 pojedinačnih alata.
</p>

<br>

<p align="center">
  <a href="#the-problem">Problem</a> &bull;
  <a href="#how-its-different">Po čemu se razlikuje</a> &bull;
  <a href="#quick-start">Brzi početak</a> &bull;
  <a href="#what-the-ai-can-do">Šta AI može</a> &bull;
  <a href="#tools-reference-34-composite-tools">Alati (34)</a> &bull;
  <a href="#knowledge-bases-9">Baze znanja</a> &bull;
  <a href="#architecture">Arhitektura</a> &bull;
  <a href="CHANGELOG.md">Dnevnik promjena</a> &bull;
  <a href="CONTRIBUTING.md">Doprinos</a>
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

Procjena bežične sigurnosti je jedna od najfragmentiranijih disciplina u ofanzivnoj sigurnosti. WiFi revizija zahtijeva jedan set alata, Bluetooth drugi, RF/SDR treći, IoT protokoli još jedan &mdash; i svaki domen ima svoju površinu napada, svoje ranjivosti, svoje zahtjeve usklađenosti. Danas pokrenete aircrack-ng za WPA, koristite Bettercap za BLE, pokrenete HackRF za SDR, konsultujete različite CVE baze podataka za svaki čipset, referencirate NIST i PCI-DSS odvojeno, a zatim provedete sate ručno korelirajući nalaze u koherentnu procjenu.

```
Tradicionalni tok rada bežične sigurnosti:
  revizija WiFi mreža               ->  aircrack-ng / Wireshark / Kismet
  testiranje Bluetooth sigurnosti    ->  Bettercap / btlejack / Ubertooth
  analiza RF signala                 ->  HackRF / GNU Radio / GQRX
  provjera NFC/RFID                  ->  Proxmark3 / libnfc
  procjena sigurnosti mobilnih mreža ->  srsRAN / OpenBTS
  testiranje IoT protokola           ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  pretraživanje bežičnih CVE-ova     ->  NVD / vendor advisories (ručna pretraga)
  provjera usklađenosti              ->  NIST / PCI-DSS / HIPAA docs (ručno)
  mapiranje na MITRE ATT&CK          ->  ATT&CK Navigator (ručno mapiranje)
  korelacija svega                   ->  kopiraj-zalijepi u izvještaj
  ────────────────────────────────
  Ukupno: sati po procjeni, većina u prebacivanju konteksta između alata
```

**wifi-security-mcp-server** daje vašem AI agentu 34 kompozitna alata podržana sa 9 baza znanja koje pokrivaju 139 pojedinačnih sposobnosti putem [Model Context Protocol](https://modelcontextprotocol.io). Agent analizira mreže, identificira ranjivosti, mapira napade na MITRE ATT&CK, provjerava usklađenost i generiše izvještaje koji se mogu primijeniti &mdash; u jednom razgovoru.

```
Sa wifi-security-mcp-server:
  Vi: "Revidirajte bežičnu sigurnost naše kancelarijske mreže koja koristi WPA2-Enterprise"

  Agent: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "Vaša WPA2-Enterprise mreža ima 3 kritična nalaza:
            1. EAP-PEAP bez pinovanja certifikata — ranjiv na evil twin
               sa hostapd-mana (MITRE T1557.002)
            2. Nema 802.11w (PMF) — podložan deautentikacijskim napadima
               (MITRE T1498.001)
            3. PMKID heš izvlačiv bez interakcije klijenta — offline
               krekovanje moguće sa hashcat modom 22000
            PCI-DSS 4.0: 2 kontrole neusklađene (4.2.1, 11.2.1).
            Preporučeno: migracija na WPA3-Enterprise sa SAE, omogućite PMF,
            postavite WIDS za detekciju lažnih pristupnih tačaka."
```

---

## How It's Different

Postojeći alati vam daju sirove snimke paketa i analizu specifičnu za protokol. wifi-security-mcp-server daje vašem AI agentu sposobnost da **istovremeno rezonuje kroz sve bežične domene** sa dubokom podrškom baze znanja.

<table>
<thead>
<tr>
<th></th>
<th>Tradicionalni pristup</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Interfejs</b></td>
<td>10+ različitih CLI-jeva, GUI-jeva i hardverskih alata</td>
<td>MCP &mdash; AI agent poziva alate kroz razgovor</td>
</tr>
<tr>
<td><b>Pokrivenost</b></td>
<td>Jedan protokol u jednom trenutku</td>
<td>WiFi, Bluetooth, RF, NFC, Mobilne mreže, IoT &mdash; sve u jednom serveru</td>
</tr>
<tr>
<td><b>Znanje</b></td>
<td>Ručno pretraživanje CVE-ova, ručno ATT&CK mapiranje</td>
<td>9 ugrađenih baza znanja sa 139 prethodno mapiranih stavki</td>
</tr>
<tr>
<td><b>Obavještajni podaci o napadima</b></td>
<td>Google pretraga + blog postovi + konferencijski govori</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Mobilnih + 6 IoT napada katalogiziranih sa alatima, ublažavanjima, ATT&CK ID-ovima</td>
</tr>
<tr>
<td><b>Usklađenost</b></td>
<td>Čitanje NIST/PCI-DSS/HIPAA PDF-ova, ručno mapiranje kontrola</td>
<td>Agent automatski provjerava protiv 5 okvira usklađenosti</td>
</tr>
<tr>
<td><b>API ključevi</b></td>
<td>Različiti računi za različite servise</td>
<td>Nula API ključeva za osnovnu funkcionalnost &mdash; pokretano bazama znanja</td>
</tr>
<tr>
<td><b>Postavljanje</b></td>
<td>Instalirajte aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; jedna komanda, nula konfiguracije</td>
</tr>
</tbody>
</table>

---

## Quick Start

### Opcija 1: npx (bez instalacije)

```bash
npx wifi-security-mcp-server
```

Svih 34 alata radi odmah. Nisu potrebni API ključevi &mdash; osnovna funkcionalnost je pokretana bazama znanja.

### Opcija 2: Kloniranje

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Varijable okruženja (opcionalno)

```bash
# WiGLE — wardriving baza podataka za pretraživanje stvarnih WiFi mreža
export WIGLE_API_KEY=your-key

# Kismet — detekcija bežičnih upada uživo
export KISMET_HOST=127.0.0.1      # Podrazumijevano: 127.0.0.1
export KISMET_PORT=2501           # Podrazumijevano: 2501
export KISMET_API_KEY=your-key
```

Svi API ključevi su opcionalni. Bez njih, i dalje imate pun pristup svim 34 alatima pokretanim sa 9 ugrađenih baza znanja koje pokrivaju WiFi napade, Bluetooth napade, RF/SDR, NFC/RFID, mobilne mreže, IoT, bazu hardvera, CVE obavještajne podatke i okvire usklađenosti.

### Povežite se sa vašim AI agentom

<details open>
<summary><b>Claude Code</b></summary>

```bash
# Sa npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# Sa lokalnim klonom
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Dodajte u `~/Library/Application Support/Claude/claude_desktop_config.json`:

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
<summary><b>Cursor / Windsurf / ostali MCP klijenti</b></summary>

Isti JSON format konfiguracije. Usmjerite komandu na `npx wifi-security-mcp-server` ili putanju vaše lokalne instalacije.

</details>

### Počnite s upitima

```
Vi: "Koji napadi su mogući protiv WPA3-SAE mreže i kako ih mogu testirati?"
```

To je to. Agent pretražuje napade, mapira ih na MITRE ATT&CK, preporučuje alate i pruža metodologiju korak po korak &mdash; sve iz ugrađenih baza znanja.

---

## What The AI Can Do

### Procjena WiFi sigurnosti

```
Vi: "Analizirajte sigurnost WPA2-PSK mreže sa omogućenim WPS-om"

Agent: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "Pronađene kritične ranjivosti u WPA2-PSK + WPS konfiguraciji:
          1. WPS Pixie Dust napad — PIN obnovljiv u sekundama putem
             offline brute-force E-S1/E-S2 nonce-ova (Reaver + PixieWPS).
             Potpuno obnavljanje PSK-a bez interakcije klijenta.
          2. PMKID napad — prvi paket 4-way handshake-a sadrži
             PMKID heš, krekiv offline sa hashcat -m 22000.
             Bez deautha, bez klijenta.
          3. Snimanje 4-Way Handshake-a — EAPOL okviri snimivi sa
             airodump-ng + deauth, zatim offline napad rječnikom.
          Prioritet: Odmah onemogućite WPS (najveći rizik), nametnite
          jak PSK od 20+ znakova, razmotrite migraciju na WPA3-SAE."
```

### Bluetooth i BLE analiza

```
Vi: "Koji su sigurnosni rizici našeg BLE sistema kontrole pristupa?"

Agent: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "BLE sistem kontrole pristupa — identificirana 4 kritična rizika:
          1. JustWorks uparivanje — nema MITM zaštite. Napadač može
             presresti uparivanje sa Ubertooth One (MITRE T1040).
          2. GATT Characteristic sniffing — komande za otključavanje šalju se
             u čistom tekstu, ponovljive sa gatttool (MITRE T1212).
          3. BLE Relay/Replay napad — preusmjeravanje legitimnog signala za
             otključavanje koristeći dva uređaja + btlejack (MITRE T1557).
          4. MAC adresa praćenje — statička BLE MAC omogućava praćenje
             korisnika (MITRE T1592.002).
          Preporučeno: nametnite LE Secure Connections (LESC) sa
          numeričkom usporedbom, šifrirajte GATT karakteristike, implementirajte
          rotirajuće nonce-ove za zaštitu od ponovljenih napada."
```

### IoT bežična revizija

```
Vi: "Procijenite bežičnu sigurnost našeg IoT raspoređivanja u pametnoj zgradi"

Agent: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "Procjena bežičnog IoT-a u pametnoj zgradi — 5 nalaza:
          1. Zigbee: Podrazumijevani ključ veze centra povjerenja
             (ZigBeeAlliance09) omogućava presretanje priključivanja na mrežu
             sa KillerBee (KRITIČNO)
          2. MQTT: Broker na portu 1883 bez TLS-a — akreditivi
             i senzorski podaci prenose se u čistom tekstu
          3. Z-Wave: S0 sigurnost sa poznatom ranjivosti razmjene ključeva
             — preporučena nadogradnja na S2
          4. MouseJack: 3 Logitech Unifying prijemnika ranjiva na
             ubacivanje tipki (CVE-2016-10761)
          5. WiFi: IoT uređaji na istom VLAN-u kao korporativni — nema
             segmentacije mreže
          Prioritetna sanacija: MQTT TLS, Zigbee instalacioni kodovi,
          IoT VLAN izolacija, zamjena ranjivih Logitech prijemnika."
```

### Revizija usklađenosti

```
Vi: "Provjerite naš bolnički WiFi prema HIPAA bežičnim zahtjevima"

Agent: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "HIPAA revizija bežične usklađenosti — 6 nalaza:
          3 NEUSKLAĐENE kontrole:
          - 164.312(a)(1): Nema bežičnog IDS-a za detekciju lažnih pristupnih tačaka
          - 164.312(e)(1): Medicinski uređaji koriste WPA2-PSK (ne Enterprise)
          - 164.312(e)(2): Nema evidencije revizije šifriranja bežičnog saobraćaja
          3 USKLAĐENE kontrole:
          - 164.310(a)(1): Fizičke lokacije pristupnih tačaka dokumentirane
          - 164.312(a)(2): 802.1X sa RADIUS autentikacijom
          - 164.312(d): EAP-TLS zasnovan na certifikatima za uređaje osoblja
          Plan sanacije: postavite WIDS (Kismet/AirMagnet), migrirajte
          medicinske uređaje na WPA2-Enterprise sa MAB, omogućite bežičnu
          evidenciju revizije na WLAN kontroleru."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; Bez API ključa</b></summary>

| Alat | Opis |
|------|-------------|
| `scan_wifi_networks` | Skeniranje i analiza WiFi mreža &mdash; otkrivanje SSID-ova, kanala, tipova šifriranja, jačine signala i sigurnosnih pogrešnih konfiguracija |
| `analyze_wifi_security` | Dubinska analiza WiFi sigurnosne konfiguracije &mdash; jačina šifriranja, metoda autentikacije, poznate slabosti, površina napada |
| `find_wifi_attacks` | Pronalaženje primjenjivih napada za WiFi cilj &mdash; vraća metodologiju napada, potrebne alate, MITRE ATT&CK mapiranje, ublažavanja |
| `simulate_evil_twin` | Simulacija i analiza scenarija napada evil twin pristupnom tačkom &mdash; hostapd-mana konfiguracija, captive portal, metodologija hvatanja akreditiva |
| `analyze_deauth` | Analiza vektora deautentikacijskih napada &mdash; 802.11w PMF status, detekcija deautha, protumjere, WIDS integracija |
| `crack_wps` | Analiza vektora WPS krekovanja &mdash; Pixie Dust, brute force, null PIN, generisanje podrazumijevanog PIN-a, Reaver/Bully metodologija |
| `analyze_pmkid` | Analiza PMKID vektora napada &mdash; WPA/WPA2 krekovanje bez klijenta putem hcxdumptool + hashcat moda 22000 |
| `audit_wifi67` | Revizija sigurnosnih funkcija specifičnih za WiFi 6 (802.11ax) i WiFi 7 (802.11be) &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; Bez API ključa</b></summary>

| Alat | Opis |
|------|-------------|
| `scan_bluetooth` | Skeniranje i analiza Bluetooth uređaja &mdash; BR/EDR klasično i BLE otkrivanje, enumeracija servisa, analiza uparivanja |
| `find_bluetooth_attacks` | Pronalaženje primjenjivih Bluetooth napada &mdash; BlueBorne, KNOB, BIAS, BLE relay, MITM, sa alatima i ublažavanjima |
| `analyze_ble` | Dubinska analiza BLE sigurnosti &mdash; GATT servisi, metode uparivanja, LE Secure Connections, šifriranje karakteristika |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; Bez API ključa</b></summary>

| Alat | Opis |
|------|-------------|
| `analyze_rf_signal` | Analiza sigurnosti RF signala &mdash; analiza frekvencije, identifikacija modulacije, izvodljivost replay napada, preporuke SDR alata |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; Bez API ključa</b></summary>

| Alat | Opis |
|------|-------------|
| `analyze_nfc_security` | Analiza NFC/RFID sigurnosti &mdash; identifikacija tipa kartice, slabosti kontrole pristupa, izvodljivost kloniranja, Proxmark3 metodologija |

</details>

<details>
<summary><b>Mobilne mreže/5G (1) &mdash; Bez API ključa</b></summary>

| Alat | Opis |
|------|-------------|
| `analyze_cellular_security` | Analiza sigurnosti mobilnih mreža &mdash; slabosti 2G/3G/4G/5G protokola, detekcija IMSI hvatača, analiza lažnih baznih stanica |

</details>

<details>
<summary><b>IoT bežično (3) &mdash; Bez API ključa</b></summary>

| Alat | Opis |
|------|-------------|
| `analyze_zigbee` | Analiza sigurnosti Zigbee mreže &mdash; politika centra povjerenja, upravljanje mrežnim ključevima, KillerBee metodologija napada |
| `scan_iot_wireless` | Skeniranje IoT bežičnih protokola &mdash; Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP otkrivanje i analiza ranjivosti |
| `find_mousejack` | Analiza MouseJack ranjivosti bežične tipkovnice/miša &mdash; ubacivanje tipki, nešifrirani HID, zaobilaženja specifična za proizvođača |

</details>

<details>
<summary><b>Napredno bežično (6) &mdash; Bez API ključa</b></summary>

| Alat | Opis |
|------|-------------|
| `analyze_airgap` | Analiza tehnika eksfiltracije putem air-gap-a &mdash; elektromagnetski, akustični, termalni, optički skriveni kanali i protumjere |
| `analyze_uwb` | Analiza Ultra-Wideband (UWB) sigurnosti &mdash; manipulacija mjerenjem dometa, relay napadi na auto ključeve i AirTags, prevara udaljenosti |
| `analyze_wifi_csi` | Analiza WiFi Channel State Information (CSI) sigurnosti &mdash; pasivno senzoriranje, prepoznavanje aktivnosti, rizici zaključivanja tipki |
| `analyze_miracast` | Analiza Miracast/WiFi Display sigurnosti &mdash; otimanje WFD sesije, snimanje ekrana, neovlašteni pristup displeju |
| `analyze_wifi_direct` | Analiza WiFi Direct (P2P) sigurnosti &mdash; napadi na pregovaranje o vlasniku grupe, WPS ranjivosti u P2P, formiranje lažne grupe |
| `analyze_drone_rf` | Analiza sigurnosti RF-a dronova &mdash; otimanje kontrolne veze, GPS lažiranje, presretanje video silazne veze, counter-UAS tehnike |

</details>

<details>
<summary><b>Infrastruktura (4) &mdash; Bez API ključa (KISMET_* opcionalno za WIDS uživo)</b></summary>

| Alat | Opis |
|------|-------------|
| `audit_wlan_controller` | Revizija konfiguracije WLAN kontrolera &mdash; Cisco WLC, Aruba, Meraki sigurnosne postavke, politike lažnih pristupnih tačaka, RF upravljanje |
| `analyze_captive_portal` | Analiza sigurnosti captive portala &mdash; tehnike zaobilaženja, rizici prikupljanja akreditiva, izolacija mreže, sigurnost gostujućeg VLAN-a |
| `detect_mac_randomization` | Analiza randomizacije MAC adresa &mdash; razlike u implementaciji iOS/Android/Windows, otpornost na praćenje, zaobilaženja otiska |
| `analyze_hotspot20` | Analiza Hotspot 2.0 (Passpoint) sigurnosti &mdash; ANQP, OSU, rizici automatskog odabira mreže, analiza EAP metode |

</details>

<details>
<summary><b>Obavještajni podaci (4) &mdash; Bez API ključa</b></summary>

| Alat | Opis |
|------|-------------|
| `lookup_wireless_cve` | Pretraživanje bežičnih CVE-ova &mdash; ranjivosti WiFi čipseta, Bluetooth stog CVE-ovi, eksploiti drajvera, bagovi firmvera |
| `lookup_hardware` | Pretraživanje bežičnog sigurnosnog hardvera &mdash; WiFi adapteri, Bluetooth sniferi, SDR uređaji, mogućnosti, kompatibilnost čipseta |
| `map_wireless_attck` | Mapiranje bežičnih napada na MITRE ATT&CK okvir &mdash; ID-ovi tehnika, kategorije taktika, strategije detekcije |
| `analyze_medical_wireless` | Analiza bežične sigurnosti medicinskih uređaja &mdash; infuzione pumpe, pejsmejkeri, monitori pacijenata, FDA smjernice, HIPAA zahtjevi |

</details>

<details>
<summary><b>Detekcija (2) &mdash; Bez API ključa</b></summary>

| Alat | Opis |
|------|-------------|
| `detect_wireless_attack` | Detekcija bežičnih napada u toku &mdash; deauth poplave, evil twin, KARMA, lažne pristupne tačke, BLE lažiranje, RF ometanje |
| `audit_wireless_compliance` | Revizija bežične mreže prema okvirima usklađenosti &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, ISO 27001 bežične kontrole |

</details>

<details>
<summary><b>Izvještavanje (1) &mdash; Bez API ključa</b></summary>

| Alat | Opis |
|------|-------------|
| `export_report` | Izvoz izvještaja o procjeni bežične sigurnosti &mdash; nalazi, ocjene rizika, status usklađenosti, plan sanacije, izvršni sažetak |

</details>

---

### CLI Usage

```bash
# Prikaz svih dostupnih alata
npx wifi-security-mcp-server --list

# Pokretanje bilo kojeg alata direktno
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

Server dolazi sa 9 ugrađenih baza znanja &mdash; bez API ključeva, bez vanjskih zavisnosti, bez ograničenja broja zahtjeva. Svaki upit alata obogaćen je strukturiranim obavještajnim podacima iz ovih baza podataka.

| Baza znanja | Unosi | Šta pruža |
|----------------|---------|-----------------|
| **WiFi napadi** | 47 napada | WPA/WPA2/WPA3 tehnike napada, varijante evil twin-a, PMKID, KRACK, FragAttacks, deauth, WPS eksploiti &mdash; svaki sa alatima, ublažavanjima, MITRE ATT&CK mapiranjem |
| **Bluetooth napadi** | 8 napada | BlueBorne, KNOB, BIAS, BLE relay, MITM, BLE fuzzing, Bluetooth oponašanje &mdash; sa CVE-ovima i strategijama detekcije |
| **RF/SDR napadi** | 6 napada | Replay napadi, ometanje, ubacivanje signala, SDR presretanje, zaobilaženje RF otiska, tehnike analize spektra |
| **NFC/RFID napadi** | 6 napada | Kloniranje kartica, relay napadi, MIFARE Classic krekovanje, NFC skimming, RFID fuzzing, zaobilaženje kontrole pristupa sa Proxmark3 |
| **Napadi na mobilne mreže** | 6 napada | IMSI hvatanje, lažna bazna stanica (Stingray), SS7 eksploatacija, 5G NAS ranjivosti, downgrade napadi, VoLTE presretanje |
| **IoT napadi** | 6 napada | Sniffing Zigbee mrežnog ključa, Z-Wave S0 downgrade, MQTT prikupljanje akreditiva, LoRaWAN ABP replay, MouseJack, BLE IoT relay |
| **Baza hardvera** | 12 uređaja | WiFi adapteri (Alfa, TP-Link), Bluetooth sniferi (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; čipsetovi, mogućnosti, podrška za monitor mod |
| **CVE baza podataka** | 17 CVE-ova | Bežični CVE-ovi za WiFi čipsetove (Broadcom, Qualcomm, Intel), Bluetooth stogove, IoT firmver &mdash; ozbiljnost, pogođene verzije, dostupnost eksploita |
| **Okviri usklađenosti** | 5 okvira | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; bežične kontrole, revizijske liste, analiza praznina |

---

## Architecture

```
src/
  index.ts                    # CLI ulazna tačka (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # MCP server postavljanje (stdio transport)
    tools.ts                  # Registar alata — svih 34 kompozitnih alata sastavljenih ovdje
  types/
    index.ts                  # Dijeljeni tipovi (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 ugrađenih baza znanja
    wifi-attacks.ts           # 47 definicija WiFi napada
    bluetooth-attacks.ts      # 8 definicija Bluetooth napada
    rf-attacks.ts             # 6 definicija RF/SDR napada
    nfc-attacks.ts            # 6 definicija NFC/RFID napada
    cellular-attacks.ts       # 6 definicija napada na mobilne mreže/5G
    iot-attacks.ts            # 6 definicija IoT napada
    hardware.ts               # 12 profila hardverskih uređaja
    cve-database.ts           # 17 bežičnih CVE-ova
    compliance.ts             # 5 okvira usklađenosti
  wifi/                       # WiFi Core alati (8)
  bluetooth/                  # Bluetooth alati (3)
  rf/                         # RF/SDR alati (1)
  nfc/                        # NFC/RFID alati (1)
  cellular/                   # Mobilne mreže/5G alati (1)
  iot/                        # IoT bežični alati (3)
  advanced/                   # Napredni bežični alati (6)
  infrastructure/             # Infrastrukturni alati (4)
  intelligence/               # Obavještajni alati (4)
  detection/                  # Alati za detekciju (2)
  reporting/                  # Alati za izvještavanje (1)
```

**Odluke dizajna:**

- **Pokretano bazama znanja** &mdash; Za razliku od alata zavisnih od API-ja, osnovna funkcionalnost radi potpuno offline iz 9 ugrađenih baza podataka. Bez API ključeva, bez ograničenja broja zahtjeva, bez vanjskih zavisnosti za primarni tok rada.
- **34 kompozitna alata, 139 pojedinačnih sposobnosti** &mdash; Svaki alat je kompozit koji objedinjuje povezane analize. `find_wifi_attacks` ne samo da navodi napade &mdash; vraća metodologiju, potrebni hardver, MITRE ATT&CK mapiranje, strategije detekcije i protumjere.
- **2 zavisnosti za pokretanje** &mdash; `@modelcontextprotocol/sdk` i `zod`. Ništa drugo. Bez nativnih modula, bez binarnih zavisnosti, bez koda specifičnog za platformu.
- **Opcionalna integracija uživo** &mdash; WiGLE API za podatke o stvarnim mrežama, Kismet za bežični IDS uživo. Osnovna analiza radi bez obojega.
- **Svjesnost o usklađenosti** &mdash; Svaki nalaz automatski se mapira na relevantne okvire usklađenosti (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) kada je primjenjivo.
- **MITRE ATT&CK mapirano** &mdash; Tehnike napada uključuju ATT&CK ID-ove tehnika, kategorije taktika i izvore podataka za detekciju za SOC integraciju.

---

## Limitations

- Baze znanja su snimke u određenom trenutku &mdash; novi napadi/CVE-ovi zahtijevaju ažuriranja paketa
- WiGLE integracija zahtijeva besplatan API ključ za pretraživanje mreža
- Kismet WIDS uživo zahtijeva pokrenutu Kismet instancu sa API pristupom
- Bez aktivnog bežičnog prijenosa &mdash; server pruža obavještajne podatke i metodologiju, ne ubacivanje paketa
- Baza hardvera pokriva najčešće uređaje za sigurnosno istraživanje, nije sveobuhvatna
- Okviri usklađenosti fokusirani su na bežične kontrole, ne na potpunu pokrivenost okvira
- Testirano na macOS / Linux (Windows nije testiran)

---

## Part of the MCP Security Suite

| Projekat | Domen | Alati |
|---|---|---|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Sigurnosno testiranje putem preglednika | 39 alata, Firefox, testiranje ubacivanja |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Sigurnost oblaka (AWS/Azure/GCP) | 38 alata, 60+ provjera |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub sigurnosno stanje | 39 alata, 45 provjera |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Obavještajni podaci o ranjivostima | 23 alata, 5 izvora |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT i izviđanje | 37 alata, 12 izvora |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark web i obavještajni podaci o prijetnjama | 66 alata, 16 izvora |
| **wifi-security-mcp-server** | **Obavještajna analiza bežične sigurnosti** | **34 alata, 9 baza znanja** |

---

<p align="center">
<b>Samo za autorizirano sigurnosno testiranje i procjenu.</b><br>
Uvijek se uvjerite da imate odgovarajuću autorizaciju prije provođenja bežičnog sigurnosnog testiranja na bilo kojoj mreži ili uređaju.<br>
Neovlašteni pristup bežičnoj mreži ili ometanje je ilegalno u većini jurisdikcija.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

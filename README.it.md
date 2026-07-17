<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <strong>Italiano</strong> |
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

<h3 align="center">Intelligence di sicurezza wireless per agenti IA.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Cellulare/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drone RF, WIDS/WIPS, Conformità &mdash; unificati in un unico server MCP.<br>
  Il tuo agente IA ottiene <b>analisi di sicurezza wireless a spettro completo su richiesta</b>, alimentata da 9 basi di conoscenza integrate che coprono 139 strumenti individuali.
</p>

<br>

<p align="center">
  <a href="#the-problem">Il Problema</a> &bull;
  <a href="#how-its-different">La Differenza</a> &bull;
  <a href="#quick-start">Avvio Rapido</a> &bull;
  <a href="#what-the-ai-can-do">Cosa Può Fare l'IA</a> &bull;
  <a href="#tools-reference-34-composite-tools">Strumenti (34)</a> &bull;
  <a href="#knowledge-bases-9">Basi di Conoscenza</a> &bull;
  <a href="#architecture">Architettura</a> &bull;
  <a href="CHANGELOG.md">Changelog</a> &bull;
  <a href="CONTRIBUTING.md">Contribuire</a>
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

La valutazione della sicurezza wireless è una delle discipline più frammentate nella sicurezza offensiva. L'audit WiFi richiede un set di strumenti, il Bluetooth un altro, RF/SDR un terzo, i protocolli IoT ancora un altro &mdash; e ogni dominio ha la propria superficie di attacco, le proprie vulnerabilità, i propri requisiti di conformità. Oggi esegui aircrack-ng per WPA, usi Bettercap per BLE, avvii HackRF per SDR, consulti diversi database CVE per ogni chipset, fai riferimento a NIST e PCI-DSS separatamente, e poi passi ore a correlare manualmente i risultati in una valutazione coerente.

```
Flusso di lavoro tradizionale di sicurezza wireless:
  audit reti WiFi                   ->  aircrack-ng / Wireshark / Kismet
  test sicurezza Bluetooth          ->  Bettercap / btlejack / Ubertooth
  analisi segnali RF                ->  HackRF / GNU Radio / GQRX
  verifica NFC/RFID                 ->  Proxmark3 / libnfc
  valutazione sicurezza cellulare   ->  srsRAN / OpenBTS
  test protocolli IoT               ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  ricerca CVE wireless              ->  NVD / vendor advisories (ricerca manuale)
  verifica conformità               ->  NIST / PCI-DSS / HIPAA docs (manuale)
  mapping su MITRE ATT&CK           ->  ATT&CK Navigator (mapping manuale)
  correlare tutto                   ->  copia-incolla in un rapporto
  ────────────────────────────────
  Totale: ore per valutazione, la maggior parte cambio contesto tra strumenti
```

**wifi-security-mcp-server** fornisce al tuo agente IA 34 strumenti compositi supportati da 9 basi di conoscenza che coprono 139 capacità individuali tramite il [Model Context Protocol](https://modelcontextprotocol.io). L'agente analizza reti, identifica vulnerabilità, mappa attacchi su MITRE ATT&CK, verifica la conformità e genera rapporti utilizzabili &mdash; in una singola conversazione.

```
Con wifi-security-mcp-server:
  Tu: "Audita la sicurezza wireless della nostra rete ufficio con WPA2-Enterprise"

  Agente: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "La tua rete WPA2-Enterprise ha 3 scoperte critiche:
            1. EAP-PEAP senza pinning del certificato — vulnerabile a evil twin
               con hostapd-mana (MITRE T1557.002)
            2. Nessun 802.11w (PMF) — suscettibile ad attacchi di deautenticazione
               (MITRE T1498.001)
            3. Hash PMKID estraibile senza interazione client — cracking
               offline possibile con hashcat modalità 22000
            PCI-DSS 4.0: 2 controlli non conformi (4.2.1, 11.2.1).
            Raccomandato: migrare a WPA3-Enterprise con SAE, abilitare PMF,
            distribuire WIDS per rilevamento AP rogue."
```

---

## How It's Different

Gli strumenti esistenti forniscono catture di pacchetti grezzi e analisi specifiche del protocollo. wifi-security-mcp-server dà al tuo agente IA la capacità di **ragionare simultaneamente su tutti i domini wireless** con supporto approfondito delle basi di conoscenza.

<table>
<thead>
<tr>
<th></th>
<th>Approccio Tradizionale</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Interfaccia</b></td>
<td>10+ CLI, GUI e strumenti hardware diversi</td>
<td>MCP &mdash; l'agente IA chiama gli strumenti in modo conversazionale</td>
</tr>
<tr>
<td><b>Copertura</b></td>
<td>Un protocollo alla volta</td>
<td>WiFi, Bluetooth, RF, NFC, Cellulare, IoT &mdash; tutto in un server</td>
</tr>
<tr>
<td><b>Conoscenza</b></td>
<td>Ricerca CVE manuale, mapping ATT&CK manuale</td>
<td>9 basi di conoscenza integrate con 139 elementi pre-mappati</td>
</tr>
<tr>
<td><b>Intel. attacchi</b></td>
<td>Ricerca Google + blog + conferenze</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Cellulare + 6 IoT attacchi catalogati con strumenti, mitigazioni, ID ATT&CK</td>
</tr>
<tr>
<td><b>Conformità</b></td>
<td>Leggere PDF NIST/PCI-DSS/HIPAA, mappare controlli manualmente</td>
<td>L'agente verifica automaticamente contro 5 framework di conformità</td>
</tr>
<tr>
<td><b>Chiavi API</b></td>
<td>Vari account per diversi servizi</td>
<td>Zero chiavi API per funzionalità core &mdash; guidato dalle basi di conoscenza</td>
</tr>
<tr>
<td><b>Configurazione</b></td>
<td>Installare aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; un comando, zero configurazione</td>
</tr>
</tbody>
</table>

---

## Quick Start

### Opzione 1: npx (nessuna installazione)

```bash
npx wifi-security-mcp-server
```

Tutti i 34 strumenti funzionano immediatamente. Nessuna chiave API richiesta &mdash; le funzionalità core sono guidate dalle basi di conoscenza.

### Opzione 2: Clona

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Variabili d'ambiente (opzionale)

```bash
# WiGLE — database wardriving per ricerche di reti WiFi reali
export WIGLE_API_KEY=your-key

# Kismet — rilevamento intrusioni wireless in tempo reale
export KISMET_HOST=127.0.0.1      # Predefinito: 127.0.0.1
export KISMET_PORT=2501           # Predefinito: 2501
export KISMET_API_KEY=your-key
```

Tutte le chiavi API sono opzionali. Senza di esse, hai ancora pieno accesso a tutti i 34 strumenti alimentati da 9 basi di conoscenza integrate che coprono attacchi WiFi, attacchi Bluetooth, RF/SDR, NFC/RFID, cellulare, IoT, database hardware, intelligence CVE e framework di conformità.

### Connetti al tuo agente IA

<details open>
<summary><b>Claude Code</b></summary>

```bash
# Con npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# Con clone locale
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Aggiungi a `~/Library/Application Support/Claude/claude_desktop_config.json`:

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
<summary><b>Cursor / Windsurf / altri client MCP</b></summary>

Stesso formato di configurazione JSON. Punta il comando a `npx wifi-security-mcp-server` o al tuo percorso di installazione locale.

</details>

### Inizia a interrogare

```
Tu: "Quali attacchi sono possibili contro una rete WPA3-SAE e come li testo?"
```

Questo è tutto. L'agente cerca gli attacchi, li mappa su MITRE ATT&CK, raccomanda strumenti e fornisce metodologia passo-passo &mdash; tutto dalle basi di conoscenza integrate.

---

## What The AI Can Do

### Valutazione Sicurezza WiFi

```
Tu: "Analizza la sicurezza di una rete WPA2-PSK con WPS abilitato"

Agente: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "Vulnerabilità critiche trovate nella configurazione WPA2-PSK + WPS:
          1. Attacco WPS Pixie Dust — PIN recuperabile in secondi tramite
             brute-force offline dei nonce E-S1/E-S2 (Reaver + PixieWPS).
             Recupero completo PSK senza interazione client.
          2. Attacco PMKID — il primo pacchetto del 4-way handshake contiene
             hash PMKID, crackabile offline con hashcat -m 22000.
             Nessun deauth necessario, nessun client necessario.
          3. Cattura 4-Way Handshake — frame EAPOL catturabili con
             airodump-ng + deauth, poi attacco dizionario offline.
          Priorità: Disabilitare WPS immediatamente (rischio più alto), imporre
          PSK forte di 20+ caratteri, considerare migrazione a WPA3-SAE."
```

### Analisi Bluetooth & BLE

```
Tu: "Quali sono i rischi di sicurezza del nostro sistema di controllo accessi basato su BLE?"

Agente: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "Sistema di controllo accessi BLE — 4 rischi critici identificati:
          1. Accoppiamento JustWorks — nessuna protezione MITM. L'attaccante può
             intercettare l'accoppiamento con Ubertooth One (MITRE T1040).
          2. Sniffing caratteristiche GATT — comandi di sblocco inviati in
             chiaro, riproducibili con gatttool (MITRE T1212).
          3. Attacco relay/replay BLE — inoltrare segnale di sblocco
             legittimo usando due dispositivi + btlejack (MITRE T1557).
          4. Tracciamento indirizzo MAC — MAC BLE statico permette il
             tracciamento degli occupanti (MITRE T1592.002).
          Raccomandato: imporre LE Secure Connections (LESC) con
          confronto numerico, cifrare le caratteristiche GATT, implementare
          nonce rotanti per protezione da replay."
```

### Audit Wireless IoT

```
Tu: "Valuta la sicurezza wireless del nostro impianto IoT per edificio intelligente"

Agente: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "Valutazione wireless IoT edificio intelligente — 5 scoperte:
          1. Zigbee: Chiave di collegamento trust center predefinita
             (ZigBeeAlliance09) permette intercettazione join di rete
             con KillerBee (CRITICO)
          2. MQTT: Broker sulla porta 1883 senza TLS — credenziali e
             dati sensori trasmessi in chiaro
          3. Z-Wave: Sicurezza S0 con vulnerabilità nota di scambio
             chiavi — upgrade S2 raccomandato
          4. MouseJack: 3 ricevitori Logitech Unifying vulnerabili a
             iniezione di tasti (CVE-2016-10761)
          5. WiFi: Dispositivi IoT sulla stessa VLAN dell'azienda —
             nessuna segmentazione di rete
          Rimedio prioritario: MQTT TLS, codici di installazione Zigbee,
          isolamento VLAN IoT, sostituire ricevitori Logitech vulnerabili."
```

### Audit di Conformità

```
Tu: "Verifica il WiFi del nostro ospedale contro i requisiti wireless HIPAA"

Agente: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "Audit di Conformità Wireless HIPAA — 6 scoperte:
          3 controlli NON CONFORMI:
          - 164.312(a)(1): Nessun IDS wireless distribuito per rilevamento AP rogue
          - 164.312(e)(1): Dispositivi medici che usano WPA2-PSK (non Enterprise)
          - 164.312(e)(2): Nessun log di audit della crittografia del traffico wireless
          3 controlli CONFORMI:
          - 164.310(a)(1): Posizioni fisiche AP documentate
          - 164.312(a)(2): 802.1X con autenticazione RADIUS
          - 164.312(d): EAP-TLS basato su certificato per dispositivi del personale
          Piano di rimedio: distribuire WIDS (Kismet/AirMagnet), migrare
          dispositivi medici a WPA2-Enterprise con MAB, abilitare log di
          audit wireless sul controller WLAN."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; Nessuna chiave API</b></summary>

| Strumento | Descrizione |
|-----------|-------------|
| `scan_wifi_networks` | Scansionare e analizzare reti WiFi &mdash; scoprire SSID, canali, tipi di crittografia, potenza del segnale e configurazioni errate di sicurezza |
| `analyze_wifi_security` | Analisi approfondita della configurazione di sicurezza WiFi &mdash; robustezza della crittografia, metodo di autenticazione, debolezze note, superficie di attacco |
| `find_wifi_attacks` | Trovare attacchi applicabili per un obiettivo WiFi &mdash; restituisce metodologia di attacco, strumenti richiesti, mapping MITRE ATT&CK, mitigazioni |
| `simulate_evil_twin` | Simulare e analizzare scenari di attacco evil twin AP &mdash; configurazione hostapd-mana, captive portal, metodologia di cattura credenziali |
| `analyze_deauth` | Analizzare vettori di attacco di deautenticazione &mdash; stato 802.11w PMF, rilevamento deauth, contromisure, integrazione WIDS |
| `crack_wps` | Analizzare vettori di attacco cracking WPS &mdash; Pixie Dust, brute force, PIN nullo, generazione PIN predefinito, metodologia Reaver/Bully |
| `analyze_pmkid` | Analizzare vettori di attacco basati su PMKID &mdash; cracking WPA/WPA2 senza client via hcxdumptool + hashcat modalità 22000 |
| `audit_wifi67` | Auditare funzionalità di sicurezza specifiche WiFi 6 (802.11ax) e WiFi 7 (802.11be) &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; Nessuna chiave API</b></summary>

| Strumento | Descrizione |
|-----------|-------------|
| `scan_bluetooth` | Scansionare e analizzare dispositivi Bluetooth &mdash; scoperta BR/EDR classico e BLE, enumerazione servizi, analisi accoppiamento |
| `find_bluetooth_attacks` | Trovare attacchi Bluetooth applicabili &mdash; BlueBorne, KNOB, BIAS, relay BLE, MITM, con strumenti e mitigazioni |
| `analyze_ble` | Analisi approfondita sicurezza BLE &mdash; servizi GATT, metodi di accoppiamento, LE Secure Connections, crittografia caratteristiche |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; Nessuna chiave API</b></summary>

| Strumento | Descrizione |
|-----------|-------------|
| `analyze_rf_signal` | Analizzare sicurezza segnale RF &mdash; analisi frequenza, identificazione modulazione, fattibilità attacco replay, raccomandazioni strumenti SDR |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; Nessuna chiave API</b></summary>

| Strumento | Descrizione |
|-----------|-------------|
| `analyze_nfc_security` | Analizzare sicurezza NFC/RFID &mdash; identificazione tipo carta, debolezze controllo accessi, fattibilità clonazione, metodologia Proxmark3 |

</details>

<details>
<summary><b>Cellulare/5G (1) &mdash; Nessuna chiave API</b></summary>

| Strumento | Descrizione |
|-----------|-------------|
| `analyze_cellular_security` | Analizzare sicurezza rete cellulare &mdash; debolezze protocollo 2G/3G/4G/5G, rilevamento IMSI catcher, analisi stazione base falsa |

</details>

<details>
<summary><b>IoT Wireless (3) &mdash; Nessuna chiave API</b></summary>

| Strumento | Descrizione |
|-----------|-------------|
| `analyze_zigbee` | Analizzare sicurezza rete Zigbee &mdash; policy trust center, gestione chiavi di rete, metodologia attacco KillerBee |
| `scan_iot_wireless` | Scansionare protocolli wireless IoT &mdash; scoperta e analisi vulnerabilità Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP |
| `find_mousejack` | Analizzare vulnerabilità MouseJack tastiera/mouse wireless &mdash; iniezione tasti, HID non crittografato, bypass specifici del produttore |

</details>

<details>
<summary><b>Wireless Avanzato (6) &mdash; Nessuna chiave API</b></summary>

| Strumento | Descrizione |
|-----------|-------------|
| `analyze_airgap` | Analizzare tecniche di esfiltrazione air-gap &mdash; canali nascosti elettromagnetici, acustici, termici, ottici e contromisure |
| `analyze_uwb` | Analizzare sicurezza Ultra-Wideband (UWB) &mdash; manipolazione ranging, attacchi relay a portachiavi auto e AirTag, frode di distanza |
| `analyze_wifi_csi` | Analizzare sicurezza WiFi Channel State Information (CSI) &mdash; rilevamento passivo, riconoscimento attività, rischi di inferenza tasti |
| `analyze_miracast` | Analizzare sicurezza Miracast/WiFi Display &mdash; hijacking sessione WFD, cattura schermo, accesso display non autorizzato |
| `analyze_wifi_direct` | Analizzare sicurezza WiFi Direct (P2P) &mdash; attacchi negoziazione proprietario gruppo, vulnerabilità WPS in P2P, formazione gruppo malevolo |
| `analyze_drone_rf` | Analizzare sicurezza RF droni &mdash; hijacking collegamento di controllo, spoofing GPS, intercettazione downlink video, tecniche counter-UAS |

</details>

<details>
<summary><b>Infrastruttura (4) &mdash; Nessuna chiave API (KISMET_* opzionale per WIDS in tempo reale)</b></summary>

| Strumento | Descrizione |
|-----------|-------------|
| `audit_wlan_controller` | Auditare configurazione controller WLAN &mdash; impostazioni sicurezza Cisco WLC, Aruba, Meraki, policy AP rogue, gestione RF |
| `analyze_captive_portal` | Analizzare sicurezza captive portal &mdash; tecniche di bypass, rischi raccolta credenziali, isolamento rete, sicurezza VLAN ospiti |
| `detect_mac_randomization` | Analizzare randomizzazione indirizzo MAC &mdash; differenze implementazione iOS/Android/Windows, resistenza al tracciamento, bypass fingerprinting |
| `analyze_hotspot20` | Analizzare sicurezza Hotspot 2.0 (Passpoint) &mdash; ANQP, OSU, rischi selezione automatica rete, analisi metodo EAP |

</details>

<details>
<summary><b>Intelligence (4) &mdash; Nessuna chiave API</b></summary>

| Strumento | Descrizione |
|-----------|-------------|
| `lookup_wireless_cve` | Cercare CVE specifici wireless &mdash; vulnerabilità chipset WiFi, CVE stack Bluetooth, exploit driver, bug firmware |
| `lookup_hardware` | Cercare hardware sicurezza wireless &mdash; adattatori WiFi, sniffer Bluetooth, dispositivi SDR, capacità, compatibilità chipset |
| `map_wireless_attck` | Mappare attacchi wireless sul framework MITRE ATT&CK &mdash; ID tecnica, categorie tattiche, strategie di rilevamento |
| `analyze_medical_wireless` | Analizzare sicurezza wireless dispositivi medici &mdash; pompe infusione, pacemaker, monitor pazienti, linee guida FDA, requisiti HIPAA |

</details>

<details>
<summary><b>Rilevamento (2) &mdash; Nessuna chiave API</b></summary>

| Strumento | Descrizione |
|-----------|-------------|
| `detect_wireless_attack` | Rilevare attacchi wireless in corso &mdash; flood deauth, evil twin, KARMA, AP rogue, spoofing BLE, indicatori jamming RF |
| `audit_wireless_compliance` | Auditare rete wireless contro framework di conformità &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, controlli wireless ISO 27001 |

</details>

<details>
<summary><b>Reportistica (1) &mdash; Nessuna chiave API</b></summary>

| Strumento | Descrizione |
|-----------|-------------|
| `export_report` | Esportare rapporto di valutazione sicurezza wireless &mdash; scoperte, valutazioni rischio, stato conformità, roadmap rimedio, sommario esecutivo |

</details>

---

### CLI Usage

```bash
# Elencare tutti gli strumenti disponibili
npx wifi-security-mcp-server --list

# Eseguire qualsiasi strumento direttamente
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

Il server include 9 basi di conoscenza integrate &mdash; nessuna chiave API, nessuna dipendenza esterna, nessun limite di frequenza. Ogni query degli strumenti viene arricchita con intelligence strutturata da questi database.

| Base di Conoscenza | Voci | Cosa fornisce |
|-------------------|------|---------------|
| **Attacchi WiFi** | 47 attacchi | Tecniche di attacco WPA/WPA2/WPA3, varianti evil twin, PMKID, KRACK, FragAttacks, deauth, exploit WPS &mdash; ognuno con strumenti, mitigazioni, mapping MITRE ATT&CK |
| **Attacchi Bluetooth** | 8 attacchi | BlueBorne, KNOB, BIAS, relay BLE, MITM, fuzzing BLE, impersonazione Bluetooth &mdash; con CVE e strategie di rilevamento |
| **Attacchi RF/SDR** | 6 attacchi | Attacchi replay, jamming, iniezione segnale, intercettazione basata su SDR, bypass fingerprinting RF, tecniche analisi spettrale |
| **Attacchi NFC/RFID** | 6 attacchi | Clonazione carta, attacchi relay, cracking MIFARE Classic, skimming NFC, fuzzing RFID, bypass controllo accessi con Proxmark3 |
| **Attacchi Cellulari** | 6 attacchi | Cattura IMSI, stazione base falsa (Stingray), sfruttamento SS7, vulnerabilità 5G NAS, attacchi downgrade, intercettazione VoLTE |
| **Attacchi IoT** | 6 attacchi | Sniffing chiave rete Zigbee, downgrade Z-Wave S0, raccolta credenziali MQTT, replay LoRaWAN ABP, MouseJack, relay BLE IoT |
| **Database Hardware** | 12 dispositivi | Adattatori WiFi (Alfa, TP-Link), sniffer Bluetooth (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; chipset, capacità, supporto modalità monitor |
| **Database CVE** | 17 CVE | CVE specifici wireless per chipset WiFi (Broadcom, Qualcomm, Intel), stack Bluetooth, firmware IoT &mdash; severità, versioni interessate, disponibilità exploit |
| **Framework di Conformità** | 5 framework | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; controlli specifici wireless, checklist audit, analisi gap |

---

## Architecture

```
src/
  index.ts                    # Punto d'ingresso CLI (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # Setup server MCP (stdio transport)
    tools.ts                  # Registro strumenti — tutti i 34 strumenti compositi assemblati qui
  types/
    index.ts                  # Tipi condivisi (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 basi di conoscenza integrate
    wifi-attacks.ts           # 47 definizioni attacchi WiFi
    bluetooth-attacks.ts      # 8 definizioni attacchi Bluetooth
    rf-attacks.ts             # 6 definizioni attacchi RF/SDR
    nfc-attacks.ts            # 6 definizioni attacchi NFC/RFID
    cellular-attacks.ts       # 6 definizioni attacchi Cellulare/5G
    iot-attacks.ts            # 6 definizioni attacchi IoT
    hardware.ts               # 12 profili dispositivi hardware
    cve-database.ts           # 17 CVE wireless
    compliance.ts             # 5 framework di conformità
  wifi/                       # Strumenti WiFi Core (8)
  bluetooth/                  # Strumenti Bluetooth (3)
  rf/                         # Strumenti RF/SDR (1)
  nfc/                        # Strumenti NFC/RFID (1)
  cellular/                   # Strumenti Cellulare/5G (1)
  iot/                        # Strumenti IoT Wireless (3)
  advanced/                   # Strumenti Wireless Avanzato (6)
  infrastructure/             # Strumenti Infrastruttura (4)
  intelligence/               # Strumenti Intelligence (4)
  detection/                  # Strumenti Rilevamento (2)
  reporting/                  # Strumenti Reportistica (1)
```

**Decisioni di design:**

- **Guidato dalle basi di conoscenza** &mdash; A differenza degli strumenti dipendenti da API, la funzionalità core funziona interamente offline da 9 database integrati. Nessuna chiave API, nessun limite di frequenza, nessuna dipendenza esterna per il flusso di lavoro principale.
- **34 strumenti compositi, 139 capacità individuali** &mdash; Ogni strumento è un composito che raggruppa analisi correlate. `find_wifi_attacks` non elenca solo gli attacchi &mdash; restituisce metodologia, hardware richiesto, mapping MITRE ATT&CK, strategie di rilevamento e contromisure.
- **2 dipendenze runtime** &mdash; `@modelcontextprotocol/sdk` e `zod`. Nient'altro. Nessun modulo nativo, nessuna dipendenza binaria, nessun codice specifico per piattaforma.
- **Integrazione live opzionale** &mdash; API WiGLE per dati di rete del mondo reale, Kismet per IDS wireless in tempo reale. L'analisi core funziona senza nessuno dei due.
- **Consapevole della conformità** &mdash; Ogni scoperta viene automaticamente mappata ai framework di conformità rilevanti (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) quando applicabile.
- **Mappato MITRE ATT&CK** &mdash; Le tecniche di attacco includono ID tecnica ATT&CK, categorie tattiche e fonti dati di rilevamento per integrazione SOC.

---

## Limitations

- Le basi di conoscenza sono istantanee puntuali &mdash; nuovi attacchi/CVE richiedono aggiornamenti del pacchetto
- L'integrazione WiGLE richiede una chiave API gratuita per le ricerche di rete
- WIDS live Kismet richiede un'istanza Kismet in esecuzione con accesso API
- Nessuna trasmissione wireless attiva &mdash; il server fornisce intelligence e metodologia, non iniezione di pacchetti
- Il database hardware copre i dispositivi di ricerca sulla sicurezza più comuni, non è esaustivo
- I framework di conformità si concentrano sui controlli specifici wireless, non sulla copertura completa del framework
- macOS / Linux testato (Windows non testato)

---

## Part of the MCP Security Suite

| Progetto | Dominio | Strumenti |
|----------|---------|-----------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Test sicurezza basati su browser | 39 strumenti, Firefox, test di iniezione |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Sicurezza cloud (AWS/Azure/GCP) | 38 strumenti, 60+ controlli |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | Postura sicurezza GitHub | 39 strumenti, 45 controlli |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Intelligence vulnerabilità | 23 strumenti, 5 fonti |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT e ricognizione | 37 strumenti, 12 fonti |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark web e intelligence minacce | 66 strumenti, 16 fonti |
| **wifi-security-mcp-server** | **Intelligence sicurezza wireless** | **34 strumenti, 9 basi di conoscenza** |

---

<p align="center">
<b>Solo per test e valutazioni di sicurezza autorizzati.</b><br>
Assicurati sempre di avere l'autorizzazione appropriata prima di eseguire test di sicurezza wireless su qualsiasi rete o dispositivo.<br>
L'accesso non autorizzato alle reti wireless o le interferenze sono illegali nella maggior parte delle giurisdizioni.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

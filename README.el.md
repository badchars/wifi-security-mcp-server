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
  <a href="README.no.md">Norsk</a> |
  <a href="README.pt-BR.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <strong>Ελληνικά</strong> |
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

<h3 align="center">Ευφυΐα ασφάλειας ασύρματων δικτύων για AI agents.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Κινητά δίκτυα/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drone RF, WIDS/WIPS, Συμμόρφωση &mdash; ενοποιημένα σε έναν ενιαίο MCP server.<br>
  Ο AI agent σας αποκτά <b>ανάλυση ασφάλειας ασύρματων δικτύων πλήρους φάσματος κατ' απαίτηση</b>, υποστηριζόμενη από 9 ενσωματωμένες βάσεις γνώσεων που καλύπτουν 139 μεμονωμένα εργαλεία.
</p>

<br>

<p align="center">
  <a href="#the-problem">Το Πρόβλημα</a> &bull;
  <a href="#how-its-different">Πώς Διαφέρει</a> &bull;
  <a href="#quick-start">Γρήγορη Εκκίνηση</a> &bull;
  <a href="#what-the-ai-can-do">Τι Μπορεί να Κάνει η AI</a> &bull;
  <a href="#tools-reference-34-composite-tools">Εργαλεία (34)</a> &bull;
  <a href="#knowledge-bases-9">Βάσεις Γνώσεων</a> &bull;
  <a href="#architecture">Αρχιτεκτονική</a> &bull;
  <a href="CHANGELOG.md">Αρχείο Αλλαγών</a> &bull;
  <a href="CONTRIBUTING.md">Συνεισφορά</a>
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

Η αξιολόγηση ασφάλειας ασύρματων δικτύων είναι ένας από τους πιο κατακερματισμένους κλάδους στην επιθετική ασφάλεια. Ο έλεγχος WiFi απαιτεί ένα σετ εργαλείων, το Bluetooth ένα άλλο, το RF/SDR ένα τρίτο, τα πρωτόκολλα IoT ακόμα ένα &mdash; και κάθε τομέας έχει τη δική του επιφάνεια επίθεσης, τις δικές του ευπάθειες, τις δικές του απαιτήσεις συμμόρφωσης. Σήμερα εκτελείτε aircrack-ng για WPA, χρησιμοποιείτε Bettercap για BLE, ξεκινάτε το HackRF για SDR, συμβουλεύεστε διαφορετικές βάσεις δεδομένων CVE για κάθε chipset, αναφέρεστε σε NIST και PCI-DSS ξεχωριστά, και μετά ξοδεύετε ώρες συσχετίζοντας χειροκίνητα τα ευρήματα σε μια συνεκτική αξιολόγηση.

```
Παραδοσιακή ροή εργασίας ασύρματης ασφάλειας:
  έλεγχος WiFi δικτύων              ->  aircrack-ng / Wireshark / Kismet
  δοκιμή ασφάλειας Bluetooth         ->  Bettercap / btlejack / Ubertooth
  ανάλυση σημάτων RF                 ->  HackRF / GNU Radio / GQRX
  έλεγχος NFC/RFID                   ->  Proxmark3 / libnfc
  αξιολόγηση ασφάλειας κινητών       ->  srsRAN / OpenBTS
  δοκιμή πρωτοκόλλων IoT             ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  αναζήτηση ασύρματων CVE            ->  NVD / vendor advisories (χειροκίνητη αναζήτηση)
  έλεγχος συμμόρφωσης                ->  NIST / PCI-DSS / HIPAA docs (χειροκίνητα)
  αντιστοίχιση στο MITRE ATT&CK      ->  ATT&CK Navigator (χειροκίνητη αντιστοίχιση)
  συσχέτιση όλων                     ->  αντιγραφή-επικόλληση σε αναφορά
  ────────────────────────────────
  Σύνολο: ώρες ανά αξιολόγηση, οι περισσότερες σε εναλλαγή πλαισίου μεταξύ εργαλείων
```

**wifi-security-mcp-server** δίνει στον AI agent σας 34 σύνθετα εργαλεία υποστηριζόμενα από 9 βάσεις γνώσεων που καλύπτουν 139 μεμονωμένες δυνατότητες μέσω του [Model Context Protocol](https://modelcontextprotocol.io). Ο agent αναλύει δίκτυα, εντοπίζει ευπάθειες, αντιστοιχίζει επιθέσεις στο MITRE ATT&CK, ελέγχει τη συμμόρφωση και δημιουργεί εφαρμόσιμες αναφορές &mdash; σε μία μόνο συνομιλία.

```
Με τον wifi-security-mcp-server:
  Εσείς: "Ελέγξτε την ασύρματη ασφάλεια του δικτύου γραφείου μας που τρέχει WPA2-Enterprise"

  Agent: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "Το δίκτυο WPA2-Enterprise σας έχει 3 κρίσιμα ευρήματα:
            1. EAP-PEAP χωρίς certificate pinning — ευάλωτο σε evil twin
               με hostapd-mana (MITRE T1557.002)
            2. Χωρίς 802.11w (PMF) — ευαίσθητο σε επιθέσεις deauthentication
               (MITRE T1498.001)
            3. PMKID hash εξαγώγιμο χωρίς αλληλεπίδραση πελάτη — offline
               cracking δυνατό με hashcat mode 22000
            PCI-DSS 4.0: 2 έλεγχοι μη συμμορφούμενοι (4.2.1, 11.2.1).
            Συνιστάται: μετάβαση σε WPA3-Enterprise με SAE, ενεργοποίηση PMF,
            ανάπτυξη WIDS για ανίχνευση rogue AP."
```

---

## How It's Different

Τα υπάρχοντα εργαλεία σας δίνουν ακατέργαστες καταγραφές πακέτων και ανάλυση ειδική για πρωτόκολλα. Ο wifi-security-mcp-server δίνει στον AI agent σας τη δυνατότητα να **συλλογίζεται ταυτόχρονα σε όλους τους ασύρματους τομείς** με βαθιά υποστήριξη βάσεων γνώσεων.

<table>
<thead>
<tr>
<th></th>
<th>Παραδοσιακή Προσέγγιση</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Διεπαφή</b></td>
<td>10+ διαφορετικά CLI, GUI και εργαλεία υλικού</td>
<td>MCP &mdash; ο AI agent καλεί εργαλεία συνομιλητικά</td>
</tr>
<tr>
<td><b>Κάλυψη</b></td>
<td>Ένα πρωτόκολλο κάθε φορά</td>
<td>WiFi, Bluetooth, RF, NFC, Κινητά δίκτυα, IoT &mdash; όλα σε έναν server</td>
</tr>
<tr>
<td><b>Γνώση</b></td>
<td>Χειροκίνητη αναζήτηση CVE, χειροκίνητη αντιστοίχιση ATT&CK</td>
<td>9 ενσωματωμένες βάσεις γνώσεων με 139 προ-αντιστοιχισμένα στοιχεία</td>
</tr>
<tr>
<td><b>Πληροφορίες επιθέσεων</b></td>
<td>Αναζήτηση Google + blog posts + ομιλίες συνεδρίων</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Κινητών + 6 IoT επιθέσεις καταλογογραφημένες με εργαλεία, μετριασμούς, ATT&CK ID</td>
</tr>
<tr>
<td><b>Συμμόρφωση</b></td>
<td>Ανάγνωση NIST/PCI-DSS/HIPAA PDF, χειροκίνητη αντιστοίχιση ελέγχων</td>
<td>Ο agent ελέγχει αυτόματα έναντι 5 πλαισίων συμμόρφωσης</td>
</tr>
<tr>
<td><b>Κλειδιά API</b></td>
<td>Διάφοροι λογαριασμοί για διαφορετικές υπηρεσίες</td>
<td>Μηδέν κλειδιά API για βασική λειτουργικότητα &mdash; βασισμένο σε βάσεις γνώσεων</td>
</tr>
<tr>
<td><b>Εγκατάσταση</b></td>
<td>Εγκατάσταση aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; μία εντολή, μηδέν ρύθμιση</td>
</tr>
</tbody>
</table>

---

## Quick Start

### Επιλογή 1: npx (χωρίς εγκατάσταση)

```bash
npx wifi-security-mcp-server
```

Και τα 34 εργαλεία λειτουργούν αμέσως. Δεν απαιτούνται κλειδιά API &mdash; η βασική λειτουργικότητα βασίζεται σε βάσεις γνώσεων.

### Επιλογή 2: Κλωνοποίηση

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Μεταβλητές περιβάλλοντος (προαιρετικά)

```bash
# WiGLE — βάση δεδομένων wardriving για αναζητήσεις πραγματικών WiFi δικτύων
export WIGLE_API_KEY=your-key

# Kismet — ζωντανή ανίχνευση ασύρματων εισβολών
export KISMET_HOST=127.0.0.1      # Προεπιλογή: 127.0.0.1
export KISMET_PORT=2501           # Προεπιλογή: 2501
export KISMET_API_KEY=your-key
```

Όλα τα κλειδιά API είναι προαιρετικά. Χωρίς αυτά, εξακολουθείτε να έχετε πλήρη πρόσβαση σε όλα τα 34 εργαλεία που υποστηρίζονται από 9 ενσωματωμένες βάσεις γνώσεων που καλύπτουν επιθέσεις WiFi, επιθέσεις Bluetooth, RF/SDR, NFC/RFID, κινητά δίκτυα, IoT, βάση δεδομένων υλικού, πληροφορίες CVE και πλαίσια συμμόρφωσης.

### Σύνδεση με τον AI agent σας

<details open>
<summary><b>Claude Code</b></summary>

```bash
# Με npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# Με τοπικό κλώνο
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Προσθέστε στο `~/Library/Application Support/Claude/claude_desktop_config.json`:

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
<summary><b>Cursor / Windsurf / άλλοι MCP clients</b></summary>

Ίδια μορφή JSON ρύθμισης. Κατευθύνετε την εντολή στο `npx wifi-security-mcp-server` ή τη διαδρομή τοπικής εγκατάστασής σας.

</details>

### Ξεκινήστε τα ερωτήματα

```
Εσείς: "Ποιες επιθέσεις είναι δυνατές εναντίον ενός δικτύου WPA3-SAE και πώς τις δοκιμάζω;"
```

Αυτό είναι. Ο agent αναζητά επιθέσεις, τις αντιστοιχίζει στο MITRE ATT&CK, προτείνει εργαλεία και παρέχει μεθοδολογία βήμα-βήμα &mdash; όλα από ενσωματωμένες βάσεις γνώσεων.

---

## What The AI Can Do

### Αξιολόγηση Ασφάλειας WiFi

```
Εσείς: "Αναλύστε την ασφάλεια ενός δικτύου WPA2-PSK με ενεργοποιημένο WPS"

Agent: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "Βρέθηκαν κρίσιμες ευπάθειες στη ρύθμιση WPA2-PSK + WPS:
          1. Επίθεση WPS Pixie Dust — PIN ανακτήσιμο σε δευτερόλεπτα μέσω
             offline brute-force των E-S1/E-S2 nonces (Reaver + PixieWPS).
             Πλήρης ανάκτηση PSK χωρίς αλληλεπίδραση πελάτη.
          2. Επίθεση PMKID — το πρώτο πακέτο του 4-way handshake περιέχει
             PMKID hash, crackable offline με hashcat -m 22000.
             Χωρίς deauth, χωρίς πελάτη.
          3. Καταγραφή 4-Way Handshake — EAPOL frames καταγράψιμα με
             airodump-ng + deauth, μετά offline επίθεση λεξικού.
          Προτεραιότητα: Απενεργοποίηση WPS αμέσως (υψηλότερος κίνδυνος),
          επιβολή ισχυρού PSK 20+ χαρακτήρων, εξέταση μετάβασης σε WPA3-SAE."
```

### Ανάλυση Bluetooth & BLE

```
Εσείς: "Ποιοι είναι οι κίνδυνοι ασφαλείας του BLE συστήματος ελέγχου πρόσβασης;"

Agent: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "Σύστημα ελέγχου πρόσβασης BLE — 4 κρίσιμοι κίνδυνοι εντοπίστηκαν:
          1. JustWorks Pairing — χωρίς MITM προστασία. Ο επιτιθέμενος μπορεί
             να υποκλέψει το pairing με Ubertooth One (MITRE T1040).
          2. GATT Characteristic Sniffing — εντολές ξεκλειδώματος στέλνονται σε
             plaintext, επαναληπτές με gatttool (MITRE T1212).
          3. BLE Relay/Replay Attack — αναμετάδοση νόμιμου σήματος ξεκλειδώματος
             χρησιμοποιώντας δύο συσκευές + btlejack (MITRE T1557).
          4. Παρακολούθηση MAC Address — στατική BLE MAC επιτρέπει παρακολούθηση
             χρηστών (MITRE T1592.002).
          Συνιστάται: επιβολή LE Secure Connections (LESC) με αριθμητική
          σύγκριση, κρυπτογράφηση GATT characteristics, εφαρμογή
          rolling nonces για προστασία από replay."
```

### Έλεγχος Ασύρματου IoT

```
Εσείς: "Αξιολογήστε την ασύρματη ασφάλεια της ανάπτυξης IoT στο έξυπνο κτίριό μας"

Agent: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "Αξιολόγηση ασύρματου IoT έξυπνου κτιρίου — 5 ευρήματα:
          1. Zigbee: Προεπιλεγμένο κλειδί σύνδεσης trust center
             (ZigBeeAlliance09) επιτρέπει υποκλοπή σύνδεσης δικτύου
             με KillerBee (ΚΡΙΣΙΜΟ)
          2. MQTT: Broker στη θύρα 1883 χωρίς TLS — διαπιστευτήρια
             και δεδομένα αισθητήρων μεταδίδονται σε plaintext
          3. Z-Wave: S0 ασφάλεια με γνωστή ευπάθεια ανταλλαγής κλειδιών
             — συνιστάται αναβάθμιση σε S2
          4. MouseJack: 3 δέκτες Logitech Unifying ευάλωτοι σε
             ένεση πληκτρολογήσεων (CVE-2016-10761)
          5. WiFi: Συσκευές IoT στο ίδιο VLAN με το εταιρικό —
             χωρίς τμηματοποίηση δικτύου
          Προτεραιότητα αποκατάστασης: MQTT TLS, Zigbee install codes,
          απομόνωση IoT VLAN, αντικατάσταση ευάλωτων Logitech δεκτών."
```

### Έλεγχος Συμμόρφωσης

```
Εσείς: "Ελέγξτε το WiFi του νοσοκομείου μας έναντι των απαιτήσεων HIPAA για ασύρματα δίκτυα"

Agent: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "Έλεγχος ασύρματης συμμόρφωσης HIPAA — 6 ευρήματα:
          3 ΜΗ ΣΥΜΜΟΡΦΟΥΜΕΝΟΙ έλεγχοι:
          - 164.312(a)(1): Δεν έχει αναπτυχθεί ασύρματο IDS για ανίχνευση rogue AP
          - 164.312(e)(1): Ιατρικές συσκευές χρησιμοποιούν WPA2-PSK (όχι Enterprise)
          - 164.312(e)(2): Δεν υπάρχει καταγραφή ελέγχου κρυπτογράφησης ασύρματης κίνησης
          3 ΣΥΜΜΟΡΦΟΥΜΕΝΟΙ έλεγχοι:
          - 164.310(a)(1): Φυσικές τοποθεσίες AP τεκμηριωμένες
          - 164.312(a)(2): 802.1X με RADIUS authentication
          - 164.312(d): EAP-TLS βασισμένο σε πιστοποιητικά για συσκευές προσωπικού
          Σχέδιο αποκατάστασης: ανάπτυξη WIDS (Kismet/AirMagnet), μετάβαση
          ιατρικών συσκευών σε WPA2-Enterprise με MAB, ενεργοποίηση ασύρματης
          καταγραφής ελέγχου στον WLAN controller."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; Χωρίς κλειδί API</b></summary>

| Εργαλείο | Περιγραφή |
|------|-------------|
| `scan_wifi_networks` | Σάρωση και ανάλυση WiFi δικτύων &mdash; ανακάλυψη SSID, καναλιών, τύπων κρυπτογράφησης, ισχύος σήματος και λανθασμένων ρυθμίσεων ασφαλείας |
| `analyze_wifi_security` | Βαθιά ανάλυση ρύθμισης ασφάλειας WiFi &mdash; ισχύς κρυπτογράφησης, μέθοδος αυθεντικοποίησης, γνωστές αδυναμίες, επιφάνεια επίθεσης |
| `find_wifi_attacks` | Εύρεση εφαρμόσιμων επιθέσεων για στόχο WiFi &mdash; επιστρέφει μεθοδολογία επίθεσης, απαιτούμενα εργαλεία, αντιστοίχιση MITRE ATT&CK, μετριασμούς |
| `simulate_evil_twin` | Προσομοίωση και ανάλυση σεναρίων επίθεσης evil twin AP &mdash; ρύθμιση hostapd-mana, captive portal, μεθοδολογία καταγραφής διαπιστευτηρίων |
| `analyze_deauth` | Ανάλυση φορέων επίθεσης deauthentication &mdash; κατάσταση 802.11w PMF, ανίχνευση deauth, αντίμετρα, ενσωμάτωση WIDS |
| `crack_wps` | Ανάλυση φορέων επίθεσης WPS cracking &mdash; Pixie Dust, brute force, null PIN, δημιουργία προεπιλεγμένου PIN, μεθοδολογία Reaver/Bully |
| `analyze_pmkid` | Ανάλυση φορέων επίθεσης βασισμένων σε PMKID &mdash; WPA/WPA2 cracking χωρίς πελάτη μέσω hcxdumptool + hashcat mode 22000 |
| `audit_wifi67` | Έλεγχος χαρακτηριστικών ασφαλείας WiFi 6 (802.11ax) και WiFi 7 (802.11be) &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; Χωρίς κλειδί API</b></summary>

| Εργαλείο | Περιγραφή |
|------|-------------|
| `scan_bluetooth` | Σάρωση και ανάλυση συσκευών Bluetooth &mdash; ανακάλυψη BR/EDR κλασικό και BLE, απαρίθμηση υπηρεσιών, ανάλυση pairing |
| `find_bluetooth_attacks` | Εύρεση εφαρμόσιμων επιθέσεων Bluetooth &mdash; BlueBorne, KNOB, BIAS, BLE relay, MITM, με εργαλεία και μετριασμούς |
| `analyze_ble` | Βαθιά ανάλυση ασφάλειας BLE &mdash; υπηρεσίες GATT, μέθοδοι pairing, LE Secure Connections, κρυπτογράφηση characteristic |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; Χωρίς κλειδί API</b></summary>

| Εργαλείο | Περιγραφή |
|------|-------------|
| `analyze_rf_signal` | Ανάλυση ασφάλειας σήματος RF &mdash; ανάλυση συχνότητας, αναγνώριση διαμόρφωσης, εφικτότητα replay attack, προτάσεις εργαλείων SDR |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; Χωρίς κλειδί API</b></summary>

| Εργαλείο | Περιγραφή |
|------|-------------|
| `analyze_nfc_security` | Ανάλυση ασφάλειας NFC/RFID &mdash; αναγνώριση τύπου κάρτας, αδυναμίες ελέγχου πρόσβασης, εφικτότητα κλωνοποίησης, μεθοδολογία Proxmark3 |

</details>

<details>
<summary><b>Κινητά δίκτυα/5G (1) &mdash; Χωρίς κλειδί API</b></summary>

| Εργαλείο | Περιγραφή |
|------|-------------|
| `analyze_cellular_security` | Ανάλυση ασφάλειας κινητών δικτύων &mdash; αδυναμίες πρωτοκόλλων 2G/3G/4G/5G, ανίχνευση IMSI catcher, ανάλυση ψεύτικης βάσης σταθμού |

</details>

<details>
<summary><b>Ασύρματο IoT (3) &mdash; Χωρίς κλειδί API</b></summary>

| Εργαλείο | Περιγραφή |
|------|-------------|
| `analyze_zigbee` | Ανάλυση ασφάλειας δικτύου Zigbee &mdash; πολιτική trust center, διαχείριση κλειδιού δικτύου, μεθοδολογία επίθεσης KillerBee |
| `scan_iot_wireless` | Σάρωση ασύρματων πρωτοκόλλων IoT &mdash; ανακάλυψη και ανάλυση ευπαθειών Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP |
| `find_mousejack` | Ανάλυση ευπαθειών ασύρματου πληκτρολογίου/ποντικιού MouseJack &mdash; ένεση πληκτρολογήσεων, μη κρυπτογραφημένο HID, παρακάμψεις ανά κατασκευαστή |

</details>

<details>
<summary><b>Προηγμένο Ασύρματο (6) &mdash; Χωρίς κλειδί API</b></summary>

| Εργαλείο | Περιγραφή |
|------|-------------|
| `analyze_airgap` | Ανάλυση τεχνικών εξαγωγής δεδομένων air-gap &mdash; ηλεκτρομαγνητικά, ακουστικά, θερμικά, οπτικά κρυφά κανάλια και αντίμετρα |
| `analyze_uwb` | Ανάλυση ασφάλειας Ultra-Wideband (UWB) &mdash; χειραγώγηση μέτρησης εμβέλειας, relay attacks σε κλειδιά αυτοκινήτων και AirTags, απάτη απόστασης |
| `analyze_wifi_csi` | Ανάλυση ασφάλειας WiFi Channel State Information (CSI) &mdash; παθητική ανίχνευση, αναγνώριση δραστηριότητας, κίνδυνοι εξαγωγής πληκτρολογήσεων |
| `analyze_miracast` | Ανάλυση ασφάλειας Miracast/WiFi Display &mdash; WFD session hijacking, καταγραφή οθόνης, μη εξουσιοδοτημένη πρόσβαση στην οθόνη |
| `analyze_wifi_direct` | Ανάλυση ασφάλειας WiFi Direct (P2P) &mdash; επιθέσεις διαπραγμάτευσης group owner, ευπάθειες WPS σε P2P, σχηματισμός rogue group |
| `analyze_drone_rf` | Ανάλυση ασφάλειας RF drones &mdash; hijacking συνδέσμου ελέγχου, GPS spoofing, υποκλοπή video downlink, τεχνικές counter-UAS |

</details>

<details>
<summary><b>Υποδομή (4) &mdash; Χωρίς κλειδί API (KISMET_* προαιρετικό για ζωντανό WIDS)</b></summary>

| Εργαλείο | Περιγραφή |
|------|-------------|
| `audit_wlan_controller` | Έλεγχος ρύθμισης WLAN controller &mdash; ρυθμίσεις ασφαλείας Cisco WLC, Aruba, Meraki, πολιτικές rogue AP, διαχείριση RF |
| `analyze_captive_portal` | Ανάλυση ασφάλειας captive portal &mdash; τεχνικές παράκαμψης, κίνδυνοι συλλογής διαπιστευτηρίων, απομόνωση δικτύου, ασφάλεια guest VLAN |
| `detect_mac_randomization` | Ανάλυση τυχαιοποίησης διεύθυνσης MAC &mdash; διαφορές υλοποίησης iOS/Android/Windows, αντίσταση στην παρακολούθηση, παρακάμψεις fingerprinting |
| `analyze_hotspot20` | Ανάλυση ασφάλειας Hotspot 2.0 (Passpoint) &mdash; ANQP, OSU, κίνδυνοι αυτόματης επιλογής δικτύου, ανάλυση μεθόδου EAP |

</details>

<details>
<summary><b>Πληροφορίες (4) &mdash; Χωρίς κλειδί API</b></summary>

| Εργαλείο | Περιγραφή |
|------|-------------|
| `lookup_wireless_cve` | Αναζήτηση ασύρματων CVE &mdash; ευπάθειες WiFi chipset, CVE Bluetooth stack, exploits drivers, bugs firmware |
| `lookup_hardware` | Αναζήτηση υλικού ασύρματης ασφάλειας &mdash; WiFi adapters, Bluetooth sniffers, SDR συσκευές, δυνατότητες, συμβατότητα chipset |
| `map_wireless_attck` | Αντιστοίχιση ασύρματων επιθέσεων στο πλαίσιο MITRE ATT&CK &mdash; ID τεχνικών, κατηγορίες τακτικών, στρατηγικές ανίχνευσης |
| `analyze_medical_wireless` | Ανάλυση ασύρματης ασφάλειας ιατρικών συσκευών &mdash; αντλίες έγχυσης, βηματοδότες, monitors ασθενών, οδηγίες FDA, απαιτήσεις HIPAA |

</details>

<details>
<summary><b>Ανίχνευση (2) &mdash; Χωρίς κλειδί API</b></summary>

| Εργαλείο | Περιγραφή |
|------|-------------|
| `detect_wireless_attack` | Ανίχνευση ασύρματων επιθέσεων σε εξέλιξη &mdash; deauth floods, evil twin, KARMA, rogue AP, BLE spoofing, ενδείξεις RF jamming |
| `audit_wireless_compliance` | Έλεγχος ασύρματου δικτύου έναντι πλαισίων συμμόρφωσης &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, ISO 27001 ασύρματοι έλεγχοι |

</details>

<details>
<summary><b>Αναφορές (1) &mdash; Χωρίς κλειδί API</b></summary>

| Εργαλείο | Περιγραφή |
|------|-------------|
| `export_report` | Εξαγωγή αναφοράς αξιολόγησης ασύρματης ασφάλειας &mdash; ευρήματα, βαθμολογίες κινδύνου, κατάσταση συμμόρφωσης, οδικός χάρτης αποκατάστασης, εκτελεστική σύνοψη |

</details>

---

### CLI Usage

```bash
# Λίστα όλων των διαθέσιμων εργαλείων
npx wifi-security-mcp-server --list

# Εκτέλεση οποιουδήποτε εργαλείου απευθείας
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

Ο server παρέχεται με 9 ενσωματωμένες βάσεις γνώσεων &mdash; χωρίς κλειδιά API, χωρίς εξωτερικές εξαρτήσεις, χωρίς όρια ρυθμού. Κάθε ερώτημα εργαλείου εμπλουτίζεται με δομημένη ευφυΐα από αυτές τις βάσεις δεδομένων.

| Βάση Γνώσεων | Εγγραφές | Τι παρέχει |
|----------------|---------|-----------------|
| **Επιθέσεις WiFi** | 47 επιθέσεις | Τεχνικές επίθεσης WPA/WPA2/WPA3, παραλλαγές evil twin, PMKID, KRACK, FragAttacks, deauth, WPS exploits &mdash; κάθε μία με εργαλεία, μετριασμούς, αντιστοίχιση MITRE ATT&CK |
| **Επιθέσεις Bluetooth** | 8 επιθέσεις | BlueBorne, KNOB, BIAS, BLE relay, MITM, BLE fuzzing, Bluetooth impersonation &mdash; με CVE και στρατηγικές ανίχνευσης |
| **Επιθέσεις RF/SDR** | 6 επιθέσεις | Replay attacks, jamming, ένεση σήματος, SDR υποκλοπή, παράκαμψη RF fingerprinting, τεχνικές ανάλυσης φάσματος |
| **Επιθέσεις NFC/RFID** | 6 επιθέσεις | Κλωνοποίηση καρτών, relay attacks, MIFARE Classic cracking, NFC skimming, RFID fuzzing, παράκαμψη ελέγχου πρόσβασης με Proxmark3 |
| **Επιθέσεις Κινητών** | 6 επιθέσεις | IMSI catching, ψεύτικος σταθμός βάσης (Stingray), SS7 exploitation, 5G NAS ευπάθειες, downgrade attacks, VoLTE υποκλοπή |
| **Επιθέσεις IoT** | 6 επιθέσεις | Zigbee network key sniffing, Z-Wave S0 downgrade, MQTT credential harvesting, LoRaWAN ABP replay, MouseJack, BLE IoT relay |
| **Βάση Υλικού** | 12 συσκευές | WiFi adapters (Alfa, TP-Link), Bluetooth sniffers (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; chipsets, δυνατότητες, υποστήριξη monitor mode |
| **Βάση CVE** | 17 CVE | Ασύρματα CVE για WiFi chipsets (Broadcom, Qualcomm, Intel), Bluetooth stacks, IoT firmware &mdash; σοβαρότητα, επηρεαζόμενες εκδόσεις, διαθεσιμότητα exploit |
| **Πλαίσια Συμμόρφωσης** | 5 πλαίσια | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; ασύρματοι έλεγχοι, λίστες ελέγχου, ανάλυση κενών |

---

## Architecture

```
src/
  index.ts                    # Σημείο εισόδου CLI (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # Ρύθμιση MCP server (stdio transport)
    tools.ts                  # Μητρώο εργαλείων — και τα 34 σύνθετα εργαλεία συναρμολογούνται εδώ
  types/
    index.ts                  # Κοινοί τύποι (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 ενσωματωμένες βάσεις γνώσεων
    wifi-attacks.ts           # 47 ορισμοί επιθέσεων WiFi
    bluetooth-attacks.ts      # 8 ορισμοί επιθέσεων Bluetooth
    rf-attacks.ts             # 6 ορισμοί επιθέσεων RF/SDR
    nfc-attacks.ts            # 6 ορισμοί επιθέσεων NFC/RFID
    cellular-attacks.ts       # 6 ορισμοί επιθέσεων κινητών/5G
    iot-attacks.ts            # 6 ορισμοί επιθέσεων IoT
    hardware.ts               # 12 προφίλ συσκευών υλικού
    cve-database.ts           # 17 ασύρματα CVE
    compliance.ts             # 5 πλαίσια συμμόρφωσης
  wifi/                       # WiFi Core εργαλεία (8)
  bluetooth/                  # Bluetooth εργαλεία (3)
  rf/                         # RF/SDR εργαλεία (1)
  nfc/                        # NFC/RFID εργαλεία (1)
  cellular/                   # Κινητά/5G εργαλεία (1)
  iot/                        # Ασύρματα IoT εργαλεία (3)
  advanced/                   # Προηγμένα ασύρματα εργαλεία (6)
  infrastructure/             # Εργαλεία υποδομής (4)
  intelligence/               # Εργαλεία πληροφοριών (4)
  detection/                  # Εργαλεία ανίχνευσης (2)
  reporting/                  # Εργαλεία αναφορών (1)
```

**Αποφάσεις σχεδιασμού:**

- **Βασισμένο σε βάσεις γνώσεων** &mdash; Σε αντίθεση με τα εργαλεία που εξαρτώνται από API, η βασική λειτουργικότητα εκτελείται εξ ολοκλήρου offline από 9 ενσωματωμένες βάσεις δεδομένων. Χωρίς κλειδιά API, χωρίς όρια ρυθμού, χωρίς εξωτερικές εξαρτήσεις για την κύρια ροή εργασίας.
- **34 σύνθετα εργαλεία, 139 μεμονωμένες δυνατότητες** &mdash; Κάθε εργαλείο είναι ένα σύνθετο που ομαδοποιεί σχετικές αναλύσεις. Το `find_wifi_attacks` δεν απαριθμεί απλώς επιθέσεις &mdash; επιστρέφει μεθοδολογία, απαιτούμενο υλικό, αντιστοίχιση MITRE ATT&CK, στρατηγικές ανίχνευσης και αντίμετρα.
- **2 εξαρτήσεις χρόνου εκτέλεσης** &mdash; `@modelcontextprotocol/sdk` και `zod`. Τίποτα άλλο. Χωρίς native modules, χωρίς εξαρτήσεις binary, χωρίς κώδικα ειδικό για πλατφόρμα.
- **Προαιρετική ζωντανή ενσωμάτωση** &mdash; WiGLE API για δεδομένα πραγματικών δικτύων, Kismet για ζωντανό ασύρματο IDS. Η βασική ανάλυση λειτουργεί χωρίς κανένα από τα δύο.
- **Ενήμερο για τη συμμόρφωση** &mdash; Κάθε εύρημα αντιστοιχίζεται αυτόματα σε σχετικά πλαίσια συμμόρφωσης (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) όταν εφαρμόζεται.
- **Αντιστοιχισμένο στο MITRE ATT&CK** &mdash; Οι τεχνικές επίθεσης περιλαμβάνουν ATT&CK technique IDs, κατηγορίες τακτικών και πηγές δεδομένων ανίχνευσης για ενσωμάτωση SOC.

---

## Limitations

- Οι βάσεις γνώσεων είναι στιγμιότυπα χρονικής στιγμής &mdash; νέες επιθέσεις/CVE απαιτούν ενημερώσεις πακέτου
- Η ενσωμάτωση WiGLE απαιτεί δωρεάν κλειδί API για αναζητήσεις δικτύων
- Το ζωντανό WIDS Kismet απαιτεί ένα τρέχον instance Kismet με πρόσβαση API
- Χωρίς ενεργή ασύρματη μετάδοση &mdash; ο server παρέχει ευφυΐα και μεθοδολογία, όχι ένεση πακέτων
- Η βάση υλικού καλύπτει τις πιο κοινές συσκευές έρευνας ασφαλείας, δεν είναι εξαντλητική
- Τα πλαίσια συμμόρφωσης εστιάζουν σε ασύρματους ελέγχους, όχι σε πλήρη κάλυψη πλαισίου
- Δοκιμασμένο σε macOS / Linux (τα Windows δεν δοκιμάστηκαν)

---

## Part of the MCP Security Suite

| Έργο | Τομέας | Εργαλεία |
|---|---|---|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Δοκιμές ασφαλείας μέσω browser | 39 εργαλεία, Firefox, δοκιμές ένεσης |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Ασφάλεια cloud (AWS/Azure/GCP) | 38 εργαλεία, 60+ έλεγχοι |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | Κατάσταση ασφαλείας GitHub | 39 εργαλεία, 45 έλεγχοι |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Ευφυΐα ευπαθειών | 23 εργαλεία, 5 πηγές |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT & αναγνώριση | 37 εργαλεία, 12 πηγές |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark web & ευφυΐα απειλών | 66 εργαλεία, 16 πηγές |
| **wifi-security-mcp-server** | **Ευφυΐα ασύρματης ασφάλειας** | **34 εργαλεία, 9 βάσεις γνώσεων** |

---

<p align="center">
<b>Μόνο για εξουσιοδοτημένες δοκιμές ασφαλείας και αξιολόγηση.</b><br>
Βεβαιωθείτε πάντα ότι έχετε την κατάλληλη εξουσιοδότηση πριν πραγματοποιήσετε δοκιμές ασύρματης ασφάλειας σε οποιοδήποτε δίκτυο ή συσκευή.<br>
Η μη εξουσιοδοτημένη πρόσβαση ή παρεμβολή σε ασύρματα δίκτυα είναι παράνομη στις περισσότερες δικαιοδοσίες.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

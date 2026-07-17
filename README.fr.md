<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <strong>Français</strong> |
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

<h3 align="center">Intelligence de sécurité sans fil pour les agents IA.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Cellulaire/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drone RF, WIDS/WIPS, Conformité &mdash; unifiés dans un seul serveur MCP.<br>
  Votre agent IA obtient une <b>analyse de sécurité sans fil à spectre complet à la demande</b>, alimentée par 9 bases de connaissances intégrées couvrant 139 outils individuels.
</p>

<br>

<p align="center">
  <a href="#the-problem">Le Problème</a> &bull;
  <a href="#how-its-different">La Différence</a> &bull;
  <a href="#quick-start">Démarrage Rapide</a> &bull;
  <a href="#what-the-ai-can-do">Ce que l'IA Peut Faire</a> &bull;
  <a href="#tools-reference-34-composite-tools">Outils (34)</a> &bull;
  <a href="#knowledge-bases-9">Bases de Connaissances</a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="CHANGELOG.md">Changelog</a> &bull;
  <a href="CONTRIBUTING.md">Contribuer</a>
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

L'évaluation de la sécurité sans fil est l'une des disciplines les plus fragmentées en sécurité offensive. L'audit WiFi nécessite un ensemble d'outils, Bluetooth un autre, RF/SDR un troisième, les protocoles IoT encore un autre &mdash; et chaque domaine a sa propre surface d'attaque, ses propres vulnérabilités, ses propres exigences de conformité. Aujourd'hui, vous exécutez aircrack-ng pour WPA, utilisez Bettercap pour BLE, lancez HackRF pour SDR, consultez différentes bases CVE pour chaque chipset, référencez NIST et PCI-DSS séparément, puis passez des heures à corréler manuellement les résultats dans une évaluation cohérente.

```
Flux de travail traditionnel de sécurité sans fil :
  auditer les réseaux WiFi          ->  aircrack-ng / Wireshark / Kismet
  tester la sécurité Bluetooth      ->  Bettercap / btlejack / Ubertooth
  analyser les signaux RF           ->  HackRF / GNU Radio / GQRX
  vérifier NFC/RFID                 ->  Proxmark3 / libnfc
  évaluer la sécurité cellulaire    ->  srsRAN / OpenBTS
  tester les protocoles IoT         ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  chercher les CVE sans fil         ->  NVD / vendor advisories (recherche manuelle)
  vérifier la conformité            ->  NIST / PCI-DSS / HIPAA docs (manuel)
  mapper vers MITRE ATT&CK          ->  ATT&CK Navigator (mapping manuel)
  tout corréler                     ->  copier-coller dans un rapport
  ────────────────────────────────
  Total : des heures par évaluation, principalement du changement de contexte entre outils
```

**wifi-security-mcp-server** fournit à votre agent IA 34 outils composites soutenus par 9 bases de connaissances couvrant 139 capacités individuelles via le [Model Context Protocol](https://modelcontextprotocol.io). L'agent analyse les réseaux, identifie les vulnérabilités, mappe les attaques sur MITRE ATT&CK, vérifie la conformité et génère des rapports exploitables &mdash; en une seule conversation.

```
Avec wifi-security-mcp-server :
  Vous : "Auditez la sécurité sans fil de notre réseau de bureau fonctionnant en WPA2-Enterprise"

  Agent : -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "Votre réseau WPA2-Enterprise présente 3 découvertes critiques :
            1. EAP-PEAP sans ancrage de certificat — vulnérable au evil twin
               avec hostapd-mana (MITRE T1557.002)
            2. Pas de 802.11w (PMF) — susceptible aux attaques de désauthentification
               (MITRE T1498.001)
            3. Hash PMKID extractible sans interaction client — cracking
               hors ligne possible avec hashcat mode 22000
            PCI-DSS 4.0 : 2 contrôles non conformes (4.2.1, 11.2.1).
            Recommandé : migrer vers WPA3-Enterprise avec SAE, activer PMF,
            déployer WIDS pour la détection d'AP rogue."
```

---

## How It's Different

Les outils existants vous donnent des captures de paquets brutes et des analyses spécifiques au protocole. wifi-security-mcp-server donne à votre agent IA la capacité de **raisonner simultanément sur tous les domaines sans fil** avec un support approfondi de bases de connaissances.

<table>
<thead>
<tr>
<th></th>
<th>Approche Traditionnelle</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Interface</b></td>
<td>10+ CLI, GUI et outils matériels différents</td>
<td>MCP &mdash; l'agent IA appelle les outils de manière conversationnelle</td>
</tr>
<tr>
<td><b>Couverture</b></td>
<td>Un protocole à la fois</td>
<td>WiFi, Bluetooth, RF, NFC, Cellulaire, IoT &mdash; tout dans un seul serveur</td>
</tr>
<tr>
<td><b>Connaissances</b></td>
<td>Recherche CVE manuelle, mapping ATT&CK manuel</td>
<td>9 bases de connaissances intégrées avec 139 éléments pré-mappés</td>
</tr>
<tr>
<td><b>Intel. d'attaque</b></td>
<td>Recherche Google + articles de blog + conférences</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Cellulaire + 6 IoT attaques cataloguées avec outils, atténuations, IDs ATT&CK</td>
</tr>
<tr>
<td><b>Conformité</b></td>
<td>Lire les PDFs NIST/PCI-DSS/HIPAA, mapper les contrôles manuellement</td>
<td>L'agent vérifie automatiquement contre 5 cadres de conformité</td>
</tr>
<tr>
<td><b>Clés API</b></td>
<td>Divers comptes pour différents services</td>
<td>Zéro clé API pour les fonctionnalités de base &mdash; piloté par les bases de connaissances</td>
</tr>
<tr>
<td><b>Installation</b></td>
<td>Installer aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; une commande, zéro configuration</td>
</tr>
</tbody>
</table>

---

## Quick Start

### Option 1 : npx (sans installation)

```bash
npx wifi-security-mcp-server
```

Les 34 outils fonctionnent immédiatement. Aucune clé API requise &mdash; les fonctionnalités de base sont pilotées par les bases de connaissances.

### Option 2 : Cloner

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Variables d'environnement (optionnel)

```bash
# WiGLE — base de données wardriving pour les recherches de réseaux WiFi réels
export WIGLE_API_KEY=your-key

# Kismet — détection d'intrusion sans fil en direct
export KISMET_HOST=127.0.0.1      # Par défaut : 127.0.0.1
export KISMET_PORT=2501           # Par défaut : 2501
export KISMET_API_KEY=your-key
```

Toutes les clés API sont optionnelles. Sans elles, vous avez toujours un accès complet aux 34 outils alimentés par 9 bases de connaissances intégrées couvrant les attaques WiFi, les attaques Bluetooth, RF/SDR, NFC/RFID, cellulaire, IoT, la base de données matérielle, l'intelligence CVE et les cadres de conformité.

### Connecter à votre agent IA

<details open>
<summary><b>Claude Code</b></summary>

```bash
# Avec npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# Avec un clone local
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Ajouter à `~/Library/Application Support/Claude/claude_desktop_config.json` :

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
<summary><b>Cursor / Windsurf / autres clients MCP</b></summary>

Même format de configuration JSON. Pointez la commande vers `npx wifi-security-mcp-server` ou votre chemin d'installation local.

</details>

### Commencer à interroger

```
Vous : "Quelles attaques sont possibles contre un réseau WPA3-SAE et comment les tester ?"
```

C'est tout. L'agent recherche les attaques, les mappe sur MITRE ATT&CK, recommande des outils et fournit une méthodologie étape par étape &mdash; le tout depuis les bases de connaissances intégrées.

---

## What The AI Can Do

### Évaluation de Sécurité WiFi

```
Vous : "Analysez la sécurité d'un réseau WPA2-PSK avec WPS activé"

Agent : -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "Vulnérabilités critiques trouvées dans la configuration WPA2-PSK + WPS :
          1. Attaque WPS Pixie Dust — PIN récupérable en secondes via
             force brute hors ligne des nonces E-S1/E-S2 (Reaver + PixieWPS).
             Récupération complète du PSK sans interaction client.
          2. Attaque PMKID — le premier paquet du 4-way handshake contient
             le hash PMKID, crackable hors ligne avec hashcat -m 22000.
             Pas de deauth nécessaire, pas de client nécessaire.
          3. Capture du 4-Way Handshake — les frames EAPOL capturables avec
             airodump-ng + deauth, puis attaque par dictionnaire hors ligne.
          Priorité : Désactiver WPS immédiatement (risque le plus élevé), imposer
          un PSK fort de 20+ caractères, envisager la migration vers WPA3-SAE."
```

### Analyse Bluetooth & BLE

```
Vous : "Quels sont les risques de sécurité de notre système de contrôle d'accès basé sur BLE ?"

Agent : -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "Système de contrôle d'accès BLE — 4 risques critiques identifiés :
          1. Appairage JustWorks — pas de protection MITM. L'attaquant peut
             intercepter l'appairage avec Ubertooth One (MITRE T1040).
          2. Sniffing des caractéristiques GATT — commandes de déverrouillage
             envoyées en clair, rejouables avec gatttool (MITRE T1212).
          3. Attaque relay/replay BLE — relayer le signal de déverrouillage
             légitime avec deux appareils + btlejack (MITRE T1557).
          4. Traçage d'adresse MAC — MAC BLE statique permet le
             suivi des occupants (MITRE T1592.002).
          Recommandé : imposer LE Secure Connections (LESC) avec
          comparaison numérique, chiffrer les caractéristiques GATT,
          implémenter des nonces rotatifs pour la protection contre le replay."
```

### Audit Sans Fil IoT

```
Vous : "Évaluez la sécurité sans fil de notre déploiement IoT de bâtiment intelligent"

Agent : -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "Évaluation sans fil IoT du bâtiment intelligent — 5 découvertes :
          1. Zigbee : Clé de lien du centre de confiance par défaut
             (ZigBeeAlliance09) permet l'interception de jonction réseau
             avec KillerBee (CRITIQUE)
          2. MQTT : Broker sur le port 1883 sans TLS — identifiants et
             données des capteurs transmis en clair
          3. Z-Wave : Sécurité S0 avec vulnérabilité d'échange de clés
             connue — mise à niveau S2 recommandée
          4. MouseJack : 3 récepteurs Logitech Unifying vulnérables à
             l'injection de frappes (CVE-2016-10761)
          5. WiFi : Appareils IoT sur le même VLAN que le réseau
             d'entreprise — pas de segmentation réseau
          Remédiation prioritaire : MQTT TLS, codes d'installation Zigbee,
          isolation VLAN IoT, remplacer les récepteurs Logitech vulnérables."
```

### Audit de Conformité

```
Vous : "Vérifiez notre WiFi hospitalier contre les exigences sans fil HIPAA"

Agent : -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "Audit de Conformité Sans Fil HIPAA — 6 découvertes :
          3 contrôles NON CONFORMES :
          - 164.312(a)(1) : Pas d'IDS sans fil déployé pour la détection d'AP rogue
          - 164.312(e)(1) : Appareils médicaux utilisant WPA2-PSK (pas Enterprise)
          - 164.312(e)(2) : Pas de journalisation d'audit du chiffrement du trafic sans fil
          3 contrôles CONFORMES :
          - 164.310(a)(1) : Emplacements physiques des AP documentés
          - 164.312(a)(2) : 802.1X avec authentification RADIUS
          - 164.312(d) : EAP-TLS basé sur certificat pour les appareils du personnel
          Plan de remédiation : déployer WIDS (Kismet/AirMagnet), migrer
          les appareils médicaux vers WPA2-Enterprise avec MAB, activer la
          journalisation d'audit sans fil sur le contrôleur WLAN."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; Pas de clé API</b></summary>

| Outil | Description |
|-------|-------------|
| `scan_wifi_networks` | Scanner et analyser les réseaux WiFi &mdash; découvrir les SSID, canaux, types de chiffrement, puissance du signal et erreurs de configuration de sécurité |
| `analyze_wifi_security` | Analyse approfondie de la configuration de sécurité WiFi &mdash; force du chiffrement, méthode d'authentification, faiblesses connues, surface d'attaque |
| `find_wifi_attacks` | Trouver les attaques applicables pour une cible WiFi &mdash; retourne la méthodologie d'attaque, les outils requis, le mapping MITRE ATT&CK, les atténuations |
| `simulate_evil_twin` | Simuler et analyser les scénarios d'attaque evil twin AP &mdash; configuration hostapd-mana, portail captif, méthodologie de capture d'identifiants |
| `analyze_deauth` | Analyser les vecteurs d'attaque de désauthentification &mdash; statut 802.11w PMF, détection deauth, contre-mesures, intégration WIDS |
| `crack_wps` | Analyser les vecteurs d'attaque de cracking WPS &mdash; Pixie Dust, force brute, PIN nul, génération de PIN par défaut, méthodologie Reaver/Bully |
| `analyze_pmkid` | Analyser les vecteurs d'attaque basés sur PMKID &mdash; cracking WPA/WPA2 sans client via hcxdumptool + hashcat mode 22000 |
| `audit_wifi67` | Auditer les fonctionnalités de sécurité spécifiques WiFi 6 (802.11ax) et WiFi 7 (802.11be) &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; Pas de clé API</b></summary>

| Outil | Description |
|-------|-------------|
| `scan_bluetooth` | Scanner et analyser les appareils Bluetooth &mdash; découverte BR/EDR classique et BLE, énumération des services, analyse d'appairage |
| `find_bluetooth_attacks` | Trouver les attaques Bluetooth applicables &mdash; BlueBorne, KNOB, BIAS, relay BLE, MITM, avec outils et atténuations |
| `analyze_ble` | Analyse approfondie de la sécurité BLE &mdash; services GATT, méthodes d'appairage, LE Secure Connections, chiffrement des caractéristiques |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; Pas de clé API</b></summary>

| Outil | Description |
|-------|-------------|
| `analyze_rf_signal` | Analyser la sécurité des signaux RF &mdash; analyse de fréquence, identification de modulation, faisabilité d'attaque replay, recommandations d'outils SDR |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; Pas de clé API</b></summary>

| Outil | Description |
|-------|-------------|
| `analyze_nfc_security` | Analyser la sécurité NFC/RFID &mdash; identification du type de carte, faiblesses du contrôle d'accès, faisabilité de clonage, méthodologie Proxmark3 |

</details>

<details>
<summary><b>Cellulaire/5G (1) &mdash; Pas de clé API</b></summary>

| Outil | Description |
|-------|-------------|
| `analyze_cellular_security` | Analyser la sécurité du réseau cellulaire &mdash; faiblesses des protocoles 2G/3G/4G/5G, détection IMSI catcher, analyse de fausse station de base |

</details>

<details>
<summary><b>IoT Sans Fil (3) &mdash; Pas de clé API</b></summary>

| Outil | Description |
|-------|-------------|
| `analyze_zigbee` | Analyser la sécurité du réseau Zigbee &mdash; politique du centre de confiance, gestion des clés réseau, méthodologie d'attaque KillerBee |
| `scan_iot_wireless` | Scanner les protocoles sans fil IoT &mdash; découverte et analyse de vulnérabilités Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP |
| `find_mousejack` | Analyser les vulnérabilités MouseJack clavier/souris sans fil &mdash; injection de frappes, HID non chiffré, contournements spécifiques au fabricant |

</details>

<details>
<summary><b>Sans Fil Avancé (6) &mdash; Pas de clé API</b></summary>

| Outil | Description |
|-------|-------------|
| `analyze_airgap` | Analyser les techniques d'exfiltration air-gap &mdash; canaux cachés électromagnétiques, acoustiques, thermiques, optiques et contre-mesures |
| `analyze_uwb` | Analyser la sécurité Ultra-Wideband (UWB) &mdash; manipulation de ranging, attaques relay sur clés de voiture et AirTags, fraude de distance |
| `analyze_wifi_csi` | Analyser la sécurité WiFi Channel State Information (CSI) &mdash; détection passive, reconnaissance d'activité, risques d'inférence de frappes |
| `analyze_miracast` | Analyser la sécurité Miracast/WiFi Display &mdash; détournement de session WFD, capture d'écran, accès non autorisé à l'affichage |
| `analyze_wifi_direct` | Analyser la sécurité WiFi Direct (P2P) &mdash; attaques de négociation du propriétaire de groupe, vulnérabilités WPS en P2P, formation de groupe malveillant |
| `analyze_drone_rf` | Analyser la sécurité RF des drones &mdash; détournement du lien de contrôle, spoofing GPS, interception du downlink vidéo, techniques counter-UAS |

</details>

<details>
<summary><b>Infrastructure (4) &mdash; Pas de clé API (KISMET_* optionnel pour WIDS en direct)</b></summary>

| Outil | Description |
|-------|-------------|
| `audit_wlan_controller` | Auditer la configuration du contrôleur WLAN &mdash; paramètres de sécurité Cisco WLC, Aruba, Meraki, politiques AP rogue, gestion RF |
| `analyze_captive_portal` | Analyser la sécurité du portail captif &mdash; techniques de contournement, risques de collecte d'identifiants, isolation réseau, sécurité VLAN invité |
| `detect_mac_randomization` | Analyser la randomisation d'adresse MAC &mdash; différences d'implémentation iOS/Android/Windows, résistance au traçage, contournements de fingerprinting |
| `analyze_hotspot20` | Analyser la sécurité Hotspot 2.0 (Passpoint) &mdash; ANQP, OSU, risques de sélection automatique de réseau, analyse de méthode EAP |

</details>

<details>
<summary><b>Intelligence (4) &mdash; Pas de clé API</b></summary>

| Outil | Description |
|-------|-------------|
| `lookup_wireless_cve` | Rechercher les CVE spécifiques sans fil &mdash; vulnérabilités de chipset WiFi, CVE de pile Bluetooth, exploits de pilote, bugs firmware |
| `lookup_hardware` | Rechercher le matériel de sécurité sans fil &mdash; adaptateurs WiFi, sniffers Bluetooth, appareils SDR, capacités, compatibilité chipset |
| `map_wireless_attck` | Mapper les attaques sans fil sur le framework MITRE ATT&CK &mdash; IDs de technique, catégories de tactique, stratégies de détection |
| `analyze_medical_wireless` | Analyser la sécurité sans fil des appareils médicaux &mdash; pompes à perfusion, stimulateurs cardiaques, moniteurs patients, directives FDA, exigences HIPAA |

</details>

<details>
<summary><b>Détection (2) &mdash; Pas de clé API</b></summary>

| Outil | Description |
|-------|-------------|
| `detect_wireless_attack` | Détecter les attaques sans fil en cours &mdash; inondations deauth, evil twin, KARMA, AP rogue, spoofing BLE, indicateurs de brouillage RF |
| `audit_wireless_compliance` | Auditer le réseau sans fil contre les cadres de conformité &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, contrôles sans fil ISO 27001 |

</details>

<details>
<summary><b>Rapports (1) &mdash; Pas de clé API</b></summary>

| Outil | Description |
|-------|-------------|
| `export_report` | Exporter le rapport d'évaluation de sécurité sans fil &mdash; découvertes, évaluations des risques, statut de conformité, feuille de route de remédiation, résumé exécutif |

</details>

---

### CLI Usage

```bash
# Lister tous les outils disponibles
npx wifi-security-mcp-server --list

# Exécuter n'importe quel outil directement
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

Le serveur est livré avec 9 bases de connaissances intégrées &mdash; pas de clés API, pas de dépendances externes, pas de limites de débit. Chaque requête d'outil est enrichie avec de l'intelligence structurée provenant de ces bases de données.

| Base de Connaissances | Entrées | Ce qu'elle fournit |
|----------------------|---------|-------------------|
| **Attaques WiFi** | 47 attaques | Techniques d'attaque WPA/WPA2/WPA3, variantes evil twin, PMKID, KRACK, FragAttacks, deauth, exploits WPS &mdash; chacune avec outils, atténuations, mapping MITRE ATT&CK |
| **Attaques Bluetooth** | 8 attaques | BlueBorne, KNOB, BIAS, relay BLE, MITM, fuzzing BLE, usurpation Bluetooth &mdash; avec CVE et stratégies de détection |
| **Attaques RF/SDR** | 6 attaques | Attaques replay, brouillage, injection de signal, interception basée sur SDR, contournement de fingerprinting RF, techniques d'analyse spectrale |
| **Attaques NFC/RFID** | 6 attaques | Clonage de carte, attaques relay, cracking MIFARE Classic, skimming NFC, fuzzing RFID, contournement de contrôle d'accès avec Proxmark3 |
| **Attaques Cellulaires** | 6 attaques | Capture IMSI, fausse station de base (Stingray), exploitation SS7, vulnérabilités 5G NAS, attaques downgrade, interception VoLTE |
| **Attaques IoT** | 6 attaques | Sniffing de clé réseau Zigbee, downgrade Z-Wave S0, collecte d'identifiants MQTT, replay LoRaWAN ABP, MouseJack, relay BLE IoT |
| **Base de Données Matérielle** | 12 appareils | Adaptateurs WiFi (Alfa, TP-Link), sniffers Bluetooth (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; chipsets, capacités, support mode moniteur |
| **Base de Données CVE** | 17 CVE | CVE spécifiques sans fil pour chipsets WiFi (Broadcom, Qualcomm, Intel), piles Bluetooth, firmware IoT &mdash; sévérité, versions affectées, disponibilité d'exploit |
| **Cadres de Conformité** | 5 cadres | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; contrôles spécifiques sans fil, listes de contrôle d'audit, analyse d'écarts |

---

## Architecture

```
src/
  index.ts                    # Point d'entrée CLI (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # Configuration du serveur MCP (stdio transport)
    tools.ts                  # Registre des outils — les 34 outils composites assemblés ici
  types/
    index.ts                  # Types partagés (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 bases de connaissances intégrées
    wifi-attacks.ts           # 47 définitions d'attaques WiFi
    bluetooth-attacks.ts      # 8 définitions d'attaques Bluetooth
    rf-attacks.ts             # 6 définitions d'attaques RF/SDR
    nfc-attacks.ts            # 6 définitions d'attaques NFC/RFID
    cellular-attacks.ts       # 6 définitions d'attaques Cellulaire/5G
    iot-attacks.ts            # 6 définitions d'attaques IoT
    hardware.ts               # 12 profils d'appareils matériels
    cve-database.ts           # 17 CVE sans fil
    compliance.ts             # 5 cadres de conformité
  wifi/                       # Outils WiFi Core (8)
  bluetooth/                  # Outils Bluetooth (3)
  rf/                         # Outils RF/SDR (1)
  nfc/                        # Outils NFC/RFID (1)
  cellular/                   # Outils Cellulaire/5G (1)
  iot/                        # Outils IoT Sans Fil (3)
  advanced/                   # Outils Sans Fil Avancé (6)
  infrastructure/             # Outils Infrastructure (4)
  intelligence/               # Outils Intelligence (4)
  detection/                  # Outils Détection (2)
  reporting/                  # Outils Rapports (1)
```

**Décisions de conception :**

- **Piloté par les bases de connaissances** &mdash; Contrairement aux outils dépendants d'API, les fonctionnalités de base fonctionnent entièrement hors ligne à partir de 9 bases de données intégrées. Pas de clés API, pas de limites de débit, pas de dépendances externes pour le flux de travail principal.
- **34 outils composites, 139 capacités individuelles** &mdash; Chaque outil est un composite qui regroupe des analyses connexes. `find_wifi_attacks` ne liste pas seulement les attaques &mdash; il retourne la méthodologie, le matériel requis, le mapping MITRE ATT&CK, les stratégies de détection et les contre-mesures.
- **2 dépendances d'exécution** &mdash; `@modelcontextprotocol/sdk` et `zod`. Rien d'autre. Pas de modules natifs, pas de dépendances binaires, pas de code spécifique à la plateforme.
- **Intégration en direct optionnelle** &mdash; API WiGLE pour les données réseau du monde réel, Kismet pour l'IDS sans fil en direct. L'analyse de base fonctionne sans l'un ni l'autre.
- **Conscient de la conformité** &mdash; Chaque découverte est automatiquement mappée aux cadres de conformité pertinents (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) le cas échéant.
- **Mappé MITRE ATT&CK** &mdash; Les techniques d'attaque incluent les IDs de technique ATT&CK, les catégories de tactique et les sources de données de détection pour l'intégration SOC.

---

## Limitations

- Les bases de connaissances sont des instantanés ponctuels &mdash; les nouvelles attaques/CVE nécessitent des mises à jour du paquet
- L'intégration WiGLE nécessite une clé API gratuite pour les recherches de réseau
- Le WIDS en direct Kismet nécessite une instance Kismet en cours d'exécution avec accès API
- Pas de transmission sans fil active &mdash; le serveur fournit de l'intelligence et de la méthodologie, pas de l'injection de paquets
- La base de données matérielle couvre les appareils de recherche en sécurité les plus courants, pas exhaustive
- Les cadres de conformité se concentrent sur les contrôles spécifiques sans fil, pas sur la couverture complète du cadre
- macOS / Linux testé (Windows non testé)

---

## Part of the MCP Security Suite

| Projet | Domaine | Outils |
|--------|---------|--------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Tests de sécurité basés sur navigateur | 39 outils, Firefox, tests d'injection |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Sécurité cloud (AWS/Azure/GCP) | 38 outils, 60+ vérifications |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | Posture de sécurité GitHub | 39 outils, 45 vérifications |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Intelligence de vulnérabilités | 23 outils, 5 sources |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT et reconnaissance | 37 outils, 12 sources |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark web et intelligence de menaces | 66 outils, 16 sources |
| **wifi-security-mcp-server** | **Intelligence de sécurité sans fil** | **34 outils, 9 bases de connaissances** |

---

<p align="center">
<b>Uniquement pour les tests et évaluations de sécurité autorisés.</b><br>
Assurez-vous toujours d'avoir l'autorisation appropriée avant d'effectuer des tests de sécurité sans fil sur tout réseau ou appareil.<br>
L'accès non autorisé aux réseaux sans fil ou les interférences sont illégaux dans la plupart des juridictions.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

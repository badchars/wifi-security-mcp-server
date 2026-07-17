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
  <a href="README.el.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <strong>हिन्दी</strong>
</p>

<p align="center">
  <br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-light.svg">
    <img alt="wifi-security-mcp-server" src="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-dark.svg" width="700">
  </picture>
</p>

<h3 align="center">AI एजेंटों के लिए वायरलेस सुरक्षा इंटेलिजेंस।</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, सेलुलर/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, ड्रोन RF, WIDS/WIPS, अनुपालन &mdash; एक ही MCP सर्वर में एकीकृत।<br>
  आपका AI एजेंट प्राप्त करता है <b>मांग पर पूर्ण-स्पेक्ट्रम वायरलेस सुरक्षा विश्लेषण</b>, 139 व्यक्तिगत टूल को कवर करने वाले 9 बिल्ट-इन नॉलेज बेस द्वारा संचालित।
</p>

<br>

<p align="center">
  <a href="#the-problem">समस्या</a> &bull;
  <a href="#how-its-different">कैसे अलग है</a> &bull;
  <a href="#quick-start">त्वरित शुरुआत</a> &bull;
  <a href="#what-the-ai-can-do">AI क्या कर सकता है</a> &bull;
  <a href="#tools-reference-34-composite-tools">टूल्स (34)</a> &bull;
  <a href="#knowledge-bases-9">नॉलेज बेस</a> &bull;
  <a href="#architecture">आर्किटेक्चर</a> &bull;
  <a href="CHANGELOG.md">चेंजलॉग</a> &bull;
  <a href="CONTRIBUTING.md">योगदान</a>
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

वायरलेस सुरक्षा मूल्यांकन आक्रामक सुरक्षा में सबसे खंडित विषयों में से एक है। WiFi ऑडिटिंग के लिए एक टूल सेट चाहिए, Bluetooth के लिए दूसरा, RF/SDR के लिए तीसरा, IoT प्रोटोकॉल के लिए एक और &mdash; और प्रत्येक डोमेन की अपनी अटैक सरफेस, अपनी कमजोरियां, अपनी अनुपालन आवश्यकताएं हैं। आज आप WPA के लिए aircrack-ng चलाते हैं, BLE के लिए Bettercap का उपयोग करते हैं, SDR के लिए HackRF शुरू करते हैं, प्रत्येक चिपसेट के लिए अलग-अलग CVE डेटाबेस देखते हैं, NIST और PCI-DSS को अलग-अलग संदर्भित करते हैं, और फिर घंटों मैन्युअल रूप से निष्कर्षों को एक सुसंगत मूल्यांकन में सहसंबंधित करते हैं।

```
पारंपरिक वायरलेस सुरक्षा वर्कफ़्लो:
  WiFi नेटवर्क ऑडिट               ->  aircrack-ng / Wireshark / Kismet
  Bluetooth सुरक्षा परीक्षण        ->  Bettercap / btlejack / Ubertooth
  RF सिग्नल विश्लेषण               ->  HackRF / GNU Radio / GQRX
  NFC/RFID जांच                    ->  Proxmark3 / libnfc
  सेलुलर सुरक्षा मूल्यांकन         ->  srsRAN / OpenBTS
  IoT प्रोटोकॉल परीक्षण            ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  वायरलेस CVE खोज                  ->  NVD / vendor advisories (मैन्युअल खोज)
  अनुपालन जांच                     ->  NIST / PCI-DSS / HIPAA docs (मैन्युअल)
  MITRE ATT&CK पर मैप करना          ->  ATT&CK Navigator (मैन्युअल मैपिंग)
  सब कुछ सहसंबंधित करना            ->  रिपोर्ट में कॉपी-पेस्ट
  ────────────────────────────────
  कुल: प्रति मूल्यांकन घंटे, अधिकांश टूल के बीच कॉन्टेक्स्ट-स्विचिंग में
```

**wifi-security-mcp-server** आपके AI एजेंट को [Model Context Protocol](https://modelcontextprotocol.io) के माध्यम से 9 नॉलेज बेस द्वारा समर्थित 34 कंपोजिट टूल देता है जो 139 व्यक्तिगत क्षमताओं को कवर करते हैं। एजेंट नेटवर्क का विश्लेषण करता है, कमजोरियों की पहचान करता है, हमलों को MITRE ATT&CK पर मैप करता है, अनुपालन की जांच करता है, और कार्रवाई योग्य रिपोर्ट तैयार करता है &mdash; एक ही बातचीत में।

```
wifi-security-mcp-server के साथ:
  आप: "हमारे WPA2-Enterprise चलाने वाले ऑफिस नेटवर्क की वायरलेस सुरक्षा ऑडिट करें"

  एजेंट: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "आपके WPA2-Enterprise नेटवर्क में 3 गंभीर निष्कर्ष हैं:
            1. सर्टिफिकेट पिनिंग के बिना EAP-PEAP — hostapd-mana
               के साथ evil twin के लिए कमजोर (MITRE T1557.002)
            2. कोई 802.11w (PMF) नहीं — deauthentication हमलों के
               प्रति संवेदनशील (MITRE T1498.001)
            3. क्लाइंट इंटरैक्शन के बिना PMKID हैश निकाला जा सकता है —
               hashcat mode 22000 से ऑफ़लाइन क्रैकिंग संभव
            PCI-DSS 4.0: 2 नियंत्रण गैर-अनुपालक (4.2.1, 11.2.1)।
            अनुशंसित: SAE के साथ WPA3-Enterprise में माइग्रेट करें, PMF
            सक्षम करें, रोग AP डिटेक्शन के लिए WIDS तैनात करें।"
```

---

## How It's Different

मौजूदा टूल आपको कच्चे पैकेट कैप्चर और प्रोटोकॉल-विशिष्ट विश्लेषण देते हैं। wifi-security-mcp-server आपके AI एजेंट को गहरे नॉलेज-बेस समर्थन के साथ **सभी वायरलेस डोमेन में एक साथ तर्क करने** की क्षमता देता है।

<table>
<thead>
<tr>
<th></th>
<th>पारंपरिक दृष्टिकोण</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>इंटरफ़ेस</b></td>
<td>10+ विभिन्न CLI, GUI, और हार्डवेयर टूल</td>
<td>MCP &mdash; AI एजेंट बातचीत में टूल कॉल करता है</td>
</tr>
<tr>
<td><b>कवरेज</b></td>
<td>एक बार में एक प्रोटोकॉल</td>
<td>WiFi, Bluetooth, RF, NFC, सेलुलर, IoT &mdash; सब एक सर्वर में</td>
</tr>
<tr>
<td><b>ज्ञान</b></td>
<td>मैन्युअल CVE खोज, मैन्युअल ATT&CK मैपिंग</td>
<td>139 प्री-मैप्ड आइटम के साथ 9 बिल्ट-इन नॉलेज बेस</td>
</tr>
<tr>
<td><b>अटैक इंटेलिजेंस</b></td>
<td>Google सर्च + ब्लॉग पोस्ट + कॉन्फ्रेंस टॉक</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 सेलुलर + 6 IoT हमले टूल, शमन, ATT&CK ID के साथ सूचीबद्ध</td>
</tr>
<tr>
<td><b>अनुपालन</b></td>
<td>NIST/PCI-DSS/HIPAA PDF पढ़ना, मैन्युअल रूप से नियंत्रण मैप करना</td>
<td>एजेंट स्वचालित रूप से 5 अनुपालन फ्रेमवर्क के विरुद्ध जांच करता है</td>
</tr>
<tr>
<td><b>API कुंजियां</b></td>
<td>विभिन्न सेवाओं के लिए विभिन्न खाते</td>
<td>मुख्य कार्यक्षमता के लिए शून्य API कुंजियां &mdash; नॉलेज-बेस संचालित</td>
</tr>
<tr>
<td><b>सेटअप</b></td>
<td>aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark इंस्टॉल करें...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; एक कमांड, शून्य कॉन्फ़िग</td>
</tr>
</tbody>
</table>

---

## Quick Start

### विकल्प 1: npx (इंस्टॉल नहीं)

```bash
npx wifi-security-mcp-server
```

सभी 34 टूल तुरंत काम करते हैं। कोई API कुंजी आवश्यक नहीं &mdash; मुख्य कार्यक्षमता नॉलेज-बेस संचालित है।

### विकल्प 2: क्लोन

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### एनवायरनमेंट वेरिएबल (वैकल्पिक)

```bash
# WiGLE — वास्तविक WiFi नेटवर्क लुकअप के लिए wardriving डेटाबेस
export WIGLE_API_KEY=your-key

# Kismet — लाइव वायरलेस इंट्रूज़न डिटेक्शन
export KISMET_HOST=127.0.0.1      # डिफ़ॉल्ट: 127.0.0.1
export KISMET_PORT=2501           # डिफ़ॉल्ट: 2501
export KISMET_API_KEY=your-key
```

सभी API कुंजियां वैकल्पिक हैं। इनके बिना भी, आपको WiFi हमले, Bluetooth हमले, RF/SDR, NFC/RFID, सेलुलर, IoT, हार्डवेयर डेटाबेस, CVE इंटेलिजेंस, और अनुपालन फ्रेमवर्क को कवर करने वाले 9 बिल्ट-इन नॉलेज बेस द्वारा संचालित सभी 34 टूल तक पूर्ण पहुंच मिलती है।

### अपने AI एजेंट से कनेक्ट करें

<details open>
<summary><b>Claude Code</b></summary>

```bash
# npx के साथ
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# लोकल क्लोन के साथ
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

`~/Library/Application Support/Claude/claude_desktop_config.json` में जोड़ें:

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
<summary><b>Cursor / Windsurf / अन्य MCP क्लाइंट</b></summary>

समान JSON कॉन्फ़िग प्रारूप। कमांड को `npx wifi-security-mcp-server` या अपने लोकल इंस्टॉलेशन पथ की ओर इंगित करें।

</details>

### क्वेरी शुरू करें

```
आप: "WPA3-SAE नेटवर्क के खिलाफ कौन से हमले संभव हैं और मैं उन्हें कैसे टेस्ट करूं?"
```

बस इतना ही। एजेंट हमले खोजता है, उन्हें MITRE ATT&CK पर मैप करता है, टूल की सिफारिश करता है, और चरण-दर-चरण कार्यप्रणाली प्रदान करता है &mdash; सब बिल्ट-इन नॉलेज बेस से।

---

## What The AI Can Do

### WiFi सुरक्षा मूल्यांकन

```
आप: "WPS सक्षम WPA2-PSK नेटवर्क की सुरक्षा का विश्लेषण करें"

एजेंट: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "WPA2-PSK + WPS कॉन्फ़िगरेशन में गंभीर कमजोरियां पाई गईं:
          1. WPS Pixie Dust अटैक — E-S1/E-S2 nonces के ऑफ़लाइन
             ब्रूट-फोर्स से सेकंडों में PIN प्राप्त किया जा सकता है
             (Reaver + PixieWPS)। क्लाइंट इंटरैक्शन के बिना पूर्ण
             PSK रिकवरी।
          2. PMKID अटैक — 4-way handshake का पहला पैकेट PMKID
             हैश रखता है, hashcat -m 22000 से ऑफ़लाइन क्रैक किया
             जा सकता है। कोई deauth नहीं, कोई क्लाइंट नहीं।
          3. 4-Way Handshake कैप्चर — EAPOL फ्रेम
             airodump-ng + deauth से कैप्चर किए जा सकते हैं, फिर
             ऑफ़लाइन डिक्शनरी अटैक।
          प्राथमिकता: तुरंत WPS अक्षम करें (सबसे अधिक जोखिम),
          20+ अक्षरों का मजबूत PSK लागू करें, WPA3-SAE में
          माइग्रेशन पर विचार करें।"
```

### Bluetooth & BLE विश्लेषण

```
आप: "हमारे BLE-आधारित एक्सेस कंट्रोल सिस्टम के सुरक्षा जोखिम क्या हैं?"

एजेंट: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "BLE एक्सेस कंट्रोल सिस्टम — 4 गंभीर जोखिम पहचाने गए:
          1. JustWorks पेयरिंग — कोई MITM सुरक्षा नहीं। हमलावर
             Ubertooth One से पेयरिंग इंटरसेप्ट कर सकता है (MITRE T1040)।
          2. GATT Characteristic स्निफ़िंग — अनलॉक कमांड प्लेनटेक्स्ट
             में भेजे जाते हैं, gatttool से रीप्ले किए जा सकते हैं (MITRE T1212)।
          3. BLE रिले/रीप्ले अटैक — दो डिवाइस + btlejack का उपयोग
             करके वैध अनलॉक सिग्नल रिले करना (MITRE T1557)।
          4. MAC एड्रेस ट्रैकिंग — स्टैटिक BLE MAC उपयोगकर्ता
             ट्रैकिंग सक्षम करता है (MITRE T1592.002)।
          अनुशंसित: न्यूमेरिक कम्पेरिज़न के साथ LE Secure Connections
          (LESC) लागू करें, GATT characteristics एन्क्रिप्ट करें, रीप्ले
          सुरक्षा के लिए रोलिंग nonces लागू करें।"
```

### IoT वायरलेस ऑडिट

```
आप: "हमारे स्मार्ट बिल्डिंग IoT डिप्लॉयमेंट की वायरलेस सुरक्षा का मूल्यांकन करें"

एजेंट: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "स्मार्ट बिल्डिंग IoT वायरलेस मूल्यांकन — 5 निष्कर्ष:
          1. Zigbee: डिफ़ॉल्ट ट्रस्ट सेंटर लिंक की (ZigBeeAlliance09)
             KillerBee से नेटवर्क जॉइन इंटरसेप्शन की अनुमति देती है (गंभीर)
          2. MQTT: TLS के बिना पोर्ट 1883 पर ब्रोकर — क्रेडेंशियल
             और सेंसर डेटा प्लेनटेक्स्ट में प्रसारित
          3. Z-Wave: ज्ञात की एक्सचेंज कमजोरी के साथ S0 सुरक्षा
             — S2 अपग्रेड अनुशंसित
          4. MouseJack: 3 Logitech Unifying रिसीवर कीस्ट्रोक
             इंजेक्शन के लिए कमजोर (CVE-2016-10761)
          5. WiFi: IoT डिवाइस कॉर्पोरेट के समान VLAN पर —
             कोई नेटवर्क सेगमेंटेशन नहीं
          प्राथमिकता उपचार: MQTT TLS, Zigbee इंस्टॉल कोड,
          IoT VLAN आइसोलेशन, कमजोर Logitech रिसीवर बदलें।"
```

### अनुपालन ऑडिट

```
आप: "हमारे अस्पताल के WiFi को HIPAA वायरलेस आवश्यकताओं के विरुद्ध जांचें"

एजेंट: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "HIPAA वायरलेस अनुपालन ऑडिट — 6 निष्कर्ष:
          3 गैर-अनुपालक नियंत्रण:
          - 164.312(a)(1): रोग AP डिटेक्शन के लिए कोई वायरलेस IDS तैनात नहीं
          - 164.312(e)(1): मेडिकल डिवाइस WPA2-PSK (Enterprise नहीं) उपयोग करते हैं
          - 164.312(e)(2): कोई वायरलेस ट्रैफिक एन्क्रिप्शन ऑडिट लॉगिंग नहीं
          3 अनुपालक नियंत्रण:
          - 164.310(a)(1): भौतिक AP स्थान प्रलेखित
          - 164.312(a)(2): RADIUS प्रमाणीकरण के साथ 802.1X
          - 164.312(d): स्टाफ डिवाइस के लिए सर्टिफिकेट-आधारित EAP-TLS
          उपचार योजना: WIDS तैनात करें (Kismet/AirMagnet), मेडिकल
          डिवाइस को MAB के साथ WPA2-Enterprise में माइग्रेट करें, WLAN
          कंट्रोलर पर वायरलेस ऑडिट लॉगिंग सक्षम करें।"
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; कोई API कुंजी नहीं</b></summary>

| टूल | विवरण |
|------|-------------|
| `scan_wifi_networks` | WiFi नेटवर्क स्कैन और विश्लेषण &mdash; SSID, चैनल, एन्क्रिप्शन प्रकार, सिग्नल शक्ति, और सुरक्षा गलत कॉन्फ़िगरेशन की खोज |
| `analyze_wifi_security` | WiFi सुरक्षा कॉन्फ़िगरेशन का गहन विश्लेषण &mdash; एन्क्रिप्शन शक्ति, प्रमाणीकरण विधि, ज्ञात कमजोरियां, अटैक सरफेस |
| `find_wifi_attacks` | WiFi लक्ष्य के लिए लागू हमले खोजना &mdash; हमले की कार्यप्रणाली, आवश्यक टूल, MITRE ATT&CK मैपिंग, शमन लौटाता है |
| `simulate_evil_twin` | Evil twin AP अटैक परिदृश्य सिमुलेट और विश्लेषण &mdash; hostapd-mana कॉन्फ़िगरेशन, कैप्टिव पोर्टल, क्रेडेंशियल कैप्चर कार्यप्रणाली |
| `analyze_deauth` | Deauthentication अटैक वेक्टर विश्लेषण &mdash; 802.11w PMF स्थिति, deauth डिटेक्शन, प्रतिउपाय, WIDS इंटीग्रेशन |
| `crack_wps` | WPS क्रैकिंग अटैक वेक्टर विश्लेषण &mdash; Pixie Dust, ब्रूट फोर्स, null PIN, डिफ़ॉल्ट PIN जनरेशन, Reaver/Bully कार्यप्रणाली |
| `analyze_pmkid` | PMKID-आधारित अटैक वेक्टर विश्लेषण &mdash; hcxdumptool + hashcat mode 22000 के माध्यम से क्लाइंटलेस WPA/WPA2 क्रैकिंग |
| `audit_wifi67` | WiFi 6 (802.11ax) और WiFi 7 (802.11be) विशिष्ट सुरक्षा सुविधाओं का ऑडिट &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; कोई API कुंजी नहीं</b></summary>

| टूल | विवरण |
|------|-------------|
| `scan_bluetooth` | Bluetooth डिवाइस स्कैन और विश्लेषण &mdash; BR/EDR क्लासिक और BLE डिस्कवरी, सर्विस एन्यूमरेशन, पेयरिंग विश्लेषण |
| `find_bluetooth_attacks` | लागू Bluetooth हमले खोजना &mdash; BlueBorne, KNOB, BIAS, BLE रिले, MITM, टूल और शमन के साथ |
| `analyze_ble` | BLE सुरक्षा का गहन विश्लेषण &mdash; GATT सर्विसेज, पेयरिंग विधियां, LE Secure Connections, characteristic एन्क्रिप्शन |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; कोई API कुंजी नहीं</b></summary>

| टूल | विवरण |
|------|-------------|
| `analyze_rf_signal` | RF सिग्नल सुरक्षा विश्लेषण &mdash; फ्रीक्वेंसी विश्लेषण, मॉड्यूलेशन पहचान, रीप्ले अटैक व्यवहार्यता, SDR टूल सिफारिशें |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; कोई API कुंजी नहीं</b></summary>

| टूल | विवरण |
|------|-------------|
| `analyze_nfc_security` | NFC/RFID सुरक्षा विश्लेषण &mdash; कार्ड प्रकार पहचान, एक्सेस कंट्रोल कमजोरियां, क्लोनिंग व्यवहार्यता, Proxmark3 कार्यप्रणाली |

</details>

<details>
<summary><b>सेलुलर/5G (1) &mdash; कोई API कुंजी नहीं</b></summary>

| टूल | विवरण |
|------|-------------|
| `analyze_cellular_security` | सेलुलर नेटवर्क सुरक्षा विश्लेषण &mdash; 2G/3G/4G/5G प्रोटोकॉल कमजोरियां, IMSI कैचर डिटेक्शन, फेक बेस स्टेशन विश्लेषण |

</details>

<details>
<summary><b>IoT वायरलेस (3) &mdash; कोई API कुंजी नहीं</b></summary>

| टूल | विवरण |
|------|-------------|
| `analyze_zigbee` | Zigbee नेटवर्क सुरक्षा विश्लेषण &mdash; ट्रस्ट सेंटर पॉलिसी, नेटवर्क की मैनेजमेंट, KillerBee अटैक कार्यप्रणाली |
| `scan_iot_wireless` | IoT वायरलेस प्रोटोकॉल स्कैन &mdash; Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP डिस्कवरी और कमजोरी विश्लेषण |
| `find_mousejack` | MouseJack वायरलेस कीबोर्ड/माउस कमजोरियों का विश्लेषण &mdash; कीस्ट्रोक इंजेक्शन, अनएन्क्रिप्टेड HID, वेंडर-विशिष्ट बाइपास |

</details>

<details>
<summary><b>उन्नत वायरलेस (6) &mdash; कोई API कुंजी नहीं</b></summary>

| टूल | विवरण |
|------|-------------|
| `analyze_airgap` | Air-gap एक्सफिल्ट्रेशन तकनीकों का विश्लेषण &mdash; इलेक्ट्रोमैग्नेटिक, ध्वनिक, थर्मल, ऑप्टिकल गुप्त चैनल और प्रतिउपाय |
| `analyze_uwb` | Ultra-Wideband (UWB) सुरक्षा विश्लेषण &mdash; रेंजिंग हेरफेर, कार की फॉब और AirTags पर रिले अटैक, दूरी धोखाधड़ी |
| `analyze_wifi_csi` | WiFi Channel State Information (CSI) सुरक्षा विश्लेषण &mdash; पैसिव सेंसिंग, एक्टिविटी रिकग्निशन, कीस्ट्रोक इन्फरेंस जोखिम |
| `analyze_miracast` | Miracast/WiFi Display सुरक्षा विश्लेषण &mdash; WFD सेशन हाइजैकिंग, स्क्रीन कैप्चर, अनधिकृत डिस्प्ले एक्सेस |
| `analyze_wifi_direct` | WiFi Direct (P2P) सुरक्षा विश्लेषण &mdash; ग्रुप ओनर नेगोशिएशन अटैक, P2P में WPS कमजोरियां, रोग ग्रुप गठन |
| `analyze_drone_rf` | ड्रोन RF सुरक्षा विश्लेषण &mdash; कंट्रोल लिंक हाइजैकिंग, GPS स्पूफिंग, वीडियो डाउनलिंक इंटरसेप्शन, काउंटर-UAS तकनीकें |

</details>

<details>
<summary><b>इन्फ्रास्ट्रक्चर (4) &mdash; कोई API कुंजी नहीं (लाइव WIDS के लिए KISMET_* वैकल्पिक)</b></summary>

| टूल | विवरण |
|------|-------------|
| `audit_wlan_controller` | WLAN कंट्रोलर कॉन्फ़िगरेशन ऑडिट &mdash; Cisco WLC, Aruba, Meraki सुरक्षा सेटिंग्स, रोग AP पॉलिसी, RF मैनेजमेंट |
| `analyze_captive_portal` | कैप्टिव पोर्टल सुरक्षा विश्लेषण &mdash; बाइपास तकनीकें, क्रेडेंशियल हार्वेस्टिंग जोखिम, नेटवर्क आइसोलेशन, गेस्ट VLAN सुरक्षा |
| `detect_mac_randomization` | MAC एड्रेस रैंडमाइजेशन विश्लेषण &mdash; iOS/Android/Windows कार्यान्वयन अंतर, ट्रैकिंग प्रतिरोध, फिंगरप्रिंटिंग बाइपास |
| `analyze_hotspot20` | Hotspot 2.0 (Passpoint) सुरक्षा विश्लेषण &mdash; ANQP, OSU, स्वचालित नेटवर्क चयन जोखिम, EAP मेथड विश्लेषण |

</details>

<details>
<summary><b>इंटेलिजेंस (4) &mdash; कोई API कुंजी नहीं</b></summary>

| टूल | विवरण |
|------|-------------|
| `lookup_wireless_cve` | वायरलेस-विशिष्ट CVE खोज &mdash; WiFi चिपसेट कमजोरियां, Bluetooth स्टैक CVE, ड्राइवर एक्सप्लॉइट, फर्मवेयर बग |
| `lookup_hardware` | वायरलेस सुरक्षा हार्डवेयर खोज &mdash; WiFi एडेप्टर, Bluetooth स्निफर, SDR डिवाइस, क्षमताएं, चिपसेट संगतता |
| `map_wireless_attck` | वायरलेस हमलों को MITRE ATT&CK फ्रेमवर्क पर मैप करना &mdash; तकनीक ID, रणनीति श्रेणियां, डिटेक्शन रणनीतियां |
| `analyze_medical_wireless` | मेडिकल डिवाइस वायरलेस सुरक्षा विश्लेषण &mdash; इन्फ्यूजन पंप, पेसमेकर, पेशेंट मॉनिटर, FDA मार्गदर्शन, HIPAA आवश्यकताएं |

</details>

<details>
<summary><b>डिटेक्शन (2) &mdash; कोई API कुंजी नहीं</b></summary>

| टूल | विवरण |
|------|-------------|
| `detect_wireless_attack` | जारी वायरलेस हमलों का पता लगाना &mdash; deauth फ्लड, evil twin, KARMA, रोग AP, BLE स्पूफिंग, RF जैमिंग संकेतक |
| `audit_wireless_compliance` | अनुपालन फ्रेमवर्क के विरुद्ध वायरलेस नेटवर्क ऑडिट &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, ISO 27001 वायरलेस नियंत्रण |

</details>

<details>
<summary><b>रिपोर्टिंग (1) &mdash; कोई API कुंजी नहीं</b></summary>

| टूल | विवरण |
|------|-------------|
| `export_report` | वायरलेस सुरक्षा मूल्यांकन रिपोर्ट निर्यात &mdash; निष्कर्ष, जोखिम रेटिंग, अनुपालन स्थिति, उपचार रोडमैप, कार्यकारी सारांश |

</details>

---

### CLI Usage

```bash
# सभी उपलब्ध टूल सूचीबद्ध करें
npx wifi-security-mcp-server --list

# कोई भी टूल सीधे चलाएं
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

सर्वर 9 बिल्ट-इन नॉलेज बेस के साथ आता है &mdash; कोई API कुंजी नहीं, कोई बाहरी निर्भरता नहीं, कोई दर सीमा नहीं। प्रत्येक टूल क्वेरी इन डेटाबेस से संरचित इंटेलिजेंस से समृद्ध होती है।

| नॉलेज बेस | प्रविष्टियां | यह क्या प्रदान करता है |
|----------------|---------|-----------------|
| **WiFi हमले** | 47 हमले | WPA/WPA2/WPA3 अटैक तकनीकें, evil twin वेरिएंट, PMKID, KRACK, FragAttacks, deauth, WPS एक्सप्लॉइट &mdash; प्रत्येक टूल, शमन, MITRE ATT&CK मैपिंग के साथ |
| **Bluetooth हमले** | 8 हमले | BlueBorne, KNOB, BIAS, BLE रिले, MITM, BLE फज़िंग, Bluetooth इम्पर्सोनेशन &mdash; CVE और डिटेक्शन रणनीतियों के साथ |
| **RF/SDR हमले** | 6 हमले | रीप्ले अटैक, जैमिंग, सिग्नल इंजेक्शन, SDR-आधारित इंटरसेप्शन, RF फिंगरप्रिंटिंग बाइपास, स्पेक्ट्रम विश्लेषण तकनीकें |
| **NFC/RFID हमले** | 6 हमले | कार्ड क्लोनिंग, रिले अटैक, MIFARE Classic क्रैकिंग, NFC स्किमिंग, RFID फज़िंग, Proxmark3 से एक्सेस कंट्रोल बाइपास |
| **सेलुलर हमले** | 6 हमले | IMSI कैचिंग, फेक बेस स्टेशन (Stingray), SS7 एक्सप्लॉइटेशन, 5G NAS कमजोरियां, डाउनग्रेड अटैक, VoLTE इंटरसेप्शन |
| **IoT हमले** | 6 हमले | Zigbee नेटवर्क की स्निफिंग, Z-Wave S0 डाउनग्रेड, MQTT क्रेडेंशियल हार्वेस्टिंग, LoRaWAN ABP रीप्ले, MouseJack, BLE IoT रिले |
| **हार्डवेयर डेटाबेस** | 12 डिवाइस | WiFi एडेप्टर (Alfa, TP-Link), Bluetooth स्निफर (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; चिपसेट, क्षमताएं, मॉनिटर मोड सपोर्ट |
| **CVE डेटाबेस** | 17 CVE | WiFi चिपसेट (Broadcom, Qualcomm, Intel), Bluetooth स्टैक, IoT फर्मवेयर के लिए वायरलेस-विशिष्ट CVE &mdash; गंभीरता, प्रभावित संस्करण, एक्सप्लॉइट उपलब्धता |
| **अनुपालन फ्रेमवर्क** | 5 फ्रेमवर्क | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; वायरलेस-विशिष्ट नियंत्रण, ऑडिट चेकलिस्ट, गैप विश्लेषण |

---

## Architecture

```
src/
  index.ts                    # CLI एंट्री पॉइंट (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # MCP सर्वर सेटअप (stdio ट्रांसपोर्ट)
    tools.ts                  # टूल रजिस्ट्री — सभी 34 कंपोजिट टूल यहां संयोजित
  types/
    index.ts                  # शेयर्ड टाइप (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 बिल्ट-इन नॉलेज बेस
    wifi-attacks.ts           # 47 WiFi अटैक डेफिनिशन
    bluetooth-attacks.ts      # 8 Bluetooth अटैक डेफिनिशन
    rf-attacks.ts             # 6 RF/SDR अटैक डेफिनिशन
    nfc-attacks.ts            # 6 NFC/RFID अटैक डेफिनिशन
    cellular-attacks.ts       # 6 सेलुलर/5G अटैक डेफिनिशन
    iot-attacks.ts            # 6 IoT अटैक डेफिनिशन
    hardware.ts               # 12 हार्डवेयर डिवाइस प्रोफाइल
    cve-database.ts           # 17 वायरलेस CVE
    compliance.ts             # 5 अनुपालन फ्रेमवर्क
  wifi/                       # WiFi Core टूल्स (8)
  bluetooth/                  # Bluetooth टूल्स (3)
  rf/                         # RF/SDR टूल्स (1)
  nfc/                        # NFC/RFID टूल्स (1)
  cellular/                   # सेलुलर/5G टूल्स (1)
  iot/                        # IoT वायरलेस टूल्स (3)
  advanced/                   # उन्नत वायरलेस टूल्स (6)
  infrastructure/             # इन्फ्रास्ट्रक्चर टूल्स (4)
  intelligence/               # इंटेलिजेंस टूल्स (4)
  detection/                  # डिटेक्शन टूल्स (2)
  reporting/                  # रिपोर्टिंग टूल्स (1)
```

**डिज़ाइन निर्णय:**

- **नॉलेज-बेस संचालित** &mdash; API-निर्भर टूल के विपरीत, मुख्य कार्यक्षमता 9 बिल्ट-इन डेटाबेस से पूरी तरह ऑफ़लाइन चलती है। कोई API कुंजी नहीं, कोई दर सीमा नहीं, प्राथमिक वर्कफ़्लो के लिए कोई बाहरी निर्भरता नहीं।
- **34 कंपोजिट टूल, 139 व्यक्तिगत क्षमताएं** &mdash; प्रत्येक टूल एक कंपोजिट है जो संबंधित विश्लेषणों को बंडल करता है। `find_wifi_attacks` केवल हमलों को सूचीबद्ध नहीं करता &mdash; यह कार्यप्रणाली, आवश्यक हार्डवेयर, MITRE ATT&CK मैपिंग, डिटेक्शन रणनीतियां और प्रतिउपाय लौटाता है।
- **2 रनटाइम निर्भरताएं** &mdash; `@modelcontextprotocol/sdk` और `zod`। और कुछ नहीं। कोई नेटिव मॉड्यूल नहीं, कोई बाइनरी निर्भरता नहीं, कोई प्लेटफॉर्म-विशिष्ट कोड नहीं।
- **वैकल्पिक लाइव इंटीग्रेशन** &mdash; वास्तविक नेटवर्क डेटा के लिए WiGLE API, लाइव वायरलेस IDS के लिए Kismet। मुख्य विश्लेषण बिना किसी के काम करता है।
- **अनुपालन-जागरूक** &mdash; प्रत्येक निष्कर्ष लागू होने पर स्वचालित रूप से प्रासंगिक अनुपालन फ्रेमवर्क (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) पर मैप किया जाता है।
- **MITRE ATT&CK मैप्ड** &mdash; अटैक तकनीकों में SOC इंटीग्रेशन के लिए ATT&CK तकनीक ID, रणनीति श्रेणियां, और डिटेक्शन डेटा स्रोत शामिल हैं।

---

## Limitations

- नॉलेज बेस समय-बिंदु स्नैपशॉट हैं &mdash; नए हमलों/CVE के लिए पैकेज अपडेट आवश्यक हैं
- WiGLE इंटीग्रेशन के लिए नेटवर्क लुकअप हेतु मुफ्त API कुंजी आवश्यक है
- Kismet लाइव WIDS के लिए API एक्सेस के साथ चलता हुआ Kismet इंस्टेंस आवश्यक है
- कोई सक्रिय वायरलेस ट्रांसमिशन नहीं &mdash; सर्वर इंटेलिजेंस और कार्यप्रणाली प्रदान करता है, पैकेट इंजेक्शन नहीं
- हार्डवेयर डेटाबेस सबसे सामान्य सुरक्षा अनुसंधान डिवाइस कवर करता है, संपूर्ण नहीं
- अनुपालन फ्रेमवर्क वायरलेस-विशिष्ट नियंत्रणों पर केंद्रित हैं, पूर्ण फ्रेमवर्क कवरेज नहीं
- macOS / Linux पर परीक्षित (Windows परीक्षित नहीं)

---

## Part of the MCP Security Suite

| प्रोजेक्ट | डोमेन | टूल्स |
|---|---|---|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | ब्राउज़र-आधारित सुरक्षा परीक्षण | 39 टूल, Firefox, इंजेक्शन टेस्टिंग |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | क्लाउड सुरक्षा (AWS/Azure/GCP) | 38 टूल, 60+ जांच |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub सुरक्षा स्थिति | 39 टूल, 45 जांच |
| [cve-mcp](https://github.com/badchars/cve-mcp) | कमजोरी इंटेलिजेंस | 23 टूल, 5 स्रोत |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT और टोही | 37 टूल, 12 स्रोत |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | डार्क वेब और खतरा इंटेलिजेंस | 66 टूल, 16 स्रोत |
| **wifi-security-mcp-server** | **वायरलेस सुरक्षा इंटेलिजेंस** | **34 टूल, 9 नॉलेज बेस** |

---

<p align="center">
<b>केवल अधिकृत सुरक्षा परीक्षण और मूल्यांकन के लिए।</b><br>
किसी भी नेटवर्क या डिवाइस पर वायरलेस सुरक्षा परीक्षण करने से पहले हमेशा सुनिश्चित करें कि आपके पास उचित प्राधिकरण है।<br>
अधिकांश क्षेत्राधिकारों में अनधिकृत वायरलेस नेटवर्क एक्सेस या हस्तक्षेप अवैध है।
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

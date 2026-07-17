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
  <strong>বাংলা</strong> |
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

<h3 align="center">AI এজেন্টদের জন্য ওয়্যারলেস সিকিউরিটি ইন্টেলিজেন্স।</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, সেলুলার/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, ড্রোন RF, WIDS/WIPS, কমপ্লায়েন্স &mdash; একটি একক MCP সার্ভারে একত্রিত।<br>
  আপনার AI এজেন্ট পায় <b>সম্পূর্ণ-বর্ণালী ওয়্যারলেস সিকিউরিটি বিশ্লেষণ চাহিদামতো</b>, ১৩৯টি পৃথক টুল কভার করে ৯টি বিল্ট-ইন নলেজ বেস দ্বারা চালিত।
</p>

<br>

<p align="center">
  <a href="#the-problem">সমস্যা</a> &bull;
  <a href="#how-its-different">কীভাবে আলাদা</a> &bull;
  <a href="#quick-start">দ্রুত শুরু</a> &bull;
  <a href="#what-the-ai-can-do">AI কী করতে পারে</a> &bull;
  <a href="#tools-reference-34-composite-tools">টুলস (৩৪)</a> &bull;
  <a href="#knowledge-bases-9">নলেজ বেস</a> &bull;
  <a href="#architecture">আর্কিটেকচার</a> &bull;
  <a href="CHANGELOG.md">চেঞ্জলগ</a> &bull;
  <a href="CONTRIBUTING.md">কন্ট্রিবিউটিং</a>
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

ওয়্যারলেস সিকিউরিটি মূল্যায়ন অফেন্সিভ সিকিউরিটির সবচেয়ে খণ্ডিত শাখাগুলোর একটি। WiFi অডিটিং-এর জন্য একটি টুল সেট দরকার, Bluetooth-এর জন্য আরেকটি, RF/SDR-এর জন্য তৃতীয়, IoT প্রোটোকলের জন্য আরেকটি &mdash; এবং প্রতিটি ডোমেনের নিজস্ব অ্যাটাক সারফেস, নিজস্ব ভালনারেবিলিটি, নিজস্ব কমপ্লায়েন্স প্রয়োজনীয়তা আছে। আজ আপনি WPA-এর জন্য aircrack-ng চালান, BLE-এর জন্য Bettercap ব্যবহার করেন, SDR-এর জন্য HackRF চালু করেন, প্রতিটি চিপসেটের জন্য আলাদা CVE ডাটাবেস দেখেন, NIST এবং PCI-DSS আলাদাভাবে রেফারেন্স করেন, এবং তারপর ঘন্টার পর ঘন্টা ম্যানুয়ালি ফলাফলগুলো একটি সামঞ্জস্যপূর্ণ মূল্যায়নে সম্পর্কিত করেন।

```
প্রচলিত ওয়্যারলেস সিকিউরিটি ওয়ার্কফ্লো:
  WiFi নেটওয়ার্ক অডিট            ->  aircrack-ng / Wireshark / Kismet
  Bluetooth সিকিউরিটি টেস্ট       ->  Bettercap / btlejack / Ubertooth
  RF সিগন্যাল বিশ্লেষণ            ->  HackRF / GNU Radio / GQRX
  NFC/RFID পরীক্ষা                ->  Proxmark3 / libnfc
  সেলুলার সিকিউরিটি মূল্যায়ন     ->  srsRAN / OpenBTS
  IoT প্রোটোকল টেস্ট              ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  ওয়্যারলেস CVE খোঁজা             ->  NVD / vendor advisories (ম্যানুয়াল অনুসন্ধান)
  কমপ্লায়েন্স পরীক্ষা             ->  NIST / PCI-DSS / HIPAA docs (ম্যানুয়াল)
  MITRE ATT&CK-এ ম্যাপ করা        ->  ATT&CK Navigator (ম্যানুয়াল ম্যাপিং)
  সব কিছু সম্পর্কিত করা           ->  একটি রিপোর্টে কপি-পেস্ট
  ────────────────────────────────
  মোট: প্রতিটি মূল্যায়নে ঘন্টা, বেশিরভাগই টুলের মধ্যে কনটেক্সট-সুইচিং
```

**wifi-security-mcp-server** আপনার AI এজেন্টকে [Model Context Protocol](https://modelcontextprotocol.io)-এর মাধ্যমে ৯টি নলেজ বেস দ্বারা সমর্থিত ৩৪টি কম্পোজিট টুল দেয় যা ১৩৯টি পৃথক ক্ষমতা কভার করে। এজেন্ট নেটওয়ার্ক বিশ্লেষণ করে, ভালনারেবিলিটি শনাক্ত করে, আক্রমণগুলোকে MITRE ATT&CK-এ ম্যাপ করে, কমপ্লায়েন্স পরীক্ষা করে, এবং কার্যকর রিপোর্ট তৈরি করে &mdash; একটি একক কথোপকথনে।

```
wifi-security-mcp-server-এর সাথে:
  আপনি: "আমাদের WPA2-Enterprise চালিত অফিস নেটওয়ার্কের ওয়্যারলেস সিকিউরিটি অডিট করুন"

  এজেন্ট: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "আপনার WPA2-Enterprise নেটওয়ার্কে ৩টি গুরুতর ফলাফল আছে:
            ১. সার্টিফিকেট পিনিং ছাড়া EAP-PEAP — hostapd-mana দিয়ে
               ইভিল টুইন আক্রমণে ঝুঁকিপূর্ণ (MITRE T1557.002)
            ২. কোনো 802.11w (PMF) নেই — ডিঅথেন্টিকেশন আক্রমণে
               সংবেদনশীল (MITRE T1498.001)
            ৩. ক্লায়েন্ট ইন্টারঅ্যাকশন ছাড়াই PMKID হ্যাশ এক্সট্র্যাক্টযোগ্য —
               hashcat mode 22000 দিয়ে অফলাইন ক্র্যাকিং সম্ভব
            PCI-DSS 4.0: ২টি কন্ট্রোল অ-সামঞ্জস্যপূর্ণ (4.2.1, 11.2.1)।
            সুপারিশ: SAE সহ WPA3-Enterprise-এ মাইগ্রেট করুন, PMF সক্ষম
            করুন, রোগ AP শনাক্তকরণের জন্য WIDS স্থাপন করুন।"
```

---

## How It's Different

বিদ্যমান টুলগুলো আপনাকে কাঁচা প্যাকেট ক্যাপচার এবং প্রোটোকল-নির্দিষ্ট বিশ্লেষণ দেয়। wifi-security-mcp-server আপনার AI এজেন্টকে গভীর নলেজ-বেস সমর্থন সহ **সকল ওয়্যারলেস ডোমেন জুড়ে একসাথে যুক্তি প্রদর্শন** করার ক্ষমতা দেয়।

<table>
<thead>
<tr>
<th></th>
<th>প্রচলিত পদ্ধতি</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>ইন্টারফেস</b></td>
<td>১০+ বিভিন্ন CLI, GUI, এবং হার্ডওয়্যার টুল</td>
<td>MCP &mdash; AI এজেন্ট কথোপকথনে টুল কল করে</td>
</tr>
<tr>
<td><b>কভারেজ</b></td>
<td>একবারে একটি প্রোটোকল</td>
<td>WiFi, Bluetooth, RF, NFC, সেলুলার, IoT &mdash; সব একটি সার্ভারে</td>
</tr>
<tr>
<td><b>জ্ঞান</b></td>
<td>ম্যানুয়াল CVE অনুসন্ধান, ম্যানুয়াল ATT&CK ম্যাপিং</td>
<td>১৩৯টি প্রি-ম্যাপড আইটেম সহ ৯টি বিল্ট-ইন নলেজ বেস</td>
</tr>
<tr>
<td><b>আক্রমণ ইন্টেলিজেন্স</b></td>
<td>Google সার্চ + ব্লগ পোস্ট + কনফারেন্স টক</td>
<td>৪৭ WiFi + ৮ Bluetooth + ৬ RF + ৬ NFC + ৬ সেলুলার + ৬ IoT আক্রমণ টুল, প্রশমন, ATT&CK ID সহ ক্যাটালগ করা</td>
</tr>
<tr>
<td><b>কমপ্লায়েন্স</b></td>
<td>NIST/PCI-DSS/HIPAA PDF পড়া, ম্যানুয়ালি কন্ট্রোল ম্যাপ করা</td>
<td>এজেন্ট স্বয়ংক্রিয়ভাবে ৫টি কমপ্লায়েন্স ফ্রেমওয়ার্কের বিরুদ্ধে পরীক্ষা করে</td>
</tr>
<tr>
<td><b>API কী</b></td>
<td>বিভিন্ন সেবার জন্য বিভিন্ন অ্যাকাউন্ট</td>
<td>মূল কার্যকারিতার জন্য শূন্য API কী &mdash; নলেজ-বেস চালিত</td>
</tr>
<tr>
<td><b>সেটআপ</b></td>
<td>aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark ইনস্টল করুন...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; একটি কমান্ড, শূন্য কনফিগ</td>
</tr>
</tbody>
</table>

---

## Quick Start

### অপশন ১: npx (ইনস্টল ছাড়া)

```bash
npx wifi-security-mcp-server
```

সমস্ত ৩৪টি টুল তাৎক্ষণিকভাবে কাজ করে। কোনো API কী প্রয়োজন নেই &mdash; মূল কার্যকারিতা নলেজ-বেস চালিত।

### অপশন ২: ক্লোন

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### এনভায়রনমেন্ট ভেরিয়েবল (ঐচ্ছিক)

```bash
# WiGLE — বাস্তব-বিশ্ব WiFi নেটওয়ার্ক অনুসন্ধানের জন্য wardriving ডাটাবেস
export WIGLE_API_KEY=your-key

# Kismet — লাইভ ওয়্যারলেস ইনট্রুশন ডিটেকশন
export KISMET_HOST=127.0.0.1      # ডিফল্ট: 127.0.0.1
export KISMET_PORT=2501           # ডিফল্ট: 2501
export KISMET_API_KEY=your-key
```

সমস্ত API কী ঐচ্ছিক। এগুলো ছাড়াও আপনি WiFi আক্রমণ, Bluetooth আক্রমণ, RF/SDR, NFC/RFID, সেলুলার, IoT, হার্ডওয়্যার ডাটাবেস, CVE ইন্টেলিজেন্স, এবং কমপ্লায়েন্স ফ্রেমওয়ার্ক কভার করে ৯টি বিল্ট-ইন নলেজ বেস দ্বারা চালিত সমস্ত ৩৪টি টুলে পূর্ণ অ্যাক্সেস পাবেন।

### আপনার AI এজেন্টের সাথে সংযোগ করুন

<details open>
<summary><b>Claude Code</b></summary>

```bash
# npx দিয়ে
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# লোকাল ক্লোন দিয়ে
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

`~/Library/Application Support/Claude/claude_desktop_config.json`-এ যোগ করুন:

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
<summary><b>Cursor / Windsurf / অন্যান্য MCP ক্লায়েন্ট</b></summary>

একই JSON কনফিগ ফরম্যাট। কমান্ডটি `npx wifi-security-mcp-server` বা আপনার লোকাল ইনস্টলেশন পাথের দিকে নির্দেশ করুন।

</details>

### কোয়েরি শুরু করুন

```
আপনি: "WPA3-SAE নেটওয়ার্কের বিরুদ্ধে কী কী আক্রমণ সম্ভব এবং আমি কীভাবে সেগুলো টেস্ট করব?"
```

এটাই সব। এজেন্ট আক্রমণ খোঁজে, MITRE ATT&CK-এ ম্যাপ করে, টুল সুপারিশ করে, এবং ধাপে ধাপে পদ্ধতি প্রদান করে &mdash; সব বিল্ট-ইন নলেজ বেস থেকে।

---

## What The AI Can Do

### WiFi সিকিউরিটি অ্যাসেসমেন্ট

```
আপনি: "WPS সক্ষম একটি WPA2-PSK নেটওয়ার্কের সিকিউরিটি বিশ্লেষণ করুন"

এজেন্ট: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "WPA2-PSK + WPS কনফিগারেশনে গুরুতর ভালনারেবিলিটি পাওয়া গেছে:
          ১. WPS Pixie Dust আক্রমণ — E-S1/E-S2 nonces-এর অফলাইন
             ব্রুট-ফোর্সের মাধ্যমে সেকেন্ডে PIN পুনরুদ্ধারযোগ্য
             (Reaver + PixieWPS)। ক্লায়েন্ট ইন্টারঅ্যাকশন ছাড়া পূর্ণ PSK
             পুনরুদ্ধার।
          ২. PMKID আক্রমণ — 4-way handshake-এর প্রথম প্যাকেটে
             PMKID হ্যাশ আছে, hashcat -m 22000 দিয়ে অফলাইনে
             ক্র্যাকযোগ্য। কোনো deauth লাগবে না, কোনো ক্লায়েন্ট লাগবে না।
          ৩. 4-Way Handshake ক্যাপচার — EAPOL ফ্রেম
             airodump-ng + deauth দিয়ে ক্যাপচারযোগ্য, তারপর
             অফলাইন ডিকশনারি আক্রমণ।
          অগ্রাধিকার: অবিলম্বে WPS নিষ্ক্রিয় করুন (সর্বোচ্চ ঝুঁকি),
          ২০+ অক্ষরের শক্তিশালী PSK প্রয়োগ করুন, WPA3-SAE-তে
          মাইগ্রেশন বিবেচনা করুন।"
```

### Bluetooth ও BLE বিশ্লেষণ

```
আপনি: "আমাদের BLE-ভিত্তিক অ্যাক্সেস কন্ট্রোল সিস্টেমের সিকিউরিটি ঝুঁকি কী?"

এজেন্ট: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "BLE অ্যাক্সেস কন্ট্রোল সিস্টেম — ৪টি গুরুতর ঝুঁকি চিহ্নিত:
          ১. JustWorks পেয়ারিং — কোনো MITM সুরক্ষা নেই। আক্রমণকারী
             Ubertooth One দিয়ে পেয়ারিং আটকাতে পারে (MITRE T1040)।
          ২. GATT Characteristic স্নিফিং — আনলক কমান্ড প্লেইনটেক্সটে
             পাঠানো হয়, gatttool দিয়ে রিপ্লে করা যায় (MITRE T1212)।
          ৩. BLE রিলে/রিপ্লে আক্রমণ — দুটি ডিভাইস + btlejack ব্যবহার
             করে বৈধ আনলক সিগন্যাল রিলে করা (MITRE T1557)।
          ৪. MAC অ্যাড্রেস ট্র্যাকিং — স্ট্যাটিক BLE MAC দিয়ে বাসিন্দা
             ট্র্যাকিং সম্ভব (MITRE T1592.002)।
          সুপারিশ: নিউমেরিক কম্পারিসন সহ LE Secure Connections
          (LESC) প্রয়োগ করুন, GATT characteristics এনক্রিপ্ট করুন,
          রিপ্লে সুরক্ষার জন্য রোলিং nonces প্রয়োগ করুন।"
```

### IoT ওয়্যারলেস অডিট

```
আপনি: "আমাদের স্মার্ট বিল্ডিং IoT ডিপ্লয়মেন্টের ওয়্যারলেস সিকিউরিটি মূল্যায়ন করুন"

এজেন্ট: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "স্মার্ট বিল্ডিং IoT ওয়্যারলেস অ্যাসেসমেন্ট — ৫টি ফলাফল:
          ১. Zigbee: ডিফল্ট ট্রাস্ট সেন্টার লিংক কী (ZigBeeAlliance09)
             KillerBee দিয়ে নেটওয়ার্ক জয়েন ইন্টারসেপশন অনুমতি দেয় (গুরুতর)
          ২. MQTT: TLS ছাড়া পোর্ট 1883-এ ব্রোকার — ক্রেডেনশিয়াল
             এবং সেন্সর ডেটা প্লেইনটেক্সটে প্রেরিত
          ৩. Z-Wave: পরিচিত কী এক্সচেঞ্জ ভালনারেবিলিটি সহ S0 সিকিউরিটি
             — S2 আপগ্রেড সুপারিশ
          ৪. MouseJack: ৩টি Logitech Unifying রিসিভার কীস্ট্রোক
             ইনজেকশনে ঝুঁকিপূর্ণ (CVE-2016-10761)
          ৫. WiFi: IoT ডিভাইস কর্পোরেটের সাথে একই VLAN-এ —
             কোনো নেটওয়ার্ক সেগমেন্টেশন নেই
          অগ্রাধিকার প্রতিকার: MQTT TLS, Zigbee ইনস্টল কোড,
          IoT VLAN আইসোলেশন, ঝুঁকিপূর্ণ Logitech রিসিভার প্রতিস্থাপন।"
```

### কমপ্লায়েন্স অডিট

```
আপনি: "আমাদের হাসপাতালের WiFi HIPAA ওয়্যারলেস প্রয়োজনীয়তার বিরুদ্ধে পরীক্ষা করুন"

এজেন্ট: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "HIPAA ওয়্যারলেস কমপ্লায়েন্স অডিট — ৬টি ফলাফল:
          ৩টি অ-সামঞ্জস্যপূর্ণ কন্ট্রোল:
          - 164.312(a)(1): রোগ AP শনাক্তকরণের জন্য কোনো ওয়্যারলেস IDS স্থাপন করা হয়নি
          - 164.312(e)(1): মেডিকেল ডিভাইস WPA2-PSK ব্যবহার করে (Enterprise নয়)
          - 164.312(e)(2): কোনো ওয়্যারলেস ট্রাফিক এনক্রিপশন অডিট লগিং নেই
          ৩টি সামঞ্জস্যপূর্ণ কন্ট্রোল:
          - 164.310(a)(1): ফিজিক্যাল AP অবস্থান নথিভুক্ত
          - 164.312(a)(2): RADIUS অথেন্টিকেশন সহ 802.1X
          - 164.312(d): স্টাফ ডিভাইসের জন্য সার্টিফিকেট-ভিত্তিক EAP-TLS
          প্রতিকার পরিকল্পনা: WIDS স্থাপন (Kismet/AirMagnet), মেডিকেল
          ডিভাইস MAB সহ WPA2-Enterprise-এ মাইগ্রেট করুন, WLAN
          কন্ট্রোলারে ওয়্যারলেস অডিট লগিং সক্ষম করুন।"
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; কোনো API কী নেই</b></summary>

| টুল | বিবরণ |
|------|-------------|
| `scan_wifi_networks` | WiFi নেটওয়ার্ক স্ক্যান ও বিশ্লেষণ &mdash; SSID, চ্যানেল, এনক্রিপশন ধরন, সিগন্যাল শক্তি, এবং সিকিউরিটি ভুল কনফিগারেশন আবিষ্কার |
| `analyze_wifi_security` | WiFi সিকিউরিটি কনফিগারেশনের গভীর বিশ্লেষণ &mdash; এনক্রিপশন শক্তি, অথেন্টিকেশন পদ্ধতি, পরিচিত দুর্বলতা, অ্যাটাক সারফেস |
| `find_wifi_attacks` | WiFi টার্গেটের জন্য প্রযোজ্য আক্রমণ খোঁজা &mdash; আক্রমণ পদ্ধতি, প্রয়োজনীয় টুল, MITRE ATT&CK ম্যাপিং, প্রশমন রিটার্ন করে |
| `simulate_evil_twin` | ইভিল টুইন AP আক্রমণ পরিস্থিতি সিমুলেট ও বিশ্লেষণ &mdash; hostapd-mana কনফিগারেশন, ক্যাপটিভ পোর্টাল, ক্রেডেনশিয়াল ক্যাপচার পদ্ধতি |
| `analyze_deauth` | ডিঅথেন্টিকেশন আক্রমণ ভেক্টর বিশ্লেষণ &mdash; 802.11w PMF অবস্থা, deauth শনাক্তকরণ, পাল্টা ব্যবস্থা, WIDS ইন্টিগ্রেশন |
| `crack_wps` | WPS ক্র্যাকিং আক্রমণ ভেক্টর বিশ্লেষণ &mdash; Pixie Dust, ব্রুট ফোর্স, নাল PIN, ডিফল্ট PIN জেনারেশন, Reaver/Bully পদ্ধতি |
| `analyze_pmkid` | PMKID-ভিত্তিক আক্রমণ ভেক্টর বিশ্লেষণ &mdash; hcxdumptool + hashcat mode 22000 এর মাধ্যমে ক্লায়েন্টবিহীন WPA/WPA2 ক্র্যাকিং |
| `audit_wifi67` | WiFi 6 (802.11ax) এবং WiFi 7 (802.11be) নির্দিষ্ট সিকিউরিটি ফিচার অডিট &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; কোনো API কী নেই</b></summary>

| টুল | বিবরণ |
|------|-------------|
| `scan_bluetooth` | Bluetooth ডিভাইস স্ক্যান ও বিশ্লেষণ &mdash; BR/EDR ক্লাসিক এবং BLE আবিষ্কার, সার্ভিস এনুমারেশন, পেয়ারিং বিশ্লেষণ |
| `find_bluetooth_attacks` | প্রযোজ্য Bluetooth আক্রমণ খোঁজা &mdash; BlueBorne, KNOB, BIAS, BLE রিলে, MITM, টুল ও প্রশমন সহ |
| `analyze_ble` | BLE সিকিউরিটির গভীর বিশ্লেষণ &mdash; GATT সার্ভিস, পেয়ারিং পদ্ধতি, LE Secure Connections, characteristic এনক্রিপশন |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; কোনো API কী নেই</b></summary>

| টুল | বিবরণ |
|------|-------------|
| `analyze_rf_signal` | RF সিগন্যাল সিকিউরিটি বিশ্লেষণ &mdash; ফ্রিকোয়েন্সি বিশ্লেষণ, মডুলেশন শনাক্তকরণ, রিপ্লে আক্রমণ সম্ভাব্যতা, SDR টুল সুপারিশ |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; কোনো API কী নেই</b></summary>

| টুল | বিবরণ |
|------|-------------|
| `analyze_nfc_security` | NFC/RFID সিকিউরিটি বিশ্লেষণ &mdash; কার্ড ধরন শনাক্তকরণ, অ্যাক্সেস কন্ট্রোল দুর্বলতা, ক্লোনিং সম্ভাব্যতা, Proxmark3 পদ্ধতি |

</details>

<details>
<summary><b>সেলুলার/5G (1) &mdash; কোনো API কী নেই</b></summary>

| টুল | বিবরণ |
|------|-------------|
| `analyze_cellular_security` | সেলুলার নেটওয়ার্ক সিকিউরিটি বিশ্লেষণ &mdash; 2G/3G/4G/5G প্রোটোকল দুর্বলতা, IMSI ক্যাচার শনাক্তকরণ, ফেক বেস স্টেশন বিশ্লেষণ |

</details>

<details>
<summary><b>IoT ওয়্যারলেস (3) &mdash; কোনো API কী নেই</b></summary>

| টুল | বিবরণ |
|------|-------------|
| `analyze_zigbee` | Zigbee নেটওয়ার্ক সিকিউরিটি বিশ্লেষণ &mdash; ট্রাস্ট সেন্টার পলিসি, নেটওয়ার্ক কী ম্যানেজমেন্ট, KillerBee আক্রমণ পদ্ধতি |
| `scan_iot_wireless` | IoT ওয়্যারলেস প্রোটোকল স্ক্যান &mdash; Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP আবিষ্কার ও ভালনারেবিলিটি বিশ্লেষণ |
| `find_mousejack` | MouseJack ওয়্যারলেস কীবোর্ড/মাউস ভালনারেবিলিটি বিশ্লেষণ &mdash; কীস্ট্রোক ইনজেকশন, আনএনক্রিপ্টেড HID, ভেন্ডর-নির্দিষ্ট বাইপাস |

</details>

<details>
<summary><b>উন্নত ওয়্যারলেস (6) &mdash; কোনো API কী নেই</b></summary>

| টুল | বিবরণ |
|------|-------------|
| `analyze_airgap` | এয়ার-গ্যাপ এক্সফিল্ট্রেশন কৌশল বিশ্লেষণ &mdash; ইলেক্ট্রোম্যাগনেটিক, অ্যাকুস্টিক, থার্মাল, অপটিক্যাল কোভার্ট চ্যানেল এবং পাল্টা ব্যবস্থা |
| `analyze_uwb` | আল্ট্রা-ওয়াইডব্যান্ড (UWB) সিকিউরিটি বিশ্লেষণ &mdash; রেঞ্জিং ম্যানিপুলেশন, কার কী ফব ও AirTags-এ রিলে আক্রমণ, দূরত্ব জালিয়াতি |
| `analyze_wifi_csi` | WiFi Channel State Information (CSI) সিকিউরিটি বিশ্লেষণ &mdash; প্যাসিভ সেন্সিং, অ্যাক্টিভিটি রিকগনিশন, কীস্ট্রোক ইনফারেন্স ঝুঁকি |
| `analyze_miracast` | Miracast/WiFi Display সিকিউরিটি বিশ্লেষণ &mdash; WFD সেশন হাইজ্যাকিং, স্ক্রিন ক্যাপচার, অননুমোদিত ডিসপ্লে অ্যাক্সেস |
| `analyze_wifi_direct` | WiFi Direct (P2P) সিকিউরিটি বিশ্লেষণ &mdash; গ্রুপ ওনার নেগোসিয়েশন আক্রমণ, P2P-তে WPS ভালনারেবিলিটি, রোগ গ্রুপ গঠন |
| `analyze_drone_rf` | ড্রোন RF সিকিউরিটি বিশ্লেষণ &mdash; কন্ট্রোল লিংক হাইজ্যাকিং, GPS স্পুফিং, ভিডিও ডাউনলিংক ইন্টারসেপশন, কাউন্টার-UAS কৌশল |

</details>

<details>
<summary><b>ইনফ্রাস্ট্রাকচার (4) &mdash; কোনো API কী নেই (লাইভ WIDS-এর জন্য KISMET_* ঐচ্ছিক)</b></summary>

| টুল | বিবরণ |
|------|-------------|
| `audit_wlan_controller` | WLAN কন্ট্রোলার কনফিগারেশন অডিট &mdash; Cisco WLC, Aruba, Meraki সিকিউরিটি সেটিংস, রোগ AP পলিসি, RF ম্যানেজমেন্ট |
| `analyze_captive_portal` | ক্যাপটিভ পোর্টাল সিকিউরিটি বিশ্লেষণ &mdash; বাইপাস কৌশল, ক্রেডেনশিয়াল হার্ভেস্টিং ঝুঁকি, নেটওয়ার্ক আইসোলেশন, গেস্ট VLAN সিকিউরিটি |
| `detect_mac_randomization` | MAC অ্যাড্রেস র‍্যান্ডমাইজেশন বিশ্লেষণ &mdash; iOS/Android/Windows বাস্তবায়ন পার্থক্য, ট্র্যাকিং প্রতিরোধ, ফিঙ্গারপ্রিন্টিং বাইপাস |
| `analyze_hotspot20` | Hotspot 2.0 (Passpoint) সিকিউরিটি বিশ্লেষণ &mdash; ANQP, OSU, স্বয়ংক্রিয় নেটওয়ার্ক নির্বাচন ঝুঁকি, EAP মেথড বিশ্লেষণ |

</details>

<details>
<summary><b>ইন্টেলিজেন্স (4) &mdash; কোনো API কী নেই</b></summary>

| টুল | বিবরণ |
|------|-------------|
| `lookup_wireless_cve` | ওয়্যারলেস-নির্দিষ্ট CVE অনুসন্ধান &mdash; WiFi চিপসেট ভালনারেবিলিটি, Bluetooth স্ট্যাক CVE, ড্রাইভার এক্সপ্লোইট, ফার্মওয়্যার বাগ |
| `lookup_hardware` | ওয়্যারলেস সিকিউরিটি হার্ডওয়্যার অনুসন্ধান &mdash; WiFi অ্যাডাপ্টার, Bluetooth স্নিফার, SDR ডিভাইস, ক্ষমতা, চিপসেট সামঞ্জস্য |
| `map_wireless_attck` | ওয়্যারলেস আক্রমণ MITRE ATT&CK ফ্রেমওয়ার্কে ম্যাপ &mdash; টেকনিক ID, ট্যাকটিক ক্যাটাগরি, ডিটেকশন স্ট্র্যাটেজি |
| `analyze_medical_wireless` | মেডিকেল ডিভাইস ওয়্যারলেস সিকিউরিটি বিশ্লেষণ &mdash; ইনফিউশন পাম্প, পেসমেকার, পেশেন্ট মনিটর, FDA নির্দেশনা, HIPAA প্রয়োজনীয়তা |

</details>

<details>
<summary><b>ডিটেকশন (2) &mdash; কোনো API কী নেই</b></summary>

| টুল | বিবরণ |
|------|-------------|
| `detect_wireless_attack` | চলমান ওয়্যারলেস আক্রমণ শনাক্তকরণ &mdash; deauth ফ্লাড, ইভিল টুইন, KARMA, রোগ AP, BLE স্পুফিং, RF জ্যামিং সূচক |
| `audit_wireless_compliance` | কমপ্লায়েন্স ফ্রেমওয়ার্কের বিরুদ্ধে ওয়্যারলেস নেটওয়ার্ক অডিট &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, ISO 27001 ওয়্যারলেস কন্ট্রোল |

</details>

<details>
<summary><b>রিপোর্টিং (1) &mdash; কোনো API কী নেই</b></summary>

| টুল | বিবরণ |
|------|-------------|
| `export_report` | ওয়্যারলেস সিকিউরিটি অ্যাসেসমেন্ট রিপোর্ট এক্সপোর্ট &mdash; ফলাফল, ঝুঁকি রেটিং, কমপ্লায়েন্স স্ট্যাটাস, প্রতিকার রোডম্যাপ, নির্বাহী সারসংক্ষেপ |

</details>

---

### CLI Usage

```bash
# সমস্ত উপলব্ধ টুল তালিকা করুন
npx wifi-security-mcp-server --list

# যেকোনো টুল সরাসরি চালান
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

সার্ভারটি ৯টি বিল্ট-ইন নলেজ বেস সহ আসে &mdash; কোনো API কী নেই, কোনো বাহ্যিক নির্ভরতা নেই, কোনো রেট লিমিট নেই। প্রতিটি টুল কোয়েরি এই ডাটাবেসগুলো থেকে কাঠামোবদ্ধ ইন্টেলিজেন্স দ্বারা সমৃদ্ধ হয়।

| নলেজ বেস | এন্ট্রি | এটি কী প্রদান করে |
|----------------|---------|-----------------|
| **WiFi আক্রমণ** | ৪৭ আক্রমণ | WPA/WPA2/WPA3 আক্রমণ কৌশল, ইভিল টুইন ভেরিয়েন্ট, PMKID, KRACK, FragAttacks, deauth, WPS এক্সপ্লোইট &mdash; প্রতিটিতে টুল, প্রশমন, MITRE ATT&CK ম্যাপিং |
| **Bluetooth আক্রমণ** | ৮ আক্রমণ | BlueBorne, KNOB, BIAS, BLE রিলে, MITM, BLE ফাজিং, Bluetooth ইম্পার্সোনেশন &mdash; CVE ও শনাক্তকরণ কৌশল সহ |
| **RF/SDR আক্রমণ** | ৬ আক্রমণ | রিপ্লে আক্রমণ, জ্যামিং, সিগন্যাল ইনজেকশন, SDR-ভিত্তিক ইন্টারসেপশন, RF ফিঙ্গারপ্রিন্টিং বাইপাস, স্পেকট্রাম বিশ্লেষণ কৌশল |
| **NFC/RFID আক্রমণ** | ৬ আক্রমণ | কার্ড ক্লোনিং, রিলে আক্রমণ, MIFARE Classic ক্র্যাকিং, NFC স্কিমিং, RFID ফাজিং, Proxmark3 দিয়ে অ্যাক্সেস কন্ট্রোল বাইপাস |
| **সেলুলার আক্রমণ** | ৬ আক্রমণ | IMSI ক্যাচিং, ফেক বেস স্টেশন (Stingray), SS7 এক্সপ্লোইটেশন, 5G NAS ভালনারেবিলিটি, ডাউনগ্রেড আক্রমণ, VoLTE ইন্টারসেপশন |
| **IoT আক্রমণ** | ৬ আক্রমণ | Zigbee নেটওয়ার্ক কী স্নিফিং, Z-Wave S0 ডাউনগ্রেড, MQTT ক্রেডেনশিয়াল হার্ভেস্টিং, LoRaWAN ABP রিপ্লে, MouseJack, BLE IoT রিলে |
| **হার্ডওয়্যার ডাটাবেস** | ১২ ডিভাইস | WiFi অ্যাডাপ্টার (Alfa, TP-Link), Bluetooth স্নিফার (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; চিপসেট, ক্ষমতা, মনিটর মোড সাপোর্ট |
| **CVE ডাটাবেস** | ১৭ CVE | WiFi চিপসেট (Broadcom, Qualcomm, Intel), Bluetooth স্ট্যাক, IoT ফার্মওয়্যারের জন্য ওয়্যারলেস-নির্দিষ্ট CVE &mdash; তীব্রতা, প্রভাবিত সংস্করণ, এক্সপ্লোইট উপলব্ধতা |
| **কমপ্লায়েন্স ফ্রেমওয়ার্ক** | ৫ ফ্রেমওয়ার্ক | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; ওয়্যারলেস-নির্দিষ্ট কন্ট্রোল, অডিট চেকলিস্ট, গ্যাপ বিশ্লেষণ |

---

## Architecture

```
src/
  index.ts                    # CLI এন্ট্রি পয়েন্ট (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # MCP সার্ভার সেটআপ (stdio ট্রান্সপোর্ট)
    tools.ts                  # টুল রেজিস্ট্রি — সমস্ত ৩৪টি কম্পোজিট টুল এখানে সংযোজিত
  types/
    index.ts                  # শেয়ার্ড টাইপ (ToolDef, ToolContext, ToolResult)
  knowledge/                  # ৯টি বিল্ট-ইন নলেজ বেস
    wifi-attacks.ts           # ৪৭ WiFi আক্রমণ সংজ্ঞা
    bluetooth-attacks.ts      # ৮ Bluetooth আক্রমণ সংজ্ঞা
    rf-attacks.ts             # ৬ RF/SDR আক্রমণ সংজ্ঞা
    nfc-attacks.ts            # ৬ NFC/RFID আক্রমণ সংজ্ঞা
    cellular-attacks.ts       # ৬ সেলুলার/5G আক্রমণ সংজ্ঞা
    iot-attacks.ts            # ৬ IoT আক্রমণ সংজ্ঞা
    hardware.ts               # ১২ হার্ডওয়্যার ডিভাইস প্রোফাইল
    cve-database.ts           # ১৭ ওয়্যারলেস CVE
    compliance.ts             # ৫ কমপ্লায়েন্স ফ্রেমওয়ার্ক
  wifi/                       # WiFi Core টুলস (৮)
  bluetooth/                  # Bluetooth টুলস (৩)
  rf/                         # RF/SDR টুলস (১)
  nfc/                        # NFC/RFID টুলস (১)
  cellular/                   # সেলুলার/5G টুলস (১)
  iot/                        # IoT ওয়্যারলেস টুলস (৩)
  advanced/                   # উন্নত ওয়্যারলেস টুলস (৬)
  infrastructure/             # ইনফ্রাস্ট্রাকচার টুলস (৪)
  intelligence/               # ইন্টেলিজেন্স টুলস (৪)
  detection/                  # ডিটেকশন টুলস (২)
  reporting/                  # রিপোর্টিং টুলস (১)
```

**ডিজাইন সিদ্ধান্ত:**

- **নলেজ-বেস চালিত** &mdash; API-নির্ভর টুলের বিপরীতে, মূল কার্যকারিতা ৯টি বিল্ট-ইন ডাটাবেস থেকে সম্পূর্ণ অফলাইনে চলে। কোনো API কী নেই, কোনো রেট লিমিট নেই, প্রাথমিক ওয়ার্কফ্লোর জন্য কোনো বাহ্যিক নির্ভরতা নেই।
- **৩৪ কম্পোজিট টুল, ১৩৯ পৃথক ক্ষমতা** &mdash; প্রতিটি টুল একটি কম্পোজিট যা সম্পর্কিত বিশ্লেষণ বান্ডিল করে। `find_wifi_attacks` শুধু আক্রমণ তালিকা করে না &mdash; এটি পদ্ধতি, প্রয়োজনীয় হার্ডওয়্যার, MITRE ATT&CK ম্যাপিং, শনাক্তকরণ কৌশল এবং পাল্টা ব্যবস্থা রিটার্ন করে।
- **২টি রানটাইম নির্ভরতা** &mdash; `@modelcontextprotocol/sdk` এবং `zod`। আর কিছু নয়। কোনো নেটিভ মডিউল নেই, কোনো বাইনারি নির্ভরতা নেই, কোনো প্ল্যাটফর্ম-নির্দিষ্ট কোড নেই।
- **ঐচ্ছিক লাইভ ইন্টিগ্রেশন** &mdash; বাস্তব-বিশ্ব নেটওয়ার্ক ডেটার জন্য WiGLE API, লাইভ ওয়্যারলেস IDS-এর জন্য Kismet। কোর বিশ্লেষণ উভয় ছাড়াই কাজ করে।
- **কমপ্লায়েন্স-সচেতন** &mdash; প্রতিটি ফলাফল প্রযোজ্য হলে স্বয়ংক্রিয়ভাবে প্রাসঙ্গিক কমপ্লায়েন্স ফ্রেমওয়ার্কে (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) ম্যাপ করা হয়।
- **MITRE ATT&CK ম্যাপড** &mdash; আক্রমণ কৌশলে ATT&CK টেকনিক ID, ট্যাকটিক ক্যাটাগরি, এবং SOC ইন্টিগ্রেশনের জন্য ডিটেকশন ডেটা সোর্স অন্তর্ভুক্ত।

---

## Limitations

- নলেজ বেসগুলো নির্দিষ্ট সময়ের স্ন্যাপশট &mdash; নতুন আক্রমণ/CVE-র জন্য প্যাকেজ আপডেট প্রয়োজন
- WiGLE ইন্টিগ্রেশনের জন্য নেটওয়ার্ক অনুসন্ধানে একটি বিনামূল্যের API কী প্রয়োজন
- Kismet লাইভ WIDS-এর জন্য API অ্যাক্সেস সহ একটি চলমান Kismet ইনস্ট্যান্স প্রয়োজন
- কোনো সক্রিয় ওয়্যারলেস ট্রান্সমিশন নেই &mdash; সার্ভার ইন্টেলিজেন্স এবং পদ্ধতি প্রদান করে, প্যাকেট ইনজেকশন নয়
- হার্ডওয়্যার ডাটাবেস সবচেয়ে সাধারণ সিকিউরিটি গবেষণা ডিভাইস কভার করে, সম্পূর্ণ নয়
- কমপ্লায়েন্স ফ্রেমওয়ার্ক ওয়্যারলেস-নির্দিষ্ট কন্ট্রোলে ফোকাস করে, সম্পূর্ণ ফ্রেমওয়ার্ক কভারেজ নয়
- macOS / Linux পরীক্ষিত (Windows পরীক্ষিত নয়)

---

## Part of the MCP Security Suite

| প্রজেক্ট | ডোমেন | টুলস |
|---|---|---|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | ব্রাউজার-ভিত্তিক সিকিউরিটি টেস্টিং | ৩৯ টুল, Firefox, ইনজেকশন টেস্টিং |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | ক্লাউড সিকিউরিটি (AWS/Azure/GCP) | ৩৮ টুল, ৬০+ চেক |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub সিকিউরিটি পশ্চার | ৩৯ টুল, ৪৫ চেক |
| [cve-mcp](https://github.com/badchars/cve-mcp) | ভালনারেবিলিটি ইন্টেলিজেন্স | ২৩ টুল, ৫ সোর্স |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT ও রিকনেসান্স | ৩৭ টুল, ১২ সোর্স |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | ডার্ক ওয়েব ও থ্রেট ইন্টেলিজেন্স | ৬৬ টুল, ১৬ সোর্স |
| **wifi-security-mcp-server** | **ওয়্যারলেস সিকিউরিটি ইন্টেলিজেন্স** | **৩৪ টুল, ৯ নলেজ বেস** |

---

<p align="center">
<b>শুধুমাত্র অনুমোদিত সিকিউরিটি পরীক্ষা ও মূল্যায়নের জন্য।</b><br>
যেকোনো নেটওয়ার্ক বা ডিভাইসে ওয়্যারলেস সিকিউরিটি পরীক্ষা করার আগে সর্বদা নিশ্চিত করুন যে আপনার যথাযথ অনুমোদন আছে।<br>
অননুমোদিত ওয়্যারলেস নেটওয়ার্ক অ্যাক্সেস বা হস্তক্ষেপ বেশিরভাগ বিচার ব্যবস্থায় অবৈধ।
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

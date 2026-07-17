<div dir="rtl">

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
  <strong>العربية</strong> |
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

<h3 align="center">ذكاء أمن الشبكات اللاسلكية لوكلاء الذكاء الاصطناعي.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3)، Bluetooth (BR/EDR, BLE)، RF/SDR، NFC/RFID، الشبكات الخلوية/5G، إنترنت الأشياء (Zigbee, Z-Wave, MQTT, LoRaWAN)، MouseJack، Air-Gap، UWB، WiFi CSI، Miracast، WiFi Direct، ترددات الطائرات بدون طيار، WIDS/WIPS، الامتثال &mdash; موحّدة في خادم MCP واحد.<br>
  يحصل وكيل الذكاء الاصطناعي الخاص بك على <b>تحليل أمني لاسلكي شامل عند الطلب</b>، مدعوم بـ 9 قواعد معرفية مدمجة تغطي 139 أداة فردية.
</p>

<br>

<p align="center">
  <a href="#the-problem">المشكلة</a> &bull;
  <a href="#how-its-different">ما يميّزه</a> &bull;
  <a href="#quick-start">البدء السريع</a> &bull;
  <a href="#what-the-ai-can-do">ما يمكن للذكاء الاصطناعي فعله</a> &bull;
  <a href="#tools-reference-34-composite-tools">الأدوات (34)</a> &bull;
  <a href="#knowledge-bases-9">قواعد المعرفة</a> &bull;
  <a href="#architecture">البنية المعمارية</a> &bull;
  <a href="CHANGELOG.md">سجل التغييرات</a> &bull;
  <a href="CONTRIBUTING.md">المساهمة</a>
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

تقييم أمن الشبكات اللاسلكية هو أحد أكثر التخصصات تفككاً في مجال الأمن الهجومي. تدقيق شبكات WiFi يتطلب مجموعة أدوات، وBluetooth مجموعة أخرى، وRF/SDR مجموعة ثالثة، وبروتوكولات إنترنت الأشياء مجموعة رابعة &mdash; ولكل مجال سطح هجومه الخاص، ونقاط ضعفه الخاصة، ومتطلبات الامتثال الخاصة به. اليوم تقوم بتشغيل aircrack-ng لـ WPA، وتستخدم Bettercap لـ BLE، وتُشغّل HackRF لـ SDR، وتستشير قواعد بيانات CVE مختلفة لكل شريحة، وتراجع NIST وPCI-DSS بشكل منفصل، ثم تقضي ساعات في ربط النتائج يدوياً في تقييم متماسك.

```
سير العمل التقليدي لأمن الشبكات اللاسلكية:
  تدقيق شبكات WiFi                ->  aircrack-ng / Wireshark / Kismet
  اختبار أمن Bluetooth             ->  Bettercap / btlejack / Ubertooth
  تحليل إشارات RF                  ->  HackRF / GNU Radio / GQRX
  فحص NFC/RFID                     ->  Proxmark3 / libnfc
  تقييم أمن الشبكات الخلوية        ->  srsRAN / OpenBTS
  اختبار بروتوكولات IoT             ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  البحث عن ثغرات CVE اللاسلكية      ->  NVD / vendor advisories (بحث يدوي)
  التحقق من الامتثال                ->  NIST / PCI-DSS / HIPAA docs (يدوي)
  الربط مع MITRE ATT&CK             ->  ATT&CK Navigator (ربط يدوي)
  ربط كل شيء معاً                  ->  نسخ ولصق في تقرير
  ────────────────────────────────
  الإجمالي: ساعات لكل تقييم، معظمها في التبديل بين الأدوات
```

**wifi-security-mcp-server** يمنح وكيل الذكاء الاصطناعي الخاص بك 34 أداة مركّبة مدعومة بـ 9 قواعد معرفية تغطي 139 قدرة فردية عبر [Model Context Protocol](https://modelcontextprotocol.io). يقوم الوكيل بتحليل الشبكات، وتحديد نقاط الضعف، وربط الهجمات بـ MITRE ATT&CK، والتحقق من الامتثال، وإنشاء تقارير قابلة للتنفيذ &mdash; في محادثة واحدة.

```
مع wifi-security-mcp-server:
  أنت: "قم بتدقيق أمن الشبكة اللاسلكية لمكتبنا الذي يعمل بـ WPA2-Enterprise"

  الوكيل: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "شبكة WPA2-Enterprise الخاصة بك تحتوي على 3 نتائج حرجة:
            1. EAP-PEAP بدون تثبيت الشهادة — عرضة لهجوم التوأم الشرير
               باستخدام hostapd-mana (MITRE T1557.002)
            2. لا يوجد 802.11w (PMF) — عرضة لهجمات إلغاء المصادقة
               (MITRE T1498.001)
            3. هاش PMKID قابل للاستخراج بدون تفاعل العميل — كسر
               غير متصل ممكن باستخدام hashcat mode 22000
            PCI-DSS 4.0: عنصران غير متوافقين (4.2.1, 11.2.1).
            مُوصى به: الانتقال إلى WPA3-Enterprise مع SAE، تفعيل PMF،
            نشر WIDS لكشف نقاط الوصول المارقة."
```

---

## How It's Different

الأدوات الحالية تمنحك التقاطات حزم خام وتحليلاً خاصاً بالبروتوكول. wifi-security-mcp-server يمنح وكيل الذكاء الاصطناعي الخاص بك القدرة على **التحليل عبر جميع المجالات اللاسلكية في وقت واحد** مع دعم عميق من قواعد المعرفة.

<table>
<thead>
<tr>
<th></th>
<th>النهج التقليدي</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>الواجهة</b></td>
<td>أكثر من 10 أدوات CLI وGUI وأجهزة مختلفة</td>
<td>MCP &mdash; وكيل الذكاء الاصطناعي يستدعي الأدوات بالمحادثة</td>
</tr>
<tr>
<td><b>التغطية</b></td>
<td>بروتوكول واحد في كل مرة</td>
<td>WiFi، Bluetooth، RF، NFC، الشبكات الخلوية، إنترنت الأشياء &mdash; الكل في خادم واحد</td>
</tr>
<tr>
<td><b>المعرفة</b></td>
<td>بحث يدوي عن CVE، ربط يدوي بـ ATT&CK</td>
<td>9 قواعد معرفية مدمجة تحتوي على 139 عنصراً مُعيّناً مسبقاً</td>
</tr>
<tr>
<td><b>استخبارات الهجمات</b></td>
<td>بحث Google + مقالات مدونات + محاضرات مؤتمرات</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 خلوي + 6 IoT هجوم مُفهرس مع الأدوات والتخفيفات ومعرّفات ATT&CK</td>
</tr>
<tr>
<td><b>الامتثال</b></td>
<td>قراءة مستندات NIST/PCI-DSS/HIPAA PDF، ربط الضوابط يدوياً</td>
<td>الوكيل يتحقق تلقائياً مقابل 5 أطر امتثال</td>
</tr>
<tr>
<td><b>مفاتيح API</b></td>
<td>حسابات مختلفة لخدمات مختلفة</td>
<td>صفر مفاتيح API للوظائف الأساسية &mdash; مدفوع بقواعد المعرفة</td>
</tr>
<tr>
<td><b>الإعداد</b></td>
<td>تثبيت aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; أمر واحد، بدون إعداد</td>
</tr>
</tbody>
</table>

---

## Quick Start

### الخيار 1: npx (بدون تثبيت)

```bash
npx wifi-security-mcp-server
```

جميع الأدوات الـ 34 تعمل فوراً. لا حاجة لمفاتيح API &mdash; الوظائف الأساسية مدفوعة بقواعد المعرفة.

### الخيار 2: الاستنساخ

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### متغيرات البيئة (اختيارية)

```bash
# WiGLE — قاعدة بيانات wardriving للبحث عن شبكات WiFi الحقيقية
export WIGLE_API_KEY=your-key

# Kismet — كشف التسلل اللاسلكي المباشر
export KISMET_HOST=127.0.0.1      # الافتراضي: 127.0.0.1
export KISMET_PORT=2501           # الافتراضي: 2501
export KISMET_API_KEY=your-key
```

جميع مفاتيح API اختيارية. بدونها، لا يزال لديك وصول كامل إلى جميع الأدوات الـ 34 المدعومة بـ 9 قواعد معرفية مدمجة تغطي هجمات WiFi، وهجمات Bluetooth، وRF/SDR، وNFC/RFID، والشبكات الخلوية، وإنترنت الأشياء، وقاعدة بيانات الأجهزة، واستخبارات CVE، وأطر الامتثال.

### الاتصال بوكيل الذكاء الاصطناعي الخاص بك

<details open>
<summary><b>Claude Code</b></summary>

```bash
# مع npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# مع الاستنساخ المحلي
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

أضف إلى `~/Library/Application Support/Claude/claude_desktop_config.json`:

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
<summary><b>Cursor / Windsurf / عملاء MCP أخرى</b></summary>

نفس تنسيق إعدادات JSON. وجّه الأمر إلى `npx wifi-security-mcp-server` أو مسار التثبيت المحلي الخاص بك.

</details>

### ابدأ الاستعلام

```
أنت: "ما الهجمات الممكنة ضد شبكة WPA3-SAE وكيف أختبرها؟"
```

هذا كل شيء. الوكيل يبحث عن الهجمات، ويربطها بـ MITRE ATT&CK، ويوصي بالأدوات، ويقدم منهجية خطوة بخطوة &mdash; كل ذلك من قواعد المعرفة المدمجة.

---

## What The AI Can Do

### تقييم أمن WiFi

```
أنت: "حلّل أمن شبكة WPA2-PSK مع تفعيل WPS"

الوكيل: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "تم العثور على ثغرات حرجة في إعداد WPA2-PSK + WPS:
          1. هجوم WPS Pixie Dust — رمز PIN قابل للاسترداد في ثوانٍ
             عبر القوة الغاشمة غير المتصلة لـ nonces E-S1/E-S2
             (Reaver + PixieWPS). استرداد كامل لـ PSK بدون تفاعل العميل.
          2. هجوم PMKID — الحزمة الأولى من المصافحة الرباعية تحتوي
             على هاش PMKID، قابل للكسر غير المتصل بـ hashcat -m 22000.
             لا حاجة لـ deauth، لا حاجة لعميل.
          3. التقاط المصافحة الرباعية — إطارات EAPOL قابلة للالتقاط
             بـ airodump-ng + deauth، ثم هجوم قاموس غير متصل.
          الأولوية: تعطيل WPS فوراً (أعلى خطر)، فرض PSK قوي
          من 20+ حرف، التفكير في الانتقال إلى WPA3-SAE."
```

### تحليل Bluetooth و BLE

```
أنت: "ما المخاطر الأمنية لنظام التحكم بالوصول القائم على BLE الخاص بنا؟"

الوكيل: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "نظام التحكم بالوصول عبر BLE — تم تحديد 4 مخاطر حرجة:
          1. اقتران JustWorks — لا حماية ضد MITM. يمكن للمهاجم
             اعتراض الاقتران بـ Ubertooth One (MITRE T1040).
          2. التنصت على خصائص GATT — أوامر الفتح تُرسل بنص
             واضح، قابلة للإعادة بـ gatttool (MITRE T1212).
          3. هجوم إعادة/ترحيل BLE — ترحيل إشارة الفتح الشرعية
             باستخدام جهازين + btlejack (MITRE T1557).
          4. تتبع عنوان MAC — عنوان BLE MAC الثابت يتيح
             تتبع الأشخاص (MITRE T1592.002).
          مُوصى به: فرض LE Secure Connections (LESC) مع المقارنة
          الرقمية، تشفير خصائص GATT، تطبيق nonces متغيرة
          للحماية من هجمات الإعادة."
```

### تدقيق إنترنت الأشياء اللاسلكي

```
أنت: "قيّم أمن الشبكات اللاسلكية لنشر إنترنت الأشياء في مبنانا الذكي"

الوكيل: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "تقييم لاسلكي لإنترنت الأشياء في المبنى الذكي — 5 نتائج:
          1. Zigbee: مفتاح ربط مركز الثقة الافتراضي (ZigBeeAlliance09)
             يسمح باعتراض الانضمام للشبكة بـ KillerBee (حرج)
          2. MQTT: الوسيط على المنفذ 1883 بدون TLS — بيانات الاعتماد
             وبيانات المستشعرات تُنقل بنص واضح
          3. Z-Wave: أمان S0 مع ثغرة معروفة في تبادل المفاتيح
             — يُوصى بالترقية إلى S2
          4. MouseJack: 3 مستقبلات Logitech Unifying عرضة
             لحقن ضغطات المفاتيح (CVE-2016-10761)
          5. WiFi: أجهزة إنترنت الأشياء على نفس VLAN مع الشبكة
             المؤسسية — لا يوجد تقسيم شبكي
          أولوية الإصلاح: MQTT TLS، أكواد تثبيت Zigbee،
          عزل VLAN لإنترنت الأشياء، استبدال مستقبلات Logitech المعرضة."
```

### تدقيق الامتثال

```
أنت: "تحقق من شبكة WiFi في مستشفانا مقابل متطلبات HIPAA اللاسلكية"

الوكيل: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "تدقيق الامتثال اللاسلكي لـ HIPAA — 6 نتائج:
          3 ضوابط غير متوافقة:
          - 164.312(a)(1): لا يوجد نظام كشف تسلل لاسلكي للكشف عن نقاط الوصول المارقة
          - 164.312(e)(1): الأجهزة الطبية تستخدم WPA2-PSK (وليس Enterprise)
          - 164.312(e)(2): لا يوجد تسجيل تدقيق لتشفير حركة المرور اللاسلكية
          3 ضوابط متوافقة:
          - 164.310(a)(1): مواقع نقاط الوصول الفعلية موثقة
          - 164.312(a)(2): 802.1X مع مصادقة RADIUS
          - 164.312(d): EAP-TLS القائم على الشهادات لأجهزة الموظفين
          خطة الإصلاح: نشر WIDS (Kismet/AirMagnet)، ترحيل
          الأجهزة الطبية إلى WPA2-Enterprise مع MAB، تفعيل تسجيل
          التدقيق اللاسلكي على وحدة التحكم WLAN."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; بدون مفتاح API</b></summary>

| الأداة | الوصف |
|------|-------------|
| `scan_wifi_networks` | مسح وتحليل شبكات WiFi &mdash; اكتشاف SSIDs والقنوات وأنواع التشفير وقوة الإشارة وسوء إعدادات الأمان |
| `analyze_wifi_security` | تحليل عميق لإعدادات أمان WiFi &mdash; قوة التشفير وطريقة المصادقة ونقاط الضعف المعروفة وسطح الهجوم |
| `find_wifi_attacks` | العثور على الهجمات المطبقة لهدف WiFi &mdash; يُرجع منهجية الهجوم والأدوات المطلوبة وربط MITRE ATT&CK والتخفيفات |
| `simulate_evil_twin` | محاكاة وتحليل سيناريوهات هجوم نقطة الوصول التوأم الشريرة &mdash; إعداد hostapd-mana والبوابة المقيدة ومنهجية التقاط بيانات الاعتماد |
| `analyze_deauth` | تحليل متجهات هجمات إلغاء المصادقة &mdash; حالة 802.11w PMF وكشف إلغاء المصادقة والتدابير المضادة وتكامل WIDS |
| `crack_wps` | تحليل متجهات هجمات كسر WPS &mdash; Pixie Dust والقوة الغاشمة وPIN الفارغ وتوليد PIN الافتراضي ومنهجية Reaver/Bully |
| `analyze_pmkid` | تحليل متجهات الهجوم القائمة على PMKID &mdash; كسر WPA/WPA2 بدون عميل عبر hcxdumptool + hashcat mode 22000 |
| `audit_wifi67` | تدقيق ميزات أمان WiFi 6 (802.11ax) وWiFi 7 (802.11be) &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; بدون مفتاح API</b></summary>

| الأداة | الوصف |
|------|-------------|
| `scan_bluetooth` | مسح وتحليل أجهزة Bluetooth &mdash; اكتشاف BR/EDR الكلاسيكي وBLE وتعداد الخدمات وتحليل الاقتران |
| `find_bluetooth_attacks` | العثور على هجمات Bluetooth المطبقة &mdash; BlueBorne, KNOB, BIAS, ترحيل BLE, MITM، مع الأدوات والتخفيفات |
| `analyze_ble` | تحليل عميق لأمان BLE &mdash; خدمات GATT وطرق الاقتران وLE Secure Connections وتشفير الخصائص |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; بدون مفتاح API</b></summary>

| الأداة | الوصف |
|------|-------------|
| `analyze_rf_signal` | تحليل أمان إشارة RF &mdash; تحليل التردد وتحديد التعديل وجدوى هجوم الإعادة وتوصيات أدوات SDR |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; بدون مفتاح API</b></summary>

| الأداة | الوصف |
|------|-------------|
| `analyze_nfc_security` | تحليل أمان NFC/RFID &mdash; تحديد نوع البطاقة ونقاط ضعف التحكم بالوصول وجدوى الاستنساخ ومنهجية Proxmark3 |

</details>

<details>
<summary><b>الشبكات الخلوية/5G (1) &mdash; بدون مفتاح API</b></summary>

| الأداة | الوصف |
|------|-------------|
| `analyze_cellular_security` | تحليل أمان الشبكات الخلوية &mdash; نقاط ضعف بروتوكولات 2G/3G/4G/5G وكشف IMSI catcher وتحليل المحطة القاعدية المزيفة |

</details>

<details>
<summary><b>إنترنت الأشياء اللاسلكي (3) &mdash; بدون مفتاح API</b></summary>

| الأداة | الوصف |
|------|-------------|
| `analyze_zigbee` | تحليل أمان شبكة Zigbee &mdash; سياسة مركز الثقة وإدارة مفاتيح الشبكة ومنهجية هجوم KillerBee |
| `scan_iot_wireless` | مسح بروتوكولات إنترنت الأشياء اللاسلكية &mdash; اكتشاف وتحليل ثغرات Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP |
| `find_mousejack` | تحليل ثغرات لوحة المفاتيح/الماوس اللاسلكية MouseJack &mdash; حقن ضغطات المفاتيح وHID غير المشفر والتجاوزات الخاصة بالشركة المصنعة |

</details>

<details>
<summary><b>لاسلكي متقدم (6) &mdash; بدون مفتاح API</b></summary>

| الأداة | الوصف |
|------|-------------|
| `analyze_airgap` | تحليل تقنيات تسريب البيانات عبر الفجوة الهوائية &mdash; القنوات السرية الكهرومغناطيسية والصوتية والحرارية والبصرية والتدابير المضادة |
| `analyze_uwb` | تحليل أمان النطاق فائق العرض (UWB) &mdash; التلاعب بالقياس والهجمات الترحيلية على مفاتيح السيارات وAirTags والاحتيال بالمسافة |
| `analyze_wifi_csi` | تحليل أمان معلومات حالة قناة WiFi (CSI) &mdash; الاستشعار السلبي والتعرف على النشاط ومخاطر استنتاج ضغطات المفاتيح |
| `analyze_miracast` | تحليل أمان Miracast/WiFi Display &mdash; اختطاف جلسة WFD والتقاط الشاشة والوصول غير المصرح به إلى العرض |
| `analyze_wifi_direct` | تحليل أمان WiFi Direct (P2P) &mdash; هجمات التفاوض على مالك المجموعة وثغرات WPS في P2P وتشكيل مجموعة مارقة |
| `analyze_drone_rf` | تحليل أمان ترددات الطائرات بدون طيار &mdash; اختطاف رابط التحكم وتزوير GPS واعتراض رابط الفيديو الهابط وتقنيات مكافحة UAS |

</details>

<details>
<summary><b>البنية التحتية (4) &mdash; بدون مفتاح API (KISMET_* اختياري لـ WIDS المباشر)</b></summary>

| الأداة | الوصف |
|------|-------------|
| `audit_wlan_controller` | تدقيق إعداد وحدة التحكم WLAN &mdash; إعدادات أمان Cisco WLC, Aruba, Meraki وسياسات نقاط الوصول المارقة وإدارة RF |
| `analyze_captive_portal` | تحليل أمان البوابة المقيدة &mdash; تقنيات التجاوز ومخاطر جمع بيانات الاعتماد وعزل الشبكة وأمان VLAN الضيف |
| `detect_mac_randomization` | تحليل عشوائية عنوان MAC &mdash; اختلافات تطبيق iOS/Android/Windows ومقاومة التتبع وتجاوزات البصمة |
| `analyze_hotspot20` | تحليل أمان Hotspot 2.0 (Passpoint) &mdash; ANQP, OSU، مخاطر اختيار الشبكة التلقائي، تحليل طريقة EAP |

</details>

<details>
<summary><b>الاستخبارات (4) &mdash; بدون مفتاح API</b></summary>

| الأداة | الوصف |
|------|-------------|
| `lookup_wireless_cve` | البحث عن ثغرات CVE الخاصة بالشبكات اللاسلكية &mdash; ثغرات شرائح WiFi وCVE لمكدس Bluetooth واستغلالات التعريفات وأخطاء البرامج الثابتة |
| `lookup_hardware` | البحث عن أجهزة أمان الشبكات اللاسلكية &mdash; محولات WiFi ومتنصتات Bluetooth وأجهزة SDR والقدرات وتوافق الشرائح |
| `map_wireless_attck` | ربط الهجمات اللاسلكية بإطار MITRE ATT&CK &mdash; معرّفات التقنية وفئات التكتيك واستراتيجيات الكشف |
| `analyze_medical_wireless` | تحليل أمان الأجهزة الطبية اللاسلكية &mdash; مضخات التسريب وأجهزة تنظيم ضربات القلب وأجهزة مراقبة المرضى وإرشادات FDA ومتطلبات HIPAA |

</details>

<details>
<summary><b>الكشف (2) &mdash; بدون مفتاح API</b></summary>

| الأداة | الوصف |
|------|-------------|
| `detect_wireless_attack` | كشف الهجمات اللاسلكية الجارية &mdash; فيضانات إلغاء المصادقة والتوأم الشرير وKARMA ونقاط الوصول المارقة وتزوير BLE ومؤشرات تشويش RF |
| `audit_wireless_compliance` | تدقيق الشبكة اللاسلكية مقابل أطر الامتثال &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, ISO 27001 ضوابط لاسلكية |

</details>

<details>
<summary><b>التقارير (1) &mdash; بدون مفتاح API</b></summary>

| الأداة | الوصف |
|------|-------------|
| `export_report` | تصدير تقرير تقييم أمان الشبكات اللاسلكية &mdash; النتائج وتصنيفات المخاطر وحالة الامتثال وخارطة طريق الإصلاح والملخص التنفيذي |

</details>

---

### CLI Usage

```bash
# عرض جميع الأدوات المتاحة
npx wifi-security-mcp-server --list

# تشغيل أي أداة مباشرة
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

يأتي الخادم مع 9 قواعد معرفية مدمجة &mdash; بدون مفاتيح API، بدون تبعيات خارجية، بدون حدود للطلبات. كل استعلام أداة يُثرى بذكاء منظم من هذه القواعد.

| قاعدة المعرفة | الإدخالات | ما توفره |
|----------------|---------|-----------------|
| **هجمات WiFi** | 47 هجوم | تقنيات هجوم WPA/WPA2/WPA3، متغيرات التوأم الشرير، PMKID, KRACK, FragAttacks، إلغاء المصادقة، استغلالات WPS &mdash; كل منها مع الأدوات والتخفيفات وربط MITRE ATT&CK |
| **هجمات Bluetooth** | 8 هجمات | BlueBorne, KNOB, BIAS، ترحيل BLE, MITM، تشويش BLE، انتحال Bluetooth &mdash; مع CVE واستراتيجيات الكشف |
| **هجمات RF/SDR** | 6 هجمات | هجمات الإعادة والتشويش وحقن الإشارة والاعتراض بالـ SDR وتجاوز بصمة RF وتقنيات تحليل الطيف |
| **هجمات NFC/RFID** | 6 هجمات | استنساخ البطاقات وهجمات الترحيل وكسر MIFARE Classic والتنصت على NFC وتشويش RFID وتجاوز التحكم بالوصول بـ Proxmark3 |
| **هجمات الشبكات الخلوية** | 6 هجمات | التقاط IMSI والمحطة القاعدية المزيفة (Stingray) واستغلال SS7 وثغرات 5G NAS وهجمات التخفيض واعتراض VoLTE |
| **هجمات إنترنت الأشياء** | 6 هجمات | التنصت على مفتاح شبكة Zigbee وتخفيض Z-Wave S0 وجمع بيانات اعتماد MQTT وإعادة LoRaWAN ABP وMouseJack وترحيل BLE IoT |
| **قاعدة بيانات الأجهزة** | 12 جهاز | محولات WiFi (Alfa, TP-Link)، متنصتات Bluetooth (Ubertooth)، SDR (HackRF, RTL-SDR)، NFC (Proxmark3) &mdash; الشرائح والقدرات ودعم وضع المراقبة |
| **قاعدة بيانات CVE** | 17 CVE | ثغرات CVE خاصة بالشبكات اللاسلكية لشرائح WiFi (Broadcom, Qualcomm, Intel) ومكدسات Bluetooth والبرامج الثابتة لإنترنت الأشياء &mdash; الخطورة والإصدارات المتأثرة وتوفر الاستغلال |
| **أطر الامتثال** | 5 أطر | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; ضوابط خاصة بالشبكات اللاسلكية وقوائم تدقيق وتحليل الفجوات |

---

## Architecture

```
src/
  index.ts                    # نقطة دخول CLI (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # إعداد خادم MCP (نقل stdio)
    tools.ts                  # سجل الأدوات — جميع الأدوات المركبة الـ 34 مُجمّعة هنا
  types/
    index.ts                  # الأنواع المشتركة (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 قواعد معرفية مدمجة
    wifi-attacks.ts           # 47 تعريف هجوم WiFi
    bluetooth-attacks.ts      # 8 تعريفات هجوم Bluetooth
    rf-attacks.ts             # 6 تعريفات هجوم RF/SDR
    nfc-attacks.ts            # 6 تعريفات هجوم NFC/RFID
    cellular-attacks.ts       # 6 تعريفات هجوم الشبكات الخلوية/5G
    iot-attacks.ts            # 6 تعريفات هجوم إنترنت الأشياء
    hardware.ts               # 12 ملف تعريف جهاز
    cve-database.ts           # 17 ثغرة CVE لاسلكية
    compliance.ts             # 5 أطر امتثال
  wifi/                       # أدوات WiFi الأساسية (8)
  bluetooth/                  # أدوات Bluetooth (3)
  rf/                         # أدوات RF/SDR (1)
  nfc/                        # أدوات NFC/RFID (1)
  cellular/                   # أدوات الشبكات الخلوية/5G (1)
  iot/                        # أدوات إنترنت الأشياء اللاسلكي (3)
  advanced/                   # أدوات لاسلكية متقدمة (6)
  infrastructure/             # أدوات البنية التحتية (4)
  intelligence/               # أدوات الاستخبارات (4)
  detection/                  # أدوات الكشف (2)
  reporting/                  # أدوات التقارير (1)
```

**قرارات التصميم:**

- **مدفوع بقواعد المعرفة** &mdash; على عكس الأدوات المعتمدة على API، تعمل الوظائف الأساسية بالكامل دون اتصال من 9 قواعد بيانات مدمجة. بدون مفاتيح API، بدون حدود للطلبات، بدون تبعيات خارجية لسير العمل الأساسي.
- **34 أداة مركّبة، 139 قدرة فردية** &mdash; كل أداة هي مُركّب يجمع التحليلات ذات الصلة. `find_wifi_attacks` لا يسرد الهجمات فقط &mdash; بل يُرجع المنهجية والأجهزة المطلوبة وربط MITRE ATT&CK واستراتيجيات الكشف والتدابير المضادة.
- **تبعيتان فقط في وقت التشغيل** &mdash; `@modelcontextprotocol/sdk` و`zod`. لا شيء آخر. لا وحدات أصلية، لا تبعيات ثنائية، لا كود خاص بالمنصة.
- **تكامل مباشر اختياري** &mdash; WiGLE API لبيانات الشبكة الحقيقية، Kismet لنظام كشف التسلل اللاسلكي المباشر. التحليل الأساسي يعمل بدون أي منهما.
- **واعٍ بالامتثال** &mdash; كل نتيجة تُربط تلقائياً بأطر الامتثال ذات الصلة (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) عند الاقتضاء.
- **مُربط بـ MITRE ATT&CK** &mdash; تقنيات الهجوم تتضمن معرّفات تقنيات ATT&CK وفئات التكتيك ومصادر بيانات الكشف لتكامل SOC.

---

## Limitations

- قواعد المعرفة هي لقطات زمنية &mdash; الهجمات/الثغرات الجديدة تتطلب تحديثات الحزمة
- تكامل WiGLE يتطلب مفتاح API مجاني للبحث عن الشبكات
- Kismet WIDS المباشر يتطلب نسخة Kismet تعمل مع وصول API
- لا إرسال لاسلكي نشط &mdash; الخادم يوفر الاستخبارات والمنهجية، وليس حقن الحزم
- قاعدة بيانات الأجهزة تغطي أكثر أجهزة أبحاث الأمان شيوعاً، وليست شاملة
- أطر الامتثال تركز على الضوابط الخاصة بالشبكات اللاسلكية، وليس التغطية الكاملة للإطار
- تم الاختبار على macOS / Linux (لم يتم اختبار Windows)

---

## Part of the MCP Security Suite

| المشروع | المجال | الأدوات |
|---|---|---|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | اختبار الأمان عبر المتصفح | 39 أداة، Firefox، اختبار الحقن |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | أمان السحابة (AWS/Azure/GCP) | 38 أداة، أكثر من 60 فحص |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | الوضع الأمني لـ GitHub | 39 أداة، 45 فحص |
| [cve-mcp](https://github.com/badchars/cve-mcp) | استخبارات الثغرات | 23 أداة، 5 مصادر |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT والاستطلاع | 37 أداة، 12 مصدر |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | الويب المظلم واستخبارات التهديدات | 66 أداة، 16 مصدر |
| **wifi-security-mcp-server** | **استخبارات أمن الشبكات اللاسلكية** | **34 أداة، 9 قواعد معرفية** |

---

<p align="center">
<b>لاختبار وتقييم الأمان المصرّح به فقط.</b><br>
تأكد دائماً من حصولك على التفويض المناسب قبل إجراء اختبار أمان الشبكات اللاسلكية على أي شبكة أو جهاز.<br>
الوصول غير المصرّح به إلى الشبكات اللاسلكية أو التداخل معها غير قانوني في معظم الولايات القضائية.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

</div>

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
  <strong>ไทย</strong> |
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

<h3 align="center">ระบบข่าวกรองด้านความปลอดภัยไร้สายสำหรับเอเจนต์ AI</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, เซลลูลาร์/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drone RF, WIDS/WIPS, การปฏิบัติตามข้อกำหนด &mdash; รวมเป็นหนึ่งเดียวในเซิร์ฟเวอร์ MCP เดียว<br>
  เอเจนต์ AI ของคุณจะได้รับ<b>การวิเคราะห์ความปลอดภัยไร้สายครอบคลุมทุกสเปกตรัมตามความต้องการ</b> ขับเคลื่อนด้วยฐานความรู้ในตัว 9 ฐานที่ครอบคลุมเครื่องมือเดี่ยว 139 รายการ
</p>

<br>

<p align="center">
  <a href="#the-problem">ปัญหา</a> &bull;
  <a href="#how-its-different">แตกต่างอย่างไร</a> &bull;
  <a href="#quick-start">เริ่มต้นอย่างรวดเร็ว</a> &bull;
  <a href="#what-the-ai-can-do">AI ทำอะไรได้บ้าง</a> &bull;
  <a href="#tools-reference-34-composite-tools">เครื่องมือ (34)</a> &bull;
  <a href="#knowledge-bases-9">ฐานความรู้</a> &bull;
  <a href="#architecture">สถาปัตยกรรม</a> &bull;
  <a href="CHANGELOG.md">Changelog</a> &bull;
  <a href="CONTRIBUTING.md">มีส่วนร่วม</a>
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

การประเมินความปลอดภัยไร้สายเป็นหนึ่งในสาขาที่กระจัดกระจายที่สุดในด้านความปลอดภัยเชิงรุก การตรวจสอบ WiFi ต้องใช้ชุดเครื่องมือหนึ่ง Bluetooth อีกชุดหนึ่ง RF/SDR อีกชุดหนึ่ง โปรโตคอล IoT อีกชุดหนึ่ง &mdash; และแต่ละโดเมนมีพื้นผิวการโจมตีเป็นของตัวเอง ช่องโหว่เป็นของตัวเอง ข้อกำหนดการปฏิบัติตามเป็นของตัวเอง ปัจจุบันคุณรัน aircrack-ng สำหรับ WPA ใช้ Bettercap สำหรับ BLE เปิด HackRF สำหรับ SDR ค้นหาฐานข้อมูล CVE ต่างกันสำหรับแต่ละชิปเซ็ต อ้างอิง NIST และ PCI-DSS แยกกัน แล้วใช้เวลาหลายชั่วโมงเชื่อมโยงผลการค้นพบด้วยตนเองให้เป็นการประเมินที่สอดคล้องกัน

```
ขั้นตอนการทำงานด้านความปลอดภัยไร้สายแบบดั้งเดิม:
  ตรวจสอบเครือข่าย WiFi            ->  aircrack-ng / Wireshark / Kismet
  ทดสอบความปลอดภัย Bluetooth       ->  Bettercap / btlejack / Ubertooth
  วิเคราะห์สัญญาณ RF               ->  HackRF / GNU Radio / GQRX
  ตรวจสอบ NFC/RFID                 ->  Proxmark3 / libnfc
  ประเมินความปลอดภัยเซลลูลาร์       ->  srsRAN / OpenBTS
  ทดสอบโปรโตคอล IoT                ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  ค้นหา CVE ไร้สาย                  ->  NVD / vendor advisories (ค้นหาด้วยตนเอง)
  ตรวจสอบการปฏิบัติตาม              ->  NIST / PCI-DSS / HIPAA docs (ด้วยตนเอง)
  แมปไปยัง MITRE ATT&CK             ->  ATT&CK Navigator (แมปด้วยตนเอง)
  เชื่อมโยงทุกอย่าง                  ->  คัดลอกวางลงในรายงาน
  ────────────────────────────────
  รวม: หลายชั่วโมงต่อการประเมิน ส่วนใหญ่เป็นการสลับบริบทระหว่างเครื่องมือ
```

**wifi-security-mcp-server** มอบเครื่องมือผสม 34 ตัวที่สนับสนุนด้วยฐานความรู้ 9 ฐานครอบคลุมความสามารถเดี่ยว 139 รายการผ่าน [Model Context Protocol](https://modelcontextprotocol.io) ให้กับเอเจนต์ AI ของคุณ เอเจนต์วิเคราะห์เครือข่าย ระบุช่องโหว่ แมปการโจมตีไปยัง MITRE ATT&CK ตรวจสอบการปฏิบัติตาม และสร้างรายงานที่ดำเนินการได้ &mdash; ในการสนทนาเดียว

```
ด้วย wifi-security-mcp-server:
  คุณ: "ตรวจสอบความปลอดภัยไร้สายของเครือข่ายสำนักงานที่ใช้ WPA2-Enterprise"

  เอเจนต์: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "เครือข่าย WPA2-Enterprise ของคุณมีการค้นพบวิกฤต 3 รายการ:
            1. EAP-PEAP โดยไม่มี certificate pinning — เสี่ยงต่อ evil twin
               ด้วย hostapd-mana (MITRE T1557.002)
            2. ไม่มี 802.11w (PMF) — อ่อนไหวต่อการโจมตี deauthentication
               (MITRE T1498.001)
            3. แฮช PMKID สามารถดึงได้โดยไม่ต้องมีปฏิสัมพันธ์กับไคลเอนต์ —
               สามารถ crack แบบออฟไลน์ด้วย hashcat mode 22000
            PCI-DSS 4.0: 2 controls ไม่ผ่าน (4.2.1, 11.2.1)
            แนะนำ: ย้ายไปใช้ WPA3-Enterprise พร้อม SAE เปิดใช้ PMF
            ติดตั้ง WIDS สำหรับตรวจจับ rogue AP"
```

---

## How It's Different

เครื่องมือที่มีอยู่ให้การจับแพ็กเก็ตดิบและการวิเคราะห์เฉพาะโปรโตคอล wifi-security-mcp-server มอบความสามารถให้เอเจนต์ AI ของคุณ**ใช้เหตุผลข้ามทุกโดเมนไร้สายพร้อมกัน**พร้อมการสนับสนุนจากฐานความรู้เชิงลึก

<table>
<thead>
<tr>
<th></th>
<th>วิธีการแบบดั้งเดิม</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>อินเทอร์เฟซ</b></td>
<td>CLI, GUI และเครื่องมือฮาร์ดแวร์ต่างกันมากกว่า 10 ตัว</td>
<td>MCP &mdash; เอเจนต์ AI เรียกใช้เครื่องมือแบบสนทนา</td>
</tr>
<tr>
<td><b>ความครอบคลุม</b></td>
<td>ทีละโปรโตคอล</td>
<td>WiFi, Bluetooth, RF, NFC, เซลลูลาร์, IoT &mdash; ทั้งหมดในเซิร์ฟเวอร์เดียว</td>
</tr>
<tr>
<td><b>ความรู้</b></td>
<td>ค้นหา CVE ด้วยตนเอง แมป ATT&CK ด้วยตนเอง</td>
<td>ฐานความรู้ในตัว 9 ฐานพร้อมรายการที่แมปไว้ล่วงหน้า 139 รายการ</td>
</tr>
<tr>
<td><b>ข่าวกรองการโจมตี</b></td>
<td>ค้นหา Google + บล็อกโพสต์ + การบรรยายในงานประชุม</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 เซลลูลาร์ + 6 IoT การโจมตีที่จัดหมวดหมู่พร้อมเครื่องมือ การบรรเทา ATT&CK IDs</td>
</tr>
<tr>
<td><b>การปฏิบัติตาม</b></td>
<td>อ่าน PDF NIST/PCI-DSS/HIPAA แมป controls ด้วยตนเอง</td>
<td>เอเจนต์ตรวจสอบเทียบกับ 5 เฟรมเวิร์กการปฏิบัติตามโดยอัตโนมัติ</td>
</tr>
<tr>
<td><b>API keys</b></td>
<td>บัญชีต่างๆ สำหรับบริการต่างๆ</td>
<td>ไม่ต้องใช้ API key สำหรับฟังก์ชันหลัก &mdash; ขับเคลื่อนด้วยฐานความรู้</td>
</tr>
<tr>
<td><b>การติดตั้ง</b></td>
<td>ติดตั้ง aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; คำสั่งเดียว ไม่ต้องตั้งค่า</td>
</tr>
</tbody>
</table>

---

## Quick Start

### ตัวเลือกที่ 1: npx (ไม่ต้องติดตั้ง)

```bash
npx wifi-security-mcp-server
```

เครื่องมือทั้ง 34 ตัวใช้งานได้ทันที ไม่ต้องใช้ API key &mdash; ฟังก์ชันหลักขับเคลื่อนด้วยฐานความรู้

### ตัวเลือกที่ 2: Clone

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### ตัวแปรสภาพแวดล้อม (ไม่บังคับ)

```bash
# WiGLE — ฐานข้อมูล wardriving สำหรับค้นหาเครือข่าย WiFi ในโลกจริง
export WIGLE_API_KEY=your-key

# Kismet — ตรวจจับการบุกรุกไร้สายแบบเรียลไทม์
export KISMET_HOST=127.0.0.1      # ค่าเริ่มต้น: 127.0.0.1
export KISMET_PORT=2501           # ค่าเริ่มต้น: 2501
export KISMET_API_KEY=your-key
```

API key ทั้งหมดเป็นตัวเลือก หากไม่มี คุณยังสามารถเข้าถึงเครื่องมือทั้ง 34 ตัวที่ขับเคลื่อนด้วยฐานความรู้ในตัว 9 ฐานที่ครอบคลุมการโจมตี WiFi การโจมตี Bluetooth RF/SDR NFC/RFID เซลลูลาร์ IoT ฐานข้อมูลฮาร์ดแวร์ ข่าวกรอง CVE และเฟรมเวิร์กการปฏิบัติตาม

### เชื่อมต่อกับเอเจนต์ AI ของคุณ

<details open>
<summary><b>Claude Code</b></summary>

```bash
# ด้วย npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# ด้วย clone ในเครื่อง
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

เพิ่มลงใน `~/Library/Application Support/Claude/claude_desktop_config.json`:

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
<summary><b>Cursor / Windsurf / ไคลเอนต์ MCP อื่นๆ</b></summary>

รูปแบบการตั้งค่า JSON เหมือนกัน ชี้คำสั่งไปที่ `npx wifi-security-mcp-server` หรือเส้นทางการติดตั้งในเครื่องของคุณ

</details>

### เริ่มสอบถาม

```
คุณ: "การโจมตีอะไรบ้างที่เป็นไปได้กับเครือข่าย WPA3-SAE และจะทดสอบอย่างไร?"
```

เท่านี้เอง เอเจนต์ค้นหาการโจมตี แมปไปยัง MITRE ATT&CK แนะนำเครื่องมือ และให้วิธีการทีละขั้นตอน &mdash; ทั้งหมดจากฐานความรู้ในตัว

---

## What The AI Can Do

### การประเมินความปลอดภัย WiFi

```
คุณ: "วิเคราะห์ความปลอดภัยของเครือข่าย WPA2-PSK ที่เปิด WPS"

เอเจนต์: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "พบช่องโหว่วิกฤตในการตั้งค่า WPA2-PSK + WPS:
          1. การโจมตี WPS Pixie Dust — สามารถกู้คืน PIN ได้ในไม่กี่วินาที
             ผ่านการ brute-force ออฟไลน์ของ nonces E-S1/E-S2 (Reaver + PixieWPS)
             กู้คืน PSK ได้เต็มรูปแบบโดยไม่ต้องมีปฏิสัมพันธ์กับไคลเอนต์
          2. การโจมตี PMKID — แพ็กเก็ตแรกของ 4-way handshake มี
             แฮช PMKID สามารถ crack ออฟไลน์ด้วย hashcat -m 22000
             ไม่ต้อง deauth ไม่ต้องมีไคลเอนต์
          3. การจับ 4-Way Handshake — เฟรม EAPOL สามารถจับได้ด้วย
             airodump-ng + deauth จากนั้นโจมตีด้วยพจนานุกรมออฟไลน์
          ลำดับความสำคัญ: ปิด WPS ทันที (ความเสี่ยงสูงสุด) บังคับใช้
          PSK ที่แข็งแกร่ง 20+ ตัวอักษร พิจารณาย้ายไปใช้ WPA3-SAE"
```

### การวิเคราะห์ Bluetooth & BLE

```
คุณ: "ความเสี่ยงด้านความปลอดภัยของระบบควบคุมการเข้าถึงที่ใช้ BLE มีอะไรบ้าง?"

เอเจนต์: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "ระบบควบคุมการเข้าถึง BLE — ระบุความเสี่ยงวิกฤต 4 รายการ:
          1. การจับคู่ JustWorks — ไม่มีการป้องกัน MITM ผู้โจมตีสามารถ
             ดักจับการจับคู่ด้วย Ubertooth One (MITRE T1040)
          2. การดักฟัง GATT Characteristic — คำสั่งปลดล็อกส่งแบบ
             ข้อความธรรมดา สามารถ replay ด้วย gatttool (MITRE T1212)
          3. การโจมตี BLE Relay/Replay — ส่งต่อสัญญาณปลดล็อกที่ถูกต้อง
             โดยใช้อุปกรณ์สองตัว + btlejack (MITRE T1557)
          4. การติดตามที่อยู่ MAC — MAC BLE แบบคงที่ทำให้สามารถ
             ติดตามผู้ใช้ได้ (MITRE T1592.002)
          แนะนำ: บังคับใช้ LE Secure Connections (LESC) พร้อม
          Numeric Comparison เข้ารหัส GATT characteristics ใช้งาน
          rolling nonces สำหรับการป้องกัน replay"
```

### การตรวจสอบ IoT ไร้สาย

```
คุณ: "ประเมินความปลอดภัยไร้สายของการติดตั้ง IoT ในอาคารอัจฉริยะ"

เอเจนต์: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "การประเมินไร้สาย IoT อาคารอัจฉริยะ — 5 การค้นพบ:
          1. Zigbee: คีย์ลิงก์ศูนย์ความเชื่อถือเริ่มต้น (ZigBeeAlliance09)
             ทำให้สามารถดักจับการเข้าร่วมเครือข่ายด้วย KillerBee (วิกฤต)
          2. MQTT: Broker บนพอร์ต 1883 โดยไม่มี TLS — ข้อมูลรับรอง
             และข้อมูลเซ็นเซอร์ส่งแบบข้อความธรรมดา
          3. Z-Wave: ความปลอดภัย S0 มีช่องโหว่การแลกเปลี่ยนคีย์
             ที่ทราบ — แนะนำให้อัปเกรดเป็น S2
          4. MouseJack: ตัวรับ Logitech Unifying 3 ตัวเสี่ยงต่อ
             การฉีดคีย์สโตรก (CVE-2016-10761)
          5. WiFi: อุปกรณ์ IoT อยู่บน VLAN เดียวกับเครือข่าย
             องค์กร — ไม่มีการแบ่งส่วนเครือข่าย
          การแก้ไขตามลำดับความสำคัญ: MQTT TLS, install codes Zigbee,
          แยก VLAN IoT, เปลี่ยนตัวรับ Logitech ที่มีช่องโหว่"
```

### การตรวจสอบการปฏิบัติตาม

```
คุณ: "ตรวจสอบ WiFi โรงพยาบาลของเราเทียบกับข้อกำหนดไร้สาย HIPAA"

เอเจนต์: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "การตรวจสอบการปฏิบัติตาม HIPAA ไร้สาย — 6 การค้นพบ:
          3 controls ไม่ผ่าน:
          - 164.312(a)(1): ไม่มี IDS ไร้สายที่ติดตั้งสำหรับตรวจจับ rogue AP
          - 164.312(e)(1): อุปกรณ์การแพทย์ใช้ WPA2-PSK (ไม่ใช่ Enterprise)
          - 164.312(e)(2): ไม่มีบันทึกการตรวจสอบการเข้ารหัสทราฟฟิกไร้สาย
          3 controls ผ่าน:
          - 164.310(a)(1): บันทึกตำแหน่งทางกายภาพของ AP
          - 164.312(a)(2): 802.1X พร้อมการยืนยันตัวตน RADIUS
          - 164.312(d): EAP-TLS บนใบรับรองสำหรับอุปกรณ์พนักงาน
          แผนการแก้ไข: ติดตั้ง WIDS (Kismet/AirMagnet) ย้ายอุปกรณ์
          การแพทย์ไปใช้ WPA2-Enterprise พร้อม MAB เปิดใช้บันทึก
          การตรวจสอบไร้สายบนตัวควบคุม WLAN"
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; ไม่ต้องใช้ API key</b></summary>

| เครื่องมือ | คำอธิบาย |
|-----------|----------|
| `scan_wifi_networks` | สแกนและวิเคราะห์เครือข่าย WiFi &mdash; ค้นหา SSID ช่อง ประเภทการเข้ารหัส ความแรงของสัญญาณ และการตั้งค่าความปลอดภัยที่ผิดพลาด |
| `analyze_wifi_security` | วิเคราะห์การตั้งค่าความปลอดภัย WiFi เชิงลึก &mdash; ความแข็งแกร่งของการเข้ารหัส วิธีการยืนยันตัวตน จุดอ่อนที่ทราบ พื้นผิวการโจมตี |
| `find_wifi_attacks` | ค้นหาการโจมตีที่ใช้ได้สำหรับเป้าหมาย WiFi &mdash; ส่งคืนวิธีการโจมตี เครื่องมือที่ต้องการ การแมป MITRE ATT&CK การบรรเทา |
| `simulate_evil_twin` | จำลองและวิเคราะห์สถานการณ์การโจมตี evil twin AP &mdash; การตั้งค่า hostapd-mana พอร์ทัลจำลอง วิธีการจับข้อมูลรับรอง |
| `analyze_deauth` | วิเคราะห์เวกเตอร์การโจมตี deauthentication &mdash; สถานะ 802.11w PMF การตรวจจับ deauth มาตรการตอบโต้ การรวม WIDS |
| `crack_wps` | วิเคราะห์เวกเตอร์การโจมตี WPS cracking &mdash; Pixie Dust, brute force, null PIN, การสร้าง PIN เริ่มต้น, วิธีการ Reaver/Bully |
| `analyze_pmkid` | วิเคราะห์เวกเตอร์การโจมตีบน PMKID &mdash; cracking WPA/WPA2 โดยไม่ต้องมีไคลเอนต์ผ่าน hcxdumptool + hashcat mode 22000 |
| `audit_wifi67` | ตรวจสอบคุณสมบัติความปลอดภัยเฉพาะของ WiFi 6 (802.11ax) และ WiFi 7 (802.11be) &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; ไม่ต้องใช้ API key</b></summary>

| เครื่องมือ | คำอธิบาย |
|-----------|----------|
| `scan_bluetooth` | สแกนและวิเคราะห์อุปกรณ์ Bluetooth &mdash; ค้นหา BR/EDR คลาสสิกและ BLE ระบุบริการ วิเคราะห์การจับคู่ |
| `find_bluetooth_attacks` | ค้นหาการโจมตี Bluetooth ที่ใช้ได้ &mdash; BlueBorne, KNOB, BIAS, BLE relay, MITM พร้อมเครื่องมือและการบรรเทา |
| `analyze_ble` | วิเคราะห์ความปลอดภัย BLE เชิงลึก &mdash; บริการ GATT วิธีการจับคู่ LE Secure Connections การเข้ารหัส characteristic |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; ไม่ต้องใช้ API key</b></summary>

| เครื่องมือ | คำอธิบาย |
|-----------|----------|
| `analyze_rf_signal` | วิเคราะห์ความปลอดภัยสัญญาณ RF &mdash; วิเคราะห์ความถี่ ระบุการมอดูเลชัน ความเป็นไปได้ของการโจมตี replay คำแนะนำเครื่องมือ SDR |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; ไม่ต้องใช้ API key</b></summary>

| เครื่องมือ | คำอธิบาย |
|-----------|----------|
| `analyze_nfc_security` | วิเคราะห์ความปลอดภัย NFC/RFID &mdash; ระบุประเภทบัตร จุดอ่อนของระบบควบคุมการเข้าถึง ความเป็นไปได้ในการโคลน วิธีการ Proxmark3 |

</details>

<details>
<summary><b>เซลลูลาร์/5G (1) &mdash; ไม่ต้องใช้ API key</b></summary>

| เครื่องมือ | คำอธิบาย |
|-----------|----------|
| `analyze_cellular_security` | วิเคราะห์ความปลอดภัยเครือข่ายเซลลูลาร์ &mdash; จุดอ่อนของโปรโตคอล 2G/3G/4G/5G การตรวจจับ IMSI catcher การวิเคราะห์สถานีฐานปลอม |

</details>

<details>
<summary><b>IoT ไร้สาย (3) &mdash; ไม่ต้องใช้ API key</b></summary>

| เครื่องมือ | คำอธิบาย |
|-----------|----------|
| `analyze_zigbee` | วิเคราะห์ความปลอดภัยเครือข่าย Zigbee &mdash; นโยบายศูนย์ความเชื่อถือ การจัดการคีย์เครือข่าย วิธีการโจมตี KillerBee |
| `scan_iot_wireless` | สแกนโปรโตคอลไร้สาย IoT &mdash; ค้นหาและวิเคราะห์ช่องโหว่ Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP |
| `find_mousejack` | วิเคราะห์ช่องโหว่ MouseJack ของคีย์บอร์ด/เมาส์ไร้สาย &mdash; การฉีดคีย์สโตรก HID ที่ไม่เข้ารหัส การ bypass เฉพาะผู้ผลิต |

</details>

<details>
<summary><b>ไร้สายขั้นสูง (6) &mdash; ไม่ต้องใช้ API key</b></summary>

| เครื่องมือ | คำอธิบาย |
|-----------|----------|
| `analyze_airgap` | วิเคราะห์เทคนิคการนำข้อมูลออกจาก air-gap &mdash; ช่องทางลับทางแม่เหล็กไฟฟ้า เสียง ความร้อน แสง และมาตรการตอบโต้ |
| `analyze_uwb` | วิเคราะห์ความปลอดภัย Ultra-Wideband (UWB) &mdash; การปลอมระยะ การโจมตี relay บนกุญแจรถและ AirTags การฉ้อโกงระยะทาง |
| `analyze_wifi_csi` | วิเคราะห์ความปลอดภัย WiFi Channel State Information (CSI) &mdash; การตรวจจับแบบ passive การจดจำกิจกรรม ความเสี่ยงในการอนุมานคีย์สโตรก |
| `analyze_miracast` | วิเคราะห์ความปลอดภัย Miracast/WiFi Display &mdash; การยึดเซสชัน WFD การจับภาพหน้าจอ การเข้าถึงจอแสดงผลโดยไม่ได้รับอนุญาต |
| `analyze_wifi_direct` | วิเคราะห์ความปลอดภัย WiFi Direct (P2P) &mdash; การโจมตีการเจรจาเจ้าของกลุ่ม ช่องโหว่ WPS ใน P2P การสร้างกลุ่มอันตราย |
| `analyze_drone_rf` | วิเคราะห์ความปลอดภัย RF ของโดรน &mdash; การยึดลิงก์ควบคุม การปลอม GPS การดักสัญญาณวิดีโอ downlink เทคนิค counter-UAS |

</details>

<details>
<summary><b>โครงสร้างพื้นฐาน (4) &mdash; ไม่ต้องใช้ API key (KISMET_* เป็นตัวเลือกสำหรับ WIDS แบบเรียลไทม์)</b></summary>

| เครื่องมือ | คำอธิบาย |
|-----------|----------|
| `audit_wlan_controller` | ตรวจสอบการตั้งค่าตัวควบคุม WLAN &mdash; การตั้งค่าความปลอดภัย Cisco WLC, Aruba, Meraki นโยบาย rogue AP การจัดการ RF |
| `analyze_captive_portal` | วิเคราะห์ความปลอดภัยพอร์ทัลจำลอง &mdash; เทคนิคการ bypass ความเสี่ยงการเก็บข้อมูลรับรอง การแยกเครือข่าย ความปลอดภัย VLAN สำหรับผู้เยี่ยมชม |
| `detect_mac_randomization` | วิเคราะห์การสุ่มที่อยู่ MAC &mdash; ความแตกต่างในการใช้งาน iOS/Android/Windows ความต้านทานการติดตาม การ bypass fingerprinting |
| `analyze_hotspot20` | วิเคราะห์ความปลอดภัย Hotspot 2.0 (Passpoint) &mdash; ANQP, OSU ความเสี่ยงการเลือกเครือข่ายอัตโนมัติ การวิเคราะห์วิธี EAP |

</details>

<details>
<summary><b>ข่าวกรอง (4) &mdash; ไม่ต้องใช้ API key</b></summary>

| เครื่องมือ | คำอธิบาย |
|-----------|----------|
| `lookup_wireless_cve` | ค้นหา CVE เฉพาะด้านไร้สาย &mdash; ช่องโหว่ชิปเซ็ต WiFi, CVE สแตก Bluetooth, exploit ไดรเวอร์, บั๊กเฟิร์มแวร์ |
| `lookup_hardware` | ค้นหาฮาร์ดแวร์ความปลอดภัยไร้สาย &mdash; อะแดปเตอร์ WiFi, sniffer Bluetooth, อุปกรณ์ SDR, ความสามารถ, ความเข้ากันได้ของชิปเซ็ต |
| `map_wireless_attck` | แมปการโจมตีไร้สายไปยังเฟรมเวิร์ก MITRE ATT&CK &mdash; ID เทคนิค หมวดหมู่ยุทธวิธี กลยุทธ์การตรวจจับ |
| `analyze_medical_wireless` | วิเคราะห์ความปลอดภัยไร้สายของอุปกรณ์การแพทย์ &mdash; ปั๊มให้สารน้ำ เครื่องกระตุ้นหัวใจ มอนิเตอร์ผู้ป่วย แนวทาง FDA ข้อกำหนด HIPAA |

</details>

<details>
<summary><b>การตรวจจับ (2) &mdash; ไม่ต้องใช้ API key</b></summary>

| เครื่องมือ | คำอธิบาย |
|-----------|----------|
| `detect_wireless_attack` | ตรวจจับการโจมตีไร้สายที่กำลังดำเนินการ &mdash; การท่วม deauth, evil twin, KARMA, rogue AP, BLE spoofing, ตัวบ่งชี้การ jamming RF |
| `audit_wireless_compliance` | ตรวจสอบเครือข่ายไร้สายเทียบกับเฟรมเวิร์กการปฏิบัติตาม &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, controls ไร้สาย ISO 27001 |

</details>

<details>
<summary><b>รายงาน (1) &mdash; ไม่ต้องใช้ API key</b></summary>

| เครื่องมือ | คำอธิบาย |
|-----------|----------|
| `export_report` | ส่งออกรายงานการประเมินความปลอดภัยไร้สาย &mdash; การค้นพบ ระดับความเสี่ยง สถานะการปฏิบัติตาม แผนงานการแก้ไข สรุปสำหรับผู้บริหาร |

</details>

---

### CLI Usage

```bash
# แสดงรายการเครื่องมือทั้งหมดที่มี
npx wifi-security-mcp-server --list

# รันเครื่องมือใดก็ได้โดยตรง
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

เซิร์ฟเวอร์มาพร้อมกับฐานความรู้ในตัว 9 ฐาน &mdash; ไม่ต้องใช้ API key ไม่มี dependency ภายนอก ไม่มีข้อจำกัดอัตรา ทุกการสอบถามเครื่องมือจะได้รับการเสริมด้วยข่าวกรองที่มีโครงสร้างจากฐานข้อมูลเหล่านี้

| ฐานความรู้ | รายการ | สิ่งที่ให้ |
|-----------|--------|----------|
| **การโจมตี WiFi** | 47 การโจมตี | เทคนิคการโจมตี WPA/WPA2/WPA3, รูปแบบ evil twin, PMKID, KRACK, FragAttacks, deauth, exploit WPS &mdash; แต่ละรายการพร้อมเครื่องมือ การบรรเทา การแมป MITRE ATT&CK |
| **การโจมตี Bluetooth** | 8 การโจมตี | BlueBorne, KNOB, BIAS, BLE relay, MITM, BLE fuzzing, การปลอมตัว Bluetooth &mdash; พร้อม CVE และกลยุทธ์การตรวจจับ |
| **การโจมตี RF/SDR** | 6 การโจมตี | การโจมตี replay, jamming, การฉีดสัญญาณ, การดักจับด้วย SDR, การ bypass fingerprinting RF, เทคนิคการวิเคราะห์สเปกตรัม |
| **การโจมตี NFC/RFID** | 6 การโจมตี | การโคลนบัตร, การโจมตี relay, การ crack MIFARE Classic, NFC skimming, RFID fuzzing, การ bypass ระบบควบคุมการเข้าถึงด้วย Proxmark3 |
| **การโจมตีเซลลูลาร์** | 6 การโจมตี | การจับ IMSI, สถานีฐานปลอม (Stingray), การใช้ประโยชน์จาก SS7, ช่องโหว่ 5G NAS, การโจมตี downgrade, การดักจับ VoLTE |
| **การโจมตี IoT** | 6 การโจมตี | การดักฟังคีย์เครือข่าย Zigbee, การ downgrade Z-Wave S0, การเก็บข้อมูลรับรอง MQTT, การ replay LoRaWAN ABP, MouseJack, BLE IoT relay |
| **ฐานข้อมูลฮาร์ดแวร์** | 12 อุปกรณ์ | อะแดปเตอร์ WiFi (Alfa, TP-Link), sniffer Bluetooth (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; ชิปเซ็ต ความสามารถ รองรับโหมด monitor |
| **ฐานข้อมูล CVE** | 17 CVE | CVE เฉพาะด้านไร้สายสำหรับชิปเซ็ต WiFi (Broadcom, Qualcomm, Intel), สแตก Bluetooth, เฟิร์มแวร์ IoT &mdash; ระดับความรุนแรง เวอร์ชันที่ได้รับผลกระทบ ความพร้อมของ exploit |
| **เฟรมเวิร์กการปฏิบัติตาม** | 5 เฟรมเวิร์ก | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; controls เฉพาะด้านไร้สาย เช็คลิสต์การตรวจสอบ การวิเคราะห์ช่องว่าง |

---

## Architecture

```
src/
  index.ts                    # จุดเข้า CLI (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # การตั้งค่าเซิร์ฟเวอร์ MCP (stdio transport)
    tools.ts                  # รีจิสทรีเครื่องมือ — เครื่องมือผสมทั้ง 34 ตัวประกอบที่นี่
  types/
    index.ts                  # ประเภทที่ใช้ร่วมกัน (ToolDef, ToolContext, ToolResult)
  knowledge/                  # ฐานความรู้ในตัว 9 ฐาน
    wifi-attacks.ts           # คำจำกัดความการโจมตี WiFi 47 รายการ
    bluetooth-attacks.ts      # คำจำกัดความการโจมตี Bluetooth 8 รายการ
    rf-attacks.ts             # คำจำกัดความการโจมตี RF/SDR 6 รายการ
    nfc-attacks.ts            # คำจำกัดความการโจมตี NFC/RFID 6 รายการ
    cellular-attacks.ts       # คำจำกัดความการโจมตีเซลลูลาร์/5G 6 รายการ
    iot-attacks.ts            # คำจำกัดความการโจมตี IoT 6 รายการ
    hardware.ts               # โปรไฟล์อุปกรณ์ฮาร์ดแวร์ 12 รายการ
    cve-database.ts           # CVE ไร้สาย 17 รายการ
    compliance.ts             # เฟรมเวิร์กการปฏิบัติตาม 5 รายการ
  wifi/                       # เครื่องมือ WiFi Core (8)
  bluetooth/                  # เครื่องมือ Bluetooth (3)
  rf/                         # เครื่องมือ RF/SDR (1)
  nfc/                        # เครื่องมือ NFC/RFID (1)
  cellular/                   # เครื่องมือเซลลูลาร์/5G (1)
  iot/                        # เครื่องมือ IoT ไร้สาย (3)
  advanced/                   # เครื่องมือไร้สายขั้นสูง (6)
  infrastructure/             # เครื่องมือโครงสร้างพื้นฐาน (4)
  intelligence/               # เครื่องมือข่าวกรอง (4)
  detection/                  # เครื่องมือการตรวจจับ (2)
  reporting/                  # เครื่องมือรายงาน (1)
```

**การตัดสินใจด้านการออกแบบ:**

- **ขับเคลื่อนด้วยฐานความรู้** &mdash; แตกต่างจากเครื่องมือที่พึ่งพา API ฟังก์ชันหลักทำงานแบบออฟไลน์ทั้งหมดจากฐานข้อมูลในตัว 9 ฐาน ไม่ต้องใช้ API key ไม่มีข้อจำกัดอัตรา ไม่มี dependency ภายนอกสำหรับเวิร์กโฟลว์หลัก
- **เครื่องมือผสม 34 ตัว ความสามารถเดี่ยว 139 รายการ** &mdash; แต่ละเครื่องมือเป็นแบบผสมที่รวมการวิเคราะห์ที่เกี่ยวข้อง `find_wifi_attacks` ไม่ใช่แค่แสดงรายการการโจมตี &mdash; แต่ส่งคืนวิธีการ ฮาร์ดแวร์ที่ต้องการ การแมป MITRE ATT&CK กลยุทธ์การตรวจจับ และมาตรการตอบโต้
- **dependency รันไทม์ 2 ตัว** &mdash; `@modelcontextprotocol/sdk` และ `zod` ไม่มีอะไรอื่น ไม่มีโมดูลเนทีฟ ไม่มี dependency แบบไบนารี ไม่มีโค้ดเฉพาะแพลตฟอร์ม
- **การรวมแบบเรียลไทม์ที่เป็นตัวเลือก** &mdash; API WiGLE สำหรับข้อมูลเครือข่ายในโลกจริง Kismet สำหรับ IDS ไร้สายแบบเรียลไทม์ การวิเคราะห์หลักทำงานได้โดยไม่ต้องมีทั้งสองอย่าง
- **ตระหนักถึงการปฏิบัติตาม** &mdash; ทุกการค้นพบจะถูกแมปไปยังเฟรมเวิร์กการปฏิบัติตามที่เกี่ยวข้อง (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) โดยอัตโนมัติเมื่อมีผลบังคับใช้
- **แมป MITRE ATT&CK** &mdash; เทคนิคการโจมตีรวม ID เทคนิค ATT&CK หมวดหมู่ยุทธวิธี และแหล่งข้อมูลการตรวจจับสำหรับการรวม SOC

---

## Limitations

- ฐานความรู้เป็น snapshot ณ จุดเวลาหนึ่ง &mdash; การโจมตี/CVE ใหม่ต้องมีการอัปเดตแพ็กเกจ
- การรวม WiGLE ต้องใช้ API key ฟรีสำหรับค้นหาเครือข่าย
- WIDS แบบเรียลไทม์ของ Kismet ต้องมีอินสแตนซ์ Kismet ที่ทำงานอยู่พร้อมการเข้าถึง API
- ไม่มีการส่งสัญญาณไร้สายแบบ active &mdash; เซิร์ฟเวอร์ให้ข่าวกรองและวิธีการ ไม่ใช่การฉีดแพ็กเก็ต
- ฐานข้อมูลฮาร์ดแวร์ครอบคลุมอุปกรณ์วิจัยด้านความปลอดภัยที่พบบ่อยที่สุด ไม่ครอบคลุมทั้งหมด
- เฟรมเวิร์กการปฏิบัติตามมุ่งเน้นที่ controls เฉพาะด้านไร้สาย ไม่ใช่ความครอบคลุมทั้งเฟรมเวิร์ก
- ทดสอบบน macOS / Linux (ไม่ได้ทดสอบบน Windows)

---

## Part of the MCP Security Suite

| โปรเจกต์ | โดเมน | เครื่องมือ |
|---------|--------|----------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | การทดสอบความปลอดภัยบนเบราว์เซอร์ | 39 เครื่องมือ, Firefox, การทดสอบ injection |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | ความปลอดภัยคลาวด์ (AWS/Azure/GCP) | 38 เครื่องมือ, 60+ การตรวจสอบ |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | สถานะความปลอดภัย GitHub | 39 เครื่องมือ, 45 การตรวจสอบ |
| [cve-mcp](https://github.com/badchars/cve-mcp) | ข่าวกรองช่องโหว่ | 23 เครื่องมือ, 5 แหล่งข้อมูล |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT และการสำรวจ | 37 เครื่องมือ, 12 แหล่งข้อมูล |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark web และข่าวกรองภัยคุกคาม | 66 เครื่องมือ, 16 แหล่งข้อมูล |
| **wifi-security-mcp-server** | **ข่าวกรองความปลอดภัยไร้สาย** | **34 เครื่องมือ, 9 ฐานความรู้** |

---

<p align="center">
<b>สำหรับการทดสอบและประเมินความปลอดภัยที่ได้รับอนุญาตเท่านั้น</b><br>
ตรวจสอบให้แน่ใจเสมอว่าคุณได้รับอนุญาตอย่างเหมาะสมก่อนทำการทดสอบความปลอดภัยไร้สายบนเครือข่ายหรืออุปกรณ์ใดๆ<br>
การเข้าถึงเครือข่ายไร้สายหรือการรบกวนโดยไม่ได้รับอนุญาตถือเป็นสิ่งผิดกฎหมายในเขตอำนาจศาลส่วนใหญ่
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

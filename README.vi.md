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
  <strong>Tiếng Việt</strong> |
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

<h3 align="center">Tin tuc tinh bao bao mat khong day cho cac tac nhan AI.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Di dong/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drone RF, WIDS/WIPS, Tuan thu &mdash; thong nhat trong mot may chu MCP duy nhat.<br>
  Tac nhan AI cua ban nhan duoc <b>phan tich bao mat khong day toan pho theo yeu cau</b>, duoc ho tro boi 9 co so tri thuc tich hop bao phu 139 cong cu rieng le.
</p>

<br>

<p align="center">
  <a href="#the-problem">Van De</a> &bull;
  <a href="#how-its-different">Diem Khac Biet</a> &bull;
  <a href="#quick-start">Bat Dau Nhanh</a> &bull;
  <a href="#what-the-ai-can-do">AI Co The Lam Gi</a> &bull;
  <a href="#tools-reference-34-composite-tools">Cong Cu (34)</a> &bull;
  <a href="#knowledge-bases-9">Co So Tri Thuc</a> &bull;
  <a href="#architecture">Kien Truc</a> &bull;
  <a href="CHANGELOG.md">Changelog</a> &bull;
  <a href="CONTRIBUTING.md">Dong Gop</a>
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

Danh gia bao mat khong day la mot trong nhung linh vuc phan manh nhat trong bao mat tan cong. Kiem tra WiFi can mot bo cong cu, Bluetooth can bo khac, RF/SDR can bo thu ba, cac giao thuc IoT can bo khac nua &mdash; va moi linh vuc co be mat tan cong rieng, lo hong rieng, yeu cau tuan thu rieng. Hien nay ban chay aircrack-ng cho WPA, su dung Bettercap cho BLE, khoi dong HackRF cho SDR, tra cuu cac co so du lieu CVE khac nhau cho moi chipset, tham khao NIST va PCI-DSS rieng re, roi mat hang gio de tuong quan thu cong cac phat hien thanh mot danh gia nhat quan.

```
Quy trinh bao mat khong day truyen thong:
  kiem tra mang WiFi                ->  aircrack-ng / Wireshark / Kismet
  kiem tra bao mat Bluetooth        ->  Bettercap / btlejack / Ubertooth
  phan tich tin hieu RF             ->  HackRF / GNU Radio / GQRX
  kiem tra NFC/RFID                 ->  Proxmark3 / libnfc
  danh gia bao mat di dong          ->  srsRAN / OpenBTS
  kiem tra giao thuc IoT            ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  tim kiem CVE khong day            ->  NVD / vendor advisories (tim kiem thu cong)
  kiem tra tuan thu                 ->  NIST / PCI-DSS / HIPAA docs (thu cong)
  anh xa vao MITRE ATT&CK           ->  ATT&CK Navigator (anh xa thu cong)
  tuong quan tat ca                 ->  sao chep-dan vao bao cao
  ────────────────────────────────
  Tong cong: hang gio cho moi danh gia, phan lon la chuyen doi boi canh giua cac cong cu
```

**wifi-security-mcp-server** cung cap cho tac nhan AI cua ban 34 cong cu tong hop duoc ho tro boi 9 co so tri thuc bao phu 139 kha nang rieng le thong qua [Model Context Protocol](https://modelcontextprotocol.io). Tac nhan phan tich mang, xac dinh lo hong, anh xa tan cong vao MITRE ATT&CK, kiem tra tuan thu va tao bao cao kha thi &mdash; trong mot cuoc hoi thoai duy nhat.

```
Voi wifi-security-mcp-server:
  Ban: "Kiem tra bao mat khong day cua mang van phong chay WPA2-Enterprise"

  Tac nhan: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "Mang WPA2-Enterprise cua ban co 3 phat hien nghiem trong:
            1. EAP-PEAP khong co ghim chung chi — de bi tan cong evil twin
               voi hostapd-mana (MITRE T1557.002)
            2. Khong co 802.11w (PMF) — de bi tan cong huy xac thuc
               (MITRE T1498.001)
            3. Hash PMKID co the trich xuat khong can tuong tac client —
               co the crack ngoai tuyen voi hashcat mode 22000
            PCI-DSS 4.0: 2 kiem soat khong tuan thu (4.2.1, 11.2.1).
            Khuyen nghi: chuyen sang WPA3-Enterprise voi SAE, bat PMF,
            trien khai WIDS de phat hien AP gia mao."
```

---

## How It's Different

Cac cong cu hien tai cung cap cho ban cac ban ghi goi tin tho va phan tich dac thu theo giao thuc. wifi-security-mcp-server cho tac nhan AI cua ban kha nang **suy luan dong thoi tren tat ca cac linh vuc khong day** voi su ho tro sau cua co so tri thuc.

<table>
<thead>
<tr>
<th></th>
<th>Cach tiep can truyen thong</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Giao dien</b></td>
<td>10+ CLI, GUI va cong cu phan cung khac nhau</td>
<td>MCP &mdash; tac nhan AI goi cong cu theo cach hoi thoai</td>
</tr>
<tr>
<td><b>Pham vi</b></td>
<td>Mot giao thuc tai mot thoi diem</td>
<td>WiFi, Bluetooth, RF, NFC, Di dong, IoT &mdash; tat ca trong mot may chu</td>
</tr>
<tr>
<td><b>Tri thuc</b></td>
<td>Tra cuu CVE thu cong, anh xa ATT&CK thu cong</td>
<td>9 co so tri thuc tich hop voi 139 muc da anh xa san</td>
</tr>
<tr>
<td><b>Tinh bao tan cong</b></td>
<td>Tim kiem Google + bai blog + bai thuyet trinh hoi nghi</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Di dong + 6 IoT tan cong duoc phan loai voi cong cu, giam thieu, ATT&CK IDs</td>
</tr>
<tr>
<td><b>Tuan thu</b></td>
<td>Doc PDF NIST/PCI-DSS/HIPAA, anh xa kiem soat thu cong</td>
<td>Tac nhan tu dong kiem tra voi 5 khung tuan thu</td>
</tr>
<tr>
<td><b>API keys</b></td>
<td>Nhieu tai khoan cho cac dich vu khac nhau</td>
<td>Khong can API key cho chuc nang chinh &mdash; dua tren co so tri thuc</td>
</tr>
<tr>
<td><b>Cai dat</b></td>
<td>Cai dat aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; mot lenh, khong can cau hinh</td>
</tr>
</tbody>
</table>

---

## Quick Start

### Lua chon 1: npx (khong can cai dat)

```bash
npx wifi-security-mcp-server
```

Tat ca 34 cong cu hoat dong ngay lap tuc. Khong can API key &mdash; chuc nang chinh dua tren co so tri thuc.

### Lua chon 2: Clone

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Bien moi truong (tuy chon)

```bash
# WiGLE — co so du lieu wardriving de tra cuu mang WiFi thuc te
export WIGLE_API_KEY=your-key

# Kismet — phat hien xam nhap khong day thoi gian thuc
export KISMET_HOST=127.0.0.1      # Mac dinh: 127.0.0.1
export KISMET_PORT=2501           # Mac dinh: 2501
export KISMET_API_KEY=your-key
```

Tat ca API key deu la tuy chon. Khong co chung, ban van co quyen truy cap day du vao tat ca 34 cong cu duoc ho tro boi 9 co so tri thuc tich hop bao gom tan cong WiFi, tan cong Bluetooth, RF/SDR, NFC/RFID, di dong, IoT, co so du lieu phan cung, tinh bao CVE va khung tuan thu.

### Ket noi voi tac nhan AI cua ban

<details open>
<summary><b>Claude Code</b></summary>

```bash
# Voi npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# Voi ban sao cuc bo
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Them vao `~/Library/Application Support/Claude/claude_desktop_config.json`:

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
<summary><b>Cursor / Windsurf / cac client MCP khac</b></summary>

Cung dinh dang cau hinh JSON. Tro lenh den `npx wifi-security-mcp-server` hoac duong dan cai dat cuc bo cua ban.

</details>

### Bat dau truy van

```
Ban: "Nhung tan cong nao co the thuc hien doi voi mang WPA3-SAE va lam the nao de kiem tra chung?"
```

Chi co vay thoi. Tac nhan tim kiem cac tan cong, anh xa vao MITRE ATT&CK, khuyen nghi cong cu va cung cap phuong phap luan tung buoc &mdash; tat ca tu co so tri thuc tich hop.

---

## What The AI Can Do

### Danh gia bao mat WiFi

```
Ban: "Phan tich bao mat cua mang WPA2-PSK voi WPS duoc bat"

Tac nhan: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "Tim thay lo hong nghiem trong trong cau hinh WPA2-PSK + WPS:
          1. Tan cong WPS Pixie Dust — PIN co the khoi phuc trong vai giay
             thong qua brute-force ngoai tuyen cac nonce E-S1/E-S2 (Reaver + PixieWPS).
             Khoi phuc PSK day du khong can tuong tac client.
          2. Tan cong PMKID — goi dau tien cua 4-way handshake chua
             hash PMKID, co the crack ngoai tuyen voi hashcat -m 22000.
             Khong can deauth, khong can client.
          3. Bat 4-Way Handshake — cac frame EAPOL co the bat voi
             airodump-ng + deauth, sau do tan cong tu dien ngoai tuyen.
          Uu tien: Tat WPS ngay lap tuc (rui ro cao nhat), bat buoc
          PSK manh 20+ ky tu, xem xet chuyen sang WPA3-SAE."
```

### Phan tich Bluetooth & BLE

```
Ban: "Rui ro bao mat cua he thong kiem soat truy cap dua tren BLE la gi?"

Tac nhan: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "He thong kiem soat truy cap BLE — xac dinh 4 rui ro nghiem trong:
          1. Ghep noi JustWorks — khong co bao ve MITM. Ke tan cong co the
             chan bat ghep noi voi Ubertooth One (MITRE T1040).
          2. Theo doi GATT Characteristic — lenh mo khoa gui duoi dang
             van ban tho, co the phat lai voi gatttool (MITRE T1212).
          3. Tan cong BLE Relay/Replay — chuyen tiep tin hieu mo khoa
             hop le bang hai thiet bi + btlejack (MITRE T1557).
          4. Theo doi dia chi MAC — MAC BLE tinh cho phep
             theo doi nguoi dung (MITRE T1592.002).
          Khuyen nghi: bat buoc LE Secure Connections (LESC) voi
          So sanh so, ma hoa cac GATT characteristics, trien khai
          rolling nonces de bao ve chong phat lai."
```

### Kiem tra IoT khong day

```
Ban: "Danh gia bao mat khong day cua he thong IoT toa nha thong minh"

Tac nhan: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "Danh gia khong day IoT toa nha thong minh — 5 phat hien:
          1. Zigbee: Khoa lien ket trung tam tin cay mac dinh
             (ZigBeeAlliance09) cho phep chan bat gia nhap mang
             voi KillerBee (NGHIEM TRONG)
          2. MQTT: Broker tren cong 1883 khong co TLS — thong tin
             dang nhap va du lieu cam bien truyen di dang van ban tho
          3. Z-Wave: Bao mat S0 voi lo hong trao doi khoa da biet
             — khuyen nghi nang cap len S2
          4. MouseJack: 3 bo thu Logitech Unifying de bi
             tiem phim (CVE-2016-10761)
          5. WiFi: Thiet bi IoT tren cung VLAN voi mang
             doanh nghiep — khong co phan doan mang
          Khac phuc uu tien: MQTT TLS, ma cai dat Zigbee,
          cach ly VLAN IoT, thay the bo thu Logitech de bi tan cong."
```

### Kiem tra tuan thu

```
Ban: "Kiem tra WiFi benh vien cua chung toi theo yeu cau khong day HIPAA"

Tac nhan: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "Kiem tra tuan thu khong day HIPAA — 6 phat hien:
          3 kiem soat KHONG TUAN THU:
          - 164.312(a)(1): Khong trien khai IDS khong day de phat hien AP gia mao
          - 164.312(e)(1): Thiet bi y te su dung WPA2-PSK (khong phai Enterprise)
          - 164.312(e)(2): Khong co nhat ky kiem tra ma hoa luu luong khong day
          3 kiem soat TUAN THU:
          - 164.310(a)(1): Vi tri vat ly cua AP da duoc ghi lai
          - 164.312(a)(2): 802.1X voi xac thuc RADIUS
          - 164.312(d): EAP-TLS dua tren chung chi cho thiet bi nhan vien
          Ke hoach khac phuc: trien khai WIDS (Kismet/AirMagnet), chuyen
          thiet bi y te sang WPA2-Enterprise voi MAB, bat nhat ky
          kiem tra khong day tren bo dieu khien WLAN."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; Khong can API key</b></summary>

| Cong cu | Mo ta |
|---------|------|
| `scan_wifi_networks` | Quet va phan tich mang WiFi &mdash; phat hien SSID, kenh, loai ma hoa, cuong do tin hieu va loi cau hinh bao mat |
| `analyze_wifi_security` | Phan tich sau cau hinh bao mat WiFi &mdash; do manh ma hoa, phuong phap xac thuc, diem yeu da biet, be mat tan cong |
| `find_wifi_attacks` | Tim cac tan cong ap dung cho muc tieu WiFi &mdash; tra ve phuong phap tan cong, cong cu can thiet, anh xa MITRE ATT&CK, giam thieu |
| `simulate_evil_twin` | Mo phong va phan tich cac kich ban tan cong evil twin AP &mdash; cau hinh hostapd-mana, captive portal, phuong phap bat thong tin dang nhap |
| `analyze_deauth` | Phan tich cac vector tan cong huy xac thuc &mdash; trang thai 802.11w PMF, phat hien deauth, bien phap doi pho, tich hop WIDS |
| `crack_wps` | Phan tich cac vector tan cong crack WPS &mdash; Pixie Dust, brute force, null PIN, tao PIN mac dinh, phuong phap Reaver/Bully |
| `analyze_pmkid` | Phan tich cac vector tan cong dua tren PMKID &mdash; crack WPA/WPA2 khong can client qua hcxdumptool + hashcat mode 22000 |
| `audit_wifi67` | Kiem tra cac tinh nang bao mat dac thu cua WiFi 6 (802.11ax) va WiFi 7 (802.11be) &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; Khong can API key</b></summary>

| Cong cu | Mo ta |
|---------|------|
| `scan_bluetooth` | Quet va phan tich thiet bi Bluetooth &mdash; phat hien BR/EDR co dien va BLE, liet ke dich vu, phan tich ghep noi |
| `find_bluetooth_attacks` | Tim cac tan cong Bluetooth ap dung &mdash; BlueBorne, KNOB, BIAS, BLE relay, MITM, voi cong cu va giam thieu |
| `analyze_ble` | Phan tich sau bao mat BLE &mdash; dich vu GATT, phuong phap ghep noi, LE Secure Connections, ma hoa characteristic |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; Khong can API key</b></summary>

| Cong cu | Mo ta |
|---------|------|
| `analyze_rf_signal` | Phan tich bao mat tin hieu RF &mdash; phan tich tan so, nhan dang dieu che, kha thi tan cong replay, khuyen nghi cong cu SDR |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; Khong can API key</b></summary>

| Cong cu | Mo ta |
|---------|------|
| `analyze_nfc_security` | Phan tich bao mat NFC/RFID &mdash; nhan dang loai the, diem yeu kiem soat truy cap, kha thi sao chep, phuong phap Proxmark3 |

</details>

<details>
<summary><b>Di dong/5G (1) &mdash; Khong can API key</b></summary>

| Cong cu | Mo ta |
|---------|------|
| `analyze_cellular_security` | Phan tich bao mat mang di dong &mdash; diem yeu giao thuc 2G/3G/4G/5G, phat hien IMSI catcher, phan tich tram goc gia |

</details>

<details>
<summary><b>IoT khong day (3) &mdash; Khong can API key</b></summary>

| Cong cu | Mo ta |
|---------|------|
| `analyze_zigbee` | Phan tich bao mat mang Zigbee &mdash; chinh sach trung tam tin cay, quan ly khoa mang, phuong phap tan cong KillerBee |
| `scan_iot_wireless` | Quet cac giao thuc khong day IoT &mdash; phat hien va phan tich lo hong Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP |
| `find_mousejack` | Phan tich lo hong MouseJack ban phim/chuot khong day &mdash; tiem phim, HID khong ma hoa, bypass dac thu nha san xuat |

</details>

<details>
<summary><b>Khong day nang cao (6) &mdash; Khong can API key</b></summary>

| Cong cu | Mo ta |
|---------|------|
| `analyze_airgap` | Phan tich ky thuat xuat du lieu qua air-gap &mdash; kenh an dien tu, am thanh, nhiet, quang hoc va bien phap doi pho |
| `analyze_uwb` | Phan tich bao mat Ultra-Wideband (UWB) &mdash; thao tung khoang cach, tan cong relay tren chia khoa xe va AirTags, gian lan khoang cach |
| `analyze_wifi_csi` | Phan tich bao mat WiFi Channel State Information (CSI) &mdash; cam bien thu dong, nhan dang hoat dong, rui ro suy luan phim |
| `analyze_miracast` | Phan tich bao mat Miracast/WiFi Display &mdash; chiem doat phien WFD, chup man hinh, truy cap man hinh trai phep |
| `analyze_wifi_direct` | Phan tich bao mat WiFi Direct (P2P) &mdash; tan cong thuong luong chu nhom, lo hong WPS trong P2P, tao nhom doc hai |
| `analyze_drone_rf` | Phan tich bao mat RF drone &mdash; chiem doat lien ket dieu khien, gia mao GPS, chan tin hieu video, ky thuat counter-UAS |

</details>

<details>
<summary><b>Ha tang (4) &mdash; Khong can API key (KISMET_* tuy chon cho WIDS thoi gian thuc)</b></summary>

| Cong cu | Mo ta |
|---------|------|
| `audit_wlan_controller` | Kiem tra cau hinh bo dieu khien WLAN &mdash; cai dat bao mat Cisco WLC, Aruba, Meraki, chinh sach AP gia mao, quan ly RF |
| `analyze_captive_portal` | Phan tich bao mat captive portal &mdash; ky thuat bypass, rui ro thu thap thong tin dang nhap, cach ly mang, bao mat VLAN khach |
| `detect_mac_randomization` | Phan tich ngau nhien hoa dia chi MAC &mdash; khac biet trien khai iOS/Android/Windows, khang theo doi, bypass fingerprinting |
| `analyze_hotspot20` | Phan tich bao mat Hotspot 2.0 (Passpoint) &mdash; ANQP, OSU, rui ro chon mang tu dong, phan tich phuong phap EAP |

</details>

<details>
<summary><b>Tinh bao (4) &mdash; Khong can API key</b></summary>

| Cong cu | Mo ta |
|---------|------|
| `lookup_wireless_cve` | Tra cuu CVE dac thu khong day &mdash; lo hong chipset WiFi, CVE stack Bluetooth, exploit driver, loi firmware |
| `lookup_hardware` | Tra cuu phan cung bao mat khong day &mdash; adapter WiFi, sniffer Bluetooth, thiet bi SDR, kha nang, tuong thich chipset |
| `map_wireless_attck` | Anh xa tan cong khong day vao khung MITRE ATT&CK &mdash; ID ky thuat, danh muc chien thuat, chien luoc phat hien |
| `analyze_medical_wireless` | Phan tich bao mat khong day thiet bi y te &mdash; bom truyen, may tao nhip, monitor benh nhan, huong dan FDA, yeu cau HIPAA |

</details>

<details>
<summary><b>Phat hien (2) &mdash; Khong can API key</b></summary>

| Cong cu | Mo ta |
|---------|------|
| `detect_wireless_attack` | Phat hien tan cong khong day dang xay ra &mdash; lut deauth, evil twin, KARMA, AP gia mao, gia mao BLE, chi bao nhieu RF |
| `audit_wireless_compliance` | Kiem tra mang khong day theo khung tuan thu &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, kiem soat khong day ISO 27001 |

</details>

<details>
<summary><b>Bao cao (1) &mdash; Khong can API key</b></summary>

| Cong cu | Mo ta |
|---------|------|
| `export_report` | Xuat bao cao danh gia bao mat khong day &mdash; phat hien, xep hang rui ro, trang thai tuan thu, lo trinh khac phuc, tom tat dieu hanh |

</details>

---

### CLI Usage

```bash
# Liet ke tat ca cac cong cu kha dung
npx wifi-security-mcp-server --list

# Chay bat ky cong cu nao truc tiep
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

May chu di kem voi 9 co so tri thuc tich hop &mdash; khong can API key, khong co phu thuoc ben ngoai, khong co gioi han toc do. Moi truy van cong cu duoc lam giau voi tinh bao co cau truc tu cac co so du lieu nay.

| Co so tri thuc | Muc nhap | Cung cap gi |
|---------------|----------|-------------|
| **Tan cong WiFi** | 47 tan cong | Ky thuat tan cong WPA/WPA2/WPA3, bien the evil twin, PMKID, KRACK, FragAttacks, deauth, exploit WPS &mdash; moi muc voi cong cu, giam thieu, anh xa MITRE ATT&CK |
| **Tan cong Bluetooth** | 8 tan cong | BlueBorne, KNOB, BIAS, BLE relay, MITM, BLE fuzzing, gia mao Bluetooth &mdash; voi CVE va chien luoc phat hien |
| **Tan cong RF/SDR** | 6 tan cong | Tan cong replay, nhieu, tiem tin hieu, chan bat dua tren SDR, bypass fingerprinting RF, ky thuat phan tich pho |
| **Tan cong NFC/RFID** | 6 tan cong | Sao chep the, tan cong relay, crack MIFARE Classic, NFC skimming, RFID fuzzing, bypass kiem soat truy cap voi Proxmark3 |
| **Tan cong di dong** | 6 tan cong | Bat IMSI, tram goc gia (Stingray), khai thac SS7, lo hong 5G NAS, tan cong ha cap, chan bat VoLTE |
| **Tan cong IoT** | 6 tan cong | Theo doi khoa mang Zigbee, ha cap Z-Wave S0, thu thap thong tin dang nhap MQTT, replay LoRaWAN ABP, MouseJack, BLE IoT relay |
| **Co so du lieu phan cung** | 12 thiet bi | Adapter WiFi (Alfa, TP-Link), sniffer Bluetooth (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; chipset, kha nang, ho tro che do monitor |
| **Co so du lieu CVE** | 17 CVE | CVE dac thu khong day cho chipset WiFi (Broadcom, Qualcomm, Intel), stack Bluetooth, firmware IoT &mdash; muc do nghiem trong, phien ban bi anh huong, kha dung exploit |
| **Khung tuan thu** | 5 khung | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; kiem soat dac thu khong day, danh sach kiem tra, phan tich khoang cach |

---

## Architecture

```
src/
  index.ts                    # Diem vao CLI (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # Thiet lap may chu MCP (stdio transport)
    tools.ts                  # Dang ky cong cu — tat ca 34 cong cu tong hop duoc lap rap tai day
  types/
    index.ts                  # Cac kieu chia se (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 co so tri thuc tich hop
    wifi-attacks.ts           # 47 dinh nghia tan cong WiFi
    bluetooth-attacks.ts      # 8 dinh nghia tan cong Bluetooth
    rf-attacks.ts             # 6 dinh nghia tan cong RF/SDR
    nfc-attacks.ts            # 6 dinh nghia tan cong NFC/RFID
    cellular-attacks.ts       # 6 dinh nghia tan cong Di dong/5G
    iot-attacks.ts            # 6 dinh nghia tan cong IoT
    hardware.ts               # 12 ho so thiet bi phan cung
    cve-database.ts           # 17 CVE khong day
    compliance.ts             # 5 khung tuan thu
  wifi/                       # Cong cu WiFi Core (8)
  bluetooth/                  # Cong cu Bluetooth (3)
  rf/                         # Cong cu RF/SDR (1)
  nfc/                        # Cong cu NFC/RFID (1)
  cellular/                   # Cong cu Di dong/5G (1)
  iot/                        # Cong cu IoT khong day (3)
  advanced/                   # Cong cu khong day nang cao (6)
  infrastructure/             # Cong cu ha tang (4)
  intelligence/               # Cong cu tinh bao (4)
  detection/                  # Cong cu phat hien (2)
  reporting/                  # Cong cu bao cao (1)
```

**Quyet dinh thiet ke:**

- **Dua tren co so tri thuc** &mdash; Khac voi cac cong cu phu thuoc API, chuc nang chinh hoat dong hoan toan ngoai tuyen tu 9 co so du lieu tich hop. Khong can API key, khong gioi han toc do, khong phu thuoc ben ngoai cho quy trinh lam viec chinh.
- **34 cong cu tong hop, 139 kha nang rieng le** &mdash; Moi cong cu la mot tong hop nhom cac phan tich lien quan. `find_wifi_attacks` khong chi liet ke tan cong &mdash; no tra ve phuong phap luan, phan cung can thiet, anh xa MITRE ATT&CK, chien luoc phat hien va bien phap doi pho.
- **2 phu thuoc runtime** &mdash; `@modelcontextprotocol/sdk` va `zod`. Khong co gi khac. Khong co module native, khong co phu thuoc nhi phan, khong co ma dac thu nen tang.
- **Tich hop truc tuyen tuy chon** &mdash; API WiGLE cho du lieu mang thuc te, Kismet cho IDS khong day truc tuyen. Phan tich chinh hoat dong ma khong can ca hai.
- **Nhan thuc tuan thu** &mdash; Moi phat hien duoc tu dong anh xa vao cac khung tuan thu lien quan (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) khi ap dung.
- **Anh xa MITRE ATT&CK** &mdash; Cac ky thuat tan cong bao gom ID ky thuat ATT&CK, danh muc chien thuat va nguon du lieu phat hien de tich hop SOC.

---

## Limitations

- Co so tri thuc la anh chup tai mot thoi diem &mdash; tan cong/CVE moi can cap nhat goi
- Tich hop WiGLE can API key mien phi de tra cuu mang
- WIDS truc tuyen Kismet can mot phien ban Kismet dang chay voi quyen truy cap API
- Khong co truyen khong day chu dong &mdash; may chu cung cap tinh bao va phuong phap luan, khong phai tiem goi
- Co so du lieu phan cung bao gom cac thiet bi nghien cuu bao mat pho bien nhat, khong day du
- Khung tuan thu tap trung vao cac kiem soat dac thu khong day, khong phai pham vi day du cua khung
- Da kiem tra tren macOS / Linux (Windows chua kiem tra)

---

## Part of the MCP Security Suite

| Du an | Linh vuc | Cong cu |
|-------|----------|---------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Kiem tra bao mat dua tren trinh duyet | 39 cong cu, Firefox, kiem tra injection |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Bao mat dam may (AWS/Azure/GCP) | 38 cong cu, 60+ kiem tra |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | Tinh trang bao mat GitHub | 39 cong cu, 45 kiem tra |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Tinh bao lo hong | 23 cong cu, 5 nguon |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT va trinh sat | 37 cong cu, 12 nguon |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark web va tinh bao de doa | 66 cong cu, 16 nguon |
| **wifi-security-mcp-server** | **Tinh bao bao mat khong day** | **34 cong cu, 9 co so tri thuc** |

---

<p align="center">
<b>Chi danh cho kiem tra va danh gia bao mat duoc uy quyen.</b><br>
Luon dam bao ban co su cho phep thich hop truoc khi thuc hien kiem tra bao mat khong day tren bat ky mang hoac thiet bi nao.<br>
Truy cap mang khong day hoac can thiep trai phep la bat hop phap o hau het cac khu vuc phap ly.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

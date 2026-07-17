<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <strong>繁體中文</strong> |
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

<h3 align="center">面向 AI 代理的無線安全情報。</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3)、藍牙 (BR/EDR、BLE)、RF/SDR、NFC/RFID、行動通訊/5G、IoT (Zigbee、Z-Wave、MQTT、LoRaWAN)、MouseJack、氣隙隔離、UWB、WiFi CSI、Miracast、WiFi Direct、無人機 RF、WIDS/WIPS、合規性 &mdash; 統一到一個 MCP 伺服器中。<br>
  您的 AI 代理可以<b>按需獲得全頻譜無線安全分析</b>，由 9 個內建知識庫提供支援，涵蓋 139 個獨立工具。
</p>

<br>

<p align="center">
  <a href="#the-problem">問題所在</a> &bull;
  <a href="#how-its-different">差異化</a> &bull;
  <a href="#quick-start">快速開始</a> &bull;
  <a href="#what-the-ai-can-do">AI 能做什麼</a> &bull;
  <a href="#tools-reference-34-composite-tools">工具 (34)</a> &bull;
  <a href="#knowledge-bases-9">知識庫</a> &bull;
  <a href="#architecture">架構</a> &bull;
  <a href="CHANGELOG.md">更新日誌</a> &bull;
  <a href="CONTRIBUTING.md">貢獻</a>
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

無線安全評估是進攻性安全中最碎片化的學科之一。WiFi 稽核需要一套工具，藍牙需要另一套，RF/SDR 又需要第三套，IoT 協定還需要另一套 &mdash; 每個領域都有自己的攻擊面、自己的漏洞、自己的合規要求。如今，您需要使用 aircrack-ng 進行 WPA 測試，用 Bettercap 進行 BLE 測試，用 HackRF 進行 SDR 測試，為每個晶片組查詢不同的 CVE 資料庫，分別參考 NIST 和 PCI-DSS，然後花數小時手動將發現關聯成一份完整的評估報告。

```
傳統無線安全工作流程：
  稽核 WiFi 網路                ->  aircrack-ng / Wireshark / Kismet
  測試藍牙安全性                ->  Bettercap / btlejack / Ubertooth
  分析 RF 訊號                  ->  HackRF / GNU Radio / GQRX
  檢查 NFC/RFID                 ->  Proxmark3 / libnfc
  評估行動通訊安全性            ->  srsRAN / OpenBTS
  測試 IoT 協定                 ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  查詢無線 CVE                  ->  NVD / vendor advisories（手動搜尋）
  檢查合規性                    ->  NIST / PCI-DSS / HIPAA 文件（手動）
  映射到 MITRE ATT&CK           ->  ATT&CK Navigator（手動映射）
  關聯所有內容                  ->  複製貼上到報告中
  ────────────────────────────────
  總計：每次評估數小時，大部分時間花在工具之間的上下文切換上
```

**wifi-security-mcp-server** 透過 [Model Context Protocol](https://modelcontextprotocol.io) 為您的 AI 代理提供 34 個組合工具，由 9 個知識庫支援，涵蓋 139 個獨立功能。代理可以分析網路、識別漏洞、將攻擊映射到 MITRE ATT&CK、檢查合規性，並產生可執行的報告 &mdash; 所有這些都在一次對話中完成。

```
使用 wifi-security-mcp-server：
  您：「稽核我們辦公室執行 WPA2-Enterprise 的無線網路安全性」

  代理：-> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "您的 WPA2-Enterprise 網路有 3 個關鍵發現：
            1. EAP-PEAP 未配置憑證固定 — 容易受到使用
               hostapd-mana 的邪惡雙胞胎攻擊 (MITRE T1557.002)
            2. 未啟用 802.11w (PMF) — 容易受到去認證攻擊
               (MITRE T1498.001)
            3. 無需用戶端互動即可擷取 PMKID 雜湊 — 可以使用
               hashcat 模式 22000 進行離線破解
            PCI-DSS 4.0：2 個控制不合規 (4.2.1, 11.2.1)。
            建議：遷移到 WPA3-Enterprise with SAE，啟用 PMF，
            部署 WIDS 進行非法 AP 偵測。」
```

---

## How It's Different

現有工具為您提供原始封包擷取和特定協定分析。wifi-security-mcp-server 使您的 AI 代理能夠**同時跨所有無線領域進行推理**，並具有深度知識庫支援。

<table>
<thead>
<tr>
<th></th>
<th>傳統方法</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>介面</b></td>
<td>10+ 種不同的 CLI、GUI 和硬體工具</td>
<td>MCP &mdash; AI 代理以對話方式呼叫工具</td>
</tr>
<tr>
<td><b>涵蓋範圍</b></td>
<td>一次一個協定</td>
<td>WiFi、藍牙、RF、NFC、行動通訊、IoT &mdash; 全部在一個伺服器中</td>
</tr>
<tr>
<td><b>知識</b></td>
<td>手動 CVE 查詢，手動 ATT&CK 映射</td>
<td>9 個內建知識庫，包含 139 個預映射項目</td>
</tr>
<tr>
<td><b>攻擊情報</b></td>
<td>Google 搜尋 + 部落格文章 + 研討會演講</td>
<td>47 個 WiFi + 8 個藍牙 + 6 個 RF + 6 個 NFC + 6 個行動通訊 + 6 個 IoT 攻擊，均包含工具、緩解措施、ATT&CK ID</td>
</tr>
<tr>
<td><b>合規性</b></td>
<td>閱讀 NIST/PCI-DSS/HIPAA PDF，手動映射控制</td>
<td>代理自動針對 5 個合規框架進行檢查</td>
</tr>
<tr>
<td><b>API 金鑰</b></td>
<td>不同服務的各種帳戶</td>
<td>核心功能無需 API 金鑰 &mdash; 知識庫驅動</td>
</tr>
<tr>
<td><b>設定</b></td>
<td>安裝 aircrack-ng、Bettercap、HackRF、Proxmark3、Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; 一條指令，零配置</td>
</tr>
</tbody>
</table>

---

## Quick Start

### 選項 1：npx（無需安裝）

```bash
npx wifi-security-mcp-server
```

所有 34 個工具立即可用。無需 API 金鑰 &mdash; 核心功能由知識庫驅動。

### 選項 2：複製

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### 環境變數（選用）

```bash
# WiGLE — 用於真實世界 WiFi 網路查詢的戰爭駕駛資料庫
export WIGLE_API_KEY=your-key

# Kismet — 即時無線入侵偵測
export KISMET_HOST=127.0.0.1      # 預設值：127.0.0.1
export KISMET_PORT=2501           # 預設值：2501
export KISMET_API_KEY=your-key
```

所有 API 金鑰均為選用。沒有金鑰的情況下，您仍然可以完全存取所有 34 個工具，由 9 個內建知識庫提供支援，涵蓋 WiFi 攻擊、藍牙攻擊、RF/SDR、NFC/RFID、行動通訊、IoT、硬體資料庫、CVE 情報和合規框架。

### 連接到您的 AI 代理

<details open>
<summary><b>Claude Code</b></summary>

```bash
# 使用 npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# 使用本機複製
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

新增到 `~/Library/Application Support/Claude/claude_desktop_config.json`：

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
<summary><b>Cursor / Windsurf / 其他 MCP 用戶端</b></summary>

相同的 JSON 配置格式。將指令指向 `npx wifi-security-mcp-server` 或您的本機安裝路徑。

</details>

### 開始查詢

```
您：「WPA3-SAE 網路存在哪些可能的攻擊，如何測試？」
```

就是這樣。代理會查詢攻擊、映射到 MITRE ATT&CK、推薦工具並提供逐步方法論 &mdash; 全部來自內建知識庫。

---

## What The AI Can Do

### WiFi 安全評估

```
您：「分析啟用了 WPS 的 WPA2-PSK 網路的安全性」

代理：-> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "在 WPA2-PSK + WPS 配置中發現關鍵漏洞：
          1. WPS Pixie Dust 攻擊 — 透過離線暴力破解 E-S1/E-S2
             隨機數，PIN 可在數秒內恢復（Reaver + PixieWPS）。
             無需用戶端互動即可完全恢復 PSK。
          2. PMKID 攻擊 — 四次握手的第一個封包包含
             PMKID 雜湊，可透過 hashcat -m 22000 離線破解。
             無需去認證，無需用戶端。
          3. 四次握手擷取 — EAPOL 訊框可透過
             airodump-ng + 去認證擷取，然後進行離線字典攻擊。
          優先事項：立即停用 WPS（最高風險），強制使用
          20+ 字元的強密碼 PSK，考慮遷移到 WPA3-SAE。」
```

### 藍牙 & BLE 分析

```
您：「我們基於 BLE 的門禁系統有哪些安全風險？」

代理：-> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "BLE 門禁系統 — 識別出 4 個關鍵風險：
          1. JustWorks 配對 — 無中間人保護。攻擊者可以
             使用 Ubertooth One 攔截配對 (MITRE T1040)。
          2. GATT 特徵嗅探 — 解鎖命令以明文傳送，
             可使用 gatttool 重放 (MITRE T1212)。
          3. BLE 中繼/重放攻擊 — 使用兩個裝置 +
             btlejack 中繼合法的解鎖訊號 (MITRE T1557)。
          4. MAC 位址追蹤 — 靜態 BLE MAC 可追蹤
             人員位置 (MITRE T1592.002)。
          建議：強制使用 LE Secure Connections (LESC)
          和數字比較，加密 GATT 特徵，實施滾動隨機數
          以防止重放攻擊。」
```

### IoT 無線稽核

```
您：「評估我們智慧建築 IoT 部署的無線安全性」

代理：-> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "智慧建築 IoT 無線評估 — 5 項發現：
          1. Zigbee：預設信任中心連結金鑰 (ZigBeeAlliance09)
             允許使用 KillerBee 攔截網路加入（嚴重）
          2. MQTT：連接埠 1883 上的代理未使用 TLS — 憑證
             和感測器資料以明文傳輸
          3. Z-Wave：S0 安全性存在已知金鑰交換漏洞
             — 建議升級到 S2
          4. MouseJack：3 個 Logitech Unifying 接收器容易
             受到按鍵注入攻擊 (CVE-2016-10761)
          5. WiFi：IoT 裝置與企業網路在同一 VLAN — 無
             網路分段
          優先修復：MQTT TLS，Zigbee 安裝碼，
          IoT VLAN 隔離，更換有漏洞的 Logitech 接收器。」
```

### 合規稽核

```
您：「檢查我們醫院的 WiFi 是否符合 HIPAA 無線要求」

代理：-> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "HIPAA 無線合規稽核 — 6 項發現：
          3 項不合規控制：
          - 164.312(a)(1)：未部署無線 IDS 進行非法 AP 偵測
          - 164.312(e)(1)：醫療裝置使用 WPA2-PSK（非 Enterprise）
          - 164.312(e)(2)：無無線流量加密稽核日誌
          3 項合規控制：
          - 164.310(a)(1)：已記錄實體 AP 位置
          - 164.312(a)(2)：802.1X with RADIUS 認證
          - 164.312(d)：員工裝置使用基於憑證的 EAP-TLS
          修復計畫：部署 WIDS（Kismet/AirMagnet），將
          醫療裝置遷移到 WPA2-Enterprise with MAB，在
          WLAN 控制器上啟用無線稽核日誌。」
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi 核心 (8) &mdash; 無需 API 金鑰</b></summary>

| 工具 | 描述 |
|------|------|
| `scan_wifi_networks` | 掃描和分析 WiFi 網路 &mdash; 發現 SSID、頻道、加密類型、訊號強度和安全配置錯誤 |
| `analyze_wifi_security` | WiFi 安全配置深度分析 &mdash; 加密強度、認證方法、已知弱點、攻擊面 |
| `find_wifi_attacks` | 查詢適用於 WiFi 目標的攻擊 &mdash; 傳回攻擊方法論、所需工具、MITRE ATT&CK 映射、緩解措施 |
| `simulate_evil_twin` | 模擬和分析邪惡雙胞胎 AP 攻擊場景 &mdash; hostapd-mana 配置、強制門戶、憑證擷取方法論 |
| `analyze_deauth` | 分析去認證攻擊向量 &mdash; 802.11w PMF 狀態、去認證偵測、對策、WIDS 整合 |
| `crack_wps` | 分析 WPS 破解攻擊向量 &mdash; Pixie Dust、暴力破解、空 PIN、預設 PIN 產生、Reaver/Bully 方法論 |
| `analyze_pmkid` | 分析基於 PMKID 的攻擊向量 &mdash; 透過 hcxdumptool + hashcat 模式 22000 進行無用戶端 WPA/WPA2 破解 |
| `audit_wifi67` | 稽核 WiFi 6 (802.11ax) 和 WiFi 7 (802.11be) 特定安全功能 &mdash; OWE、SAE、Enhanced Open、Multi-Link Operation |

</details>

<details>
<summary><b>藍牙 (3) &mdash; 無需 API 金鑰</b></summary>

| 工具 | 描述 |
|------|------|
| `scan_bluetooth` | 掃描和分析藍牙裝置 &mdash; BR/EDR 經典和 BLE 發現、服務列舉、配對分析 |
| `find_bluetooth_attacks` | 查詢適用的藍牙攻擊 &mdash; BlueBorne、KNOB、BIAS、BLE 中繼、MITM，包含工具和緩解措施 |
| `analyze_ble` | BLE 安全深度分析 &mdash; GATT 服務、配對方法、LE Secure Connections、特徵加密 |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; 無需 API 金鑰</b></summary>

| 工具 | 描述 |
|------|------|
| `analyze_rf_signal` | 分析 RF 訊號安全性 &mdash; 頻率分析、調變識別、重放攻擊可行性、SDR 工具推薦 |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; 無需 API 金鑰</b></summary>

| 工具 | 描述 |
|------|------|
| `analyze_nfc_security` | 分析 NFC/RFID 安全性 &mdash; 卡類型識別、門禁弱點、複製可行性、Proxmark3 方法論 |

</details>

<details>
<summary><b>行動通訊/5G (1) &mdash; 無需 API 金鑰</b></summary>

| 工具 | 描述 |
|------|------|
| `analyze_cellular_security` | 分析行動通訊網路安全性 &mdash; 2G/3G/4G/5G 協定弱點、IMSI 攔截器偵測、偽基站分析 |

</details>

<details>
<summary><b>IoT 無線 (3) &mdash; 無需 API 金鑰</b></summary>

| 工具 | 描述 |
|------|------|
| `analyze_zigbee` | 分析 Zigbee 網路安全性 &mdash; 信任中心策略、網路金鑰管理、KillerBee 攻擊方法論 |
| `scan_iot_wireless` | 掃描 IoT 無線協定 &mdash; Zigbee、Z-Wave、MQTT、LoRaWAN、CoAP 發現和漏洞分析 |
| `find_mousejack` | 分析 MouseJack 無線鍵盤/滑鼠漏洞 &mdash; 按鍵注入、未加密 HID、供應商特定繞過 |

</details>

<details>
<summary><b>進階無線 (6) &mdash; 無需 API 金鑰</b></summary>

| 工具 | 描述 |
|------|------|
| `analyze_airgap` | 分析氣隙隔離滲出技術 &mdash; 電磁、聲學、熱學、光學隱蔽通道和對策 |
| `analyze_uwb` | 分析超寬頻 (UWB) 安全性 &mdash; 測距操縱、汽車鑰匙扣和 AirTag 中繼攻擊、距離詐欺 |
| `analyze_wifi_csi` | 分析 WiFi 頻道狀態資訊 (CSI) 安全性 &mdash; 被動感測、活動識別、按鍵推斷風險 |
| `analyze_miracast` | 分析 Miracast/WiFi Display 安全性 &mdash; WFD 工作階段劫持、螢幕擷取、未授權顯示存取 |
| `analyze_wifi_direct` | 分析 WiFi Direct (P2P) 安全性 &mdash; 群組擁有者協商攻擊、P2P 中的 WPS 漏洞、惡意群組建立 |
| `analyze_drone_rf` | 分析無人機 RF 安全性 &mdash; 控制連結劫持、GPS 欺騙、視訊下行連結攔截、反無人機技術 |

</details>

<details>
<summary><b>基礎設施 (4) &mdash; 無需 API 金鑰（KISMET_* 選用於即時 WIDS）</b></summary>

| 工具 | 描述 |
|------|------|
| `audit_wlan_controller` | 稽核 WLAN 控制器配置 &mdash; Cisco WLC、Aruba、Meraki 安全設定、非法 AP 策略、RF 管理 |
| `analyze_captive_portal` | 分析強制門戶安全性 &mdash; 繞過技術、憑證收集風險、網路隔離、訪客 VLAN 安全 |
| `detect_mac_randomization` | 分析 MAC 位址隨機化 &mdash; iOS/Android/Windows 實作差異、追蹤抵抗、指紋繞過 |
| `analyze_hotspot20` | 分析 Hotspot 2.0 (Passpoint) 安全性 &mdash; ANQP、OSU、自動網路選擇風險、EAP 方法分析 |

</details>

<details>
<summary><b>情報 (4) &mdash; 無需 API 金鑰</b></summary>

| 工具 | 描述 |
|------|------|
| `lookup_wireless_cve` | 查詢無線特定 CVE &mdash; WiFi 晶片組漏洞、藍牙協定堆疊 CVE、驅動程式漏洞、韌體缺陷 |
| `lookup_hardware` | 查詢無線安全硬體 &mdash; WiFi 適配器、藍牙嗅探器、SDR 裝置、功能、晶片組相容性 |
| `map_wireless_attck` | 將無線攻擊映射到 MITRE ATT&CK 框架 &mdash; 技術 ID、戰術類別、偵測策略 |
| `analyze_medical_wireless` | 分析醫療裝置無線安全性 &mdash; 輸液幫浦、心臟節律器、病患監視器、FDA 指引、HIPAA 要求 |

</details>

<details>
<summary><b>偵測 (2) &mdash; 無需 API 金鑰</b></summary>

| 工具 | 描述 |
|------|------|
| `detect_wireless_attack` | 偵測正在進行的無線攻擊 &mdash; 去認證洪水、邪惡雙胞胎、KARMA、非法 AP、BLE 欺騙、RF 干擾指標 |
| `audit_wireless_compliance` | 針對合規框架稽核無線網路 &mdash; PCI-DSS 4.0、HIPAA、NIST 800-153、FedRAMP、ISO 27001 無線控制 |

</details>

<details>
<summary><b>報告 (1) &mdash; 無需 API 金鑰</b></summary>

| 工具 | 描述 |
|------|------|
| `export_report` | 匯出無線安全評估報告 &mdash; 發現、風險評級、合規狀態、修復藍圖、執行摘要 |

</details>

---

### CLI Usage

```bash
# 列出所有可用工具
npx wifi-security-mcp-server --list

# 直接執行任何工具
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

該伺服器附帶 9 個內建知識庫 &mdash; 無需 API 金鑰、無外部相依、無速率限制。每次工具查詢都會從這些資料庫中取得結構化情報進行增強。

| 知識庫 | 條目數 | 提供內容 |
|--------|--------|----------|
| **WiFi 攻擊** | 47 個攻擊 | WPA/WPA2/WPA3 攻擊技術、邪惡雙胞胎變體、PMKID、KRACK、FragAttacks、去認證、WPS 漏洞利用 &mdash; 每個都包含工具、緩解措施、MITRE ATT&CK 映射 |
| **藍牙攻擊** | 8 個攻擊 | BlueBorne、KNOB、BIAS、BLE 中繼、MITM、BLE 模糊測試、藍牙冒充 &mdash; 包含 CVE 和偵測策略 |
| **RF/SDR 攻擊** | 6 個攻擊 | 重放攻擊、干擾、訊號注入、基於 SDR 的攔截、RF 指紋繞過、頻譜分析技術 |
| **NFC/RFID 攻擊** | 6 個攻擊 | 卡複製、中繼攻擊、MIFARE Classic 破解、NFC 竊取、RFID 模糊測試、使用 Proxmark3 的門禁繞過 |
| **行動通訊攻擊** | 6 個攻擊 | IMSI 攔截、偽基站 (Stingray)、SS7 利用、5G NAS 漏洞、降級攻擊、VoLTE 攔截 |
| **IoT 攻擊** | 6 個攻擊 | Zigbee 網路金鑰嗅探、Z-Wave S0 降級、MQTT 憑證收集、LoRaWAN ABP 重放、MouseJack、BLE IoT 中繼 |
| **硬體資料庫** | 12 個裝置 | WiFi 適配器 (Alfa, TP-Link)、藍牙嗅探器 (Ubertooth)、SDR (HackRF, RTL-SDR)、NFC (Proxmark3) &mdash; 晶片組、功能、監控模式支援 |
| **CVE 資料庫** | 17 個 CVE | WiFi 晶片組 (Broadcom, Qualcomm, Intel)、藍牙協定堆疊、IoT 韌體的無線特定 CVE &mdash; 嚴重性、受影響版本、漏洞利用可用性 |
| **合規框架** | 5 個框架 | PCI-DSS 4.0、HIPAA、NIST SP 800-153、FedRAMP、ISO 27001 &mdash; 無線特定控制、稽核清單、差距分析 |

---

## Architecture

```
src/
  index.ts                    # CLI 進入點 (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # MCP 伺服器設定 (stdio transport)
    tools.ts                  # 工具註冊 — 所有 34 個組合工具在此組裝
  types/
    index.ts                  # 共享類型 (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 個內建知識庫
    wifi-attacks.ts           # 47 個 WiFi 攻擊定義
    bluetooth-attacks.ts      # 8 個藍牙攻擊定義
    rf-attacks.ts             # 6 個 RF/SDR 攻擊定義
    nfc-attacks.ts            # 6 個 NFC/RFID 攻擊定義
    cellular-attacks.ts       # 6 個行動通訊/5G 攻擊定義
    iot-attacks.ts            # 6 個 IoT 攻擊定義
    hardware.ts               # 12 個硬體裝置設定檔
    cve-database.ts           # 17 個無線 CVE
    compliance.ts             # 5 個合規框架
  wifi/                       # WiFi 核心工具 (8)
  bluetooth/                  # 藍牙工具 (3)
  rf/                         # RF/SDR 工具 (1)
  nfc/                        # NFC/RFID 工具 (1)
  cellular/                   # 行動通訊/5G 工具 (1)
  iot/                        # IoT 無線工具 (3)
  advanced/                   # 進階無線工具 (6)
  infrastructure/             # 基礎設施工具 (4)
  intelligence/               # 情報工具 (4)
  detection/                  # 偵測工具 (2)
  reporting/                  # 報告工具 (1)
```

**設計決策：**

- **知識庫驅動** &mdash; 與依賴 API 的工具不同，核心功能完全從 9 個內建資料庫離線執行。主要工作流程無需 API 金鑰、無速率限制、無外部相依。
- **34 個組合工具，139 個獨立功能** &mdash; 每個工具都是捆綁相關分析的組合體。`find_wifi_attacks` 不僅僅列出攻擊 &mdash; 它傳回方法論、所需硬體、MITRE ATT&CK 映射、偵測策略和對策。
- **2 個執行時期相依** &mdash; `@modelcontextprotocol/sdk` 和 `zod`。僅此而已。無原生模組、無二進位相依、無平台特定程式碼。
- **選用即時整合** &mdash; WiGLE API 用於真實世界網路資料，Kismet 用於即時無線 IDS。核心分析無需任何一個即可運作。
- **合規感知** &mdash; 每個發現都會在適用時自動映射到相關合規框架（PCI-DSS、HIPAA、NIST、FedRAMP、ISO 27001）。
- **MITRE ATT&CK 映射** &mdash; 攻擊技術包含 ATT&CK 技術 ID、戰術類別和偵測資料來源，用於 SOC 整合。

---

## Limitations

- 知識庫是時間點快照 &mdash; 新攻擊/CVE 需要套件更新
- WiGLE 整合需要免費 API 金鑰用於網路查詢
- Kismet 即時 WIDS 需要執行中的 Kismet 執行個體並開放 API 存取
- 無主動無線傳輸 &mdash; 伺服器提供情報和方法論，而非封包注入
- 硬體資料庫涵蓋最常見的安全研究裝置，並非詳盡無遺
- 合規框架專注於無線特定控制，而非完整框架涵蓋
- macOS / Linux 已測試（Windows 未測試）

---

## Part of the MCP Security Suite

| 專案 | 領域 | 工具 |
|------|------|------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | 基於瀏覽器的安全測試 | 39 個工具，Firefox，注入測試 |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | 雲端安全 (AWS/Azure/GCP) | 38 個工具，60+ 項檢查 |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub 安全態勢 | 39 個工具，45 項檢查 |
| [cve-mcp](https://github.com/badchars/cve-mcp) | 漏洞情報 | 23 個工具，5 個來源 |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT 與偵察 | 37 個工具，12 個來源 |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | 暗網與威脅情報 | 66 個工具，16 個來源 |
| **wifi-security-mcp-server** | **無線安全情報** | **34 個工具，9 個知識庫** |

---

<p align="center">
<b>僅用於授權的安全測試和評估。</b><br>
在對任何網路或裝置進行無線安全測試之前，請始終確保您已獲得適當的授權。<br>
在大多數司法管轄區，未經授權的無線網路存取或干擾是違法的。
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

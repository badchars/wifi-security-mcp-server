<p align="center">
  <a href="README.md">English</a> |
  <strong>简体中文</strong> |
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

<h3 align="center">面向 AI 代理的无线安全情报。</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3)、蓝牙 (BR/EDR、BLE)、RF/SDR、NFC/RFID、蜂窝/5G、IoT (Zigbee、Z-Wave、MQTT、LoRaWAN)、MouseJack、空气隔离、UWB、WiFi CSI、Miracast、WiFi Direct、无人机 RF、WIDS/WIPS、合规性 &mdash; 统一到一个 MCP 服务器中。<br>
  您的 AI 代理可以<b>按需获得全频谱无线安全分析</b>，由 9 个内置知识库提供支持，涵盖 139 个独立工具。
</p>

<br>

<p align="center">
  <a href="#the-problem">问题所在</a> &bull;
  <a href="#how-its-different">差异化</a> &bull;
  <a href="#quick-start">快速开始</a> &bull;
  <a href="#what-the-ai-can-do">AI 能做什么</a> &bull;
  <a href="#tools-reference-34-composite-tools">工具 (34)</a> &bull;
  <a href="#knowledge-bases-9">知识库</a> &bull;
  <a href="#architecture">架构</a> &bull;
  <a href="CHANGELOG.md">更新日志</a> &bull;
  <a href="CONTRIBUTING.md">贡献</a>
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

无线安全评估是进攻性安全中最碎片化的学科之一。WiFi 审计需要一套工具，蓝牙需要另一套，RF/SDR 又需要第三套，IoT 协议还需要另一套 &mdash; 每个领域都有自己的攻击面、自己的漏洞、自己的合规要求。如今，您需要使用 aircrack-ng 进行 WPA 测试，用 Bettercap 进行 BLE 测试，用 HackRF 进行 SDR 测试，为每个芯片组查询不同的 CVE 数据库，分别参考 NIST 和 PCI-DSS，然后花数小时手动将发现关联成一份完整的评估报告。

```
传统无线安全工作流程：
  审计 WiFi 网络                ->  aircrack-ng / Wireshark / Kismet
  测试蓝牙安全性                ->  Bettercap / btlejack / Ubertooth
  分析 RF 信号                  ->  HackRF / GNU Radio / GQRX
  检查 NFC/RFID                 ->  Proxmark3 / libnfc
  评估蜂窝安全性                ->  srsRAN / OpenBTS
  测试 IoT 协议                 ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  查找无线 CVE                  ->  NVD / vendor advisories（手动搜索）
  检查合规性                    ->  NIST / PCI-DSS / HIPAA 文档（手动）
  映射到 MITRE ATT&CK           ->  ATT&CK Navigator（手动映射）
  关联所有内容                  ->  复制粘贴到报告中
  ────────────────────────────────
  总计：每次评估数小时，大部分时间花在工具之间的上下文切换上
```

**wifi-security-mcp-server** 通过 [Model Context Protocol](https://modelcontextprotocol.io) 为您的 AI 代理提供 34 个组合工具，由 9 个知识库支持，涵盖 139 个独立功能。代理可以分析网络、识别漏洞、将攻击映射到 MITRE ATT&CK、检查合规性，并生成可操作的报告 &mdash; 所有这些都在一次对话中完成。

```
使用 wifi-security-mcp-server：
  您："审计我们办公室运行 WPA2-Enterprise 的无线网络安全性"

  代理：-> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "您的 WPA2-Enterprise 网络有 3 个关键发现：
            1. EAP-PEAP 未配置证书固定 — 容易受到使用
               hostapd-mana 的邪恶双胞胎攻击 (MITRE T1557.002)
            2. 未启用 802.11w (PMF) — 容易受到去认证攻击
               (MITRE T1498.001)
            3. 无需客户端交互即可提取 PMKID 哈希 — 可以使用
               hashcat 模式 22000 进行离线破解
            PCI-DSS 4.0：2 个控制不合规 (4.2.1, 11.2.1)。
            建议：迁移到 WPA3-Enterprise with SAE，启用 PMF，
            部署 WIDS 进行非法 AP 检测。"
```

---

## How It's Different

现有工具为您提供原始数据包捕获和特定协议分析。wifi-security-mcp-server 使您的 AI 代理能够**同时跨所有无线领域进行推理**，并具有深度知识库支持。

<table>
<thead>
<tr>
<th></th>
<th>传统方法</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>界面</b></td>
<td>10+ 种不同的 CLI、GUI 和硬件工具</td>
<td>MCP &mdash; AI 代理以对话方式调用工具</td>
</tr>
<tr>
<td><b>覆盖范围</b></td>
<td>一次一个协议</td>
<td>WiFi、蓝牙、RF、NFC、蜂窝、IoT &mdash; 全部在一个服务器中</td>
</tr>
<tr>
<td><b>知识</b></td>
<td>手动 CVE 查询，手动 ATT&CK 映射</td>
<td>9 个内置知识库，包含 139 个预映射项目</td>
</tr>
<tr>
<td><b>攻击情报</b></td>
<td>Google 搜索 + 博客文章 + 会议演讲</td>
<td>47 个 WiFi + 8 个蓝牙 + 6 个 RF + 6 个 NFC + 6 个蜂窝 + 6 个 IoT 攻击，均包含工具、缓解措施、ATT&CK ID</td>
</tr>
<tr>
<td><b>合规性</b></td>
<td>阅读 NIST/PCI-DSS/HIPAA PDF，手动映射控制</td>
<td>代理自动针对 5 个合规框架进行检查</td>
</tr>
<tr>
<td><b>API 密钥</b></td>
<td>不同服务的各种账户</td>
<td>核心功能无需 API 密钥 &mdash; 知识库驱动</td>
</tr>
<tr>
<td><b>设置</b></td>
<td>安装 aircrack-ng、Bettercap、HackRF、Proxmark3、Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; 一条命令，零配置</td>
</tr>
</tbody>
</table>

---

## Quick Start

### 选项 1：npx（无需安装）

```bash
npx wifi-security-mcp-server
```

所有 34 个工具立即可用。无需 API 密钥 &mdash; 核心功能由知识库驱动。

### 选项 2：克隆

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### 环境变量（可选）

```bash
# WiGLE — 用于真实世界 WiFi 网络查询的战争驾驶数据库
export WIGLE_API_KEY=your-key

# Kismet — 实时无线入侵检测
export KISMET_HOST=127.0.0.1      # 默认值：127.0.0.1
export KISMET_PORT=2501           # 默认值：2501
export KISMET_API_KEY=your-key
```

所有 API 密钥均为可选。没有密钥的情况下，您仍然可以完全访问所有 34 个工具，由 9 个内置知识库提供支持，涵盖 WiFi 攻击、蓝牙攻击、RF/SDR、NFC/RFID、蜂窝、IoT、硬件数据库、CVE 情报和合规框架。

### 连接到您的 AI 代理

<details open>
<summary><b>Claude Code</b></summary>

```bash
# 使用 npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# 使用本地克隆
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

添加到 `~/Library/Application Support/Claude/claude_desktop_config.json`：

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
<summary><b>Cursor / Windsurf / 其他 MCP 客户端</b></summary>

相同的 JSON 配置格式。将命令指向 `npx wifi-security-mcp-server` 或您的本地安装路径。

</details>

### 开始查询

```
您："WPA3-SAE 网络存在哪些可能的攻击，如何测试？"
```

就是这样。代理会查找攻击、映射到 MITRE ATT&CK、推荐工具并提供逐步方法论 &mdash; 全部来自内置知识库。

---

## What The AI Can Do

### WiFi 安全评估

```
您："分析启用了 WPS 的 WPA2-PSK 网络的安全性"

代理：-> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "在 WPA2-PSK + WPS 配置中发现关键漏洞：
          1. WPS Pixie Dust 攻击 — 通过离线暴力破解 E-S1/E-S2
             随机数，PIN 可在数秒内恢复（Reaver + PixieWPS）。
             无需客户端交互即可完全恢复 PSK。
          2. PMKID 攻击 — 四次握手的第一个数据包包含
             PMKID 哈希，可通过 hashcat -m 22000 离线破解。
             无需去认证，无需客户端。
          3. 四次握手捕获 — EAPOL 帧可通过
             airodump-ng + 去认证捕获，然后进行离线字典攻击。
          优先事项：立即禁用 WPS（最高风险），强制使用
          20+ 字符的强密码 PSK，考虑迁移到 WPA3-SAE。"
```

### 蓝牙 & BLE 分析

```
您："我们基于 BLE 的门禁系统有哪些安全风险？"

代理：-> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "BLE 门禁系统 — 识别出 4 个关键风险：
          1. JustWorks 配对 — 无中间人保护。攻击者可以
             使用 Ubertooth One 拦截配对 (MITRE T1040)。
          2. GATT 特征嗅探 — 解锁命令以明文发送，
             可使用 gatttool 重放 (MITRE T1212)。
          3. BLE 中继/重放攻击 — 使用两个设备 +
             btlejack 中继合法的解锁信号 (MITRE T1557)。
          4. MAC 地址追踪 — 静态 BLE MAC 可追踪
             人员位置 (MITRE T1592.002)。
          建议：强制使用 LE Secure Connections (LESC)
          和数字比较，加密 GATT 特征，实施滚动随机数
          以防止重放攻击。"
```

### IoT 无线审计

```
您："评估我们智能建筑 IoT 部署的无线安全性"

代理：-> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "智能建筑 IoT 无线评估 — 5 项发现：
          1. Zigbee：默认信任中心链接密钥 (ZigBeeAlliance09)
             允许使用 KillerBee 拦截网络加入（严重）
          2. MQTT：端口 1883 上的代理未使用 TLS — 凭据
             和传感器数据以明文传输
          3. Z-Wave：S0 安全性存在已知密钥交换漏洞
             — 建议升级到 S2
          4. MouseJack：3 个 Logitech Unifying 接收器容易
             受到击键注入攻击 (CVE-2016-10761)
          5. WiFi：IoT 设备与企业网络在同一 VLAN — 无
             网络分段
          优先修复：MQTT TLS，Zigbee 安装码，
          IoT VLAN 隔离，更换有漏洞的 Logitech 接收器。"
```

### 合规审计

```
您："检查我们医院的 WiFi 是否符合 HIPAA 无线要求"

代理：-> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "HIPAA 无线合规审计 — 6 项发现：
          3 项不合规控制：
          - 164.312(a)(1)：未部署无线 IDS 进行非法 AP 检测
          - 164.312(e)(1)：医疗设备使用 WPA2-PSK（非 Enterprise）
          - 164.312(e)(2)：无无线流量加密审计日志
          3 项合规控制：
          - 164.310(a)(1)：已记录物理 AP 位置
          - 164.312(a)(2)：802.1X with RADIUS 认证
          - 164.312(d)：员工设备使用基于证书的 EAP-TLS
          修复计划：部署 WIDS（Kismet/AirMagnet），将
          医疗设备迁移到 WPA2-Enterprise with MAB，在
          WLAN 控制器上启用无线审计日志。"
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi 核心 (8) &mdash; 无需 API 密钥</b></summary>

| 工具 | 描述 |
|------|------|
| `scan_wifi_networks` | 扫描和分析 WiFi 网络 &mdash; 发现 SSID、信道、加密类型、信号强度和安全配置错误 |
| `analyze_wifi_security` | WiFi 安全配置深度分析 &mdash; 加密强度、认证方法、已知弱点、攻击面 |
| `find_wifi_attacks` | 查找适用于 WiFi 目标的攻击 &mdash; 返回攻击方法论、所需工具、MITRE ATT&CK 映射、缓解措施 |
| `simulate_evil_twin` | 模拟和分析邪恶双胞胎 AP 攻击场景 &mdash; hostapd-mana 配置、强制门户、凭据捕获方法论 |
| `analyze_deauth` | 分析去认证攻击向量 &mdash; 802.11w PMF 状态、去认证检测、对策、WIDS 集成 |
| `crack_wps` | 分析 WPS 破解攻击向量 &mdash; Pixie Dust、暴力破解、空 PIN、默认 PIN 生成、Reaver/Bully 方法论 |
| `analyze_pmkid` | 分析基于 PMKID 的攻击向量 &mdash; 通过 hcxdumptool + hashcat 模式 22000 进行无客户端 WPA/WPA2 破解 |
| `audit_wifi67` | 审计 WiFi 6 (802.11ax) 和 WiFi 7 (802.11be) 特定安全功能 &mdash; OWE、SAE、Enhanced Open、Multi-Link Operation |

</details>

<details>
<summary><b>蓝牙 (3) &mdash; 无需 API 密钥</b></summary>

| 工具 | 描述 |
|------|------|
| `scan_bluetooth` | 扫描和分析蓝牙设备 &mdash; BR/EDR 经典和 BLE 发现、服务枚举、配对分析 |
| `find_bluetooth_attacks` | 查找适用的蓝牙攻击 &mdash; BlueBorne、KNOB、BIAS、BLE 中继、MITM，包含工具和缓解措施 |
| `analyze_ble` | BLE 安全深度分析 &mdash; GATT 服务、配对方法、LE Secure Connections、特征加密 |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; 无需 API 密钥</b></summary>

| 工具 | 描述 |
|------|------|
| `analyze_rf_signal` | 分析 RF 信号安全性 &mdash; 频率分析、调制识别、重放攻击可行性、SDR 工具推荐 |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; 无需 API 密钥</b></summary>

| 工具 | 描述 |
|------|------|
| `analyze_nfc_security` | 分析 NFC/RFID 安全性 &mdash; 卡类型识别、门禁弱点、克隆可行性、Proxmark3 方法论 |

</details>

<details>
<summary><b>蜂窝/5G (1) &mdash; 无需 API 密钥</b></summary>

| 工具 | 描述 |
|------|------|
| `analyze_cellular_security` | 分析蜂窝网络安全性 &mdash; 2G/3G/4G/5G 协议弱点、IMSI 捕获器检测、伪基站分析 |

</details>

<details>
<summary><b>IoT 无线 (3) &mdash; 无需 API 密钥</b></summary>

| 工具 | 描述 |
|------|------|
| `analyze_zigbee` | 分析 Zigbee 网络安全性 &mdash; 信任中心策略、网络密钥管理、KillerBee 攻击方法论 |
| `scan_iot_wireless` | 扫描 IoT 无线协议 &mdash; Zigbee、Z-Wave、MQTT、LoRaWAN、CoAP 发现和漏洞分析 |
| `find_mousejack` | 分析 MouseJack 无线键盘/鼠标漏洞 &mdash; 击键注入、未加密 HID、供应商特定绕过 |

</details>

<details>
<summary><b>高级无线 (6) &mdash; 无需 API 密钥</b></summary>

| 工具 | 描述 |
|------|------|
| `analyze_airgap` | 分析空气隔离渗出技术 &mdash; 电磁、声学、热学、光学隐蔽通道和对策 |
| `analyze_uwb` | 分析超宽带 (UWB) 安全性 &mdash; 测距操纵、汽车钥匙扣和 AirTag 中继攻击、距离欺诈 |
| `analyze_wifi_csi` | 分析 WiFi 信道状态信息 (CSI) 安全性 &mdash; 被动感知、活动识别、击键推断风险 |
| `analyze_miracast` | 分析 Miracast/WiFi Display 安全性 &mdash; WFD 会话劫持、屏幕捕获、未授权显示访问 |
| `analyze_wifi_direct` | 分析 WiFi Direct (P2P) 安全性 &mdash; 组所有者协商攻击、P2P 中的 WPS 漏洞、恶意组建立 |
| `analyze_drone_rf` | 分析无人机 RF 安全性 &mdash; 控制链路劫持、GPS 欺骗、视频下行链路拦截、反无人机技术 |

</details>

<details>
<summary><b>基础设施 (4) &mdash; 无需 API 密钥（KISMET_* 可选用于实时 WIDS）</b></summary>

| 工具 | 描述 |
|------|------|
| `audit_wlan_controller` | 审计 WLAN 控制器配置 &mdash; Cisco WLC、Aruba、Meraki 安全设置、非法 AP 策略、RF 管理 |
| `analyze_captive_portal` | 分析强制门户安全性 &mdash; 绕过技术、凭据收集风险、网络隔离、访客 VLAN 安全 |
| `detect_mac_randomization` | 分析 MAC 地址随机化 &mdash; iOS/Android/Windows 实现差异、追踪抵抗、指纹绕过 |
| `analyze_hotspot20` | 分析 Hotspot 2.0 (Passpoint) 安全性 &mdash; ANQP、OSU、自动网络选择风险、EAP 方法分析 |

</details>

<details>
<summary><b>情报 (4) &mdash; 无需 API 密钥</b></summary>

| 工具 | 描述 |
|------|------|
| `lookup_wireless_cve` | 查找无线特定 CVE &mdash; WiFi 芯片组漏洞、蓝牙协议栈 CVE、驱动程序漏洞、固件缺陷 |
| `lookup_hardware` | 查找无线安全硬件 &mdash; WiFi 适配器、蓝牙嗅探器、SDR 设备、功能、芯片组兼容性 |
| `map_wireless_attck` | 将无线攻击映射到 MITRE ATT&CK 框架 &mdash; 技术 ID、战术类别、检测策略 |
| `analyze_medical_wireless` | 分析医疗设备无线安全性 &mdash; 输液泵、心脏起搏器、患者监护仪、FDA 指南、HIPAA 要求 |

</details>

<details>
<summary><b>检测 (2) &mdash; 无需 API 密钥</b></summary>

| 工具 | 描述 |
|------|------|
| `detect_wireless_attack` | 检测正在进行的无线攻击 &mdash; 去认证洪水、邪恶双胞胎、KARMA、非法 AP、BLE 欺骗、RF 干扰指标 |
| `audit_wireless_compliance` | 针对合规框架审计无线网络 &mdash; PCI-DSS 4.0、HIPAA、NIST 800-153、FedRAMP、ISO 27001 无线控制 |

</details>

<details>
<summary><b>报告 (1) &mdash; 无需 API 密钥</b></summary>

| 工具 | 描述 |
|------|------|
| `export_report` | 导出无线安全评估报告 &mdash; 发现、风险评级、合规状态、修复路线图、执行摘要 |

</details>

---

### CLI Usage

```bash
# 列出所有可用工具
npx wifi-security-mcp-server --list

# 直接运行任何工具
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

该服务器附带 9 个内置知识库 &mdash; 无需 API 密钥、无外部依赖、无速率限制。每次工具查询都会从这些数据库中获取结构化情报进行增强。

| 知识库 | 条目数 | 提供内容 |
|--------|--------|----------|
| **WiFi 攻击** | 47 个攻击 | WPA/WPA2/WPA3 攻击技术、邪恶双胞胎变体、PMKID、KRACK、FragAttacks、去认证、WPS 漏洞利用 &mdash; 每个都包含工具、缓解措施、MITRE ATT&CK 映射 |
| **蓝牙攻击** | 8 个攻击 | BlueBorne、KNOB、BIAS、BLE 中继、MITM、BLE 模糊测试、蓝牙冒充 &mdash; 包含 CVE 和检测策略 |
| **RF/SDR 攻击** | 6 个攻击 | 重放攻击、干扰、信号注入、基于 SDR 的拦截、RF 指纹绕过、频谱分析技术 |
| **NFC/RFID 攻击** | 6 个攻击 | 卡克隆、中继攻击、MIFARE Classic 破解、NFC 窃取、RFID 模糊测试、使用 Proxmark3 的门禁绕过 |
| **蜂窝攻击** | 6 个攻击 | IMSI 捕获、伪基站 (Stingray)、SS7 利用、5G NAS 漏洞、降级攻击、VoLTE 拦截 |
| **IoT 攻击** | 6 个攻击 | Zigbee 网络密钥嗅探、Z-Wave S0 降级、MQTT 凭据收集、LoRaWAN ABP 重放、MouseJack、BLE IoT 中继 |
| **硬件数据库** | 12 个设备 | WiFi 适配器 (Alfa, TP-Link)、蓝牙嗅探器 (Ubertooth)、SDR (HackRF, RTL-SDR)、NFC (Proxmark3) &mdash; 芯片组、功能、监控模式支持 |
| **CVE 数据库** | 17 个 CVE | WiFi 芯片组 (Broadcom, Qualcomm, Intel)、蓝牙协议栈、IoT 固件的无线特定 CVE &mdash; 严重性、受影响版本、漏洞利用可用性 |
| **合规框架** | 5 个框架 | PCI-DSS 4.0、HIPAA、NIST SP 800-153、FedRAMP、ISO 27001 &mdash; 无线特定控制、审计清单、差距分析 |

---

## Architecture

```
src/
  index.ts                    # CLI 入口点 (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # MCP 服务器设置 (stdio transport)
    tools.ts                  # 工具注册 — 所有 34 个组合工具在此组装
  types/
    index.ts                  # 共享类型 (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 个内置知识库
    wifi-attacks.ts           # 47 个 WiFi 攻击定义
    bluetooth-attacks.ts      # 8 个蓝牙攻击定义
    rf-attacks.ts             # 6 个 RF/SDR 攻击定义
    nfc-attacks.ts            # 6 个 NFC/RFID 攻击定义
    cellular-attacks.ts       # 6 个蜂窝/5G 攻击定义
    iot-attacks.ts            # 6 个 IoT 攻击定义
    hardware.ts               # 12 个硬件设备配置文件
    cve-database.ts           # 17 个无线 CVE
    compliance.ts             # 5 个合规框架
  wifi/                       # WiFi 核心工具 (8)
  bluetooth/                  # 蓝牙工具 (3)
  rf/                         # RF/SDR 工具 (1)
  nfc/                        # NFC/RFID 工具 (1)
  cellular/                   # 蜂窝/5G 工具 (1)
  iot/                        # IoT 无线工具 (3)
  advanced/                   # 高级无线工具 (6)
  infrastructure/             # 基础设施工具 (4)
  intelligence/               # 情报工具 (4)
  detection/                  # 检测工具 (2)
  reporting/                  # 报告工具 (1)
```

**设计决策：**

- **知识库驱动** &mdash; 与依赖 API 的工具不同，核心功能完全从 9 个内置数据库离线运行。主要工作流无需 API 密钥、无速率限制、无外部依赖。
- **34 个组合工具，139 个独立功能** &mdash; 每个工具都是捆绑相关分析的组合体。`find_wifi_attacks` 不仅仅列出攻击 &mdash; 它返回方法论、所需硬件、MITRE ATT&CK 映射、检测策略和对策。
- **2 个运行时依赖** &mdash; `@modelcontextprotocol/sdk` 和 `zod`。仅此而已。无原生模块、无二进制依赖、无平台特定代码。
- **可选实时集成** &mdash; WiGLE API 用于真实世界网络数据，Kismet 用于实时无线 IDS。核心分析无需任何一个即可工作。
- **合规感知** &mdash; 每个发现都会在适用时自动映射到相关合规框架（PCI-DSS、HIPAA、NIST、FedRAMP、ISO 27001）。
- **MITRE ATT&CK 映射** &mdash; 攻击技术包含 ATT&CK 技术 ID、战术类别和检测数据源，用于 SOC 集成。

---

## Limitations

- 知识库是时间点快照 &mdash; 新攻击/CVE 需要软件包更新
- WiGLE 集成需要免费 API 密钥用于网络查询
- Kismet 实时 WIDS 需要运行中的 Kismet 实例并开放 API 访问
- 无主动无线传输 &mdash; 服务器提供情报和方法论，而非数据包注入
- 硬件数据库涵盖最常见的安全研究设备，并非详尽无遗
- 合规框架专注于无线特定控制，而非完整框架覆盖
- macOS / Linux 已测试（Windows 未测试）

---

## Part of the MCP Security Suite

| 项目 | 领域 | 工具 |
|------|------|------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | 基于浏览器的安全测试 | 39 个工具，Firefox，注入测试 |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | 云安全 (AWS/Azure/GCP) | 38 个工具，60+ 项检查 |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub 安全态势 | 39 个工具，45 项检查 |
| [cve-mcp](https://github.com/badchars/cve-mcp) | 漏洞情报 | 23 个工具，5 个来源 |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT 与侦察 | 37 个工具，12 个来源 |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | 暗网与威胁情报 | 66 个工具，16 个来源 |
| **wifi-security-mcp-server** | **无线安全情报** | **34 个工具，9 个知识库** |

---

<p align="center">
<b>仅用于授权的安全测试和评估。</b><br>
在对任何网络或设备进行无线安全测试之前，请始终确保您已获得适当的授权。<br>
在大多数司法管辖区，未经授权的无线网络访问或干扰是违法的。
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

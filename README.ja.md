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
  <strong>日本語</strong> |
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

<h3 align="center">AIエージェントのためのワイヤレスセキュリティインテリジェンス。</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3)、Bluetooth (BR/EDR、BLE)、RF/SDR、NFC/RFID、セルラー/5G、IoT (Zigbee、Z-Wave、MQTT、LoRaWAN)、MouseJack、エアギャップ、UWB、WiFi CSI、Miracast、WiFi Direct、ドローンRF、WIDS/WIPS、コンプライアンス &mdash; すべてを1つのMCPサーバーに統合。<br>
  AIエージェントが9つの組み込みナレッジベースで139の個別ツールをカバーする<b>フルスペクトルワイヤレスセキュリティ分析をオンデマンド</b>で実行します。
</p>

<br>

<p align="center">
  <a href="#the-problem">問題点</a> &bull;
  <a href="#how-its-different">違い</a> &bull;
  <a href="#quick-start">クイックスタート</a> &bull;
  <a href="#what-the-ai-can-do">AIができること</a> &bull;
  <a href="#tools-reference-34-composite-tools">ツール (34)</a> &bull;
  <a href="#knowledge-bases-9">ナレッジベース</a> &bull;
  <a href="#architecture">アーキテクチャ</a> &bull;
  <a href="CHANGELOG.md">変更履歴</a> &bull;
  <a href="CONTRIBUTING.md">コントリビューション</a>
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

ワイヤレスセキュリティ評価は、攻撃的セキュリティの中で最も断片化された分野の一つです。WiFi監査には1セットのツールが、Bluetoothには別のセットが、RF/SDRには3番目が、IoTプロトコルにはさらに別のものが必要です &mdash; そして各領域には独自の攻撃面、独自の脆弱性、独自のコンプライアンス要件があります。現在、WPA用にaircrack-ngを実行し、BLE用にBettercapを使用し、SDR用にHackRFを起動し、各チップセットの異なるCVEデータベースを参照し、NISTとPCI-DSSを個別に参照し、その後数時間をかけて手動で発見事項を一貫した評価レポートに相関付けます。

```
従来のワイヤレスセキュリティワークフロー：
  WiFiネットワーク監査             ->  aircrack-ng / Wireshark / Kismet
  Bluetoothセキュリティテスト      ->  Bettercap / btlejack / Ubertooth
  RF信号分析                       ->  HackRF / GNU Radio / GQRX
  NFC/RFID確認                     ->  Proxmark3 / libnfc
  セルラーセキュリティ評価         ->  srsRAN / OpenBTS
  IoTプロトコルテスト              ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  ワイヤレスCVE検索                ->  NVD / vendor advisories（手動検索）
  コンプライアンス確認             ->  NIST / PCI-DSS / HIPAA docs（手動）
  MITRE ATT&CKへのマッピング       ->  ATT&CK Navigator（手動マッピング）
  すべてを相関付け                 ->  レポートにコピー＆ペースト
  ────────────────────────────────
  合計：評価あたり数時間、その大部分はツール間のコンテキストスイッチに費やされる
```

**wifi-security-mcp-server**は、[Model Context Protocol](https://modelcontextprotocol.io)を通じてAIエージェントに9つのナレッジベースで支えられた34の複合ツールを提供し、139の個別機能をカバーします。エージェントはネットワークを分析し、脆弱性を特定し、攻撃をMITRE ATT&CKにマッピングし、コンプライアンスをチェックし、実行可能なレポートを生成します &mdash; すべて1つの会話の中で。

```
wifi-security-mcp-serverの使用：
  あなた：「WPA2-Enterpriseで運用しているオフィスのワイヤレスネットワークのセキュリティを監査してください」

  エージェント：-> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "WPA2-Enterpriseネットワークに3つの重大な発見があります：
            1. 証明書ピニングなしのEAP-PEAP — hostapd-manaを使用した
               イーブルツイン攻撃に脆弱 (MITRE T1557.002)
            2. 802.11w (PMF)なし — 認証解除攻撃の影響を受けやすい
               (MITRE T1498.001)
            3. クライアント操作なしでPMKIDハッシュ抽出可能 — hashcat
               モード22000でのオフラインクラッキングが可能
            PCI-DSS 4.0：2つのコントロールが非準拠 (4.2.1, 11.2.1)。
            推奨：WPA3-Enterprise with SAEへの移行、PMFの有効化、
            不正AP検知のためのWIDS展開。"
```

---

## How It's Different

既存のツールは生のパケットキャプチャとプロトコル固有の分析を提供します。wifi-security-mcp-serverはAIエージェントに、深いナレッジベースの支援により**すべてのワイヤレスドメインにわたって同時に推論する**能力を提供します。

<table>
<thead>
<tr>
<th></th>
<th>従来のアプローチ</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>インターフェース</b></td>
<td>10以上の異なるCLI、GUI、ハードウェアツール</td>
<td>MCP &mdash; AIエージェントが対話形式でツールを呼び出す</td>
</tr>
<tr>
<td><b>カバレッジ</b></td>
<td>一度に1つのプロトコル</td>
<td>WiFi、Bluetooth、RF、NFC、セルラー、IoT &mdash; すべて1つのサーバーで</td>
</tr>
<tr>
<td><b>知識</b></td>
<td>手動CVE検索、手動ATT&CKマッピング</td>
<td>139の事前マッピングされた項目を含む9つの組み込みナレッジベース</td>
</tr>
<tr>
<td><b>攻撃インテリジェンス</b></td>
<td>Google検索 + ブログ記事 + カンファレンス発表</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 セルラー + 6 IoT攻撃がツール、緩和策、ATT&CK IDとともにカタログ化</td>
</tr>
<tr>
<td><b>コンプライアンス</b></td>
<td>NIST/PCI-DSS/HIPAA PDFを読む、手動でコントロールをマッピング</td>
<td>エージェントが5つのコンプライアンスフレームワークに対して自動チェック</td>
</tr>
<tr>
<td><b>APIキー</b></td>
<td>異なるサービスの様々なアカウント</td>
<td>コア機能にAPIキー不要 &mdash; ナレッジベース駆動</td>
</tr>
<tr>
<td><b>セットアップ</b></td>
<td>aircrack-ng、Bettercap、HackRF、Proxmark3、Wiresharkをインストール...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; コマンド1つ、設定ゼロ</td>
</tr>
</tbody>
</table>

---

## Quick Start

### オプション1：npx（インストール不要）

```bash
npx wifi-security-mcp-server
```

34のツールすべてが即座に動作します。APIキー不要 &mdash; コア機能はナレッジベース駆動です。

### オプション2：クローン

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### 環境変数（オプション）

```bash
# WiGLE — 実世界のWiFiネットワーク検索用ウォードライビングデータベース
export WIGLE_API_KEY=your-key

# Kismet — リアルタイムワイヤレス侵入検知
export KISMET_HOST=127.0.0.1      # デフォルト: 127.0.0.1
export KISMET_PORT=2501           # デフォルト: 2501
export KISMET_API_KEY=your-key
```

すべてのAPIキーはオプションです。キーなしでも、WiFi攻撃、Bluetooth攻撃、RF/SDR、NFC/RFID、セルラー、IoT、ハードウェアデータベース、CVEインテリジェンス、コンプライアンスフレームワークをカバーする9つの組み込みナレッジベースで駆動される34のツールすべてにフルアクセスできます。

### AIエージェントに接続

<details open>
<summary><b>Claude Code</b></summary>

```bash
# npxを使用
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# ローカルクローンを使用
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

`~/Library/Application Support/Claude/claude_desktop_config.json`に追加：

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
<summary><b>Cursor / Windsurf / その他のMCPクライアント</b></summary>

同じJSON設定フォーマットです。コマンドを`npx wifi-security-mcp-server`またはローカルインストールパスに向けてください。

</details>

### クエリ開始

```
あなた：「WPA3-SAEネットワークに対して可能な攻撃は何ですか？どのようにテストしますか？」
```

これだけです。エージェントが攻撃を検索し、MITRE ATT&CKにマッピングし、ツールを推奨し、ステップバイステップの方法論を提供します &mdash; すべて組み込みナレッジベースから。

---

## What The AI Can Do

### WiFiセキュリティ評価

```
あなた：「WPSが有効なWPA2-PSKネットワークのセキュリティを分析してください」

エージェント：-> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "WPA2-PSK + WPS構成で重大な脆弱性が見つかりました：
          1. WPS Pixie Dust攻撃 — E-S1/E-S2ナンスのオフライン
             ブルートフォースにより数秒でPIN回復可能 (Reaver + PixieWPS)。
             クライアント操作なしで完全なPSK回復。
          2. PMKID攻撃 — 4-way handshakeの最初のパケットに
             PMKIDハッシュが含まれ、hashcat -m 22000でオフラインクラッキング可能。
             deauth不要、クライアント不要。
          3. 4-Way Handshakeキャプチャ — EAPOLフレームを
             airodump-ng + deauthでキャプチャ後、オフライン辞書攻撃。
          優先事項：WPSを直ちに無効化（最高リスク）、20文字以上の
          強力なPSKを強制、WPA3-SAEへの移行を検討。"
```

### Bluetooth & BLE分析

```
あなた：「BLEベースのアクセス制御システムのセキュリティリスクは何ですか？」

エージェント：-> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "BLEアクセス制御システム — 4つの重大なリスクを特定：
          1. JustWorksペアリング — MITM保護なし。攻撃者が
             Ubertooth Oneでペアリングを傍受可能 (MITRE T1040)。
          2. GATT特性スニッフィング — ロック解除コマンドが平文で
             送信され、gatttoolで再生可能 (MITRE T1212)。
          3. BLEリレー/リプレイ攻撃 — 2つのデバイス + btlejackで
             正規のロック解除信号をリレー (MITRE T1557)。
          4. MACアドレストラッキング — 静的BLE MACにより
             居住者の追跡が可能 (MITRE T1592.002)。
          推奨：LE Secure Connections (LESC)と数値比較を強制、
          GATT特性の暗号化、リプレイ保護のためのローリングナンスの実装。"
```

### IoTワイヤレス監査

```
あなた：「スマートビルIoT展開のワイヤレスセキュリティを評価してください」

エージェント：-> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "スマートビルIoTワイヤレス評価 — 5つの発見事項：
          1. Zigbee：デフォルトのトラストセンターリンクキー (ZigBeeAlliance09)
             によりKillerBeeでのネットワーク参加傍受が可能（重大）
          2. MQTT：ポート1883のブローカーがTLSなし — 認証情報と
             センサーデータが平文で送信
          3. Z-Wave：既知の鍵交換脆弱性を持つS0セキュリティ
             — S2へのアップグレードを推奨
          4. MouseJack：3つのLogitech Unifyingレシーバーが
             キーストロークインジェクションに脆弱 (CVE-2016-10761)
          5. WiFi：IoTデバイスが企業ネットワークと同じVLANに配置
             — ネットワークセグメンテーションなし
          優先修復：MQTT TLS、Zigbeeインストールコード、
          IoT VLAN分離、脆弱なLogitechレシーバーの交換。"
```

### コンプライアンス監査

```
あなた：「当院のWiFiがHIPAAワイヤレス要件を満たしているか確認してください」

エージェント：-> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "HIPAAワイヤレスコンプライアンス監査 — 6つの発見事項：
          3つの非準拠コントロール：
          - 164.312(a)(1)：不正AP検知用ワイヤレスIDSが未展開
          - 164.312(e)(1)：医療機器がWPA2-PSKを使用（Enterpriseではない）
          - 164.312(e)(2)：ワイヤレストラフィック暗号化の監査ログなし
          3つの準拠コントロール：
          - 164.310(a)(1)：物理APの位置が文書化済み
          - 164.312(a)(2)：RADIUS認証付き802.1X
          - 164.312(d)：スタッフデバイス用証明書ベースのEAP-TLS
          修復計画：WIDS展開（Kismet/AirMagnet）、医療機器を
          MAB付きWPA2-Enterpriseに移行、WLANコントローラーで
          ワイヤレス監査ログの有効化。"
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFiコア (8) &mdash; APIキー不要</b></summary>

| ツール | 説明 |
|--------|------|
| `scan_wifi_networks` | WiFiネットワークのスキャンと分析 &mdash; SSID、チャンネル、暗号化タイプ、信号強度、セキュリティ設定ミスの検出 |
| `analyze_wifi_security` | WiFiセキュリティ設定の深層分析 &mdash; 暗号化強度、認証方法、既知の弱点、攻撃面 |
| `find_wifi_attacks` | WiFiターゲットに適用可能な攻撃の検索 &mdash; 攻撃方法論、必要なツール、MITRE ATT&CKマッピング、緩和策を返す |
| `simulate_evil_twin` | イーブルツインAP攻撃シナリオのシミュレーションと分析 &mdash; hostapd-mana設定、キャプティブポータル、認証情報キャプチャ方法論 |
| `analyze_deauth` | 認証解除攻撃ベクトルの分析 &mdash; 802.11w PMFステータス、deauth検知、対策、WIDS統合 |
| `crack_wps` | WPSクラッキング攻撃ベクトルの分析 &mdash; Pixie Dust、ブルートフォース、null PIN、デフォルトPIN生成、Reaver/Bully方法論 |
| `analyze_pmkid` | PMKIDベースの攻撃ベクトル分析 &mdash; hcxdumptool + hashcatモード22000によるクライアントレスWPA/WPA2クラッキング |
| `audit_wifi67` | WiFi 6 (802.11ax)およびWiFi 7 (802.11be)固有のセキュリティ機能の監査 &mdash; OWE、SAE、Enhanced Open、Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; APIキー不要</b></summary>

| ツール | 説明 |
|--------|------|
| `scan_bluetooth` | Bluetoothデバイスのスキャンと分析 &mdash; BR/EDRクラシックおよびBLEディスカバリー、サービス列挙、ペアリング分析 |
| `find_bluetooth_attacks` | 適用可能なBluetooth攻撃の検索 &mdash; BlueBorne、KNOB、BIAS、BLEリレー、MITM、ツールと緩和策付き |
| `analyze_ble` | BLEセキュリティの深層分析 &mdash; GATTサービス、ペアリング方法、LE Secure Connections、特性暗号化 |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; APIキー不要</b></summary>

| ツール | 説明 |
|--------|------|
| `analyze_rf_signal` | RF信号セキュリティの分析 &mdash; 周波数分析、変調識別、リプレイ攻撃の実現可能性、SDRツール推奨 |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; APIキー不要</b></summary>

| ツール | 説明 |
|--------|------|
| `analyze_nfc_security` | NFC/RFIDセキュリティの分析 &mdash; カードタイプ識別、アクセス制御の弱点、クローニングの実現可能性、Proxmark3方法論 |

</details>

<details>
<summary><b>セルラー/5G (1) &mdash; APIキー不要</b></summary>

| ツール | 説明 |
|--------|------|
| `analyze_cellular_security` | セルラーネットワークセキュリティの分析 &mdash; 2G/3G/4G/5Gプロトコルの弱点、IMSIキャッチャー検知、偽基地局分析 |

</details>

<details>
<summary><b>IoTワイヤレス (3) &mdash; APIキー不要</b></summary>

| ツール | 説明 |
|--------|------|
| `analyze_zigbee` | Zigbeeネットワークセキュリティの分析 &mdash; トラストセンターポリシー、ネットワーク鍵管理、KillerBee攻撃方法論 |
| `scan_iot_wireless` | IoTワイヤレスプロトコルのスキャン &mdash; Zigbee、Z-Wave、MQTT、LoRaWAN、CoAPのディスカバリーと脆弱性分析 |
| `find_mousejack` | MouseJackワイヤレスキーボード/マウス脆弱性の分析 &mdash; キーストロークインジェクション、暗号化されていないHID、ベンダー固有のバイパス |

</details>

<details>
<summary><b>高度なワイヤレス (6) &mdash; APIキー不要</b></summary>

| ツール | 説明 |
|--------|------|
| `analyze_airgap` | エアギャップ エクスフィルトレーション技術の分析 &mdash; 電磁、音響、熱、光学の隠密チャンネルと対策 |
| `analyze_uwb` | 超広帯域 (UWB) セキュリティの分析 &mdash; 測距操作、車のキーフォブとAirTagへのリレー攻撃、距離詐欺 |
| `analyze_wifi_csi` | WiFiチャンネル状態情報 (CSI) セキュリティの分析 &mdash; パッシブセンシング、活動認識、キーストローク推論リスク |
| `analyze_miracast` | Miracast/WiFi Displayセキュリティの分析 &mdash; WFDセッションハイジャック、画面キャプチャ、不正ディスプレイアクセス |
| `analyze_wifi_direct` | WiFi Direct (P2P) セキュリティの分析 &mdash; グループオーナーネゴシエーション攻撃、P2PでのWPS脆弱性、不正グループ形成 |
| `analyze_drone_rf` | ドローンRFセキュリティの分析 &mdash; 制御リンクハイジャック、GPSスプーフィング、ビデオダウンリンク傍受、カウンターUAS技術 |

</details>

<details>
<summary><b>インフラストラクチャ (4) &mdash; APIキー不要（KISMET_*はライブWIDS用オプション）</b></summary>

| ツール | 説明 |
|--------|------|
| `audit_wlan_controller` | WLANコントローラー設定の監査 &mdash; Cisco WLC、Aruba、Merakiセキュリティ設定、不正APポリシー、RF管理 |
| `analyze_captive_portal` | キャプティブポータルセキュリティの分析 &mdash; バイパス技術、認証情報収集リスク、ネットワーク分離、ゲストVLANセキュリティ |
| `detect_mac_randomization` | MACアドレスランダム化の分析 &mdash; iOS/Android/Windows実装の違い、トラッキング耐性、フィンガープリンティングバイパス |
| `analyze_hotspot20` | Hotspot 2.0 (Passpoint) セキュリティの分析 &mdash; ANQP、OSU、自動ネットワーク選択リスク、EAP方法分析 |

</details>

<details>
<summary><b>インテリジェンス (4) &mdash; APIキー不要</b></summary>

| ツール | 説明 |
|--------|------|
| `lookup_wireless_cve` | ワイヤレス固有のCVE検索 &mdash; WiFiチップセット脆弱性、BluetoothスタックCVE、ドライバーエクスプロイト、ファームウェアバグ |
| `lookup_hardware` | ワイヤレスセキュリティハードウェアの検索 &mdash; WiFiアダプター、Bluetoothスニファー、SDRデバイス、機能、チップセット互換性 |
| `map_wireless_attck` | ワイヤレス攻撃をMITRE ATT&CKフレームワークにマッピング &mdash; テクニックID、タクティクスカテゴリ、検知戦略 |
| `analyze_medical_wireless` | 医療機器のワイヤレスセキュリティ分析 &mdash; 輸液ポンプ、ペースメーカー、患者モニター、FDAガイダンス、HIPAA要件 |

</details>

<details>
<summary><b>検知 (2) &mdash; APIキー不要</b></summary>

| ツール | 説明 |
|--------|------|
| `detect_wireless_attack` | 進行中のワイヤレス攻撃の検知 &mdash; deauthフラッド、イーブルツイン、KARMA、不正AP、BLEスプーフィング、RFジャミング指標 |
| `audit_wireless_compliance` | コンプライアンスフレームワークに対するワイヤレスネットワーク監査 &mdash; PCI-DSS 4.0、HIPAA、NIST 800-153、FedRAMP、ISO 27001ワイヤレスコントロール |

</details>

<details>
<summary><b>レポーティング (1) &mdash; APIキー不要</b></summary>

| ツール | 説明 |
|--------|------|
| `export_report` | ワイヤレスセキュリティ評価レポートのエクスポート &mdash; 発見事項、リスク評価、コンプライアンスステータス、修復ロードマップ、エグゼクティブサマリー |

</details>

---

### CLI Usage

```bash
# 利用可能なすべてのツールを一覧表示
npx wifi-security-mcp-server --list

# 任意のツールを直接実行
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

サーバーには9つの組み込みナレッジベースが搭載されています &mdash; APIキー不要、外部依存関係なし、レート制限なし。すべてのツールクエリは、これらのデータベースからの構造化されたインテリジェンスで強化されます。

| ナレッジベース | エントリ数 | 提供内容 |
|---------------|----------|---------|
| **WiFi攻撃** | 47攻撃 | WPA/WPA2/WPA3攻撃技術、イーブルツインバリエーション、PMKID、KRACK、FragAttacks、deauth、WPSエクスプロイト &mdash; 各ツール、緩和策、MITRE ATT&CKマッピング付き |
| **Bluetooth攻撃** | 8攻撃 | BlueBorne、KNOB、BIAS、BLEリレー、MITM、BLEファジング、Bluetoothなりすまし &mdash; CVEと検知戦略付き |
| **RF/SDR攻撃** | 6攻撃 | リプレイ攻撃、ジャミング、信号注入、SDRベースの傍受、RFフィンガープリンティングバイパス、スペクトル分析技術 |
| **NFC/RFID攻撃** | 6攻撃 | カードクローニング、リレー攻撃、MIFARE Classicクラッキング、NFCスキミング、RFIDファジング、Proxmark3によるアクセス制御バイパス |
| **セルラー攻撃** | 6攻撃 | IMSIキャッチング、偽基地局 (Stingray)、SS7エクスプロイト、5G NAS脆弱性、ダウングレード攻撃、VoLTE傍受 |
| **IoT攻撃** | 6攻撃 | Zigbeeネットワーク鍵スニッフィング、Z-Wave S0ダウングレード、MQTT認証情報収集、LoRaWAN ABPリプレイ、MouseJack、BLE IoTリレー |
| **ハードウェアデータベース** | 12デバイス | WiFiアダプター (Alfa, TP-Link)、Bluetoothスニファー (Ubertooth)、SDR (HackRF, RTL-SDR)、NFC (Proxmark3) &mdash; チップセット、機能、モニターモードサポート |
| **CVEデータベース** | 17 CVE | WiFiチップセット (Broadcom, Qualcomm, Intel)、Bluetoothスタック、IoTファームウェアのワイヤレス固有CVE &mdash; 深刻度、影響バージョン、エクスプロイト可用性 |
| **コンプライアンスフレームワーク** | 5フレームワーク | PCI-DSS 4.0、HIPAA、NIST SP 800-153、FedRAMP、ISO 27001 &mdash; ワイヤレス固有コントロール、監査チェックリスト、ギャップ分析 |

---

## Architecture

```
src/
  index.ts                    # CLIエントリポイント (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # MCPサーバーセットアップ (stdio transport)
    tools.ts                  # ツールレジストリ — 34の複合ツールすべてがここで組み立て
  types/
    index.ts                  # 共有型 (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9つの組み込みナレッジベース
    wifi-attacks.ts           # 47のWiFi攻撃定義
    bluetooth-attacks.ts      # 8のBluetooth攻撃定義
    rf-attacks.ts             # 6のRF/SDR攻撃定義
    nfc-attacks.ts            # 6のNFC/RFID攻撃定義
    cellular-attacks.ts       # 6のセルラー/5G攻撃定義
    iot-attacks.ts            # 6のIoT攻撃定義
    hardware.ts               # 12のハードウェアデバイスプロファイル
    cve-database.ts           # 17のワイヤレスCVE
    compliance.ts             # 5のコンプライアンスフレームワーク
  wifi/                       # WiFiコアツール (8)
  bluetooth/                  # Bluetoothツール (3)
  rf/                         # RF/SDRツール (1)
  nfc/                        # NFC/RFIDツール (1)
  cellular/                   # セルラー/5Gツール (1)
  iot/                        # IoTワイヤレスツール (3)
  advanced/                   # 高度なワイヤレスツール (6)
  infrastructure/             # インフラストラクチャツール (4)
  intelligence/               # インテリジェンスツール (4)
  detection/                  # 検知ツール (2)
  reporting/                  # レポーティングツール (1)
```

**設計上の決定：**

- **ナレッジベース駆動** &mdash; API依存のツールとは異なり、コア機能は9つの組み込みデータベースから完全にオフラインで動作します。主要ワークフローにAPIキー、レート制限、外部依存関係は不要です。
- **34の複合ツール、139の個別機能** &mdash; 各ツールは関連する分析をバンドルするコンポジットです。`find_wifi_attacks`は攻撃をリストするだけではありません &mdash; 方法論、必要なハードウェア、MITRE ATT&CKマッピング、検知戦略、対策を返します。
- **2つのランタイム依存関係** &mdash; `@modelcontextprotocol/sdk`と`zod`。それだけです。ネイティブモジュール、バイナリ依存関係、プラットフォーム固有のコードはありません。
- **オプションのライブ統合** &mdash; WiGLE APIは実世界のネットワークデータ用、KismetはリアルタイムワイヤレスIDS用。コア分析はどちらがなくても動作します。
- **コンプライアンス対応** &mdash; 各発見事項は、該当する場合、関連するコンプライアンスフレームワーク（PCI-DSS、HIPAA、NIST、FedRAMP、ISO 27001）に自動マッピングされます。
- **MITRE ATT&CKマッピング** &mdash; 攻撃技術にはATT&CKテクニックID、タクティクスカテゴリ、SOC統合のための検知データソースが含まれます。

---

## Limitations

- ナレッジベースはポイントインタイムのスナップショットです &mdash; 新しい攻撃/CVEにはパッケージの更新が必要
- WiGLE統合にはネットワーク検索用の無料APIキーが必要
- KismetライブWIDSには、APIアクセス可能な実行中のKismetインスタンスが必要
- アクティブなワイヤレス送信なし &mdash; サーバーはインテリジェンスと方法論を提供し、パケットインジェクションは行わない
- ハードウェアデータベースは最も一般的なセキュリティ研究デバイスをカバーしますが、網羅的ではない
- コンプライアンスフレームワークはワイヤレス固有のコントロールに焦点を当てており、フレームワーク全体のカバレッジではない
- macOS / Linuxでテスト済み（Windowsは未テスト）

---

## Part of the MCP Security Suite

| プロジェクト | 領域 | ツール |
|------------|------|--------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | ブラウザベースのセキュリティテスト | 39ツール、Firefox、インジェクションテスト |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | クラウドセキュリティ (AWS/Azure/GCP) | 38ツール、60以上のチェック |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHubセキュリティポスチャ | 39ツール、45チェック |
| [cve-mcp](https://github.com/badchars/cve-mcp) | 脆弱性インテリジェンス | 23ツール、5ソース |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINTとリコン | 37ツール、12ソース |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | ダークウェブと脅威インテリジェンス | 66ツール、16ソース |
| **wifi-security-mcp-server** | **ワイヤレスセキュリティインテリジェンス** | **34ツール、9ナレッジベース** |

---

<p align="center">
<b>許可されたセキュリティテストと評価のみを対象としています。</b><br>
ネットワークやデバイスでワイヤレスセキュリティテストを実行する前に、必ず適切な許可を得てください。<br>
ほとんどの法域で、不正なワイヤレスネットワークアクセスや干渉は違法です。
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

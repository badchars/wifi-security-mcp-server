<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <strong>한국어</strong> |
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

<h3 align="center">AI 에이전트를 위한 무선 보안 인텔리전스.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), 블루투스 (BR/EDR, BLE), RF/SDR, NFC/RFID, 셀룰러/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, 에어갭, UWB, WiFi CSI, Miracast, WiFi Direct, 드론 RF, WIDS/WIPS, 컴플라이언스 &mdash; 하나의 MCP 서버로 통합.<br>
  AI 에이전트가 9개의 내장 지식 베이스로 139개의 개별 도구를 지원하는 <b>온디맨드 전체 스펙트럼 무선 보안 분석</b>을 수행합니다.
</p>

<br>

<p align="center">
  <a href="#the-problem">문제점</a> &bull;
  <a href="#how-its-different">차별점</a> &bull;
  <a href="#quick-start">빠른 시작</a> &bull;
  <a href="#what-the-ai-can-do">AI가 할 수 있는 것</a> &bull;
  <a href="#tools-reference-34-composite-tools">도구 (34)</a> &bull;
  <a href="#knowledge-bases-9">지식 베이스</a> &bull;
  <a href="#architecture">아키텍처</a> &bull;
  <a href="CHANGELOG.md">변경 로그</a> &bull;
  <a href="CONTRIBUTING.md">기여</a>
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

무선 보안 평가는 공격적 보안에서 가장 파편화된 분야 중 하나입니다. WiFi 감사에는 하나의 도구 세트가, 블루투스에는 또 다른 세트가, RF/SDR에는 세 번째가, IoT 프로토콜에는 또 다른 것이 필요합니다 &mdash; 각 영역에는 고유한 공격 표면, 고유한 취약점, 고유한 컴플라이언스 요구 사항이 있습니다. 현재 WPA용으로 aircrack-ng를 실행하고, BLE용으로 Bettercap을 사용하고, SDR용으로 HackRF를 가동하고, 각 칩셋에 대해 다른 CVE 데이터베이스를 참조하고, NIST와 PCI-DSS를 별도로 확인한 후, 발견 사항을 일관된 평가 보고서로 수동 상관분석하는 데 수 시간을 소비합니다.

```
기존 무선 보안 워크플로우:
  WiFi 네트워크 감사             ->  aircrack-ng / Wireshark / Kismet
  블루투스 보안 테스트           ->  Bettercap / btlejack / Ubertooth
  RF 신호 분석                   ->  HackRF / GNU Radio / GQRX
  NFC/RFID 확인                  ->  Proxmark3 / libnfc
  셀룰러 보안 평가               ->  srsRAN / OpenBTS
  IoT 프로토콜 테스트            ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  무선 CVE 조회                  ->  NVD / vendor advisories (수동 검색)
  컴플라이언스 확인              ->  NIST / PCI-DSS / HIPAA docs (수동)
  MITRE ATT&CK 매핑             ->  ATT&CK Navigator (수동 매핑)
  모든 것 상관분석               ->  보고서에 복사-붙여넣기
  ────────────────────────────────
  합계: 평가당 수 시간, 대부분 도구 간 컨텍스트 전환에 소비
```

**wifi-security-mcp-server**는 [Model Context Protocol](https://modelcontextprotocol.io)을 통해 AI 에이전트에게 9개의 지식 베이스로 지원되는 34개의 복합 도구를 제공하며, 139개의 개별 기능을 커버합니다. 에이전트는 네트워크를 분석하고, 취약점을 식별하고, 공격을 MITRE ATT&CK에 매핑하고, 컴플라이언스를 확인하고, 실행 가능한 보고서를 생성합니다 &mdash; 단일 대화에서.

```
wifi-security-mcp-server 사용:
  사용자: "WPA2-Enterprise를 운영하는 사무실 무선 네트워크의 보안을 감사해주세요"

  에이전트: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "WPA2-Enterprise 네트워크에 3가지 중요한 발견 사항이 있습니다:
            1. 인증서 피닝 없는 EAP-PEAP — hostapd-mana를 이용한
               이블 트윈 공격에 취약 (MITRE T1557.002)
            2. 802.11w (PMF) 없음 — 비인증 공격에 취약
               (MITRE T1498.001)
            3. 클라이언트 상호작용 없이 PMKID 해시 추출 가능 — hashcat
               모드 22000으로 오프라인 크래킹 가능
            PCI-DSS 4.0: 2개 컨트롤 미준수 (4.2.1, 11.2.1).
            권장: WPA3-Enterprise with SAE로 마이그레이션, PMF 활성화,
            로그 AP 탐지를 위한 WIDS 배포."
```

---

## How It's Different

기존 도구는 원시 패킷 캡처와 프로토콜별 분석을 제공합니다. wifi-security-mcp-server는 AI 에이전트에게 깊은 지식 베이스 지원으로 **모든 무선 영역에 걸쳐 동시에 추론**하는 능력을 제공합니다.

<table>
<thead>
<tr>
<th></th>
<th>기존 방식</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>인터페이스</b></td>
<td>10개 이상의 다른 CLI, GUI, 하드웨어 도구</td>
<td>MCP &mdash; AI 에이전트가 대화형으로 도구 호출</td>
</tr>
<tr>
<td><b>커버리지</b></td>
<td>한 번에 하나의 프로토콜</td>
<td>WiFi, 블루투스, RF, NFC, 셀룰러, IoT &mdash; 하나의 서버에 모두</td>
</tr>
<tr>
<td><b>지식</b></td>
<td>수동 CVE 조회, 수동 ATT&CK 매핑</td>
<td>139개 사전 매핑된 항목이 포함된 9개 내장 지식 베이스</td>
</tr>
<tr>
<td><b>공격 인텔리전스</b></td>
<td>Google 검색 + 블로그 포스트 + 컨퍼런스 발표</td>
<td>47개 WiFi + 8개 블루투스 + 6개 RF + 6개 NFC + 6개 셀룰러 + 6개 IoT 공격, 도구, 완화 방법, ATT&CK ID 포함</td>
</tr>
<tr>
<td><b>컴플라이언스</b></td>
<td>NIST/PCI-DSS/HIPAA PDF 읽기, 수동 컨트롤 매핑</td>
<td>에이전트가 5개 컴플라이언스 프레임워크에 대해 자동 확인</td>
</tr>
<tr>
<td><b>API 키</b></td>
<td>다양한 서비스의 여러 계정</td>
<td>핵심 기능에 API 키 불필요 &mdash; 지식 베이스 기반</td>
</tr>
<tr>
<td><b>설정</b></td>
<td>aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark 설치...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; 명령 하나, 설정 제로</td>
</tr>
</tbody>
</table>

---

## Quick Start

### 옵션 1: npx (설치 불필요)

```bash
npx wifi-security-mcp-server
```

34개 도구 모두 즉시 사용 가능. API 키 불필요 &mdash; 핵심 기능은 지식 베이스 기반.

### 옵션 2: 클론

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### 환경 변수 (선택 사항)

```bash
# WiGLE — 실제 WiFi 네트워크 조회를 위한 워드라이빙 데이터베이스
export WIGLE_API_KEY=your-key

# Kismet — 실시간 무선 침입 탐지
export KISMET_HOST=127.0.0.1      # 기본값: 127.0.0.1
export KISMET_PORT=2501           # 기본값: 2501
export KISMET_API_KEY=your-key
```

모든 API 키는 선택 사항입니다. 키 없이도 WiFi 공격, 블루투스 공격, RF/SDR, NFC/RFID, 셀룰러, IoT, 하드웨어 데이터베이스, CVE 인텔리전스, 컴플라이언스 프레임워크를 커버하는 9개 내장 지식 베이스로 구동되는 34개 도구 전체에 완전히 접근할 수 있습니다.

### AI 에이전트에 연결

<details open>
<summary><b>Claude Code</b></summary>

```bash
# npx 사용
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# 로컬 클론 사용
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

`~/Library/Application Support/Claude/claude_desktop_config.json`에 추가:

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
<summary><b>Cursor / Windsurf / 기타 MCP 클라이언트</b></summary>

동일한 JSON 설정 형식. 명령을 `npx wifi-security-mcp-server` 또는 로컬 설치 경로로 지정하세요.

</details>

### 쿼리 시작

```
사용자: "WPA3-SAE 네트워크에 대해 가능한 공격은 무엇이고 어떻게 테스트하나요?"
```

그것으로 끝입니다. 에이전트가 공격을 조회하고, MITRE ATT&CK에 매핑하고, 도구를 추천하고, 단계별 방법론을 제공합니다 &mdash; 모두 내장 지식 베이스에서.

---

## What The AI Can Do

### WiFi 보안 평가

```
사용자: "WPS가 활성화된 WPA2-PSK 네트워크의 보안을 분석해주세요"

에이전트: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "WPA2-PSK + WPS 구성에서 치명적 취약점 발견:
          1. WPS Pixie Dust 공격 — E-S1/E-S2 논스의 오프라인
             브루트포스로 수초 내 PIN 복구 가능 (Reaver + PixieWPS).
             클라이언트 상호작용 없이 전체 PSK 복구.
          2. PMKID 공격 — 4-웨이 핸드셰이크의 첫 패킷에
             PMKID 해시 포함, hashcat -m 22000으로 오프라인 크래킹 가능.
             디인증 불필요, 클라이언트 불필요.
          3. 4-웨이 핸드셰이크 캡처 — EAPOL 프레임을
             airodump-ng + 디인증으로 캡처 후 오프라인 사전 공격.
          우선순위: 즉시 WPS 비활성화 (최고 위험), 20자 이상의
          강력한 PSK 적용, WPA3-SAE로 마이그레이션 고려."
```

### 블루투스 & BLE 분석

```
사용자: "BLE 기반 출입 통제 시스템의 보안 위험은 무엇인가요?"

에이전트: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "BLE 출입 통제 시스템 — 4가지 치명적 위험 식별:
          1. JustWorks 페어링 — MITM 보호 없음. 공격자가
             Ubertooth One으로 페어링 가로채기 가능 (MITRE T1040).
          2. GATT 특성 스니핑 — 잠금 해제 명령이 평문으로 전송,
             gatttool로 재생 가능 (MITRE T1212).
          3. BLE 릴레이/리플레이 공격 — 두 장치 + btlejack으로
             합법적 잠금 해제 신호 릴레이 (MITRE T1557).
          4. MAC 주소 추적 — 정적 BLE MAC으로 거주자
             추적 가능 (MITRE T1592.002).
          권장: LE Secure Connections (LESC)와 숫자 비교 적용,
          GATT 특성 암호화, 리플레이 방지를 위한 롤링 논스 구현."
```

### IoT 무선 감사

```
사용자: "스마트 빌딩 IoT 배포의 무선 보안을 평가해주세요"

에이전트: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "스마트 빌딩 IoT 무선 평가 — 5개 발견 사항:
          1. Zigbee: 기본 트러스트 센터 링크 키 (ZigBeeAlliance09)로
             KillerBee를 이용한 네트워크 조인 가로채기 가능 (치명적)
          2. MQTT: TLS 없이 포트 1883에서 브로커 실행 — 자격 증명과
             센서 데이터가 평문으로 전송
          3. Z-Wave: 알려진 키 교환 취약점이 있는 S0 보안
             — S2 업그레이드 권장
          4. MouseJack: 3개의 Logitech Unifying 수신기가 키스트로크
             인젝션에 취약 (CVE-2016-10761)
          5. WiFi: IoT 장치가 기업 네트워크와 동일 VLAN에 위치
             — 네트워크 분리 없음
          우선 수정: MQTT TLS, Zigbee 설치 코드,
          IoT VLAN 격리, 취약한 Logitech 수신기 교체."
```

### 컴플라이언스 감사

```
사용자: "병원 WiFi가 HIPAA 무선 요구 사항을 충족하는지 확인해주세요"

에이전트: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "HIPAA 무선 컴플라이언스 감사 — 6개 발견 사항:
          3개 미준수 컨트롤:
          - 164.312(a)(1): 로그 AP 탐지를 위한 무선 IDS 미배포
          - 164.312(e)(1): 의료 기기가 WPA2-PSK 사용 (Enterprise 아님)
          - 164.312(e)(2): 무선 트래픽 암호화 감사 로깅 없음
          3개 준수 컨트롤:
          - 164.310(a)(1): 물리적 AP 위치 문서화
          - 164.312(a)(2): RADIUS 인증이 있는 802.1X
          - 164.312(d): 직원 장치에 인증서 기반 EAP-TLS
          수정 계획: WIDS 배포 (Kismet/AirMagnet), 의료 기기를
          MAB가 포함된 WPA2-Enterprise로 마이그레이션, WLAN
          컨트롤러에서 무선 감사 로깅 활성화."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi 코어 (8) &mdash; API 키 불필요</b></summary>

| 도구 | 설명 |
|------|------|
| `scan_wifi_networks` | WiFi 네트워크 스캔 및 분석 &mdash; SSID, 채널, 암호화 유형, 신호 강도, 보안 구성 오류 검색 |
| `analyze_wifi_security` | WiFi 보안 구성 심층 분석 &mdash; 암호화 강도, 인증 방법, 알려진 약점, 공격 표면 |
| `find_wifi_attacks` | WiFi 대상에 적용 가능한 공격 찾기 &mdash; 공격 방법론, 필요한 도구, MITRE ATT&CK 매핑, 완화 방법 반환 |
| `simulate_evil_twin` | 이블 트윈 AP 공격 시나리오 시뮬레이션 및 분석 &mdash; hostapd-mana 구성, 캡티브 포털, 자격 증명 캡처 방법론 |
| `analyze_deauth` | 디인증 공격 벡터 분석 &mdash; 802.11w PMF 상태, 디인증 탐지, 대응 조치, WIDS 통합 |
| `crack_wps` | WPS 크래킹 공격 벡터 분석 &mdash; Pixie Dust, 브루트포스, 널 PIN, 기본 PIN 생성, Reaver/Bully 방법론 |
| `analyze_pmkid` | PMKID 기반 공격 벡터 분석 &mdash; hcxdumptool + hashcat 모드 22000을 통한 클라이언트리스 WPA/WPA2 크래킹 |
| `audit_wifi67` | WiFi 6 (802.11ax) 및 WiFi 7 (802.11be) 특정 보안 기능 감사 &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>블루투스 (3) &mdash; API 키 불필요</b></summary>

| 도구 | 설명 |
|------|------|
| `scan_bluetooth` | 블루투스 장치 스캔 및 분석 &mdash; BR/EDR 클래식 및 BLE 검색, 서비스 열거, 페어링 분석 |
| `find_bluetooth_attacks` | 적용 가능한 블루투스 공격 찾기 &mdash; BlueBorne, KNOB, BIAS, BLE 릴레이, MITM, 도구 및 완화 방법 포함 |
| `analyze_ble` | BLE 보안 심층 분석 &mdash; GATT 서비스, 페어링 방법, LE Secure Connections, 특성 암호화 |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; API 키 불필요</b></summary>

| 도구 | 설명 |
|------|------|
| `analyze_rf_signal` | RF 신호 보안 분석 &mdash; 주파수 분석, 변조 식별, 리플레이 공격 실현 가능성, SDR 도구 추천 |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; API 키 불필요</b></summary>

| 도구 | 설명 |
|------|------|
| `analyze_nfc_security` | NFC/RFID 보안 분석 &mdash; 카드 유형 식별, 출입 통제 약점, 복제 실현 가능성, Proxmark3 방법론 |

</details>

<details>
<summary><b>셀룰러/5G (1) &mdash; API 키 불필요</b></summary>

| 도구 | 설명 |
|------|------|
| `analyze_cellular_security` | 셀룰러 네트워크 보안 분석 &mdash; 2G/3G/4G/5G 프로토콜 약점, IMSI 캐처 탐지, 가짜 기지국 분석 |

</details>

<details>
<summary><b>IoT 무선 (3) &mdash; API 키 불필요</b></summary>

| 도구 | 설명 |
|------|------|
| `analyze_zigbee` | Zigbee 네트워크 보안 분석 &mdash; 트러스트 센터 정책, 네트워크 키 관리, KillerBee 공격 방법론 |
| `scan_iot_wireless` | IoT 무선 프로토콜 스캔 &mdash; Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP 검색 및 취약점 분석 |
| `find_mousejack` | MouseJack 무선 키보드/마우스 취약점 분석 &mdash; 키스트로크 인젝션, 비암호화 HID, 벤더별 우회 |

</details>

<details>
<summary><b>고급 무선 (6) &mdash; API 키 불필요</b></summary>

| 도구 | 설명 |
|------|------|
| `analyze_airgap` | 에어갭 유출 기술 분석 &mdash; 전자기, 음향, 열, 광학 은닉 채널 및 대응 조치 |
| `analyze_uwb` | 초광대역 (UWB) 보안 분석 &mdash; 거리 측정 조작, 자동차 키 포브 및 AirTag 릴레이 공격, 거리 사기 |
| `analyze_wifi_csi` | WiFi 채널 상태 정보 (CSI) 보안 분석 &mdash; 수동 감지, 활동 인식, 키스트로크 추론 위험 |
| `analyze_miracast` | Miracast/WiFi Display 보안 분석 &mdash; WFD 세션 하이재킹, 화면 캡처, 무단 디스플레이 접근 |
| `analyze_wifi_direct` | WiFi Direct (P2P) 보안 분석 &mdash; 그룹 소유자 협상 공격, P2P의 WPS 취약점, 악성 그룹 형성 |
| `analyze_drone_rf` | 드론 RF 보안 분석 &mdash; 제어 링크 하이재킹, GPS 스푸핑, 비디오 다운링크 가로채기, 대드론 기술 |

</details>

<details>
<summary><b>인프라 (4) &mdash; API 키 불필요 (KISMET_*는 실시간 WIDS 선택 사항)</b></summary>

| 도구 | 설명 |
|------|------|
| `audit_wlan_controller` | WLAN 컨트롤러 구성 감사 &mdash; Cisco WLC, Aruba, Meraki 보안 설정, 로그 AP 정책, RF 관리 |
| `analyze_captive_portal` | 캡티브 포털 보안 분석 &mdash; 우회 기술, 자격 증명 수집 위험, 네트워크 격리, 게스트 VLAN 보안 |
| `detect_mac_randomization` | MAC 주소 무작위화 분석 &mdash; iOS/Android/Windows 구현 차이, 추적 저항, 핑거프린팅 우회 |
| `analyze_hotspot20` | Hotspot 2.0 (Passpoint) 보안 분석 &mdash; ANQP, OSU, 자동 네트워크 선택 위험, EAP 방법 분석 |

</details>

<details>
<summary><b>인텔리전스 (4) &mdash; API 키 불필요</b></summary>

| 도구 | 설명 |
|------|------|
| `lookup_wireless_cve` | 무선 전용 CVE 조회 &mdash; WiFi 칩셋 취약점, 블루투스 스택 CVE, 드라이버 익스플로잇, 펌웨어 버그 |
| `lookup_hardware` | 무선 보안 하드웨어 조회 &mdash; WiFi 어댑터, 블루투스 스니퍼, SDR 장치, 기능, 칩셋 호환성 |
| `map_wireless_attck` | 무선 공격을 MITRE ATT&CK 프레임워크에 매핑 &mdash; 기술 ID, 전술 카테고리, 탐지 전략 |
| `analyze_medical_wireless` | 의료 기기 무선 보안 분석 &mdash; 주입 펌프, 심박 조율기, 환자 모니터, FDA 지침, HIPAA 요구 사항 |

</details>

<details>
<summary><b>탐지 (2) &mdash; API 키 불필요</b></summary>

| 도구 | 설명 |
|------|------|
| `detect_wireless_attack` | 진행 중인 무선 공격 탐지 &mdash; 디인증 플러드, 이블 트윈, KARMA, 로그 AP, BLE 스푸핑, RF 재밍 지표 |
| `audit_wireless_compliance` | 컴플라이언스 프레임워크에 대한 무선 네트워크 감사 &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, ISO 27001 무선 컨트롤 |

</details>

<details>
<summary><b>리포팅 (1) &mdash; API 키 불필요</b></summary>

| 도구 | 설명 |
|------|------|
| `export_report` | 무선 보안 평가 보고서 내보내기 &mdash; 발견 사항, 위험 등급, 컴플라이언스 상태, 수정 로드맵, 경영진 요약 |

</details>

---

### CLI Usage

```bash
# 사용 가능한 모든 도구 나열
npx wifi-security-mcp-server --list

# 도구 직접 실행
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

서버는 9개의 내장 지식 베이스를 탑재합니다 &mdash; API 키 불필요, 외부 종속성 없음, 속도 제한 없음. 모든 도구 쿼리는 이러한 데이터베이스의 구조화된 인텔리전스로 강화됩니다.

| 지식 베이스 | 항목 수 | 제공 내용 |
|------------|---------|-----------|
| **WiFi 공격** | 47개 공격 | WPA/WPA2/WPA3 공격 기법, 이블 트윈 변형, PMKID, KRACK, FragAttacks, 디인증, WPS 익스플로잇 &mdash; 각각 도구, 완화 방법, MITRE ATT&CK 매핑 포함 |
| **블루투스 공격** | 8개 공격 | BlueBorne, KNOB, BIAS, BLE 릴레이, MITM, BLE 퍼징, 블루투스 사칭 &mdash; CVE 및 탐지 전략 포함 |
| **RF/SDR 공격** | 6개 공격 | 리플레이 공격, 재밍, 신호 주입, SDR 기반 가로채기, RF 핑거프린팅 우회, 스펙트럼 분석 기법 |
| **NFC/RFID 공격** | 6개 공격 | 카드 복제, 릴레이 공격, MIFARE Classic 크래킹, NFC 스키밍, RFID 퍼징, Proxmark3를 이용한 출입 통제 우회 |
| **셀룰러 공격** | 6개 공격 | IMSI 캐칭, 가짜 기지국 (Stingray), SS7 익스플로잇, 5G NAS 취약점, 다운그레이드 공격, VoLTE 가로채기 |
| **IoT 공격** | 6개 공격 | Zigbee 네트워크 키 스니핑, Z-Wave S0 다운그레이드, MQTT 자격 증명 수집, LoRaWAN ABP 리플레이, MouseJack, BLE IoT 릴레이 |
| **하드웨어 데이터베이스** | 12개 장치 | WiFi 어댑터 (Alfa, TP-Link), 블루투스 스니퍼 (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; 칩셋, 기능, 모니터 모드 지원 |
| **CVE 데이터베이스** | 17개 CVE | WiFi 칩셋 (Broadcom, Qualcomm, Intel), 블루투스 스택, IoT 펌웨어의 무선 전용 CVE &mdash; 심각도, 영향 받는 버전, 익스플로잇 가용성 |
| **컴플라이언스 프레임워크** | 5개 프레임워크 | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; 무선 전용 컨트롤, 감사 체크리스트, 갭 분석 |

---

## Architecture

```
src/
  index.ts                    # CLI 진입점 (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # MCP 서버 설정 (stdio transport)
    tools.ts                  # 도구 레지스트리 — 모든 34개 복합 도구가 여기서 조립됨
  types/
    index.ts                  # 공유 타입 (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9개 내장 지식 베이스
    wifi-attacks.ts           # 47개 WiFi 공격 정의
    bluetooth-attacks.ts      # 8개 블루투스 공격 정의
    rf-attacks.ts             # 6개 RF/SDR 공격 정의
    nfc-attacks.ts            # 6개 NFC/RFID 공격 정의
    cellular-attacks.ts       # 6개 셀룰러/5G 공격 정의
    iot-attacks.ts            # 6개 IoT 공격 정의
    hardware.ts               # 12개 하드웨어 장치 프로필
    cve-database.ts           # 17개 무선 CVE
    compliance.ts             # 5개 컴플라이언스 프레임워크
  wifi/                       # WiFi 코어 도구 (8)
  bluetooth/                  # 블루투스 도구 (3)
  rf/                         # RF/SDR 도구 (1)
  nfc/                        # NFC/RFID 도구 (1)
  cellular/                   # 셀룰러/5G 도구 (1)
  iot/                        # IoT 무선 도구 (3)
  advanced/                   # 고급 무선 도구 (6)
  infrastructure/             # 인프라 도구 (4)
  intelligence/               # 인텔리전스 도구 (4)
  detection/                  # 탐지 도구 (2)
  reporting/                  # 리포팅 도구 (1)
```

**설계 결정:**

- **지식 베이스 기반** &mdash; API 종속 도구와 달리, 핵심 기능은 9개 내장 데이터베이스에서 완전히 오프라인으로 실행됩니다. 주요 워크플로우에 API 키, 속도 제한, 외부 종속성이 불필요합니다.
- **34개 복합 도구, 139개 개별 기능** &mdash; 각 도구는 관련 분석을 번들링하는 복합체입니다. `find_wifi_attacks`는 단순히 공격을 나열하지 않습니다 &mdash; 방법론, 필요한 하드웨어, MITRE ATT&CK 매핑, 탐지 전략, 대응 조치를 반환합니다.
- **2개 런타임 종속성** &mdash; `@modelcontextprotocol/sdk`와 `zod`. 그것뿐입니다. 네이티브 모듈, 바이너리 종속성, 플랫폼 특정 코드가 없습니다.
- **선택적 라이브 통합** &mdash; WiGLE API는 실제 네트워크 데이터용, Kismet은 실시간 무선 IDS용. 핵심 분석은 둘 없이도 작동합니다.
- **컴플라이언스 인식** &mdash; 모든 발견 사항은 해당하는 경우 관련 컴플라이언스 프레임워크 (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001)에 자동 매핑됩니다.
- **MITRE ATT&CK 매핑** &mdash; 공격 기법에는 SOC 통합을 위한 ATT&CK 기술 ID, 전술 카테고리, 탐지 데이터 소스가 포함됩니다.

---

## Limitations

- 지식 베이스는 특정 시점의 스냅샷입니다 &mdash; 새로운 공격/CVE에는 패키지 업데이트가 필요합니다
- WiGLE 통합에는 네트워크 조회를 위한 무료 API 키가 필요합니다
- Kismet 실시간 WIDS에는 API 접근이 가능한 Kismet 인스턴스 실행이 필요합니다
- 능동적 무선 전송 없음 &mdash; 서버는 인텔리전스와 방법론을 제공하며, 패킷 주입은 아닙니다
- 하드웨어 데이터베이스는 가장 일반적인 보안 연구 장치를 다루며, 완전하지 않습니다
- 컴플라이언스 프레임워크는 무선 전용 컨트롤에 초점을 맞추며, 전체 프레임워크 커버리지는 아닙니다
- macOS / Linux 테스트 완료 (Windows 미테스트)

---

## Part of the MCP Security Suite

| 프로젝트 | 영역 | 도구 |
|----------|------|------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | 브라우저 기반 보안 테스트 | 39개 도구, Firefox, 인젝션 테스트 |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | 클라우드 보안 (AWS/Azure/GCP) | 38개 도구, 60+ 검사 |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub 보안 태세 | 39개 도구, 45 검사 |
| [cve-mcp](https://github.com/badchars/cve-mcp) | 취약점 인텔리전스 | 23개 도구, 5개 소스 |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT 및 정찰 | 37개 도구, 12개 소스 |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | 다크 웹 및 위협 인텔리전스 | 66개 도구, 16개 소스 |
| **wifi-security-mcp-server** | **무선 보안 인텔리전스** | **34개 도구, 9개 지식 베이스** |

---

<p align="center">
<b>인가된 보안 테스트 및 평가 전용.</b><br>
무선 보안 테스트를 수행하기 전에 항상 적절한 인가를 받았는지 확인하세요.<br>
대부분의 관할권에서 무단 무선 네트워크 접근 또는 간섭은 불법입니다.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

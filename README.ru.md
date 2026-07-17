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
  <strong>Русский</strong> |
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

<p align="center"><br><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-light.svg"><img alt="wifi-security-mcp-server" src="https://raw.githubusercontent.com/badchars/wifi-security-mcp-server/main/.github/banner-dark.svg" width="700"></picture></p>

<h3 align="center">Интеллект беспроводной безопасности для ИИ-агентов.</h3>

<p align="center">WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Cellular/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drone RF, WIDS/WIPS &mdash; MCP.<br></p>

<br>

<p align="center"><a href="https://www.npmjs.com/package/wifi-security-mcp-server"><img src="https://img.shields.io/npm/v/wifi-security-mcp-server.svg" alt="npm"></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a> <img src="https://img.shields.io/badge/protocol-MCP-8b5cf6" alt="MCP"> <img src="https://img.shields.io/badge/tools-34-ef4444" alt="34 Tools"> <img src="https://img.shields.io/badge/knowledge--bases-9-f97316" alt="9 Knowledge Bases"> <img src="https://img.shields.io/badge/deps-2-22c55e" alt="2 Dependencies"></p>

---

## The Problem

Оценка беспроводной безопасности — одна из самых фрагментированных дисциплин в наступательной безопасности. Аудит WiFi требует одного набора инструментов, Bluetooth — другого, RF/SDR — третьего, протоколы IoT — ещё одного — и каждая область имеет свою поверхность атаки, свои уязвимости, свои требования соответствия.

```
Традиционный рабочий процесс беспроводной безопасности:
  аудит WiFi-сетей    ->  aircrack-ng / Wireshark / Kismet
  тест безопасности Bluetooth    ->  Bettercap / btlejack / Ubertooth
  анализ RF-сигналов    ->  HackRF / GNU Radio / GQRX
  проверка NFC/RFID    ->  Proxmark3 / libnfc
  оценка безопасности сотовой связи    ->  srsRAN / OpenBTS
  тест протоколов IoT    ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  поиск беспроводных CVE    ->  NVD / vendor advisories (ручной поиск)
  проверка соответствия    ->  NIST / PCI-DSS / HIPAA docs (вручную)
  маппинг на MITRE ATT&CK    ->  ATT&CK Navigator (ручной маппинг)
  корреляция всего   ->  copy-paste
```

**wifi-security-mcp-server** предоставляет вашему ИИ-агенту 34 составных инструмента, подкреплённых 9 базами знаний, покрывающих 139 индивидуальных возможностей через [Model Context Protocol](https://modelcontextprotocol.io).

---

## How It's Different

Существующие инструменты дают необработанные захваты пакетов и анализ конкретных протоколов. wifi-security-mcp-server даёт вашему ИИ-агенту возможность **одновременно рассуждать во всех беспроводных доменах** с глубокой поддержкой базы знаний.

<table>
<thead><tr><th></th><th>Традиционный подход</th><th>wifi-security-mcp-server</th></tr></thead>
<tbody>
<tr><td><b>Интерфейс</b></td><td>10+ различных CLI, GUI и аппаратных инструментов</td><td>MCP — ИИ-агент вызывает инструменты в диалоге</td></tr>
<tr><td><b>Покрытие</b></td><td>Один протокол за раз</td><td>WiFi, Bluetooth, RF, NFC, Сотовые, IoT — всё в одном сервере</td></tr>
<tr><td><b>Знания</b></td><td>Ручной поиск CVE, ручной маппинг ATT&CK</td><td>9 встроенных баз знаний со 139 предварительно сопоставленными элементами</td></tr>
<tr><td><b>Разведка атак</b></td><td>Поиск Google + блоги + доклады на конференциях</td><td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Сотовые + 6 IoT атак с инструментами, смягчениями, ID ATT&CK</td></tr>
<tr><td><b>Соответствие</b></td><td>Читать PDF NIST/PCI-DSS/HIPAA, сопоставлять контроли вручную</td><td>Агент автоматически проверяет 5 фреймворков соответствия</td></tr>
<tr><td><b>API-ключи</b></td><td>Различные аккаунты для разных сервисов</td><td>Ноль API-ключей для основного функционала — на базе знаний</td></tr>
<tr><td><b>Настройка</b></td><td>Установить aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td><td><code>npx wifi-security-mcp-server</code> — одна команда, ноль конфигурации</td></tr>
</tbody>
</table>

---

## Quick Start

### Вариант 1: npx (без установки)

```bash
npx wifi-security-mcp-server
```

Все 34 инструмента работают сразу. API-ключи не требуются — основной функционал на базе знаний.

### Вариант 2: Клонирование

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Переменные окружения (необязательно)

```bash
# WiGLE — база данных вардрайвинга для поиска реальных WiFi-сетей
export WIGLE_API_KEY=your-key
# Kismet — обнаружение беспроводных вторжений в реальном времени
export KISMET_HOST=127.0.0.1      # По умолчанию: 127.0.0.1
export KISMET_PORT=2501           # По умолчанию: 2501
export KISMET_API_KEY=your-key
```

Все API-ключи необязательны. Без них вы по-прежнему имеете полный доступ ко всем 34 инструментам, работающим на 9 встроенных базах знаний.

### Подключить к ИИ-агенту

<details open><summary><b>Claude Code</b></summary>

```bash
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server
```
</details>

<details><summary><b>Claude Desktop</b></summary>

```json
{"mcpServers":{"wifi-security":{"command":"npx","args":["-y","wifi-security-mcp-server"],"env":{"WIGLE_API_KEY":"optional","KISMET_HOST":"optional","KISMET_PORT":"optional","KISMET_API_KEY":"optional"}}}}
```
</details>

<details><summary><b>Cursor / Windsurf / другие MCP-клиенты</b></summary>

Тот же формат JSON-конфигурации. Укажите команду на `npx wifi-security-mcp-server` или ваш локальный путь установки.
</details>

### Начать запросы

```
Вы: "Какие атаки возможны на сеть WPA3-SAE и как их тестировать?"
```

Вот и всё. Агент ищет атаки, сопоставляет с MITRE ATT&CK, рекомендует инструменты и предоставляет пошаговую методологию — всё из встроенных баз знаний.

---

## What The AI Can Do

### Оценка безопасности WiFi

```
Вы: "Проанализируйте безопасность сети WPA2-PSK с включённым WPS"

Agent: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
```

### Анализ Bluetooth и BLE

```
Вы: "Каковы риски безопасности нашей системы контроля доступа на основе BLE?"

Agent: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
```

### Аудит беспроводного IoT

```
Вы: "Оцените беспроводную безопасность нашего IoT-развёртывания умного здания"

Agent: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
```

### Аудит соответствия

```
Вы: "Проверьте наш больничный WiFi на соответствие беспроводным требованиям HIPAA"

Agent: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
```

---

## Tools Reference (34 composite tools)

<details open><summary><b>WiFi Ядро (8) &mdash; Без API-ключа</b></summary>

| Tool | Описание |
|------|------|
| `scan_wifi_networks` | Сканирование и анализ WiFi-сетей — обнаружение SSID, каналов, типов шифрования, уровня сигнала и ошибок конфигурации безопасности |
| `analyze_wifi_security` | Глубокий анализ конфигурации безопасности WiFi — стойкость шифрования, метод аутентификации, известные слабости, поверхность атаки |
| `find_wifi_attacks` | Поиск применимых атак для WiFi-цели — возвращает методологию атаки, необходимые инструменты, маппинг MITRE ATT&CK, смягчения |
| `simulate_evil_twin` | Симуляция и анализ сценариев атаки evil twin AP — конфигурация hostapd-mana, captive portal, методология перехвата учётных данных |
| `analyze_deauth` | Анализ векторов атаки деаутентификации — статус 802.11w PMF, обнаружение деаутентификации, контрмеры, интеграция WIDS |
| `crack_wps` | Анализ векторов атаки взлома WPS — Pixie Dust, перебор, null PIN, генерация PIN по умолчанию, методология Reaver/Bully |
| `analyze_pmkid` | Анализ векторов атаки на основе PMKID — бесклиентный взлом WPA/WPA2 через hcxdumptool + hashcat режим 22000 |
| `audit_wifi67` | Аудит функций безопасности WiFi 6 (802.11ax) и WiFi 7 (802.11be) — OWE, SAE, Enhanced Open, Multi-Link Operation |
</details>

<details><summary><b>Bluetooth (3) &mdash; Без API-ключа</b></summary>

| Tool | Описание |
|------|------|
| `scan_bluetooth` | Сканирование и анализ Bluetooth-устройств — обнаружение BR/EDR классического и BLE, перечисление сервисов, анализ сопряжения |
| `find_bluetooth_attacks` | Поиск применимых Bluetooth-атак — BlueBorne, KNOB, BIAS, BLE relay, MITM, с инструментами и смягчениями |
| `analyze_ble` | Глубокий анализ безопасности BLE — сервисы GATT, методы сопряжения, LE Secure Connections, шифрование характеристик |
</details>

<details><summary><b>RF/SDR (1) &mdash; Без API-ключа</b></summary>

| Tool | Описание |
|------|------|
| `analyze_rf_signal` | Анализ безопасности RF-сигнала — анализ частоты, идентификация модуляции, выполнимость replay-атаки, рекомендации SDR-инструментов |
</details>

<details><summary><b>NFC/RFID (1) &mdash; Без API-ключа</b></summary>

| Tool | Описание |
|------|------|
| `analyze_nfc_security` | Анализ безопасности NFC/RFID — идентификация типа карты, слабости контроля доступа, выполнимость клонирования, методология Proxmark3 |
</details>

<details><summary><b>Сотовые/5G (1) &mdash; Без API-ключа</b></summary>

| Tool | Описание |
|------|------|
| `analyze_cellular_security` | Анализ безопасности сотовой сети — слабости протоколов 2G/3G/4G/5G, обнаружение IMSI-перехватчика, анализ поддельной базовой станции |
</details>

<details><summary><b>IoT Беспроводные (3) &mdash; Без API-ключа</b></summary>

| Tool | Описание |
|------|------|
| `analyze_zigbee` | Анализ безопасности сети Zigbee — политика trust center, управление сетевыми ключами, методология атаки KillerBee |
| `scan_iot_wireless` | Сканирование беспроводных протоколов IoT — обнаружение и анализ уязвимостей Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP |
| `find_mousejack` | Анализ уязвимостей MouseJack беспроводной клавиатуры/мыши — инъекция нажатий клавиш, незашифрованный HID, обходы для конкретных производителей |
</details>

<details><summary><b>Продвинутые Беспроводные (6) &mdash; Без API-ключа</b></summary>

| Tool | Описание |
|------|------|
| `analyze_airgap` | Анализ техник эксфильтрации через air-gap — электромагнитные, акустические, тепловые, оптические скрытые каналы и контрмеры |
| `analyze_uwb` | Анализ безопасности Ultra-Wideband (UWB) — манипуляция измерением расстояния, relay-атаки на автомобильные ключи и AirTag, мошенничество с расстоянием |
| `analyze_wifi_csi` | Анализ безопасности WiFi Channel State Information (CSI) — пассивное зондирование, распознавание активности, риски вывода нажатий клавиш |
| `analyze_miracast` | Анализ безопасности Miracast/WiFi Display — перехват сессии WFD, захват экрана, несанкционированный доступ к дисплею |
| `analyze_wifi_direct` | Анализ безопасности WiFi Direct (P2P) — атаки на согласование владельца группы, уязвимости WPS в P2P, создание вредоносной группы |
| `analyze_drone_rf` | Анализ RF-безопасности дронов — перехват линии управления, GPS-спуфинг, перехват видео-даунлинка, техники counter-UAS |
</details>

<details><summary><b>Инфраструктура (4) &mdash; Без API-ключа</b></summary>

| Tool | Описание |
|------|------|
| `audit_wlan_controller` | Аудит конфигурации WLAN-контроллера — настройки безопасности Cisco WLC, Aruba, Meraki, политики rogue AP, управление RF |
| `analyze_captive_portal` | Анализ безопасности captive portal — техники обхода, риски сбора учётных данных, изоляция сети, безопасность гостевого VLAN |
| `detect_mac_randomization` | Анализ рандомизации MAC-адреса — различия реализации iOS/Android/Windows, сопротивление отслеживанию, обходы фингерпринтинга |
| `analyze_hotspot20` | Анализ безопасности Hotspot 2.0 (Passpoint) — ANQP, OSU, риски автоматического выбора сети, анализ метода EAP |
</details>

<details><summary><b>Разведка (4) &mdash; Без API-ключа</b></summary>

| Tool | Описание |
|------|------|
| `lookup_wireless_cve` | Поиск CVE для беспроводных — уязвимости чипсетов WiFi, CVE стеков Bluetooth, эксплойты драйверов, баги прошивок |
| `lookup_hardware` | Поиск оборудования беспроводной безопасности — WiFi-адаптеры, Bluetooth-снифферы, SDR-устройства, возможности, совместимость чипсетов |
| `map_wireless_attck` | Маппинг беспроводных атак на фреймворк MITRE ATT&CK — ID техник, категории тактик, стратегии обнаружения |
| `analyze_medical_wireless` | Анализ беспроводной безопасности медицинских устройств — инфузионные насосы, кардиостимуляторы, мониторы пациентов, руководства FDA, требования HIPAA |
</details>

<details><summary><b>Обнаружение (2) &mdash; Без API-ключа</b></summary>

| Tool | Описание |
|------|------|
| `detect_wireless_attack` | Обнаружение текущих беспроводных атак — flood деаутентификации, evil twin, KARMA, rogue AP, BLE-спуфинг, индикаторы RF-глушения |
| `audit_wireless_compliance` | Аудит беспроводной сети по фреймворкам соответствия — PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, беспроводные контроли ISO 27001 |
</details>

<details><summary><b>Отчётность (1) &mdash; Без API-ключа</b></summary>

| Tool | Описание |
|------|------|
| `export_report` | Экспорт отчёта оценки беспроводной безопасности — результаты, рейтинги рисков, статус соответствия, дорожная карта исправления, резюме для руководства |
</details>

---

### CLI Usage

```bash
# Список всех доступных инструментов
npx wifi-security-mcp-server --list
# Запуск любого инструмента напрямую
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

Сервер поставляется с 9 встроенными базами знаний — без API-ключей, без внешних зависимостей, без ограничений частоты. Каждый запрос инструмента обогащается структурированной разведкой из этих баз данных.

| База знаний | Записи | Что предоставляет |
|------|------|------|
| **Атаки WiFi | 47 атак** | Техники атак WPA/WPA2/WPA3, варианты evil twin, PMKID, KRACK, FragAttacks, деаутентификация, эксплойты WPS — каждый с инструментами, смягчениями, маппингом MITRE ATT&CK |
| **Атаки Bluetooth | 8 атак** | BlueBorne, KNOB, BIAS, BLE relay, MITM, BLE fuzzing, имитация Bluetooth — с CVE и стратегиями обнаружения |
| **Атаки RF/SDR | 6 атак** | Replay-атаки, глушение, инъекция сигнала, перехват на основе SDR, обход RF-фингерпринтинга, техники анализа спектра |
| **Атаки NFC/RFID | 6 атак** | Клонирование карт, relay-атаки, взлом MIFARE Classic, NFC-скимминг, RFID-фаззинг, обход контроля доступа с Proxmark3 |
| **Атаки Сотовые | 6 атак** | Перехват IMSI, поддельная базовая станция (Stingray), эксплуатация SS7, уязвимости 5G NAS, атаки downgrade, перехват VoLTE |
| **Атаки IoT | 6 атак** | Снифинг сетевого ключа Zigbee, downgrade Z-Wave S0, сбор учётных данных MQTT, replay LoRaWAN ABP, MouseJack, BLE IoT relay |
| **База оборудования | 12 устройств** | WiFi-адаптеры (Alfa, TP-Link), Bluetooth-снифферы (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) — чипсеты, возможности, поддержка режима монитора |
| **База CVE | 17 CVE** | CVE для беспроводных чипсетов WiFi (Broadcom, Qualcomm, Intel), стеков Bluetooth, IoT-прошивок — серьёзность, затронутые версии, доступность эксплойтов |
| **Фреймворки соответствия | 5 фреймворков** | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 — контроли для беспроводных, чек-листы аудита, анализ пробелов |

---

## Architecture

```
src/
  index.ts                    # Точка входа CLI (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # Настройка MCP-сервера (stdio transport)
    tools.ts                  # Реестр инструментов — все 34 составных инструмента собраны здесь
  types/
    index.ts                  # Общие типы (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 встроенных баз знаний
```

**Решения проектирования:**

- **На базе знаний** — В отличие от инструментов, зависящих от API, основной функционал работает полностью оффлайн из 9 встроенных баз данных.
- **34 составных инструмента, 139 индивидуальных возможностей** — Каждый инструмент — композит, объединяющий связанные анализы.
- **2 зависимости runtime** — `@modelcontextprotocol/sdk` и `zod`. Ничего больше.
- **Опциональная интеграция в реальном времени** — WiGLE API для данных реальных сетей, Kismet для WIDS в реальном времени.
- **Осведомлённость о соответствии** — Каждый результат автоматически сопоставляется с соответствующими фреймворками.
- **Маппинг MITRE ATT&CK** — Техники атак включают ID техник ATT&CK, категории тактик и источники данных обнаружения для интеграции SOC.

---

## Limitations

- Базы знаний — это снимки на определённый момент времени — новые атаки/CVE требуют обновления пакета
- Интеграция WiGLE требует бесплатного API-ключа для поиска сетей
- Kismet WIDS в реальном времени требует работающего экземпляра Kismet с доступом API
- Нет активной беспроводной передачи — сервер предоставляет разведку и методологию, не инъекцию пакетов
- База оборудования охватывает наиболее распространённые исследовательские устройства безопасности, не исчерпывающая
- Фреймворки соответствия фокусируются на беспроводных контролях, не на полном покрытии фреймворка
- macOS / Linux протестированы (Windows не тестировался)

---

## Part of the MCP Security Suite

| Проект | Область | Инструменты |
|------|------|------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Тестирование безопасности на основе браузера | 39 инструментов, Firefox, тесты инъекций |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Безопасность облака (AWS/Azure/GCP) | 38 инструментов, 60+ проверок |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | Безопасность GitHub | 39 инструментов, 45 проверок |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Разведка уязвимостей | 23 инструмента, 5 источников |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT и разведка | 37 инструментов, 12 источников |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Тёмная сеть и разведка угроз | 66 инструментов, 16 источников |
| **wifi-security-mcp-server** | **Разведка беспроводной безопасности** | **34 инструмента, 9 баз знаний** |

---

<p align="center">
<b>Только для авторизованного тестирования и оценки безопасности.</b><br>
Всегда убедитесь, что у вас есть надлежащее разрешение перед проведением тестирования беспроводной безопасности любой сети или устройства.<br>
Несанкционированный доступ к беспроводной сети или помехи незаконны в большинстве юрисдикций.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

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
  <strong>Українська</strong> |
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

<h3 align="center">Розвідка безпеки бездротових мереж для AI-агентів.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Стільниковий/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drone RF, WIDS/WIPS, Відповідність &mdash; об'єднані в єдиному MCP-сервері.<br>
  Ваш AI-агент отримує <b>повноспектральний аналіз безпеки бездротових мереж на вимогу</b>, що працює на 9 вбудованих базах знань, які охоплюють 139 індивідуальних інструментів.
</p>

<br>

<p align="center">
  <a href="#the-problem">Проблема</a> &bull;
  <a href="#how-its-different">Чим відрізняється</a> &bull;
  <a href="#quick-start">Швидкий старт</a> &bull;
  <a href="#what-the-ai-can-do">Що може AI</a> &bull;
  <a href="#tools-reference-34-composite-tools">Інструменти (34)</a> &bull;
  <a href="#knowledge-bases-9">Бази знань</a> &bull;
  <a href="#architecture">Архітектура</a> &bull;
  <a href="CHANGELOG.md">Changelog</a> &bull;
  <a href="CONTRIBUTING.md">Внесок</a>
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

Оцінка безпеки бездротових мереж є однією з найбільш фрагментованих дисциплін в наступальній безпеці. Аудит WiFi вимагає одного набору інструментів, Bluetooth — іншого, RF/SDR — третього, IoT-протоколи — ще іншого &mdash; і кожен домен має свою власну поверхню атаки, свої власні вразливості, свої власні вимоги відповідності. Сьогодні ви запускаєте aircrack-ng для WPA, використовуєте Bettercap для BLE, запускаєте HackRF для SDR, звертаєтесь до різних баз даних CVE для кожного чіпсету, окремо посилаєтесь на NIST та PCI-DSS, а потім витрачаєте години на ручну кореляцію результатів у послідовну оцінку.

```
Традиційний робочий процес безпеки бездротових мереж:
  аудит WiFi-мереж                  ->  aircrack-ng / Wireshark / Kismet
  тестування безпеки Bluetooth      ->  Bettercap / btlejack / Ubertooth
  аналіз RF-сигналів                ->  HackRF / GNU Radio / GQRX
  перевірка NFC/RFID                ->  Proxmark3 / libnfc
  оцінка стільникової безпеки       ->  srsRAN / OpenBTS
  тестування IoT-протоколів         ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  пошук бездротових CVE             ->  NVD / vendor advisories (ручний пошук)
  перевірка відповідності           ->  NIST / PCI-DSS / HIPAA docs (вручну)
  відображення на MITRE ATT&CK      ->  ATT&CK Navigator (ручне відображення)
  кореляція всього                  ->  копіювання-вставка у звіт
  ────────────────────────────────
  Всього: години на оцінку, більшість з яких — перемикання контексту між інструментами
```

**wifi-security-mcp-server** надає вашому AI-агенту 34 композитних інструменти, підкріплених 9 базами знань, що охоплюють 139 індивідуальних можливостей через [Model Context Protocol](https://modelcontextprotocol.io). Агент аналізує мережі, ідентифікує вразливості, відображає атаки на MITRE ATT&CK, перевіряє відповідність та генерує дієві звіти &mdash; в одній розмові.

```
З wifi-security-mcp-server:
  Ви: "Перевірте безпеку бездротової мережі нашого офісу, що працює на WPA2-Enterprise"

  Агент: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "Ваша мережа WPA2-Enterprise має 3 критичних знахідки:
            1. EAP-PEAP без закріплення сертифіката — вразлива до evil twin
               з hostapd-mana (MITRE T1557.002)
            2. Немає 802.11w (PMF) — вразлива до атак деаутентифікації
               (MITRE T1498.001)
            3. Хеш PMKID можна витягти без взаємодії з клієнтом —
               можливий офлайн-злам за допомогою hashcat mode 22000
            PCI-DSS 4.0: 2 контролі невідповідні (4.2.1, 11.2.1).
            Рекомендовано: мігрувати на WPA3-Enterprise з SAE, увімкнути PMF,
            розгорнути WIDS для виявлення підроблених AP."
```

---

## How It's Different

Існуючі інструменти дають вам необроблені захоплення пакетів та аналіз, специфічний для протоколу. wifi-security-mcp-server дає вашому AI-агенту можливість **одночасно міркувати у всіх бездротових доменах** з глибокою підтримкою баз знань.

<table>
<thead>
<tr>
<th></th>
<th>Традиційний підхід</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Інтерфейс</b></td>
<td>10+ різних CLI, GUI та апаратних інструментів</td>
<td>MCP &mdash; AI-агент викликає інструменти в розмовному режимі</td>
</tr>
<tr>
<td><b>Покриття</b></td>
<td>Один протокол за раз</td>
<td>WiFi, Bluetooth, RF, NFC, Стільниковий, IoT &mdash; все на одному сервері</td>
</tr>
<tr>
<td><b>Знання</b></td>
<td>Ручний пошук CVE, ручне відображення ATT&CK</td>
<td>9 вбудованих баз знань із 139 попередньо відображеними елементами</td>
</tr>
<tr>
<td><b>Розвідка атак</b></td>
<td>Пошук Google + блог-пости + доповіді на конференціях</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Стільникових + 6 IoT атак каталогізовано з інструментами, пом'якшеннями, ATT&CK ID</td>
</tr>
<tr>
<td><b>Відповідність</b></td>
<td>Читати PDF NIST/PCI-DSS/HIPAA, відображати контролі вручну</td>
<td>Агент автоматично перевіряє за 5 фреймворками відповідності</td>
</tr>
<tr>
<td><b>API-ключі</b></td>
<td>Різні облікові записи для різних сервісів</td>
<td>Нуль API-ключів для основної функціональності &mdash; на основі баз знань</td>
</tr>
<tr>
<td><b>Встановлення</b></td>
<td>Встановити aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; одна команда, нуль конфігурації</td>
</tr>
</tbody>
</table>

---

## Quick Start

### Варіант 1: npx (без встановлення)

```bash
npx wifi-security-mcp-server
```

Усі 34 інструменти працюють негайно. API-ключ не потрібен &mdash; основна функціональність працює на базах знань.

### Варіант 2: Клонувати

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Змінні середовища (необов'язково)

```bash
# WiGLE — база даних wardriving для пошуку реальних WiFi-мереж
export WIGLE_API_KEY=your-key

# Kismet — виявлення бездротових вторгнень у реальному часі
export KISMET_HOST=127.0.0.1      # За замовчуванням: 127.0.0.1
export KISMET_PORT=2501           # За замовчуванням: 2501
export KISMET_API_KEY=your-key
```

Усі API-ключі є необов'язковими. Без них ви все одно маєте повний доступ до всіх 34 інструментів, що працюють на 9 вбудованих базах знань, які охоплюють атаки WiFi, атаки Bluetooth, RF/SDR, NFC/RFID, стільникові, IoT, базу даних обладнання, розвідку CVE та фреймворки відповідності.

### Підключення до вашого AI-агента

<details open>
<summary><b>Claude Code</b></summary>

```bash
# З npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# З локальним клоном
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Додайте до `~/Library/Application Support/Claude/claude_desktop_config.json`:

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
<summary><b>Cursor / Windsurf / інші MCP-клієнти</b></summary>

Той самий формат JSON-конфігурації. Спрямуйте команду на `npx wifi-security-mcp-server` або шлях вашого локального встановлення.

</details>

### Починайте запитувати

```
Ви: "Які атаки можливі проти мережі WPA3-SAE і як їх тестувати?"
```

Це все. Агент шукає атаки, відображає їх на MITRE ATT&CK, рекомендує інструменти та надає покрокову методологію &mdash; все з вбудованих баз знань.

---

## What The AI Can Do

### Оцінка безпеки WiFi

```
Ви: "Проаналізуйте безпеку мережі WPA2-PSK з увімкненим WPS"

Агент: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "Знайдено критичні вразливості в конфігурації WPA2-PSK + WPS:
          1. Атака WPS Pixie Dust — PIN відновлюється за секунди через
             офлайн-перебір нонсів E-S1/E-S2 (Reaver + PixieWPS).
             Повне відновлення PSK без взаємодії з клієнтом.
          2. Атака PMKID — перший пакет 4-way handshake містить
             хеш PMKID, що зламується офлайн за допомогою hashcat -m 22000.
             Деаутентифікація не потрібна, клієнт не потрібен.
          3. Захоплення 4-Way Handshake — EAPOL-фрейми можна захопити
             за допомогою airodump-ng + deauth, потім офлайн-атака за словником.
          Пріоритет: Негайно вимкнути WPS (найвищий ризик), забезпечити
          надійний PSK з 20+ символів, розглянути міграцію на WPA3-SAE."
```

### Аналіз Bluetooth & BLE

```
Ви: "Які ризики безпеки нашої системи контролю доступу на основі BLE?"

Агент: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "Система контролю доступу BLE — виявлено 4 критичних ризики:
          1. Сполучення JustWorks — немає захисту від MITM. Зловмисник може
             перехопити сполучення за допомогою Ubertooth One (MITRE T1040).
          2. Перехоплення GATT Characteristic — команди розблокування
             передаються відкритим текстом, можуть бути відтворені за допомогою gatttool (MITRE T1212).
          3. BLE Relay/Replay атака — ретрансляція легітимного сигналу
             розблокування за допомогою двох пристроїв + btlejack (MITRE T1557).
          4. Відстеження MAC-адреси — статичний BLE MAC дозволяє
             відстеження мешканців (MITRE T1592.002).
          Рекомендовано: забезпечити LE Secure Connections (LESC) з
          числовим порівнянням, шифрувати GATT characteristics, реалізувати
          ротацію нонсів для захисту від повторного відтворення."
```

### Аудит бездротового IoT

```
Ви: "Оцініть безпеку бездротової мережі нашого розгортання IoT для розумної будівлі"

Агент: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "Оцінка бездротового IoT розумної будівлі — 5 знахідок:
          1. Zigbee: Ключ зв'язку центру довіри за замовчуванням
             (ZigBeeAlliance09) дозволяє перехоплення підключення до мережі
             за допомогою KillerBee (КРИТИЧНО)
          2. MQTT: Брокер на порту 1883 без TLS — облікові дані
             та дані сенсорів передаються відкритим текстом
          3. Z-Wave: Безпека S0 з відомою вразливістю обміну ключами
             — рекомендовано оновлення до S2
          4. MouseJack: 3 приймачі Logitech Unifying вразливі до
             ін'єкції натискань клавіш (CVE-2016-10761)
          5. WiFi: IoT-пристрої в тому ж VLAN, що й корпоративна
             мережа — немає сегментації мережі
          Пріоритетне виправлення: MQTT TLS, коди встановлення Zigbee,
          ізоляція IoT VLAN, заміна вразливих приймачів Logitech."
```

### Аудит відповідності

```
Ви: "Перевірте WiFi нашої лікарні на відповідність вимогам HIPAA до бездротових мереж"

Агент: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "Аудит відповідності бездротової мережі HIPAA — 6 знахідок:
          3 НЕВІДПОВІДНИХ контролі:
          - 164.312(a)(1): Не розгорнуто бездротову IDS для виявлення підроблених AP
          - 164.312(e)(1): Медичні пристрої використовують WPA2-PSK (не Enterprise)
          - 164.312(e)(2): Немає журналювання аудиту шифрування бездротового трафіку
          3 ВІДПОВІДНИХ контролі:
          - 164.310(a)(1): Фізичне розташування AP задокументовано
          - 164.312(a)(2): 802.1X з автентифікацією RADIUS
          - 164.312(d): EAP-TLS на основі сертифікатів для пристроїв персоналу
          План виправлення: розгорнути WIDS (Kismet/AirMagnet), мігрувати
          медичні пристрої на WPA2-Enterprise з MAB, увімкнути журналювання
          бездротового аудиту на WLAN-контролері."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; API-ключ не потрібен</b></summary>

| Інструмент | Опис |
|-----------|------|
| `scan_wifi_networks` | Сканування та аналіз WiFi-мереж &mdash; виявлення SSID, каналів, типів шифрування, потужності сигналу та помилок конфігурації безпеки |
| `analyze_wifi_security` | Глибокий аналіз конфігурації безпеки WiFi &mdash; стійкість шифрування, метод автентифікації, відомі слабкості, поверхня атаки |
| `find_wifi_attacks` | Пошук застосовних атак для WiFi-цілі &mdash; повертає методологію атаки, необхідні інструменти, відображення MITRE ATT&CK, пом'якшення |
| `simulate_evil_twin` | Симуляція та аналіз сценаріїв атаки evil twin AP &mdash; конфігурація hostapd-mana, captive portal, методологія захоплення облікових даних |
| `analyze_deauth` | Аналіз векторів атаки деаутентифікації &mdash; статус 802.11w PMF, виявлення деаутентифікації, контрзаходи, інтеграція WIDS |
| `crack_wps` | Аналіз векторів атаки злому WPS &mdash; Pixie Dust, брутфорс, нульовий PIN, генерація PIN за замовчуванням, методологія Reaver/Bully |
| `analyze_pmkid` | Аналіз векторів атаки на основі PMKID &mdash; злом WPA/WPA2 без клієнта через hcxdumptool + hashcat mode 22000 |
| `audit_wifi67` | Аудит специфічних функцій безпеки WiFi 6 (802.11ax) та WiFi 7 (802.11be) &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; API-ключ не потрібен</b></summary>

| Інструмент | Опис |
|-----------|------|
| `scan_bluetooth` | Сканування та аналіз Bluetooth-пристроїв &mdash; виявлення BR/EDR класичного та BLE, перелік сервісів, аналіз сполучення |
| `find_bluetooth_attacks` | Пошук застосовних атак Bluetooth &mdash; BlueBorne, KNOB, BIAS, BLE relay, MITM, з інструментами та пом'якшеннями |
| `analyze_ble` | Глибокий аналіз безпеки BLE &mdash; сервіси GATT, методи сполучення, LE Secure Connections, шифрування characteristics |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; API-ключ не потрібен</b></summary>

| Інструмент | Опис |
|-----------|------|
| `analyze_rf_signal` | Аналіз безпеки RF-сигналів &mdash; аналіз частоти, ідентифікація модуляції, можливість replay-атаки, рекомендації SDR-інструментів |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; API-ключ не потрібен</b></summary>

| Інструмент | Опис |
|-----------|------|
| `analyze_nfc_security` | Аналіз безпеки NFC/RFID &mdash; ідентифікація типу картки, слабкості контролю доступу, можливість клонування, методологія Proxmark3 |

</details>

<details>
<summary><b>Стільниковий/5G (1) &mdash; API-ключ не потрібен</b></summary>

| Інструмент | Опис |
|-----------|------|
| `analyze_cellular_security` | Аналіз безпеки стільникової мережі &mdash; слабкості протоколів 2G/3G/4G/5G, виявлення IMSI catcher, аналіз фальшивої базової станції |

</details>

<details>
<summary><b>Бездротовий IoT (3) &mdash; API-ключ не потрібен</b></summary>

| Інструмент | Опис |
|-----------|------|
| `analyze_zigbee` | Аналіз безпеки мережі Zigbee &mdash; політика центру довіри, управління мережевими ключами, методологія атаки KillerBee |
| `scan_iot_wireless` | Сканування бездротових IoT-протоколів &mdash; виявлення та аналіз вразливостей Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP |
| `find_mousejack` | Аналіз вразливостей MouseJack бездротових клавіатур/мишей &mdash; ін'єкція натискань клавіш, нешифрований HID, обходи для конкретних виробників |

</details>

<details>
<summary><b>Розширений бездротовий (6) &mdash; API-ключ не потрібен</b></summary>

| Інструмент | Опис |
|-----------|------|
| `analyze_airgap` | Аналіз технік ексфільтрації через air-gap &mdash; електромагнітні, акустичні, теплові, оптичні приховані канали та контрзаходи |
| `analyze_uwb` | Аналіз безпеки Ultra-Wideband (UWB) &mdash; маніпуляція відстанню, relay-атаки на автомобільні ключі та AirTags, шахрайство з відстанню |
| `analyze_wifi_csi` | Аналіз безпеки WiFi Channel State Information (CSI) &mdash; пасивне зондування, розпізнавання активності, ризики виведення натискань клавіш |
| `analyze_miracast` | Аналіз безпеки Miracast/WiFi Display &mdash; перехоплення сесії WFD, захоплення екрану, несанкціонований доступ до дисплея |
| `analyze_wifi_direct` | Аналіз безпеки WiFi Direct (P2P) &mdash; атаки на переговори про власника групи, вразливості WPS у P2P, створення зловмисної групи |
| `analyze_drone_rf` | Аналіз безпеки RF дронів &mdash; перехоплення каналу керування, підробка GPS, перехоплення відеоканалу, техніки counter-UAS |

</details>

<details>
<summary><b>Інфраструктура (4) &mdash; API-ключ не потрібен (KISMET_* необов'язковий для WIDS у реальному часі)</b></summary>

| Інструмент | Опис |
|-----------|------|
| `audit_wlan_controller` | Аудит конфігурації WLAN-контролера &mdash; налаштування безпеки Cisco WLC, Aruba, Meraki, політики підроблених AP, управління RF |
| `analyze_captive_portal` | Аналіз безпеки captive portal &mdash; техніки обходу, ризики збору облікових даних, ізоляція мережі, безпека гостьового VLAN |
| `detect_mac_randomization` | Аналіз рандомізації MAC-адрес &mdash; відмінності реалізації iOS/Android/Windows, стійкість до відстеження, обходи fingerprinting |
| `analyze_hotspot20` | Аналіз безпеки Hotspot 2.0 (Passpoint) &mdash; ANQP, OSU, ризики автоматичного вибору мережі, аналіз методу EAP |

</details>

<details>
<summary><b>Розвідка (4) &mdash; API-ключ не потрібен</b></summary>

| Інструмент | Опис |
|-----------|------|
| `lookup_wireless_cve` | Пошук бездротових CVE &mdash; вразливості WiFi-чіпсетів, CVE стеків Bluetooth, експлойти драйверів, помилки прошивок |
| `lookup_hardware` | Пошук обладнання для безпеки бездротових мереж &mdash; WiFi-адаптери, Bluetooth-сніфери, SDR-пристрої, можливості, сумісність чіпсетів |
| `map_wireless_attck` | Відображення бездротових атак на фреймворк MITRE ATT&CK &mdash; ID технік, категорії тактик, стратегії виявлення |
| `analyze_medical_wireless` | Аналіз безпеки бездротових медичних пристроїв &mdash; інфузійні насоси, кардіостимулятори, монітори пацієнтів, рекомендації FDA, вимоги HIPAA |

</details>

<details>
<summary><b>Виявлення (2) &mdash; API-ключ не потрібен</b></summary>

| Інструмент | Опис |
|-----------|------|
| `detect_wireless_attack` | Виявлення бездротових атак у процесі &mdash; потоки деаутентифікації, evil twin, KARMA, підроблений AP, BLE-підробка, індикатори RF-глушіння |
| `audit_wireless_compliance` | Аудит бездротової мережі на відповідність фреймворкам &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, бездротові контролі ISO 27001 |

</details>

<details>
<summary><b>Звітність (1) &mdash; API-ключ не потрібен</b></summary>

| Інструмент | Опис |
|-----------|------|
| `export_report` | Експорт звіту з оцінки безпеки бездротової мережі &mdash; знахідки, рейтинги ризиків, статус відповідності, дорожня карта виправлень, резюме для керівництва |

</details>

---

### CLI Usage

```bash
# Показати всі доступні інструменти
npx wifi-security-mcp-server --list

# Запустити будь-який інструмент безпосередньо
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

Сервер постачається з 9 вбудованими базами знань &mdash; без API-ключів, без зовнішніх залежностей, без обмежень швидкості. Кожен запит інструменту збагачується структурованою розвідкою з цих баз даних.

| База знань | Записи | Що надає |
|-----------|--------|---------|
| **Атаки WiFi** | 47 атак | Техніки атак WPA/WPA2/WPA3, варіанти evil twin, PMKID, KRACK, FragAttacks, деаутентифікація, експлойти WPS &mdash; кожна з інструментами, пом'якшеннями, відображенням MITRE ATT&CK |
| **Атаки Bluetooth** | 8 атак | BlueBorne, KNOB, BIAS, BLE relay, MITM, BLE fuzzing, імітація Bluetooth &mdash; з CVE та стратегіями виявлення |
| **Атаки RF/SDR** | 6 атак | Replay-атаки, глушіння, ін'єкція сигналу, перехоплення на основі SDR, обхід RF-fingerprinting, техніки аналізу спектру |
| **Атаки NFC/RFID** | 6 атак | Клонування карток, relay-атаки, злом MIFARE Classic, NFC-скімінг, RFID fuzzing, обхід контролю доступу з Proxmark3 |
| **Стільникові атаки** | 6 атак | Захоплення IMSI, фальшива базова станція (Stingray), експлуатація SS7, вразливості 5G NAS, атаки знищення, перехоплення VoLTE |
| **Атаки IoT** | 6 атак | Перехоплення мережевого ключа Zigbee, Z-Wave S0 downgrade, збір облікових даних MQTT, replay LoRaWAN ABP, MouseJack, BLE IoT relay |
| **База даних обладнання** | 12 пристроїв | WiFi-адаптери (Alfa, TP-Link), Bluetooth-сніфери (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; чіпсети, можливості, підтримка режиму моніторингу |
| **База даних CVE** | 17 CVE | Бездротові CVE для WiFi-чіпсетів (Broadcom, Qualcomm, Intel), стеків Bluetooth, прошивок IoT &mdash; серйозність, уражені версії, наявність експлойтів |
| **Фреймворки відповідності** | 5 фреймворків | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; бездротові контролі, контрольні списки аудиту, аналіз прогалин |

---

## Architecture

```
src/
  index.ts                    # Точка входу CLI (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # Налаштування MCP-сервера (stdio transport)
    tools.ts                  # Реєстр інструментів — усі 34 композитних інструменти зібрані тут
  types/
    index.ts                  # Спільні типи (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 вбудованих баз знань
    wifi-attacks.ts           # 47 визначень атак WiFi
    bluetooth-attacks.ts      # 8 визначень атак Bluetooth
    rf-attacks.ts             # 6 визначень атак RF/SDR
    nfc-attacks.ts            # 6 визначень атак NFC/RFID
    cellular-attacks.ts       # 6 визначень атак Стільниковий/5G
    iot-attacks.ts            # 6 визначень атак IoT
    hardware.ts               # 12 профілів обладнання
    cve-database.ts           # 17 бездротових CVE
    compliance.ts             # 5 фреймворків відповідності
  wifi/                       # Інструменти WiFi Core (8)
  bluetooth/                  # Інструменти Bluetooth (3)
  rf/                         # Інструменти RF/SDR (1)
  nfc/                        # Інструменти NFC/RFID (1)
  cellular/                   # Інструменти Стільниковий/5G (1)
  iot/                        # Інструменти бездротового IoT (3)
  advanced/                   # Розширені бездротові інструменти (6)
  infrastructure/             # Інструменти інфраструктури (4)
  intelligence/               # Інструменти розвідки (4)
  detection/                  # Інструменти виявлення (2)
  reporting/                  # Інструменти звітності (1)
```

**Проектні рішення:**

- **На основі баз знань** &mdash; На відміну від інструментів, залежних від API, основна функціональність працює повністю офлайн з 9 вбудованих баз даних. Без API-ключів, без обмежень швидкості, без зовнішніх залежностей для основного робочого процесу.
- **34 композитних інструменти, 139 індивідуальних можливостей** &mdash; Кожен інструмент є композитом, що об'єднує пов'язані аналізи. `find_wifi_attacks` не просто перелічує атаки &mdash; він повертає методологію, необхідне обладнання, відображення MITRE ATT&CK, стратегії виявлення та контрзаходи.
- **2 залежності часу виконання** &mdash; `@modelcontextprotocol/sdk` та `zod`. Нічого більше. Без нативних модулів, без бінарних залежностей, без платформо-специфічного коду.
- **Необов'язкова інтеграція в реальному часі** &mdash; API WiGLE для даних мереж реального світу, Kismet для бездротової IDS у реальному часі. Основний аналіз працює без обох.
- **Усвідомлення відповідності** &mdash; Кожна знахідка автоматично відображається на відповідні фреймворки відповідності (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001), коли це застосовно.
- **Відображення MITRE ATT&CK** &mdash; Техніки атак включають ID технік ATT&CK, категорії тактик та джерела даних виявлення для інтеграції з SOC.

---

## Limitations

- Бази знань є знімками на певний момент часу &mdash; нові атаки/CVE вимагають оновлення пакету
- Інтеграція WiGLE вимагає безкоштовний API-ключ для пошуку мереж
- WIDS у реальному часі Kismet вимагає запущений екземпляр Kismet з доступом до API
- Без активної бездротової передачі &mdash; сервер надає розвідку та методологію, а не ін'єкцію пакетів
- База даних обладнання охоплює найпоширеніші пристрої для дослідження безпеки, не є вичерпною
- Фреймворки відповідності зосереджені на бездротових контролях, а не на повному покритті фреймворку
- Тестовано на macOS / Linux (Windows не тестовано)

---

## Part of the MCP Security Suite

| Проект | Домен | Інструменти |
|--------|-------|------------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Тестування безпеки на основі браузера | 39 інструментів, Firefox, тестування ін'єкцій |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Хмарна безпека (AWS/Azure/GCP) | 38 інструментів, 60+ перевірок |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | Стан безпеки GitHub | 39 інструментів, 45 перевірок |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Розвідка вразливостей | 23 інструменти, 5 джерел |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT та розвідка | 37 інструментів, 12 джерел |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark web та розвідка загроз | 66 інструментів, 16 джерел |
| **wifi-security-mcp-server** | **Розвідка безпеки бездротових мереж** | **34 інструменти, 9 баз знань** |

---

<p align="center">
<b>Тільки для авторизованого тестування та оцінки безпеки.</b><br>
Завжди переконуйтесь, що у вас є належний дозвіл перед проведенням тестування безпеки бездротової мережі на будь-якій мережі або пристрої.<br>
Несанкціонований доступ до бездротових мереж або перешкоджання є незаконним у більшості юрисдикцій.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

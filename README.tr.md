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
  <strong>Türkçe</strong> |
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

<h3 align="center">Yapay zeka ajanları için kablosuz güvenlik istihbaratı.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Hücresel/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drone RF, WIDS/WIPS, Uyumluluk &mdash; tek bir MCP sunucusunda birleştirildi.<br>
  Yapay zeka ajanınız, 139 bireysel aracı kapsayan 9 yerleşik bilgi tabanı tarafından desteklenen <b>talep üzerine tam spektrum kablosuz güvenlik analizi</b> elde eder.
</p>

<br>

<p align="center">
  <a href="#the-problem">Sorun</a> &bull;
  <a href="#how-its-different">Farkı Ne</a> &bull;
  <a href="#quick-start">Hızlı Başlangıç</a> &bull;
  <a href="#what-the-ai-can-do">Yapay Zeka Neler Yapabilir</a> &bull;
  <a href="#tools-reference-34-composite-tools">Araçlar (34)</a> &bull;
  <a href="#knowledge-bases-9">Bilgi Tabanları</a> &bull;
  <a href="#architecture">Mimari</a> &bull;
  <a href="CHANGELOG.md">Changelog</a> &bull;
  <a href="CONTRIBUTING.md">Katkıda Bulunma</a>
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

Kablosuz güvenlik değerlendirmesi, saldırı güvenliğindeki en parçalanmış disiplinlerden biridir. WiFi denetimi bir araç seti gerektirir, Bluetooth başka bir tane, RF/SDR üçüncüsü, IoT protokolleri bir diğeri &mdash; ve her alanın kendi saldırı yüzeyi, kendi güvenlik açıkları, kendi uyumluluk gereksinimleri vardır. Bugün WPA için aircrack-ng çalıştırırsınız, BLE için Bettercap kullanırsınız, SDR için HackRF başlatırsınız, her yonga seti için farklı CVE veritabanlarına başvurursunuz, NIST ve PCI-DSS'ye ayrı ayrı referans verirsiniz ve sonra bulguları tutarlı bir değerlendirmede manuel olarak ilişkilendirmek için saatler harcarsınız.

```
Geleneksel kablosuz güvenlik iş akışı:
  WiFi ağlarını denetle             ->  aircrack-ng / Wireshark / Kismet
  Bluetooth güvenliğini test et     ->  Bettercap / btlejack / Ubertooth
  RF sinyallerini analiz et         ->  HackRF / GNU Radio / GQRX
  NFC/RFID kontrol et               ->  Proxmark3 / libnfc
  hücresel güvenliği değerlendir    ->  srsRAN / OpenBTS
  IoT protokollerini test et        ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  kablosuz CVE'leri ara             ->  NVD / vendor advisories (manuel arama)
  uyumluluğu kontrol et             ->  NIST / PCI-DSS / HIPAA docs (manuel)
  MITRE ATT&CK'a eşle               ->  ATT&CK Navigator (manuel eşleme)
  her şeyi ilişkilendir             ->  kopyala-yapıştır ile rapor oluştur
  ────────────────────────────────
  Toplam: değerlendirme başına saatler, çoğu araçlar arası bağlam değiştirme
```

**wifi-security-mcp-server**, yapay zeka ajanınıza [Model Context Protocol](https://modelcontextprotocol.io) aracılığıyla 139 bireysel yeteneği kapsayan 9 bilgi tabanı tarafından desteklenen 34 bileşik araç sağlar. Ajan ağları analiz eder, güvenlik açıklarını belirler, saldırıları MITRE ATT&CK'a eşler, uyumluluğu kontrol eder ve uygulanabilir raporlar üretir &mdash; tek bir konuşmada.

```
wifi-security-mcp-server ile:
  Siz: "WPA2-Enterprise çalıştıran ofis ağımızın kablosuz güvenliğini denetleyin"

  Ajan: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "WPA2-Enterprise ağınızda 3 kritik bulgu var:
            1. Sertifika sabitleme olmadan EAP-PEAP — hostapd-mana ile
               evil twin'e karşı savunmasız (MITRE T1557.002)
            2. 802.11w (PMF) yok — deauthentication saldırılarına
               açık (MITRE T1498.001)
            3. PMKID hash'i istemci etkileşimi olmadan çıkarılabilir —
               hashcat mode 22000 ile çevrimdışı kırma mümkün
            PCI-DSS 4.0: 2 kontrol uyumsuz (4.2.1, 11.2.1).
            Önerilen: SAE ile WPA3-Enterprise'a geçiş yapın, PMF'yi etkinleştirin,
            sahte AP tespiti için WIDS dağıtın."
```

---

## How It's Different

Mevcut araçlar size ham paket yakalamaları ve protokole özel analizler sunar. wifi-security-mcp-server, yapay zeka ajanınıza derin bilgi tabanı desteğiyle **tüm kablosuz alanlarda aynı anda akıl yürütme** yeteneği verir.

<table>
<thead>
<tr>
<th></th>
<th>Geleneksel Yaklaşım</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Arayüz</b></td>
<td>10+ farklı CLI, GUI ve donanım aracı</td>
<td>MCP &mdash; yapay zeka ajanı araçları konuşarak çağırır</td>
</tr>
<tr>
<td><b>Kapsam</b></td>
<td>Her seferinde bir protokol</td>
<td>WiFi, Bluetooth, RF, NFC, Hücresel, IoT &mdash; hepsi tek bir sunucuda</td>
</tr>
<tr>
<td><b>Bilgi</b></td>
<td>Manuel CVE araması, manuel ATT&CK eşlemesi</td>
<td>139 önceden eşlenmiş öğe içeren 9 yerleşik bilgi tabanı</td>
</tr>
<tr>
<td><b>Saldırı ist.</b></td>
<td>Google araması + blog yazıları + konferans sunumları</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Hücresel + 6 IoT saldırısı araçlar, hafifletmeler, ATT&CK ID'leri ile kataloglanmış</td>
</tr>
<tr>
<td><b>Uyumluluk</b></td>
<td>NIST/PCI-DSS/HIPAA PDF'lerini oku, kontrolleri manuel eşle</td>
<td>Ajan 5 uyumluluk çerçevesine karşı otomatik olarak kontrol eder</td>
</tr>
<tr>
<td><b>API anahtarları</b></td>
<td>Farklı hizmetler için çeşitli hesaplar</td>
<td>Temel işlevsellik için sıfır API anahtarı &mdash; bilgi tabanı odaklı</td>
</tr>
<tr>
<td><b>Kurulum</b></td>
<td>aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark kur...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; tek komut, sıfır yapılandırma</td>
</tr>
</tbody>
</table>

---

## Quick Start

### Seçenek 1: npx (kurulum gerektirmez)

```bash
npx wifi-security-mcp-server
```

34 aracın tamamı anında çalışır. API anahtarı gerekmez &mdash; temel işlevsellik bilgi tabanı odaklıdır.

### Seçenek 2: Klonla

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Ortam değişkenleri (isteğe bağlı)

```bash
# WiGLE — gerçek dünya WiFi ağ aramaları için wardriving veritabanı
export WIGLE_API_KEY=your-key

# Kismet — canlı kablosuz saldırı tespit sistemi
export KISMET_HOST=127.0.0.1      # Varsayılan: 127.0.0.1
export KISMET_PORT=2501           # Varsayılan: 2501
export KISMET_API_KEY=your-key
```

Tüm API anahtarları isteğe bağlıdır. Bunlar olmadan bile, WiFi saldırıları, Bluetooth saldırıları, RF/SDR, NFC/RFID, hücresel, IoT, donanım veritabanı, CVE istihbaratı ve uyumluluk çerçevelerini kapsayan 9 yerleşik bilgi tabanı tarafından desteklenen 34 aracın tamamına erişiminiz devam eder.

### Yapay zeka ajanınıza bağlanın

<details open>
<summary><b>Claude Code</b></summary>

```bash
# npx ile
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# Yerel klon ile
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

`~/Library/Application Support/Claude/claude_desktop_config.json` dosyasına ekleyin:

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
<summary><b>Cursor / Windsurf / diğer MCP istemcileri</b></summary>

Aynı JSON yapılandırma formatı. Komutu `npx wifi-security-mcp-server` veya yerel kurulum yolunuza yönlendirin.

</details>

### Sorgulamaya başlayın

```
Siz: "WPA3-SAE ağına karşı hangi saldırılar mümkün ve bunları nasıl test ederim?"
```

Hepsi bu kadar. Ajan saldırıları arar, MITRE ATT&CK'a eşler, araçlar önerir ve adım adım metodoloji sunar &mdash; tamamı yerleşik bilgi tabanlarından.

---

## What The AI Can Do

### WiFi Güvenlik Değerlendirmesi

```
Siz: "WPS etkin bir WPA2-PSK ağının güvenliğini analiz edin"

Ajan: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "WPA2-PSK + WPS yapılandırmasında kritik güvenlik açıkları bulundu:
          1. WPS Pixie Dust Saldırısı — E-S1/E-S2 nonce'larının çevrimdışı
             kaba kuvvet ile PIN saniyeler içinde kurtarılabilir (Reaver + PixieWPS).
             İstemci etkileşimi olmadan tam PSK kurtarma.
          2. PMKID Saldırısı — 4-yollu el sıkışmanın ilk paketi
             PMKID hash'ini içerir, hashcat -m 22000 ile çevrimdışı kırılabilir.
             Deauth gerekmez, istemci gerekmez.
          3. 4-Yollu El Sıkışma Yakalama — EAPOL çerçeveleri airodump-ng +
             deauth ile yakalanabilir, ardından çevrimdışı sözlük saldırısı.
          Öncelik: WPS'i hemen devre dışı bırakın (en yüksek risk), 20+
          karakter güçlü PSK zorunlu kılın, WPA3-SAE'ye geçişi değerlendirin."
```

### Bluetooth & BLE Analizi

```
Siz: "BLE tabanlı erişim kontrol sistemimizin güvenlik riskleri nelerdir?"

Ajan: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "BLE erişim kontrol sistemi — 4 kritik risk belirlendi:
          1. JustWorks Eşleştirme — MITM koruması yok. Saldırgan
             Ubertooth One ile eşleştirmeyi yakalayabilir (MITRE T1040).
          2. GATT Characteristic Sniffing — kilit açma komutları düz
             metin olarak gönderilir, gatttool ile tekrar oynatılabilir (MITRE T1212).
          3. BLE Relay/Replay Saldırısı — iki cihaz + btlejack ile
             meşru kilit açma sinyalini aktarma (MITRE T1557).
          4. MAC Adres Takibi — statik BLE MAC, kullanıcı
             takibine olanak tanır (MITRE T1592.002).
          Önerilen: Sayısal Karşılaştırma ile LE Secure Connections (LESC)
          zorunlu kılın, GATT characteristic'lerini şifreleyin, replay
          koruması için dönen nonce'lar uygulayın."
```

### IoT Kablosuz Denetimi

```
Siz: "Akıllı bina IoT dağıtımımızın kablosuz güvenliğini değerlendirin"

Ajan: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "Akıllı bina IoT kablosuz değerlendirmesi — 5 bulgu:
          1. Zigbee: Varsayılan güven merkezi bağlantı anahtarı
             (ZigBeeAlliance09) KillerBee ile ağ katılım müdahalesine
             olanak tanır (KRİTİK)
          2. MQTT: TLS olmadan 1883 portunda Broker — kimlik bilgileri
             ve sensör verileri düz metin olarak iletilir
          3. Z-Wave: Bilinen anahtar değişim açığı olan S0 güvenliği
             — S2 yükseltmesi önerilir
          4. MouseJack: 3 Logitech Unifying alıcısı tuş vuruşu
             enjeksiyonuna karşı savunmasız (CVE-2016-10761)
          5. WiFi: IoT cihazları kurumsal ağ ile aynı VLAN'da
             — ağ segmentasyonu yok
          Öncelikli düzeltme: MQTT TLS, Zigbee kurulum kodları,
          IoT VLAN izolasyonu, savunmasız Logitech alıcılarını değiştirin."
```

### Uyumluluk Denetimi

```
Siz: "Hastane WiFi'mızı HIPAA kablosuz gereksinimlerine karşı kontrol edin"

Ajan: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "HIPAA Kablosuz Uyumluluk Denetimi — 6 bulgu:
          3 UYUMSUZ kontrol:
          - 164.312(a)(1): Sahte AP tespiti için kablosuz IDS dağıtılmamış
          - 164.312(e)(1): Tıbbi cihazlar WPA2-PSK kullanıyor (Enterprise değil)
          - 164.312(e)(2): Kablosuz trafik şifreleme denetim kaydı yok
          3 UYUMLU kontrol:
          - 164.310(a)(1): AP fiziksel konumları belgelenmiş
          - 164.312(a)(2): RADIUS kimlik doğrulaması ile 802.1X
          - 164.312(d): Personel cihazları için sertifika tabanlı EAP-TLS
          Düzeltme planı: WIDS (Kismet/AirMagnet) dağıtın, tıbbi cihazları
          MAB ile WPA2-Enterprise'a taşıyın, WLAN denetleyicisinde
          kablosuz denetim kaydını etkinleştirin."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; API anahtarı gerekmez</b></summary>

| Araç | Açıklama |
|------|----------|
| `scan_wifi_networks` | WiFi ağlarını tara ve analiz et &mdash; SSID'leri, kanalları, şifreleme türlerini, sinyal gücünü ve güvenlik yapılandırma hatalarını keşfet |
| `analyze_wifi_security` | WiFi güvenlik yapılandırmasının derinlemesine analizi &mdash; şifreleme gücü, kimlik doğrulama yöntemi, bilinen zayıflıklar, saldırı yüzeyi |
| `find_wifi_attacks` | WiFi hedefi için uygulanabilir saldırıları bul &mdash; saldırı metodolojisi, gerekli araçlar, MITRE ATT&CK eşlemesi, hafifletmeler döndürür |
| `simulate_evil_twin` | Evil twin AP saldırı senaryolarını simüle et ve analiz et &mdash; hostapd-mana yapılandırması, captive portal, kimlik bilgisi yakalama metodolojisi |
| `analyze_deauth` | Deauthentication saldırı vektörlerini analiz et &mdash; 802.11w PMF durumu, deauth tespiti, karşı önlemler, WIDS entegrasyonu |
| `crack_wps` | WPS kırma saldırı vektörlerini analiz et &mdash; Pixie Dust, kaba kuvvet, null PIN, varsayılan PIN üretimi, Reaver/Bully metodolojisi |
| `analyze_pmkid` | PMKID tabanlı saldırı vektörlerini analiz et &mdash; hcxdumptool + hashcat mode 22000 ile istemcisiz WPA/WPA2 kırma |
| `audit_wifi67` | WiFi 6 (802.11ax) ve WiFi 7 (802.11be) özel güvenlik özelliklerini denetle &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; API anahtarı gerekmez</b></summary>

| Araç | Açıklama |
|------|----------|
| `scan_bluetooth` | Bluetooth cihazlarını tara ve analiz et &mdash; BR/EDR klasik ve BLE keşfi, servis numaralandırma, eşleştirme analizi |
| `find_bluetooth_attacks` | Uygulanabilir Bluetooth saldırılarını bul &mdash; BlueBorne, KNOB, BIAS, BLE relay, MITM, araçlar ve hafifletmelerle |
| `analyze_ble` | BLE güvenliğinin derinlemesine analizi &mdash; GATT servisleri, eşleştirme yöntemleri, LE Secure Connections, characteristic şifreleme |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; API anahtarı gerekmez</b></summary>

| Araç | Açıklama |
|------|----------|
| `analyze_rf_signal` | RF sinyal güvenliğini analiz et &mdash; frekans analizi, modülasyon tanımlama, replay saldırı uygulanabilirliği, SDR araç önerileri |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; API anahtarı gerekmez</b></summary>

| Araç | Açıklama |
|------|----------|
| `analyze_nfc_security` | NFC/RFID güvenliğini analiz et &mdash; kart türü tanımlama, erişim kontrolü zayıflıkları, klonlama uygulanabilirliği, Proxmark3 metodolojisi |

</details>

<details>
<summary><b>Hücresel/5G (1) &mdash; API anahtarı gerekmez</b></summary>

| Araç | Açıklama |
|------|----------|
| `analyze_cellular_security` | Hücresel ağ güvenliğini analiz et &mdash; 2G/3G/4G/5G protokol zayıflıkları, IMSI catcher tespiti, sahte baz istasyonu analizi |

</details>

<details>
<summary><b>IoT Kablosuz (3) &mdash; API anahtarı gerekmez</b></summary>

| Araç | Açıklama |
|------|----------|
| `analyze_zigbee` | Zigbee ağ güvenliğini analiz et &mdash; güven merkezi politikası, ağ anahtarı yönetimi, KillerBee saldırı metodolojisi |
| `scan_iot_wireless` | IoT kablosuz protokollerini tara &mdash; Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP keşfi ve güvenlik açığı analizi |
| `find_mousejack` | MouseJack kablosuz klavye/fare güvenlik açıklarını analiz et &mdash; tuş vuruşu enjeksiyonu, şifrelenmemiş HID, üreticiye özel bypass'lar |

</details>

<details>
<summary><b>Gelişmiş Kablosuz (6) &mdash; API anahtarı gerekmez</b></summary>

| Araç | Açıklama |
|------|----------|
| `analyze_airgap` | Air-gap sızma tekniklerini analiz et &mdash; elektromanyetik, akustik, termal, optik gizli kanallar ve karşı önlemler |
| `analyze_uwb` | Ultra-Wideband (UWB) güvenliğini analiz et &mdash; mesafe manipülasyonu, araç anahtarı ve AirTag relay saldırıları, mesafe dolandırıcılığı |
| `analyze_wifi_csi` | WiFi Channel State Information (CSI) güvenliğini analiz et &mdash; pasif algılama, aktivite tanıma, tuş vuruşu çıkarım riskleri |
| `analyze_miracast` | Miracast/WiFi Display güvenliğini analiz et &mdash; WFD oturum ele geçirme, ekran yakalama, yetkisiz ekran erişimi |
| `analyze_wifi_direct` | WiFi Direct (P2P) güvenliğini analiz et &mdash; grup sahibi müzakere saldırıları, P2P'de WPS açıkları, sahte grup oluşturma |
| `analyze_drone_rf` | Drone RF güvenliğini analiz et &mdash; kontrol bağlantısı ele geçirme, GPS sahteciliği, video downlink müdahalesi, counter-UAS teknikleri |

</details>

<details>
<summary><b>Altyapı (4) &mdash; API anahtarı gerekmez (canlı WIDS için KISMET_* isteğe bağlı)</b></summary>

| Araç | Açıklama |
|------|----------|
| `audit_wlan_controller` | WLAN denetleyici yapılandırmasını denetle &mdash; Cisco WLC, Aruba, Meraki güvenlik ayarları, sahte AP politikaları, RF yönetimi |
| `analyze_captive_portal` | Captive portal güvenliğini analiz et &mdash; bypass teknikleri, kimlik bilgisi toplama riskleri, ağ izolasyonu, misafir VLAN güvenliği |
| `detect_mac_randomization` | MAC adres randomizasyonunu analiz et &mdash; iOS/Android/Windows uygulama farklılıkları, takip direnci, fingerprinting bypass'ları |
| `analyze_hotspot20` | Hotspot 2.0 (Passpoint) güvenliğini analiz et &mdash; ANQP, OSU, otomatik ağ seçim riskleri, EAP yöntem analizi |

</details>

<details>
<summary><b>İstihbarat (4) &mdash; API anahtarı gerekmez</b></summary>

| Araç | Açıklama |
|------|----------|
| `lookup_wireless_cve` | Kablosuz özel CVE'leri ara &mdash; WiFi yonga seti güvenlik açıkları, Bluetooth stack CVE'leri, sürücü exploit'leri, firmware hataları |
| `lookup_hardware` | Kablosuz güvenlik donanımını ara &mdash; WiFi adaptörleri, Bluetooth sniffer'lar, SDR cihazları, yetenekler, yonga seti uyumluluğu |
| `map_wireless_attck` | Kablosuz saldırıları MITRE ATT&CK çerçevesine eşle &mdash; teknik ID'leri, taktik kategorileri, tespit stratejileri |
| `analyze_medical_wireless` | Tıbbi cihaz kablosuz güvenliğini analiz et &mdash; infüzyon pompaları, kalp pilleri, hasta monitörleri, FDA kılavuzu, HIPAA gereksinimleri |

</details>

<details>
<summary><b>Tespit (2) &mdash; API anahtarı gerekmez</b></summary>

| Araç | Açıklama |
|------|----------|
| `detect_wireless_attack` | Devam eden kablosuz saldırıları tespit et &mdash; deauth taşkınları, evil twin, KARMA, sahte AP, BLE sahteciliği, RF jamming göstergeleri |
| `audit_wireless_compliance` | Kablosuz ağı uyumluluk çerçevelerine karşı denetle &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, ISO 27001 kablosuz kontrolleri |

</details>

<details>
<summary><b>Raporlama (1) &mdash; API anahtarı gerekmez</b></summary>

| Araç | Açıklama |
|------|----------|
| `export_report` | Kablosuz güvenlik değerlendirme raporunu dışa aktar &mdash; bulgular, risk derecelendirmeleri, uyumluluk durumu, düzeltme yol haritası, yönetici özeti |

</details>

---

### CLI Usage

```bash
# Tüm mevcut araçları listele
npx wifi-security-mcp-server --list

# Herhangi bir aracı doğrudan çalıştır
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

Sunucu 9 yerleşik bilgi tabanıyla birlikte gelir &mdash; API anahtarı yok, harici bağımlılık yok, hız sınırı yok. Her araç sorgusu bu veritabanlarından yapılandırılmış istihbaratla zenginleştirilir.

| Bilgi Tabanı | Girişler | Ne sağlar |
|-------------|----------|-----------|
| **WiFi Saldırıları** | 47 saldırı | WPA/WPA2/WPA3 saldırı teknikleri, evil twin varyantları, PMKID, KRACK, FragAttacks, deauth, WPS exploit'leri &mdash; her biri araçlar, hafifletmeler, MITRE ATT&CK eşlemesi ile |
| **Bluetooth Saldırıları** | 8 saldırı | BlueBorne, KNOB, BIAS, BLE relay, MITM, BLE fuzzing, Bluetooth taklidi &mdash; CVE'ler ve tespit stratejileri ile |
| **RF/SDR Saldırıları** | 6 saldırı | Replay saldırıları, jamming, sinyal enjeksiyonu, SDR tabanlı müdahale, RF fingerprinting bypass, spektrum analiz teknikleri |
| **NFC/RFID Saldırıları** | 6 saldırı | Kart klonlama, relay saldırıları, MIFARE Classic kırma, NFC skimming, RFID fuzzing, Proxmark3 ile erişim kontrolü bypass |
| **Hücresel Saldırılar** | 6 saldırı | IMSI yakalama, sahte baz istasyonu (Stingray), SS7 istismarı, 5G NAS güvenlik açıkları, downgrade saldırıları, VoLTE müdahalesi |
| **IoT Saldırıları** | 6 saldırı | Zigbee ağ anahtarı sniffing, Z-Wave S0 downgrade, MQTT kimlik bilgisi toplama, LoRaWAN ABP replay, MouseJack, BLE IoT relay |
| **Donanım Veritabanı** | 12 cihaz | WiFi adaptörleri (Alfa, TP-Link), Bluetooth sniffer'lar (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; yonga setleri, yetenekler, monitor modu desteği |
| **CVE Veritabanı** | 17 CVE | WiFi yonga setleri (Broadcom, Qualcomm, Intel), Bluetooth stack'leri, IoT firmware'i için kablosuz özel CVE'ler &mdash; şiddet, etkilenen sürümler, exploit mevcudiyeti |
| **Uyumluluk Çerçeveleri** | 5 çerçeve | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; kablosuz özel kontroller, denetim kontrol listeleri, boşluk analizi |

---

## Architecture

```
src/
  index.ts                    # CLI giriş noktası (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # MCP sunucu kurulumu (stdio transport)
    tools.ts                  # Araç kayıt defteri — 34 bileşik aracın tamamı burada birleştirilir
  types/
    index.ts                  # Paylaşılan türler (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 yerleşik bilgi tabanı
    wifi-attacks.ts           # 47 WiFi saldırı tanımı
    bluetooth-attacks.ts      # 8 Bluetooth saldırı tanımı
    rf-attacks.ts             # 6 RF/SDR saldırı tanımı
    nfc-attacks.ts            # 6 NFC/RFID saldırı tanımı
    cellular-attacks.ts       # 6 Hücresel/5G saldırı tanımı
    iot-attacks.ts            # 6 IoT saldırı tanımı
    hardware.ts               # 12 donanım cihaz profili
    cve-database.ts           # 17 kablosuz CVE
    compliance.ts             # 5 uyumluluk çerçevesi
  wifi/                       # WiFi Core araçları (8)
  bluetooth/                  # Bluetooth araçları (3)
  rf/                         # RF/SDR araçları (1)
  nfc/                        # NFC/RFID araçları (1)
  cellular/                   # Hücresel/5G araçları (1)
  iot/                        # IoT Kablosuz araçları (3)
  advanced/                   # Gelişmiş Kablosuz araçları (6)
  infrastructure/             # Altyapı araçları (4)
  intelligence/               # İstihbarat araçları (4)
  detection/                  # Tespit araçları (2)
  reporting/                  # Raporlama araçları (1)
```

**Tasarım kararları:**

- **Bilgi tabanı odaklı** &mdash; API'ye bağımlı araçların aksine, temel işlevsellik 9 yerleşik veritabanından tamamen çevrimdışı çalışır. Ana iş akışı için API anahtarı yok, hız sınırı yok, harici bağımlılık yok.
- **34 bileşik araç, 139 bireysel yetenek** &mdash; Her araç, ilgili analizleri birleştiren bir bileşiktir. `find_wifi_attacks` sadece saldırıları listelemez &mdash; metodoloji, gerekli donanım, MITRE ATT&CK eşlemesi, tespit stratejileri ve karşı önlemler döndürür.
- **2 çalışma zamanı bağımlılığı** &mdash; `@modelcontextprotocol/sdk` ve `zod`. Başka bir şey yok. Yerli modül yok, ikili bağımlılık yok, platforma özel kod yok.
- **İsteğe bağlı canlı entegrasyon** &mdash; Gerçek dünya ağ verileri için WiGLE API, canlı kablosuz IDS için Kismet. Temel analiz her ikisi olmadan da çalışır.
- **Uyumluluk farkındalığı** &mdash; Her bulgu, uygulanabilir olduğunda ilgili uyumluluk çerçevelerine (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) otomatik olarak eşlenir.
- **MITRE ATT&CK eşlemeli** &mdash; Saldırı teknikleri, SOC entegrasyonu için ATT&CK teknik ID'lerini, taktik kategorilerini ve tespit veri kaynaklarını içerir.

---

## Limitations

- Bilgi tabanları belirli bir zamandaki anlık görüntülerdir &mdash; yeni saldırılar/CVE'ler paket güncellemesi gerektirir
- WiGLE entegrasyonu, ağ aramaları için ücretsiz bir API anahtarı gerektirir
- Kismet canlı WIDS, API erişimli çalışan bir Kismet örneği gerektirir
- Aktif kablosuz iletim yok &mdash; sunucu istihbarat ve metodoloji sağlar, paket enjeksiyonu değil
- Donanım veritabanı en yaygın güvenlik araştırma cihazlarını kapsar, kapsamlı değildir
- Uyumluluk çerçeveleri kablosuz özel kontrollere odaklanır, tam çerçeve kapsamı değil
- macOS / Linux test edildi (Windows test edilmedi)

---

## Part of the MCP Security Suite

| Proje | Alan | Araçlar |
|-------|------|---------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Tarayıcı tabanlı güvenlik testi | 39 araç, Firefox, enjeksiyon testi |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Bulut güvenliği (AWS/Azure/GCP) | 38 araç, 60+ kontrol |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub güvenlik durumu | 39 araç, 45 kontrol |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Güvenlik açığı istihbaratı | 23 araç, 5 kaynak |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT ve keşif | 37 araç, 12 kaynak |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark web ve tehdit istihbaratı | 66 araç, 16 kaynak |
| **wifi-security-mcp-server** | **Kablosuz güvenlik istihbaratı** | **34 araç, 9 bilgi tabanı** |

---

<p align="center">
<b>Yalnızca yetkili güvenlik testi ve değerlendirme içindir.</b><br>
Herhangi bir ağ veya cihaz üzerinde kablosuz güvenlik testi gerçekleştirmeden önce her zaman uygun yetkiye sahip olduğunuzdan emin olun.<br>
Yetkisiz kablosuz ağ erişimi veya müdahale çoğu yargı alanında yasadışıdır.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <strong>Español</strong> |
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

<h3 align="center">Inteligencia de seguridad inalámbrica para agentes de IA.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Celular/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drones RF, WIDS/WIPS, Cumplimiento &mdash; unificado en un solo servidor MCP.<br>
  Tu agente de IA obtiene <b>análisis de seguridad inalámbrica de espectro completo bajo demanda</b>, impulsado por 9 bases de conocimiento integradas que cubren 139 herramientas individuales.
</p>

<br>

<p align="center">
  <a href="#the-problem">El Problema</a> &bull;
  <a href="#how-its-different">En qué se Diferencia</a> &bull;
  <a href="#quick-start">Inicio Rápido</a> &bull;
  <a href="#what-the-ai-can-do">Qué Puede Hacer la IA</a> &bull;
  <a href="#tools-reference-34-composite-tools">Herramientas (34)</a> &bull;
  <a href="#knowledge-bases-9">Bases de Conocimiento</a> &bull;
  <a href="#architecture">Arquitectura</a> &bull;
  <a href="CHANGELOG.md">Changelog</a> &bull;
  <a href="CONTRIBUTING.md">Contribuir</a>
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

La evaluación de seguridad inalámbrica es una de las disciplinas más fragmentadas en seguridad ofensiva. La auditoría WiFi requiere un conjunto de herramientas, Bluetooth otro, RF/SDR un tercero, protocolos IoT otro más &mdash; y cada dominio tiene su propia superficie de ataque, sus propias vulnerabilidades, sus propios requisitos de cumplimiento. Hoy ejecutas aircrack-ng para WPA, usas Bettercap para BLE, inicias HackRF para SDR, consultas diferentes bases de datos CVE para cada chipset, referencias NIST y PCI-DSS por separado, y luego pasas horas correlacionando manualmente los hallazgos en una evaluación coherente.

```
Flujo de trabajo tradicional de seguridad inalámbrica:
  auditar redes WiFi               ->  aircrack-ng / Wireshark / Kismet
  probar seguridad Bluetooth        ->  Bettercap / btlejack / Ubertooth
  analizar señales RF               ->  HackRF / GNU Radio / GQRX
  verificar NFC/RFID                ->  Proxmark3 / libnfc
  evaluar seguridad celular         ->  srsRAN / OpenBTS
  probar protocolos IoT             ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  buscar CVEs inalámbricos          ->  NVD / vendor advisories (búsqueda manual)
  verificar cumplimiento            ->  NIST / PCI-DSS / HIPAA docs (manual)
  mapear a MITRE ATT&CK             ->  ATT&CK Navigator (mapeo manual)
  correlacionar todo                ->  copiar-pegar en un informe
  ────────────────────────────────
  Total: horas por evaluación, la mayor parte cambiando contexto entre herramientas
```

**wifi-security-mcp-server** proporciona a tu agente de IA 34 herramientas compuestas respaldadas por 9 bases de conocimiento que cubren 139 capacidades individuales a través del [Model Context Protocol](https://modelcontextprotocol.io). El agente analiza redes, identifica vulnerabilidades, mapea ataques a MITRE ATT&CK, verifica cumplimiento y genera informes accionables &mdash; en una sola conversación.

```
Con wifi-security-mcp-server:
  Tú: "Audita la seguridad inalámbrica de nuestra red de oficina con WPA2-Enterprise"

  Agente: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "Tu red WPA2-Enterprise tiene 3 hallazgos críticos:
            1. EAP-PEAP sin fijación de certificados — vulnerable a evil twin
               con hostapd-mana (MITRE T1557.002)
            2. Sin 802.11w (PMF) — susceptible a ataques de desautenticación
               (MITRE T1498.001)
            3. Hash PMKID extraíble sin interacción del cliente — cracking
               offline posible con hashcat modo 22000
            PCI-DSS 4.0: 2 controles no conformes (4.2.1, 11.2.1).
            Recomendado: migrar a WPA3-Enterprise con SAE, habilitar PMF,
            desplegar WIDS para detección de AP rogue."
```

---

## How It's Different

Las herramientas existentes te dan capturas de paquetes en bruto y análisis específicos de protocolo. wifi-security-mcp-server da a tu agente de IA la capacidad de **razonar simultáneamente en todos los dominios inalámbricos** con respaldo profundo de bases de conocimiento.

<table>
<thead>
<tr>
<th></th>
<th>Enfoque Tradicional</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Interfaz</b></td>
<td>10+ CLIs, GUIs y herramientas de hardware diferentes</td>
<td>MCP &mdash; el agente de IA llama herramientas conversacionalmente</td>
</tr>
<tr>
<td><b>Cobertura</b></td>
<td>Un protocolo a la vez</td>
<td>WiFi, Bluetooth, RF, NFC, Celular, IoT &mdash; todo en un servidor</td>
</tr>
<tr>
<td><b>Conocimiento</b></td>
<td>Búsqueda manual de CVE, mapeo manual de ATT&CK</td>
<td>9 bases de conocimiento integradas con 139 elementos premapeados</td>
</tr>
<tr>
<td><b>Intel. de ataques</b></td>
<td>Búsqueda en Google + blogs + charlas de conferencias</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Celular + 6 IoT ataques catalogados con herramientas, mitigaciones, IDs ATT&CK</td>
</tr>
<tr>
<td><b>Cumplimiento</b></td>
<td>Leer PDFs NIST/PCI-DSS/HIPAA, mapear controles manualmente</td>
<td>El agente verifica automáticamente contra 5 marcos de cumplimiento</td>
</tr>
<tr>
<td><b>Claves API</b></td>
<td>Varias cuentas para diferentes servicios</td>
<td>Cero claves API para funcionalidad core &mdash; impulsado por bases de conocimiento</td>
</tr>
<tr>
<td><b>Configuración</b></td>
<td>Instalar aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; un comando, cero configuración</td>
</tr>
</tbody>
</table>

---

## Quick Start

### Opción 1: npx (sin instalación)

```bash
npx wifi-security-mcp-server
```

Las 34 herramientas funcionan inmediatamente. No se requieren claves API &mdash; la funcionalidad core está impulsada por bases de conocimiento.

### Opción 2: Clonar

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Variables de entorno (opcional)

```bash
# WiGLE — base de datos wardriving para consultas de redes WiFi del mundo real
export WIGLE_API_KEY=your-key

# Kismet — detección de intrusiones inalámbricas en vivo
export KISMET_HOST=127.0.0.1      # Por defecto: 127.0.0.1
export KISMET_PORT=2501           # Por defecto: 2501
export KISMET_API_KEY=your-key
```

Todas las claves API son opcionales. Sin ellas, aún tienes acceso completo a las 34 herramientas impulsadas por 9 bases de conocimiento integradas que cubren ataques WiFi, ataques Bluetooth, RF/SDR, NFC/RFID, celular, IoT, base de datos de hardware, inteligencia CVE y marcos de cumplimiento.

### Conectar a tu agente de IA

<details open>
<summary><b>Claude Code</b></summary>

```bash
# Con npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# Con clon local
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Agregar a `~/Library/Application Support/Claude/claude_desktop_config.json`:

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
<summary><b>Cursor / Windsurf / otros clientes MCP</b></summary>

Mismo formato de configuración JSON. Apunta el comando a `npx wifi-security-mcp-server` o tu ruta de instalación local.

</details>

### Comenzar a consultar

```
Tú: "¿Qué ataques son posibles contra una red WPA3-SAE y cómo los pruebo?"
```

Eso es todo. El agente busca ataques, los mapea a MITRE ATT&CK, recomienda herramientas y proporciona metodología paso a paso &mdash; todo desde bases de conocimiento integradas.

---

## What The AI Can Do

### Evaluación de Seguridad WiFi

```
Tú: "Analiza la seguridad de una red WPA2-PSK con WPS habilitado"

Agente: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "Vulnerabilidades críticas encontradas en configuración WPA2-PSK + WPS:
          1. Ataque WPS Pixie Dust — PIN recuperable en segundos mediante
             fuerza bruta offline de nonces E-S1/E-S2 (Reaver + PixieWPS).
             Recuperación completa de PSK sin interacción del cliente.
          2. Ataque PMKID — el primer paquete del 4-way handshake contiene
             hash PMKID, crackeable offline con hashcat -m 22000.
             Sin deauth necesario, sin cliente necesario.
          3. Captura de 4-Way Handshake — frames EAPOL capturables con
             airodump-ng + deauth, luego ataque de diccionario offline.
          Prioridad: Deshabilitar WPS inmediatamente (mayor riesgo), forzar
          PSK fuerte de 20+ caracteres, considerar migración a WPA3-SAE."
```

### Análisis de Bluetooth & BLE

```
Tú: "¿Cuáles son los riesgos de seguridad de nuestro sistema de control de acceso basado en BLE?"

Agente: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "Sistema de control de acceso BLE — 4 riesgos críticos identificados:
          1. Emparejamiento JustWorks — sin protección MITM. El atacante puede
             interceptar emparejamiento con Ubertooth One (MITRE T1040).
          2. Sniffing de características GATT — comandos de desbloqueo enviados en
             texto plano, reproducibles con gatttool (MITRE T1212).
          3. Ataque de relay/replay BLE — retransmitir señal legítima de desbloqueo
             usando dos dispositivos + btlejack (MITRE T1557).
          4. Rastreo de dirección MAC — MAC BLE estática permite
             rastreo de ocupantes (MITRE T1592.002).
          Recomendado: forzar LE Secure Connections (LESC) con
          comparación numérica, cifrar características GATT, implementar
          nonces rotativos para protección contra replay."
```

### Auditoría Inalámbrica IoT

```
Tú: "Evalúa la seguridad inalámbrica de nuestro despliegue IoT de edificio inteligente"

Agente: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "Evaluación inalámbrica IoT de edificio inteligente — 5 hallazgos:
          1. Zigbee: Clave de enlace del centro de confianza predeterminada
             (ZigBeeAlliance09) permite interceptar unión a red con KillerBee (CRÍTICO)
          2. MQTT: Broker en puerto 1883 sin TLS — credenciales y datos de
             sensores transmitidos en texto plano
          3. Z-Wave: Seguridad S0 con vulnerabilidad conocida de intercambio
             de claves — se recomienda actualización a S2
          4. MouseJack: 3 receptores Logitech Unifying vulnerables a
             inyección de pulsaciones de teclas (CVE-2016-10761)
          5. WiFi: Dispositivos IoT en la misma VLAN que la corporativa —
             sin segmentación de red
          Remediación prioritaria: MQTT TLS, códigos de instalación Zigbee,
          aislamiento IoT VLAN, reemplazar receptores Logitech vulnerables."
```

### Auditoría de Cumplimiento

```
Tú: "Verifica nuestro WiFi hospitalario contra los requisitos inalámbricos de HIPAA"

Agente: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "Auditoría de Cumplimiento Inalámbrico HIPAA — 6 hallazgos:
          3 controles NO CONFORMES:
          - 164.312(a)(1): No hay IDS inalámbrico desplegado para detección de AP rogue
          - 164.312(e)(1): Dispositivos médicos usando WPA2-PSK (no Enterprise)
          - 164.312(e)(2): No hay registro de auditoría de cifrado de tráfico inalámbrico
          3 controles CONFORMES:
          - 164.310(a)(1): Ubicaciones físicas de AP documentadas
          - 164.312(a)(2): 802.1X con autenticación RADIUS
          - 164.312(d): EAP-TLS basado en certificados para dispositivos del personal
          Plan de remediación: desplegar WIDS (Kismet/AirMagnet), migrar
          dispositivos médicos a WPA2-Enterprise con MAB, habilitar registro
          de auditoría inalámbrica en controlador WLAN."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; Sin clave API</b></summary>

| Herramienta | Descripción |
|-------------|-------------|
| `scan_wifi_networks` | Escanear y analizar redes WiFi &mdash; descubrir SSIDs, canales, tipos de cifrado, intensidad de señal y configuraciones de seguridad incorrectas |
| `analyze_wifi_security` | Análisis profundo de configuración de seguridad WiFi &mdash; fortaleza del cifrado, método de autenticación, debilidades conocidas, superficie de ataque |
| `find_wifi_attacks` | Encontrar ataques aplicables para un objetivo WiFi &mdash; devuelve metodología de ataque, herramientas necesarias, mapeo MITRE ATT&CK, mitigaciones |
| `simulate_evil_twin` | Simular y analizar escenarios de ataque evil twin AP &mdash; configuración hostapd-mana, portal cautivo, metodología de captura de credenciales |
| `analyze_deauth` | Analizar vectores de ataque de desautenticación &mdash; estado 802.11w PMF, detección de deauth, contramedidas, integración WIDS |
| `crack_wps` | Analizar vectores de ataque de cracking WPS &mdash; Pixie Dust, fuerza bruta, PIN nulo, generación de PIN predeterminado, metodología Reaver/Bully |
| `analyze_pmkid` | Analizar vectores de ataque basados en PMKID &mdash; cracking WPA/WPA2 sin cliente via hcxdumptool + hashcat modo 22000 |
| `audit_wifi67` | Auditar características de seguridad específicas de WiFi 6 (802.11ax) y WiFi 7 (802.11be) &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; Sin clave API</b></summary>

| Herramienta | Descripción |
|-------------|-------------|
| `scan_bluetooth` | Escanear y analizar dispositivos Bluetooth &mdash; descubrimiento BR/EDR clásico y BLE, enumeración de servicios, análisis de emparejamiento |
| `find_bluetooth_attacks` | Encontrar ataques Bluetooth aplicables &mdash; BlueBorne, KNOB, BIAS, relay BLE, MITM, con herramientas y mitigaciones |
| `analyze_ble` | Análisis profundo de seguridad BLE &mdash; servicios GATT, métodos de emparejamiento, LE Secure Connections, cifrado de características |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; Sin clave API</b></summary>

| Herramienta | Descripción |
|-------------|-------------|
| `analyze_rf_signal` | Analizar seguridad de señal RF &mdash; análisis de frecuencia, identificación de modulación, viabilidad de ataque replay, recomendaciones de herramientas SDR |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; Sin clave API</b></summary>

| Herramienta | Descripción |
|-------------|-------------|
| `analyze_nfc_security` | Analizar seguridad NFC/RFID &mdash; identificación de tipo de tarjeta, debilidades de control de acceso, viabilidad de clonación, metodología Proxmark3 |

</details>

<details>
<summary><b>Celular/5G (1) &mdash; Sin clave API</b></summary>

| Herramienta | Descripción |
|-------------|-------------|
| `analyze_cellular_security` | Analizar seguridad de red celular &mdash; debilidades de protocolo 2G/3G/4G/5G, detección de IMSI catcher, análisis de estación base falsa |

</details>

<details>
<summary><b>IoT Inalámbrico (3) &mdash; Sin clave API</b></summary>

| Herramienta | Descripción |
|-------------|-------------|
| `analyze_zigbee` | Analizar seguridad de red Zigbee &mdash; política de centro de confianza, gestión de claves de red, metodología de ataque KillerBee |
| `scan_iot_wireless` | Escanear protocolos inalámbricos IoT &mdash; descubrimiento y análisis de vulnerabilidades Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP |
| `find_mousejack` | Analizar vulnerabilidades MouseJack de teclado/ratón inalámbrico &mdash; inyección de pulsaciones, HID sin cifrar, bypasses específicos de proveedor |

</details>

<details>
<summary><b>Inalámbrico Avanzado (6) &mdash; Sin clave API</b></summary>

| Herramienta | Descripción |
|-------------|-------------|
| `analyze_airgap` | Analizar técnicas de exfiltración air-gap &mdash; canales encubiertos electromagnéticos, acústicos, térmicos, ópticos y contramedidas |
| `analyze_uwb` | Analizar seguridad Ultra-Wideband (UWB) &mdash; manipulación de ranging, ataques relay a llaveros de coche y AirTags, fraude de distancia |
| `analyze_wifi_csi` | Analizar seguridad de WiFi Channel State Information (CSI) &mdash; detección pasiva, reconocimiento de actividad, riesgos de inferencia de pulsaciones |
| `analyze_miracast` | Analizar seguridad Miracast/WiFi Display &mdash; secuestro de sesión WFD, captura de pantalla, acceso no autorizado a display |
| `analyze_wifi_direct` | Analizar seguridad WiFi Direct (P2P) &mdash; ataques de negociación de propietario de grupo, vulnerabilidades WPS en P2P, formación de grupo rogue |
| `analyze_drone_rf` | Analizar seguridad RF de drones &mdash; secuestro de enlace de control, spoofing GPS, intercepción de downlink de video, técnicas counter-UAS |

</details>

<details>
<summary><b>Infraestructura (4) &mdash; Sin clave API (KISMET_* opcional para WIDS en vivo)</b></summary>

| Herramienta | Descripción |
|-------------|-------------|
| `audit_wlan_controller` | Auditar configuración de controlador WLAN &mdash; configuración de seguridad Cisco WLC, Aruba, Meraki, políticas de AP rogue, gestión RF |
| `analyze_captive_portal` | Analizar seguridad de portal cautivo &mdash; técnicas de bypass, riesgos de recolección de credenciales, aislamiento de red, seguridad VLAN de invitados |
| `detect_mac_randomization` | Analizar aleatorización de dirección MAC &mdash; diferencias de implementación iOS/Android/Windows, resistencia al rastreo, bypasses de fingerprinting |
| `analyze_hotspot20` | Analizar seguridad Hotspot 2.0 (Passpoint) &mdash; ANQP, OSU, riesgos de selección automática de red, análisis de método EAP |

</details>

<details>
<summary><b>Inteligencia (4) &mdash; Sin clave API</b></summary>

| Herramienta | Descripción |
|-------------|-------------|
| `lookup_wireless_cve` | Buscar CVEs específicos inalámbricos &mdash; vulnerabilidades de chipset WiFi, CVEs de stack Bluetooth, exploits de driver, bugs de firmware |
| `lookup_hardware` | Buscar hardware de seguridad inalámbrica &mdash; adaptadores WiFi, sniffers Bluetooth, dispositivos SDR, capacidades, compatibilidad de chipset |
| `map_wireless_attck` | Mapear ataques inalámbricos al framework MITRE ATT&CK &mdash; IDs de técnica, categorías de táctica, estrategias de detección |
| `analyze_medical_wireless` | Analizar seguridad inalámbrica de dispositivos médicos &mdash; bombas de infusión, marcapasos, monitores de pacientes, guía FDA, requisitos HIPAA |

</details>

<details>
<summary><b>Detección (2) &mdash; Sin clave API</b></summary>

| Herramienta | Descripción |
|-------------|-------------|
| `detect_wireless_attack` | Detectar ataques inalámbricos en progreso &mdash; inundaciones deauth, evil twin, KARMA, AP rogue, spoofing BLE, indicadores de jamming RF |
| `audit_wireless_compliance` | Auditar red inalámbrica contra marcos de cumplimiento &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, controles inalámbricos ISO 27001 |

</details>

<details>
<summary><b>Informes (1) &mdash; Sin clave API</b></summary>

| Herramienta | Descripción |
|-------------|-------------|
| `export_report` | Exportar informe de evaluación de seguridad inalámbrica &mdash; hallazgos, calificaciones de riesgo, estado de cumplimiento, hoja de ruta de remediación, resumen ejecutivo |

</details>

---

### CLI Usage

```bash
# Listar todas las herramientas disponibles
npx wifi-security-mcp-server --list

# Ejecutar cualquier herramienta directamente
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

El servidor incluye 9 bases de conocimiento integradas &mdash; sin claves API, sin dependencias externas, sin límites de tasa. Cada consulta de herramienta se enriquece con inteligencia estructurada de estas bases de datos.

| Base de Conocimiento | Entradas | Qué proporciona |
|---------------------|----------|-----------------|
| **Ataques WiFi** | 47 ataques | Técnicas de ataque WPA/WPA2/WPA3, variantes evil twin, PMKID, KRACK, FragAttacks, deauth, exploits WPS &mdash; cada uno con herramientas, mitigaciones, mapeo MITRE ATT&CK |
| **Ataques Bluetooth** | 8 ataques | BlueBorne, KNOB, BIAS, relay BLE, MITM, fuzzing BLE, suplantación Bluetooth &mdash; con CVEs y estrategias de detección |
| **Ataques RF/SDR** | 6 ataques | Ataques replay, jamming, inyección de señal, intercepción basada en SDR, bypass de fingerprinting RF, técnicas de análisis de espectro |
| **Ataques NFC/RFID** | 6 ataques | Clonación de tarjetas, ataques relay, cracking MIFARE Classic, skimming NFC, fuzzing RFID, bypass de control de acceso con Proxmark3 |
| **Ataques Celulares** | 6 ataques | Captura IMSI, estación base falsa (Stingray), explotación SS7, vulnerabilidades 5G NAS, ataques downgrade, intercepción VoLTE |
| **Ataques IoT** | 6 ataques | Sniffing de clave de red Zigbee, downgrade Z-Wave S0, recolección de credenciales MQTT, replay LoRaWAN ABP, MouseJack, relay BLE IoT |
| **Base de Datos de Hardware** | 12 dispositivos | Adaptadores WiFi (Alfa, TP-Link), sniffers Bluetooth (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; chipsets, capacidades, soporte modo monitor |
| **Base de Datos CVE** | 17 CVEs | CVEs específicos inalámbricos para chipsets WiFi (Broadcom, Qualcomm, Intel), stacks Bluetooth, firmware IoT &mdash; severidad, versiones afectadas, disponibilidad de exploit |
| **Marcos de Cumplimiento** | 5 marcos | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; controles específicos inalámbricos, listas de verificación de auditoría, análisis de brechas |

---

## Architecture

```
src/
  index.ts                    # Punto de entrada CLI (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # Configuración del servidor MCP (stdio transport)
    tools.ts                  # Registro de herramientas — las 34 herramientas compuestas ensambladas aquí
  types/
    index.ts                  # Tipos compartidos (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 bases de conocimiento integradas
    wifi-attacks.ts           # 47 definiciones de ataques WiFi
    bluetooth-attacks.ts      # 8 definiciones de ataques Bluetooth
    rf-attacks.ts             # 6 definiciones de ataques RF/SDR
    nfc-attacks.ts            # 6 definiciones de ataques NFC/RFID
    cellular-attacks.ts       # 6 definiciones de ataques Celular/5G
    iot-attacks.ts            # 6 definiciones de ataques IoT
    hardware.ts               # 12 perfiles de dispositivos de hardware
    cve-database.ts           # 17 CVEs inalámbricos
    compliance.ts             # 5 marcos de cumplimiento
  wifi/                       # Herramientas WiFi Core (8)
  bluetooth/                  # Herramientas Bluetooth (3)
  rf/                         # Herramientas RF/SDR (1)
  nfc/                        # Herramientas NFC/RFID (1)
  cellular/                   # Herramientas Celular/5G (1)
  iot/                        # Herramientas IoT Inalámbrico (3)
  advanced/                   # Herramientas Inalámbrico Avanzado (6)
  infrastructure/             # Herramientas Infraestructura (4)
  intelligence/               # Herramientas Inteligencia (4)
  detection/                  # Herramientas Detección (2)
  reporting/                  # Herramientas Informes (1)
```

**Decisiones de diseño:**

- **Impulsado por bases de conocimiento** &mdash; A diferencia de las herramientas dependientes de API, la funcionalidad core se ejecuta completamente offline desde 9 bases de datos integradas. Sin claves API, sin límites de tasa, sin dependencias externas para el flujo de trabajo principal.
- **34 herramientas compuestas, 139 capacidades individuales** &mdash; Cada herramienta es un compuesto que agrupa análisis relacionados. `find_wifi_attacks` no solo lista ataques &mdash; devuelve metodología, hardware necesario, mapeo MITRE ATT&CK, estrategias de detección y contramedidas.
- **2 dependencias de runtime** &mdash; `@modelcontextprotocol/sdk` y `zod`. Nada más. Sin módulos nativos, sin dependencias binarias, sin código específico de plataforma.
- **Integración en vivo opcional** &mdash; API WiGLE para datos de redes del mundo real, Kismet para IDS inalámbrico en vivo. El análisis core funciona sin ninguno de los dos.
- **Consciente del cumplimiento** &mdash; Cada hallazgo se mapea automáticamente a marcos de cumplimiento relevantes (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) cuando corresponde.
- **Mapeado a MITRE ATT&CK** &mdash; Las técnicas de ataque incluyen IDs de técnica ATT&CK, categorías de táctica y fuentes de datos de detección para integración SOC.

---

## Limitations

- Las bases de conocimiento son instantáneas en el tiempo &mdash; nuevos ataques/CVEs requieren actualizaciones del paquete
- La integración WiGLE requiere una clave API gratuita para consultas de red
- WIDS en vivo de Kismet requiere una instancia de Kismet en ejecución con acceso API
- Sin transmisión inalámbrica activa &mdash; el servidor proporciona inteligencia y metodología, no inyección de paquetes
- La base de datos de hardware cubre los dispositivos de investigación de seguridad más comunes, no es exhaustiva
- Los marcos de cumplimiento se centran en controles específicos inalámbricos, no en cobertura completa del marco
- macOS / Linux probado (Windows no probado)

---

## Part of the MCP Security Suite

| Proyecto | Dominio | Herramientas |
|----------|---------|--------------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Pruebas de seguridad basadas en navegador | 39 herramientas, Firefox, pruebas de inyección |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Seguridad cloud (AWS/Azure/GCP) | 38 herramientas, 60+ verificaciones |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | Postura de seguridad GitHub | 39 herramientas, 45 verificaciones |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Inteligencia de vulnerabilidades | 23 herramientas, 5 fuentes |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT y reconocimiento | 37 herramientas, 12 fuentes |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark web e inteligencia de amenazas | 66 herramientas, 16 fuentes |
| **wifi-security-mcp-server** | **Inteligencia de seguridad inalámbrica** | **34 herramientas, 9 bases de conocimiento** |

---

<p align="center">
<b>Solo para pruebas y evaluaciones de seguridad autorizadas.</b><br>
Asegúrate siempre de tener la autorización adecuada antes de realizar pruebas de seguridad inalámbrica en cualquier red o dispositivo.<br>
El acceso no autorizado a redes inalámbricas o la interferencia es ilegal en la mayoría de las jurisdicciones.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

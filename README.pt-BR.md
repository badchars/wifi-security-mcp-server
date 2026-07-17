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
  <strong>Português (Brasil)</strong> |
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

<h3 align="center">Inteligencia de seguranca sem fio para agentes de IA.</h3>

<p align="center">
  WiFi (WPA/WPA2/WPA3), Bluetooth (BR/EDR, BLE), RF/SDR, NFC/RFID, Celular/5G, IoT (Zigbee, Z-Wave, MQTT, LoRaWAN), MouseJack, Air-Gap, UWB, WiFi CSI, Miracast, WiFi Direct, Drone RF, WIDS/WIPS, Conformidade &mdash; unificados em um unico servidor MCP.<br>
  Seu agente de IA obtem <b>analise de seguranca sem fio de espectro completo sob demanda</b>, alimentada por 9 bases de conhecimento integradas cobrindo 139 ferramentas individuais.
</p>

<br>

<p align="center">
  <a href="#the-problem">O Problema</a> &bull;
  <a href="#how-its-different">Como e Diferente</a> &bull;
  <a href="#quick-start">Inicio Rapido</a> &bull;
  <a href="#what-the-ai-can-do">O que a IA Pode Fazer</a> &bull;
  <a href="#tools-reference-34-composite-tools">Ferramentas (34)</a> &bull;
  <a href="#knowledge-bases-9">Bases de Conhecimento</a> &bull;
  <a href="#architecture">Arquitetura</a> &bull;
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

A avaliacao de seguranca sem fio e uma das disciplinas mais fragmentadas em seguranca ofensiva. A auditoria WiFi requer um conjunto de ferramentas, Bluetooth outro, RF/SDR um terceiro, protocolos IoT ainda outro &mdash; e cada dominio tem sua propria superficie de ataque, suas proprias vulnerabilidades, seus proprios requisitos de conformidade. Hoje voce executa o aircrack-ng para WPA, usa o Bettercap para BLE, inicia o HackRF para SDR, consulta diferentes bases de dados CVE para cada chipset, referencia NIST e PCI-DSS separadamente, e depois passa horas correlacionando manualmente as descobertas em uma avaliacao coerente.

```
Fluxo de trabalho tradicional de seguranca sem fio:
  auditar redes WiFi                ->  aircrack-ng / Wireshark / Kismet
  testar seguranca Bluetooth        ->  Bettercap / btlejack / Ubertooth
  analisar sinais RF                ->  HackRF / GNU Radio / GQRX
  verificar NFC/RFID                ->  Proxmark3 / libnfc
  avaliar seguranca celular         ->  srsRAN / OpenBTS
  testar protocolos IoT             ->  Zigbee sniffer / Z-Wave tools / MQTT clients
  buscar CVEs sem fio               ->  NVD / vendor advisories (busca manual)
  verificar conformidade            ->  NIST / PCI-DSS / HIPAA docs (manual)
  mapear para MITRE ATT&CK          ->  ATT&CK Navigator (mapeamento manual)
  correlacionar tudo                ->  copiar e colar em um relatorio
  ────────────────────────────────
  Total: horas por avaliacao, a maior parte trocando de contexto entre ferramentas
```

**wifi-security-mcp-server** fornece ao seu agente de IA 34 ferramentas compostas apoiadas por 9 bases de conhecimento cobrindo 139 capacidades individuais via o [Model Context Protocol](https://modelcontextprotocol.io). O agente analisa redes, identifica vulnerabilidades, mapeia ataques para o MITRE ATT&CK, verifica conformidade e gera relatorios acionaveis &mdash; em uma unica conversa.

```
Com wifi-security-mcp-server:
  Voce: "Audite a seguranca sem fio da nossa rede do escritorio rodando WPA2-Enterprise"

  Agente: -> scan_wifi_networks {encryption: "WPA2"}
         -> analyze_wifi_security {encryption: "WPA2-Enterprise", authentication: "EAP-PEAP"}
         -> find_wifi_attacks {target_type: "WPA2-Enterprise"}
         -> detect_wireless_attack {attack_indicators: "deauth frames"}
         -> audit_wireless_compliance {standard: "PCI-DSS", network_type: "WPA2-Enterprise"}
         -> "Sua rede WPA2-Enterprise tem 3 descobertas criticas:
            1. EAP-PEAP sem fixacao de certificado — vulneravel a evil twin
               com hostapd-mana (MITRE T1557.002)
            2. Sem 802.11w (PMF) — suscetivel a ataques de desautenticacao
               (MITRE T1498.001)
            3. Hash PMKID extraivel sem interacao do cliente — cracking
               offline possivel com hashcat mode 22000
            PCI-DSS 4.0: 2 controles nao conformes (4.2.1, 11.2.1).
            Recomendado: migrar para WPA3-Enterprise com SAE, habilitar PMF,
            implantar WIDS para deteccao de AP rogue."
```

---

## How It's Different

Ferramentas existentes fornecem capturas de pacotes brutos e analise especifica de protocolo. wifi-security-mcp-server da ao seu agente de IA a capacidade de **raciocinar sobre todos os dominios sem fio simultaneamente** com suporte profundo de bases de conhecimento.

<table>
<thead>
<tr>
<th></th>
<th>Abordagem Tradicional</th>
<th>wifi-security-mcp-server</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Interface</b></td>
<td>10+ CLIs, GUIs e ferramentas de hardware diferentes</td>
<td>MCP &mdash; agente de IA chama ferramentas de forma conversacional</td>
</tr>
<tr>
<td><b>Cobertura</b></td>
<td>Um protocolo por vez</td>
<td>WiFi, Bluetooth, RF, NFC, Celular, IoT &mdash; tudo em um unico servidor</td>
</tr>
<tr>
<td><b>Conhecimento</b></td>
<td>Busca manual de CVE, mapeamento manual ATT&CK</td>
<td>9 bases de conhecimento integradas com 139 itens pre-mapeados</td>
</tr>
<tr>
<td><b>Intel. de ataque</b></td>
<td>Busca no Google + posts de blog + palestras em conferencias</td>
<td>47 WiFi + 8 Bluetooth + 6 RF + 6 NFC + 6 Celular + 6 IoT ataques catalogados com ferramentas, mitigacoes, IDs ATT&CK</td>
</tr>
<tr>
<td><b>Conformidade</b></td>
<td>Ler PDFs NIST/PCI-DSS/HIPAA, mapear controles manualmente</td>
<td>Agente verifica automaticamente contra 5 frameworks de conformidade</td>
</tr>
<tr>
<td><b>Chaves de API</b></td>
<td>Varias contas para diferentes servicos</td>
<td>Zero chaves de API para funcionalidade principal &mdash; orientado por bases de conhecimento</td>
</tr>
<tr>
<td><b>Instalacao</b></td>
<td>Instalar aircrack-ng, Bettercap, HackRF, Proxmark3, Wireshark...</td>
<td><code>npx wifi-security-mcp-server</code> &mdash; um comando, zero configuracao</td>
</tr>
</tbody>
</table>

---

## Quick Start

### Opcao 1: npx (sem instalacao)

```bash
npx wifi-security-mcp-server
```

Todas as 34 ferramentas funcionam imediatamente. Nenhuma chave de API necessaria &mdash; a funcionalidade principal e orientada por bases de conhecimento.

### Opcao 2: Clonar

```bash
git clone https://github.com/badchars/wifi-security-mcp-server.git
cd wifi-security-mcp-server
bun install
```

### Variaveis de ambiente (opcional)

```bash
# WiGLE — banco de dados de wardriving para consultas de redes WiFi do mundo real
export WIGLE_API_KEY=your-key

# Kismet — deteccao de intrusao sem fio em tempo real
export KISMET_HOST=127.0.0.1      # Padrao: 127.0.0.1
export KISMET_PORT=2501           # Padrao: 2501
export KISMET_API_KEY=your-key
```

Todas as chaves de API sao opcionais. Sem elas, voce ainda tem acesso completo a todas as 34 ferramentas alimentadas por 9 bases de conhecimento integradas cobrindo ataques WiFi, ataques Bluetooth, RF/SDR, NFC/RFID, celular, IoT, banco de dados de hardware, inteligencia CVE e frameworks de conformidade.

### Conectar ao seu agente de IA

<details open>
<summary><b>Claude Code</b></summary>

```bash
# Com npx
claude mcp add wifi-security-mcp-server -- npx wifi-security-mcp-server

# Com clone local
claude mcp add wifi-security-mcp-server -- bun run /path/to/wifi-security-mcp-server/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Adicione a `~/Library/Application Support/Claude/claude_desktop_config.json`:

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
<summary><b>Cursor / Windsurf / outros clientes MCP</b></summary>

Mesmo formato de configuracao JSON. Aponte o comando para `npx wifi-security-mcp-server` ou o caminho da sua instalacao local.

</details>

### Comece a consultar

```
Voce: "Quais ataques sao possiveis contra uma rede WPA3-SAE e como testa-los?"
```

E so isso. O agente busca ataques, mapeia para o MITRE ATT&CK, recomenda ferramentas e fornece metodologia passo a passo &mdash; tudo a partir das bases de conhecimento integradas.

---

## What The AI Can Do

### Avaliacao de Seguranca WiFi

```
Voce: "Analise a seguranca de uma rede WPA2-PSK com WPS habilitado"

Agente: -> analyze_wifi_security {encryption: "WPA2-PSK", features: ["WPS"]}
       -> crack_wps {method: "pixie_dust"}
       -> analyze_pmkid {capture_method: "hcxdumptool"}
       -> find_wifi_attacks {target_type: "WPA2-PSK"}
       -> "Vulnerabilidades criticas encontradas na configuracao WPA2-PSK + WPS:
          1. Ataque WPS Pixie Dust — PIN recuperavel em segundos via
             forca bruta offline dos nonces E-S1/E-S2 (Reaver + PixieWPS).
             Recuperacao completa do PSK sem interacao do cliente.
          2. Ataque PMKID — o primeiro pacote do 4-way handshake contem
             o hash PMKID, quebravel offline com hashcat -m 22000.
             Sem necessidade de deauth, sem necessidade de cliente.
          3. Captura do 4-Way Handshake — frames EAPOL capturaveis com
             airodump-ng + deauth, seguido de ataque de dicionario offline.
          Prioridade: Desabilitar WPS imediatamente (maior risco), impor
          PSK forte de 20+ caracteres, considerar migracao para WPA3-SAE."
```

### Analise Bluetooth & BLE

```
Voce: "Quais sao os riscos de seguranca do nosso sistema de controle de acesso baseado em BLE?"

Agente: -> scan_bluetooth {scan_type: "BLE"}
       -> find_bluetooth_attacks {target_type: "BLE"}
       -> analyze_ble {feature: "GATT", pairing_method: "JustWorks"}
       -> "Sistema de controle de acesso BLE — 4 riscos criticos identificados:
          1. Emparelhamento JustWorks — sem protecao MITM. Atacante pode
             interceptar o emparelhamento com Ubertooth One (MITRE T1040).
          2. Sniffing de caracteristicas GATT — comandos de desbloqueio enviados
             em texto claro, replicaveis com gatttool (MITRE T1212).
          3. Ataque de relay/replay BLE — retransmitir sinal de desbloqueio
             legitimo usando dois dispositivos + btlejack (MITRE T1557).
          4. Rastreamento de endereco MAC — MAC BLE estatico permite
             rastreamento de ocupantes (MITRE T1592.002).
          Recomendado: impor LE Secure Connections (LESC) com
          comparacao numerica, criptografar caracteristicas GATT, implementar
          nonces rotativos para protecao contra replay."
```

### Auditoria Sem Fio IoT

```
Voce: "Avalie a seguranca sem fio da nossa implantacao IoT de edificio inteligente"

Agente: -> scan_iot_wireless {protocols: ["Zigbee", "Z-Wave", "MQTT"]}
       -> analyze_zigbee {network_key_type: "default"}
       -> find_mousejack {vendor: "Logitech"}
       -> analyze_wifi_security {encryption: "WPA2-PSK"}
       -> "Avaliacao sem fio IoT do edificio inteligente — 5 descobertas:
          1. Zigbee: Chave de link do centro de confianca padrao
             (ZigBeeAlliance09) permite interceptacao de ingresso na rede
             com KillerBee (CRITICO)
          2. MQTT: Broker na porta 1883 sem TLS — credenciais e
             dados de sensores transmitidos em texto claro
          3. Z-Wave: Seguranca S0 com vulnerabilidade conhecida de troca
             de chaves — recomendada atualizacao para S2
          4. MouseJack: 3 receptores Logitech Unifying vulneraveis a
             injecao de teclas (CVE-2016-10761)
          5. WiFi: Dispositivos IoT na mesma VLAN que a rede
             corporativa — sem segmentacao de rede
          Remediacao prioritaria: MQTT TLS, codigos de instalacao Zigbee,
          isolamento de VLAN IoT, substituir receptores Logitech vulneraveis."
```

### Auditoria de Conformidade

```
Voce: "Verifique nosso WiFi hospitalar contra os requisitos sem fio HIPAA"

Agente: -> audit_wireless_compliance {standard: "HIPAA", network_type: "WPA2-Enterprise"}
       -> analyze_medical_wireless {device_types: ["infusion_pump", "patient_monitor"]}
       -> detect_wireless_attack {attack_indicators: "rogue_ap"}
       -> "Auditoria de Conformidade Sem Fio HIPAA — 6 descobertas:
          3 controles NAO CONFORMES:
          - 164.312(a)(1): Nenhum IDS sem fio implantado para deteccao de AP rogue
          - 164.312(e)(1): Dispositivos medicos usando WPA2-PSK (nao Enterprise)
          - 164.312(e)(2): Sem registro de auditoria de criptografia de trafego sem fio
          3 controles CONFORMES:
          - 164.310(a)(1): Localizacoes fisicas dos APs documentadas
          - 164.312(a)(2): 802.1X com autenticacao RADIUS
          - 164.312(d): EAP-TLS baseado em certificado para dispositivos da equipe
          Plano de remediacao: implantar WIDS (Kismet/AirMagnet), migrar
          dispositivos medicos para WPA2-Enterprise com MAB, habilitar
          registro de auditoria sem fio no controlador WLAN."
```

---

## Tools Reference (34 composite tools)

<details open>
<summary><b>WiFi Core (8) &mdash; Sem chave de API</b></summary>

| Ferramenta | Descricao |
|------------|-----------|
| `scan_wifi_networks` | Escanear e analisar redes WiFi &mdash; descobrir SSIDs, canais, tipos de criptografia, intensidade do sinal e erros de configuracao de seguranca |
| `analyze_wifi_security` | Analise aprofundada da configuracao de seguranca WiFi &mdash; forca da criptografia, metodo de autenticacao, fraquezas conhecidas, superficie de ataque |
| `find_wifi_attacks` | Encontrar ataques aplicaveis para um alvo WiFi &mdash; retorna metodologia de ataque, ferramentas necessarias, mapeamento MITRE ATT&CK, mitigacoes |
| `simulate_evil_twin` | Simular e analisar cenarios de ataque evil twin AP &mdash; configuracao hostapd-mana, portal cativo, metodologia de captura de credenciais |
| `analyze_deauth` | Analisar vetores de ataque de desautenticacao &mdash; status 802.11w PMF, deteccao de deauth, contramedidas, integracao WIDS |
| `crack_wps` | Analisar vetores de ataque de cracking WPS &mdash; Pixie Dust, forca bruta, PIN nulo, geracao de PIN padrao, metodologia Reaver/Bully |
| `analyze_pmkid` | Analisar vetores de ataque baseados em PMKID &mdash; cracking WPA/WPA2 sem cliente via hcxdumptool + hashcat mode 22000 |
| `audit_wifi67` | Auditar recursos de seguranca especificos do WiFi 6 (802.11ax) e WiFi 7 (802.11be) &mdash; OWE, SAE, Enhanced Open, Multi-Link Operation |

</details>

<details>
<summary><b>Bluetooth (3) &mdash; Sem chave de API</b></summary>

| Ferramenta | Descricao |
|------------|-----------|
| `scan_bluetooth` | Escanear e analisar dispositivos Bluetooth &mdash; descoberta BR/EDR classico e BLE, enumeracao de servicos, analise de emparelhamento |
| `find_bluetooth_attacks` | Encontrar ataques Bluetooth aplicaveis &mdash; BlueBorne, KNOB, BIAS, relay BLE, MITM, com ferramentas e mitigacoes |
| `analyze_ble` | Analise aprofundada da seguranca BLE &mdash; servicos GATT, metodos de emparelhamento, LE Secure Connections, criptografia de caracteristicas |

</details>

<details>
<summary><b>RF/SDR (1) &mdash; Sem chave de API</b></summary>

| Ferramenta | Descricao |
|------------|-----------|
| `analyze_rf_signal` | Analisar seguranca de sinais RF &mdash; analise de frequencia, identificacao de modulacao, viabilidade de ataque replay, recomendacoes de ferramentas SDR |

</details>

<details>
<summary><b>NFC/RFID (1) &mdash; Sem chave de API</b></summary>

| Ferramenta | Descricao |
|------------|-----------|
| `analyze_nfc_security` | Analisar seguranca NFC/RFID &mdash; identificacao do tipo de cartao, fraquezas de controle de acesso, viabilidade de clonagem, metodologia Proxmark3 |

</details>

<details>
<summary><b>Celular/5G (1) &mdash; Sem chave de API</b></summary>

| Ferramenta | Descricao |
|------------|-----------|
| `analyze_cellular_security` | Analisar seguranca de rede celular &mdash; fraquezas dos protocolos 2G/3G/4G/5G, deteccao de IMSI catcher, analise de estacao base falsa |

</details>

<details>
<summary><b>IoT Sem Fio (3) &mdash; Sem chave de API</b></summary>

| Ferramenta | Descricao |
|------------|-----------|
| `analyze_zigbee` | Analisar seguranca de rede Zigbee &mdash; politica do centro de confianca, gerenciamento de chaves de rede, metodologia de ataque KillerBee |
| `scan_iot_wireless` | Escanear protocolos sem fio IoT &mdash; descoberta e analise de vulnerabilidades Zigbee, Z-Wave, MQTT, LoRaWAN, CoAP |
| `find_mousejack` | Analisar vulnerabilidades MouseJack de teclado/mouse sem fio &mdash; injecao de teclas, HID nao criptografado, bypasses especificos do fabricante |

</details>

<details>
<summary><b>Sem Fio Avancado (6) &mdash; Sem chave de API</b></summary>

| Ferramenta | Descricao |
|------------|-----------|
| `analyze_airgap` | Analisar tecnicas de exfiltracao air-gap &mdash; canais ocultos eletromagneticos, acusticos, termicos, opticos e contramedidas |
| `analyze_uwb` | Analisar seguranca Ultra-Wideband (UWB) &mdash; manipulacao de ranging, ataques relay em chaves de carro e AirTags, fraude de distancia |
| `analyze_wifi_csi` | Analisar seguranca WiFi Channel State Information (CSI) &mdash; sensoriamento passivo, reconhecimento de atividade, riscos de inferencia de teclas |
| `analyze_miracast` | Analisar seguranca Miracast/WiFi Display &mdash; sequestro de sessao WFD, captura de tela, acesso nao autorizado ao display |
| `analyze_wifi_direct` | Analisar seguranca WiFi Direct (P2P) &mdash; ataques de negociacao de proprietario de grupo, vulnerabilidades WPS em P2P, formacao de grupo malicioso |
| `analyze_drone_rf` | Analisar seguranca RF de drones &mdash; sequestro de link de controle, spoofing GPS, interceptacao de downlink de video, tecnicas counter-UAS |

</details>

<details>
<summary><b>Infraestrutura (4) &mdash; Sem chave de API (KISMET_* opcional para WIDS em tempo real)</b></summary>

| Ferramenta | Descricao |
|------------|-----------|
| `audit_wlan_controller` | Auditar configuracao do controlador WLAN &mdash; configuracoes de seguranca Cisco WLC, Aruba, Meraki, politicas de AP rogue, gerenciamento RF |
| `analyze_captive_portal` | Analisar seguranca do portal cativo &mdash; tecnicas de bypass, riscos de coleta de credenciais, isolamento de rede, seguranca de VLAN de convidados |
| `detect_mac_randomization` | Analisar randomizacao de endereco MAC &mdash; diferencas de implementacao iOS/Android/Windows, resistencia ao rastreamento, bypasses de fingerprinting |
| `analyze_hotspot20` | Analisar seguranca Hotspot 2.0 (Passpoint) &mdash; ANQP, OSU, riscos de selecao automatica de rede, analise de metodo EAP |

</details>

<details>
<summary><b>Inteligencia (4) &mdash; Sem chave de API</b></summary>

| Ferramenta | Descricao |
|------------|-----------|
| `lookup_wireless_cve` | Buscar CVEs especificos sem fio &mdash; vulnerabilidades de chipset WiFi, CVEs de pilha Bluetooth, exploits de driver, bugs de firmware |
| `lookup_hardware` | Buscar hardware de seguranca sem fio &mdash; adaptadores WiFi, sniffers Bluetooth, dispositivos SDR, capacidades, compatibilidade de chipset |
| `map_wireless_attck` | Mapear ataques sem fio para o framework MITRE ATT&CK &mdash; IDs de tecnica, categorias de tatica, estrategias de deteccao |
| `analyze_medical_wireless` | Analisar seguranca sem fio de dispositivos medicos &mdash; bombas de infusao, marcapassos, monitores de pacientes, orientacoes FDA, requisitos HIPAA |

</details>

<details>
<summary><b>Deteccao (2) &mdash; Sem chave de API</b></summary>

| Ferramenta | Descricao |
|------------|-----------|
| `detect_wireless_attack` | Detectar ataques sem fio em andamento &mdash; inundacoes de deauth, evil twin, KARMA, AP rogue, spoofing BLE, indicadores de jamming RF |
| `audit_wireless_compliance` | Auditar rede sem fio contra frameworks de conformidade &mdash; PCI-DSS 4.0, HIPAA, NIST 800-153, FedRAMP, controles sem fio ISO 27001 |

</details>

<details>
<summary><b>Relatorios (1) &mdash; Sem chave de API</b></summary>

| Ferramenta | Descricao |
|------------|-----------|
| `export_report` | Exportar relatorio de avaliacao de seguranca sem fio &mdash; descobertas, classificacoes de risco, status de conformidade, roteiro de remediacao, resumo executivo |

</details>

---

### CLI Usage

```bash
# Listar todas as ferramentas disponiveis
npx wifi-security-mcp-server --list

# Executar qualquer ferramenta diretamente
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

O servidor vem com 9 bases de conhecimento integradas &mdash; sem chaves de API, sem dependencias externas, sem limites de taxa. Cada consulta de ferramenta e enriquecida com inteligencia estruturada dessas bases de dados.

| Base de Conhecimento | Entradas | O que fornece |
|---------------------|----------|---------------|
| **Ataques WiFi** | 47 ataques | Tecnicas de ataque WPA/WPA2/WPA3, variantes evil twin, PMKID, KRACK, FragAttacks, deauth, exploits WPS &mdash; cada um com ferramentas, mitigacoes, mapeamento MITRE ATT&CK |
| **Ataques Bluetooth** | 8 ataques | BlueBorne, KNOB, BIAS, relay BLE, MITM, fuzzing BLE, personificacao Bluetooth &mdash; com CVEs e estrategias de deteccao |
| **Ataques RF/SDR** | 6 ataques | Ataques replay, jamming, injecao de sinal, interceptacao baseada em SDR, bypass de fingerprinting RF, tecnicas de analise espectral |
| **Ataques NFC/RFID** | 6 ataques | Clonagem de cartao, ataques relay, cracking MIFARE Classic, skimming NFC, fuzzing RFID, bypass de controle de acesso com Proxmark3 |
| **Ataques Celulares** | 6 ataques | Captura IMSI, estacao base falsa (Stingray), exploracao SS7, vulnerabilidades 5G NAS, ataques de downgrade, interceptacao VoLTE |
| **Ataques IoT** | 6 ataques | Sniffing de chave de rede Zigbee, downgrade Z-Wave S0, coleta de credenciais MQTT, replay LoRaWAN ABP, MouseJack, relay BLE IoT |
| **Banco de Dados de Hardware** | 12 dispositivos | Adaptadores WiFi (Alfa, TP-Link), sniffers Bluetooth (Ubertooth), SDR (HackRF, RTL-SDR), NFC (Proxmark3) &mdash; chipsets, capacidades, suporte a modo monitor |
| **Banco de Dados CVE** | 17 CVEs | CVEs especificos sem fio para chipsets WiFi (Broadcom, Qualcomm, Intel), pilhas Bluetooth, firmware IoT &mdash; severidade, versoes afetadas, disponibilidade de exploit |
| **Frameworks de Conformidade** | 5 frameworks | PCI-DSS 4.0, HIPAA, NIST SP 800-153, FedRAMP, ISO 27001 &mdash; controles especificos sem fio, checklists de auditoria, analise de lacunas |

---

## Architecture

```
src/
  index.ts                    # Ponto de entrada CLI (--help, --list, stdio server)
  protocol/
    mcp-server.ts             # Configuracao do servidor MCP (stdio transport)
    tools.ts                  # Registro de ferramentas — todas as 34 ferramentas compostas montadas aqui
  types/
    index.ts                  # Tipos compartilhados (ToolDef, ToolContext, ToolResult)
  knowledge/                  # 9 bases de conhecimento integradas
    wifi-attacks.ts           # 47 definicoes de ataques WiFi
    bluetooth-attacks.ts      # 8 definicoes de ataques Bluetooth
    rf-attacks.ts             # 6 definicoes de ataques RF/SDR
    nfc-attacks.ts            # 6 definicoes de ataques NFC/RFID
    cellular-attacks.ts       # 6 definicoes de ataques Celular/5G
    iot-attacks.ts            # 6 definicoes de ataques IoT
    hardware.ts               # 12 perfis de dispositivos de hardware
    cve-database.ts           # 17 CVEs sem fio
    compliance.ts             # 5 frameworks de conformidade
  wifi/                       # Ferramentas WiFi Core (8)
  bluetooth/                  # Ferramentas Bluetooth (3)
  rf/                         # Ferramentas RF/SDR (1)
  nfc/                        # Ferramentas NFC/RFID (1)
  cellular/                   # Ferramentas Celular/5G (1)
  iot/                        # Ferramentas IoT Sem Fio (3)
  advanced/                   # Ferramentas Sem Fio Avancado (6)
  infrastructure/             # Ferramentas Infraestrutura (4)
  intelligence/               # Ferramentas Inteligencia (4)
  detection/                  # Ferramentas Deteccao (2)
  reporting/                  # Ferramentas Relatorios (1)
```

**Decisoes de design:**

- **Orientado por bases de conhecimento** &mdash; Diferente de ferramentas dependentes de API, a funcionalidade principal funciona inteiramente offline a partir de 9 bancos de dados integrados. Sem chaves de API, sem limites de taxa, sem dependencias externas para o fluxo de trabalho principal.
- **34 ferramentas compostas, 139 capacidades individuais** &mdash; Cada ferramenta e um composto que agrupa analises relacionadas. `find_wifi_attacks` nao apenas lista ataques &mdash; retorna metodologia, hardware necessario, mapeamento MITRE ATT&CK, estrategias de deteccao e contramedidas.
- **2 dependencias de runtime** &mdash; `@modelcontextprotocol/sdk` e `zod`. Nada mais. Sem modulos nativos, sem dependencias binarias, sem codigo especifico de plataforma.
- **Integracao ao vivo opcional** &mdash; API WiGLE para dados de rede do mundo real, Kismet para IDS sem fio ao vivo. A analise principal funciona sem nenhum dos dois.
- **Consciente de conformidade** &mdash; Cada descoberta e automaticamente mapeada para frameworks de conformidade relevantes (PCI-DSS, HIPAA, NIST, FedRAMP, ISO 27001) quando aplicavel.
- **Mapeado para MITRE ATT&CK** &mdash; Tecnicas de ataque incluem IDs de tecnica ATT&CK, categorias de tatica e fontes de dados de deteccao para integracao SOC.

---

## Limitations

- Bases de conhecimento sao snapshots pontuais &mdash; novos ataques/CVEs requerem atualizacoes do pacote
- Integracao WiGLE requer uma chave de API gratuita para consultas de rede
- WIDS ao vivo do Kismet requer uma instancia Kismet em execucao com acesso API
- Sem transmissao sem fio ativa &mdash; o servidor fornece inteligencia e metodologia, nao injecao de pacotes
- Banco de dados de hardware cobre os dispositivos de pesquisa em seguranca mais comuns, nao e exaustivo
- Frameworks de conformidade focam em controles especificos sem fio, nao na cobertura completa do framework
- macOS / Linux testado (Windows nao testado)

---

## Part of the MCP Security Suite

| Projeto | Dominio | Ferramentas |
|---------|---------|-------------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | Testes de seguranca baseados em navegador | 39 ferramentas, Firefox, testes de injecao |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | Seguranca em nuvem (AWS/Azure/GCP) | 38 ferramentas, 60+ verificacoes |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | Postura de seguranca GitHub | 39 ferramentas, 45 verificacoes |
| [cve-mcp](https://github.com/badchars/cve-mcp) | Inteligencia de vulnerabilidades | 23 ferramentas, 5 fontes |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT e reconhecimento | 37 ferramentas, 12 fontes |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | Dark web e inteligencia de ameacas | 66 ferramentas, 16 fontes |
| **wifi-security-mcp-server** | **Inteligencia de seguranca sem fio** | **34 ferramentas, 9 bases de conhecimento** |

---

<p align="center">
<b>Apenas para testes e avaliacoes de seguranca autorizados.</b><br>
Certifique-se sempre de ter autorizacao adequada antes de realizar testes de seguranca sem fio em qualquer rede ou dispositivo.<br>
O acesso nao autorizado a redes sem fio ou interferencia e ilegal na maioria das jurisdicoes.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> &bull; Built by <a href="https://github.com/badchars">Orhan Yildirim</a> with Bun + TypeScript
</p>

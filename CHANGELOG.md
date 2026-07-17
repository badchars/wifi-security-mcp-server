# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-17

### Added

- Initial release with 34 composite tools and 139 individual tools
- MCP server with stdio transport for AI agent integration
- **WiFi Scanning & Analysis** (8 tools) -- network scanning, handshake analysis, encryption assessment, WPA/WPA2/WPA3 security analysis, PMKID capture guidance, WiFi 6/6E/7 auditing, evil twin simulation, deauth analysis, WPS cracking
- **Bluetooth** (3 tools) -- device scanning, BLE GATT analysis, attack assessment (BlueBorne, KNOB, BLUFFS, SweynTooth)
- **RF / SDR** (1 tool) -- signal analysis, protocol identification, replay attack guidance, SDR hardware recommendations
- **NFC / RFID** (1 tool) -- card identification, cloning guidance, Mifare Classic/DESFire/iCLASS analysis
- **Cellular / 5G** (1 tool) -- IMSI catcher detection, SS7 assessment, 5G-AKA analysis, VoWiFi security
- **IoT Protocols** (3 tools) -- Zigbee key extraction, Z-Wave S0 downgrade, MQTT security, LoRaWAN, MouseJack
- **Advanced Wireless** (6 tools) -- air-gap exfiltration techniques, UWB Ghost Peak, WiFi CSI sensing, Miracast/AirPlay, WiFi Direct, drone RF analysis
- **Infrastructure** (4 tools) -- WLAN controller audit, captive portal bypass, MAC randomization detection, Hotspot 2.0
- **Intelligence & Reference** (4 tools) -- wireless CVE lookup, hardware recommendations, MITRE ATT&CK mapping, medical device wireless security
- **Detection & Compliance** (2 tools) -- WIDS/WIPS rules, Sigma rule generation, wireless forensics, PCI DSS/NIST/HIPAA compliance
- **Reporting** (1 tool) -- JSON, Markdown, CSV export, executive summaries
- 9 built-in knowledge bases (WiFi attacks, Bluetooth attacks, RF attacks, NFC/RFID attacks, cellular attacks, IoT protocol attacks, pentesting hardware, wireless CVEs, compliance frameworks)
- CLI with `--list`, `--help` flags
- Optional WiGLE and Kismet integration via environment variables
- Dark/light mode SVG banners
- Social preview image
- README translations in 23 languages

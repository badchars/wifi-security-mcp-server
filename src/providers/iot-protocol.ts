import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { IOT_PROTOCOL_ATTACKS } from "../knowledge/iot-protocols.js";

// ─── Tool 1: iot_lookup_attack ───

const iotLookupAttack: ToolDef = {
  name: "iot_lookup_attack",
  description:
    "Look up an IoT protocol attack by ID from the IOT_PROTOCOL_ATTACKS knowledge base. Returns full attack details including tools, commands, and mitigations.",
  schema: {
    attack_id: z
      .string()
      .describe("The attack ID to look up (e.g. 'zigbee_key_sniff', 'mqtt_no_auth', 'lora_replay')"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const attackId = args.attack_id as string;
    const attack = IOT_PROTOCOL_ATTACKS.find((a) => a.id === attackId);

    if (!attack) {
      const available = IOT_PROTOCOL_ATTACKS.map((a) => a.id).join(", ");
      return text(`Attack '${attackId}' not found. Available IDs: ${available}`);
    }

    return json({
      attack,
      summary: {
        name: attack.name,
        protocol: attack.protocol,
        category: attack.category,
        severity: attack.severity,
        frequency: attack.frequency,
        toolCount: attack.tools.length,
        commandCount: attack.commands.length,
      },
    });
  },
};

// ─── Tool 2: iot_search_attacks ───

const iotSearchAttacks: ToolDef = {
  name: "iot_search_attacks",
  description:
    "Search IoT protocol attacks by protocol and/or category. Returns a filtered list of matching attacks.",
  schema: {
    protocol: z
      .enum(["zigbee", "zwave", "mqtt", "lora", "coap", "thread", "matter"])
      .optional()
      .describe("Filter by IoT protocol"),
    category: z
      .enum(["replay", "injection", "sniffing", "key_extract", "dos", "firmware", "mitm"])
      .optional()
      .describe("Filter by attack category"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const protocol = args.protocol as string | undefined;
    const category = args.category as string | undefined;

    let results = [...IOT_PROTOCOL_ATTACKS];

    if (protocol) {
      results = results.filter((a) => a.protocol === protocol);
    }
    if (category) {
      results = results.filter((a) => a.category === category);
    }

    if (results.length === 0) {
      return text(
        `No IoT attacks found matching protocol=${protocol ?? "any"}, category=${category ?? "any"}.`,
      );
    }

    return json({
      total: results.length,
      filters: { protocol: protocol ?? "all", category: category ?? "all" },
      attacks: results.map((a) => ({
        id: a.id,
        name: a.name,
        protocol: a.protocol,
        category: a.category,
        severity: a.severity,
        frequency: a.frequency,
        impact: a.impact,
      })),
    });
  },
};

// ─── Tool 3: iot_assess_protocol ───

const PROTOCOL_ASSESSMENTS: Record<string, { securityModel: string; encryptionDefault: string; authMethod: string; knownVulnerabilities: string[]; attackSurface: string[]; bestVersion: string }> = {
  zigbee: {
    securityModel: "Network-level (NWK key) + optional APS-level (link key) encryption",
    encryptionDefault: "AES-128-CCM with well-known Trust Center Link Key (ZigBeeAlliance09)",
    authMethod: "Trust Center authentication during join; Install Code-based in Zigbee 3.0",
    knownVulnerabilities: [
      "Default Trust Center Link Key is publicly known — network key exposed during join",
      "Frame counter manipulation allows replay attacks on some implementations",
      "OTA firmware updates may be unsigned or use weak keys",
      "Touchlink commissioning can be abused to steal devices from existing networks",
      "Channel hopping sniffing can capture traffic across all 16 channels",
    ],
    attackSurface: [
      "Key sniffing during device join/rejoin",
      "Frame replay when counter validation is weak",
      "Zigbee-to-IP gateway compromise (lateral movement to IT network)",
      "Physical access to coordinator for key extraction",
      "OTA update injection with malicious firmware",
    ],
    bestVersion: "Zigbee 3.0 with Install Code-based joining and APS encryption",
  },
  zwave: {
    securityModel: "S0 (legacy, weak) or S2 (modern, strong) security framework",
    encryptionDefault: "AES-128 (S2: ECDH key exchange + AES-CCM; S0: all-zero temp key during inclusion)",
    authMethod: "S2: ECDH with DSK/PIN verification; S0: unauthenticated key exchange",
    knownVulnerabilities: [
      "S0 security uses all-zero temporary key during inclusion — trivially captured",
      "S2 devices can be downgraded to S0 during inclusion by MitM",
      "Limited frame counter space in some implementations",
      "Z-Wave uses proprietary radio on 868/908 MHz — SDR can decode",
      "Some controllers allow S0 fallback by default",
    ],
    attackSurface: [
      "Device inclusion interception (S0 key exchange)",
      "S2-to-S0 downgrade during inclusion",
      "SDR-based traffic capture and decoding",
      "Physical access to controller for key extraction",
      "Firmware extraction from Z-Wave modules",
    ],
    bestVersion: "Z-Wave S2 with mandatory authentication and no S0 fallback",
  },
  mqtt: {
    securityModel: "Application-layer protocol; security depends on broker configuration",
    encryptionDefault: "None by default (plaintext on port 1883); optional TLS on port 8883",
    authMethod: "Optional username/password; MQTT 5.0 adds enhanced authentication (SCRAM, Kerberos)",
    knownVulnerabilities: [
      "Many brokers deployed without authentication (subscribe to # for all messages)",
      "Plaintext communication by default (no TLS)",
      "No built-in authorization — topic-level ACLs must be configured separately",
      "Retained messages can leak historical data to new subscribers",
      "Will messages can be abused for information disclosure",
      "Broker-to-broker bridging often lacks authentication",
    ],
    attackSurface: [
      "Unauthenticated broker access (scan for port 1883/8883)",
      "Wildcard subscription (# topic) for data exfiltration",
      "Command injection via writable topics controlling actuators",
      "Broker compromise for full IoT network control",
      "MQTT over WebSocket without WSS (unencrypted)",
    ],
    bestVersion: "MQTT 5.0 with TLS 1.3, enhanced authentication (SCRAM), and topic-level ACLs",
  },
  lora: {
    securityModel: "LoRaWAN: AppSKey (application) + NwkSKey (network) separation",
    encryptionDefault: "AES-128-CTR (application payload) + AES-128-CMAC (MIC)",
    authMethod: "OTAA: Derive session keys via join procedure; ABP: Static pre-shared keys",
    knownVulnerabilities: [
      "ABP activation uses static session keys — vulnerable to replay after device restart",
      "Frame counters in ABP reset on power cycle — allows message replay",
      "LoRaWAN 1.0: no network-level frame counter downlink protection",
      "Join-accept can be replayed in some implementations (LoRaWAN 1.0)",
      "Physical layer: LoRa modulation can be decoded with SDR (gr-lora)",
    ],
    attackSurface: [
      "ABP device power-cycle + message replay",
      "Join procedure interception (OTAA AppKey extraction)",
      "Gateway impersonation (rogue gateway)",
      "Physical access to device for key extraction",
      "RF jamming of LoRa channels",
    ],
    bestVersion: "LoRaWAN 1.1 with OTAA and persistent frame counters",
  },
  coap: {
    securityModel: "Optional DTLS (Datagram TLS) for encryption; OSCORE for E2E security",
    encryptionDefault: "None by default (plaintext CoAP on port 5683); DTLS on port 5684",
    authMethod: "DTLS: PSK, RPK, or certificate-based; OSCORE: symmetric key derived from EDHOC",
    knownVulnerabilities: [
      "Most deployments lack DTLS — resources accessible without authentication",
      "CoAP .well-known/core discovery exposes all device resources",
      "Observe notifications can leak real-time sensor data",
      "Block-wise transfer has no built-in integrity across blocks",
      "CoAP-to-HTTP proxy may introduce new attack surface",
    ],
    attackSurface: [
      "Unauthenticated resource access (GET/PUT/POST/DELETE)",
      "Resource discovery via .well-known/core",
      "Observe-based data exfiltration",
      "Amplification attack via multicast CoAP",
      "CoAP proxy exploitation",
    ],
    bestVersion: "CoAP with OSCORE (RFC 8613) + EDHOC key exchange",
  },
  thread: {
    securityModel: "IEEE 802.15.4 with MLE (Mesh Link Establishment) security",
    encryptionDefault: "AES-128-CCM at network layer; DTLS for commissioning",
    authMethod: "Commissioner/Joiner model with DTLS-secured commissioning; PSKc for network",
    knownVulnerabilities: [
      "Thread 1.1: commissioning credential (PSKc) if weak can be brute-forced",
      "Border Router is a high-value target — bridges Thread to IP network",
      "Mesh routing manipulation possible if network key compromised",
      "Physical access to Thread device allows key extraction from flash",
      "Limited research compared to Zigbee/Z-Wave — potential undiscovered vulnerabilities",
    ],
    attackSurface: [
      "Commissioning process interception",
      "Border Router compromise (Thread-to-IP bridge)",
      "Physical device key extraction",
      "Mesh routing attacks with compromised network key",
      "IEEE 802.15.4 layer attacks (common with Zigbee)",
    ],
    bestVersion: "Thread 1.3 with Matter application layer",
  },
  matter: {
    securityModel: "Certificate-based device attestation + CASE/PASE session security",
    encryptionDefault: "AES-128-CCM-64 with per-session keys derived from CASE/PASE",
    authMethod: "PASE (passcode-based) for commissioning; CASE (certificate-based) for operation",
    knownVulnerabilities: [
      "Matter is relatively new — limited real-world security research",
      "Multi-admin feature may create confused deputy issues",
      "Bridged legacy devices (Zigbee/Z-Wave via Matter bridge) inherit legacy vulnerabilities",
      "OTA update mechanism if compromised could push malicious firmware",
      "Group communication uses shared keys — compromised device affects group",
    ],
    attackSurface: [
      "Commissioning interception (PASE passcode brute-force)",
      "Bridge device compromise (legacy protocol exposure)",
      "Multi-admin trust exploitation",
      "OTA update server compromise",
      "Physical device tampering for key extraction",
    ],
    bestVersion: "Matter 1.2+ with certified device attestation and fabric isolation",
  },
};

const iotAssessProtocol: ToolDef = {
  name: "iot_assess_protocol",
  description:
    "Assess the security posture of an IoT wireless protocol. Returns known vulnerabilities, attack surface, and security model details.",
  schema: {
    protocol: z
      .enum(["zigbee", "zwave", "mqtt", "lora", "coap", "thread", "matter"])
      .describe("The IoT protocol to assess"),
    version: z
      .string()
      .optional()
      .describe("Optional protocol version (e.g. '3.0' for Zigbee, 'S2' for Z-Wave, '5.0' for MQTT)"),
    encryption_enabled: z
      .boolean()
      .optional()
      .describe("Whether encryption is enabled on the deployment"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const protocol = args.protocol as string;
    const version = args.version as string | undefined;
    const encryptionEnabled = args.encryption_enabled as boolean | undefined;

    const assessment = PROTOCOL_ASSESSMENTS[protocol];
    if (!assessment) {
      return text(`Unknown protocol: ${protocol}`);
    }

    const additionalWarnings: string[] = [];
    if (encryptionEnabled === false) {
      additionalWarnings.push(
        "CRITICAL: Encryption is disabled — all traffic is plaintext and easily intercepted",
        "Any device on the network can read and inject messages",
      );
    }

    const relatedAttacks = IOT_PROTOCOL_ATTACKS.filter((a) => a.protocol === protocol);

    return json({
      protocol,
      version: version ?? "unspecified",
      encryptionEnabled: encryptionEnabled ?? "unknown",
      securityModel: assessment.securityModel,
      defaultEncryption: assessment.encryptionDefault,
      authentication: assessment.authMethod,
      knownVulnerabilities: assessment.knownVulnerabilities,
      attackSurface: assessment.attackSurface,
      recommendedVersion: assessment.bestVersion,
      additionalWarnings,
      relatedAttacks: relatedAttacks.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        severity: a.severity,
      })),
    });
  },
};

// ─── Tool 4: iot_scan_guide ───

const SCAN_GUIDES: Record<string, { defaultHardware: string; setupSteps: string[]; scanCommands: { tool: string; command: string; description: string }[]; notes: string[] }> = {
  zigbee: {
    defaultHardware: "TI CC2531 USB dongle or ApiMote v4",
    setupSteps: [
      "Flash CC2531 with sniffer firmware: cc-tool -e -w CC2531ZNP-Prod.hex",
      "Install KillerBee: pip3 install killerbee",
      "Install Wireshark with Zigbee dissector (built-in)",
      "Optional: Flash nRF52840 dongle with 802.15.4 sniffer firmware",
    ],
    scanCommands: [
      { tool: "killerbee", command: "zbstumbler", description: "Discover Zigbee networks on all channels (11-26)" },
      { tool: "killerbee", command: "zbdump -f 15 -c 11 -w capture.pcap", description: "Capture Zigbee traffic on channel 11 using interface 15" },
      { tool: "killerbee", command: "zbid", description: "Identify connected KillerBee-compatible hardware" },
      { tool: "wireshark", command: "wireshark -i /dev/ttyUSB0 -k -Y 'zbee_nwk'", description: "Live Zigbee capture with Wireshark" },
      { tool: "killerbee", command: "zbgoodfind -r capture.pcap -f keyfile.txt", description: "Search for Zigbee network key in capture" },
    ],
    notes: [
      "Zigbee uses 16 channels (11-26) in 2.4 GHz band — scan all channels",
      "Channel hopping required for complete coverage",
      "Default Trust Center Link Key: 5A:69:67:42:65:65:41:6C:6C:69:61:6E:63:65:30:39",
    ],
  },
  zwave: {
    defaultHardware: "HackRF One or RTL-SDR (RX only) + appropriate antenna",
    setupSteps: [
      "Install GNU Radio: apt install gnuradio",
      "Install scapy-radio for Z-Wave support: pip3 install scapy-radio",
      "Install EZ-Wave toolkit: git clone https://github.com/cureHsu/EZ-Wave",
      "Configure SDR for 868.42 MHz (EU) or 908.42 MHz (US)",
    ],
    scanCommands: [
      { tool: "hackrf", command: "hackrf_transfer -r zwave.raw -f 908420000 -s 2000000 -g 40 -l 32", description: "Capture raw Z-Wave signal on US frequency" },
      { tool: "scapy-radio", command: "python3 zwave_scanner.py -f 908420000", description: "Scan for Z-Wave devices" },
      { tool: "rtl_433", command: "rtl_433 -f 908420000 -R 68", description: "Decode Z-Wave with rtl_433 (RX only)" },
    ],
    notes: [
      "Z-Wave frequency varies by region: US=908.42MHz, EU=868.42MHz, AU=921.42MHz",
      "Z-Wave uses FSK modulation at 9.6/40/100 kbps",
      "S0 inclusion uses all-zero temp key — capture during device add",
    ],
  },
  mqtt: {
    defaultHardware: "No special hardware needed — network access only",
    setupSteps: [
      "Install mosquitto-clients: apt install mosquitto-clients",
      "Install MQTT Explorer: snap install mqtt-explorer (or download from mqtt-explorer.com)",
      "Install paho-mqtt: pip3 install paho-mqtt",
      "Identify broker IP/port (default: 1883 plaintext, 8883 TLS)",
    ],
    scanCommands: [
      { tool: "nmap", command: "nmap -p 1883,8883 --open -sV <network/24>", description: "Scan network for MQTT brokers" },
      { tool: "mosquitto-clients", command: "mosquitto_sub -h <broker_ip> -t '#' -v", description: "Subscribe to all topics (wildcard)" },
      { tool: "mosquitto-clients", command: "mosquitto_sub -h <broker_ip> -t '$SYS/#' -v", description: "Read broker system topics (stats, version)" },
      { tool: "mqtt-explorer", command: "mqtt-explorer", description: "GUI-based MQTT broker exploration" },
      { tool: "paho-mqtt", command: "python3 -c \"import paho.mqtt.client as m; c=m.Client(); c.connect('<broker_ip>'); c.subscribe('#')\"", description: "Python MQTT subscription" },
    ],
    notes: [
      "Check for anonymous access first (no username/password)",
      "Try default credentials: admin/admin, mosquitto/mosquitto",
      "Check $SYS/# topics for broker version and statistics",
      "Look for sensitive topics: /config, /credentials, /admin, /ota",
    ],
  },
  lora: {
    defaultHardware: "HackRF One or LimeSDR + appropriate antenna (868/915 MHz)",
    setupSteps: [
      "Install GNU Radio: apt install gnuradio",
      "Install gr-lora: git clone https://github.com/rpp0/gr-lora && cd gr-lora && mkdir build && cd build && cmake .. && make install",
      "Install LoRa SDR tools: pip3 install lora-sdr",
      "Configure SDR for region frequency: EU=868.1MHz, US=915MHz",
    ],
    scanCommands: [
      { tool: "gr-lora", command: "gnuradio-companion lora_receiver.grc", description: "GnuRadio LoRa receiver flowgraph" },
      { tool: "hackrf", command: "hackrf_transfer -r lora_capture.raw -f 868100000 -s 1000000 -g 40 -l 32", description: "Capture raw LoRa signal (EU frequency)" },
      { tool: "rtl_433", command: "rtl_433 -f 868100000 -R 0 -S all", description: "Generic capture on LoRa frequency" },
    ],
    notes: [
      "LoRa uses CSS modulation — specialized decoder required",
      "LoRaWAN uses multiple channels and spreading factors (SF7-SF12)",
      "Higher SF = longer range but slower data rate",
      "EU: 868.1, 868.3, 868.5 MHz; US: 902-928 MHz (64+8 channels)",
    ],
  },
  coap: {
    defaultHardware: "No special hardware needed — network access only",
    setupSteps: [
      "Install coap-cli: npm install -g coap-cli",
      "Install aiocoap: pip3 install aiocoap",
      "Install libcoap: apt install libcoap2-bin",
      "Identify CoAP endpoint IP/port (default: 5683 plaintext, 5684 DTLS)",
    ],
    scanCommands: [
      { tool: "nmap", command: "nmap -p 5683,5684 --open -sU <network/24>", description: "Scan for CoAP endpoints (UDP)" },
      { tool: "coap-cli", command: "coap get coap://<device_ip>/.well-known/core", description: "Discover all CoAP resources" },
      { tool: "coap-cli", command: "coap get coap://<device_ip>/sensor/temperature", description: "Read sensor resource" },
      { tool: "aiocoap", command: "aiocoap-client coap://<device_ip>/.well-known/core", description: "Python-based CoAP resource discovery" },
    ],
    notes: [
      "CoAP uses UDP — use -sU flag with nmap",
      "Resource discovery at .well-known/core returns RFC 6690 link format",
      "Check for multicast CoAP on 224.0.1.187 (coap://all.coap.multicast)",
      "CoAP observe flag allows persistent monitoring of resources",
    ],
  },
  thread: {
    defaultHardware: "nRF52840 USB dongle with 802.15.4 sniffer firmware",
    setupSteps: [
      "Flash nRF52840 with Thread sniffer firmware from Nordic",
      "Install nRF Sniffer for 802.15.4: pip3 install nrf-802154-sniffer",
      "Install Wireshark with Thread/802.15.4 dissector",
      "Install OTNS (OpenThread Network Simulator) for analysis",
    ],
    scanCommands: [
      { tool: "wireshark", command: "wireshark -i /dev/ttyACM0 -k -Y 'thread'", description: "Live Thread traffic capture" },
      { tool: "nrf-sniffer", command: "nrf802154_sniffer -c 15 -p /dev/ttyACM0", description: "Capture 802.15.4/Thread on channel 15" },
    ],
    notes: [
      "Thread uses same IEEE 802.15.4 PHY as Zigbee — same sniffing hardware works",
      "Thread operates on channels 11-26 in 2.4 GHz band",
      "Look for MLE (Mesh Link Establishment) frames for network discovery",
      "Thread Border Router is the key target — bridges Thread to IPv6/WiFi",
    ],
  },
  matter: {
    defaultHardware: "WiFi/Thread/BLE sniffer depending on transport layer",
    setupSteps: [
      "For Thread transport: use nRF52840 802.15.4 sniffer",
      "For WiFi transport: use standard WiFi monitor mode adapter",
      "For BLE commissioning: use nRF52840 BLE sniffer or Ubertooth",
      "Install chip-tool from Matter SDK for device interaction",
    ],
    scanCommands: [
      { tool: "chip-tool", command: "chip-tool discover commissionables", description: "Discover Matter devices available for commissioning" },
      { tool: "avahi", command: "avahi-browse -rt _matter._tcp", description: "Discover Matter devices via mDNS" },
      { tool: "nmap", command: "nmap -p 5540 --open <network/24>", description: "Scan for Matter operational port" },
    ],
    notes: [
      "Matter runs over WiFi, Thread, or Ethernet — sniffing depends on transport",
      "Commissioning uses BLE or WiFi — BLE sniffer needed for commissioning capture",
      "Matter uses mDNS for discovery — monitor _matter._tcp and _matterc._udp",
      "Operational communication on TCP port 5540 (default)",
    ],
  },
};

const iotScanGuide: ToolDef = {
  name: "iot_scan_guide",
  description:
    "Guide for scanning and sniffing IoT wireless protocol traffic. Returns hardware requirements, setup steps, scanning commands, and notes.",
  schema: {
    protocol: z
      .enum(["zigbee", "zwave", "mqtt", "lora", "coap", "thread", "matter"])
      .describe("The IoT protocol to scan"),
    hardware: z
      .string()
      .optional()
      .describe("Specific hardware available (e.g. 'hackrf', 'cc2531', 'nrf52840')"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const protocol = args.protocol as string;
    const hardware = args.hardware as string | undefined;

    const guide = SCAN_GUIDES[protocol];
    if (!guide) {
      return text(`No scan guide available for protocol: ${protocol}`);
    }

    return json({
      protocol,
      recommendedHardware: guide.defaultHardware,
      userHardware: hardware ?? "not specified",
      setupSteps: guide.setupSteps,
      scanCommands: guide.scanCommands,
      notes: guide.notes,
      legalWarning: "Ensure you have explicit authorization before scanning IoT networks. Unauthorized interception of wireless communications may violate local laws.",
    });
  },
};

// ─── Tool 5: iot_defense ───

const IOT_DEFENSE: Record<string, Record<string, { networkSecurity: string[]; deviceHardening: string[]; monitoring: string[]; architecture: string[] }>> = {
  zigbee: {
    home: {
      networkSecurity: [
        "Use Zigbee 3.0 with Install Code-based joining (not default TC Link Key)",
        "Enable APS-level encryption for sensitive device communication",
        "Disable Touchlink commissioning on coordinator",
        "Use a coordinator that supports Zigbee 3.0 security features",
      ],
      deviceHardening: [
        "Keep device firmware updated via OTA (verify signed updates)",
        "Change default network key after initial setup",
        "Disable permit join on coordinator when not adding devices",
        "Use Zigbee-to-IP gateway with network isolation (separate VLAN)",
      ],
      monitoring: [
        "Monitor for unknown device joins on coordinator dashboard",
        "Check for unexpected frame counter resets",
        "Use Zigbee sniffer periodically to audit network traffic",
      ],
      architecture: [
        "Isolate Zigbee gateway on dedicated IoT VLAN",
        "Use firewall rules to restrict gateway internet access",
        "Prefer local-only control (Home Assistant, Zigbee2MQTT) over cloud",
      ],
    },
    enterprise: {
      networkSecurity: [
        "Mandatory Install Code-based commissioning for all devices",
        "Use centralized Trust Center with hardware security module (HSM)",
        "Implement network-wide APS encryption",
        "Regular key rotation schedule",
        "Disable all legacy security modes",
      ],
      deviceHardening: [
        "Deploy only Zigbee 3.0 certified devices",
        "Verify OTA update signatures using device attestation",
        "Implement device allowlist on Trust Center",
        "Physical tamper detection on critical sensors",
      ],
      monitoring: [
        "Deploy 802.15.4 IDS/IPS (Zigbee-aware)",
        "Monitor for unauthorized join attempts and replay attacks",
        "Centralized logging of all Zigbee network events",
        "Periodic RF spectrum analysis for rogue devices",
      ],
      architecture: [
        "Network segmentation: separate Zigbee from IT and OT networks",
        "Redundant coordinators for high-availability",
        "Air-gapped management network for coordinator administration",
        "Regular penetration testing of Zigbee infrastructure",
      ],
    },
    industrial: {
      networkSecurity: [
        "Use Zigbee with additional application-layer encryption (TLS/DTLS to backend)",
        "Implement device certificate-based authentication where possible",
        "Deploy in Faraday-shielded environments where feasible",
        "Use frequency monitoring to detect jamming attacks",
      ],
      deviceHardening: [
        "Tamper-evident enclosures on all field devices",
        "Secure boot and hardware root of trust on devices",
        "Disable JTAG/SWD debug ports on production devices",
        "Physical security for coordinator and gateway devices",
      ],
      monitoring: [
        "24/7 RF monitoring with anomaly detection",
        "Integration with SIEM for correlated alert analysis",
        "Automated response to detected jamming or replay attacks",
        "Regular security audits by wireless security specialists",
      ],
      architecture: [
        "Defense-in-depth: Zigbee + application-layer + network-layer security",
        "Redundant communication paths (Zigbee + wired backup)",
        "Strict network segmentation per IEC 62443",
        "Incident response plan specific to wireless IoT compromise",
      ],
    },
  },
  mqtt: {
    home: {
      networkSecurity: ["Enable MQTT authentication (username/password)", "Use TLS (port 8883) for all MQTT connections", "Implement topic-level ACLs", "Disable anonymous access"],
      deviceHardening: ["Use unique credentials per device", "Disable retained messages for sensitive topics", "Set appropriate QoS levels", "Use MQTT 5.0 with enhanced auth if supported"],
      monitoring: ["Monitor $SYS/# topics for broker health", "Log failed authentication attempts", "Check for wildcard subscriptions", "Review client connection list periodically"],
      architecture: ["Run MQTT broker on isolated IoT VLAN", "Use reverse proxy with TLS termination", "Prefer local broker (Mosquitto) over cloud", "Firewall: restrict broker access to IoT VLAN only"],
    },
    enterprise: {
      networkSecurity: ["Mandatory TLS 1.3 with client certificates", "MQTT 5.0 with SCRAM authentication", "Fine-grained topic-level ACLs per device role", "Rate limiting per client", "Bridge authentication for multi-broker setups"],
      deviceHardening: ["Unique TLS client certificates per device", "Certificate rotation policy", "Minimal topic permissions per device", "Disable will messages unless required"],
      monitoring: ["Centralized MQTT audit logging to SIEM", "Alert on wildcard subscriptions", "Monitor for unusual topic patterns", "Track message rates per client for anomaly detection"],
      architecture: ["Clustered MQTT broker with HA", "DMZ broker for external devices, internal broker for backend", "Zero-trust: mutual TLS + topic-level auth", "Regular penetration testing of MQTT infrastructure"],
    },
    industrial: {
      networkSecurity: ["Sparkplug B specification for industrial MQTT", "Mandatory mutual TLS with HSM-backed certificates", "Network segmentation per IEC 62443 zones", "Separate MQTT brokers per security zone"],
      deviceHardening: ["Hardware security modules on field devices", "Secure boot chain for MQTT client firmware", "Certificate lifecycle management with automated rotation", "Physical security for MQTT broker hardware"],
      monitoring: ["Real-time SCADA-aware MQTT monitoring", "Integration with industrial IDS/IPS", "Automated anomaly detection on sensor data patterns", "Regular compliance audits against IEC 62443"],
      architecture: ["Purdue model compliance for MQTT deployment", "Air-gapped or data-diode protected historian", "Redundant broker clusters per zone", "Documented and tested incident response procedures"],
    },
  },
};

const iotDefense: ToolDef = {
  name: "iot_defense",
  description:
    "IoT protocol defense and security hardening recommendations based on protocol and deployment type. Returns network security, device hardening, monitoring, and architecture recommendations.",
  schema: {
    protocol: z
      .enum(["zigbee", "zwave", "mqtt", "lora", "coap", "thread", "matter"])
      .describe("The IoT protocol to secure"),
    deployment_type: z
      .enum(["home", "enterprise", "industrial"])
      .describe("Deployment environment type"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const protocol = args.protocol as string;
    const deploymentType = args.deployment_type as string;

    const protocolDefense = IOT_DEFENSE[protocol];

    if (!protocolDefense) {
      // Generate generic defense for protocols without specific entries
      return json({
        protocol,
        deploymentType,
        note: "Specific defense guide not yet available for this protocol. Applying generic IoT security recommendations.",
        networkSecurity: [
          "Enable encryption on all wireless links",
          "Use strong authentication (certificate-based preferred)",
          "Implement network segmentation (dedicated IoT VLAN)",
          "Disable legacy/insecure protocol versions",
        ],
        deviceHardening: [
          "Keep firmware updated with signed OTA",
          "Change all default credentials",
          "Disable unnecessary services and debug interfaces",
          "Use secure boot where supported",
        ],
        monitoring: [
          "Monitor for unauthorized devices",
          "Log all authentication events",
          "Deploy protocol-specific IDS where available",
          "Periodic security assessments",
        ],
        architecture: [
          "Segment IoT from IT/OT networks",
          "Use gateway with firewall between IoT and IP networks",
          "Implement defense-in-depth",
          "Document and practice incident response",
        ],
      });
    }

    const defense = protocolDefense[deploymentType];
    if (!defense) {
      return text(`No defense guide for ${protocol} in ${deploymentType} deployment. Available: ${Object.keys(protocolDefense).join(", ")}`);
    }

    return json({
      protocol,
      deploymentType,
      networkSecurity: defense.networkSecurity,
      deviceHardening: defense.deviceHardening,
      monitoring: defense.monitoring,
      architecture: defense.architecture,
    });
  },
};

// ─── Export All IoT Protocol Tools ───

export const iotProtocolTools: ToolDef[] = [
  iotLookupAttack,
  iotSearchAttacks,
  iotAssessProtocol,
  iotScanGuide,
  iotDefense,
];

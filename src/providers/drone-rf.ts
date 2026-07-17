import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ─── Drone Protocol Database ───

const DRONE_PROTOCOLS: Record<string, { description: string; frequencies: string[]; modulation: string; encryption: string; knownVulnerabilities: string[]; detectionSignature: string; tools: string[] }> = {
  wifi: {
    description: "Standard WiFi (802.11) used by consumer drones (DJI Mini series, Parrot, Tello). Control and video downlink over WiFi.",
    frequencies: ["2.4 GHz", "5.8 GHz"],
    modulation: "OFDM (802.11n/ac/ax)",
    encryption: "WPA2-PSK (typically) or Open (some toy drones)",
    knownVulnerabilities: [
      "Standard WiFi attacks apply: deauth, handshake capture, evil twin",
      "Many toy drones use open WiFi — full traffic interception",
      "Drone's WiFi AP credentials often printed on drone or use default",
      "Deauth attack disconnects controller — drone enters auto-hover or return-to-home",
      "WiFi AP mode exposes drone to network-based attacks",
      "Video downlink often unencrypted UDP stream",
    ],
    detectionSignature: "WiFi AP with SSID matching drone naming patterns (e.g., TELLO-*, CoDrone*, Parrot-*)",
    tools: ["aircrack-ng suite", "Wireshark", "Kismet", "bettercap"],
  },
  lightbridge: {
    description: "DJI Lightbridge proprietary communication protocol (1st gen DJI drones). Uses OFDM on 2.4 GHz with frequency hopping.",
    frequencies: ["2.4 GHz"],
    modulation: "OFDM with frequency hopping",
    encryption: "Proprietary DJI encryption (weaknesses found in research)",
    knownVulnerabilities: [
      "DJI Lightbridge protocol has been partially reverse-engineered",
      "Video downlink can be intercepted with custom SDR receiver (d-crypt tool)",
      "Control channel more protected but protocol analysis possible",
      "Frequency hopping pattern can be predicted after observation period",
      "Older firmware versions have weaker security",
    ],
    detectionSignature: "OFDM signal on 2.4 GHz with DJI-specific frequency hopping pattern",
    tools: ["HackRF + GNU Radio", "d-crypt/dji-rev tools", "SDR++ spectrum analyzer"],
  },
  ocusync: {
    description: "DJI OcuSync (1.0/2.0/3.0/O3/O4) proprietary protocol used in newer DJI drones. Advanced FHSS with AES encryption.",
    frequencies: ["2.4 GHz", "5.8 GHz"],
    modulation: "FHSS (Frequency Hopping Spread Spectrum) with OFDM",
    encryption: "AES-256 (OcuSync 2.0+), proprietary DJI security layer",
    knownVulnerabilities: [
      "OcuSync 2.0+ is significantly more secure than Lightbridge",
      "Video feed encryption makes interception difficult",
      "Jamming still possible (denial of service)",
      "DJI DroneID protocol broadcasts drone serial number and location in plaintext (FCC/EU requirement)",
      "AeroScope (DJI's detection system) can identify DJI drones — attacker can also build receiver",
      "Side-channel attacks on AES implementation possible in theory",
    ],
    detectionSignature: "FHSS signal across 2.4/5.8 GHz with DJI DroneID broadcast",
    tools: ["DJI AeroScope (commercial)", "HackRF for spectrum analysis", "DroneID decoder"],
  },
  elrs: {
    description: "ExpressLRS — open-source, long-range RC link protocol for FPV drones. Designed for low latency and long range.",
    frequencies: ["900 MHz", "2.4 GHz"],
    modulation: "LoRa-based spread spectrum",
    encryption: "Binding phrase only (no encryption of payload data in most versions)",
    knownVulnerabilities: [
      "No payload encryption — control commands transmitted in plaintext after binding",
      "Binding phrase is not true encryption — can be brute-forced or sniffed during binding",
      "Open-source firmware — full protocol details publicly available",
      "LoRa modulation can be decoded with SDR (gr-lora)",
      "Replay attacks on control commands if sequence numbering is weak",
      "Attacker with same hardware can jam or overpower legitimate signal",
    ],
    detectionSignature: "LoRa-modulated signal on 900 MHz or 2.4 GHz with ELRS packet structure",
    tools: ["HackRF + gr-lora", "ELRS hardware (for attack simulation)", "SDR++ spectrum analyzer"],
  },
  custom: {
    description: "Custom or unknown drone communication protocols. Includes military, industrial, and DIY drone systems.",
    frequencies: ["Various (433 MHz, 868 MHz, 900 MHz, 1.2 GHz, 2.4 GHz, 5.8 GHz)"],
    modulation: "Various (FSK, GFSK, OFDM, DSSS, FHSS, custom)",
    encryption: "Varies — from none (hobby) to military-grade (COMSEC)",
    knownVulnerabilities: [
      "Security depends entirely on implementation",
      "Many custom protocols lack encryption",
      "Protocol analysis possible with SDR and reverse engineering",
      "Jamming effective against all radio-based control",
      "GPS spoofing can redirect autonomous drones",
      "Side-channel analysis of signal characteristics reveals drone type and behavior",
    ],
    detectionSignature: "Varies — RF spectrum analysis required to characterize unknown signals",
    tools: ["HackRF + GNU Radio", "Universal Radio Hacker (URH)", "SDR++", "inspectrum"],
  },
};

// ─── Tool 1: drone_rf_detect ───

const droneRfDetect: ToolDef = {
  name: "drone_rf_detect",
  description:
    "Drone RF detection guide using SDR equipment. Returns methodology for detecting drone communication signals across specified frequency bands.",
  schema: {
    frequency_bands: z
      .array(z.string())
      .describe("Frequency bands to monitor (e.g. ['2.4ghz', '5.8ghz', '900mhz', '433mhz'])"),
    hardware: z
      .string()
      .optional()
      .describe("Available SDR hardware (e.g. 'hackrf', 'rtl-sdr', 'limesdr')"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const bands = args.frequency_bands as string[];
    const hardware = (args.hardware as string) ?? "hackrf";

    const bandConfigs: Record<string, { centerFreq: string; bandwidth: string; commonDrones: string[]; signalTypes: string[] }> = {
      "2.4ghz": {
        centerFreq: "2437000000",
        bandwidth: "20000000",
        commonDrones: ["DJI (all models)", "Parrot", "Tello", "ELRS 2.4G", "Most consumer drones"],
        signalTypes: ["WiFi (OFDM)", "DJI OcuSync (FHSS)", "DJI Lightbridge (OFDM+FH)", "ELRS (LoRa)", "FrSky (FHSS)"],
      },
      "5.8ghz": {
        centerFreq: "5800000000",
        bandwidth: "40000000",
        commonDrones: ["DJI (OcuSync 5.8G)", "FPV video transmitters", "Analog FPV (5.8G)"],
        signalTypes: ["DJI OcuSync (FHSS)", "Analog FPV (FM video)", "WiFi 5GHz (some DJI)"],
      },
      "900mhz": {
        centerFreq: "915000000",
        bandwidth: "26000000",
        commonDrones: ["ELRS 900MHz", "TBS Crossfire", "Long-range FPV", "Some industrial drones"],
        signalTypes: ["ELRS (LoRa)", "TBS Crossfire (FHSS)", "Custom RC links"],
      },
      "433mhz": {
        centerFreq: "433920000",
        bandwidth: "2000000",
        commonDrones: ["DIY drones", "Some RC transmitters", "Telemetry links"],
        signalTypes: ["RC control (OOK/FSK)", "Telemetry (FSK)", "Custom protocols"],
      },
      "1.2ghz": {
        centerFreq: "1280000000",
        bandwidth: "20000000",
        commonDrones: ["Long-range FPV video", "Military/industrial drones"],
        signalTypes: ["Analog FPV video (FM)", "Digital video links"],
      },
    };

    const monitoredBands = bands.map((band) => {
      const normalized = band.toLowerCase().replace(/\s/g, "");
      const config = bandConfigs[normalized];
      if (!config) {
        return { band, status: "UNKNOWN — no configuration available", config: null };
      }
      return { band: normalized, status: "CONFIGURED", config };
    });

    const detectionCommands: { tool: string; command: string; description: string }[] = [];

    if (hardware === "hackrf" || hardware === "limesdr") {
      detectionCommands.push(
        { tool: "hackrf_sweep", command: "hackrf_sweep -f 2400:2500 -w 1000000 -l 32 -g 40 -1", description: "Sweep 2.4 GHz band for drone signals" },
        { tool: "hackrf_sweep", command: "hackrf_sweep -f 5700:5900 -w 1000000 -l 32 -g 40 -1", description: "Sweep 5.8 GHz band for drone signals" },
        { tool: "hackrf_transfer", command: "hackrf_transfer -r drone_2.4g.raw -f 2437000000 -s 20000000 -g 40 -l 32", description: "Capture raw 2.4 GHz for analysis" },
        { tool: "SDR++", command: "sdrpp", description: "Visual spectrum analyzer — look for non-WiFi signals in 2.4/5.8 GHz" },
        { tool: "GNU Radio", command: "gnuradio-companion drone_detector.grc", description: "Custom drone detection flowgraph" },
      );
    }

    if (hardware === "rtl-sdr") {
      detectionCommands.push(
        { tool: "rtl_power", command: "rtl_power -f 400M:1000M:1M -g 50 -i 1 -e 60 scan.csv", description: "Wideband power scan for sub-GHz drone signals" },
        { tool: "rtl_433", command: "rtl_433 -f 433920000 -R 0 -S all", description: "Capture all signals on 433 MHz" },
        { tool: "SDR++", command: "sdrpp (with RTL-SDR source)", description: "Visual spectrum analysis (limited to 1.7 GHz max)" },
      );
    }

    return json({
      hardware,
      monitoredBands,
      detectionMethodology: [
        "1. Establish RF baseline — record spectrum without drones present",
        "2. Configure SDR for target frequency bands",
        "3. Monitor for new signals that deviate from baseline",
        "4. Characterize detected signals: bandwidth, modulation, hopping pattern",
        "5. Match signal characteristics against known drone protocol signatures",
        "6. If DJI: look for DroneID broadcast (contains serial number, GPS coordinates)",
        "7. Triangulate drone position using signal strength from multiple receivers",
        "8. Record signal for offline analysis and protocol identification",
      ],
      detectionCommands,
      knownDroneSignatures: Object.entries(DRONE_PROTOCOLS).map(([key, proto]) => ({
        protocol: key,
        frequencies: proto.frequencies,
        modulation: proto.modulation,
        detectionSignature: proto.detectionSignature,
      })),
      droneIdDetection: {
        description: "DJI drones broadcast DroneID containing serial number, GPS position, altitude, speed, and pilot location.",
        tools: [
          "DJI AeroScope (commercial, $10k+)",
          "DroneID decoder (open-source SDR-based)",
          "WiFi Aware / Bluetooth 5.x broadcast monitoring for Remote ID (FAA mandate)",
        ],
        faaRemoteId: "As of 2023, FAA requires Remote ID broadcast on all drones >250g. Broadcast via WiFi NaN or Bluetooth 5.x Legacy Advertising.",
      },
      notes: [
        "Drone detection is most effective with directional antennas for signal localization",
        "Consumer drones typically transmit at 100mW-1W — detectable at 1-5 km with proper antenna",
        "FHSS protocols (OcuSync, Crossfire) are harder to detect than fixed-frequency protocols",
        "Combine RF detection with radar, acoustic, and visual detection for best results",
      ],
    });
  },
};

// ─── Tool 2: drone_rf_analyze ───

const droneRfAnalyze: ToolDef = {
  name: "drone_rf_analyze",
  description:
    "Analyze drone communication protocol security. Returns protocol details, vulnerabilities, and attack surface for specific drone communication protocols.",
  schema: {
    protocol: z
      .enum(["wifi", "lightbridge", "ocusync", "elrs", "custom"])
      .describe("Drone communication protocol to analyze"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const protocol = args.protocol as string;

    const proto = DRONE_PROTOCOLS[protocol];
    if (!proto) {
      return text(`Unknown protocol: ${protocol}`);
    }

    const attackVectors: { vector: string; difficulty: string; impact: string }[] = [];

    if (protocol === "wifi") {
      attackVectors.push(
        { vector: "Deauthentication attack — disconnect controller from drone WiFi AP", difficulty: "LOW", impact: "Drone enters hover/RTH mode — loss of control" },
        { vector: "WiFi password crack — capture handshake, crack PSK offline", difficulty: "MEDIUM", impact: "Full drone control — hijack command channel" },
        { vector: "Evil twin — impersonate drone's WiFi AP to capture controller", difficulty: "MEDIUM", impact: "MitM on control channel, video interception" },
        { vector: "Video stream interception — capture unencrypted UDP video", difficulty: "LOW", impact: "Surveillance of drone camera feed" },
      );
    } else if (protocol === "lightbridge") {
      attackVectors.push(
        { vector: "Video downlink interception — SDR-based Lightbridge video decoder", difficulty: "HIGH", impact: "View drone camera feed without controller" },
        { vector: "Frequency hopping prediction — analyze and predict FH pattern", difficulty: "HIGH", impact: "Targeted jamming or signal manipulation" },
        { vector: "Firmware exploitation — known vulnerabilities in older DJI firmware", difficulty: "MEDIUM", impact: "Modify drone behavior via firmware" },
      );
    } else if (protocol === "ocusync") {
      attackVectors.push(
        { vector: "DroneID interception — capture DJI Remote ID broadcast", difficulty: "LOW", impact: "Track drone serial number, pilot location, flight path" },
        { vector: "Jamming — wideband noise on 2.4/5.8 GHz", difficulty: "LOW", impact: "Loss of control link — drone enters RTH or hover" },
        { vector: "AeroScope cloning — build DIY drone detection using DroneID", difficulty: "MEDIUM", impact: "Surveillance of all DJI drones in range" },
        { vector: "Video feed decryption — AES-256 but implementation analysis ongoing", difficulty: "VERY HIGH", impact: "View encrypted video feed" },
      );
    } else if (protocol === "elrs") {
      attackVectors.push(
        { vector: "Control command interception — LoRa demodulation of unencrypted commands", difficulty: "MEDIUM", impact: "View control inputs in plaintext" },
        { vector: "Binding phrase extraction — sniff during binding process", difficulty: "MEDIUM", impact: "Impersonate controller, inject commands" },
        { vector: "Signal override — transmit at higher power on same frequency", difficulty: "MEDIUM", impact: "Take over drone control" },
        { vector: "Replay attack — capture and replay control sequences", difficulty: "MEDIUM", impact: "Replay specific maneuvers" },
      );
    } else {
      attackVectors.push(
        { vector: "Protocol reverse engineering — SDR capture and analysis", difficulty: "HIGH", impact: "Full protocol understanding, enables all attacks" },
        { vector: "Jamming — brute force denial of service", difficulty: "LOW", impact: "Loss of control link" },
        { vector: "GPS spoofing — redirect autonomous navigation", difficulty: "MEDIUM", impact: "Redirect or crash drone" },
      );
    }

    return json({
      protocol,
      description: proto.description,
      frequencies: proto.frequencies,
      modulation: proto.modulation,
      encryption: proto.encryption,
      knownVulnerabilities: proto.knownVulnerabilities,
      attackVectors,
      detectionSignature: proto.detectionSignature,
      analysisTools: proto.tools,
      analysisMethodology: [
        "1. Capture raw RF signal with SDR: hackrf_transfer -r capture.raw -f <freq> -s <sample_rate>",
        "2. Analyze signal in SDR++ or inspectrum for modulation identification",
        "3. Demodulate using appropriate GNU Radio flowgraph",
        "4. Use Universal Radio Hacker (URH) for protocol analysis",
        "5. Identify packet structure, headers, addressing, and payload",
        "6. Compare with known protocol specifications or open-source implementations",
        "7. Test for encryption: entropy analysis of payload data",
        "8. Document findings and report vulnerabilities responsibly",
      ],
    });
  },
};

// ─── Tool 3: drone_rf_counter ───

const droneRfCounter: ToolDef = {
  name: "drone_rf_counter",
  description:
    "Counter-drone RF techniques for authorized use. Returns jamming, spoofing, and takeover methodologies with legal considerations.",
  schema: {},
  async execute(): Promise<ToolResult> {
    return json({
      overview: "Counter-drone RF techniques are used by military, law enforcement, and authorized security teams to neutralize unauthorized drone threats. These techniques are heavily regulated and illegal for unauthorized use in most jurisdictions.",
      techniques: [
        {
          name: "RF Jamming (Denial of Service)",
          description: "Transmit noise or interference on the drone's control frequency to disrupt the communication link. Drone typically enters fail-safe mode (hover, return-to-home, or land).",
          methodology: [
            "1. Identify drone communication frequency (2.4 GHz, 5.8 GHz, 900 MHz)",
            "2. Configure jammer for target frequency band",
            "3. Transmit wideband noise to cover FHSS hopping range",
            "4. Drone loses control link and enters fail-safe behavior",
            "5. Maintain jamming until drone lands or leaves area",
          ],
          requirements: ["High-power RF transmitter (>1W) on target frequency", "Directional antenna for focused jamming", "Authorization from relevant authorities"],
          effectiveness: "HIGH — works against all radio-based control systems",
          sideEffects: ["Disrupts ALL WiFi/Bluetooth devices in area", "May affect other legitimate radio systems", "Collateral impact on communications"],
          legality: "ILLEGAL in most countries without government authorization. FCC Section 333 prohibits civilian jamming in the US.",
        },
        {
          name: "GPS Spoofing (Navigation Manipulation)",
          description: "Broadcast fake GPS signals to override the drone's GPS receiver. Redirect the drone to a controlled location, force landing, or cause navigation errors.",
          methodology: [
            "1. Generate fake GPS signal for desired coordinates: gps-sdr-sim -e brdc.14n -l <lat>,<lon>,<alt> -o gps.bin",
            "2. Broadcast via SDR: hackrf_transfer -t gps.bin -f 1575420000 -s 2600000",
            "3. Drone GPS receiver locks onto stronger fake signal",
            "4. Gradually shift fake position to redirect drone",
            "5. Option: spoof GPS altitude to force descent/landing",
          ],
          requirements: ["HackRF One or similar SDR with TX capability", "GPS signal simulator software (gps-sdr-sim)", "Knowledge of target drone's GPS receiver characteristics"],
          effectiveness: "MEDIUM — modern drones use multi-GNSS and IMU fusion which partially resists spoofing",
          sideEffects: ["Affects ALL GPS receivers in the area", "May disrupt navigation for aircraft, vehicles, phones"],
          legality: "ILLEGAL — GPS spoofing is a federal crime in most countries. Only authorized for military/government use.",
        },
        {
          name: "Protocol Exploitation (Control Takeover)",
          description: "Exploit vulnerabilities in the drone's communication protocol to take over control. Most effective against WiFi-based drones.",
          methodology: [
            "WiFi drones:",
            "1. Identify drone's WiFi AP (SSID scan for drone naming patterns)",
            "2. Deauth legitimate controller: aireplay-ng -0 20 -a <drone_bssid> wlan0mon",
            "3. Connect to drone WiFi AP (crack PSK if needed, or use default credentials)",
            "4. Install drone control app and send commands directly",
            "",
            "Custom protocol drones:",
            "1. Reverse engineer control protocol with SDR",
            "2. Identify authentication mechanism (or lack thereof)",
            "3. Craft control packets using discovered protocol",
            "4. Transmit at higher power to override legitimate controller",
          ],
          requirements: ["WiFi adapter with monitor mode and injection", "Protocol knowledge for non-WiFi drones", "SDR for protocol analysis"],
          effectiveness: "HIGH for WiFi drones, LOW-MEDIUM for encrypted protocols (OcuSync, Crossfire)",
          sideEffects: ["Minimal — targeted at specific drone"],
          legality: "May violate computer fraud laws even in authorized testing. Requires explicit authorization.",
        },
        {
          name: "Directed Energy / Signal Override",
          description: "Use high-power directional RF transmission to overwhelm the drone's receiver on the control channel. The stronger signal overrides the legitimate controller.",
          methodology: [
            "1. Determine drone's control frequency via spectrum analysis",
            "2. Configure high-power transmitter with directional antenna",
            "3. Transmit on drone's control frequency with valid-looking protocol data",
            "4. Drone receiver captures attacker's signal instead of legitimate controller",
            "5. Requires knowledge of control protocol for meaningful commands",
          ],
          requirements: ["High-power RF transmitter", "Directional antenna (Yagi, horn, or phased array)", "Protocol knowledge for the target drone"],
          effectiveness: "MEDIUM — requires protocol knowledge and sufficient power",
          sideEffects: ["High-power transmission disrupts other nearby systems"],
          legality: "ILLEGAL — unauthorized high-power transmission violates spectrum regulations.",
        },
      ],
      commercialCounterDroneSystems: [
        { system: "DJI AeroScope", description: "DJI's own drone detection system. Detects DJI drones via DroneID protocol. Detection only — no counter capability.", type: "Detection" },
        { system: "DroneShield DroneGun", description: "Handheld drone jammer. Jams GPS, 2.4 GHz, 5.8 GHz. Force drone to land or RTH.", type: "Jamming" },
        { system: "Dedrone DroneTracker", description: "Multi-sensor detection platform (RF, radar, camera, acoustic). Enterprise grade.", type: "Detection" },
        { system: "Blighter AUDS", description: "Anti-UAV Defence System. Radar detection + directional RF jamming.", type: "Detection + Jamming" },
        { system: "Black Sage", description: "AI-powered counter-drone with radar, EO/IR, RF detection, and defeat capability.", type: "Full spectrum" },
      ],
      legalFramework: {
        us: "FAA and FCC regulate counter-drone activities. Only DOD, DOJ, DHS, DOE authorized under 2018 FAA Reauthorization Act. Civilian jamming prohibited under 47 USC 333.",
        eu: "National regulations vary. Generally prohibited for civilians. Military and law enforcement may be authorized.",
        uk: "Drone disruption regulated under Air Navigation Order. Only authorized personnel at specific locations (airports, prisons).",
        general: "NEVER conduct counter-drone operations without explicit government or military authorization. Unauthorized jamming and spoofing carry severe criminal penalties.",
      },
    });
  },
};

// ─── Export All Drone RF Tools ───

export const droneRfTools: ToolDef[] = [
  droneRfDetect,
  droneRfAnalyze,
  droneRfCounter,
];

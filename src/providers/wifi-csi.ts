import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ─── Tool 1: wifi_csi_techniques ───

const wifiCsiTechniques: ToolDef = {
  name: "wifi_csi_techniques",
  description:
    "Overview of WiFi Channel State Information (CSI) sensing techniques. Covers through-wall sensing, gesture recognition, person detection, and activity recognition using WiFi signal analysis.",
  schema: {},
  async execute(): Promise<ToolResult> {
    return json({
      overview: "WiFi Channel State Information (CSI) captures fine-grained amplitude and phase data from OFDM subcarriers. Changes in CSI reveal movements, breathing, gestures, and presence of people — even through walls — without any cameras or wearable sensors.",
      fundamentals: {
        whatIsCsi: "CSI describes the channel frequency response between WiFi transmitter and receiver across all OFDM subcarriers. Each subcarrier provides amplitude and phase information affected by multipath reflections.",
        howItWorks: [
          "WiFi signals reflect off human bodies creating multipath components",
          "Body movements change these multipath reflections",
          "CSI captures these changes across 52+ OFDM subcarriers (802.11n) or 256+ (802.11ac/ax)",
          "Machine learning models classify CSI patterns into activities, gestures, or presence",
        ],
        resolution: "Sub-wavelength resolution (~6cm at 5GHz) enables detecting breathing, hand gestures, and fine-grained movements",
      },
      sensingCapabilities: [
        {
          capability: "Through-Wall Person Detection",
          description: "Detect presence of people through walls using WiFi CSI. WiFi signals penetrate drywall, wood, and thin concrete.",
          accuracy: "85-95% detection accuracy through single drywall wall",
          range: "5-15 meters through typical building walls",
          requirements: "One WiFi transmitter + one WiFi receiver (can use existing APs)",
        },
        {
          capability: "Person Counting",
          description: "Count the number of people in a room by analyzing CSI variance patterns. Each person adds multipath components.",
          accuracy: "80-90% for 1-5 people",
          range: "Same room or adjacent room",
          requirements: "Multiple receiver positions improve accuracy",
        },
        {
          capability: "Activity Recognition",
          description: "Classify human activities (walking, sitting, falling, cooking, exercising) from CSI patterns using trained ML models.",
          accuracy: "85-95% for trained activities",
          range: "3-10 meters",
          requirements: "Training data for each activity, ML model (CNN/LSTM common)",
        },
        {
          capability: "Gesture Recognition",
          description: "Recognize hand gestures and sign language from fine-grained CSI variations. Enables contactless device control.",
          accuracy: "80-95% for predefined gesture set",
          range: "1-5 meters",
          requirements: "5 GHz WiFi preferred (higher resolution), extensive training data",
        },
        {
          capability: "Breathing and Vital Signs",
          description: "Detect breathing rate and heart rate through minute chest movements reflected in CSI phase data.",
          accuracy: "Breathing: 90-98%, Heart rate: 70-85%",
          range: "1-5 meters",
          requirements: "Stable environment, minimal other movement, high CSI sampling rate",
        },
        {
          capability: "Keystroke Recognition",
          description: "Infer keystrokes on a keyboard by analyzing CSI changes caused by finger/hand movements during typing.",
          accuracy: "70-90% for individual keys (research-stage)",
          range: "1-3 meters",
          requirements: "High CSI sampling rate, line of sight preferred, extensive training",
        },
        {
          capability: "Indoor Localization",
          description: "Determine location within a building using CSI fingerprinting. WiFi CSI provides sub-meter positioning accuracy.",
          accuracy: "0.5-2 meter positioning accuracy",
          range: "Building-wide with sufficient AP density",
          requirements: "CSI fingerprint database for each location, multiple APs",
        },
      ],
      hardwareAndTools: {
        csiExtraction: [
          { platform: "Intel 5300 NIC (IWL5300)", description: "Classic CSI extraction tool. Provides 30 subcarrier groups. Linux only.", tool: "Linux 802.11n CSI Tool", url: "https://dhalperi.github.io/linux-80211n-csitool/" },
          { platform: "Atheros AR9xxx", description: "CSI extraction via modified firmware. Provides per-subcarrier CSI.", tool: "Atheros CSI Tool", url: "https://wands.sg/research/wifi/AthesCSI/" },
          { platform: "Nexmon (Broadcom)", description: "Nexmon firmware patch extracts CSI from Broadcom chips (Raspberry Pi, Nexus 5). Most accessible option.", tool: "nexmon_csi", url: "https://github.com/seemoo-lab/nexmon_csi" },
          { platform: "ESP32", description: "ESP32 WiFi SoC can extract CSI data. Low-cost option for CSI sensing.", tool: "ESP32 CSI Tool", url: "https://github.com/espressif/esp-csi" },
        ],
        mlFrameworks: [
          "TensorFlow/Keras for CNN/LSTM-based CSI classification",
          "PyTorch for research-grade CSI processing",
          "scikit-learn for classical ML approaches (SVM, Random Forest)",
        ],
      },
      researchReferences: [
        "WiFinger: Leveraging Commodity WiFi for Fine-grained Finger Gesture Recognition (MobiHoc 2016)",
        "WiGest: A Ubiquitous WiFi-based Gesture Recognition System (INFOCOM 2015)",
        "Wi-Sleep: Contactless Sleep Monitoring via WiFi Signals (IEEE TMC 2017)",
        "Through-Wall Human Pose Estimation Using Radio Signals (CVPR 2018)",
        "WiKey: Keystroke Recognition Using WiFi (MobiCom 2015)",
      ],
    });
  },
};

// ─── Tool 2: wifi_csi_privacy ───

const SCENARIO_PRIVACY: Record<string, { surveillanceCapabilities: string[]; privacyRisks: string[]; threatActors: string[]; countermeasures: string[] }> = {
  home: {
    surveillanceCapabilities: [
      "Detect occupancy and number of residents from outside the home through walls",
      "Monitor daily activity patterns (sleep, wake, meal times)",
      "Detect breathing/vital signs indicating health conditions",
      "Identify specific individuals by gait/movement patterns",
      "Infer activities (cooking, exercising, intimate activities)",
      "Map room layout based on signal reflections",
    ],
    privacyRisks: [
      "Stalking: Ex-partner or stalker can monitor presence from outside",
      "Burglary planning: Determine when home is empty",
      "Surveillance without warrant: No camera or microphone needed",
      "Health monitoring: Insurance companies could assess health without consent",
      "Behavioral profiling: Patterns reveal lifestyle details",
      "Smart home APs already collect CSI data — vendor data practices matter",
    ],
    threatActors: [
      "Domestic abusers/stalkers",
      "Burglars and property criminals",
      "Law enforcement (without warrant)",
      "Insurance companies",
      "Smart home device vendors (data collection)",
      "Neighbors with WiFi equipment",
    ],
    countermeasures: [
      "Use 5 GHz only (shorter range, more wall attenuation)",
      "Reduce AP transmit power to minimum functional level",
      "Position APs centrally (away from exterior walls)",
      "Use WiFi-absorbing paint or window film on exterior walls",
      "Deploy WiFi noise generators to mask CSI patterns",
      "Disable CSI collection in router firmware where possible",
      "Use wired (Ethernet) connections instead of WiFi",
      "Monitor for unknown WiFi devices near your home",
    ],
  },
  office: {
    surveillanceCapabilities: [
      "Monitor employee presence and location within office",
      "Track meeting room occupancy and who is meeting with whom",
      "Detect employee activity levels and movement patterns",
      "Infer work habits (active typing vs. idle, breaks)",
      "Monitor after-hours presence (overtime, unauthorized access)",
      "Through-wall monitoring of private offices and restrooms",
    ],
    privacyRisks: [
      "Employer surveillance exceeding reasonable monitoring boundaries",
      "Tracking bathroom breaks and private activities",
      "Monitoring union activities or private meetings",
      "Discrimination based on movement/health data",
      "Data breach exposing employee behavioral patterns",
      "Third-party WiFi analytics vendors collecting and reselling data",
    ],
    threatActors: [
      "Employers (overreaching monitoring)",
      "Corporate espionage (competitor surveillance)",
      "WiFi analytics vendors (data brokers)",
      "Building management (landlord monitoring tenants)",
      "APT groups targeting corporate secrets via behavioral analysis",
    ],
    countermeasures: [
      "Implement WiFi privacy policy explicitly addressing CSI/sensing",
      "Disable WiFi sensing features in enterprise APs (Cisco, Aruba settings)",
      "Use VPN and encrypted DNS to prevent metadata analysis",
      "Audit WiFi analytics vendor data practices",
      "Provide wired connections in private offices",
      "Deploy RF-absorbing materials in sensitive meeting rooms",
      "Regular wireless security audits including CSI assessment",
      "Employee notification about WiFi sensing capabilities",
    ],
  },
  public: {
    surveillanceCapabilities: [
      "Crowd counting and flow analysis in public spaces",
      "Individual tracking across WiFi zones (malls, airports, stadiums)",
      "Behavioral analysis for targeted advertising",
      "Security monitoring (detect abandoned bags, fights)",
      "Dwell time analysis at store displays or exhibits",
      "Through-wall monitoring from adjacent public spaces",
    ],
    privacyRisks: [
      "Mass surveillance without consent or awareness",
      "Individual tracking across locations and time",
      "Behavioral profiling for advertising or social scoring",
      "Law enforcement surveillance without warrant",
      "Data retention of movement patterns indefinitely",
      "Combination with camera/facial recognition for identification",
    ],
    threatActors: [
      "Retail analytics companies",
      "Law enforcement and intelligence agencies",
      "Advertising technology companies",
      "Building/venue operators",
      "Authoritarian governments",
      "Data brokers",
    ],
    countermeasures: [
      "Turn off WiFi on mobile devices when not actively connected",
      "Use MAC randomization (enabled by default on modern iOS/Android)",
      "Use VPN to prevent traffic analysis",
      "Advocate for WiFi sensing regulation and consent requirements",
      "Use WiFi-absorbing phone cases",
      "Disable WiFi scanning for location services",
      "Support legislation requiring disclosure of WiFi sensing",
      "Prefer cellular data over public WiFi",
    ],
  },
};

const wifiCsiPrivacy: ToolDef = {
  name: "wifi_csi_privacy",
  description:
    "WiFi CSI privacy implications analysis for specific scenarios. Returns surveillance capabilities, privacy risks, threat actors, and countermeasures.",
  schema: {
    scenario: z
      .enum(["home", "office", "public"])
      .describe("Environment scenario to assess for WiFi CSI privacy implications"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const scenario = args.scenario as string;

    const analysis = SCENARIO_PRIVACY[scenario];
    if (!analysis) {
      return text(`Unknown scenario: ${scenario}. Use: home, office, or public`);
    }

    return json({
      scenario,
      surveillanceCapabilities: analysis.surveillanceCapabilities,
      privacyRisks: analysis.privacyRisks,
      threatActors: analysis.threatActors,
      countermeasures: analysis.countermeasures,
      legalConsiderations: [
        "WiFi CSI sensing may not be covered by existing wiretap/surveillance laws",
        "No physical intrusion required — surveillance possible from public space",
        "GDPR/CCPA may apply if data is linked to identifiable individuals",
        "US: Fourth Amendment applicability unclear for WiFi sensing",
        "EU: GDPR Article 9 may apply if health data is inferred",
        "Building codes and spectrum regulations do not address WiFi sensing",
      ],
      emergingRegulation: [
        "No specific regulation exists for WiFi CSI sensing as of 2025",
        "FCC and EU regulators have not addressed passive WiFi sensing",
        "NIST is researching WiFi sensing privacy frameworks",
        "Academic community calling for WiFi sensing privacy standards",
      ],
    });
  },
};

// ─── Tool 3: wifi_csi_detect ───

const wifiCsiDetect: ToolDef = {
  name: "wifi_csi_detect",
  description:
    "Detect WiFi CSI-based surveillance. Returns indicators of CSI sensing activity, detection methods, and tools.",
  schema: {},
  async execute(): Promise<ToolResult> {
    return json({
      overview: "Detecting WiFi CSI surveillance is challenging because it uses standard WiFi signals — the attacker may simply be a passive listener or use normal WiFi traffic. However, some indicators can suggest CSI-based sensing.",
      indicatorsOfCsiSurveillance: [
        {
          indicator: "Unusual WiFi Probe Requests",
          description: "CSI sensing may involve continuous probe requests to measure channel response. Look for high-frequency probes from unknown devices.",
          detectionMethod: "Monitor with airodump-ng or Kismet for devices sending excessive probe requests",
          reliability: "Low — probes are common from legitimate devices",
        },
        {
          indicator: "Nearby Devices in Monitor Mode",
          description: "CSI extraction requires monitor mode on many platforms. Detect devices in monitor mode via their lack of normal WiFi traffic.",
          detectionMethod: "Look for WiFi adapters that receive but never transmit (fully passive) — harder to detect than active scanning",
          reliability: "Very Low — monitor mode is fully passive",
        },
        {
          indicator: "Modified Access Points",
          description: "CSI sensing may use modified AP firmware (OpenWrt + nexmon_csi, custom firmware). Check for non-standard APs near your premises.",
          detectionMethod: "Scan for rogue APs with unusual capabilities or firmware signatures",
          reliability: "Medium — if you detect an unauthorized AP with CSI firmware",
        },
        {
          indicator: "High-Rate WiFi Traffic to Nowhere",
          description: "Some CSI sensing techniques inject traffic to stimulate channel measurements. Look for WiFi frames that seem purposeless.",
          detectionMethod: "Analyze WiFi traffic patterns with Wireshark for anomalous frame rates or destinations",
          reliability: "Low-Medium — legitimate WiFi traffic is also high-rate",
        },
        {
          indicator: "ESP32 or Raspberry Pi Near Premises",
          description: "Common CSI sensing platforms include ESP32 and Raspberry Pi with Nexmon firmware. Unknown IoT devices near your area may indicate sensing.",
          detectionMethod: "Physical inspection and WiFi scanning for ESP32/RPi MAC prefixes (Espressif: B0:A7:32, CC:50:E3; RPi: B8:27:EB, DC:A6:32, E4:5F:01)",
          reliability: "Medium — these devices have many legitimate uses",
        },
      ],
      detectionTools: [
        { tool: "Kismet", command: "kismet -c wlan0", description: "Wireless IDS that detects rogue APs and unusual WiFi activity" },
        { tool: "airodump-ng", command: "airodump-ng wlan0mon", description: "Monitor for devices sending excessive probes or in monitor mode" },
        { tool: "Wireshark", command: "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x04'", description: "Capture and filter probe requests" },
        { tool: "nmap", command: "nmap -sP --host-timeout 5s <network/24>", description: "Discover unknown devices on the network" },
      ],
      defenseMeasures: [
        "Reduce WiFi transmit power to minimum functional level",
        "Use 5 GHz / 6 GHz bands (shorter range, higher wall attenuation)",
        "Deploy WiFi noise/interference to degrade CSI quality (last resort — affects your own WiFi too)",
        "Use wired Ethernet instead of WiFi for sensitive activities",
        "Deploy RF-absorbing materials on walls facing public areas",
        "Use mesh WiFi with beamforming — reduces signal leakage outside intended coverage",
        "Regularly scan for unknown devices and rogue APs",
        "Keep WiFi firmware updated to disable CSI extraction where vendors provide the option",
      ],
      limitations: [
        "Fully passive CSI sensing (receive-only) is virtually undetectable",
        "CSI extraction from existing AP traffic requires no additional transmissions",
        "No reliable way to distinguish CSI sensing from normal WiFi reception",
        "Counter-surveillance is primarily about reducing signal availability, not detection",
      ],
    });
  },
};

// ─── Export All WiFi CSI Tools ───

export const wifiCsiTools: ToolDef[] = [
  wifiCsiTechniques,
  wifiCsiPrivacy,
  wifiCsiDetect,
];

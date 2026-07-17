import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ─── Air-Gap Exfiltration Techniques Database ───

interface AirGapTechnique {
  id: string;
  name: string;
  category: "electromagnetic" | "acoustic" | "optical" | "thermal" | "magnetic";
  description: string;
  dataRate: string;
  maxRange: string;
  prerequisites: string[];
  implantRequired: boolean;
  detectable: boolean;
  references: string[];
}

const AIRGAP_TECHNIQUES: AirGapTechnique[] = [
  {
    id: "air_fi",
    name: "AIR-FI (WiFi Emanation from RAM)",
    category: "electromagnetic",
    description: "Generate WiFi signals from DDR SDRAM memory bus by crafting specific memory access patterns. The emanations can be picked up by nearby WiFi receivers without any WiFi hardware on the air-gapped machine.",
    dataRate: "1-100 bit/s",
    maxRange: "1-2 meters",
    prerequisites: ["Malware on air-gapped machine", "WiFi-capable receiver nearby (smartphone, laptop)"],
    implantRequired: true,
    detectable: true,
    references: ["https://arxiv.org/abs/2012.06884"],
  },
  {
    id: "lantenna",
    name: "LANTENNA (Ethernet Cable as Antenna)",
    category: "electromagnetic",
    description: "Use Ethernet cables as antennas to emanate RF signals from an air-gapped computer. Malware modulates data onto the cable's EM emissions, received by a nearby SDR.",
    dataRate: "1-100 bit/s",
    maxRange: "1-2 meters",
    prerequisites: ["Malware on air-gapped machine", "Connected Ethernet cable (even if network is air-gapped)", "SDR receiver nearby"],
    implantRequired: true,
    detectable: true,
    references: ["https://arxiv.org/abs/2110.00104"],
  },
  {
    id: "satanbus",
    name: "SATAn (SATA Cable Emanation)",
    category: "electromagnetic",
    description: "Use SATA cables as RF antennas by manipulating disk read/write operations to generate controlled electromagnetic emanations at specific frequencies.",
    dataRate: "1-10 bit/s",
    maxRange: "1-1.2 meters",
    prerequisites: ["Malware on air-gapped machine", "SATA-connected storage device", "SDR receiver nearby"],
    implantRequired: true,
    detectable: true,
    references: ["https://arxiv.org/abs/2209.11027"],
  },
  {
    id: "fansmitter",
    name: "Fansmitter (Fan Noise Modulation)",
    category: "acoustic",
    description: "Modulate computer fan speed to encode data in acoustic signals. The sound variations are imperceptible to humans but can be decoded by a nearby microphone (e.g., smartphone).",
    dataRate: "3-15 bit/s",
    maxRange: "0-8 meters",
    prerequisites: ["Malware on air-gapped machine with controllable fan", "Microphone-equipped device nearby (smartphone)"],
    implantRequired: true,
    detectable: true,
    references: ["https://arxiv.org/abs/1606.05915"],
  },
  {
    id: "diskfiltration",
    name: "DiskFiltration (HDD Acoustic Exfiltration)",
    category: "acoustic",
    description: "Manipulate hard disk drive actuator arm movements to generate controlled acoustic signals. The seeking sounds encode data that can be recorded by a nearby microphone.",
    dataRate: "10-180 bit/s",
    maxRange: "0-2 meters",
    prerequisites: ["Malware on air-gapped machine with HDD (not SSD)", "Microphone-equipped device nearby"],
    implantRequired: true,
    detectable: true,
    references: ["https://arxiv.org/abs/1608.03431"],
  },
  {
    id: "ultrasonic",
    name: "Ultrasonic Data Exfiltration",
    category: "acoustic",
    description: "Use computer speakers or piezo buzzers to emit data on ultrasonic frequencies (>18 kHz) inaudible to humans. Received by a nearby microphone capable of recording above 18 kHz.",
    dataRate: "100-2000 bit/s",
    maxRange: "1-10 meters",
    prerequisites: ["Malware on air-gapped machine with speaker/buzzer", "Recording device with ultrasonic microphone capability"],
    implantRequired: true,
    detectable: true,
    references: [],
  },
  {
    id: "brightness",
    name: "Brightness (Screen Brightness Modulation)",
    category: "optical",
    description: "Modulate LCD screen brightness at imperceptible levels to encode data. A nearby camera (security camera, drone) captures the brightness variations and decodes the signal.",
    dataRate: "5-10 bit/s",
    maxRange: "1-30 meters (line of sight)",
    prerequisites: ["Malware on air-gapped machine with LCD display", "Camera with line of sight to screen"],
    implantRequired: true,
    detectable: false,
    references: ["https://arxiv.org/abs/2002.01078"],
  },
  {
    id: "led_exfil",
    name: "LED Exfiltration (HDD/Keyboard LED)",
    category: "optical",
    description: "Blink HDD activity LED, keyboard LEDs (Caps Lock, Num Lock), or other indicator LEDs at high speed to transmit data. A camera or optical sensor nearby captures the blinking pattern.",
    dataRate: "10-4000 bit/s (LED dependent)",
    maxRange: "1-50 meters (line of sight)",
    prerequisites: ["Malware on air-gapped machine", "Camera or optical sensor with line of sight to LEDs"],
    implantRequired: true,
    detectable: true,
    references: ["https://arxiv.org/abs/1706.01140"],
  },
  {
    id: "bitwhisper",
    name: "BitWhisper (Thermal Covert Channel)",
    category: "thermal",
    description: "Use CPU-induced thermal emanations to communicate between two adjacent computers. Modulate workload to change temperature, detected by the neighboring machine's thermal sensors.",
    dataRate: "1-8 bit/hour",
    maxRange: "0-40 centimeters",
    prerequisites: ["Malware on BOTH air-gapped machine AND adjacent computer", "Machines must be physically adjacent (within 40cm)"],
    implantRequired: true,
    detectable: true,
    references: ["https://arxiv.org/abs/1503.07919"],
  },
  {
    id: "magneto",
    name: "MAGNETO (Magnetic Field Emanation)",
    category: "magnetic",
    description: "Generate controlled magnetic field emanations from CPU by executing specific instruction sequences. Magnetic signals pass through Faraday cages, received by a magnetic sensor nearby.",
    dataRate: "1-40 bit/s",
    maxRange: "0.5-1.5 meters",
    prerequisites: ["Malware on air-gapped machine", "Magnetic sensor (smartphone magnetometer) nearby"],
    implantRequired: true,
    detectable: true,
    references: ["https://arxiv.org/abs/1802.02317"],
  },
  {
    id: "odini",
    name: "ODINI (Magnetic Field from Faraday Cage)",
    category: "magnetic",
    description: "Similar to MAGNETO but specifically designed to bypass Faraday cages. Low-frequency magnetic fields penetrate conductive shielding, allowing exfiltration from shielded rooms.",
    dataRate: "1-40 bit/s",
    maxRange: "1-1.5 meters (through Faraday cage)",
    prerequisites: ["Malware on air-gapped machine inside Faraday cage", "Magnetic sensor outside the cage"],
    implantRequired: true,
    detectable: true,
    references: ["https://arxiv.org/abs/1802.02700"],
  },
  {
    id: "power_line",
    name: "PowerHammer (Power Line Exfiltration)",
    category: "electromagnetic",
    description: "Modulate power consumption of the air-gapped computer to encode data on the power line. Measure current fluctuations at the electrical panel or power outlet to decode the signal.",
    dataRate: "10-1000 bit/s",
    maxRange: "Power line distance (building-wide)",
    prerequisites: ["Malware on air-gapped machine", "Access to power line (same circuit) or electrical panel"],
    implantRequired: true,
    detectable: true,
    references: ["https://arxiv.org/abs/1804.04014"],
  },
  {
    id: "usb_emanation",
    name: "USBee (USB Emanation)",
    category: "electromagnetic",
    description: "Generate controlled RF emanations from USB data bus by crafting specific USB transfer patterns. The USB cable/connector acts as an antenna, emanating a modulated signal.",
    dataRate: "20-80 bit/s",
    maxRange: "1-2 meters",
    prerequisites: ["Malware on air-gapped machine", "USB device connected (flash drive, etc.)", "SDR receiver nearby"],
    implantRequired: true,
    detectable: true,
    references: ["https://arxiv.org/abs/1608.08397"],
  },
];

// ─── Tool 1: airgap_techniques ───

const airgapTechniques: ToolDef = {
  name: "airgap_techniques",
  description:
    "List air-gap exfiltration techniques. Returns known methods for exfiltrating data from air-gapped computers, including data rates, range, and prerequisites.",
  schema: {
    category: z
      .enum(["electromagnetic", "acoustic", "optical", "thermal", "magnetic"])
      .optional()
      .describe("Filter by exfiltration category"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const category = args.category as string | undefined;

    let techniques = [...AIRGAP_TECHNIQUES];
    if (category) {
      techniques = techniques.filter((t) => t.category === category);
    }

    if (techniques.length === 0) {
      return text(`No techniques found for category: ${category}`);
    }

    return json({
      total: techniques.length,
      filter: category ?? "all",
      techniques: techniques.map((t) => ({
        id: t.id,
        name: t.name,
        category: t.category,
        dataRate: t.dataRate,
        maxRange: t.maxRange,
        implantRequired: t.implantRequired,
        detectable: t.detectable,
        description: t.description,
        prerequisites: t.prerequisites,
        references: t.references,
      })),
      categoryStats: {
        electromagnetic: AIRGAP_TECHNIQUES.filter((t) => t.category === "electromagnetic").length,
        acoustic: AIRGAP_TECHNIQUES.filter((t) => t.category === "acoustic").length,
        optical: AIRGAP_TECHNIQUES.filter((t) => t.category === "optical").length,
        thermal: AIRGAP_TECHNIQUES.filter((t) => t.category === "thermal").length,
        magnetic: AIRGAP_TECHNIQUES.filter((t) => t.category === "magnetic").length,
      },
    });
  },
};

// ─── Tool 2: airgap_assess ───

const ENVIRONMENT_PROFILES: Record<string, { securityLevel: string; physicalControls: string[]; existingMitigations: string[]; commonWeaknesses: string[] }> = {
  scif: {
    securityLevel: "TOP SECRET / SCI — Highest security",
    physicalControls: [
      "Faraday cage / RF shielded room",
      "TEMPEST-certified equipment",
      "No electronic devices allowed in/out",
      "Armed guards and mantrap entry",
      "Continuous TSCM (Technical Surveillance Countermeasures) sweeps",
      "No windows or controlled window shielding",
    ],
    existingMitigations: [
      "TEMPEST/EMSEC controls block most EM exfiltration",
      "Faraday cage blocks WiFi/cellular/Bluetooth",
      "No personal devices reduce insider implant risk",
      "Air-gapped networks with no external connectivity",
    ],
    commonWeaknesses: [
      "Magnetic fields penetrate Faraday cages (ODINI/MAGNETO attacks)",
      "Power line exfiltration bypasses RF shielding (PowerHammer)",
      "Supply chain compromise of hardware before installation",
      "Insider threat with physical access",
      "Maintenance/update procedures may temporarily break air-gap",
    ],
  },
  datacenter: {
    securityLevel: "HIGH — Enterprise critical infrastructure",
    physicalControls: [
      "Badge access control",
      "Security cameras (CCTV)",
      "Environmental monitoring (temperature, humidity)",
      "Visitor escort policy",
      "Cable management and labeling",
    ],
    existingMitigations: [
      "Network segmentation (air-gapped segments may exist)",
      "SIEM and log monitoring",
      "Change management procedures",
      "Regular security audits",
    ],
    commonWeaknesses: [
      "Acoustic exfiltration in noisy datacenter environment (masked by fan noise)",
      "EM emanations from dense server racks",
      "Power line shared across security zones",
      "USB devices used for firmware updates / maintenance",
      "Temporary network connections for updates",
      "Many devices with LEDs in line of sight to cameras",
    ],
  },
  office: {
    securityLevel: "MEDIUM — Standard corporate environment",
    physicalControls: [
      "Badge access to building",
      "Security cameras at entrances",
      "Basic visitor management",
      "Clean desk policy (varies)",
    ],
    existingMitigations: [
      "Endpoint protection (EDR/AV)",
      "Network monitoring",
      "USB device restrictions (policy, not always enforced)",
    ],
    commonWeaknesses: [
      "All air-gap exfiltration categories applicable",
      "Personal devices (smartphones) always nearby — act as receivers",
      "USB devices frequently connected",
      "Minimal RF shielding",
      "Line of sight to screens from windows/cameras",
      "Shared power circuits with public areas",
    ],
  },
  industrial: {
    securityLevel: "HIGH — OT/ICS critical infrastructure",
    physicalControls: [
      "Perimeter fencing",
      "CCTV surveillance",
      "Restricted access areas",
      "Safety-related access controls",
    ],
    existingMitigations: [
      "Air-gapped OT networks (Purdue model Level 3.5)",
      "Data diodes for one-way data transfer",
      "Historian servers for controlled data export",
      "ICS-specific IDS/IPS",
    ],
    commonWeaknesses: [
      "Maintenance laptops bridging air-gap during updates",
      "USB drives for PLC programming and updates",
      "Vendor remote access (temporary connections)",
      "Legacy systems without security updates",
      "EM emanations from industrial equipment (noisy RF environment)",
      "Long cable runs acting as antennas",
    ],
  },
};

const ACCESS_VECTORS: Record<string, string[]> = {
  physical: [
    "Direct USB implant (Rubber Ducky, USB Armory)",
    "Hardware implant during maintenance",
    "Compromised replacement parts",
    "Rogue device placement near target",
    "Camera/sensor placement for optical exfiltration",
  ],
  supply_chain: [
    "Compromised hardware before deployment",
    "Malicious firmware in storage devices",
    "Backdoored BIOS/UEFI",
    "Tampered network equipment",
    "Compromised manufacturing process",
  ],
  insider: [
    "Authorized user installing malware via USB",
    "Maintenance personnel with system access",
    "Social engineering of privileged users",
    "Disgruntled employee with knowledge of systems",
    "Contractor with temporary access",
  ],
};

const airgapAssess: ToolDef = {
  name: "airgap_assess",
  description:
    "Assess air-gap exfiltration feasibility for a specific target environment. Returns applicable techniques, access vectors, and environment-specific risks.",
  schema: {
    target_environment: z
      .enum(["scif", "datacenter", "office", "industrial"])
      .describe("Target environment type"),
    available_access: z
      .enum(["physical", "supply_chain", "insider"])
      .describe("Available access vector for implant delivery"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const environment = args.target_environment as string;
    const access = args.available_access as string;

    const envProfile = ENVIRONMENT_PROFILES[environment];
    const accessVectors = ACCESS_VECTORS[access];

    if (!envProfile || !accessVectors) {
      return text(`Invalid environment (${environment}) or access vector (${access})`);
    }

    // Determine applicable techniques based on environment
    const applicableTechniques = AIRGAP_TECHNIQUES.filter((t) => {
      if (environment === "scif") {
        // SCIF blocks EM but not magnetic/power-line
        return t.category === "magnetic" || t.id === "power_line";
      }
      return true; // All techniques potentially applicable in other environments
    });

    // Rank by feasibility
    const rankedTechniques = applicableTechniques
      .map((t) => {
        let feasibilityScore = 5;
        // Higher data rate = more practical
        const rateMatch = t.dataRate.match(/(\d+)/);
        if (rateMatch && parseInt(rateMatch[1]) > 100) feasibilityScore += 2;
        // Longer range = more practical
        const rangeMatch = t.maxRange.match(/(\d+)/);
        if (rangeMatch && parseInt(rangeMatch[1]) > 5) feasibilityScore += 1;
        // Not detectable = better
        if (!t.detectable) feasibilityScore += 2;
        return { ...t, feasibilityScore };
      })
      .sort((a, b) => b.feasibilityScore - a.feasibilityScore);

    return json({
      environment,
      accessVector: access,
      environmentProfile: {
        securityLevel: envProfile.securityLevel,
        physicalControls: envProfile.physicalControls,
        existingMitigations: envProfile.existingMitigations,
        commonWeaknesses: envProfile.commonWeaknesses,
      },
      implantDeliveryMethods: accessVectors,
      applicableTechniques: rankedTechniques.map((t) => ({
        id: t.id,
        name: t.name,
        category: t.category,
        dataRate: t.dataRate,
        maxRange: t.maxRange,
        feasibilityScore: t.feasibilityScore,
        detectable: t.detectable,
      })),
      overallFeasibility: environment === "scif" ? "LOW — very limited techniques applicable" : environment === "datacenter" ? "MEDIUM — many techniques applicable but detection risk" : "HIGH — most techniques applicable with minimal detection",
    });
  },
};

// ─── Tool 3: airgap_detect ───

const DETECTION_METHODS: Record<string, { description: string; detectionApproach: string[]; tools: string[]; indicators: string[]; falsePositiveRisk: string }> = {
  air_fi: {
    description: "Detect AIR-FI WiFi emanations from RAM",
    detectionApproach: [
      "Monitor 2.4 GHz band for anomalous WiFi-like signals not from known APs",
      "Use SDR to detect weak RF emanations near air-gapped machines",
      "Deploy WIDS (Wireless IDS) to detect unexpected WiFi beacons/frames",
      "Spectrum analysis for non-standard WiFi transmissions",
    ],
    tools: ["HackRF + GNU Radio spectrum analyzer", "WiFi IDS (Kismet)", "Commercial TSCM equipment", "Spectrum analyzer (2.4 GHz focused)"],
    indicators: ["Unexpected WiFi frames near air-gapped systems", "Weak RF signals at 2.4 GHz from non-WiFi equipment", "Anomalous memory access patterns on monitored systems"],
    falsePositiveRisk: "Low — WiFi signals from non-WiFi hardware are unusual",
  },
  lantenna: {
    description: "Detect LANTENNA Ethernet cable RF emanations",
    detectionApproach: [
      "Monitor RF emissions near Ethernet cables connecting air-gapped systems",
      "Use shielded (STP/FTP) Ethernet cables to reduce emanations",
      "Deploy EMI monitoring near cable runs",
      "Regular TSCM sweeps focusing on cable emanation points",
    ],
    tools: ["EMI probe + spectrum analyzer", "Near-field RF detector", "TEMPEST measurement equipment"],
    indicators: ["Modulated RF emissions correlated with network activity on air-gapped systems", "Unusual EM patterns from Ethernet cable runs"],
    falsePositiveRisk: "Medium — Ethernet cables naturally emit some RF",
  },
  satanbus: {
    description: "Detect SATAn SATA cable emanations",
    detectionApproach: [
      "Monitor RF emissions near SATA cables and drives",
      "Detect unusual disk access patterns (read/write not correlated with legitimate operations)",
      "Deploy host-based monitoring for suspicious I/O operations",
      "Use shielded SATA cables or switch to NVMe (no cable antenna)",
    ],
    tools: ["Host-based IDS with I/O monitoring", "EMI probe near SATA cables", "Process monitoring for unusual disk I/O"],
    indicators: ["Periodic disk I/O not correlated with running processes", "Modulated RF from SATA cable area", "Unusual disk access patterns at regular intervals"],
    falsePositiveRisk: "Medium — legitimate disk I/O can resemble exfiltration patterns",
  },
  fansmitter: {
    description: "Detect Fansmitter acoustic exfiltration via fan noise",
    detectionApproach: [
      "Monitor fan RPM for unexpected speed changes not correlated with CPU load",
      "Deploy acoustic monitoring (microphone + analysis) to detect fan speed modulation",
      "Compare fan speed changes against system thermal telemetry",
      "Lock fan speed in BIOS/UEFI where possible",
    ],
    tools: ["Hardware monitoring (lm-sensors, ipmitool)", "Acoustic analysis software", "Microphone with frequency analysis"],
    indicators: ["Fan speed changes not correlated with CPU temperature/load", "Periodic fan speed oscillation patterns", "Fan speed changes during idle periods"],
    falsePositiveRisk: "High — fans change speed due to many legitimate thermal reasons",
  },
  diskfiltration: {
    description: "Detect DiskFiltration HDD acoustic exfiltration",
    detectionApproach: [
      "Monitor disk I/O for access patterns not correlated with running processes",
      "Deploy acoustic monitoring to detect anomalous seeking patterns",
      "Replace HDDs with SSDs (SSDs have no moving parts — no acoustic exfiltration)",
      "Monitor SMART data for unusual seek activity",
    ],
    tools: ["iostat / iotop for I/O monitoring", "Acoustic analysis near server racks", "SMART monitoring tools"],
    indicators: ["Disk seeking during system idle", "Regular periodic seek patterns", "I/O operations not attributable to any process"],
    falsePositiveRisk: "Medium — disk defragmentation and indexing cause legitimate seeking",
  },
  brightness: {
    description: "Detect Brightness screen modulation exfiltration",
    detectionApproach: [
      "Monitor display brightness control API calls for unauthorized changes",
      "Deploy screen privacy filters to limit viewing angle",
      "Cover or dim displays when not in use",
      "Block line of sight from external cameras to screens",
    ],
    tools: ["Display brightness monitoring software", "Privacy screen filters", "Window treatments (blinds, curtains, IR-blocking film)"],
    indicators: ["Brightness API calls from non-authorized processes", "Micro-fluctuations in display output", "Brightness changes during screensaver or idle"],
    falsePositiveRisk: "Low — legitimate brightness changes are user-initiated",
  },
  led_exfil: {
    description: "Detect LED-based optical exfiltration",
    detectionApproach: [
      "Cover or disable HDD activity LED (tape over LED)",
      "Monitor keyboard LED state changes (Caps Lock, Num Lock, Scroll Lock)",
      "Block line of sight from cameras to device LEDs",
      "Deploy optical monitoring to detect high-frequency LED blinking",
    ],
    tools: ["LED monitoring scripts", "Optical sensor/photodetector near LEDs", "Camera with high frame rate pointed at LEDs"],
    indicators: ["High-frequency LED blinking not correlated with user activity", "Keyboard LED toggling during idle", "HDD LED patterns not matching disk I/O"],
    falsePositiveRisk: "Low — LEDs blinking at data-encoding frequencies are distinctive",
  },
  bitwhisper: {
    description: "Detect BitWhisper thermal covert channel",
    detectionApproach: [
      "Monitor ambient temperature near air-gapped systems for anomalies",
      "Enforce minimum physical distance between machines of different security levels",
      "Deploy temperature sensors between adjacent machines",
      "Monitor CPU utilization for unexplained thermal workloads",
    ],
    tools: ["Temperature sensors (USB thermal probes)", "HVAC monitoring integration", "CPU utilization monitoring"],
    indicators: ["Temperature fluctuations correlated between adjacent machines", "CPU load spikes not correlated with legitimate workload", "Periodic thermal patterns"],
    falsePositiveRisk: "High — environmental temperature changes are common",
  },
  magneto: {
    description: "Detect MAGNETO/ODINI magnetic field exfiltration",
    detectionApproach: [
      "Deploy magnetometers around air-gapped systems",
      "Monitor CPU instruction patterns for magnetic field generation sequences",
      "Use mu-metal shielding around sensitive systems (blocks magnetic fields)",
      "Maintain physical distance from potential magnetic receivers",
    ],
    tools: ["Magnetometer (smartphone-grade or professional)", "mu-metal shielding material", "CPU instruction monitoring (Intel PT, AMD IBS)"],
    indicators: ["Modulated magnetic field near air-gapped system", "Specific CPU instruction patterns that generate controlled magnetic fields", "Magnetic anomalies not correlated with legitimate CPU workload"],
    falsePositiveRisk: "Low — controlled magnetic field modulation is distinctive",
  },
  power_line: {
    description: "Detect PowerHammer power line exfiltration",
    detectionApproach: [
      "Monitor power consumption at the circuit breaker for anomalous patterns",
      "Use power line conditioner/UPS to isolate air-gapped systems from shared power",
      "Deploy power analysis monitoring on circuits serving air-gapped systems",
      "Use separate electrical circuits for air-gapped systems",
    ],
    tools: ["Power line analyzer / oscilloscope", "Smart power strip with monitoring", "UPS with power conditioning"],
    indicators: ["Modulated power consumption not correlated with CPU workload", "High-frequency power fluctuations on air-gapped system circuits", "Power consumption patterns during idle"],
    falsePositiveRisk: "Medium — power draw varies with legitimate workload",
  },
};

const airgapDetect: ToolDef = {
  name: "airgap_detect",
  description:
    "Detection methods for specific air-gap exfiltration techniques. Returns detection approaches, tools, indicators of compromise, and false positive assessment.",
  schema: {
    technique_id: z
      .enum(["air_fi", "lantenna", "satanbus", "fansmitter", "diskfiltration", "ultrasonic", "brightness", "led_exfil", "bitwhisper", "magneto", "odini", "power_line", "usb_emanation"])
      .describe("Air-gap exfiltration technique ID to get detection methods for"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const techniqueId = args.technique_id as string;

    // Handle aliases
    const lookupId = techniqueId === "odini" ? "magneto" : techniqueId === "ultrasonic" ? "fansmitter" : techniqueId === "usb_emanation" ? "lantenna" : techniqueId;

    const detection = DETECTION_METHODS[lookupId];
    if (!detection) {
      return text(`No detection guide for technique: ${techniqueId}. Available: ${Object.keys(DETECTION_METHODS).join(", ")}`);
    }

    const technique = AIRGAP_TECHNIQUES.find((t) => t.id === techniqueId) ?? AIRGAP_TECHNIQUES.find((t) => t.id === lookupId);

    return json({
      techniqueId,
      techniqueName: technique?.name ?? "Unknown",
      techniqueCategory: technique?.category ?? "unknown",
      description: detection.description,
      detectionApproach: detection.detectionApproach,
      recommendedTools: detection.tools,
      indicatorsOfCompromise: detection.indicators,
      falsePositiveRisk: detection.falsePositiveRisk,
      generalDetectionPrinciples: [
        "Monitor for process/activity anomalies on air-gapped systems",
        "Deploy multi-modal detection (RF + acoustic + thermal + optical)",
        "Regular TSCM (Technical Surveillance Countermeasures) sweeps",
        "Baseline normal system behavior and alert on deviations",
        "Physical inspection for unauthorized devices or modifications",
      ],
    });
  },
};

// ─── Tool 4: airgap_defense ───

const DEFENSE_LEVELS: Record<string, { shielding: string[]; monitoring: string[]; procedural: string[]; physical: string[]; hardening: string[] }> = {
  nation_state: {
    shielding: [
      "TEMPEST/EMSEC-certified equipment (SDIP-27, NATO SDIP-28 Level A)",
      "Faraday cage (shielded room) meeting NSA/CSS EPL specifications",
      "mu-metal shielding for magnetic field protection",
      "Isolated power supply (dedicated transformer + UPS + power conditioning)",
      "Shielded (STP/FTP) Ethernet cables with ferrite chokes",
      "Fiber optic connections where possible (no EM emanation)",
      "Sound insulation for acoustic channel prevention",
      "IR-blocking window film and controlled lighting",
    ],
    monitoring: [
      "Continuous TSCM sweeps (RF, acoustic, magnetic, thermal, optical)",
      "24/7 spectrum monitoring (1 MHz - 6 GHz) inside and outside shielded room",
      "Acoustic monitoring for ultrasonic and fan-speed anomalies",
      "Thermal monitoring between adjacent systems",
      "Power line analysis for consumption anomalies",
      "Magnetometer array around protected systems",
      "Host-based integrity monitoring (AIDE, OSSEC)",
    ],
    procedural: [
      "Zero personal electronic devices in protected area",
      "Mandatory device surrender with RF scanning at entry",
      "Two-person integrity for all maintenance operations",
      "Supply chain security with hardware verification",
      "Full hardware inspection before installation (X-ray, visual)",
      "Regular security clearance reviews for all personnel",
      "Documented and audited data transfer procedures (data diodes only)",
      "No removable media — all transfers via data diode",
    ],
    physical: [
      "Mantrap entry with biometric + badge + PIN",
      "Armed guard presence",
      "CCTV with AI-based anomaly detection",
      "Vibration sensors on walls/floor/ceiling",
      "Intrusion detection on all access points",
      "No windows — or RF-shielded windows with privacy film",
    ],
    hardening: [
      "Disable all wireless interfaces (WiFi, Bluetooth, NFC) in BIOS/UEFI",
      "Remove WiFi/Bluetooth hardware physically where possible",
      "Disable speakers, microphones, and cameras in BIOS",
      "Cover or remove all LEDs (HDD, keyboard, power)",
      "Replace HDDs with SSDs (eliminate acoustic channel)",
      "Lock fan speeds in BIOS (eliminate fan-based channel)",
      "Use UEFI Secure Boot with custom keys",
      "Deploy application whitelisting",
      "Read-only boot media where possible",
    ],
  },
  apt: {
    shielding: [
      "RF shielded room or cabinet for critical systems",
      "Shielded Ethernet cables (STP/FTP)",
      "UPS with power conditioning for air-gapped systems",
      "Sound-dampening for server rooms",
    ],
    monitoring: [
      "Periodic TSCM sweeps (quarterly or after security events)",
      "Spectrum monitoring during high-security operations",
      "Host-based integrity monitoring",
      "Power consumption monitoring",
      "Network traffic analysis for any unexpected connectivity",
    ],
    procedural: [
      "No personal devices in server/restricted areas",
      "Controlled USB media (signed, encrypted, audited)",
      "Change management for all air-gapped system modifications",
      "Background checks for personnel with system access",
      "Data transfer procedures with logging and approval workflow",
    ],
    physical: [
      "Badge + PIN access control",
      "CCTV surveillance",
      "Visitor escort policy",
      "Regular physical security audits",
    ],
    hardening: [
      "Disable wireless interfaces in BIOS/UEFI",
      "Endpoint protection with application whitelisting",
      "USB device control (allowlist specific devices)",
      "Cover HDD LEDs with opaque tape",
      "Prefer SSDs over HDDs",
      "Lock fan speeds where practical",
    ],
  },
  general: {
    shielding: [
      "Basic cable management to reduce emanation surface",
      "Use UPS for power isolation",
      "Position air-gapped systems away from windows",
    ],
    monitoring: [
      "Host-based monitoring (process, file integrity, USB events)",
      "Basic SIEM integration for air-gapped system events",
      "USB device connection logging",
    ],
    procedural: [
      "Document air-gap maintenance procedures",
      "USB media scanning before use on air-gapped systems",
      "Regular security awareness training",
      "Limit personnel with physical access",
    ],
    physical: [
      "Locked room/cabinet for air-gapped systems",
      "Badge access control",
      "Basic CCTV",
    ],
    hardening: [
      "Disable WiFi and Bluetooth in OS/BIOS",
      "Endpoint protection with updated signatures",
      "USB device restrictions",
      "Regular security updates (manual patch process)",
    ],
  },
};

const airgapDefense: ToolDef = {
  name: "airgap_defense",
  description:
    "Air-gap security hardening recommendations based on threat level. Returns comprehensive countermeasures including TEMPEST shielding, monitoring, procedural controls, and system hardening.",
  schema: {
    threat_level: z
      .enum(["nation_state", "apt", "general"])
      .describe("Threat level to defend against: nation_state (highest), apt (advanced persistent threat), general (standard)"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const threatLevel = args.threat_level as string;

    const defense = DEFENSE_LEVELS[threatLevel];
    if (!defense) {
      return text(`Unknown threat level: ${threatLevel}. Use: nation_state, apt, or general`);
    }

    return json({
      threatLevel,
      shielding: defense.shielding,
      monitoring: defense.monitoring,
      proceduralControls: defense.procedural,
      physicalSecurity: defense.physical,
      systemHardening: defense.hardening,
      keyPrinciples: [
        "All air-gap exfiltration requires malware on the isolated system — prevent implant delivery first",
        "Defense-in-depth: combine physical, procedural, and technical controls",
        "No single measure defeats all exfiltration channels — multi-modal protection required",
        "Regular security assessments including TSCM sweeps",
        "Supply chain security is the foundation — verify hardware before deployment",
      ],
    });
  },
};

// ─── Export All Air-Gap Tools ───

export const airgapTools: ToolDef[] = [
  airgapTechniques,
  airgapAssess,
  airgapDetect,
  airgapDefense,
];

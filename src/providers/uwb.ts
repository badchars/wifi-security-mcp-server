import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ─── UWB Use Case Security Profiles ───

const UWB_PROFILES: Record<string, { description: string; securityModel: string; knownVulnerabilities: string[]; relayAttackRisk: string; distanceManipulationRisk: string; ghostPeakVulnerable: boolean; recommendations: string[] }> = {
  vehicle_unlock: {
    description: "UWB-based passive keyless entry for vehicles. Replaces or augments traditional key fob with UWB distance measurement to prevent relay attacks.",
    securityModel: "UWB ranging between vehicle and key fob/smartphone. Intended to prevent relay attacks by verifying physical proximity (< 1-2 meters).",
    knownVulnerabilities: [
      "Ghost Peak attack: inject malicious UWB signal during ranging to manipulate distance measurement",
      "Distance enlargement: make key appear farther than it is (denial of service for unlock)",
      "Distance reduction: make key appear closer than it is (bypass proximity check — vehicle theft)",
      "Channel estimation manipulation: corrupt channel impulse response to affect ranging",
      "Implementation flaws: some vendors do not properly validate CIR (Channel Impulse Response)",
      "Backwards compatibility: fallback to BLE/NFC if UWB fails — attacker can jam UWB and exploit BLE relay",
    ],
    relayAttackRisk: "LOW with proper UWB implementation (UWB's primary purpose is relay attack prevention). HIGH if UWB implementation has Ghost Peak vulnerability or BLE fallback exists.",
    distanceManipulationRisk: "MEDIUM — Ghost Peak and CIR manipulation can both enlarge and reduce measured distance",
    ghostPeakVulnerable: true,
    recommendations: [
      "Validate complete CIR (Channel Impulse Response), not just first peak",
      "Implement distance bounding protocols (Brands-Chaum or derivatives)",
      "Disable BLE/NFC fallback for vehicle unlock (or require separate confirmation)",
      "Use IEEE 802.15.4z enhanced ranging with STS (Scrambled Timestamp Sequence)",
      "Require user action (button press, biometric) for unlock — not fully passive",
      "Multi-anchor UWB for geometric validation of position",
    ],
  },
  indoor_tracking: {
    description: "UWB-based indoor positioning and tracking for assets, personnel, or navigation. Sub-meter accuracy using time-of-flight ranging.",
    securityModel: "UWB anchors at known positions, tags on tracked items/people. Ranging data used for trilateration positioning.",
    knownVulnerabilities: [
      "Ghost Peak attack on individual ranging links corrupts position calculation",
      "Anchor spoofing: rogue UWB anchor provides false ranging data",
      "Tag cloning: duplicate tag transmissions to create phantom tracked objects",
      "Privacy: UWB tracking reveals precise indoor location of individuals",
      "Jamming: UWB signals can be jammed, causing tracking blackout",
      "Infrastructure compromise: compromised anchor corrupts all ranging involving it",
    ],
    relayAttackRisk: "LOW — indoor tracking is less sensitive to relay attacks than access control",
    distanceManipulationRisk: "MEDIUM — corrupted ranging affects position accuracy but impact depends on application",
    ghostPeakVulnerable: true,
    recommendations: [
      "Use authenticated ranging (802.15.4z STS) between anchors and tags",
      "Deploy redundant anchors for geometric consistency checking",
      "Monitor for ranging anomalies that indicate Ghost Peak or spoofing",
      "Encrypt UWB ranging data in transit to prevent eavesdropping",
      "Implement anchor integrity monitoring",
      "Address privacy: data minimization, access control on tracking data",
    ],
  },
  airdrop: {
    description: "Apple AirDrop uses UWB (U1 chip) for device discovery and proximity-based file sharing. UWB helps identify the closest device to share with.",
    securityModel: "UWB for proximity detection + BLE for discovery + WiFi for data transfer. UWB ensures the intended recipient is nearby.",
    knownVulnerabilities: [
      "Ghost Peak can manipulate which device appears closest for AirDrop",
      "AirDrop contact identification leak via BLE hash (independent of UWB)",
      "UWB ranging can be spoofed to make attacker device appear closer than legitimate recipient",
      "Privacy: UWB directional finding reveals precise device position",
      "AWDL (Apple Wireless Direct Link) used alongside UWB has known vulnerabilities",
    ],
    relayAttackRisk: "LOW — AirDrop requires user confirmation for unknown contacts",
    distanceManipulationRisk: "LOW — impact limited to wrong device selection (user can verify recipient)",
    ghostPeakVulnerable: true,
    recommendations: [
      "Set AirDrop to 'Contacts Only' instead of 'Everyone'",
      "Verify recipient name and device before sending sensitive files",
      "Keep iOS updated to patch UWB and AWDL vulnerabilities",
      "Disable AirDrop when not actively sharing",
    ],
  },
  digital_key: {
    description: "Digital car key / smart lock using UWB for secure ranging. CCC (Car Connectivity Consortium) Digital Key 3.0 specification uses UWB.",
    securityModel: "UWB secure ranging with STS (802.15.4z) + BLE for out-of-band key exchange. Distance bounding to prevent relay attacks.",
    knownVulnerabilities: [
      "Ghost Peak attack on UWB ranging can bypass distance check",
      "Implementation-specific STS configuration weaknesses",
      "Side-channel attacks on UWB timestamp processing",
      "BLE out-of-band channel vulnerabilities (key exchange phase)",
      "Compromised phone/wallet app exposes digital key material",
      "Multi-device sharing of digital keys creates key management complexity",
    ],
    relayAttackRisk: "LOW with 802.15.4z STS. MEDIUM if implementation has Ghost Peak vulnerability.",
    distanceManipulationRisk: "HIGH — distance reduction allows unauthorized access (vehicle/building entry)",
    ghostPeakVulnerable: true,
    recommendations: [
      "Implement full 802.15.4z with STS (Scrambled Timestamp Sequence)",
      "Use multi-anchor ranging for position verification",
      "Require secondary authentication for high-security operations (start engine, etc.)",
      "Implement CIR validation to detect Ghost Peak injection",
      "Regular security audits of digital key implementation",
      "Hardware Root of Trust for key storage (Secure Element, StrongBox)",
    ],
  },
};

// ─── Tool 1: uwb_assess ───

const uwbAssess: ToolDef = {
  name: "uwb_assess",
  description:
    "Assess UWB (Ultra-Wideband) security for specific use cases. Returns Ghost Peak vulnerability status, distance manipulation risks, and relay attack assessment.",
  schema: {
    use_case: z
      .enum(["vehicle_unlock", "indoor_tracking", "airdrop", "digital_key"])
      .describe("UWB application use case to assess"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const useCase = args.use_case as string;

    const profile = UWB_PROFILES[useCase];
    if (!profile) {
      return text(`Unknown use case: ${useCase}`);
    }

    return json({
      useCase,
      description: profile.description,
      securityModel: profile.securityModel,
      knownVulnerabilities: profile.knownVulnerabilities,
      riskAssessment: {
        relayAttackRisk: profile.relayAttackRisk,
        distanceManipulationRisk: profile.distanceManipulationRisk,
        ghostPeakVulnerable: profile.ghostPeakVulnerable,
      },
      recommendations: profile.recommendations,
      uwbStandard: {
        standard: "IEEE 802.15.4z (enhanced UWB ranging)",
        frequency: "6.5 GHz and 8 GHz bands (Channel 5: 6489.6 MHz, Channel 9: 7987.2 MHz)",
        bandwidth: "500 MHz (provides ~15cm ranging precision)",
        rangingMethod: "Two-Way Ranging (TWR) or Single-Sided TWR (SS-TWR)",
        securityFeature: "STS (Scrambled Timestamp Sequence) for authenticated ranging",
      },
    });
  },
};

// ─── Tool 2: uwb_attack_guide ───

const uwbAttackGuide: ToolDef = {
  name: "uwb_attack_guide",
  description:
    "UWB attack techniques including Ghost Peak, distance manipulation, and relay attacks. Returns methodology for authorized security testing.",
  schema: {},
  async execute(): Promise<ToolResult> {
    return json({
      ghostPeakAttack: {
        description: "Inject a malicious UWB signal during the ranging process that creates a false peak in the Channel Impulse Response (CIR). The receiver misidentifies this injected peak as the first-arrival signal, resulting in incorrect distance calculation.",
        methodology: [
          "1. Monitor target UWB ranging exchanges to determine timing and channel",
          "2. Synchronize attack transmitter to inject signal during CIR estimation window",
          "3. Transmit a short UWB pulse at a specific time offset before the legitimate signal arrives",
          "4. The receiver's CIR estimator detects the injected peak as the first arrival",
          "5. Result: measured distance is shorter than actual distance (distance reduction)",
          "6. For distance enlargement: inject peak after legitimate signal to shift first-path detection",
        ],
        requirements: [
          "UWB transceiver capable of precise timing (picosecond precision)",
          "Knowledge of target UWB channel and timing parameters",
          "Proximity to target ranging exchange (within UWB range)",
          "Custom firmware on UWB hardware (e.g., DW1000/DW3000 with modified ranging)",
        ],
        hardware: [
          { device: "Qorvo/Decawave DW1000", description: "Programmable UWB transceiver, widely used in research. Can be configured for custom ranging sequences.", cost: "$15-30" },
          { device: "Qorvo/Decawave DW3000", description: "Newer UWB transceiver supporting 802.15.4z. Required for STS-protected ranging attacks.", cost: "$20-40" },
          { device: "Apple U1 Development Kit", description: "For researching Apple UWB implementations (limited availability).", cost: "N/A" },
          { device: "Custom FPGA-based UWB", description: "FPGA implementation for full control over UWB PHY layer timing.", cost: "$200+" },
        ],
        successRate: "Research demonstrations show 50-90% success rate depending on implementation and countermeasures",
        references: [
          "Ghost Peak: Practical Distance Reduction Attacks Against HRP UWB Ranging (USENIX Security 2022)",
          "https://www.usenix.org/conference/usenixsecurity22/presentation/leu",
        ],
      },
      distanceManipulation: {
        description: "Manipulate the measured distance between UWB devices without modifying the UWB hardware of the target devices.",
        techniques: [
          {
            name: "Distance Reduction (Early Detection Attack)",
            description: "Make target appear closer than actual distance. Enables bypassing proximity-based access control.",
            method: "Inject UWB signal that arrives before legitimate signal, causing receiver to calculate shorter distance",
            impact: "Bypass vehicle unlock, digital key, proximity-based authentication",
          },
          {
            name: "Distance Enlargement (Late Detection Attack)",
            description: "Make target appear farther than actual distance. Denial of service for proximity features.",
            method: "Jam or delay legitimate signal, inject later signal as first path",
            impact: "Prevent legitimate unlock/access, force fallback to less secure protocol",
          },
          {
            name: "Relay Attack (Signal Forwarding)",
            description: "Forward UWB ranging signals between two colluding devices to extend effective range.",
            method: "Two attack devices: one near legitimate tag, one near target. Forward ranging signals in real-time.",
            impact: "Bypass distance check entirely — effective range extended from meters to unlimited",
            difficulty: "HARD — UWB has very tight timing constraints (nanoseconds) making relay detectable by proper implementations",
          },
        ],
      },
      jamming: {
        description: "UWB signal jamming to deny ranging service and force fallback to less secure protocols.",
        methodology: [
          "1. Identify target UWB frequency band (Channel 5: 6489.6 MHz or Channel 9: 7987.2 MHz)",
          "2. Generate wideband noise on the target UWB channel",
          "3. UWB ranging fails — device may fall back to BLE/NFC for proximity check",
          "4. Attack the fallback protocol (BLE relay attack, NFC relay)",
        ],
        tools: ["HackRF One (covers 1 MHz - 6 GHz)", "Custom UWB jammer on DW1000 platform"],
        countermeasure: "Disable fallback to less secure protocols when UWB ranging fails",
      },
      legalWarning: "UWB signal transmission and jamming may violate FCC/ETSI regulations. Ensure proper authorization and licensing for all testing.",
    });
  },
};

// ─── Tool 3: uwb_defense ───

const uwbDefense: ToolDef = {
  name: "uwb_defense",
  description:
    "UWB security recommendations and best practices. Returns secure ranging implementation guidance, distance bounding protocols, and countermeasures against Ghost Peak and relay attacks.",
  schema: {},
  async execute(): Promise<ToolResult> {
    return json({
      secureRangingBestPractices: [
        {
          practice: "Use IEEE 802.15.4z with STS",
          description: "Scrambled Timestamp Sequence (STS) provides authenticated ranging — attacker cannot predict or forge the ranging sequence without knowing the STS key.",
          implementation: "Configure DW3000/Apple U1/NXP SR1xx for 802.15.4z HRP mode with STS enabled",
          effectiveness: "HIGH — STS prevents many Ghost Peak variants that rely on predicting ranging signals",
        },
        {
          practice: "Validate Complete CIR",
          description: "Analyze the entire Channel Impulse Response, not just the first detected peak. Ghost Peak injects a single narrow pulse — legitimate CIR has characteristic multipath structure.",
          implementation: "Implement CIR validation algorithm that checks multipath consistency, peak shape, and energy distribution",
          effectiveness: "MEDIUM-HIGH — detects many Ghost Peak attacks but sophisticated injections may mimic multipath",
        },
        {
          practice: "Multi-Anchor Ranging",
          description: "Use multiple UWB anchors to verify position geometrically. Ghost Peak attack on a single link is detectable when it creates geometric inconsistency.",
          implementation: "Deploy 3+ UWB anchors and cross-validate ranging measurements for consistency",
          effectiveness: "HIGH — attacker must compromise multiple ranging links simultaneously",
        },
        {
          practice: "Distance Bounding Protocol",
          description: "Implement cryptographic distance bounding (Brands-Chaum) that sets a physical upper bound on distance based on speed-of-light timing.",
          implementation: "Combine UWB ToF with challenge-response protocol. Response time bounds maximum distance.",
          effectiveness: "HIGH for distance reduction attacks. Does not prevent distance enlargement.",
        },
        {
          practice: "Mutual Authentication",
          description: "Authenticate both UWB devices before accepting ranging results. Prevent rogue anchors/tags from injecting false ranging data.",
          implementation: "Use 802.15.4z STS key exchange over secure out-of-band channel (BLE Secure Connections, NFC)",
          effectiveness: "HIGH — prevents rogue device attacks",
        },
      ],
      antiRelayMeasures: [
        "UWB inherently resists relay attacks due to nanosecond-precision timing (relay adds detectable delay)",
        "Set maximum acceptable ranging response time based on speed-of-light + processing overhead",
        "Monitor for unusually high or variable round-trip times indicating relay",
        "Implement clock drift analysis — relay devices introduce characteristic clock offset patterns",
        "Combine UWB ranging with sensor fusion (IMU, magnetometer) for movement consistency validation",
      ],
      antiJammingMeasures: [
        "Detect UWB jamming via noise floor monitoring — alert when noise exceeds threshold",
        "Do NOT fall back to less secure protocols (BLE, NFC) when UWB is jammed",
        "Implement graceful degradation: require explicit user action when UWB ranging fails",
        "Use frequency hopping across UWB channels to evade narrowband jamming",
        "Deploy UWB on both Channel 5 (6.5 GHz) and Channel 9 (8 GHz) for redundancy",
      ],
      implementationGuidelines: {
        vehicleManufacturers: [
          "Follow CCC Digital Key 3.0 specification with mandatory STS",
          "Implement multi-anchor UWB in vehicle (minimum 3 anchors for 2D, 4 for 3D)",
          "Disable BLE fallback for passive entry — only allow BLE for active (button press) unlock",
          "Require user confirmation for engine start even with successful UWB ranging",
          "Log and audit all UWB ranging events for anomaly detection",
        ],
        smartLockVendors: [
          "Use 802.15.4z STS for all ranging",
          "Implement CIR validation to detect Ghost Peak",
          "Set conservative distance threshold (< 0.5m for unlock)",
          "Require secondary factor (PIN, biometric) for first-use and high-security modes",
          "Provide audit trail of all unlock events with ranging data",
        ],
        indoorTrackingProviders: [
          "Deploy redundant anchors for geometric consistency checking",
          "Encrypt ranging data between anchors and server",
          "Monitor for anchor spoofing and tag cloning",
          "Implement access control on tracking data (privacy protection)",
          "Regular calibration and integrity verification of anchor infrastructure",
        ],
      },
      emergingStandards: [
        "IEEE 802.15.4z: Enhanced UWB ranging with STS — current standard (2020)",
        "CCC Digital Key 3.0: UWB-based vehicle access specification",
        "FiRa Consortium: UWB interoperability and security certification",
        "NIST: Working on UWB ranging security evaluation framework",
        "CSA Matter: Evaluating UWB for smart home device commissioning",
      ],
    });
  },
};

// ─── Export All UWB Tools ───

export const uwbTools: ToolDef[] = [
  uwbAssess,
  uwbAttackGuide,
  uwbDefense,
];

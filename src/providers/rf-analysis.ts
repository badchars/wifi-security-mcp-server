import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { RF_ATTACKS } from "../knowledge/index.js";
import type { RfAttack } from "../knowledge/index.js";

// ─── Helpers ───

function severityToNum(s: string): number {
  switch (s) {
    case "critical": return 4;
    case "high": return 3;
    case "medium": return 2;
    case "low": return 1;
    default: return 0;
  }
}

function formatAttack(attack: RfAttack) {
  return {
    id: attack.id,
    name: attack.name,
    category: attack.category,
    frequency: attack.frequency,
    protocols: attack.protocols,
    cves: attack.cves,
    description: attack.description,
    impact: attack.impact,
    prerequisites: attack.prerequisites,
    tools: attack.tools,
    commands: attack.commands,
    mitigations: attack.mitigations,
    severity: attack.severity,
    stealthScore: attack.stealthScore,
    references: attack.references,
  };
}

// ─── Protocol database ───

interface RfProtocol {
  name: string;
  frequency: string;
  modulation: string;
  dataRate: string;
  description: string;
  tools: string[];
}

const KNOWN_PROTOCOLS: RfProtocol[] = [
  { name: "KeeLoq (Fixed Code)", frequency: "315/433 MHz", modulation: "ASK/OOK", dataRate: "~1 kbps", description: "Fixed-code garage door/gate remotes. Trivially replayable.", tools: ["flipper-zero", "hackrf", "rtl-sdr", "rfcat"] },
  { name: "KeeLoq (Rolling Code)", frequency: "315/433 MHz", modulation: "ASK/OOK", dataRate: "~1 kbps", description: "Rolling-code vehicle/garage remotes. Vulnerable to RollJam.", tools: ["hackrf", "yard-stick-one", "rfcat"] },
  { name: "TPMS", frequency: "315/433 MHz", modulation: "FSK/ASK", dataRate: "~10 kbps", description: "Tire Pressure Monitoring System. Unencrypted, trackable.", tools: ["rtl-sdr", "rtl_433", "hackrf"] },
  { name: "LoRa", frequency: "433/868/915 MHz", modulation: "CSS (Chirp Spread Spectrum)", dataRate: "0.3-50 kbps", description: "Long-range IoT protocol. Often unencrypted at application layer.", tools: ["hackrf", "limesdr", "gr-lora"] },
  { name: "LoRaWAN", frequency: "868/915 MHz", modulation: "CSS", dataRate: "0.3-50 kbps", description: "LoRa MAC layer with encryption. ABP mode keys can be extracted.", tools: ["hackrf", "limesdr", "gr-lora", "lorawan-parser"] },
  { name: "Zigbee", frequency: "2.4 GHz", modulation: "O-QPSK", dataRate: "250 kbps", description: "IEEE 802.15.4 mesh networking for smart home.", tools: ["killerbee", "ubertooth", "nrf52840", "wireshark"] },
  { name: "Z-Wave", frequency: "868.42/908.42 MHz", modulation: "FSK/GFSK", dataRate: "9.6-100 kbps", description: "Smart home protocol. S0 security uses known key, S2 is stronger.", tools: ["hackrf", "z-wave-sniffer", "ezwave"] },
  { name: "GPS L1", frequency: "1575.42 MHz", modulation: "BPSK", dataRate: "50 bps (nav) / 1.023 Mcps (code)", description: "GPS civilian signal. Spoofable with SDR.", tools: ["hackrf", "gps-sdr-sim"] },
  { name: "ADS-B", frequency: "1090 MHz", modulation: "PPM", dataRate: "1 Mbps", description: "Aircraft surveillance. Unencrypted, unauthenticated.", tools: ["rtl-sdr", "dump1090", "gr-adsb"] },
  { name: "POCSAG (Pager)", frequency: "148-174/450-470 MHz", modulation: "FSK", dataRate: "512/1200/2400 bps", description: "Pager protocol. Completely unencrypted. Still used by hospitals, emergency services.", tools: ["rtl-sdr", "multimon-ng"] },
  { name: "ISM Band Generic", frequency: "315/433/868/915 MHz", modulation: "ASK/OOK/FSK", dataRate: "varies", description: "Unlicensed ISM band. Used by weather stations, doorbells, sensors.", tools: ["rtl-sdr", "rtl_433", "flipper-zero", "hackrf"] },
  { name: "NFC (ISO 14443)", frequency: "13.56 MHz", modulation: "ASK (100%/10%)", dataRate: "106-424 kbps", description: "Near-field communication. Short range (~5cm).", tools: ["proxmark3", "flipper-zero", "libnfc"] },
  { name: "RFID LF", frequency: "125 kHz", modulation: "ASK/FSK/PSK", dataRate: "varies", description: "Low-frequency RFID for access cards (EM4100, HID).", tools: ["proxmark3", "flipper-zero"] },
  { name: "DECT", frequency: "1880-1900 MHz", modulation: "GFSK", dataRate: "1.152 Mbps", description: "Cordless phone protocol. Older versions unencrypted.", tools: ["hackrf", "gr-dect2", "dedected"] },
  { name: "P25", frequency: "VHF/UHF", modulation: "C4FM/CQPSK", dataRate: "9.6 kbps", description: "Public safety digital radio. Can be monitored.", tools: ["rtl-sdr", "op25", "dsd"] },
];

// ─── Tool 1: rf_lookup_attack ───

const rfLookupAttack: ToolDef = {
  name: "rf_lookup_attack",
  description:
    "Look up an RF attack by its unique ID from the RF_ATTACKS knowledge base. Returns full attack details including frequency, protocols, tools, commands, and mitigations.",
  schema: {
    attack_id: z
      .string()
      .describe("The attack ID to look up (e.g. 'rolljam', 'rollback', 'subghz_replay', 'tpms_sniff', 'keyfob_relay', 'gps_spoofing')"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const attackId = (args.attack_id as string).toLowerCase().trim();

    const attack = RF_ATTACKS.find((a) => a.id === attackId);
    if (!attack) {
      const available = RF_ATTACKS.map((a) => `${a.id} (${a.name})`).join(", ");
      return text(`RF attack '${attackId}' not found. Available attacks: ${available}`);
    }

    return json(formatAttack(attack));
  },
};

// ─── Tool 2: rf_search_attacks ───

const rfSearchAttacks: ToolDef = {
  name: "rf_search_attacks",
  description:
    "Search RF attacks by criteria. Filter by frequency band, attack category (replay, jamming, injection, analysis, relay), or minimum severity level.",
  schema: {
    frequency: z
      .string()
      .optional()
      .describe("Filter by frequency (e.g. '433', '315', '1575', '2.4 GHz'). Partial match on the attack's frequency field."),
    category: z
      .enum(["replay", "jamming", "injection", "analysis", "relay"])
      .optional()
      .describe("Filter by attack category"),
    severity: z
      .enum(["critical", "high", "medium", "low"])
      .optional()
      .describe("Filter by minimum severity level"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const frequency = args.frequency as string | undefined;
    const category = args.category as string | undefined;
    const severity = args.severity as string | undefined;

    let results = [...RF_ATTACKS];

    if (frequency) {
      const freqLower = frequency.toLowerCase().replace(/\s+/g, "");
      results = results.filter((a) =>
        a.frequency.toLowerCase().replace(/\s+/g, "").includes(freqLower)
      );
    }

    if (category) {
      results = results.filter((a) => a.category === category);
    }

    if (severity) {
      const minSev = severityToNum(severity);
      results = results.filter((a) => severityToNum(a.severity) >= minSev);
    }

    if (results.length === 0) {
      return text("No RF attacks found matching the specified criteria. Try broadening your search filters.");
    }

    results.sort((a, b) => severityToNum(b.severity) - severityToNum(a.severity));

    return json({
      totalResults: results.length,
      filters: { frequency, category, severity },
      attacks: results.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        frequency: a.frequency,
        protocols: a.protocols,
        severity: a.severity,
        stealthScore: a.stealthScore,
        impact: a.impact,
        tools: a.tools,
      })),
    });
  },
};

// ─── Tool 3: rf_analyze_signal ───

const rfAnalyzeSignal: ToolDef = {
  name: "rf_analyze_signal",
  description:
    "Analyze captured RF signal characteristics. Identifies probable protocols based on frequency, modulation type, and bandwidth. Provides demodulation guidance and recommended analysis tools.",
  schema: {
    frequency: z
      .string()
      .describe("Signal frequency (e.g. '433.92 MHz', '315 MHz', '868 MHz', '1575.42 MHz')"),
    modulation: z
      .enum(["ASK", "OOK", "FSK", "GFSK", "PSK", "BPSK", "QPSK", "CSS", "MSK", "OFDM"])
      .describe("Detected modulation type"),
    bandwidth: z
      .string()
      .describe("Signal bandwidth (e.g. '200 kHz', '1 MHz', '20 MHz')"),
    protocol: z
      .string()
      .optional()
      .describe("Known or suspected protocol name for additional analysis context"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const frequency = args.frequency as string;
    const modulation = args.modulation as string;
    const bandwidth = args.bandwidth as string;
    const knownProtocol = args.protocol as string | undefined;

    // Parse frequency to MHz for matching
    const freqMatch = frequency.match(/([\d.]+)\s*(MHz|GHz|kHz)/i);
    let freqMhz = 0;
    if (freqMatch) {
      freqMhz = parseFloat(freqMatch[1]);
      const unit = freqMatch[2].toLowerCase();
      if (unit === "ghz") freqMhz *= 1000;
      if (unit === "khz") freqMhz /= 1000;
    }

    // Find matching protocols
    const matchingProtocols = KNOWN_PROTOCOLS.filter((p) => {
      const protoFreqs = p.frequency.toLowerCase();
      const modMatch = p.modulation.toUpperCase().includes(modulation.toUpperCase());

      // Check frequency proximity
      let freqMatch = false;
      if (freqMhz > 0) {
        // Extract numbers from protocol frequency
        const nums = protoFreqs.match(/[\d.]+/g);
        if (nums) {
          for (const n of nums) {
            const pFreq = parseFloat(n);
            // Convert GHz to MHz for comparison
            const pFreqMhz = protoFreqs.includes("ghz") ? pFreq * 1000 : pFreq;
            if (Math.abs(pFreqMhz - freqMhz) / freqMhz < 0.05) { // 5% tolerance
              freqMatch = true;
              break;
            }
          }
        }
      }

      return freqMatch || modMatch;
    });

    // Demodulation guidance
    const demodGuidance: Record<string, { tool: string; command: string; notes: string }[]> = {
      "ASK": [
        { tool: "rtl_433", command: `rtl_433 -f ${frequency.replace(/\s/g, "")} -A`, notes: "Auto-detect ASK protocols" },
        { tool: "inspectrum", command: `inspectrum capture.cf32`, notes: "Visual signal analysis for ASK timing" },
        { tool: "universal-radio-hacker", command: "urh", notes: "GUI-based ASK signal analysis and decoding" },
      ],
      "OOK": [
        { tool: "rtl_433", command: `rtl_433 -f ${frequency.replace(/\s/g, "")} -A`, notes: "OOK is a subset of ASK — rtl_433 handles it" },
        { tool: "rfcat", command: `d.setFreq(${Math.round(freqMhz * 1e6)}); d.setMdmModulation(MOD_ASK_OOK); d.RFrecv()`, notes: "Capture OOK with rfcat" },
      ],
      "FSK": [
        { tool: "rtl_433", command: `rtl_433 -f ${frequency.replace(/\s/g, "")} -A`, notes: "Auto-detect FSK protocols" },
        { tool: "inspectrum", command: `inspectrum capture.cf32`, notes: "Visual analysis — look for frequency deviation" },
        { tool: "gnuradio", command: "Use FSK Demod block with appropriate deviation", notes: "Custom GnuRadio flowgraph for FSK demod" },
      ],
      "GFSK": [
        { tool: "gnuradio", command: "Use GFSK Demod block", notes: "GFSK is used by Z-Wave, DECT, and others" },
        { tool: "inspectrum", command: `inspectrum capture.cf32`, notes: "Check for Gaussian frequency transitions" },
      ],
      "PSK": [
        { tool: "gnuradio", command: "Use PSK Demod block", notes: "Phase demodulation" },
        { tool: "inspectrum", command: `inspectrum capture.cf32`, notes: "Look for phase transitions in constellation" },
      ],
      "BPSK": [
        { tool: "gnuradio", command: "Use BPSK Demod block with Costas Loop", notes: "Binary phase shift keying (GPS L1 uses this)" },
        { tool: "gps-sdr-sim", command: "For GPS — use gps-sdr-sim for analysis", notes: "GPS L1 C/A uses BPSK with CDMA" },
      ],
      "CSS": [
        { tool: "gr-lora", command: "Use gr-lora GnuRadio blocks", notes: "Chirp Spread Spectrum — used by LoRa" },
        { tool: "hackrf", command: `hackrf_transfer -r capture.raw -f ${Math.round(freqMhz * 1e6)} -s 1000000`, notes: "Capture CSS signal for analysis" },
      ],
    };

    const guidance = demodGuidance[modulation] || [
      { tool: "gnuradio", command: "Build custom demod flowgraph", notes: `No pre-built demod for ${modulation}` },
      { tool: "inspectrum", command: "inspectrum capture.cf32", notes: "Start with visual analysis" },
    ];

    // Capture commands
    const captureCommands = [
      { tool: "hackrf", command: `hackrf_transfer -r capture.raw -f ${Math.round(freqMhz * 1e6)} -s 2000000 -g 40`, description: "Capture with HackRF (2 MHz sample rate)" },
      { tool: "rtl-sdr", command: `rtl_sdr -f ${Math.round(freqMhz * 1e6)} -s 2400000 -g 40 capture.raw`, description: "Capture with RTL-SDR (RX only)" },
      { tool: "gqrx", command: `gqrx (set frequency to ${frequency})`, description: "Visual spectrum analysis with GQRX" },
    ];

    return json({
      signal: {
        frequency,
        frequencyMhz: freqMhz,
        modulation,
        bandwidth,
        knownProtocol: knownProtocol || "not specified",
      },
      probableProtocols: matchingProtocols.map((p) => ({
        name: p.name,
        frequency: p.frequency,
        modulation: p.modulation,
        dataRate: p.dataRate,
        description: p.description,
        analysisTools: p.tools,
      })),
      demodulationGuidance: guidance,
      captureCommands,
      analysisWorkflow: [
        "1. Capture raw IQ data with SDR at appropriate sample rate",
        "2. Open in inspectrum or GQRX for visual analysis",
        "3. Identify modulation, symbol rate, and encoding",
        `4. Apply ${modulation} demodulation using gnuradio or specialized tool`,
        "5. Analyze demodulated bitstream for protocol structure",
        "6. Use rtl_433 or URH for protocol identification and decoding",
      ],
    });
  },
};

// ─── Tool 4: rf_replay_guide ───

const rfReplayGuide: ToolDef = {
  name: "rf_replay_guide",
  description:
    "Generate a guide for RF signal replay attacks. Provides step-by-step capture and replay commands for the specified frequency, protocol type (fixed or rolling code), and hardware platform.",
  schema: {
    frequency: z
      .string()
      .describe("Target frequency (e.g. '433.92 MHz', '315 MHz', '868 MHz')"),
    protocol: z
      .enum(["fixed_code", "rolling_code"])
      .describe("Protocol type: fixed_code (simple replay) or rolling_code (requires RollJam technique)"),
    hardware: z
      .enum(["HackRF", "Flipper", "YardStick"])
      .optional()
      .describe("Attack hardware platform. Defaults to showing commands for all platforms."),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const frequency = args.frequency as string;
    const protocol = args.protocol as string;
    const hardware = args.hardware as string | undefined;

    const freqMatch = frequency.match(/([\d.]+)\s*(MHz|GHz|kHz)?/i);
    const freqHz = freqMatch
      ? Math.round(parseFloat(freqMatch[1]) * (freqMatch[2]?.toLowerCase() === "ghz" ? 1e9 : freqMatch[2]?.toLowerCase() === "khz" ? 1e3 : 1e6))
      : 433920000;

    interface HardwareGuide {
      name: string;
      captureCommands: { command: string; description: string }[];
      replayCommands: { command: string; description: string }[];
      notes: string[];
    }

    const allHardware: Record<string, HardwareGuide> = {
      HackRF: {
        name: "HackRF One",
        captureCommands: [
          { command: `hackrf_transfer -r capture.raw -f ${freqHz} -s 2000000 -g 40 -l 32`, description: "Capture raw IQ signal" },
          { command: "Press remote button while capturing, then Ctrl+C to stop", description: "Trigger target signal" },
        ],
        replayCommands: protocol === "fixed_code"
          ? [
              { command: `hackrf_transfer -t capture.raw -f ${freqHz} -s 2000000 -a 1 -x 40`, description: "Replay captured signal" },
            ]
          : [
              { command: `hackrf_transfer -r capture1.raw -f ${freqHz} -s 2000000 -g 40 & hackrf_transfer -t jam.raw -f ${freqHz + 50000} -s 2000000 -a 1 -x 47`, description: "Simultaneous jam + capture (requires 2 HackRFs)" },
              { command: "Wait for second button press, capture second code", description: "Capture second rolling code" },
              { command: `hackrf_transfer -t capture1.raw -f ${freqHz} -s 2000000 -a 1 -x 40`, description: "Replay first (unused) code" },
            ],
        notes: [
          "HackRF is half-duplex — RollJam requires two HackRFs (jam + capture)",
          "Use -x flag to set TX gain (0-47 dB)",
          "Sample rate of 2 MHz is sufficient for most sub-GHz protocols",
        ],
      },
      Flipper: {
        name: "Flipper Zero",
        captureCommands: [
          { command: "Sub-GHz > Read", description: "Auto-detect and capture sub-GHz signal" },
          { command: "Sub-GHz > Read RAW", description: "Capture raw signal (for unknown protocols)" },
          { command: "Press remote button while Flipper is in read mode", description: "Trigger target signal" },
          { command: "Save captured signal", description: "Store for replay" },
        ],
        replayCommands: protocol === "fixed_code"
          ? [
              { command: "Sub-GHz > Saved > Select signal > Send", description: "Replay saved signal" },
            ]
          : [
              { command: "Flipper Zero does not natively support RollJam attacks", description: "Rolling code limitation" },
              { command: "Custom firmware (Unleashed/RogueMaster) may add advanced features", description: "Alternative firmware" },
            ],
        notes: [
          "Flipper Zero supports 300-928 MHz (CC1101 radio)",
          "Built-in protocol decoders for many common remotes",
          protocol === "rolling_code" ? "Flipper cannot perform RollJam — use HackRF or YardStick One for rolling codes" : "Fixed code replay is straightforward with Flipper",
          "Custom firmware may expand protocol support",
        ],
      },
      YardStick: {
        name: "Yard Stick One",
        captureCommands: [
          { command: `d = RfCat(); d.setFreq(${freqHz}); d.setMdmModulation(MOD_ASK_OOK); d.setMdmDRate(4800)`, description: "Configure rfcat for capture" },
          { command: `data = d.RFrecv(timeout=5000)`, description: "Receive signal data" },
          { command: `open('capture.bin','wb').write(data[0])`, description: "Save captured data" },
        ],
        replayCommands: protocol === "fixed_code"
          ? [
              { command: `data = open('capture.bin','rb').read(); d.RFxmit(data)`, description: "Replay captured signal" },
            ]
          : [
              { command: `# RollJam with rfcat requires simultaneous jam+capture`, description: "Rolling code attack" },
              { command: `d.setFreq(${freqHz}); d.setMdmModulation(MOD_ASK_OOK); d.setMaxPower()`, description: "Configure for jamming" },
              { command: `# Use two Yard Sticks: one jams, one captures`, description: "Dual-radio setup" },
            ],
        notes: [
          "Yard Stick One uses CC1111 chipset (300-928 MHz)",
          "rfcat Python library provides full control",
          "Supports ASK/OOK, FSK, MSK, GFSK modulation",
          "Half-duplex — RollJam requires two Yard Sticks",
        ],
      },
    };

    const selectedHardware = hardware
      ? { [hardware]: allHardware[hardware] }
      : allHardware;

    // Related attacks from knowledge base
    const relatedAttacks = RF_ATTACKS.filter((a) => {
      if (protocol === "rolling_code") return a.category === "replay" && a.protocols.some((p) => p.toLowerCase().includes("rolling"));
      return a.category === "replay";
    }).map((a) => ({ id: a.id, name: a.name, severity: a.severity }));

    return json({
      target: {
        frequency,
        frequencyHz: freqHz,
        protocol,
      },
      attackType: protocol === "fixed_code"
        ? "Direct Replay — capture signal and retransmit"
        : "RollJam — jam receiver while capturing code, then replay unused code",
      difficulty: protocol === "fixed_code" ? "easy" : "advanced",
      hardwareGuides: Object.values(selectedHardware),
      preAttackRecon: [
        `1. Identify target frequency using spectrum analyzer or rtl_433 -A at ${frequency}`,
        "2. Determine if fixed or rolling code (capture two presses — if identical, fixed code)",
        "3. Identify modulation (typically ASK/OOK for remotes) using inspectrum or URH",
        "4. Note signal duration and encoding (Manchester, PWM, etc.)",
      ],
      relatedAttacks,
      legalWarning: "RF signal replay may violate local telecommunications laws. Only perform on authorized targets during legitimate security assessments.",
    });
  },
};

// ─── Tool 5: rf_identify_protocol ───

const rfIdentifyProtocol: ToolDef = {
  name: "rf_identify_protocol",
  description:
    "Identify RF protocol from signal characteristics. Matches frequency, modulation, and data rate against a database of known wireless protocols to suggest probable matches and analysis tools.",
  schema: {
    frequency: z
      .string()
      .describe("Signal frequency (e.g. '433.92 MHz', '868 MHz', '2.4 GHz')"),
    modulation: z
      .string()
      .describe("Detected modulation type (e.g. 'ASK', 'FSK', 'GFSK', 'OQPSK', 'CSS')"),
    data_rate: z
      .string()
      .describe("Detected data rate (e.g. '1 kbps', '250 kbps', '1 Mbps')"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const frequency = args.frequency as string;
    const modulation = args.modulation as string;
    const dataRate = args.data_rate as string;

    // Parse frequency
    const freqMatch = frequency.match(/([\d.]+)\s*(MHz|GHz|kHz)?/i);
    let freqMhz = 0;
    if (freqMatch) {
      freqMhz = parseFloat(freqMatch[1]);
      const unit = (freqMatch[2] || "mhz").toLowerCase();
      if (unit === "ghz") freqMhz *= 1000;
      if (unit === "khz") freqMhz /= 1000;
    }

    // Parse data rate to bps for comparison
    const rateMatch = dataRate.match(/([\d.]+)\s*(kbps|Mbps|bps)?/i);
    let rateBps = 0;
    if (rateMatch) {
      rateBps = parseFloat(rateMatch[1]);
      const unit = (rateMatch[2] || "bps").toLowerCase();
      if (unit === "kbps") rateBps *= 1000;
      if (unit === "mbps") rateBps *= 1000000;
    }

    // Score each protocol
    interface ProtocolMatch {
      protocol: RfProtocol;
      score: number;
      matchReasons: string[];
    }

    const matches: ProtocolMatch[] = [];

    for (const proto of KNOWN_PROTOCOLS) {
      let score = 0;
      const reasons: string[] = [];

      // Frequency matching
      const protoFreqNums = proto.frequency.match(/[\d.]+/g);
      if (protoFreqNums) {
        for (const n of protoFreqNums) {
          let pFreqMhz = parseFloat(n);
          if (proto.frequency.toLowerCase().includes("ghz")) pFreqMhz *= 1000;
          if (proto.frequency.toLowerCase().includes("khz")) pFreqMhz /= 1000;
          if (Math.abs(pFreqMhz - freqMhz) / Math.max(freqMhz, 1) < 0.02) {
            score += 40;
            reasons.push(`Frequency match: ${frequency} ~ ${proto.frequency}`);
            break;
          } else if (Math.abs(pFreqMhz - freqMhz) / Math.max(freqMhz, 1) < 0.10) {
            score += 15;
            reasons.push(`Frequency near: ${frequency} ~ ${proto.frequency}`);
            break;
          }
        }
      }

      // Modulation matching
      const protoMod = proto.modulation.toUpperCase();
      const inputMod = modulation.toUpperCase();
      if (protoMod.includes(inputMod) || inputMod.includes(protoMod.split("/")[0])) {
        score += 35;
        reasons.push(`Modulation match: ${modulation} ~ ${proto.modulation}`);
      } else if (
        (inputMod === "ASK" && protoMod.includes("OOK")) ||
        (inputMod === "OOK" && protoMod.includes("ASK"))
      ) {
        score += 30;
        reasons.push(`Modulation compatible: ${modulation} ~ ${proto.modulation} (ASK/OOK overlap)`);
      }

      // Data rate matching (if parseable)
      if (rateBps > 0) {
        const protoRateMatch = proto.dataRate.match(/([\d.]+)\s*(kbps|Mbps|bps)/i);
        if (protoRateMatch) {
          let protoRateBps = parseFloat(protoRateMatch[1]);
          const protoUnit = protoRateMatch[2].toLowerCase();
          if (protoUnit === "kbps") protoRateBps *= 1000;
          if (protoUnit === "mbps") protoRateBps *= 1000000;

          if (Math.abs(protoRateBps - rateBps) / Math.max(rateBps, 1) < 0.20) {
            score += 25;
            reasons.push(`Data rate match: ${dataRate} ~ ${proto.dataRate}`);
          }
        }
      }

      if (score > 0) {
        matches.push({ protocol: proto, score, matchReasons: reasons });
      }
    }

    // Sort by score
    matches.sort((a, b) => b.score - a.score);

    if (matches.length === 0) {
      return json({
        query: { frequency, modulation, dataRate },
        matches: [],
        message: "No known protocols match the given characteristics. This may be a proprietary or uncommon protocol.",
        nextSteps: [
          "Capture raw IQ data for further analysis",
          "Use Universal Radio Hacker (URH) for protocol reverse-engineering",
          "Check inspectrum for visual signal structure analysis",
          "Try rtl_433 -A for auto-detection of unknown protocols",
        ],
      });
    }

    return json({
      query: { frequency, modulation, dataRate },
      bestMatch: {
        name: matches[0].protocol.name,
        confidence: matches[0].score >= 75 ? "high" : matches[0].score >= 50 ? "medium" : "low",
        score: matches[0].score,
        matchReasons: matches[0].matchReasons,
      },
      allMatches: matches.map((m) => ({
        name: m.protocol.name,
        score: m.score,
        frequency: m.protocol.frequency,
        modulation: m.protocol.modulation,
        dataRate: m.protocol.dataRate,
        description: m.protocol.description,
        matchReasons: m.matchReasons,
        analysisTools: m.protocol.tools,
      })),
      nextSteps: [
        `Most likely protocol: ${matches[0].protocol.name}`,
        `Analyze with: ${matches[0].protocol.tools.join(", ")}`,
        "Capture multiple signal samples to confirm protocol identification",
        "Use protocol-specific decoder for detailed analysis",
      ],
    });
  },
};

// ─── Export All RF Analysis Tools ───

export const rfAnalysisTools: ToolDef[] = [
  rfLookupAttack,
  rfSearchAttacks,
  rfAnalyzeSignal,
  rfReplayGuide,
  rfIdentifyProtocol,
];

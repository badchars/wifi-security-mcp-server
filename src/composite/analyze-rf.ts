import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { rfAnalysisTools } from "../providers/rf-analysis.js";
import { sdrTools } from "../providers/sdr.js";

// ─── Resolve individual tools by name ───

const rfToolMap = new Map(rfAnalysisTools.map((t) => [t.name, t]));
const sdrToolMap = new Map(sdrTools.map((t) => [t.name, t]));

const rfLookupAttack = rfToolMap.get("rf_lookup_attack")!;
const rfSearchAttacks = rfToolMap.get("rf_search_attacks")!;
const rfAnalyzeSignal = rfToolMap.get("rf_analyze_signal")!;
const rfReplayGuide = rfToolMap.get("rf_replay_guide")!;
const rfIdentifyProtocol = rfToolMap.get("rf_identify_protocol")!;
const sdrHardwareGuide = sdrToolMap.get("sdr_hardware_guide")!;
const sdrSetupGuide = sdrToolMap.get("sdr_setup_guide")!;
const sdrFrequencyGuide = sdrToolMap.get("sdr_frequency_guide")!;

// ─── Composite Tool ───

const analyzeRf: ToolDef = {
  name: "analyze_rf_signal",
  description:
    "RF signal analysis and attack planning — protocol identification, signal analysis, replay attack guides, SDR hardware selection and setup.",
  schema: {
    mode: z
      .enum(["lookup_attack", "search_attacks", "analyze_signal", "replay_guide", "identify_protocol", "hardware_guide", "setup_guide", "frequency_guide"])
      .describe("Operation mode: lookup_attack, search_attacks, analyze_signal, replay_guide, identify_protocol, hardware_guide, setup_guide, frequency_guide"),

    // lookup_attack params
    attack_id: z
      .string()
      .optional()
      .describe("[lookup_attack] RF attack ID (e.g. 'rolljam', 'subghz_replay', 'gps_spoofing')"),

    // search_attacks params
    frequency: z
      .string()
      .optional()
      .describe("[search_attacks, analyze_signal, replay_guide, identify_protocol] Frequency (e.g. '433 MHz', '2.4 GHz')"),
    category: z
      .enum(["replay", "jamming", "injection", "analysis", "relay"])
      .optional()
      .describe("[search_attacks] Attack category filter"),
    severity: z
      .enum(["critical", "high", "medium", "low"])
      .optional()
      .describe("[search_attacks] Minimum severity filter"),

    // analyze_signal params
    modulation: z
      .string()
      .optional()
      .describe("[analyze_signal, replay_guide, identify_protocol] Modulation type (ASK, FSK, GFSK, PSK, CSS, etc.)"),
    bandwidth: z
      .string()
      .optional()
      .describe("[analyze_signal] Signal bandwidth (e.g. '200 kHz', '1 MHz')"),

    // replay_guide params
    protocol: z
      .string()
      .optional()
      .describe("[replay_guide, identify_protocol, frequency_guide] Protocol type or name (fixed_code/rolling_code for replay, or protocol name for identify/frequency)"),
    hardware: z
      .enum(["HackRF", "Flipper", "YardStick"])
      .optional()
      .describe("[replay_guide] Hardware platform for replay commands"),

    // identify_protocol params
    data_rate: z
      .string()
      .optional()
      .describe("[identify_protocol] Detected data rate (e.g. '1 kbps', '250 kbps')"),

    // hardware_guide params
    use_case: z
      .enum(["wifi", "bluetooth", "subghz", "cellular", "gps", "lora", "zigbee"])
      .optional()
      .describe("[hardware_guide] Primary use case for hardware selection"),
    budget: z
      .string()
      .optional()
      .describe("[hardware_guide] Maximum budget (e.g. '$100', '$500')"),

    // setup_guide params
    sdr_hardware: z
      .enum(["hackrf", "rtlsdr", "limesdr", "bladerf"])
      .optional()
      .describe("[setup_guide] SDR hardware platform for setup instructions"),
    os: z
      .enum(["linux", "macos", "windows"])
      .optional()
      .describe("[setup_guide] Target operating system"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "lookup_attack": {
        if (!args.attack_id) return text("attack_id is required for lookup_attack mode.");
        return rfLookupAttack.execute({ attack_id: args.attack_id }, ctx);
      }

      case "search_attacks": {
        return rfSearchAttacks.execute({
          frequency: args.frequency,
          category: args.category,
          severity: args.severity,
        }, ctx);
      }

      case "analyze_signal": {
        if (!args.frequency) return text("frequency is required for analyze_signal mode.");
        if (!args.modulation) return text("modulation is required for analyze_signal mode.");
        if (!args.bandwidth) return text("bandwidth is required for analyze_signal mode.");
        return rfAnalyzeSignal.execute({
          frequency: args.frequency,
          modulation: args.modulation,
          bandwidth: args.bandwidth,
          protocol: args.protocol,
        }, ctx);
      }

      case "replay_guide": {
        if (!args.frequency) return text("frequency is required for replay_guide mode.");
        if (!args.protocol) return text("protocol (fixed_code or rolling_code) is required for replay_guide mode.");
        return rfReplayGuide.execute({
          frequency: args.frequency,
          protocol: args.protocol,
          hardware: args.hardware,
        }, ctx);
      }

      case "identify_protocol": {
        if (!args.frequency) return text("frequency is required for identify_protocol mode.");
        if (!args.modulation) return text("modulation is required for identify_protocol mode.");
        if (!args.data_rate) return text("data_rate is required for identify_protocol mode.");
        return rfIdentifyProtocol.execute({
          frequency: args.frequency,
          modulation: args.modulation,
          data_rate: args.data_rate,
        }, ctx);
      }

      case "hardware_guide": {
        if (!args.use_case) return text("use_case is required for hardware_guide mode.");
        return sdrHardwareGuide.execute({
          use_case: args.use_case,
          budget: args.budget,
        }, ctx);
      }

      case "setup_guide": {
        if (!args.sdr_hardware) return text("sdr_hardware is required for setup_guide mode.");
        if (!args.os) return text("os is required for setup_guide mode.");
        return sdrSetupGuide.execute({
          hardware: args.sdr_hardware,
          os: args.os,
        }, ctx);
      }

      case "frequency_guide": {
        if (!args.protocol) return text("protocol is required for frequency_guide mode.");
        return sdrFrequencyGuide.execute({ protocol: args.protocol }, ctx);
      }

      default:
        return text(`Unknown mode '${mode}'. Valid modes: lookup_attack, search_attacks, analyze_signal, replay_guide, identify_protocol, hardware_guide, setup_guide, frequency_guide`);
    }
  },
};

export default analyzeRf;

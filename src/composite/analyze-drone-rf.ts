import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { droneRfTools } from "../providers/drone-rf.js";

const toolMap = new Map(droneRfTools.map((t) => [t.name, t]));

const analyzeDroneRf: ToolDef = {
  name: "analyze_drone_rf",
  description:
    "Composite tool for drone RF security analysis. Supports modes: detect (drone RF detection guide), analyze (analyze drone communication protocol), counter (counter-drone RF techniques).",
  schema: {
    mode: z
      .enum(["detect", "analyze", "counter"])
      .describe("Mode: detect, analyze, or counter"),
    frequency_bands: z
      .array(z.string())
      .optional()
      .describe("Frequency bands for detect mode (e.g. ['2.4ghz', '5.8ghz'])"),
    hardware: z
      .string()
      .optional()
      .describe("SDR hardware for detect mode"),
    protocol: z
      .enum(["wifi", "lightbridge", "ocusync", "elrs", "custom"])
      .optional()
      .describe("Drone protocol for analyze mode"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "detect": {
        if (!args.frequency_bands) return text("detect mode requires 'frequency_bands' parameter (array of frequency bands).");
        const tool = toolMap.get("drone_rf_detect")!;
        return tool.execute({ frequency_bands: args.frequency_bands, hardware: args.hardware }, ctx);
      }
      case "analyze": {
        if (!args.protocol) return text("analyze mode requires 'protocol' parameter (wifi, lightbridge, ocusync, elrs, or custom).");
        const tool = toolMap.get("drone_rf_analyze")!;
        return tool.execute({ protocol: args.protocol }, ctx);
      }
      case "counter": {
        const tool = toolMap.get("drone_rf_counter")!;
        return tool.execute({}, ctx);
      }
      default:
        return text(`Unknown mode: ${mode}. Use: detect, analyze, or counter.`);
    }
  },
};

export default analyzeDroneRf;

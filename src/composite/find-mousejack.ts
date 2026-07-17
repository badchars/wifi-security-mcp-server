import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { mousejackTools } from "../providers/mousejack.js";

const toolMap = new Map(mousejackTools.map((t) => [t.name, t]));

const findMousejack: ToolDef = {
  name: "find_mousejack",
  description:
    "Composite tool for MouseJack wireless keyboard/mouse vulnerability assessment. Supports modes: scan (scan for vulnerable devices), assess (assess specific device vulnerability), inject (keystroke injection guide), defense (defense recommendations).",
  schema: {
    mode: z
      .enum(["scan", "assess", "inject", "defense"])
      .describe("Mode: scan, assess, inject, or defense"),
    hardware: z
      .enum(["crazyradio", "hackrf"])
      .optional()
      .describe("Scanning hardware for scan mode"),
    device_vendor: z
      .enum(["logitech", "microsoft", "dell", "hp", "lenovo", "amazon"])
      .optional()
      .describe("Device vendor for assess mode"),
    device_type: z
      .enum(["keyboard", "mouse", "presenter"])
      .optional()
      .describe("Device type for assess mode"),
    target_address: z
      .string()
      .optional()
      .describe("nRF24 device address for inject mode (e.g. '61:D9:50:3F:A8')"),
    payload: z
      .string()
      .optional()
      .describe("Ducky Script payload for inject mode"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "scan": {
        const tool = toolMap.get("mousejack_scan")!;
        return tool.execute({ hardware: args.hardware }, ctx);
      }
      case "assess": {
        if (!args.device_vendor || !args.device_type) {
          return text("assess mode requires 'device_vendor' and 'device_type' parameters.");
        }
        const tool = toolMap.get("mousejack_assess")!;
        return tool.execute({ device_vendor: args.device_vendor, device_type: args.device_type }, ctx);
      }
      case "inject": {
        if (!args.target_address) return text("inject mode requires 'target_address' parameter.");
        const tool = toolMap.get("mousejack_inject")!;
        return tool.execute({ target_address: args.target_address, payload: args.payload }, ctx);
      }
      case "defense": {
        const tool = toolMap.get("mousejack_defense")!;
        return tool.execute({}, ctx);
      }
      default:
        return text(`Unknown mode: ${mode}. Use: scan, assess, inject, or defense.`);
    }
  },
};

export default findMousejack;

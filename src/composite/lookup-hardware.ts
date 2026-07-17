import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { text } from "../types/index.js";
import { hardwareTools } from "../providers/hardware.js";

const toolMap: Record<string, ToolDef> = {
  lookup: hardwareTools[0],
  search: hardwareTools[1],
  recommend: hardwareTools[2],
  compare: hardwareTools[3],
};

export const lookupHardware: ToolDef = {
  name: "lookup_hardware",
  description:
    "Unified pentest hardware lookup tool. Modes: lookup (look up device by ID), search (search by category/price/capability), recommend (recommendations for use case), compare (side-by-side device comparison).",
  schema: {
    mode: z.enum(["lookup", "search", "recommend", "compare"]).describe("Operation mode to execute"),
    hardware_id: z.string().optional().describe("Hardware device ID (required for lookup mode)"),
    category: z.enum(["wifi", "bluetooth", "sdr", "nfc_rfid", "cellular", "iot", "multi"]).optional().describe("Hardware category filter (used by search mode)"),
    max_price: z.number().optional().describe("Maximum price in USD (used by search mode)"),
    capability: z.string().optional().describe("Capability keyword (used by search mode)"),
    use_case: z.enum(["wifi_pentest", "bt_pentest", "rfid_clone", "rf_replay", "cellular_test", "iot_test", "full_kit"]).optional().describe("Use case for recommendation (required for recommend mode)"),
    budget: z.number().optional().describe("Maximum budget in USD (used by recommend mode)"),
    device_a: z.string().optional().describe("First device ID for comparison (required for compare mode)"),
    device_b: z.string().optional().describe("Second device ID for comparison (required for compare mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;
    const tool = toolMap[mode];

    if (!tool) {
      return text(`Unknown mode: '${mode}'. Valid modes: ${Object.keys(toolMap).join(", ")}`);
    }

    return tool.execute(args, ctx);
  },
};

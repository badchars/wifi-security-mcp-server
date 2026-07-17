import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { text } from "../types/index.js";
import { medicalWirelessTools } from "../providers/medical-wireless.js";

const toolMap: Record<string, ToolDef> = {
  assess: medicalWirelessTools[0],
  attacks: medicalWirelessTools[1],
  defense: medicalWirelessTools[2],
};

export const analyzeMedicalWireless: ToolDef = {
  name: "analyze_medical_wireless",
  description:
    "Unified medical wireless security tool. Modes: assess (risk assessment by device type and protocol), attacks (known attacks and CVEs for device type), defense (HIPAA-aligned hardening by deployment).",
  schema: {
    mode: z.enum(["assess", "attacks", "defense"]).describe("Operation mode to execute"),
    device_type: z.enum(["infusion_pump", "pacemaker", "monitor", "imaging"]).optional().describe("Medical device type (required for assess and attacks modes)"),
    wireless_protocol: z.enum(["wifi", "bluetooth", "zigbee", "proprietary"]).optional().describe("Wireless protocol used by the device (required for assess mode)"),
    deployment: z.enum(["hospital", "clinic", "home_health"]).optional().describe("Deployment environment (required for defense mode)"),
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

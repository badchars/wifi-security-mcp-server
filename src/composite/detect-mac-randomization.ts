import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { text } from "../types/index.js";
import { macRandomizationTools } from "../providers/mac-randomization.js";

const toolMap: Record<string, ToolDef> = {
  bypass: macRandomizationTools[0],
  assess: macRandomizationTools[1],
  tracking: macRandomizationTools[2],
};

export const detectMacRandomization: ToolDef = {
  name: "detect_mac_randomization",
  description:
    "Unified MAC randomization analysis tool. Modes: bypass (OS-specific bypass techniques), assess (implementation quality assessment per OS/version), tracking (device tracking techniques despite randomization).",
  schema: {
    mode: z.enum(["bypass", "assess", "tracking"]).describe("Operation mode to execute"),
    target_os: z.enum(["android", "ios", "windows", "linux"]).optional().describe("Target operating system (required for bypass mode)"),
    target_version: z.string().optional().describe("Target OS version (required for bypass mode)"),
    os: z.enum(["android", "ios", "windows", "linux"]).optional().describe("Operating system to assess (required for assess mode)"),
    version: z.string().optional().describe("OS version to assess (required for assess mode)"),
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

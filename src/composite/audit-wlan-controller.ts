import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { text } from "../types/index.js";
import { wlanControllerTools } from "../providers/wlan-controller.js";

const toolMap: Record<string, ToolDef> = {
  audit_config: wlanControllerTools[0],
  rogue_ap: wlanControllerTools[1],
  audit_ssid: wlanControllerTools[2],
  hardening: wlanControllerTools[3],
};

export const auditWlanController: ToolDef = {
  name: "audit_wlan_controller",
  description:
    "Unified WLAN controller auditing tool. Modes: audit_config (audit controller configuration), rogue_ap (rogue AP detection guidance), audit_ssid (SSID security assessment), hardening (vendor-specific hardening guide).",
  schema: {
    mode: z.enum(["audit_config", "rogue_ap", "audit_ssid", "hardening"]).describe("Operation mode to execute"),
    controller_type: z.enum(["cisco_wlc", "aruba", "meraki", "unifi", "ruckus", "fortinet"]).optional().describe("WLAN controller vendor/platform type (required for audit_config, rogue_ap, hardening)"),
    config_data: z.string().optional().describe("Raw WLAN controller configuration text (required for audit_config)"),
    wids_enabled: z.boolean().optional().describe("Whether WIDS/WIPS is currently enabled (used by rogue_ap mode)"),
    ssid_config: z.string().optional().describe("SSID configuration as JSON string (required for audit_ssid)"),
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

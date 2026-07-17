import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { text } from "../types/index.js";
import { wirelessDetectionTools } from "../providers/wireless-detection.js";

const toolMap: Record<string, ToolDef> = {
  wids_rules: wirelessDetectionTools[0],
  sigma_gen: wirelessDetectionTools[1],
  forensics: wirelessDetectionTools[2],
  indicators: wirelessDetectionTools[3],
  monitor_setup: wirelessDetectionTools[4],
};

export const detectWirelessAttack: ToolDef = {
  name: "detect_wireless_attack",
  description:
    "Unified wireless attack detection tool. Modes: wids_rules (WIDS/WIPS rule generation), sigma_gen (Sigma rule generation), forensics (forensics analysis guide), indicators (detection IoCs for attacks), monitor_setup (monitoring platform setup).",
  schema: {
    mode: z.enum(["wids_rules", "sigma_gen", "forensics", "indicators", "monitor_setup"]).describe("Operation mode to execute"),
    attack_type: z.enum(["deauth", "evil_twin", "karma", "beacon_flood", "rogue_ap", "client_probe"]).optional().describe("Wireless attack type (required for wids_rules mode)"),
    wids_platform: z.enum(["kismet", "aruba", "cisco", "custom"]).optional().describe("Target WIDS platform (used by wids_rules mode)"),
    attack_id: z.string().optional().describe("Attack ID from knowledge base (required for sigma_gen and indicators modes)"),
    artifact_type: z.enum(["pcap", "handshake", "probe_requests", "beacon_frames", "eapol"]).optional().describe("Forensic artifact type (required for forensics mode)"),
    platform: z.enum(["kismet", "aircrack", "wireshark", "tcpdump"]).optional().describe("Monitoring platform (required for monitor_setup mode)"),
    monitoring_goal: z.enum(["rogue_ap", "deauth", "probe_tracking", "all"]).optional().describe("Monitoring objective (required for monitor_setup mode)"),
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

import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { wifiReconTools } from "../providers/wifi-recon.js";

export const scanWifiComposite: ToolDef = {
  name: "scan_wifi_networks",
  description: "WiFi network reconnaissance and analysis. Scan networks, analyze encryption, enumerate clients, check channel usage, assess handshake captures.",
  schema: {
    mode: z.enum(["scan", "analyze_handshake", "check_encryption", "enumerate_clients", "channel_analysis"]).describe("Scan mode"),
    interface: z.string().optional().describe("Wireless interface (for scan mode)"),
    channel: z.number().optional().describe("Channel filter (for scan mode)"),
    band: z.string().optional().describe("Band filter: 2.4, 5, 6 (for scan mode)"),
    handshake_data: z.string().optional().describe("Handshake description (for analyze_handshake mode)"),
    ssid: z.string().optional().describe("Network SSID (for check_encryption mode)"),
    encryption: z.string().optional().describe("Encryption type: WEP/WPA/WPA2/WPA3/Open (for check_encryption mode)"),
    auth: z.string().optional().describe("Auth method: PSK/Enterprise (for check_encryption mode)"),
    pmf: z.boolean().optional().describe("PMF enabled (for check_encryption mode)"),
    ap_bssid: z.string().optional().describe("AP BSSID (for enumerate_clients mode)"),
    client_data: z.string().optional().describe("Raw client data (for enumerate_clients mode)"),
    scan_data: z.string().optional().describe("Raw scan data (for channel_analysis mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    const toolMap: Record<string, string> = {
      scan: "wifi_scan_networks",
      analyze_handshake: "wifi_analyze_handshake",
      check_encryption: "wifi_check_encryption",
      enumerate_clients: "wifi_enumerate_clients",
      channel_analysis: "wifi_channel_analysis",
    };

    const toolName = toolMap[mode];
    if (!toolName) {
      return json({ error: `Unknown mode: ${mode}. Available: ${Object.keys(toolMap).join(", ")}` });
    }

    const tool = wifiReconTools.find((t) => t.name === toolName);
    if (!tool) {
      return json({ error: `Tool ${toolName} not found in wifi-recon provider.` });
    }

    // Validate required params per mode
    switch (mode) {
      case "analyze_handshake":
        if (!args.handshake_data) {
          return json({ error: "handshake_data is required for analyze_handshake mode." });
        }
        break;
      case "check_encryption":
        if (!args.ssid || !args.encryption || !args.auth) {
          return json({ error: "ssid, encryption, and auth are required for check_encryption mode." });
        }
        break;
      case "enumerate_clients":
        if (!args.ap_bssid || !args.client_data) {
          return json({ error: "ap_bssid and client_data are required for enumerate_clients mode." });
        }
        break;
      case "channel_analysis":
        if (!args.scan_data) {
          return json({ error: "scan_data is required for channel_analysis mode." });
        }
        break;
    }

    return tool.execute(args, ctx);
  },
};

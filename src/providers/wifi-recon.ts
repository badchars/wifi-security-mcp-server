import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ---- Mock data generators for reconnaissance simulation ----

function generateMockNetworks(channel?: number, band?: string): Record<string, unknown>[] {
  const encryptions = ["WPA2", "WPA3", "WEP", "Open", "WPA2", "WPA2", "WPA3"];
  const bands = band ? [band] : ["2.4GHz", "5GHz"];
  const channels2g = [1, 6, 11, 3, 9];
  const channels5g = [36, 40, 44, 48, 149, 153, 157, 161];

  const networks = [
    { ssid: "CorpNet-5G", bssid: "AA:BB:CC:DD:EE:01", channel: 36, signal: -42, encryption: "WPA2", auth: "Enterprise", wps: false, band: "5GHz", clients: 14 },
    { ssid: "CorpNet", bssid: "AA:BB:CC:DD:EE:02", channel: 6, signal: -55, encryption: "WPA2", auth: "Enterprise", wps: false, band: "2.4GHz", clients: 8 },
    { ssid: "Guest-WiFi", bssid: "AA:BB:CC:DD:EE:03", channel: 1, signal: -60, encryption: "WPA2", auth: "PSK", wps: true, band: "2.4GHz", clients: 3 },
    { ssid: "IoT-Network", bssid: "AA:BB:CC:DD:EE:04", channel: 11, signal: -68, encryption: "WPA2", auth: "PSK", wps: true, band: "2.4GHz", clients: 22 },
    { ssid: "HomeNet-Secure", bssid: "AA:BB:CC:DD:EE:05", channel: 44, signal: -50, encryption: "WPA3", auth: "SAE", wps: false, band: "5GHz", clients: 5 },
    { ssid: "<hidden>", bssid: "AA:BB:CC:DD:EE:06", channel: 149, signal: -72, encryption: "WPA2", auth: "PSK", wps: false, band: "5GHz", clients: 1 },
    { ssid: "OldRouter", bssid: "AA:BB:CC:DD:EE:07", channel: 3, signal: -78, encryption: "WEP", auth: "Shared", wps: false, band: "2.4GHz", clients: 0 },
    { ssid: "OpenCafe", bssid: "AA:BB:CC:DD:EE:08", channel: 6, signal: -65, encryption: "Open", auth: "None", wps: false, band: "2.4GHz", clients: 7 },
    { ssid: "WPA3-Only", bssid: "AA:BB:CC:DD:EE:09", channel: 153, signal: -45, encryption: "WPA3", auth: "SAE", wps: false, band: "5GHz", clients: 3 },
    { ssid: "Printer-WiFi", bssid: "AA:BB:CC:DD:EE:0A", channel: 1, signal: -82, encryption: "WPA2", auth: "PSK", wps: true, band: "2.4GHz", clients: 0 },
  ];

  let filtered = networks;
  if (channel) {
    filtered = filtered.filter((n) => n.channel === channel);
  }
  if (band) {
    const normalizedBand = band.toLowerCase();
    filtered = filtered.filter((n) => {
      if (normalizedBand.includes("2.4")) return n.band === "2.4GHz";
      if (normalizedBand.includes("5")) return n.band === "5GHz";
      if (normalizedBand.includes("6")) return false; // no 6GHz mock data
      return true;
    });
  }

  return filtered.map((n) => ({
    ...n,
    security_notes: n.encryption === "WEP"
      ? "CRITICAL: WEP is cryptographically broken. Can be cracked in minutes."
      : n.encryption === "Open"
        ? "WARNING: No encryption. All traffic visible to any listener."
        : n.wps
          ? "NOTE: WPS enabled - potential for Pixie Dust or brute force attacks."
          : n.encryption === "WPA3"
            ? "GOOD: WPA3-SAE provides strong protection against offline dictionary attacks."
            : undefined,
  }));
}

const wifi_scan_networks: ToolDef = {
  name: "wifi_scan_networks",
  description: "Simulate WiFi network scanning / parse airodump-ng output. Returns discovered networks with BSSID, SSID, channel, signal strength, encryption type, and WPS status.",
  schema: {
    interface: z.string().optional().describe("Wireless interface name (e.g. wlan0mon)"),
    channel: z.number().optional().describe("Specific channel to scan (1-165)"),
    band: z.string().optional().describe("Frequency band filter: 2.4, 5, or 6 GHz"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const iface = (args.interface as string) || "wlan0mon";
    const channel = args.channel as number | undefined;
    const band = args.band as string | undefined;

    const networks = generateMockNetworks(channel, band);

    const summary = {
      scan_interface: iface,
      scan_time: new Date().toISOString(),
      channel_filter: channel ?? "all",
      band_filter: band ?? "all",
      networks_found: networks.length,
      encryption_breakdown: {
        WPA3: networks.filter((n: any) => n.encryption === "WPA3").length,
        WPA2: networks.filter((n: any) => n.encryption === "WPA2").length,
        WEP: networks.filter((n: any) => n.encryption === "WEP").length,
        Open: networks.filter((n: any) => n.encryption === "Open").length,
      },
      wps_enabled_count: networks.filter((n: any) => n.wps).length,
      hidden_ssid_count: networks.filter((n: any) => n.ssid === "<hidden>").length,
      high_value_targets: networks.filter((n: any) =>
        n.encryption === "WEP" || n.encryption === "Open" || n.wps
      ).map((n: any) => ({
        bssid: n.bssid,
        ssid: n.ssid,
        reason: n.encryption === "WEP" ? "WEP encryption" : n.encryption === "Open" ? "No encryption" : "WPS enabled",
      })),
      networks,
    };

    return json(summary);
  },
};

const wifi_analyze_handshake: ToolDef = {
  name: "wifi_analyze_handshake",
  description: "Analyze a captured WPA/WPA2 handshake file metadata. Evaluates handshake quality, completeness, and provides cracking recommendations.",
  schema: {
    handshake_data: z.string().describe("Description of the handshake capture (e.g. 'WPA2 4-way handshake captured from BSSID AA:BB:CC:DD:EE:FF, SSID CorpNet, 2 of 4 EAPOL frames')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const data = args.handshake_data as string;
    const lower = data.toLowerCase();

    // Parse handshake details from description
    const hasAllFrames = lower.includes("4 of 4") || lower.includes("complete") || lower.includes("full");
    const hasTwoFrames = lower.includes("2 of 4") || lower.includes("msg1") && lower.includes("msg2");
    const hasOneFrame = lower.includes("1 of 4") || lower.includes("msg1");
    const isPMKID = lower.includes("pmkid");
    const isWPA3 = lower.includes("wpa3") || lower.includes("sae");
    const isWEP = lower.includes("wep");

    let quality: string;
    let crackable: boolean;
    let recommendations: string[];

    if (isWPA3) {
      quality = "N/A - WPA3-SAE does not use traditional handshake";
      crackable = false;
      recommendations = [
        "WPA3-SAE is resistant to offline dictionary attacks",
        "Consider Dragonblood side-channel attacks if target uses vulnerable implementation",
        "Check for WPA3 transition mode - may allow downgrade to WPA2",
      ];
    } else if (isWEP) {
      quality = "WEP - No handshake needed";
      crackable = true;
      recommendations = [
        "Capture ~40,000 IVs for PTW attack (aircrack-ng -z)",
        "Use chopchop or fragmentation attack to generate ARP packets",
        "WEP can be cracked in minutes with sufficient traffic",
      ];
    } else if (isPMKID) {
      quality = "PMKID - Excellent (clientless attack)";
      crackable = true;
      recommendations = [
        "Convert to hashcat format: hcxpcapngtool -o hash.22000 capture.pcapng",
        "Crack with hashcat: hashcat -m 22000 hash.22000 wordlist.txt",
        "Apply rules: hashcat -m 22000 hash.22000 wordlist.txt -r best64.rule",
        "For weak PSKs: hashcat -m 22000 hash.22000 -a 3 ?d?d?d?d?d?d?d?d (8-digit brute force)",
      ];
    } else if (hasAllFrames) {
      quality = "Complete 4-way handshake - Excellent quality";
      crackable = true;
      recommendations = [
        "Convert to hashcat format: hcxpcapngtool -o hash.22000 capture.pcapng",
        "Dictionary attack: hashcat -m 22000 hash.22000 rockyou.txt",
        "Rule-based: hashcat -m 22000 hash.22000 wordlist.txt -r best64.rule -r toggles1.rule",
        "Brute force 8-digit: hashcat -m 22000 hash.22000 -a 3 ?d?d?d?d?d?d?d?d",
        "Also try aircrack-ng for quick dictionary check",
      ];
    } else if (hasTwoFrames) {
      quality = "Partial handshake (2 of 4 EAPOL) - Sufficient for cracking";
      crackable = true;
      recommendations = [
        "2 EAPOL frames (msg1+msg2 or msg2+msg3) are sufficient for offline cracking",
        "Verify with aircrack-ng: aircrack-ng -w /dev/null capture.cap (should show 'handshake found')",
        "Convert and crack with hashcat -m 22000",
        "Consider recapturing for full handshake for better reliability",
      ];
    } else if (hasOneFrame) {
      quality = "Insufficient - Only 1 EAPOL frame captured";
      crackable = false;
      recommendations = [
        "Need at least 2 EAPOL frames (msg1+msg2 or msg2+msg3)",
        "Re-capture: send deauth then listen for reconnection",
        "aireplay-ng -0 5 -a <bssid> wlan0mon && airodump-ng --bssid <bssid> -c <ch> -w capture wlan0mon",
        "Try PMKID attack instead (no client needed): hcxdumptool",
      ];
    } else {
      quality = "Unknown - Could not determine handshake completeness from description";
      crackable = false;
      recommendations = [
        "Verify capture with: aircrack-ng capture.cap",
        "Check with wireshark: filter 'eapol'",
        "Try cowpatty -c to check handshake validity",
        "If no handshake, send deauth and re-capture",
      ];
    }

    return json({
      handshake_analysis: {
        input_description: data,
        quality,
        crackable,
        recommendations,
        tools: {
          verification: ["aircrack-ng", "cowpatty", "wireshark"],
          conversion: ["hcxpcapngtool", "hcxtools", "cap2hccapx"],
          cracking: ["hashcat", "aircrack-ng", "john"],
          gpu_benchmarks: {
            rtx_4090: "~2.5M PMKs/sec (WPA2)",
            rtx_3090: "~1.3M PMKs/sec (WPA2)",
            cloud_p100x8: "~3.4M PMKs/sec (WPA2)",
          },
        },
      },
    });
  },
};

const wifi_check_encryption: ToolDef = {
  name: "wifi_check_encryption",
  description: "Analyze WiFi encryption configuration for security weaknesses. Evaluates encryption protocol, authentication method, and optional PMF status.",
  schema: {
    ssid: z.string().describe("Network SSID"),
    encryption: z.enum(["WEP", "WPA", "WPA2", "WPA3", "Open"]).describe("Encryption protocol"),
    auth: z.enum(["PSK", "Enterprise"]).describe("Authentication method"),
    pmf: z.boolean().optional().describe("Protected Management Frames (802.11w) enabled"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const ssid = args.ssid as string;
    const encryption = args.encryption as string;
    const auth = args.auth as string;
    const pmf = args.pmf as boolean | undefined;

    type VulnEntry = { id: string; severity: string; description: string; remediation: string };
    const vulnerabilities: VulnEntry[] = [];
    let overallRisk = "UNKNOWN";
    let score = 0; // 0-100, higher = more secure

    switch (encryption) {
      case "Open":
        score = 0;
        overallRisk = "CRITICAL";
        vulnerabilities.push(
          { id: "NO-ENCRYPT", severity: "critical", description: "No encryption - all traffic visible to passive listeners", remediation: "Enable WPA3-SAE or at minimum WPA2" },
          { id: "NO-AUTH", severity: "critical", description: "No authentication - anyone can connect", remediation: "Implement WPA2/WPA3 with strong PSK or 802.1X" },
          { id: "MITM-TRIVIAL", severity: "critical", description: "Trivial man-in-the-middle via ARP spoofing on open network", remediation: "Use VPN or implement WPA2/WPA3" },
        );
        break;

      case "WEP":
        score = 5;
        overallRisk = "CRITICAL";
        vulnerabilities.push(
          { id: "WEP-BROKEN", severity: "critical", description: "WEP is cryptographically broken. Key recoverable in minutes with ~40k IVs.", remediation: "Upgrade to WPA2 or WPA3 immediately" },
          { id: "WEP-IV-REUSE", severity: "critical", description: "24-bit IV space leads to IV reuse and key stream recovery", remediation: "No fix - protocol fundamentally flawed" },
          { id: "WEP-CRC32", severity: "high", description: "CRC32 integrity check allows packet modification without detection", remediation: "Upgrade to WPA2+ which uses CCMP/GCMP" },
        );
        break;

      case "WPA":
        score = 25;
        overallRisk = "HIGH";
        vulnerabilities.push(
          { id: "WPA-TKIP", severity: "high", description: "WPA uses TKIP which has known weaknesses (Beck-Tews, Ohigashi-Morii attacks)", remediation: "Upgrade to WPA2 with CCMP/AES" },
          { id: "WPA-OFFLINE-CRACK", severity: "high", description: "WPA handshake vulnerable to offline dictionary/brute-force attacks", remediation: "Use WPA3-SAE or strong 20+ char random PSK" },
        );
        break;

      case "WPA2":
        score = auth === "Enterprise" ? 70 : 55;
        overallRisk = auth === "Enterprise" ? "MEDIUM" : "MEDIUM-HIGH";
        vulnerabilities.push(
          { id: "WPA2-OFFLINE-CRACK", severity: "high", description: "WPA2 handshake/PMKID vulnerable to offline dictionary attacks", remediation: "Use strong random PSK (20+ chars) or upgrade to WPA3" },
          { id: "WPA2-KRACK", severity: "high", description: "Vulnerable to KRACK key reinstallation attack (CVE-2017-13077+)", remediation: "Ensure all devices have KRACK patches applied" },
        );
        if (!pmf) {
          vulnerabilities.push(
            { id: "NO-PMF", severity: "medium", description: "No PMF (802.11w) - management frames unprotected, deauth attacks possible", remediation: "Enable 802.11w PMF (required or optional)" },
          );
          score -= 10;
        } else {
          score += 10;
        }
        if (auth === "PSK") {
          vulnerabilities.push(
            { id: "PSK-SHARED", severity: "medium", description: "PSK shared among all users - one compromise exposes everyone", remediation: "Use 802.1X/EAP for per-user authentication" },
          );
        } else {
          vulnerabilities.push(
            { id: "EAP-DOWNGRADE", severity: "medium", description: "WPA2-Enterprise may be vulnerable to Evil Twin EAP credential capture if cert validation is weak", remediation: "Pin RADIUS certificate in supplicant, use EAP-TLS" },
          );
          score += 5;
        }
        break;

      case "WPA3":
        score = auth === "Enterprise" ? 90 : 80;
        overallRisk = "LOW";
        vulnerabilities.push(
          { id: "WPA3-DRAGONBLOOD", severity: "medium", description: "Dragonblood side-channel attacks (CVE-2019-9494+) on older implementations", remediation: "Ensure firmware is patched for Dragonblood" },
        );
        if (auth === "PSK") {
          // WPA3-Personal uses SAE, not PSK, but semantically similar
          score += 5;
        } else {
          vulnerabilities.push(
            { id: "WPA3-192", severity: "low", description: "Ensure 192-bit security mode is enabled for Enterprise", remediation: "Configure WPA3-Enterprise 192-bit mode (CNSA suite)" },
          );
          score += 10;
        }
        if (pmf === false) {
          // WPA3 mandates PMF, this is a misconfiguration
          vulnerabilities.push(
            { id: "WPA3-PMF-DISABLED", severity: "high", description: "WPA3 requires PMF - disabling it violates the spec and may break security guarantees", remediation: "Enable PMF (it is mandatory for WPA3)" },
          );
          score -= 20;
        }
        break;
    }

    return json({
      assessment: {
        ssid,
        encryption,
        authentication: auth,
        pmf_enabled: pmf ?? "unknown",
        overall_risk: overallRisk,
        security_score: Math.max(0, Math.min(100, score)),
        vulnerabilities,
        recommendations: [
          ...(encryption !== "WPA3" ? ["Upgrade to WPA3-SAE where supported"] : []),
          ...(auth === "PSK" ? ["Consider 802.1X/EAP for enterprise environments"] : []),
          ...(pmf !== true ? ["Enable 802.11w Protected Management Frames"] : []),
          "Regularly rotate pre-shared keys",
          "Deploy WIDS/WIPS for rogue AP detection",
          "Segment WiFi from critical network resources",
        ],
      },
    });
  },
};

const wifi_enumerate_clients: ToolDef = {
  name: "wifi_enumerate_clients",
  description: "Parse client enumeration data from airodump-ng or similar tools. Returns structured client list with probe requests and association status.",
  schema: {
    ap_bssid: z.string().describe("Target access point BSSID"),
    client_data: z.string().describe("Raw client enumeration data (e.g. airodump-ng output or CSV)"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const apBssid = args.ap_bssid as string;
    const rawData = args.client_data as string;

    // Parse client data from various formats
    const lines = rawData.split("\n").filter((l) => l.trim().length > 0);
    const clients: Record<string, unknown>[] = [];
    const macRegex = /([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}/g;

    for (const line of lines) {
      const macs = line.match(macRegex);
      if (!macs || macs.length === 0) continue;

      const clientMac = macs.find((m) => m.toUpperCase() !== apBssid.toUpperCase());
      if (!clientMac) continue;

      // Extract signal strength if present
      const signalMatch = line.match(/-?\d+\s*dBm/i) || line.match(/\s(-\d{2,3})\s/);
      const signal = signalMatch ? parseInt(signalMatch[1] || signalMatch[0]) : undefined;

      // Extract probe requests
      const probeMatch = line.match(/Probe[s]?[:\s]+(.+)/i);
      const probes = probeMatch
        ? probeMatch[1].split(",").map((p) => p.trim()).filter(Boolean)
        : [];

      // Determine association status
      const isAssociated = line.toLowerCase().includes(apBssid.toLowerCase()) ||
        line.toLowerCase().includes("associated") ||
        line.toLowerCase().includes("auth");

      // Determine vendor from OUI
      const oui = clientMac.substring(0, 8).toUpperCase().replace(/[:-]/g, ":");
      const vendorMap: Record<string, string> = {
        "AA:BB:CC": "Unknown/Simulated",
        "DC:A6:32": "Raspberry Pi",
        "B8:27:EB": "Raspberry Pi",
        "3C:22:FB": "Apple",
        "F0:18:98": "Apple",
        "00:50:F2": "Microsoft",
        "AC:DE:48": "Intel",
        "00:0C:29": "VMware",
        "08:00:27": "VirtualBox",
      };
      const vendor = vendorMap[oui] || "Unknown";

      clients.push({
        mac: clientMac.toUpperCase(),
        vendor,
        associated_to: isAssociated ? apBssid : "not associated",
        signal_dbm: signal,
        probe_requests: probes,
        potential_attacks: [
          ...(probes.length > 0
            ? ["KARMA attack - client probing for known SSIDs"]
            : []),
          ...(isAssociated
            ? ["Deauth + handshake capture", "Evil Twin after deauth"]
            : ["Evil Twin with probed SSID"]),
        ],
      });
    }

    // Deduplicate by MAC
    const uniqueClients = Array.from(
      new Map(clients.map((c) => [c.mac as string, c])).values()
    );

    return json({
      target_ap: apBssid,
      total_clients: uniqueClients.length,
      associated_clients: uniqueClients.filter((c: any) => c.associated_to !== "not associated").length,
      probing_clients: uniqueClients.filter((c: any) => (c.probe_requests as string[]).length > 0).length,
      all_probed_ssids: [...new Set(uniqueClients.flatMap((c: any) => c.probe_requests as string[]))],
      clients: uniqueClients,
      recommendations: [
        uniqueClients.length > 0
          ? `${uniqueClients.length} client(s) detected. Target high-value clients for handshake capture.`
          : "No clients detected. Try scanning longer or use PMKID attack (clientless).",
        "Clients with probe requests are vulnerable to KARMA/Evil Twin attacks.",
        "Use targeted deauth against specific clients to capture handshake without alerting WIDS.",
      ],
    });
  },
};

const wifi_channel_analysis: ToolDef = {
  name: "wifi_channel_analysis",
  description: "Analyze WiFi channel usage, interference, and congestion. Provides channel utilization metrics and optimal channel recommendations.",
  schema: {
    scan_data: z.string().describe("Raw scan data (text or JSON) containing channel and signal information"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const rawData = args.scan_data as string;

    // Try to parse as JSON, otherwise parse as text
    let networks: { channel: number; signal: number; ssid: string; band: string }[] = [];

    try {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        networks = parsed.map((n: any) => ({
          channel: n.channel || 0,
          signal: n.signal || n.signal_dbm || -80,
          ssid: n.ssid || "unknown",
          band: n.channel > 14 ? "5GHz" : "2.4GHz",
        }));
      }
    } catch {
      // Parse text format (e.g. airodump-ng style)
      const lines = rawData.split("\n");
      for (const line of lines) {
        const chMatch = line.match(/ch(?:annel)?[:\s]*(\d+)/i);
        const sigMatch = line.match(/(-\d{2,3})/);
        const ssidMatch = line.match(/ssid[:\s]*([^\s,]+)/i);
        if (chMatch) {
          const ch = parseInt(chMatch[1]);
          networks.push({
            channel: ch,
            signal: sigMatch ? parseInt(sigMatch[1]) : -75,
            ssid: ssidMatch ? ssidMatch[1] : "unknown",
            band: ch > 14 ? "5GHz" : "2.4GHz",
          });
        }
      }
    }

    // If no data parsed, provide generic analysis
    if (networks.length === 0) {
      return json({
        warning: "Could not parse network data. Provide JSON array or text with channel information.",
        example_format: '[{"channel": 6, "signal": -55, "ssid": "MyNetwork"}]',
        general_recommendations: {
          "2.4GHz": "Use non-overlapping channels: 1, 6, or 11",
          "5GHz": "Use DFS channels (52-144) for less interference. Non-DFS: 36-48, 149-165",
          "6GHz": "WiFi 6E only. 59 non-overlapping 20MHz channels. Least interference.",
        },
      });
    }

    // Channel utilization analysis
    const channelMap = new Map<number, { count: number; signals: number[]; ssids: string[] }>();
    for (const n of networks) {
      const entry = channelMap.get(n.channel) || { count: 0, signals: [], ssids: [] };
      entry.count++;
      entry.signals.push(n.signal);
      entry.ssids.push(n.ssid);
      channelMap.set(n.channel, entry);
    }

    const channelAnalysis = Array.from(channelMap.entries())
      .map(([ch, data]) => {
        const avgSignal = data.signals.reduce((a, b) => a + b, 0) / data.signals.length;
        const congestion = data.count > 5 ? "high" : data.count > 2 ? "moderate" : "low";
        return {
          channel: ch,
          band: ch > 14 ? "5GHz" : "2.4GHz",
          network_count: data.count,
          avg_signal_dbm: Math.round(avgSignal),
          strongest_signal_dbm: Math.max(...data.signals),
          congestion_level: congestion,
          ssids: data.ssids,
        };
      })
      .sort((a, b) => b.network_count - a.network_count);

    // Find recommended channels
    const usedChannels2g = new Set(networks.filter((n) => n.band === "2.4GHz").map((n) => n.channel));
    const usedChannels5g = new Set(networks.filter((n) => n.band === "5GHz").map((n) => n.channel));

    const nonOverlapping2g = [1, 6, 11];
    const recommended2g = nonOverlapping2g
      .filter((ch) => !usedChannels2g.has(ch))
      .concat(nonOverlapping2g.sort((a, b) =>
        (channelMap.get(a)?.count || 0) - (channelMap.get(b)?.count || 0)
      ));

    const available5g = [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 149, 153, 157, 161, 165];
    const recommended5g = available5g.filter((ch) => !usedChannels5g.has(ch)).slice(0, 5);

    return json({
      total_networks_analyzed: networks.length,
      band_breakdown: {
        "2.4GHz": networks.filter((n) => n.band === "2.4GHz").length,
        "5GHz": networks.filter((n) => n.band === "5GHz").length,
      },
      channel_analysis: channelAnalysis,
      recommendations: {
        "2.4GHz_best_channels": recommended2g.slice(0, 3),
        "5GHz_best_channels": recommended5g,
        notes: [
          "2.4GHz: Only channels 1, 6, 11 are non-overlapping (20MHz width)",
          "5GHz: DFS channels (52-144) often less crowded but require radar detection",
          "For pentesting: target congested channels where deauth will be less noticeable",
          "Less congested channels = easier to isolate target traffic",
        ],
      },
      security_implications: {
        congested_channels: "Deauth attacks on congested channels are harder to attribute via WIDS",
        isolated_targets: networks.filter((n) => {
          const entry = channelMap.get(n.channel);
          return entry && entry.count === 1;
        }).map((n) => ({
          ssid: n.ssid,
          channel: n.channel,
          note: "Sole network on channel - easier to target but deauth more noticeable",
        })),
      },
    });
  },
};

export const wifiReconTools: ToolDef[] = [
  wifi_scan_networks,
  wifi_analyze_handshake,
  wifi_check_encryption,
  wifi_enumerate_clients,
  wifi_channel_analysis,
];

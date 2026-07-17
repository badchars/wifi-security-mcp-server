import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ─── Tool 1: mac_rand_bypass ───

const mac_rand_bypass: ToolDef = {
  name: "mac_rand_bypass",
  description: "MAC randomization bypass techniques per operating system. Returns OS-specific methods to deanonymize devices despite MAC randomization including probe request analysis, timing correlation, and information element fingerprinting.",
  schema: {
    target_os: z.enum(["android", "ios", "windows", "linux"]).describe("Target device operating system"),
    target_version: z.string().describe("Target OS version (e.g., '14', '13.0', '11', '22H2')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const targetOs = args.target_os as string;
    const targetVersion = args.target_version as string;

    const techniques: Record<string, {
      randomization_impl: string;
      known_weaknesses: { name: string; description: string; applicability: string; commands: string[] }[];
      version_notes: string[];
    }> = {
      android: {
        randomization_impl: "Android 10+ uses per-SSID persistent randomized MAC. Android 14+ adds non-persistent randomization option. Pre-Android 10 uses factory MAC.",
        known_weaknesses: [
          {
            name: "Probe Request Sequence Number Reset",
            description: "Android resets 802.11 sequence numbers when cycling random MACs. The reset pattern (seq jumps from high to 0) reveals MAC changes belonging to the same device.",
            applicability: "Android 10-13 (partially fixed in Android 14)",
            commands: [
              "# Capture probe requests and analyze sequence numbers:",
              "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x04' -T fields -e wlan.sa -e wlan.seq -e wlan_mgt.ssid",
              "# Look for sequence number resets (e.g., 4091 -> 0) across different MACs",
            ],
          },
          {
            name: "Information Element (IE) Ordering Fingerprint",
            description: "The order and content of Information Elements in probe requests is deterministic per device model and OS version. Even with MAC randomization, IE ordering uniquely identifies device type.",
            applicability: "All Android versions",
            commands: [
              "# Extract IE fingerprints from probe requests:",
              "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x04' -T fields -e wlan.sa -e wlan.tag.number",
              "# Compare IE ordering patterns across randomized MACs",
            ],
          },
          {
            name: "Per-SSID Persistent MAC",
            description: "Android uses a persistent randomized MAC per SSID. The same device always uses the same random MAC for a given SSID. Tracking is possible within SSID scope.",
            applicability: "Android 10+ (default behavior)",
            commands: [
              "# Monitor probe requests for specific SSID:",
              "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x04 && wlan_mgt.ssid == \"TargetSSID\"'",
              "# Same device will use same random MAC for this SSID across sessions",
            ],
          },
          {
            name: "96% Deanonymization via Timing + IE Correlation",
            description: "Research by Vanhoef et al. showed 96% deanonymization rate on Android by combining probe timing patterns, IE fingerprints, and sequence number analysis.",
            applicability: "Android 10-13",
            commands: [
              "# Requires custom analysis script combining:",
              "# 1. Probe request timing intervals",
              "# 2. IE ordering hash",
              "# 3. Sequence number gap analysis",
            ],
          },
        ],
        version_notes: [
          `Target version: Android ${targetVersion}`,
          parseInt(targetVersion) < 10 ? "WARNING: This version does NOT randomize MACs. Real MAC is always used." : "",
          parseInt(targetVersion) >= 14 ? "Android 14 adds non-persistent randomization option, but most users use default (per-SSID persistent)." : "",
        ].filter(Boolean),
      },
      ios: {
        randomization_impl: "iOS 14+ uses per-network randomized MAC (Private Wi-Fi Address). iOS 18+ adds rotating random MAC. Pre-iOS 14 uses factory MAC when associated.",
        known_weaknesses: [
          {
            name: "mDNS/Bonjour Device Name Leak",
            description: "Even with MAC randomization, iOS devices broadcast mDNS (Bonjour) packets containing the device name (e.g., 'John's iPhone'). This links randomized MACs to a person.",
            applicability: "All iOS versions with Bonjour enabled",
            commands: [
              "# Capture mDNS traffic to correlate device names with random MACs:",
              "tshark -i wlan0mon -Y 'mdns' -T fields -e wlan.sa -e dns.qry.name",
              "# Look for '_tcp.local' queries containing device names",
            ],
          },
          {
            name: "DHCP Hostname Leak",
            description: "iOS sends the device hostname in DHCP requests (Option 12). This persists across MAC changes and reveals the device owner.",
            applicability: "iOS 14-17 (improved in iOS 18)",
            commands: [
              "# Capture DHCP requests for hostname:",
              "tshark -i wlan0 -Y 'bootp.option.type == 12' -T fields -e eth.src -e bootp.option.hostname",
            ],
          },
          {
            name: "WiFi Calling / VoWiFi Correlation",
            description: "WiFi Calling traffic patterns (consistent IPSEC tunnel to carrier) persist across MAC changes, allowing temporal correlation.",
            applicability: "iOS devices with WiFi Calling enabled",
            commands: [
              "# Monitor for persistent IPSEC tunnels:",
              "tshark -i wlan0 -Y 'esp || isakmp' -T fields -e ip.src -e ip.dst",
            ],
          },
          {
            name: "Probe Request Burst Timing",
            description: "iOS probe request burst patterns (number of probes, inter-probe timing) create a temporal fingerprint unique per device hardware.",
            applicability: "All iOS versions",
            commands: [
              "# Analyze probe burst timing:",
              "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x04' -T fields -e wlan.sa -e frame.time_relative",
            ],
          },
        ],
        version_notes: [
          `Target version: iOS ${targetVersion}`,
          parseInt(targetVersion) < 14 ? "WARNING: iOS < 14 only randomizes during scanning, uses real MAC when associated." : "",
          parseInt(targetVersion) >= 18 ? "iOS 18 adds rotating Wi-Fi address (changes periodically even when connected). Harder to track but timing correlation still works." : "",
        ].filter(Boolean),
      },
      windows: {
        randomization_impl: "Windows 10/11 supports random hardware addresses per-SSID (opt-in, disabled by default). When enabled, uses per-SSID persistent random MAC.",
        known_weaknesses: [
          {
            name: "Disabled by Default",
            description: "MAC randomization is disabled by default on Windows. Most Windows devices use their real factory MAC address.",
            applicability: "Windows 10/11 default configuration",
            commands: [
              "# On target Windows device, check status:",
              "# Settings > Network > Wi-Fi > Random hardware addresses",
              "# From monitoring perspective: check if OUI matches real vendor vs locally-administered bit",
              "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x04' -T fields -e wlan.sa",
              "# Locally-administered bit (2nd char is 2,6,A,E) = randomized; otherwise real MAC",
            ],
          },
          {
            name: "NetBIOS/LLMNR Name Broadcast",
            description: "Windows broadcasts NetBIOS and LLMNR name resolution queries containing the computer hostname, linking randomized MACs to the device.",
            applicability: "All Windows versions with NetBIOS/LLMNR enabled (default)",
            commands: [
              "# Capture NetBIOS/LLMNR broadcasts:",
              "tshark -i wlan0 -Y 'nbns || llmnr' -T fields -e eth.src -e nbns.name -e dns.qry.name",
            ],
          },
          {
            name: "SMB Traffic Device Identification",
            description: "Windows SMB traffic exposes OS version, computer name, and domain membership even with randomized MAC.",
            applicability: "All Windows versions",
            commands: [
              "# Capture SMB negotiation:",
              "tshark -i wlan0 -Y 'smb2.cmd == 0' -T fields -e eth.src -e smb2.negotiate_context.data",
            ],
          },
        ],
        version_notes: [
          `Target version: Windows ${targetVersion}`,
          "Windows MAC randomization is per-SSID persistent when enabled.",
          "Enterprise deployments typically disable randomization via Group Policy for NAC compatibility.",
        ],
      },
      linux: {
        randomization_impl: "NetworkManager 1.4+ supports MAC randomization (scan: random, connect: stable per SSID). iwd supports full randomization. Behavior varies by distribution.",
        known_weaknesses: [
          {
            name: "Distribution-Dependent Configuration",
            description: "MAC randomization behavior varies widely across Linux distributions. Ubuntu enables scan randomization by default; many others do not.",
            applicability: "All Linux distributions",
            commands: [
              "# Check NetworkManager config:",
              "cat /etc/NetworkManager/conf.d/wifi_rand_mac.conf",
              "# Typical content for randomization:",
              "# [device]",
              "# wifi.scan-rand-mac-address=yes",
              "# [connection]",
              "# wifi.cloned-mac-address=stable",
            ],
          },
          {
            name: "DHCP Client Identifier Persistence",
            description: "Some Linux DHCP clients send a persistent client-id (Option 61) that does not change with MAC randomization.",
            applicability: "Linux with dhclient or older DHCP implementations",
            commands: [
              "# Capture DHCP Client ID:",
              "tshark -i wlan0 -Y 'bootp.option.type == 61' -T fields -e eth.src -e bootp.option.value",
            ],
          },
          {
            name: "Avahi/mDNS Service Announcement",
            description: "Linux systems running Avahi (mDNS) broadcast hostname and service information that persists across MAC changes.",
            applicability: "Linux with Avahi enabled (default on most desktop distros)",
            commands: [
              "# Capture Avahi announcements:",
              "tshark -i wlan0 -Y 'mdns' -T fields -e eth.src -e dns.resp.name",
            ],
          },
        ],
        version_notes: [
          `Target version: ${targetVersion}`,
          "Check specific NetworkManager or iwd version for randomization support.",
          "Kernel 5.0+ required for full MAC randomization support.",
        ],
      },
    };

    const result = techniques[targetOs];

    return json({
      mac_randomization_bypass: {
        target_os: targetOs,
        target_version: targetVersion,
        randomization_implementation: result.randomization_impl,
        bypass_techniques: result.known_weaknesses,
        version_notes: result.version_notes,
        universal_techniques: [
          "Information Element (IE) ordering fingerprint — works across all OSes",
          "Probe request timing analysis — burst patterns are hardware-dependent",
          "Traffic pattern analysis — VPN endpoints, DNS queries, application behavior",
          "Physical layer (PHY) fingerprinting — clock skew, signal characteristics",
        ],
        tools: [
          { name: "Kismet", purpose: "Passive probe request collection and device fingerprinting" },
          { name: "Wireshark/tshark", purpose: "Packet analysis and IE extraction" },
          { name: "ProbeSniffer", purpose: "Probe request collection and analysis" },
          { name: "WiFi Probe Fingerprinter", purpose: "Academic tool for device identification" },
        ],
      },
    });
  },
};

// ─── Tool 2: mac_rand_assess ───

const mac_rand_assess: ToolDef = {
  name: "mac_rand_assess",
  description: "Assess MAC randomization implementation quality for a specific OS and version. Returns implementation details, known weaknesses, deanonymization research results, and overall privacy score.",
  schema: {
    os: z.enum(["android", "ios", "windows", "linux"]).describe("Operating system to assess"),
    version: z.string().describe("OS version to assess (e.g., '14', '17.4', '11', '6.5')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const os = args.os as string;
    const version = args.version as string;

    interface Assessment {
      scan_randomization: { enabled: boolean; type: string; quality: string };
      association_randomization: { enabled: boolean; type: string; quality: string };
      known_leaks: string[];
      research_results: { paper: string; finding: string; deanonymization_rate: string }[];
      privacy_score: number;
      overall_grade: string;
    }

    const assessments: Record<string, (ver: string) => Assessment> = {
      android: (ver: string) => {
        const v = parseInt(ver);
        if (v < 10) {
          return {
            scan_randomization: { enabled: false, type: "none", quality: "N/A" },
            association_randomization: { enabled: false, type: "none", quality: "N/A" },
            known_leaks: ["Real MAC used for all operations", "Full device tracking possible"],
            research_results: [],
            privacy_score: 0,
            overall_grade: "F",
          };
        }
        return {
          scan_randomization: { enabled: true, type: "random per scan cycle", quality: v >= 14 ? "Good" : "Moderate" },
          association_randomization: { enabled: true, type: "per-SSID persistent", quality: "Moderate — same MAC reused for same SSID" },
          known_leaks: [
            "Sequence number reset pattern reveals MAC changes (pre-Android 14)",
            "IE ordering fingerprint identifies device model",
            "Per-SSID persistent MAC allows tracking within SSID scope",
            "DHCP hostname may leak device name",
            v < 14 ? "96% deanonymization rate demonstrated by researchers" : "Improved in Android 14 but IE fingerprint still works",
          ],
          research_results: [
            { paper: "Vanhoef et al. (2016) - Why MAC Address Randomization is not Enough", finding: "96% device deanonymization using probe request analysis", deanonymization_rate: "96%" },
            { paper: "Martin et al. (2017) - A Study of MAC Randomization", finding: "IE ordering creates stable device fingerprint across MAC changes", deanonymization_rate: "~90%" },
          ],
          privacy_score: v >= 14 ? 55 : 35,
          overall_grade: v >= 14 ? "C" : "D",
        };
      },
      ios: (ver: string) => {
        const v = parseInt(ver);
        if (v < 14) {
          return {
            scan_randomization: { enabled: true, type: "random per scan (since iOS 8)", quality: "Basic" },
            association_randomization: { enabled: false, type: "real MAC when connected", quality: "N/A" },
            known_leaks: ["Real MAC used when associated to AP", "Tracking trivial once connected", "Scan randomization only protects during passive scanning"],
            research_results: [],
            privacy_score: 15,
            overall_grade: "F",
          };
        }
        return {
          scan_randomization: { enabled: true, type: v >= 18 ? "rotating random" : "random per scan", quality: v >= 18 ? "Excellent" : "Good" },
          association_randomization: { enabled: true, type: v >= 18 ? "rotating per-network" : "per-network persistent", quality: v >= 18 ? "Very Good" : "Good" },
          known_leaks: [
            "mDNS/Bonjour broadcasts device name",
            "DHCP hostname reveals device owner (pre-iOS 18)",
            v >= 18 ? "Rotating MAC significantly improves privacy but timing correlation still possible" : "Per-network persistent MAC allows within-network tracking",
            "WiFi Calling creates persistent tunnel fingerprint",
            "IE ordering still allows device model identification",
          ],
          research_results: [
            { paper: "Apple Privacy (2020) - Private Wi-Fi Address", finding: "Per-network random MAC with opt-out for managed networks", deanonymization_rate: "Reduced to ~40% with mDNS correlation" },
            { paper: "Becker et al. (2023) - Tracking iOS 14+ Devices", finding: "mDNS hostname leak allows user identification despite MAC randomization", deanonymization_rate: "~60% via mDNS" },
          ],
          privacy_score: v >= 18 ? 75 : 60,
          overall_grade: v >= 18 ? "B+" : "B-",
        };
      },
      windows: (ver: string) => ({
        scan_randomization: { enabled: false, type: "opt-in only", quality: "N/A by default" },
        association_randomization: { enabled: false, type: "opt-in only", quality: "N/A by default" },
        known_leaks: [
          "MAC randomization disabled by default",
          "NetBIOS/LLMNR broadcasts reveal hostname",
          "SMB negotiation reveals OS and computer name",
          "When enabled: per-SSID persistent (similar to Android)",
          "Enterprise Group Policy often disables randomization",
        ],
        research_results: [
          { paper: "Microsoft (2015) - Random Hardware Addresses", finding: "Opt-in feature with per-SSID stable randomization", deanonymization_rate: "~99% of Windows devices use real MAC (feature disabled by default)" },
        ],
        privacy_score: 10,
        overall_grade: "F",
      }),
      linux: (ver: string) => ({
        scan_randomization: { enabled: true, type: "NetworkManager 1.4+ default", quality: "Moderate" },
        association_randomization: { enabled: true, type: "stable per-SSID (cloned-mac-address=stable)", quality: "Moderate" },
        known_leaks: [
          "Behavior varies by distribution and configuration",
          "Avahi/mDNS broadcasts hostname",
          "DHCP client-id may persist across MAC changes",
          "Some distributions disable randomization by default",
          "iwd provides better randomization than NetworkManager",
        ],
        research_results: [
          { paper: "GNOME/NetworkManager (2016) - MAC Randomization", finding: "Scan randomization enabled by default, connection randomization opt-in", deanonymization_rate: "Varies by configuration" },
        ],
        privacy_score: 40,
        overall_grade: "D+",
      }),
    };

    const assessFn = assessments[os];
    const assessment = assessFn(version);

    return json({
      mac_randomization_assessment: {
        os,
        version,
        scan_randomization: assessment.scan_randomization,
        association_randomization: assessment.association_randomization,
        known_information_leaks: assessment.known_leaks,
        academic_research: assessment.research_results,
        privacy_score: assessment.privacy_score,
        overall_grade: assessment.overall_grade,
        recommendations: assessment.privacy_score < 50
          ? [
              "MAC randomization alone is insufficient for privacy",
              "Disable mDNS/Bonjour when not needed",
              "Use VPN to encrypt all traffic regardless of MAC",
              "Disable unnecessary network services (NetBIOS, LLMNR)",
              "Consider using Tails OS for maximum WiFi privacy",
            ]
          : [
              "Good baseline privacy from MAC randomization",
              "Disable mDNS to prevent hostname leaks",
              "Monitor for probe request IE fingerprinting",
              "Use VPN as additional privacy layer",
            ],
      },
    });
  },
};

// ─── Tool 3: mac_rand_tracking ───

const mac_rand_tracking: ToolDef = {
  name: "mac_rand_tracking",
  description: "Device tracking techniques despite MAC randomization. Returns comprehensive tracking methods using probe request analysis, sequence number correlation, timing patterns, IE fingerprinting, and physical layer signatures.",
  schema: {},
  async execute(_args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    return json({
      device_tracking_techniques: {
        layer2_techniques: [
          {
            name: "802.11 Sequence Number Analysis",
            effectiveness: "High (80-96%)",
            description: "Track sequence number patterns across randomized MACs. Devices reset sequence counters when changing MAC, creating detectable gaps. Sequence number increments are also device-specific.",
            detection_method: "passive",
            tools: ["tshark", "Kismet", "custom Python scripts"],
            commands: [
              "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x04' -T fields -e wlan.sa -e wlan.seq -e frame.time_epoch",
              "# Correlate: high seq -> 0 reset = same device, new MAC",
            ],
          },
          {
            name: "Information Element (IE) Fingerprinting",
            effectiveness: "High (85-95%)",
            description: "The order, type, and content of IEs in probe/association requests are deterministic per device model and driver. This creates a stable fingerprint across MAC changes.",
            detection_method: "passive",
            tools: ["tshark", "p0f", "Satori"],
            commands: [
              "tshark -i wlan0mon -Y 'wlan.fc.type_subtype == 0x04' -T fields -e wlan.sa -e wlan.tag.number -e wlan.tag.length",
              "# Hash the IE order to create device fingerprint",
            ],
          },
          {
            name: "Probe Request SSID List Correlation",
            effectiveness: "Medium-High (60-80%)",
            description: "Devices probe for their saved SSID list. The combination of probed SSIDs creates a unique fingerprint. Even with randomized MAC, the SSID list identifies the user.",
            detection_method: "passive",
            tools: ["Kismet", "ProbeSniffer", "airodump-ng"],
            commands: [
              "airodump-ng wlan0mon --essid-regex '.*'",
              "# Build SSID fingerprint per source MAC, then correlate across MAC changes",
            ],
          },
        ],
        timing_techniques: [
          {
            name: "Probe Burst Timing Pattern",
            effectiveness: "Medium (50-70%)",
            description: "Each device has characteristic probe burst patterns (number of probes per burst, inter-probe delay, burst interval). These are hardware/driver dependent and persist across MAC changes.",
            detection_method: "passive",
            tools: ["tshark", "custom analysis"],
          },
          {
            name: "MAC Change Interval Analysis",
            effectiveness: "Medium (40-60%)",
            description: "The interval between MAC changes is often fixed per OS/version. Correlate disappearance of one MAC with appearance of another at matching intervals.",
            detection_method: "passive",
            tools: ["Kismet", "custom scripts"],
          },
          {
            name: "Temporal Correlation",
            effectiveness: "Medium (50-65%)",
            description: "In low-density environments, a new random MAC appearing within seconds of another disappearing likely belongs to the same device.",
            detection_method: "passive",
            tools: ["custom analysis"],
          },
        ],
        physical_layer_techniques: [
          {
            name: "Clock Skew Fingerprinting",
            effectiveness: "High (90%+)",
            description: "Each device's clock crystal has a unique drift rate. By measuring TSF (Timing Synchronization Function) or beacon timestamps, devices can be identified regardless of MAC address.",
            detection_method: "passive",
            tools: ["custom firmware", "nexmon", "specialized hardware"],
          },
          {
            name: "RF Fingerprinting",
            effectiveness: "Very High (95%+)",
            description: "Each radio transmitter has unique analog imperfections (IQ imbalance, frequency offset, power amplifier nonlinearity). These create a hardware-level fingerprint immune to MAC changes.",
            detection_method: "passive (specialized)",
            tools: ["USRP/SDR", "custom ML models"],
          },
          {
            name: "Signal Strength Triangulation",
            effectiveness: "Medium (location-based)",
            description: "With multiple monitoring APs, triangulate device location via RSSI. A device changing MAC but maintaining the same physical location/movement pattern is the same device.",
            detection_method: "passive (multi-sensor)",
            tools: ["Cisco CMX", "Aruba Analytics", "Ekahau"],
          },
        ],
        network_layer_techniques: [
          {
            name: "DHCP Fingerprinting",
            effectiveness: "High (80%+)",
            description: "DHCP request options (parameter request list, vendor class, hostname) create OS and device fingerprints that persist across MAC changes.",
            detection_method: "passive (on-network)",
            tools: ["fingerbank", "p0f", "tshark"],
          },
          {
            name: "mDNS/DNS-SD Service Discovery",
            effectiveness: "High (75%+)",
            description: "Bonjour/Avahi service announcements contain device names and service types that directly identify users regardless of MAC.",
            detection_method: "passive (on-network)",
            tools: ["avahi-browse", "dns-sd", "tshark"],
          },
          {
            name: "HTTP User-Agent Correlation",
            effectiveness: "Medium-High (60-80%)",
            description: "Browser User-Agent strings and TLS client hello fingerprints (JA3/JA4) persist across MAC changes and can identify specific devices.",
            detection_method: "passive (on-network)",
            tools: ["JA3", "JA4", "Bro/Zeek"],
          },
        ],
        combined_approach: {
          description: "Combining multiple techniques dramatically increases tracking accuracy. A multi-signal approach using IE fingerprint + timing + DHCP achieves >95% deanonymization.",
          recommended_pipeline: [
            "1. Passive probe capture (IE fingerprint + sequence analysis)",
            "2. Timing correlation (probe burst + MAC change interval)",
            "3. On-network correlation (DHCP + mDNS + DNS queries)",
            "4. Optional: Physical layer fingerprinting for high-value targets",
          ],
        },
        countermeasures: [
          "Use Tails OS with randomized IEs (rare)",
          "Disable mDNS/Bonjour/Avahi",
          "Use VPN to mask network-layer fingerprints",
          "Disable unnecessary network services",
          "Use manual DHCP with randomized hostname",
          "Use Tor for DNS privacy",
          "Physical: use directional antenna to limit observable signal",
        ],
      },
    });
  },
};

// ─── Export ───

export const macRandomizationTools: ToolDef[] = [
  mac_rand_bypass,
  mac_rand_assess,
  mac_rand_tracking,
];

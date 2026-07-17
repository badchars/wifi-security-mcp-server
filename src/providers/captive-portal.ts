import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ─── Tool 1: captive_portal_bypass ───

const captive_portal_bypass: ToolDef = {
  name: "captive_portal_bypass",
  description: "Captive portal bypass techniques. Returns documented methods for bypassing MAC-based, browser redirect, and DNS-based captive portals including MAC spoofing, DNS tunneling, and HTTP header manipulation.",
  schema: {
    portal_type: z.enum(["mac_based", "browser_redirect", "dns_based"]).describe("Type of captive portal implementation to bypass"),
    network_restrictions: z.string().optional().describe("Description of known network restrictions (e.g., 'only port 53 allowed', 'HTTPS intercept', 'time-limited')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const portalType = args.portal_type as string;
    const restrictions = args.network_restrictions as string | undefined;

    const techniques: Record<string, { methods: { name: string; difficulty: string; description: string; commands: string[]; success_rate: string }[]; detection_risk: string }> = {
      mac_based: {
        methods: [
          {
            name: "MAC Spoofing — Clone Authenticated Client",
            difficulty: "Easy",
            description: "Identify an already-authenticated client via passive monitoring, then clone their MAC address. The portal's MAC allowlist will grant network access.",
            commands: [
              "# 1. Monitor for authenticated clients:",
              "airodump-ng --bssid <AP_BSSID> -c <channel> wlan0mon",
              "# 2. Identify client with active traffic (data frames > 0):",
              "# Pick a client MAC with high data frame count",
              "# 3. Change your MAC to the authenticated client:",
              "ip link set wlan0 down",
              "macchanger -m <authenticated_client_MAC> wlan0",
              "ip link set wlan0 up",
              "# 4. Connect to the network (skip portal):",
              "nmcli device wifi connect '<SSID>'",
            ],
            success_rate: "High (90%+) if authenticated client is found",
          },
          {
            name: "MAC Spoofing — Pre-auth MAC from DHCP",
            difficulty: "Easy",
            description: "Some portals authorize the MAC before the user completes authentication. Monitor DHCP to find MACs that received an IP but may not have completed portal auth.",
            commands: [
              "# Monitor DHCP traffic for MAC-IP assignments:",
              "tcpdump -i wlan0 -n port 67 or port 68",
              "# Wait for portal timeout to expire on a client, then clone their MAC",
            ],
            success_rate: "Medium (50-70%)",
          },
        ],
        detection_risk: "Low — MAC changes are not typically logged by portals",
      },
      browser_redirect: {
        methods: [
          {
            name: "Direct IP Access (Bypass DNS Redirect)",
            difficulty: "Easy",
            description: "If the portal uses DNS-based redirection to force the captive portal page, directly accessing IP addresses (not hostnames) may bypass the redirect.",
            commands: [
              "# Test direct IP connectivity:",
              "curl -v http://1.1.1.1",
              "ping 8.8.8.8",
              "# If ICMP works but HTTP doesn't, portal is HTTP-layer only",
            ],
            success_rate: "Low (20-30%) — most portals also use iptables/firewall rules",
          },
          {
            name: "HTTP Header Manipulation",
            difficulty: "Medium",
            description: "Some captive portals check for specific HTTP headers. Manipulating User-Agent, adding X-Forwarded-For, or using non-standard ports may bypass checks.",
            commands: [
              "# Try non-standard ports:",
              "curl -v http://example.com:8080",
              "# Try HTTPS (some portals only intercept HTTP):",
              "curl -v https://example.com",
              "# Try with mobile User-Agent (some portals auto-approve mobile devices):",
              "curl -A 'CaptiveNetworkSupport/1.0 wispr' http://www.apple.com/library/test/success.html",
            ],
            success_rate: "Low-Medium (20-40%)",
          },
          {
            name: "ICMP Tunnel",
            difficulty: "Hard",
            description: "If ICMP (ping) traffic passes through the firewall without portal authentication, tunnel TCP/IP traffic inside ICMP packets.",
            commands: [
              "# Test ICMP connectivity:",
              "ping 8.8.8.8",
              "# If ICMP works, set up icmptunnel:",
              "# On your VPS (server):",
              "icmptunnel -s",
              "# On client (behind portal):",
              "icmptunnel <VPS_IP>",
              "# Route traffic through the tunnel interface",
            ],
            success_rate: "Medium (50%) — depends on ICMP being allowed",
          },
        ],
        detection_risk: "Medium — unusual traffic patterns may trigger alerts",
      },
      dns_based: {
        methods: [
          {
            name: "DNS Tunneling (iodine/dnscat2)",
            difficulty: "Medium",
            description: "Most captive portals allow DNS (port 53) traffic to pass through for the portal redirect to work. Tunnel full TCP/IP traffic inside DNS queries to your own authoritative nameserver.",
            commands: [
              "# Test DNS resolution to external server:",
              "nslookup test.yourdomain.com <portal_dns>",
              "dig @<portal_dns> test.yourdomain.com",
              "# If external DNS works, set up iodine:",
              "# On your VPS (authoritative NS for tunnel.yourdomain.com):",
              "iodined -f -P secretpass 10.0.0.1/24 tunnel.yourdomain.com",
              "# On client (behind portal):",
              "iodine -f -P secretpass tunnel.yourdomain.com",
              "# Set up SOCKS proxy or route traffic through dns0 interface",
              "# Alternative: dnscat2 for C2-style tunnel:",
              "# Server: ruby dnscat2.rb yourdomain.com",
              "# Client: ./dnscat2 yourdomain.com",
            ],
            success_rate: "High (80%+) — DNS almost always allowed through portals",
          },
          {
            name: "DNS Rebinding",
            difficulty: "Hard",
            description: "Use DNS rebinding to bypass same-origin restrictions. Point a DNS record to the portal IP first, then rebind to an internal/external IP.",
            commands: [
              "# Requires custom DNS server with short TTL:",
              "# 1. First resolution: point to portal IP (passes firewall)",
              "# 2. Second resolution: point to target IP",
              "# Tools: singularity, dns-rebind-toolkit",
            ],
            success_rate: "Low (20%) — complex setup, modern browsers have mitigations",
          },
          {
            name: "DNS over HTTPS (DoH) Bypass",
            difficulty: "Easy",
            description: "If HTTPS traffic is allowed (port 443), use DNS over HTTPS to resolve domains bypassing the portal's DNS interception.",
            commands: [
              "# Test HTTPS connectivity:",
              "curl -v https://cloudflare-dns.com/dns-query?name=example.com&type=A -H 'Accept: application/dns-json'",
              "# Configure system to use DoH:",
              "# Firefox: Settings > Network > DNS over HTTPS > Cloudflare",
            ],
            success_rate: "Medium (40%) — only bypasses DNS interception, not firewall rules",
          },
        ],
        detection_risk: "Low-Medium — DNS tunnels produce anomalous query patterns detectable by DPI",
      },
    };

    const result = techniques[portalType];
    const restrictionNotes: string[] = [];

    if (restrictions) {
      const lower = restrictions.toLowerCase();
      if (lower.includes("port 53") || lower.includes("dns only")) {
        restrictionNotes.push("Only DNS (port 53) allowed: DNS tunneling (iodine/dnscat2) is the best approach.");
      }
      if (lower.includes("https") || lower.includes("intercept")) {
        restrictionNotes.push("HTTPS interception detected: Portal may use SSL bumping. Check for certificate warnings.");
      }
      if (lower.includes("time")) {
        restrictionNotes.push("Time-limited access: Consider MAC cloning from time-expired sessions or DNS tunnel for persistent access.");
      }
    }

    return json({
      captive_portal_bypass: {
        portal_type: portalType,
        network_restrictions: restrictions ?? "none specified",
        restriction_analysis: restrictionNotes,
        bypass_methods: result.methods,
        detection_risk: result.detection_risk,
        general_tips: [
          "Always test basic connectivity first: ping, DNS, HTTPS",
          "Check if any ports are open besides 80/443 (nmap -p- if possible)",
          "Try connecting to VPN (UDP 1194 or TCP 443) directly",
          "Some portals whitelist Apple/Android captive portal detection URLs",
          "Hotel portals often have room-number + last-name auth — social engineering viable",
        ],
        ethical_notice: "Only test against networks you own or have explicit written authorization to test.",
      },
    });
  },
};

// ─── Tool 2: captive_portal_assess ───

const captive_portal_assess: ToolDef = {
  name: "captive_portal_assess",
  description: "Assess captive portal security implementation. Analyzes the portal for common vulnerabilities including MAC spoofing, DNS tunneling, credential exposure, and session management weaknesses.",
  schema: {
    implementation_details: z.string().describe("Description of the captive portal implementation (e.g., 'Cisco ISE with MAC auth, HTTPS redirect, 1hr session timeout, RADIUS backend')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const details = args.implementation_details as string;
    const lower = details.toLowerCase();

    interface Vulnerability {
      id: string;
      severity: "critical" | "high" | "medium" | "low";
      title: string;
      description: string;
      exploitation: string;
      remediation: string;
    }

    const vulnerabilities: Vulnerability[] = [];

    // MAC-based auth check
    if (lower.includes("mac") && (lower.includes("auth") || lower.includes("filter") || lower.includes("whitelist"))) {
      vulnerabilities.push({
        id: "CP-001",
        severity: "high",
        title: "MAC-Based Authentication Bypass",
        description: "MAC addresses can be trivially spoofed. Any authenticated client's MAC can be cloned for unauthorized access.",
        exploitation: "Monitor authenticated clients with airodump-ng, clone their MAC with macchanger.",
        remediation: "Combine MAC auth with 802.1X or credential-based auth. MAC alone is insufficient.",
      });
    }

    // DNS tunnel check
    if (!lower.includes("dns inspection") && !lower.includes("dns filter") && !lower.includes("dpi")) {
      vulnerabilities.push({
        id: "CP-002",
        severity: "high",
        title: "DNS Tunneling Possible",
        description: "No DNS inspection or DPI mentioned. DNS tunneling (iodine, dnscat2) can bypass the portal entirely by encoding TCP traffic in DNS queries.",
        exploitation: "Set up iodine server on external VPS, tunnel traffic through DNS port 53.",
        remediation: "Implement DNS query inspection, rate-limit DNS requests, block non-authorized DNS servers, deploy DPI.",
      });
    }

    // HTTP vs HTTPS
    if (lower.includes("http") && !lower.includes("https")) {
      vulnerabilities.push({
        id: "CP-003",
        severity: "critical",
        title: "Portal Credentials Transmitted Over HTTP",
        description: "Portal login page served over HTTP. Credentials (username/password, room number, voucher code) transmitted in cleartext.",
        exploitation: "Passive sniffing with tcpdump/Wireshark captures all portal credentials on the same network.",
        remediation: "Serve portal over HTTPS with valid TLS certificate. Redirect all HTTP to HTTPS.",
      });
    }

    // Session management
    if (!lower.includes("session") && !lower.includes("timeout") && !lower.includes("expire")) {
      vulnerabilities.push({
        id: "CP-004",
        severity: "medium",
        title: "Session Management Not Specified",
        description: "No session timeout or session management details provided. Long or infinite sessions increase window for MAC spoofing attacks.",
        exploitation: "Clone an authenticated MAC and use the session indefinitely without re-authentication.",
        remediation: "Implement session timeouts (1-4 hours), re-authentication requirements, and session binding to client fingerprint.",
      });
    }

    // RADIUS
    if (lower.includes("radius") && !lower.includes("radsec") && !lower.includes("tls")) {
      vulnerabilities.push({
        id: "CP-005",
        severity: "medium",
        title: "RADIUS Without RadSec/TLS",
        description: "RADIUS backend mentioned without RadSec (RADIUS over TLS). RADIUS shared secret provides integrity but not confidentiality for attributes.",
        exploitation: "Sniff RADIUS traffic between AP and RADIUS server to capture authentication attributes.",
        remediation: "Implement RadSec (RADIUS over TLS) between controller and RADIUS server.",
      });
    }

    // Captive portal detection
    if (!lower.includes("walled garden") && !lower.includes("allowed list")) {
      vulnerabilities.push({
        id: "CP-006",
        severity: "low",
        title: "Walled Garden Configuration Unknown",
        description: "Pre-auth walled garden (allowed URLs before login) not mentioned. Overly permissive walled gardens can be exploited for data exfiltration.",
        exploitation: "Use allowed walled garden URLs for data exfiltration or covert channel establishment.",
        remediation: "Minimize walled garden to only essential URLs (CRL, OCSP, portal assets). Block all other pre-auth traffic.",
      });
    }

    // Client isolation
    if (!lower.includes("isolation") && !lower.includes("private vlan") && !lower.includes("pvlan")) {
      vulnerabilities.push({
        id: "CP-007",
        severity: "high",
        title: "Client Isolation Not Configured",
        description: "No client isolation mentioned. Unauthenticated and authenticated clients may communicate directly, enabling ARP spoofing, MITM, and credential sniffing.",
        exploitation: "ARP spoof the gateway to MITM all client traffic. Use Bettercap or Ettercap for credential capture.",
        remediation: "Enable AP/client isolation (L2 isolation) and Private VLANs to prevent client-to-client communication.",
      });
    }

    // ICMP check
    if (!lower.includes("icmp") && !lower.includes("ping")) {
      vulnerabilities.push({
        id: "CP-008",
        severity: "medium",
        title: "ICMP Tunneling Risk",
        description: "ICMP policy not mentioned. If ICMP passes pre-auth, ICMP tunneling tools (icmptunnel, ptunnel) can bypass the portal.",
        exploitation: "Use icmptunnel or ptunnel to encapsulate TCP traffic inside ICMP echo requests/replies.",
        remediation: "Block or rate-limit ICMP traffic in pre-auth state. Allow only essential ICMP types.",
      });
    }

    const criticalCount = vulnerabilities.filter((v) => v.severity === "critical").length;
    const highCount = vulnerabilities.filter((v) => v.severity === "high").length;
    let overallRisk = "LOW";
    if (criticalCount > 0) overallRisk = "CRITICAL";
    else if (highCount >= 2) overallRisk = "HIGH";
    else if (highCount >= 1) overallRisk = "MEDIUM";

    return json({
      portal_assessment: {
        implementation_description: details,
        overall_risk: overallRisk,
        vulnerability_count: { critical: criticalCount, high: highCount, medium: vulnerabilities.filter((v) => v.severity === "medium").length, low: vulnerabilities.filter((v) => v.severity === "low").length },
        vulnerabilities,
        testing_checklist: [
          "Test MAC spoofing bypass with macchanger",
          "Test DNS tunneling with iodine",
          "Test ICMP tunneling with ptunnel",
          "Verify HTTPS on portal login page",
          "Test session timeout enforcement",
          "Test client isolation (ARP scan between clients)",
          "Check walled garden for unnecessary allowed domains",
          "Test VPN passthrough (UDP 1194, TCP 443)",
          "Test for credential replay/session fixation",
        ],
      },
    });
  },
};

// ─── Tool 3: captive_portal_defense ───

const captive_portal_defense: ToolDef = {
  name: "captive_portal_defense",
  description: "Captive portal security hardening recommendations. Returns deployment-specific security controls for hotel, airport, and corporate guest captive portals.",
  schema: {
    deployment: z.enum(["hotel", "airport", "corporate_guest"]).describe("Captive portal deployment environment type"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const deployment = args.deployment as string;

    const deploymentGuides: Record<string, {
      threat_model: string[];
      authentication: string[];
      network_controls: string[];
      monitoring: string[];
      compliance: string[];
    }> = {
      hotel: {
        threat_model: [
          "Guests attempting to bypass time/bandwidth limits",
          "MAC spoofing to steal another guest's paid session",
          "Credential sniffing between guests on same network",
          "DNS tunneling for free internet access",
          "Malicious guests performing MitM attacks on other guests",
        ],
        authentication: [
          "Use room number + guest surname for authentication (tied to PMS)",
          "Generate unique voucher codes per guest with time/bandwidth limits",
          "Implement SMS-based authentication with phone number verification",
          "Set session timeouts aligned with checkout time",
          "Bind sessions to client MAC + browser fingerprint",
        ],
        network_controls: [
          "Enable client isolation (L2) on all guest SSIDs",
          "Use Private VLANs (PVLAN) to prevent inter-guest communication",
          "Rate-limit DNS queries to prevent DNS tunneling (max 50 queries/min per client)",
          "Block ICMP in pre-auth state to prevent ICMP tunneling",
          "Implement DPI for DNS tunnel detection",
          "Restrict walled garden to PMS integration URL and portal assets only",
          "Segment guest WiFi from hotel operations network (POS, door locks, IPTV)",
        ],
        monitoring: [
          "Log all portal authentications with timestamps",
          "Alert on MAC address changes for active sessions",
          "Monitor for DNS tunneling patterns (high query rate, long TXT records)",
          "Track bandwidth anomalies per guest session",
        ],
        compliance: [
          "Retain connection logs per local data retention laws",
          "Display terms of service and acceptable use policy",
          "Implement content filtering per local regulations",
          "GDPR: Minimize personal data collection, provide privacy notice",
        ],
      },
      airport: {
        threat_model: [
          "High volume of transient users with varied threat levels",
          "Nation-state actors using airport WiFi for operations",
          "Data exfiltration via DNS tunneling",
          "Evil Twin attacks impersonating airport WiFi",
          "Credential harvesting via phishing portals",
        ],
        authentication: [
          "Implement tiered access: free (limited) + paid (full)",
          "Use SMS verification for free tier (deters automated abuse)",
          "Integrate with airline loyalty programs for premium access",
          "Implement device limit per authentication (max 3 devices)",
          "Use OWE (Opportunistic Wireless Encryption) for open networks",
        ],
        network_controls: [
          "Strict client isolation — no client-to-client traffic",
          "Deploy WIDS/WIPS for Evil Twin detection (critical in airports)",
          "Block non-standard ports in pre-auth and free tier",
          "Implement bandwidth throttling per user tier",
          "Use DNS filtering to block known malicious domains",
          "Deploy SSL inspection with transparent proxy for content filtering",
          "Segment airport operations (FIDS, baggage, security) from public WiFi completely",
        ],
        monitoring: [
          "Real-time WIDS monitoring for rogue APs mimicking airport SSID",
          "DPI for DNS tunneling and protocol anomalies",
          "Integration with airport security operations center",
          "Automated alerts for unusual traffic patterns or volumes",
        ],
        compliance: [
          "Comply with aviation authority wireless regulations",
          "Implement lawful intercept capabilities per jurisdiction",
          "Content filtering per local laws",
          "Retain connection logs per law enforcement requirements",
        ],
      },
      corporate_guest: {
        threat_model: [
          "Visitors introducing malware to corporate network",
          "Guest users attempting to access internal resources",
          "Contractors using guest WiFi for unauthorized long-term access",
          "Credential theft via rogue portal on guest SSID",
          "Pivot from guest network to corporate network",
        ],
        authentication: [
          "Sponsor-based authentication (employee sponsors guest, receives time-limited credential)",
          "Self-registration with email verification and employee approval",
          "Integration with visitor management system",
          "Time-limited credentials (max 24 hours, renewable by sponsor)",
          "Device registration with profiling (NAC integration)",
        ],
        network_controls: [
          "Complete network segmentation: guest VLAN with NO route to corporate networks",
          "Firewall rules: guest VLAN -> Internet ONLY (deny RFC1918 destinations)",
          "Client isolation on guest SSID",
          "DNS filtering via corporate DNS (block known threats)",
          "Bandwidth limits per guest client",
          "Block VPN protocols from guest network if policy requires traffic visibility",
          "Use 802.1X on wired ports in guest areas to prevent rogue AP connection",
        ],
        monitoring: [
          "Log all guest authentications with sponsor identity",
          "Monitor for lateral movement attempts (guest -> corporate VLAN)",
          "Alert on guest sessions exceeding 24 hours",
          "WIDS monitoring for rogue APs on guest SSID",
          "NAC profiling to detect unauthorized device types",
        ],
        compliance: [
          "Enforce acceptable use policy acknowledgment",
          "PCI DSS: Ensure guest network has no path to CDE",
          "HIPAA: Ensure guest network cannot access ePHI systems",
          "SOC 2: Document guest access controls in security documentation",
          "Retain guest authentication logs per compliance framework",
        ],
      },
    };

    const guide = deploymentGuides[deployment];

    return json({
      captive_portal_hardening: {
        deployment_type: deployment,
        threat_model: guide.threat_model,
        recommendations: {
          authentication: guide.authentication,
          network_controls: guide.network_controls,
          monitoring: guide.monitoring,
          compliance: guide.compliance,
        },
        implementation_checklist: [
          "[ ] Portal served over HTTPS with valid certificate",
          "[ ] Client isolation enabled on guest SSID",
          "[ ] Guest VLAN segmented from internal networks",
          "[ ] DNS query rate limiting configured",
          "[ ] ICMP blocked or rate-limited pre-auth",
          "[ ] Session timeouts configured",
          "[ ] MAC change detection enabled",
          "[ ] Logging forwarded to SIEM",
          "[ ] WIDS monitoring active",
          "[ ] Terms of service displayed and acknowledged",
          "[ ] Regular penetration testing of portal",
        ],
      },
    });
  },
};

// ─── Export ───

export const captivePortalTools: ToolDef[] = [
  captive_portal_bypass,
  captive_portal_assess,
  captive_portal_defense,
];

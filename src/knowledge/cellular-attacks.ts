export interface CellularAttack {
  id: string;
  name: string;
  category: "2g" | "3g" | "4g" | "5g" | "ss7" | "sim" | "baseband" | "vowifi";
  protocols: string[];
  cves: string[];
  description: string;
  impact: string;
  prerequisites: string[];
  tools: string[];
  commands: { tool: string; command: string; description: string }[];
  mitigations: string[];
  severity: "critical" | "high" | "medium" | "low";
  stealthScore: number;
  references: string[];
}

export const CELLULAR_ATTACKS: CellularAttack[] = [
  {
    id: "imsi_catcher",
    name: "IMSI Catcher (Stingray / Fake Base Station)",
    category: "2g",
    protocols: ["GSM", "LTE"],
    cves: [],
    description: "Fake base station that forces phones to connect by broadcasting stronger signal than legitimate towers. Captures IMSI/IMEI, can intercept calls/SMS on 2G, and track device location.",
    impact: "Device tracking, IMSI/IMEI collection, call/SMS interception (2G), location surveillance",
    prerequisites: ["SDR hardware (BladeRF, USRP, LimeSDR)", "OpenBTS/YateBTS/srsRAN software", "Knowledge of local MCC/MNC codes"],
    tools: ["srsran", "openbts", "yatebts", "osmocom"],
    commands: [
      { tool: "srsran", command: "srsenb enb.conf", description: "Start fake LTE base station" },
      { tool: "osmocom", command: "osmo-bts-trx -c osmo-bts.cfg", description: "Start GSM base station with OsmoBTS" },
    ],
    mitigations: ["Use 5G SA mode (stronger auth)", "IMSI catcher detector apps (SnoopSnitch, AIMSICD)", "Disable 2G fallback on device", "Use VoLTE/VoWiFi instead of GSM calls"],
    severity: "critical",
    stealthScore: 3,
    references: [],
  },
  {
    id: "ss7_intercept",
    name: "SS7 Protocol Exploitation",
    category: "ss7",
    protocols: ["SS7", "MAP", "CAP", "ISUP"],
    cves: [],
    description: "Exploit Signaling System 7 (SS7) protocol used between telecom operators. Send fraudulent SS7 messages to intercept SMS, track location, redirect calls. No radio equipment needed — requires SS7 network access.",
    impact: "SMS interception (2FA bypass), real-time location tracking, call redirection, subscriber info theft",
    prerequisites: ["SS7 network access (via roaming agreement, rogue operator, or compromised node)", "Target phone number", "SS7 toolkit"],
    tools: ["sigploit", "ss7maper", "sigtran"],
    commands: [
      { tool: "sigploit", command: "python3 sigploit.py -m location -p <phone_number>", description: "Track location via SS7 MAP" },
      { tool: "sigploit", command: "python3 sigploit.py -m sms_intercept -p <phone_number>", description: "Intercept SMS via SS7" },
    ],
    mitigations: ["Use Signal/WhatsApp instead of SMS for 2FA", "Deploy SS7 firewall", "Use TOTP instead of SMS OTP", "Monitor SS7 signaling anomalies"],
    severity: "critical",
    stealthScore: 1,
    references: ["https://github.com/SigPloiter/SigPloit"],
  },
  {
    id: "5g_aka_linkability",
    name: "5G-AKA Linkability Attack",
    category: "5g",
    protocols: ["5G-AKA", "NR"],
    cves: [],
    description: "Despite 5G's SUPI/SUCI encryption, the 5G-AKA protocol has a linkability flaw. By observing authentication failures, an attacker can link a subscriber across sessions without knowing the SUPI.",
    impact: "Track 5G subscribers across sessions, activity monitoring without IMSI",
    prerequisites: ["Fake 5G base station or passive monitoring", "Ability to trigger authentication sequences"],
    tools: ["srsran", "open5gs"],
    commands: [],
    mitigations: ["Use randomized authentication failure responses", "Implement enhanced SUCI rotation"],
    severity: "medium",
    stealthScore: 1,
    references: ["https://eprint.iacr.org/2019/413"],
  },
  {
    id: "vowifi_static_key",
    name: "VoWiFi Static Key Vulnerability",
    category: "vowifi",
    protocols: ["VoWiFi", "IPsec", "IKEv2"],
    cves: [],
    description: "Some carriers use static/predictable IPsec keys for VoWiFi (WiFi Calling) tunnel establishment. Allows decryption of VoWiFi traffic if the pre-shared key is known or brute-forced.",
    impact: "Decrypt WiFi Calling traffic, intercept voice calls and SMS over WiFi",
    prerequisites: ["Capture VoWiFi IPsec traffic", "Known or brute-forceable IKE pre-shared key", "MitM position on WiFi network"],
    tools: ["wireshark", "strongswan", "ikeforce"],
    commands: [
      { tool: "wireshark", command: "tshark -i wlan0 -f 'udp port 500 or udp port 4500' -w vowifi.pcap", description: "Capture VoWiFi IPsec/IKE traffic" },
      { tool: "ikeforce", command: "python3 ikeforce.py <epdg_ip> -w wordlist.txt", description: "Brute force IKE pre-shared key" },
    ],
    mitigations: ["Use certificate-based VoWiFi authentication", "Implement unique per-device IPsec keys", "Use EAP-AKA' for VoWiFi"],
    severity: "high",
    stealthScore: 1,
    references: [],
  },
  {
    id: "sim_swap",
    name: "SIM Swap / SIM Hijacking",
    category: "sim",
    protocols: ["GSM", "LTE", "5G"],
    cves: [],
    description: "Social engineering attack against carrier to transfer victim's phone number to attacker's SIM. Enables interception of SMS-based 2FA, calls, and account takeover.",
    impact: "SMS 2FA bypass, account takeover, cryptocurrency theft, identity theft",
    prerequisites: ["Victim's phone number", "Carrier account info or social engineering skills", "Alternatively: insider at carrier"],
    tools: [],
    commands: [],
    mitigations: ["Use app-based 2FA (TOTP) instead of SMS", "Set carrier PIN/passphrase", "Use SIM lock", "Register with carrier's SIM swap protection"],
    severity: "critical",
    stealthScore: 1,
    references: [],
  },
  {
    id: "lte_aLTEr",
    name: "aLTEr Attack (LTE Data Layer MitM)",
    category: "4g",
    protocols: ["LTE"],
    cves: [],
    description: "LTE user-plane data uses AES-CTR without integrity protection. aLTEr exploits this by modifying encrypted packets in transit — specifically DNS queries — to redirect traffic without decrypting.",
    impact: "DNS redirection over LTE, traffic manipulation without decryption",
    prerequisites: ["USRP/LimeSDR for LTE relay", "LTE MitM relay setup", "Within range of target and real tower"],
    tools: ["srsran", "alter-attack", "limesdr"],
    commands: [],
    mitigations: ["Use DNS-over-HTTPS/TLS", "Use VPN", "5G NR with integrity protection"],
    severity: "high",
    stealthScore: 2,
    references: ["https://alter-attack.net/"],
  },
];

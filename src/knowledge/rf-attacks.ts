export interface RfAttack {
  id: string;
  name: string;
  category: "replay" | "jamming" | "injection" | "analysis" | "relay";
  frequency: string;
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

export const RF_ATTACKS: RfAttack[] = [
  {
    id: "rolljam",
    name: "RollJam (Rolling Code Jammer + Replay)",
    category: "replay",
    frequency: "315 MHz / 433 MHz",
    protocols: ["KeeLoq", "Rolling Code"],
    cves: [],
    description: "Jam the target receiver while capturing the rolling code from the key fob. When the user presses again, capture the second code and replay the first. Attacker always has a valid unused code.",
    impact: "Unlock vehicles, open garage doors, bypass rolling code security",
    prerequisites: ["Two radios (jam + capture)", "Within RF range of both key fob and receiver", "Target uses rolling codes on 315/433 MHz"],
    tools: ["hackrf", "yard-stick-one", "rfcat", "flipper-zero", "gnuradio"],
    commands: [
      { tool: "rfcat", command: "d.setFreq(433920000); d.setMdmModulation(MOD_ASK_OOK); d.RFrecv()", description: "Capture rolling code signal" },
      { tool: "gnuradio", command: "gnuradio-companion rolljam_flowgraph.grc", description: "Run RollJam GnuRadio flowgraph" },
    ],
    mitigations: ["Use time-based rolling codes", "Implement dual-band verification", "Use UWB-based distance bounding"],
    severity: "high",
    stealthScore: 2,
    references: ["https://samy.pl/defcon2015/"],
  },
  {
    id: "rollback",
    name: "RollBack (Rolling Code Resynchronization Exploit)",
    category: "replay",
    frequency: "315 MHz / 433 MHz",
    protocols: ["KeeLoq", "Rolling Code"],
    cves: [],
    description: "Exploit rolling code resynchronization mechanism. Send many sequential codes (brute force window) to advance the receiver's counter past the valid window, then replay previously captured codes.",
    impact: "Bypass rolling code protection, unlock vehicles/garages with old codes",
    prerequisites: ["Previously captured rolling codes", "Knowledge of manufacturer's resync window size"],
    tools: ["hackrf", "yard-stick-one", "flipper-zero"],
    commands: [],
    mitigations: ["Implement strict rolling code windows", "Use time-based invalidation", "Log and alert on resync events"],
    severity: "high",
    stealthScore: 2,
    references: [],
  },
  {
    id: "subghz_replay",
    name: "Sub-GHz Signal Replay",
    category: "replay",
    frequency: "300-928 MHz",
    protocols: ["ASK/OOK", "FSK", "Fixed Code"],
    cves: [],
    description: "Capture and replay sub-GHz signals from remotes, sensors, key fobs using fixed codes. Many garage doors, older car remotes, doorbells, and IoT devices use non-rolling fixed codes.",
    impact: "Open garage doors, trigger alarms, replay sensor data, unlock older vehicles",
    prerequisites: ["SDR or Flipper Zero", "Target uses fixed (non-rolling) code", "Within RF range"],
    tools: ["flipper-zero", "hackrf", "rtl-sdr", "universal-radio-hacker", "rfcat"],
    commands: [
      { tool: "flipper-zero", command: "Sub-GHz > Read > Save > Send", description: "Capture and replay sub-GHz signal" },
      { tool: "hackrf", command: "hackrf_transfer -r capture.raw -f 433920000 -s 2000000", description: "Capture raw sub-GHz signal" },
      { tool: "hackrf", command: "hackrf_transfer -t capture.raw -f 433920000 -s 2000000", description: "Replay captured signal" },
      { tool: "universal-radio-hacker", command: "urh", description: "Analyze and decode sub-GHz protocols" },
    ],
    mitigations: ["Use rolling codes instead of fixed codes", "Implement encryption", "Use frequency hopping"],
    severity: "medium",
    stealthScore: 1,
    references: [],
  },
  {
    id: "tpms_sniff",
    name: "TPMS (Tire Pressure Monitoring) Sniffing",
    category: "analysis",
    frequency: "315 MHz / 433 MHz",
    protocols: ["TPMS"],
    cves: [],
    description: "Capture TPMS signals from vehicles to track and identify them. Each TPMS sensor has a unique ID that can be used for vehicle tracking. Can also inject fake TPMS data.",
    impact: "Vehicle tracking, fake tire pressure alerts, vehicle identification",
    prerequisites: ["SDR capable of 315/433 MHz", "Within RF range of vehicle"],
    tools: ["rtl-sdr", "rtl_433", "gnuradio", "hackrf"],
    commands: [
      { tool: "rtl_433", command: "rtl_433 -f 315000000 -R 59", description: "Decode TPMS signals on 315 MHz" },
      { tool: "rtl_433", command: "rtl_433 -f 433920000 -R 60", description: "Decode TPMS signals on 433 MHz" },
    ],
    mitigations: ["TPMS ID rotation (rare)", "Awareness of tracking risk", "No practical mitigation for passive sniffing"],
    severity: "low",
    stealthScore: 1,
    references: [],
  },
  {
    id: "keyfob_relay",
    name: "Key Fob Relay Attack (Vehicle Theft)",
    category: "relay",
    frequency: "125 kHz / 315 MHz / 433 MHz / UHF",
    protocols: ["PKES (Passive Keyless Entry)"],
    cves: [],
    description: "Relay the key fob's signal using two devices — one near the key fob (inside house) and one near the vehicle. Extends the effective range of passive keyless entry from meters to kilometers.",
    impact: "Vehicle theft without key, unlock and start keyless-entry vehicles",
    prerequisites: ["Two relay devices", "One device near key fob, one near vehicle", "Target vehicle uses passive keyless entry"],
    tools: ["hackrf", "custom-relay-hardware", "proxmark3"],
    commands: [],
    mitigations: ["Use Faraday pouch for key fob", "Disable passive entry when not needed", "Use UWB-based distance bounding (newer vehicles)", "Enable PIN-to-drive"],
    severity: "critical",
    stealthScore: 1,
    references: [],
  },
  {
    id: "gps_spoofing",
    name: "GPS Spoofing",
    category: "injection",
    frequency: "1575.42 MHz (L1)",
    protocols: ["GPS L1 C/A"],
    cves: [],
    description: "Broadcast fake GPS signals to override legitimate satellite signals. Can redirect navigation, spoof location for geo-fenced devices, or disrupt GPS-dependent infrastructure.",
    impact: "Location spoofing, navigation misdirection, geo-fence bypass, timing disruption",
    prerequisites: ["HackRF or dedicated GPS spoofer", "Line of sight to target GPS receiver"],
    tools: ["hackrf", "gps-sdr-sim", "gnuradio"],
    commands: [
      { tool: "gps-sdr-sim", command: "gps-sdr-sim -e brdc3540.14n -l 38.8977,-77.0365,100 -o gpssim.bin", description: "Generate GPS spoofing signal for specific coordinates" },
      { tool: "hackrf", command: "hackrf_transfer -t gpssim.bin -f 1575420000 -s 2600000 -a 1 -x 0", description: "Broadcast spoofed GPS signal" },
    ],
    mitigations: ["Use multi-constellation GNSS (GPS+GLONASS+Galileo)", "Implement GPS authentication (L1C)", "Use inertial navigation backup", "GPS signal anomaly detection"],
    severity: "high",
    stealthScore: 3,
    references: [],
  },
];

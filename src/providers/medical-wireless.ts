import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ─── Constants ───

const DEVICE_TYPES = ["infusion_pump", "pacemaker", "monitor", "imaging"] as const;
const WIRELESS_PROTOCOLS = ["wifi", "bluetooth", "zigbee", "proprietary"] as const;
const DEPLOYMENTS = ["hospital", "clinic", "home_health"] as const;

// ─── Tool 1: medical_wireless_assess ───

const medical_wireless_assess: ToolDef = {
  name: "medical_wireless_assess",
  description: "Assess medical device wireless security. Evaluates risk based on device type and wireless protocol, considering patient safety, data confidentiality, and regulatory requirements (HIPAA, FDA).",
  schema: {
    device_type: z.enum(DEVICE_TYPES).describe("Type of medical device to assess"),
    wireless_protocol: z.enum(WIRELESS_PROTOCOLS).describe("Wireless protocol used by the device"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const deviceType = args.device_type as string;
    const protocol = args.wireless_protocol as string;

    interface RiskFinding {
      severity: "critical" | "high" | "medium" | "low";
      category: string;
      risk: string;
      impact: string;
      likelihood: string;
    }

    const deviceProfiles: Record<string, {
      safety_class: string;
      data_sensitivity: string;
      availability_requirement: string;
      typical_lifespan: string;
      update_frequency: string;
    }> = {
      infusion_pump: {
        safety_class: "Class II/III — Life-sustaining",
        data_sensitivity: "High — drug dosages, patient vitals, treatment protocols",
        availability_requirement: "Critical — dosage interruption can be life-threatening",
        typical_lifespan: "7-10 years",
        update_frequency: "Infrequent — FDA validation required for each update",
      },
      pacemaker: {
        safety_class: "Class III — Life-sustaining, implanted",
        data_sensitivity: "Critical — cardiac parameters, patient identity",
        availability_requirement: "Critical — device failure can be immediately fatal",
        typical_lifespan: "7-15 years",
        update_frequency: "Very rare — requires clinical procedure for firmware update",
      },
      monitor: {
        safety_class: "Class II — Patient monitoring",
        data_sensitivity: "High — real-time vitals (ECG, SpO2, BP, temperature)",
        availability_requirement: "High — delayed alerts can delay treatment",
        typical_lifespan: "5-8 years",
        update_frequency: "Moderate — quarterly to annual patches",
      },
      imaging: {
        safety_class: "Class II — Diagnostic",
        data_sensitivity: "High — medical images, DICOM data, patient records",
        availability_requirement: "Medium — affects diagnostic workflow but not immediate patient safety",
        typical_lifespan: "10-15 years",
        update_frequency: "Infrequent — complex validation for each OS/firmware update",
      },
    };

    const protocolRisks: Record<string, RiskFinding[]> = {
      wifi: [
        { severity: "high", category: "Authentication", risk: "Many medical devices use WPA2-PSK with shared credentials across device fleet", impact: "One compromised device exposes credentials for all devices", likelihood: "High" },
        { severity: "high", category: "Encryption", risk: "Older devices may use WPA or WEP due to hardware constraints", impact: "Traffic interception, data modification, command injection", likelihood: "Medium" },
        { severity: "medium", category: "Network Segmentation", risk: "Medical devices on shared network with general IT systems", impact: "Lateral movement from compromised IT device to medical device", likelihood: "Medium" },
        { severity: "critical", category: "Firmware", risk: "WiFi chipset firmware vulnerabilities (Kr00k, FragAttacks) often unpatched on medical devices", impact: "Remote exploitation of WiFi stack without authentication", likelihood: "Medium" },
      ],
      bluetooth: [
        { severity: "high", category: "Pairing", risk: "Legacy Bluetooth pairing (Just Works or fixed PIN) common on medical devices", impact: "Unauthorized device pairing, data interception", likelihood: "High" },
        { severity: "critical", category: "Range", risk: "Bluetooth range extends beyond clinical area, enabling attacks from adjacent rooms or parking lots", impact: "Remote device manipulation without physical access", likelihood: "Medium" },
        { severity: "high", category: "Protocol", risk: "BLE GATT services often lack authentication for read/write characteristics", impact: "Unauthorized reading of patient data or writing of device parameters", likelihood: "High" },
        { severity: "medium", category: "Discovery", risk: "Medical devices continuously advertise via BLE, revealing device type and location", impact: "Reconnaissance for targeted attacks", likelihood: "High" },
      ],
      zigbee: [
        { severity: "high", category: "Key Management", risk: "Zigbee network key often transmitted in cleartext during device commissioning", impact: "Key capture enables full network access and device control", likelihood: "Medium" },
        { severity: "medium", category: "Protocol", risk: "Zigbee Green Power frame injection possible without key knowledge (CVE-2020-25161)", impact: "Inject commands to Zigbee-connected medical sensors", likelihood: "Low" },
        { severity: "medium", category: "Replay", risk: "Some Zigbee medical sensors lack replay protection", impact: "Replay stale sensor readings, mask critical patient changes", likelihood: "Low" },
      ],
      proprietary: [
        { severity: "critical", category: "Security by Obscurity", risk: "Proprietary wireless protocols often rely on secrecy rather than proven cryptography", impact: "Protocol reverse engineering exposes all devices using the same protocol", likelihood: "Medium" },
        { severity: "high", category: "No Standard Review", risk: "Proprietary protocols lack the security scrutiny of IEEE/NIST standards", impact: "Unknown vulnerabilities in fundamental protocol design", likelihood: "High" },
        { severity: "medium", category: "Interoperability", risk: "Proprietary protocols limit integration with standard security monitoring tools", impact: "Attacks may go undetected by WIDS/SIEM", likelihood: "High" },
      ],
    };

    const profile = deviceProfiles[deviceType];
    const risks = protocolRisks[protocol];

    const criticalCount = risks.filter((r) => r.severity === "critical").length;
    const highCount = risks.filter((r) => r.severity === "high").length;
    let overallRisk = "MEDIUM";
    if (criticalCount > 0) overallRisk = "CRITICAL";
    else if (highCount >= 2) overallRisk = "HIGH";

    // Patient safety impact multiplier
    const safetyMultiplier = deviceType === "pacemaker" || deviceType === "infusion_pump" ? "ELEVATED — life-sustaining device" : "STANDARD";

    return json({
      medical_wireless_assessment: {
        device_type: deviceType,
        wireless_protocol: protocol,
        device_profile: profile,
        overall_risk: overallRisk,
        patient_safety_impact: safetyMultiplier,
        risk_findings: risks,
        regulatory_context: {
          fda: "FDA premarket cybersecurity guidance (2023) requires threat modeling, SBOM, and vulnerability management for connected medical devices.",
          hipaa: "HIPAA Security Rule (164.312) requires encryption, access controls, and audit logging for ePHI transmitted wirelessly.",
          iec_62443: "IEC 62443 provides security lifecycle framework for industrial/medical control systems.",
          mdcg_2019_16: "EU MDR/IVDR: MDCG 2019-16 provides cybersecurity guidance for medical device manufacturers.",
        },
        testing_recommendations: [
          `Perform wireless penetration test of ${protocol} interface with patient safety controls in place`,
          "Test in isolated lab environment — NEVER on production devices with patients",
          "Coordinate with clinical engineering and biomedical staff",
          "Follow IEC 80001-1 risk management framework for health IT networks",
          "Document all findings per FDA post-market cybersecurity guidance",
        ],
      },
    });
  },
};

// ─── Tool 2: medical_wireless_attacks ───

const medical_wireless_attacks: ToolDef = {
  name: "medical_wireless_attacks",
  description: "Known medical device wireless attacks by device type. Returns documented vulnerabilities, published research, CVEs, and attack methodologies relevant to the specified medical device category.",
  schema: {
    device_type: z.enum(DEVICE_TYPES).describe("Type of medical device to query"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const deviceType = args.device_type as string;

    const attackDb: Record<string, {
      known_attacks: { name: string; year: number; researchers: string; description: string; impact: string; cves: string[]; references: string[] }[];
      attack_categories: string[];
    }> = {
      infusion_pump: {
        known_attacks: [
          {
            name: "BD Alaris Infusion Pump Vulnerabilities",
            year: 2019,
            researchers: "CyberMDX",
            description: "Multiple vulnerabilities in BD Alaris infusion pumps allowing remote modification of drug library, firmware, and network configuration via WiFi interface.",
            impact: "Remote modification of drug dosages — direct patient safety risk",
            cves: ["CVE-2019-10959", "CVE-2019-10960", "CVE-2019-10961", "CVE-2019-10962"],
            references: ["https://www.cisa.gov/news-events/ics-medical-advisories/icsma-19-164-01"],
          },
          {
            name: "Hospira Symbiq Infusion Pump",
            year: 2015,
            researchers: "Billy Rios (QualComm)",
            description: "Remote exploitation of Hospira Symbiq infusion pump via WiFi network. Attacker can modify dosages remotely.",
            impact: "FDA issued recall — first cybersecurity-driven medical device recall",
            cves: [],
            references: ["https://www.fda.gov/medical-devices/safety-communications/cybersecurity-vulnerabilities-hospira-symbiq-infusion-system"],
          },
          {
            name: "B. Braun Infusomat Space",
            year: 2021,
            researchers: "McAfee ATR",
            description: "Chain of vulnerabilities in B. Braun Space infusion pumps allowing network-based modification of pump firmware and drug dosages.",
            impact: "Remote drug dosage modification, persistence via firmware implant",
            cves: ["CVE-2021-33885", "CVE-2021-33886", "CVE-2021-33887", "CVE-2021-33888", "CVE-2021-33889"],
            references: ["https://www.mcafee.com/blogs/other-blogs/mcafee-labs/mcafee-enterprise-atr-uncovers-vulnerabilities-in-medically-used-infusion-pump/"],
          },
        ],
        attack_categories: ["Remote dosage modification", "Firmware manipulation", "Drug library tampering", "Network-based MitM", "WiFi credential theft"],
      },
      pacemaker: {
        known_attacks: [
          {
            name: "St. Jude Medical (Abbott) Pacemaker Vulnerabilities",
            year: 2017,
            researchers: "MedSec / Muddy Waters",
            description: "Wireless vulnerabilities in St. Jude Medical pacemakers and home monitoring transmitters. Proprietary wireless protocol lacks authentication, allowing unauthorized commands.",
            impact: "Battery drain attack, pacing modification, potential fatal outcomes",
            cves: ["CVE-2017-12712", "CVE-2017-12714"],
            references: ["https://www.fda.gov/medical-devices/safety-communications/firmware-update-address-cybersecurity-vulnerabilities-abbott-pacemakers"],
          },
          {
            name: "Medtronic Implantable Cardiac Defibrillator",
            year: 2019,
            researchers: "Researchers at KU Leuven / University of Birmingham",
            description: "Medtronic ICD devices use unencrypted, unauthenticated proprietary wireless protocol (Conexus). Attacker within radio range can read/write device settings.",
            impact: "Read patient data, modify therapy settings, disable device — potentially fatal",
            cves: ["CVE-2019-6538", "CVE-2019-6540"],
            references: ["https://www.cisa.gov/news-events/ics-medical-advisories/icsma-19-080-01"],
          },
          {
            name: "Theoretical Pacemaker Attack (Halperin et al.)",
            year: 2008,
            researchers: "Halperin, Heydt-Benjamin, et al.",
            description: "Seminal research demonstrating wireless attack on implantable medical device (ICD). Reverse-engineered proprietary wireless protocol, demonstrated command injection.",
            impact: "Proof-of-concept for life-threatening ICD manipulation via wireless",
            cves: [],
            references: ["https://doi.org/10.1109/SP.2008.31"],
          },
        ],
        attack_categories: ["Wireless command injection", "Therapy modification", "Battery drain attack", "Patient data exfiltration", "Device impersonation"],
      },
      monitor: {
        known_attacks: [
          {
            name: "GE CARESCAPE Patient Monitor Vulnerabilities",
            year: 2020,
            researchers: "CyberMDX",
            description: "Multiple critical vulnerabilities in GE CARESCAPE patient monitors including hardcoded SSH credentials, web server vulnerabilities, and unencrypted patient data transmission.",
            impact: "Remote access to patient monitors, vital sign data manipulation, DoS",
            cves: ["CVE-2020-6961", "CVE-2020-6962", "CVE-2020-6963", "CVE-2020-6964", "CVE-2020-6965", "CVE-2020-6966"],
            references: ["https://www.cisa.gov/news-events/ics-medical-advisories/icsma-20-023-01"],
          },
          {
            name: "Philips Patient Monitoring System",
            year: 2020,
            researchers: "Multiple researchers",
            description: "Philips IntelliVue patient monitors transmit data over unencrypted wireless link. Patient identification, vital signs, and waveform data visible to passive eavesdroppers.",
            impact: "Patient data breach (HIPAA violation), potential vital sign manipulation",
            cves: [],
            references: [],
          },
        ],
        attack_categories: ["Vital sign data interception", "Monitor display manipulation", "Alarm suppression", "Patient data theft", "Denial of service"],
      },
      imaging: {
        known_attacks: [
          {
            name: "DICOM Protocol Vulnerabilities",
            year: 2019,
            researchers: "Cylera Research",
            description: "DICOM (medical imaging standard) lacks authentication and encryption by default. Images transmitted over wireless networks can be intercepted, modified, or injected.",
            impact: "Modify medical images (add/remove tumors in CT/MRI), causing misdiagnosis",
            cves: [],
            references: ["https://www.cylera.com/research"],
          },
          {
            name: "CT-GAN: Malicious Tampering of Medical Images",
            year: 2019,
            researchers: "Mirsky et al. (Ben-Gurion University)",
            description: "AI-based attack that can add or remove cancerous nodules from CT scans in real-time as they traverse the network. Demonstrated 99% success rate fooling radiologists.",
            impact: "Cause misdiagnosis: add fake tumors (unnecessary treatment) or remove real tumors (missed diagnosis)",
            cves: [],
            references: ["https://arxiv.org/abs/1901.03597"],
          },
        ],
        attack_categories: ["Medical image tampering", "DICOM interception", "PACS system compromise", "Study injection/deletion", "Ransomware targeting imaging archives"],
      },
    };

    const data = attackDb[deviceType];

    return json({
      medical_wireless_attacks: {
        device_type: deviceType,
        total_known_attacks: data.known_attacks.length,
        attack_categories: data.attack_categories,
        known_attacks: data.known_attacks,
        general_wireless_risks: [
          "Medical devices often run legacy OS (Windows XP/7) with known vulnerabilities",
          "Long device lifespans (7-15 years) mean WiFi chips may have unpatched vulnerabilities",
          "FDA 510(k) process discourages frequent updates, leaving known CVEs unpatched",
          "Shared PSK across device fleet means one compromise exposes all devices",
          "Proprietary wireless protocols often lack basic security controls",
        ],
        research_disclaimer: "This information is provided for defensive security research and vulnerability management. Medical device testing must only be performed in isolated lab environments with proper authorization. Never test on devices connected to patients.",
      },
    });
  },
};

// ─── Tool 3: medical_wireless_defense ───

const medical_wireless_defense: ToolDef = {
  name: "medical_wireless_defense",
  description: "Medical wireless security recommendations aligned with HIPAA, FDA guidance, and IEC 62443. Returns deployment-specific hardening checklist for hospitals, clinics, and home health environments.",
  schema: {
    deployment: z.enum(DEPLOYMENTS).describe("Medical facility deployment type"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const deployment = args.deployment as string;

    const guides: Record<string, {
      network_architecture: string[];
      device_security: string[];
      monitoring: string[];
      incident_response: string[];
      compliance: string[];
    }> = {
      hospital: {
        network_architecture: [
          "Segment biomedical devices onto dedicated VLANs (separate from clinical, guest, and IoT)",
          "Deploy biomedical DMZ between device VLAN and clinical network",
          "Use 802.1X with device certificates for medical device WiFi authentication",
          "Implement micro-segmentation: each device class on its own subnet",
          "Deploy WPA3-Enterprise on all medical device SSIDs",
          "Use private APN or dedicated network for cellular-connected devices",
          "Air-gap critical life-sustaining devices from general network where feasible",
          "Deploy NAC (Network Access Control) to profile and authorize medical devices",
        ],
        device_security: [
          "Maintain SBOM (Software Bill of Materials) for all connected medical devices",
          "Implement MDS2 (Manufacturer Disclosure Statement for Medical Device Security) review for procurement",
          "Disable unnecessary wireless interfaces on devices (Bluetooth if only WiFi needed)",
          "Change default credentials on ALL medical devices before deployment",
          "Apply vendor security patches within FDA-validated timeframes",
          "Implement device certificate management with automated renewal",
          "Disable unused services (SSH, Telnet, HTTP) on medical devices",
        ],
        monitoring: [
          "Deploy medical device-aware WIDS (detect rogue APs in clinical areas)",
          "Implement network traffic analysis (NTA) for medical device anomaly detection",
          "Monitor for unauthorized wireless protocols in clinical areas",
          "Integrate medical device alerts with hospital SOC/SIEM",
          "Deploy RF shielding monitoring in critical care areas",
          "Log all wireless authentication events for medical device SSIDs",
          "Implement Medigate/Claroty/Armis for medical IoT visibility",
        ],
        incident_response: [
          "Develop medical device-specific incident response plan",
          "Include clinical engineering and biomedical teams in wireless IR procedures",
          "Define patient safety escalation criteria for wireless security events",
          "Maintain offline/backup communication for critical care during network incidents",
          "Test wireless failover procedures quarterly",
          "Coordinate with device manufacturers for vulnerability response",
        ],
        compliance: [
          "HIPAA Security Rule: 164.312(a)(1) access controls, 164.312(e)(1) transmission security",
          "FDA Premarket Cybersecurity Guidance (2023): threat model, SBOM, vulnerability management",
          "FDA Postmarket Cybersecurity Guidance: ongoing monitoring and patching",
          "IEC 62443: Security lifecycle for medical control systems",
          "NIST Cybersecurity Framework: adapted for healthcare (NIST CSF Healthcare Profile)",
          "Joint Commission: requires cybersecurity in patient safety programs",
          "Document all wireless security controls for accreditation surveys",
        ],
      },
      clinic: {
        network_architecture: [
          "Separate medical devices from office/patient WiFi (minimum 2 SSIDs)",
          "Use WPA2-Enterprise for medical device SSID (WPA3 where supported)",
          "Implement firewall between medical device subnet and internet",
          "Consider managed security service for smaller clinics",
          "Use VPN for remote access to medical device management",
        ],
        device_security: [
          "Inventory all wireless medical devices with MAC addresses",
          "Change default passwords on all devices",
          "Enable automatic updates where supported by vendor",
          "Disable Bluetooth/WiFi on devices that do not require wireless connectivity",
          "Use MAC filtering as supplementary control (not primary)",
        ],
        monitoring: [
          "Enable logging on wireless AP/controller",
          "Review device connection logs monthly",
          "Consider cloud-based wireless monitoring (Meraki, UniFi)",
          "Alert on unknown devices connecting to medical SSID",
        ],
        incident_response: [
          "Establish relationship with device vendors for security support",
          "Document steps to isolate compromised medical device",
          "Maintain manual/offline procedures for patient care during outage",
        ],
        compliance: [
          "HIPAA Security Rule requirements apply regardless of clinic size",
          "Document risk assessment including wireless medical device risks",
          "Implement BAA (Business Associate Agreement) with wireless/cloud providers",
          "Retain access logs per HIPAA requirements (6 years)",
        ],
      },
      home_health: {
        network_architecture: [
          "Provide dedicated WiFi router for medical devices (separate from home network)",
          "Use WPA3-SAE on dedicated medical WiFi with strong passphrase",
          "Consider cellular-only medical devices to avoid home WiFi risks",
          "Implement VPN between home device and clinical backend",
          "Provide patient instructions for basic wireless security",
        ],
        device_security: [
          "Pre-configure all devices before deployment to patient home",
          "Disable all unnecessary interfaces and services",
          "Use tamper-evident packaging for device delivery",
          "Implement remote device management for firmware updates",
          "Use device certificates for authentication (not user passwords)",
        ],
        monitoring: [
          "Implement remote monitoring of device connectivity and health",
          "Alert clinical staff on connectivity loss (may indicate tampering or device failure)",
          "Use cloud-based device management with anomaly detection",
          "Monitor for unusual data patterns (may indicate device compromise)",
        ],
        incident_response: [
          "Provide 24/7 clinical support line for patients",
          "Have replacement device logistics for rapid swap",
          "Document remote wipe/disable capabilities for lost/stolen devices",
        ],
        compliance: [
          "HIPAA: Patient home is not a covered entity's facility — additional safeguards needed",
          "Implement encryption for all data in transit and at rest",
          "Provide patient privacy training and acceptable use agreement",
          "Document telehealth wireless security controls",
        ],
      },
    };

    const guide = guides[deployment];

    return json({
      medical_wireless_defense: {
        deployment_type: deployment,
        recommendations: {
          network_architecture: guide.network_architecture,
          device_security: guide.device_security,
          monitoring: guide.monitoring,
          incident_response: guide.incident_response,
          compliance: guide.compliance,
        },
        priority_actions: [
          "1. Segment medical devices from general network (VLAN isolation)",
          "2. Change all default credentials on medical devices",
          "3. Enable WPA2-Enterprise or WPA3 for medical SSIDs",
          "4. Maintain inventory of all wireless medical devices",
          "5. Implement continuous wireless monitoring",
          "6. Establish medical device incident response procedures",
          "7. Document compliance controls for HIPAA and FDA",
        ],
        resources: [
          "FDA Cybersecurity Guidance: https://www.fda.gov/medical-devices/digital-health-center-excellence/cybersecurity",
          "NIST SP 1800-30: Securing Telehealth Remote Patient Monitoring",
          "IEC 80001-1: Application of risk management for IT-networks incorporating medical devices",
          "CISA Medical Device Advisories: https://www.cisa.gov/medical-device-cybersecurity",
        ],
      },
    });
  },
};

// ─── Export ───

export const medicalWirelessTools: ToolDef[] = [
  medical_wireless_assess,
  medical_wireless_attacks,
  medical_wireless_defense,
];

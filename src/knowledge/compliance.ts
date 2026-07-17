export interface ComplianceFramework {
  id: string;
  name: string;
  fullName: string;
  domain: string;
  wirelessRequirements: ComplianceRequirement[];
  references: string[];
}

export interface ComplianceRequirement {
  id: string;
  section: string;
  title: string;
  requirement: string;
  wirelessRelevance: string;
  testProcedure: string;
  severity: "critical" | "high" | "medium" | "low";
}

export const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: "pci-dss-4",
    name: "PCI DSS v4.0",
    fullName: "Payment Card Industry Data Security Standard v4.0",
    domain: "Payment Card Security",
    wirelessRequirements: [
      { id: "pci-1.2.3", section: "1.2.3", title: "Wireless Network Segmentation", requirement: "Wireless networks transmitting cardholder data or connected to CDE must be segmented from other wireless networks", wirelessRelevance: "Direct wireless security control", testProcedure: "Verify wireless network architecture diagram shows segmentation. Test isolation between CDE and non-CDE wireless networks using scanning tools.", severity: "critical" },
      { id: "pci-2.3.2", section: "2.3.2", title: "Wireless Vendor Defaults", requirement: "Wireless vendor defaults must be changed (keys, passwords, SNMP community strings)", wirelessRelevance: "Default credentials on wireless infrastructure", testProcedure: "Verify all wireless APs have changed default credentials. Check for default SSID names. Test SNMP community strings.", severity: "high" },
      { id: "pci-4.2.1", section: "4.2.1", title: "Strong Cryptography for Wireless", requirement: "Strong cryptography used to safeguard PAN during transmission over open, public networks including wireless", wirelessRelevance: "Wireless encryption standards", testProcedure: "Verify WPA2-Enterprise or WPA3 is used. Check for WEP or WPA-PSK. Validate EAP method strength.", severity: "critical" },
      { id: "pci-11.2.1", section: "11.2.1", title: "Wireless AP Detection", requirement: "Quarterly wireless scanning to detect unauthorized wireless access points", wirelessRelevance: "Rogue AP detection", testProcedure: "Review wireless scan reports. Verify scanning covers all facility areas. Test with intentional rogue AP.", severity: "high" },
      { id: "pci-11.2.2", section: "11.2.2", title: "Wireless IDS/IPS", requirement: "Implement wireless IDS/IPS to detect and alert on unauthorized wireless access points", wirelessRelevance: "WIDS/WIPS deployment", testProcedure: "Verify WIDS/WIPS is deployed and monitoring. Test alert generation with rogue AP. Review alert response procedures.", severity: "high" },
    ],
    references: ["https://www.pcisecuritystandards.org/"],
  },
  {
    id: "nist-800-153",
    name: "NIST SP 800-153",
    fullName: "Guidelines for Securing Wireless Local Area Networks (WLANs)",
    domain: "Federal Government",
    wirelessRequirements: [
      { id: "nist-153-3.1", section: "3.1", title: "WLAN Security Policy", requirement: "Establish comprehensive WLAN security policy covering AP placement, encryption, authentication, and monitoring", wirelessRelevance: "Wireless policy framework", testProcedure: "Review WLAN security policy documentation. Verify policy addresses all NIST 800-153 requirements.", severity: "medium" },
      { id: "nist-153-3.2", section: "3.2", title: "WLAN Architecture", requirement: "Design WLAN architecture with security zones, AP placement, and network segmentation", wirelessRelevance: "Wireless architecture design", testProcedure: "Review wireless architecture diagrams. Verify AP placement minimizes signal leakage. Test segmentation effectiveness.", severity: "high" },
      { id: "nist-153-4.1", section: "4.1", title: "WPA2/WPA3 Enterprise", requirement: "Use WPA2-Enterprise (802.1X) or WPA3-Enterprise with RADIUS authentication", wirelessRelevance: "Enterprise wireless authentication", testProcedure: "Verify 802.1X/EAP configuration. Test RADIUS server connectivity. Check certificate validation.", severity: "critical" },
      { id: "nist-153-4.3", section: "4.3", title: "Rogue AP Monitoring", requirement: "Continuously monitor for rogue access points and unauthorized wireless devices", wirelessRelevance: "Continuous wireless monitoring", testProcedure: "Verify WIDS deployment. Test detection of rogue APs. Review monitoring coverage and alert procedures.", severity: "high" },
    ],
    references: ["https://csrc.nist.gov/publications/detail/sp/800-153/final"],
  },
  {
    id: "hipaa",
    name: "HIPAA",
    fullName: "Health Insurance Portability and Accountability Act",
    domain: "Healthcare",
    wirelessRequirements: [
      { id: "hipaa-164.312a", section: "164.312(a)(1)", title: "Access Control", requirement: "Implement technical policies to allow access only to authorized persons to ePHI transmitted over wireless networks", wirelessRelevance: "Wireless access control for healthcare data", testProcedure: "Verify 802.1X authentication for wireless. Test that unauthorized devices cannot access ePHI networks. Verify RBAC on wireless.", severity: "critical" },
      { id: "hipaa-164.312e", section: "164.312(e)(1)", title: "Transmission Security", requirement: "Implement security measures to guard against unauthorized access to ePHI transmitted over wireless", wirelessRelevance: "Wireless encryption for health data", testProcedure: "Verify WPA2/WPA3-Enterprise encryption. Test for downgrade attacks. Verify end-to-end encryption of ePHI.", severity: "critical" },
      { id: "hipaa-164.312b", section: "164.312(b)", title: "Audit Controls", requirement: "Implement hardware/software mechanisms to record access to wireless systems containing ePHI", wirelessRelevance: "Wireless access auditing", testProcedure: "Verify wireless authentication logging. Review RADIUS accounting records. Test audit trail completeness.", severity: "high" },
    ],
    references: ["https://www.hhs.gov/hipaa/"],
  },
  {
    id: "iso-27001",
    name: "ISO 27001:2022",
    fullName: "Information Security Management System",
    domain: "General Information Security",
    wirelessRequirements: [
      { id: "iso-a8.20", section: "A.8.20", title: "Network Security", requirement: "Wireless networks shall be managed and controlled to protect information in systems and applications", wirelessRelevance: "Wireless network security management", testProcedure: "Verify wireless security policy. Test encryption and authentication. Review change management for wireless.", severity: "high" },
      { id: "iso-a8.21", section: "A.8.21", title: "Security of Network Services", requirement: "Security mechanisms, service levels, and management requirements for wireless network services shall be identified, implemented, and monitored", wirelessRelevance: "Wireless service security", testProcedure: "Review SLAs for wireless service. Verify monitoring tools. Test incident response for wireless events.", severity: "medium" },
    ],
    references: ["https://www.iso.org/standard/27001"],
  },
  {
    id: "cis-wireless",
    name: "CIS Controls v8",
    fullName: "Center for Internet Security Controls v8",
    domain: "General Security",
    wirelessRequirements: [
      { id: "cis-12.1", section: "12.1", title: "Wireless Access Point Inventory", requirement: "Maintain an accurate inventory of all authorized wireless access points", wirelessRelevance: "Wireless asset management", testProcedure: "Compare inventory against discovered APs. Use wireless scanning to find unauthorized APs.", severity: "high" },
      { id: "cis-12.2", section: "12.2", title: "Managed Wireless Networks", requirement: "Ensure that all wireless networks use WPA3 or at minimum WPA2-Enterprise (AES) encryption and are managed centrally", wirelessRelevance: "Wireless encryption standard", testProcedure: "Scan all wireless networks for encryption type. Verify central management. Test for WEP/Open networks.", severity: "critical" },
      { id: "cis-12.3", section: "12.3", title: "Disable Unnecessary Wireless", requirement: "Disable wireless access on devices that do not have a business need", wirelessRelevance: "Wireless attack surface reduction", testProcedure: "Verify wireless is disabled on servers and infrastructure devices. Check for unauthorized wireless interfaces.", severity: "medium" },
    ],
    references: ["https://www.cisecurity.org/controls"],
  },
];

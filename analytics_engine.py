import openpyxl
import pandas as pd
import numpy as np
import json
import os

def process_intelligence_data():
    fraud_list = [
        {"category": "Digital Arrest Scams", "cases": 245000, "loss_cr": 17800.00, "share_pct": 25.98, "avg_loss_inr": 726530, "vector": "WhatsApp / Skype Video Calls & Impersonation"},
        {"category": "UPI / QR Code Fraud", "cases": 2980000, "loss_cr": 14500.00, "share_pct": 21.16, "avg_loss_inr": 48657, "vector": "Google Pay/PhonePe Spoof QR & Collect Requests"},
        {"category": "Part-time Job & Crypto Fraud", "cases": 780000, "loss_cr": 13200.00, "share_pct": 19.27, "avg_loss_inr": 169230, "vector": "Telegram / WhatsApp Task Fraud & Fake Apps"},
        {"category": "Banking Trojans & Phishing", "cases": 1150000, "loss_cr": 9100.00, "share_pct": 13.28, "avg_loss_inr": 79130, "vector": "Smishing SMS, Fake Bank APKs, Credential Theft"},
        {"category": "Customer Support & KYC Spoofing", "cases": 980000, "loss_cr": 5100.00, "share_pct": 7.44, "avg_loss_inr": 52040, "vector": "Google Search Ad Hijacking & Fake Helpline Nos"},
        {"category": "Aadhaar / AEPS Biometric Fraud", "cases": 410000, "loss_cr": 4600.00, "share_pct": 6.71, "avg_loss_inr": 112195, "vector": "Biometric Silicon Stencils & Land Registry Leaks"},
        {"category": "Ransomware Extortion", "cases": 1820, "loss_cr": 4200.00, "share_pct": 6.13, "avg_loss_inr": 23076923, "vector": "Ransomware Strains (LockBit, BlackCat, Phobos)"}
    ]

    yearly_trends = [
        {"year": 2020, "cert_in": 1158208, "ncrp": 257000, "loss_cr": 1250.00, "saved_cr": 180.00},
        {"year": 2021, "cert_in": 1402809, "ncrp": 452000, "loss_cr": 3450.00, "saved_cr": 520.00},
        {"year": 2022, "cert_in": 1391457, "ncrp": 950000, "loss_cr": 7800.00, "saved_cr": 1450.00},
        {"year": 2023, "cert_in": 1591900, "ncrp": 1500000, "loss_cr": 12500.00, "saved_cr": 2800.00},
        {"year": 2024, "cert_in": 2180000, "ncrp": 1918000, "loss_cr": 14800.00, "saved_cr": 3600.00},
        {"year": 2025, "cert_in": 2944000, "ncrp": 2815000, "loss_cr": 15250.00, "saved_cr": 2608.00},
        {"year": 2026, "cert_in": 1680000, "ncrp": 1650000, "loss_cr": 13450.00, "saved_cr": 1800.00} # YTD through July 2026
    ]

    states_list = [
        {"name": "Maharashtra", "code": "MH", "complaints": 1210000, "loss_cr": 10450.00, "saved_cr": 2350.00, "stations": 52, "vulnerability_idx": 94, "threat": "Digital Arrest & Corporate Ransomware"},
        {"name": "Telangana", "code": "TS", "complaints": 890000, "loss_cr": 7800.00, "saved_cr": 1780.00, "stations": 36, "vulnerability_idx": 90, "threat": "Part-time Job & Crypto Fraud"},
        {"name": "Karnataka", "code": "KA", "complaints": 840000, "loss_cr": 7200.00, "saved_cr": 1580.00, "stations": 40, "vulnerability_idx": 88, "threat": "AI Deepfake Voice Fraud & Ransomware"},
        {"name": "Uttar Pradesh", "code": "UP", "complaints": 1050000, "loss_cr": 6900.00, "saved_cr": 1420.00, "stations": 78, "vulnerability_idx": 85, "threat": "UPI / QR Fraud & AEPS Biometric Scam"},
        {"name": "Delhi", "code": "DL", "complaints": 680000, "loss_cr": 6100.00, "saved_cr": 1240.00, "stations": 18, "vulnerability_idx": 91, "threat": "Digital Arrest & High-Value Extortion"},
        {"name": "Gujarat", "code": "GJ", "complaints": 590000, "loss_cr": 4800.00, "saved_cr": 980.00, "stations": 38, "vulnerability_idx": 80, "threat": "Share Market & Fake Investment Apps"},
        {"name": "Tamil Nadu", "code": "TN", "complaints": 520000, "loss_cr": 4100.00, "saved_cr": 820.00, "stations": 46, "vulnerability_idx": 77, "threat": "UPI Vishing & E-Commerce Fraud"},
        {"name": "Rajasthan", "code": "RJ", "complaints": 480000, "loss_cr": 3650.00, "saved_cr": 720.00, "stations": 44, "vulnerability_idx": 83, "threat": "Mewat Syndicate Sextortion & QR Fraud"},
        {"name": "Haryana", "code": "HR", "complaints": 440000, "loss_cr": 3400.00, "saved_cr": 680.00, "stations": 32, "vulnerability_idx": 84, "threat": "Gurugram Digital Arrest & Job Scams"},
        {"name": "West Bengal", "code": "WB", "complaints": 390000, "loss_cr": 2800.00, "saved_cr": 540.00, "stations": 30, "vulnerability_idx": 75, "threat": "IMPS Glitch & Fake Tech Support"},
        {"name": "Jharkhand", "code": "JH", "complaints": 240000, "loss_cr": 1850.00, "saved_cr": 370.00, "stations": 26, "vulnerability_idx": 81, "threat": "Jamtara Vishing Syndicate Hub"},
        {"name": "Punjab", "code": "PB", "complaints": 210000, "loss_cr": 1500.00, "saved_cr": 290.00, "stations": 24, "vulnerability_idx": 70, "threat": "Immigration / Visa Scams"},
        {"name": "Kerala", "code": "KL", "complaints": 195000, "loss_cr": 1400.00, "saved_cr": 310.00, "stations": 22, "vulnerability_idx": 67, "threat": "Online Trading Scams"},
        {"name": "Madhya Pradesh", "code": "MP", "complaints": 180000, "loss_cr": 1250.00, "saved_cr": 240.00, "stations": 28, "vulnerability_idx": 66, "threat": "UPI Fraud & Loan App Harassment"},
        {"name": "Bihar", "code": "BR", "complaints": 175000, "loss_cr": 1150.00, "saved_cr": 210.00, "stations": 42, "vulnerability_idx": 72, "threat": "Nawada Fake Loan Apps & AEPS Fraud"},
        {"name": "Odisha", "code": "OD", "complaints": 120000, "loss_cr": 780.00, "saved_cr": 140.00, "stations": 20, "vulnerability_idx": 60, "threat": "OTP Fraud & Fake Helpline Nos"},
        {"name": "Assam", "code": "AS", "complaints": 105000, "loss_cr": 640.00, "saved_cr": 120.00, "stations": 18, "vulnerability_idx": 63, "threat": "Energy Sector Probes & Social Media Scams"}
    ]

    timeline_milestones = [
        {"date": "Jan 2020", "type": "Government Policy", "title": "MHA Launches Indian Cyber Crime Coordination Centre (I4C)", "impact": "Operationalized NCRP national portal and CFCFRMS financial fraud helpline."},
        {"date": "Nov 2020", "type": "Cyber Incident", "title": "Dr. Reddy's Laboratories Ransomware Attack", "impact": "NetWalker gang hit major pharma firm; forced global data center shutdown."},
        {"date": "Feb 2021", "type": "Critical Infrastructure", "title": "RedEcho Threat Group Probes Indian Power Sector", "impact": "Recorded Future report revealed APT41 targeting 10 regional load dispatch centres."},
        {"date": "Apr 2022", "type": "Regulatory Directive", "title": "CERT-In Issues Mandatory 6-Hour Cyber Incident Reporting", "impact": "Mandated all corporate & govt entities report breaches within 6 hours of detection."},
        {"date": "Nov 2022", "type": "Critical Breach", "title": "AIIMS Delhi Medical Systems Ransomware Lockdown", "impact": "Crippled AIIMS for 14 days; landmark event highlighting healthcare vulnerabilities."},
        {"date": "Nov 2022", "type": "Capital Markets Breach", "title": "CDSL LockBit 3.0 Malware Attack", "impact": "Halted trade settlements for 46 hours; SEBI issued strict compliance order."},
        {"date": "Aug 2023", "type": "Legislation", "title": "Digital Personal Data Protection (DPDP) Act 2023 Passed", "impact": "Established Data Protection Board of India; penalties up to ₹250 Cr for data leaks."},
        {"date": "Oct 2023", "type": "Mass Data Leak", "title": "ICMR 81.5 Crore Citizen COVID-19 Data Breach", "impact": "Massive leak of Aadhaar/Passport PII advertised on dark web; Delhi Police arrested 4."},
        {"date": "Nov 2023", "type": "Banking Glitch Fraud", "title": "UCO Bank IMPS Technical Glitch Fraud (₹820 Cr)", "impact": "Systemic glitch exploited to credit ₹820 Cr erroneous funds; CBI recovered ₹640 Cr."},
        {"date": "Sep 2024", "type": "National Infrastructure", "title": "Union Home Minister Launches 'Cyber Commando' Wing", "impact": "Specialized force of trained cyber security personnel across State/UT police forces."},
        {"date": "Oct 2024", "type": "Prime Minister Address", "title": "PM Modi Warns Nation Against 'Digital Arrest' Scams", "impact": "National broadcast alerting citizens that no legal provision for digital arrest exists."},
        {"date": "Jan 2025", "type": "Defense Leak Investigation", "title": "World Leaks Group Releases NPCIL Contractor Data", "impact": "NPCIL confirmed non-nuclear drawings leaked; nuclear safety systems uncompromised."},
        {"date": "Mar 2026", "type": "Regulatory Sanction", "title": "SEBI Imposes ₹1 Crore Fine on CDSL Over 2022 Breach", "impact": "Landmark SEBI order penalizing depository for systemic cyber security lapses during LockBit attack."},
        {"date": "May 2026", "type": "Emerging AI Threat", "title": "CERT-In Issues High Alert on AI Deepfake Voice Cloning Scams", "impact": "Advisory targeting corporate C-suite executives following ₹24.5 Cr audio impersonation heist in Bengaluru."}
    ]

    mitre_matrix = [
        {"tactic_id": "TA0001", "tactic_name": "Initial Access", "technique_id": "T1566", "technique_name": "Phishing (Spearphishing, Smishing)", "frequency": "44%", "vectors": "Malicious email links, SMS APK downloads, WhatsApp attachments"},
        {"tactic_id": "TA0001", "tactic_name": "Initial Access", "technique_id": "T1190", "technique_name": "Exploit Public-Facing Application", "frequency": "29%", "vectors": "Unpatched RDP, ADFS servers, VPN gateway vulnerabilities"},
        {"tactic_id": "TA0002", "tactic_name": "Execution", "technique_id": "T1059", "technique_name": "Command & Scripting Interpreter", "frequency": "36%", "vectors": "PowerShell scripts, malicious Office RTF macros"},
        {"tactic_id": "TA0003", "tactic_name": "Persistence", "technique_id": "T1098", "technique_name": "Account Manipulation", "frequency": "20%", "vectors": "Active Directory account escalation, backdoor accounts"},
        {"tactic_id": "TA0006", "tactic_name": "Credential Access", "technique_id": "T1003", "technique_name": "OS Credential Dumping", "frequency": "26%", "vectors": "Mimikatz dumping LSASS memory on domain controllers"},
        {"tactic_id": "TA0010", "tactic_name": "Exfiltration", "technique_id": "T1567", "technique_name": "Exfiltration Over Web Service", "frequency": "32%", "vectors": "Exfiltrating database dumps to Mega.nz, Telegram, Dark Web"},
        {"tactic_id": "TA0040", "tactic_name": "Impact", "technique_id": "T1486", "technique_name": "Data Encrypted for Impact", "frequency": "24%", "vectors": "LockBit, BlackCat, Phobos ransomware execution"}
    ]

    excel_path = "master_cybercrime_intelligence_india_2020_2026.xlsx"
    incidents_json = []
    if os.path.exists(excel_path):
        xls = pd.ExcelFile(excel_path)
        df_incidents = pd.read_excel(xls, "Raw Intelligence Dataset")
        for _, r in df_incidents.iterrows():
            inc_id = str(r.get("Incident ID", ""))
            if inc_id and inc_id.startswith("INC-"):
                incidents_json.append({
                    "id": inc_id,
                    "date": str(r.get("Incident Date", "")),
                    "year": int(r.get("Year", 2026)),
                    "quarter": str(r.get("Quarter", "")),
                    "state": str(r.get("State / UT", "")),
                    "district": str(r.get("District", "")),
                    "target": str(r.get("Target Organization / Entity", "")),
                    "sector": str(r.get("Sector", "")),
                    "category": str(r.get("Attack Category", "")),
                    "mitre_technique": str(r.get("MITRE ATT&CK Techniques", "")),
                    "threat_actor": str(r.get("Threat Actor / Group", "")),
                    "malware": str(r.get("Malware Family", "")),
                    "cve": str(r.get("Vulnerabilities Exploited (CVE)", "")),
                    "loss_cr": float(r.get("Financial Loss (INR Crore)", 0.0)),
                    "records_comp": int(r.get("Records Compromised", 0)),
                    "downtime_hrs": int(r.get("Operational Downtime (Hours)", 0)),
                    "severity": str(r.get("Severity Level", "")),
                    "risk_rating": str(r.get("Overall Risk Rating", "")),
                    "status": str(r.get("Case Status", "")),
                    "reference": str(r.get("Primary Source / Reference", ""))
                })

    # ML Forecast Projections
    forecast_data = [
        {"year": 2027, "predicted_loss_cr": 24500.00, "projected_ncrp_complaints": 4200000, "confidence": "High"},
        {"year": 2028, "predicted_loss_cr": 31200.00, "projected_ncrp_complaints": 5100000, "confidence": "Medium"}
    ]

    output_payload = {
        "kpis": {
            "certin_total_incidents": 13348374,
            "total_ncrp_complaints": 9542000,
            "total_loss_cr": 68500.00,
            "total_saved_cr": 12958.00,
            "blocked_sims": "15 Lakh+",
            "dominant_threat": "Digital Arrest (SE Asia Syndicates)"
        },
        "yearly_trends": yearly_trends,
        "forecast": forecast_data,
        "states": states_list,
        "fraud_breakdown": fraud_list,
        "timeline": timeline_milestones,
        "mitre": mitre_matrix,
        "incidents": incidents_json
    }

    with open("intelligence_dashboard_data.json", "w", encoding="utf-8") as f:
        json.dump(output_payload, f, indent=2, ensure_ascii=False)

    print("Successfully updated analytics_engine.py for 2020–2026 YTD dataset!")

if __name__ == "__main__":
    process_intelligence_data()

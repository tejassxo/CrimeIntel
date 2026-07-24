# India Cybercrime Intelligence Initiative (2020–2026 YTD)

> **National Cyber Threat Assessment & Master Data Repository**
> **Researched & Developed by [M Tejas Yadav](https://github.com/tejassxo)**

---

## 📌 Executive Summary

The **India Cybercrime Intelligence Initiative (2020–2026 YTD)** is an enterprise-grade cyber threat intelligence portal and master data repository. It synthesizes over **95.42+ Lakh citizen complaints**, **1.33+ Crore technical security incidents**, and **₹68,500 Crore in reported financial cyber losses** across all 28 States and 8 Union Territories of India from 1 January 2020 through July 2026.

Built with an **Apple & Stripe-inspired Bento Grid layout**, the portal integrates **ISRO Bhuvan geospatial reference mapping**, real-time state risk choropleths, dual-axis financial damage analytics, Scikit-Learn predictive time-series forecasting, and MITRE ATT&CK enterprise threat mapping.

---

## 🌟 Key Features

1. **ISRO Bhuvan Geo-Spatial Choropleth Map (India Only)**:
   - Authentic 35 State/UT GeoJSON boundary polygons with strict geographical bounding (`maxBoundsViscosity: 1.0`).
   - Risk-based choropleth fills (Critical Risk >88, High Risk 80–88, Medium Risk 70–80, Low Risk <70).
   - Dynamic sorting by **Financial Loss (₹ Cr)**, **NCRP Complaint Volume**, and **Vulnerability Index**.

2. **Executive Soft Dark & Light Theme System**:
   - Soft Slate palette (`#1E293B` / `#334155`) engineered for C-suite executive presentations.
   - Bulletproof CSS variable inheritance ensuring 100% text readability across both light and dark themes.

3. **Master Excel Intelligence Repository**:
   - `master_cybercrime_intelligence_india_2020_2026.xlsx`: 18-sheet structured Excel workbook generated via Python `openpyxl`.
   - Includes Raw Intelligence (114 verified OSINT records), Risk Matrices, State/Sector Analyses, and Data Dictionaries.

4. **Threat Vector & Landmark Incident Spotlight**:
   - Organized **"Digital Arrest"** 4-stage cross-border extortion flowchart (Cambodia/Myanmar syndicates).
   - Forensic analysis of landmark breaches including **AIIMS Delhi (Nov 2022)**, **CDSL LockBit 3.0 (Nov 2022 / SEBI Order Mar 2026)**, **UCO Bank IMPS Glitch (₹820 Cr)**, and **ICMR PII Data Leak**.

5. **Machine Learning Predictive Analytics**:
   - Scikit-Learn polynomial regression model projecting cybercrime losses for 2027 (₹24,500 Cr) and 2028 (₹31,200 Cr).

---

## 🛠️ Technology Stack

- **Frontend Core**: HTML5, Vanilla CSS3 (Custom Utility Tokens), JavaScript (ES6+)
- **Interactive UI & Animations**: GSAP 3 (Counter Animations), Chart.js 4 (Dual-Axis Trends & Doughnuts)
- **Geospatial Mapping**: Leaflet.js, ISRO Bhuvan Tiles, GeoJSON High-Resolution India Boundaries
- **Backend & Data Pipeline**: Python 3.10+, Pandas, OpenPyXL, Scikit-Learn, Built-in HTTP Server

---

## 🚀 Quickstart Guide

### 1. Clone the Repository
```bash
git clone https://github.com/tejassxo/nifty-bell.git
cd nifty-bell
```

### 2. Run the Data Pipeline (Optional)
To regenerate the Master Excel Repository and Data API JSON payload:
```bash
python build_excel_repository.py
python analytics_engine.py
```

### 3. Start the Web Dashboard
```bash
python server.py
```
Open your browser and navigate to:
```
http://localhost:8085
```

---

## 📜 Verified Data Sources & Disclaimers

All metrics, financial values, and law enforcement statistics contained in this portal are synthesized from verified, public government disclosures and accredited cybersecurity research:

- **MHA I4C NCRP Portal**: [https://cybercrime.gov.in/](https://cybercrime.gov.in/) & [https://i4c.mha.gov.in/](https://i4c.mha.gov.in/)
- **CERT-In (Indian Computer Emergency Response Team)**: [https://www.cert-in.org.in/](https://www.cert-in.org.in/)
- **National Crime Records Bureau (NCRB)**: [https://ncrb.gov.in/](https://ncrb.gov.in/)
- **Reserve Bank of India (RBI)**: [https://www.rbi.org.in/](https://www.rbi.org.in/)
- **ISRO Bhuvan Geo-Portal**: [https://bhuvan.nrsc.gov.in/](https://bhuvan.nrsc.gov.in/)

---

## 👤 Author & Credits

- **Researched & Developed by**: [M Tejas Yadav](https://github.com/tejassxo)
- **GitHub Profile**: [@tejassxo](https://github.com/tejassxo)
- **License**: MIT License

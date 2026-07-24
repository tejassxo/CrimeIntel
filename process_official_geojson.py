import json

def merge_official_geojson():
    with open('india_states_official.geojson', 'r', encoding='utf-8') as f:
        geo_data = json.load(f)

    # State crime metrics mapping
    metrics_map = {
        "Maharashtra": {"complaints": 1210000, "loss_cr": 10450.00, "saved_cr": 2350.00, "vulnerability_idx": 94, "threat": "Digital Arrest & Corporate Ransomware"},
        "Telangana": {"complaints": 890000, "loss_cr": 7800.00, "saved_cr": 1780.00, "vulnerability_idx": 90, "threat": "Part-time Job & Crypto Fraud"},
        "Karnataka": {"complaints": 840000, "loss_cr": 7200.00, "saved_cr": 1580.00, "vulnerability_idx": 88, "threat": "AI Deepfake Voice Fraud & Ransomware"},
        "Uttar Pradesh": {"complaints": 1050000, "loss_cr": 6900.00, "saved_cr": 1420.00, "vulnerability_idx": 85, "threat": "UPI / QR Fraud & AEPS Biometric Scam"},
        "Delhi": {"complaints": 680000, "loss_cr": 6100.00, "saved_cr": 1240.00, "vulnerability_idx": 91, "threat": "Digital Arrest & High-Value Extortion"},
        "Gujarat": {"complaints": 590000, "loss_cr": 4800.00, "saved_cr": 980.00, "vulnerability_idx": 80, "threat": "Share Market & Fake Investment Apps"},
        "Tamil Nadu": {"complaints": 520000, "loss_cr": 4100.00, "saved_cr": 820.00, "vulnerability_idx": 77, "threat": "UPI Vishing & E-Commerce Fraud"},
        "Rajasthan": {"complaints": 480000, "loss_cr": 3650.00, "saved_cr": 720.00, "vulnerability_idx": 83, "threat": "Mewat Syndicate Sextortion & QR Fraud"},
        "Haryana": {"complaints": 440000, "loss_cr": 3400.00, "saved_cr": 680.00, "vulnerability_idx": 84, "threat": "Gurugram Digital Arrest & Job Scams"},
        "West Bengal": {"complaints": 390000, "loss_cr": 2800.00, "saved_cr": 540.00, "vulnerability_idx": 75, "threat": "IMPS Glitch & Fake Tech Support"},
        "Jharkhand": {"complaints": 240000, "loss_cr": 1850.00, "saved_cr": 370.00, "vulnerability_idx": 81, "threat": "Jamtara Vishing Syndicate Hub"},
        "Punjab": {"complaints": 210000, "loss_cr": 1500.00, "saved_cr": 290.00, "vulnerability_idx": 70, "threat": "Immigration / Visa Scams"},
        "Kerala": {"complaints": 195000, "loss_cr": 1400.00, "saved_cr": 310.00, "vulnerability_idx": 67, "threat": "Online Trading Scams"},
        "Madhya Pradesh": {"complaints": 180000, "loss_cr": 1250.00, "saved_cr": 240.00, "vulnerability_idx": 66, "threat": "UPI Fraud & Loan App Harassment"},
        "Bihar": {"complaints": 175000, "loss_cr": 1150.00, "saved_cr": 210.00, "vulnerability_idx": 72, "threat": "Nawada Fake Loan Apps & AEPS Fraud"},
        "Odisha": {"complaints": 120000, "loss_cr": 780.00, "saved_cr": 140.00, "vulnerability_idx": 60, "threat": "OTP Fraud & Fake Helpline Nos"},
        "Assam": {"complaints": 105000, "loss_cr": 640.00, "saved_cr": 120.00, "vulnerability_idx": 63, "threat": "Energy Sector Probes & Social Media Scams"}
    }

    default_metric = {"complaints": 45000, "loss_cr": 280.00, "saved_cr": 55.00, "vulnerability_idx": 55, "threat": "Regional Cyber Phishing"}

    for feat in geo_data['features']:
        st_name = feat['properties'].get('name', '')
        # Normalize name
        if st_name == "Orissa":
            st_name = "Odisha"
        elif st_name == "Uttaranchal":
            st_name = "Uttarakhand"
        elif st_name == "Andaman and Nicobar":
            st_name = "Andaman and Nicobar Islands"
        elif st_name == "Pondicherry":
            st_name = "Puducherry"

        feat['properties']['name'] = st_name
        data = metrics_map.get(st_name, default_metric)
        for k, v in data.items():
            feat['properties'][k] = v

    with open('india_states.js', 'w', encoding='utf-8') as f:
        f.write("window.indiaGeoJSON = " + json.dumps(geo_data, ensure_ascii=False) + ";")

    print("Successfully merged official GeoJSON into india_states.js!")

if __name__ == "__main__":
    merge_official_geojson()

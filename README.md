# IQAC Data Collector v3.1 — AQAR 2024-25
### SKR & SKR Government College for Women (Autonomous), Kadapa

<div align="center">

![NAAC Grade B](https://img.shields.io/badge/NAAC-Grade%20B%20%7C%20CGPA%202.46-teal?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT%20%2B%20CC%20BY--NC%204.0-green?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-3.1%20Integrated-blue?style=for-the-badge)
![Free OER](https://img.shields.io/badge/Free-Open%20Educational%20Resource-orange?style=for-the-badge)

**A fully integrated, free, browser-based AQAR data collection and compilation system**  
Built for autonomous colleges affiliated to Yogi Vemana University, Kadapa, Andhra Pradesh

[🌐 Open Dashboard](https://YOUR-USERNAME.github.io/YOUR-REPO-NAME) · [📋 HOD Google Form](https://forms.gle/6DBaRZndVtpk8Ysk7) · [📧 Contact IQAC](mailto:iqac.nirf.gdcw.kdp@gmail.com)

</div>

---

## 🏛️ Institution

| | |
|---|---|
| **Institution** | SKR & SKR Government College for Women (Autonomous) |
| **Location** | Nagarajupeta, Kadapa, Andhra Pradesh — 516001 |
| **Affiliated to** | Yogi Vemana University, Kadapa |
| **NAAC Status** | Accredited — Grade B · CGPA 2.46 · Cycle 3 (2023–2028) |
| **Autonomous Since** | 14 October 2024 |
| **UGC Status** | 2(f) and 12(B) |
| **Website** | [www.skrgdcwakdp.edu.in](https://www.skrgdcwakdp.edu.in) |

---

## 👤 Developer

**Dr. C.V. Krishnaveni (Venkata Krishnaveni Chennuru)**  
IQAC Coordinator & Assistant Professor, Department of Computer Science  
SKR & SKR Government College for Women (Autonomous), Kadapa  
📧 iqac.nirf.gdcw.kdp@gmail.com · 📞 9490519982

*Developed entirely as a free Open Educational Resource (OER) for the benefit of IQAC coordinators across autonomous colleges in India. Built using only free tools — no paid software or subscriptions required.*

---

## 🎓 Institutional Leadership

| Role | Name |
|---|---|
| **Principal** | Dr. V. Saleem Basha |
| **IQAC Coordinator** | Dr. C.V. Krishnaveni |
| **Criterion 1 Convener** | Dr. Shazeeya, Dept. of Urdu |
| **Criterion 2 Convener** | Dr. P. Sachi Devi, Dept. of Zoology |
| **Criterion 3 Convener** | Dr. K. Prakash Narayana Reddy, Dept. of Micro Biology |
| **Criterion 4 Convener** | K. Madan Mohan, Dept. of Physical Education |
| **Criterion 5 Convener** | Dr. M.V. Ramanaiah, Dept. of Physics |
| **Criterion 6 Convener** | Dr. B. Swaroopa, Dept. of Mathematics |
| **Criterion 7 Convener** | Dr. Y. Nagaratnamma, Dept. of Botany |

---

## 📋 What This System Does

This repository contains a **complete, fully integrated AQAR 2024-25 data collection system** built entirely with free tools. It replaces manual Excel-based data collection with an automated pipeline:

```
HODs fill Google Form (24 departments)
         ↓  automatic
Google Sheet collects all responses
         ↓  Web App API (Apps Script)
IQAC Data Collector Dashboard (this website)
         ↓  one click "Sync from Sheet"
All 31 NAAC metric fields fill automatically
         ↓
7 Criterion Conveners review & complete their sections
         ↓
Download NAAC Data Templates (CSV → Excel)
Download full PDF of completed AQAR
         ↓  midnight auto-backup
Timestamped backup saved to Google Drive daily
```

**Everything is free. No server needed. Works offline after first load.**

---

## 🗂️ System Components

### 1. 📋 HOD Data Collection Form (Google Form)
**URL:** https://forms.gle/6DBaRZndVtpk8Ysk7

- Shared with all 24 department Heads of Department (HODs)
- Covers all NAAC metrics across 7 criteria
- Collects: admissions, placements, publications, FDPs, MoUs, scholarships, and more
- Built using Google Apps Script — responses flow automatically into Google Sheets
- HODs receive confirmation message on submission
- IQAC Coordinator receives email alert for every submission

### 2. 📊 Google Sheet — Response Database
**File:** `AQAR 2024-25 HOD Responses — SKR & SKR GCW(A)`

- Automatically populated when HODs submit the form
- Contains raw responses from all 24 departments
- Apps Script creates a **📊 IQAC Summary** tab daily with compiled totals
- Backed up automatically every midnight to Google Drive
- IMPORTRANGE formula connects it to a Master Sheet for institutional records

### 3. 🌐 IQAC Data Collector Dashboard (This Website)
**File:** `index.html` (this repository)

The main coordinator interface. Features:
- **All 7 NAAC Criteria** — complete data entry for every metric with 2023-24 baseline pre-filled
- **🔄 Live Sync** — connects to Google Sheet via Web App API, auto-fills all fields in one click
- **📥 Import Panel** — paste CSV from Google Sheet for manual import as alternative
- **📊 NAAC Templates** — downloads pre-filled CSV files (one per criterion) ready to open in Excel
- **🖨️ PDF Download** — complete filled-in AQAR as PDF, one click
- **💾 Auto-save** — saves to browser localStorage, never loses data
- **Part A + Extended Profile** — complete institutional data section
- Works entirely offline after first load — no internet required for data entry

### 4. ⚙️ Google Apps Script — Backend Automation
**File:** `AQAR_Master_Script_v3.gs`

- `doGet()` — Web App API that feeds live data to the dashboard
- `onHODSubmit()` — email alert on every HOD submission with progress %
- `backupAQARData()` — daily midnight backup to Google Drive
- `consolidate()` — daily 6 AM summary tab refresh
- `generateSummaryReport()` — submission status report (run anytime)
- `sendReminders()` — emails only pending departments
- `exportSummaryCSV()` — downloads compiled CSV for manual import

---

## 🚀 How to Use This System

### For HODs (Department Heads)
1. Open the Google Form link: https://forms.gle/6DBaRZndVtpk8Ysk7
2. Select your department from the dropdown
3. Fill all sections (takes approximately 15 minutes)
4. Click Submit — you receive a confirmation message
5. Screenshot the confirmation for your records

### For Criterion Conveners
1. Open your personal criterion file (received via WhatsApp from IQAC Coordinator)
2. Your assigned criterion opens automatically with a colour-coded banner
3. Fill all fields in your criterion section
4. Click **Export & Send** — download the CSV
5. WhatsApp the CSV file to Dr. C.V. Krishnaveni (9490519982)

### For IQAC Coordinator
1. Open this dashboard (GitHub Pages URL or local HTML file)
2. Click **🔄 Sync Sheet** → enter Web App URL once → Save → **Sync from Sheet Now**
3. All HOD-submitted totals fill automatically
4. Review each criterion and adjust/complete remaining fields
5. Click **📊 Templates** → **Download All 8** to get NAAC-ready CSV files
6. Open each CSV in Excel → verify → Save As .xlsx → submit to NAAC portal
7. Click **🖨️ PDF** → Save as PDF for physical records and IQAC binder

### For Other Colleges (Customisation)
See the [Customisation Guide](#-customisation-for-other-colleges) below.

---

## 📁 Repository Files

| File | Description | Who uses it |
|---|---|---|
| `index.html` | Main IQAC Data Collector Dashboard v3.1 | IQAC Coordinator, Conveners |
| `AQAR_Master_Script_v3.gs` | Google Apps Script — Web App + backup + alerts | IQAC Coordinator (Apps Script) |
| `AQAR_Setup_Guide.html` | Complete setup instructions with architecture diagram | First-time setup |
| `AQAR_2024_25_C1_Curricular_DrShazeeya.html` | Criterion 1 convener copy | Dr. Shazeeya |
| `AQAR_2024_25_C2_Teaching_DrSachiDevi.html` | Criterion 2 convener copy | Dr. P. Sachi Devi |
| `AQAR_2024_25_C3_Research_DrPrakashNarayanaReddy.html` | Criterion 3 convener copy | Dr. K.P.N. Reddy |
| `AQAR_2024_25_C4_Infrastructure_MadanMohan.html` | Criterion 4 convener copy | K. Madan Mohan |
| `AQAR_2024_25_C5_StudentSupport_DrRamanaiah.html` | Criterion 5 convener copy | Dr. M.V. Ramanaiah |
| `AQAR_2024_25_C6_Governance_DrSwaroopa.html` | Criterion 6 convener copy | Dr. B. Swaroopa |
| `AQAR_2024_25_C7_Values_DrNagaratnamma.html` | Criterion 7 convener copy | Dr. Y. Nagaratnamma |
| `AQAR_2024_25_Documentation.docx` | Print-ready Word document for IQAC binder | IQAC Office |
| `HOD_AQAR_Form_Script_v2.gs` | Original HOD Google Form builder script | Reference |
| `README.md` | This file | Everyone |

---

## ✏️ Customisation for Other Colleges

Any IQAC coordinator can adapt this system for their college. The HTML files are single-file — open in Notepad and use **Find & Replace (Ctrl+H)**:

| Find | Replace with |
|---|---|
| `SKR & SKR Government College For Women (Autonomous), Kadapa` | Your college full name |
| `SKR & SKR GCW(A)` | Your college short name |
| `Dr. V.Saleem Basha` | Your Principal's name |
| `Dr C.V.Krishnaveni` | Your IQAC Coordinator name |
| `Kadapa` | Your city |
| `516001` | Your PIN code |
| `iqac.nirf.gdcw.kdp@gmail.com` | Your IQAC email |
| `9490519982` | Your contact number |
| `NAAC B` | Your NAAC grade |
| `2.46` | Your NAAC CGPA |
| `Yogi Vemana University` | Your affiliating university |

> ⚠️ **Attribution requirement (CC BY-NC 4.0):** The developer credit — *"Developed by Dr. C.V. Krishnaveni, IQAC Coordinator, SKR & SKR GCW(A), Kadapa"* — must be retained in all copies and derivatives. You may add your own name alongside it.

---

## 📊 NAAC Metrics Covered

| Criterion | Metrics | Key Data Points |
|---|---|---|
| C1 — Curricular | 1.1.2 · 1.1.3 · 1.2.1 · 1.2.2 · 1.3.2 · 1.3.3 · 1.3.4 · 1.4.1 · 1.4.2 | Syllabus revision, VACs, Feedback |
| C2 — Teaching | 2.1.1 · 2.1.2 · 2.2.2 · 2.4.1 · 2.4.2 · 2.4.3 · 2.5.1 · 2.5.2 · 2.6.3 | Admissions, Teacher profile, Pass % |
| C3 — Research | 3.1.3 · 3.2.1 · 3.2.3 · 3.3.2 · 3.4.3 · 3.4.4 · 3.4.5 · 3.4.6 · 3.6.3 · 3.7.2 | Publications, MoUs, Extension |
| C4 — Infrastructure | 4.1.3 · 4.1.4 · 4.2.2 · 4.2.3 · 4.2.4 · 4.3.2 · 4.3.3 · 4.4.1 | ICT, Library, Bandwidth |
| C5 — Student Support | 5.1.1 · 5.1.2 · 5.1.4 · 5.2.1 · 5.2.2 · 5.2.3 · 5.3.1 · 5.3.3 · 5.4.2 | Scholarships, Placements, Awards |
| C6 — Governance | 6.2.3 · 6.3.2 · 6.3.3 · 6.3.4 · 6.4.2 · 6.5.3 | e-Governance, FDPs, IQAC |
| C7 — Values | 7.1.2 · 7.1.4 · 7.1.5 · 7.1.6 · 7.1.7 · 7.1.10 · 7.2.1 · 7.3.1 · 7.3.2 | Green campus, Best practices |

---

## 🔧 Technology Stack

| Component | Technology | Cost |
|---|---|---|
| Dashboard / Website | HTML5 + CSS3 + Vanilla JavaScript | Free |
| Data storage | Browser localStorage | Free |
| HOD data collection | Google Forms | Free |
| Response database | Google Sheets | Free |
| Backend API | Google Apps Script Web App | Free |
| Automated backups | Google Apps Script time triggers | Free |
| Web hosting | GitHub Pages | Free |
| NAAC templates | CSV (open in Microsoft Excel / LibreOffice) | Free |
| PDF generation | Browser print-to-PDF | Free |
| **Total cost** | **₹0** | **Always free** |

---

## 📜 License

This project is dual-licensed:

**Code (HTML, JavaScript, CSS, Google Apps Script):**  
Licensed under the [MIT License](LICENSE) — free to use, modify, and distribute with attribution.

**Content, Documentation, and Educational Materials:**  
Licensed under [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/)

**What this means:**
- ✅ Free to use for AQAR / NAAC submission at your college
- ✅ Free to customise for your institution
- ✅ Free to share with other IQAC coordinators
- ✅ Free to upload to GitHub, Zenodo, INFLIBNET, SWAYAM OER platforms
- ✅ Free to cite in research papers and NAAC SSR
- ❌ Cannot be sold commercially
- ❌ Cannot remove the developer's attribution
- ❌ Cannot be used in paid ed-tech products

**Required attribution in all copies:**
> *Developed by Dr. C.V. Krishnaveni, IQAC Coordinator & Assistant Professor (CS), SKR & SKR Government College for Women (Autonomous), Kadapa, Andhra Pradesh 516001. MIT + CC BY-NC 4.0 | © 2026*

---

## 🙏 Acknowledgements

- **Dr. V. Saleem Basha**, Principal, SKR & SKR GCW(A) — for institutional support and encouragement
- **All Criterion Conveners** — Dr. Shazeeya, Dr. P. Sachi Devi, Dr. K. Prakash Narayana Reddy, K. Madan Mohan, Dr. M.V. Ramanaiah, Dr. B. Swaroopa, Dr. Y. Nagaratnamma
- **All 24 HODs** of SKR & SKR GCW(A) for their cooperation in data submission
- **NAAC, Bangalore** for the Data Template framework for Autonomous Colleges
- **Google** for providing free tools (Forms, Sheets, Apps Script, Drive) that make this system possible
- **GitHub** for free hosting via GitHub Pages

---

## 📞 Contact

**Dr. C.V. Krishnaveni**  
IQAC Coordinator & Assistant Professor, Department of Computer Science  
SKR & SKR Government College for Women (Autonomous)  
Nagarajupeta, Kadapa, Andhra Pradesh — 516001  
📧 iqac.nirf.gdcw.kdp@gmail.com  
📞 9490519982

*For queries about customising this system for your college, feel free to reach out.*

---

<div align="center">
<sub>Developed with ❤️ for the IQAC community of autonomous colleges in India</sub><br>
<sub>MIT + CC BY-NC 4.0 | © 2026 Dr. C.V. Krishnaveni | SKR & SKR GCW(A), Kadapa</sub>
</div>

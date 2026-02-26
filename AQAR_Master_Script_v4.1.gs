/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  AQAR 2024-25 MASTER SCRIPT v4.1 — CSV TEMPLATE EDITION               ║
 * ║  Developer  : Venkata Krishnaveni Chennuru                              ║
 * ║  Role       : Dept. of Computer Science & IQAC Coordinator             ║
 * ║  Institution: SKR & SKR GCW(A), Kadapa, AP 516001                      ║
 * ║  License    : MIT + CC BY-NC 4.0  |  © 2026 Free OER                  ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  WHAT'S NEW IN v4.1:                                                    ║
 * ║  → All pipe-separated questions replaced with CSV file upload          ║
 * ║  → generateCSVTemplates() creates all 6 template CSV files in Drive    ║
 * ║  → HODs download template → fill in Excel/Sheets → upload filled CSV  ║
 * ║  → Standardised format: no more free-text inconsistency               ║
 * ║  → doGet() now also serves CSV template files on request              ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * SETUP ORDER (v4.1):
 *  1. Run generateCSVTemplates()  → creates template CSVs in Drive folder
 *  2. Run createHODForm()         → creates updated HOD form with file upload
 *  3. Run createScholarshipForm() → scholarship form
 *  4. Run createExaminationForm() → examination form
 *  5. Run createAdmissionForm()   → admission form with CSV upload
 *  6. Run setupAll()              → triggers, backup folder
 *  7. Deploy as Web App           → paste URL in website
 */

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════
const CFG = {
  spreadsheetName    : 'AQAR 2024-25 HOD Responses — SKR & SKR GCW(A)',
  scholarshipSheet   : 'AQAR 2024-25 Scholarship Section — SKR & SKR GCW(A)',
  examinationSheet   : 'AQAR 2024-25 Examination Section — SKR & SKR GCW(A)',
  admissionSheet     : 'AQAR 2024-25 Admission Section — SKR & SKR GCW(A)',
  hodFormTitle       : 'AQAR 2024-25 | HOD Department Data — SKR & SKR GCW(A) [v4.1]',
  scholarFormTitle   : 'AQAR 2024-25 | Scholarship Section Data — SKR & SKR GCW(A)',
  examFormTitle      : 'AQAR 2024-25 | Examination Section Data — SKR & SKR GCW(A)',
  admFormTitle       : 'AQAR 2024-25 | Admission Section Data — SKR & SKR GCW(A)',
  templateFolderName : 'AQAR 2024-25 CSV Templates — SKR & SKR GCW(A)',
  iqacEmail          : 'iqac.nirf.gdcw.kdp@gmail.com',
  backupFolderName   : 'AQAR 2024-25 Backups — SKR & SKR GCW(A)',
  deadline           : '31 March 2026',
  institution        : 'SKR & SKR Government College for Women (Autonomous), Kadapa',
};

const DEPARTMENTS = [
  'Computer Science','Mathematics','Physics','Chemistry',
  'Botany','Zoology','English','Telugu','Hindi','Urdu',
  'History','Economics','Political Science','Sociology',
  'Commerce','BA Computer Applications','BCom CA','Biotechnology',
  'Physical Education','Library Science','Psychology',
  'Statistics','Geography','NSS / NCC'
];

// ═══════════════════════════════════════════════════════════
// HOD FORM COLUMN MAP (v4.1)
// ═══════════════════════════════════════════════════════════
const HOD_COL = {
  dept          : 1,
  vac           : 7,
  vac_students  : 8,
  internships   : 9,
  teachers_total: 12,
  phd_teachers  : 13,
  experience    : 14,
  mentors       : 15,
  fellowships   : 17,
  workshops     : 20,
  care_papers   : 21,
  books         : 22,
  citations     : 23,
  h_index       : 24,
  extension_prog: 25,
  ext_students  : 26,
  mous          : 27,
  ict_classrooms: 29,
  computers     : 30,
  career_guid   : 32,
  placed        : 34,
  higher_edu    : 35,
  net_gate      : 36,
  awards        : 37,
  events        : 38,
  fdp_organised : 41,
  fdp_attended  : 42,
};

const SCHOL_COL = {
  govt_schol   : 1,
  ngo_schol    : 2,
  schol_sc     : 3,
  schol_st     : 4,
  schol_obc    : 5,
  schol_amount : 6,
  submitted_by : 7,
};

const EXAM_COL = {
  passed       : 1,
  appeared     : 2,
  days_result  : 3,
  grievances   : 4,
  submitted_by : 5,
};

const ADM_COL = {
  admitted     : 1,
  reserved     : 2,
  adm_sc       : 3,
  adm_st       : 4,
  adm_obc      : 5,
  adm_pwd      : 6,
  adm_women    : 7,
  submitted_by : 8,
};


// ═══════════════════════════════════════════════════════════
// CSV TEMPLATE DEFINITIONS
// All 6 templates with headers, sample row, and instructions
// ═══════════════════════════════════════════════════════════
const CSV_TEMPLATES = {

  fellowships: {
    filename : 'AQAR_Template_Fellowships_3.1.3.csv',
    metric   : '3.1.3',
    title    : 'Teacher Fellowships',
    form     : 'HOD Form',
    instructions: [
      '# AQAR 2024-25 | CSV Template: Teacher Fellowships (Metric 3.1.3)',
      '# Institution: SKR & SKR Government College for Women (Autonomous) Kadapa',
      '# Instructions:',
      '#  1. Do NOT change column headers (Row 5)',
      '#  2. Delete these instruction rows (#) before uploading',
      '#  3. One fellowship per row',
      '#  4. Fellowship_Name: official name e.g. UGC-BSR / DST-INSPIRE / CSIR-JRF',
      '#  5. Teacher_Name: Full name as per service records',
      '#  6. Awarding_Agency: e.g. UGC / DST / CSIR / ICMR / DBT',
      '#  7. Month_Year: format MM/YYYY e.g. 06/2024',
      '#  8. Amount_Lakhs: monthly/annual amount in ₹ Lakhs (enter 0 if not applicable)',
      '# ─────────────────────────────────────────────────────',
    ],
    headers  : ['Fellowship_Name','Teacher_Name','Awarding_Agency','Month_Year','Amount_Lakhs','Remarks'],
    sample   : ['UGC-BSR Research Fellowship','Dr. Example Name','UGC','06/2024','0.25','Post-doctoral fellowship'],
  },

  publications: {
    filename : 'AQAR_Template_Publications_3.4.3.csv',
    metric   : '3.4.3',
    title    : 'CARE Journal Publications',
    form     : 'HOD Form',
    instructions: [
      '# AQAR 2024-25 | CSV Template: CARE Journal Publications (Metric 3.4.3)',
      '# Institution: SKR & SKR Government College for Women (Autonomous) Kadapa',
      '# Instructions:',
      '#  1. Do NOT change column headers (Row 5)',
      '#  2. Delete these instruction rows (#) before uploading',
      '#  3. One paper per row',
      '#  4. Paper_Title: Full title of the paper',
      '#  5. Journal_Name: Full journal name (no abbreviations)',
      '#  6. ISSN: Format XXXX-XXXX e.g. 0975-1234',
      '#  7. Year: 4-digit year e.g. 2024',
      '#  8. Teacher_Name: Name of teacher/author from your department',
      '#  9. Scopus_Indexed: Yes or No',
      '# 10. DOI: e.g. 10.1234/example (enter NA if not available)',
      '# ─────────────────────────────────────────────────────',
    ],
    headers  : ['Paper_Title','Journal_Name','ISSN','Year','Teacher_Name','Scopus_Indexed','DOI'],
    sample   : ['Title of the Research Paper','Journal of Example Science','0975-1234','2024','Dr. Example Name','Yes','10.1234/example'],
  },

  mous: {
    filename : 'AQAR_Template_MoUs_3.7.2.csv',
    metric   : '3.7.2',
    title    : 'Functional MoUs',
    form     : 'HOD Form',
    instructions: [
      '# AQAR 2024-25 | CSV Template: Functional MoUs (Metric 3.7.2)',
      '# Institution: SKR & SKR Government College for Women (Autonomous) Kadapa',
      '# Instructions:',
      '#  1. Do NOT change column headers (Row 5)',
      '#  2. Delete these instruction rows (#) before uploading',
      '#  3. One MoU per row',
      '#  4. Institution_Industry: Full official name of partner',
      '#  5. Nature_of_Activity: e.g. Student Internship / Joint Research / Training',
      '#  6. Students_Benefitted: Number of students benefitted',
      '#  7. MoU_Date: format DD/MM/YYYY',
      '#  8. Status: Active or Completed',
      '#  9. Duration_Years: e.g. 3 (number of years MoU is valid)',
      '# ─────────────────────────────────────────────────────',
    ],
    headers  : ['Institution_Industry','Nature_of_Activity','Students_Benefitted','MoU_Date','Status','Duration_Years'],
    sample   : ['Example Industries Pvt Ltd','Student Internship and Training','45','15/08/2024','Active','3'],
  },

  placements: {
    filename : 'AQAR_Template_Placements_5.2.1.csv',
    metric   : '5.2.1',
    title    : 'Student Placements',
    form     : 'HOD Form',
    instructions: [
      '# AQAR 2024-25 | CSV Template: Student Placements (Metric 5.2.1)',
      '# Institution: SKR & SKR Government College for Women (Autonomous) Kadapa',
      '# Instructions:',
      '#  1. Do NOT change column headers (Row 5)',
      '#  2. Delete these instruction rows (#) before uploading',
      '#  3. One student per row',
      '#  4. Student_Name: Full name as per college records',
      '#  5. Programme: e.g. BSc Computer Science / BCom / BA English',
      '#  6. Company_Name: Full official company name',
      '#  7. Package_LPA: Annual package in Lakhs Per Annum e.g. 3.5',
      '#  8. Month_Year: format MM/YYYY e.g. 01/2025',
      '#  9. Placement_Type: Campus / Off-Campus / Government',
      '# ─────────────────────────────────────────────────────',
    ],
    headers  : ['Student_Name','Programme','Company_Name','Package_LPA','Month_Year','Placement_Type'],
    sample   : ['Student Full Name','BSc Computer Science','Example Company Pvt Ltd','3.5','01/2025','Campus'],
  },

  fdps: {
    filename : 'AQAR_Template_FDPs_6.3.4.csv',
    metric   : '6.3.4',
    title    : 'FDPs & Training Programmes',
    form     : 'HOD Form',
    instructions: [
      '# AQAR 2024-25 | CSV Template: FDPs and Training Programmes (Metric 6.3.4)',
      '# Institution: SKR & SKR Government College for Women (Autonomous) Kadapa',
      '# Instructions:',
      '#  1. Do NOT change column headers (Row 5)',
      '#  2. Delete these instruction rows (#) before uploading',
      '#  3. One FDP/programme per row',
      '#  4. Teacher_Name: Full name of the teacher who attended',
      '#  5. Programme_Name: Full title of the FDP/training programme',
      '#  6. Organising_Body: e.g. UGC-HRDC / CSIR / IIT Madras / State Govt',
      '#  7. Mode: Online / Offline / Hybrid',
      '#  8. Duration_Days: Number of days e.g. 5',
      '#  9. Month_Year: format MM/YYYY e.g. 07/2024',
      '# ─────────────────────────────────────────────────────',
    ],
    headers  : ['Teacher_Name','Programme_Name','Organising_Body','Mode','Duration_Days','Month_Year'],
    sample   : ['Dr. Example Teacher','FDP on Research Methodology','UGC-HRDC Tirupati','Offline','5','07/2024'],
  },

  admission_programmewise: {
    filename : 'AQAR_Template_Admissions_Programmewise_2.1.csv',
    metric   : '2.1.1.1 & 2.1.2',
    title    : 'Programme-wise Admission (Caste-wise)',
    form     : 'Admission Section Form',
    instructions: [
      '# AQAR 2024-25 | CSV Template: Programme-wise Admissions (Metrics 2.1.1.1 & 2.1.2)',
      '# Institution: SKR & SKR Government College for Women (Autonomous) Kadapa',
      '# Instructions:',
      '#  1. Do NOT change column headers (Row 5)',
      '#  2. Delete these instruction rows (#) before uploading',
      '#  3. One programme per row',
      '#  4. Programme_Name: Official programme name e.g. BSc Computer Science',
      '#  5. Sanctioned_Intake: Total seats sanctioned by government',
      '#  6. Students_Admitted: Actual students admitted this year',
      '#  7. SC / ST / OBC_BC / PWD / Women: Number in each category',
      '#  8. All values must be whole numbers (no decimals)',
      '#  9. SC+ST+OBC_BC+PWD should be <= Students_Admitted',
      '# ─────────────────────────────────────────────────────',
    ],
    headers  : ['Programme_Name','Sanctioned_Intake','Students_Admitted','SC','ST','OBC_BC','PWD','Women'],
    sample   : ['BSc Computer Science','60','55','18','4','22','1','55'],
  },

};


// ═══════════════════════════════════════════════════════════
// GENERATE ALL CSV TEMPLATES IN DRIVE
// Run this FIRST before creating forms
// ═══════════════════════════════════════════════════════════
function generateCSVTemplates() {
  const folders = DriveApp.getFoldersByName(CFG.templateFolderName);
  const folder  = folders.hasNext() ? folders.next() : DriveApp.createFolder(CFG.templateFolderName);

  const urls = {};

  Object.entries(CSV_TEMPLATES).forEach(([key, tpl]) => {
    // Build CSV content: instructions + blank line + headers + sample row
    const lines = [
      ...tpl.instructions,
      '',
      tpl.headers.join(','),
      tpl.sample.map(v => '"' + v.replace(/"/g,'""') + '"').join(','),
      // Add 9 more empty rows for data entry
      ...Array(9).fill(tpl.headers.map(() => '""').join(',')),
    ];
    const csv = lines.join('\r\n');

    // Delete existing file with same name if present
    const existing = folder.getFilesByName(tpl.filename);
    while (existing.hasNext()) existing.next().setTrashed(true);

    // Create new file
    const blob = Utilities.newBlob('\uFEFF' + csv, 'text/csv', tpl.filename);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    urls[key] = file.getDownloadUrl();

    Logger.log('✅ Created: ' + tpl.filename);
    Logger.log('   Download URL: ' + file.getDownloadUrl());
    Logger.log('   View URL: ' + file.getUrl());
  });

  Logger.log('');
  Logger.log('═══════════════════════════════════════════════════');
  Logger.log('ALL 6 CSV TEMPLATES CREATED SUCCESSFULLY');
  Logger.log('Folder: ' + folder.getUrl());
  Logger.log('');
  Logger.log('COPY THESE DOWNLOAD URLs INTO THE WEBSITE (index.html):');
  Logger.log('CSV_URLS object in the <script> section');
  Logger.log('');
  Object.entries(urls).forEach(([k, u]) => Logger.log(k + ': ' + u));
  Logger.log('═══════════════════════════════════════════════════');

  // Also store URLs in Script Properties for doGet to serve
  const props = PropertiesService.getScriptProperties();
  props.setProperty('csv_template_urls', JSON.stringify(urls));

  return urls;
}


// ═══════════════════════════════════════════════════════════
// WEB APP — doGet()
// Returns JSON data OR CSV template URLs based on action param
// ═══════════════════════════════════════════════════════════
function doGet(e) {
  try {
    const action = e && e.parameter && e.parameter.action;

    // Return CSV template URLs if requested
    if (action === 'csv_urls') {
      const props = PropertiesService.getScriptProperties();
      const urls  = JSON.parse(props.getProperty('csv_template_urls') || '{}');
      return ContentService
        .createTextOutput(JSON.stringify({ status:'ok', csv_urls: urls }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Default: return merged AQAR totals
    const totals = getMergedTotals();
    return ContentService
      .createTextOutput(JSON.stringify({ status:'ok', data: totals }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status:'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// ═══════════════════════════════════════════════════════════
// MERGED TOTALS (same as v4.0)
// ═══════════════════════════════════════════════════════════
function getMergedTotals() {
  const hodTotals   = getHODTotals();
  const scholTotals = getScholarshipTotals();
  const examTotals  = getExaminationTotals();
  const admTotals   = getAdmissionTotals();

  const merged = Object.assign({}, hodTotals);
  merged.govt_schol      = scholTotals.govt_schol;
  merged.ngo_schol       = scholTotals.ngo_schol;
  merged.schol_sc        = scholTotals.schol_sc;
  merged.schol_st        = scholTotals.schol_st;
  merged.schol_obc       = scholTotals.schol_obc;
  merged.schol_amount    = scholTotals.schol_amount;
  merged.schol_submitted = scholTotals.submitted;
  merged.passed          = examTotals.passed;
  merged.appeared        = examTotals.appeared;
  merged.days_result     = examTotals.days_result;
  merged.grievances      = examTotals.grievances;
  merged.exam_submitted  = examTotals.submitted;
  merged.admitted        = admTotals.admitted;
  merged.reserved        = admTotals.reserved;
  merged.adm_sc          = admTotals.adm_sc;
  merged.adm_st          = admTotals.adm_st;
  merged.adm_obc         = admTotals.adm_obc;
  merged.adm_pwd         = admTotals.adm_pwd;
  merged.adm_women       = admTotals.adm_women;
  merged.adm_submitted   = admTotals.submitted;
  merged.last_updated    = new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});
  return merged;
}

function getHODTotals() {
  const totals = {
    submissions:0, departments:[],
    vac:0, vac_students:0, internships:0,
    teachers_total:0, phd_teachers:0, experience:0, mentors:0,
    fellowships:0, workshops:0, care_papers:0, books:0,
    citations:0, h_index:0, extension_prog:0, ext_students:0, mous:0,
    ict_classrooms:0, computers:0,
    career_guid:0, placed:0, higher_edu:0, net_gate:0, awards:0, events:0,
    fdp_organised:0, fdp_attended:0,
  };
  try {
    const files = DriveApp.getFilesByName(CFG.spreadsheetName);
    if (!files.hasNext()) return totals;
    const data = SpreadsheetApp.open(files.next()).getSheets()[0].getDataRange().getValues();
    if (data.length < 2) return totals;
    const h_indices = [];
    data.slice(1).forEach(row => {
      totals.submissions++;
      const dept = row[HOD_COL.dept] || '';
      if (dept && !totals.departments.includes(dept)) totals.departments.push(dept);
      Object.entries(HOD_COL).forEach(([key, col]) => {
        if (key === 'dept') return;
        const val = parseFloat(row[col]);
        if (isNaN(val) || val < 0) return;
        if (key === 'h_index') { h_indices.push(val); return; }
        if (key in totals) totals[key] += val;
      });
    });
    totals.h_index = h_indices.length ? Math.max(...h_indices) : 0;
  } catch(e) { Logger.log('HOD error: ' + e.message); }
  totals.pending_depts   = DEPARTMENTS.filter(d => !totals.departments.includes(d));
  totals.submitted_count = totals.departments.length;
  totals.pending_count   = totals.pending_depts.length;
  return totals;
}

function getScholarshipTotals() {
  const t = { submitted:false, govt_schol:0, ngo_schol:0, schol_sc:0, schol_st:0, schol_obc:0, schol_amount:0 };
  try {
    const files = DriveApp.getFilesByName(CFG.scholarshipSheet);
    if (!files.hasNext()) return t;
    const data = SpreadsheetApp.open(files.next()).getSheets()[0].getDataRange().getValues();
    if (data.length < 2) return t;
    const last = data[data.length - 1];
    Object.entries(SCHOL_COL).forEach(([key, col]) => {
      if (key === 'submitted_by') { t.submitted = !!last[col]; return; }
      const val = parseFloat(last[col]);
      if (!isNaN(val) && val >= 0) t[key] = val;
    });
    t.submitted = true;
  } catch(e) { Logger.log('Schol error: ' + e.message); }
  return t;
}

function getExaminationTotals() {
  const t = { submitted:false, passed:0, appeared:0, days_result:0, grievances:0 };
  try {
    const files = DriveApp.getFilesByName(CFG.examinationSheet);
    if (!files.hasNext()) return t;
    const data = SpreadsheetApp.open(files.next()).getSheets()[0].getDataRange().getValues();
    if (data.length < 2) return t;
    const last = data[data.length - 1];
    Object.entries(EXAM_COL).forEach(([key, col]) => {
      if (key === 'submitted_by') { t.submitted = !!last[col]; return; }
      const val = parseFloat(last[col]);
      if (!isNaN(val) && val >= 0) t[key] = val;
    });
    t.submitted = true;
  } catch(e) { Logger.log('Exam error: ' + e.message); }
  return t;
}

function getAdmissionTotals() {
  const t = { submitted:false, admitted:0, reserved:0, adm_sc:0, adm_st:0, adm_obc:0, adm_pwd:0, adm_women:0 };
  try {
    const files = DriveApp.getFilesByName(CFG.admissionSheet);
    if (!files.hasNext()) return t;
    const data = SpreadsheetApp.open(files.next()).getSheets()[0].getDataRange().getValues();
    if (data.length < 2) return t;
    const last = data[data.length - 1];
    Object.entries(ADM_COL).forEach(([key, col]) => {
      if (key === 'submitted_by') { t.submitted = !!last[col]; return; }
      const val = parseFloat(last[col]);
      if (!isNaN(val) && val >= 0) t[key] = val;
    });
    t.submitted = true;
  } catch(e) { Logger.log('Adm error: ' + e.message); }
  return t;
}

function getOrCreateSheet(name) {
  const files = DriveApp.getFilesByName(name);
  if (files.hasNext()) return SpreadsheetApp.open(files.next());
  return SpreadsheetApp.create(name);
}


// ═══════════════════════════════════════════════════════════
// CREATE FORMS — v4.1 (pipe text replaced with file upload)
// ═══════════════════════════════════════════════════════════

function createHODForm() {
  const form = FormApp.create(CFG.hodFormTitle);
  form.setDescription(
    'AQAR 2024-25 | HOD Department Data Collection | v4.1\n\n' +
    '📌 IMPORTANT — For questions marked with [📎 Upload CSV]:\n' +
    '   Step 1: Download the CSV template from the IQAC website (Section Forms page)\n' +
    '   Step 2: Open in Microsoft Excel or Google Sheets\n' +
    '   Step 3: Fill your data row by row (one entry per row)\n' +
    '   Step 4: Save and upload the filled CSV here\n\n' +
    'Scholarship data → Scholarship Section | Exam results → Examination Section\n' +
    'Admission/caste data → Admission Section\n' +
    'Deadline: ' + CFG.deadline
  );
  form.setCollectEmail(false);

  // Section 0: Identification
  form.addSectionHeaderItem().setTitle('🏛️ Department Identification');
  const deptItem = form.addListItem().setTitle('Name of Department').setRequired(true);
  deptItem.setChoiceValues(DEPARTMENTS);
  form.addTextItem().setTitle('Name of Head of Department').setRequired(true);
  form.addTextItem().setTitle('HOD Email').setRequired(true);
  form.addTextItem().setTitle('HOD Phone Number').setRequired(true);
  form.addDateItem().setTitle('Date of Submission').setRequired(true);

  // Section 1: Curricular
  form.addSectionHeaderItem().setTitle('📚 Section 1 — Curricular Aspects');
  form.addTextItem().setTitle('1.3.2 — No. of Value-Added Courses offered this year (≥30 contact hours)\n📝 Format: Enter a whole number only. e.g. 5').setRequired(true);
  form.addTextItem().setTitle('1.3.3 — No. of Students enrolled in Value-Added Courses\n📝 Format: Enter a whole number only. e.g. 120').setRequired(true);
  form.addTextItem().setTitle('1.3.4 — No. of Students who completed Internship / Field Work / Project\n📝 Format: Enter a whole number only. e.g. 65').setRequired(true);

  // Section 2: Teaching
  form.addSectionHeaderItem().setTitle('🎓 Section 2 — Teaching, Learning & Evaluation (Teacher Profile)');
  form.addTextItem().setTitle('2.4.1 — No. of Full-time Teachers in your department\n📝 Format: Enter a whole number only. e.g. 4').setRequired(true);
  form.addTextItem().setTitle('2.4.2 — No. of Teachers with PhD / D.M. / DSc\n📝 Format: Enter a whole number only. e.g. 2').setRequired(true);
  form.addTextItem().setTitle('2.4.3 — Total Teaching Experience of ALL teachers combined (in years)\n📝 Format: Add up years of all teachers. e.g. if 4 teachers have 10, 8, 15, 12 years → enter 45').setRequired(true);
  form.addTextItem().setTitle('2.3.3.1 — No. of Student Mentors assigned in your department\n📝 Format: Enter a whole number. e.g. 4').setRequired(true);

  // Section 3: Research
  form.addSectionHeaderItem().setTitle('🔬 Section 3 — Research, Innovations & Extension');

  form.addTextItem().setTitle('3.1.3 — No. of Teachers awarded National / International Fellowships this year\n📝 Format: Enter a whole number. e.g. 2').setRequired(true);
  form.addSectionHeaderItem().setTitle(
    '📎 3.1.3 — Fellowship Details [CSV Upload Required]\n' +
    'Download template: AQAR_Template_Fellowships_3.1.3.csv from IQAC website\n' +
    'Columns: Fellowship_Name | Teacher_Name | Awarding_Agency | Month_Year | Amount_Lakhs | Remarks\n' +
    'Example row: UGC-BSR Research Fellowship | Dr. Example | UGC | 06/2024 | 0.25 | Post-doctoral\n' +
    '⚠️ Do NOT enter free text here. Fill the CSV template and upload below.'
  );
  form.addFileUploadItem()
    .setTitle('3.1.3 — Upload filled Fellowship Details CSV (skip if no fellowships)')
    .setFolderIds([_getOrCreateUploadFolder('Fellowships_3.1.3').getId()])
    .setAllowedFileTypes(['csv', 'xlsx'])
    .setIsMultiple(false);

  form.addTextItem().setTitle('3.2.1 — Research Grants received from Govt/Non-Govt (₹ Lakhs)\n📝 Format: Enter in Lakhs with 2 decimals. e.g. 2.50 or enter 0 if none').setRequired(true);
  form.addTextItem().setTitle('3.3.2 — No. of Workshops on IPR / Research Methodology / Entrepreneurship conducted\n📝 Format: Enter a whole number. e.g. 3').setRequired(true);

  form.addTextItem().setTitle('3.4.3 — No. of Papers published in CARE / UGC-listed Journals\n📝 Format: Enter a whole number. e.g. 4').setRequired(true);
  form.addSectionHeaderItem().setTitle(
    '📎 3.4.3 — Publication Details [CSV Upload Required]\n' +
    'Download template: AQAR_Template_Publications_3.4.3.csv from IQAC website\n' +
    'Columns: Paper_Title | Journal_Name | ISSN | Year | Teacher_Name | Scopus_Indexed | DOI\n' +
    'Example row: Title of Paper | Journal Name | 0975-1234 | 2024 | Dr. Example | Yes | 10.1234/ex\n' +
    '⚠️ Do NOT enter free text here. Fill the CSV template and upload below.'
  );
  form.addFileUploadItem()
    .setTitle('3.4.3 — Upload filled Publications CSV (skip if no publications)')
    .setFolderIds([_getOrCreateUploadFolder('Publications_3.4.3').getId()])
    .setAllowedFileTypes(['csv', 'xlsx'])
    .setIsMultiple(false);

  form.addTextItem().setTitle('3.4.4 — No. of Books and Book Chapters published\n📝 Format: Enter a whole number. e.g. 3').setRequired(true);
  form.addTextItem().setTitle('3.4.5.1 — Total Scopus Citations (cumulative, all teachers)\n📝 Format: Enter a whole number. Check Google Scholar or Scopus profile. e.g. 45').setRequired(true);
  form.addTextItem().setTitle('3.4.6.1 — Highest h-index on Scopus among teachers in your department\n📝 Format: Enter the highest h-index value only (one number). e.g. 5').setRequired(true);
  form.addTextItem().setTitle('3.6.3 — No. of NSS / NCC / Extension / Outreach Programmes conducted\n📝 Format: Enter a whole number. e.g. 8').setRequired(true);
  form.addTextItem().setTitle('3.6.4 — No. of Students who participated in Extension / Outreach Activities\n📝 Format: Enter a whole number. e.g. 70').setRequired(true);

  form.addTextItem().setTitle('3.7.2 — No. of Functional MoUs signed with Institutions / Industries\n📝 Format: Enter only ACTIVE MoUs (not expired). Whole number. e.g. 2').setRequired(true);
  form.addSectionHeaderItem().setTitle(
    '📎 3.7.2 — MoU Details [CSV Upload Required]\n' +
    'Download template: AQAR_Template_MoUs_3.7.2.csv from IQAC website\n' +
    'Columns: Institution_Industry | Nature_of_Activity | Students_Benefitted | MoU_Date | Status | Duration_Years\n' +
    'Example row: Example Industries | Student Internship | 45 | 15/08/2024 | Active | 3\n' +
    '⚠️ Do NOT enter free text here. Fill the CSV template and upload below.'
  );
  form.addFileUploadItem()
    .setTitle('3.7.2 — Upload filled MoU Details CSV (skip if no MoUs)')
    .setFolderIds([_getOrCreateUploadFolder('MoUs_3.7.2').getId()])
    .setAllowedFileTypes(['csv', 'xlsx'])
    .setIsMultiple(false);

  // Section 4: Infrastructure
  form.addSectionHeaderItem().setTitle('🏫 Section 4 — Infrastructure & Learning Resources');
  form.addTextItem().setTitle('4.1.3 — No. of ICT-enabled / Smart Classrooms in your department\n📝 Format: Enter a whole number. Count only classrooms with projector/smart board. e.g. 2').setRequired(true);
  form.addTextItem().setTitle('4.3.2 — No. of Computers available for department use (including lab)\n📝 Format: Enter a whole number. e.g. 25').setRequired(true);

  // Section 5: Student Support
  form.addSectionHeaderItem().setTitle('🎯 Section 5 — Student Support & Progression');
  form.addSectionHeaderItem().setTitle('📌 Note: Scholarship data is collected separately by the Scholarship Section. Do NOT enter scholarship numbers here.');

  form.addTextItem().setTitle('5.1.4 — No. of Students who attended Career / Competitive Exam Guidance programmes\n📝 Format: Enter a whole number. Count unique students (not sessions). e.g. 50').setRequired(true);

  form.addTextItem().setTitle('5.2.1 — No. of Outgoing Students Placed (Jobs) this year\n📝 Format: Enter a whole number. Count only confirmed placements. e.g. 12').setRequired(true);
  form.addSectionHeaderItem().setTitle(
    '📎 5.2.1 — Placement Details [CSV Upload Required]\n' +
    'Download template: AQAR_Template_Placements_5.2.1.csv from IQAC website\n' +
    'Columns: Student_Name | Programme | Company_Name | Package_LPA | Month_Year | Placement_Type\n' +
    'Example row: Student Name | BSc Computer Science | Example Company | 3.5 | 01/2025 | Campus\n' +
    '⚠️ Do NOT enter free text here. Fill the CSV template and upload below.'
  );
  form.addFileUploadItem()
    .setTitle('5.2.1 — Upload filled Placement Details CSV (skip if no placements)')
    .setFolderIds([_getOrCreateUploadFolder('Placements_5.2.1').getId()])
    .setAllowedFileTypes(['csv', 'xlsx'])
    .setIsMultiple(false);

  form.addTextItem().setTitle('5.2.2 — No. of Students who joined Higher Education (PG / PhD) this year\n📝 Format: Enter a whole number. e.g. 8').setRequired(true);
  form.addTextItem().setTitle('5.2.3.1 — No. of Students qualified in NET / GATE / State Level Exams\n📝 Format: Enter a whole number. e.g. 0').setRequired(true);
  form.addTextItem().setTitle('5.3.1 — No. of Awards in Sports / Cultural at inter-university level and above\n📝 Format: Enter a whole number. Include individual + team awards. e.g. 3').setRequired(true);
  form.addTextItem().setTitle('5.3.3 — No. of Sports / Cultural Events organised by the department\n📝 Format: Enter a whole number. e.g. 4').setRequired(true);

  // Section 6: Governance
  form.addSectionHeaderItem().setTitle('⚙️ Section 6 — Governance (FDP & Training)');
  form.addTextItem().setTitle('6.3.3 — No. of Professional Development / Training Programmes organised by your department\n📝 Format: Enter a whole number. Include FDPs, workshops, seminars organised. e.g. 2').setRequired(true);
  form.addTextItem().setTitle('6.3.4 — No. of Teachers who attended FDPs / Training Programmes this year\n📝 Format: Enter a whole number (count of teachers, not number of programmes). e.g. 4').setRequired(true);
  form.addSectionHeaderItem().setTitle(
    '📎 6.3.4 — FDP Details [CSV Upload Required]\n' +
    'Download template: AQAR_Template_FDPs_6.3.4.csv from IQAC website\n' +
    'Columns: Teacher_Name | Programme_Name | Organising_Body | Mode | Duration_Days | Month_Year\n' +
    'Example row: Dr. Example | FDP on Research Methods | UGC-HRDC | Offline | 5 | 07/2024\n' +
    '⚠️ Do NOT enter free text here. Fill the CSV template and upload below.'
  );
  form.addFileUploadItem()
    .setTitle('6.3.4 — Upload filled FDP Details CSV (skip if no FDPs attended)')
    .setFolderIds([_getOrCreateUploadFolder('FDPs_6.3.4').getId()])
    .setAllowedFileTypes(['csv', 'xlsx'])
    .setIsMultiple(false);

  const ss = getOrCreateSheet(CFG.spreadsheetName);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('✅ HOD Form v4.1 created: ' + form.getPublishedUrl());
  Logger.log('📎 HOD Form short URL: ' + form.shortenFormUrl(form.getPublishedUrl()));
}


// ── Scholarship Section Form (unchanged from v4.0) ──
function createScholarshipForm() {
  const form = FormApp.create(CFG.scholarFormTitle);
  form.setDescription(
    'This form is to be filled by the SCHOLARSHIP SECTION IN-CHARGE only.\n' +
    'Enter the total scholarship data for the entire college for 2024-25.\n' +
    'Fill once. Deadline: ' + CFG.deadline + '\n' +
    'Contact: Dr. C.V. Krishnaveni | IQAC | ' + CFG.iqacEmail
  );

  form.addSectionHeaderItem().setTitle('📚 Scholarship Data 2024-25 — Scholarship Section');
  form.addTextItem().setTitle('Name of Scholarship In-charge Officer').setRequired(true);
  form.addTextItem().setTitle('Designation').setRequired(true);
  form.addDateItem().setTitle('Date of Submission').setRequired(true);

  form.addSectionHeaderItem().setTitle('Metric 5.1.1 — Government Scholarships');
  form.addTextItem().setTitle('5.1.1 — Total No. of Students receiving Government Scholarships\n📝 Format: Whole number. All categories combined. e.g. 1363').setRequired(true);
  form.addTextItem().setTitle('SC — No. of SC students receiving Govt Scholarships\n📝 Format: Whole number. e.g. 450').setRequired(true);
  form.addTextItem().setTitle('ST — No. of ST students receiving Govt Scholarships\n📝 Format: Whole number. e.g. 120').setRequired(true);
  form.addTextItem().setTitle('OBC/BC — No. of OBC/BC students receiving Govt Scholarships\n📝 Format: Whole number. e.g. 620').setRequired(true);

  form.addSectionHeaderItem().setTitle('Metric 5.1.2 — NGO / Institutional Scholarships');
  form.addTextItem().setTitle('5.1.2 — Total No. of Students receiving NGO / Institutional Scholarships\n📝 Format: Whole number. Enter 0 if none.').setRequired(true);
  form.addTextItem().setTitle('Total scholarship amount disbursed this year (₹ Lakhs)\n📝 Format: In Lakhs with 2 decimals. e.g. 45.50 or 0 if not available').setRequired(true);
  form.addParagraphTextItem().setTitle('Remarks / Additional scholarship information (optional)');

  const ss = getOrCreateSheet(CFG.scholarshipSheet);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  Logger.log('✅ Scholarship Form created: ' + form.getPublishedUrl());
}


// ── Examination Section Form (unchanged from v4.0) ──
function createExaminationForm() {
  const form = FormApp.create(CFG.examFormTitle);
  form.setDescription(
    'This form is to be filled by the EXAMINATION SECTION IN-CHARGE only.\n' +
    'Enter college-level examination results data for 2024-25.\n' +
    'Fill once. Deadline: ' + CFG.deadline + '\n' +
    'Contact: Dr. C.V. Krishnaveni | IQAC | ' + CFG.iqacEmail
  );

  form.addSectionHeaderItem().setTitle('📝 Examination Data 2024-25 — Examination Section');
  form.addTextItem().setTitle('Name of Examination Section In-charge').setRequired(true);
  form.addTextItem().setTitle('Designation').setRequired(true);
  form.addDateItem().setTitle('Date of Submission').setRequired(true);

  form.addSectionHeaderItem().setTitle('Metric 2.5 — Examination Process');
  form.addTextItem().setTitle('2.5.1 — No. of Days from last exam to declaration of results\n📝 Format: Whole number. Count calendar days. e.g. 22').setRequired(true);
  form.addTextItem().setTitle('2.5.2 — No. of Student complaints / grievances against evaluation this year\n📝 Format: Whole number. Enter 0 if none. e.g. 95').setRequired(true);

  form.addSectionHeaderItem().setTitle('Metric 2.6 — Student Pass Percentage');
  form.addTextItem().setTitle('2.6.3.1 (Numerator) — No. of Final Year Students who PASSED in year-end exams\n📝 Format: Whole number. Count all final year students who passed. e.g. 632').setRequired(true);
  form.addTextItem().setTitle('2.6.3.1 (Denominator) — No. of Final Year Students who APPEARED in year-end exams\n📝 Format: Whole number. Should be >= Passed count. e.g. 600').setRequired(true);
  form.addTextItem().setTitle('EP 2.3 — Total No. of Students (ALL years) who appeared in examinations\n📝 Format: Whole number. All years, all programmes. e.g. 1792').setRequired(true);
  form.addTextItem().setTitle('2.7.1 — Student Satisfaction Survey URL\n📝 Format: Full URL starting with https:// (upload PDF to college website first)');
  form.addParagraphTextItem().setTitle('Remarks / Exam section notes for AQAR (optional)');

  const ss = getOrCreateSheet(CFG.examinationSheet);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  Logger.log('✅ Examination Form created: ' + form.getPublishedUrl());
}


// ── Admission Section Form (with CSV upload for programme-wise) ──
function createAdmissionForm() {
  const form = FormApp.create(CFG.admFormTitle);
  form.setDescription(
    'This form is to be filled by the ADMISSION SECTION IN-CHARGE only.\n' +
    'Enter total admission figures including caste-wise data for 2024-25.\n\n' +
    '📌 For programme-wise data: Download the CSV template from the IQAC website,\n' +
    'fill it in Excel/Sheets, and upload here.\n\n' +
    'Fill once. Deadline: ' + CFG.deadline + '\n' +
    'Contact: Dr. C.V. Krishnaveni | IQAC | ' + CFG.iqacEmail
  );

  form.addSectionHeaderItem().setTitle('🎓 Admission Data 2024-25 — Admission Section');
  form.addTextItem().setTitle('Name of Admission In-charge Officer').setRequired(true);
  form.addTextItem().setTitle('Designation').setRequired(true);
  form.addDateItem().setTitle('Date of Submission').setRequired(true);

  form.addSectionHeaderItem().setTitle('Metric 2.1 — Overall College Admissions');
  form.addTextItem().setTitle('2.1.1.1 — Total No. of Students ADMITTED this academic year (all programmes)\n📝 Format: Whole number. e.g. 592').setRequired(true);
  form.addTextItem().setTitle('2.1.2 — No. of Reserved Category Seats FILLED (SC+ST+OBC+PWD combined)\n📝 Format: Whole number. e.g. 469').setRequired(true);

  form.addSectionHeaderItem().setTitle('Category-wise Caste Breakdown (College Total)');
  form.addTextItem().setTitle('SC — Total No. of SC students admitted across all programmes\n📝 Format: Whole number. e.g. 185').setRequired(true);
  form.addTextItem().setTitle('ST — Total No. of ST students admitted\n📝 Format: Whole number. e.g. 48').setRequired(true);
  form.addTextItem().setTitle('OBC/BC — Total No. of OBC/BC students admitted\n📝 Format: Whole number. e.g. 236').setRequired(true);
  form.addTextItem().setTitle('PWD/Divyang — Total No. of PWD/Divyang students admitted\n📝 Format: Whole number. Enter 0 if none.').setRequired(true);
  form.addTextItem().setTitle('Women — Total No. of Women admitted (should equal Students Admitted for this college)\n📝 Format: Whole number. e.g. 592').setRequired(true);

  form.addSectionHeaderItem().setTitle(
    '📎 Programme-wise Admission Data [CSV Upload Required]\n' +
    'Download template: AQAR_Template_Admissions_Programmewise_2.1.csv from IQAC website\n' +
    'Columns: Programme_Name | Sanctioned_Intake | Students_Admitted | SC | ST | OBC_BC | PWD | Women\n' +
    'Example row: BSc Computer Science | 60 | 55 | 18 | 4 | 22 | 1 | 55\n' +
    '⚠️ Fill one row per programme. Do NOT merge cells or add totals row.'
  );
  form.addFileUploadItem()
    .setTitle('Upload filled Programme-wise Admission CSV')
    .setFolderIds([_getOrCreateUploadFolder('Admissions_Programmewise').getId()])
    .setAllowedFileTypes(['csv', 'xlsx'])
    .setIsMultiple(false)
    .setRequired(true);

  form.addTextItem().setTitle('AISHE Submission Date\n📝 Format: DD/MM/YYYY e.g. 17/02/2025');
  form.addParagraphTextItem().setTitle('Remarks / Additional admission notes for AQAR (optional)');

  const ss = getOrCreateSheet(CFG.admissionSheet);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  Logger.log('✅ Admission Form created: ' + form.getPublishedUrl());
}


// ── Helper: Get or create upload folder for file responses ──
function _getOrCreateUploadFolder(subName) {
  const parentName = 'AQAR 2024-25 HOD Uploads — SKR & SKR GCW(A)';
  const parents = DriveApp.getFoldersByName(parentName);
  const parent  = parents.hasNext() ? parents.next() : DriveApp.createFolder(parentName);
  const subs    = parent.getFoldersByName(subName);
  return subs.hasNext() ? subs.next() : parent.createFolder(subName);
}


// ═══════════════════════════════════════════════════════════
// EMAIL NOTIFICATIONS
// ═══════════════════════════════════════════════════════════
function onHODSubmit(e) {
  try {
    const responses = e.response.getItemResponses();
    let dept = 'Unknown', hod = 'Unknown';
    responses.forEach(r => {
      const q = r.getItem().getTitle();
      if (q.includes('Name of Department'))         dept = r.getResponse();
      if (q.includes('Name of Head of Department')) hod  = r.getResponse();
    });
    const totals = getHODTotals();
    const pct = Math.round(totals.submitted_count / DEPARTMENTS.length * 100);
    GmailApp.sendEmail(CFG.iqacEmail,
      '✅ AQAR HOD Submission: ' + dept + ' — ' + pct + '% Complete',
      'Department: ' + dept + '\nHOD: ' + hod +
      '\nTime: ' + new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}) +
      '\n\nProgress: ' + totals.submitted_count + '/' + DEPARTMENTS.length + ' (' + pct + '%)' +
      '\nPending: ' + totals.pending_depts.join(', ') +
      '\n\n— AQAR 2024-25 Auto Alert | SKR & SKR GCW(A)'
    );
  } catch(err) { Logger.log('HOD email error: ' + err.message); }
}

function onScholarshipSubmit(e) {
  try {
    GmailApp.sendEmail(CFG.iqacEmail,'📚 AQAR Scholarship Data Submitted',
      'Scholarship Section submitted AQAR 2024-25 data.\nTime: ' +
      new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}) +
      '\n\n— AQAR 2024-25 Auto Alert');
  } catch(err) { Logger.log('Scholarship email error: ' + err.message); }
}

function onExamSubmit(e) {
  try {
    GmailApp.sendEmail(CFG.iqacEmail,'📝 AQAR Examination Data Submitted',
      'Examination Section submitted AQAR 2024-25 data.\nTime: ' +
      new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}) +
      '\n\n— AQAR 2024-25 Auto Alert');
  } catch(err) { Logger.log('Exam email error: ' + err.message); }
}

function onAdmissionSubmit(e) {
  try {
    GmailApp.sendEmail(CFG.iqacEmail,'🎓 AQAR Admission Data Submitted',
      'Admission Section submitted AQAR 2024-25 data.\nTime: ' +
      new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}) +
      '\n\n— AQAR 2024-25 Auto Alert');
  } catch(err) { Logger.log('Admission email error: ' + err.message); }
}


// ═══════════════════════════════════════════════════════════
// SETUP ALL
// ═══════════════════════════════════════════════════════════
function setupAll() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  _addFormTrigger(CFG.hodFormTitle,     'onHODSubmit');
  _addFormTrigger(CFG.scholarFormTitle, 'onScholarshipSubmit');
  _addFormTrigger(CFG.examFormTitle,    'onExamSubmit');
  _addFormTrigger(CFG.admFormTitle,     'onAdmissionSubmit');

  ScriptApp.newTrigger('backupAQARData').timeBased().atHour(0).everyDays(1).inTimezone('Asia/Kolkata').create();
  ScriptApp.newTrigger('consolidate').timeBased().atHour(6).everyDays(1).inTimezone('Asia/Kolkata').create();

  const folders = DriveApp.getFoldersByName(CFG.backupFolderName);
  if (!folders.hasNext()) DriveApp.createFolder(CFG.backupFolderName);

  consolidate();

  Logger.log('════════════════════════════════════════════════');
  Logger.log('SETUP COMPLETE — v4.1');
  Logger.log('Next: Deploy as Web App (Anyone access)');
  Logger.log('════════════════════════════════════════════════');
}

function _addFormTrigger(formTitle, handlerFn) {
  try {
    const files = DriveApp.getFilesByName(formTitle);
    if (!files.hasNext()) { Logger.log('⚠️ Form not found: ' + formTitle); return; }
    const form = FormApp.openById(files.next().getId());
    ScriptApp.newTrigger(handlerFn).forForm(form).onFormSubmit().create();
    Logger.log('✅ Trigger: ' + handlerFn + ' → ' + formTitle);
  } catch(e) { Logger.log('Trigger error: ' + e.message); }
}


// ═══════════════════════════════════════════════════════════
// CONSOLIDATION
// ═══════════════════════════════════════════════════════════
function consolidate() {
  try {
    const merged = getMergedTotals();
    const ss     = getOrCreateSheet(CFG.spreadsheetName);
    const stamp  = new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});

    let summary = ss.getSheetByName('📊 IQAC Summary v4.1');
    if (!summary) summary = ss.insertSheet('📊 IQAC Summary v4.1');
    summary.clearContents(); summary.clearFormats();

    summary.getRange('A1').setValue('AQAR 2024-25 — Consolidated Summary (v4.1 CSV Edition)')
      .setFontSize(14).setFontWeight('bold').setFontColor('#1a6b5a');
    summary.getRange('A2').setValue(CFG.institution + ' | Updated: ' + stamp)
      .setFontStyle('italic').setFontColor('#7a7060');

    const pct = Math.round(merged.submitted_count / DEPARTMENTS.length * 100);
    summary.getRange('A4').setValue('HOD Submissions: ' + merged.submitted_count + '/' + DEPARTMENTS.length + ' (' + pct + '%)')
      .setFontWeight('bold').setBackground(pct===100?'#e8f7ee':'#fdf3e3');
    summary.getRange('A5').setValue(
      'Scholarship: ' + (merged.schol_submitted?'✅':'⏳') + ' | ' +
      'Examination: ' + (merged.exam_submitted?'✅':'⏳') + ' | ' +
      'Admission: '   + (merged.adm_submitted?'✅':'⏳')
    ).setFontWeight('bold');

    const rows = [
      ['','CRITERION','CODE','METRIC','TOTAL 2024-25','SOURCE','PREV 2023-24'],
      ['C1','Curricular','1.3.2','Value-Added Courses',merged.vac,'HOD Form',22],
      ['C1','Curricular','1.3.3','Students in VACs',merged.vac_students,'HOD Form',740],
      ['C1','Curricular','1.3.4','Students in Internships',merged.internships,'HOD Form',1689],
      ['C2','Teaching','2.1.1.1','Students Admitted',merged.admitted,'Admission Section',592],
      ['C2','Teaching','2.1.2','Reserved Seats Filled',merged.reserved,'Admission Section',469],
      ['C2','Teaching','2.4.1','Full-time Teachers',merged.teachers_total,'HOD Form',59],
      ['C2','Teaching','2.4.2','Teachers with PhD',merged.phd_teachers,'HOD Form',23],
      ['C2','Teaching','2.4.3','Teaching Experience (yrs)',merged.experience,'HOD Form',344],
      ['C2','Teaching','2.5.1','Days — Exam to Result',merged.days_result,'Examination Section',22],
      ['C2','Teaching','2.5.2','Student Grievances (Eval)',merged.grievances,'Examination Section',95],
      ['C2','Teaching','2.6.3.1 N','Final Year Passed',merged.passed,'Examination Section',632],
      ['C2','Teaching','2.6.3.1 D','Final Year Appeared',merged.appeared,'Examination Section',600],
      ['C3','Research','3.1.3','Teacher Fellowships',merged.fellowships,'HOD Form + CSV',4],
      ['C3','Research','3.3.2','IPR/Research Workshops',merged.workshops,'HOD Form',7],
      ['C3','Research','3.4.3','CARE Papers',merged.care_papers,'HOD Form + CSV',9],
      ['C3','Research','3.4.4','Books & Chapters',merged.books,'HOD Form',24],
      ['C3','Research','3.4.5.1','Scopus Citations',merged.citations,'HOD Form',40],
      ['C3','Research','3.4.6.1','h-index (max)',merged.h_index,'HOD Form',5],
      ['C3','Research','3.6.3','Extension Programmes',merged.extension_prog,'HOD Form',61],
      ['C3','Research','3.7.2','MoUs',merged.mous,'HOD Form + CSV',8],
      ['C4','Infrastructure','4.1.3','ICT Classrooms',merged.ict_classrooms,'HOD Form',13],
      ['C4','Infrastructure','4.3.2','Computers',merged.computers,'HOD Form',175],
      ['C5','Student Support','5.1.1','Govt Scholarships',merged.govt_schol,'Scholarship Section',1363],
      ['C5','Student Support','5.1.2','NGO Scholarships',merged.ngo_schol,'Scholarship Section',0],
      ['C5','Student Support','5.1.4','Career Guidance',merged.career_guid,'HOD Form',500],
      ['C5','Student Support','5.2.1','Students Placed',merged.placed,'HOD Form + CSV',169],
      ['C5','Student Support','5.2.2','Higher Education',merged.higher_edu,'HOD Form',118],
      ['C5','Student Support','5.2.3.1','NET/GATE Qualified',merged.net_gate,'HOD Form',0],
      ['C5','Student Support','5.3.1','Awards',merged.awards,'HOD Form',21],
      ['C5','Student Support','5.3.3','Events',merged.events,'HOD Form',33],
      ['C6','Governance','6.3.3','FDPs Organised',merged.fdp_organised,'HOD Form',5],
      ['C6','Governance','6.3.4','Teachers in FDPs',merged.fdp_attended,'HOD Form + CSV',109],
    ];

    const startRow = 7;
    rows.forEach((row, i) => {
      const r = summary.getRange(startRow+i, 1, 1, row.length);
      r.setValues([row]);
      if (i===0) r.setBackground('#1a6b5a').setFontColor('#fff').setFontWeight('bold');
      else r.setBackground(i%2===0?'#f2faf7':'#fff');
    });
    summary.autoResizeColumns(1, 7);
    Logger.log('✅ Consolidation complete — v4.1');
  } catch(e) { Logger.log('Consolidation error: ' + e.message); }
}


// ═══════════════════════════════════════════════════════════
// BACKUP
// ═══════════════════════════════════════════════════════════
function backupAQARData() {
  try {
    const folder = _getBackupFolder();
    const stamp  = Utilities.formatDate(new Date(),'Asia/Kolkata','yyyy-MM-dd_HH-mm');
    const ss     = getOrCreateSheet(CFG.spreadsheetName);
    DriveApp.getFileById(ss.getId()).makeCopy('AQAR_HOD_Backup_'+stamp, folder);
    const merged = getMergedTotals();
    GmailApp.sendEmail(CFG.iqacEmail,'💾 AQAR Backup — '+stamp,
      'Backup at: '+stamp+'\nHOD: '+merged.submitted_count+'/'+DEPARTMENTS.length+
      '\nScholarship: '+(merged.schol_submitted?'✅':'⏳')+
      '\nExamination: '+(merged.exam_submitted?'✅':'⏳')+
      '\nAdmission: '  +(merged.adm_submitted?'✅':'⏳'));
    Logger.log('Backup complete: '+stamp);
  } catch(e) {
    Logger.log('Backup error: '+e.message);
    GmailApp.sendEmail(CFG.iqacEmail,'⚠️ AQAR Backup Failed','Error: '+e.message);
  }
}

function _getBackupFolder() {
  const folders = DriveApp.getFoldersByName(CFG.backupFolderName);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(CFG.backupFolderName);
}


// ═══════════════════════════════════════════════════════════
// REMINDERS
// ═══════════════════════════════════════════════════════════
function sendHODReminders() {
  const emailMap = {
    'Computer Science':'','Mathematics':'','Physics':'','Chemistry':'',
    'Botany':'','Zoology':'','English':'','Telugu':'','Hindi':'','Urdu':'',
    'History':'','Economics':'','Political Science':'','Sociology':'',
    'Commerce':'','BA Computer Applications':'','BCom CA':'','Biotechnology':'',
    'Physical Education':'','Library Science':'','Psychology':'',
    'Statistics':'','Geography':'','NSS / NCC':''
  };
  const hodTotals = getHODTotals();
  let sent = 0;
  hodTotals.pending_depts.forEach(dept => {
    if (!emailMap[dept]) return;
    GmailApp.sendEmail(emailMap[dept],
      '⏰ REMINDER: AQAR 2024-25 HOD Data Pending — ' + dept,
      'Dear HOD,\n\nPlease submit AQAR 2024-25 data for ' + dept + '.\n\n' +
      'IMPORTANT (v4.1): For detailed data (Publications, Placements, FDPs, MoUs, Fellowships),\n' +
      'download CSV templates from the IQAC website, fill them and upload.\n\n' +
      'Deadline: ' + CFG.deadline + '\n\n' +
      'Contact: Dr. C.V. Krishnaveni | 9490519982 | ' + CFG.iqacEmail
    );
    sent++;
  });
  Logger.log('HOD reminders sent: ' + sent);
}

function generateSummaryReport() {
  const merged = getMergedTotals();
  const stamp  = new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});
  Logger.log('══════════════════════════════════════════');
  Logger.log('AQAR 2024-25 STATUS REPORT v4.1 | ' + stamp);
  Logger.log('Scholarship: '+(merged.schol_submitted?'✅':'⏳')+
             ' | Exam: '+(merged.exam_submitted?'✅':'⏳')+
             ' | Admission: '+(merged.adm_submitted?'✅':'⏳'));
  Logger.log('HOD: '+merged.submitted_count+'/'+DEPARTMENTS.length+' departments');
  DEPARTMENTS.forEach(d => Logger.log((merged.departments.includes(d)?'✅ ':'⏳ ')+d));
  Logger.log('══════════════════════════════════════════');
}

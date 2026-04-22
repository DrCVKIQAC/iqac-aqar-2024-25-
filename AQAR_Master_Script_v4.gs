/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  AQAR 2024-25 MASTER SCRIPT v4.0 — MULTI-SECTION EDITION              ║
 * ║  Developer  : Venkata Krishnaveni Chennuru                              ║
 * ║  Role       : Dept. of Computer Science & IQAC Coordinator             ║
 * ║  Institution: SKR & SKR GCW(A), Kadapa, AP 516001                      ║
 * ║  License    : MIT + CC BY-NC 4.0  |  © 2026 Free OER                  ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  WHAT'S NEW IN v4.0:                                                    ║
 * ║  → HOD Form: Scholarship, Exam, Admission questions REMOVED            ║
 * ║  → New: Scholarship Section Form  (for Scholarship Office)             ║
 * ║  → New: Examination Section Form  (for Examination Section)            ║
 * ║  → New: Admission Section Form    (for Admission Office)               ║
 * ║  → doGet() now merges all 4 sources into one unified response          ║
 * ║  → Website syncs all 4 forms in one click                              ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  SETUP ORDER:                                                            ║
 * ║  1. Run createHODForm()          → creates trimmed HOD form            ║
 * ║  2. Run createScholarshipForm()  → creates scholarship form            ║
 * ║  3. Run createExaminationForm()  → creates examination form            ║
 * ║  4. Run createAdmissionForm()    → creates admission form              ║
 * ║  5. Run setupAll()               → wires triggers, creates sheets      ║
 * ║  6. Deploy as Web App            → paste URL into website              ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════
const CFG = {
  spreadsheetName    : 'AQAR 2024-25 HOD Responses — SKR & SKR GCW(A)',
  scholarshipSheet   : 'AQAR 2024-25 Scholarship Section — SKR & SKR GCW(A)',
  examinationSheet   : 'AQAR 2024-25 Examination Section — SKR & SKR GCW(A)',
  admissionSheet     : 'AQAR 2024-25 Admission Section — SKR & SKR GCW(A)',
  hodFormTitle       : 'AQAR 2024-25 | HOD Department Data — SKR & SKR GCW(A) [v4]',
  scholarFormTitle   : 'AQAR 2024-25 | Scholarship Section Data — SKR & SKR GCW(A)',
  examFormTitle      : 'AQAR 2024-25 | Examination Section Data — SKR & SKR GCW(A)',
  admFormTitle       : 'AQAR 2024-25 | Admission Section Data — SKR & SKR GCW(A)',
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
// HOD FORM COLUMN MAP (v4 — Scholarship/Exam/Admission removed)
// ═══════════════════════════════════════════════════════════
const HOD_COL = {
  dept          : 1,   // Name of Department
  // Curricular
  vac           : 7,   // 1.3.2 Value-Added Courses
  vac_students  : 8,   // 1.3.3 Students in VACs
  internships   : 9,   // 1.3.4 Internships
  // Teaching — teacher profile only (admission data moved to Admission Section)
  teachers_total: 12,  // 2.4.1 Full-time teachers
  phd_teachers  : 13,  // 2.4.2 PhD holders
  experience    : 14,  // 2.4.3 Total experience
  mentors       : 15,  // 2.3.3.1 Mentors
  // Research
  fellowships   : 17,  // 3.1.3
  workshops     : 20,  // 3.3.2
  care_papers   : 21,  // 3.4.3
  books         : 22,  // 3.4.4
  citations     : 23,  // 3.4.5.1
  h_index       : 24,  // 3.4.6.1
  extension_prog: 25,  // 3.6.3
  ext_students  : 26,  // 3.6.4
  mous          : 27,  // 3.7.2
  // Infrastructure
  ict_classrooms: 29,  // 4.1.3
  computers     : 30,  // 4.3 dept computers
  // Student Support (placement + career guidance only — scholarships moved to Scholarship Section)
  career_guid   : 32,  // 5.1.4
  placed        : 34,  // 5.2.1
  higher_edu    : 35,  // 5.2.2
  net_gate      : 36,  // 5.2.3.1
  awards        : 37,  // 5.3.1
  events        : 38,  // 5.3.3
  // Governance
  fdp_organised : 41,  // 6.3.3
  fdp_attended  : 42,  // 6.3.4
};

// ═══════════════════════════════════════════════════════════
// SCHOLARSHIP SECTION COLUMN MAP
// ═══════════════════════════════════════════════════════════
const SCHOL_COL = {
  govt_schol     : 1,  // 5.1.1 Students with Govt scholarships
  ngo_schol      : 2,  // 5.1.2 Students with NGO/Institutional scholarships
  schol_sc       : 3,  // SC category scholarship count
  schol_st       : 4,  // ST category scholarship count
  schol_obc      : 5,  // OBC category scholarship count
  schol_amount   : 6,  // Total scholarship amount disbursed (₹ Lakhs)
  submitted_by   : 7,  // Name of officer who submitted
};

// ═══════════════════════════════════════════════════════════
// EXAMINATION SECTION COLUMN MAP
// ═══════════════════════════════════════════════════════════
const EXAM_COL = {
  passed         : 1,  // 2.6.3.1 Final year students passed
  appeared       : 2,  // 2.6.3.1 Final year students appeared
  days_result    : 3,  // 2.5.1 Days from last exam to result
  grievances     : 4,  // 2.5.2 Student grievances against evaluation
  submitted_by   : 5,  // Name of officer who submitted
};

// ═══════════════════════════════════════════════════════════
// ADMISSION SECTION COLUMN MAP
// ═══════════════════════════════════════════════════════════
const ADM_COL = {
  admitted       : 1,  // 2.1.1.1 Total students admitted
  reserved       : 2,  // 2.1.2 Reserved category seats filled
  adm_sc         : 3,  // SC admissions
  adm_st         : 4,  // ST admissions
  adm_obc        : 5,  // OBC admissions
  adm_pwd        : 6,  // PWD/Divyang admissions
  adm_women      : 7,  // Women (total admitted)
  submitted_by   : 8,  // Name of officer who submitted
};


// ═══════════════════════════════════════════════════════════
// WEB APP — doGet() : Merges HOD + all section forms
// Returns unified JSON for the IQAC Data Collector website
// ═══════════════════════════════════════════════════════════
function doGet(e) {
  try {
    const totals = getMergedTotals();
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', data: totals }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Main merge function: HOD + Scholarship + Exam + Admission ──
function getMergedTotals() {
  const hodTotals   = getHODTotals();
  const scholTotals = getScholarshipTotals();
  const examTotals  = getExaminationTotals();
  const admTotals   = getAdmissionTotals();

  // Merge all into one unified object
  const merged = Object.assign({}, hodTotals);

  // Override with dedicated section data (more authoritative)
  merged.govt_schol   = scholTotals.govt_schol;
  merged.ngo_schol    = scholTotals.ngo_schol;
  merged.schol_sc     = scholTotals.schol_sc;
  merged.schol_st     = scholTotals.schol_st;
  merged.schol_obc    = scholTotals.schol_obc;
  merged.schol_amount = scholTotals.schol_amount;
  merged.schol_submitted = scholTotals.submitted;

  merged.passed       = examTotals.passed;
  merged.appeared     = examTotals.appeared;
  merged.days_result  = examTotals.days_result;
  merged.grievances   = examTotals.grievances;
  merged.exam_submitted = examTotals.submitted;

  merged.admitted     = admTotals.admitted;
  merged.reserved     = admTotals.reserved;
  merged.adm_sc       = admTotals.adm_sc;
  merged.adm_st       = admTotals.adm_st;
  merged.adm_obc      = admTotals.adm_obc;
  merged.adm_pwd      = admTotals.adm_pwd;
  merged.adm_women    = admTotals.adm_women;
  merged.adm_submitted = admTotals.submitted;

  merged.last_updated = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return merged;
}

// ── HOD totals (same as v3 but without scholarship/exam/admission) ──
function getHODTotals() {
  const totals = {
    submissions: 0, departments: [],
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
    const ss   = SpreadsheetApp.open(files.next());
    const data = ss.getSheets()[0].getDataRange().getValues();
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
  } catch (e) { Logger.log('HOD totals error: ' + e.message); }

  totals.pending_depts   = DEPARTMENTS.filter(d => !totals.departments.includes(d));
  totals.submitted_count = totals.departments.length;
  totals.pending_count   = totals.pending_depts.length;
  return totals;
}

// ── Scholarship Section totals ──
function getScholarshipTotals() {
  const t = { submitted: false, govt_schol:0, ngo_schol:0, schol_sc:0, schol_st:0, schol_obc:0, schol_amount:0 };
  try {
    const files = DriveApp.getFilesByName(CFG.scholarshipSheet);
    if (!files.hasNext()) return t;
    const data = SpreadsheetApp.open(files.next()).getSheets()[0].getDataRange().getValues();
    if (data.length < 2) return t;
    // Use the LAST submitted row (most recent submission from scholarship office)
    const last = data[data.length - 1];
    Object.entries(SCHOL_COL).forEach(([key, col]) => {
      if (key === 'submitted_by') { t.submitted = !!last[col]; return; }
      const val = parseFloat(last[col]);
      if (!isNaN(val) && val >= 0) t[key] = val;
    });
    t.submitted = true;
  } catch (e) { Logger.log('Scholarship totals error: ' + e.message); }
  return t;
}

// ── Examination Section totals ──
function getExaminationTotals() {
  const t = { submitted: false, passed:0, appeared:0, days_result:0, grievances:0 };
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
  } catch (e) { Logger.log('Examination totals error: ' + e.message); }
  return t;
}

// ── Admission Section totals ──
function getAdmissionTotals() {
  const t = { submitted: false, admitted:0, reserved:0, adm_sc:0, adm_st:0, adm_obc:0, adm_pwd:0, adm_women:0 };
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
  } catch (e) { Logger.log('Admission totals error: ' + e.message); }
  return t;
}


// ═══════════════════════════════════════════════════════════
// CREATE FORMS — run each once to generate Google Forms
// ═══════════════════════════════════════════════════════════

// ── 1. HOD Form (trimmed — no scholarship/exam/admission) ──
function createHODForm() {
  const form = FormApp.create(CFG.hodFormTitle);
  form.setDescription(
    'Fill this form to submit your department\'s AQAR 2024-25 data.\n' +
    'NOTE (v4): Scholarship data → filled by Scholarship Section | ' +
    'Exam results → filled by Examination Section | ' +
    'Admission/caste data → filled by Admission Section.\n' +
    'Deadline: ' + CFG.deadline
  );
  form.setCollectEmail(false);

  // ── Section 0: Identification ──
  form.addSectionHeaderItem().setTitle('Department Identification');
  const deptItem = form.addListItem().setTitle('Name of Department').setRequired(true);
  deptItem.setChoiceValues(DEPARTMENTS);
  form.addTextItem().setTitle('Name of Head of Department').setRequired(true);
  form.addTextItem().setTitle('HOD Email').setRequired(true);
  form.addTextItem().setTitle('HOD Phone Number').setRequired(true);
  form.addDateItem().setTitle('Date of Submission').setRequired(true);

  // ── Section 1: Curricular ──
  form.addSectionHeaderItem().setTitle('Section 1 — Curricular Aspects');
  form.addScaleItem().setTitle('1.3.2 — No. of Value-Added Courses offered this year (≥30 hrs)').setBounds(0,50).setRequired(true);
  form.addScaleItem().setTitle('1.3.3 — No. of Students enrolled in Value-Added Courses').setBounds(0,500).setRequired(true);
  form.addScaleItem().setTitle('1.3.4 — No. of Students who completed Internship / Field Work / Project').setBounds(0,500).setRequired(true);

  // ── Section 2: Teaching (teacher profile only) ──
  form.addSectionHeaderItem().setTitle('Section 2 — Teaching, Learning & Evaluation (Teacher Profile)');
  form.addTextItem().setTitle('2.4.1 — No. of Full-time Teachers in your department').setRequired(true);
  form.addTextItem().setTitle('2.4.2 — No. of Teachers with PhD / D.M. / DSc').setRequired(true);
  form.addTextItem().setTitle('2.4.3 — Total Teaching Experience of all teachers combined (in years)').setRequired(true);
  form.addTextItem().setTitle('2.3.3.1 — No. of Student Mentors assigned in your department').setRequired(true);

  // ── Section 3: Research ──
  form.addSectionHeaderItem().setTitle('Section 3 — Research, Innovations & Extension');
  form.addTextItem().setTitle('3.1.3 — No. of Teachers awarded National/International Fellowships').setRequired(true);
  form.addParagraphTextItem().setTitle('3.1.3 — Fellowship details (Name | Teacher | Agency | Year — one per line)');
  form.addTextItem().setTitle('3.2.1 — Research Grants received from Govt/Non-Govt (₹ Lakhs)').setRequired(true);
  form.addTextItem().setTitle('3.3.2 — No. of Workshops on IPR / Research Methodology / Entrepreneurship conducted').setRequired(true);
  form.addTextItem().setTitle('3.4.3 — No. of Papers published in CARE / UGC-listed Journals').setRequired(true);
  form.addParagraphTextItem().setTitle('3.4.3 — Publication details (Title | Journal | ISSN | Year | Teacher — one per line)');
  form.addTextItem().setTitle('3.4.4 — No. of Books and Book Chapters published').setRequired(true);
  form.addTextItem().setTitle('3.4.5.1 — Total Scopus Citations').setRequired(true);
  form.addTextItem().setTitle('3.4.6.1 — h-index on Scopus (highest among department teachers)').setRequired(true);
  form.addTextItem().setTitle('3.6.3 — No. of NSS/NCC/Extension/Outreach Programmes').setRequired(true);
  form.addTextItem().setTitle('3.6.4 — No. of Students in Extension/Outreach Activities').setRequired(true);
  form.addTextItem().setTitle('3.7.2 — No. of functional MoUs signed with Institutions/Industries').setRequired(true);
  form.addParagraphTextItem().setTitle('3.7.2 — MoU details (Institution | Activity | Date | Status — one per line)');

  // ── Section 4: Infrastructure ──
  form.addSectionHeaderItem().setTitle('Section 4 — Infrastructure & Learning Resources');
  form.addTextItem().setTitle('4.1.3 — No. of ICT-enabled / Smart Classrooms in your department').setRequired(true);
  form.addTextItem().setTitle('4.3.2 — No. of Computers available for department use').setRequired(true);

  // ── Section 5: Student Support (placement/guidance only) ──
  form.addSectionHeaderItem().setTitle('Section 5 — Student Support & Progression (Placement & Career)');
  const guidNote = form.addSectionHeaderItem();
  guidNote.setTitle('📌 Note: Scholarship data is collected separately by the Scholarship Section. Do NOT enter scholarship numbers here.');
  form.addTextItem().setTitle('5.1.4 — No. of Students who attended Career/Competitive Exam Guidance programmes').setRequired(true);
  form.addTextItem().setTitle('5.2.1 — No. of Outgoing Students Placed (Jobs)').setRequired(true);
  form.addParagraphTextItem().setTitle('5.2.1 — Placement details (Student | Company | Package | Month/Year — one per line)');
  form.addTextItem().setTitle('5.2.2 — No. of Students who joined Higher Education (PG/PhD)').setRequired(true);
  form.addTextItem().setTitle('5.2.3.1 — No. of Students qualified in NET/GATE/State Level Exams').setRequired(true);
  form.addTextItem().setTitle('5.3.1 — No. of Awards in Sports/Cultural at inter-university level and above').setRequired(true);
  form.addTextItem().setTitle('5.3.3 — No. of Sports/Cultural Events organised by the department').setRequired(true);

  // ── Section 6: Governance ──
  form.addSectionHeaderItem().setTitle('Section 6 — Governance (FDP & Training)');
  form.addTextItem().setTitle('6.3.3 — No. of Professional Development/Training Programmes organised by department').setRequired(true);
  form.addTextItem().setTitle('6.3.4 — No. of Teachers who attended FDPs/Training Programmes').setRequired(true);
  form.addParagraphTextItem().setTitle('6.3.4 — FDP details (Teacher | Programme | Organiser | Duration | Month-Year — one per line)');

  // Link to response spreadsheet
  const ss = getOrCreateSheet(CFG.spreadsheetName);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('✅ HOD Form (v4) created: ' + form.getPublishedUrl());
  Logger.log('📎 Share this URL with HODs: ' + form.shortenFormUrl(form.getPublishedUrl()));
}

// ── 2. Scholarship Section Form ──
function createScholarshipForm() {
  const form = FormApp.create(CFG.scholarFormTitle);
  form.setDescription(
    'This form is to be filled by the SCHOLARSHIP SECTION IN-CHARGE only.\n' +
    'Enter the total scholarship data for the entire college for the academic year 2024-25.\n' +
    'Fill once. This data will automatically reflect in the IQAC AQAR Dashboard.\n' +
    'Contact: Dr. C.V. Krishnaveni | IQAC Coordinator | ' + CFG.iqacEmail
  );

  form.addSectionHeaderItem().setTitle('📚 Scholarship Data 2024-25 — Scholarship Section');
  form.addTextItem().setTitle('Name of Scholarship In-charge Officer').setRequired(true);
  form.addTextItem().setTitle('Designation').setRequired(true);
  form.addDateItem().setTitle('Date of Submission').setRequired(true);

  form.addSectionHeaderItem().setTitle('Metric 5.1.1 — Government Scholarships');
  form.addTextItem().setTitle('5.1.1 — Total No. of Students receiving Government Scholarships (all categories combined)').setRequired(true);
  form.addTextItem().setTitle('SC — No. of SC students receiving Govt Scholarships').setRequired(true);
  form.addTextItem().setTitle('ST — No. of ST students receiving Govt Scholarships').setRequired(true);
  form.addTextItem().setTitle('OBC — No. of OBC/BC students receiving Govt Scholarships').setRequired(true);

  form.addSectionHeaderItem().setTitle('Metric 5.1.2 — NGO / Institutional Scholarships');
  form.addTextItem().setTitle('5.1.2 — Total No. of Students receiving NGO/Institutional Scholarships').setRequired(true);
  form.addTextItem().setTitle('Total scholarship amount disbursed this year (₹ Lakhs — enter 0 if not available)').setRequired(true);

  form.addParagraphTextItem().setTitle('Remarks / Any additional scholarship information');

  const ss = getOrCreateSheet(CFG.scholarshipSheet);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('✅ Scholarship Form created: ' + form.getPublishedUrl());
  Logger.log('📋 Share with Scholarship In-charge: ' + form.shortenFormUrl(form.getPublishedUrl()));
}

// ── 3. Examination Section Form ──
function createExaminationForm() {
  const form = FormApp.create(CFG.examFormTitle);
  form.setDescription(
    'This form is to be filled by the EXAMINATION SECTION IN-CHARGE only.\n' +
    'Enter college-level examination results data for 2024-25.\n' +
    'Fill once. This data will automatically reflect in the IQAC AQAR Dashboard.\n' +
    'Contact: Dr. C.V. Krishnaveni | IQAC Coordinator | ' + CFG.iqacEmail
  );

  form.addSectionHeaderItem().setTitle('📝 Examination Data 2024-25 — Examination Section');
  form.addTextItem().setTitle('Name of Examination Section In-charge').setRequired(true);
  form.addTextItem().setTitle('Designation').setRequired(true);
  form.addDateItem().setTitle('Date of Submission').setRequired(true);

  form.addSectionHeaderItem().setTitle('Metric 2.5 — Examination Process');
  form.addTextItem().setTitle('2.5.1 — No. of Days from the last exam to declaration of results').setRequired(true);
  form.addTextItem().setTitle('2.5.2 — No. of Student complaints/grievances received against evaluation this year').setRequired(true);

  form.addSectionHeaderItem().setTitle('Metric 2.6 — Student Pass Percentage');
  form.addTextItem().setTitle('2.6.3.1 (Numerator) — No. of Final Year Students who PASSED in year-end exams').setRequired(true);
  form.addTextItem().setTitle('2.6.3.1 (Denominator) — No. of Final Year Students who APPEARED in year-end exams').setRequired(true);
  form.addTextItem().setTitle('EP 2.3 — Total No. of Students (all years) who appeared in examinations').setRequired(true);

  form.addTextItem().setTitle('2.7.1 — Student Satisfaction Survey URL (upload PDF to college website and paste link)');
  form.addParagraphTextItem().setTitle('Remarks / Exam section notes for AQAR');

  const ss = getOrCreateSheet(CFG.examinationSheet);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('✅ Examination Form created: ' + form.getPublishedUrl());
  Logger.log('📋 Share with Exam In-charge: ' + form.shortenFormUrl(form.getPublishedUrl()));
}

// ── 4. Admission Section Form ──
function createAdmissionForm() {
  const form = FormApp.create(CFG.admFormTitle);
  form.setDescription(
    'This form is to be filled by the ADMISSION SECTION IN-CHARGE only.\n' +
    'Enter total admission figures including caste-wise data for 2024-25.\n' +
    'Fill once. This data will automatically reflect in the IQAC AQAR Dashboard.\n' +
    'Contact: Dr. C.V. Krishnaveni | IQAC Coordinator | ' + CFG.iqacEmail
  );

  form.addSectionHeaderItem().setTitle('🎓 Admission Data 2024-25 — Admission Section');
  form.addTextItem().setTitle('Name of Admission In-charge Officer').setRequired(true);
  form.addTextItem().setTitle('Designation').setRequired(true);
  form.addDateItem().setTitle('Date of Submission').setRequired(true);

  form.addSectionHeaderItem().setTitle('Metric 2.1 — Student Enrollment (Overall College)');
  form.addTextItem().setTitle('2.1.1.1 — Total No. of Students ADMITTED this academic year (all programmes combined)').setRequired(true);
  form.addTextItem().setTitle('2.1.2 — No. of Reserved Category Seats FILLED (SC+ST+OBC+PWD combined)').setRequired(true);

  form.addSectionHeaderItem().setTitle('Category-wise Breakdown (Caste-wise Admission Data)');
  form.addTextItem().setTitle('SC — No. of SC students admitted').setRequired(true);
  form.addTextItem().setTitle('ST — No. of ST students admitted').setRequired(true);
  form.addTextItem().setTitle('OBC/BC — No. of OBC/BC students admitted').setRequired(true);
  form.addTextItem().setTitle('PWD/Divyang — No. of Divyang/PWD students admitted').setRequired(true);
  form.addTextItem().setTitle('Total Women admitted (should equal or be subset of total admitted above)').setRequired(true);

  form.addSectionHeaderItem().setTitle('Programme-wise Admission Summary');
  form.addParagraphTextItem().setTitle('Programme-wise details (Programme | Sanctioned | Admitted | SC | ST | OBC | PWD | Women — one per line)');

  form.addTextItem().setTitle('AISHE Submission Date (DD/MM/YYYY)');
  form.addParagraphTextItem().setTitle('Remarks / Any additional admission notes for AQAR');

  const ss = getOrCreateSheet(CFG.admissionSheet);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('✅ Admission Form created: ' + form.getPublishedUrl());
  Logger.log('📋 Share with Admission In-charge: ' + form.shortenFormUrl(form.getPublishedUrl()));
}

// ── Helper: Get or create spreadsheet ──
function getOrCreateSheet(name) {
  const files = DriveApp.getFilesByName(name);
  if (files.hasNext()) return SpreadsheetApp.open(files.next());
  return SpreadsheetApp.create(name);
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
      if (q.includes('Name of Department'))        dept = r.getResponse();
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
    GmailApp.sendEmail(CFG.iqacEmail,
      '📚 AQAR Scholarship Data Submitted — SKR & SKR GCW(A)',
      'Scholarship Section has submitted AQAR 2024-25 data.\n' +
      'Time: ' + new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}) +
      '\n\nSync the IQAC Dashboard to see updated scholarship figures.' +
      '\n\n— AQAR 2024-25 Auto Alert'
    );
  } catch(err) { Logger.log('Scholarship email error: ' + err.message); }
}

function onExamSubmit(e) {
  try {
    GmailApp.sendEmail(CFG.iqacEmail,
      '📝 AQAR Examination Data Submitted — SKR & SKR GCW(A)',
      'Examination Section has submitted AQAR 2024-25 data.\n' +
      'Time: ' + new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}) +
      '\n\nSync the IQAC Dashboard to see updated exam results.' +
      '\n\n— AQAR 2024-25 Auto Alert'
    );
  } catch(err) { Logger.log('Exam email error: ' + err.message); }
}

function onAdmissionSubmit(e) {
  try {
    GmailApp.sendEmail(CFG.iqacEmail,
      '🎓 AQAR Admission Data Submitted — SKR & SKR GCW(A)',
      'Admission Section has submitted AQAR 2024-25 data.\n' +
      'Time: ' + new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}) +
      '\n\nSync the IQAC Dashboard to see updated admission figures.' +
      '\n\n— AQAR 2024-25 Auto Alert'
    );
  } catch(err) { Logger.log('Admission email error: ' + err.message); }
}


// ═══════════════════════════════════════════════════════════
// SETUP ALL — run once after all 4 forms are created
// ═══════════════════════════════════════════════════════════
function setupAll() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  // HOD form trigger
  _addFormTrigger(CFG.hodFormTitle,   'onHODSubmit');
  // Section form triggers
  _addFormTrigger(CFG.scholarFormTitle, 'onScholarshipSubmit');
  _addFormTrigger(CFG.examFormTitle,    'onExamSubmit');
  _addFormTrigger(CFG.admFormTitle,     'onAdmissionSubmit');

// Daily backup trigger disabled
// ScriptApp.newTrigger('backupAQARData')
//   .timeBased().atHour(0).everyDays(1).inTimezone('Asia/Kolkata').create();

// Daily consolidation
ScriptApp.newTrigger('consolidate')
  .timeBased().atHour(6).everyDays(1).inTimezone('Asia/Kolkata').create();

// Create backup folder
const folders = DriveApp.getFoldersByName(CFG.backupFolderName);
if (!folders.hasNext()) DriveApp.createFolder(CFG.backupFolderName);

consolidate();

  Logger.log('═══════════════════════════════════════════════════════');
  Logger.log('SETUP COMPLETE — v4.0 Multi-Section Edition');
  Logger.log('4 form triggers registered (HOD + Scholarship + Exam + Admission)');
  Logger.log('Now Deploy as Web App: Deploy → New Deployment → Web App');
  Logger.log('Execute as: Me | Who has access: Anyone');
  Logger.log('═══════════════════════════════════════════════════════');
}

function _addFormTrigger(formTitle, handlerFn) {
  try {
    const files = DriveApp.getFilesByName(formTitle);
    if (!files.hasNext()) { Logger.log('⚠️ Form not found: ' + formTitle); return; }
    const form = FormApp.openById(files.next().getId());
    ScriptApp.newTrigger(handlerFn).forForm(form).onFormSubmit().create();
    Logger.log('✅ Trigger set: ' + handlerFn + ' → ' + formTitle);
  } catch(e) { Logger.log('Trigger error for ' + formTitle + ': ' + e.message); }
}


// ═══════════════════════════════════════════════════════════
// CONSOLIDATION — builds Summary tab
// ═══════════════════════════════════════════════════════════
function consolidate() {
  try {
    const merged = getMergedTotals();
    const ss     = getOrCreateSheet(CFG.spreadsheetName);
    const stamp  = new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});

    let summary = ss.getSheetByName('📊 IQAC Summary v4');
    if (!summary) summary = ss.insertSheet('📊 IQAC Summary v4');
    summary.clearContents(); summary.clearFormats();

    summary.getRange('A1').setValue('AQAR 2024-25 — Consolidated Summary (Multi-Section v4.0)')
      .setFontSize(14).setFontWeight('bold').setFontColor('#1a6b5a');
    summary.getRange('A2').setValue(CFG.institution + ' | Last updated: ' + stamp)
      .setFontStyle('italic').setFontColor('#7a7060');

    const pct = Math.round(merged.submitted_count / DEPARTMENTS.length * 100);
    summary.getRange('A4').setValue('HOD Submissions: ' + merged.submitted_count + '/' + DEPARTMENTS.length + ' (' + pct + '%)')
      .setFontWeight('bold').setBackground(pct===100?'#e8f7ee':'#fdf3e3');
    summary.getRange('A5').setValue(
      'Scholarship Section: ' + (merged.schol_submitted?'✅ Submitted':'⏳ Pending') + ' | ' +
      'Examination Section: ' + (merged.exam_submitted?'✅ Submitted':'⏳ Pending') + ' | ' +
      'Admission Section: '   + (merged.adm_submitted?'✅ Submitted':'⏳ Pending')
    ).setFontWeight('bold').setFontSize(11);

    const rows = [
      ['', 'CRITERION', 'CODE', 'METRIC', 'TOTAL 2024-25', 'SOURCE', 'PREV 2023-24'],
      ['C1','Curricular','1.3.2','Value-Added Courses',merged.vac,'HOD Form',22],
      ['C1','Curricular','1.3.3','Students in VACs',merged.vac_students,'HOD Form',740],
      ['C1','Curricular','1.3.4','Students in Internships',merged.internships,'HOD Form',1689],
      ['C2','Teaching','2.1.1.1','Students Admitted',merged.admitted,'Admission Section',592],
      ['C2','Teaching','2.1.2','Reserved Seats Filled',merged.reserved,'Admission Section',469],
      ['C2','Teaching','2.1.2 SC','SC Admissions',merged.adm_sc,'Admission Section','—'],
      ['C2','Teaching','2.1.2 ST','ST Admissions',merged.adm_st,'Admission Section','—'],
      ['C2','Teaching','2.1.2 OBC','OBC Admissions',merged.adm_obc,'Admission Section','—'],
      ['C2','Teaching','2.4.1','Full-time Teachers',merged.teachers_total,'HOD Form',59],
      ['C2','Teaching','2.4.2','Teachers with PhD',merged.phd_teachers,'HOD Form',23],
      ['C2','Teaching','2.4.3','Teaching Experience (yrs)',merged.experience,'HOD Form',344],
      ['C2','Teaching','2.5.1','Days — Exam to Result',merged.days_result,'Examination Section',22],
      ['C2','Teaching','2.5.2','Student Grievances (Eval)',merged.grievances,'Examination Section',95],
      ['C2','Teaching','2.6.3.1 (N)','Final Year Passed',merged.passed,'Examination Section',632],
      ['C2','Teaching','2.6.3.1 (D)','Final Year Appeared',merged.appeared,'Examination Section',600],
      ['C3','Research','3.1.3','Teacher Fellowships',merged.fellowships,'HOD Form',4],
      ['C3','Research','3.3.2','IPR/Research Workshops',merged.workshops,'HOD Form',7],
      ['C3','Research','3.4.3','CARE Papers',merged.care_papers,'HOD Form',9],
      ['C3','Research','3.4.4','Books & Chapters',merged.books,'HOD Form',24],
      ['C3','Research','3.4.5.1','Scopus Citations',merged.citations,'HOD Form',40],
      ['C3','Research','3.4.6.1','h-index (max)',merged.h_index,'HOD Form',5],
      ['C3','Research','3.6.3','Extension Programmes',merged.extension_prog,'HOD Form',61],
      ['C3','Research','3.7.2','MoUs',merged.mous,'HOD Form',8],
      ['C4','Infrastructure','4.1.3','ICT Classrooms',merged.ict_classrooms,'HOD Form',13],
      ['C4','Infrastructure','4.3.2','Computers',merged.computers,'HOD Form',175],
      ['C5','Student Support','5.1.1','Govt Scholarships',merged.govt_schol,'Scholarship Section',1363],
      ['C5','Student Support','5.1.2','NGO Scholarships',merged.ngo_schol,'Scholarship Section',0],
      ['C5','Student Support','5.1.4','Career Guidance Students',merged.career_guid,'HOD Form',500],
      ['C5','Student Support','5.2.1','Students Placed',merged.placed,'HOD Form',169],
      ['C5','Student Support','5.2.2','Higher Education',merged.higher_edu,'HOD Form',118],
      ['C5','Student Support','5.2.3.1','NET/GATE Qualified',merged.net_gate,'HOD Form',0],
      ['C5','Student Support','5.3.1','Awards',merged.awards,'HOD Form',21],
      ['C5','Student Support','5.3.3','Events Organised',merged.events,'HOD Form',33],
      ['C6','Governance','6.3.3','FDPs Organised',merged.fdp_organised,'HOD Form',5],
      ['C6','Governance','6.3.4','Teachers in FDPs',merged.fdp_attended,'HOD Form',109],
    ];

    const startRow = 7;
    rows.forEach((row, i) => {
      const r = summary.getRange(startRow+i, 1, 1, row.length);
      r.setValues([row]);
      if (i===0) r.setBackground('#1a6b5a').setFontColor('#fff').setFontWeight('bold');
      else {
        r.setBackground(i%2===0?'#f2faf7':'#fff');
        // Highlight source column for non-HOD data
        const src = row[5];
        if (src && src !== 'HOD Form') {
          summary.getRange(startRow+i, 6).setFontColor('#1e4d8c').setFontWeight('bold');
        }
      }
    });

    summary.autoResizeColumns(1, 7);
    Logger.log('✅ Consolidation complete — Summary tab updated');
  } catch(e) { Logger.log('Consolidation error: ' + e.message); }
}


// ═══════════════════════════════════════════════════════════
// BACKUP — runs daily at midnight
// ═══════════════════════════════════════════════════════════
function backupAQARData() {
  try {
    const folder = _getBackupFolder();
    const stamp  = Utilities.formatDate(new Date(),'Asia/Kolkata','yyyy-MM-dd_HH-mm');
    const ss     = getOrCreateSheet(CFG.spreadsheetName);
    DriveApp.getFileById(ss.getId()).makeCopy('AQAR_HOD_Backup_'+stamp, folder);

    const merged = getMergedTotals();
    GmailApp.sendEmail(CFG.iqacEmail,
      '💾 AQAR 2024-25 Backup Complete — ' + stamp,
      'Backup at: ' + stamp + '\nHOD submissions: ' + merged.submitted_count + '/' + DEPARTMENTS.length +
      '\nScholarship Section: ' + (merged.schol_submitted?'Submitted':'Pending') +
      '\nExamination Section: ' + (merged.exam_submitted?'Submitted':'Pending') +
      '\nAdmission Section: '   + (merged.adm_submitted?'Submitted':'Pending') +
      '\n\n— AQAR 2024-25 Backup System | SKR & SKR GCW(A)'
    );
    Logger.log('Backup complete: ' + stamp);
  } catch(e) {
    Logger.log('Backup error: ' + e.message);
    GmailApp.sendEmail(CFG.iqacEmail,'⚠️ AQAR Backup Failed','Error: '+e.message);
  }
}

function _getBackupFolder() {
  const folders = DriveApp.getFoldersByName(CFG.backupFolderName);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(CFG.backupFolderName);
}


// ═══════════════════════════════════════════════════════════
// SEND REMINDERS — HODs only (fill emailMap)
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
      'Dear HOD,\n\nYour department (' + dept + ') has not yet submitted AQAR 2024-25 data.\n\n' +
      'Please fill the HOD form (takes ~15 minutes).\n\n' +
      'NOTE: You only need to fill department academic data.\n' +
      'Scholarship, Exam, and Admission data are collected separately.\n\n' +
      'Deadline: ' + CFG.deadline + '\n\n' +
      'Contact: Dr. C.V. Krishnaveni | IQAC | 9490519982 | ' + CFG.iqacEmail +
      '\n\nRegards,\nIQAC Coordinator\nSKR & SKR GCW(A), Kadapa'
    );
    sent++;
  });
  Logger.log('HOD reminders sent: ' + sent);
}

// Send reminder to section in-charges
function sendSectionReminders() {
  // Fill in the correct email addresses before running
  const sections = [
    { name:'Scholarship Section', email:'', submitted: getScholarshipTotals().submitted },
    { name:'Examination Section', email:'', submitted: getExaminationTotals().submitted },
    { name:'Admission Section',   email:'', submitted: getAdmissionTotals().submitted },
  ];

  sections.filter(s => !s.submitted && s.email).forEach(s => {
    GmailApp.sendEmail(s.email,
      '⏰ REMINDER: AQAR 2024-25 ' + s.name + ' Data Pending',
      'Dear In-charge,\n\nThe ' + s.name + ' has not yet submitted AQAR 2024-25 data.\n\n' +
      'Please fill your dedicated form (takes ~5 minutes).\n\n' +
      'Deadline: ' + CFG.deadline + '\n\n' +
      'Contact: Dr. C.V. Krishnaveni | IQAC | 9490519982 | ' + CFG.iqacEmail +
      '\n\nRegards,\nIQAC Coordinator\nSKR & SKR GCW(A), Kadapa'
    );
    Logger.log('Reminder sent to: ' + s.name);
  });
}


// ═══════════════════════════════════════════════════════════
// SUBMISSION STATUS REPORT
// ═══════════════════════════════════════════════════════════
function generateSummaryReport() {
  const merged = getMergedTotals();
  const stamp  = new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});
  const pct    = Math.round(merged.submitted_count/DEPARTMENTS.length*100);

  Logger.log('══════════════════════════════════════════════════════');
  Logger.log('AQAR 2024-25 — MULTI-SECTION SUBMISSION STATUS (v4.0)');
  Logger.log(CFG.institution);
  Logger.log('As of: ' + stamp);
  Logger.log('══════════════════════════════════════════════════════');
  Logger.log('SECTION FORMS:');
  Logger.log('  Scholarship Section: ' + (merged.schol_submitted?'✅ Submitted':'⏳ PENDING'));
  Logger.log('  Examination Section: ' + (merged.exam_submitted?'✅ Submitted':'⏳ PENDING'));
  Logger.log('  Admission Section:   ' + (merged.adm_submitted?'✅ Submitted':'⏳ PENDING'));
  Logger.log('──────────────────────────────────────────────────────');
  Logger.log('HOD SUBMISSIONS: ' + merged.submitted_count + '/' + DEPARTMENTS.length + ' (' + pct + '%)');
  DEPARTMENTS.forEach(d => Logger.log((merged.departments.includes(d)?'✅ ':'⏳ ') + d));
  Logger.log('──────────────────────────────────────────────────────');
  Logger.log('KEY MERGED TOTALS:');
  Logger.log('Students Admitted  : ' + merged.admitted    + ' [Admission Section]');
  Logger.log('Reserved Filled    : ' + merged.reserved    + ' [Admission Section]');
  Logger.log('Govt Scholarships  : ' + merged.govt_schol  + ' [Scholarship Section]');
  Logger.log('Students Passed    : ' + merged.passed      + ' [Examination Section]');
  Logger.log('Students Appeared  : ' + merged.appeared    + ' [Examination Section]');
  Logger.log('Days to Result     : ' + merged.days_result + ' [Examination Section]');
  Logger.log('Teachers with PhD  : ' + merged.phd_teachers);
  Logger.log('CARE Papers        : ' + merged.care_papers);
  Logger.log('Students Placed    : ' + merged.placed);
  Logger.log('══════════════════════════════════════════════════════');
}

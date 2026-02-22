/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  AQAR 2024-25 MASTER SCRIPT — SKR & SKR GCW(A), KADAPA               ║
 * ║  Version    : 3.0 — Integrated Edition                                 ║
 * ║  Developer  : Venkata Krishnaveni Chennuru                              ║
 * ║  Role       :Dept. of Computer Science & IQAC Coordinator              ║
 * ║  Institution: SKR & SKR GCW(A), Kadapa, AP 516001                      ║
 * ║  License    : MIT + CC BY-NC 4.0  |  © 2026 Free OER                  ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  WHAT THIS SCRIPT DOES:                                                 ║
 * ║  1. doGet()          → Web App API (feeds IQAC Data Collector live)    ║
 * ║  2. onHODSubmit()    → Email alert on every HOD submission              ║
 * ║  3. backupAQARData() → Daily timestamped backup to Drive folder         ║
 * ║  4. consolidate()    → Builds summary totals tab from all responses     ║
 * ║  5. exportSummaryCSV() → Downloads compiled CSV for import panel       ║
 * ║  6. generateSummaryReport() → Prints submission status to Logs          ║
 * ║  7. sendReminders()  → Emails pending HODs only                        ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  SETUP — DO THESE IN ORDER:                                             ║
 * ║  Step 1: Run setupAll() — creates triggers, backup folder, summary tab  ║
 * ║  Step 2: Deploy as Web App (see DEPLOYMENT GUIDE below)                 ║
 * ║  Step 3: Copy Web App URL into IQAC Data Collector v3.1 CONFIG          ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DEPLOYMENT GUIDE — Read carefully before deploying
 * ═══════════════════════════════════════════════════════════════════════════
 * 1. In Apps Script editor: click Deploy → New Deployment
 * 2. Click the gear ⚙ next to "Select type" → choose "Web App"
 * 3. Settings:
 *      Description     : AQAR 2024-25 Web App API
 *      Execute as      : Me (iqac.nirf.gdcw.kdp@gmail.com)
 *      Who has access  : Anyone   ← IMPORTANT: must be "Anyone"
 * 4. Click Deploy → Copy the Web App URL (looks like:
 *      https://script.google.com/macros/s/AKfycb.../exec )
 * 5. Open iqac-data-collector-v3.1.html in Notepad
 *    Find:  WEB_APP_URL: ''
 *    Replace with:  WEB_APP_URL: 'https://script.google.com/macros/s/YOUR_ID/exec'
 * 6. Save the HTML file → re-upload to GitHub Pages
 * 7. Test: click "🔄 Sync from Sheet" in the tool — data should fill in
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════
// CONFIGURATION — verify these match your actual files
// ═══════════════════════════════════════════════════════════
const CFG = {
  spreadsheetName : 'AQAR 2024-25 HOD Responses — SKR & SKR GCW(A)',
  formTitle       : 'AQAR 2024-25 | HOD Department Data Collection | SKR & SKR GCW(A)',
  iqacEmail       : 'iqac.nirf.gdcw.kdp@gmail.com',
  backupFolderName: 'AQAR 2024-25 Backups — SKR & SKR GCW(A)',
  deadline        : '31 March 2026',
  institution     : 'SKR & SKR Government College for Women (Autonomous), Kadapa',
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
// COLUMN MAPPING — matches HOD Google Form question order
// Edit if your form columns are in a different order
// ═══════════════════════════════════════════════════════════
// Column index (0-based after Timestamp) → metric name
// The doGet() function uses these to build the JSON totals
const COL_MAP = {
  // Identification (cols 1-5 are dept, hod name, email, phone, date)
  dept          : 1,   // "Name of Department"

  // Curricular (Section 1)
  vac           : 7,   // 1.3.2 Value-Added Courses
  vac_students  : 8,   // 1.3.3 Students in VACs
  internships   : 9,   // 1.3.4 Internships

  // Teaching (Section 2)
  admitted      : 12,  // 2.1.1.1 Students Admitted
  reserved      : 13,  // 2.1.2 Reserved seats filled
  teachers_total: 16,  // 2.4.1 Full-time teachers
  phd_teachers  : 17,  // 2.4.2 PhD holders
  experience    : 18,  // 2.4.3 Total experience (yrs)
  passed        : 21,  // 2.6.3 Passed
  appeared      : 22,  // 2.6.3 Appeared

  // Research (Section 3)
  fellowships   : 24,  // 3.1.3
  workshops     : 27,  // 3.3.2
  care_papers   : 28,  // 3.4.3
  books         : 29,  // 3.4.4
  citations     : 30,  // 3.4.5.1
  h_index       : 31,  // 3.4.6.1 (use max not sum)
  extension_prog: 32,  // 3.6.3
  ext_students  : 33,  // 3.6.4
  mous          : 34,  // 3.7.2

  // Infrastructure (Section 4)
  ict_classrooms: 36,  // 4.1.3
  computers     : 37,  // 4.3 dept computers

  // Student Support (Section 5)
  govt_schol    : 38,  // 5.1.1
  ngo_schol     : 39,  // 5.1.2
  career_guid   : 41,  // 5.1.4
  placed        : 43,  // 5.2.1
  higher_edu    : 44,  // 5.2.2
  net_gate      : 45,  // 5.2.3.1
  awards        : 46,  // 5.3.1
  events        : 47,  // 5.3.3

  // Governance (Section 6)
  fdp_organised : 50,  // 6.3.3
  fdp_attended  : 51,  // 6.3.4

  // Values (Section 7)
  // (mostly text fields — not summed)
};

// ═══════════════════════════════════════════════════════════
// WEB APP — doGet() : Called by IQAC Data Collector v3.1
// Returns JSON with summed totals from all HOD submissions
// ═══════════════════════════════════════════════════════════
function doGet(e) {
  try {
    const totals = getSummaryTotals();
    const output = ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', data: totals }))
      .setMimeType(ContentService.MimeType.JSON);

    // Allow CORS so the HTML file can call this from any domain
    return output;

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Reads all rows, sums numeric columns, returns totals object ──
function getSummaryTotals() {
  const ss    = getResponseSheet();
  const data  = ss.getSheets()[0].getDataRange().getValues();
  if (data.length < 2) return {
    submissions: 0, departments: [], submitted_count: 0, pending_count: DEPARTMENTS.length,
    pending_depts: [...DEPARTMENTS], last_updated: new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}),
    admitted:0,reserved:0,teachers_total:0,phd_teachers:0,experience:0,passed:0,appeared:0,
    fellowships:0,workshops:0,care_papers:0,books:0,citations:0,h_index:0,
    extension_prog:0,ext_students:0,mous:0,ict_classrooms:0,computers:0,
    govt_schol:0,ngo_schol:0,career_guid:0,placed:0,higher_edu:0,net_gate:0,
    awards:0,events:0,fdp_organised:0,fdp_attended:0,vac:0,vac_students:0,internships:0
  };

  const totals = {
    submissions    : 0,
    departments    : [],
    // Curricular
    vac            : 0,
    vac_students   : 0,
    internships    : 0,
    // Teaching
    admitted       : 0,
    reserved       : 0,
    teachers_total : 0,
    phd_teachers   : 0,
    experience     : 0,
    passed         : 0,
    appeared       : 0,
    // Research
    fellowships    : 0,
    workshops      : 0,
    care_papers    : 0,
    books          : 0,
    citations      : 0,
    h_index        : 0,   // will use MAX
    extension_prog : 0,
    ext_students   : 0,
    mous           : 0,
    // Infrastructure
    ict_classrooms : 0,
    computers      : 0,
    // Student Support
    govt_schol     : 0,
    ngo_schol      : 0,
    career_guid    : 0,
    placed         : 0,
    higher_edu     : 0,
    net_gate       : 0,
    awards         : 0,
    events         : 0,
    // Governance
    fdp_organised  : 0,
    fdp_attended   : 0,
  };

  const h_indices = [];

  data.slice(1).forEach(row => {
    totals.submissions++;
    const dept = row[COL_MAP.dept] || '';
    if (dept && !totals.departments.includes(dept)) totals.departments.push(dept);

    Object.entries(COL_MAP).forEach(([key, col]) => {
      if (key === 'dept') return;
      const val = parseFloat(row[col]);
      if (isNaN(val) || val < 0) return;
      if (key === 'h_index') { h_indices.push(val); return; }
      totals[key] += val;
    });
  });

  // h-index: use max across all departments, not sum
  totals.h_index = h_indices.length ? Math.max(...h_indices) : 0;

  // Round all values
  Object.keys(totals).forEach(k => {
    if (typeof totals[k] === 'number') totals[k] = Math.round(totals[k]);
  });

  totals.pending_depts = DEPARTMENTS.filter(d => !totals.departments.includes(d));
  totals.submitted_count = totals.departments.length;
  totals.pending_count   = totals.pending_depts.length;
  totals.last_updated    = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return totals;
}

// ── Helper: open the response spreadsheet ────────────────────
function getResponseSheet() {
  const files = DriveApp.getFilesByName(CFG.spreadsheetName);
  if (!files.hasNext()) throw new Error('Response sheet not found: ' + CFG.spreadsheetName);
  return SpreadsheetApp.open(files.next());
}


// ═══════════════════════════════════════════════════════════
// EMAIL NOTIFICATION — fires on every HOD form submission
// ═══════════════════════════════════════════════════════════
function onHODSubmit(e) {
  try {
    const responses = e.response.getItemResponses();
    let dept = 'Unknown', hod = 'Unknown';
    responses.forEach(r => {
      const q = r.getItem().getTitle();
      if (q.includes('Name of Department'))          dept = r.getResponse();
      if (q.includes('Name of Head of Department'))  hod  = r.getResponse();
    });

    const totals = getSummaryTotals();
    const pct    = Math.round(totals.submitted_count / DEPARTMENTS.length * 100);

    GmailApp.sendEmail(
      CFG.iqacEmail,
      '✅ AQAR HOD Submission: ' + dept + ' — ' + pct + '% Complete',
      'Dear Dr. C.V. Krishnaveni,\n\n'
      + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
      + 'NEW SUBMISSION RECEIVED\n'
      + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
      + 'Department : ' + dept + '\n'
      + 'HOD        : ' + hod  + '\n'
      + 'Time       : ' + new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + '\n\n'
      + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
      + 'OVERALL PROGRESS\n'
      + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
      + 'Submitted : ' + totals.submitted_count + ' / ' + DEPARTMENTS.length + ' departments (' + pct + '%)\n'
      + 'Pending   : ' + totals.pending_count   + ' departments\n\n'
      + 'Pending departments:\n'
      + totals.pending_depts.map((d, i) => (i+1) + '. ' + d).join('\n')
      + '\n\n'
      + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
      + 'To view live data in IQAC Data Collector:\n'
      + 'Open the HTML tool → click "🔄 Sync from Sheet"\n\n'
      + '— AQAR 2024-25 Automated Alert\n'
      + '  SKR & SKR GCW(A), Kadapa'
    );
  } catch (err) {
    Logger.log('Email error: ' + err.message);
  }
}


// ═══════════════════════════════════════════════════════════
// BACKUP SYSTEM — runs daily at midnight automatically
// ═══════════════════════════════════════════════════════════
function backupAQARData() {
  try {
    // Get or create backup folder
    let folder;
    const folders = DriveApp.getFoldersByName(CFG.backupFolderName);
    folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CFG.backupFolderName);

    // Copy the response sheet into the backup folder
    const ss      = getResponseSheet();
    const ssFile  = DriveApp.getFileById(ss.getId());
    const stamp   = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd_HH-mm');
    const copyName = 'AQAR_Backup_' + stamp + '_SKR_GCW';
    const copy    = ssFile.makeCopy(copyName, folder);

    // Also backup the summary tab as CSV
    const totals  = getSummaryTotals();
    const csvRows = [
      ['AQAR 2024-25 Backup Summary', stamp, ''],
      ['Institution', CFG.institution, ''],
      ['Submissions', totals.submitted_count, 'of ' + DEPARTMENTS.length],
      ['', '', ''],
      ['METRIC', 'TOTAL', 'NOTES'],
      ['Students Admitted',       totals.admitted,       '2.1.1.1'],
      ['Reserved Seats Filled',   totals.reserved,       '2.1.2'],
      ['Teachers (Full-time)',     totals.teachers_total, '2.4.1'],
      ['Teachers with PhD',       totals.phd_teachers,   '2.4.2'],
      ['CARE Papers',             totals.care_papers,    '3.4.3'],
      ['Books & Chapters',        totals.books,          '3.4.4'],
      ['Scopus Citations',        totals.citations,      '3.4.5.1'],
      ['h-index (max)',           totals.h_index,        '3.4.6.1'],
      ['Fellowships',             totals.fellowships,    '3.1.3'],
      ['Workshops',               totals.workshops,      '3.3.2'],
      ['MoUs',                    totals.mous,           '3.7.2'],
      ['Govt Scholarships',       totals.govt_schol,     '5.1.1'],
      ['Students Placed',         totals.placed,         '5.2.1'],
      ['Higher Education',        totals.higher_edu,     '5.2.2'],
      ['NET/GATE Qualified',      totals.net_gate,       '5.2.3.1'],
      ['Awards',                  totals.awards,         '5.3.1'],
      ['FDPs Attended',           totals.fdp_attended,   '6.3.4'],
      ['VAC Courses',             totals.vac,            '1.3.2'],
      ['VAC Students',            totals.vac_students,   '1.3.3'],
      ['Extension Programmes',    totals.extension_prog, '3.6.3'],
      ['ICT Classrooms',          totals.ict_classrooms, '4.1.3'],
    ];

    const csvContent = csvRows.map(r =>
      r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')
    ).join('\n');

    const csvBlob = Utilities.newBlob(
      '\uFEFF' + csvContent,
      'text/csv',
      'AQAR_Summary_' + stamp + '.csv'
    );
    folder.createFile(csvBlob);

    // Send backup confirmation email
    GmailApp.sendEmail(
      CFG.iqacEmail,
      '💾 AQAR 2024-25 Auto-Backup Complete — ' + stamp,
      'Dear Dr. C.V. Krishnaveni,\n\n'
      + 'Automated backup completed successfully.\n\n'
      + 'Backup file : ' + copyName + '\n'
      + 'Backup time : ' + stamp + '\n'
      + 'Location    : Google Drive → ' + CFG.backupFolderName + '\n\n'
      + 'Current status: ' + totals.submitted_count + '/' + DEPARTMENTS.length
      + ' departments submitted (' + Math.round(totals.submitted_count/DEPARTMENTS.length*100) + '%)\n\n'
      + '— AQAR 2024-25 Backup System\n  SKR & SKR GCW(A), Kadapa'
    );

    Logger.log('Backup created: ' + copyName + ' | Folder: ' + CFG.backupFolderName);
    Logger.log('Backup folder URL: ' + folder.getUrl());

  } catch (err) {
    Logger.log('Backup error: ' + err.message);
    GmailApp.sendEmail(CFG.iqacEmail, '⚠️ AQAR Backup Failed', 'Error: ' + err.message);
  }
}


// ═══════════════════════════════════════════════════════════
// CONSOLIDATION — builds Summary tab in response sheet
// Run this any time to refresh the summary
// ═══════════════════════════════════════════════════════════
function consolidate() {
  const ss      = getResponseSheet();
  const totals  = getSummaryTotals();
  const stamp   = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Get or create Summary tab
  let summary = ss.getSheetByName('📊 IQAC Summary');
  if (!summary) summary = ss.insertSheet('📊 IQAC Summary');
  summary.clearContents();
  summary.clearFormats();

  // Header
  summary.getRange('A1').setValue('AQAR 2024-25 — Consolidated Summary');
  summary.getRange('A1').setFontSize(16).setFontWeight('bold').setFontColor('#1a6b5a');
  summary.getRange('A2').setValue(CFG.institution + ' | Last updated: ' + stamp);
  summary.getRange('A2').setFontStyle('italic').setFontColor('#7a7060');

  // Progress bar
  const pct = Math.round(totals.submitted_count / DEPARTMENTS.length * 100);
  summary.getRange('A4').setValue('HOD Submissions: ' + totals.submitted_count + ' / ' + DEPARTMENTS.length + ' (' + pct + '%)');
  summary.getRange('A4').setFontSize(13).setFontWeight('bold')
    .setBackground(pct === 100 ? '#e8f7ee' : '#fdf3e3')
    .setFontColor(pct === 100 ? '#1e7a4a' : '#7a4a00');

  // Metrics table
  const rows = [
    ['', 'CRITERION', 'METRIC CODE', 'DESCRIPTION', 'TOTAL 2024-25', 'PREV 2023-24'],
    ['C1', 'Curricular',          '1.3.2',   'Value-Added Courses (≥30hrs)',             totals.vac,            22],
    ['C1', 'Curricular',          '1.3.3',   'Students in VACs',                         totals.vac_students,   740],
    ['C1', 'Curricular',          '1.3.4',   'Students in Internships/Field Projects',   totals.internships,    1689],
    ['C2', 'Teaching',            '2.1.1.1', 'Students Admitted',                        totals.admitted,       592],
    ['C2', 'Teaching',            '2.1.2',   'Reserved Seats Filled',                    totals.reserved,       469],
    ['C2', 'Teaching',            '2.4.1',   'Full-time Teachers',                       totals.teachers_total, 59],
    ['C2', 'Teaching',            '2.4.2',   'Teachers with PhD',                        totals.phd_teachers,   23],
    ['C2', 'Teaching',            '2.4.3',   'Total Teaching Experience (yrs)',           totals.experience,     344],
    ['C2', 'Teaching',            '2.6.3.1', 'Final Year Students Passed',               totals.passed,         632],
    ['C2', 'Teaching',            '2.6.3.1', 'Final Year Students Appeared',             totals.appeared,       600],
    ['C3', 'Research',            '3.1.3',   'Teachers Awarded Fellowships',              totals.fellowships,    4],
    ['C3', 'Research',            '3.3.2',   'IPR/Research Workshops',                   totals.workshops,      7],
    ['C3', 'Research',            '3.4.3',   'CARE Journal Papers',                      totals.care_papers,    9],
    ['C3', 'Research',            '3.4.4',   'Books & Chapters Published',               totals.books,          24],
    ['C3', 'Research',            '3.4.5.1', 'Scopus Citations (cumulative)',             totals.citations,      40],
    ['C3', 'Research',            '3.4.6.1', 'h-index (highest)',                        totals.h_index,        5],
    ['C3', 'Research',            '3.6.3',   'NSS/NCC/Extension Programmes',             totals.extension_prog, 61],
    ['C3', 'Research',            '3.6.4',   'Students in Extension Activities',         totals.ext_students,   1689],
    ['C3', 'Research',            '3.7.2',   'Functional MoUs',                          totals.mous,           8],
    ['C4', 'Infrastructure',      '4.1.3',   'ICT-Enabled Classrooms',                   totals.ict_classrooms, 13],
    ['C4', 'Infrastructure',      '4.3.2',   'Computers (dept use)',                     totals.computers,      175],
    ['C5', 'Student Support',     '5.1.1',   'Govt Scholarships',                        totals.govt_schol,     1363],
    ['C5', 'Student Support',     '5.1.2',   'NGO/Inst. Scholarships',                   totals.ngo_schol,      0],
    ['C5', 'Student Support',     '5.1.4',   'Students in Career Guidance',              totals.career_guid,    500],
    ['C5', 'Student Support',     '5.2.1',   'Students Placed (Jobs)',                   totals.placed,         169],
    ['C5', 'Student Support',     '5.2.2',   'Students → Higher Education',              totals.higher_edu,     118],
    ['C5', 'Student Support',     '5.2.3.1', 'NET/GATE Qualified',                       totals.net_gate,       0],
    ['C5', 'Student Support',     '5.3.1',   'Awards in Sports/Cultural',                totals.awards,         21],
    ['C5', 'Student Support',     '5.3.3',   'Events Organised',                         totals.events,         33],
    ['C6', 'Governance',          '6.3.3',   'FDPs/Training Organised',                  totals.fdp_organised,  5],
    ['C6', 'Governance',          '6.3.4',   'Teachers in FDPs',                         totals.fdp_attended,   109],
  ];

  const startRow = 6;
  rows.forEach((row, i) => {
    const r = summary.getRange(startRow + i, 1, 1, row.length);
    r.setValues([row]);
    if (i === 0) {
      r.setBackground('#1a6b5a').setFontColor('#ffffff').setFontWeight('bold').setFontSize(11);
    } else {
      const bg = i % 2 === 0 ? '#f2faf7' : '#ffffff';
      r.setBackground(bg);
      // Highlight if value > previous year
      const curr = parseFloat(row[4]); const prev = parseFloat(row[5]);
      if (!isNaN(curr) && !isNaN(prev) && curr > prev) {
        summary.getRange(startRow + i, 5).setFontColor('#1e7a4a').setFontWeight('bold');
      }
    }
  });

  // Department submission status
  const deptStart = startRow + rows.length + 2;
  summary.getRange(deptStart, 1).setValue('DEPARTMENT SUBMISSION STATUS')
    .setFontSize(13).setFontWeight('bold').setFontColor('#1a6b5a');

  const deptHeaders = ['S.No', 'Department', 'Status', 'Submissions'];
  summary.getRange(deptStart + 1, 1, 1, deptHeaders.length).setValues([deptHeaders])
    .setBackground('#1a6b5a').setFontColor('#fff').setFontWeight('bold');

  const submittedDepts = Array.isArray(totals.departments) ? totals.departments : [];
  DEPARTMENTS.forEach((dept, i) => {
    const submitted = submittedDepts.includes(dept);
    const row = [i + 1, dept, submitted ? '✅ Submitted' : '⏳ Pending', ''];
    const r = summary.getRange(deptStart + 2 + i, 1, 1, row.length);
    r.setValues([row]);
    if (submitted) r.setBackground('#e8f7ee');
    else r.setBackground('#fde8e6');
  });

  summary.autoResizeColumns(1, 6);
  ss.setActiveSheet(summary);

  Logger.log('Consolidation complete. Summary tab "📊 IQAC Summary" updated.');
  Logger.log('Submissions: ' + totals.submitted_count + '/' + DEPARTMENTS.length);
}


// ═══════════════════════════════════════════════════════════
// EXPORT SUMMARY CSV — for manual import into HTML tool
// Run this, download the CSV, drag into Import panel
// ═══════════════════════════════════════════════════════════
function exportSummaryCSV() {
  const totals = getSummaryTotals();
  const stamp  = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');

  const rows = [
    ['Metric', 'Value', 'NAAC Code', 'Previous 2023-24'],
    ['Students Admitted',       totals.admitted,       '2.1.1.1', 592],
    ['Reserved Seats Filled',   totals.reserved,       '2.1.2',   469],
    ['Full-time Teachers',      totals.teachers_total, '2.4.1',   59],
    ['PhD Teachers',            totals.phd_teachers,   '2.4.2',   23],
    ['Teaching Experience',     totals.experience,     '2.4.3',   344],
    ['Students Passed',         totals.passed,         '2.6.3.1', 632],
    ['Students Appeared',       totals.appeared,       '2.6.3.1', 600],
    ['Fellowships',             totals.fellowships,    '3.1.3',   4],
    ['Workshops',               totals.workshops,      '3.3.2',   7],
    ['CARE Papers',             totals.care_papers,    '3.4.3',   9],
    ['Books & Chapters',        totals.books,          '3.4.4',   24],
    ['Scopus Citations',        totals.citations,      '3.4.5.1', 40],
    ['h-index',                 totals.h_index,        '3.4.6.1', 5],
    ['Extension Programmes',    totals.extension_prog, '3.6.3',   61],
    ['Extension Students',      totals.ext_students,   '3.6.4',   1689],
    ['MoUs',                    totals.mous,           '3.7.2',   8],
    ['ICT Classrooms',          totals.ict_classrooms, '4.1.3',   13],
    ['Computers',               totals.computers,      '4.3.2',   175],
    ['Govt Scholarships',       totals.govt_schol,     '5.1.1',   1363],
    ['NGO Scholarships',        totals.ngo_schol,      '5.1.2',   0],
    ['Career Guidance Students',totals.career_guid,    '5.1.4',   500],
    ['Students Placed',         totals.placed,         '5.2.1',   169],
    ['Higher Education',        totals.higher_edu,     '5.2.2',   118],
    ['NET/GATE Qualified',      totals.net_gate,       '5.2.3.1', 0],
    ['Awards',                  totals.awards,         '5.3.1',   21],
    ['Events Organised',        totals.events,         '5.3.3',   33],
    ['FDPs Organised',          totals.fdp_organised,  '6.3.3',   5],
    ['Teachers in FDPs',        totals.fdp_attended,   '6.3.4',   109],
    ['Value-Added Courses',     totals.vac,            '1.3.2',   22],
    ['VAC Students',            totals.vac_students,   '1.3.3',   740],
    ['Internship Students',     totals.internships,    '1.3.4',   1689],
  ];

  const csv = rows.map(r =>
    r.map(c => '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"').join(',')
  ).join('\n');

  // Save to Drive and log the URL
  const blob = Utilities.newBlob('\uFEFF' + csv, 'text/csv',
    'AQAR_Summary_' + stamp + '_SKR_GCW.csv');
  const file = DriveApp.getRootFolder().createFile(blob);

  Logger.log('═══════════════════════════════════════════════════');
  Logger.log('Summary CSV created: AQAR_Summary_' + stamp + '_SKR_GCW.csv');
  Logger.log('Download from Google Drive: ' + file.getUrl());
  Logger.log('OR use the Web App URL for live sync in the HTML tool');
  Logger.log('Submissions: ' + totals.submitted_count + '/' + DEPARTMENTS.length);
  Logger.log('═══════════════════════════════════════════════════');
}


// ═══════════════════════════════════════════════════════════
// SETUP ALL — run this ONCE after deployment
// Creates all triggers, backup folder, summary tab
// ═══════════════════════════════════════════════════════════
function setupAll() {
  // 1. Remove old triggers
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  // 2. Form submit trigger
  const formFiles = DriveApp.getFilesByName(
    'AQAR 2024-25 | HOD Department Data Collection | SKR & SKR GCW(A)'
  );
  if (formFiles.hasNext()) {
    const form = FormApp.openById(formFiles.next().getId());
    ScriptApp.newTrigger('onHODSubmit').forForm(form).onFormSubmit().create();
    Logger.log('✅ Form submit trigger set up.');
  } else {
    Logger.log('⚠️  Form not found by title. Email trigger not created.');
  }

  // 3. Daily backup trigger (midnight IST = 18:30 UTC)
  ScriptApp.newTrigger('backupAQARData')
    .timeBased().atHour(0).everyDays(1).inTimezone('Asia/Kolkata').create();
  Logger.log('✅ Daily midnight backup trigger set up.');

  // 4. Daily consolidation trigger (every morning 6 AM IST)
  ScriptApp.newTrigger('consolidate')
    .timeBased().atHour(6).everyDays(1).inTimezone('Asia/Kolkata').create();
  Logger.log('✅ Daily 6 AM consolidation trigger set up.');

  // 5. Create backup folder
  const folders = DriveApp.getFoldersByName(CFG.backupFolderName);
  const folder  = folders.hasNext() ? folders.next() : DriveApp.createFolder(CFG.backupFolderName);
  Logger.log('✅ Backup folder ready: ' + folder.getUrl());

  // 6. Run consolidation now
  consolidate();
  Logger.log('✅ Initial consolidation complete.');

  Logger.log('');
  Logger.log('═══════════════════════════════════════════════════════');
  Logger.log('SETUP COMPLETE! Now do these TWO things:');
  Logger.log('');
  Logger.log('1. DEPLOY AS WEB APP:');
  Logger.log('   Deploy → New Deployment → Web App');
  Logger.log('   Execute as: Me');
  Logger.log('   Who has access: Anyone');
  Logger.log('   Copy the Web App URL');
  Logger.log('');
  Logger.log('2. PASTE WEB APP URL into iqac-data-collector-v3.1.html:');
  Logger.log('   Find: WEB_APP_URL: \'\'');
  Logger.log('   Replace with your URL');
  Logger.log('═══════════════════════════════════════════════════════');
}


// ═══════════════════════════════════════════════════════════
// SUBMISSION STATUS REPORT — run anytime
// ═══════════════════════════════════════════════════════════
function generateSummaryReport() {
  try {
    const totals = getSummaryTotals();
    const stamp  = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const pct    = Math.round(totals.submitted_count / DEPARTMENTS.length * 100);

    Logger.log('══════════════════════════════════════════════════════');
    Logger.log('AQAR 2024-25 — HOD SUBMISSION STATUS');
    Logger.log(CFG.institution);
    Logger.log('As of: ' + stamp);
    Logger.log('══════════════════════════════════════════════════════');
    DEPARTMENTS.forEach(d => {
      Logger.log((totals.departments.includes(d) ? '✅  DONE    ' : '⏳  PENDING ') + d);
    });
    Logger.log('──────────────────────────────────────────────────────');
    Logger.log('Submitted : ' + totals.submitted_count + ' / ' + DEPARTMENTS.length);
    Logger.log('Pending   : ' + totals.pending_count + ' departments');
    Logger.log('Progress  : ' + pct + '%');
    Logger.log('══════════════════════════════════════════════════════');
    Logger.log('KEY TOTALS (from submitted depts):');
    Logger.log('Students Admitted   : ' + totals.admitted);
    Logger.log('Students Placed     : ' + totals.placed);
    Logger.log('Higher Education    : ' + totals.higher_edu);
    Logger.log('CARE Papers         : ' + totals.care_papers);
    Logger.log('Books & Chapters    : ' + totals.books);
    Logger.log('Teachers with PhD   : ' + totals.phd_teachers);
    Logger.log('Govt Scholarships   : ' + totals.govt_schol);
    Logger.log('MoUs                : ' + totals.mous);
    Logger.log('FDPs Attended       : ' + totals.fdp_attended);
    Logger.log('══════════════════════════════════════════════════════');
  } catch (err) {
    Logger.log('Error: ' + err.message + '\nRun createHODForm() first.');
  }
}


// ═══════════════════════════════════════════════════════════
// SEND REMINDERS — emails only pending departments
// Fill emailMap before running
// ═══════════════════════════════════════════════════════════
function sendReminders() {
  const emailMap = {
    'Computer Science'       : '',
    'Mathematics'            : '',
    'Physics'                : '',
    'Chemistry'              : '',
    'Botany'                 : '',
    'Zoology'                : '',
    'English'                : '',
    'Telugu'                 : '',
    'Hindi'                  : '',
    'Urdu'                   : '',
    'History'                : '',
    'Economics'              : '',
    'Political Science'      : '',
    'Sociology'              : '',
    'Commerce'               : '',
    'BA Computer Applications': '',
    'BCom CA'                : '',
    'Biotechnology'          : '',
    'Physical Education'     : '',
    'Library Science'        : '',
    'Psychology'             : '',
    'Statistics'             : '',
    'Geography'              : '',
    'NSS / NCC'              : '',
  };

  const totals  = getSummaryTotals();
  const formUrl = 'https://forms.gle/6DBaRZndVtpk8Ysk7';
  let sent = 0;

  totals.pending_depts.forEach(dept => {
    if (!emailMap[dept]) return;
    GmailApp.sendEmail(
      emailMap[dept],
      '⏰ REMINDER: AQAR 2024-25 Data Pending — ' + dept + ' | Deadline ' + CFG.deadline,
      'Dear HOD,\n\n'
      + 'Your department (' + dept + ') has not yet submitted AQAR 2024-25 data.\n\n'
      + 'Please fill the form at your earliest:\n'
      + formUrl + '\n\n'
      + 'Deadline: ' + CFG.deadline + '\n'
      + 'Time needed: approx. 15 minutes\n\n'
      + 'Contact IQAC for any help:\n'
      + 'Dr. C.V. Krishnaveni | 9490519982 | ' + CFG.iqacEmail + '\n\n'
      + 'Regards,\nDr. C.V. Krishnaveni\nIQAC Coordinator\nSKR & SKR GCW(A), Kadapa'
    );
    Logger.log('Reminder sent: ' + dept + ' → ' + emailMap[dept]);
    sent++;
  });

  Logger.log('Done. Reminders sent: ' + sent);
  if (sent === 0) Logger.log('No reminders sent. Either all submitted or email map is empty.');
}

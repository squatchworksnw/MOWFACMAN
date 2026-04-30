// If this Apps Script is not opened from inside your Google Sheet,
// paste the Sheet ID between the quotes below.
// Example Sheet URL:
// https://docs.google.com/spreadsheets/d/SHEET_ID_IS_HERE/edit
const SPREADSHEET_ID = "";

const SHEET_TABS = {
  projects: "Projects",
  rooms: "Rooms",
  tasks: "Tasks",
  materials: "Materials",
  bids: "ContractorBids",
  expenses: "Budget",
  decisions: "Decisions",
  maintenanceCalendar: "MaintenanceCalendar",
  recurringMaintenance: "RecurringMaintenance",
  fleetSchedule: "FleetSchedule",
  fleetVehicles: "FleetMaster",
  equipment: "Equipment",
  mileageLog: "MileageLog",
  repairLog: "RepairLog",
  walkthroughChecklist: "WalkthroughChecklist",
  documentIntake: "DocumentIntake",
  contractorLibrary: "ContractorLibrary",
  extractedLineItems: "ExtractedLineItems",
  reports: "Reports",
  syncLog: "SyncLog"
};

function doGet(e) {
  try {
    const payload = loadState_();
    return output_(payload, e);
  } catch (error) {
    return output_({ ok: false, error: String(error && error.message || error) }, e);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse((e.postData && e.postData.contents) || "{}");
    const now = new Date().toISOString();
    data.syncMeta = Object.assign({}, data.syncMeta || {}, {
      lastUpdated: data.syncMeta && data.syncMeta.lastUpdated || now,
      lastSyncedAt: now,
      appVersion: data.syncMeta && data.syncMeta.appVersion || "mowfac-ops"
    });
    saveState_(data);
    return output_({ ok: true, syncMeta: data.syncMeta }, e);
  } catch (error) {
    return output_({ ok: false, error: String(error && error.message || error) }, e);
  }
}

function loadState_() {
  const ss = getSpreadsheet_();
  const settings = ensureSheet_(ss, "AppSettings");
  const rows = settings.getDataRange().getValues();
  const stateRow = rows.find((row) => row[0] === "stateJson");
  if (!stateRow || !stateRow[1]) return { syncMeta: { status: "No Google save found" } };
  return JSON.parse(stateRow[1]);
}

function saveState_(state) {
  const ss = getSpreadsheet_();
  writeSettings_(ss, state);
  Object.keys(SHEET_TABS).forEach((collection) => {
    writeCollection_(ss, SHEET_TABS[collection], state[collection] || []);
  });
}

function getSpreadsheet_() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("No spreadsheet found. Paste your Google Sheet ID into SPREADSHEET_ID at the top of this Apps Script file.");
  return ss;
}

function output_(payload, e) {
  const text = JSON.stringify(payload);
  const callback = e && e.parameter && e.parameter.callback;
  if (callback) {
    return ContentService.createTextOutput(`${callback}(${text});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
}

function writeSettings_(ss, state) {
  const sheet = ensureSheet_(ss, "AppSettings");
  sheet.clearContents();
  sheet.getRange(1, 1, 4, 2).setValues([
    ["key", "value"],
    ["stateJson", JSON.stringify(state)],
    ["lastUpdated", state.syncMeta && state.syncMeta.lastUpdated || ""],
    ["lastSyncedAt", state.syncMeta && state.syncMeta.lastSyncedAt || ""]
  ]);
}

function writeCollection_(ss, name, rows) {
  const sheet = ensureSheet_(ss, name);
  sheet.clearContents();
  const headers = unique_(["id", "createdAt", "updatedAt", "updatedByDevice", "status", "notes"].concat(rows.flatMap((row) => Object.keys(row || {}))));
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (!rows.length) return;
  const values = rows.map((row) => headers.map((header) => cellValue_(row && row[header])));
  sheet.getRange(2, 1, values.length, headers.length).setValues(values);
}

function ensureSheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function unique_(values) {
  return values.filter((value, index) => value && values.indexOf(value) === index);
}

function cellValue_(value) {
  if (value == null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

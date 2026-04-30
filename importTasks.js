function importFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const content = e.target.result;

    if (file.name.endsWith(".json")) {
      importJSON(content);
    } else if (file.name.endsWith(".csv")) {
      importCSV(content);
    } else {
      alert("Unsupported file type.");
    }
  };

  reader.readAsText(file);
}

function importJSON(content) {
  try {
    const data = JSON.parse(content);
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    data.forEach(item => {
      tasks.push({
        id: Date.now() + Math.random(),
        title: item.Task || "",
        phase: item.Phase || "",
        description: item.Description || "",
        location: item.Area || "",
        priority: item.Priority || "Medium",
        status: item.Status || "Not Started",
        estimate: item["Est Cost"] || "",
        actualCost: item["Actual Cost"] || "",
        notes: item.Notes || "",
        createdAt: new Date().toISOString()
      });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    alert("Import successful!");
    location.reload();

  } catch (err) {
    console.error(err);
    alert("JSON import failed.");
  }
}

function importCSV(content) {
  const rows = content.split("\\n").map(r => r.split(","));
  const headers = rows[0];

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;

    let item = {};
    headers.forEach((h, idx) => {
      item[h.trim()] = row[idx];
    });

    tasks.push({
      id: Date.now() + Math.random(),
      title: item.Task || "",
      phase: item.Phase || "",
      description: item.Description || "",
      location: item.Area || "",
      priority: item.Priority || "Medium",
      status: item.Status || "Not Started",
      estimate: item["Est Cost"] || "",
      actualCost: item["Actual Cost"] || "",
      notes: item.Notes || ""
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  alert("CSV imported!");
  location.reload();
}

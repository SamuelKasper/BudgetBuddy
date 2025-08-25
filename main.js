// load or create data on load
document.addEventListener("DOMContentLoaded", async (event) => {
  let data = getDataFromSession();
  if (!data) {
    data = await readJson();
    saveData(data);
  }
  createEntries(data);
});

/**
 * Refresh if balance in preview changes
 */
let current = document.getElementById("bbuddy__preview-current");
current.addEventListener("input", (event) => {
  let data = getDataFromSession();
  createEntries(data);
});

/**
 * Read uplaoded file and save in session
 */
let fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      saveData(data);
    } catch (err) {
      console.error("Fehler beim Parsen der JSON-Datei:", err);
    }
  };
  reader.readAsText(file);

  let data = getDataFromSession();
  createEntries(data);
});

/**
 * Get data from session
 */
function getDataFromSession() {
  const data = sessionStorage.getItem("bbuddy");
  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
}

/**
 * Save data in session
 */
function saveData(data) {
  sessionStorage.setItem("bbuddy", JSON.stringify(data));
  createEntries(data);
}

/**
 * Baut das HTML für die Einträge
 */
function createEntries(data) {
  let intakeItemsEl = document.querySelector(".bbuddy__intake-items");
  let essentialsEl = document.querySelector(
    ".bbuddy__essential > .bbuddy__output-items"
  );
  let importantEl = document.querySelector(
    ".bbuddy__important > .bbuddy__output-items"
  );
  let entertainmentEl = document.querySelector(
    ".bbuddy__entertainment > .bbuddy__output-items"
  );
  intakeItemsEl.innerHTML = "";
  essentialsEl.innerHTML = "";
  importantEl.innerHTML = "";
  entertainmentEl.innerHTML = "";

  let intakes = data?.intake;
  let outputs = data?.output;
  let essentials = outputs?.essential;
  let important = outputs?.important;
  let entertainment = outputs?.entertainment;
  let intakeTotal = 0;
  let outputTotal = 0;

  intakes.forEach((intake) => {
    addIntake(intake?.name, intake?.value);
    intakeTotal += Number(intake?.value);
  });

  essentials.forEach((output) => {
    addOutput(output?.name, "essential", output?.value);
    outputTotal += Number(output?.value);
  });

  important.forEach((output) => {
    addOutput(output?.name, "important", output?.value);
    outputTotal += Number(output?.value);
  });

  entertainment.forEach((output) => {
    addOutput(output?.name, "entertainment", output?.value);
    outputTotal += Number(output?.value);
  });

  calculateBalance(intakeTotal, outputTotal);

  let removeBtns = [...document.querySelectorAll(".bbuddy__remove")];
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const parent = e.target.parentElement;
      const name = parent.querySelector(".bbuddy__intakte-name").innerText;
      let data = getDataFromSession();
      data = deleteByName(data, name);
      saveData(data);
      createEntries(data);
    });
  });
}

/**
 * Berechnet die Bilanz
 */
function calculateBalance(intakeTotal, outputTotal) {
  let balance = 0;
  balance = intakeTotal - outputTotal;

  let totalIntakeEl = document.querySelector(".bbuddy__total-intake-value");
  totalIntakeEl.innerText = intakeTotal + "€";

  let totalOutputEl = document.querySelector(".bbuddy__total-output-value");
  totalOutputEl.innerText = outputTotal + "€";

  let totalBalanceEl = document.querySelector(".bbuddy__total-balance-value");
  totalBalanceEl.innerText = balance.toFixed(2) + "€";

  createPreview(balance);
}

function createPreview(balance) {
  let current = document.getElementById("bbuddy__preview-current").value ?? 0;
  if (!typeof current === "number") {
    current = 0;
  }

  let wrapper = document.querySelector(".bbuddy__preview");
  wrapper.innerHTML = "";
  let newBalance = Number(Number(current) + Number(balance));

  for (let i = 1; i <= 12; i++) {
    let previewMonth = document.createElement("p");
    previewMonth.classList.add("bbuddy__preview-moth");
    if (i == 1) {
      previewMonth.innerText = i + " Monat";
    } else {
      previewMonth.innerText = i + " Monate";
    }

    let previewValue = document.createElement("p");
    previewValue.classList.add("bbuddy__preview-value");
    previewValue.innerText = newBalance.toFixed(2) + "€";

    let row = document.createElement("div");
    row.classList.add("bbuddy__preview-row");

    row.appendChild(previewMonth);
    row.appendChild(previewValue);
    wrapper.appendChild(row);

    newBalance += balance;
  }
}

/**
 * Fügt die Einträge für die Einnahme hinzu
 */
async function addIntake(name, value) {
  let intakeItems = document.querySelector(".bbuddy__intake-items");
  value = Number(value.replace(',', '.'));

  let buttonSpan = document.createElement("span");
  buttonSpan.classList.add("visually-hidden");
  buttonSpan.innerText = "Entfernen";

  let button = document.createElement("button");
  button.classList.add("bbuddy__remove");
  button.type = "button";
  button.appendChild(buttonSpan);
  button.innerHTML = "-";

  let intakeValue = document.createElement("p");
  intakeValue.classList.add("bbuddy__intakte-value");
  intakeValue.innerText = value + "€";

  let intakeName = document.createElement("p");
  intakeName.classList.add("bbuddy__intakte-name");
  intakeName.innerText = name;

  let item = document.createElement("div");
  item.classList.add("bbuddy__intake-item");

  item.appendChild(intakeName);
  item.appendChild(intakeValue);
  item.appendChild(button);
  intakeItems.appendChild(item);
}

/**
 * Fügt die Einträge für die Ausgaben hinzu
 */
async function addOutput(name, type, value) {
  let essentials = document.querySelector(
    ".bbuddy__essential > .bbuddy__output-items"
  );
  let important = document.querySelector(
    ".bbuddy__important > .bbuddy__output-items"
  );
  let entertainment = document.querySelector(
    ".bbuddy__entertainment > .bbuddy__output-items"
  );

  let buttonSpan = document.createElement("span");
  buttonSpan.classList.add("visually-hidden");
  buttonSpan.innerText = "Entfernen";

  let button = document.createElement("button");
  button.classList.add("bbuddy__remove");
  button.type = "button";
  button.appendChild(buttonSpan);
  button.innerHTML = "-";

  let intakeValue = document.createElement("p");
  intakeValue.classList.add("bbuddy__intakte-value");
  intakeValue.innerText = value + "€";

  let intakeName = document.createElement("p");
  intakeName.classList.add("bbuddy__intakte-name");
  intakeName.innerText = name;

  let outputItems = null;
  if (type == "essential") {
    outputItems = essentials;
  } else if (type == "important") {
    outputItems = important;
  } else if (type == "entertainment") {
    outputItems = entertainment;
  }

  let item = document.createElement("div");
  item.classList.add("bbuddy__output-item");

  item.appendChild(intakeName);
  item.appendChild(intakeValue);
  item.appendChild(button);
  if (outputItems) {
    outputItems.appendChild(item);
  }
}

/**
 * Fügt neue Einnahme Daten der Session hinzu
 */
function addIntakeToSession() {
  let data = getDataFromSession();
  let name = document.getElementById("bbuddy__add-intake-name").value;
  let value = document.getElementById("bbuddy__add-intake-price").value;
  data.intake.push({ name: name, value: value });
  saveData(data);
}

/**
 * Fügt neue Ausgabe Daten der Session hinzu
 */
function addOutputToSession() {
  let data = getDataFromSession();
  let name = document.getElementById("bbuddy__add-output-name").value;
  let type = document.getElementById("bbuddy__add-output-type").value;
  let value = document.getElementById("bbuddy__add-output-price").value;

  if (type == "entertainment") {
    data.output.entertainment.push({ name: name, value: value });
  } else if (type == "essential") {
    data.output.essential.push({ name: name, value: value });
  } else if (type == "important") {
    data.output.important.push({ name: name, value: value });
  }

  saveData(data);
}

/**
 * Entfernt ein Eintrag aus dem Array anhand des namens
 */
function deleteByName(obj, targetName) {
  for (let key in obj) {
    if (Array.isArray(obj[key])) {
      // Falls es ein Array ist → alle Elemente filtern
      obj[key] = obj[key].filter((entry) => entry.name !== targetName);
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      // Falls es ein verschachteltes Objekt ist → rekursiv weiter suchen
      deleteByName(obj[key], targetName);
    }
  }
  return obj;
}

/**
 * Export json file
 */
function exportJson() {
  let data = getDataFromSession();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "budgetBuddy.json";
  a.click();

  URL.revokeObjectURL(url);
}

async function readJson() {
  let response = await fetch("budgetBuddy.json");
  return await response.json();
}

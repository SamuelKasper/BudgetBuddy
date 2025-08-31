// TODO Umbauen das bei dashboard daten geladen werden!
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

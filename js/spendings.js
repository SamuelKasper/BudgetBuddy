document.addEventListener("DOMContentLoaded", async (event) => {
  let data = getSpendingData();
  if (!data) {
    data = {
      spending: {
        essential: [
          {
            name: "Kein Eintrag",
            value: "0",
          },
        ],
        important: [
          {
            name: "Kein Eintrag",
            value: "0",
          },
        ],
        entertainment: [
          {
            name: "Kein Eintrag",
            value: "0",
          },
        ],
      },
    };
    saveSpendingData(data);
  }

  createEntries(data);
});

document
  .getElementById("bbuddy__add-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    addSpendingToSession();
  });

/**
 * Save intake data in session
 */
function saveSpendingData(data) {
  sessionStorage.setItem("bbuddy-spending", JSON.stringify(data));
  createEntries(data);
}

/** Load intake data from session */
function getSpendingData() {
  let data = sessionStorage.getItem("bbuddy-spending");
  if (data) {
    return JSON.parse(data);
  } else {
    data = {
      spending: {
        essential: [
          {
            name: "Kein Eintrag",
            value: "0",
          },
        ],
        important: [
          {
            name: "Kein Eintrag",
            value: "0",
          },
        ],
        entertainment: [
          {
            name: "Kein Eintrag",
            value: "0",
          },
        ],
      },
    };
    saveSpendingData(data);
    return data;
  }
}

/**
 * Fügt neue Einnahme Daten der Session hinzu
 */
function addSpendingToSession() {
  let data = getSpendingData();
  let name = document.getElementById("bbuddy__add-output-name").value;
  let type = document.getElementById("bbuddy__add-output-type").value;
  let value = document.getElementById("bbuddy__add-output-price").value;

  if (type == "entertainment") {
    data.spending.entertainment.push({ name: name, value: value });
  } else if (type == "essential") {
    data.spending.essential.push({ name: name, value: value });
  } else if (type == "important") {
    data.spending.important.push({ name: name, value: value });
  }

  saveSpendingData(data);
}

/**
 * Fügt die Einträge dem HTML hinzu
 */
/**
 * Fügt die Einträge für die Ausgaben hinzu
 */
async function addSpending(name, type, value) {
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
  button.innerHTML =
    "<svg viewBox='0 0 640 640'><path d='M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C221.6 240.4 221.6 255.6 231 264.9L286 319.9L231 374.9C221.6 384.3 221.6 399.5 231 408.8C240.4 418.1 255.6 418.2 264.9 408.8L319.9 353.8L374.9 408.8C384.3 418.2 399.5 418.2 408.8 408.8C418.1 399.4 418.2 384.2 408.8 374.9L353.8 319.9L408.8 264.9C418.2 255.5 418.2 240.3 408.8 231C399.4 221.7 384.2 221.6 374.9 231L319.9 286L264.9 231C255.5 221.6 240.3 221.6 231 231z'/></svg>";

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
 * Baut das HTML für die Einträge
 */
function createEntries(data) {
  let essentialsEl = document.querySelector(
    ".bbuddy__essential > .bbuddy__output-items"
  );
  let importantEl = document.querySelector(
    ".bbuddy__important > .bbuddy__output-items"
  );
  let entertainmentEl = document.querySelector(
    ".bbuddy__entertainment > .bbuddy__output-items"
  );

  essentialsEl.innerHTML = "";
  importantEl.innerHTML = "";
  entertainmentEl.innerHTML = "";

  let outputs = data?.spending;
  let essentials = outputs?.essential;
  let important = outputs?.important;
  let entertainment = outputs?.entertainment;
  let outputTotal = 0;

  essentials.forEach((spending) => {
    addSpending(spending?.name, "essential", spending?.value);
    outputTotal += Number(spending?.value);
  });

  important.forEach((spending) => {
    addSpending(spending?.name, "important", spending?.value);
    outputTotal += Number(spending?.value);
  });

  entertainment.forEach((spending) => {
    addSpending(spending?.name, "entertainment", spending?.value);
    outputTotal += Number(spending?.value);
  });

  sessionStorage.setItem("spendingsTotal", outputTotal);

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

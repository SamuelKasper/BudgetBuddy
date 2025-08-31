// Onload
document.addEventListener("DOMContentLoaded", async (event) => {
  calculateTotal();
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
      calculateTotal();
    } catch (err) {
      console.error("Fehler beim Parsen der JSON-Datei:", err);
    }
  };
  reader.readAsText(file);
});

function saveData(data) {
  let intake = data.intake;
  let spending = data.output;
  sessionStorage.setItem("bbuddy-intake", JSON.stringify(intake));
  sessionStorage.setItem("bbuddy-spending", JSON.stringify(spending));
}

function calculateTotal() {
  let intakes = JSON.parse(sessionStorage.getItem("bbuddy-intake"));
  let spendings = JSON.parse(sessionStorage.getItem("bbuddy-spending"));

  let essentials = spendings?.essential;
  let important = spendings?.important;
  let entertainment = spendings?.entertainment;
  let outputTotal = 0;
  let intakeTotal = 0;

  intakes.forEach((intake) => {
    intakeTotal += Number(intake?.value);
  });

  essentials.forEach((spending) => {
    outputTotal += Number(spending?.value);
  });

  important.forEach((spending) => {
    outputTotal += Number(spending?.value);
  });

  entertainment.forEach((spending) => {
    outputTotal += Number(spending?.value);
  });

  sessionStorage.setItem("spendingsTotal", outputTotal.toFixed(2));
  sessionStorage.setItem("intakesTotal", intakeTotal.toFixed(2));
  let balance = intakeTotal - outputTotal;
  sessionStorage.setItem("balance", balance.toFixed(2));

  // Write in HTML
  let dashboardIntake = document.getElementById("bbuddy__dashboard-intake");
  if (dashboardIntake) {
    dashboardIntake.innerText = intakeTotal + "€";
  }

  let dashboardOutput = document.getElementById("bbuddy__dashboard-output");
  if (dashboardOutput) {
    dashboardOutput.innerText = outputTotal + "€";
  }

  let dashboardBalance = document.getElementById("bbuddy__dashboard-balance");
  if (dashboardBalance) {
    dashboardBalance.innerText = balance + "€";
  }

  let balanceEl = document.querySelector(".bbuddy__dashboard-item--balance");

  if (balanceEl && balance && balance > 0) {
    balanceEl.classList.add("bbuddy__dashboard-item--positive");
  } else if (balance && balance < 0) {
    balanceEl.classList.add("bbuddy__dashboard-item--negative");
  }
}

function deleteEntry(obj, id) {
  for (let key in obj) {
    if (Array.isArray(obj[key])) {
      // Falls es ein Array ist → alle Elemente filtern
      obj[key] = obj[key].filter((entry) => entry.id !== id);
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      // Falls es ein verschachteltes Objekt ist → rekursiv weiter suchen
      deleteEntry(obj[key], id);
    }
  }
  return obj;
}

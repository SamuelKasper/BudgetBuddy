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

  for (let key in intakes) {
    intakeTotal += Number(intakes[key].value);
  }

  for (let key in essentials) {
    outputTotal += Number(essentials[key].value);
  }

  for (let key in important) {
    outputTotal += Number(important[key].value);
  }

  for (let key in entertainment) {
    outputTotal += Number(entertainment[key].value);
  }

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
  } else if (balanceEl && balance && balance < 0) {
    balanceEl.classList.add("bbuddy__dashboard-item--negative");
  }
}

function deleteEntry(obj, id) {
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      obj[key] = obj[key].filter((item) => item.id !== id);
    }else{
      obj = obj.filter(item => item.id !== id);
    }
  }
  return obj;
}

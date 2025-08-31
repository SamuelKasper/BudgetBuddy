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
  let flex = spendings?.flex;
  let outputTotal = 0;
  let outputTotalFlex = 0;
  let intakeTotal = 0;

  for (let key in intakes) {
    intakeTotal += Number(intakes[key].value);
  }

  for (let key in essentials) {
    outputTotal += Number(essentials[key].value);
    outputTotalFlex += Number(essentials[key].value);
  }

  for (let key in important) {
    outputTotal += Number(important[key].value);
    outputTotalFlex += Number(important[key].value);
  }

  for (let key in entertainment) {
    outputTotal += Number(entertainment[key].value);
    outputTotalFlex += Number(entertainment[key].value);
  }

  for (let key in flex) {
    outputTotalFlex += Number(flex[key].value);
  }

  sessionStorage.setItem("spendingsTotal", outputTotal.toFixed(2));
  sessionStorage.setItem("intakesTotal", intakeTotal.toFixed(2));
  let balance = intakeTotal - outputTotal;
  let balanceFlex = intakeTotal - outputTotalFlex;
  sessionStorage.setItem("balance", balance.toFixed(2));
  sessionStorage.setItem("balanceFlex", balanceFlex.toFixed(2));

  // Write in HTML
  let dashboardIntake = document.getElementById("bbuddy__dashboard-intake");
  if (dashboardIntake) {
    dashboardIntake.innerText = intakeTotal + "€";
  }

  let dashboardOutput = document.getElementById("bbuddy__dashboard-output");
  if (dashboardOutput) {
    dashboardOutput.innerText = outputTotalFlex + "€";
  }

  let dashboardBalance = document.getElementById("bbuddy__dashboard-balance");
  if (dashboardBalance) {
    dashboardBalance.innerText = balance + "€";
  }

  let dashboardBalanceFlex = document.getElementById("bbuddy__dashboard-balance-flex");
  if (dashboardBalanceFlex) {
    dashboardBalanceFlex.innerText = balanceFlex.toFixed(2) + "€";
  }

  let balanceEl = document.querySelector(".bbuddy__dashboard-item--balance");
  if (balanceEl && balance && balance > 0) {
    balanceEl.classList.add("bbuddy__dashboard-item--positive");
  } else if (balanceEl && balance && balance < 0) {
    balanceEl.classList.add("bbuddy__dashboard-item--negative");
  }
  
  let balanceFlexEl = document.querySelector(".bbuddy__dashboard-item--balance-flex");
  if (balanceFlexEl && balanceFlex && balanceFlex > 0) {
    balanceFlexEl.classList.add("bbuddy__dashboard-item--positive");
  } else if (balanceFlexEl && balanceFlex && balanceFlex < 0) {
    balanceFlexEl.classList.add("bbuddy__dashboard-item--negative");
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

function exportJson() {
  let spending = JSON.parse(sessionStorage.getItem('bbuddy-spending'));
  let intake = JSON.parse(sessionStorage.getItem('bbuddy-intake'));
  let data = {
    "intake":intake,
    'output':spending,
  };
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

// Onload
document.addEventListener("DOMContentLoaded", async (event) => {
  let balance = Number(sessionStorage.getItem('balance')) ?? 0;
  createPreview(balance);
});

// OnChange
let current = document.getElementById("bbuddy__preview-current");
current.addEventListener("input", (event) => {
    let balance = Number(sessionStorage.getItem('balance')) ?? 0;
    createPreview(balance);
});

function createPreview(balance) {
  let currentMonth = new Date().getMonth();
  const monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const upcomingMonths = Array.from({ length: 12 }, (_, i) => {
    return monate[(currentMonth + i) % 12];
  });

  let current = document.getElementById("bbuddy__preview-current").value ?? 0;
  if (!typeof current === "number") {
    current = 0;
  }

  let wrapper = document.querySelector(".bbuddy__preview");
  wrapper.innerHTML = "";
  let newBalance = Number(Number(current) + Number(balance));

  for (let i = 0; i <= 11; i++) {
    let previewMonth = document.createElement("p");
    previewMonth.classList.add("bbuddy__preview-moth");
    previewMonth.innerText = upcomingMonths[i];

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
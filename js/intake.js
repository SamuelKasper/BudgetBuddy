// Onload
document.addEventListener("DOMContentLoaded", async (event) => {
  let data = getIntakes();
  intakesHandler(data);
});

// Hinzufügen
document
  .getElementById("bbuddy__add-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    setIntakes();
  });

function setIntakes() {
  let data = getIntakes();
  let name = document.getElementById("bbuddy__add-intake-name").value;
  let value = document.getElementById("bbuddy__add-intake-price").value;
  let uuid = self.crypto.randomUUID();
  data.intake.push({ id: uuid, name: name, value: value });
  sessionStorage.setItem("bbuddy-intake", JSON.stringify(data));
  intakesHandler(data);
}

function getIntakes() {
  let data = sessionStorage.getItem("bbuddy-intake");
  return JSON.parse(data) ?? {'intake':[]};
}

function intakesHandler(data) {
  if ("intake" in data) {
    let intakeItems = document.querySelector(".bbuddy__intake-items");
    intakeItems.innerHTML = '';
    let intakes = data.intake;
    let intakeTotal = 0;

    intakes.forEach((intake) => {
      createIntaktesHtml(intakeItems, intake?.name, intake?.value, intake?.id);
      intakeTotal += Number(intake?.value);
    });

    sessionStorage.setItem("intakesTotal", intakeTotal);

    let removeBtns = [...document.querySelectorAll(".bbuddy__remove")];
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        let id = e.target.dataset.id;
        let data = getIntakes();
        data = deleteEntry(data, id);
        sessionStorage.setItem("bbuddy-intake", JSON.stringify(data));
        intakesHandler(data);
      });
    });
  }
}

async function createIntaktesHtml(intakeItems, name, value, id) {
  value = Number(value.toString().replace(",", "."));

  let buttonSpan = document.createElement("span");
  buttonSpan.classList.add("visually-hidden");
  buttonSpan.innerText = "Entfernen";

  let button = document.createElement("button");
  button.setAttribute("data-id", id);
  button.classList.add("bbuddy__remove");
  button.type = "button";
  button.appendChild(buttonSpan);
  button.innerHTML =
    "<svg class='bbuddy__remove-svg' viewBox='0 0 640 640'><path d='M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C221.6 240.4 221.6 255.6 231 264.9L286 319.9L231 374.9C221.6 384.3 221.6 399.5 231 408.8C240.4 418.1 255.6 418.2 264.9 408.8L319.9 353.8L374.9 408.8C384.3 418.2 399.5 418.2 408.8 408.8C418.1 399.4 418.2 384.2 408.8 374.9L353.8 319.9L408.8 264.9C418.2 255.5 418.2 240.3 408.8 231C399.4 221.7 384.2 221.6 374.9 231L319.9 286L264.9 231C255.5 221.6 240.3 221.6 231 231z'/></svg>";

  let intakeValue = document.createElement("p");
  intakeValue.classList.add("bbuddy__intakte-value");
  intakeValue.innerText = value + "€";

  let intakeName = document.createElement("p");
  intakeName.classList.add("bbuddy__intakte-name");
  intakeName.innerText = name;

  let itemWrapper = document.createElement("div");
  itemWrapper.classList.add("bbuddy__intake-item-wrapper");

  let item = document.createElement("div");
  item.classList.add("bbuddy__intake-item");

  itemWrapper.appendChild(intakeName);
  itemWrapper.appendChild(intakeValue);
  item.appendChild(itemWrapper);
  item.appendChild(button);
  intakeItems.appendChild(item);
}

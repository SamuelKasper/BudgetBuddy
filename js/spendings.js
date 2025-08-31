// Onload
document.addEventListener("DOMContentLoaded", async (event) => {
  let data = getSpendings();
  spendingsHandler(data);
});

// Hinzufügen
document
  .getElementById("bbuddy__add-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    setSpendings();
  });

function setSpendings() {
  let data = getSpendings();
  let name = document.getElementById("bbuddy__add-output-name").value;
  let value = document.getElementById("bbuddy__add-output-price").value;
  let type = document.getElementById("bbuddy__add-output-type").value;
  let uuid = self.crypto.randomUUID();
  if (type == "essential") {
    data.essential.push({ id: uuid, name: name, value: value });
  } else if (type == "important") {
    data.important.push({ id: uuid, name: name, value: value });
  } else if (type == "entertainment") {
    data.entertainment.push({ id: uuid, name: name, value: value });
  }
  sessionStorage.setItem("bbuddy-spending", JSON.stringify(data));
  spendingsHandler(data);
}

function getSpendings() {
  let data = sessionStorage.getItem("bbuddy-spending");
  return (
    JSON.parse(data) ?? {
      essential: [], important: [], entertainment: [],
    }
  );
}

async function createSpendingsHtml(name, type, value, id) {
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
  button.setAttribute("data-id", id);
  button.classList.add("bbuddy__remove");
  button.type = "button";
  button.appendChild(buttonSpan);
  button.innerHTML =
    "<svg  class='bbuddy__remove-svg' viewBox='0 0 640 640'><path d='M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C221.6 240.4 221.6 255.6 231 264.9L286 319.9L231 374.9C221.6 384.3 221.6 399.5 231 408.8C240.4 418.1 255.6 418.2 264.9 408.8L319.9 353.8L374.9 408.8C384.3 418.2 399.5 418.2 408.8 408.8C418.1 399.4 418.2 384.2 408.8 374.9L353.8 319.9L408.8 264.9C418.2 255.5 418.2 240.3 408.8 231C399.4 221.7 384.2 221.6 374.9 231L319.9 286L264.9 231C255.5 221.6 240.3 221.6 231 231z'/></svg>";

  let spendingValue = document.createElement("p");
  spendingValue.classList.add("bbuddy__intakte-value");
  spendingValue.innerText = value + "€";

  let spendingName = document.createElement("p");
  spendingName.classList.add("bbuddy__intakte-name");
  spendingName.innerText = name;

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

  item.appendChild(spendingName);
  item.appendChild(spendingValue);
  item.appendChild(button);
  if (outputItems) {
    outputItems.appendChild(item);
  }
}

function spendingsHandler(data) {
  if (
    "essential" in data &&
    "important" in data &&
    "entertainment" in data
  ) {
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

    let essentials = data?.essential;
    let important = data?.important;
    let entertainment = data?.entertainment;
    let outputTotal = 0;

    for(let key in essentials) {
      createSpendingsHtml(
        essentials[key].name,
        "essential",
        essentials[key].value,
        essentials[key].id
      );
      outputTotal += Number(essentials[key].value);
    };

    for(let key in important) {
      createSpendingsHtml(
        important[key].name,
        "important",
        important[key].value,
        important[key].id
      );
      outputTotal += Number(important[key].value);
    };

    for(let key in entertainment) {
      createSpendingsHtml(
        entertainment[key].name,
        "entertainment",
        entertainment[key].value,
        entertainment[key].id
      );
      outputTotal += Number(entertainment[key].value);
    };

    sessionStorage.setItem("spendingsTotal", outputTotal);

    let removeBtns = [...document.querySelectorAll(".bbuddy__remove")];
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        let id = e.target.dataset.id;
        let data = getSpendings();
        data = deleteEntry(data, id);
        sessionStorage.setItem("bbuddy-spending", JSON.stringify(data));
        spendingsHandler(data);
      });
    });
  }
}

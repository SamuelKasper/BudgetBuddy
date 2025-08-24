document.addEventListener("DOMContentLoaded", async (event) => {
    let data = await readJson();
    createEntries(data);
})

/**
 * Baut das HTML für die Einträge
 */
function createEntries(data){
    let intakes = data?.intake;
    let outputs = data?.output;
    let essentials = outputs?.essential;
    let important = outputs?.important;
    let entertainment = outputs?.entertainment;

    intakes.forEach(intake => {
        addIntake(intake?.name, intake?.value)
    });

    essentials.forEach(essentials => {
        addOutput(essentials?.name, 'essential', essentials?.value)
    });

    important.forEach(important => {
        addOutput(important?.name, 'important', important?.value)
    });

    entertainment.forEach(entertainment => {
        addOutput(entertainment?.name, 'entertainment', entertainment?.value)
    });
}

/**
 * Fügt die Einträge für die Einnahme hinzu
 */
async function addIntake(name, value) {
    let intakeItems = document.querySelector('.bbuddy__intake-items');

    let buttonSpan = document.createElement('span');
    buttonSpan.classList.add('visually-hidden');
    buttonSpan.innerText = 'Entfernen';

    let button = document.createElement('button');
    button.classList.add('bbuddy__remove');
    button.type = "button";
    button.appendChild(buttonSpan);
    button.innerHTML = "-";

    let intakeValue = document.createElement('p');
    intakeValue.classList.add('bbuddy__intakte-value');
    intakeValue.innerText = value + '€';

    let intakeName = document.createElement('p');
    intakeName.classList.add('bbuddy__intakte-name');
    intakeName.innerText = name;

    let item = document.createElement('div');
    item.classList.add('bbuddy__intake-item');

    item.appendChild(intakeName);
    item.appendChild(intakeValue);
    item.appendChild(button);
    intakeItems.appendChild(item);
}

/**
 * Fügt die Einträge für die Ausgaben hinzu
 */
async function addOutput(name, type, value) {
    let essentials = document.querySelector('.bbuddy__essential > .bbuddy__output-items');
    let important = document.querySelector('.bbuddy__important > .bbuddy__output-items');
    let entertainment = document.querySelector('.bbuddy__entertainment > .bbuddy__output-items');

    let buttonSpan = document.createElement('span');
    buttonSpan.classList.add('visually-hidden');
    buttonSpan.innerText = 'Entfernen';

    let button = document.createElement('button');
    button.classList.add('bbuddy__remove');
    button.type = "button";
    button.appendChild(buttonSpan);
    button.innerHTML = '-';

    let intakeValue = document.createElement('p');
    intakeValue.classList.add('bbuddy__intakte-value');
    intakeValue.innerText = value + '€';

    let intakeName = document.createElement('p');
    intakeName.classList.add('bbuddy__intakte-name');
    intakeName.innerText = name;

    let outputItems = null;
    if(type == 'essential'){
        outputItems = essentials;
    }else if(type == 'important') {
        outputItems = important;
    }else if(type == 'entertainment') {
        outputItems = entertainment;
    }

    let item = document.createElement('div');
    item.classList.add('bbuddy__output-item');

    item.appendChild(intakeName);
    item.appendChild(intakeValue);
    item.appendChild(button);
    if(outputItems){
        outputItems.appendChild(item);
    }
}

/**
 * Fügt neue Einnahme Daten der json hinzu
 */
function addIntakeToJson() {

}

/**
 * Fügt neue Ausgabe Daten der json hinzu
 */
function addOutputToJson() {

}

/**
 * Export json file
 */
function exportJson() {

}

/**
 * Import json file
 */
function importJson() {
    
}

async function readJson() {
  let response = await fetch("budgetBuddy.json");
  return await response.json();
}
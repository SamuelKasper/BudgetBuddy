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
    let intakeTotal = 0;
    let outputTotal = 0;

    intakes.forEach(intake => {
        addIntake(intake?.name, intake?.value)
        intakeTotal += intake?.value;
    });

    essentials.forEach(output => {
        addOutput(output?.name, 'essential', output?.value)
        outputTotal += output?.value;
    });

    important.forEach(output => {
        addOutput(output?.name, 'important', output?.value)
        outputTotal += output?.value;
    });

    entertainment.forEach(output => {
        addOutput(output?.name, 'entertainment', output?.value)
        outputTotal += output?.value;
    });

    calculateBalance(intakeTotal, outputTotal)
}

/**
 * Berechnet die Bilanz
 */
function calculateBalance(intakeTotal, outputTotal) {
    let balance = 0;
    balance = intakeTotal - outputTotal;

    let totalIntakeEl = document.querySelector('.bbuddy__total-intake-value');
    totalIntakeEl.innerText = intakeTotal + '€';

    let totalOutputEl = document.querySelector('.bbuddy__total-output-value');
    totalOutputEl.innerText = outputTotal + '€';

    let totalBalanceEl = document.querySelector('.bbuddy__total-balance-value');
    totalBalanceEl.innerText = balance.toFixed(2) + '€';

    createPreview(balance);
}

function createPreview(balance) {
    let wrapper = document.querySelector('.bbuddy__preview');
    let newBalance = balance;

    for (let i = 1; i <= 12; i++){
        let previewMonth = document.createElement('p');
        previewMonth.classList.add('bbuddy__preview-moth');
        if(i==1){
            previewMonth.innerText = i + ' Monat';
        }else{
            previewMonth.innerText = i + ' Monate';
        }

        let previewValue = document.createElement('p');
        previewValue.classList.add('bbuddy__preview-value');
        previewValue.innerText = newBalance.toFixed(2) + '€';

        let row = document.createElement('div');
        row.classList.add('bbuddy__preview-row');

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
 * Entfernt eine Einnahme aus der json
 */
function removeIntakeFromJson() {

}

/**
 * Entfernt eine Ausgabe aus der json
 */
function removeOutputFromJson() {

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
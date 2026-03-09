// Month names
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

// Data helpers
function getMonthKey(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
}

function getCurrentMonth() {
    return sessionStorage.getItem('bbuddy-current-month') || getMonthKey(new Date());
}

function setCurrentMonth(monthKey) {
    sessionStorage.setItem('bbuddy-current-month', monthKey);
}

function getAllData() {
    return JSON.parse(sessionStorage.getItem('bbuddy-data')) || {};
}

function setAllData(data) {
    sessionStorage.setItem('bbuddy-data', JSON.stringify(data));
}

function getEmptyMonth() {
    return {
        intake: [],
        output: { essential: [], important: [], entertainment: [], flex: [] }
    };
}

function getMonthData(monthKey) {
    const all = getAllData();
    return all[monthKey] || getEmptyMonth();
}

function setMonthData(monthKey, monthData) {
    const all = getAllData();
    all[monthKey] = monthData;
    setAllData(all);
}

function getMonthLabel(monthKey) {
    const [year, month] = monthKey.split('-');
    return MONATE[parseInt(month, 10) - 1] + ' ' + year;
}

function navigateMonth(offset) {
    const current = getCurrentMonth();
    const [year, month] = current.split('-').map(Number);
    const date = new Date(year, month - 1 + offset, 1);
    const newKey = getMonthKey(date);
    setCurrentMonth(newKey);
    window.location.reload();
}

// Onload
document.addEventListener('DOMContentLoaded', () => {
    initMonthNav();
    calculateTotal();
});

// Month navigation UI
function initMonthNav() {
    const nav = document.querySelector('.bbuddy__month-nav');
    if (!nav) return;

    const label = nav.querySelector('.bbuddy__month-nav-label');
    const prevBtn = nav.querySelector('.bbuddy__month-nav-prev');
    const nextBtn = nav.querySelector('.bbuddy__month-nav-next');

    if (label) {
        label.textContent = getMonthLabel(getCurrentMonth());
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateMonth(-1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateMonth(1));
    }
}

// Import file
let fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            saveData(data);
            calculateTotal();
            window.location.reload();
        } catch (err) {
            console.error('Fehler beim Parsen der JSON-Datei:', err);
        }
    };
    reader.readAsText(file);
});

function saveData(data) {
    // Detect old format (single month: has "intake" and "output" at top level)
    if (data.intake && data.output) {
        const monthKey = getCurrentMonth();
        setMonthData(monthKey, { intake: data.intake, output: data.output });
        return;
    }

    // New format: keys are month keys like "2026-03"
    setAllData(data);
}

function calculateTotal() {
    const monthData = getMonthData(getCurrentMonth());
    const intakes = monthData.intake || [];
    const spendings = monthData.output || {};

    let essentials = spendings.essential || [];
    let important = spendings.important || [];
    let entertainment = spendings.entertainment || [];
    let flex = spendings.flex || [];
    let outputTotal = 0;
    let outputTotalFlex = 0;
    let intakeTotal = 0;

    for (const item of intakes) {
        intakeTotal += Number(item.value);
    }

    for (const item of essentials) {
        outputTotal += Number(item.value);
        outputTotalFlex += Number(item.value);
    }

    for (const item of important) {
        outputTotal += Number(item.value);
        outputTotalFlex += Number(item.value);
    }

    for (const item of entertainment) {
        outputTotal += Number(item.value);
        outputTotalFlex += Number(item.value);
    }

    for (const item of flex) {
        outputTotalFlex += Number(item.value);
    }

    sessionStorage.setItem('spendingsTotal', outputTotal.toFixed(2));
    sessionStorage.setItem('intakesTotal', intakeTotal.toFixed(2));
    let balance = intakeTotal - outputTotal;
    let balanceFlex = intakeTotal - outputTotalFlex;
    sessionStorage.setItem('balance', balance.toFixed(2));
    sessionStorage.setItem('balanceFlex', balanceFlex.toFixed(2));

    // Write in HTML
    let dashboardIntake = document.getElementById('bbuddy__dashboard-intake');
    if (dashboardIntake) {
        dashboardIntake.innerText = intakeTotal.toFixed(2) + '€';
    }

    let dashboardOutput = document.getElementById('bbuddy__dashboard-output');
    if (dashboardOutput) {
        dashboardOutput.innerText = outputTotalFlex.toFixed(2) + '€';
    }

    let dashboardBalance = document.getElementById('bbuddy__dashboard-balance');
    if (dashboardBalance) {
        dashboardBalance.innerText = balance.toFixed(2) + '€';
    }

    let dashboardBalanceFlex = document.getElementById('bbuddy__dashboard-balance-flex');
    if (dashboardBalanceFlex) {
        dashboardBalanceFlex.innerText = balanceFlex.toFixed(2) + '€';
    }

    let balanceEl = document.querySelector('.bbuddy__dashboard-item--balance');
    if (balanceEl) {
        balanceEl.classList.remove('bbuddy__dashboard-item--positive', 'bbuddy__dashboard-item--negative');
        if (balance > 0) {
            balanceEl.classList.add('bbuddy__dashboard-item--positive');
        } else if (balance < 0) {
            balanceEl.classList.add('bbuddy__dashboard-item--negative');
        }
    }

    let balanceFlexEl = document.querySelector('.bbuddy__dashboard-item--balance-flex');
    if (balanceFlexEl) {
        balanceFlexEl.classList.remove('bbuddy__dashboard-item--positive', 'bbuddy__dashboard-item--negative');
        if (balanceFlex > 0) {
            balanceFlexEl.classList.add('bbuddy__dashboard-item--positive');
        } else if (balanceFlex < 0) {
            balanceFlexEl.classList.add('bbuddy__dashboard-item--negative');
        }
    }
}

function deleteEntry(obj, id) {
    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            obj[key] = obj[key].filter((item) => item.id !== id);
        } else {
            obj = obj.filter((item) => item.id !== id);
        }
    }
    return obj;
}

function exportJson() {
    const data = getAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'bbuddy.json';
    a.click();

    URL.revokeObjectURL(url);
}

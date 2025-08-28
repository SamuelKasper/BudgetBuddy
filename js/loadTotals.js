let intakesTotal = sessionStorage.getItem("intakesTotal");
let spendingsTotal = sessionStorage.getItem("spendingsTotal");
let balance = Number(intakesTotal) - Number(spendingsTotal);

document.getElementById('bbuddy__dashboard-intake').innerText = intakesTotal + '€';
document.getElementById('bbuddy__dashboard-output').innerText = spendingsTotal + '€';
document.getElementById('bbuddy__dashboard-balance').innerText = balance + '€';
let balanceEl = document.querySelector('.bbuddy__dashboard-item--balance');
if(balance > 0){
    balanceEl.classList.add("bbuddy__dashboard-item--positive");
}else{
    balanceEl.classList.add("bbuddy__dashboard-item--negative");
}
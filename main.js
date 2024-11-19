let toField = document.querySelector(".to");
let toFieldInput = document.querySelector(".to-custom-select input");
let toFieldList = document.querySelector(".to > ul");
let fromField = document.querySelector(".from");
let fromFieldInput = document.querySelector(".from-custom-select input");
let fromFieldList = document.querySelector(".from > ul");
let convertButton = document.querySelector(".convert-button");
let result = document.querySelector(".result");
let amountInput = document.querySelector("#amount")
let replaceButton = document.querySelector(".replace-button");

// The Currency I wanna convert from
let fromInputCurrency = document.createElement("span");
fromInputCurrency.innerHTML = `<span>USD</span> - <span>US Doller</span>`;

// The Currency I wanna convert to
let toInputCurrency = document.createElement("span");
toInputCurrency.innerHTML = `<span>ILS</span> - <span>New Israeli Sheqel</span>`;

fromFieldInput.value = fromInputCurrency.textContent;
toFieldInput.value = toInputCurrency.textContent;

amountInput.value = 1;

async function getCurrenciesInformation() {
    let currenciesInformation = await fetch("https://api.currencyfreaks.com/v2.0/supported-currencies");
    currenciesInformation = (await currenciesInformation.json()).supportedCurrenciesMap;

    let currenciesRates = await fetch("https://api.currencyfreaks.com/v2.0/rates/latest?apikey=b489ef171ff44614b874a511e9973b13");
    currenciesRates = (await currenciesRates.json())["rates"];

    insertCurrenciesInToAndFromList(currenciesInformation);

    convertButton.onclick = function () {
        if (/\w+ - \w+/ig.test(toInputCurrency.textContent) && /\w+ - \w+/ig.test(fromInputCurrency.textContent)) {

            let fromCurrencyRate = +currenciesRates[fromInputCurrency.children[0].textContent];
            let amount = +amountInput.value;
            let fromCurrencyInUSD = amount / fromCurrencyRate;
            let toCurrencyRate = +currenciesRates[toInputCurrency.children[0].textContent];
            let toCurrency = (fromCurrencyInUSD * toCurrencyRate).toFixed(10);

            let firstP = document.createElement("p");
            firstP.textContent = `${amountInput.value} ${fromInputCurrency.children[1].textContent} =`;

            let secondeP = document.createElement("p");
            secondeP.textContent = `${toCurrency} ${toInputCurrency.children[1].textContent}`;

            result.innerHTML = "";
            result.append(firstP, secondeP);

        } else {
            alert("Insert The Currencies First")
        }
    }

    replaceButton.onclick = function () {
        this.children[0].classList.toggle("rot");

        let temp = fromInputCurrency;
        fromInputCurrency = toInputCurrency;
        toInputCurrency = temp;

        toFieldInput.value = toInputCurrency.textContent;
        fromFieldInput.value = fromInputCurrency.textContent;
    }

    toFieldInput.oninput = search;
    fromFieldInput.oninput = search;
}

window.onload = getCurrenciesInformation();

function insertCurrenciesInToAndFromList(currenciesInformation) {
    for (let key in currenciesInformation) {
        let currentCurrency = currenciesInformation[key];

        let li = document.createElement("li");
        li.innerHTML = `
            <img src=${currentCurrency.icon} alt="flag">
            <span><span>${currentCurrency["currencyCode"]}</span> - <span>${currentCurrency["currencyName"]}</span></span>
        `;
        let li2 = li.cloneNode(true);

        li.onclick = putCurrencyInToInput;
        li2.onclick = putCurrencyInFromInput;

        toFieldList.appendChild(li);
        fromFieldList.appendChild(li2);
    }
}

function search() {
    let list = Array.from(this.parentNode.parentNode.children[1].children);
    let searchingRegExp = new RegExp(this.value, 'ig') 
    
    for (let i = 0; i < list.length; i++) {
        if (searchingRegExp.test(list[i].children[1].textContent)) {
            list[i].style.display = "flex";
        } else {
            list[i].style.display = "none";
        }
    }
}

function setAllListsEleFlexDisplay() {
    let toList = Array.from(toField.children[1].children);
    let fromList = Array.from(fromField.children[1].children);

    for (let i = 0; i < toList.length; i++) {
        toList[i].style.display = "flex";
        fromList[i].style.display = "flex";
    }
}

function putCurrencyInToInput() {
    toFieldInput.value = this.children[1].textContent;
    toInputCurrency = this.children[1];
    result.innerHTML = ""
}

function putCurrencyInFromInput() {
    fromFieldInput.value = this.children[1].textContent;
    fromInputCurrency = this.children[1];
    result.innerHTML = ""
}

toFieldInput.onfocus = function () {
    this.value = "";
}

fromFieldInput.onfocus = function () {
    this.value = "";
}

amountInput.oninput = function () {
    if (Boolean(+this.value) && this.value > 0) {
        convertButton.style.cssText = ``;
        replaceButton.style.cssText = ``;

        if (!this.value.includes(".")) {
            this.value = +this.value;
        }
    } else {
        convertButton.style.cssText = `
            opacity: 0.4;
            pointer-events: none;
        `;
        replaceButton.style.cssText = `
            opacity: 0.4;
            pointer-events: none;
        `;
    }
}

document.addEventListener("click", function (e) {

    if (e.target.getAttribute("id") === "from" || e.target.getAttribute("id") === "to") {
        if (e.target.parentNode.parentNode.children[1].style.display !== "block") {
            e.target.parentNode.parentNode.children[1].style.cssText = `
                display: block;
                animation-name: showSlider;
                animation-duration: 0.5s;
            `;

            if (e.target.getAttribute("id") === "from") {
                toFieldInput.value = toInputCurrency.textContent;
                disappearLists(false, true)
            } else {
                fromFieldInput.value = fromInputCurrency.textContent;
                disappearLists(true, false)
            }

            setAllListsEleFlexDisplay();
        }
    } else {

        disappearLists(true, true)

        fromFieldInput.value = fromInputCurrency.textContent;
        toFieldInput.value = toInputCurrency.textContent;

        setAllListsEleFlexDisplay();
    }
});

function disappearLists(from, to) {
    if (from) {
        fromFieldList.style.display = "none";
        fromFieldList.style.removeProperty("animation-name", "animation-duration");
    }

    if (to) {
        toFieldList.style.display = "none";
        toFieldList.style.removeProperty("animation-name", "animation-duration");
    }
}
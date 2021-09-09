"use strict";

const convertBtn = document.querySelector(".convert-btn");
const replaceBtn = document.querySelector(".replace-btn");
const desiredCurrency = document.getElementById("desired-currency");
const baseCurrency = document.getElementById("base-currency");
const selectCurrency = document.getElementById("select-currency");
const inputs = document.querySelectorAll("input");
const form = document.querySelector("form");

const isNumber = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

const getRate = () => {
    return fetch(
        "https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=RUB&to=EUR%2C%20USD&amount=1",
        {
            method: "GET",
            headers: {
                "x-rapidapi-host": "currency-converter5.p.rapidapi.com",
                "x-rapidapi-key": "2466ce1fe8msh18277be113bec00p19de01jsn39c6e36928f7",
            },
        }
    );
};

const recountRate = (data) => {
    const euro = +(1 / +data.rates.EUR.rate).toFixed(2);
    const usd = +(1 / +data.rates.USD.rate).toFixed(2);
    const rate = { euro: euro, usd: usd };
    return rate;
};

const convertation = (rate) => {
    if (selectCurrency.value === "usd" && baseCurrency.hasAttribute("readonly")) {
        baseCurrency.value = (rate.usd * +desiredCurrency.value).toFixed(2);
    } else if (selectCurrency.value === "euro" && baseCurrency.hasAttribute("readonly")) {
        baseCurrency.value = (rate.euro * +desiredCurrency.value).toFixed(2);
    }
    if (selectCurrency.value === "euro" && !baseCurrency.hasAttribute("readonly")) {
        desiredCurrency.value = (+baseCurrency.value / rate.euro).toFixed(2);
    }
    if (selectCurrency.value === "usd" && !baseCurrency.hasAttribute("readonly")) {
        desiredCurrency.value = (+baseCurrency.value / rate.usd).toFixed(2);
    }
};

const convert = (event) => {
    event.preventDefault();

    getRate()
        .then((response) => {
            if (response.status !== 200) {
                throw new Error("status network not 200");
            }
            return response.json();
        })
        .then((response) => recountRate(response))
        .then((rate) => convertation(rate))
        .catch((err) => {
            console.error(err);
        });
};

convertBtn.addEventListener("click", convert);

replaceBtn.addEventListener("click", () => {
    form.insertBefore(form.children[1], form.children[0]);
    form.insertBefore(form.children[2], form.children[0]);

    inputs.forEach((elem) => {
        elem.value = "";
    });

    if (baseCurrency.hasAttribute("readonly")) {
        baseCurrency.removeAttribute("readonly");
        desiredCurrency.setAttribute("readonly", true);
    } else {
        baseCurrency.setAttribute("readonly", true);
        desiredCurrency.removeAttribute("readonly");
    }
});

baseCurrency.addEventListener("input", (e) => {
    desiredCurrency.value = "";
});

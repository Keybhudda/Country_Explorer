
function getQueryparm(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return decodeURIComponent(urlParams.get(name) || "");

}

function safeValue (value) {
    return value && value !== "undefined" ? value : "N/A";
}

document.addEventListener("DOMContentLoaded", () => {

    const name = safeValue(getQueryparm("name"));
    const flag = safeValue(getQueryparm("flag"));
    const population = safeValue(getQueryparm("population"));
    const region = safeValue(getQueryparm("region"));
    const capital = safeValue(getQueryparm("capital"));
    const currencies = safeValue(getQueryparm("currencies"))
    const languages = safeValue(getQueryparm("languages"));


    document.getElementById("country-name").textContent = `Country Name: ${name}`;
    document.getElementById("flag").src = flag;
    document.getElementById("population").textContent = `Population: ${Number(population).toLocaleString()}`;
    document.getElementById("region").textContent = `Region: ${region}`;
    document.getElementById("capital").textContent = `Capital: ${capital}`;
    document.getElementById("currencies").textContent = `Currencies: ${currencies}`;
    document.getElementById("languages").textContent = `Languages: ${languages}`;


    document.getElementById("back-button").addEventListener("click", () => {
        window.location.href = "index.html"
    });

});
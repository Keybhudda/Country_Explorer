const { rejects } = require("assert");
const { error } = require("console");
const https = require("https");
const { resolve } = require("path");

function fetchCountries() {
    return new Promise((resolve, reject) => {
        const API_URL = "https://restcountries.com/v3.1/all?fields=name,capital,flags,currencies,languages,region,subregion,population&fullText=True";

        let req = https.get(API_URL, (res) => {
            let data = "";

            res.on("data", chunk => data += chunk);

            res.on("end", () => {
                try {
                    const countriesData = JSON.parse(data);
                    resolve(countriesData);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on("error", (error) => reject(error));
        req.end();
    });
}

module.exports = { fetchCountries }
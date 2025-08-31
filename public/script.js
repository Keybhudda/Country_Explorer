const countryCardsContainer = document.getElementById("country-cards-container")
let displayCount = 12
let countries = [];


const searchInput = document.getElementById("search-input")
const regionSelect = document.getElementById("regionSelector")
const populationInput = document.getElementById("population-input")


function fetchData() {
    return fetch("/api/countries")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP error! Status: " + response.status);
            }
            return response.json();
        })
        .catch(function (error) {
            console.error("Error fetching countries data:", error);
            throw error;
        });
}


function populateCountryCards(data) {
    countryCardsContainer.innerHTML = ''

    if (data.length === 0) {
        const errorMessage = document.createElement('div');
        errorMessage.id = "no-results-message"
        errorMessage.textContent = "No countries found. Please adjust your filter.";
        countryCardsContainer.appendChild(errorMessage);
    } else {
        const loopCounter = Math.min(displayCount, countries.length);
        for (let i = 0; i < loopCounter; i++) {
            const country = data[i];
            const card = document.createElement('div')
            
            card.classList.add('country-card');


            const flagImg = document.createElement('img');
            const nameHeading = document.createElement('h3');
            const populationSpan = document.createElement('span');
            const capitalSpan = document.createElement('span');
            const regionSpan = document.createElement('span');


            flagImg.src = country.flags.png;
            flagImg.alt = `Flag of: & ${country.name.common}`;
            nameHeading.textContent = `Country Name: ${country.name.common}`;
            populationSpan.textContent =`Population: ${country.population.toLocaleString()}`;
            capitalSpan.textContent = `Capital: ${country.capital}`;
            regionSpan.textContent = `Region: ${country.region}`;



            card.appendChild(flagImg);
            card.appendChild(nameHeading);
            card.appendChild(populationSpan);
            card.appendChild(document.createElement('br'));
            card.appendChild(capitalSpan);
            card.appendChild(document.createElement('br'));
            card.appendChild(regionSpan);


            card.addEventListener("click", () => countryCardHandler(country));
            
            countryCardsContainer.appendChild(card);


            const showMoreBtn = document.getElementById("show-more-btn");
            if (displayCount >= data.length) {
                showMoreBtn.style.display = "none"
            } else {
                showMoreBtn.style.display = "block";
            }

            
        }
    }
};

function filterData() {
    countryCardsContainer.innerHTML = '';

    let nameFilter = searchInput.value.trim();
    let regionFilter = regionSelect.value;
    let populationFilter = populationInput.value.trim();

    let regex = new RegExp(/^[a-zA-Z -]*$/);
    if (nameFilter && !regex.test(nameFilter)) {
        countryCardsContainer.innerHTML = `<p class="no-results-message">Enter valid Country Name.</p>`;
        return

    }
    
    if (populationFilter && (isNaN(populationFilter) || populationFilter > 1500000000)) {
        countryCardsContainer.innerHTML = `<p class="no-results-message">Country's population cannot be greater than 1.5 billion.</p>`;
        return;
        
    }

    let filteredCountries = countries.filter(country => {
        let matchesName = true;
        let matchesRegion = true;
        let matchesPopulation =true;

        if (nameFilter) {
            matchesName = country.name.common.toLowerCase().includes(nameFilter.toLocaleLowerCase());
        }

        if (regionFilter && regionFilter !== "All Regions") {
            matchesRegion = (country.region === regionFilter);
        }

        if (populationFilter) {
            matchesPopulation = (country.population <= parseInt(populationFilter));
        }

        return matchesName && matchesRegion && matchesPopulation;
    });

    if (filteredCountries.length === 0) {
        countryCardsContainer.innerHTML= `<p class="no-results-message">No Country found matching the search criteria.</p>`;
        return;
    }

    
    populateCountryCards(filteredCountries);
    console.log(filteredCountries)
}

function showMoreHandler() {
    displayCount += 10;
    filterData()
    
}


const regions = ["All Regions", "Africa", "Americas", "Asia", "Europe", "Oceania"];
regions.forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        if (region === "All Regions") option.selected = true;
        regionSelect.appendChild(option);
    });

function getFormattedNamesFromObjects(obj) {
    if (!obj || Object.keys(obj).length === 0) {
        return "N/A";
    }

    return Object.keys(obj).map(key => obj[key]).join(", ");
}
   
function getFormattedCurrencies(currencies) {
    if (!currencies) return "N/A";
    let codes = Object.keys(currencies);
    return codes.map(code => currencies[code].name).join(", ");
}

function getFormattedLanguages(languages) {
    if (!languages) return "N/A";
    let codes = Object.keys(languages);
    return codes.map(code => languages[code]).join(", ");
}

function countryCardHandler(country) {
    const currencies = getFormattedCurrencies(country.currencies);
    const languages = getFormattedLanguages(country.languages);


    const queryString= `?name=${encodeURIComponent(country.name.common)}&capital=${encodeURIComponent(country.capital)}&population=${country.population}&region=${encodeURIComponent(country.region)}&currencies=${encodeURIComponent(currencies)}&languages=${encodeURIComponent(languages)}&flag=${encodeURIComponent(country.flags.png)}`;



    window.location.href = "details.html" + queryString;
}

searchInput.addEventListener("input", filterData);
regionSelect.addEventListener("change", filterData);
populationInput.addEventListener("input",filterData);
document.addEventListener("DOMContentLoaded", () => {
    regionSelect.value = "All Regions";
});
document.getElementById("show-more-btn").addEventListener("click", showMoreHandler);

document.addEventListener("DOMContentLoaded", () => {
    fetchData().then(function(data) {
        countries = data;
        populateCountryCards(data);
    });
});




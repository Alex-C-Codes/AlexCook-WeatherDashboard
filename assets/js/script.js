// General variables
var APIKey = 'a516a7fbfd46ba170d60592a260e7eec';
var city;
var latitude;
var longitude;
var searchBarEl = document.getElementById('searchBar');
var currentConditionsContainer = document.getElementById('currentConditions');
var weatherIcon = ' &#9728;';

// Current Conditions variables
var cityNameEl = document.getElementById('cityName');
var tempEl = document.getElementById('temp');
var windEl = document.getElementById('wind');
var humidityEl = document.getElementById('humidity');

// Weather API calls
var geocodingURL = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+APIKey;
var currentConditionsURL = 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid='+APIKey;
var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&appid='+APIKey;

// gets search query from user's input into the search bar
function getSearch() {
    city = searchBarEl.value;
    geocodingURL = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+APIKey;

    // fetches the weather API
    fetch(geocodingURL)
        .then((response) => response.json())
        .then((data) => {
            console.log('geocodingURL');
            console.log(data);

            latitude = data.coord.lat;
            longitude = data.coord.lon;
            weatherIcon = data.weather[0].icon;

            // populate Current Conditions box
            // [ ] need to update Temp so that it's farhenheit
            city = city[0].toUpperCase() + city.slice(1);
            cityNameEl.innerHTML = city + getCurrentDay() + weatherIcon;
            tempEl.innerHTML = 'Temp: ' + data.main.temp + '°F';
            windEl.innerHTML = 'Wind: ' + data.wind.speed + ' MPH';
            humidityEl.innerHTML = 'Humidity: ' + data.main.humidity + ' %';

            getCurrentConditions();
            getForecast();

        });
}

function getForecast() {
    forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&appid='+APIKey;

    fetch(forecastURL)
        .then((response) => response.json())
        .then((data) => {
            console.log('getForecast');
            console.log(data);
            console.log(data.list);
        });
}

function getCurrentConditions() {
    currentConditionsURL = 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid='+APIKey;

    fetch(currentConditionsURL)
        .then((response) => response.json())
        .then((data) => {
            console.log('getCurrentConditions');
            console.log(data);
        })
}

function getCurrentDay() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2,'0');
    let mm = String(today.getMonth() + 1).padStart(2,'0'); //January is 0
    let yyyy = today.getFullYear();
    yyyy = yyyy.toString();
    yyyy = yyyy[2] + yyyy[3];
    
    today = ' (' + mm + '/' + dd + '/' + yyyy + ') ';
    return today;
}
// General variables
var APIKey = 'a516a7fbfd46ba170d60592a260e7eec';
var city;
var latitude;
var longitude;
var searchBarEl = document.getElementById('searchBar');
var currentConditionsContainer = document.getElementById('currentConditions');
var weatherIcon;
// var weatherIcon = ' &#9728;';

// Search History variables
var searchHistoryContainer = document.getElementById('searchHistory');
var searchedCitiesArr = [];

// Current Conditions variables
var cityNameEl = document.getElementById('cityName');
var currentConditionsIconEl = document.getElementById('currentConditionsIcon');
var tempEl = document.getElementById('temp');
var windEl = document.getElementById('wind');
var humidityEl = document.getElementById('humidity');

// 5-Day Forecast variables
var forecastsContainer = document.getElementById('forecasts');
var forecastDateArr = [];

// Weather API calls
var geocodingURL = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+APIKey;
var currentConditionsURL = 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid='+APIKey;
var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&appid='+APIKey;
var iconURL = 'http://openweathermap.org/img/wn/'+weatherIcon+'@2x.png'


// gets search query from user's input into the search bar
function getSearch() {
    city = searchBarEl.value;
    geocodingURL = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+APIKey+'&units=imperial';

    // fetches the weather API
    fetch(geocodingURL)
        .then((response) => response.json())
        .then((data) => {

            latitude = data.coord.lat;
            longitude = data.coord.lon;

            let display = [];

            display.push(
                '<h2 id="cityName">'+data.name + getCurrentDay()+'</h2>'
                +'<img id="currentDayImgID" src="'+getWeatherIcon(data.weather[0].icon, "currentDayImgID")+'"/>'
                +'<ul>'
                +    '<li id="temp">'+'Temp: '+ data.main.temp + '°F'+'</li>'
                +    '<li id="wind">Wind: '+data.wind.speed+' MPH</li>'
                +    '<li id="humidity">Humidity: '+data.main.humidity+' %</li>'
                +'</ul>'
            );

            currentConditionsContainer.classList.add('border');
            currentConditionsContainer.classList.add('border-dark');
            currentConditionsContainer.innerHTML = display.join(' ');

            getForecast();
            buildSearchHistorySection(data.name);
        })
        .catch(err=>console.log(err))
}

// gets weather icon
function getWeatherIcon(weatherIconID, imageID) {
    iconURL = 'http://openweathermap.org/img/wn/'+weatherIconID+'@2x.png';
    return iconURL;
}

// gets current day to display within current conditions section
function getCurrentDay() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2,'0');
    let mm = String(today.getMonth() + 1).padStart(2,'0'); //January is 0
    let yyyy = today.getFullYear();
    
    today = ' (' + mm + '/' + dd + '/' + yyyy + ') ';
    return today;
}

// builds 5-Day Forecast section
function getForecast() {
    forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&appid='+APIKey+'&units=imperial';

    fetch(forecastURL)
        .then((response) => response.json())
        .then((data) => {

            // builds dates for the 5-day forecast section
            let yyyy;
            let mm;
            let dd;
            let forecastDate;

            let display = [];
            let j = 6;

            // create the display for the 5-day forecast
            for (let i = 0; i < 5; i++) {
                yyyy = data.list[j].dt_txt.slice(0, 4);
                mm = data.list[j].dt_txt.slice(5, 7);
                dd = data.list[j].dt_txt.slice(8, 10);
                forecastDate = mm + '/' + dd + '/' + yyyy;

                forecastDateArr.push(forecastDate);

                display.push(
                        '<div class="forecastBox col gx-2">'
                        +    '<ul>'
                        +        '<li>'+forecastDateArr[i]+'</li>'
                        +        '<li><img id="imageID'+i+'" src="'+getWeatherIcon(data.list[j].weather[0].icon, "imageID"+i)+'"/></li>'
                        +        '<li>Temp: '+data.list[j].main.temp+'°F</li>'
                        +        '<li>Wind: '+data.list[j].wind.speed+' MPH</li>'
                        +        '<li>Humidity: '+data.list[j].main.humidity+' %</li>'
                        +    '</ul>'
                        +'</div>'
                );

                j = j + 8;

            }

            forecastsContainer.innerHTML = '<h4 style="padding-top:4%;">5-Day Forecast:</h4>' + display.join(' ');
        })
        .catch(err=>console.log(err))
}

// builds search history section
function buildSearchHistorySection(searchedCity) {
    searchedCitiesArr.push(searchedCity);
    let display = [];

    for (let i = 0; i < searchedCitiesArr.length; i++) {
        display.push(
            '<button id="'+i+'" type="button" class="searchedCity" onclick="searchCityAgain('+i+');">'+searchedCitiesArr[i]+'</button>'
        );
    }
    searchHistoryContainer.innerHTML = display.join(' ');
}

// this function is activated once someone clicks on a city in the search history
function searchCityAgain(i) {
    searchBarEl.value = searchedCitiesArr[i];
    getSearch();
}
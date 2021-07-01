var formEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-name-input');
var todayDivEl = document.querySelector('#today-container');
var forecastDivEl = document.querySelector('#forecast-container');

var weatherAPIbase = 'https://api.openweathermap.org/data/2.5/';
var coordinatePath = 'weather?q=';
var forecastPath = 'onecall?';
var apiKey = '&appid=71b78982268256669dafd58400af0acc';

var iconDict = {
  200 : "fas fa-cloud-showers-heavy",
  300 : "fas fa-cloud-rain",
  500 : "fas fa-cloud-showers-heavy'",
  600 : "fas fa-snowflake'",
  700 : "fas fa-smog",
  800 : "fas fa-sun",
  801 : "fas fa-cloud"
};


// is called when search button is clicked
function handleSearchCity(event) {
  event.preventDefault();
  let cityInput = cityInputEl.value.trim();

  //  check for empty string
  if (cityInput === "") { 
    showWarning(formEl, 'City cannot be empty string');
    return 
  } 

  clearWarning(formEl);
  clearInput(formEl);
  getCityForecast(cityInput);
};

// show a warning to an element
function showWarning(el, text) {
  let warningEl = el.querySelector('.warning')
  warningEl.textContent = text;
  warningEl.classList.remove('hidden');
  warningEl.classList.add('visible');
};

// clear a warning in an element
function clearWarning(el) {
  let warningEl = el.querySelector('.warning')
  warningEl.textContent = 'Hello';
  warningEl.classList.remove('visible');
  warningEl.classList.add('hidden');
};

// clear all inputs in a form
function clearInput(form) {
  for (el of form.querySelectorAll('input')) {
    el.value = "";
  }
};

// display Forcast from city name
function getCityForecast(cityName) {
  let apiUrl = weatherAPIbase + coordinatePath + cityName + apiKey;
  getApi(apiUrl, getForecast, handle404);
};

// return response if not ok 
//  else response data
function getApi(url, callback, handleError) {
  fetch(url).then(function (response) {
    if (response.ok) {
      response.json().then(callback);
    } else {
      handleError(response); 
    }
  }).catch((error) => {
      console.error('Error:', error);
  });
};

// get forecast from coord
function getForecast(data) {
  let apiUrl = generateOneCallApiUrl(data.coord);
  clearForecastOnDisplay();
  displayCityName(data.name);
  getApi(apiUrl, displayForecast, (response) => (console.log(response.status)));
};

// handle 404 status error
function handle404(response) {
  if (response.status == 404) {
    showWarning(formEl, 'This city does not exist. Please check your spelling.');
  } else {
    console.log(response.status);
  }
  return null;
};

// generate apiUrl for onecall
function generateOneCallApiUrl(coord) {
  let baseUrl = weatherAPIbase + forecastPath;
  let excludeQuery = '&exclude=minutely,hourly,alerts';
  let unitQuery = '&units=metric';
  let qString = 'lat=' + coord.lat + '&lon=' + coord.lon + excludeQuery + unitQuery + apiKey;
  return baseUrl + qString;
};

// clear the screen
function clearForecastOnDisplay() {
  removeAllChildren(todayDivEl);
  removeAllChildren(forecastDivEl);
}

// remove all child nodes
function removeAllChildren(el) {
  while (el.hasChildNodes()) {  
    el.removeChild(el.firstChild);
  };
};

// display city name
function displayCityName(name) {
  let titleEl = document.createElement('h2');
  titleEl.classList = 'card-large-title text-dark ';
  titleEl.textContent = name;
  todayDivEl.appendChild(titleEl);
  todayDivEl.classList.remove('hidden');
  todayDivEl.classList.add('visible');
}

function displayForecast(data) {
  console.log(data);
  let todayData = parseCurrentWeather(data);
  let forecastData = parseWeatherForecast(data);
  console.log(forecastData);
  displayTodayForecast(todayData);
  // displayFutureForecast(data);
};

// extract important info to create today
function parseCurrentWeather(data){
  let result = {};
  result.temp = data.current.temp;
  result.icon = getIconClass(data.current.weather[0].id);  
  result.humidity = data.current.humidity;
  result.windSpeed = data.current['wind_speed'];
  result.uv = data.current.uvi;
  return result;
} 

// convert the weather code into a icon class
function getIconClass(code) {
  let newCode = Math.floor(code/100) * 100;
  if (newCode !== 800) {
    return iconDict[newCode];
  } else {
    return newCode === code? iconDict[800] : iconDict[801];
  }
};

// extract forecast data for display
function parseWeatherForecast(data){
  let result = [];
  for (item of data.daily.slice(1,6)) {
    let dailyForecast = parseDailyForecast(item);
    result.push(dailyForecast);
  };
  return result;
};

// parse the data into an object
function parseDailyForecast(data){
  let result = {};
  result.date = data.dt;  // it comes in unix time
  result.temp = data.temp.day;
  result.windSpeed = data['wind_speed'];
  result.icon = data.weather[0].id;
  result.humidity = data.humidity;
  return result;
};

// display the current weather on screen
function displayTodayForecast(data){
  let bodyEl = document.createElement('div');
  let dateEl = createDataLabelEl(moment().format('Do MMM YYYY'));
  let iconEl = createIconTempEl(data.icon, data.temp);
  let windEl = createDataLabelEl('Wind Speed: ' + data.windSpeed + ' m/s');
  let humidityEl = createDataLabelEl('Humidity: ' + data.humidity + ' %');
  let uvEl = createDataLabelEl('UV index: ' + data.uv);
  addUvColor(uvEl, data.uv);

  bodyEl.appendChild(dateEl);
  bodyEl.appendChild(iconEl);
  bodyEl.appendChild(windEl);
  bodyEl.appendChild(humidityEl);
  bodyEl.appendChild(uvEl);

  todayDivEl.appendChild(bodyEl);
};


// create data label element
function createDataLabelEl(text) {
  let result = document.createElement('p');
  result.classList = 'card-large-text text-dark';
  result.textContent = text;
  return result;
};

// create the icon / temp element
function createIconTempEl(iconClass, temp) {
  let result = document.createElement('p');
  let iconEl = document.createElement('span');
  let text = temp + 'C '
  result.classList = 'card-large-icon text-dark';
  iconEl.classList = iconClass;
  result.textContent = text; 
  result.appendChild(iconEl);
  return result;
}

// add background colour to uv tag depending on the index.
function addUvColor(uvEl, uvIndex){
  if (uvIndex < 2) {
    uvEl.classList.remove('text-dark');
    uvEl.classList.add('uv-card', 'bg-green', 'text-light')
  } else if (uvIndex <5) {
    uvEl.classList.add('uv-card', 'bg-yellow')
  } else {
    uvEl.classList.remove('text-dark');
    uvEl.classList.add('uv-card', 'bg-red', 'text-light')
  };
};



function displayFutureForecast(data) {

};




function init() {
  formEl.addEventListener('submit', handleSearchCity);
}

init();
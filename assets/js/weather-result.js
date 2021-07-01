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
  console.log(data);
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
  titleEl.classList.add('light-card-title');
  titleEl.textContent = name;
  todayDivEl.appendChild(titleEl);
  todayDivEl.classList.remove('hidden');
  todayDivEl.classList.add('visible');
}

function displayForecast(data) {
  console.log(data);
  let todayData = parseCurrentWeather(data);
  console.log(todayData);
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


// display the current weather on screen
function displayTodayForecast(data){
  let bodyEl = document.createElement('div');
  let dateEl = createDataLabelEl(moment().format('Do MMM YYYY'));
  let iconEl = createIconTempEl(data.icon, data.temp);
  let windEl = createDataLabelEl('Wind Speed: ' + data.windSpeed + ' m/s');
  let humidityEl = createDataLabelEl('Humidity: ' + data.humidity + ' %');
  let uvEl = createDataLabelEl('UV index: ' + data.uv);

  bodyEl.classList = 'light-card-body';

  bodyEl.appendChild(dateEl);
  bodyEl.appendChild(iconEl);
  bodyEl.appendChild(windEl);
  bodyEl.appendChild(humidityEl);
  bodyEl.appendChild(uvEl);

  todayDivEl.appendChild(bodyEl);
};



// create date element
function createDataLabelEl(text) {
  let result = document.createElement('p');
  result.classList.add('light-card-text');
  result.textContent = text;
  return result;
};

function createIconTempEl(iconClass, temp) {
  let result = document.createElement('p');
  let iconEl = document.createElement('span');
  let text = temp + 'C '
  result.classList.add('light-card-icon');
  iconEl.classList = iconClass;
  result.textContent = text; 
  result.appendChild(iconEl);
  return result;
}

function createTempIconEl(temperature) {
  let tempEl = createTempEl(temperature)
}


function displayFutureForecast(data) {

};




function init() {
  formEl.addEventListener('submit', handleSearchCity);
}

init();
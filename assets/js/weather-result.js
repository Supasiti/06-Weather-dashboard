var formEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-name-input');

var weatherAPIbase = 'https://api.openweathermap.org/data/2.5/';
var coordinatePath = 'weather?q=';
var forecastPath = 'onecall?';
var apiKey = '&appid=71b78982268256669dafd58400af0acc';

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


function displayForecast(data) {
  console.log(data);
  displayTodayForecast(data);
  displayFutureForecast(data);
};

function displayTodayForecast(data){
  let 

};

function displayFutureForecast(data) {

};






function init() {
  formEl.addEventListener('submit', handleSearchCity);
}

init();
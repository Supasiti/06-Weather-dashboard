var formEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-name-input');

var weatherAPIbase = 'https://api.openweathermap.org/data/2.5/';
var coordinatePath = 'weather?q=';
var forecastPath = 'onecall?';
var APIkey = '&appid=71b78982268256669dafd58400af0acc';


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

  getCityCoordinates(cityInput);
  // console.log(coordinates);
  // let forecast = getForecast(cityInput);
  // if (forecast === null) {
  //   showWarning(formEl, 'This city does not exist. Please check your spelling.');
  //   return
  // };

  // renderTodayForecast(forecast);
  // renderFutureForecast(forecast);
}

// show a warning to an element
function showWarning(el, text) {
  let warningEl = el.querySelector('.warning')
  warningEl.textContent = text;
  warningEl.classList.remove('hidden');
  warningEl.classList.add('visible');
}

// clear a warning in an element
function clearWarning(el) {
  let warningEl = el.querySelector('.warning')
  warningEl.textContent = 'Hello';
  warningEl.classList.remove('visible');
  warningEl.classList.add('hidden');
}

// clear all inputs in a form
function clearInput(form) {
  for (el of form.querySelectorAll('input')) {
    el.value = "";
  }
};

// return city coordinates
// catch bad city names here
function getCityCoordinates(cityInput){
  let apiUrl = weatherAPIbase + coordinatePath + cityInput + APIkey;
  let response =  getApi(apiUrl, parseCoordinates, handle404);
  console.log(response);
};

// return coordinate data 
function parseCoordinates(data){
  console.log(data.coord);
  return data.coord;
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

// get forecast from coord
function getForecast(coord) {
  let apiUrl = generateOneCallApiUrl(coord);
  console.log(apiUrl);
  // let response = getApi(apiUrl, parseData)
  return null;
};

// generate apiUrl for onecall
function generateOneCallApiUrl(coord) {
  let baseUrl = weatherAPIbase + forecastPath;
  let qString = 'lat=' ;
};

// return response if not ok 
//  else response data
function getApi(url, callback, handleError) {
  fetch(url).then(function (response) {
    if (response.ok) {
      return response.json().then(callback);
    } else {
      handleError(response); 
    }
  }).catch((error) => {
      console.error('Error:', error);
  });
}

function parseData(data) {
  console.log(data);
  return data
};

function renderTodayForecast(forecast){

};

function renderFutureForecast(forecast) {

};






function init() {
  formEl.addEventListener('submit', handleSearchCity);
}

init();
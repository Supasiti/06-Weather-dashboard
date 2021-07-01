var formEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-name-input');

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

  let forecast = getForcast(cityInput);
  renderTodayForecast(forecast);
  renderFutureForecast(forecast);
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

function getForcast(cityInput) {
  return null;
};

function renderTodayForecast(forecast){

};

function renderFutureForecast(forecast) {

};






function init() {
  formEl.addEventListener('submit', handleSearchCity);
}

init();
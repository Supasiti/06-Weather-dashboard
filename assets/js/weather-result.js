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

  let forecast = getForcast(cityInput);
  renderTodayForecast(forecast);
  renderFutureForecast(forecast);
}

function showWarning(el, text) {
  let warningEl = el.querySelector('.warning')
  warningEl.textContent = text;
  warningEl.classList.remove('hidden');
  warningEl.classList.add('visible');
}

function clearWarning(el) {
  let warningEl = el.querySelector('.warning')
  warningEl.textContent = 'Hello';
  warningEl.classList.remove('visible');
  warningEl.classList.add('hidden');
}

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
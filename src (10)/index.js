// src/index.js
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('#country-list');
const countryInfo = document.querySelector('#country-info');

searchBox.addEventListener('input', debounce(onSearch, 300));

function onSearch(event) {
  const name = event.target.value.trim();
  if (name === '') {
    clearResults();
    return;
  }

  fetchCountries(name)
    .then(countries => renderCountryData(countries))
    .catch(() => Notiflix.Notify.failure('Oops, there is no country with that name'));
}

function clearResults() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function renderCountryData(countries) {
  clearResults();

  if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  if (countries.length >= 2 && countries.length <= 10) {
    renderCountryList(countries);
  } else if (countries.length === 1) {
    renderCountryCard(countries[0]);
  }
}

function renderCountryList(countries) {
  const listItems = countries
    .map(country => `<li><img src="${country.flags.svg}" alt="${country.name.official} flag" width="30"/> ${country.name.official}</li>`)
    .join('');
  countryList.innerHTML = `<ul>${listItems}</ul>`;
}

function renderCountryCard(country) {
  countryInfo.innerHTML = `
    <h2><img src="${country.flags.svg}" alt="${country.name.official} flag" width="50"/> ${country.name.official}</h2>
    <p><strong>Capital:</strong> ${country.capital}</p>
    <p><strong>Population:</strong> ${country.population}</p>
    <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
  `;
}

"use strict";
/*
 * Obtain a list of US cities via a proxy server.  Then randomly
 * select a US city and display its weather forecast.  Repeat this
 * every 10 seconds.
 */

/** Global variable to hold list of cities with lat/long data. */
var cities;

const citySpan = document.querySelector("#city");
const forecastSpan = document.querySelector("#forecast");

/** Retrieve and record array of the 1000 largest US cities.
    Then begin displaying random forecasts every 10 seconds. */
async function getCities() {
    try {
	let res = await fetch(
	    "http://localhost:3000/cities.json");
	cities = await res.json();
	displayForecasts();
    }
    catch (ex) {
	console.log(ex);
    }
}

/** Display a forecast for a random city and then schedule to display
    another forecast in 10 seconds.
*/
async function displayForecasts() {    
    try {
	// Choose and display a random city, clear the forecast
	let r = Math.floor(Math.random()*cities.length);
	let city = cities[r];
	let cityStateString = `${city.city} ${city.state}` 
	citySpan.innerText = cityStateString;
	forecastSpan.innerText = "";

	// Request (two-step process) the city forecast
	let response = await fetch(
	    `https://api.weather.gov/points/${city.latitude},${city.longitude}`);
	let json = await response.json();
	let response2 = await fetch(json.properties.forecast);
	let json2 = await response2.json();
	
	// If we have not moved on to another city while waiting for this
	// forecast, display the forecast.
        if (citySpan.innerText == cityStateString) {
	    forecastSpan.innerText = 
		json2.properties.periods[0].detailedForecast;
	}
    }
    catch(ex) {
      console.log('failed: ', ex);
    }
    // Repeat function processing in 10 seconds
    setTimeout(displayForecasts, 10000);
}

// Begin the program by getting the city data structure
getCities();

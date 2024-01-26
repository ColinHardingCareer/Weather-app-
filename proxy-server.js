/*
  As of Node.js v16, it is necessary to include a package in order to use
  fetch(). The package can be obtained by running the following in the folder
  containing the main JavaScript file for the program needing fetch:

  npm install node-fetch@2

  Then include the require below.
*/
const fetch = require('node-fetch');

const http = require('http');

/** Global variable to hold list of cities with lat/long data. */
var cities;

const hostname = '127.0.0.1';
const port = 3000;
const baseURL = `http://${hostname}:${port}/`;

/** Retrieve the cities.json file as JSON text and store this string
    in the global cities variable. */
async function getCities() {
    try {
	let response = await fetch(
	    "http://www.mathcs.duq.edu/~jackson/wbs/cities.json");
	cities = await response.text();
    }
    catch (ex) {
	console.log("Exception in getCities:");
	console.log(ex);
    }
}

function handleRequest(req, res) {

    // Check that the request is for the cities.json file and, if
    // not, return an error.
    let thisURL = new URL(req.url, baseURL);
    if (thisURL.pathname !== '/cities.json') {

	// Send an error page
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain');
	res.end("Requested resource not found.");
    }
    else {

	// Return the cities JSON string to the client.
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.end(cities);
    }
}

/**
 * Load the cities.json data, then start the server.
 */
async function main() {
    try {
	// Begin loading the cities.json string.
	let cityPromise = getCities();
	
	// Create the server.
	const server = http.createServer(handleRequest);
	
	// Start the server once the cities have been loaded.
	await cityPromise;
	server.listen(port, hostname, () => {
	    console.log(`Server running at ${baseURL}`);
	});
    }
    catch (ex) {
	console.log("Exception in main:");
	console.log(ex);
    }
}

// Start the program
main();

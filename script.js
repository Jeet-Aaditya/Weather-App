const temperature = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const condition = document.getElementById("condition");
const weatherError = document.getElementById("weatherError");
const cityName = document.getElementById("city");

function geoLocation(){
	if(!navigator.geolocation){
		fetchWeather("Tokyo");
		return;
	}

	weatherError.textContent = "Locating…";
	navigator.geolocation.getCurrentPosition(

		function(position){
			const lat = position.coords.latitude;
			const lon = position.coords.longitude;
			fetchWeatherByLocation(lat, lon);
		},

		function(){
			fetchWeather("Tokyo");
		}

	);
}


async function fetchWeatherByLocation(lat, lon){
	weatherError.textContent = "Loading...";

	try{
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
	const response = await fetch(url);
	
	const weather = await response.json();

	    temperature.textContent =
            Math.round(weather.current.temperature_2m) + "°C";

        humidity.textContent =
            weather.current.relative_humidity_2m;

        wind.textContent =
            Math.round(weather.current.wind_speed_10m);

        condition.textContent =
            getWeatherCondition(weather.current.weather_code);


			 const locationResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );

		const locationData = await locationResponse.json();

		cityName.textContent = locationData.city || locationData.locality || "Unknown Location";
		weatherError.textContent = "";

	}
		catch (error) {
		weatherError.textContent = "Error fetching weather data.";
		console.error(error);
		}

}
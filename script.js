const temperature = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const condition = document.getElementById("condition");
const weatherError = document.getElementById("weather-error");
const cityName = document.getElementById("city");
const cityInput = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");

const weatherIcon = document.getElementById("weatherIcon");

searchButton.addEventListener("click", function(){
    if(cityInput.value.trim() !== ""){
        fetchWeather(cityInput.value);
    } else {
        geoLocation();
    }
});

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

		condition.textContent = getWeatherCondition(weather.current.weather_code);

			if(condition.textContent === "Clear sky"){
				weatherIcon.src = "images/clear.png";
			}
			if(condition.textContent === "Cloudy"){
				weatherIcon.src = "images/clouds.png";
			}
			if(condition.textContent === "Rain" || condition.textContent === "Rain showers"){
				weatherIcon.src = "images/rain.png";
			}
			if(condition.textContent === "Snow"){
				weatherIcon.src = "images/snow.png";
			}

			 const locationResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );

		const locationData = await locationResponse.json();

		cityName.textContent = locationData.city || locationData.locality || "Your Location";
		weatherError.textContent = "";

	}
		catch (error) {
		weatherError.textContent = "Error fetching weather data.";
		console.error(error);
		}

}

async function fetchWeather(city){
	weatherError.textContent = "Loading...";


	try{

		const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
		const locationData = await locationResponse.json();

		if (!locationData.results || locationData.results.length === 0) {
			weatherError.textContent = "City not found.";
			return;
		}

		const location = locationData.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
 
        )

		const weather = await weatherResponse.json();

		temperature.textContent =
			Math.round(weather.current.temperature_2m) + "°C";

			humidity.textContent =
			weather.current.relative_humidity_2m;

			wind.textContent =
			Math.round(weather.current.wind_speed_10m);

			condition.textContent = getWeatherCondition(weather.current.weather_code);

			if(condition.textContent === "Clear sky"){
				weatherIcon.src = "images/clear.png";
			}
			if(condition.textContent === "Cloudy"){
				weatherIcon.src = "images/clouds.png";
			}
			if(condition.textContent === "Rain" || condition.textContent === "Rain showers"){
				weatherIcon.src = "images/rain.png";
			}
			if(condition.textContent === "Snow"){
				weatherIcon.src = "images/snow.png";
			}

			cityName.textContent = location.name || "Your Location";

			weatherError.textContent = "";

	}


	catch (error) {
		weatherError.textContent = "Error fetching weather data.";
		console.error(error);
	}
}


function getWeatherCondition(code) {

	

    if (code === 0) {


        return "Clear sky"
		

    }



    if (code === 1 || code=== 2 || code=== 3) {

        return "Cloudy"
		
    }


    if (code >= 51 && code<= 67) 
        {

        return "Rain"
		
    }
    if (code >= 71 && code<= 77) 
        
        {

        return "Snow";
		
    }


    if (code >= 80 && code <= 82) {
        return "Rain showers";
		
    }


    if (code>= 95) {
        return "Thunderstorm";
		
    }



    return "Unknown";


}


cityInput.addEventListener("keypress", function(event) {
	if (event.key === "Enter") {
		searchButton.click();
	}
});


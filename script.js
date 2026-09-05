const url = 'https://easy-weather1.p.rapidapi.com/daily/5?city=Lucknow';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '8483fb97fdmsh41fd5919b7588a7p181d36jsnacafb88a49db',
		'x-rapidapi-host': 'easy-weather1.p.rapidapi.com',
		'Content-Type': 'application/json'
	}
};
async function getWeather() {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} 

getWeather();
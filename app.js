// api key : 82005d27a116c2880c8f0fcb866998a0

//select elements
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const feelsElement = document.querySelector(".feels-like p");
const humidityElement = document.querySelector(".humidity p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

//app data
const weather = {};
weather.temperature = {
    unit : "celsius"
}

const KELVIN = 273;
const key = "82005d27a116c2880c8f0fcb866998a0";

if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

//set user position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

function showError(error){
    notificationElement.style.display = "block"
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//get weather from API
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.feelsLike = Math.floor(data.main.feels_like - KELVIN);
            weather.humidity = data.main.humidity;
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
}

//display weather on UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    feelsElement.innerHTML = `Feels Like ${weather.feelsLike}°<span>C</span>`;
    humidityElement.innerHTML = `Humidity ${weather.humidity} %`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

//c to f
function cToF(temperature){
    return (temperature * 9/5) + 32;
}

tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
        if(weather.temperature.unit === "celcius"){
            let f = cToF(weather.temperature.value);
            f = Math.floor(f);

            tempElement.innerHTML = `${f}°<span>F</span>`;
            weather.temperature.unit = "fahrenheit";
        } else {
            tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
            weather.temperature.unit = "celcius";
        }
});

feelsElement.addEventListener("click", function(){
    if(weather.feelsLike === undefined) return;
        if(weather.temperature.unit === "celcius"){
            let f = cToF(weather.feelsLike);
            f = Math.floor(f);

            feelsElement.innerHTML = `Feels Like ${f}°<span>F</span>`;
            weather.temperature.unit = "fahrenheit";
        } else {
            feelsElement.innerHTML = `Feels Like ${weather.feelsLike}°<span>C</span>`;
            weather.temperature.unit = "celcius";
        }
});
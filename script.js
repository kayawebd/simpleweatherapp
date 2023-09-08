let weather = {
  apiKey: "d1d60e9fb085cd41f6a85061808d1369",
  fetchWeather: function () {
    fetch("http://www.geoplugin.net/json.gp")
      .then((response) => response.json())
      .then((data) => {
        const CITY = data.geoplugin_city;
        const SEARCH_CITY = document.querySelector(".searchBar").value;
        if (SEARCH_CITY === "") {
          const APIURL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${this.apiKey}`;
          return fetch(APIURL);
        } else {
          const APIURL = `https://api.openweathermap.org/data/2.5/weather?q=${SEARCH_CITY}&units=metric&appid=${this.apiKey}`;
          return fetch(APIURL);
        }
      })
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data))
      .catch((error) => {
        console.error("Error fetching weather:", error);
      });
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity, temp_min, temp_max } = data.main;
    const { speed } = data.wind;
    const { sunrise, sunset } = data.sys;
    const { country } = data.sys;

    const FORMATTED_SUNRISE_TIME = new Date(sunrise * 1000).toLocaleTimeString(
      "en-AU",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
    const FORMATTED_SUNSET_TIME = new Date(sunset * 1000).toLocaleTimeString(
      "en-AU",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );

    document.querySelector(".weather_city").innerText =
      "Weather in " + name + ", " + country;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".weather_overview-description").innerText =
      description;
    document.querySelector(".weather_overview-temp").innerText =
      Math.round(temp) + "°C";
    document.querySelector(".weather_range-tempMin").innerText =
      Math.round(temp_min) + " °C";
    document.querySelector(".weather_range-tempMax").innerText =
      Math.round(temp_max) + " °C";
    document.querySelector(".weather_humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".weather_wind").innerText =
      "Wind: " + speed + " km/h";
    document.querySelector(".weather_sunrise").innerText =
      "Sunrise: " + FORMATTED_SUNRISE_TIME;
    document.querySelector(".weather_sunset").innerText =
      "Sunset: " + FORMATTED_SUNSET_TIME;
    // remove loading
    document.querySelector(".weather").classList.remove("loading");
    // remove search filed input data after user press enter or search button
    document.querySelector(".searchBar").value = "";
    // change background image acrodding to the city
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?landscape+" + name + "')";
  },
  search: function () {
    this.fetchWeather(document.querySelector(".searchBar").value);
  },
};

// add search button
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".searchBar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });
weather.fetchWeather();

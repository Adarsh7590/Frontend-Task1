const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key

document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert("Please enter a city name.");
  }
});

async function fetchWeather(city) {
  const weatherDisplay = document.getElementById("weatherDisplay");
  weatherDisplay.innerHTML = "<p>Loading...</p>";

  try {
    // Fetch current weather
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!weatherRes.ok) throw new Error("City not found!");

    const weatherData = await weatherRes.json();

    // Fetch 5-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    const forecastData = await forecastRes.json();

    displayWeather(weatherData, forecastData);
  } catch (error) {
    weatherDisplay.innerHTML = `<p>${error.message}</p>`;
  }
}

function displayWeather(weatherData, forecastData) {
  const weatherDisplay = document.getElementById("weatherDisplay");

  // Current Weather
  const currentWeatherHTML = `
    <div class="weather-card">
      <h2>${weatherData.name}</h2>
      <p><strong>Temperature:</strong> ${weatherData.main.temp} °C</p>
      <p><strong>Weather:</strong> ${weatherData.weather[0].description}</p>
      <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="weather-icon">
    </div>
  `;

  // Forecast Weather (next 5 days, every 3 hours)
  let forecastHTML = "<h3>5-Day Forecast</h3>";
  const dailyForecasts = forecastData.list.filter((_, index) => index % 8 === 0); // Approx. one per day

  dailyForecasts.forEach((forecast) => {
    forecastHTML += `
      <div class="weather-card">
        <p><strong>${forecast.dt_txt.split(" ")[0]}</strong></p>
        <p>${forecast.main.temp} °C</p>
        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="weather-icon">
      </div>
    `;
  });

  weatherDisplay.innerHTML = currentWeatherHTML + forecastHTML;
}

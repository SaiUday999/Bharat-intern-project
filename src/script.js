const apiKey = 'YOUR_TOMORROW_IO_API_KEY'; // Replace with your Tomorrow.io API key
const apiUrl = 'https://api.tomorrow.io/v1/forecasts?';

function getWeather() {
  const locationInput = document.getElementById('location');
  const location = locationInput.value.trim();

  if (!location) {
    alert('Please enter a location.');
    return;
  }

  const url = `${apiUrl}location=${location}&fields=temperature,description,conditions&units=metric&apikey=${apiKey}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        handleErrorResponse(response);
        return;
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      alert('Error fetching weather data. Please try again.');
    });
}

function handleErrorResponse(response) {
  const status = response.status;
  const message = response.statusText;

  if (status === 401) {
    alert('Invalid API key. Please check your API key and try again.');
  } else if (status === 404) {
    alert(`Location not found: ${location}. Please enter a valid location and try again.`);
  } else {
    alert(`Error fetching weather data: ${status} - ${message}. Please try again later.`);
  }
}

function displayWeather(data) {
  const weatherResult = document.getElementById('weather-result');
  const backgroundElement = document.getElementById('background-image');
  const forecastElement = document.getElementById('forecast');
  const conditionElement = document.getElementById('weather-condition');

  const temperature = data.data.temperature;
  const description = data.data.description;
  const weatherCondition = data.data.conditions;

  setBackgroundByCondition(weatherCondition, backgroundElement);

  weatherResult.innerHTML = `
    <p>Temperature: ${temperature} °C</p>
    <p>Description: ${description}</p>
  `;

  conditionElement.textContent = `Weather Condition: ${weatherCondition}`;

  // Clear previous forecast content
  forecastElement.innerHTML = '';

  fetchForecast(data.data.latitude, data.data.longitude, forecastElement);
}

function fetchForecast(lat, lon, element) {
  const forecastUrl = `${apiUrl}location=${lat},${lon}&fields=temperatureMin,temperatureMax,description,conditions&units=metric&apikey=${apiKey}`;

  fetch(forecastUrl)
    .then(response => {
      if (!response.ok) {
        handleErrorResponse(response);
        return;
      }
      return response.json();
    })
    .then(data => {
      const dailyForecast = data.data.timelines[0];
      element.innerHTML = '<h2>7-Day Forecast:</h2>';

      for (const day of dailyForecast.intervals) {
        const date = new Date(day.startTime * 1000);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temperatureMin = day.temperatureMin;
        const temperatureMax = day.temperatureMax;
        const description = day.description;
        const weatherCondition = day.conditions;

        element.innerHTML += `
          <div>
            <p>${dayOfWeek}</p>
            <p>Min Temp: ${temperatureMin} °C</p>
            <p>Max Temp: ${temperatureMax} °C</p>
            <p>Condition: ${weatherCondition}</p>
          </div>
        `;
      }
    })
    //*.catch(error => {
      //console.error('Error fetching forecast data:', error);
      //alert('Error fetching forecast data. Please try again.');
    //});
}

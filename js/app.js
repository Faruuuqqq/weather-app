import { fetchWeather } from "./weatherApi.js";

class WeatherApp {
  constructor() {
    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherContainer = document.getElementById('weather-container');
    this.historyList = document.getElementById('history-list');
    this.searchHistory = [];
    
    this.init();
  }

    init() {
      this.searchBtn.addEventListener('click', () => this.handleSearch());
      this.historyList.addEventListener('click', (e) => this.handleHistoryClick());

      const params = new URLSearchParams(window.location.search);
      const cityFromURL = params.get('city');
        if (cityFromURL) {
            this.cityInput.value = cityFromURL;
            this.handleSearch();
        }

        this.updateHistoryList();
    }

    showError(message) {
        this.weatherContainer.innerHTML = `
          <div class="error" style="color: red; padding: 10px; border: 1px solid red;">
            ⚠️ ${message}
          </div>`;
    }
    async handleSearch() {
        const city = this.cityInput.value.trim();
        if (!city) {
          this.showError("Please enter a city name");
          return;
        }
      
        try {
          const data = await fetchWeather(city);
          
          if (data.cod && data.cod !== 200 && data.cod !== '200') {
            this.showError(data.message || "City not found");
            return;
          }
      
          this.displayWeather(data);
          this.addToHistory(city);
          this.updateURL(city);
          
        } catch (error) {
          this.showError("Failed to fetch weather data. Please try again.");
          console.error("Search error:", error);
        }
      }      

    displayWeather(data) {
        // TODO: Display weather data
        if (data.cod === '404') {
            this.weatherContainer.innerHTML = `<p> ${data.message}</p>`;
            return;
        }

        this.weatherContainer.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${Math.round(data.main.temp)}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
      `;
    }

    addToHistory(city) {
        // TODO: Add city to search history
        if (!this.searchHistory.includes(city)) {
          this.searchHistory.unshift(city);
          if (this.searchHistory.length > 5) {
            this.searchHistory.pop();
          }

          localStorage.setItem('weatherHistory', JSON.stringify(this.searchHistory));
          this.updateHistoryList();
        }
    }

    updateHistoryList() {
        // TODO: Update the history list in the UI
        this.historyList.innerHTML = '';
        this.searchHistory.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.classList.add('history-item');
            li.dataset.city = city;
            this.historyList.appendChild(li);
        });
    }

    handleHistoryClick(e) {
        // TODO: Handle clicks on history items
        if (e.target && e.target.matches('li.history-item')) {
            const city = e.target.dataset.city;
            this.cityInput.value = city;
            this.handleSearch();
        }
    }

    updateURL(city) {
        // TODO: Update URL with the searched city
        const newURL = `${window.location.pathname}?city=${city}`;
        window.history.pushState({ path: newURL }, '', newURL);
    }
}

const app = new WeatherApp();
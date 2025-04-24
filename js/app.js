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
      this.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleSearch();
      });
      this.historyList.addEventListener('click', (e) => 
        this.handleHistoryClick());


      const params = new URLSearchParams(window.location.search);
      const cityFromURL = params.get('city');
        if (cityFromURL) {
            this.cityInput.value = cityFromURL;
            this.handleSearch();
        }

        this.updateHistoryList();
    }

    async handleSearch() {
        const city = this.cityInput.value.trim();
        if (!city) {
          this.showError("Please enter a city name");
          return;
        }
      
        try {
          this.showLoading();
          const data = await fetchWeather(city);
          
          if (data.cod && data.cod.toString() !== "200") {
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
    
    showError(message) {
      this.weatherContainer.innerHTML = `
        <div class="error">
          <i class="fas fa-exclamation-circle"></i>
          <span>${message}</span>
        </div>
      `;
    }

    showLoading() {
      this.weatherContainer.innerHTML = `
        <div class="weather-card">
          <div class="weather-header">
            <h2>Loading...</h2>
          </div>
          <div class="weather-body" style="text-align: center; padding: 2rem;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i>
          </div>
        </div>
      `;
    }

    displayWeather(data) {
      const date = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const weatherIcon = this.getWeatherIcon(data.weather[0].main);

      this.weatherContainer.innerHTML = `
        <div class="weather-card">
          <div class="weather-header">
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>${date}</p>
          </div>
          <div class="weather-body">
            <div class="weather-main">
              <div>
                <span class="temperature">${Math.round(data.main.temp)}°C</span>
                <p>${data.weather[0].description}</p>
              </div>
              <i class="weather-icon ${weatherIcon.icon}" style="color: ${weatherIcon.color};"></i>
            </div>
            <div class="weather-details">
              <div class="detail-item">
                <i class="fas fa-temperature-high"></i>
                <span>Feels like: ${Math.round(data.main.feels_like)}°C</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-tint"></i>
                <span>Humidity: ${data.main.humidity}%</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-wind"></i>
                <span>Wind: ${data.wind.speed} m/s</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-compress-alt"></i>
                <span>Pressure: ${data.main.pressure} hPa</span>
              </div>
            </div>
          </div>
        </div>
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

    getWeatherIcon(weatherMain) {
      const icons = {
        'Clear': { icon: 'fas fa-sun', color: '#FFD700' },
        'Clouds': { icon: 'fas fa-cloud', color: '#778899' },
        'Rain': { icon: 'fas fa-cloud-rain', color: '#4682B4' },
        'Snow': { icon: 'fas fa-snowflake', color: '#E0FFFF' },
        'Thunderstorm': { icon: 'fas fa-bolt', color: '#9400D3' },
        'Drizzle': { icon: 'fas fa-cloud-rain', color: '#87CEEB' },
        'Mist': { icon: 'fas fa-smog', color: '#D3D3D3' },
        'default': { icon: 'fas fa-cloud-sun', color: '#4361ee' }
      };
    
      return icons[weatherMain] || icons['default'];
    }
}

const app = new WeatherApp();
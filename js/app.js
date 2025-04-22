import { fetchWeather } from "./weatherApi";

console.log("App loaded");


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
      const cityFromURL = params.set('city');
        if (cityFromURL) {
            this.cityInput.value = cityFromURL;
            this.handleSearch();
        }

        this.updateHistoryList();
    }

    async handleSearch() {
        const city = this.cityInput.value.trim();
        if (!city) return;

        const data = await fetchWeather(city);
        this.displayWeather(data);

        if (data.cod !== '404') {
            this.addToHistory(city);
            this.updateURL(city);
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
        <p> Temperature: ${data.main.temp}°C</p>
        <p> Weather: ${data.main.weather[0].description}</p>
        <p> Humidity: ${data.main.humidity}</p>
        <p> Wind: ${data.main.speed}</p>
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
        if (e.target && e.target.matches('li.history.item')) {
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
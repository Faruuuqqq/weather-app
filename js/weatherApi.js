const API_KEY = 'b6b2a248e7ac3f978e6cc3325efec02d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function fetchWeather(city) {
  try {
    const response = await fetch(`${BASE_URL}?1=${city}$appid=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Weather data not found');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { cod: '404', message: error.message };
  }
}
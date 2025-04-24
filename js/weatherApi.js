const API_KEY = '1a74abcc5aa181c33a856cde503654e0';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function fetchWeather(city) {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
    );
      
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
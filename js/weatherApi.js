import { WEATHER_CONFIG } from './config.js';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchWeather(city) {
  try {
    const response = await fetch(
      `${WEATHER_CONFIG.BASE_URL}?q=${city}&units=metric&appid=${WEATHER_CONFIG.API_KEY}`
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
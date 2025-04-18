import axios from 'axios';
import { CurrentWeather } from '../types/types';
import { Weather } from '../types/types';

const BASE_URL = 'https://api.weatherapi.com/v1/';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;


export const weatherApi = {
  getCurrentWeather: async ({ location }: Weather): Promise<CurrentWeather> => {
    try {
      const response = await axios.get(`${BASE_URL}current.json`, {
        params: {
          key: API_KEY,
          q: location,
          aqi: 'yes'
        }
      });
      return response.data.current;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },
  
  getHourlyForecast: async ({ location }: Weather) => {
    try {
      const response = await axios.get(`${BASE_URL}forecast.json`, {
        params: {
          key: API_KEY,
          q: location,
          days: 1,
          aqi: 'no',
          alerts: 'no'
        }
      });
      
      const hourlyData = response.data.forecast.forecastday[0].hour.map((hour: any) => {
        const date = new Date(hour.time);
        const hourNum = date.getHours();
        const formattedHour = hourNum === 0 ? '12 AM' : 
                             hourNum < 12 ? `${hourNum} AM` : 
                             hourNum === 12 ? '12 PM' : 
                             `${hourNum - 12} PM`;
        
        return {
          time: formattedHour,
          temp_c: Math.round(hour.temp_c),
          feelslike_c: Math.round(hour.feelslike_c),
          condition: {
            text: hour.condition.text,
            code: hour.condition.code
          },
          wind_dir: hour.wind_dir,
          wind_kph: Math.round(hour.wind_kph),
          gust_kph: Math.round(hour.gust_kph),
          chance_of_rain: hour.chance_of_rain,
          uv_index: hour.uv,
          precip_in:hour.precip_in,
        };
      });
      
      return hourlyData;
    } catch (error) {
      console.error('Error fetching hourly forecast:', error);
      throw error;
    }
  },
  
  getDailyForecast: async ({ location }: Weather) => {
    try {
      const response = await axios.get(`${BASE_URL}forecast.json`, {
        params: {
          key: API_KEY,
          q: location,
          days: 7,
          aqi: 'no',
          alerts: 'no'
        }
      });
      const dailyData = response.data.forecast.forecastday.map((day: any) => {
        const date = new Date(day.date);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[date.getDay()];
        const dateFormatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return {
          date: day.date,
          date_formatted: dateFormatted,
          day_name: dayName,
          maxtemp_c: Math.round(day.day.maxtemp_c),
          mintemp_c: Math.round(day.day.mintemp_c),
          avgtemp_c: Math.round(day.day.avgtemp_c),
          maxwind_kph: Math.round(day.day.maxwind_kph),
          wind_dir: day.hour[12].wind_dir, 
          totalprecip_mm: day.day.totalprecip_mm,
          avghumidity: day.day.avghumidity,
          chance_of_rain: day.day.daily_chance_of_rain,
          uv_index: day.day.uv,
          condition: {
            text: day.day.condition.text,
            code: day.day.condition.code
          }
        };
      });
      
      return dailyData;
    } catch (error) {
      console.error('Error fetching daily forecast:', error);
      throw error;
    }
  },

  getMonthlyForecast: async ({ location }: Weather) => {
    try {
      const response = await axios.get(`${BASE_URL}forecast.json`, {
        params: {
          key: API_KEY,
          q: location,
          days: 90,
          aqi: 'no',
          alerts: 'no'
        }
      });
      const dailyData = response.data.forecast.forecastday.map((day: any) => {
        const date = new Date(day.date);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[date.getDay()];
        const dateFormatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return {
          date: day.date,
          date_formatted: dateFormatted,
          day_name: dayName,
          maxtemp_c: Math.round(day.day.maxtemp_c),
          mintemp_c: Math.round(day.day.mintemp_c),
        };
      });
      
      return dailyData;
    } catch (error) {
      console.error('Error fetching daily forecast:', error);
      throw error;
    }
  }
};
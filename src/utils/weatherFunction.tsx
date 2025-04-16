import { getUserLocation } from '../api/ipinfo';
import { weatherApi } from '../api/weather';  
import { WeatherQueryData } from '../types/types'

export const fetchWeather = async (): Promise<WeatherQueryData> => {
  const locationData = await getUserLocation();
  const weatherData = await weatherApi.getCurrentWeather({ location: locationData.city });
  return { locationData, weatherData };
};

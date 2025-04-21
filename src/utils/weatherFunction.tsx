import { getUserLocation } from '../api/ipinfo';
import { weatherApi } from '../api/weather';
import { WeatherQueryData } from '../types/types';
import { queryClient } from '../config/queryClient';

export const fetchWeather = async (): Promise<WeatherQueryData> => {
  const selectedLocation = queryClient.getQueryData<string>(['selectedLocation']);
  
  if (selectedLocation) {
    const weatherData = await weatherApi.getCurrentWeather({ location: selectedLocation });
    return { 
      locationData: { 
        city: selectedLocation, 
        region: '', 
        country: '', 
        timezone: '', 
        currentTime: new Date().toLocaleString() 
      }, 
      weatherData 
    };
  }
  const locationData = await getUserLocation();
  const weatherData = await weatherApi.getCurrentWeather({ location: locationData.city });
  return { locationData, weatherData };
};
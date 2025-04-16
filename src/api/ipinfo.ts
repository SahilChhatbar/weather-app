import axios from 'axios';

const API_KEY = import.meta.env.VITE_IP_API_KEY;
const BASE_URL = 'https://ipinfo.io';
const ipinfoApi = axios.create({
  baseURL: BASE_URL,
  params: {
    token: API_KEY
  }
});

export interface LocationData {
  city: string;
  country: string;
  region: string;
  timezone: string;
  currentTime: string;
}

export const getUserLocation = async (): Promise<LocationData> => {
  try {
    const response = await ipinfoApi.get('/json');
    const locationData = response.data;
    const currentTime = new Date().toLocaleString('en-US', {
      timeZone: locationData.timezone,
      dateStyle: 'medium',
      timeStyle: 'medium'
    });
    return {
      ...locationData,
      currentTime
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    throw error;
  }
};

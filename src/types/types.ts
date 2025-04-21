
interface WeatherCondition {
  condition: {
    text: string;
    code: number ;
  };
}

interface WindData {
  wind_dir: string;
  wind_kph: number;
  gust_kph: number;
}

interface TemperatureData {
  temp_c: number;
  feelslike_c: number;
}

interface AirQualityData {
  air_quality: {
    pm10: number;
  };
}

export interface Weather {
  location: string | undefined;
}

export interface CurrentWeather extends TemperatureData, WeatherCondition, WindData, AirQualityData {}

export interface WeatherQueryData {
  locationData: LocationData;
  weatherData: CurrentWeather;
}

export interface HourlyForecast extends TemperatureData, WindData, WeatherCondition {
  time: string;
  chance_of_rain: number;
  uv_index: number;
  precip_in:number;
}

export interface HourlyWeatherProps {
  city?: string;
  country?: string;
}

export interface DailyForecast extends WeatherCondition, WindData {
  date: string;
  date_formatted: string;
  day_name: string;
  maxtemp_c: number;
  mintemp_c: number;
  avgtemp_c: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  avghumidity: number;
  chance_of_rain: number;
  uv_index: number;
}

export interface DailyWeatherProps {
  city?: string;
  country?: string;
}

export interface LocationData {
  city: string;
  timezone: string;
  country?: string;
  region?: string;
  currentTime:string
}

export interface PrecipitationData {
  time: string;
  precipitation: number;
}

export interface WeatherData extends AirQualityData {}


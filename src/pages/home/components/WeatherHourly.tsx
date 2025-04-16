import React from 'react';
import { Card, Text, Loader, Group, Title, Divider, Badge, Stack, Center } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { HourlyWeatherProps } from '../../../types/types';
import { getWeatherIcon } from '../../../utils/getWeatherIcon';
import { getUvIndexCategory } from '../../../utils/getUvIndexCategory';
import { weatherApi } from '../../../api/weather'; 
import { isDaytime, currentHour } from '../../../constants';
import { fetchWeather } from '../../../utils/weatherFunction';
import { WiWindy } from 'react-icons/wi';

const WeatherHourly: React.FC<HourlyWeatherProps> = ({ city, country }) => {
  const { 
    data: locationWeatherData,
    isLoading: isLocationLoading,
    error: locationError
  } = useQuery({
    queryKey: ['locationWeather'],
    queryFn: fetchWeather
  });

  const { 
    data: hourlyData, 
    isLoading: isHourlyLoading, 
    error: hourlyError 
  } = useQuery({
    queryKey: ['hourlyWeather', locationWeatherData?.locationData?.city],
    queryFn: () => weatherApi.getHourlyForecast({ 
       location: locationWeatherData?.locationData?.city || city || ''
    }),
    enabled: !!locationWeatherData?.locationData?.city
  });

  const isLoading = isLocationLoading || isHourlyLoading;
  const error = locationError || hourlyError;
  const displayCity = locationWeatherData?.locationData?.city || city ;
  const displayCountry = locationWeatherData?.locationData?.country 
    ? `${locationWeatherData?.locationData?.region}, ${locationWeatherData?.locationData?.country}` 
    : country ;

  if (isLoading) {
    return <Center><Loader/></Center>;
  }

  if (error) {
    return <Text c="red">Error loading forecast data</Text>;
  }

  if (!hourlyData || hourlyData.length === 0) {
    return <Text>No hourly forecast available</Text>;
  }

  const sortedHourlyData = [...hourlyData].sort((a, b) => {
    const getHourValue = (timeStr: string) => {
      const [hourStr, period] = timeStr.split(' ');
      let hour = parseInt(hourStr);
      
      if (period === 'PM' && hour < 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      return hour;
    };
    
    return getHourValue(a?.time ?? '') - getHourValue(b?.time ?? '');
  });
  
  const futureHourlyData = sortedHourlyData.filter((hour) => {
    const [hourStr, period] = hour?.time?.split(' ') ?? [];
    let hourValue = parseInt(hourStr ?? '0');
    
    if (period === 'PM' && hourValue < 12) hourValue += 12;
    if (period === 'AM' && hourValue === 12) hourValue = 0;
    
    return hourValue >= currentHour;
  });
  
  const displayData = futureHourlyData.length > 0 ? futureHourlyData : sortedHourlyData;

  return (
    <Card shadow="none" padding="lg" radius={10} withBorder className="w-145 mx-auto">
      <Group justify="space-between" mb="md">
        <Title order={3} className="font-medium">
          {displayCity}, {displayCountry}
        </Title>
      </Group>
      <Text size="sm" c="dimmed" mb="md">Hourly Forecast</Text>
      <div className="h-fit">
        {displayData.slice(0, 12).map((hour, index) => {
          const [hourStr, period] = hour?.time?.split(' ') ?? [];
          let hourValue = parseInt(hourStr ?? '0');
          
          if (period === 'PM' && hourValue < 12) hourValue += 12;
          if (period === 'AM' && hourValue === 12) hourValue = 0;
          
          const isDay = isDaytime(hourValue);
          const uvCategory = getUvIndexCategory(hour?.uv_index);

          return (
            <div key={index}>
              <Group justify="space-between" className="py-3" >
                <Group gap="sm" >
                  <Text fw={500} size="xl" className='w-15 font-mono'>
                    {hour?.time}
                  </Text>
                  <Group gap={4}>
                    {getWeatherIcon(hour?.condition?.code, isDay)}
                    <Text fw={700} size='xl' >
                      {hour?.temp_c}°
                    </Text>
                  </Group>
                  <Stack gap={0}>
                    <Text size="md" fw={600} className='font-mono'>
                      {hour?.condition?.text}
                    </Text>
                    <Text size="sm" c="dimmed">
                      RealFeel® {hour?.feelslike_c}°
                    </Text>
                  </Stack>
                </Group>
                <Group gap="md" >
                  <Group gap="xs" >
                    <WiWindy size={24} className='text-gray-400'/>
                    <Text size="sm">
                      {hour?.wind_dir} {hour?.wind_kph} km/h
                    </Text>
                  </Group>
                  <Badge 
                    size="md" 
                    c={uvCategory?.color}
                    variant="light"
                    className="whitespace-nowrap"
                  >
                    UV: {hour?.uv_index}
                  </Badge>
                </Group>
              </Group>
              {index < displayData.slice(0, 12).length - 1 && <Divider />}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default WeatherHourly;

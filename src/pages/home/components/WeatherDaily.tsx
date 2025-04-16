import React from 'react';
import { Card, Text, Loader, Group, Title, Divider, Badge, Stack, Center } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { DailyWeatherProps, WeatherQueryData, DailyForecast } from '../../../types/types';
import { getWeatherIcon } from '../../../utils/getWeatherIcon';
import { MdCloud } from 'react-icons/md';
import { WiHumidity } from 'react-icons/wi';
import { getUvIndexCategory } from '../../../utils/getUvIndexCategory';
import { weatherApi } from '../../../api/weather'; 
import { isDaytime } from '../../../constants';
import { fetchWeather } from '../../../utils/weatherFunction';

const WeatherDaily: React.FC<DailyWeatherProps> = ({ city, country }) => {
  const { 
    data: locationWeatherData,
    isLoading: isLocationLoading,
    error: locationError
  } = useQuery<WeatherQueryData, Error>({
    queryKey: ['locationWeather'],
    queryFn: fetchWeather
  });

  const { 
    data: dailyData, 
    isLoading: isDailyLoading, 
    error: dailyError 
  } = useQuery<DailyForecast[], Error>({
    queryKey: ['dailyWeather', locationWeatherData?.locationData?.city],
    queryFn: () => weatherApi.getDailyForecast({ 
      location: locationWeatherData?.locationData?.city || city || ''
    }),
    enabled: !!(locationWeatherData?.locationData?.city || city)
  });

  const isLoading = isLocationLoading || isDailyLoading;
  const error = locationError || dailyError;
  const displayCity = locationWeatherData?.locationData?.city || city || '';
  const displayCountry = locationWeatherData?.locationData?.country 
    ? `${locationWeatherData?.locationData?.region || ''}, ${locationWeatherData?.locationData?.country}` 
    : country || '';

  if (isLoading) {
    return <Center><Loader/></Center>;
  }

 if (error instanceof Error) {
     return <Text c="red">Error fetching data: {error.message}</Text>;
   }

  if (!dailyData || dailyData.length === 0) {
    return <Text>No daily forecast available</Text>;
  }

  return (
    <Card shadow="none" padding="lg" radius={10} withBorder className="w-fit mx-auto">
      <Group justify="space-between" mb="md">
        <Title order={3} className="font-medium">
          {displayCity}, {displayCountry}
        </Title>
      </Group>
      <Text size="sm" c="dimmed" mb="md">7-Day Forecast</Text>
      <div className="h-fit">
        {dailyData.map((day, index) => {
          const uvCategory = getUvIndexCategory(day?.uv_index);
          const isDay = isDaytime(new Date().getHours());

          return (
            <div key={index}>
              <Group justify="space-between" className="py-3" >
                <Group gap="sm" >
                  <Stack gap={0} className="w-20">
                    <Text fw={600} size="md" className="font-mono">
                      {day?.date_formatted}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {day?.day_name}
                    </Text>
                  </Stack>
                  <Group gap={4}>
                    {getWeatherIcon(day?.condition?.code, isDay)}
                    <Stack gap={0} align="center">
                      <Text fw={700} size='xl'>
                        {day?.maxtemp_c}°
                      </Text>
                      <Text size="sm" c="dimmed">
                        {day?.mintemp_c}°
                      </Text>
                    </Stack>
                  </Group>
                  <Text size="md" fw={600} className='font-mono'>
                    {day?.condition.text}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Precip: {day?.chance_of_rain}%
                  </Text>
                </Group>
                <Group gap="md" >
                  <Group gap="xs" >
                    <MdCloud size={24} color='gray'/>
                    <Text size="sm">
                      {day?.wind_dir} {day?.maxwind_kph} km/h
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <WiHumidity size={24} color='gray' />
                    <Text size="sm">{day?.avghumidity}%</Text>
                  </Group>
                  <Badge 
                    size="md" 
                    c={uvCategory?.color}
                    variant="light"
                    className="whitespace-nowrap"
                  >
                    UV: {day?.uv_index}
                  </Badge>
                </Group>
              </Group>
              {index < dailyData.length - 1 && <Divider />}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default WeatherDaily;
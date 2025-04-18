import { BarChart } from '@mantine/charts';
import { Card, Text, Group, Box, Divider, Center, Loader } from '@mantine/core';
import { weatherApi } from '../../../api/weather';
import { getUserLocation } from '../../../api/ipinfo';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { HourlyForecast, LocationData,PrecipitationData } from '../../../types/types';

const MinuteCast = () => {
  const [precipData, setPrecipData] = useState<PrecipitationData[]>([]);
  const [location, setLocation] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);

  const { 
    data: locationData, 
    isLoading: locationLoading, 
    error: locationError 
  } = useQuery<LocationData, Error>({
    queryKey: ['userLocation'],
    queryFn: getUserLocation,
  });

  useEffect(() => {
    if (locationData?.city) {
      setLocation(locationData.city);
      if (locationData.currentTime) {
        const timeOnly = new Date(locationData.currentTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
        setCurrentTime(timeOnly);
      }
    }
  }, [locationData]);

  const { 
    data: currentWeather,
    isLoading: currentWeatherLoading
  } = useQuery({
    queryKey: ['currentWeather', location],
    queryFn: () => weatherApi.getCurrentWeather({ location }),
    enabled: !!location,
  });

  useEffect(() => {
    if (currentWeather?.temp_c) {
      setCurrentTemp(Math.round(currentWeather.temp_c));
    }
  }, [currentWeather]);

  const { 
    data: hourlyData, 
    isLoading: weatherLoading, 
    error: weatherError 
  } = useQuery<HourlyForecast[], Error>({
    queryKey: ['hourlyForecast', location],
    queryFn: () => weatherApi.getHourlyForecast({ location }),
    enabled: !!location,
  });

  useEffect(() => {
    if (hourlyData) {
      const groupedData: PrecipitationData[] = [];
      for (let i = 0; i < hourlyData.length; i += 1) {
        const hour = hourlyData[i];
        groupedData.push({
          time: hour.time,
          precipitation: hour.precip_in * 25.4 
        });
      }
      setPrecipData(groupedData.slice(0, 4)); 
    }
  }, [hourlyData]);

  const isLoading = locationLoading || weatherLoading || currentWeatherLoading;
  const error = locationError || weatherError;

  const maxPrecip = precipData.length > 0 
    ? Math.max(...precipData.map(item => item.precipitation))
    : 5; 

      if (isLoading) {
        return (
          <Center>
            <Loader />  
          </Center>
        );
      }
    
      if (error instanceof Error) {
          return <Text c="red">Error fetching data: {error.message}</Text>;
        }
    
  return (
  <Center>
    <Card shadow="none" padding="md" radius="md" withBorder className="bg-gray-100 w-145">
      <Group justify="space-between" mb="md">
          <Text fw={700} size="xl">{location}</Text>
          {currentTemp !== null && (
            <Text fw={700} size="xl">{currentTemp}°C</Text>
          )}
      </Group>
      {!isLoading && !error && (
        <Box className="bg-white p-4 rounded-md">
          {precipData.length > 0 && (
            <Box mt={20} mb={10}>
              <Group justify="apart" mb={5}>
                <Text size="sm" fw={700} c="gray.7">Heavy</Text>
                <Box w={20} />
              </Group>
              <BarChart
                h={150}
                data={precipData}
                dataKey="time"
                series={[{ name: 'Precipitation', color: 'blue.6' }]}
                tickLine="y"
                withLegend={false}
                withTooltip={false}
                barProps={{ radius: 0 }}
                yAxisProps={{
                  domain: [0, maxPrecip > 0 ? maxPrecip * 1.1 : 5],
                  tickCount: 0, 
                  hide: true 
                }}
                xAxisProps={{
                  tickLine: false
                }}
                valueFormatter={(value: number) => `${value.toFixed(1)} mm`}
              />
                <Text size="sm" fw={700} c="gray.7">Light</Text>
             </Box>
          )}
          <Divider my="sm" />
          <Group justify="center" mt={10} gap="xs">
            <Group gap={5}>
              <Box className="w-3 h-3 rounded-full bg-red-500" />
              <Text size="xs">Rain</Text>
            </Group>
            <Group gap={5}>
              <Box className="w-3 h-3 rounded-full bg-blue-500" />
              <Text size="xs">Snow</Text>
            </Group>
            <Group gap={5}>
              <Box className="w-3 h-3 rounded-full bg-pink-400" />
              <Text size="xs">Ice</Text>
            </Group>
            <Group gap={5}>
              <Box className="w-3 h-3 rounded-full bg-purple-500" />
              <Text size="xs">Mix</Text>
            </Group>
          </Group>
        </Box>
      )}
    </Card>
  </Center>
  );
};

export default MinuteCast;
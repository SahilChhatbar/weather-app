import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Text, Loader, Group, Divider, Grid, Stack, Center } from "@mantine/core";
import { MdSunny } from "react-icons/md";
import { getAirQualityRating } from "../../../utils/getAQR";
import { currentTime } from "../../../constants";
import { fetchWeather } from "../../../utils/weatherFunction";

const WeatherToday: React.FC = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 30000
  });

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

  if (!data) {
    return <Text c="red">No data available</Text>;
  }

  const { weatherData, locationData } = data;
  const airQuality = getAirQualityRating(weatherData?.air_quality?.pm10);

  return (
    <Card
      padding="lg"
      shadow="none"
      radius={10}
      withBorder
      className="w-145 mx-auto"
    >
      <Group justify="space-between">
        <Text fw={500} size="lg">
          CURRENT WEATHER - {locationData?.city}
        </Text>
        <Text fw={500}>{currentTime}</Text>
      </Group>
      <Divider />
      <Grid mt="md">
        <Grid.Col span={6}>
          <Group>
            <MdSunny size={90} color="#FFA500" />
            <Stack gap={0} className="text-6xl flex flex-col">
              <Group gap={0}>
                {Math.round(weatherData?.temp_c ?? 0)}°
                <span className="text-slate-400">c</span>
              </Group>
              <Text fw={500} c="gray" mt="xs" size="lg">
                RealFeel® {Math.round(weatherData?.feelslike_c ?? 0)}°
              </Text>
            </Stack>
          </Group>
          <Text mt={70} fz="h2" fw={600} className="font-mono">
            {weatherData?.condition?.text}
          </Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Group justify="space-between" mb="md">
            <Text fw={500}>RealFeel Shade™</Text>
            <Text fw={500}>{Math.round(weatherData?.feelslike_c ?? 0)}°</Text>
          </Group>
          <Divider />
          <Group justify="space-between" my="md">
            <Text fw={500}>Wind</Text>
            <Text fw={500}>
              {weatherData?.wind_dir || "WNW"}
              {Math.round(weatherData?.wind_kph ?? 0)} km/h
            </Text>
          </Group>
          <Divider />
          <Group justify="space-between" my="md">
            <Text fw={500}>Wind Gusts</Text>
            <Text fw={500}>
              {Math.round(weatherData?.gust_kph ?? 0)} km/h
            </Text>
          </Group>
          <Divider />
          <Group justify="space-between" my="md">
            <Text fw={500}>Air Quality</Text>
            <Text fw={500} c={airQuality?.color}>
              {airQuality?.text}
            </Text>
          </Group>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default WeatherToday;
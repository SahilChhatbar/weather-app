import { Calendar } from "@mantine/dates";
import React from "react";
import { Text, Loader, Center, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { DailyWeatherProps, WeatherQueryData, DailyForecast } from "../../../types/types";
import { weatherApi } from "../../../api/weather";
import { fetchWeather } from "../../../utils/weatherFunction";

const WeatherMonthly: React.FC<DailyWeatherProps> = ({ city }) => {
  const {
    data: locationWeatherData,
    isLoading: isLocationLoading,
    error: locationError,
  } = useQuery<WeatherQueryData, Error>({
    queryKey: ["locationWeather"],
    queryFn: fetchWeather,
  });

  const {
    data: dailyData,
    isLoading: isDailyLoading,
    error: dailyError,
  } = useQuery<DailyForecast[], Error>({
    queryKey: ["dailyWeather", locationWeatherData?.locationData?.city],
    queryFn: () =>
      weatherApi.getMonthlyForecast({
        location: locationWeatherData?.locationData?.city || city || "",
      }),
    enabled: !!(locationWeatherData?.locationData?.city || city),
  });

  const isLoading = isLocationLoading || isDailyLoading;
  const error = locationError || dailyError;

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

  if (!dailyData || dailyData.length === 0) {
    return <Text>No forecast available</Text>;
  }

  const forecastMap = dailyData.reduce((map, forecast) => {
    const dateStr = new Date(forecast.date).toDateString();
    map[dateStr] = forecast;
    return map;
  }, {} as Record<string, DailyForecast>);

  return (
    <Center>
      <Calendar
        size="xl"
        className="bg-white"
        static
        renderDay={(date) => {
          const dateStr = date.toDateString();
          const forecast = forecastMap[dateStr];
          const day = date.getDate();

          return (
              <div>
                <div>{day}</div>
                {forecast && (
                  <Stack gap={0} align="center">
                    <Text fw={700} size="xs">
                      {forecast?.maxtemp_c}°
                    </Text>
                    <Text size="xs" c="dimmed">
                      {forecast?.mintemp_c}°
                    </Text>
                  </Stack>
                )}
              </div>
          );
        }}
      />
    </Center>
  );
};

export default WeatherMonthly;

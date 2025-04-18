import { useEffect, useState } from "react";
import { Card, Divider, Group, Stack, Text, RingProgress, Loader, Center } from "@mantine/core";
import { getUserLocation } from "../../../api/ipinfo";
import { weatherApi } from "../../../api/weather"; 
import { useQuery } from "@tanstack/react-query";
import { getAirQualityCategory } from "../../../utils/getAQI";
import { LocationData } from "../../../api/ipinfo";
import { WeatherData } from "../../../types/types";

const AirQuality = () => {
  const [formattedDate, setFormattedDate] = useState("");
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  useEffect(() => {
    getUserLocation().then((location) => {
      setLocationData(location);
      const timezone = location.timezone;
      const date = new Date();
      const localDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        timeZone: timezone,
      });
      setFormattedDate(localDate);
    });
  }, []);

  const { data: airQualityData, isLoading, error } = useQuery<WeatherData, Error>({
    queryKey: ['currentWeather', locationData?.city],
    queryFn: () => weatherApi.getCurrentWeather({ location: locationData?.city || '' }),
    enabled: !!locationData?.city,
  });

  const getAirQualityProgress = (pm10Value: number) => {
    return pm10Value;
  };
  
  if (isLoading) {
    return <Center><Loader /></Center>;
  }
  if (error instanceof Error) {
      return <Text c="red">Error fetching data: {error.message}</Text>;
    }

  return (
    <Card
      padding="lg"
      shadow="none"
      radius={10}
      withBorder
      className="w-145 mx-auto"
    >
      <Text fw={500} size="lg">
        Current Air Quality
      </Text>
      <Divider className="mb-3" />
      <Stack gap={0} mb="md">
        <Text fw={500} size="md">
          Today
        </Text>
        <Text fw={350} c="gray" size="md">
          {formattedDate}
        </Text>
      </Stack>
      {error && <Text c="red">Error loading air quality data</Text>}
      {airQualityData && airQualityData.air_quality && (
        <Group align="center" grow>
          <div className="relative flex">
            <RingProgress
              size={120}
              thickness={10}
              roundCaps
              sections={[
                {
                  value: getAirQualityProgress(airQualityData?.air_quality?.pm10/5),
                  color: getAirQualityCategory(airQualityData?.air_quality.pm10)?.color,
                },
              ]}
            />
            <Text 
              fw={700} 
              size="xl" 
              className="absolute top-[38%] left-[18%]" 
            >
              {Math.round(airQualityData?.air_quality?.pm10)}
            </Text>
          </div>
          <Stack gap={0}>
            <Text fw={700} size="xl">
              {getAirQualityCategory(airQualityData?.air_quality.pm10)?.category}
            </Text>
            <Text>
              {getAirQualityCategory(airQualityData?.air_quality.pm10)?.description}
            </Text>
          </Stack>
        </Group>
      )}
    </Card>
  );
};

export default AirQuality;
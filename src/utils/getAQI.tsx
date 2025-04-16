export const getAirQualityCategory = (pm10Value: number) => {
  if (pm10Value <= 20) return { category: "Good", color: "#4CAF50", description:"great day for a walk." };
  if (pm10Value <= 50) return { category: "Moderate", color: "#FFC107", description:"breathable." };
  if (pm10Value <= 100) return { category: "Poor", color: "#FF9800", description:"poor air quality, wear a mask when going outside." };
  if (pm10Value <= 200) return { category: "Unhealthy", color: "#F44336", description:"unhealthy to breath, stay indoors." };
  return { category: "Hazardous", color: "#9C27B0", description:"extremely hazardous." };
};

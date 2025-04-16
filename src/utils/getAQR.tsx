export const getAirQualityRating = (pm10: number) => {
    if (pm10 <= 20) return { text: "Good", color: "green" };
    if (pm10 <= 50) return { text: "Moderate", color: "yellow" };
    if (pm10 <= 100) return { text: "Poor", color: "orange" };
    if (pm10 <= 200) return { text: "Unhealthy", color: "red" };
    return { text: "Hazardous", color: "red" };
  };
export const getUvIndexCategory = (index: number) => {
  if (index <= 2) return { text: 'Low', color: 'green' };
  if (index <= 5) return { text: 'Moderate', color: 'yellow' };
  if (index <= 7) return { text: 'High', color: 'orange' };
  if (index <= 10) return { text: 'Very High', color: 'red' };
  return { text: 'Extreme', color: 'purple' };
};

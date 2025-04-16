import { MdSunny, MdStorm,  MdBedtime } from 'react-icons/md';
import { WiFog } from 'react-icons/wi';

export const getWeatherIcon = (conditionCode: number, isDay: boolean) => {

    if (conditionCode >= 1000 && conditionCode < 1030)
       {
      return isDay ? <MdSunny size={50} color="#FFA500" /> : <MdBedtime size={50} color="#80" />;
    }
     else if (conditionCode >= 1030 && conditionCode < 1100)
       {
      return <WiFog size={50} color="#999" />;
    } 
    else if (conditionCode >= 1100 && conditionCode < 1200)
       {
      return <MdStorm size={50} color="#555" />;
    } 
    else 
    {
      return <MdStorm size={50} color="#333" />;
    }
  };
  
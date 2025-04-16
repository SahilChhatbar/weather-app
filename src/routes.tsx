import { createBrowserRouter } from 'react-router-dom';
import AppShellLayout from './layout/AppShellLayout';
import Home from './pages/home/index';
import MinuteCast from './pages/home/components/MinuteCast';
import WeatherDaily from './pages/home/components/WeatherDaily';
import WeatherMonthly from './pages/home/components/WeatherMonthly';
import WeatherHourly from './pages/home/components/WeatherHourly';
import AirQuality from './pages/home/components/AirQuality';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShellLayout />,
    children: [
      {
        index: true,
       element: <Home />,
      },
      {
       path: "/minute",
       element: <MinuteCast />,
      },
      {
        path: "/daily",
        element: <WeatherDaily />,
       },
       {
        path: "/monthly",
        element: <WeatherMonthly />,
       },
       {
        path: "/hourly",
        element: <WeatherHourly />,
       },
       {
        path: "/air",
        element: <AirQuality />,
       },
    ],
  },
]);

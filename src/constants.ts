
export const isDaytime = (hour: number) => {
    return hour >= 8 && hour < 20;
  };

export  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

export const navItems = [
    { label: 'TODAY', path: '/' },
    { label: 'HOURLY', path: '/hourly' },
    { label: 'DAILY', path: '/daily' },
    { label: 'MONTHLY', path: '/monthly' },
    { label: 'MINUTECAST', path: '/minute' },
    { label: 'AIR QUALITY', path: '/air' },
  ];

export const currentHour = new Date().getHours();
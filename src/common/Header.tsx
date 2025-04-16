import { Group, Input, Stack, Text, Title } from '@mantine/core';
import { VscSearch } from 'react-icons/vsc';
import { NavLink } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getUserLocation } from '../api/ipinfo';
import { navItems } from '../constants';

const Header = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [userLocation, setUserLocation] = useState<{ city: string; region: string } | null>(null);

  useEffect(() => {
    getUserLocation().then((data) => {
      setUserLocation({ city: data.city, region: data.region });
    });
  }, []);

  return (
    <Stack>
      <div className="flex flex-row items-center justify-center bg-gray-800">
        <Group gap="md" justify="space-around" p="xs" className="text-white">
          <Title order={3} fw={600}>Weather</Title>
          {userLocation && (
            <Text>{userLocation.city}, {userLocation.region}</Text>
          )}
          <div className="flex relative p-2">
            <Input placeholder="Search City or Postcode" />
            <VscSearch size={15} className="absolute top-5 left-43 text-gray-400" />
          </div>
        </Group>
      </div>
      <div className="relative">
        <Group ref={containerRef} justify="center" gap="xl" className="text-gray-400 relative">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `hover:font-semibold ${
                  isActive ? 'font-semibold text-gray-800' : ''
                }`
              }
            >
              <Text
                ref={(el) => {
                  linkRefs.current[item.path] = el?.parentElement as HTMLDivElement;
                }}
              >
                {item.label}
              </Text>
            </NavLink>
          ))}
        </Group>
      </div>
    </Stack>
  );
};

export default Header;

import { Group, Input, Stack, Text, Title } from '@mantine/core';
import { VscSearch } from 'react-icons/vsc';
import { NavLink } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getUserLocation } from '../api/ipinfo';
import { navItems } from '../constants';
import { weatherApi } from '../api/weather';
import { queryClient } from '../config/queryClient';

const Header = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [userLocation, setUserLocation] = useState<{ city: string; region: string } | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    getUserLocation().then((data) => {
      setUserLocation({ city: data.city, region: data.region });
      queryClient.setQueryData(['selectedLocation'], data.city);
    });
  }, []);

  const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setSearchError('');
  };

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    setIsSearching(true);
    try {
      await weatherApi.getCurrentWeather({ location: searchInput });
      setUserLocation({ 
        city: searchInput, 
        region: '' 
      });
      queryClient.setQueryData(['selectedLocation'], searchInput);
      queryClient.invalidateQueries({ queryKey: ['weather'] });
      setSearchInput('');
    } catch (error) {
      setSearchError('Location not found. Please try again.');
      console.error('Search location error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Stack>
      <div className="flex flex-row items-center justify-center bg-gray-800">
        <Group gap="md" justify="space-around" p="xs" className="text-white">
          <Title order={3} fw={600}>Weather</Title>
          {userLocation && (
            <Text>{userLocation?.city}{userLocation?.region ? `, ${userLocation?.region}` : ''}</Text>
          )}
          <form onSubmit={handleSearchSubmit} className="flex relative p-2">
            <Input 
              placeholder="Search City" 
              value={searchInput}
              onChange={handleSearchChange}
              disabled={isSearching}
              error={searchError}
              rightSection={
                <button type="submit" className="bg-transparent border-none cursor-pointer">
                  <VscSearch size={15} className="text-gray-400" />
                </button>
              }
            />
          </form>
        </Group>
      </div>
      {searchError && (
        <Text c="red" size="sm" className="text-center mt-1">
          {searchError}
        </Text>
      )}
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
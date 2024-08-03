'use client';

import React, { useState, useDeferredValue, useEffect, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { useLocation } from '../contexts/LocationContext';
import { Box, Select, Spinner, Text, Input, Stack, useToast } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { fetcher } from '../api/utils';
import { ICity } from '../types';
import { useSearch } from '../contexts/SearchContext';

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { location, city: initialCity, country } = useLocation();
  const { currentCity, setCurrentCity, query, setQuery } = useSearch();
  const [selectedCity, setSelectedCity] = useState<number | null>(currentCity?.id ?? null);
  const [cityOptions, setCityOptions] = useState<ICity[]>([]);
  const deferredQuery = useDeferredValue(searchQuery);
  const deferredCity = useDeferredValue(selectedCity);
  const toast = useToast();

  // Construct API URL based on country
  const getApiUrl = useCallback(() => {
    const url = new URL('/api/cities', window.location.origin);
    if (country) {
      url.searchParams.append('country', country);
    }
    return url.toString();
  }, [country]);

  // Fetch city data using SWR
  const { data, error, isValidating } = useSWR(getApiUrl, fetcher, { revalidateOnFocus: false });

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Unable to fetch cities. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  // Update city options when data changes
  useEffect(() => {
    if (data?.data?.cities) {
      setCityOptions(data.data.cities);
    }
  }, [data]);

  // Debounced search query update
  const debouncedSetQuery = useMemo(
    () =>
      debounce((query: string) => {
        setQuery(query);
        onSearch(query);
      }, 300),
    [onSearch, setQuery],
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      debouncedSetQuery(query);
    },
    [debouncedSetQuery],
  );

  // Handle city selection change
  const handleCitySelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = Number(e.target.value);
    setSelectedCity(cityId);
  }, []);

  // Update current city when selected city changes
  useEffect(() => {
    if (deferredCity !== null) {
      const cityOption = cityOptions.find((city) => city.id === deferredCity);
      if (cityOption) {
        setCurrentCity(cityOption);
      }
    }
  }, [deferredCity, cityOptions, setCurrentCity]);

  return (
    <Box p={4} bg="gray.800" color="white" borderRadius="md" shadow="md">
      <Stack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          Search Listings
        </Text>
        <Stack spacing={2}>
          <Text fontSize="lg">
            Current Location:
            {isValidating ? (
              <Spinner size="lg" color="teal.500" />
            ) : (
              <>
                {initialCity || 'Unknown City'}, {country || 'Unknown Country'}
              </>
            )}
          </Text>
          <Input
            value={searchQuery}
            placeholder="Search for listings..."
            bg="white"
            color="black"
            onChange={handleSearchChange}
          />
          <Select
            placeholder="Select city"
            value={deferredCity ?? ''}
            onChange={handleCitySelectChange}
            bg="white"
            color="black"
            borderColor="teal.500"
            focusBorderColor="teal.300"
            variant="outline"
            size="lg"
            borderRadius="md"
          >
            {cityOptions.length > 0 ? (
              cityOptions.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))
            ) : (
              <option disabled>No cities found</option>
            )}
          </Select>
        </Stack>
      </Stack>
    </Box>
  );
};

export default React.memo(Search);

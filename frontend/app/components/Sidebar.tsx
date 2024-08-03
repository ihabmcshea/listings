'use client';

import React, { useDeferredValue, useCallback, useMemo, useState, useEffect } from 'react';
import { Box, VStack, Heading, Checkbox, Input, Select, Button, Stack } from '@chakra-ui/react';
import { useSearch } from '../contexts/SearchContext';
import debounce from 'lodash.debounce';

const Sidebar: React.FC = React.memo(() => {
  const [localPriceRange, setLocalPriceRange] = useState({ min: '', max: '' });
  const [localRadius, setLocalRadius] = useState('');

  const {
    ownershipTypes,
    setOwnershipTypes,
    listingTypes,
    setListingTypes,
    setPriceRange,
    setRadius,
    setSelectedCity,
    setCurrentCity,
    cityOptions,
  } = useSearch();

  const deferredPriceRange = useDeferredValue(localPriceRange);
  const deferredRadius = useDeferredValue(localRadius);

  // Debounced handlers
  const debouncedSetPriceRange = useMemo(() => debounce(setPriceRange, 300), [setPriceRange]);
  const debouncedSetRadius = useMemo(() => debounce(setRadius, 300), [setRadius]);

  // Handle input changes
  const handlePriceRangeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value;
    setLocalPriceRange((prev) => ({ ...prev, [type]: value }));
  }, []);

  const handleRadiusChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalRadius(value);
  }, []);

  // Update global state on deferred values
  useEffect(() => {
    debouncedSetPriceRange({
      min: deferredPriceRange.min ? Number(deferredPriceRange.min) : null,
      max: deferredPriceRange.max ? Number(deferredPriceRange.max) : null,
    });
    debouncedSetRadius(deferredRadius ? Number(deferredRadius) : null);
  }, [deferredPriceRange, deferredRadius, debouncedSetPriceRange, debouncedSetRadius]);

  const clearFilters = useCallback(() => {
    setOwnershipTypes([]);
    setListingTypes([]);
    setPriceRange({ min: null, max: null });
    setRadius(null);
    setSelectedCity(null);
    setCurrentCity(null);
  }, [setOwnershipTypes, setListingTypes, setPriceRange, setRadius, setSelectedCity, setCurrentCity]);

  return (
    <Box
      p={4}
      bg="gray.700"
      color="white"
      borderRadius="md"
      shadow="lg"
      maxWidth="300px"
      w="full"
      h="full"
      position="sticky"
      top={0}
      left={0}
      overflowY="auto"
    >
      <VStack spacing={6} align="stretch">
        <Stack spacing={4}>
          <Heading size="md" color="teal.300">
            Filters
          </Heading>
          <Button onClick={clearFilters} colorScheme="red" variant="outline">
            Clear Filters
          </Button>
        </Stack>
        <Box>
          <Heading size="sm" mb={2}>
            Ownership Type
          </Heading>
          {['Rent', 'Resale'].map((type) => (
            <Checkbox
              key={type}
              isChecked={ownershipTypes.includes(type)}
              onChange={() =>
                setOwnershipTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
              }
              colorScheme="teal"
            >
              {type}
            </Checkbox>
          ))}
        </Box>
        <Box>
          <Heading size="sm" mb={2}>
            Listing Type
          </Heading>
          {['Apartment', 'Duplex', 'Penthouse', 'Villa', 'Studio'].map((type) => (
            <Checkbox
              key={type}
              isChecked={listingTypes.includes(type)}
              onChange={() =>
                setListingTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
              }
              colorScheme="teal"
            >
              {type}
            </Checkbox>
          ))}
        </Box>
        <Box>
          <Heading size="sm" mb={2}>
            Price Range
          </Heading>
          <Stack spacing={2}>
            <Input
              placeholder="Min Price"
              type="number"
              value={localPriceRange.min}
              onChange={(e) => handlePriceRangeChange(e, 'min')}
              bg="white"
              color="black"
            />
            <Input
              placeholder="Max Price"
              type="number"
              value={localPriceRange.max}
              onChange={(e) => handlePriceRangeChange(e, 'max')}
              bg="white"
              color="black"
            />
          </Stack>
        </Box>
        <Box>
          <Heading size="sm" mb={2}>
            Range Around Me
          </Heading>
          <Input
            placeholder="Radius in km"
            type="number"
            value={localRadius}
            onChange={handleRadiusChange}
            bg="white"
            color="black"
          />
        </Box>
      </VStack>
    </Box>
  );
});

export default Sidebar;

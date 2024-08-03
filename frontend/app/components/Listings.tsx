'use client';

import React, { useEffect, useState, useCallback } from 'react';
import useSWR from 'swr';
import { useLocation } from '../contexts/LocationContext';
import {
  Box,
  Spinner,
  Grid,
  GridItem,
  Button,
  Text,
  Stack,
  useToast,
  Alert,
  AlertIcon,
  CloseButton,
  VStack,
} from '@chakra-ui/react';
import Listing from './Listing';
import { IListing } from '../types';
import { fetcher } from '../api/utils';
import { useSearch } from '../contexts/SearchContext';

const Listings: React.FC = () => {
  const { location, city } = useLocation();
  const { currentCity, setCurrentCity, query, ownershipTypes, listingTypes, priceRange, radius, selectedCity } =
    useSearch();
  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAll, setShowAll] = useState(false);
  const toast = useToast();

  // Generate API URL based on filters and context
  const getApiUrl = useCallback(() => {
    let url = '/api/listings?';
    if (showAll) {
      url += `all=true&`;
    } else if (currentCity) {
      url += `city=${currentCity.id}&`;
    } else if (location) {
      url += `lat=${location.coords.latitude}&long=${location.coords.longitude}&`;
    } else if (city) {
      url += `city=${city}&`;
    }
    if (query) {
      url += `query=${query}&`;
    }
    if (ownershipTypes.length > 0) {
      url += `ownershipTypes=${ownershipTypes.join(',')}&`;
    }
    if (listingTypes.length > 0) {
      url += `listingTypes=${listingTypes.join(',')}&`;
    }
    if (priceRange.min !== null) {
      url += `minPrice=${priceRange.min}&`;
    }
    if (priceRange.max !== null) {
      url += `maxPrice=${priceRange.max}&`;
    }
    if (radius !== null) {
      url += `radius=${radius}&`;
    }
    if (selectedCity) {
      url += `selectedCity=${selectedCity}&`;
    }
    return url;
  }, [currentCity, location, city, showAll, query, ownershipTypes, listingTypes, priceRange, radius, selectedCity]);

  const { data, error, isValidating } = useSWR(getApiUrl, fetcher, { revalidateOnFocus: false });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Unable to fetch listings. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (data?.data?.listings) {
      setListings(data.data.listings);
    }
    setLoading(isValidating);
  }, [data, isValidating]);

  const resetCurrentCity = () => {
    setCurrentCity(null);
  };

  return (
    <Box p={4}>
      {showAll ? (
        <Alert status="warning" mb={4} borderRadius="md" variant="left-accent">
          <AlertIcon />
          Showing all listings.
          <CloseButton
            position="absolute"
            right="8px"
            top="50%"
            transform="translateY(-50%)"
            onClick={() => setShowAll(false)}
          />
        </Alert>
      ) : (
        currentCity && (
          <Alert status="warning" mb={4} borderRadius="md" variant="left-accent">
            <AlertIcon />
            Showing listings only for {currentCity.name}
            <CloseButton
              position="absolute"
              right="8px"
              top="50%"
              transform="translateY(-50%)"
              onClick={resetCurrentCity}
            />
          </Alert>
        )
      )}
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <>
          {listings.length === 0 ? (
            <Stack spacing={4} align="center">
              <Text>No results found nearby.</Text>
              <Button onClick={() => setShowAll(true)}>Widen the search</Button>
            </Stack>
          ) : (
            <VStack spacing={6} align="stretch">
              {listings.map((listing: IListing) => (
                <Listing key={listing.id} listing={listing} />
              ))}
            </VStack>
          )}
        </>
      )}
    </Box>
  );
};

export default React.memo(Listings);

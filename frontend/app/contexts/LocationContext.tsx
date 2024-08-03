'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Define the shape of the location context value
interface LocationContextType {
  location: GeolocationPosition | null;
  city: string | null;
  country: string | null;
  setLocation: (location: GeolocationPosition | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);

  // Fetch city and country based on location
  useEffect(() => {
    if (location) {
      const fetchLocationData = async () => {
        try {
          const response = await axios.get(`/api/location`, {
            params: {
              lat: location.coords.latitude,
              lon: location.coords.longitude,
            },
          });
          setCity(response.data.city);
          setCountry(response.data.country);
        } catch (error) {
          console.error('Error fetching location data:', error);
        }
      };

      fetchLocationData();
    }
  }, [location]);

  // Fetch initial location
  useEffect(() => {
    const fetchLocalLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => setLocation(position),
          (error) => console.error('Error fetching location:', error),
          { enableHighAccuracy: true, timeout: 10000 },
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    fetchLocalLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, city, country, setLocation }}>{children}</LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

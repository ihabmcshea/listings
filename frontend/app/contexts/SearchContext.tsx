'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ICity } from '../types';

interface SearchContextProps {
  query: string | null;
  setQuery: (query: string) => void;
  currentCity: ICity | null;
  setCurrentCity: (city: ICity | null) => void;
  ownershipTypes: string[];
  setOwnershipTypes: (types: string[]) => void;
  listingTypes: string[];
  setListingTypes: (types: string[]) => void;
  priceRange: { min: number | null; max: number | null };
  setPriceRange: (range: { min: number | null; max: number | null }) => void;
  radius: number | null;
  setRadius: (radius: number | null) => void;
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<ICity | null>(null);
  const [ownershipTypes, setOwnershipTypes] = useState<string[]>([]);
  const [listingTypes, setListingTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [radius, setRadius] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        currentCity,
        setCurrentCity,
        ownershipTypes,
        setOwnershipTypes,
        listingTypes,
        setListingTypes,
        priceRange,
        setPriceRange,
        radius,
        setRadius,
        selectedCity,
        setSelectedCity,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

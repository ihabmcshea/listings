'use client';
import React from 'react';
import useSWR from 'swr';

import { Box, Flex, Text, Image, Avatar, Button, Spinner } from '@chakra-ui/react';
import { IListing } from '../../types/Listing';
import { FaDollarSign, FaBed, FaBath, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ListingPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;
  const { data, error } = useSWR(`/api/listing/${id}`, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <Spinner />;

  const listing: IListing = data.data.listing;

  return (
    <>
      <Box>
        <Flex>
          <Box flex={{ base: 'none', lg: '1' }}>
            <Box padding={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
              <Text fontSize="2xl" fontWeight="bold">
                <FaDollarSign /> ${listing.price}
              </Text>
              <Text fontSize="lg" fontWeight="medium">
                <FaBed /> Type: {listing.listingType}
              </Text>
              <Text fontSize="lg">
                <FaMapMarkerAlt /> Ownership: {listing.ownership}
              </Text>
              <Text fontSize="lg">
                <FaBed /> Rooms: {listing.rooms}
              </Text>
              <Text fontSize="lg">
                <FaBath /> Bathrooms: {listing.bathrooms}
              </Text>
              <Text fontSize="lg">Furnished: {listing.furnished ? 'Yes' : 'No'}</Text>
              <Text fontSize="lg">Location: {listing.location}</Text>
              {/* Map Component */}
              <Box marginTop={4} borderRadius="md" overflow="hidden" height="300px">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
                    `${listing.coordinates.coordinates[0]},${listing.coordinates.coordinates[1]}`,
                  )}&key=YOUR_GOOGLE_MAPS_API_KEY`}
                  allowFullScreen
                ></iframe>
              </Box>
              <Flex align="center" marginTop={4}>
                <Avatar src={listing.user.profilePictureURL} size="md" marginRight={2} />
                <Box>
                  <Text fontWeight="bold">
                    <FaUser /> {listing.user.name}
                  </Text>
                  <Text fontSize="sm">{listing.user.description}</Text>
                </Box>
              </Flex>
            </Box>
          </Box>

          <Box flex={{ base: 'none', lg: '2' }}>
            {/* Slideshow */}
            <Box marginBottom={4}>{/* Replace with actual slideshow component */}</Box>
            <Text fontSize="2xl" fontWeight="bold" marginBottom={2}>
              {listing.title}
            </Text>
            <Text marginBottom={4}>{listing.description}</Text>
            <Button onClick={() => (window.location.href = `tel:${listing.user.phoneNumber}`)} colorScheme="teal">
              Call {listing.user.phoneNumber}
            </Button>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ListingPage;

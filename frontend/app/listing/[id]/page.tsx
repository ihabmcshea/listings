'use client';
import React from 'react';
import useSWR from 'swr';
import { Box, Flex, Text, Image, Avatar, Button, Spinner, Divider, Stack } from '@chakra-ui/react';
import { IListing } from '../../types/Listing';
import { FaDollarSign, FaBed, FaBath, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

// Fetcher function for useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ListingPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;
  const { data, error, isValidating } = useSWR(`/api/listing/${id}`, fetcher);

  if (error) return <div>Failed to load</div>;
  if (isValidating) return <Spinner size="lg" />;
  const listing: IListing = data.data.listing;

  const imageUrl = `/api/proxy-image?imageUrl=${encodeURIComponent(
    `http://listings_api:4000/${listing.photos[0].url}`,
  )}`;
  return (
    <Box padding={4} maxW="1200px" mx="auto">
      <Flex direction={{ base: 'column', lg: 'row' }} gap={4}>
        {/* Left Side */}
        <Box flex={{ base: 'none', lg: '1' }} borderWidth="1px" borderRadius="lg" boxShadow="md" p={4}>
          <Stack spacing={4}>
            <Box>
              <Text fontSize="2xl" fontWeight="bold" display="flex" alignItems="center">
                <FaDollarSign color="teal" mr={2} /> ${listing.price}
              </Text>
            </Box>
            <Divider />
            <Box>
              <Text fontSize="lg" fontWeight="medium" display="flex" alignItems="center">
                <FaBed color="teal" mr={2} /> Type: {listing.listingType}
              </Text>
              <Text fontSize="lg" display="flex" alignItems="center">
                <FaMapMarkerAlt color="teal" mr={2} /> Ownership: {listing.ownership}
              </Text>
              <Text fontSize="lg" display="flex" alignItems="center">
                <FaBed color="teal" mr={2} /> Rooms: {listing.rooms}
              </Text>
              <Text fontSize="lg" display="flex" alignItems="center">
                <FaBath color="teal" mr={2} /> Bathrooms: {listing.bathrooms}
              </Text>
              <Text fontSize="lg" display="flex" alignItems="center">
                Furnished: {listing.furnished ? 'Yes' : 'No'}
              </Text>
              <Text fontSize="lg" display="flex" alignItems="center">
                Location: {listing.location}
              </Text>
            </Box>
            <Divider />
            {/* Map Component */}
            <Box marginTop={4} borderRadius="md" overflow="hidden" height="300px">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
                  `${listing.coordinates.coordinates[0]},${listing.coordinates.coordinates[1]}`,
                )}&key=AIzaSyBZCscE_y9jBYpXeeiiUlo_-_GAT9hoU1E`}
                allowFullScreen
              ></iframe>
            </Box>
            <Divider />
            <Flex align="center" marginTop={4}>
              <Avatar src={listing.user.profilePictureURL} size="md" marginRight={2} />
              <Box>
                <Text fontWeight="bold">
                  <FaUser color="teal" mr={2} /> {listing.user.name}
                </Text>
                <Text fontSize="sm">{listing.user.description}</Text>
              </Box>
            </Flex>
          </Stack>
        </Box>

        {/* Right Side */}
        <Box flex={{ base: 'none', lg: '2' }} borderWidth="1px" borderRadius="lg" boxShadow="md" p={4}>
          {/* Slideshow */}
          <Box marginBottom={4} borderRadius="md" overflow="hidden" height="300px">
            <Image
              src={imageUrl}
              alt={listing.title}
              width="100%"
              height="100%"
              objectFit="cover"
              borderRadius="md"
              cursor="pointer"
            />{' '}
          </Box>
          <Text fontSize="2xl" fontWeight="bold" marginBottom={2}>
            {listing.title}
          </Text>
          <Text marginBottom={4}>{listing.description}</Text>
          <Button
            onClick={() => (window.location.href = `tel:${listing.user.phoneNumber}`)}
            colorScheme="teal"
            variant="solid"
            width="full"
          >
            Call {listing.user.phoneNumber}
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default ListingPage;

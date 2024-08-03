'use client';

import React from 'react';
import { Box, Flex, Image, Text, Avatar, useColorModeValue } from '@chakra-ui/react';
import { IListing } from '../types/Listing';

interface ListingItemProps {
  listing: IListing;
}

const ListingItem: React.FC<ListingItemProps> = ({ listing }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const imageUrl = `/api/proxy-image?imageUrl=${encodeURIComponent(
    `http://listings_api:4000/${listing.photos[0].url}`,
  )}`;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg={cardBg}
      borderColor={cardBorder}
      shadow="md"
      width="100%"
    >
      {listing.photos?.length > 0 && (
        <Image
          src={imageUrl}
          alt={listing.title}
          objectFit="cover"
          height="200px"
          width="100%"
          mb={4}
          borderRadius="md"
        />
      )}
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        {listing.title}
      </Text>
      <Text mb={4}>{listing.description}</Text>
      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        <Box>
          <Text fontSize="sm">{listing.city.name}</Text>
          {listing.distance && (
            <Text fontSize="sm">
              {listing.location} - {listing.distance} KM
            </Text>
          )}
        </Box>
        <Flex alignItems="center">
          <Avatar size="sm" src={listing.user.profile_picture_url} mr={2} />
          <Text fontSize="sm">{listing.user.name}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ListingItem;

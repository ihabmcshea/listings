'use client';

import React, { useState } from 'react';
import { Box, Flex, Image, Text, Avatar, Button, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { IListing } from '../types/Listing';

interface ListingItemProps {
  listing: IListing;
}

const ListingItem: React.FC<ListingItemProps> = ({ listing }) => {
  const router = useRouter();
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const imageUrl = `/api/proxy-image?imageUrl=${encodeURIComponent(
    `http://listings_api:4000/${listing.photos[0].url}`,
  )}`;

  const handleTitleClick = () => {
    router.push(`/listing/${listing.id}`);
  };

  const handleImageClick = () => {
    router.push(`/listing/${listing.id}`);
  };

  const handleCallButtonClick = () => {
    if (showPhoneNumber) {
      window.location.href = `tel:${listing.user.phone_number}`;
    } else {
      setShowPhoneNumber(true);
    }
  };

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
          cursor="pointer"
          onClick={handleImageClick}
        />
      )}
      <Text fontSize="xl" fontWeight="bold" mb={2} cursor="pointer" onClick={handleTitleClick}>
        {listing.title}
      </Text>
      <Text mb={4}>{listing.description}</Text>
      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        <Box>
          <Text fontSize="sm">{listing.city.name}</Text>
          <Text fontSize="sm">
            {listing.price} EGP {listing.ownership === 'Rent' && <>per month</>}
          </Text>

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
      <Button mt={4} colorScheme="blue" onClick={handleCallButtonClick}>
        {showPhoneNumber ? `Call ${listing.user.phoneNumber}` : 'Show Phone Number'}
      </Button>
    </Box>
  );
};

export default ListingItem;

'use client';

import React from 'react';
import {
  Box,
  Flex,
  Button,
  Heading,
  Spinner,
  useColorMode,
  useDisclosure,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import UserMenu from './UserMenu';
import DraftListingsButton from './DraftListingButton';
import { HamburgerIcon } from '@chakra-ui/icons';

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isLoading } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      as="header"
      bg={colorMode === 'light' ? 'gray.800' : 'gray.900'}
      color={colorMode === 'light' ? 'white' : 'gray.200'}
      p={4}
      width="100%"
    >
      <Flex align="center" justify="space-between" maxW="1200px" mx="auto" wrap="wrap">
        <Heading as="h1" size="lg">
          <Link href="/">My Real Estate App</Link>
        </Heading>

        {isMobile ? (
          <>
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              onClick={onOpen}
              variant="outline"
              colorScheme="teal"
            />
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Menu</DrawerHeader>
                <DrawerBody>
                  {isLoading ? (
                    <Spinner />
                  ) : user ? (
                    <Stack spacing={4}>
                      <DraftListingsButton />
                      <Button
                        colorScheme="teal"
                        onClick={() => {
                          /* Navigate to create listing page */
                        }}
                      >
                        Create Listing
                      </Button>
                      <UserMenu />
                    </Stack>
                  ) : (
                    <LoginModal />
                  )}
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <Flex align="center">
            {isLoading ? (
              <Spinner />
            ) : user ? (
              <>
                <DraftListingsButton />
                <Button
                  mr={4}
                  colorScheme="teal"
                  onClick={() => {
                    /* Navigate to create listing page */
                  }}
                >
                  Create Listing
                </Button>
                <UserMenu />
              </>
            ) : (
              <LoginModal />
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Header;

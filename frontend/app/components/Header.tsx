'use client';

import React from 'react';
import { Box, Flex, Button, Heading, Spinner, useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import UserMenu from './UserMenu';

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isLoading } = useAuth();

  return (
    <Box
      as="header"
      bg={colorMode === 'light' ? 'gray.800' : 'gray.900'}
      color={colorMode === 'light' ? 'white' : 'gray.200'}
    >
      <Flex align="center" justify="space-between" p={4} maxW="1200px" mx="auto">
        <Heading as="h1" size="lg">
          <Link href="/">My Real Estate App</Link>
        </Heading>

        <Flex align="center">
          <Button onClick={toggleColorMode} mr={4}>
            {colorMode === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
          {isLoading ? <Spinner /> : user ? <UserMenu /> : <LoginModal />}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;

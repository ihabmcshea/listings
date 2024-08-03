'use client';

import React, { useState, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Stack,
  useToast,
  Text,
  Link,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const LoginModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsLoading(true);
      setError(null);
      try {
        await login(email, password);
        onClose();
        toast({
          title: 'Logged in successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (err) {
        setError('Incorrect email or password');
        toast({
          title: 'Login failed',
          description: 'Please check your login details and try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, login, onClose, toast],
  );

  return (
    <>
      <Button onClick={onOpen}>Login</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  isInvalid={!!error}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  isInvalid={!!error}
                />
                {error && <Text color="red.500">{error}</Text>}
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
              Login
            </Button>
            <Button variant="ghost" onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
          <Text textAlign="center" my={4}>
            Don't have an account?{' '}
            <Link href="/register" color="teal.500">
              Register
            </Link>
          </Text>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginModal;

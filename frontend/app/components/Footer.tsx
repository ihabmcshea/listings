// app/components/Footer.tsx
import { Box, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <footer>
      <Box p={4} textAlign="center" borderTop="1px" borderColor="gray.200">
        <Text>© 2024 My App. All rights reserved.</Text>
      </Box>
    </footer>
  );
};

export default Footer;

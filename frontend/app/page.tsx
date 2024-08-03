import Sidebar from './components/Sidebar';
import Search from './components/Search';
import Listings from './components/Listings';
import { Box, Flex } from '@chakra-ui/react';

const HomePage = async () => {
  return (
    <Flex direction={{ base: 'column', md: 'row' }} p={4}>
      <Box flexShrink={0} width={{ base: 'full', md: '250px' }} mb={{ base: 4, md: 0 }}>
        <Sidebar />
      </Box>
      <Box flex="1">
        <Search />
        <Listings />
      </Box>
    </Flex>
  );
};

export default HomePage;

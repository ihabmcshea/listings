// // pages/index.tsx
// import { useState } from 'react';
// import Sidebar from './components/Sidebar';
// import Search from './components/Search';
// import Listing from './components/Listing';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import { Container, SimpleGrid } from '@chakra-ui/react';

// const HomePage = () => {
//   const [filters, setFilters] = useState<any>({});
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

//   const handleFilterChange = (filters: any) => {
//     setFilters(filters);
//     // Perform data fetching or other logic here based on the filters
//   };

//   const handleSearch = (query: string) => {
//     // Perform search based on the query
//     console.log('Searching for:', query);
//   };

//   const handleLogin = () => {
//     // Simulate login
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     // Simulate logout
//     setIsLoggedIn(false);
//   };

//   return (
//     <Container maxW="container.xl" p={4}>
//       <Header isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
//       <Search onSearch={handleSearch} />
//       <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
//         <Sidebar onFilterChange={handleFilterChange} />
//         <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
//           {/* Example listings */}
//           <Listing title="Listing 1" description="Description 1" photos={[]} />
//           <Listing title="Listing 2" description="Description 2" photos={[]} />
//         </SimpleGrid>
//       </SimpleGrid>
//       <Footer />
//     </Container>
//   );
// };

// export default HomePage;

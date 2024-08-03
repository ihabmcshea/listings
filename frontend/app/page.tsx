import Sidebar from './components/Sidebar';
import Search from './components/Search';
import Listings from './components/Listings';

// Mock data
const mockListings = [
  {
    id: 1,
    title: 'Listing 1',
    description: 'Description 1',
    photos: [{ url: '/path/to/photo.jpg' }],
    user: { name: 'User 1' },
    city: { name: 'City 1' },
  },
  // Add more listings here
];

const HomePage = async () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Search />
        {/* <Search initialCity={city} initialCountry={country} /> */}
        <Listings listings={mockListings} />
      </div>
    </div>
  );
};

export default HomePage;

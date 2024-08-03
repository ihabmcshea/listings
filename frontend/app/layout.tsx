import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import { LocationProvider } from './contexts/LocationContext';
import { SearchProvider } from './contexts/SearchContext';
import { AuthProvider } from './contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const onSearch = () => {};
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <AuthProvider>
            <LocationProvider>
              <SearchProvider>
                <Header />
                <main>{children}</main>
                <Footer />
              </SearchProvider>
            </LocationProvider>
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}

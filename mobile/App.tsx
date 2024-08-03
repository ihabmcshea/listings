import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { QueryClient, QueryClientProvider } from 'react-query'
import ListingsScreen from './screens/ListingsScreen'
import ListingDetailsScreen from './screens/ListingDetailScreen'

const Stack = createStackNavigator()
const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Listings">
          <Stack.Screen name="Listings" component={ListingsScreen} />
          <Stack.Screen
            name="ListingDetails"
            component={ListingDetailsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}

export default App

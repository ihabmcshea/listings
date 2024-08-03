import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme, StyleSheet, ActivityIndicator } from "react-native";
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { View, Text } from 'react-native';
import { useLocationPermission } from "@/hooks/useLocationPermission";
import CustomHeader from "@/components/Header";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
      const permissionStatus = useLocationPermission();

    const [fontsLoaded, fontsError] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (fontsError) throw fontsError;
    }, [fontsError]);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading fonts...</Text>
            </View>
        );
    }
    if (permissionStatus === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (permissionStatus !== 'granted') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Location permission is required to use this app.
        </Text>
      </View>
    );
  }


    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    return (
    <PaperProvider theme={DefaultTheme}>
            <Stack 
            screenOptions={{
                header: () => <CustomHeader />,
            }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="layout" />
            </Stack>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
});

// src/components/CustomHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const CustomHeader = () => {
  const router = useRouter();
    const canGoBack = router.canGoBack;

  const handleLoginPress = () => {
    router.push('/login'); // Adjust the route based on your app structure
  };

  return (
    <Appbar.Header style={styles.header}>
            {canGoBack &&     <TouchableOpacity
      style={styles.backButton}
      onPress={() => router.back()}
    >
      <FontAwesome name="arrow-left" size={24} color="#fff" />
    </TouchableOpacity>
}

      <Appbar.Content title="My App" titleStyle={styles.title} />
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007BFF', // Change to your desired background color
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
  },
  loginButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  backButton: {
    padding: 10,
    marginLeft: 10,
  },
  loginButtonText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
;


export default CustomHeader;

import React from 'react';
import { ScrollView, StyleSheet, Image, Dimensions, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import useSWR from 'swr';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import ErrorComponent from '../components/ErrorComponent'; // Adjust the path as necessary

// Fetcher function for useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ListingsPage = () => {
  const local = useLocalSearchParams();

  const { data, error, mutate } = useSWR(local.id ? `http://192.168.1.175:4000/v1/listings/listing/${local.id}` : null, fetcher);

  if (!local.id) {
    return <ErrorComponent message="Invalid listing ID" onReset={() => mutate()} />;
  }

  if (error) {
    return <ErrorComponent message="Failed to load" onReset={() => mutate()} />;
  }

  if (!data) {
    return <ActivityIndicator animating size="large" style={styles.loading} />;
  }

  const listing = data.data.listing;

  return (
    <ScrollView style={styles.container}>
      {/* Photo Slider */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoSlider}>
        {listing.photos.map((photo: any, index: number) => (
          <Image key={index} source={{ uri: `http://listings_api:4000/${photo.url}` }} style={styles.image} />
        ))}
      </ScrollView>

      {/* Listing Details */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{listing.title}</Text>
          <ListingInfo icon="money" text={`$${listing.price}`} />
          <ListingInfo icon="home" text={`Type: ${listing.listingType}`} />
          <ListingInfo icon="key" text={`Ownership: ${listing.ownership}`} />
          <ListingInfo icon="bed" text={`Rooms: ${listing.rooms}`} />
          <ListingInfo icon="bath" text={`Bathrooms: ${listing.bathrooms}`} />
          <ListingInfo icon="sofa" text={`Furnished: ${listing.furnished ? 'Yes' : 'No'}`} />
          <ListingInfo icon="map-marker" text={`Location: ${listing.location}`} />
          <Text style={styles.description}>{listing.description}</Text>

          {/* Map View */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: listing.coordinates.coordinates[1],
                longitude: listing.coordinates.coordinates[0],
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: listing.coordinates.coordinates[1],
                  longitude: listing.coordinates.coordinates[0],
                }}
                title={listing.title}
              />
            </MapView>
          </View>

          {/* User Information */}
          <View style={styles.userContainer}>
            <Avatar.Image
              size={50}
              source={{ uri: `http://listings_api:4000/${listing.user.avatar}` }}
              style={styles.userAvatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.posterName}>{listing.user.name}</Text>
              <Text style={styles.posterDescription}>{listing.user.description}</Text>
              <Text style={styles.cityName}>{listing.city.name}</Text>
            </View>
          </View>

          {/* Contact Button */}
          <TouchableOpacity style={styles.button} onPress={() => { /* handle phone call */ }}>
            <Text style={styles.buttonText}>Call {listing.user.phoneNumber}</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// Listing Info Component for better code reusability
const ListingInfo = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.infoRow}>
    <FontAwesome name={icon} size={20} color="#007BFF" />
    <Text style={styles.info}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  photoSlider: {
    marginBottom: 10,
  },
  image: {
    width: Dimensions.get('window').width - 20,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
  },
  card: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  description: {
    marginTop: 10,
    color: '#333',
  },
  mapContainer: {
    height: 300,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  userAvatar: {
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  posterName: {
    fontWeight: 'bold',
    color: '#333',
  },
  posterDescription: {
    color: '#666',
  },
  cityName: {
    marginTop: 5,
    color: '#333',
    fontStyle: 'italic',
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ListingsPage;

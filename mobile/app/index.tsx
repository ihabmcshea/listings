import React from 'react';
import { ScrollView, StyleSheet, Dimensions, View } from 'react-native';
import { Card, Text, Button, Avatar, ActivityIndicator } from 'react-native-paper';
import useSWR from 'swr';
import { useRouter } from 'expo-router';

// Fetcher function for useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ListingsPage = () => {
  const { data, error } = useSWR('http://192.168.1.175:4000/v1/listings/list', fetcher);
  const router = useRouter();

  if (error) return <Text style={styles.error}>Failed to load</Text>;
  if (!data) return <ActivityIndicator animating size="large" />;

  return (
    <ScrollView style={styles.container}>
      {data.data.listings.map((listing: any) => (
        <Card
          key={listing.id}
          style={styles.card}
          onPress={() => router.push(`/listing?id=${listing.id}`)}
        >
          <Card.Cover
            source={{ uri: `http://192.168.1.175:4000/${listing.photos[0].url}` }}
            style={styles.cover}
          />
          <Card.Content>
            <Text style={styles.title}>{listing.title}</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.info}>Price: ${listing.price}</Text>
              <Text style={styles.info}>Type: {listing.listingType}</Text>
              <Text style={styles.info}>Location: {listing.location}</Text>
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cover: {
    height: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  infoContainer: {
    marginTop: 5,
  },
  info: {
    fontSize: 16,
    color: '#666',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ListingsPage;

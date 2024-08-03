// elasticsearchUtils.ts
import client from 'clients/elasticsearchClient';
import { Listing } from 'orm/entities/listings/Listing';

// Function to index a listing
export const indexListing = async (listing: Listing) => {
  try {
    await client.index({
      index: 'listings',
      id: listing.id.toString(),
      body: {
        title: listing.title,
        description: listing.description,
        coordinates: listing.coordinates,
        city: listing.city?.name,
        photos: listing.photos.map((photo) => photo.url),
        // Add other relevant fields
      },
    });
    console.log(`Listing ${listing.id} indexed successfully.`);
  } catch (err) {
    console.error(`Error indexing listing ${listing.id}:`, err);
  }
};

// Function to delete a listing from index
export const deleteListing = async (listingId: number) => {
  try {
    await client.delete({
      index: 'listings',
      id: listingId.toString(),
    });
    console.log(`Listing ${listingId} deleted successfully.`);
  } catch (err) {
    console.error(`Error deleting listing ${listingId}:`, err);
  }
};

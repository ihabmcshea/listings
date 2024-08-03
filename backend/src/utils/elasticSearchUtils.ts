import { Listing } from 'orm/entities/listings/Listing';

import elasticSearchClient from '../clients/elasticSearchClient';

// Function to index a listing
export const indexListing = async (listing: Listing) => {
  try {
    await elasticSearchClient.index({
      index: 'listings',
      id: listing.id.toString(),
      body: {
        title: listing.title,
        description: listing.description,
        coordinates: listing.coordinates,
        city: listing.city?.name,
        photos: listing.photos.map((photo) => photo.url),
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
    await elasticSearchClient.delete({
      index: 'listings',
      id: listingId.toString(),
    });
    console.log(`Listing ${listingId} deleted successfully.`);
  } catch (err) {
    console.error(`Error deleting listing ${listingId}:`, err);
  }
};

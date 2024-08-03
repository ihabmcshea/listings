import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // Change to your API base URL
});

export const fetchListings = async () => {
  const response = await api.get('/listings');
  return response.data;
};

export const fetchListing = async (id: string) => {
  const response = await api.get(`/listings/listing/${id}`);
  return response.data;
};

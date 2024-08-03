import axios from 'axios';
import { NextResponse } from 'next/server';
axios.interceptors.request.use((request) => {
  console.log('Starting Request', JSON.stringify(request, null, 2));
  return request;
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const long = searchParams.get('long');
  const city = searchParams.get('city');

  try {
    const { data } = await axios.get(`http://listings_api:4000/v1/listings/list`, {
      params: {
        long,
        lat,
        city,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
}

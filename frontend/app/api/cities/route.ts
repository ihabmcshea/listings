import axios from 'axios';
import { NextResponse } from 'next/server';

export const GET = async (params: { lat?: number; lon?: number; city?: string }) => {
  try {
    const { data } = await axios.get(`http://listings_api:4000/v1/cities/list`, {
      params: {
        long: params.lon,
        lat: params.lat,
        city: params.city,
      },
    });
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

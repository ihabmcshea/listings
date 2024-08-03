import { NextResponse } from 'next/server';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBZCscE_y9jBYpXeeiiUlo_-_GAT9hoU1E'; // Store your API key in environment variables

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lon}`,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    const { results } = response.data;

    if (results.length > 0) {
      const addressComponents = results[0].address_components;
      const city = addressComponents.find((component: any) =>
        component.types.includes('administrative_area_level_2'),
      )?.long_name;
      const country = addressComponents.find((component: any) => component.types.includes('country'))?.long_name;

      return NextResponse.json({ city, country });
    } else {
      return NextResponse.json({ error: 'No results found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
    return NextResponse.json({ error: 'Error fetching location data' }, { status: 500 });
  }
}

// app/api/draft-count/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://listings_api:4000/v1/listings/my-draft-count', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch draft count');
    }

    const data = await response.json();
    return NextResponse.json({ count: data.count });
  } catch (error) {
    console.error('Error fetching draft count:', error);
    return NextResponse.json({ count: 0 });
  }
}

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get('imageUrl');

  if (!imageUrl || typeof imageUrl !== 'string') {
    return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    console.log(JSON.stringify(response));
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';

    const imageStream = response.body;
    return new NextResponse(imageStream, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching image' }, { status: 500 });
  }
}

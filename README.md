# Listing Fullstack Service

Everything in here including the React Native mobile app (developed with Expo) are containerized, and you can run everything in development mode through:

    npm run docker:dev

## APIs

    **:3000/v1/listings/list?page=$1**

Lists all listings paginated.

    **:3000/v1/listings/list?lat=$1&long=$2&radius=$3&page=$4**

Lists all listings near a coordinate paginated

    **:3000/v1/listings/list?city=$1&page=$2**

Lists all listings in a city paginated

    **:3000/v1/listings/listing/$1**

Returns a specific listing in a city paginated

    **:3000/v1/auth/register**

Registration

    **:3000/v1/auth/login**

Returns token and user info

## Protected paths (must include authorization header with token obtained from the login endpoint)

    **:3000/v1/listings/create**

    Params: {
    title: string,
    description: string,
    rooms: number,
    bathrooms: number,
    location: {lat:$1, long:$2},
    furnished: boolean,
    listing_type: enum('Apartment','Villa','Town house', 'Duplex')
    ownership: enum('Rent','Resale'),
    city_id: number -- references a city
    }

    **:3000/v1/listings/$1/add-photos**

{'photos': File[]} limit of 8 files -- adds photos to a listing

    **:3000/v1/listings/$1/publish**

Publishes a draft listing.

    **:3000/v1/listings/my-draft-count**

The total of listing drafts a user has

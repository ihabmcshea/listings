import { ICity } from './City';
import { ICoordinates } from './Coordinates';
import { IPhoto } from './Photo';
import { IUser } from './User';

export interface IListing {
  id: number;
  title: string;
  description: string;
  price: number;
  city: Partial<ICity>;
  user: Partial<IUser>;
  listingType: string;
  ownership: string;
  furnished: boolean;
  coordinates: ICoordinates;
  photos: IPhoto[];
  bathrooms: number;
  location: string;
  rooms: number;
  distance?: number;
}

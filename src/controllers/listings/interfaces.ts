import { Listing } from 'orm/entities/listings/Listing';
import { paginatedLists } from 'types/paginatedLists';

export interface PaginatedListings extends paginatedLists {
  listings: Listing[];
}

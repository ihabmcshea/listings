import { Listing } from "orm/entities/listings/Listing";
import { paginatedLists } from "types/paginatedLists";

export interface ListingWithDistance extends Listing {
  distance?: number;
}

export interface PaginatedListings extends paginatedLists {
  listings: ListingWithDistance[];
}

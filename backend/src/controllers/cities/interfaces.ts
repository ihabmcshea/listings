import { City } from "orm/entities/cities/City";
import { paginatedLists } from "types/paginatedLists";

export interface citiesList extends paginatedLists {
  cities: City[];
}

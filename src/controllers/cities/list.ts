import { Request, Response, NextFunction } from 'express';
import { Point } from 'geojson';
import { getRepository } from 'typeorm';

import { listingsPerPage } from 'consts/ConstsListing';
import { City } from 'orm/entities/cities/City';

import { citiesList } from './interfaces';

export const listCities = async (req: Request, res: Response, next: NextFunction) => {
  const { country, page = 1 } = req.body;
  let cities: citiesList;
  if (country) {
    const skip = listingsPerPage * (page - 1);
    const citiesRepository = getRepository(City);
    const [data, total] = await citiesRepository.findAndCount({
      where: { country },
      take: listingsPerPage,
      skip,
    });
    const pages = Math.floor(total / listingsPerPage);
    cities = {
      total,
      page,
      pages,
      limit: listingsPerPage,
      cities: data,
    };
  } else {
    const skip = listingsPerPage * (page - 1);
    const citiesRepository = getRepository(City);
    const [data, total] = await citiesRepository.findAndCount({
      take: listingsPerPage,
      skip,
    });
    const pages = Math.floor(total / listingsPerPage);
    cities = {
      total,
      page,
      pages,
      limit: listingsPerPage,
      cities: data,
    };
  }

  return res.status(200).send(cities);
};

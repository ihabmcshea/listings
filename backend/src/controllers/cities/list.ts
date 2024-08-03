import { Request, Response, NextFunction } from "express";
import { Point } from "geojson";
import { getRepository } from "typeorm";

import { listingsPerPage } from "consts/ConstsListing";
import { City } from "orm/entities/cities/City";
import { CustomError } from "utils/response/custom-error/CustomError";

import { citiesList } from "./interfaces";

export const listCities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { country, long, lat, page = 1 } = req.body;
  const skip = listingsPerPage * (page - 1);
  const citiesRepository = getRepository(City);

  // Initialize query builder
  const queryBuilder = citiesRepository
    .createQueryBuilder("city")
    .skip(skip)
    .take(listingsPerPage)
    .addSelect(["city.id", "city.name", "city.country", "city.coordinates"]);

  // If country is provided, filter by country
  if (country) {
    queryBuilder.andWhere("city.country = :country", { country });
  }

  // If coordinates are provided, sort cities by distance to these coordinates
  if (long && lat) {
    const origin: Point = { type: "Point", coordinates: [long, lat] };
    queryBuilder
      .addSelect(
        "ST_Distance(city.coordinates, ST_SetSRID(ST_GeomFromGeoJSON(:origin), 4326)) AS distance"
      )
      .orderBy("distance", "ASC")
      .setParameter("origin", JSON.stringify(origin));
  } else {
    queryBuilder.orderBy("city.name", "ASC"); // Default sort if no coordinates are provided
  }

  try {
    const [data, total] = await queryBuilder.getManyAndCount();
    const pages = Math.ceil(total / listingsPerPage);

    const cities: citiesList = {
      total,
      page,
      pages,
      limit: listingsPerPage,
      cities: data,
    };

    return res.status(200).send(cities);
  } catch (err) {
    const customError = new CustomError(
      400,
      "Raw",
      `Can't retrieve list of cities.`,
      null,
      err
    );
    return next(customError);
  }
};

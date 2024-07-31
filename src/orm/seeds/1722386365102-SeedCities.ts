import { Point } from 'geojson';
import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { City } from 'orm/entities/cities/City';

export class SeedCities1722386365102 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const city = new City();
    const cityRepository = getRepository(City);
    let coordinates: Point;

    city.name = 'Cairo';
    city.country = 'Egypt';
    coordinates = {
      type: 'Point',
      coordinates: [30.0444, 31.2357],
    };
    city.coordinates = coordinates;

    await cityRepository.save(city);

    city.name = 'Alexandria';
    city.country = 'Egypt';
    coordinates = {
      type: 'Point',
      coordinates: [31.2001, 29.9187],
    };
    city.coordinates = coordinates;

    await cityRepository.save(city);

    city.name = 'Dakahlia';
    city.country = 'Egypt';
    coordinates = {
      type: 'Point',
      coordinates: [31.1656, 31.4913],
    };
    city.coordinates = coordinates;

    await cityRepository.save(city);

    city.name = 'Al Qalyubia';
    city.country = 'Egypt';
    coordinates = {
      type: 'Point',
      coordinates: [30.222, 31.3084],
    };
    city.coordinates = coordinates;

    await cityRepository.save(city);

    city.name = 'Al Menofia';
    city.country = 'Egypt';
    coordinates = {
      type: 'Point',
      coordinates: [30.5972, 30.9876],
    };
    city.coordinates = coordinates;

    await cityRepository.save(city);

    city.name = 'Al Qalyubia';
    city.country = 'Egypt';
    coordinates = {
      type: 'Point',
      coordinates: [30.222, 31.3084],
    };
    city.coordinates = coordinates;

    await cityRepository.save(city);

    city.name = 'Al Sharqia';
    city.country = 'Egypt';
    coordinates = {
      type: 'Point',
      coordinates: [30.7327, 31.7195],
    };
    city.coordinates = coordinates;

    await cityRepository.save(city);

    city.name = 'Al Gharbia';
    city.country = 'Egypt';
    coordinates = {
      type: 'Point',
      coordinates: [30.8754, 31.0335],
    };
    city.coordinates = coordinates;

    await cityRepository.save(city);

    city.name = 'Aswan';
    city.country = 'Egypt';
    coordinates = {
      type: 'Point',
      coordinates: [23.6966, 32.7181],
    };
    city.coordinates = coordinates;

    await cityRepository.save(city);

    city.name = 'Luxor';
    city.country = 'Egypt';
    coordinates = {
      type: 'Point',
      coordinates: [25.442, 32.8084],
    };
    city.coordinates = coordinates;

    await cityRepository.save(city);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('Not implemented');
  }
}

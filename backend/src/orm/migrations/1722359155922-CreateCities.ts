import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCities1722359155922 implements MigrationInterface {
  name = "CreateCities1722359155922";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        coordinates GEOGRAPHY(Point, 4326) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
      CREATE INDEX idx_cities_coordinates ON cities USING GIST (coordinates);
    `,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cities"`, undefined);
  }
}

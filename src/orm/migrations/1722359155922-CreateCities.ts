import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCities1722359155922 implements MigrationInterface {
  name = 'CreateCities1722359155922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cities" (  
           id serial NOT NULL,
            name character varying(100) NOT NULL,
            country character varying(100) NOT NULL,
            coordinates point,
            created_at date,
            updated_at date,
            PRIMARY KEY (id),
            CONSTRAINT unique_country_city UNIQUE (name, country)
    )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cities"`, undefined);
  }
}

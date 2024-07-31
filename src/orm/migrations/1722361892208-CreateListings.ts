import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateListings1722361892208 implements MigrationInterface {
  name = 'CreateListings1722361892208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE "listings" (  
            id serial NOT NULL,
            city_id integer NOT NULL,
            title character varying(255) NOT NULL,
            description text,
            status character varying(100) NOT NULL,
            listing_type character varying(255) NOT NULL,
            ownership character varying(100) NOT NULL,
            coordinates geography,
            location text,
            furnished boolean,
            rooms integer,
            bathrooms integer,
            user_id integer,
            created_at date,
            updated_at date,
            PRIMARY KEY (id),
            CONSTRAINT user_id FOREIGN KEY (user_id)
                REFERENCES public.users (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE,
            CONSTRAINT city_id FOREIGN KEY (city_id)
                REFERENCES public.cities (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
    )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "listings"`, undefined);
  }
}

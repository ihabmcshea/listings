import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePhotos1722362824614 implements MigrationInterface {
  name = 'CreatePhotos1722362824614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "photos" (  
            id serial NOT NULL,
            url text,
            width integer,
            height integer,
            listing_id integer,
            PRIMARY KEY (id),
            FOREIGN KEY (listing_id)
                REFERENCES public.listings (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
    )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "photos"`, undefined);
  }
}

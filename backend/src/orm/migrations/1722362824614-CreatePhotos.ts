import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePhotos1722362824614 implements MigrationInterface {
  name = "CreatePhotos1722362824614";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    height INT NOT NULL,
    width INT NOT NULL,
    listing_id INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);
`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "photos"`, undefined);
  }
}

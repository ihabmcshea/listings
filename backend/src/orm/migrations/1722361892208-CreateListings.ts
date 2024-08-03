import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateListings1722361892208 implements MigrationInterface {
  name = 'CreateListings1722361892208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(30) DEFAULT 'Available' NOT NULL,
    coordinates GEOGRAPHY(Point, 4326) NOT NULL,
    location VARCHAR(255) NOT NULL,
    furnished BOOLEAN DEFAULT false NOT NULL,
    rooms INT,
    bathrooms INT,
    price INT,
    listing_type VARCHAR(30) NOT NULL,
    ownership VARCHAR(30) NOT NULL,
    city_id INT,
    user_id INT,
    draft BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_city FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_listings_title_status_location ON listings (title, status, location);
CREATE INDEX idx_listings_coordinates ON listings USING GIST (coordinates);
`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "listings"`, undefined);
  }
}

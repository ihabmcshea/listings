import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1722357124281 implements MigrationInterface {
  name = 'CreateUsers1722357124281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (  
        id serial,
        username character varying(40),
        name character varying(60),
        email character varying(100) NOT NULL,
        password character varying(255),
        description text,
        role character varying(30) DEFAULT 'STANDARD',
        profile_picture_url text,
        created_at date,
        updated_at date,
        PRIMARY KEY (id)
        )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`, undefined);
  }
}

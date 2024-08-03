import { MigrationInterface, QueryRunner, getRepository } from "typeorm";

import { Role } from "../entities/users/types";
import { User } from "../entities/users/User";

export class SeedUsers1722386341510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const user = new User();
    const userRepository = getRepository(User);

    user.username = "ihabshea";
    user.name = "Ihab McShea";
    user.description = "Real estate agent from Cairo.";
    user.email = "ihabshea@gmail.com";
    user.password = "testPassword!1";
    user.hashPassword();
    user.role = Role.ADMINISTRATOR;
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log("Not implemented");
  }
}

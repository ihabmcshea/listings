import bcrypt from 'bcryptjs';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { Listing } from '../listings/Listing';

import { Role } from './types';

/**
 * Represents a user in the system.
 */
@Entity('users')
export class User {
  /**
   * Unique identifier for the user.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The email of the user. This must be unique across all users.
   */
  @Column({ unique: true })
  email: string;

  /**
   * The hashed password of the user.
   */
  @Column()
  password: string;

  /**
   * The username of the user. This must be unique if provided.
   */
  @Column({ nullable: true, unique: true })
  username?: string;

  /**
   * The full name of the user.
   */
  @Column()
  name: string;

  /**
   * A short description or bio about the user.
   */
  @Column({ nullable: true })
  description?: string;

  /**
   * The phone number of the user. This must be unique across all users.
   */
  @Column({ unique: true })
  phoneNumber: string;

  /**
   * The role of the user in the system. Defaults to 'STANDARD'.
   */
  @Column({ type: 'enum', enum: Role, default: 'STANDARD' })
  role: Role;

  /**
   * URL to the user's profile picture. Defaults to a placeholder image.
   */
  @Column({ default: '/public/images/default.jpg' })
  profilePictureURL: string;

  /**
   * List of listings created by the user.
   */
  @OneToMany(() => Listing, (listing) => listing.user, { onDelete: 'CASCADE' })
  listings: Listing[];

  /**
   * Timestamp when the user was created.
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /**
   * Timestamp when the user was last updated.
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  /**
   * Hashes the user's password before saving to the database.
   */
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  /**
   * Checks if the provided password matches the hashed password.
   * @param unencryptedPassword The password to compare.
   * @returns True if the passwords match, false otherwise.
   */
  checkIfPasswordMatch(unencryptedPassword: string): boolean {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}

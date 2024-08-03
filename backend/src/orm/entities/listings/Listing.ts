import { Point } from "geojson";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from "typeorm";

import { City } from "orm/entities/cities/City";
import { Photo } from "orm/entities/photos/Photo";
import { User } from "orm/entities/users/User";

import { ListingType, Ownership, Status } from "./types";

@Entity("listings")
@Index(["title", "status", "location"]) // Index for faster searching on these fields
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.AVAILABLE,
  })
  status: Status;

  @Index({ spatial: true })
  @Column({
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
  })
  coordinates: Point;

  @Column({ type: "varchar", length: 255 })
  location: string;

  @Column({ type: "boolean", default: false })
  furnished: boolean;

  @Column({ type: "int", nullable: true })
  rooms: number;

  @Column({ type: "int", nullable: true })
  bathrooms: number;

  @Column({ type: "int", nullable: false })
  price: number;

  @Column({
    type: "enum",
    enum: ListingType,
  })
  listingType: ListingType;

  @Column({
    type: "enum",
    enum: Ownership,
  })
  ownership: Ownership;

  @ManyToOne(() => City, (city: City) => city.listings, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "city_id" })
  city!: City;

  @ManyToOne(() => User, (user: User) => user.listings, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => Photo, (photo: Photo) => photo.listing, {
    onDelete: "CASCADE",
  })
  photos!: Photo[];

  @Column({ type: "boolean", default: false })
  draft: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

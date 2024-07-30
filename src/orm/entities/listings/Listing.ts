import { Point } from 'geojson';
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
} from 'typeorm';

import { City } from '../cities/City';
import { Photo } from '../photos/Photo';
import { User } from '../users/User';

import { Status } from './types';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    default: 'Available' as Status,
    length: 30,
  })
  status: string;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coordinates: Point;

  @Column({
    type: 'varchar',
  })
  location: string;

  @Column()
  furnished: boolean;

  @Column({
    nullable: true,
  })
  rooms: number;

  @Column({
    nullable: true,
  })
  bathrooms: number;

  @ManyToOne((_type) => City, (city: City) => city.listings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'city_id' })
  city!: City;

  @ManyToOne((_type) => User, (user: User) => user.listings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany((_type) => Photo, (photo: Photo) => photo.apartment, {
    onDelete: 'CASCADE',
  })
  photos!: Photo[];

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}

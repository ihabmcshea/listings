import { Point } from 'geojson';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn, Index } from 'typeorm';
import { Listing } from '../listings/Listing';

@Entity('cities')
@Index('coordinates')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  country: string;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coordinates: Point;

  @OneToMany(() => Listing, (listing: Listing) => listing.city, {
    onDelete: 'CASCADE',
  })
  listings!: Listing[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

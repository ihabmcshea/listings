import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Listing } from '../listings/Listing';

@Entity('photo')
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    height: number;

    @Column()
    width: number;

    @ManyToOne((_type) => Listing, (listing: Listing) => listing.photos, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "photos" })
    apartment!: Listing;
}
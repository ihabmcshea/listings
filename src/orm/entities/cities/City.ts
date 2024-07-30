import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    JoinColumn,
    OneToMany,
    UpdateDateColumn,
} from 'typeorm';

import { Listing } from '../listings/Listing';

@Entity('city')
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    country: string;

    @OneToMany((_type) => Listing, (listing: Listing) => listing.city, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'cityId' })
    listings!: Listing[];

    @Column()
    @CreateDateColumn()
    created_at: Date;

    @Column()
    @UpdateDateColumn()
    updated_at: Date;
}

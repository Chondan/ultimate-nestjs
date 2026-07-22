import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('pet')
export class Pet {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'name' })
    name!: string;
}

import { IsDefined } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Store {
  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  id: string;

  @Column({ unique: true })
  @IsDefined()
  name: string;
}

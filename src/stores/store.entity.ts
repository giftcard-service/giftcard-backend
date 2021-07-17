import { IsDefined } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
@Unique(['name'])
export class Store {
  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  id: string;

  @Column({ unique: true })
  @IsDefined()
  name: string;

  @OneToMany(() => User, (user: User) => user.store)
  users: User[];
}

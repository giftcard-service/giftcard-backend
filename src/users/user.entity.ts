import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Store } from '../stores/store.entity';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive?: boolean;

  @Column({ default: false })
  isManager?: boolean;

  @ManyToOne(() => Store)
  @JoinColumn()
  store?: Store;
}

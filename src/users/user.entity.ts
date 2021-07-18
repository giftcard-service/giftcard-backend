import { IsDefined } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Giftcard } from '../giftcards/giftcard.entity';
import { Store } from '../stores/store.entity';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  id: string;

  @Column({ unique: true })
  @IsDefined()
  username: string;

  @Column()
  @IsDefined()
  password: string;

  @Column({ default: true })
  @IsDefined()
  isActive?: boolean;

  @Column({ default: false })
  @IsDefined()
  isManager?: boolean;

  @ManyToOne(() => Store, (store: Store) => store.users, { eager: true })
  @JoinColumn()
  store?: Store;

  @OneToMany(() => Giftcard, (giftcard: Giftcard) => giftcard.owner)
  giftcards: Giftcard[];
}

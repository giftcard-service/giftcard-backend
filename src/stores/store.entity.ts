import { IsDefined } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';

import { Giftcard } from '../giftcards/giftcard.entity';
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

  @OneToMany(() => Giftcard, (giftcard: Giftcard) => giftcard.store)
  giftcards: Giftcard[];

  sumIssuedGiftcardAmount?: number;
  sumIssuedGiftcardAmountLeft?: number;
  sumIssuedGiftcardWithNoOwnerAmount?: number;
}

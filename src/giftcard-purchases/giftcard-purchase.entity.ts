import { IsDefined, IsNumber } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';
import { Giftcard } from '../giftcards/giftcard.entity';

@Entity()
export class GiftcardPurchase {
  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  id: string;

  @ManyToOne(() => User, (user: User) => user.giftcards, { eager: true })
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Store, (store: Store) => store.giftcards, { eager: true })
  @JoinColumn()
  store!: Store;

  @ManyToOne(
    () => Giftcard,
    (giftcard: Giftcard) => giftcard.giftcardPurchases,
    { eager: true },
  )
  @JoinColumn()
  giftcard?: Giftcard;

  @CreateDateColumn({ type: 'timestamptz' })
  @IsDefined()
  creationTime!: Date;

  @Column()
  @IsNumber()
  amount!: number;
}

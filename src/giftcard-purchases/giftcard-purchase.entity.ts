import { IsDefined, IsNumber } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';
import { Giftcard } from '../giftcards/giftcard.entity';

@Entity()
export class GiftcardPurchase {
  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  @ApiProperty({ description: 'ID' })
  id: string;

  @ManyToOne(() => User, (user: User) => user.giftcards, { eager: true })
  @JoinColumn()
  @ApiProperty({ description: '사용자' })
  user!: User;

  @ManyToOne(() => Store, (store: Store) => store.giftcards, { eager: true })
  @JoinColumn()
  @ApiProperty({ description: '매장' })
  store!: Store;

  @ManyToOne(
    () => Giftcard,
    (giftcard: Giftcard) => giftcard.giftcardPurchases,
    { eager: true },
  )
  @JoinColumn()
  @ApiProperty({ description: '상품권' })
  giftcard?: Giftcard;

  @CreateDateColumn({ type: 'timestamptz' })
  @IsDefined()
  @ApiProperty({ description: '생성 시각' })
  creationTime!: Date;

  @Column()
  @IsNumber()
  @ApiProperty({ description: '금액' })
  amount!: number;
}

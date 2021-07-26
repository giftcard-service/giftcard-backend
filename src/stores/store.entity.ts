import { IsDefined } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Giftcard } from '../giftcards/giftcard.entity';
import { User } from '../users/user.entity';

@Entity()
@Unique(['name'])
export class Store {
  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  @ApiProperty({ description: 'ID' })
  id: string;

  @Column({ unique: true })
  @IsDefined()
  @ApiProperty({ description: '매장 이름' })
  name: string;

  @OneToMany(() => User, (user: User) => user.store)
  users: User[];

  @OneToMany(() => Giftcard, (giftcard: Giftcard) => giftcard.store)
  giftcards: Giftcard[];

  @ApiProperty({ description: '총 발급 금액' })
  sumIssuedGiftcardAmount?: number;

  @ApiProperty({ description: '총 잔여 금액' })
  sumIssuedGiftcardAmountLeft?: number;

  @ApiProperty({ description: '사용자에게 발급되지 않은 총 발급 금액' })
  sumIssuedGiftcardWithNoOwnerAmount?: number;
}

import { IsBoolean, IsDefined, IsNumber, IsOptional } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
  OneToOne,
  OneToMany,
  getRepository,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';
import { QrCode } from '../qrcodes/qrcode.entity';
import { GiftcardPurchase } from '../giftcard-purchases/giftcard-purchase.entity';

@Entity()
export class Giftcard {
  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  @ApiProperty({ description: 'ID' })
  id: string;

  @ManyToOne(() => User, (user: User) => user.giftcards, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  @ApiProperty({ description: '사용자' })
  owner?: User;

  @ManyToOne(() => Store, (store: Store) => store.giftcards, { eager: true })
  @JoinColumn()
  @ApiProperty({ description: '매장' })
  store!: Store;

  @OneToOne(() => QrCode, (qrCode: QrCode) => qrCode.giftcard, {
    nullable: true,
  })
  @JoinColumn()
  @ApiProperty({ description: 'QR 코드' })
  qrCode?: QrCode;

  @OneToMany(
    () => GiftcardPurchase,
    (giftcardPurchase: GiftcardPurchase) => giftcardPurchase.giftcard,
  )
  giftcardPurchases: GiftcardPurchase[];

  @Column({ type: 'timestamptz' })
  @IsDefined()
  @ApiProperty({ description: '생성 시각' })
  creationTime!: Date;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ description: '만료 시각' })
  expirationTime?: Date;

  @Column()
  @IsNumber()
  @ApiProperty({ description: '금액' })
  amount!: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '잔여 금액' })
  protected amountLeft: number;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async calculateAmountLeft(): Promise<void> {
    const { sum } = await getRepository(GiftcardPurchase)
      .createQueryBuilder('giftcardPurchase')
      .leftJoinAndSelect('giftcardPurchase.giftcard', 'giftcard')
      .select('SUM(giftcardPurchase.amount)', 'sum')
      .where('giftcard.id = :giftcardId', { giftcardId: this.id })
      .getRawOne();

    this.amountLeft = this.amount - sum;
  }

  async getAmountLeft(): Promise<number> {
    return this.amountLeft;
  }

  @Column({ default: false })
  @IsBoolean()
  @ApiProperty({ description: '사용 여부' })
  isUsed: boolean;
}

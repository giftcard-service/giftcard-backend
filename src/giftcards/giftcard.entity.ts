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

import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';
import { QrCode } from '../qrcodes/qrcode.entity';
import { GiftcardPurchase } from '../giftcard-purchases/giftcard-purchase.entity';

@Entity()
export class Giftcard {
  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  id: string;

  @ManyToOne(() => User, (user: User) => user.giftcards, { eager: true })
  @JoinColumn()
  owner!: User;

  @ManyToOne(() => Store, (store: Store) => store.giftcards, { eager: true })
  @JoinColumn()
  store!: Store;

  @OneToOne(() => QrCode, (qrCode: QrCode) => qrCode.giftcard, {
    nullable: true,
  })
  @JoinColumn()
  qrCode?: QrCode;

  @OneToMany(
    () => GiftcardPurchase,
    (giftcardPurchase: GiftcardPurchase) => giftcardPurchase.giftcard,
  )
  giftcardPurchases: GiftcardPurchase[];

  @Column({ type: 'timestamptz' })
  @IsDefined()
  creationTime!: Date;

  @Column({ type: 'timestamptz' })
  expirationTime?: Date;

  @Column()
  @IsNumber()
  amount!: number;

  @IsNumber()
  @IsOptional()
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
  isUsed: boolean;
}

import { IsDefined } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { Giftcard } from '../giftcards/giftcard.entity';

@Entity()
export class QrCode {
  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  id: string;

  @OneToOne(() => Giftcard, (giftcard: Giftcard) => giftcard.qrCode, {
    eager: true,
  })
  @JoinColumn()
  giftcard: Giftcard;

  @CreateDateColumn({ type: 'timestamptz' })
  @IsDefined()
  creationTime!: Date;

  @Column({ type: 'timestamptz' })
  @IsDefined()
  expirationTime!: Date;
}

import { IsDefined } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Giftcard } from '../giftcards/giftcard.entity';

@Entity()
export class QrCode {
  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  @ApiProperty({ description: 'ID' })
  id: string;

  @OneToOne(() => Giftcard, (giftcard: Giftcard) => giftcard.qrCode, {
    eager: true,
  })
  @JoinColumn()
  @ApiProperty({ description: '상품권' })
  giftcard: Giftcard;

  @CreateDateColumn({ type: 'timestamptz' })
  @IsDefined()
  @ApiProperty({ description: '생성 시각' })
  creationTime!: Date;

  @Column({ type: 'timestamptz' })
  @IsDefined()
  @ApiProperty({ description: '만료 시각' })
  expirationTime!: Date;
}

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
import { ApiProperty } from '@nestjs/swagger';

import { Giftcard } from '../giftcards/giftcard.entity';
import { Store } from '../stores/store.entity';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  @ApiProperty({ description: 'ID' })
  id: string;

  @Column({ unique: true })
  @IsDefined()
  @ApiProperty({ description: '아이디' })
  username: string;

  @Column()
  @IsDefined()
  @ApiProperty({ description: '비밀번호' })
  password: string;

  @Column({ default: true })
  @IsDefined()
  @ApiProperty({ description: '활동 여부' })
  isActive?: boolean;

  @Column({ default: false })
  @IsDefined()
  @ApiProperty({ description: '관리자 여부' })
  isManager?: boolean;

  @ManyToOne(() => Store, (store: Store) => store.users, { eager: true })
  @JoinColumn()
  @ApiProperty({ description: '매장' })
  store?: Store;

  @OneToMany(() => Giftcard, (giftcard: Giftcard) => giftcard.owner)
  giftcards: Giftcard[];
}

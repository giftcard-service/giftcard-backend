import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Store } from '../stores/store.entity';
import { StoresModule } from '../stores/stores.module';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { Giftcard } from './giftcard.entity';
import { GiftcardsController } from './giftcards.controller';
import { GiftcardsService } from './giftcards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Store, Giftcard]),
    UsersModule,
    StoresModule,
  ],
  exports: [GiftcardsService],
  providers: [GiftcardsService],
  controllers: [GiftcardsController],
})
export class GiftcardsModule {}

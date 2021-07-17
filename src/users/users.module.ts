import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { StoresModule } from '../stores/stores.module';
import { Store } from '../stores/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Store]), StoresModule],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

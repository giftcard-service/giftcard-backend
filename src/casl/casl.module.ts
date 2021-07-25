import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/user.entity';
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}

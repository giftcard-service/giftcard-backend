import { join } from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoresModule } from './stores/stores.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GiftcardsModule } from './giftcards/giftcards.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: (process.env.SQL_TYPE as any) || 'postgres',
      host: process.env.SQL_HOST || 'localhost',
      port: parseInt(process.env.SQL_PORT) || 5432,
      username: process.env.SQL_USER || 'root',
      password: process.env.SQL_PASSWORD || 'foobar',
      database: process.env.SQL_DATABASE || 'db_giftcard',
      synchronize: process.env.DB_SYNCHRONIZE === 'true' || true,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    }),
    UsersModule,
    StoresModule,
    AuthModule,
    GiftcardsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}

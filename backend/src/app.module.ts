import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AccountService } from './account/account.service';
import { AccountController } from './account/account.controller';
import { AuthEntity } from './entitys/auth.entity';
import { DatabasesEntity } from './entitys/databases.entity';
import { AccountModule } from './account/account.module';
import { redisModule } from './utils/redis';
import { DATABASE_HOST, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_SCHEMA, DATABASE_USERNAME, TYPEORM_SYBCHRONIZE } from './utils/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      username: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      database: DATABASE_SCHEMA,
      entities: [AuthEntity, DatabasesEntity],
      synchronize: TYPEORM_SYBCHRONIZE, // dev modes
    }),
    AccountModule,
    redisModule
  ],
  controllers: [AppController, AccountController],
  providers: [AccountService],
})
export class AppModule {}

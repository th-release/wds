import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from 'src/entitys/auth.entity';
import { DatabasesEntity } from 'src/entitys/databases.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { redisModule } from 'src/utils/redis';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity, DatabasesEntity]),
    redisModule,
  ],
  exports: [TypeOrmModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}

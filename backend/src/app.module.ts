import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AccountService } from './account/account.service';
import { AccountController } from './account/account.controller';
import { AuthEntity } from './entitys/auth.entity';
import { DatabasesEntity } from './entitys/databases.entity';
import { AccountModule } from './account/account.module';
import { redisModule } from './utils/redis';
import { ConfigurationModule } from './configuration/configuration.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_SCHEMA'),
        entities: [AuthEntity, DatabasesEntity],
        synchronize: configService.get('TYPEORM_SYBCHRONIZE')
      })
    }),
    AccountModule,
    redisModule,
    ConfigurationModule
  ],
  controllers: [AppController, AccountController],
  providers: [AccountService],
})
export class AppModule {}

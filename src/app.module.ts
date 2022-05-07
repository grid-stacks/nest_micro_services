import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { stdTimeFunctions } from 'pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    SearchModule,
    LoggerModule.forRoot({
      pinoHttp: {
        timestamp: stdTimeFunctions.isoTime,
        level: 'trace',
        transport: {
          target: 'pino-pretty',
          options: {
            levelFirst: true,
            translateTime: true,
            colorize: true,
          },
        },
      },
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

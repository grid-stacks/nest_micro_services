import { Logger, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { IORedisConfigModule } from './ioredis.config.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const ioRedisConfigModule = IORedisConfigModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('RedisConfigModule');

    return {
      connectionOptions: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        username: configService.get('REDIS_USERNAME'),
        password: configService.get('REDIS_PASSWORD'),
      },
      onClientReady: (client) => {
        logger.log('Redis client ready');

        client.on('error', (err) => {
          logger.error(`Redis client error: ${err}`);
        });

        client.on('connect', () => {
          logger.log(
            `Redis client connected: ${client.options.host}:${client.options.port}`,
          );
        });
      },
    };
  },
  inject: [ConfigService],
});

@Module({
  imports: [ioRedisConfigModule],
  controllers: [RedisController],
  providers: [RedisService],
})
export class RedisModule {}

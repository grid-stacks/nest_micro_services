import { Logger, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { IORedisConfigModule } from './ioredis.config.module';
import { OMRedisConfigModule } from './omredis.config.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const ioRedisConfigModule = IORedisConfigModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger(IORedisConfigModule.name);

    return {
      connectionOptions: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        username: configService.get('REDIS_USERNAME'),
        password: configService.get('REDIS_PASSWORD'),
      },
      onClientReady: (client) => {
        logger.log('IO Redis client ready');

        client.on('error', (err) => {
          logger.error(`IO Redis client error: ${err}`);
        });

        client.on('connect', () => {
          logger.log(
            `IO Redis client connected: ${client.options.host}:${client.options.port}`,
          );
        });
      },
    };
  },
  inject: [ConfigService],
});

export const omRedisConfigModule = OMRedisConfigModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger(OMRedisConfigModule.name);

    return {
      connectionOptions: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        username: configService.get('REDIS_USERNAME'),
        password: configService.get('REDIS_PASSWORD'),
      },
      onClientReady: async (client) => {
        logger.log('OM Redis client ready');

        logger.log(`OM Redis client is open: ${client.isOpen()}`);

        const pong = await client.execute(['PING']);
        logger.log(`OM Redis ping: ${pong}`);
      },
    };
  },
  inject: [ConfigService],
});

@Module({
  imports: [ioRedisConfigModule, omRedisConfigModule],
  controllers: [RedisController],
  providers: [RedisService],
})
export class RedisModule {}

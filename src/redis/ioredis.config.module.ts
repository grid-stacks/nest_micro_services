import {
  DynamicModule,
  FactoryProvider,
  Module,
  ModuleMetadata,
} from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

export const IORedisKey = 'IO_Redis';

type IORedisModuleOptions = {
  connectionOptions: RedisOptions;
  onClientReady?: (client: Redis) => void;
};

type IORedisAsyncModuleOptions = {
  useFactory: (
    ...args: any[]
  ) => Promise<IORedisModuleOptions> | IORedisModuleOptions;
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>;

@Module({})
export class IORedisConfigModule {
  static async registerAsync({
    useFactory,
    imports,
    inject,
  }: IORedisAsyncModuleOptions): Promise<DynamicModule> {
    const redisProvider = {
      provide: IORedisKey,
      useFactory: async (...args) => {
        const { connectionOptions, onClientReady } = await useFactory(...args);

        const client = new Redis(connectionOptions);

        onClientReady(client);

        return client;
      },
      inject,
    };

    return {
      module: IORedisConfigModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}

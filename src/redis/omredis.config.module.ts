import {
  DynamicModule,
  FactoryProvider,
  Module,
  ModuleMetadata,
} from '@nestjs/common';
import { Client } from 'redis-om';

export const OMRedisKey = 'OM_Redis';

type OMRedisModuleOptions = {
  connectionOptions: {
    username: string;
    password: string;
    host: string;
    port: number;
  };
  onClientReady?: (client: Client) => void;
};

type OMRedisAsyncModuleOptions = {
  useFactory: (
    ...args: any[]
  ) => Promise<OMRedisModuleOptions> | OMRedisModuleOptions;
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>;

@Module({})
export class OMRedisConfigModule {
  static async registerAsync({
    useFactory,
    imports,
    inject,
  }: OMRedisAsyncModuleOptions): Promise<DynamicModule> {
    const redisProvider = {
      provide: OMRedisKey,
      useFactory: async (...args) => {
        const { connectionOptions, onClientReady } = await useFactory(...args);
        const { username, password, host, port } = connectionOptions;

        const url = `redis://${username}:${password}@${host}:${port}`;

        const client = new Client();
        await client.open(url);

        onClientReady(client);

        return client;
      },
      inject,
    };

    return {
      module: OMRedisConfigModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Client } from 'redis-om';
import { IORedisKey } from './ioredis.config.module';
import { OMRedisKey } from './omredis.config.module';

@Injectable()
export class RedisService {
  constructor(
    @Inject(IORedisKey) private readonly ioRedisClient: Redis,
    @Inject(OMRedisKey) private readonly omRedisClient: Client,
  ) {}

  async omRedisTest() {
    //   const setFoo = await this.omRedisClient.set('foo', 'bar');
    const getFoo = await this.omRedisClient.get('foo');

    return getFoo;
  }
}

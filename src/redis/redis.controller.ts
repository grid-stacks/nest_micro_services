import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('om_test')
  async omRedisTest() {
    return await this.redisService.omRedisTest();
  }
}

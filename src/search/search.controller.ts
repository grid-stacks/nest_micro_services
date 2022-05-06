import { Controller, Post, Body, Get } from '@nestjs/common';
import { SearchService } from './search.service';
import { PostSearchBody } from './types/search.interface';
import { WriteResponseBase } from '@elastic/elasticsearch/lib/api/types';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('index_post')
  async indexPost(@Body() post: PostSearchBody): Promise<WriteResponseBase> {
    return await this.searchService.indexPost(post);
  }

  @Get('search')
  async search(@Body() text: { text: string }): Promise<PostSearchBody[]> {
    return await this.searchService.search(text.text);
  }
}

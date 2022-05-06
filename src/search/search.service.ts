import { WriteResponseBase } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PostSearchBody } from './types/search.interface';

@Injectable()
export class SearchService {
  postIndex = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: PostSearchBody): Promise<WriteResponseBase> {
    const indexed = await this.elasticsearchService.index<PostSearchBody>({
      index: this.postIndex,
      body: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
      },
    });

    console.log(indexed);

    return indexed;
  }

  async search(text: string) {
    const result = await this.elasticsearchService.search<PostSearchBody>({
      index: this.postIndex,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'content'],
          },
        },
      },
    });

    console.log(result);
    console.log(result.hits);

    const hits = result.hits.hits;

    return hits.map((item) => item._source);
  }

  async remove(postId: number) {
    await this.elasticsearchService.deleteByQuery({
      index: this.postIndex,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });

    return true;
  }

  async update(post: PostSearchBody) {
    const script = Object.entries(post).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    console.log(script);

    const updated = await this.elasticsearchService.updateByQuery({
      index: this.postIndex,
      body: {
        query: {
          match: {
            id: post.id,
          },
        },
        script: script,
      },
    });

    console.log(updated);

    return updated;
  }
}

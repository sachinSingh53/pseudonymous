import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/1-auth/guards/jwt-auth.guards';
import{decamelizeKeys} from 'humps'

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
    constructor(private postService:PostService){}

    @Post('/feed')
    async getFeedPost(@Body() ids:number[]){
        const posts = await this.postService.findFeedPosts(ids);
        return decamelizeKeys({
            posts
        })
    }

}

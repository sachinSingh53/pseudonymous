import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/1-auth/guards/jwt-auth.guards';
import{decamelizeKeys} from 'humps'
import { postDTO } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
    constructor(private postService:PostService){}

    @Post('/')
    async addPost(@Body() data:postDTO){
        const createdPost = await this.postService.createPost(data);
        return decamelizeKeys({createdPost})
    }

    @Post('/feed')
    async getFeedPost(@Body() ids:number[]){
        const posts = await this.postService.findFeedPosts(ids);
        return decamelizeKeys({
            posts
        })
    }

    

}

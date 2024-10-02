import { Body, Controller, Delete, Get,Put, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/1-auth/guards/jwt-auth.guards';
import{decamelizeKeys} from 'humps'
import { postDTO } from './dto';
import { commentDTO } from './dto/comment.dto';

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

    @Get('/:postId/comments')
    async getPostComments(@Param('postId',ParseIntPipe) postId:number){
        const comments = await this.postService.findPostComments(postId);
        return decamelizeKeys({
            comments
        })
    }

    @Post('/:postId/comments')
    async addComment(
        @Param('postId', ParseIntPipe) postId:Number,
        @Body() data:commentDTO
    ){
        const comment  = await this.postService.createComment({...data,postId})
        return decamelizeKeys({
            comment
        })
    }

    @Delete('/:postId')
    async removePost(@Param('postId',ParseIntPipe) postId:number){
        return await this.postService.deletePost(postId);
    }

    @Put('/like-post')
    async likePost(@Body() data){
        return await this.postService.likePost(data);
    }

    @Put('/:postId')
    async unlikePost(@Body() data){
        return this.postService.unlikePost(data)
    }

    

}

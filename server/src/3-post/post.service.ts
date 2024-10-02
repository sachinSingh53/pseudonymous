import {  Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { postDTO } from './dto';
import { commentDTO } from './dto/comment.dto';

@Injectable()
export class PostService {
    constructor(
        private prismaService:PrismaService
    ){}

    createPost(data:postDTO){
        return this.prismaService.post.create({
            data
        })
    }

    findPostByID(id:number){
        return this.prismaService.post.findUnique({
            where:{
                id
            }
        })
    }

    findFeedPosts(ids: number[]) {
        return this.prismaService.post.findMany({
            where: {
                senderId: {
                    in: ids, 
                },
            },
            orderBy: {
                created_at: 'desc',  
            },
        });
    }

    deletePost(postId:number){
        return this.prismaService.post.delete({
            where:{
                id:postId
            }
        })
    }

    findPostComments(postId:number){
        return this.prismaService.comment.findMany({
            where:{
                postId
            }
        })
    }

    createComment(data){
        return this.prismaService.comment.create({
            data
        })
    }

    likePost(data){
        const {postId,userId} = data;
        return this.prismaService.post.update({
            where:{
                id:postId
            },
            data:{
                likes:{
                    push:userId
                }
            }
        })
    }

    async unlikePost(data){
        const {postId,userId} = data;

        const post = await this.prismaService.post.findUnique({where:{id:postId}});
        if(!post){
            throw new NotFoundException(`post with ${postId} not found`);
        }
        const updatedLikes = post.likes.filter((id) => id !== userId)
        return this.prismaService.post.update({
            where:{
                id:postId
            },
            data:{
                likes:{
                    set:updatedLikes
                }
            }
        })
    }
    
   
    
}

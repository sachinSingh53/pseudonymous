import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { postDTO } from './dto';

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
                    in: ids,  // Fetch posts where senderId is in the provided array of IDs
                },
            },
            orderBy: {
                created_at: 'desc',  // Order posts by timestamp in descending order (latest first)
            },
        });
    }
    
}

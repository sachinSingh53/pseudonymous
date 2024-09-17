import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
    constructor(
        private prismaService:PrismaService
    ){}

    async getAllPost(){
        return await this.prismaService.post.findMany();
    }

    async getCurrentUserPost(user_id:number){
        return await this.prismaService.post.findUnique({
            where:{
                user_id
            }
        })
    }

    async getPostbyId(id:number){
        return await this.prismaService.post.findUnique({
            where:{
                id
            }
        })
    }


    
}

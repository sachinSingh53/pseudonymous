import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private prismaService:PrismaService
    ){}

    getUserByID(id:number){
        return this.prismaService.user.findUnique({
            where:{
                id
            }
        })
    }

    getUserByUsername(username:string){
        return this.prismaService.user.findUnique({
            where:{
                username
            }
        })
    }

    updateProfile(data:any, userId:number){
        return this.prismaService.user.update({
            where:{
                id:userId
            },
            data
        })
    }

    
}

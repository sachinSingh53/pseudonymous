import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private prismaService:PrismaService
    ){}

    async getUserByID(id:number){
        return this.prismaService.user.findUnique({
            where:{
                id
            }
        })
    }
}

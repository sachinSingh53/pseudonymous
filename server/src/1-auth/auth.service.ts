import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { registerDTO } from './dto';
import { generateFromEmail, generateUsername } from "unique-username-generator";

@Injectable()
export class AuthService {
    constructor(
        private prismaService:PrismaService,
        private jwtService:JwtService
    ){}

    generateJwt(payload) {
        return this.jwtService.sign(payload);
    }

    async signIn(user:registerDTO){
        if(!user){
            throw new BadRequestException('Unauthenticated');
        }

        const exitingUser = await this.findUserByEmail(user.email);
        if(!exitingUser) return this.register(user);

        return this.generateJwt({
            sub:exitingUser.id,
            email:exitingUser.email
        })
    }

    async register(user:registerDTO){
        const username = generateUsername("-");
        user.username = username;
        const createdUser = await this.prismaService.user.create({data:user});

        return this.generateJwt({
            sub: createdUser.id,
            email:createdUser.email
        })
    }

    async findUserByEmail(email:string){
        return await this.prismaService.user.findUnique(
            {
                where:{
                    email
                }
            }
        )
    }


}

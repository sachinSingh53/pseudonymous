import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { registerDTO } from './dto';
import { generateFromEmail, generateUsername } from "unique-username-generator";
import { signUpDTO } from './dto/signUp.dto';
import * as bcrypt from 'bcryptjs';
import { loginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService
    ) { }

    private generateJwt(payload: any) {
        return this.jwtService.sign(payload);
    }

    // async signIn(user:registerDTO){
    //     if(!user){
    //         throw new BadRequestException('Unauthenticated');
    //     }

    //     const exitingUser = await this.findUserByEmail(user.email);
    //     if(!exitingUser) return this.register(user);

    //     return this.generateJwt({
    //         sub:exitingUser.id,
    //         email:exitingUser.email
    //     })
    // }

    async signIn(dto:loginDTO) {
        let existingUser: any;
        existingUser = await this.findUserByEmail(dto.email);

        if (!existingUser) {
            throw new ForbiddenException('invalid credentials');
        }

        const isPasswordMatch = await bcrypt.compare(
            dto.password,
            existingUser.password,
        );
        if (!isPasswordMatch) {
            throw new ForbiddenException('invalid credentials');
        }

        delete existingUser.password;


        const token = this.generateJwt({
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
        })

        return {
            token,
            existingUser,
        };
    }

    async register(user: signUpDTO) {

        user.password = await bcrypt.hash(user.password, 10);
        const createdUser = await this.prismaService.user.create({ data: user });
        const token = this.generateJwt({
            id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email
        });
        delete createdUser.password;
        return { token, createdUser };
    }

    async findUserByEmail(email: string) {
        return await this.prismaService.user.findUnique(
            {
                where: {
                    email
                }
            }
        )
    }
    async findUserByUsername(username: string) {
        return await this.prismaService.user.findUnique(
            {
                where: {
                    username
                }
            }
        )
    }


}

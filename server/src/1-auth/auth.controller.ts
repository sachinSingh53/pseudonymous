import { Controller, Get, Post, Req, Res, UseGuards,Body, BadRequestException } from '@nestjs/common';
import { GoogleOauthGuard } from './guards';
import { AuthService } from './auth.service';
import { User } from './decorators';
import { registerDTO } from './dto';
import{decamelizeKeys} from 'humps'
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import {signUpDTO,} from './dto/signUp.dto';
import { loginDTO } from './dto/login.dto';


@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){}

    // @Get('google')
    // @UseGuards(GoogleOauthGuard)
    // async oauth(){}
    // @Get('google/callback')
    // @UseGuards(GoogleOauthGuard)
    // async googleAuthCallback(@User() user,@Res() res){
        
    //     const userDto:registerDTO = {
    //         username:'',
    //         email:user.email,
    //         profile_picture:user.picture
    //     }

    //     const accessToken = await this.authService.signIn(userDto);

    //     // res.redirect(`http://localhost:3000/login/success?token=${accessToken}`);
    //     res.cookie("access_token",accessToken,{
    //         expires: new Date(Date.now()+25892000000),
    //         httpOnly: true
    //     }).redirect('http://localhost:3000')
    // }


    @Post('sign-up')
    async signUp(@Body() dto:signUpDTO){
        const exitingUserEmail = await this.authService.findUserByEmail(dto.email);
        const exitingUserUsername = await this.authService.findUserByUsername(dto.username);
        if(exitingUserEmail) throw new BadRequestException('this email is already registered');
        if(exitingUserUsername) throw new BadRequestException('this username is already registered');

        const {token,createdUser} = await this.authService.register(dto);

        return decamelizeKeys({
            token,
            data:{
                user:createdUser
            }
        })
    }

    @Post('sign-in')
    async logIn(@Body() dto:loginDTO){
        const {token,existingUser} = await this.authService.signIn(dto);
        return decamelizeKeys({
            token,
            data:{
                user:existingUser
            }
        })
    }

    
}

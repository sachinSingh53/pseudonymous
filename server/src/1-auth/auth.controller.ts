import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from './guards';
import { AuthService } from './auth.service';
import { User } from './decorators';
import { registerDTO } from './dto';
import{decamelizeKeys} from 'humps'
import { JwtAuthGuard } from './guards/jwt-auth.guards';


@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){}

    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async oauth(){}


    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleAuthCallback(@User() user,@Res() res){
        
        const userDto:registerDTO = {
            username:'',
            email:user.email,
            profile_picture:user.picture
        }

        const accessToken = await this.authService.signIn(userDto);

        // res.redirect(`http://localhost:3000/login/success?token=${accessToken}`);
        res.cookie("access_token",accessToken,{
            expires: new Date(Date.now()+25892000000),
            httpOnly: true
        }).redirect('http://localhost:3000')

    }

    
}

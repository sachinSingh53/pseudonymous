import { Controller, Get, Put, Param, ParseIntPipe, UseGuards, Body } from '@nestjs/common';
import { UserService } from './user.service';
import{decamelizeKeys} from 'humps'
import { JwtAuthGuard } from 'src/1-auth/guards/jwt-auth.guards';
import { UpdateProfileDto } from './dto';


@Controller('users')
// @UseGuards(AuthGuard)
export class UserController {
    constructor(
        private userService:UserService
    ){}

    @Get('/:id')
    async getById(@Param('id', ParseIntPipe) id:number){
        const user = await this.userService.getUserByID(id);
        delete user.password
        return ({user})
    }

    @Get('/u/:username')
    async getUserByUsername(@Param('username') username:string){
        const user = await this.userService.getUserByUsername(username);
        return ({user});
    }

    @Get(':userId/following')
    async getUserFollowing(
        @Param('userId',ParseIntPipe) userId:number
    ){
        const user = await this.userService.getUserByID(userId);
        const following = user.following;
        return {following}

    }

    // await axios.put(`/users/${user.id}`, {
    //     displayName,
    //     bio,
    //     location,
    //     website,
    //     photoURL: finalPhoto,
    //     wallpaper: finalWallpaper,
    //   });

    @Put('/:userId')
    async updateUserProfile(
        @Param('userId',ParseIntPipe) userId:number,
        @Body() data:UpdateProfileDto
    ){
        await this.userService.updateProfile(data,userId); 
        return{
            message:'profile updated successfully'
        }
    }


    
}

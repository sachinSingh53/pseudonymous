import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import{decamelizeKeys} from 'humps'
import { JwtAuthGuard } from 'src/1-auth/guards/jwt-auth.guards';


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

    
}

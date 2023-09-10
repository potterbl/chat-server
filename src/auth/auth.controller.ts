import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {UserDto} from "../dto/user.dto";
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {
    }

    @Get('/:limit')
    getAll(@Param('limit') limit){
        return this.authService.getAll(limit)
    }

    @Post('/sign')
    sign(@Body() user: UserDto){
        return this.authService.createUser(user)
    }

    @Post('/login')
    login(@Body() user: UserDto){
        return this.authService.login(user)
    }

    @Post('/')
    auth(@Body('token') token){
        return this.authService.auth(token)
    }
}

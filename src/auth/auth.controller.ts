import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {UserSignDto} from "../dto/userSign.dto";
import {AuthService} from "./auth.service";
import {UserLoginDto} from "../dto/userLogin.dto";

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {
    }

    @Get('/')
    getAll(){
        return this.authService.getAll()
    }

    @Post('/sign')
    createUser (@Body() user: UserSignDto) {
        return this.authService.createUser(user)
    }

    @Post('/login')
    login(@Body() user: UserLoginDto){
        return this.authService.login(user)
    }

    @Post('/')
    auth(@Body('token') token){
        return this.authService.auth(token)
    }
}

import {IsEmail, IsNotEmpty} from "class-validator";

export class UserLoginDto {
    @IsEmail()
    readonly login: string;
    @IsNotEmpty()
    readonly password: string;
}
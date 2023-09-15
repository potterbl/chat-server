import {IsEmail, IsNotEmpty} from "class-validator";

export class UserSignDto {
    @IsNotEmpty()
    readonly name: string;
    @IsEmail()
    readonly login: string;
    @IsNotEmpty()
    readonly password: string;
}
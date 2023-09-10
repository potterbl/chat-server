import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../entities/user.entity";
import {UserDto} from "../dto/user.dto";
import {NotFoundError} from "rxjs";
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private users: Repository<User>
    ) {
    }

    async getAll(limit: number){
        try{
            return this.users.find({
                take: limit,
                select: ['id', 'name']
            })
        } catch (e) {
            throw new Error(e)
        }
    }

    async createUser(user: UserDto){
        try{
            const candidate = await this.users.findOneBy({login: user.login})

            if(!candidate){
                const newUser = await this.users.save(user)

                const payload = {
                    id: newUser.id,
                    name: newUser.name
                }

                return {token: jwt.sign(payload, 'secret-test', {expiresIn: '14d'})}
            } else {
                throw new Error('Аккаунт уже существует')
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async login(user: UserDto){
        try{
            const candidate = await this.users.findOneBy({login: user.login})

            if(candidate){
                if(candidate.password == user.password){
                    const payload = {
                        id: candidate.id,
                        name: candidate.name
                    }

                    return {token: jwt.sign(payload, 'secret-test', {expiresIn: '14d'})}
                } else {
                    throw new UnauthorizedException()
                }
            } else {
                throw new NotFoundError('Пользователь не найден')
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async auth(token){
        try{
            const candidate = jwt.verify(token, 'secret-test')

            if(candidate){
                return candidate
            } else {
                throw new UnauthorizedException()
            }
        } catch(e) {
            throw new Error(e)
        }
    }
}

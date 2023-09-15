import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../entities/user.entity";
import * as jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import * as process from "process";
import {NotFoundError} from "rxjs";
config()

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private users: Repository<User>
    ) {
    }

    async getAll() {
        try {
            return await this.users.find({
                select: {
                    id: true,
                    name: true
                }
            })
        } catch (e) {
            throw new Error(e)
        }
    }

    async createUser(user) {
        try {
            const candidate = await this.users.findOne({where: {login: user.login}})

            if (!candidate) {
                const newUser = await this.users.save(user)

                const payload = {
                    id: newUser.id,
                    name: newUser.name
                }

                return {token: jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '14d'})}
            } else {
                throw new UnauthorizedException()
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async login(user) {
        try {
            const candidate = await this.users.findOne({
                where: {
                    login: user.login
                }
            })

            if (candidate) {
                const payload = {
                    id: candidate.id,
                    name: candidate.name
                }

                return {token: jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '14d'})}
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async auth(token) {
        try {
            const candidate = jwt.verify(token, process.env.SECRET_KEY)

            if (candidate) {
                return candidate
            } else {
                throw new NotFoundError("User wasn't found")
            }
        } catch (e) {
            throw new Error(e)
        }
    }
}
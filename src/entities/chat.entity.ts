import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Message} from "./message.entity";
import {User} from "./user.entity";

@Entity()
export class Chat{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[]

    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[]
}
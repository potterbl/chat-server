import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Message} from "./message.entity";

@Entity()
export class Chat{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('integer', {array: true})
    between: number[]

    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[]
}
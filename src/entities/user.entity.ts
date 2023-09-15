import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Chat} from "./chat.entity";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    login: string;

    @Column()
    password: string;
}
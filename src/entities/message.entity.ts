import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Chat} from "./chat.entity";

@Entity()
export class Message{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    from: number;

    @Column()
    message: string;

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => Chat, (chat) => chat.messages)
    chat: Chat;
}
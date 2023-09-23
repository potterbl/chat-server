import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {Chat} from "./chat.entity";
import {User} from "./user.entity";

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

    @Column({default: false})
    seen: boolean;

    @ManyToOne(() => Message, (message) => message.replied, {nullable: true})
    @JoinTable()
    replied: Message;
}
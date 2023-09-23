import {Message} from "../entities/message.entity";

export class MessageDto{
    readonly from: number;
    readonly message: string;
    readonly chat: number;
    readonly replied: Message;
}
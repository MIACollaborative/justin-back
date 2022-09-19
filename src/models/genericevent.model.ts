import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

export class GenericEvent {
    name: string;
    userName: string;

    constructor(name: string, userName: string) {
        this.name = name;
        this.userName = userName;
    }
}
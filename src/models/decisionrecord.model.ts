import { User } from "./user.model";
import { ITrigger } from './trigger.interface';

export class DecisionRecord {
    user: User;
    triggerId: string;
    record: Object;
    providedTimestamp: Date;
    generatedTimestamp: Date;

    constructor(user: User, triggerId: string, record: Object, timestamp: Date) {
        this.user = user;
        this.triggerId = triggerId;
        this.record = record;
        this.providedTimestamp = timestamp;
        this.generatedTimestamp = new Date();
    }
}
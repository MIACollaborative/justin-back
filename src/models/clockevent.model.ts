import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";
import { GenericEvent } from "./genericevent.model";

export class ClockEvent extends GenericEvent {
    // As a start, use genericevent 
    // assuming that the providedTimestamp is the intended clock value
    
    /*
    name: string;
    userName: string;
    providedTimestamp: Date;
    generatedTimestamp: Date;

    constructor(name: string, userName: string, timestamp: Date) {
        this.name = name;
        this.userName = userName;
        this.providedTimestamp = timestamp;
        this.generatedTimestamp = new Date();
    }
    */
}
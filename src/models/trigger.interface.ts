
import { User } from './user.model';
import { TriggerRecord } from './triggerrecord.model';
import { DecisionRecord } from './decisionrecord.model';
import { GenericRecord } from './genericrecord.model';

export interface ITrigger {
    name: string;
    
    // public, expected to be called
    //execute(user: User, curTime: Date): Promise<TriggerRecord>;
    getName(): string;

    // public, but only get called if further customization is needed
    shouldRun(user: User, curTime: Date, eventObj?:Object): Promise<GenericRecord>; //: boolean; 
    getProbability(user: User, curTime: Date): Promise<GenericRecord>; //: number
    doAction(user: User, curTime: Date): Promise<GenericRecord>; // for now
    generateRecord(user: User, curTime: Date, shouldRunRecord:GenericRecord, probabilityRecord?:GenericRecord, actionRecord?:GenericRecord):TriggerRecord;

    // public? but do not expect to be called in usual cases. Will be called 
    //generateRecord():TriggerRecord;
}
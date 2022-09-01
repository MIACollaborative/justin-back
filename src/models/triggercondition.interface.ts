
import { User } from './user.model';
import { TriggerRecord } from './triggerrecord.model';
import { DecisionRecord } from './decisionrecord.model';
import { GenericRecord } from './genericrecord.model';

export interface ITriggerCondition {
    name: string;
    
    // public, expected to be called
    check(user: User | null, curTime: Date):Promise<GenericRecord>;
    getName(): string;

    // dont' require it for now
    //fromSpec(spec:Object):ITriggerCondition;
}

/*
export interface ITriggerConditionStatic {
    new(): ITriggerCondition;
    fromSpec(spec:Object):ITriggerCondition;
}
*/
import { GenericRecord } from './genericrecord.model';
import { ITriggerCondition } from './triggercondition.interface';

export interface IArbiter {
    name: string;
    
    // public, expected to be called
    arbitrateList(itemList: Object[]):Promise<GenericRecord>;
    getName(): string;

    // dont' require it for now
    //fromSpec(spec:Object):ITriggerCondition;
}
import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

import { GenericEvaluable } from "./genericevaluable.model";
import { GenericCondition } from "./genericcondition.model";

export class GenericEventCondition extends GenericCondition {
    forValidity: boolean = false;
    type: string = "standard";
    eventName: string = "clock";
    
    generateRecord( recordObj:Object, curTime: Date):GenericRecord{
        return new GenericRecord({...recordObj, validity: this.forValidity? recordObj["value"]: true}, curTime);
    }

}
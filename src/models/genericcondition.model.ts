import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

import { GenericEvaluable } from "./genericevaluable.model";

export class GenericCondition extends GenericEvaluable {
    forValidity: boolean = false;

    generateRecord( recordObj:Object, curTime: Date):GenericRecord{
        return new GenericRecord({...recordObj, validity: this.forValidity? recordObj["value"]: true}, curTime);
    }

}
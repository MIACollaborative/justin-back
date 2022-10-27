import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

import { GenericEvaluable } from "./genericevaluable.model";

export class GenericCondition extends GenericEvaluable {
    forValidity: boolean = false;
    type: string = "generic";

    generateRecord( recordObj:Object, curTime: Date):GenericRecord{
        return new GenericRecord({...recordObj, conditionType: this.type, validity: this.forValidity? recordObj["value"]: true}, curTime);
    }

}
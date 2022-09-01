import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

import { GenericEvaluable } from "./genericevaluable.model";

export class GenericArbiter extends GenericEvaluable {

    async evaluate(user:User, curTime:Date, metaObject:{evaluableList: GenericEvaluable[]}):Promise<GenericRecord>{
        return Promise.resolve(this.generateRecord({}, curTime));
    }

    static compose(user:User, curTime:Date, metaObject:{evaluableList: GenericEvaluable[]}): GenericArbiter{
        return new GenericArbiter();
    }

}
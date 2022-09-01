
import { User } from '../models/user.model';
import { GenericRecord } from '../models/genericrecord.model';
import GeneralUtility from '../utilities/generalutilities';
import { DateTime } from 'luxon';
import { GenericArbiter } from '../models/genericarbiter.model';
import { GenericEvaluable } from '../models/genericevaluable.model';

export default class AllArbiter extends GenericArbiter {

    name: string = "AllArbiter";

    constructor() {
        super();
    }

    async evaluate(user: User | null, curTime: Date, metaObject:{evaluableList: GenericEvaluable[]}): Promise<GenericRecord> {
        console.log(`[Arbiter]`, this.getName(), `evaluableList`, metaObject.evaluableList);

        let recordList: GenericRecord[] = [];
        
        for(let i = 0; i < metaObject.evaluableList.length; i++){
            let evaluable = metaObject.evaluableList[i];
            let record = await evaluable.evaluate(user, curTime);
            recordList.push(record);
        }

        // but I need to perform the boolean operation if they were conditions types.

        // this value does not make sense yet
        return this.generateRecord({value: true, recordList: recordList}, curTime);
    }
    /*
    compose(user: User | null, curTime: Date, metaObject:{evaluableList: GenericEvaluable[]}): GenericArbiter {
        console.log(`[Arbiter]`, this.getName(), `compose with evaluableList`, metaObject.evaluableList);

        return (user: User | null, curTime: Date, metaObject:{evaluableList: GenericEvaluable[]}) => {
            return new AllArbiter.
        };
    }
    */
}
import { User } from "../models/user.model";
import { ITrigger } from '../models/trigger.interface';
import { GenericRecord } from "../models/genericrecord.model";
import { GenericEvaluable } from "../models/genericevaluable.model";
import { GenericArbiter } from "../models/genericarbiter.model";
import { GenericCondition } from "../models/genericcondition.model";
import GeneralUtility from "../utilities/generalutilities";

export class AllConditionArbiter extends GenericArbiter {

    name: string = "AllConditionArbiter";

    async evaluate(user:User, curTime:Date, metaObject:{evaluableList: GenericCondition[]}):Promise<GenericRecord>{
        let conditionEvaluationResultList:GenericRecord[] = [];
        for(let i = 0 ; i < metaObject.evaluableList.length; i++){
            let condition:GenericCondition = metaObject.evaluableList[i];
            let resultRecord:GenericRecord = await condition.evaluate(user, curTime);
            conditionEvaluationResultList.push(resultRecord);
        }

        let result = true;

        let valueList = conditionEvaluationResultList.map((record) => {
            return record['record']['value'];
        });

        console.log(`valueList: ${valueList}`);

        result = GeneralUtility.reduceBooleanArray(valueList, "and");

        return new GenericRecord({value: result, recordList: conditionEvaluationResultList}, curTime);
    }
    /*
    static compose(user:User, curTime:Date, metaObject:{evaluableList: GenericEvaluable[]}): GenericArbiter{
        return new GenericArbiter();
    }
    */

}
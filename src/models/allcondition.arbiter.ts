import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";
import { GenericEvaluable } from "./genericevaluable.model";
import { GenericArbiter } from "./genericarbiter.model";
import { GenericCondition } from "./genericcondition.model";
import GeneralUtility from "../utilities/generalutilities";

export class AllConditionArbiter extends GenericArbiter {

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
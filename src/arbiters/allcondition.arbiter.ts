import { User } from "../models/user.model";
import { ITrigger } from '../models/trigger.interface';
import { GenericRecord } from "../models/genericrecord.model";
import { GenericEvaluable } from "../models/genericevaluable.model";
import { GenericArbiter } from "../models/genericarbiter.model";
import { GenericCondition } from "../models/genericcondition.model";
import GeneralUtility from "../utilities/generalutilities";
import { GenericEvent } from "../models/genericevent.model";

export class AllConditionArbiter extends GenericArbiter {

    name: string = "AllConditionArbiter";

    #metaObject:{evaluableList: GenericCondition[]};

    async evaluate(user:User, event:GenericEvent, metaObject:{evaluableList: GenericCondition[]}):Promise<GenericRecord>{

        let eList = metaObject != undefined? metaObject.evaluableList: this.#metaObject.evaluableList;


        let conditionEvaluationResultList:GenericRecord[] = [];
        for(let i = 0 ; i < eList.length; i++){
            let condition:GenericCondition = eList[i];
            let resultRecord:GenericRecord = await condition.evaluate(user, event);
            conditionEvaluationResultList.push(resultRecord);

            // if we want to speed thing up by enforcing validity to be true
            console.log(`${this.name}.evaluate(${condition.getName()}): validity: ${resultRecord['record']['validity']}`);
            if(!resultRecord['record']['validity']){
                // stop as soon as we find one condition to be invalid
                // (meaning, the triiger was not even worth of considering)
                console.log(`${this.name}.evaluate: ${condition.getName()}.validity == false, skipping the rest of the conditions.`);
                break;
            }
        }

        let result = true;

        let valueList = conditionEvaluationResultList.map((record) => {
            return record['record']['value'];
        });

        console.log(`valueList: ${valueList}`);

        result = GeneralUtility.reduceBooleanArray(valueList, "and");

        // validity: most likely use "and", but people can customize
        let validity = true;

        let validityList = conditionEvaluationResultList.map((record) => {
            return record['record']['validity'];
        });

        console.log(`validityList: ${validityList}`);

        validity = GeneralUtility.reduceBooleanArray(validityList, "and");


        return new GenericRecord({value: result, validity: validity,  recordList: conditionEvaluationResultList}, event.providedTimestamp);
    }

    setMetaObject(metaObject:{evaluableList: GenericCondition[]}){
        this.#metaObject = metaObject;
    }


    /*
    static compose(user:User, curTime:Date, metaObject:{evaluableList: GenericEvaluable[]}): GenericArbiter{
        return new GenericArbiter();
    }
    */

}
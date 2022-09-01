
import { User } from '../models/user.model';
import { GenericRecord } from '../models/genericrecord.model';
import { ITriggerCondition } from '../models/triggercondition.interface';
import GeneralUtility from '../utilities/generalutilities';
import { GenericCondition } from '../models/genericcondition.model';


// implements ITriggerCondition
/*
function staticImplements<T>() {
    return <U extends T>(constructor: U) => {constructor};
}
@staticImplements<ITriggerConditionStatic>()
*/

export default class FixedTimeTriggerCondition extends GenericCondition {

    name: string = "FixedTimeTriggerCondition";
    targetTimeString: string = "12:04 PM";

    constructor(targetTimeString) {
        super();
        this.targetTimeString = targetTimeString;
    }

    async evaluate(user: User, curTime: Date): Promise<GenericRecord> {
        console.log(`[Condition]`, this.getName(), `targetTimeString`, this.targetTimeString);

        // assuming this is the user timezone
        // next step: retrieving it from the user state?
        let userTimezoneString = "America/New_York";
        let targetTime = GeneralUtility.initializeDateWithHourMinuteString(this.targetTimeString, userTimezoneString);
        let result = GeneralUtility.areDatesMatchedUpByGranularity(curTime, targetTime, "minute");

        return this.generateRecord({value: result, targetTimeString: this.targetTimeString}, curTime);
    }

    static fromSpec(spec: Object): GenericCondition {
     
     let newTCondition = new FixedTimeTriggerCondition(spec["targetTimeString"]);
     
     return newTCondition;

    }

}
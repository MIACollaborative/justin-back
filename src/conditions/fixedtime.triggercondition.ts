
import { User } from '../models/user.model';
import { GenericRecord } from '../models/genericrecord.model';
import GeneralUtility from '../utilities/generalutilities';
import { GenericCondition } from '../models/genericcondition.model';
import { GenericEvent } from '../models/genericevent.model';


// implements ITriggerCondition
/*
function staticImplements<T>() {
    return <U extends T>(constructor: U) => {constructor};
}
@staticImplements<ITriggerConditionStatic>()
*/

export default class FixedTimeTriggerCondition extends GenericCondition {

    name: string = "FixedTimeTriggerCondition";
    
    #targetTimeString: string = "12:04 PM";

    constructor(targetTimeString: string, forValidity: boolean) {
        super();
        this.#targetTimeString = targetTimeString;
        this.forValidity = forValidity;
    }

    async evaluate(user: User, event:GenericEvent): Promise<GenericRecord> {
        console.log(`[Condition]`, this.getName(), `targetTimeString`, this.#targetTimeString);
        let curTime = event.providedTimestamp;

        // assuming this is the user timezone
        // next step: retrieving it from the user state?
        let userTimezoneString = "America/New_York";
        let targetTime = GeneralUtility.initializeDateWithHourMinuteString(this.#targetTimeString, userTimezoneString);
        let result = GeneralUtility.areDatesMatchedUpByGranularity(curTime, targetTime, "minute");

        return this.generateRecord({value: result, targetTimeString: this.#targetTimeString}, curTime);
    }

    static fromSpec(spec: {targetTimeString: string, forValidity: boolean}): GenericCondition {
     
     let newTCondition = new FixedTimeTriggerCondition(spec["targetTimeString"], spec["forValidity"]);
     
     return newTCondition;

    }

}
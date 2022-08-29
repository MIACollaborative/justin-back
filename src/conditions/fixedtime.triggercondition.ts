
import { DecisionRecord } from '../models/decisionrecord.model';
import { User } from '../models/user.model';
import { ITrigger } from '../models/trigger.interface';
import { writeLogMessage } from '../actions/logwriter.action';
import { MessageTimePrefs } from '../dataModels/prefs/messageTimePrefs.model';
import { selectMessage } from '../actions/selectmessage.action';
import GeneralUtility from '../utilities/generalutilities';

import { createDesktopNotification } from '../actions/desktopnotification.action';
import { TriggerRecord } from '../models/triggerrecord.model';
import { GenericRecord } from '../models/genericrecord.model';
import { ITriggerCondition, ITriggerConditionStatic } from '../models/triggercondition.interface';

// implements ITriggerCondition

/*
function staticImplements<T>() {
    return <U extends T>(constructor: U) => {constructor};
}
@staticImplements<ITriggerConditionStatic>()
*/

export default class FixedTimeTriggerCondition implements ITriggerCondition {

    name: string = "FixedTimeTriggerCondition";
    targetTimeString: string = "12:04 PM";

    constructor(targetTimeString) {
        this.targetTimeString = targetTimeString;
    }

    getName(): string {
        return this.name;
    }

    check(user: User, curTime: Date): GenericRecord {
        console.log(`[Condition]`, this.getName(), `targetTimeString`, this.targetTimeString);

        // assuming this is the user timezone
        // next step: retrieving it from the user state?
        let userTimezoneString = "America/New_York";
        let targetTime = GeneralUtility.initializeDateWithHourMinuteString(this.targetTimeString, userTimezoneString);
        let result = GeneralUtility.areDatesMatchedUpByGranularity(curTime, targetTime, "minute");

        return this.generateRecord({value: result}, curTime);
    }

    generateRecord( recordObj:Object, curTime: Date):GenericRecord{
        return new GenericRecord(recordObj, curTime);
    }

    static fromSpec(spec: Object): ITriggerCondition {
     
     let newTCondition = new FixedTimeTriggerCondition(spec["targetTimeString"]);
     
     return newTCondition;

    }

}
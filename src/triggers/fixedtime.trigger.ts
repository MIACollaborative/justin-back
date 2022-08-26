
import { DecisionRecord } from '../models/decisionrecord.model';
import { User } from '../models/user.model';
import { ITrigger } from '../models/trigger.interface';
import { writeLogMessage } from '../actions/logwriter.action';
import { MessageTimePrefs } from '../dataModels/prefs/messageTimePrefs.model';
import { selectMessage } from '../actions/selectmessage.action';
import GeneralUtility from '../utilities/generalutilities';

export default class FixedTimePrefTrigger implements ITrigger {

    name: string = "FixedTimePrefTrigger";

    getName(): string {
        return this.name;
    }

    shouldRun(user: User, curTime: Date): boolean {

        let targetTimeString = "04:33 PM";

        // assuming this is the user timezone
        let userTimezoneString = "America/New_York";
        let targetTime = GeneralUtility.initializeDateWithHourMinuteString(targetTimeString, userTimezoneString);

        // see if I need to sync the rest

        let result = GeneralUtility.areDatesMatchedUpByGranularity(curTime, targetTime, "minute");

        return result;
    }

    getProbability(user: User, curTime: Date): number {
        return 1.0;
    }

    doAction(user: User, curTime: Date): DecisionRecord {
        let message: string = selectMessage(user, curTime).text;
        writeLogMessage(message).then(() => {
            // not sure what to do here.
            // the action should log it's own errors, not the trigger.
            // the trigger is "fire and forget" perhaps.
        }); 
        console.log('did action, message:', message);
        return new DecisionRecord(user, this.name, { message: message }, curTime);
    }

}
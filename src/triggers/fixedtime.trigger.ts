
import { DecisionRecord } from '../models/decisionrecord.model';
import { User } from '../models/user.model';
import { ITrigger } from '../models/trigger.interface';
import { writeLogMessage } from '../actions/logwriter.action';
import { MessageTimePrefs } from '../dataModels/prefs/messageTimePrefs.model';
import { selectMessage } from '../actions/selectmessage.action';
import GeneralUtility from '../utilities/generalutilities';

import { createDesktopNotification } from '../actions/desktopnotification.action';

export default class FixedTimePrefTrigger implements ITrigger {

    name: string = "FixedTimePrefTrigger";
    targetTimeString: string = "05:08 PM";

    getName(): string {
        return this.name;
    }

    shouldRun(user: User, curTime: Date): boolean {


        // assuming this is the user timezone
        let userTimezoneString = "America/New_York";
        let targetTime = GeneralUtility.initializeDateWithHourMinuteString(this.targetTimeString, userTimezoneString);

        // see if I need to sync the rest

        let result = GeneralUtility.areDatesMatchedUpByGranularity(curTime, targetTime, "minute");

        return result;
    }

    getProbability(user: User, curTime: Date): number {
        return 1.0;
    }

    doAction(user: User, curTime: Date): DecisionRecord {
        let message: string = selectMessage(user, curTime).text;

        createDesktopNotification(`[${this.getName()}]`, `Hi ${user.getName()}, it's time: ${this.targetTimeString}.`);

        writeLogMessage(message).then(() => {
            // not sure what to do here.
            // the action should log it's own errors, not the trigger.
            // the trigger is "fire and forget" perhaps.
        }); 
        console.log('did action, message:', message);
        return new DecisionRecord(user, this.name, { message: message }, curTime);
    }

}
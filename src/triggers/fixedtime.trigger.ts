
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
import FixedTimeTriggerCondition from '../conditions/fixedtime.triggercondition';
import { NoActionDecisionRecord } from '../models/noaction.decisionrecord';

export default class FixedTimePrefTrigger implements ITrigger {

    name: string = "FixedTimePrefTrigger";
    //targetTimeString: string = "12:12 PM";

    getName(): string {
        return this.name;
    }

    async execute(user: User, curTime: Date): Promise<TriggerRecord>{
        console.log('[Trigger] ', this.getName(), '.execute()', curTime);

        let shouldRunResultRecord = this.shouldRun(user, curTime);

        console.log('[Trigger] ', this.getName(), '.shouldRun()', JSON.stringify(shouldRunResultRecord.record));

        if (!shouldRunResultRecord["record"]["value"]){
            return this.generateRecord(user, curTime, shouldRunResultRecord);
        }

        let diceRoll = Math.random();
        console.log('dice role:', diceRoll);
        let probability = this.getProbability(user, curTime);

        let probabilityRecord = new GenericRecord({value: diceRoll, probability: probability}, curTime);

        let actionRecord;

        if (diceRoll < probability) {
            actionRecord = await this.doAction(user, curTime);
        } else {
            actionRecord = new NoActionDecisionRecord(user, this.getName(), curTime);
            console.log('no action, record:', actionRecord);
        }


        return this.generateRecord(user, curTime, shouldRunResultRecord, probabilityRecord, actionRecord);

    }

    generateRecord(user: User, curTime: Date, shouldRunRecord:GenericRecord, probabilityRecord?:GenericRecord, actionRecord?:GenericRecord):TriggerRecord{
        let recordObj = {
            shouldRunRecord: shouldRunRecord,
            probability: probabilityRecord,
            actionReord: actionRecord
        };
        return new TriggerRecord(user, this.getName(), recordObj, curTime);
    }

    shouldRun(user: User, curTime: Date):GenericRecord {

        // use TriggerCondition

        let tCondition = FixedTimeTriggerCondition.fromSpec({targetTimeString: "12:12 PM"});
        let resultRecord = tCondition.check(user, curTime);

        return resultRecord;

        // Without Condition
        /*
        // assuming this is the user timezone
        
        let userTimezoneString = "America/New_York";
        let targetTime = GeneralUtility.initializeDateWithHourMinuteString(this.targetTimeString, userTimezoneString);

        // see if I need to sync the rest

        let result = GeneralUtility.areDatesMatchedUpByGranularity(curTime, targetTime, "minute");
        return result;
        */
    }

    getProbability(user: User, curTime: Date): number {
        return 1.0;
    }

    async doAction(user: User, curTime: Date): Promise<GenericRecord> {
        console.log('[Trigger] ', this.getName(), '.doAction()');

        let message: string = selectMessage(user, curTime).text;

        let actionResult = await createDesktopNotification(`[${this.getName()}]`, `Hi ${user.getName()}.`);

        writeLogMessage(message).then(() => {
            // not sure what to do here.
            // the action should log it's own errors, not the trigger.
            // the trigger is "fire and forget" perhaps.
        }); 
        console.log('did action, message:', message);

        return new GenericRecord({ message: message, result: actionResult }, curTime);
    }

}
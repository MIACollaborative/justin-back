
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


    // private members
    #shouldRunRecord: GenericRecord;
    #probabilityRecord: GenericRecord;
    #actionRecord: GenericRecord;


    getName(): string {
        return this.name;
    }

    async execute(user: User, curTime: Date): Promise<TriggerRecord>{
        console.log('[Trigger] ', this.getName(), '.execute()', curTime);

        this.#shouldRunRecord = await this.shouldRun(user, curTime);

        console.log('[Trigger] ', this.getName(), '.shouldRun()', JSON.stringify(this.#shouldRunRecord.record));

        if (!this.#shouldRunRecord["record"]["value"]){
            return this.generateRecord(user, curTime, this.#shouldRunRecord);
        }

        let diceRoll = Math.random();
        console.log('dice role:', diceRoll);
        let probability = await this.getProbability(user, curTime)["record"]["value"];

        this.#probabilityRecord = new GenericRecord({value: diceRoll, probability: probability}, curTime);

        

        if (diceRoll < probability) {
            this.#actionRecord = await this.doAction(user, curTime);
        } else {
            this.#actionRecord = new NoActionDecisionRecord(user, this.getName(), curTime);
            console.log('no action, record:', this.#actionRecord);
        }

        return this.generateRecord(user, curTime, this.#shouldRunRecord, this.#probabilityRecord, this.#actionRecord);

    }

    

    async shouldRun(user: User, curTime: Date): Promise<GenericRecord> {

        // use TriggerCondition
        let tCondition = FixedTimeTriggerCondition.fromSpec({targetTimeString: "12:12 PM"});
        let resultRecord = await tCondition.check(user, curTime);

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

    getProbability(user: User, curTime: Date): Promise<GenericRecord> {
        return new GenericRecord({ value: 1.0 }, curTime);
    }

    async doAction(user: User, curTime: Date): Promise<GenericRecord> {
        console.log('[Trigger] ', this.getName(), '.doAction()');

        //let message: string = selectMessage(user, curTime).text;

        let message: string = `Hi ${user.getName()}. It's ${this.#shouldRunRecord["record"]["targetTimeString"]}`;

        let actionResult = await createDesktopNotification(`[${this.getName()}]`, message);

        writeLogMessage(message).then(() => {
            // not sure what to do here.
            // the action should log it's own errors, not the trigger.
            // the trigger is "fire and forget" perhaps.
        }); 
        console.log('did action, message:', message);

        return new GenericRecord({ message: message, result: actionResult }, curTime);
    }

    generateRecord(user: User, curTime: Date, shouldRunRecord:GenericRecord, probabilityRecord?:GenericRecord, actionRecord?:GenericRecord):TriggerRecord{
        let recordObj = {
            shouldRunRecord: shouldRunRecord,
            probability: probabilityRecord,
            actionReord: actionRecord
        };
        return new TriggerRecord(user, this.getName(), recordObj, curTime);
    }

}
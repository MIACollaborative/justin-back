
import { User } from '../models/user.model';
import { ITrigger } from '../models/trigger.interface';
import { writeLogMessage } from '../actions/logwriter.action';
import { TriggerRecord } from '../models/triggerrecord.model';
import { GenericRecord } from '../models/genericrecord.model';
import FixedTimeTriggerCondition from '../conditions/fixedtime.triggercondition';
import { NoActionDecisionRecord } from '../models/noaction.decisionrecord';
import DesktopNotificationAction from '../actions/desktopnotification.action';
import DaysInAWeekTriggerCondition from '../conditions/daysinweek.triggercondition';
import GeneralUtility from '../utilities/generalutilities';
import { GenericCondition } from '../models/genericcondition.model';
import { AllConditionArbiter } from '../arbiters/allcondition.arbiter';

export default class DaysInWeekFixedTimeTrigger implements ITrigger {

    name: string = "DaysInWeekFixedTimeTrigger";
    
    // private members
    #shouldRunRecord: GenericRecord;
    #probabilityRecord: GenericRecord;
    #actionRecord: GenericRecord;


    getName(): string {
        return this.name;
    }

    async shouldRun(user: User, curTime: Date): Promise<GenericRecord> {
        let conditionList:GenericCondition[] = [];

        conditionList.push(DaysInAWeekTriggerCondition.fromSpec({daysInWeekIndexList: [2,4]}));
        conditionList.push(FixedTimeTriggerCondition.fromSpec({targetTimeString: "12:12 PM"}));
        
        return await new AllConditionArbiter().evaluate(user, curTime, {evaluableList: conditionList});


        // version 1: one by one
        /*
        // use TriggerCondition
        let tCondition1 =  DaysInAWeekTriggerCondition.fromSpec({daysInWeekIndexList: [2,4]});
        let resultRecord1 = await tCondition1.evaluate(user, curTime);

        // use TriggerCondition
        let tCondition2 = FixedTimeTriggerCondition.fromSpec({targetTimeString: "12:13 PM"});
        let resultRecord2 = await tCondition2.evaluate(user, curTime);

        // so the problem is, how to make it easier to compose the results of a series of GenericCondition
        let conditionEvaluationResultList:GenericRecord[] = [];
        conditionEvaluationResultList.push(resultRecord1);
        conditionEvaluationResultList.push(resultRecord2);


        let result = true;
        // now, check conditionRelationship to see if it is and/or (all or one)

        let valueList = conditionEvaluationResultList.map((record) => {
            return record['record']['value'];
        });

        console.log(`valueList: ${valueList}`);

        result = GeneralUtility.reduceBooleanArray(valueList, "and");

        return new GenericRecord({value: result, recordList: conditionEvaluationResultList}, curTime);
        */

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

    async getProbability(user: User, curTime: Date): Promise<GenericRecord> {
        return new GenericRecord({ value: 1.0 }, curTime);
    }

    async doAction(user: User, curTime: Date): Promise<GenericRecord> {
        console.log('[Trigger] ', this.getName(), '.doAction()'); 

        
        let title = `[${this.getName()}]`;
        let message: string = `Hi ${user.getName()}.`;
        
        let aAction = new DesktopNotificationAction({
            title: title,
            message: message
        });

        //let message: string = selectMessage(user, curTime).text;
        //let actionResult = await createDesktopNotification(`[${this.getName()}]`, message);

        let actionResultRecord = await aAction.evaluate(user, curTime);

        writeLogMessage(message).then(() => {
            // not sure what to do here.
            // the action should log it's own errors, not the trigger.
            // the trigger is "fire and forget" perhaps.
        }); 
        console.log('did action, message:', message);

        return actionResultRecord;
    }

    async execute(user: User, curTime: Date): Promise<TriggerRecord>{
        console.log('[Trigger] ', this.getName(), '.execute()', curTime);

        this.#shouldRunRecord = await this.shouldRun(user, curTime);

        console.log('[Trigger] ', this.getName(), '.shouldRun()', JSON.stringify(this.#shouldRunRecord.record, null, 2));

        if (!this.#shouldRunRecord["record"]["value"]){
            return this.generateRecord(user, curTime, this.#shouldRunRecord);
        }

        let diceRoll = Math.random();
        console.log('dice role:', diceRoll);

        let probabilityGot = await this.getProbability(user, curTime);

        console.log('probabilityGot:', JSON.stringify(probabilityGot, null, 2));

        let probability = probabilityGot["record"]["value"];

        this.#probabilityRecord = new GenericRecord({value: diceRoll, probability: probability}, curTime);

        if (diceRoll < probability) {
            this.#actionRecord = await this.doAction(user, curTime);
        } else {
            this.#actionRecord = new NoActionDecisionRecord(user, this.getName(), curTime);
            console.log('no action, record:', this.#actionRecord);
        }

        return this.generateRecord(user, curTime, this.#shouldRunRecord, this.#probabilityRecord, this.#actionRecord);

    }
    generateRecord(user: User, curTime: Date, shouldRunRecord:GenericRecord, probabilityRecord?:GenericRecord, actionRecord?:GenericRecord):TriggerRecord{
        let recordObj = {
            shouldRunRecord: shouldRunRecord,
            probabilityRecord: probabilityRecord,
            actionReord: actionRecord
        };
        return new TriggerRecord(user, this.getName(), recordObj, curTime);
    }

}
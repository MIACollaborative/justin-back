
import { User } from '../models/user.model';
import { ITrigger } from '../models/trigger.interface';
import { writeLogMessage } from '../actions/logwriter.action';
import { TriggerRecord } from '../models/triggerrecord.model';
import { GenericRecord } from '../models/genericrecord.model';
import FixedTimeTriggerCondition from '../conditions/fixedtime.triggercondition';
import { NoActionDecisionRecord } from '../models/noaction.decisionrecord';
import DesktopNotificationAction from '../actions/desktopnotification.action';
import DaysInAWeekTriggerCondition from '../conditions/daysinweek.triggercondition';
import { GenericCondition } from '../models/genericcondition.model';
import { AllConditionArbiter } from '../arbiters/allcondition.arbiter';
import EventNameTriggerCondition from '../conditions/eventname.triggercondition';

export default class EventNameTrigger implements ITrigger {

    name: string = "EventNameTrigger";
    
    // private members
    #shouldRunRecord: GenericRecord;
    #probabilityRecord: GenericRecord;
    #actionRecord: GenericRecord;


    getName(): string {
        return this.name;
    }



    async shouldRun(user: User, curTime: Date, eventObj:Object): Promise<GenericRecord> {
         /*
        let filterList: Object[] =  [{ $match: { 
            "operationType": "insert",
            "fullDocument.name": "MyRandomEvent1" } 
        }];
        */

        // I am only interseted in those event that has the "name" as "MyRandomEvent1"

       

        // version 4: use arbiter directly
        let conditionList:GenericCondition[] = [];

        let tCondition = EventNameTriggerCondition.fromSpec({eventName: "MyRandomeEvent1", forValidity: true});

        conditionList.push(tCondition);
        
        return await new AllConditionArbiter().evaluate(user, curTime, {evaluableList: conditionList});
    }



    async getProbability(user: User, curTime: Date): Promise<GenericRecord> {
        return new GenericRecord({ value: 1.0 }, curTime);
    }

    async doAction(user: User, curTime: Date): Promise<GenericRecord> {
        console.log('[Trigger] ', this.getName(), '.doAction()'); 

        
        let title = `[${this.getName()}]`;
        let message: string = `Hi ${user.getName()}. This event [${this.#shouldRunRecord["record"]["eventName"]}] just happened!`;
        
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

    generateRecord(user: User, curTime: Date, shouldRunRecord:GenericRecord, probabilityRecord?:GenericRecord, actionRecord?:GenericRecord):TriggerRecord{
        let recordObj = {
            shouldRunRecord: shouldRunRecord,
            probabilityRecord: probabilityRecord,
            actionReord: actionRecord
        };
        return new TriggerRecord(user, this.getName(), recordObj, curTime);
    }

    
}
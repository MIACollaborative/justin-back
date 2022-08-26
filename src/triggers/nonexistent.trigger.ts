
import { DecisionRecord } from '../models/decisionrecord.model';
import { User } from '../models/user.model';
import { ITrigger } from '../models/trigger.interface';
import { writeLogMessage } from '../actions/logwriter.action';
import { MessageTimePrefs } from '../dataModels/prefs/messageTimePrefs.model';
import { selectMessage } from '../actions/selectmessage.action';
import GeneralUtility from '../utilities/generalutilities';

export default class NonExistentTrigger implements ITrigger {

    name: string = "NonExistentTrigger";

    getName(): string {
        return this.name;
    }

    shouldRun(user: User, curTime: Date): boolean {

        return false;
    }

    getProbability(user: User, curTime: Date): number {
        return 1.0;
    }

    doAction(user: User, curTime: Date): DecisionRecord {
        let message: string = selectMessage(user, curTime).text;
        console.log('did action, message:', message);
        return new DecisionRecord(user, this.name, { message: message }, curTime);
    }

}
import * as dotenv from 'dotenv';
import * as userService from './db/users.service';
import * as configService from './db/studyconfig.service';
import { NoActionDecisionRecord } from './models/noaction.decisionrecord';
import { User } from './models/user.model';
import { DecisionRecord } from './models/decisionrecord.model';
import { addDecisionRecord } from './db/decisionrecords.service';

dotenv.config();

// called by cron or by a test runner
export async function doTick(curTime: Date) { 
    let users = await userService.getAllUsers();
    let triggers = await configService.getTriggers();
    console.log(`triggers: ${triggers}`);
    let decisionRecord: DecisionRecord;
    console.log('doing tick at', curTime);
    for (let u of users) {
        u = u as User;
        for (let t of triggers) {
            console.log('running trigger', t, 'for user', u.getName());
            
            let shouldRunResult = t.shouldRun(u, curTime);
            console.log('[Trigger] ', t, '.shouldRun()', shouldRunResult);

            if (!shouldRunResult) continue; // next trigger

            let diceRoll = Math.random();
            console.log('dice role:', diceRoll);
            if (diceRoll < t.getProbability(u, curTime)) {
                decisionRecord = t.doAction(u, curTime);
            } else {
                decisionRecord = new NoActionDecisionRecord(u, t.getName(), curTime);
                console.log('no action, record:', decisionRecord);
            }
            addDecisionRecord(decisionRecord);
            console.log('ran trigger', t, 'for user', u.getName(), ':', decisionRecord);
        }
    }
}



/*
interface Person{
    name: string
}


interface Student extends Person{
    uniqname: string
}


class Student implements Person{
    name: string = ""
    uniqname: string = ""
}


let aStudent:Student = {
    name: "Peter",
    uniqname: "peter"
};

console.log(`aStudent: ${JSON.stringify(aStudent)}`);
*/
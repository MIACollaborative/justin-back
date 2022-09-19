import * as dotenv from 'dotenv';
import * as userService from './db/users.service';
import * as configService from './db/studyconfig.service';
import { NoActionDecisionRecord } from './models/noaction.decisionrecord';
import { User } from './models/user.model';
import { DecisionRecord } from './models/decisionrecord.model';
import { addDecisionRecord } from './db/decisionrecords.service';
import { addTriggerRecord } from './db/triggerrecords.service';
import { GenericRecord } from './models/genericrecord.model';
import { GenericEvent } from './models/genericevent.model';

dotenv.config();

// called by cron or by a test runner
export async function doTick(curTime: Date) { 
    let users = await userService.getAllUsers();
    
    //let triggers = await configService.getTriggers();

    let triggers = await (await configService.getTriggers()).filter((trigger) => {
        return trigger["type"] != undefined && trigger.type == "standard";
    });

    console.log(`triggers: ${triggers}`);
    console.log('doing tick at', curTime);

    let clockEvent = new  GenericEvent("clock", "system", curTime);

    for (let u of users) {
        u = u as User;
        for (let t of triggers) {
            // version 3: roll back to version 1
            let shouldRunRecord = await t.shouldDecide(u,clockEvent);

            console.log('[Trigger] ', t, '.shouldDecide()', shouldRunRecord);

            if (!shouldRunRecord["record"]["validity"]){
                // not valid, we don't even need a record
                console.log('ran trigger', t, 'for user', u.getName(), '-> should not decide');
                continue;    
            }
            else{
                console.log('ran trigger', t, 'for user', u.getName(), '-> should decide');
            }
            /*
            else if (!shouldRunRecord["record"]["value"]){
                // should not run, but want to leave a record
                let tempRecord = t.generateRecord(u, curTime, shouldRunRecord);
                addTriggerRecord(tempRecord);
                console.log('ran trigger', t, 'for user', u.getName(), '-> should not run: ', tempRecord);
                continue;
            }
            */

            let diceRoll = Math.random();
            console.log('dice role:', diceRoll);

            let probabilityGot = await t.decide(u, clockEvent);

            console.log('probabilityGot:', JSON.stringify(probabilityGot, null, 2));

            let probability = probabilityGot["record"]["value"];

            let probabilityRecord = new GenericRecord({value: diceRoll, probability: probability}, curTime);

            let actionRecord;

            if (diceRoll < probability) {
                actionRecord = await t.doAction(u, clockEvent);
            } else {
                actionRecord = new NoActionDecisionRecord(u, t.getName(), curTime);
                console.log('no action, record:', actionRecord);
            }

            // run and store a record
            let triggerRecord =  t.generateRecord(u, curTime, shouldRunRecord, probabilityRecord, actionRecord);
            addTriggerRecord(triggerRecord);

            console.log('ran trigger', t, 'for user', u.getName(), ':', triggerRecord);



            // version 2: use trigger.execute()
            /*
            console.log('running trigger', t.getName(), 'for user', u.getName());

            // version 2: moving the execution to the trigger....
            let tRecord = await t.execute(u, curTime);
            addTriggerRecord(tRecord);

            console.log('ran trigger', t.getName(), 'for user', u.getName(), ':', JSON.stringify(tRecord, null, 2));
            */
            
            // version 1, before 2022.08.28
            /*
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
            */
            
        }
    }
}

// called by cron or by a test runner
export async function doEvent(curTime: Date, event:GenericEvent) {
    console.log(`doEvent: ${JSON.stringify(event, null, 2)}, ${curTime}`);
    let users = await userService.getAllUsers();

    let triggers = await (await configService.getTriggers()).filter((trigger) => {
        return trigger["type"] != undefined && trigger.type == "event";
    });
    
    console.log(`triggers: ${triggers}`);
    console.log('doing tick at', curTime);

    for (let u of users) {
        u = u as User;
        for (let t of triggers) {
            // version 3: roll back to version 1
            let shouldRunRecord = await t.shouldDecide(u, event);

            console.log('[Trigger] ', t, '.shouldRun()', shouldRunRecord);

            if (!shouldRunRecord["record"]["validity"]){
                // not valid, we don't even need a record
                continue;    
            }
            else if (!shouldRunRecord["record"]["value"]){
                // should not run, but want to leave a record
                let tempRecord = t.generateRecord(u, curTime, shouldRunRecord);
                addTriggerRecord(tempRecord);
                console.log('ran trigger', t, 'for user', u.getName(), '-> should not run: ', tempRecord);
                continue;
            }

            let diceRoll = Math.random();
            console.log('dice role:', diceRoll);

            let probabilityGot = await t.decide(u, event);

            console.log('probabilityGot:', JSON.stringify(probabilityGot, null, 2));

            let probability = probabilityGot["record"]["value"];

            let probabilityRecord = new GenericRecord({value: diceRoll, probability: probability}, curTime);

            let actionRecord;

            if (diceRoll < probability) {
                actionRecord = await t.doAction(u, event);
            } else {
                actionRecord = new NoActionDecisionRecord(u, t.getName(), curTime);
                console.log('no action, record:', actionRecord);
            }

            // run and store a record
            let triggerRecord =  t.generateRecord(u, curTime, shouldRunRecord, probabilityRecord, actionRecord);
            addTriggerRecord(triggerRecord);

            console.log('ran trigger', t, 'for user', u.getName(), ':', triggerRecord);



            // version 2: use trigger.execute()
            /*
            console.log('running trigger', t.getName(), 'for user', u.getName());

            // version 2: moving the execution to the trigger....
            let tRecord = await t.execute(u, curTime);
            addTriggerRecord(tRecord);

            console.log('ran trigger', t.getName(), 'for user', u.getName(), ':', JSON.stringify(tRecord, null, 2));
            */
            
            // version 1, before 2022.08.28
            /*
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
            */
            
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
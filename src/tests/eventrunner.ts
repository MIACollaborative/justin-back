import { loadTestUsers } from "./loadusers.tests";
import { loadTestTriggers } from "./loadtriggers.tests";
import { doEvent } from "../main";
import * as dotenv from 'dotenv';
import { GenericEventSubscriber } from "../models/genericeventsubscriber.model";
import { GenericEvent } from "../models/genericevent.model";
import nodeCron from "node-cron";
import { DateTime } from "luxon";
import { ClockEvent } from "../models/clockevent.model";
import { addEvent, archiveEvent} from '../db/events.service';


dotenv.config();

let expressionLabelDict = {
    "1 minute": {
        label: 'every 1 minute',
        expression: '* * * * *'
    },
    "10 seconds": {
        label: 'every 10 seconds',
        expression: '*/10 * * * * *'
    }

};

let theExpression = expressionLabelDict["10 seconds"];

nodeCron.schedule(theExpression.expression, async () => {
    let cronTime = process.hrtime();
    console.log(`execute cron clock event generation task ${theExpression.label} at ${cronTime}`);
    let t1 = process.hrtime();

    let now = DateTime.now();
    let cEvent = new ClockEvent("clock", "system-user", now.toJSDate());

    console.log(`Clock event: ${JSON.stringify(cEvent)}`);

    addEvent(cEvent);

    let t2 = process.hrtime();
    console.log('Generate clock event in', (t2[1] - t1[1]) / 1000000, 'ms');
});

async function doTests() {
    console.log('running tests through event');

    await loadTestUsers();
    await loadTestTriggers();

    let filterList: Object[] =  [{ $match: { 
        "operationType": "insert",
        //"fullDocument.name": "MyRandomEvent1" 
    } 
    }];

    let eventSubscriber = new GenericEventSubscriber("justin", "events", filterList);

    async function myEventHandler(event:{fullDocument:GenericEvent}){
        //console.log(`Got an event: ${event}`);
        let cronTime = process.hrtime();


        let t1 = process.hrtime();
        //await doTick(new Date(2022, 7, 26, 17, 1, 0));
        //await doTick(new Date());

        await doEvent(new Date(), event.fullDocument);

        // now, mark the event as done
        let archiveResult = await archiveEvent(event.fullDocument, {status: "processed"});

        console.log(`archiveResult: ${JSON.stringify(archiveResult)}`);

        let t2 = process.hrtime();
        console.log('did tick in', (t2[1] - t1[1]) / 1000000, 'ms');
    }

    async function mySubscribe(){
        eventSubscriber.addListener(myEventHandler);
        return await eventSubscriber.subscribe();
    }

    mySubscribe();

}

doTests();

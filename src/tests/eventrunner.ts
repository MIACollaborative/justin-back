import { loadTestUsers } from "./loadusers.tests";
import { loadTestTriggers } from "./loadtriggers.tests";
import { doEvent } from "../main";
import * as dotenv from 'dotenv';
import { GenericEventSubscriber } from "../models/genericeventsubscriber.model";
import { GenericEvent } from "../models/genericevent.model";


dotenv.config();

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
        console.log(`process event ${event} at ${cronTime}`);


        let t1 = process.hrtime();
        //await doTick(new Date(2022, 7, 26, 17, 1, 0));
        //await doTick(new Date());

        await doEvent(new Date(), event.fullDocument);
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

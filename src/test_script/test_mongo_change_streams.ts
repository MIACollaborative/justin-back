import * as dotenv from 'dotenv';
import { addEvent } from '../db/events.service';
import { GenericEventSubscriber } from "../models/genericeventsubscriber.model";

dotenv.config();


let eventSubscriber = new GenericEventSubscriber("justin", "events", []);

function myEventHandler(event:Object){
    console.log(`Got an event: ${event}`);
}

async function mySubscribe(){
    eventSubscriber.addListener(myEventHandler);
    return await eventSubscriber.subscribe();
}

mySubscribe();

function myAddEvent(): void{
    console.log(`myAddEvent`);
    addEvent({
        name: "MyRandomEvent",
        timestamp: new Date()
    });
}

let myVar = setInterval(myAddEvent, 1000);
//clearTimeout(myVar);





import { User } from '../models/user.model';
import { GenericRecord } from '../models/genericrecord.model';
import { ITriggerCondition } from '../models/triggercondition.interface';
import GeneralUtility from '../utilities/generalutilities';
import { DateTime } from 'luxon';

export default class DaysInAWeekTriggerCondition implements ITriggerCondition {

    name: string = "DaysInAWeekTriggerCondition";

    #daysInWeekIndexList: number[];

    constructor(daysInWeekIndexList: number[]) {
        this.#daysInWeekIndexList = daysInWeekIndexList;
    }

    getName(): string {
        return this.name;
    }

    async check(user: User | null, curTime: Date): Promise<GenericRecord> {
        console.log(`[Condition]`, this.getName(), `daysInWeekIndexList`, this.#daysInWeekIndexList);

        let result = false;
        let weekIndex = -1;

        if(user != null){
            // assuming this is the user timezone
            // next step: retrieving it from the user state?
            let userTimezoneString = "America/New_York";
            let localTimeForUser = GeneralUtility.getLocalTime(curTime, userTimezoneString);

            weekIndex = localTimeForUser.weekday;
        }
        else {
            weekIndex = DateTime.fromJSDate(curTime).weekday;
        }

        console.log(`[Condition]`, this.getName(), `weekIndex`, weekIndex);
        

        result =  this.#daysInWeekIndexList.includes(weekIndex);

        return this.generateRecord({value: result, daysInWeekIndexList: this.#daysInWeekIndexList}, curTime);
    }

    generateRecord( recordObj:Object, curTime: Date):GenericRecord{
        return new GenericRecord(recordObj, curTime);
    }

    static fromSpec(spec: {daysInWeekIndexList: number[]}): ITriggerCondition {
     
     let newTCondition = new DaysInAWeekTriggerCondition(spec["daysInWeekIndexList"] as number[]);
     
     return newTCondition;

    }

}
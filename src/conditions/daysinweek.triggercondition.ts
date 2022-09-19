
import { User } from '../models/user.model';
import { GenericRecord } from '../models/genericrecord.model';
import GeneralUtility from '../utilities/generalutilities';
import { DateTime } from 'luxon';
import { GenericCondition } from '../models/genericcondition.model';
import { GenericEvent } from '../models/genericevent.model';

export default class DaysInAWeekTriggerCondition extends GenericCondition {

    name: string = "DaysInAWeekTriggerCondition";

    #daysInWeekIndexList: number[];


    constructor(daysInWeekIndexList: number[], forValidity: boolean = false) {
        super();
        this.#daysInWeekIndexList = daysInWeekIndexList;
        this.forValidity = forValidity;
    }

    async evaluate(user: User | null, event:GenericEvent): Promise<GenericRecord> {
        let curTime = event.providedTimestamp;
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

    static fromSpec(spec: {daysInWeekIndexList: number[], forValidity: boolean}): GenericCondition {
     
     let newTCondition = new DaysInAWeekTriggerCondition(spec["daysInWeekIndexList"], spec["forValidity"]);
     
     return newTCondition;

    }

}
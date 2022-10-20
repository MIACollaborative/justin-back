
import { User } from '../models/user.model';
import { GenericRecord } from '../models/genericrecord.model';
import GeneralUtility from '../utilities/generalutilities';
import { DateTime } from 'luxon';
import { GenericCondition } from '../models/genericcondition.model';
import { GenericEvent } from '../models/genericevent.model';
import { GenericEventCondition } from '../models/genericeventcondition.model';
import { UserResponseEvent } from '../events/userresponseevent.model';

export default class ResponseTypeAndIdTriggerCondition extends GenericEventCondition {

    name: string = "ResponseTypeAndIdTriggerCondition";
    eventName: string = "user-response";

    #responseType: string;
    #responseId: string;

    constructor(responseType: string, responseId: string, forValidity: boolean = false) {
        super();
        this.#responseType = responseType;
        this.#responseId = responseId;
        this.forValidity = forValidity;
    }

    async evaluate(user: User | null, event:GenericEvent): Promise<GenericRecord> {
        let curTime = event.providedTimestamp;
        console.log(`[Condition]`, this.getName(), `responseType`, this.#responseType , `responseId`, this.#responseId);

        let result = false;
        let weekIndex = -1;

        let theEvent = event as UserResponseEvent;
        console.log(`[Condition]`, this.getName(), `responseType`, theEvent.responseType, `responseId`, theEvent.responseId);
        

        result = theEvent.responseType == this.#responseType && theEvent.responseId == this.#responseId;

        return this.generateRecord({value: result, responseType: this.#responseType, responseId: this.#responseId}, curTime);
    }

    static fromSpec(spec: {responseType: string, responseId: string, forValidity: boolean}): GenericCondition {
     
     let newTCondition = new ResponseTypeAndIdTriggerCondition(spec["responseType"], spec["responseId"], spec["forValidity"]);
     
     return newTCondition;

    }

}
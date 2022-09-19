import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";
import { GenericEvent } from "./genericevent.model";

export class GenericEvaluable {
    name:string;

    async evaluate(user: User | null, metaObject:{event:{curTime:Date}}):Promise<GenericRecord>{
        return await this.generateRecord({}, metaObject.event.curTime);
    }

    getName():string{
        return this.name;
    }

    generateRecord( recordObj:Object, curTime: Date):GenericRecord{
        return new GenericRecord(recordObj, curTime);
    }
}
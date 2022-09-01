import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

export class GenericEvaluable {
    name:string;

    async evaluate(user: User | null, curTime:Date, metaObject?:Object):Promise<GenericRecord>{
        return await this.generateRecord({}, curTime);
    }

    getName():string{
        return this.name;
    }

    generateRecord( recordObj:Object, curTime: Date):GenericRecord{
        return new GenericRecord(recordObj, curTime);
    }
}
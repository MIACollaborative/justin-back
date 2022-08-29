
import { User } from './user.model';
import { GenericRecord } from './genericrecord.model';

export interface IAction {
    name: string;
    
    // public, expected to be called
    execute(user: User, curTime: Date, metaObj:Object):Promise<GenericRecord>;
    getName(): string;

    // dont' require it for now
    //fromSpec(spec:Object):IAction;
    
}
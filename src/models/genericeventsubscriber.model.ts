import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";
import { getEventCollection } from "../db/events.service";

export class GenericEventSubscriber {
    name:string = "GenericEventSubscriber";

    #dbName: string;
    #collectionName: string;
    #filterList: Object[];

    #listenerList: Function[] = [];

    // incomplete
    constructor(dbName: string, collectionName: string, filterList: Object[]) {
        this.#dbName = dbName;
        this.#collectionName = collectionName;
        this.#filterList = filterList;
    }

    async subscribe():Promise<Object>{
        
        const collection = await getEventCollection();
        
        const changeStream = collection.watch();

        changeStream.on('change', (nextDoc) => {
            // now call each listener
            this.#listenerList.forEach((oneListener)=> {
                oneListener(nextDoc);
            });
        });

        return Promise.resolve(true);
    }

    addListener(listener: Function): void{
        this.#listenerList.push(listener);
    }

    removeListener(oneListener: Function): void{
        this.#listenerList = this.#listenerList.filter((listener) =>{
            return listener.name != oneListener.name;
        });
    }

    /*
    async evaluate(user: User | null, curTime:Date, metaObject?:Object):Promise<GenericRecord>{
        return await this.generateRecord({}, curTime);
    }
    */

    getName():string{
        return this.name;
    }

    /*
    generateRecord( recordObj:Object, curTime: Date):GenericRecord{
        return new GenericRecord(recordObj, curTime);
    }
    */
}
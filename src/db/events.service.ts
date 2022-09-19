import { Collection, ObjectId } from 'mongodb';
import { getDB } from './database.service';
import { User } from '../models/user.model';
import { TriggerRecord } from '../models/triggerrecord.model';

let drCollection: Collection;

export async function getEventCollection() {
    if (!drCollection) {
        const db = await getDB();
        drCollection = db.collection(process.env.EVENT_COLLECTION_NAME!);
    }
    return drCollection;
}

export async function addEvent(record: Object) {
    let uColl = await getEventCollection();
    await uColl.insertOne(record);
}
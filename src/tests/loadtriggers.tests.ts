import { User } from "../models/user.model";
import { clearTriggers, addTrigger } from '../db/studyconfig.service';

const testTriggers = [
    'nonexistent.trigger', 'usertimepref.trigger'
]

export async function loadTestTriggers() {
    await clearTriggers();

    for (let tt of testTriggers) {
        await addTrigger(tt);
    }
}
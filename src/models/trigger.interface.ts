
import { User } from './user.model';
import { DecisionRecord } from './decisionrecord.model';

export interface ITrigger {
    name: string;
    getName(): string;
    shouldRun(user: User, curTime: Date): boolean; 
    getProbability(user: User, curTime: Date): number;
    doAction(user: User, curTime: Date): DecisionRecord;
}
import { ObjectId } from 'mongodb';
import { isNull } from 'util';

export class User {
    private username: string;
    private email: string;
    private name: string;
    private id: string;
    private token: string;
    private studyParams: Object | undefined;
    private prefs: Object | undefined;
    private state: Object | undefined;

    constructor(
        username: string,
        name: string,
        email: string, 
        id: string, 
        token: string, 
        params?: Object,
        prefs?: Object,
        state?: Object) {
            this.username = username;
            this.name = name;
            this.email = email;
            this.studyParams = params;
            this.id = id;
            this.token = token;
            this.prefs = prefs;
            this.state = state;
    }

    public static fromMongoDoc(mongoDoc: Object | null) {
        
        if (mongoDoc === null) return null;

        let id = mongoDoc['_id'].toString();
        return new User(
            mongoDoc['username'], 
            mongoDoc['name'], 
            mongoDoc['email'], 
            id, 
            mongoDoc['token'],
            mongoDoc['studyParams'],
            mongoDoc['prefs'], 
            mongoDoc['state']);

    }

    public getUsername() {
        return this.username;
    }

    public getName() {
        return this.name;
    }

    public getId(): string {
        return this.id;
    }

    public getEmail(): string {
        return this.email;
    }

    public getToken() {
        return this.token;
    }

    public getStudyParams(): Object | undefined {
        return this.studyParams;
    }

    public getPrefs(key: string = ''): Object | undefined { 
        if (this.prefs) {
            if (key && key !== '') {
                return this.prefs[key];
            } else {
                return this.prefs;
            }
        } else {
            return undefined;
        }
    }

    public getState(): Object | undefined {
        return this.state;
    }
}

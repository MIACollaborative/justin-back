import notifier from "node-notifier";
import { IAction } from "../models/action.interface";
import { GenericRecord } from "../models/genericrecord.model";
import { User } from "../models/user.model";

export default class DesktopNotificationAction implements IAction {

  name: string = "DesktopNotificationAction";

  #title:string;
  #message:string;

  constructor(metaObj: {title:string, message:string}) {
    this.#title = metaObj["title"];
    this.#message = metaObj["message"];
  }

  getName(): string {
      return this.name;
  }

  async execute(user: User, curTime: Date): Promise<GenericRecord> {
      console.log(`[Condition]`, this.getName(), `curTime`, curTime);

      let result = await notifier.notify(
        {
          title: this.#title,
          message: this.#message,
          //icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
          sound: false, // Only Notification Center or Windows Toasters
          wait: true // Wait with callback, until user action is taken against notification
        },
        (err, response, metadata) => {
          // Response is response from notification
          return {err, response, metadata};
        }
      );


      return this.generateRecord({value: result, metaObj:{title: this.#title, message: this.#message}}, curTime);
  }

  generateRecord( recordObj:Object, curTime: Date):GenericRecord{
      return new GenericRecord(recordObj, curTime);
  }

  /*
  static fromSpec(spec: Object): ITriggerCondition {
   
   let newTCondition = new FixedTimeTriggerCondition(spec["targetTimeString"]);
   
   return newTCondition;

  }
  */

}

/*
export async function createDesktopNotification(title:string, message:string) {
    console.log(`createDesktopNotification: ${title}, ${message}`);

    
}
*/



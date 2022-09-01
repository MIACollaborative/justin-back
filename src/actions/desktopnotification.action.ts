import notifier from "node-notifier";
import { IAction } from "../models/action.interface";
import { GenericAction } from "../models/genericaction.model";
import { GenericRecord } from "../models/genericrecord.model";
import { User } from "../models/user.model";

export default class DesktopNotificationAction extends GenericAction {

  name: string = "DesktopNotificationAction";

  #title:string;
  #message:string;

  constructor(metaObj: {title:string, message:string}) {
    super();
    this.#title = metaObj["title"];
    this.#message = metaObj["message"];
  }

  getName(): string {
      return this.name;
  }

  async evaluate(user: User, curTime: Date): Promise<GenericRecord> {
      console.log(`[Action]`, this.getName(), `curTime`, curTime);

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

}

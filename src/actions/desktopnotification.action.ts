import notifier from "node-notifier";


export async function createDesktopNotification(title:string, message:string) {
    console.log(`createDesktopNotification: ${title}, ${message}`);

    return notifier.notify(
      {
        title: title,
        message: message,
        //icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
        sound: false, // Only Notification Center or Windows Toasters
        wait: true // Wait with callback, until user action is taken against notification
      },
      (err, response, metadata) => {
        // Response is response from notification
        return {err, response, metadata};
      }
    );
  }



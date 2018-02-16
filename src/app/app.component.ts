import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { FCM } from "@ionic-native/fcm";

import { HomePage } from "../pages/home/home";
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    fcm: FCM,
    localNotifications: LocalNotifications
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      platform.ready().then(readySource => {
        console.log("Platform ready from", readySource);
        if (platform.is("cordova")) {
          fcm.subscribeToTopic("marketing");
          fcm.getToken().then(token => {
            console.log(token);
          });
          fcm.onNotification().subscribe(data => {
            if (data.wasTapped) {
              console.log("Received in background", data);
              localNotifications.schedule({
                id: 1,
                text: "Single ILocalNotification background",
                sound: null,
                data: { secret: data }
              });
            } else {
              console.log("Received in foreground", data);
              localNotifications.schedule({
                id: 1,
                text: "Single ILocalNotification foreground",
                sound: null,
                data: { secret: data }
              });
            }
          });

          fcm.onTokenRefresh().subscribe(token => {
            console.log(token);
          });
        }
      });
    });
  }
}

import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { environment } from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class PushnotificationService {

  constructor(private platform: Platform) { }

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private async registerPush() {
    await PushNotifications.requestPermissions();
    await PushNotifications.register();

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', 
      (token: any) => {
        console.log('Push registration success, token: ' + token.value);
        // Here you would typically send this token to your server
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', 
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', 
      (notification: any) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );
  }

  async getToken() {
    if (this.platform.is('cordova')) {
      // Get token through the PushNotifications plugin
      const result = await PushNotifications.getDeliveredNotifications();
      return result.notifications[0]?.id; // This might not be the actual token, adjust as needed
    } else {
      // Get token through Firebase (for web)
      const messaging = getMessaging();
      return getToken(messaging, { vapidKey: environment.firebase.apiKey })
        .then((currentToken) => {
          if (currentToken) {
            console.log('current token for client: ', currentToken);
            return currentToken;
          } else {
            console.log('No registration token available. Request permission to generate one.');
            return null;
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          return null;
        });
    }
  }
}

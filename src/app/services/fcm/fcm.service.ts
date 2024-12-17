// import { Injectable } from '@angular/core';
// import { Capacitor } from '@capacitor/core';
// import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
// import { BehaviorSubject } from 'rxjs';
// import { StorageService } from '../storage/storage.service';

// export const FCM_TOKEN = 'push_notification_token';

// @Injectable({
//   providedIn: 'root'
// })
// export class FcmService {

//   private _redirect = new BehaviorSubject<any>(null);

//   get redirect() {
//     return this._redirect.asObservable();
//   }

//   constructor(
//     private storage: StorageService
//   ) { }

//   initPush() {
//     if(Capacitor.getPlatform() !== 'web') {
//       this.registerPush();
//       // this.getDeliveredNotifications();
//     }
//   }

//   private async registerPush() {
//     try {
//       await this.addListeners();
//       let permStatus = await PushNotifications.checkPermissions();

//       if (permStatus.receive === 'prompt') {
//         permStatus = await PushNotifications.requestPermissions();
//       }

//       if (permStatus.receive !== 'granted') {
//         throw new Error('User denied permissions!');
//       }

//       await PushNotifications.register();
//     } catch(e) {
//       console.log(e);
//     }
//   }

//   async getDeliveredNotifications() {
//     const notificationList = await PushNotifications.getDeliveredNotifications();
//     console.log('delivered notifications', notificationList);
//   }

//   addListeners() {
//     PushNotifications.addListener(
//       'registration',
//       async(token: Token) => {
//         console.log('My token: ', token);
//         const fcm_token = (token?.value);
//         let go = 1;
//         const saved_token = JSON.parse((await this.storage.getStorage(FCM_TOKEN)).value);
//         if(saved_token) {
//           if(fcm_token == saved_token) {
//             console.log('same token');
//             go = 0;
//           } else {
//             go = 2;
//           }
//         }
//         if(go == 1) {
//           // save token
//           this.storage.setStorage(FCM_TOKEN, JSON.stringify(fcm_token));
//         } else if(go == 2) {
//           // update token
//           const data = {
//             expired_token: saved_token,
//             refreshed_token: fcm_token
//           };
//           this.storage.setStorage(FCM_TOKEN, fcm_token);
//         }
//       }
//     );

//     PushNotifications.addListener('registrationError', (error: any) => {
//       console.log('Error: ' + JSON.stringify(error));
//     });

//     PushNotifications.addListener(
//       'pushNotificationReceived',
//       async (notification: PushNotificationSchema) => {
//         console.log('Push received: ' + JSON.stringify(notification));
//         const data = notification?.data;
//         if(data?.redirect) this._redirect.next(data?.redirect);
//       }
//     );

//     PushNotifications.addListener(
//       'pushNotificationActionPerformed',
//       async (notification:ActionPerformed) => {
//         const data = notification.notification.data;
//         console.log('Action performed: ' + JSON.stringify(notification.notification));
//         console.log('push data: ', data);
//         if(data?.redirect) this._redirect.next(data?.redirect);
//       }
//     );
//   }

//   async removeFcmToken() {
//     try {
//       const saved_token = JSON.parse((await this.storage.getStorage(FCM_TOKEN)).value);
//       this.storage.removeStorage(saved_token);
//     } catch(e) {
//       console.log(e);
//       throw(e);
//     }

//   }
// }

import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../storage/storage.service';

export const FCM_TOKEN = 'push_notification_token';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  private _redirect = new BehaviorSubject<any>(null);

  get redirect() {
    return this._redirect.asObservable();
  }

  constructor(
    private storage: StorageService
  ) { }

  initPush() {
    if(Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private async registerPush() {
    try {
      console.log('Registering push notifications...');
      await this.addListeners();
      let permStatus = await PushNotifications.checkPermissions();
      console.log('Initial permission status:', permStatus);
  
      if (permStatus.receive === 'prompt') {
        console.log('Requesting permissions...');
        permStatus = await PushNotifications.requestPermissions();
        console.log('Permission request result:', permStatus);
      }
  
      if (permStatus.receive !== 'granted') {
        throw new Error('User denied push notification permissions!');
      }
  
      console.log('Registering with FCM...');
      await PushNotifications.register();
      console.log('Successfully registered with FCM');
    } catch(e) {
      console.error('Error registering push notifications:', e);
    }
  }

  async getDeliveredNotifications() {
    try {
      const notificationList = await PushNotifications.getDeliveredNotifications();
      console.log('delivered notifications', notificationList);
      return notificationList;
    } catch (e) {
      console.error('Error getting delivered notifications:', e);
      throw e;
    }
  }

  private addListeners() {
    PushNotifications.addListener(
      'registration',
      async(token: Token) => {
        console.log('FCM token: ', token.value);
        await this.handleTokenRefresh(token.value);
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Push notification registration error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        const data = notification?.data;
        if(data?.redirect) this._redirect.next(data?.redirect);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if(data?.redirect) this._redirect.next(data?.redirect);
      }
    );
  }

  private async handleTokenRefresh(newToken: string) {
    try {
      const savedToken = await this.getSavedToken();
      if (savedToken !== newToken) {
        await this.saveToken(newToken);
        // Here you would typically send the new token to your backend
        await this.sendTokenToBackend(newToken, savedToken);
      }
    } catch (e) {
      console.error('Error handling token refresh:', e);
    }
  }

  private async getSavedToken(): Promise<string | null> {
    const tokenData = await this.storage.getStorage(FCM_TOKEN);
    return tokenData ? JSON.parse(tokenData.value) : null;
  }

  private async saveToken(token: string) {
    await this.storage.setStorage(FCM_TOKEN, JSON.stringify(token));
  }

  private async sendTokenToBackend(newToken: string, oldToken: string | null) {
    // Implement your logic to send the token to your backend
    console.log(`Sending new token to backend. New: ${newToken}, Old: ${oldToken}`);
  }

  async removeFcmToken() {
    try {
      const savedToken = await this.getSavedToken();
      if (savedToken) {
        await this.storage.removeStorage(FCM_TOKEN);
        await PushNotifications.unregister();
        // Here you would typically inform your backend that this token is no longer valid
      }
    } catch(e) {
      console.error('Error removing FCM token:', e);
      throw e;
    }
  }
}
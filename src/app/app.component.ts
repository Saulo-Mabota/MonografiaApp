// import { Component, } from '@angular/core';
// import {register} from 'swiper/element/bundle'; //NEEDED THIS TO USE SLIDES
// import { IonicModule, Platform } from '@ionic/angular';
// import { FcmService } from './services/fcm/fcm.service';
// register();
// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html',
//   styleUrls: ['app.component.scss'],
// })
// export class AppComponent {
//   constructor( 
//     private fcm: FcmService,
//     private platform: Platform,
//   ) {
//     this.platform.ready().then(() => {
//       this.fcm.initPush();
//     }).catch((e: any) => {
//       console.log('error fcm: ', e);
//     });
//   }

  
// }
import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle'; //NEEDED THIS TO USE SLIDES
import { IonicModule, Platform } from '@ionic/angular';
import { FcmService } from './services/fcm/fcm.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor( 
    private fcm: FcmService,
    private platform: Platform,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    try {
      await this.platform.ready();
      await this.fcm.initPush();
      console.log('FCM initialized successfully');
    } catch (e) {
      console.error('Error initializing FCM:', e);
    }
  }
}
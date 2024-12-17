import {  NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { getApp, initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth, indexedDBLocalPersistence, initializeAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { Capacitor } from '@capacitor/core';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { GuardGuard } from './services/guards/guard.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { NotificationService } from './services/notification/notification.service';
import { PushnotificationService } from 'src/app/services/notification/pushnotification.service';
//import { ReactiveFormsModule } from '@angular/forms';
//import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';


@NgModule({
  declarations: [AppComponent],
  imports: [
   // ReactiveFormsModule,
    BrowserAnimationsModule, //// BrowserAnimationsModule // NEEDED BrowserAnimationsModule
    BrowserModule,
     IonicModule.forRoot(),
      AppRoutingModule,
       provideFirebaseApp(() => initializeApp(environment.firebase)),
      // provideAuth(() => getAuth()),
      provideAuth(() => {
        if (Capacitor.isNativePlatform()){
          return initializeAuth(getApp(),{
            persistence:indexedDBLocalPersistence
          })
        } else{
          return getAuth()
        }
      }),
       provideFirestore(() => getFirestore()),
       provideStorage(() => getStorage()),
       provideAnalytics(() => getAnalytics())],
  providers: [GuardGuard,//GoogleAnalytics,,
    NotificationService, // Add this line
    PushnotificationService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    ScreenTrackingService,UserTrackingService],
  bootstrap: [AppComponent],
  
 // providers: [GuardGuard] // Provide the GuardGuard here

})
export class AppModule {}

import { Injectable } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

import { FirebaseAnalyticsPlugin } from '@capacitor-community/firebase-analytics';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';

// Declare the FirebaseAnalyticsPlugin interface in the global scope
declare global {
  interface Window {
    FirebaseAnalytics: FirebaseAnalyticsPlugin;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  analyticsEnabled = true;
  private readonly firebaseAnalytics: FirebaseAnalyticsPlugin;

  constructor(private router: Router) {
    // Determine if the platform is native or web, and set the firebaseAnalytics accordingly
    this.firebaseAnalytics = Capacitor.isNativePlatform()
      ? (window as any).FirebaseAnalytics
      : null;

    // Initialize Firebase Analytics for the web platform
    this.initFirebaseAnalytics();

    // Track navigation end events to update screen name
    this.trackNavigationEndEvents();
  }

  // Initialize Firebase Analytics for the web platform
  private initFirebaseAnalytics() {
    if (this.isPlatformWeb() && this.firebaseAnalytics) {
      this.firebaseAnalytics.initializeFirebase(environment.firebase);
    }
  }

  // Check if the platform is web
  private isPlatformWeb(): boolean {
    return Capacitor.getPlatform() === 'web';
  }

  // Track navigation end events to update screen name
  private trackNavigationEndEvents() {
    this.router.events
      .pipe(
        filter((event: RouterEvent | any): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        console.log('Route changed:', event.url);
        this.setScreenName(event.url);
      });
  }

  // Log a custom event with parameters
  logEvent(eventName: string, params?: object) {
    if (this.firebaseAnalytics) {
      this.firebaseAnalytics.logEvent({ name: eventName, params: params || {} });
    }
  }


  // Set user ID for analytics
  setUserId(userId: string) {
    if (this.firebaseAnalytics) {
      this.firebaseAnalytics.setUserId({ userId });
    }
  }

  // Set user property for analytics
  setUserProperty(name: string, value: string) {
    if (this.firebaseAnalytics) {
      this.firebaseAnalytics.setUserProperty({ name, value });
    }
  }

  // Set screen name for analytics
  private setScreenName(screenName: string) {
    if (this.firebaseAnalytics) {
      this.firebaseAnalytics.setScreenName({ screenName });
    }
  }

  // Toggle analytics collection enabled status
  toggleAnalytics() {
    if (this.firebaseAnalytics) {
      const isEnabled = !this.analyticsEnabled;
      this.firebaseAnalytics.setCollectionEnabled({ enabled: isEnabled })
        .then(() => {
          this.analyticsEnabled = isEnabled;
        })
        .catch((error) => {
          console.error('Error toggling analytics collection:', error);
        });
    }
  }
}

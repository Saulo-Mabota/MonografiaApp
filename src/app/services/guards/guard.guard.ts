import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataFlagService } from '../flags/data-flag.service';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad, CanMatch {
  currentUserCategoryNome: any;
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private allertCrtl: AlertController,
    private authService: AuthService,
    private dataFlag: DataFlagService,
) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUserData = this.authService.getUserFullData(); // Implement your logic to check if the user is logged in
    if (currentUserData) {
      // User is logged in, allow access
      this.isLoggedIn = true;
      return true;
    } else {
      // User is not logged in, redirect to login page
      this.isLoggedIn = false;
      return this.router.createUrlTree(['/login']);
    }

  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isLoggedIn) { // Implement your logic to check if the user is logged in
      return true; // Allow access to child routes (other pages) for logged-in users
    } else {
      return this.router.createUrlTree(['/']); // Redirect non-logged-in users to the login page
    }
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canMatch(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getAllUserData().then((user: any) => {
      this.currentUserCategoryNome = user.categoryName; //console.log('Category Name: ', this.currentUserCategoryNome);
      const userCategory = this.currentUserCategoryNome;  // Get the user's category from your data or authentication service
      if (this.isLoggedIn && userCategory === 'Administraçāo') { //  this.dataFlag.setIsAdmin(true); // Set the isAdmin flag to true for admin users
        return true; // Allow access to load the specified route for admin users
      } else {
         this.alertDialog();
         this.dataFlag.setIsAdmin(false); //  this.dataFlag.seteAdmin("false"); // Set the isAdmin flag to false for non-admin users
        const allowedRoutes = ['/'];
        return this.router.createUrlTree(allowedRoutes); // Redirect non-admin users to the allowed routes
      }
    }).catch((err: any) => {
      console.error('Error fetching user data:', err); // Handle the error and return an appropriate value, such as redirecting to an error page or a default route
      return this.router.createUrlTree(['/']);
    });
  }
  async alertDialog() {
    const alert = await this.allertCrtl.create({
      header: 'PÁGINA RESTRITA',
      subHeader: 'PÁGINA ACESSÍVEL SOMENTE PARA ADMINISTRADORES',
      message: 'Você precisa ser um administrador para acessar esta página.',
      inputs: [],
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'custom-alert',
          handler: () => { // Handle OK button action if needed
          },
        },
      ],
      cssClass: 'custom-alert',
      backdropDismiss: false,
      translucent: true,
      animated: true,
      mode: 'ios',
    });
  
    await alert.present();
  }
  
  
}




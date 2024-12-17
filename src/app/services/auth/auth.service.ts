import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, sendPasswordResetEmail } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from '@firebase/auth';
import { BehaviorSubject, Observable, first } from 'rxjs';
import { ApiService } from '../api/api.service';
import { DataserviceService} from '../dataservice/dataservice.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  categoriaUser: any;

  public _uid = new BehaviorSubject<any>(null);
  currentUser: any;
  currentUserData: any;
  constructor(
    private fireAuth: Auth,
    private apiService: ApiService,
    private dataService: DataserviceService,) { }

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await signInWithEmailAndPassword(this.fireAuth, email, password);
      // console.log(response);
      if (response?.user) {
        this.setUserData(response.user.uid);
      }
    }
    catch (e) { throw (e); }
  }
  getUserFullData() {
    const auth = getAuth();
    this.currentUserData = auth.currentUser;
    return this.currentUserData;
  }
  getId(): string | null {
    const auth = getAuth();
    this.currentUser = auth.currentUser;
    return this.currentUser?.uid ?? null;
  }

  async getUserData(id: any) {
 //   const cUID  = this.getId;
    const docSnap: any = await this.apiService.getDocById(`users/${id}`);
    if (docSnap?.exists()) {
      return docSnap.data();
    } else {
      throw ('No such document exists');
    }
  }
  async getAllUserData() {
    const currentUID = this.getId();
    const docSnap: any = await this.apiService.getDocById(`users/${currentUID}`);
    if (docSnap?.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        categoryName: data?.category?.nome || ''
      };
    } else {
      throw ('UTILIZADOR NAO ENCONTRADO!!!');
    }
  }


  async getCurrentUserCategoryNome() {
    const currentUID = this.getId();
    const docSnap: any = await this.apiService.getDocById(`users/${currentUID}`);
    if (docSnap?.exists()) {
      const data = docSnap.data();
      // console.log('DDDDDDDD: ',data);
      return data;
    } else {
      throw ('No such document exists');
    }
  }
  
  setUserData(uid: string) {
    this._uid.next(uid);
  }
  randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  async register(formValue: { email: string; password: string; username: any; }) {
    try {
      const registeredUser = await createUserWithEmailAndPassword(this.fireAuth, formValue.email, formValue.password);
      const categoriaID = await this.dataService.getOneCategory().pipe(first()).toPromise();
      this.categoriaUser = categoriaID;  
      console.log('CATEGORIA:' ,this.categoriaUser )
      const data = {
        username: formValue.username,
        email: formValue.email,
        uid: registeredUser.user.uid,
        imageUrl: 'https://i.pravatar.cc/' + this.randomIntFromInterval(200, 400),
        category: this.categoriaUser,
      };
      await this.apiService.setDocument(`users/${registeredUser.user.uid}`, data);
      const userData = {
        id: registeredUser.user.uid
      };
      return userData;
    }
    catch (e) { throw (e); }
  }
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.fireAuth, email);
    } catch (e) {
      throw (e);
    }
  }
  async logout() {
    try {
      await this.fireAuth.signOut();
      this._uid.next(null);
      this.currentUser = null;
      return true;
    }
    catch (e) { throw (e); }
  }
  checkAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.fireAuth, user => {
        console.log('auth user: ', user);
        resolve(user)
      });
    });
  }

  
  async registerUserApp(formValue: { email: string; password: string; username: any; categoria: any; }) {
    try {
      const registeredUser = await createUserWithEmailAndPassword(this.fireAuth, formValue.email, formValue.password);
      const data = {
        username: formValue.username,
        email: formValue.email,
        uid: registeredUser.user.uid,
        imageUrl: 'https://i.pravatar.cc/' + this.randomIntFromInterval(200, 400),
        category: formValue.categoria,
      };
      await this.apiService.setDocument(`users/${registeredUser.user.uid}`, data);
      const userData = {
        id: registeredUser.user.uid
      };
      return userData;
    } catch (e) {
      throw (e);
    }
  }
  async updateUser(userId: string, data: any): Promise<void> {
    try {
      console.log("Updating user data for userId: ", userId); 
      console.log("New user data: ", data);
      const userDocRef = this.apiService.docRef(`users/${userId}`);
      console.log("User document reference: ", userDocRef);
      await this.apiService.updateDocument(userDocRef, data);
      console.log("User data updated successfully.");
    } catch (error) {
      console.error("Error updating user data: ", error);
      throw error;
    }
  }
  // async deleteUser(userId: string): Promise<void> {
  //   try {
  //     // Get the current user
  //     const auth = getAuth();
  //     const currentUser = auth.currentUser;

  //     if (!currentUser) {
  //       throw new Error('No authenticated user found');
  //     }

  //     // Check if the current user is the one being deleted
  //     if (currentUser.uid !== userId) {
  //       throw new Error('You can only delete your own account');
  //     }

  //     // Delete user data from Firestore
  //     await this.apiService.deleteDocument(`users/${userId}`);

  //     // Delete user from Firebase Authentication
  //     await currentUser.delete();

  //     // Clear local user data
  //     this._uid.next(null);
  //     this.currentUser = null;

  //     console.log('User deleted successfully');
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //     throw error;
  //   }
  // }
  // async isCurrentUserAdmin(): Promise<boolean> {
  //   const currentUser = this.fireAuth.currentUser;
  //   if (!currentUser) return false;

  //   const userData = await this.getUserData(currentUser.uid);
  //   return userData?.isAdmin === true;
  // }

  // async deleteUser(userId: string): Promise<void> {
  //   try {
  //     const isAdmin = await this.isCurrentUserAdmin();
      
  //     if (!isAdmin) {
  //       throw new Error('Only admins can delete users');
  //     }

  //     // Delete user data from Firestore
  //     await this.apiService.deleteDocument(`users/${userId}`);

  //     // For now, we'll just simulate this part
  //     console.log(`User ${userId} would be deleted from Authentication here`);

  //     console.log('User deleted successfully');
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //     throw error;
  //   }
  // }

  async isCurrentUserAdmin(): Promise<boolean> {
    const currentUser = this.fireAuth.currentUser;
    if (!currentUser) {
      console.log('No current user found');
      return false;
    }

    try {
      const userData = await this.getUserData(currentUser.uid);
      console.log('User data:', userData);
      return userData?.isAdmin === true;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return false;
    }
  }

  async setCurrentUserAsAdmin(): Promise<void> {
    const currentUser = this.fireAuth.currentUser;
    if (!currentUser) {
      throw new Error('No current user found');
    }

    try {
      await this.apiService.updateDocument(`users/${currentUser.uid}`, { isAdmin: true });
      console.log('Current user set as admin');
    } catch (error) {
      console.error('Error setting user as admin:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const isAdmin = await this.isCurrentUserAdmin();
      console.log('Is current user admin?', isAdmin);
      
      if (!isAdmin) {
        throw new Error('Only admins can delete users');
      }

      // Delete user data from Firestore
      await this.apiService.deleteDocument(`users/${userId}`);

      // In a real-world scenario, you would call a secure server-side function here
      // to delete the user from Firebase Authentication
      // For now, we'll just simulate this part
      console.log(`User ${userId} would be deleted from Authentication here`);

      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

}


  
  // async getAllUserData() {
  //   const currentUID = this.getId();
  //  // console.log('uid',currentUID);
  //   const docSnap: any = await this.apiService.getDocById(`users/${currentUID}`);
  //   if (docSnap?.exists()) {
  //     return docSnap.data();
  //   } else {
  //     throw ('No such document exists');
  //   }
  // }
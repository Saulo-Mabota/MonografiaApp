import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, doc, docData,Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { ref, Storage } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { getDownloadURL, uploadString } from '@firebase/storage';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  userEmail: any;
  currentUID: any;
  constructor(
    private auth:Auth,
    private firestore: Firestore,
    private storage: Storage
  ) { }
  getUserProfile(){
      const user:any = this.auth.currentUser;
      this.currentUID = user.uid;
      const userDocRef = doc(this.firestore,`users/${user.uid}`);
      return docData(userDocRef);
      
  }

  updateProfile(username: string) {
    const user:any = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `/${user.uid}`);
    return updateDoc(userDocRef, {username});
  }
 
  
  async uploadImage(cameraFile: Photo) {
    const user: any = this.auth.currentUser;
    
    const path = `uploads/${user.uid}/profile.png`;
    const storageRef = ref(this.storage, path);
  
    try {
      await uploadString(storageRef, cameraFile.base64String!, 'base64');
      const imageUrl = await getDownloadURL(storageRef);
  
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userDocRef, {
        imageUrl: imageUrl
      });
      return true;
    } catch (e) {
      return null;
    }
  }
  

  async addNoteFull(noti: any, cameraFile: Photo,): Promise<void> {
    const randomString = Math.random().toString(36).substring(2);
    // const path = `uploads/${userId}/${noteId}/${randomString}_profile.png`;

    try {
      const user: any = this.auth.currentUser;
      const path = `uploads/${user.uid}/profile.png`;
      const storageRef = ref(this.storage, path);

      const notesRef = collection(this.firestore, 'notes');
      const createdAt = new Date();
      const userId: string | undefined = this.auth.currentUser?.uid;
      //const catId = noti.categoria;

      await uploadString(storageRef, cameraFile.base64String!, 'base64');
      const imageUrl = await getDownloadURL(storageRef);


      const noteWithData = { ...noti, createdAt, imageUrl, userId };
      await addDoc(notesRef, noteWithData);

    } catch (error) {
      console.error('Error adding note:', error);
      throw new Error('Failed to add note');
    }
  }
}

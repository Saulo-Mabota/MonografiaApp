import { Injectable } from '@angular/core';

import { Observable, combineLatest, first, map } from 'rxjs';
import { ref, Storage, updateMetadata } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { getDownloadURL, uploadString } from '@firebase/storage';
import { Auth } from '@angular/fire/auth';
import { Data } from '@angular/router';
import { Firestore, collection, addDoc, collectionData, doc, docData, deleteDoc, setDoc, updateDoc, orderBy, limit, query, getDocs, where, collectionGroup } from '@angular/fire/firestore';

export interface Note {
  id?: string;
  title: string;
  text: string;
  createdAt: Data;
  categoria: string;
  imageUrl: any;
  username:string;
}
export interface Category {
  id?: string;
  nome?: string;
  //description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  constructor(
    private auth: Auth,
    private storage: Storage,
    private firestore: Firestore
  ) { }
  addNote(note: Note) {
    const notesRef = collection(this.firestore, 'notes');
    const createdAt = new Date();
    const noteWithTimestamp = { ...note, createdAt };
    return addDoc(notesRef, noteWithTimestamp);
  }
  async addNoteFull(noti: Note, cameraFile: Photo,): Promise<void> {
    const randomString = Math.random().toString(36).substring(2);
   //  const path = `uploads/${userI}/${noteId}/${randomString}_profile.png`;

    try {
      const path = `uploads/${randomString}/_note.png`;
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
  deleteNote(note: Note) {
    const noteDocRef = doc(this.firestore, `notes/${note.id}`);
    return deleteDoc(noteDocRef);
  }
  updateProfile(note: Note) {
    const user:any = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return updateDoc(userDocRef, {username:note.username});
  }
  updateNote(note: Note) {
    const noteDocRef = doc(this.firestore, `notes/${note.id}`);
    return updateDoc(noteDocRef, { title: note.title, text: note.text });
  }
  async updateUser(userId: string, data: any) {
    try {
      console.log("Updating user data for userId: ",userId);
      console.log("New user data: ", data);
      const userDocRef = doc(this.firestore, `users/${userId}`);
      console.log("User document reference: ", userDocRef);
      await updateDoc(userDocRef, data);
      console.log("User data updated successfully.");
    } catch (error) {
      console.error("Error updating user data:", error);
      throw new Error("Failed to update user data");
    }
  }

  getNoteImg(id: string) {
    // const user: any = this.auth.currentUser;
    const noteDocRef = doc(this.firestore, `noteImg/${id}`);
    return docData(noteDocRef);
  }

  getNoteById(id: string): Observable<Note> {
    const noteDocRef = doc(this.firestore, `notes/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<Note>;
  }
  getCategoryById(id: string): Observable<Category> {
    const categoryDocRef = doc(this.firestore, `category/${id}`);
    return docData(categoryDocRef) as Observable<Category>;
  }
  async getLastNoteID() {
    const notesRef = collection(this.firestore, 'notes');
    const Query = query(notesRef, orderBy('createdAt', 'desc'), limit(1));
    const querySnapshot = await getDocs(Query);
    if (querySnapshot.docs.length === 0) {
      // There are no notes in the "notes" collection
      return null;
    } else {
      // Return the ID of the last note in the "notes" collection
      const lastNoteId = querySnapshot.docs[0].id;
      return lastNoteId;

    }
  }
  // getNotesByCategory(categoryId: string): Observable<Note[]> {
  //   const notesRef = collection(this.firestore, 'notes');
  //   const quer = query(notesRef, where('categoria.nome', '==', categoryId));
  //   return collectionData(quer, { idField: 'id' }) as Observable<Note[]>;
  // }
 
  getNotesByCategory(categoryId: string): Observable<Note[]> {
    const notesRef = collection(this.firestore, 'notes');
    const queryWithOrder = query(
      notesRef,
      where('categoria.nome', '==', categoryId),
      orderBy('createdAt', 'desc') // Sort by `createdAt` in descending order
    );
  
    return collectionData(queryWithOrder, { idField: 'id' }) as Observable<Note[]>;
  }
  // getNotes(): Observable<Note[]> {
  //   const notesRef = collection(this.firestore, 'notes');
  //   return collectionData(notesRef, { idField: 'id' }) as Observable<Note[]>;
  // }

   // Add orderBy('createdAt', 'desc') to retrieve notes ordered by createdAt
   getNotes(): Observable<Note[]> {
    const notesRef = collection(this.firestore, 'notes');
    const orderedQuery = query(notesRef, orderBy('createdAt', 'desc'));
    return collectionData(orderedQuery, { idField: 'id' }) as Observable<Note[]>;
  }

  getOneCategory(): Observable<Category[]> {
    const categoryRef = collection(this.firestore, 'category');
    return collectionData(categoryRef, { idField: 'id' }).pipe(
      map(categories => categories[0]),
      first()
    ) as Observable<Category[]>;
  }
  getAllCategories(): Observable<Category[]> {
    const categoryRef = collection(this.firestore, 'category');
    return collectionData(categoryRef, { idField: 'id' }) as Observable<Category[]>;
  }

  
  async uploadImage(cameraFile: Photo, userId: string, noteId: string) {
    const path = `uploads/${noteId}/_note.png`;
    const storageRef = ref(this.storage, path);
    try {
      await uploadString(storageRef, cameraFile.base64String!, 'base64');
      const imageUrl = await getDownloadURL(storageRef);
      const userDocRef = doc(this.firestore, `noteImg/${noteId}`);
      await setDoc(userDocRef, {
        imageUrl,
        userId,
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
 
  

}


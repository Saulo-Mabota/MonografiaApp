import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  OrderByDirection,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private firestore: Firestore) { }

  docRef(path: string) {
    return doc(this.firestore, path);
  }

  setDocument(path: string, data: any) {
    const dataRef = this.docRef(path);
    return setDoc(dataRef, data);//set()
  }

  addDocument(path: string, data: any) {
    const dataRef = this.collectionRef(path);
    return addDoc(dataRef, data);//add()
  }

  collectionRef(path: string) {
    return collection(this.firestore, path);
  }

  getDocById(path: string) {
    const dataRef = this.docRef(path);
    return getDoc(dataRef);
  }
  getDocs(path: string, queryFn?: any) {
    let dataRef: any = this.collectionRef(path);
    if (queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    return getDocs(dataRef); //get()
  }

  collectionDataQuery(path: string, queryFn?: any) {

    let dataRef: any = this.collectionRef(path);
    if (queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    const collection_data = collectionData<any>(dataRef, { idField: 'id' });
    return collection_data;
  }

  docDataQuery(path: string, id?: string, queryFn?: any) {
    let dataRef: any = this.docRef(path);
    if (queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    let doc_data;
    if (id) doc_data = docData<any>(dataRef, { idField: 'id' });
    else doc_data = docData<any>(dataRef);
    return doc_data;
  }

  whereQuery(fieldPath: string, condition: any, value: any) {
    return where(fieldPath, condition, value);
  }

  orderByQuery(fieldPath: string, directionStr: OrderByDirection = 'asc') {
    return orderBy(fieldPath, directionStr);
  }

  updateDocument(path:any, data?:any) {
    const docRef = this.docRef(path);
    return updateDoc(docRef, data);
  }
}

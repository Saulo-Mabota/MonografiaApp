import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataFlagService {
  private isAdmin: boolean = false; // Flag to store if the user is an admin
  private uCategory!: string; // Flag to store the user category
  private eAdmin!: string; // Flag to store if the user is an admin

  constructor() { }

  setIsAdmin(isAdmin: boolean): void {
    this.isAdmin = isAdmin;
  }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }
  seteAdmin(eAdmin: string) {
    this.eAdmin = eAdmin;
  }

  geteAdmin(): string {
    return this.eAdmin;
  }

  setuCategory(uCategory: string) {
    this.uCategory = uCategory;
  }

  getuCategory(): string {
    return this.uCategory;
  }

 
}
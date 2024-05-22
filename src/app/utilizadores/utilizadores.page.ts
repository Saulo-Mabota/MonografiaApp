import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataserviceService } from '../services/dataservice/dataservice.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ChatService } from '../services/chat/chat.service';
import { AuthService } from '../services/auth/auth.service';
import { AdduserPage } from './adduser/adduser.page';
import { OpenuserPage } from './openuser/openuser.page';
//import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-utilizadores',
  templateUrl: 'utilizadores.page.html',
  styleUrls: ['utilizadores.page.scss'],
  // animations: [
  //   trigger('fadeInOut', [
  //     state('void', style({ opacity: 0 })),
  //     state('*', style({ opacity: 1 })),
  //     transition('void => *', animate('2000ms ease-in')),
  //     transition('* => void', animate('2000ms ease-out'))
  //   ])
  // ]
})
export class utilizadoresPage {
  users: any = [];
  loading = true;
  // Define the skeletonData array with dummy data
  skeletonData: any[] = Array(10).fill({}); // Adjust the number of items as per your design

  filteredUsers: any[] | undefined;
  constructor(private router: Router,
    private dataService: DataserviceService,
    private allertCrtl: AlertController,
    private chatService: ChatService,
    private modalCrtl: ModalController,
    private authService: AuthService,) {
    this.loading = true;
    this.chatService.getUsers().subscribe(res => {
      //  console.log('TODO ARRAY ',res);
      this.users = res;
      this.filteredUsers = res;
      this.loading = false;
    });

  }
  async openUser(users: any) {
    console.log('TODO ARRAY USER ID: ', users.id);
    const OpenNote = await this.modalCrtl.create({
      component: OpenuserPage,
      componentProps: { id: users.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5,
    });
    OpenNote.present();
  }
  async addUser() {
    const modalAddNote = await this.modalCrtl.create({
      component: AdduserPage,
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.6,
    });
    modalAddNote.present();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  searchNotes(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredUsers = this.users.filter((note: any) => {
      for (const key in note) {
        if (note.hasOwnProperty(key) && typeof note[key] === 'string') {
          if (note[key].toLowerCase().includes(searchTerm)) {
            return true;
          }
        }
      }
      return false;
    });
  }
}

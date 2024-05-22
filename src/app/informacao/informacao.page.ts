import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataserviceService } from '../services/dataservice/dataservice.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { OpennotePage } from './opennote/opennote.page';
import { AddnotePage } from './addnote/addnote.page';

@Component({
  selector: 'app-informacao',
  templateUrl: 'informacao.page.html',
  styleUrls: ['informacao.page.scss']
})
export class informacaoPage {
  notes: any = [];
  loading = true;
  // Define the skeletonData array with dummy data
  skeletonData: any[] = Array(10).fill({}); // Adjust the number of items as per your design

  filteredNotes: any[] | undefined;
  constructor(
    private router: Router,
    private allertCrtl: AlertController,
    private modalCrtl: ModalController,
    private authService: AuthService,
    private dataService: DataserviceService,) {
      this.loading = true;
    this.dataService.getNotes().subscribe(res => {
      //  console.log('TODO ARRAY ',res);
      this.notes = res;
      this.filteredNotes = res;
      this.loading = false;
    });
  }

  async openNote(note: any) {
    console.log('TODO ARRAY NOTE ID: ', note.id);
    const OpenNote = await this.modalCrtl.create({
      component: OpennotePage,
      componentProps: { id: note.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5,
    });
    OpenNote.present();
  }
  async addNote() {
    const modalAddNote = await this.modalCrtl.create({
      component: AddnotePage,
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
    this.filteredNotes = this.notes.filter((note: any) => {
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

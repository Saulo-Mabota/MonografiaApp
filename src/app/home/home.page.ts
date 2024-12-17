
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
//import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthService } from 'src/app/services/auth/auth.service';
//import { DataserviceService } from '../services/dataservice/dataservice.service';
import { DataserviceService } from '../services/dataservice/dataservice.service';
// import Swiper from 'swiper';
import { ChatService } from 'src/app/services/chat/chat.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
animations:[
  trigger('fadeInOut',[
    state('void',style({opacity:0})),
    state('*', style({opacity:1})),
    transition('void => *',animate('2000ms ease-in')),
    transition('* => void',animate('2000ms ease-out'))
  ])
]
})
export class homePage {
  loading = true;
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  // swiper?: Swiper;
  segment = 'Todos';

  imagesSLide: any[] | undefined;
  notes: any = [];
  categoriaNote: string | undefined;
  categoriaUser = 'Estudante';
  filteredNotes: any[] | undefined;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataserviceService,
    private allertCrtl: AlertController,
    private chatService: ChatService,
    private authService: AuthService,
    private modalCrtl: ModalController
  ) {
    this.loading = true;
    const paraMim = "Plataformas";
    this.dataService.getNotesByCategory(paraMim).subscribe(res => {
      this.filteredNotes = res;
      this.notes = res;
      // console.log('Category 2 notes: ', res);
     this.loading = false;
    });
   
  }
  ngOnInit() {//this.loading = false;
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
  async openNote(note: any) {
    this.router.navigateByUrl(`/details/${note.id}`);
    // console.log(['NOTE ID: ',note.id]);
  }
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
  swiperReady() {
    // this.swiper = this.swiperRef?.nativeElement.swiper;
  }
  swiperSlideChanged(e: any) {
    //  this.swiper?.autoplay.start();
    //   console.log('changed: ', e);
  }

}


import { Component } from '@angular/core';
import { ActivatedRoute, Navigation, Router, RouterStateSnapshot } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataserviceService } from '../services/dataservice/dataservice.service';
// import Swiper from 'swiper';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ProfilePage } from '../profile/profile.page';
import { DataFlagService } from '../services/flags/data-flag.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-pessoal',
  templateUrl: 'pessoal.page.html',
  styleUrls: ['pessoal.page.scss'],
  animations:[
    trigger('fadeInOut',[
      state('void',style({opacity:0})),
      state('*', style({opacity:1})),
      transition('void => *',animate('2000ms ease-in')),
      transition('* => void',animate('2000ms ease-out'))
    ])
  ]
  })
export class pessoalPage {
  loading = true;
  // Define the skeletonData array with dummy data
  skeletonData: any[] = Array(10).fill({}); // Adjust the number of items as per your design

  imagesSLide: any[] | undefined;
  notes: any = [];
  uCategory: string = ''; // Flag to store the user category

  categoriaNote: string | undefined;
  categoriaUser = 'Estudante';
  filteredNotes: any[] | undefined;
  activatedRoute: any;
  currentUserCategoryNome: any;
  constructor(
    private router: Router,
    private dataService: DataserviceService,
    private route: ActivatedRoute,
    private dataFlag: DataFlagService,
    private allertCrtl: AlertController,
    private chatService: ChatService,
    private authService: AuthService,
    private modalCrtl: ModalController) {
    this.loading = true;
    this.uCategory = this.dataFlag.getuCategory();
    console.log('Category Name: ', this.uCategory);
    this.dataService.getNotesByCategory(this.uCategory).subscribe(res => {
      this.filteredNotes = res;
      this.notes = res;
      //  console.log('Category notes: ', res);
       this.loading = false;
    });
  

  }
  ngOnInit() { }
  swiperReady() {
    // this.swiper = this.swiperRef?.nativeElement.swiper;
  }
  swiperSlideChanged(e: any) {
    //  this.swiper?.autoplay.start();
    //  console.log('changed: ', e);
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

  async openProfile() {
    // console.log('TODO ARRAY NOTE ID: ', note.id);
    const openProfile = await this.modalCrtl.create({
      component: ProfilePage,
      // componentProps: { id: note.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8,
    });
    openProfile.present();
  }
}




 // this.authService.getAllUserData().then((user: any) => {
    //   this.currentUserCategoryNome = user.categoryName;
    //   //   console.log('Category Name: ', this.currentUserCategoryNome);
    //   this.dataService.getNotesByCategory(this.currentUserCategoryNome).subscribe(res => {
    //     this.filteredNotes = res;
    //     this.notes = res;
    //     //  console.log('Category notes: ', res);
    //   });
    // }, (err: any) => {
    //   console.error('Error fetching user data:', err);
    // });
import { Component, Input, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, PopoverController } from '@ionic/angular';
import { Observable, Subject, map, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { DataserviceService } from '../services/dataservice/dataservice.service';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-contactenos',
  templateUrl: 'contactenos.page.html',
  styleUrls: ['contactenos.page.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('2000ms ease-in')),
      transition('* => void', animate('2000ms ease-out'))
    ])
  ]
})
export class contactenosPage {
  loading = false;
  @Input() id!: any; // GET THE ID
  @ViewChild('new_chat') modal!: ModalController;
  @ViewChild('popover') popover!: PopoverController;
  categories: any;
  open_new_chat = false;
  users!: Observable<any[]>;
  allUsersByCategory: any;
  filteredUsers: any[] | undefined;
  filteredChatRooms: any[] | undefined;
  searchTerm: string = ''; // Variable to store the search term

  chatRooms!: Observable<any[]>;
  model = {
    icon: 'chatbubbles-outline',
    title: 'Sem conversas!',
    //title: 'No Chat Rooms',
    color: 'danger'
  };

  private hometUserId: any;
  private unsubscribe$ = new Subject<void>();
  notes: any;
  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router,
    private allertCrtl: AlertController,
    private modalCrtl: ModalController,
    private chatService: ChatService,
    private authService: AuthService,
    private dataService: DataserviceService
  ) { }

  ngOnInit() {
    // this.getId();
    this.getRooms();
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getRooms() {
    this.chatService.getChatRooms();
    this.chatRooms = this.chatService.chatRooms;
   // this.filteredChatRooms = this.chatRooms;
    console.log('chatrooms: ', this.chatRooms);
    // this.loading = false;
  }

  searchChatRoom() {
    this.chatService.chatRooms.pipe(take(1)).subscribe(rooms => {
      if (!this.searchTerm.trim()) {
        this.filteredChatRooms = rooms;
      } else {
        this.filteredChatRooms = rooms.filter((room: { username: string }) => {
          return room.username.toLowerCase().includes(this.searchTerm.toLowerCase());
        });
      }
    });
  }
  

  searchChatRooms(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm.trim() === '') {
      // Reset the filtered list if the search term is empty
      this.filteredChatRooms = this.allUsersByCategory;
    } else {
      // Filter users based on the search term
      this.filteredChatRooms = this.allUsersByCategory.filter((user: { username: string; }) => {
        // You can adjust the conditions based on the properties of your user object
        return user.username.toLowerCase().includes(searchTerm);
      });
    }
  }
  getId() {
    this.hometUserId = this.authService.getId();
    // console.log('MY ID FROM HOME: ',this.hometUserId);
  }
  newChat() {

    this.open_new_chat = true;
  
    if (!this.users) this.getCategories();
    // if (!this.users) this.getUsers();
  }
  async logout() {
    this.popover.dismiss();
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
      // Clear categories when logging out
      this.categories = null;
  }
  searchUsers(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm.trim() === '') {
      // Reset the filtered list if the search term is empty
      this.filteredUsers = this.allUsersByCategory;
    } else {
      // Filter users based on the search term
      this.filteredUsers = this.allUsersByCategory.filter((user: { username: string; }) => {
        // You can adjust the conditions based on the properties of your user object
        return user.username.toLowerCase().includes(searchTerm);
      });
    }
  }

  
  async getCategories() {
    try {
      this.dataService.getAllCategories().pipe(takeUntil(this.unsubscribe$)).subscribe(async res => {
        this.categories = res;
        console.log('MY ID ', res);

        const radioInputs: any = this.categories.map((category: { nome: string }) => ({
          text: category.nome,
          handler: () => {
            // Handle category selection
            console.log('Selected category:', category.nome);
            this.chatService.getUsers().subscribe(res => {
              this.allUsersByCategory = res.filter((user: { category: { nome: string } }) => user.category.nome === category.nome);
              this.filteredUsers = this.allUsersByCategory;
              console.log('FILTERED: ', this.allUsersByCategory);
            });
          }
        }));
  
        const actionSheet = await this.actionSheetController.create({
          header: 'Selecionar categoria',
          backdropDismiss: false, 
          buttons: [
            ...radioInputs,
            {
              text: 'Cancelar',
              role: 'cancel',
              icon: 'close'
            }
          ]
        });
  
        await actionSheet.present();

        // Handle action sheet dismissal
        const { role } = await actionSheet.onDidDismiss();
        console.log('Action sheet dismissed with role:', role);
        if(role=="cancel"){this.modal.dismiss(); this.open_new_chat = false;}
     

      });
    } catch (error) {
      // Handle error if any
    } finally {
      this.loading = false;
    }
  }
  


  onWillDismiss(event: Event) {

  }
  cancel() {
    this.modal.dismiss();
    this.open_new_chat = false;
  }
  async startChat(item: { uid: any; username: any; }) {
    this.getId();
    try {
      if (!item?.uid) {
        throw new Error('ID do utilizadorinvalido');
      }
      const room = await this.chatService.createChatRoom(item.uid);
      // console.log('room: ', room);
      this.cancel();
      const navData: NavigationExtras = {
        queryParams: {
          username: item?.username
        }
      };

      this.router.navigate(['/tabs', 'contactenos', 'chat', room?.id], navData);
    } catch (e) {
      throw (e);
    }
  }
  getChat(item: any) {
    (item?.user).pipe(
      take(1)
    ).subscribe((user_data: { username: any; }) => {
      //  console.log('data: ', user_data);
      const navData: NavigationExtras = {
        queryParams: {
          username: user_data?.username
        }
      };
      this.router.navigate(['/tabs', 'contactenos', 'chat', item?.id], navData);
    });
    this.modalCrtl.dismiss();
  }
  getUser(user: any) {
    return user;

  }

}


// getUsers() {
//   this.chatService.getUsers().subscribe(res => {
//    // console.log('TODO ARRAY ', res);
//     this.allUsersByCategory = res.filter((user: { category: { nome: string } }) => user.category.nome === 'Administraçāo');
//     console.log(this.allUsersByCategory); // Filtered users array with specific category.nome
//   });
//  this.getCategories();
// }
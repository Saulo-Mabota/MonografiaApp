
import { Injectable } from '@angular/core';
// import { Auth, signOut, user } from '@angular/fire/auth';
// import { Router } from '@angular/router';
// import { LoadingController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {//public auth: Observable<any>;
  currentUserId: any;

  public users!: Observable<any>;
  public allUsers!: Observable<any>;
  public chatRooms!: Observable<any>;
  public selectedChatRoomMessages!: Observable<any>;

  constructor(
    // private loadingCtrl: LoadingController,
    private auth: AuthService,
    private api: ApiService,
    // private router: Router,
  ) {
    // this.getId();
  }
  getId() {
    this.currentUserId = this.auth.getId();
  }
  getCurrentUserData() {
    this.getId();
    this.users = this.api.collectionDataQuery(
      'users',
      this.api.whereQuery('uid', '==', this.currentUserId)
    );
    //  console.log('MY USER ID IS ROOT: ', this.currentUserId);
    return this.users;
  }

  getUsers() {
    this.getId();
    this.users = this.api.collectionDataQuery(
      'users',
      this.api.whereQuery('uid', '!=', this.currentUserId)
    );
    console.log('MY USER ID IS ROOT: ', this.currentUserId);
    return this.users; //maybe remove this thing here
  }
  

  async createChatRoom(user_Id: any) {
    try {
      // Check if user_Id and currentUserId are defined
      if (!user_Id || !this.currentUserId) {
        throw new Error('Invalid user ID or current user ID');
      }
      // console.log('LOGIN SERVICE: ',this._idSAULO);
      let room: any;
      const querySnapshot = await this.api.getDocs(
        'chatRooms',
        this.api.whereQuery(
          'members',
          'in',
          [[user_Id, this.currentUserId], [this.currentUserId, user_Id]]
        )
      );
      //   console.log('I AM HERE: ');

      room = await querySnapshot.docs.map((doc: any) => {
        let item = doc.data();
        item.id = doc.id;
        return item;
      });

      // console.log('exit docs: ', room);

      if (room?.length > 0) {
        return room[0];
      }

      const data = {
        members: [
          this.currentUserId,
          user_Id
        ],
        type: 'private',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      room = await this.api.addDocument('chatRooms', data);
      return room;
    } catch (e) {
      throw (e);
    }
  }
  
  getChatRooms() {
    this.getId();
    this.chatRooms = this.api.collectionDataQuery(
      'chatRooms',
      this.api.whereQuery('members', 'array-contains', this.currentUserId)
    ).pipe(
      map((data: any[]) => {
       console.log('room data: ', data);
        data.map((element) => {
          const user_data = element.members.filter((x: any) => x != this.currentUserId);
        //  console.log('room user_data: ',user_data);
          const user = this.api.docDataQuery(`users/${user_data[0]}`);
          element.user = user; //    console.log('CHAT ROOM ARRAY: ',  element.user);
        });
       // console.log('CHAT ROOM ARRAY: ',  data);
        return (data);
   
      }),
      switchMap(data => {
        return of(data);
      })
    );
  }

  getChatRoomMessages(chatRoomId: string) {
    this.selectedChatRoomMessages = this.api.collectionDataQuery(
      `chat/${chatRoomId}/messages`,
      this.api.orderByQuery('createdAt', 'desc')
    )
      .pipe(map((arr: any) => arr.reverse()));
  }
  createCategorias(chatRoomId: any) {
    this.selectedChatRoomMessages = this.api.collectionDataQuery(
      `chat/${chatRoomId}/messages`,
      this.api.orderByQuery('createdAt', 'desc')
    )
      .pipe(map((arr: any) => arr.reverse()));
  }

  async sendMessage(chatId: string | undefined, msg: string) {
    try {
      const new_message = {
        message: msg,
        sender: this.currentUserId,
        createdAt: new Date()
      };
      console.log(chatId);
      if (chatId) {
        await this.api.addDocument(`chat/${chatId}/messages`, new_message);
      }
    } catch (e) {
      throw (e);
    }
  }
}


// getUsers() {
//   this.getId();
//   this.users = this.api.collectionDataQuery('users', [
//     this.api.whereQuery(`category.nome`, '==', `CTA`),
//   this.api.whereQuery('uid', '!=', this.currentUserId)
//   ]);
//   console.log('MY USER ID IS ROOT: ', this.users);
//   return this.users;
// }

// getUsers(): Observable<any[]> {
//   this.getId();
//   const queryFn = (ref: any) => {
//     return ref
//       .where('category.nome', '==', 'Estudante')
//       .where('uid', '!=', this.currentUserId);
//   };

//   return this.users = this.api.collectionDataQuery('users', queryFn);
// }
// getUsers(): Observable<any[]> {
//   this.getId();
//   const cUID = this.currentUserId;
//   console.log('uid: ',cUID);
//   const queryFn = (ref: any) => {
//     return ref
//      .where('category.nome', '==', 'Docente')
//      .where('uid', '!=', cUID);
//   };
//   console.log('QueryFn: ',queryFn);
//   return this.users = this.api.collectionDataQuery('users', queryFn);
// }

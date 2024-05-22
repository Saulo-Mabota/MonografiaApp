import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { DataserviceService, Note } from '../services/dataservice/dataservice.service'; 
import { ProfileService } from 'src/app/services/profile/profile.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  note!: Note;
  formChanged = false;
  profile: any;
  userData:any;
  uid: any;
  //signupForm!: FormGroup;
  isTypePassword: boolean = true;
  isLoading = false;
  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastCrtl: ToastController,
    private dataService: DataserviceService,
    private router: Router,
    private chatService: ChatService,
    private loadingController: LoadingController,
    private alertController: AlertController

  ) {
   this.uid = this.authService.getId();
   this.getSelectedUser();
  }
  
  ngOnInit() {}

  async getSelectedUser() {
   // const userId = this.id;  //  console.log('MY ID: ', userId);
    this.userData = await this.authService.getUserData(this.uid); 
      console.log('USER DATA: ', this.userData );
  }

  async updateUserProfile() {
   // const username:string = this.credentials.value;

  this.dataService.updateUser(this.uid,this.userData);
    const toast = await this.toastCrtl.create({
      message: 'Note Updated',
      duration: 1000,
    });
  // this.modalCrtl.dismiss();
   toast.present();
  }

  getUserData() {
    this.chatService.getCurrentUserData().subscribe(resultSet => {
      this.profile = resultSet;
    
    });
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, //camera, photos or prompt
    });
    console.log(image);

    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.profileService.uploadImage(image);
      loading.dismiss();

      if (!result) {
        const alert = await this.alertController.create({
          header: 'Uploadfaild',
          message: 'There was a probelem uploadin your avatar!',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }


}

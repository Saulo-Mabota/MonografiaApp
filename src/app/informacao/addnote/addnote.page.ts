import { Component, Input, OnInit } from '@angular/core';
import { DataserviceService, Note } from 'src/app/services/dataservice/dataservice.service'; 
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Auth } from '@angular/fire/auth';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PushnotificationService } from 'src/app/services/notification/pushnotification.service';
@Component({
  selector: 'app-addnote',
  templateUrl: './addnote.page.html',
  styleUrls: ['./addnote.page.scss'],
})
export class AddnotePage implements OnInit {
  @Input() id!: any; // GET THE ID
  note!: Note;
  profile: any;
  allcategories: any;
  credentials!: FormGroup;
  public loading: any;
  logs: string[] = [];
  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private dataService: DataserviceService,
    private modalCrtl: ModalController,
    private auth: Auth,
    private alertController: AlertController,
    private pushNotificationService: PushnotificationService,// Add this line
    private toastCrtl: ToastController,
    private notificationService: NotificationService 
  ) { }
  signupForm!: FormGroup;
  isTypePassword: boolean = true;
  isLoading = false;
  get title() {
    return this.credentials.get('title');
  }
  get text() {
    return this.credentials.get('text');
  }
  get catId() {

  return this.credentials.get('allcategory.id}');
   // return this.credentials.get('allcategory.nome}');
  }
  ngOnInit() {
    this.credentials = this.fb.group({
      categoria: ['', [Validators.required]],
      title: ['', [Validators.required]],
      text: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.dataService.getAllCategories().subscribe(res => {
      this.allcategories = res;
    //console.log('categories:  ', res);
    });


    // const categoriaByID =  this.dataService.getNotesByCategory('TqEl8gV8xVaOZlYSjFee').subscribe(res => {
    //   //  this.allcategories = res;
    //    console.log('categories:  ', res);
    //   });
    //  console.log('categoriaByID: ',categoriaByID);

  }
  async registerNote() {
    this.isLoading = true;
   
    try {
      this.loading = await this.loadingController.create();
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });

      let categoria = this.allcategories.find((cat: { id: any; })=>cat.id === this.credentials.value.categoria)
      
      let noteForm:any  = this.credentials.value;
      noteForm = {
        ...this.credentials.value,
        categoria
      }

      const user = await this.dataService.addNoteFull(noteForm, image);

      // Send push notification
      await this.sendPushNotification(noteForm.title);

      await this.loading.dismiss();
      this.modalCrtl.dismiss();
    } catch (e: any) {
      await this.loading.dismiss();
      throw (e);
    }
  }

  async sendPushNotification(title: string) {
    const token = await this.pushNotificationService.getToken();
    if (token) {
      // In a real-world scenario, you would send this to your backend
      // Your backend would then use FCM to send the notification to all devices
      // For this example, we'll just log it
      console.log(`Would send push notification for new info: ${title}`);
      console.log(`Device token: ${token}`);

      // Simulating sending to a backend
      // Replace 'YOUR_BACKEND_URL' with your actual backend URL
      // this.http.post('YOUR_BACKEND_URL/send-notification', {
      //   title: 'Nova Informação',
      //   body: `Uma nova informação "${title}" foi publicada!`,
      //   token: token
      // }).subscribe(
      //   res => console.log('Notification sent successfully', res),
      //   err => console.error('Error sending notification', err)
      // );
    }
  }
  // async registerNote() {
  //   this.isLoading = true;
   
  // //  console.log('categories:  ', this.allcategories );
  //   try {
  //     //let msg: string = '';
  //     this.loading = await this.loadingController.create();
  //   //  await this.loading.dismiss();
  //     const image = await Camera.getPhoto({
  //       quality: 90,
  //       allowEditing: false,
  //       resultType: CameraResultType.Base64,
  //       source: CameraSource.Photos, //camera, photos or prompt
  //     });

    
  //     // const noteForm:any  = this.credentials.value;
  //     let categoria = this.allcategories.find((cat: { id: any; })=>cat.id === this.credentials.value.categoria)
      
  //    // console.log('categoria: ',categoria); 
  //     let noteForm:any  = this.credentials.value;
  //     noteForm = {
  //     ...this.credentials.value, categoria
  //    }
  //    //console.log(noteForm, ' :NotForme');
  //     const user = await this.dataService.addNoteFull(noteForm, image);
  //     //IRES = NAMPULA - CANTARTE
  //     await this.loading.dismiss();
  //     this.modalCrtl.dismiss();
  //   } catch (e: any) {
  //     await this.loading.dismiss();
  //     throw (e);
  //   }

  // }
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }


  pushLog(msge: string) {
      this.logs.unshift(msge);
  }

  handleChange(e: any) {
   // this.pushLog(e.detail.value);
  }

  async changeImage() {

    const userId: any = this.auth.currentUser?.uid;
    const NoteId: any = await this.dataService.getLastNoteID();
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

      const result = await this.dataService.uploadImage(image, userId, NoteId);
      loading.dismiss();
      this.modalCrtl.dismiss();
      if (!result) {
        const alert = await this.alertController.create({
          header: 'Uploadfaild',
          message: 'There was a probelem uploadin your avatar!',
          buttons: ['OK'],
        });
        this.modalCrtl.dismiss();
        await alert.present();
      }
    }
  }
}

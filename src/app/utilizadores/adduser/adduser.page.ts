import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DataserviceService,Note } from 'src/app/services/dataservice/dataservice.service'; 
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Auth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.page.html',
  styleUrls: ['./adduser.page.scss'],
})
export class AdduserPage implements OnInit {

  @Input() id!: any; // GET THE ID
  note!: Note;
  profile: any;
  allcategories: any;
  public loading: any;
  logs: string[] = [];
  categoriaUser: any;
  signupForm!: FormGroup;
  isTypePassword: boolean = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private dataService: DataserviceService,
    private authService: AuthService,
    private modalCrtl: ModalController,
    private auth: Auth,
    private alertController: AlertController,
    private toastCrtl: ToastController
  ) {
    this.initForm();
    this.dataService.getAllCategories().subscribe(res => {
      this.categoriaUser = res;
    });

  }

  initForm() {
    this.signupForm = new FormGroup({
      categoria: new FormControl('',
        { validators: [Validators.required] }
      ),
      username: new FormControl('',
        { validators: [Validators.required] }
      ),
      email: new FormControl('',
        { validators: [Validators.required, Validators.email] }
      ),
      password: new FormControl('',
        { validators: [Validators.required, Validators.minLength(8)] }
      ),
    });
  }
  ngOnInit() { }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit() {
    if (!this.signupForm.valid) return;
    // console.log(this.signupForm.value);
    this.register(this.signupForm);
  }

  register(form: FormGroup<any>) {
    let categoria = null;
    if (this.categoriaUser) {
      categoria = this.categoriaUser.find((cat: { id: any; }) => cat.id === this.signupForm.value.categoria);
    } // console.log('categoriaXXX: ', categoria);
    const registerForm = {
      ...this.signupForm.value,
      categoria: categoria
    };

    this.authService.registerUserApp(registerForm).then((data) => {
      this.isLoading = false; //  console.log('Data: ', data);
      this.modalCrtl.dismiss();   // await this.loading.dismiss();
      form.reset();
    })
      .catch(e => {
        console.log('ERROR: ', e);
        this.isLoading = false;
        let msg: string = 'Could not sign you up, please try again.';
        if (e.code == 'auth/email-already-in-use') {
          msg = 'Email already in use!';
        }
        this.showAlert(msg);
      });
  }

  async showAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: msg,
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
  // get title() {
  //   return this.credentials.get('title');
  // }
  // get text() {
  //   return this.credentials.get('text');
  // }
  // get catId() {

  // return this.credentials.get('allcategory.id}');
  //  // return this.credentials.get('allcategory.nome}');
  // }
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataserviceService } from 'src/app/services/dataservice/dataservice.service';
import { DataFlagService } from 'src/app/services/flags/data-flag.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.page.html',
  styleUrls: ['./singup.page.scss'],
})
export class SingupPage implements OnInit {
  categoriaUser: any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataserviceService,
    private dataFlag: DataFlagService,
    private alertController: AlertController
  ) {
    this.initForm();


    this.dataService.getOneCategory().subscribe(res => {
      this.categoriaUser = res; //  console.log("the value: ",this.categoriaUser?.id);
    });
  }
  signupForm!: FormGroup;
  isTypePassword: boolean = true;
  isLoading = false;

  ngOnInit() {
  }
  initForm() {
    this.signupForm = new FormGroup({
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

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit() {

    if (!this.signupForm.valid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    console.log(this.signupForm.value);
    this.register(this.signupForm);
  }
  register(form: FormGroup<any>) {
    this.isLoading = true;
    console.log(form.value);
    this.authService.register(form.value).then((data) => {
      console.log(data);
      
      this.dataFlag.setuCategory('');
      this.dataFlag.setIsAdmin(false);

      this.router.navigateByUrl('/tabs');
      this.isLoading = false;
      form.reset();
    })
      .catch(e => {
        console.log(e);
        this.isLoading = false;
        let msg = 'Não foi possivel fazer o registro, por favor tente novamente.';
        if (e.code == 'auth/email-already-in-use') {
          msg = 'E-mail já em uso!';
        }
        this.showAlert(msg);
      });
  }
  async showAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Alert', // subHeader: 'Important message',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

}

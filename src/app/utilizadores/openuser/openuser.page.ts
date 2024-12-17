import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { DataserviceService,Note } from 'src/app/services/dataservice/dataservice.service';

@Component({
selector: 'app-openuser',
  templateUrl: './openuser.page.html',
  styleUrls: ['./openuser.page.scss'],
})
export class OpenuserPage implements OnInit {

  @Input() id!: any; // GET THE ID
  //note: Note = {title: '', text: '' };
  //note: Note = null;
  userData:any;
  //note!: Note;
  allcategories: any;
  logs: string[] = [];
  signupForm!: FormGroup;
  constructor(
    private dataService: DataserviceService,
    private chatService: ChatService,
    private fb: FormBuilder,
    private authService: AuthService,
    private modalCrtl: ModalController,
    private alertController: AlertController,
    private toastCrtl: ToastController
  ) { }
  ngOnInit() {
    this.initForm();
    this.getSelectedUser();

    this.dataService.getAllCategories().subscribe(res => {
      this.allcategories = res;
    });
    console.log('WHATEVER IS HERE: ',this.signupForm.value.categoria);
  }

  initForm() {
    this.signupForm = new FormGroup({
      category: new FormControl('',
        { validators: [Validators.required] }
      )
    });
  }


  onChange() {
   
   // this.isTypePassword = !this.isTypePassword;
  }

  onSubmit() {
    if (!this.signupForm.valid) return;
    // console.log(this.signupForm.value);
 //   this.register(this.signupForm);
  }



  async getSelectedUser() {
    const userId = this.id;  //  console.log('MY ID: ', userId);
    this.userData = await this.authService.getUserData(userId);   // console.log('USER DATA: ', data);
  }
  async updateUserInfo() {

    const verify = this.signupForm.value.category;
    if(verify == ''){

      const uid =this.id;
      const data = this.userData;
      this.dataService.updateUser(uid, data);
    
    }
    else{
      const uid =this.id;
      const data = this.userData;
      const fomrValue =this.signupForm.value.category;
      let category = null;

      if (this.allcategories) {
        category = this.allcategories.find((cat: { id: any; }) => cat.id === fomrValue);
      }
      const registerForm = {
        ...data,
        category: category
      };
      
      
     this.dataService.updateUser(uid, registerForm);
   //   console.log('SEND DATA :  | ',registerForm);
    }

   
    const toast = await this.toastCrtl.create({
      message: 'Utilizador atualizado com sucesso!',
      duration: 1000
    });
    this.modalCrtl.dismiss();
    toast.present();
  }
  async deleteNote() {
   // await this.dataService.deleteNote(this.note);
    const toast = await this.toastCrtl.create({
      message: 'Utilizador apagado!',
      duration: 1000
    });
    toast.present();
    this.modalCrtl.dismiss();
  }
  
  // async deleteUser() {
  //   const alert = await this.alertController.create({
  //     header: 'Confirmar Exclusão',
  //     message: 'Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.',
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel'
  //       },
  //       {
  //         text: 'Excluir',
  //         handler: async () => {
  //           try {
  //             // Call the auth service to delete the user
  //             await this.authService.deleteUser(this.id);
              
  //             const toast = await this.toastCrtl.create({
  //               message: 'Utilizador excluído com sucesso!',
  //               duration: 2000
  //             });
  //             await toast.present();
  //             this.modalCrtl.dismiss({ deleted: true });
  //           } catch (error) {
  //             console.error('Erro ao excluir usuário:', error);
  //             const errorToast = await this.toastCrtl.create({
  //               message: 'Falha ao excluir usuário. Por favor, tente novamente.',
  //               duration: 2000,
  //               color: 'danger'
  //             });
  //             await errorToast.present();
  //           }
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }
  pushLog(msg: string) {
    this.logs.pop();
  this.logs.unshift(msg);
  }

  handleChange(e: any) {
    const msg = 'Acabaste de trocar a categoria!';
    this.showAlert(msg);
    this.logs = [''];
    //this.pushLog(e.detail.value);

   // const data = this.userData;

   //  console.log('categoriaXXX: ', registerForm);
  }
  async showAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
}
// async deleteUser() {
//   const alert = await this.alertController.create({
//     header: 'Confirmar Exclusão',
//     message: 'Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.',
//     buttons: [
//       {
//         text: 'Cancelar',
//         role: 'cancel'
//       },
//       {
//         text: 'Excluir',
//         handler: async () => {
//           try {
//             await this.authService.deleteUser(this.id);
            
//             const toast = await this.toastCrtl.create({
//               message: 'Utilizador excluído com sucesso!',
//               duration: 2000
//             });
//             await toast.present();
//             this.modalCrtl.dismiss({ deleted: true });
//           } catch (error) {
//             console.error('Erro ao excluir usuário:', error);
//             let errorMessage = 'Falha ao excluir usuário. Por favor, tente novamente.';
            
//             if (error instanceof Error) {
//               errorMessage = error.message;
//             }
            
//             const errorToast = await this.toastCrtl.create({
//               message: errorMessage,
//               duration: 2000,
//               color: 'danger'
//             });
//             await errorToast.present();
//           }
//         }
//       }
//     ]
//   });
//   await alert.present();
// }
async setCurrentUserAsAdmin() {
  try {
    await this.authService.setCurrentUserAsAdmin();
    const toast = await this.toastCrtl.create({
      message: 'Você agora é um administrador!',
      duration: 2000
    });
    await toast.present();
  } catch (error) {
    console.error('Erro ao definir usuário como administrador:', error);
    const errorToast = await this.toastCrtl.create({
      message: 'Falha ao definir usuário como administrador.',
      duration: 2000,
      color: 'danger'
    });
    await errorToast.present();
  }
}

async deleteUser() {
  const alert = await this.alertController.create({
    header: 'Confirmar Exclusão',
    message: 'Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Excluir',
        handler: async () => {
          try {
            await this.authService.deleteUser(this.id);
            
            const toast = await this.toastCrtl.create({
              message: 'Utilizador excluído com sucesso!',
              duration: 2000
            });
            await toast.present();
            this.modalCrtl.dismiss({ deleted: true });
          } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            let errorMessage = 'Falha ao excluir usuário. Por favor, tente novamente.';
            
            if (error instanceof Error) {
              errorMessage = error.message;
            }
            
            const errorToast = await this.toastCrtl.create({
              message: errorMessage,
              duration: 2000,
              color: 'danger'
            });
            await errorToast.present();
          }
        }
      }
    ]
  });
  await alert.present();
}
}
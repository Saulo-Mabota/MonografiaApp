import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { CancelOptions, LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { AlertController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataFlagService } from 'src/app/services/flags/data-flag.service';
import { AnalyticsService } from 'src/app/services/ga/analytics.service';
import { Storage } from '@ionic/storage-angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // Declaração de propriedades
  form!: FormGroup;
  isTypePassword: boolean = true;
  isLoading = false;
  uCategory!: string; // Flag para armazenar a categoria do usuário
  enabled = this.analyticsService.analyticsEnabled;
  darkMode = false;
  //platform: any;

  constructor(
    // Injeção de serviços e dependências
    private analyticsService: AnalyticsService,
    private router: Router,
    private dataFlag: DataFlagService,
    private authService: AuthService,
    private storage: Storage,
    private platform: Platform,
    private alertController: AlertController
  ) {
    this.initForm(); // Inicializa o formulário de login
  }

  ngOnInit(): void {
    this.checkAppMode(); // Verifica o modo de aplicativo (modo claro ou escuro)
  }

  async checkAppMode() {
    // Verifica se o modo escuro está ativado e aplicar as configurações
    const checkIsDarkMode = await Preferences.get({ key: 'darkModeActivated' });
    checkIsDarkMode?.value == 'true'
      ? (this.darkMode = true)
      : (this.darkMode = false);
    document.body.classList.toggle('dark', this.darkMode);
  }

  // Método para alternar o modo escuro
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if (this.darkMode) {
      Preferences.set({ key: 'darkModeActivated', value: 'true' });
    } else {
      Preferences.set({ key: 'darkModeActivated', value: 'false' });
    }
  }

  // Método para agendar uma notificação local
  async scheduleNotification() {
    let options: ScheduleOptions = {
      notifications: [
        {
          id: 111,
          title: 'Explora',
          body: 'Lembrete',
          largeBody: 'XXXXX oce',
          summaryText: 'Empolgante',
        },
      ],
    };
    try {
      await LocalNotifications.schedule(options);
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  // Método para cancelar uma notificação local
  async cancelNotification() {
    let op: CancelOptions = {
      notifications: [{ id: 222 }],
    };
    await LocalNotifications.cancel(op);
  }

  // Método para remover todas as notificações entregues
  async removeAllDeliveredNotifications() {
    await LocalNotifications.removeAllDeliveredNotifications();
  }

  setUser() {
    // Define o usuário para fins de análise (possivelmente usando o serviço 'analyticsService')
    console.log('setUserId: ');
  }

  setProperty() {
    // Define propriedades do usuário para fins de análise (possivelmente usando o serviço 'analyticsService')
  }

  logEvent(eventName: string, params?: object) {
    // Registra eventos para fins de análise (possivelmente usando o serviço 'analyticsService')
    this.analyticsService.logEvent(eventName, params);
  }

  toggleAnalytics() {
    // Ativa ou desativa a análise de dados (possivelmente usando o serviço 'analyticsService')
    this.analyticsService.toggleAnalytics();
    this.enabled = this.analyticsService.analyticsEnabled;
  }

  // Método para inicializar o formulário de login
  initForm() {
    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      rememberMe: new FormControl(false), // Adiciona o controle 'rememberMe' ao formulário
    });
  }

  // Método chamado quando a opção 'Mostrar Senha' é alternada
  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  // Método chamado quando o formulário de login é enviado
  onSubmit() {
    if (!this.form.valid) return;
    console.log(this.form.value);
    this.login(this.form); // Inicia o processo de login
  }

  // Método para realizar o processo de login
  login(form: FormGroup<any>) {
    this.isLoading = true;
    console.log(form!.value);

    const email = form!.value.email;
    const password = form!.value.password;
    const rememberMe = form!.value.rememberMe;

    // Efetua a chamada para o serviço de autenticação para fazer a verificação e autenticação do usuário
    this.authService.login(form!.value.email, form!.value.password).then(
      (data: any) => {
        console.log(data);
        // Reseta variáveis para nulo ou indefinido
        this.dataFlag.setuCategory('');
        this.dataFlag.setIsAdmin(false);

        // Obtém os dados do usuário autenticado e define a categoria do usuário ('uCategory')
        this.authService.getAllUserData().then(
          (user: any) => {
            this.dataFlag.setuCategory(user.categoryName);
            const uData = user.categoryName;

            if (uData === 'Administraçāo') {
              this.dataFlag.setIsAdmin(true); // Define a flag 'isAdmin' como verdadeira se o usuário for da categoria 'Administraçāo'
            } else {
              this.dataFlag.setIsAdmin(false); // Define a flag 'isAdmin' como falsa para outras categorias de usuário
            }

            this.router.navigateByUrl('/tabs'); // Redireciona para a página de tabs após o login
            this.isLoading = false;
            form!.reset(); // Reseta o formulário de login após o login bem-sucedido
          },
          (err: any) => {
            console.error('Error: Não foi possível fazer o login:', err);
          }
        );
      }
    ).catch(e => {
      console.log(e);
      this.isLoading = false;
      let msg: string = 'Não foi possível fazer o login, tente novamente.';
      if (e.code == 'auth/user-not-found')
        msg = 'Email não encontrado';
      else if (e.code == 'auth/wrong-password')
        msg = 'Por favor, escreva uma palavra-passe correta.';

      this.showAlert(msg); // Mostra um alerta com a mensagem de erro, caso ocorra algum erro no processo de login
    });
  }

  // Método para mostrar um alerta
  async showAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }
}

 // async login(form: FormGroup<any>) {
  //   this.isLoading = true;
  //   console.log(form!.value);
  //   try {
  //     const data = await this.authService.login(form!.value.email, form!.value.password);
  //     //console.log(data);

  //     const currentUserData = await this.authService.getCurrentUserCategoryNome();
  //     const currentUserCategoryNome = currentUserData.category.nome;
  //     console.log("XXXX: ", currentUserCategoryNome); // prints the value of `category.nome` for the current user
  //     this.router.navigateByUrl('/tabs');
  //     // Pass data to tabs2 route using NavigationExtras
  //     const navigationExtras: NavigationExtras = {
  //       state: {
  //         currentUserCategoryNome: currentUserCategoryNome
  //       }
  //     };

  //     this.isLoading = false;
  //     form!.reset();
  //   } catch (e: any) {
  //     console.log(e);
  //     this.isLoading = false;
  //     let msg: string = 'Could NOT login, please try again.';
  //     if (e.code == 'auth/user-not-found')
  //       msg = 'Email address could not be found';
  //     else if (e.code == 'auth/wrong-password')
  //       msg = 'Please enter a correct password';

  //     this.showAlert(msg);
  //   }
  // }
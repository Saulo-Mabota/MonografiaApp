import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { contactenosPage } from './contactenos.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; //NEEDED TO USER SLIDES
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
// import { ComponentsModule } from '../components/components.module';
// import { UserListComponent } from '../components/user-list/user-list.component';


const routes: Routes = [
  {
    path: '',
    component: contactenosPage,
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'chat/:id',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  }
];

@NgModule({
  imports: [ FormsModule,
    IonicModule,RouterModule.forChild(routes)],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //NEEDED TO USER SLIDES
 

})
export class contactenosPageRoutingModule {}

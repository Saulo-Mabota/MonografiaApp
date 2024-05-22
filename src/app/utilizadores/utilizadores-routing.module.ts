import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { utilizadoresPage } from './utilizadores.page';

const routes: Routes = [
  {
    path: '',
    component: utilizadoresPage,
  },
  {
    path: 'adduser',
    loadChildren: () => import('./adduser/adduser.module').then( m => m.AdduserPageModule)
  },
  {
    path: 'openuser',
    loadChildren: () => import('./openuser/openuser.module').then( m => m.OpenuserPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class utilizadoresPageRoutingModule {}

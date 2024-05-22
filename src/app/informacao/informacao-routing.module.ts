import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { informacaoPage } from './informacao.page';

const routes: Routes = [
  {
    path: '',
    component: informacaoPage,
  },
  {
    path: 'opennote',
    loadChildren: () => import('./opennote/opennote.module').then( m => m.OpennotePageModule)
  },
  {
    path: 'addnote',
    loadChildren: () => import('./addnote/addnote.module').then( m => m.AddnotePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class informacaoPageRoutingModule {}

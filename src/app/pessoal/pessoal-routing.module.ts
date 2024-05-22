import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { pessoalPage } from './pessoal.page';

const routes: Routes = [
  {
    path: '',
    component: pessoalPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class pessoalPageRoutingModule {}

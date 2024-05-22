import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpennotePage } from './opennote.page';

const routes: Routes = [
  {
    path: '',
    component: OpennotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpennotePageRoutingModule {}

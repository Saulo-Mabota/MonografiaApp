import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpenuserPageRoutingModule } from './openuser-routing.module';

import { OpenuserPage } from './openuser.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
     ReactiveFormsModule,
    OpenuserPageRoutingModule
  ],
  declarations: [OpenuserPage]
})
export class OpenuserPageModule {}

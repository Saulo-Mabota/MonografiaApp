import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdduserPageRoutingModule } from './adduser-routing.module';

import { AdduserPage } from './adduser.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, 
    ReactiveFormsModule,
    AdduserPageRoutingModule
  ],
  declarations: [AdduserPage]
})
export class AdduserPageModule {}

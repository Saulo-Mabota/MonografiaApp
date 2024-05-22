import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddnotePageRoutingModule } from './addnote-routing.module';

import { AddnotePage } from './addnote.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddnotePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddnotePage]
})
export class AddnotePageModule {}

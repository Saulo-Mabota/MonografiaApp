import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { informacaoPage } from './informacao.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { informacaoPageRoutingModule } from './informacao-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    informacaoPageRoutingModule
  ],
  declarations: [informacaoPage]
})
export class informacaoPageModule {}

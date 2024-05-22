import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { utilizadoresPage } from './utilizadores.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { utilizadoresPageRoutingModule } from './utilizadores-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    utilizadoresPageRoutingModule
  ],
  declarations: [utilizadoresPage]
})
export class utilizadoresPageModule {}

import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { pessoalPage } from './pessoal.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { pessoalPageRoutingModule } from './pessoal-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    pessoalPageRoutingModule
  ],
  declarations: [pessoalPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //NEEDED TO USER SLIDES
})
export class pessoalPageModule {}

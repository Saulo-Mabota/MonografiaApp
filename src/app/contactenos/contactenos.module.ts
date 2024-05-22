import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { contactenosPage } from './contactenos.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { contactenosPageRoutingModule } from './contactenos-routing.module';
import { UserListComponent } from '../components/user-list/user-list.component';
import { ComponentsModule } from '../components/components.module';
// import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ComponentsModule,
    contactenosPageRoutingModule
  ],
  declarations: [contactenosPage, UserListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //NEEDED TO USER SLIDES
})
export class contactenosPageModule {}

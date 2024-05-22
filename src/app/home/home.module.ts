import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { homePage } from './home.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; //NEEDED TO USER SLIDES
import { homePageRoutingModule } from './home-routing.module';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    homePageRoutingModule,
  ],
  declarations: [homePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //NEEDED TO USER SLIDES

})
export class homePageModule {}

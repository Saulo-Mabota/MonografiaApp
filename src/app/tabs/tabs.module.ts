import { IonicModule } from '@ionic/angular';
import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { DirectivesModule } from '../directives/directives.module';
import { ComponentsModule } from '../components/components.module';
import { UserListComponent } from '../components/user-list/user-list.component';
import { GuardGuard } from '../services/guards/guard.guard';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ComponentsModule,
    DirectivesModule,

  ],
  declarations: [TabsPage],
 providers: [GuardGuard], // Provide the GuardGuard here
})
export class TabsPageModule {}

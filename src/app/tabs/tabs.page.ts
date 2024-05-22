import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { DataFlagService } from '../services/flags/data-flag.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('tabs') tabs!: IonTabs;
  isAdmin: any;

  constructor(private dataFlag: DataFlagService) { 
    this.isAdmin = this.dataFlag.getIsAdmin();
     console.log('TABS FLAG: ',this.isAdmin);
  }
  onSwipe(event:any) {
  //console.log('1st: ',event);
    if(event?.swipeType == "moveend"){
     // console.log('2nd: ', event);
      const currentTab = this.tabs.getSelected();
     // console.log('currentTab: ', currentTab);
      const nextTab = this.getNextTab(currentTab, event?.dirX);
    //  console.log(nextTab);
      if(nextTab) this.tabs.select(nextTab);
    }
  }
  getNextTab(currentTab: any, direction: string) {
    switch (currentTab) {
      case 'home':
        if (direction === 'left') return 'pessoal';
        else return null;
      case 'pessoal':
        if (direction === 'right') return 'home';
        else return 'contactenos';
      case 'contactenos':
        if (direction === 'right') return 'pessoal';
        else return 'utilizadores';
      case 'utilizadores':
        if (direction === 'right') return 'contactenos';
        else return 'informacao';
      case 'informacao':
        if (direction === 'right') return 'utilizadores';
        else return null;
      default:
        return null;
    }
  }
}

  // getNextTab(currentTab: any, direction: string) {
  //   switch(currentTab) {
  //     case 'home': if(direction == 'left')  return 'pessoal'; else return null;
  //     case 'pessoal': if(direction == 'right') return 'home'; else return 'contactenos';
  //     case 'contactenos': if(direction == 'right') return 'pessoal'; else return null;
  //     default:  return null;
  //   }
  // }
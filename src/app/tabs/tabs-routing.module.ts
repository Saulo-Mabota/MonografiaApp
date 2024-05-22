import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { GuardGuard } from '../services/guards/guard.guard';
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.homePageModule)
        ,canActivate:[GuardGuard]
      },
      {
        path: 'pessoal',
        loadChildren: () => import('../pessoal/pessoal.module').then(m => m.pessoalPageModule),
        canActivate:[GuardGuard]
      },
      {
        path: 'contactenos',
        loadChildren: () => import('../contactenos/contactenos.module').then(m => m.contactenosPageModule),
        canActivate:[GuardGuard]
      },
      {
        path: 'utilizadores',
        loadChildren: () => import('../utilizadores/utilizadores.module').then(m => m.utilizadoresPageModule),
        canActivate:[GuardGuard],canLoad:[GuardGuard]
      },
      {
        path: 'informacao',
        loadChildren: () => import('../informacao/informacao.module').then(m => m.informacaoPageModule),
        canActivate:[GuardGuard], canLoad:[GuardGuard]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}

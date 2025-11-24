import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcessosComponent } from './processos/processos.component';
import { ProcessoDetalhesComponent } from './processos/processo-detalhes/processo-detalhes.component';
import { AgendaComponent } from './agenda/agenda.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'processos',
    component: ProcessosComponent
  },
  {
    path: 'processos/:id',
    component: ProcessoDetalhesComponent
  },
  {
    path: 'agenda',
    component: AgendaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvogadoRoutingModule { }

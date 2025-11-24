import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcessosDisponiveisComponent } from './processos-disponiveis/processos-disponiveis.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { VerificacaoComponent } from './verificacao/verificacao.component';
// import { SindicadosComponent } from './usuarios/sindicados/sindicados.component';

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
    path: 'processos-disponiveis',
    component: ProcessosDisponiveisComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'verificacao',
    component: VerificacaoComponent
  },
  // {
  //   path: 'usuarios/sindicados',
  //   component: SindicadosComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

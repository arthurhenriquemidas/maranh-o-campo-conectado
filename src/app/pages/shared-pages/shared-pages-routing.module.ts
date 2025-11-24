import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AjudaComponent } from './ajuda/ajuda.component';
import { FaqComponent } from './faq/faq.component';
import { ProcessoDetalhesComponent } from './processo-detalhes/processo-detalhes.component';
import { ChatComponent } from './chat/chat.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  {
    path: 'ajuda',
    component: AjudaComponent
  },
  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: 'duvidas-frequentes',
    redirectTo: 'faq',
    pathMatch: 'full'
  },
  {
    path: 'processo/:id',
    component: ProcessoDetalhesComponent
  },
  {
    path: 'chat/:processoId',
    component: ChatComponent
  },
  {
    path: 'documentos/:processoId',
    component: DocumentosComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent
  },
  {
    path: '',
    redirectTo: 'ajuda',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedPagesRoutingModule { }

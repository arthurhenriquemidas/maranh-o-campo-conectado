import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { SobreNosComponent } from './sobre-nos/sobre-nos.component';
import { AjudaComponent } from './ajuda/ajuda.component';
import { SejaAdvogadoComponent } from './seja-advogado/seja-advogado.component';
import { BlogComponent } from './blog/blog.component';
import { TermosDeUsoComponent } from './termos-de-uso/termos-de-uso.component';
import { PoliticaDePrivacidadeComponent } from './politica-de-privacidade/politica-de-privacidade.component';
import { LgpdComponent } from './lgpd/lgpd.component';
import { ComplianceComponent } from './compliance/compliance.component';
import { ContatoComponent } from './contato/contato.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  {
    path: 'sobre',
    component: SobreNosComponent
  },
  {
    path: 'ajuda',
    component: AjudaComponent
  },
  {
    path: 'seja-advogado',
    component: SejaAdvogadoComponent
  },
  {
    path: 'blog',
    component: BlogComponent
  },
  {
    path: 'termos-de-uso',
    component: TermosDeUsoComponent
  },
  {
    path: 'politica-de-privacidade',
    component: PoliticaDePrivacidadeComponent
  },
  {
    path: 'lgpd',
    component: LgpdComponent
  },
  {
    path: 'compliance',
    component: ComplianceComponent
  },
  {
    path: 'contato',
    component: ContatoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }

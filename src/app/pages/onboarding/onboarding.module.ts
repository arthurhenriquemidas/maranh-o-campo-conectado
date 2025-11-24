import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

import { OnboardingRoutingModule } from './onboarding-routing.module';
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
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    WelcomeComponent,
    SobreNosComponent,
    AjudaComponent,
    SejaAdvogadoComponent,
    BlogComponent,
    TermosDeUsoComponent,
    PoliticaDePrivacidadeComponent,
    LgpdComponent,
    ComplianceComponent,
    ContatoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    OnboardingRoutingModule,
    // PrimeNG
    ButtonModule,
    CardModule,
    DividerModule,
    InputTextModule,
    InputTextareaModule,
    InputMaskModule,
    PasswordModule,
    MultiSelectModule,
    MessageModule,
    ToastModule
  ]
})
export class OnboardingModule { }

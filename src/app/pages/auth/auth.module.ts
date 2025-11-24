import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputMaskModule } from 'primeng/inputmask';
import { MultiSelectModule } from 'primeng/multiselect';
// import { FloatLabelModule } from 'primeng/floatlabel'; // Pode não estar disponível na versão atual
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { TagModule } from 'primeng/tag';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegisterWizardComponent } from './register-wizard/register-wizard.component';

// Shared Module
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    RegisterWizardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    // Shared Module
    SharedModule,
    // PrimeNG
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    DividerModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
    StepsModule,
    ToastModule,
    RadioButtonModule,
    InputMaskModule,
    MultiSelectModule,
    // FloatLabelModule,
    PanelModule,
    FieldsetModule,
    TagModule
  ]
})
export class AuthModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MenubarModule } from 'primeng/menubar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { SkeletonModule } from 'primeng/skeleton';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcessosDisponiveisComponent } from './processos-disponiveis/processos-disponiveis.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { VerificacaoComponent } from './verificacao/verificacao.component';
import { AssinaturasComponent } from './assinaturas/assinaturas.component';
import { AdminHeaderComponent } from './shared/admin-header.component';
// import { SindicadosComponent } from './usuarios/sindicados/sindicados.component';
// import { GerenciarProcessosComponent } from './usuarios/sindicados/gerenciar-processos/gerenciar-processos.component';
import { MessageService } from 'primeng/api';
// import { SindicadosMockService } from '../../../assets/mock/sindicados-mock.service';

@NgModule({
  declarations: [
    DashboardComponent,
    ProcessosDisponiveisComponent,
    UsuariosComponent,
    VerificacaoComponent,
    AssinaturasComponent,
    AdminHeaderComponent
    // SindicadosComponent,
    // GerenciarProcessosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    // PrimeNG
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    MenubarModule,
    BreadcrumbModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    SkeletonModule,
    ChartModule,
    ProgressBarModule,
    AvatarModule,
    BadgeModule,
    ToastModule,
    ConfirmDialogModule,
    DividerModule,
    MultiSelectModule,
    CalendarModule,
    InputTextareaModule,
    TooltipModule,
    FileUploadModule,
    TabViewModule
  ],
  providers: [
    MessageService
    // SindicadosMockService
  ]
})
export class AdminModule { }

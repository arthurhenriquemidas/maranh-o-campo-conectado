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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { SkeletonModule } from 'primeng/skeleton';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';

import { ClienteRoutingModule } from './cliente-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcessosComponent } from './processos/processos.component';
import { ClienteHeaderComponent } from './shared/cliente-header.component';
import { NovoProcessoDialogComponent } from './processos/novo-processo-dialog/novo-processo-dialog.component';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    DashboardComponent,
    ProcessosComponent,
    ClienteHeaderComponent,
    NovoProcessoDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ClienteRoutingModule,
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
    InputTextareaModule,
    CalendarModule,
    SkeletonModule,
    FileUploadModule,
    InputNumberModule,
    TabViewModule
  ],
  providers: [
    MessageService
  ]
})
export class ClienteModule { }

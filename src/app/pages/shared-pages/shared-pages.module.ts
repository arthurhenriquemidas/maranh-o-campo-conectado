import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { MenubarModule } from 'primeng/menubar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';

import { SharedPagesRoutingModule } from './shared-pages-routing.module';
import { AjudaComponent } from './ajuda/ajuda.component';
import { FaqComponent } from './faq/faq.component';
import { ProcessoDetalhesComponent } from './processo-detalhes/processo-detalhes.component';
import { ChatComponent } from './chat/chat.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { SharedHeaderComponent } from './shared/shared-header.component';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AjudaComponent,
    FaqComponent,
    ProcessoDetalhesComponent,
    ChatComponent,
    DocumentosComponent,
    PerfilComponent,
    SharedHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPagesRoutingModule,
    // PrimeNG
    CardModule,
    ButtonModule,
    AccordionModule,
    DividerModule,
    MenubarModule,
    BreadcrumbModule,
    TagModule,
    ProgressBarModule,
    TimelineModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    ToastModule,
    ConfirmDialogModule,
    TabViewModule,
    PanelModule,
    SkeletonModule,
    DropdownModule,
    RadioButtonModule,
    CalendarModule,
    MultiSelectModule,
    InputNumberModule,
    TooltipModule
  ],
  providers: [
    MessageService
  ]
})
export class SharedPagesModule { }

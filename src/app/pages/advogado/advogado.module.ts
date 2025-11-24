import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenubarModule } from 'primeng/menubar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { TimelineModule } from 'primeng/timeline';
import { ListboxModule } from 'primeng/listbox';
import { LoadingStateComponent } from '../shared-pages/loading-state/loading-state.component';
import { AdvogadoRoutingModule } from './advogado-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcessosComponent } from './processos/processos.component';
import { ProcessoDetalhesComponent } from './processos/processo-detalhes/processo-detalhes.component';
import { AgendaComponent } from './agenda/agenda.component';
import { AdvogadoHeaderComponent } from './shared/advogado-header.component';
import { MessageService } from 'primeng/api';
import { EmptyStateComponent } from '../shared-pages/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../shared-pages/status-badge/status-badge.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProcessosComponent,
    ProcessoDetalhesComponent,
    AgendaComponent,
    AdvogadoHeaderComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    StatusBadgeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdvogadoRoutingModule,
    // PrimeNG Modules
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    ProgressBarModule,
    MenubarModule,
    BreadcrumbModule,
    ToastModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    InputTextareaModule,
    ChartModule,
    SkeletonModule,
    PanelModule,
    AccordionModule,
    TimelineModule,
    ListboxModule
  ],
  providers: [
    MessageService
  ]
})
export class AdvogadoModule { }

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { BreadcrumbService } from 'src/app/core/services/breadcrumb.service';
import { MockProcessService } from 'src/app/core/services/mock-process.service';
import { DataState, emptyState, errorState, loadingState, successState } from 'src/app/shared/types/data-state';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthUser } from 'src/app/core/models/user.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

export interface LegalProcess {
  id: string;
  reference: string;
  title: string;
  area: string;
  createdAt: string;
  updatedAt: string;
  status: ProcessStatus;
  slaHours?: number;
  nextDeadline?: string;
  priority: 'baixa' | 'media' | 'alta';
  customerId: string;
  customerName: string;
  customerPlan: 'gratuito' | 'premium';
  lawyerId?: string;
  lawyerName?: string;
  description: string;
  tags: string[];
  allowUploads: boolean;
  timeline: ProcessTimelineEntry[];
  documents: DocumentSummary[];
}

export interface DocumentSummary {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  size: string;
}

export interface ProcessTimelineEntry {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  role: 'cliente' | 'advogado' | 'admin';
  statusAfter?: ProcessStatus;
  attachments?: DocumentSummary[];
}

export type ProcessStatus =
  | 'ABERTO'
  | 'EM_ANDAMENTO'
  | 'AGUARDANDO_CLIENTE'
  | 'CONCLUIDO'
  | 'ARQUIVADO';

interface ListViewModel {
  processes: LegalProcess[];
  total: number;
}

@Component({
    selector: 'app-processo',
    templateUrl: './processos.component.html',
    styleUrls: ['./processos.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ProcessosComponent implements OnInit, OnDestroy {
  private readonly currentLawyerId = 'adv-001';
  private readonly reload$ = new BehaviorSubject<void>(undefined);

  // Usuário e Breadcrumb
  currentUser: AuthUser | null = null;
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};
  hasNotifications = true;

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly statusControl = new FormControl<ProcessStatus | 'todos'>('todos', { nonNullable: true });

  readonly statuses: Array<{ label: string; value: ProcessStatus | 'todos' }> = [
    { label: 'Todos', value: 'todos' },
    { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
    { label: 'Aguardando Cliente', value: 'AGUARDANDO_CLIENTE' },
    { label: 'Concluído', value: 'CONCLUIDO' }
  ];

  state$!: Observable<DataState<ListViewModel>>;

  private readonly subscriptions: Array<{ unsubscribe: () => void }> = [];

  constructor(
    private readonly processService: MockProcessService,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly router: Router
  ) {
    this.setupDataStream();
  }

  private setupDataStream(): void {
    this.state$ = combineLatest([
      this.reload$,
      this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
      this.statusControl.valueChanges.pipe(startWith(this.statusControl.value))
    ]).pipe(
      switchMap(([, search, status]) =>
        this.processService.getProcesses().pipe(
          map(processes => {
            // Filtrar processos do advogado atual
            const lawyerProcesses = processes.filter(item => item.lawyerId === this.currentLawyerId);
            
            // Aplicar filtros de busca e status
            const filteredProcesses = this.filterProcesses(lawyerProcesses, search, status);
            
            // Retornar estado apropriado
            if (filteredProcesses.length > 0) {
              return successState<ListViewModel>({ 
                processes: filteredProcesses, 
                total: filteredProcesses.length 
              });
            } else {
              return emptyState<ListViewModel>();
            }
          }),
          catchError(error => {
            console.error('Erro ao carregar processos:', error);
            return of(errorState<ListViewModel>(error));
          }),
          startWith(loadingState<ListViewModel>())
        )
      )
    );
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.setupBreadcrumb();
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Forçar carregamento inicial dos dados
    this.reload$.next();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  refresh(): void {
    this.processService.refresh().subscribe({
      next: () => {
        this.reload$.next();
        this.messageService.add({
          severity: 'success',
          summary: 'Dados Atualizados',
          detail: 'Lista de processos foi atualizada com sucesso!'
        });
      },
      error: (error) => {
        console.error('Erro ao atualizar dados:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro na Atualização',
          detail: 'Não foi possível atualizar os dados. Tente novamente.'
        });
      }
    });
  }

  private filterProcesses(processes: LegalProcess[], search: string, status: ProcessStatus | 'todos'): LegalProcess[] {
    const term = search.trim().toLowerCase();
    let filtered = processes;

    // Filtrar por status
    if (status !== 'todos') {
      filtered = filtered.filter(item => item.status === status);
    }

    // Filtrar por termo de busca
    if (term) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.reference.toLowerCase().includes(term) ||
        item.customerName.toLowerCase().includes(term) ||
        item.area.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        item.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return filtered;
  }


  private setupBreadcrumb(): void {
    this.breadcrumbHome = {
      icon: 'pi pi-home',
      routerLink: ['/advogado/dashboard']
    };

    this.breadcrumbItems = [
      {
        label: 'Processos',
        routerLink: ['/advogado/processos']
      }
    ];
  }

  getStatusLabel(status: ProcessStatus | 'todos'): string {
    const statusMap: Record<ProcessStatus | 'todos', string> = {
      'todos': 'Todos',
      'ABERTO': 'Aberto',
      'EM_ANDAMENTO': 'Em Andamento',
      'AGUARDANDO_CLIENTE': 'Aguardando Cliente',
      'CONCLUIDO': 'Concluído',
      'ARQUIVADO': 'Arquivado'
    };
    return statusMap[status] || status;
  }

  clearAllFilters(): void {
    this.searchControl.setValue('');
    this.statusControl.setValue('todos');
  }

  mostrarOpcoes(processo: LegalProcess, event: Event): void {
    // Implementar menu de opções se necessário
    console.log('Opções do processo:', processo);
  }

  verProcesso(processo: LegalProcess): void {
    this.router.navigate(['/shared/processo', processo.id]);
  }

  iniciarChat(processo: LegalProcess): void {
    this.router.navigate(['/shared/chat', processo.id]);
  }

  // Métodos de callback do header
  onLogout(): void {
    // O logout já é tratado no header component
  }

  onNotifications(): void {
    // As notificações já são tratadas no header component
  }

  onProfile(): void {
    // O perfil já é tratado no header component
  }

}

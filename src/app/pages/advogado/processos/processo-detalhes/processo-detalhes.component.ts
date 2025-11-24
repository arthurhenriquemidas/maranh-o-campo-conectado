import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, startWith, switchMap } from 'rxjs';
import { BreadcrumbService } from 'src/app/core/services/breadcrumb.service';
import { MockProcessService } from 'src/app/core/services/mock-process.service';
import { DataState, emptyState, errorState, loadingState, successState } from 'src/app/shared/types/data-state';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthUser } from 'src/app/core/models/user.model';
import { MessageService } from 'primeng/api';
import { LegalProcess, ProcessStatus, DocumentSummary, ProcessTimelineEntry } from '../processos.component';

@Component({
  selector: 'app-processo-detalhes',
  templateUrl: './processo-detalhes.component.html',
  styleUrls: ['./processo-detalhes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ProcessoDetalhesComponent implements OnInit, OnDestroy {
  readonly reload$ = new BehaviorSubject<void>(undefined);
  private readonly subscriptions: Array<{ unsubscribe: () => void }> = [];

  // Usuário e Menu
  currentUser: AuthUser | null = null;
  menuItems: MenuItem[] = [];
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};
  hasNotifications = true;

  // Mobile States
  mobileMenuOpen = false;
  mobileActionsOpen = false;

  // Estado dos dados
  state$!: Observable<DataState<LegalProcess>>;
  processId: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly processService: MockProcessService,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService
  ) {
    this.setupDataStream();
  }

  private setupDataStream(): void {
    this.state$ = this.reload$.pipe(
      switchMap(() =>
        this.processService.getProcesses().pipe(
          map(processes => {
            const process = processes.find(p => p.id === this.processId);
            if (process) {
              return successState<LegalProcess>(process);
            } else {
              return emptyState<LegalProcess>();
            }
          }),
          catchError(error => {
            console.error('Erro ao carregar processo:', error);
            return of(errorState<LegalProcess>(error));
          }),
          startWith(loadingState<LegalProcess>())
        )
      )
    );
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.setupMenu();
    this.setupBreadcrumb();
    this.loadProcessId();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadProcessId(): void {
    this.route.params.subscribe(params => {
      this.processId = params['id'];
      if (this.processId) {
        this.reload$.next();
      }
    });
  }

  private setupMenu(): void {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/advogado/dashboard']
      },
      {
        label: 'Meus Processos',
        icon: 'pi pi-folder',
        routerLink: ['/advogado/processos']
      },
      // {
      //   label: 'Agenda',
      //   icon: 'pi pi-calendar',
      //   routerLink: ['/advogado/agenda']
      // }
    ];
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
      },
      {
        label: 'Detalhes',
        routerLink: ['/advogado/processos', this.processId]
      }
    ];
  }

  requestApproval(process: LegalProcess): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Solicitação Enviada',
      detail: `Solicitação de aprovação enviada para o processo ${process.reference}`
    });
  }

  reassignProcess(process: LegalProcess): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Reatribuição',
      detail: `Processo ${process.reference} será reatribuído`
    });
  }

  openNotifications(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Notificações',
      detail: 'Sistema de notificações será implementado em breve'
    });
  }

  logout(): void {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Logout realizado',
      detail: 'Você foi desconectado com sucesso!'
    });
    this.router.navigate(['/onboarding/welcome']);
  }

  goBack(): void {
    this.router.navigate(['/advogado/processos']);
  }

  // Mobile Menu Methods
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  // Mobile Actions Methods
  toggleMobileActions(): void {
    this.mobileActionsOpen = !this.mobileActionsOpen;
  }

  closeMobileActions(): void {
    this.mobileActionsOpen = false;
  }
}

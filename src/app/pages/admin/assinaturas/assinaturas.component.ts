import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { 
  AssinaturaEletronica, 
  TermoLGPD,
  EstatisticasAssinatura, 
  FiltroAssinatura, 
  StatusAssinatura 
} from '../../../core/models/assinatura.model';
import { AssinaturaService } from '../../../core/services/assinatura.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-assinaturas',
  templateUrl: './assinaturas.component.html',
  styleUrls: ['./assinaturas.component.scss']
})
export class AssinaturasComponent implements OnInit, OnDestroy {
  
  private destroy$ = new Subject<void>();
  
  currentUser: AuthUser | null = null;
  loading = true;
  
  // Menu e Navegação
  menuItems: MenuItem[] = [];
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};

  // Dados
  assinaturas: AssinaturaEletronica[] = [];
  termos: TermoLGPD[] = [];
  estatisticas: EstatisticasAssinatura = {
    totalDocumentos: 0,
    documentosPendentes: 0,
    documentosAssinados: 0,
    documentosCancelados: 0,
    tempoMedioAssinatura: 0,
    taxaAceite: 0,
    termosLGPDAtivos: 0,
    consentimentosRevogados: 0
  };

  // Filtros
  filtro: FiltroAssinatura = {};
  statusOptions: any[] = [];
  tipoDocumentoOptions: any[] = [];
  
  // Tabela
  selectedAssinaturas: AssinaturaEletronica[] = [];
  globalFilterFields = ['documentoTitulo', 'assinantes.usuarioNome', 'assinantes.usuarioEmail'];

  // Dialogs
  showDetalhesDialog = false;
  showTermosDialog = false;
  assinaturaSelecionada: AssinaturaEletronica | null = null;
  
  // Tabs
  activeTab = 0;

  constructor(
    private assinaturaService: AssinaturaService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    this.initMenu();
    this.initBreadcrumb();
    this.initOptions();
    this.loadData();
  }

  private initMenu(): void {
    this.menuItems = [
      // {
      //   label: 'Dashboard',
      //   icon: 'pi pi-home',
      //   routerLink: '/admin/dashboard'
      // },
      {
        label: 'Processos',
        icon: 'pi pi-folder',
        routerLink: '/admin/processos-disponiveis'
      },
      {
        label: '👥 Usuários',
        icon: 'pi pi-users',
        routerLink: '/admin/usuarios'
      },
      {
        label: '🔍 Verificações',
        icon: 'pi pi-shield',
        routerLink: '/admin/verificacao'
      },
      {
        label: '✍️ Assinaturas',
        icon: 'pi pi-file-edit',
        routerLink: '/admin/assinaturas',
        styleClass: 'active-menu'
      }
    ];
  }

  private initBreadcrumb(): void {
    this.breadcrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/admin/dashboard'
    };

    this.breadcrumbItems = [
      { label: 'Administração' },
      { label: 'Assinaturas Eletrônicas' }
    ];
  }

  private initOptions(): void {
    this.statusOptions = [
      { label: 'Rascunho', value: 'rascunho', severity: 'info' },
      { label: 'Aguardando', value: 'aguardando_assinaturas', severity: 'warning' },
      { label: 'Parcial', value: 'parcialmente_assinado', severity: 'info' },
      { label: 'Concluído', value: 'concluido', severity: 'success' },
      { label: 'Cancelado', value: 'cancelado', severity: 'danger' }
    ];

    this.tipoDocumentoOptions = [
      { label: 'Contrato Advogado-Cliente', value: 'contrato_advogado_cliente' },
      { label: 'Termo de Confidencialidade', value: 'termo_confidencialidade' },
      { label: 'Procuração', value: 'procuracao' },
      { label: 'Acordo de Honorários', value: 'acordo_honorarios' },
      { label: 'Termo de Uso', value: 'termo_uso' },
      { label: 'Política de Privacidade', value: 'politica_privacidade' }
    ];
  }

  private loadData(): void {
    this.loading = true;
    
    // Carregar estatísticas
    this.assinaturaService.getEstatisticas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.estatisticas = stats;
        },
        error: (error) => {
          console.error('Erro ao carregar estatísticas:', error);
        }
      });

    // Carregar assinaturas
    this.loadAssinaturas();
    
    // Carregar termos LGPD
    this.loadTermos();
  }

  private loadAssinaturas(): void {
    this.assinaturaService.getAssinaturas(this.filtro)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (assinaturas) => {
          this.assinaturas = assinaturas;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar assinaturas:', error);
          this.loading = false;
        }
      });
  }

  private loadTermos(): void {
    this.assinaturaService.getTermos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (termos) => {
          this.termos = termos;
        },
        error: (error) => {
          console.error('Erro ao carregar termos:', error);
        }
      });
  }

  onFilterChange(): void {
    this.loadAssinaturas();
  }

  clearFilters(): void {
    this.filtro = {};
    this.loadAssinaturas();
  }

  showDetalhes(assinatura: AssinaturaEletronica): void {
    this.assinaturaSelecionada = assinatura;
    this.showDetalhesDialog = true;
  }

  showTermosLGPD(): void {
    this.showTermosDialog = true;
  }

  onTabChange(event: any): void {
    this.activeTab = event.index;
  }

  getStatusSeverity(status: StatusAssinatura): 'success' | 'info' | 'warning' | 'danger' {
    return this.assinaturaService.getStatusSeverity(status);
  }

  getStatusLabel(status: StatusAssinatura): string {
    return this.assinaturaService.getStatusLabel(status);
  }

  getTipoDocumentoLabel(tipo: string): string {
    return this.assinaturaService.getTipoDocumentoLabel(tipo as any);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getProgressoAssinatura(assinatura: AssinaturaEletronica): number {
    const totalAssinantes = assinatura.assinantes.length;
    const assinados = assinatura.assinantes.filter(a => a.statusAssinatura === 'assinado').length;
    return totalAssinantes > 0 ? Math.round((assinados / totalAssinantes) * 100) : 0;
  }

  logout(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja sair?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { 
  VerificacaoIdentidade, 
  EstatisticasVerificacao, 
  FiltroVerificacao, 
  VerificacaoStatus 
} from '../../../core/models/verificacao.model';
import { VerificacaoService } from '../../../core/services/verificacao.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-verificacao',
  templateUrl: './verificacao.component.html',
  styleUrls: ['./verificacao.component.scss']
})
export class VerificacaoComponent implements OnInit, OnDestroy {
  
  private destroy$ = new Subject<void>();
  
  currentUser: AuthUser | null = null;
  loading = true;
  
  // Notificações
  hasNotifications = true;
  
  // Menu e Navegação
  menuItems: MenuItem[] = [];
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};

  // Dados
  verificacoes: VerificacaoIdentidade[] = [];
  estatisticas: EstatisticasVerificacao = {
    totalPendentes: 0,
    totalAprovados: 0,
    totalRejeitados: 0,
    totalEmAnalise: 0,
    tempoMedioAnalise: 0,
    advogadosPendentes: 0,
    clientesPendentes: 0
  };

  // Filtros
  filtro: FiltroVerificacao = {};
  statusOptions: any[] = [];
  tipoUsuarioOptions: any[] = [];
  
  // Tabela
  selectedVerificacoes: VerificacaoIdentidade[] = [];
  globalFilterFields = ['usuarioNome', 'usuarioEmail', 'id'];

  // Dialogs
  showDetalhesDialog = false;
  showAprovarDialog = false;
  showRejeitarDialog = false;
  verificacaoSelecionada: VerificacaoIdentidade | null = null;
  
  // Formulários
  observacoesAprovacao = '';
  motivoRejeicao = '';
  observacoesRejeicao = '';

  constructor(
    private verificacaoService: VerificacaoService,
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
      {
        label: ' Dashboard',
        icon: 'pi pi-home',
        routerLink: '/admin/dashboard'
      },
      {
        label: 'Processos',
        icon: 'pi pi-folder',
        routerLink: '/admin/processos-disponiveis'
      },
      {
        label: 'Usuários',
        icon: 'pi pi-users',
        routerLink: '/admin/usuarios'
      },
      {
        label: 'Verificações',
        icon: 'pi pi-shield',
        routerLink: '/admin/verificacao',
        styleClass: 'active-menu'
      }
    ];
  }

  private initBreadcrumb(): void {
    this.breadcrumbHome = { icon: 'pi pi-home', routerLink: '/admin/dashboard' };
    this.breadcrumbItems = [
      { label: 'Verificação de Identidade' }
    ];
  }

  private initOptions(): void {
    this.statusOptions = [
      { label: 'Pendente', value: 'pendente', severity: 'warning' },
      { label: 'Em Análise', value: 'em_analise', severity: 'info' },
      { label: 'Aprovado', value: 'aprovado', severity: 'success' },
      { label: 'Rejeitado', value: 'rejeitado', severity: 'danger' },
      { label: 'Docs. Pendentes', value: 'documentos_pendentes', severity: 'warning' }
    ];

    this.tipoUsuarioOptions = [
      { label: 'Cliente', value: 'cliente' },
      { label: 'Advogado', value: 'advogado' }
    ];
  }

  private loadData(): void {
    this.loading = true;
    
    // Carregar estatísticas
    this.verificacaoService.getEstatisticas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.estatisticas = stats;
        },
        error: (error) => {
          console.error('Erro ao carregar estatísticas:', error);
        }
      });

    // Carregar verificações
    this.loadVerificacoes();
  }

   public loadVerificacoes(): void {
    this.verificacaoService.getVerificacoes(this.filtro)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (verificacoes) => {
          this.verificacoes = verificacoes;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar verificações:', error);
          this.loading = false;
        }
      });
  }

  onFilterChange(): void {
    this.loadVerificacoes();
  }

  clearFilters(): void {
    this.filtro = {};
    this.loadVerificacoes();
  }

  showDetalhes(verificacao: VerificacaoIdentidade): void {
    this.verificacaoSelecionada = verificacao;
    this.showDetalhesDialog = true;
  }

  iniciarAnalise(verificacao: VerificacaoIdentidade): void {
    this.verificacaoService.iniciarAnalise(verificacao.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          if (success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Análise Iniciada',
              detail: `Análise iniciada para ${verificacao.usuarioNome}`
            });
            this.loadVerificacoes();
          }
        },
        error: (error) => {
          console.error('Erro ao iniciar análise:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao iniciar análise'
          });
        }
      });
  }

  prepararAprovacao(verificacao: VerificacaoIdentidade): void {
    this.verificacaoSelecionada = verificacao;
    this.observacoesAprovacao = '';
    this.showAprovarDialog = true;
  }

  confirmarAprovacao(): void {
    if (!this.verificacaoSelecionada) return;

    this.verificacaoService.aprovarVerificacao(
      this.verificacaoSelecionada.id,
      this.observacoesAprovacao
    ).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (success) => {
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Verificação Aprovada',
            detail: `${this.verificacaoSelecionada?.usuarioNome} foi aprovado com sucesso`
          });
          this.showAprovarDialog = false;
          this.loadVerificacoes();
        }
      },
      error: (error) => {
        console.error('Erro ao aprovar verificação:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao aprovar verificação'
        });
      }
    });
  }

  prepararRejeicao(verificacao: VerificacaoIdentidade): void {
    this.verificacaoSelecionada = verificacao;
    this.motivoRejeicao = '';
    this.observacoesRejeicao = '';
    this.showRejeitarDialog = true;
  }

  confirmarRejeicao(): void {
    if (!this.verificacaoSelecionada || !this.motivoRejeicao.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Motivo da rejeição é obrigatório'
      });
      return;
    }

    this.verificacaoService.rejeitarVerificacao(
      this.verificacaoSelecionada.id,
      this.motivoRejeicao,
      this.observacoesRejeicao
    ).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (success) => {
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Verificação Rejeitada',
            detail: `Verificação de ${this.verificacaoSelecionada?.usuarioNome} foi rejeitada`
          });
          this.showRejeitarDialog = false;
          this.loadVerificacoes();
        }
      },
      error: (error) => {
        console.error('Erro ao rejeitar verificação:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao rejeitar verificação'
        });
      }
    });
  }

  getStatusSeverity(status: VerificacaoStatus): 'success' | 'info' | 'warning' | 'danger' {
    return this.verificacaoService.getStatusSeverity(status);
  }

  getStatusLabel(status: VerificacaoStatus): string {
    return this.verificacaoService.getStatusLabel(status);
  }

  getTipoDocumentoLabel(tipo: string): string {
    return this.verificacaoService.getTipoDocumentoLabel(tipo as any);
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

  // Métodos de callback do header
  onLogout(): void {
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

  onNotifications(): void {
    // As notificações já são tratadas no header component
  }

  onProfile(): void {
    // O perfil já é tratado no header component
  }

  // Métodos adicionais
  aprovarEmLote(): void {
    if (this.selectedVerificacoes.length === 0) return;
    
    this.confirmationService.confirm({
      message: `Tem certeza que deseja aprovar ${this.selectedVerificacoes.length} verificações?`,
      header: 'Aprovar em Lote',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Verificações Aprovadas',
          detail: `${this.selectedVerificacoes.length} verificações foram aprovadas com sucesso`
        });
        this.selectedVerificacoes = [];
        this.loadVerificacoes();
      }
    });
  }

  exportarRelatorio(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Relatório Exportado',
      detail: 'Relatório de verificações foi gerado com sucesso.'
    });
  }

  getInitials(nome: string): string {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  logout(): void {
    this.onLogout();
  }

  // Métodos para busca elegante
  clearSearch(): void {
    this.filtro.busca = '';
    this.onFilterChange();
  }

  clearAllFilters(): void {
    this.filtro.busca = '';
    this.filtro.status = [];
    this.onFilterChange();
  }

  getStatusLabels(statuses: string[]): string {
    if (!statuses || statuses.length === 0) return '';
    
    const labels = statuses.map(status => {
      const option = this.statusOptions.find(opt => opt.value === status);
      return option ? option.label : status;
    });
    
    return labels.join(', ');
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { ProcessoService } from '../../../core/services/processo.service';
import { ClienteService } from '../services/cliente.service';
import { AuthUser } from '../../../core/models/user.model';
import { Processo, ProcessoTipoOption, ProcessoTipo } from '../../../core/models/processo.model';
import { StatusOption, TipoOption } from '../models/cliente.model';

@Component({
  selector: 'app-processos',
  templateUrl: './processos.component.html',
  styleUrls: ['./processos.component.scss']
})
export class ProcessosComponent implements OnInit {

  currentUser: AuthUser | null = null;
  loading = true;

  // Breadcrumb
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};

  // Dados
  processos: Processo[] = [];
  processosFiltered: Processo[] = [];

  // Filtros
  searchTerm = '';
  selectedStatus: string = '';
  selectedTipo: string = '';

  statusOptions: StatusOption[] = [];
  tipoOptions: TipoOption[] = [];

  // Dialog Novo Processo
  showNewProcessDialog = false;
  salvandoProcesso = false;
  novoProcesso = {
    titulo: '',
    tipo: '',
    descricao: ''
  };
  tiposProcesso: ProcessoTipoOption[] = [];

  constructor(
    private authService: AuthService,
    private processoService: ProcessoService,
    private clienteService: ClienteService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initBreadcrumb();
    this.loadOptions();
    this.loadProcessos();
    this.loadTiposProcesso();
  }

  initBreadcrumb(): void {
    this.breadcrumbHome = { icon: 'pi pi-home', routerLink: '/cliente/dashboard' };
    this.breadcrumbItems = [
      { label: 'Meus Processos' }
    ];
  }

  loadOptions(): void {
    // Carregar opções de status
    this.clienteService.getStatusOptions().subscribe({
      next: (options) => {
        this.statusOptions = options;
      },
      error: (error) => {
        console.error('Erro ao carregar opções de status:', error);
      }
    });

    // Carregar opções de tipo
    this.clienteService.getTipoOptions().subscribe({
      next: (options) => {
        this.tipoOptions = options;
      },
      error: (error) => {
        console.error('Erro ao carregar opções de tipo:', error);
      }
    });
  }

  loadProcessos(): void {
    this.loading = true;

    this.processoService.getProcessos().subscribe({
      next: (processos) => {
        this.processos = processos;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar processos:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar processos. Tente novamente.'
        });
      }
    });
  }

  loadTiposProcesso(): void {
    this.processoService.getTiposProcesso().subscribe({
      next: (tipos) => {
        this.tiposProcesso = tipos;
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de processo:', error);
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.processosFiltered = this.processos.filter(processo => {
      const matchesSearch = !this.searchTerm ||
        processo.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        processo.descricao.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.selectedStatus || processo.status === this.selectedStatus;
      const matchesTipo = !this.selectedTipo || processo.tipo === this.selectedTipo;

      return matchesSearch && matchesStatus && matchesTipo;
    });
  }

  verDetalhes(processo: Processo): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Detalhes do Processo',
      detail: `Visualização detalhada do processo "${processo.titulo}" será implementada em breve.`
    });
  }

  abrirChat(processo: Processo): void {
    if (!processo.advogadoId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Chat não disponível',
        detail: 'Este processo ainda não foi atribuído a um advogado.'
      });
      return;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Chat',
      detail: `Chat com advogado para o processo "${processo.titulo}" será implementado em breve.`
    });
  }

  mostrarOpcoes(processo: Processo, event: Event): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Opções',
      detail: 'Menu de opções será implementado em breve.'
    });
  }

  getProgresso(processo: Processo): number {
    // Simulação de progresso baseado no status
    switch (processo.status) {
      case 'aberto': return 10;
      case 'em_andamento': return 60;
      case 'aguardando_cliente': return 80;
      case 'concluido': return 100;
      default: return 0;
    }
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

  // Métodos do dialog (mesmos do dashboard)
  criarProcesso(): void {
    if (!this.novoProcesso.titulo || !this.novoProcesso.tipo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos obrigatórios!'
      });
      return;
    }

    this.salvandoProcesso = true;

    const dadosProcesso = {
      titulo: this.novoProcesso.titulo,
      descricao: this.novoProcesso.descricao,
      tipo: this.novoProcesso.tipo as ProcessoTipo,
      valor: 0,
      prazoEstimado: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      urgencia: 'media' as const,
      clienteId: this.currentUser?.id || '1'
    };

    this.processoService.createProcesso(dadosProcesso).subscribe({
      next: (processo) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso!',
          detail: 'Processo criado com sucesso!'
        });

        this.showNewProcessDialog = false;
        this.cancelarNovoProcesso();
        this.loadProcessos();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao criar processo. Tente novamente.'
        });
        console.error('Erro ao criar processo:', error);
      },
      complete: () => {
        this.salvandoProcesso = false;
      }
    });
  }

  cancelarNovoProcesso(): void {
    this.novoProcesso = {
      titulo: '',
      tipo: '',
      descricao: ''
    };
    this.showNewProcessDialog = false;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    const severities: { [key: string]: 'success' | 'info' | 'warning' | 'danger' } = {
      'aberto': 'info',
      'em_andamento': 'warning',
      'aguardando_cliente': 'warning',
      'concluido': 'success',
      'arquivado': 'info'
    };
    return severities[status] || 'info';
  }

  verProcesso(processo: Processo): void {
    this.router.navigate(['/shared/processo', processo.id]);
  }

  iniciarChat(processo: Processo): void {
    this.router.navigate(['/shared/chat', processo.id]);
  }

  // Métodos para busca elegante
  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedTipo = '';
    this.onFilterChange();
  }

  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  }

  getTipoLabel(tipo: string): string {
    const option = this.tipoOptions.find(opt => opt.value === tipo);
    return option ? option.label : tipo;
  }

  // Propriedades para o header elegante
  hasNotifications = true; // Simular notificações
}
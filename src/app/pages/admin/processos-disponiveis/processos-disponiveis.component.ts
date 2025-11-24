import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { ProcessoService } from '../../../core/services/processo.service';
import { AuthUser } from '../../../core/models/user.model';
import { Processo } from '../../../core/models/processo.model';

@Component({
  selector: 'app-processos-disponiveis',
  templateUrl: './processos-disponiveis.component.html',
  styleUrls: ['./processos-disponiveis.component.scss']
})
export class ProcessosDisponiveisComponent implements OnInit {

  currentUser: AuthUser | null = null;
  loading = true;
  
  // Breadcrumb
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};

  // Métricas da fila
  metricas = {
    processosAtivos: 4,
    aguardandoAtribuicao: 1,
    advogadosDisponiveis: 2,
    clientesAtivos: 2,
    tempoMedioAnalise: 24
  };

  // Dados
  processos: any[] = [];
  processosFiltered: any[] = [];
  processosSelecionados: any[] = [];
  
  // Notificações
  hasNotifications = true;

  // Filtros
  searchTerm = '';
  selectedStatus = '';
  selectedTipo = '';
  selectedUrgencia = '';

  // Opções de filtro
  statusOptions = [
    { label: 'Todos os status', value: '' },
    { label: 'Aberto', value: 'aberto' },
    { label: 'Andamento', value: 'em_andamento' },
    { label: 'Aguardando Cliente', value: 'aguardando_cliente' },
    { label: 'Concluído', value: 'concluido' }
  ];

  tipoOptions = [
    { label: 'Todos os tipos', value: '' },
    { label: 'Trabalhista', value: 'trabalhista' },
    { label: 'Civil', value: 'civil' },
    { label: 'Criminal', value: 'criminal' },
    { label: 'Família', value: 'familia' },
    { label: 'Tributário', value: 'tributario' },
    { label: 'Empresarial', value: 'empresarial' }
  ];

  urgenciaOptions = [
    { label: 'Todas as urgências', value: '' },
    { label: 'Baixa', value: 'baixa' },
    { label: 'Média', value: 'media' },
    { label: 'Alta', value: 'alta' }
  ];

  // Dialog Atribuição
  showAtribuicaoDialog = false;
  showAtribuicaoLoteDialog = false;
  atribuindoProcesso = false;
  processoSelecionado: any | null = null;
  advogadoSelecionado = '';

  // Atribuição em Lote Melhorada
  advogadoSelecionadoLote = '';
  advogadosSelecionadosLote: string[] = [];
  atribuicaoModo: 'unico' | 'multiplos' | 'todos' = 'unico';
  distribuicaoAutomatica = false;

  advogadosDisponiveis: any[] = [];

  constructor(
    private authService: AuthService,
    private processoService: ProcessoService,
    private messageService: MessageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initBreadcrumb();
    this.loadProcessos();
    this.loadAdvogados();
  }

  initBreadcrumb(): void {
    this.breadcrumbHome = { icon: 'pi pi-home', routerLink: '/admin/dashboard' };
    this.breadcrumbItems = [
      { label: 'Processos Disponíveis' }
    ];
  }

  loadProcessos(): void {
    this.loading = true;

    this.processoService.getProcessos().subscribe({
      next: (processos) => {
        // Adicionar dados mock para demonstração
        this.processos = this.gerarProcessosMock();
        this.processosFiltered = [...this.processos];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar processos:', error);
        this.processos = this.gerarProcessosMock();
        this.processosFiltered = [...this.processos];
        this.loading = false;
      }
    });
  }

  gerarProcessosMock(): any[] {
    return [
      {
        id: '1',
        referencia: '2025-0001',
        titulo: 'Revisão de contrato de aluguel',
        descricao: 'Cliente solicita revisão de cláusulas contratuais de aluguel comercial',
        cliente: 'Ana Souza',
        status: 'aberto',
        tipo: 'civil',
        urgencia: 'media',
        dataCriacao: '2025-01-15',
        valor: 2500,
        clienteId: 'cliente1',
        advogadoId: null,
        dataAtribuicao: null,
        prazoEstimado: '30 dias',
        documentosCount: 3,
        mensagensCount: 5
      },
      {
        id: '2',
        referencia: '2025-0008',
        titulo: 'Indenização por atraso de voo',
        descricao: 'Processo de indenização por atraso de voo internacional',
        cliente: 'João Mendes',
        status: 'aberto',
        tipo: 'civil',
        urgencia: 'alta',
        dataCriacao: '2025-01-14',
        valor: 5000,
        clienteId: 'cliente2',
        advogadoId: null,
        dataAtribuicao: null,
        prazoEstimado: '45 dias',
        documentosCount: 2,
        mensagensCount: 3
      },
      {
        id: '3',
        referencia: '2025-0015',
        titulo: 'Acompanhamento de homologação trabalhista',
        descricao: 'Acompanhamento de processo de homologação de rescisão trabalhista',
        cliente: 'Maria Silva',
        status: 'em_andamento',
        tipo: 'trabalhista',
        urgencia: 'baixa',
        dataCriacao: '2025-01-13',
        valor: 1800,
        clienteId: 'cliente3',
        advogadoId: 'advogado1',
        dataAtribuicao: '2025-01-13',
        prazoEstimado: '20 dias',
        documentosCount: 4,
        mensagensCount: 8
      },
      {
        id: '4',
        referencia: '2025-0020',
        titulo: 'Avaliação de contrato social',
        descricao: 'Avaliação e adequação de contrato social empresarial',
        cliente: 'Carlos Oliveira',
        status: 'aberto',
        tipo: 'empresarial',
        urgencia: 'media',
        dataCriacao: '2025-01-12',
        valor: 3500,
        clienteId: 'cliente4',
        advogadoId: null,
        dataAtribuicao: null,
        prazoEstimado: '35 dias',
        documentosCount: 1,
        mensagensCount: 2
      }
    ];
  }

  loadAdvogados(): void {
    // Simulando carregamento de mais advogados da plataforma
    this.advogadosDisponiveis = [
      {
        id: '1',
        nome: 'Dr. Carlos Oliveira',
        oab: 'SP 123456',
        especialidades: ['Trabalhista', 'Civil'],
        avaliacaoMedia: 4.8,
        totalProcessos: 45,
        disponivel: true,
        cargaAtual: 12
      },
      {
        id: '2',
        nome: 'Dra. Ana Costa',
        oab: 'SP 654321',
        especialidades: ['Família', 'Criminal'],
        avaliacaoMedia: 4.9,
        totalProcessos: 32,
        disponivel: true,
        cargaAtual: 8
      },
      {
        id: '3',
        nome: 'Dr. Roberto Santos',
        oab: 'SP 789123',
        especialidades: ['Tributário', 'Empresarial'],
        avaliacaoMedia: 4.6,
        totalProcessos: 28,
        disponivel: true,
        cargaAtual: 15
      },
      {
        id: '4',
        nome: 'Dra. Mariana Silva',
        oab: 'SP 456789',
        especialidades: ['Civil', 'Família'],
        avaliacaoMedia: 4.7,
        totalProcessos: 35,
        disponivel: true,
        cargaAtual: 10
      },
      {
        id: '5',
        nome: 'Dr. Paulo Mendes',
        oab: 'SP 321654',
        especialidades: ['Trabalhista', 'Criminal'],
        avaliacaoMedia: 4.5,
        totalProcessos: 22,
        disponivel: true,
        cargaAtual: 18
      },
      {
        id: '6',
        nome: 'Dra. Fernanda Lima',
        oab: 'SP 987654',
        especialidades: ['Empresarial', 'Tributário'],
        avaliacaoMedia: 4.9,
        totalProcessos: 41,
        disponivel: true,
        cargaAtual: 7
      }
    ];
  }

  onSearch(): void {
    this.aplicarFiltros();
  }

  onFilterChange(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let filtered = [...this.processos];

    // Filtro por termo de busca
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.referencia.toLowerCase().includes(term) ||
        p.titulo.toLowerCase().includes(term) ||
        p.cliente.toLowerCase().includes(term)
      );
    }

    // Filtro por status
    if (this.selectedStatus) {
      filtered = filtered.filter(p => p.status === this.selectedStatus);
    }

    // Filtro por tipo
    if (this.selectedTipo) {
      filtered = filtered.filter(p => p.tipo === this.selectedTipo);
    }

    // Filtro por urgência
    if (this.selectedUrgencia) {
      filtered = filtered.filter(p => p.urgencia === this.selectedUrgencia);
    }

    this.processosFiltered = filtered;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.aplicarFiltros();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedTipo = '';
    this.selectedUrgencia = '';
    this.aplicarFiltros();
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

  // Ações da página
  verFilaAtribuicao(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Fila de Atribuição',
      detail: 'Visualização detalhada da fila será implementada em breve.'
    });
  }

  revisarVerificacoes(): void {
    this.router.navigate(['/admin/verificacao']);
  }

  exportarRelatorio(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Relatório Exportado',
      detail: 'Relatório de processos disponíveis foi gerado com sucesso.'
    });
  }

  verDetalhes(processo: any): void {
    this.router.navigate(['shared/processo/P001']);
  }

  atribuirAdvogado(processo: any): void {
    this.processoSelecionado = processo;
    this.advogadoSelecionado = '';
    this.showAtribuicaoDialog = true;
  }

  atribuirEmLote(): void {
    this.advogadoSelecionadoLote = '';
    this.showAtribuicaoLoteDialog = true;
  }

  mostrarOpcoes(processo: any, event: Event): void {
    // Implementar menu de opções
    this.messageService.add({
      severity: 'info',
      summary: 'Opções',
      detail: 'Menu de opções será implementado em breve.'
    });
  }

  // Dialog Atribuição Individual
  cancelarAtribuicao(): void {
    this.processoSelecionado = null;
    this.advogadoSelecionado = '';
    this.showAtribuicaoDialog = false;
  }

  confirmarAtribuicao(): void {
    if (!this.processoSelecionado || !this.advogadoSelecionado) return;

    this.atribuindoProcesso = true;

    // Simular atribuição
    setTimeout(() => {
      const advogado = this.advogadosDisponiveis.find(a => a.id === this.advogadoSelecionado);
      this.messageService.add({
        severity: 'success',
        summary: 'Processo Atribuído!',
        detail: `Processo "${this.processoSelecionado?.titulo}" atribuído para ${advogado?.nome}`
      });
      
      this.cancelarAtribuicao();
      this.loadProcessos(); // Recarregar dados
      this.atribuindoProcesso = false;
    }, 1000);
  }

  // Métodos de seleção múltipla de advogados
  onAdvogadoToggle(advogadoId: string): void {
    const index = this.advogadosSelecionadosLote.indexOf(advogadoId);
    if (index > -1) {
      this.advogadosSelecionadosLote.splice(index, 1);
    } else {
      this.advogadosSelecionadosLote.push(advogadoId);
    }
  }

  selecionarTodosAdvogados(): void {
    this.advogadosSelecionadosLote = this.advogadosDisponiveis
      .filter(a => a.disponivel)
      .map(a => a.id);
  }

  limparSelecaoAdvogados(): void {
    this.advogadosSelecionadosLote = [];
  }

  // Método para distribuição automática baseada em especialidades e carga
  distribuirAutomaticamente(): void {
    if (this.processosSelecionados.length === 0) return;

    const processos = [...this.processosSelecionados];
    const advogados = this.advogadosDisponiveis.filter(a => a.disponivel);

    if (advogados.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nenhum advogado disponível para distribuição automática.'
      });
      return;
    }

    // Ordenar advogados por menor carga atual
    advogados.sort((a, b) => a.cargaAtual - b.cargaAtual);

    // Distribuir processos
    const distribuicao: { [advogadoId: string]: any[] } = {};

    processos.forEach((processo, index) => {
      const advogadoIndex = index % advogados.length;
      const advogadoId = advogados[advogadoIndex].id;

      if (!distribuicao[advogadoId]) {
        distribuicao[advogadoId] = [];
      }
      distribuicao[advogadoId].push(processo);
    });

    // Aplicar distribuição
    Object.entries(distribuicao).forEach(([advogadoId, processosAdvogado]) => {
      const advogado = advogados.find(a => a.id === advogadoId);
      if (advogado) {
        advogado.cargaAtual += processosAdvogado.length;
      }
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Distribuição Automática',
      detail: `Processos distribuídos automaticamente entre ${Object.keys(distribuicao).length} advogados.`
    });
  }

  // Dialog Atribuição em Lote
  cancelarAtribuicaoLote(): void {
    this.advogadoSelecionadoLote = '';
    this.advogadosSelecionadosLote = [];
    this.atribuicaoModo = 'unico';
    this.distribuicaoAutomatica = false;
    this.showAtribuicaoLoteDialog = false;
  }

  confirmarAtribuicaoLote(): void {
    if (this.atribuicaoModo === 'unico' && !this.advogadoSelecionadoLote) return;
    if (this.atribuicaoModo === 'multiplos' && this.advogadosSelecionadosLote.length === 0) return;
    if (this.processosSelecionados.length === 0) return;

    this.atribuindoProcesso = true;

    // Simular atribuição em lote
    setTimeout(() => {
      let detalhes = '';

      if (this.atribuicaoModo === 'unico') {
        const advogado = this.advogadosDisponiveis.find(a => a.id === this.advogadoSelecionadoLote);
        advogado.cargaAtual += this.processosSelecionados.length;
        detalhes = `${this.processosSelecionados.length} processos atribuídos para ${advogado?.nome}`;
      } else if (this.atribuicaoModo === 'multiplos') {
        const advogados = this.advogadosDisponiveis.filter(a => this.advogadosSelecionadosLote.includes(a.id));
        advogados.forEach(adv => {
          adv.cargaAtual += Math.floor(this.processosSelecionados.length / advogados.length);
        });
        detalhes = `${this.processosSelecionados.length} processos distribuídos entre ${advogados.length} advogados`;
      } else if (this.atribuicaoModo === 'todos') {
        const advogados = this.advogadosDisponiveis.filter(a => a.disponivel);
        this.distribuirAutomaticamente();
        detalhes = `Processos distribuídos automaticamente entre todos os advogados disponíveis`;
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Processos Atribuídos!',
        detail: detalhes
      });

      this.cancelarAtribuicaoLote();
      this.processosSelecionados = [];
      this.loadProcessos(); // Recarregar dados
      this.atribuindoProcesso = false;
    }, 1500);
  }

  getInitials(nome: string): string {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'aberto': 'Aberto',
      'em_andamento': 'Andamento',
      'aguardando_cliente': 'Aguardando Cliente',
      'concluido': 'Concluído'
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    const severities: { [key: string]: 'success' | 'info' | 'warning' | 'danger' } = {
      'aberto': 'warning',
      'em_andamento': 'info',
      'aguardando_cliente': 'warning',
      'concluido': 'success'
    };
    return severities[status] || 'info';
  }

  getTipoLabel(tipo: string): string {
    const labels: { [key: string]: string } = {
      'trabalhista': 'Trabalhista',
      'civil': 'Civil',
      'criminal': 'Criminal',
      'familia': 'Família',
      'tributario': 'Tributário',
      'empresarial': 'Empresarial'
    };
    return labels[tipo] || tipo;
  }

  getUrgenciaLabel(urgencia: string): string {
    const labels: { [key: string]: string } = {
      'baixa': 'Baixa',
      'media': 'Média',
      'alta': 'Alta'
    };
    return labels[urgencia] || urgencia;
  }

  getUrgenciaSeverity(urgencia: string): 'success' | 'info' | 'warning' | 'danger' {
    const severities: { [key: string]: 'success' | 'info' | 'warning' | 'danger' } = {
      'baixa': 'success',
      'media': 'warning',
      'alta': 'danger'
    };
    return severities[urgencia] || 'info';
  }

  getDiasAnalise(dataCriacao: string): number {
    const dataCriacaoObj = new Date(dataCriacao);
    const hoje = new Date();
    const diffTime = Math.abs(hoje.getTime() - dataCriacaoObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getDiasAnaliseClass(dataCriacao: string): string {
    const dias = this.getDiasAnalise(dataCriacao);
    if (dias > 3) {
      return 'dias-analise-alerta';
    }
    return 'dias-analise-normal';
  }

  // Propriedades computadas para o template
  get advogadosDisponiveisAtivos() {
    return this.advogadosDisponiveis.filter(a => a.disponivel);
  }

  get advogadosSelecionadosCount() {
    return this.advogadosSelecionadosLote.length;
  }

  get totalAdvogadosDisponiveis() {
    return this.advogadosDisponiveis.filter(a => a.disponivel).length;
  }

  // Verifica se um advogado está selecionado
  isAdvogadoSelecionado(advogadoId: string): boolean {
    return this.advogadosSelecionadosLote.includes(advogadoId);
  }

  // Valida se a atribuição pode ser feita
  isAtribuicaoValida(): boolean {
    if (this.atribuicaoModo === 'unico') {
      return !!this.advogadoSelecionadoLote;
    } else if (this.atribuicaoModo === 'multiplos') {
      return this.advogadosSelecionadosLote.length > 0;
    } else if (this.atribuicaoModo === 'todos') {
      return this.totalAdvogadosDisponiveis > 0;
    }
    return false;
  }

  // TrackBy para melhorar performance do ngFor
  trackByAdvogadoId(index: number, advogado: any): string {
    return advogado.id;
  }

  // Forçar detecção de mudanças ao trocar modo de atribuição
  onModoAtribuicaoChange(): void {
    console.log('Modo de atribuição alterado para:', this.atribuicaoModo);
    console.log('Total de advogados disponíveis:', this.advogadosDisponiveis.length);
    
    // Forçar detecção de mudanças
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  // Selecionar modo de atribuição (usado pelos botões customizados)
  selecionarModoAtribuicao(modo: 'unico' | 'multiplos' | 'todos'): void {
    this.atribuicaoModo = modo;
    this.onModoAtribuicaoChange();
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { ProcessoService } from '../../../core/services/processo.service';
import { AuthUser } from '../../../core/models/user.model';
import { Processo } from '../../../core/models/processo.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService]
})
export class DashboardComponent implements OnInit {
  
  currentUser: AuthUser | null = null;
  loading = true;
  
  // Breadcrumb
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};

  // Estatísticas do Advogado
  stats = {
    total: 0,
    novos: 0,
    emAndamento: 0,
    aguardandoCliente: 0,
    concluidos: 0
  };

  // Dados
  processosAtribuidos: Processo[] = [];
  processosRecentes: Processo[] = [];
  processosAguardandoAprovacao: Processo[] = [];
  tarefasPendentes: any[] = [];
  proximosEventos: any[] = [];

  // Notificações
  hasNotifications = true;

  // Charts
  chartProcessosPorStatus: any = {};
  chartProcessosPorTipo: any = {};
  chartOptions: any = {};

  // Modal Aceitar Processo
  showAceitarProcessoDialog = false;
  aceitandoProcesso = false;
  processoSelecionado: Processo | null = null;
  dadosAceitarProcesso = {
    valorCausa: '' as string,
    probabilidadeGanho: null as string | null,
    prazoEstimado: null as Date | null,
    honorarios: '' as string,
    observacoes: ''
  };

  // Modal Rejeitar Processo
  showRejeitarProcessoDialog = false;
  rejeitandoProcesso = false;
  processoParaRejeitar: Processo | null = null;
  motivoRejeicao = '';

  // Opções para dropdown
  probabilidadeOptions = [
    { label: 'Provável: 60%', value: 'provavel' },
    { label: 'Possível: 30%', value: 'possivel' },
    { label: 'Remoto: 10%', value: 'remoto' }
  ];

  // Estilo do modal
  modalStyle = {
    width: '50vw',
    minWidth: '400px'
  };

  // Métricas Financeiras
  financialMetrics = {
    receitaTotal: 0,
    receitaMesAtual: 0,
    receitaProjetada: 0,
    processosConcluidos: 0,
    valorMedioProcesso: 0,
    taxaPlataforma: 0.15 // 15% para advogado (diferente do admin que recebe 3%)
  };

  // Métricas de Probabilidade de Ganho (valores em R$)
  probabilidadeMetrics = {
    provavel: 0,    // Soma dos valores de processos com 60%
    possivel: 0,    // Soma dos valores de processos com 30%
    remoto: 0       // Soma dos valores de processos com 10%
  };

  constructor(
    private authService: AuthService,
    private processoService: ProcessoService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.initializeChartOptions();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.setupBreadcrumb();
    
    // Inicializar propriedades que podem estar undefined
    this.initializeProperties();
    
    this.loadDashboardData();
  }

  private initializeProperties(): void {
    // Garantir que todas as propriedades estão inicializadas
    if (!this.stats) {
      this.stats = {
        total: 0,
        novos: 0,
        emAndamento: 0,
        aguardandoCliente: 0,
        concluidos: 0
      };
    }
    
    if (!this.processosAguardandoAprovacao) {
      this.processosAguardandoAprovacao = [];
    }
    
    if (!this.processosRecentes) {
      this.processosRecentes = [];
    }
    
    if (!this.processosAtribuidos) {
      this.processosAtribuidos = [];
    }
  }


  

  private setupBreadcrumb(): void {
    this.breadcrumbHome = { icon: 'pi pi-home', routerLink: '/advogado/dashboard' };
    this.breadcrumbItems = [
      { label: 'Dashboard' }
    ];
  }

  private loadDashboardData(): void {
    this.loading = true;

    // Simular delay para mostrar loading
    setTimeout(() => {
      this.loadProcessos();
      this.loadTarefasPendentes();
      this.loadProximosEventos();
      this.loading = false;
    }, 1500);
  }

  private calculateFinancialMetrics(processos: Processo[]): void {
    const processosConcluidos = processos.filter(p => p.status === 'concluido');
    const processosEmAndamento = processos.filter(p => p.status === 'em_andamento');
    
    // Simulação de valores por tipo de processo
    const valoresPorTipo: any = {
      'trabalhista': { min: 1500, max: 4000, media: 2750 },
      'civil': { min: 2000, max: 6000, media: 4000 },
      'criminal': { min: 3000, max: 8000, media: 5500 },
      'familia': { min: 1800, max: 4500, media: 3150 },
      'tributario': { min: 2500, max: 7000, media: 4750 },
      'empresarial': { min: 4000, max: 12000, media: 8000 }
    };

    // Calcular receita dos processos concluídos
    const processosComValor = processosConcluidos.map(p => {
      const config = valoresPorTipo[p.tipo] || valoresPorTipo['civil'];
      const variation = (Math.random() - 0.5) * 0.4; // ±20% de variação
      const valorProcesso = Math.floor(config.media * (1 + variation));
      return { ...p, valorProcesso };
    });

    // Calcular receita total (advogado recebe 85% do valor)
    this.financialMetrics.receitaTotal = processosComValor.reduce((total, p) => {
      return total + (p.valorProcesso * (1 - this.financialMetrics.taxaPlataforma));
    }, 0);

    // Calcular receita do mês atual
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();
    const processosMesAtual = processosComValor.filter(p => {
      const dataProcesso = new Date(p.dataCriacao);
      return dataProcesso.getMonth() === mesAtual && dataProcesso.getFullYear() === anoAtual;
    });

    if (processosMesAtual.length > 0) {
      this.financialMetrics.receitaMesAtual = processosMesAtual.reduce((total, p) => {
        return total + (p.valorProcesso * (1 - this.financialMetrics.taxaPlataforma));
      }, 0);
    } else {
      // Simular receita mensal se não houver dados
      const baseRevenue = 8500;
      const fatoresSazonais = [0.8, 0.9, 1.1, 1.2, 1.3, 1.1, 0.9, 1.0, 1.1, 1.2, 1.0, 1.3];
      const fatorSazonal = fatoresSazonais[mesAtual];
      const variation = (Math.random() - 0.5) * 0.3;
      this.financialMetrics.receitaMesAtual = Math.floor(baseRevenue * fatorSazonal * (1 + variation));
    }

    // Calcular projeção baseada em processos em andamento
    if (processosEmAndamento.length > 0) {
      const projecaoBase = processosEmAndamento.reduce((total, p) => {
        const config = valoresPorTipo[p.tipo] || valoresPorTipo['civil'];
        const valorEstimado = config.media;
        return total + (valorEstimado * (1 - this.financialMetrics.taxaPlataforma));
      }, 0);

      const growthRate = 1.15; // 15% de crescimento estimado
      this.financialMetrics.receitaProjetada = Math.floor(projecaoBase * growthRate);
    } else {
      // Projeção padrão
      const baseRevenue = this.financialMetrics.receitaMesAtual || 8500;
      const growthRate = 1.18; // 18% de crescimento
      this.financialMetrics.receitaProjetada = Math.floor(baseRevenue * growthRate);
    }

    // Outras métricas
    this.financialMetrics.processosConcluidos = processosConcluidos.length;
    
    if (processosComValor.length > 0) {
      const totalValor = processosComValor.reduce((sum, p) => sum + p.valorProcesso, 0);
      this.financialMetrics.valorMedioProcesso = Math.floor(totalValor / processosComValor.length);
    } else {
      this.financialMetrics.valorMedioProcesso = 3500; // Valor médio padrão
    }

    // Se não há dados reais, inicializar com valores simulados
    if (this.financialMetrics.receitaTotal === 0) {
      this.initializeSimulatedFinancialData();
    }
  }

  private initializeSimulatedFinancialData(): void {
    // Simular dados financeiros realísticos para demonstração
    const baseRevenue = 8500;
    const months = 6;
    const averageGrowth = 1.08; // 8% de crescimento médio mensal
    
    let totalRevenue = 0;
    for (let i = 0; i < months; i++) {
      const monthRevenue = baseRevenue * Math.pow(averageGrowth, i);
      totalRevenue += monthRevenue;
    }
    
    this.financialMetrics.receitaTotal = Math.floor(totalRevenue);
    
    // Receita do mês atual com sazonalidade
    const mesAtual = new Date().getMonth();
    const fatoresSazonais = [0.8, 0.9, 1.1, 1.2, 1.3, 1.1, 0.9, 1.0, 1.1, 1.2, 1.0, 1.3];
    const fatorSazonal = fatoresSazonais[mesAtual];
    this.financialMetrics.receitaMesAtual = Math.floor(baseRevenue * fatorSazonal);
    
    // Projeção
    this.financialMetrics.receitaProjetada = Math.floor(this.financialMetrics.receitaMesAtual * 1.18);
    
    // Processos concluídos simulados
    this.financialMetrics.processosConcluidos = Math.floor(Math.random() * 15) + 8; // 8-23 processos
    
    // Valor médio
    this.financialMetrics.valorMedioProcesso = 3500 + Math.floor(Math.random() * 1500); // R$ 3.500 - R$ 5.000
  }

  private calculateProbabilidadeMetrics(processos: Processo[]): void {
    // Resetar contadores
    this.probabilidadeMetrics = {
      provavel: 0,
      possivel: 0,
      remoto: 0
    };

    // Somar valores dos processos por probabilidade de ganho
    // Considerar apenas processos aceitos (em_andamento, aguardando_cliente ou concluido)
    const processosAceitos = processos.filter(p => 
      p.status === 'em_andamento' || 
      p.status === 'aguardando_cliente' || 
      p.status === 'concluido'
    );

    // Simulação de valores por tipo de processo
    const valoresPorTipo: any = {
      'trabalhista': { min: 1500, max: 4000, media: 2750 },
      'civil': { min: 2000, max: 6000, media: 4000 },
      'criminal': { min: 3000, max: 8000, media: 5500 },
      'familia': { min: 1800, max: 4500, media: 3150 },
      'tributario': { min: 2500, max: 7000, media: 4750 },
      'empresarial': { min: 4000, max: 12000, media: 8000 }
    };

    processosAceitos.forEach(processo => {
      // Verificar se o processo tem a propriedade probabilidadeGanho
      const probabilidade = (processo as any).probabilidadeGanho;
      
      // Calcular valor do processo
      const config = valoresPorTipo[processo.tipo] || valoresPorTipo['civil'];
      const variation = (Math.random() - 0.5) * 0.4; // ±20% de variação
      const valorProcesso = Math.floor(config.media * (1 + variation));
      
      // Somar ao total da categoria de probabilidade correspondente
      if (probabilidade) {
        switch (probabilidade) {
          case 'provavel':
            this.probabilidadeMetrics.provavel += valorProcesso;
            break;
          case 'possivel':
            this.probabilidadeMetrics.possivel += valorProcesso;
            break;
          case 'remoto':
            this.probabilidadeMetrics.remoto += valorProcesso;
            break;
          // Compatibilidade com valores antigos (mapear para novos)
          case 'muito_baixa':
          case 'baixa':
            this.probabilidadeMetrics.remoto += valorProcesso;
            break;
          case 'media':
            this.probabilidadeMetrics.possivel += valorProcesso;
            break;
          case 'alta':
          case 'muito_alta':
            this.probabilidadeMetrics.provavel += valorProcesso;
            break;
        }
      }
    });

    // Se não houver dados reais, simular alguns valores para demonstração
    if (processosAceitos.length === 0 || 
        (this.probabilidadeMetrics.provavel === 0 && 
         this.probabilidadeMetrics.possivel === 0 && 
         this.probabilidadeMetrics.remoto === 0)) {
      this.initializeSimulatedProbabilidadeData();
    }
  }

  private initializeSimulatedProbabilidadeData(): void {
    // Simular valores monetários por probabilidade para demonstração
    // Distribuição mais realista: valores menores em remoto, valores maiores em provável
    
    // Provável (60%): 4-8 processos × R$ 3.500-5.500 = R$ 14.000-44.000
    const qtdProvavel = Math.floor(Math.random() * 5) + 4;
    this.probabilidadeMetrics.provavel = qtdProvavel * (Math.floor(Math.random() * 2000) + 3500);
    
    // Possível (30%): 3-6 processos × R$ 2.500-4.000 = R$ 7.500-24.000
    const qtdPossivel = Math.floor(Math.random() * 4) + 3;
    this.probabilidadeMetrics.possivel = qtdPossivel * (Math.floor(Math.random() * 1500) + 2500);
    
    // Remoto (10%): 1-3 processos × R$ 2.000-3.000 = R$ 2.000-9.000
    const qtdRemoto = Math.floor(Math.random() * 3) + 1;
    this.probabilidadeMetrics.remoto = qtdRemoto * (Math.floor(Math.random() * 1000) + 2000);
  }

  getTotalProcessosPorProbabilidade(): number {
    // Retorna o valor total somado de todas as probabilidades
    return this.probabilidadeMetrics.provavel +
           this.probabilidadeMetrics.possivel +
           this.probabilidadeMetrics.remoto;
  }

  private loadProcessos(): void {
    if (!this.currentUser) {
      console.warn('Usuário não encontrado, usando ID padrão');
    }
    this.processoService.getProcessosByAdvogado(this.currentUser?.id || '1').subscribe({
      next: (processos) => {
        this.processosAtribuidos = processos;
        this.processosRecentes = processos.slice(0, 5);
        
        // Mock data para processos aguardando aprovação
        this.processosAguardandoAprovacao = [
          {
            id: 'proc-006',
            titulo: 'Ação de Cobrança - Empresa ABC',
            descricao: 'Ação de cobrança de valores em atraso referentes a serviços de consultoria prestados. Cliente possui fatura em aberto há 90 dias.',
            tipo: 'civil',
            status: 'aguardando_aprovacao',
            clienteId: 'cli-006',
            advogadoId: 'adv-001',
            valor: 5000,
            dataCriacao: '2024-01-23T09:15:00Z',
            dataAtribuicao: '2024-01-23T09:15:00Z',
            prazoEstimado: '2024-01-26T17:00:00Z',
            urgencia: 'alta',
            documentosCount: 1,
            mensagensCount: 0
          },
          {
            id: 'proc-007',
            titulo: 'Divórcio Litigioso - Casal Ferreira',
            descricao: 'Processo de divórcio litigioso com disputa de guarda dos filhos e divisão de bens. Caso complexo que requer análise detalhada.',
            tipo: 'familia',
            status: 'aguardando_aprovacao',
            clienteId: 'cli-007',
            advogadoId: 'adv-001',
            valor: 8000,
            dataCriacao: '2024-01-22T14:20:00Z',
            dataAtribuicao: '2024-01-22T14:20:00Z',
            prazoEstimado: '2024-01-26T17:00:00Z',
            urgencia: 'media',
            documentosCount: 2,
            mensagensCount: 0
          }
        ];
        
        this.calculateStats(processos);
        this.updateCharts(processos);
        this.calculateFinancialMetrics(processos);
        this.calculateProbabilidadeMetrics(processos);
      },
      error: (error) => {
        console.error('Erro ao carregar processos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar processos'
        });
      }
    });
  }

  private calculateStats(processos: Processo[]): void {
    this.stats.total = processos.length;
    this.stats.novos = processos.filter(p => p.status === 'aberto').length;
    this.stats.emAndamento = processos.filter(p => p.status === 'em_andamento').length;
    this.stats.aguardandoCliente = processos.filter(p => p.status === 'aguardando_cliente').length;
    this.stats.concluidos = processos.filter(p => p.status === 'concluido').length;
  }

  private loadTarefasPendentes(): void {
    // Mock de tarefas pendentes
    this.tarefasPendentes = [
      {
        id: 1,
        titulo: 'Revisar petição inicial',
        processo: 'P001 - Rescisão Trabalhista',
        prazo: new Date(2024, 2, 25),
        prioridade: 'alta'
      },
      {
        id: 2,
        titulo: 'Preparar audiência',
        processo: 'P003 - Ação de Cobrança',
        prazo: new Date(2024, 2, 28),
        prioridade: 'media'
      },
      {
        id: 3,
        titulo: 'Responder cliente sobre documentos',
        processo: 'P002 - Divórcio Consensual',
        prazo: new Date(2024, 2, 30),
        prioridade: 'baixa'
      }
    ];
  }

  private loadProximosEventos(): void {
    // Mock de próximos eventos
    this.proximosEventos = [
      {
        id: 1,
        titulo: 'Audiência Trabalhista',
        processo: 'P001',
        data: new Date(2024, 2, 26, 14, 0),
        local: 'TRT - 2ª Região'
      },
      {
        id: 2,
        titulo: 'Reunião com cliente',
        processo: 'P002',
        data: new Date(2024, 2, 27, 10, 30),
        local: 'Escritório'
      }
    ];
  }

  private updateCharts(processos: Processo[]): void {
    // Chart de processos por status
    const statusCounts = {
      'Novos': processos.filter(p => p.status === 'aberto').length,
      'Em Andamento': processos.filter(p => p.status === 'em_andamento').length,
      'Aguardando Cliente': processos.filter(p => p.status === 'aguardando_cliente').length,
      'Concluídos': processos.filter(p => p.status === 'concluido').length
    };

    this.chartProcessosPorStatus = {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: [
          '#42A5F5',
          '#FFA726', 
          '#FFCA28',
          '#66BB6A'
        ]
      }]
    };

    // Chart de processos por tipo
    const tipoCounts: any = {};
    processos.forEach(p => {
      tipoCounts[p.tipo] = (tipoCounts[p.tipo] || 0) + 1;
    });

    this.chartProcessosPorTipo = {
      labels: Object.keys(tipoCounts),
      datasets: [{
        label: 'Processos',
        data: Object.values(tipoCounts),
        backgroundColor: '#42A5F5'
      }]
    };
  }

  private initializeChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };
  }

  // Ações
  verTodosProcessos(): void {
    this.router.navigate(['/advogado/processos']);
  }

  verProcesso(processo: Processo): void {
    this.router.navigate(['/shared/processo', processo.id]);
  }

  iniciarChat(processo: Processo): void {
    this.router.navigate(['/shared/chat', processo.id]);
  }

  marcarComoConcluido(processo: Processo): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Funcionalidade em Desenvolvimento',
      detail: 'A conclusão de processos será implementada em breve'
    });
  }

  aceitarProcesso(processo: Processo): void {
    this.processoSelecionado = processo;
    this.dadosAceitarProcesso = {
      valorCausa: '',
      probabilidadeGanho: null,
      prazoEstimado: null,
      honorarios: '',
      observacoes: ''
    };
    this.showAceitarProcessoDialog = true;
  }

  rejeitarProcesso(processo: Processo): void {
    this.processoParaRejeitar = processo;
    this.motivoRejeicao = '';
    this.showRejeitarProcessoDialog = true;
  }

  cancelarRejeitarProcesso(): void {
    this.processoParaRejeitar = null;
    this.motivoRejeicao = '';
    this.showRejeitarProcessoDialog = false;
  }

  confirmarRejeitarProcesso(): void {
    if (!this.processoParaRejeitar) {
      return;
    }

    this.rejeitandoProcesso = true;

    const dadosAtualizacao: any = {
      status: 'rejeitado'
    };

    if (this.motivoRejeicao.trim()) {
      dadosAtualizacao.motivoRejeicao = this.motivoRejeicao;
    }

    this.processoService.updateProcesso(this.processoParaRejeitar.id, dadosAtualizacao).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Processo Rejeitado',
          detail: `O processo "${this.processoParaRejeitar?.titulo}" foi rejeitado com sucesso.`
        });
        
        // Remover o processo da lista de aguardando aprovação
        this.processosAguardandoAprovacao = this.processosAguardandoAprovacao.filter(p => p.id !== this.processoParaRejeitar?.id);
        
        this.cancelarRejeitarProcesso();
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao rejeitar processo. Tente novamente.'
        });
        console.error('Erro ao rejeitar processo:', error);
      },
      complete: () => {
        this.rejeitandoProcesso = false;
      }
    });
  }

  cancelarAceitarProcesso(): void {
    this.processoSelecionado = null;
    this.dadosAceitarProcesso = {
      valorCausa: '',
      probabilidadeGanho: null,
      prazoEstimado: null,
      honorarios: '',
      observacoes: ''
    };
    this.showAceitarProcessoDialog = false;
  }

  confirmarAceitarProcesso(): void {
    if (!this.processoSelecionado || !this.dadosAceitarProcesso.valorCausa.trim() || 
        !this.dadosAceitarProcesso.probabilidadeGanho || !this.dadosAceitarProcesso.prazoEstimado) {
      return;
    }

    this.aceitandoProcesso = true;

    // Converter valor da causa para número (remover formatação)
    const valorNumerico = parseFloat(this.dadosAceitarProcesso.valorCausa.replace(/[^\d,]/g, '').replace(',', '.'));

    // Converter honorários se preenchido
    const honorariosNumerico = this.dadosAceitarProcesso.honorarios 
      ? parseFloat(this.dadosAceitarProcesso.honorarios.replace(/[^\d,]/g, '').replace(',', '.'))
      : undefined;

    // Dados adicionais para o processo
    const dadosAdicionais: any = {
      status: 'em_andamento' as const,
      valorCausa: valorNumerico,
      probabilidadeGanho: this.dadosAceitarProcesso.probabilidadeGanho,
      prazoEstimado: this.dadosAceitarProcesso.prazoEstimado.toISOString(),
      observacoes: this.dadosAceitarProcesso.observacoes
    };

    if (honorariosNumerico) {
      dadosAdicionais.honorarios = honorariosNumerico;
    }

    this.processoService.updateProcesso(this.processoSelecionado.id, dadosAdicionais).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Processo Aceito!',
          detail: `Processo "${this.processoSelecionado?.titulo}" foi aceito e está em andamento.`
        });
        
        this.cancelarAceitarProcesso();
        this.loadDashboardData(); // Recarregar dados
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao aceitar processo. Tente novamente.'
        });
        console.error('Erro ao aceitar processo:', error);
      },
      complete: () => {
        this.aceitandoProcesso = false;
      }
    });
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

  // Utilitários
  getStatusSeverity(status: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" {
    switch (status) {
      case 'aberto': return 'info';
      case 'em_andamento': return 'warning';
      case 'aguardando_cliente': return 'secondary';
      case 'concluido': return 'success';
      default: return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'aberto': return 'Novo';
      case 'em_andamento': return 'Em Andamento';
      case 'aguardando_cliente': return 'Aguardando Cliente';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  }

  getPrioridadeSeverity(prioridade: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" {
    switch (prioridade) {
      case 'alta': return 'danger';
      case 'media': return 'warning';
      case 'baixa': return 'info';
      default: return 'secondary';
    }
  }

  formatarData(data: string | Date): string {
    const date = typeof data === 'string' ? new Date(data) : data;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  formatarDataHora(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
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

  // Métodos de formatação para as métricas financeiras
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  getCurrentMonthName(): string {
    return new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }
}
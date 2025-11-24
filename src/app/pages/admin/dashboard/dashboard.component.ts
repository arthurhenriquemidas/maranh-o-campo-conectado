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
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  currentUser: AuthUser | null = null;
  loading = true;
  
  // Breadcrumb
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};

  // Métricas
  metricas = {
    totalProcessos: 0,
    processosDisponiveis: 0,
    totalAdvogados: 0,
    totalClientes: 0,
    processosHoje: 0,
    processosVencendo: 0
  };

  // Dados
  processosDisponiveis: Processo[] = [];
  alertas: any[] = [];
  
  // Notificações
  hasNotifications = true;

  // Gráficos
  chartProcessosStatus: any = {};
  chartProcessosTipo: any = {};
  chartOptions: any = {};
  
  // Dashboard de Processos por Data
  periodOptions = [
    { label: 'Últimos 7 dias', value: '7d' },
    { label: 'Últimos 30 dias', value: '30d' },
    { label: 'Últimos 90 dias', value: '90d' },
    { label: 'Último ano', value: '1y' }
  ];
  
  groupByOptions = [
    { label: 'Por dia', value: 'day' },
    { label: 'Por semana', value: 'week' },
    { label: 'Por mês', value: 'month' }
  ];
  
  selectedPeriod = '30d';
  selectedGroupBy = 'day';
  
  // Novos gráficos
  chartProcessosPorData: any = {};
  chartProcessosTipoData: any = {};
  chartOptionsLine: any = {};
  chartOptionsBar: any = {};

  // Indicadores Financeiros
  financialMetrics = {
    receitaTotal: 0,
    receitaMesAtual: 0,
    receitaProjetada: 0,
    processosConcluidos: 0,
    valorMedioProcesso: 0,
    taxaPlataforma: 0.03 // 3%
  };

  // Gráficos Financeiros
  chartReceitaMensal: any = {};
  chartProjecaoReceita: any = {};
  chartPerformanceFinanceira: any = {};

  // Dialog Atribuição
  showAtribuicaoDialog = false;
  atribuindoProcesso = false;
  processoSelecionado: Processo | null = null;
  advogadoSelecionado: string = '';
  advogadosDisponiveis: any[] = [];

  constructor(
    private authService: AuthService,
    private processoService: ProcessoService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initBreadcrumb();
    this.loadDashboardData();
    this.loadAdvogados();
    this.initCharts();
    this.initializeProcessDashboard();
  }


  initBreadcrumb(): void {
    this.breadcrumbHome = { icon: 'pi pi-home', routerLink: '/admin/dashboard' };
    this.breadcrumbItems = [
      { label: 'Dashboard' }
    ];
  }

  loadDashboardData(): void {
    this.loading = true;

    // Carregar todos os processos para calcular métricas
    this.processoService.getProcessos().subscribe({
      next: (processos) => {
        // Calcular métricas
        this.metricas.totalProcessos = processos.length;
        this.metricas.processosDisponiveis = processos.filter(p => p.status === 'aberto').length;
        
        this.processosDisponiveis = processos.filter(p => p.status === 'aberto');
        
        // Simular outras métricas
        this.metricas.totalAdvogados = 3;
        this.metricas.totalClientes = 5;
        this.metricas.processosHoje = processos.filter(p => {
          const hoje = new Date().toDateString();
          const dataProcesso = new Date(p.dataCriacao).toDateString();
          return hoje === dataProcesso;
        }).length;

        this.updateCharts(processos);
        this.calculateFinancialMetrics(processos);
        this.generateAlertas();
        
        // Garantir que os dados financeiros sejam inicializados
        if (this.financialMetrics.receitaTotal === 0) {
          this.initializeFinancialData();
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.loading = false;
      }
    });
  }

  loadAdvogados(): void {
    // Mock de advogados disponíveis
    this.advogadosDisponiveis = [
      {
        id: '1',
        nome: 'Dr. Carlos Oliveira',
        oab: 'SP 123456',
        especialidades: ['Trabalhista', 'Civil'],
        avaliacaoMedia: 4.8,
        totalProcessos: 45,
        disponivel: true
      },
      {
        id: '2',
        nome: 'Dra. Ana Costa',
        oab: 'SP 654321',
        especialidades: ['Família', 'Criminal'],
        avaliacaoMedia: 4.9,
        totalProcessos: 32,
        disponivel: true
      }
    ];
  }

  updateCharts(processos: Processo[]): void {
    // Chart de Status
    const statusCount = processos.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as any);

    this.chartProcessosStatus = {
      labels: ['Aberto', 'Em Andamento', 'Aguardando Cliente', 'Aguardando Aprovação', 'Concluído'],
      datasets: [{
        data: [
          statusCount['aberto'] || 0,
          statusCount['em_andamento'] || 0,
          statusCount['aguardando_cliente'] || 0,
          statusCount['aguardando_aprovacao'] || 0,
          statusCount['concluido'] || 0
        ],
        backgroundColor: ['#3B82F6', '#F59E0B', '#8B5CF6', '#F97316', '#10B981']
      }]
    };

    // Chart de Tipos
    const tipoCount = processos.reduce((acc, p) => {
      acc[p.tipo] = (acc[p.tipo] || 0) + 1;
      return acc;
    }, {} as any);

    this.chartProcessosTipo = {
      labels: ['Trabalhista', 'Civil', 'Criminal', 'Família', 'Tributário', 'Empresarial'],
      datasets: [{
        label: 'Processos',
        data: [
          tipoCount['trabalhista'] || 0,
          tipoCount['civil'] || 0,
          tipoCount['criminal'] || 0,
          tipoCount['familia'] || 0,
          tipoCount['tributario'] || 0,
          tipoCount['empresarial'] || 0
        ],
        backgroundColor: '#3B82F6'
      }]
    };
  }

  initCharts(): void {
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

  generateAlertas(): void {
    this.alertas = [];

    if (this.metricas.processosDisponiveis > 5) {
      this.alertas.push({
        tipo: 'critico',
        icon: 'pi pi-exclamation-triangle',
        titulo: 'Muitos processos aguardando',
        descricao: `${this.metricas.processosDisponiveis} processos precisam ser atribuídos`
      });
    }

    if (this.metricas.processosDisponiveis > 0 && this.metricas.processosDisponiveis <= 5) {
      this.alertas.push({
        tipo: 'aviso',
        icon: 'pi pi-clock',
        titulo: 'Processos aguardando atribuição',
        descricao: `${this.metricas.processosDisponiveis} processos disponíveis`
      });
    }
  }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
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

  abrirDialogAtribuicao(processo: Processo): void {
    this.processoSelecionado = processo;
    this.advogadoSelecionado = '';
    this.showAtribuicaoDialog = true;
  }

  cancelarAtribuicao(): void {
    this.processoSelecionado = null;
    this.advogadoSelecionado = '';
    this.showAtribuicaoDialog = false;
  }

  confirmarAtribuicao(): void {
    if (!this.processoSelecionado || !this.advogadoSelecionado) return;

    this.atribuindoProcesso = true;

    this.processoService.atribuirAdvogado(this.processoSelecionado.id, this.advogadoSelecionado).subscribe({
      next: () => {
        const advogado = this.advogadosDisponiveis.find(a => a.id === this.advogadoSelecionado);
        this.messageService.add({
          severity: 'success',
          summary: 'Processo Atribuído!',
          detail: `Processo "${this.processoSelecionado?.titulo}" atribuído para ${advogado?.nome}`
        });
        
        this.cancelarAtribuicao();
        this.loadDashboardData(); // Recarregar dados
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atribuir processo. Tente novamente.'
        });
        console.error('Erro ao atribuir processo:', error);
      },
      complete: () => {
        this.atribuindoProcesso = false;
      }
    });
  }

  getInitials(nome: string): string {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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

  mostrarTodosProcessos(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Funcionalidade em desenvolvimento',
      detail: 'Visualização de todos os processos será implementada em breve.'
    });
  }

  mostrarRelatorios(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Relatórios',
      detail: 'Dashboard de métricas detalhadas será implementado em breve.'
    });
  }

  mostrarPerformance(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Performance',
      detail: 'Indicadores de performance serão implementados em breve.'
    });
  }

  // Métodos de Cálculo Financeiro
  calculateFinancialMetrics(processos: Processo[]): void {
    const processosConcluidos = processos.filter(p => p.status === 'concluido');
    const processosEmAndamento = processos.filter(p => p.status === 'em_andamento');
    
    // Simulação mais realística de valores por tipo de processo
    const valoresPorTipo = {
      'trabalhista': { min: 1500, max: 4000, media: 2750 },
      'civil': { min: 2000, max: 6000, media: 4000 },
      'criminal': { min: 3000, max: 8000, media: 5500 },
      'familia': { min: 1800, max: 4500, media: 3150 },
      'tributario': { min: 2500, max: 7000, media: 4750 },
      'empresarial': { min: 4000, max: 12000, media: 8000 }
    };

    // Simular valores dos processos baseados no tipo
    const processosComValor = processosConcluidos.map(p => ({
      ...p,
      valorProcesso: this.generateRealisticValue(p.tipo, valoresPorTipo)
    }));

    // Calcular receita total
    this.financialMetrics.receitaTotal = processosComValor.reduce((total, p) => {
      return total + (p.valorProcesso * this.financialMetrics.taxaPlataforma);
    }, 0);

    // Calcular receita do mês atual com dados históricos simulados
    this.financialMetrics.receitaMesAtual = this.generateCurrentMonthRevenue(processosComValor);

    // Calcular projeção baseada em processos em andamento com crescimento
    this.financialMetrics.receitaProjetada = this.calculateProjectedRevenue(processosEmAndamento, valoresPorTipo);

    // Outras métricas
    this.financialMetrics.processosConcluidos = processosConcluidos.length;
    this.financialMetrics.valorMedioProcesso = this.calculateAverageProcessValue(processosComValor);

    // Atualizar gráficos financeiros
    this.updateFinancialCharts();
  }

  generateRealisticValue(tipo: string, valoresPorTipo: any): number {
    const config = valoresPorTipo[tipo] || valoresPorTipo['civil'];
    const variation = (Math.random() - 0.5) * 0.4; // ±20% de variação
    return Math.floor(config.media * (1 + variation));
  }

  generateCurrentMonthRevenue(processosComValor: any[]): number {
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();
    
    // Filtrar processos do mês atual
    const processosMesAtual = processosComValor.filter(p => {
      const dataProcesso = new Date(p.dataCriacao);
      return dataProcesso.getMonth() === mesAtual && dataProcesso.getFullYear() === anoAtual;
    });

    // Se não há processos no mês atual, simular baseado em dados históricos
    if (processosMesAtual.length === 0) {
      return this.generateSimulatedMonthlyRevenue();
    }

    return processosMesAtual.reduce((total, p) => {
      return total + (p.valorProcesso * this.financialMetrics.taxaPlataforma);
    }, 0);
  }

  generateSimulatedMonthlyRevenue(): number {
    // Simular receita mensal baseada em padrões sazonais
    const mesAtual = new Date().getMonth();
    const fatoresSazonais = [0.8, 0.9, 1.1, 1.2, 1.3, 1.1, 0.9, 1.0, 1.1, 1.2, 1.0, 1.3];
    const baseRevenue = 15000; // R$ 15.000 base
    const fatorSazonal = fatoresSazonais[mesAtual];
    const variation = (Math.random() - 0.5) * 0.3; // ±15% de variação
    
    return Math.floor(baseRevenue * fatorSazonal * (1 + variation));
  }

  calculateProjectedRevenue(processosEmAndamento: Processo[], valoresPorTipo: any): number {
    if (processosEmAndamento.length === 0) {
      return this.generateGrowthProjection();
    }

    // Calcular projeção baseada em processos em andamento
    const projecaoBase = processosEmAndamento.reduce((total, p) => {
      const valorEstimado = this.generateRealisticValue(p.tipo, valoresPorTipo);
      return total + (valorEstimado * this.financialMetrics.taxaPlataforma);
    }, 0);

    // Adicionar fator de crescimento e sazonalidade
    const mesAtual = new Date().getMonth();
    const fatoresSazonais = [0.8, 0.9, 1.1, 1.2, 1.3, 1.1, 0.9, 1.0, 1.1, 1.2, 1.0, 1.3];
    const fatorSazonal = fatoresSazonais[mesAtual];
    const growthRate = 1.15; // 15% de crescimento estimado

    return Math.floor(projecaoBase * fatorSazonal * growthRate);
  }

  generateGrowthProjection(): number {
    // Projeção baseada em crescimento histórico simulado
    const baseRevenue = 15000;
    const growthRate = 1.18; // 18% de crescimento
    const mesAtual = new Date().getMonth();
    const fatoresSazonais = [0.8, 0.9, 1.1, 1.2, 1.3, 1.1, 0.9, 1.0, 1.1, 1.2, 1.0, 1.3];
    const fatorSazonal = fatoresSazonais[mesAtual];
    
    return Math.floor(baseRevenue * growthRate * fatorSazonal);
  }

  calculateAverageProcessValue(processosComValor: any[]): number {
    if (processosComValor.length === 0) return 2500;
    
    const total = processosComValor.reduce((sum, p) => sum + p.valorProcesso, 0);
    return Math.floor(total / processosComValor.length);
  }

  generateRandomValue(baseValue: number, variation: number): number {
    const min = baseValue * (1 - variation);
    const max = baseValue * (1 + variation);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  updateFinancialCharts(): void {
    // Gráfico de Receita Mensal (últimos 6 meses)
    const meses = this.getLast6Months();
    const receitaMensal = this.generateMonthlyRevenue(meses);

    this.chartReceitaMensal = {
      labels: meses,
      datasets: [{
        label: 'Receita (R$)',
        data: receitaMensal,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3B82F6',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    };

    // Gráfico de Projeção com dados históricos + projeção
    const projecaoMeses = this.getNext6Months();
    const projecaoReceita = this.generateProjectionRevenue(projecaoMeses);
    
    // Combinar dados históricos com projeção
    const allMonths = [...meses.slice(-3), ...projecaoMeses];
    const allRevenue = [...receitaMensal.slice(-3), ...projecaoReceita];

    this.chartProjecaoReceita = {
      labels: allMonths,
      datasets: [
        {
          label: 'Receita Histórica',
          data: [...receitaMensal.slice(-3), ...new Array(3).fill(null)],
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: '#10B981',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6
        },
        {
          label: 'Projeção',
          data: [...new Array(3).fill(null), ...projecaoReceita],
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: '#F59E0B',
          borderWidth: 3,
          borderDash: [8, 4],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#F59E0B',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointStyle: 'triangle'
        }
      ]
    };

    // Gráfico de Performance Financeira com dados mais realísticos
    const receitaTotal = this.financialMetrics.receitaTotal || this.generateSimulatedTotalRevenue();
    const receitaMesAtual = this.financialMetrics.receitaMesAtual || this.generateSimulatedMonthlyRevenue();
    const receitaProjetada = this.financialMetrics.receitaProjetada || this.generateGrowthProjection();

    this.chartPerformanceFinanceira = {
      labels: ['Receita Total', 'Receita Mês Atual', 'Projeção'],
      datasets: [{
        label: 'Valores (R$)',
        data: [receitaTotal, receitaMesAtual, receitaProjetada],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)', 
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: ['#3B82F6', '#10B981', '#F59E0B'],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)'
        ]
      }]
    };
  }

  generateSimulatedTotalRevenue(): number {
    // Simular receita total baseada em histórico de 6 meses
    const baseRevenue = 15000;
    const months = 6;
    const averageGrowth = 1.08; // 8% de crescimento médio mensal
    
    let totalRevenue = 0;
    for (let i = 0; i < months; i++) {
      const monthRevenue = baseRevenue * Math.pow(averageGrowth, i);
      totalRevenue += monthRevenue;
    }
    
    return Math.floor(totalRevenue);
  }

  getLast6Months(): string[] {
    const meses = [];
    const hoje = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      meses.push(data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }));
    }
    
    return meses;
  }

  getNext6Months(): string[] {
    const meses = [];
    const hoje = new Date();
    
    for (let i = 1; i <= 6; i++) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      meses.push(data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }));
    }
    
    return meses;
  }

  generateMonthlyRevenue(meses: string[]): number[] {
    // Simular receita mensal com padrões sazonais realísticos
    const baseRevenue = this.financialMetrics.receitaMesAtual || 15000;
    const fatoresSazonais = [0.8, 0.9, 1.1, 1.2, 1.3, 1.1, 0.9, 1.0, 1.1, 1.2, 1.0, 1.3];
    
    return meses.map((_, index) => {
      const mesIndex = (new Date().getMonth() - 5 + index + 12) % 12;
      const fatorSazonal = fatoresSazonais[mesIndex];
      const variation = (Math.random() - 0.5) * 0.3; // ±15% de variação
      const growthFactor = 1 + (index * 0.05); // 5% de crescimento mensal
      
      return Math.floor(baseRevenue * fatorSazonal * (1 + variation) * growthFactor);
    });
  }

  generateProjectionRevenue(meses: string[]): number[] {
    // Projeção mais realística com diferentes cenários
    const baseRevenue = this.financialMetrics.receitaMesAtual || 15000;
    const fatoresSazonais = [0.8, 0.9, 1.1, 1.2, 1.3, 1.1, 0.9, 1.0, 1.1, 1.2, 1.0, 1.3];
    
    return meses.map((_, index) => {
      const mesIndex = (new Date().getMonth() + index + 1) % 12;
      const fatorSazonal = fatoresSazonais[mesIndex];
      
      // Diferentes cenários de crescimento
      const growthScenarios = [
        1.12, // 12% - cenário conservador
        1.18, // 18% - cenário otimista
        1.15, // 15% - cenário realista
        1.20, // 20% - cenário agressivo
        1.16, // 16% - cenário equilibrado
        1.14  // 14% - cenário moderado
      ];
      
      const growthRate = growthScenarios[index % growthScenarios.length];
      const variation = (Math.random() - 0.5) * 0.25; // ±12.5% de variação
      
      return Math.floor(baseRevenue * fatorSazonal * growthRate * (1 + variation));
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  getCurrentMonthName(): string {
    return new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  // Métodos para Insights Financeiros
  getGrowthPercentage(): number {
    // Simular crescimento mensal baseado em dados históricos
    const baseGrowth = 12; // 12% base
    const variation = (Math.random() - 0.5) * 8; // ±4% de variação
    return Math.floor(baseGrowth + variation);
  }

  getProjected6Months(): number {
    // Projeção para os próximos 6 meses
    const baseRevenue = this.financialMetrics.receitaMesAtual || 15000;
    const growthRate = 1.15; // 15% de crescimento mensal
    let totalProjection = 0;
    
    for (let i = 1; i <= 6; i++) {
      totalProjection += baseRevenue * Math.pow(growthRate, i);
    }
    
    return Math.floor(totalProjection);
  }

  getConversionRate(): number {
    // Taxa de conversão de processos (concluídos vs. total)
    const totalProcessos = this.metricas.totalProcessos;
    const processosConcluidos = this.financialMetrics.processosConcluidos;
    
    if (totalProcessos === 0) return 0;
    
    const conversionRate = (processosConcluidos / totalProcessos) * 100;
    return Math.floor(conversionRate);
  }

  // Métodos para o Dashboard de Processos por Data
  initializeProcessDashboard(): void {
    this.setupChartOptions();
    this.generateProcessDataByDate();
    this.generateProcessDataByType();
  }

  setupChartOptions(): void {
    // Opções para gráfico de linha
    this.chartOptionsLine = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#e5e7eb'
          }
        },
        x: {
          grid: {
            color: '#e5e7eb'
          }
        }
      }
    };


    // Opções para gráfico de barras
    this.chartOptionsBar = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#e5e7eb'
          }
        },
        x: {
          grid: {
            color: '#e5e7eb'
          }
        }
      }
    };
  }

  generateProcessDataByDate(): void {
    const days = this.getDaysForPeriod();
    const labels = days.map(day => this.formatDateLabel(day));
    
    this.chartProcessosPorData = {
      labels: labels,
      datasets: [
        {
          label: 'Novos Processos',
          data: this.generateRandomData(days.length, 5, 20),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Processos Concluídos',
          data: this.generateRandomData(days.length, 2, 15),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: 'Processos Em Andamento',
          data: this.generateRandomData(days.length, 3, 18),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4
        }
      ]
    };
  }

  generateProcessDataByType(): void {
    const days = this.getDaysForPeriod();
    const labels = days.map(day => this.formatDateLabel(day));
    
    this.chartProcessosTipoData = {
      labels: labels,
      datasets: [
        {
          label: 'Trabalhista',
          data: this.generateRandomData(days.length, 2, 12),
          backgroundColor: '#3b82f6'
        },
        {
          label: 'Cível',
          data: this.generateRandomData(days.length, 1, 10),
          backgroundColor: '#10b981'
        },
        {
          label: 'Criminal',
          data: this.generateRandomData(days.length, 1, 8),
          backgroundColor: '#f59e0b'
        },
        {
          label: 'Tributário',
          data: this.generateRandomData(days.length, 1, 6),
          backgroundColor: '#ef4444'
        }
      ]
    };
  }

  getDaysForPeriod(): Date[] {
    const days: Date[] = [];
    const today = new Date();
    let daysToShow = 7;
    
    switch (this.selectedPeriod) {
      case '7d':
        daysToShow = 7;
        break;
      case '30d':
        daysToShow = 30;
        break;
      case '90d':
        daysToShow = 90;
        break;
      case '1y':
        daysToShow = 365;
        break;
    }
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    
    return days;
  }

  formatDateLabel(date: Date): string {
    switch (this.selectedGroupBy) {
      case 'day':
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return `Sem ${weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`;
      case 'month':
        return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  }

  generateRandomData(length: number, min: number, max: number): number[] {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  }

  // Métodos para métricas resumidas
  getTotalProcesses(): number {
    return this.metricas.totalProcessos || 0;
  }

  getActiveProcesses(): number {
    return Math.floor(this.metricas.totalProcessos * 0.6) || 0;
  }

  getCompletedProcesses(): number {
    return Math.floor(this.metricas.totalProcessos * 0.3) || 0;
  }

  getPendingProcesses(): number {
    return this.metricas.processosDisponiveis || 0;
  }

  // Event handlers
  onPeriodChange(): void {
    this.generateProcessDataByDate();
    this.generateProcessDataByType();
  }

  onGroupByChange(): void {
    this.generateProcessDataByDate();
    this.generateProcessDataByType();
  }

  refreshProcessData(): void {
    this.generateProcessDataByDate();
    this.generateProcessDataByType();
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Dados atualizados com sucesso'
    });
  }

  initializeFinancialData(): void {
    // Inicializar dados financeiros com valores simulados se não houver dados reais
    if (this.financialMetrics.receitaTotal === 0) {
      this.financialMetrics.receitaTotal = this.generateSimulatedTotalRevenue();
      this.financialMetrics.receitaMesAtual = this.generateSimulatedMonthlyRevenue();
      this.financialMetrics.receitaProjetada = this.generateGrowthProjection();
      this.financialMetrics.processosConcluidos = Math.floor(Math.random() * 20) + 10; // 10-30 processos
      this.financialMetrics.valorMedioProcesso = 2500 + Math.floor(Math.random() * 1500); // R$ 2.500 - R$ 4.000
      
      // Atualizar gráficos com dados simulados
      this.updateFinancialCharts();
    }
  }


}

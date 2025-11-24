import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

import { ProcessoService } from '../../../core/services/processo.service';
import { AuthService } from '../../../core/services/auth.service';
import { Processo } from '../../../core/models/processo.model';
import { AuthUser } from '../../../core/models/user.model';

interface ProcessoAtividade {
  id: string;
  tipo: 'criacao' | 'atribuicao' | 'documento' | 'mensagem' | 'status' | 'conclusao';
  titulo: string;
  descricao: string;
  data: Date;
  usuario: string;
  icone: string;
  cor: string;
}

interface ProcessoDocumento {
  id: string;
  nome: string;
  tipo: string;
  tamanho: string;
  dataUpload: Date;
  uploadedBy: string;
  url?: string;
}

interface ProcessoMensagem {
  id: string;
  usuario: string;
  conteudo: string;
  data: Date;
  tipo: 'sistema' | 'usuario';
}

@Component({
  selector: 'app-processo-detalhes',
  templateUrl: './processo-detalhes.component.html',
  styleUrls: ['./processo-detalhes.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ProcessoDetalhesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  processo: Processo | null = null;
  currentUser: AuthUser | null = null;
  loading = true;
  processoId: string = '';

  // Breadcrumb
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};
  
  // Notificações
  hasNotifications = true;
  
  // Atividades Timeline
  atividades: ProcessoAtividade[] = [];

  // Dados formatados para o componente p-timeline (legado)
  timelineEvents: any[] = [];

  // Dados para o novo componente timeline-horizontal
  timelineSteps: any[] = [];
  currentStepIndex: number = 0;

  // Controle de largura da timeline
  timelineMinWidth: string = '100%';
  
  // Documentos
  documentos: ProcessoDocumento[] = [];
  
  // Mensagens
  mensagens: ProcessoMensagem[] = [];
  mensagensAgrupadas: any[] = [];
  resumoIA: string | null = null;
  gerandoResumo = false;
  
  // Opções de configuração
  statusOptions = [
    { label: 'Aberto', value: 'aberto' },
    { label: 'Em Andamento', value: 'em_andamento' },
    { label: 'Aguardando Cliente', value: 'aguardando_cliente' },
    { label: 'Aguardando Advogado', value: 'aguardando_advogado' },
    { label: 'Concluído', value: 'concluido' },
    { label: 'Arquivado', value: 'arquivado' }
  ];
  
  urgenciaOptions = [
    { label: 'Baixa', value: 'baixa' },
    { label: 'Média', value: 'media' },
    { label: 'Alta', value: 'alta' },
    { label: 'Urgente', value: 'urgente' }
  ];

  tipoOptions = [
    { label: 'Trabalhista', value: 'trabalhista' },
    { label: 'Civil', value: 'civil' },
    { label: 'Criminal', value: 'criminal' },
    { label: 'Família', value: 'familia' },
    { label: 'Tributário', value: 'tributario' },
    { label: 'Empresarial', value: 'empresarial' },
    { label: 'Consumidor', value: 'consumidor' },
    { label: 'Administrativo', value: 'administrativo' }
  ];

  prioridadeOptions = [
    { label: 'Baixa', value: 'baixa' },
    { label: 'Normal', value: 'normal' },
    { label: 'Alta', value: 'alta' },
    { label: 'Crítica', value: 'critica' }
  ];

  jurisdicaoOptions = [
    { label: 'Federal', value: 'federal' },
    { label: 'Estadual', value: 'estadual' },
    { label: 'Municipal', value: 'municipal' },
    { label: 'Trabalhista', value: 'trabalhista' },
    { label: 'Eleitoral', value: 'eleitoral' },
    { label: 'Militar', value: 'militar' }
  ];

  // Modal de Avaliação (Admin)
  showModalAvaliacao = false;
  processandoAvaliacao = false;
  processoSelecionado: Processo | null = null;
  dadosAvaliacao = {
    descricao: '',
    decisao: null as string | null,
    observacoes: ''
  };

  // Opções para decisão
  decisaoOptions = [
    { label: 'Aceitar Conclusão Forçada', value: 'aceitar' },
    { label: 'Rejeitar Conclusão', value: 'rejeitar' }
  ];

  // Estilo do modal
  modalStyle = {
    width: '60vw',
    minWidth: '500px',
    maxWidth: '800px'
  };

  // Estados visuais para efeitos
  processoAceito = false;
  processandoAceitar = false;

  // Controle de configurações
  salvandoConfiguracoes = false;
  configuracoesOriginais: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private processoService: ProcessoService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.processoId = this.route.snapshot.paramMap.get('id') || '';
    
    if (!this.processoId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'ID do processo não encontrado'
      });
      this.router.navigate(['/']);
      return;
    }

    this.setupBreadcrumb();
    this.loadProcesso();
    this.loadAtividades();
    this.loadDocumentos();
    this.loadMensagens();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private setupBreadcrumb(): void {
    this.breadcrumbHome = {
      icon: 'pi pi-home',
      routerLink: [this.getDashboardRoute()]
    };

    this.breadcrumbItems = [
      {
        label: 'Processos',
        routerLink: [this.getProcessosRoute()]
      },
      {
        label: 'Detalhes',
        routerLink: ['/shared/processo', this.processoId]
      }
    ];
  }

  private loadProcesso(): void {
    this.processoService.getProcessoById(this.processoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (processo) => {
          this.processo = processo;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar processo:', error);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Processo não encontrado'
          });
          this.router.navigate([this.getProcessosRoute()]);
        }
      });
  }

  private loadAtividades(): void {
    // Simular carregamento de atividades
    this.atividades = [
      {
        id: '1',
        tipo: 'criacao',
        titulo: 'Processo Criado',
        descricao: 'O processo foi criado e está aguardando atribuição de advogado.',
        data: new Date('2024-01-15T10:00:00'),
        usuario: 'Sistema',
        icone: 'pi pi-plus-circle',
        cor: '#10b981'
      },
      {
        id: '2',
        tipo: 'atribuicao',
        titulo: 'Advogado Atribuído',
        descricao: 'Dr. Carlos Oliveira foi atribuído ao processo.',
        data: new Date('2024-01-16T14:30:00'),
        usuario: 'Sistema',
        icone: 'pi pi-user-plus',
        cor: '#3b82f6'
      },
      {
        id: '3',
        tipo: 'documento',
        titulo: 'Documento Adicionado',
        descricao: 'Contrato inicial foi anexado ao processo.',
        data: new Date('2024-01-17T09:15:00'),
        usuario: 'Dr. Carlos Oliveira',
        icone: 'pi pi-file',
        cor: '#f59e0b'
      },
      {
        id: '4',
        tipo: 'status',
        titulo: 'Status Atualizado',
        descricao: 'Status alterado para "Em Andamento".',
        data: new Date('2024-01-18T16:45:00'),
        usuario: 'Dr. Carlos Oliveira',
        icone: 'pi pi-refresh',
        cor: '#8b5cf6'
      }
    ];

    // Adicionar steps futuros (disabilitados) simulando processo judicial completo
    const stepsFuturos = [
      {
        id: '5',
        tipo: 'audiencia',
        titulo: 'Audiência de Conciliação',
        descricao: 'Primeira audiência para tentativa de conciliação entre as partes.',
        data: null,
        usuario: null,
        icone: 'pi pi-users',
        cor: '#6b7280'
      },
      {
        id: '6',
        tipo: 'pericia',
        titulo: 'Perícia Técnica',
        descricao: 'Realização de perícia técnica para análise dos fatos.',
        data: null,
        usuario: null,
        icone: 'pi pi-search',
        cor: '#6b7280'
      },
      {
        id: '7',
        tipo: 'testemunhas',
        titulo: 'Oitiva de Testemunhas',
        descricao: 'Audiência para oitiva das testemunhas arroladas.',
        data: null,
        usuario: null,
        icone: 'pi pi-user-plus',
        cor: '#6b7280'
      },
      {
        id: '8',
        tipo: 'alegacoes',
        titulo: 'Alegações Finais',
        descricao: 'Apresentação das alegações finais pelas partes.',
        data: null,
        usuario: null,
        icone: 'pi pi-file-edit',
        cor: '#6b7280'
      },
      {
        id: '9',
        tipo: 'sentenca',
        titulo: 'Sentença Proferida',
        descricao: 'Prolação da sentença pelo magistrado.',
        data: null,
        usuario: null,
        icone: 'pi pi-hammer',
        cor: '#6b7280'
      },
      {
        id: '10',
        tipo: 'recurso',
        titulo: 'Recurso Interposto',
        descricao: 'Possível interposição de recurso pela parte vencida.',
        data: null,
        usuario: null,
        icone: 'pi pi-arrow-up',
        cor: '#6b7280'
      },
      {
        id: '11',
        tipo: 'execucao',
        titulo: 'Execução da Sentença',
        descricao: 'Cumprimento da sentença transitada em julgado.',
        data: null,
        usuario: null,
        icone: 'pi pi-check-circle',
        cor: '#6b7280'
      },
      {
        id: '12',
        tipo: 'arquivamento',
        titulo: 'Arquivamento do Processo',
        descricao: 'Arquivamento definitivo do processo após cumprimento.',
        data: null,
        usuario: null,
        icone: 'pi pi-folder',
        cor: '#6b7280'
      }
    ];

    // Combinar atividades existentes com steps futuros
    const todasAtividades = [...this.atividades, ...stepsFuturos];

    // Converter atividades para o formato do p-timeline (legado)
    this.timelineEvents = todasAtividades.map((atividade, index) => ({
      titulo: atividade.titulo,
      descricao: atividade.descricao,
      data: atividade.data,
      usuario: atividade.usuario,
      icone: atividade.icone,
      cor: atividade.cor,
      tipo: atividade.tipo,
      status: this.getEventStatusFromTipo(atividade.tipo, index),
      id: atividade.id
    }));

    // Converter atividades para o novo componente timeline-horizontal
    this.timelineSteps = todasAtividades.map((atividade, index) => ({
      id: atividade.id,
      titulo: atividade.titulo,
      descricao: atividade.descricao,
      icone: atividade.icone,
      estado: this.getStepEstadoFromTipo(atividade.tipo, index),
      usuario: atividade.usuario,
      data: atividade.data,
      acoes: index < this.atividades.length ? this.getStepAcoes(atividade as ProcessoAtividade) : []
    }));

    // Definir step atual baseado no progresso
    this.currentStepIndex = this.getCurrentStepIndex();

    // Calcular largura mínima da timeline baseada no número de steps
    this.calcularLarguraTimeline();
  }

  // Método para converter tipo de atividade para estado do step
  private getStepEstadoFromTipo(tipo: string, index: number): 'completed' | 'current' | 'upcoming' | 'disabled' {
    const totalAtividades = this.atividades.length; // Apenas as atividades reais (sem os steps futuros)

    if (index < totalAtividades) {
      // É uma atividade real
      if (index < this.currentStepIndex) {
        return 'completed';
      } else if (index === this.currentStepIndex) {
        return 'current';
      } else {
        return 'upcoming';
      }
    } else {
      // É um step futuro (disabilitado)
      return 'disabled';
    }
  }

  // Método para obter ações do step
  private getStepAcoes(atividade: ProcessoAtividade): any[] {
    // Retorna ações baseadas no tipo de atividade
    switch (atividade.tipo) {
      case 'criacao':
        return [
          {
            label: 'Ver Detalhes',
            tipo: 'primary' as const,
            acao: () => this.verDetalhesProcesso()
          }
        ];
      case 'atribuicao':
        return [
          {
            label: 'Contato Advogado',
            tipo: 'secondary' as const,
            acao: () => this.contatoAdvogado()
          }
        ];
      case 'documento':
        return [
          {
            label: 'Baixar',
            tipo: 'success' as const,
            acao: () => this.baixarDocumento({} as ProcessoDocumento)
          }
        ];
      default:
        return [
          {
            label: 'Ver Mais',
            tipo: 'info' as const,
            acao: () => console.log('Ver mais detalhes')
          }
        ];
    }
  }

  // Método para obter índice do step atual
  private getCurrentStepIndex(): number {
    // Lógica para determinar qual é o step atual baseado no progresso
    const completedCount = this.atividades.filter(a => a.tipo === 'conclusao').length;
    return Math.min(completedCount, this.atividades.length - 1);
  }

  // Métodos auxiliares para o p-timeline
  getEventStatus(event: any): string {
    return event.status || 'pending';
  }

  getEventIcon(event: any): string {
    const status = this.getEventStatus(event);
    switch (status) {
      case 'completed':
        return 'pi-check-circle';
      case 'current':
        return 'pi-clock';
      case 'pending':
        return 'pi-exclamation-circle';
      case 'disabled':
        return 'pi-lock';
      default:
        return 'pi-question-circle';
    }
  }

  getEventStatusLabel(event: any): string {
    const status = this.getEventStatus(event);
    switch (status) {
      case 'completed':
        return 'CONCLUÍDO';
      case 'current':
        return 'EM ANDAMENTO';
      case 'pending':
        return 'PENDENTE';
      case 'disabled':
        return 'FUTURO';
      default:
        return 'DESCONHECIDO';
    }
  }

  getEventStatusFromTipo(tipo: string, index?: number): string {
    // Mapeia tipos para status iniciais
    const totalAtividades = this.atividades.length; // Apenas as atividades reais

    if (index !== undefined && index >= totalAtividades) {
      // É um step futuro (disabilitado)
      return 'disabled';
    }

    switch (tipo) {
      case 'criacao':
        return 'completed';
      case 'atribuicao':
        return 'completed';
      case 'documento':
        return 'completed';
      case 'status':
        return 'current';
      case 'conclusao':
        return 'completed';
      // Novos tipos de processo judicial
      case 'audiencia':
        return 'pending';
      case 'pericia':
        return 'pending';
      case 'testemunhas':
        return 'pending';
      case 'alegacoes':
        return 'pending';
      case 'sentenca':
        return 'pending';
      case 'recurso':
        return 'pending';
      case 'execucao':
        return 'pending';
      case 'arquivamento':
        return 'pending';
      default:
        return 'pending';
    }
  }

  getMarkerColor(event: any): string {
    // Para steps futuros (disabilitados), usar cor cinza
    if (event.status === 'disabled') {
      return '#9ca3af';
    }
    return event.cor || '#6b7280';
  }

  getCompletedSteps(): number {
    if (!this.atividades || this.atividades.length === 0) return 0;
    // Conta quantos eventos estão marcados como concluídos baseado na posição
    const totalAtividades = this.atividades.length;
    return Math.max(0, totalAtividades - 1); // Todos exceto o último são considerados concluídos
  }

  getProgressPercentage(): number {
    if (!this.atividades || this.atividades.length === 0) return 0;
    const totalSteps = this.atividades.length;
    const completedSteps = this.getCompletedSteps();
    return Math.round((completedSteps / totalSteps) * 100);
  }

  private loadDocumentos(): void {
    // Simular carregamento de documentos
    this.documentos = [
      {
        id: '1',
        nome: 'Contrato de Prestação de Serviços',
        tipo: 'PDF',
        tamanho: '2.3 MB',
        dataUpload: new Date('2024-01-17T09:15:00'),
        uploadedBy: 'Dr. Carlos Oliveira'
      },
      {
        id: '2',
        nome: 'Documentos Pessoais',
        tipo: 'ZIP',
        tamanho: '5.7 MB',
        dataUpload: new Date('2024-01-18T11:20:00'),
        uploadedBy: 'João Silva'
      },
      {
        id: '3',
        nome: 'Petição Inicial',
        tipo: 'DOCX',
        tamanho: '1.2 MB',
        dataUpload: new Date('2024-01-19T14:30:00'),
        uploadedBy: 'Dr. Carlos Oliveira'
      }
    ];
  }

  private loadMensagens(): void {
    // Simular carregamento de mensagens
    this.mensagens = [
      {
        id: '1',
        usuario: 'João Silva',
        conteudo: 'Olá Dr. Carlos, gostaria de saber como está o andamento do meu processo.',
        data: new Date('2024-01-20T10:30:00'),
        tipo: 'usuario'
      },
      {
        id: '2',
        usuario: 'Dr. Carlos Oliveira',
        conteudo: 'Olá João! O processo está em andamento. Já protocolamos a petição inicial e aguardamos o retorno do tribunal.',
        data: new Date('2024-01-20T15:45:00'),
        tipo: 'usuario'
      },
      {
        id: '3',
        usuario: 'Sistema',
        conteudo: 'Nova movimentação no processo: Petição protocolada com sucesso.',
        data: new Date('2024-01-21T08:00:00'),
        tipo: 'sistema'
      },
      {
        id: '4',
        usuario: 'João Silva',
        conteudo: 'Perfeito! Quando devemos ter uma resposta?',
        data: new Date('2024-01-21T09:15:00'),
        tipo: 'usuario'
      },
      {
        id: '5',
        usuario: 'Dr. Carlos Oliveira',
        conteudo: 'Normalmente entre 15 a 30 dias úteis. Vou acompanhar e te manter informado.',
        data: new Date('2024-01-21T14:20:00'),
        tipo: 'usuario'
      }
    ];
    
    this.agruparMensagensPorData();
  }

  private agruparMensagensPorData(): void {
    const grupos: { [key: string]: ProcessoMensagem[] } = {};
    
    this.mensagens.forEach(msg => {
      const data = msg.data.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!grupos[data]) {
        grupos[data] = [];
      }
      grupos[data].push(msg);
    });
    
    this.mensagensAgrupadas = Object.keys(grupos).map(data => ({
      data: data,
      mensagens: grupos[data].sort((a, b) => a.data.getTime() - b.data.getTime()),
      expandido: false,
      resumoDia: null as string | null,
      gerandoResumo: false
    })).sort((a, b) => {
      const dataA = new Date(a.mensagens[0].data);
      const dataB = new Date(b.mensagens[0].data);
      return dataB.getTime() - dataA.getTime();
    });
  }

  // Métodos de navegação
  getDashboardRoute(): string {
    const userType = this.currentUser?.tipo;
    switch (userType) {
      case 'cliente': return '/cliente/dashboard';
      case 'advogado': return '/advogado/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  }

  getProcessosRoute(): string {
    const userType = this.currentUser?.tipo;
    switch (userType) {
      case 'cliente': return '/cliente/processos';
      case 'advogado': return '/advogado/processos';
      case 'admin': return '/admin/processos/todos';
      default: return '/';
    }
  }


  // Métodos de exibição
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'aberto': 'Aberto',
      'em_andamento': 'Em Andamento',
      'aguardando_cliente': 'Aguardando Cliente',
      'aguardando_advogado': 'Aguardando Advogado',
      'concluido': 'Concluído',
      'arquivado': 'Arquivado'
    };
    return statusMap[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
      'aberto': 'info',
      'em_andamento': 'warning',
      'aguardando_cliente': 'secondary',
      'aguardando_advogado': 'info',
      'concluido': 'success',
      'arquivado': 'danger'
    };
    return severityMap[status] || 'info';
  }

  getTipoLabel(tipo: string): string {
    const tipoMap: { [key: string]: string } = {
      'civil': 'Direito Civil',
      'familia': 'Direito de Família',
      'trabalhista': 'Direito do Trabalho',
      'empresarial': 'Direito Empresarial',
      'tributario': 'Direito Tributário',
      'criminal': 'Direito Criminal'
    };
    return tipoMap[tipo] || tipo;
  }

  getUrgenciaLabel(urgencia: string): string {
    const urgenciaMap: { [key: string]: string } = {
      'baixa': 'Baixa',
      'media': 'Média',
      'alta': 'Alta',
      'urgente': 'Urgente'
    };
    return urgenciaMap[urgencia] || urgencia;
  }

  getUrgenciaSeverity(urgencia: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
      'baixa': 'success',
      'media': 'info',
      'alta': 'warning',
      'urgente': 'danger'
    };
    return severityMap[urgencia] || 'info';
  }

  getClienteNome(): string {
    // Simular nome do cliente
    return 'João Silva';
  }

  getAdvogadoNome(): string {
    // Simular nome do advogado
    return 'Dr. Maria Santos';
  }

  // Métodos de ação
  iniciarChat(processo: Processo): void {
    this.router.navigate(['/shared/chat', processo.id]);
  }

  gerarResumoIA(): void {
    if (this.mensagens.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Não há mensagens para gerar resumo.'
      });
      return;
    }

    this.gerandoResumo = true;
    
    // Simular geração de resumo por IA
    setTimeout(() => {
      this.resumoIA = this.simularResumoIA();
      this.gerandoResumo = false;
      
      this.messageService.add({
        severity: 'success',
        summary: 'Resumo Gerado',
        detail: 'Resumo da conversa gerado com sucesso!'
      });
    }, 2000);
  }

  private simularResumoIA(): string {
    const mensagensUsuario = this.mensagens.filter(m => m.tipo === 'usuario');
    const mensagensSistema = this.mensagens.filter(m => m.tipo === 'sistema');
    
    return `**Resumo da Conversa sobre o Processo P001**\n\n` +
           `**Participantes:** ${[...new Set(this.mensagens.map(m => m.usuario))].join(', ')}\n\n` +
           `**Principais Tópicos Discutidos:**\n` +
           `• Andamento do processo e protocolo de petição inicial\n` +
           `• Prazos de resposta do tribunal (15-30 dias úteis)\n` +
           `• Acompanhamento e comunicação de atualizações\n\n` +
           `**Status Atual:** Processo em andamento, aguardando retorno do tribunal.\n\n` +
           `**Próximos Passos:** Acompanhamento contínuo e comunicação de atualizações ao cliente.`;
  }

  fecharResumoIA(): void {
    this.resumoIA = null;
  }

  toggleGrupo(index: number): void {
    this.mensagensAgrupadas[index].expandido = !this.mensagensAgrupadas[index].expandido;
  }

  gerarResumoDia(event: Event, index: number): void {
    event.stopPropagation(); // Evita que o clique no botão expanda/contraia o grupo
    
    const grupo = this.mensagensAgrupadas[index];
    if (grupo.mensagens.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Não há mensagens neste dia para gerar resumo.'
      });
      return;
    }

    grupo.gerandoResumo = true;
    
    // Simular geração de resumo por IA para o dia específico
    setTimeout(() => {
      grupo.resumoDia = this.simularResumoDia(grupo.mensagens);
      grupo.gerandoResumo = false;
      
      this.messageService.add({
        severity: 'success',
        summary: 'Resumo do Dia Gerado',
        detail: 'Resumo das conversas do dia gerado com sucesso!'
      });
    }, 1500);
  }

  private simularResumoDia(mensagens: ProcessoMensagem[]): string {
    const participantes = [...new Set(mensagens.map(m => m.usuario))];
    const mensagensUsuario = mensagens.filter(m => m.tipo === 'usuario');
    const mensagensSistema = mensagens.filter(m => m.tipo === 'sistema');
    
    const data = mensagens[0].data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    return `**Resumo do Dia ${data}**\n\n` +
           `**Participantes:** ${participantes.join(', ')}\n\n` +
           `**Atividades do Dia:**\n` +
           `• ${mensagensUsuario.length} mensagens de usuários\n` +
           `• ${mensagensSistema.length} notificações do sistema\n\n` +
           `**Principais Discussões:**\n` +
           `• ${mensagensUsuario.map(m => m.conteudo.substring(0, 50) + '...').join('\n• ')}\n\n` +
           `**Status:** Conversa ativa com ${mensagens.length} interações no total.`;
  }

  fecharResumoDia(index: number): void {
    this.mensagensAgrupadas[index].resumoDia = null;
  }

  processarMarkdown(texto: string | null): string {
    if (!texto) return '';
    
    return texto
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **texto** -> <strong>texto</strong>
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // *texto* -> <em>texto</em>
      .replace(/\n/g, '<br>'); // Quebras de linha
  }

  editarProcesso(processo: Processo): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Funcionalidade em Desenvolvimento',
      detail: 'A edição de processos será implementada em breve.'
    });
  }

  exportarProcesso(processo: Processo): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Funcionalidade em Desenvolvimento',
      detail: 'A exportação de processos será implementada em breve.'
    });
  }

  adicionarDocumento(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Funcionalidade em Desenvolvimento',
      detail: 'O upload de documentos será implementado em breve.'
    });
  }

  baixarDocumento(doc: ProcessoDocumento): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Download',
      detail: `Baixando ${doc.nome}...`
    });
  }

  visualizarDocumento(doc: ProcessoDocumento): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Visualização',
      detail: `Visualizando ${doc.nome}...`
    });
  }

  salvarConfiguracoes(): void {
    this.salvandoConfiguracoes = true;
    
    if (this.processo) {
      this.processoService.updateProcesso(this.processo.id, this.processo)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.salvandoConfiguracoes = false;
            this.configuracoesOriginais = { ...this.processo };
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Configurações salvas com sucesso!'
            });
          },
          error: (error) => {
            this.salvandoConfiguracoes = false;
            console.error('Erro ao salvar configurações:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao salvar configurações'
            });
          }
        });
    }
  }

  salvarRascunho(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Rascunho Salvo',
      detail: 'As alterações foram salvas como rascunho.'
    });
  }

  cancelarAlteracoes(): void {
    if (this.configuracoesOriginais && Object.keys(this.configuracoesOriginais).length > 0) {
      this.processo = { ...this.configuracoesOriginais };
    }
    
    this.messageService.add({
      severity: 'info',
      summary: 'Alterações Canceladas',
      detail: 'As alterações foram descartadas.'
    });
  }

  voltarParaProcessos(): void {
    this.router.navigate([this.getProcessosRoute()]);
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

  // Métodos de ajuda
  mostrarAjuda(): void {
    this.router.navigate(['/shared/ajuda']);
  }

  contatarSuporte(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Suporte',
      detail: 'Entre em contato conosco através do chat ou email: suporte@4jus.com'
    });
  }

  // Métodos para botões condicionais
  aceitarConclusao(processo: Processo): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja aceitar a conclusão deste processo?',
      header: 'Aceitar Conclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Aceitar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.processandoAceitar = true;
        
        // Efeito visual imediato
        this.messageService.add({
          severity: 'info',
          summary: 'Processando...',
          detail: 'Aceitando conclusão do processo...'
        });

        this.processoService.updateProcesso(processo.id, { status: 'concluido' })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              // Efeito de sucesso
              this.processoAceito = true;
              this.processandoAceitar = false;
              
              // Mensagem de sucesso com efeito
              this.messageService.add({
                severity: 'success',
                summary: '🎉 Conclusão Aceita!',
                detail: 'Processo marcado como concluído com sucesso. Parabéns!',
                life: 5000
              });

              // Efeito de confetes (simulado)
              this.showConfettiEffect();
              
              this.loadProcesso(); // Recarregar dados
            },
            error: (error) => {
              this.processandoAceitar = false;
              console.error('Erro ao aceitar conclusão:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao aceitar conclusão do processo'
              });
            }
          });
      }
    });
  }

  private showConfettiEffect(): void {
    // Simular efeito de confetes com mensagem
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: '✨ Processo Finalizado!',
        detail: 'O processo foi concluído com sucesso!',
        life: 3000
      });
    }, 1000);
  }

  getButtonClass(): string {
    if (this.processandoAceitar) {
      return 'p-button-info mr-2 pulse-animation';
    }
    if (this.processoAceito) {
      return 'p-button-success mr-2 success-glow';
    }
    return 'p-button-success mr-2';
  }

  marcarComoConcluido(processo: Processo): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja marcar este processo como concluído?',
      header: 'Marcar como Concluído',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sim, Concluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.processoService.updateProcesso(processo.id, { status: 'concluido' })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Processo Concluído!',
                detail: 'Processo marcado como concluído com sucesso.'
              });
              this.loadProcesso(); // Recarregar dados
            },
            error: (error) => {
              console.error('Erro ao concluir processo:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao concluir processo'
              });
            }
          });
      }
    });
  }

  abrirModalAvaliacao(processo: Processo): void {
    this.processoSelecionado = processo;
    this.dadosAvaliacao = {
      descricao: '',
      decisao: null,
      observacoes: ''
    };
    this.showModalAvaliacao = true;
  }

  cancelarAvaliacao(): void {
    this.processoSelecionado = null;
    this.dadosAvaliacao = {
      descricao: '',
      decisao: null,
      observacoes: ''
    };
    this.showModalAvaliacao = false;
  }

  isAvaliacaoValid(): boolean {
    return !!(this.dadosAvaliacao.descricao?.trim() && this.dadosAvaliacao.decisao);
  }

  confirmarAvaliacao(): void {
    if (!this.processoSelecionado || !this.isAvaliacaoValid()) {
      return;
    }

    this.processandoAvaliacao = true;

    const dadosAvaliacao = {
      descricao: this.dadosAvaliacao.descricao,
      decisao: this.dadosAvaliacao.decisao,
      observacoes: this.dadosAvaliacao.observacoes,
      avaliadoPor: this.currentUser?.nome,
      dataAvaliacao: new Date().toISOString()
    };

    // Simular envio da avaliação
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Avaliação Registrada!',
        detail: `Avaliação ${this.dadosAvaliacao.decisao === 'aceitar' ? 'aceita' : 'rejeitada'} com sucesso.`
      });
      
      this.cancelarAvaliacao();
      this.processandoAvaliacao = false;
      
      // Se aceitar, marcar como concluído
      if (this.dadosAvaliacao.decisao === 'aceitar' && this.processoSelecionado) {
        this.processoService.updateProcesso(this.processoSelecionado.id, { status: 'concluido' })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadProcesso(); // Recarregar dados
            },
            error: (error) => {
              console.error('Erro ao atualizar processo:', error);
            }
          });
      }
    }, 1500);
  }

  // === MÉTODOS PARA O NOVO COMPONENTE TIMELINE-HORIZONTAL ===

  onTimelineStepClick(event: any): void {
    console.log('Step clicado:', event);
    // Lógica para lidar com clique no step
  }

  onTimelineStepChange(stepIndex: number): void {
    console.log('Step alterado para:', stepIndex);
    this.currentStepIndex = stepIndex;
    // Atualizar dados se necessário
  }

  onTimelineActionClick(data: any): void {
    console.log('Ação executada:', data);
    // Executar a ação específica do step
  }

  // === MÉTODOS AUXILIARES PARA AÇÕES DOS STEPS ===

  verDetalhesProcesso(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Detalhes',
      detail: 'Visualizando detalhes do processo...'
    });
  }

  contatoAdvogado(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Contato',
      detail: 'Iniciando contato com o advogado...'
    });
  }

  // === MÉTODOS PARA TIMELINE BOOTSTRAP ===

  // Método para calcular largura mínima da timeline baseada no número de steps
  private calcularLarguraTimeline(): void {
    const numSteps = this.timelineSteps.length;
    const itemWidth = 160; // largura mínima de cada item
    const gapWidth = 16; // gap de 1rem = 16px
    const paddingWidth = 32; // padding de 1rem de cada lado = 32px

    // Calcular largura mínima: (número de steps * largura do item) + gaps + padding
    const minWidth = (numSteps * itemWidth) + ((numSteps - 1) * gapWidth) + paddingWidth;

    // Se a largura calculada for maior que 100%, usar a largura calculada
    if (minWidth > window.innerWidth * 0.9) {
      this.timelineMinWidth = `${minWidth}px`;
    } else {
      this.timelineMinWidth = '100%';
    }
  }

  toggleTimelineItem(event: any): void {
    event.expanded = !event.expanded;
  }

}
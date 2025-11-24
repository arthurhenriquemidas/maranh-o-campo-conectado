import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { SindicadoService, SindicadoFiltro, SindicadoEstatisticas } from '../../../../core/services/sindicado.service';
import { SindicadosMockService } from '../../../../../assets/mock/sindicados-mock.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AuthUser, DocumentoComprobatorio } from '../../../../core/models/user.model';

@Component({
  selector: 'app-sindicados',
  templateUrl: './sindicados.component.html',
  styleUrls: ['./sindicados.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class SindicadosComponent implements OnInit, OnDestroy {
  @ViewChild('mainInput', { static: false }) mainInput!: ElementRef<HTMLInputElement>;

  currentUser: AuthUser | null = null;
  sindicados: any[] = [];
  estatisticas: SindicadoEstatisticas | null = null;
  loading = true;

  // Notificações
  hasNotifications = true;

  // Breadcrumb
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};

  // Filtros
  filtros: SindicadoFiltro = {};
  tipoFiltro: string = '';
  statusFiltro: string = '';
  verificadoFiltro: string = '';
  buscaTexto: string = '';

  // Opções para dropdowns
  tiposSindicado = [
    { label: 'Todos os Tipos', value: '' },
    { label: 'Cooperativas', value: 'cooperativa' },
    { label: 'Sindicatos', value: 'sindicato' }
  ];

  statusOptions = [
    { label: 'Todos os Status', value: '' },
    { label: 'Ativo', value: 'ativo' },
    { label: 'Inativo', value: 'inativo' },
    { label: 'Pendente', value: 'pendente' }
  ];


  // Dialogs
  showSindicadoDialog = false;
  showVerificationDialog = false;
  showAdvogadosDialog = false;
  showProcessosDialog = false;
  showImportDialog = false;
  selectedSindicado: any = null;
  sindicadoDialogMode: 'view' | 'edit' | 'create' = 'view';

  // Importação
  importFile: File | null = null;
  importLoading = false;

  // Documentos comprobatórios
  documentosComprobatorios: DocumentoComprobatorio[] = [];
  documentosTemporarios: { 
    tipo: string; 
    arquivo: File; 
    observacoes?: string;
    dataVencimento?: Date;
    prioridade?: string;
  }[] = [];

  // Gerenciamento de Advogados
  advogadosVinculados: any[] = [];
  advogadosDisponiveis: any[] = [];
  carregandoAdvogados = false;
  filtroAdvogado = {
    busca: '',
    status: '',
    verificado: ''
  };
  statusAdvogadoOptions = [
    { label: 'Todos', value: '' },
    { label: 'Ativo', value: 'ativo' },
    { label: 'Inativo', value: 'inativo' },
    { label: 'Pendente', value: 'pendente' }
  ];
  verificacaoOptions = [
    { label: 'Todos', value: '' },
    { label: 'Verificado', value: true },
    { label: 'Não Verificado', value: false }
  ];

  // Gerenciamento de Processos do Advogado
  showProcessosAdvogadoDialog = false;
  selectedAdvogado: any = null;
  processosAdvogado: any[] = [];
  processosDisponiveis: any[] = [];
  carregandoProcessos = false;
  filtroProcesso = {
    busca: '',
    status: '',
    tipo: '',
    dataInicio: null as Date | null,
    dataFim: null as Date | null
  };
  statusProcessoOptions = [
    { label: 'Todos', value: '' },
    { label: 'Ativo', value: 'ativo' },
    { label: 'Arquivado', value: 'arquivado' },
    { label: 'Suspenso', value: 'suspenso' },
    { label: 'Concluído', value: 'concluido' }
  ];
  tipoProcessoOptions = [
    { label: 'Todos', value: '' },
    { label: 'Trabalhista', value: 'trabalhista' },
    { label: 'Previdenciário', value: 'previdenciario' },
    { label: 'Cível', value: 'civil' },
    { label: 'Criminal', value: 'criminal' },
    { label: 'Tributário', value: 'tributario' }
  ];
  novoDocumento: { 
    tipo: string; 
    arquivo: File | null; 
    observacoes?: string;
    dataVencimento?: Date;
    prioridade?: string;
  } = { 
    tipo: '', 
    arquivo: null,
    observacoes: '',
    prioridade: 'media'
  };
  uploadingDocumento = false;
  isDragOver = false;

  // Opções para dropdowns
  estadosOptions = [
    { label: 'Acre', value: 'AC' },
    { label: 'Alagoas', value: 'AL' },
    { label: 'Amapá', value: 'AP' },
    { label: 'Amazonas', value: 'AM' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Ceará', value: 'CE' },
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Espírito Santo', value: 'ES' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Maranhão', value: 'MA' },
    { label: 'Mato Grosso', value: 'MT' },
    { label: 'Mato Grosso do Sul', value: 'MS' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Pará', value: 'PA' },
    { label: 'Paraíba', value: 'PB' },
    { label: 'Paraná', value: 'PR' },
    { label: 'Pernambuco', value: 'PE' },
    { label: 'Piauí', value: 'PI' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Rio Grande do Norte', value: 'RN' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Rondônia', value: 'RO' },
    { label: 'Roraima', value: 'RR' },
    { label: 'Santa Catarina', value: 'SC' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Sergipe', value: 'SE' },
    { label: 'Tocantins', value: 'TO' }
  ];

  tiposDocumentoOptions = [
    { label: 'Estatuto Social', value: 'estatuto', description: 'Documento que define as regras e objetivos da organização' },
    { label: 'Ata de Constituição', value: 'ata_constituicao', description: 'Documento que registra a criação da entidade' },
    { label: 'CNPJ', value: 'cnpj', description: 'Comprovante de inscrição no Cadastro Nacional de Pessoa Jurídica' },
    { label: 'Alvará de Funcionamento', value: 'alvara', description: 'Licença para funcionamento da entidade' },
    { label: 'Registro no Ministério do Trabalho', value: 'registro_mte', description: 'Registro sindical no Ministério do Trabalho' },
    { label: 'Certidão de Regularidade FGTS', value: 'certidao_fgts', description: 'Certidão de regularidade com o FGTS' },
    { label: 'Certidão de Regularidade INSS', value: 'certidao_inss', description: 'Certidão de regularidade com o INSS' },
    { label: 'Certidão de Regularidade Trabalhista', value: 'certidao_trabalhista', description: 'Certidão de regularidade trabalhista' },
    { label: 'Balancete/Relatório Financeiro', value: 'balancete', description: 'Demonstrativo financeiro da entidade' },
    { label: 'Ata de Assembleia', value: 'ata_assembleia', description: 'Ata de assembleia geral ou extraordinária' },
    { label: 'Regimento Interno', value: 'regimento_interno', description: 'Regulamento interno da organização' },
    { label: 'Comprovante de Endereço', value: 'comprovante_endereco', description: 'Comprovante de endereço da sede' },
    { label: 'Outros Documentos', value: 'outro', description: 'Outros documentos comprobatórios' }
  ];

  prioridadeOptions = [
    { label: 'Baixa', value: 'baixa' },
    { label: 'Média', value: 'media' },
    { label: 'Alta', value: 'alta' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private sindicadoService: SindicadoService,
    private sindicadosMock: SindicadosMockService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.setupBreadcrumb();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupBreadcrumb(): void {
    this.breadcrumbHome = { icon: 'pi pi-home', routerLink: '/admin' };
    this.breadcrumbItems = [
      { label: 'Administração', routerLink: '/admin' },
      { label: 'Usuários', routerLink: '/admin/usuarios' },
      { label: 'Sindicados/Cooperativas' }
    ];
  }

  loadData(): void {
    this.loading = true;
    
    // Carregar sindicados usando o serviço mock
    this.sindicadosMock.buscarSindicados(this.filtros)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sindicados: any[]) => {
          this.sindicados = sindicados;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar sindicados:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar sindicados'
          });
          this.loading = false;
        }
      });

    // Carregar estatísticas usando o serviço mock
    this.sindicadosMock.buscarEstatisticas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (estatisticas: SindicadoEstatisticas) => {
          this.estatisticas = estatisticas;
        },
        error: (error: any) => {
          console.error('Erro ao carregar estatísticas:', error);
        }
      });
  }

  aplicarFiltros(): void {
    this.filtros = {
      nome: this.buscaTexto || undefined,
      tipo: this.tipoFiltro as 'cooperativa' | 'sindicato' || undefined,
      status: this.statusFiltro as 'ativo' | 'inativo' | 'pendente' || undefined,
      verificado: this.verificadoFiltro ? this.verificadoFiltro === 'true' : undefined
    };
    this.loadData();
  }

  limparFiltros(): void {
    this.filtros = {};
    this.tipoFiltro = '';
    this.statusFiltro = '';
    this.verificadoFiltro = '';
    this.buscaTexto = '';
    this.loadData();
  }

  criarNovoSindicado(): void {
    this.selectedSindicado = {
      nome: '',
      email: '',
      telefone: '',
      cnpj: '',
      razaoSocial: '',
      nomeResponsavel: '',
      tipo: 'cooperativa',
      status: 'pendente',
      verificado: false,
      // Dados de endereço
      cep: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      // Dados adicionais
      dataFundacao: null,
      numeroAssociados: null,
      areaAtuacao: '',
      observacoes: '',
      // Dados jurídicos
      registroSindical: '',
      dataRegistroSindical: null,
      orgaoRegistro: '',
      representanteLegal: '',
      cpfRepresentante: '',
      cargoRepresentante: '',
      emailRepresentante: '',
      telefoneRepresentante: '',
      // Documentos
      documentosComprobatorios: [],
      statusVerificacao: 'pendente'
    };
    this.sindicadoDialogMode = 'create';
    this.showSindicadoDialog = true;
    this.documentosComprobatorios = [];
    this.documentosTemporarios = [];
  }

  visualizarSindicado(sindicado: any): void {
    this.selectedSindicado = { ...sindicado };
    this.sindicadoDialogMode = 'view';
    this.showSindicadoDialog = true;
    this.carregarDocumentosComprobatorios();
  }

  editarSindicado(sindicado: any): void {
    this.selectedSindicado = { ...sindicado };
    this.sindicadoDialogMode = 'edit';
    this.showSindicadoDialog = true;
    this.carregarDocumentosComprobatorios();
  }

  excluirSindicado(sindicado: any): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o sindicado "${sindicado.nome}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.sindicadosMock.excluirSindicado(sindicado.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sindicado Excluído',
                detail: 'Sindicado excluído com sucesso'
              });
              this.loadData();
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir sindicado'
              });
            }
          });
      }
    });
  }

  verificarSindicado(sindicado: any): void {
    this.selectedSindicado = sindicado;
    this.showVerificationDialog = true;
  }

  confirmarVerificacao(): void {
    if (!this.selectedSindicado) return;

    this.sindicadosMock.verificarSindicado(this.selectedSindicado.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sindicado Verificado',
            detail: 'Sindicado verificado com sucesso'
          });
          this.showVerificationDialog = false;
          this.loadData();
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao verificar sindicado'
          });
        }
      });
  }

  gerenciarAdvogados(sindicado: any): void {
    this.selectedSindicado = sindicado;
    this.loadAdvogadosVinculados();
    this.showAdvogadosDialog = true;
  }

  loadAdvogadosVinculados(): void {
    if (!this.selectedSindicado) return;
    
    this.usuarioService.getUsuarios({ tipo: 'advogado' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (advogados: any[]) => {
          // Filtrar apenas advogados vinculados ao sindicado
          this.advogadosVinculados = advogados.filter(advogado => 
            this.selectedSindicado.advogadosVinculados?.includes(advogado.id)
          );
        },
        error: (error: any) => {
          console.error('Erro ao carregar advogados vinculados:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar advogados vinculados'
          });
        }
      });
  }

  abrirSelecaoAdvogados(): void {
    // Mudar para a aba de busca
    this.buscarAdvogados();
  }

  buscarAdvogados(): void {
    this.carregandoAdvogados = true;
    
    const filtro: any = { tipo: 'advogado' };
    
    if (this.filtroAdvogado.busca) {
      filtro.busca = this.filtroAdvogado.busca;
    }
    
    if (this.filtroAdvogado.status) {
      filtro.status = this.filtroAdvogado.status;
    }
    
    if (this.filtroAdvogado.verificado !== '') {
      filtro.verificado = this.filtroAdvogado.verificado;
    }

    this.usuarioService.getUsuarios(filtro)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (advogados: any[]) => {
          this.advogadosDisponiveis = advogados;
          this.carregandoAdvogados = false;
        },
        error: (error: any) => {
          console.error('Erro ao buscar advogados:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar advogados'
          });
          this.carregandoAdvogados = false;
        }
      });
  }

  vincularAdvogado(advogado: any): void {
    if (!this.selectedSindicado) return;

    this.confirmationService.confirm({
      message: `Deseja vincular o advogado ${advogado.nome} ao sindicado ${this.selectedSindicado.nome}?`,
      header: 'Confirmar Vinculação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.sindicadosMock.vincularAdvogado(this.selectedSindicado.id, advogado.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Advogado vinculado com sucesso'
              });
              this.loadAdvogadosVinculados();
              this.buscarAdvogados(); // Atualizar lista de disponíveis
            },
            error: (error: any) => {
              console.error('Erro ao vincular advogado:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao vincular advogado'
              });
            }
          });
      }
    });
  }

  removerAdvogado(advogado: any): void {
    if (!this.selectedSindicado) return;

    this.confirmationService.confirm({
      message: `Deseja remover o advogado ${advogado.nome} do sindicado ${this.selectedSindicado.nome}?`,
      header: 'Confirmar Remoção',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.sindicadosMock.desvincularAdvogado(this.selectedSindicado.id, advogado.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Advogado removido com sucesso'
              });
              this.loadAdvogadosVinculados();
              this.buscarAdvogados(); // Atualizar lista de disponíveis
            },
            error: (error: any) => {
              console.error('Erro ao remover advogado:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao remover advogado'
              });
            }
          });
      }
    });
  }

  isAdvogadoVinculado(advogadoId: string): boolean {
    return this.advogadosVinculados.some(adv => adv.id === advogadoId);
  }

  verPerfilAdvogado(advogado: any): void {
    // Implementar visualização do perfil do advogado
    this.messageService.add({
      severity: 'info',
      summary: 'Perfil do Advogado',
      detail: `Visualizando perfil de ${advogado.nome}`
    });
  }

  gerenciarProcessosAdvogado(advogado: any): void {
    this.selectedAdvogado = advogado;
    this.loadProcessosAdvogado();
    this.showProcessosAdvogadoDialog = true;
  }

  loadProcessosAdvogado(): void {
    if (!this.selectedAdvogado) return;
    
    this.carregandoProcessos = true;
    
    // Simular carregamento de processos do advogado
    setTimeout(() => {
      this.processosAdvogado = [
        {
          id: '1',
          numero: 'TRT-001/2024',
          tipo: 'trabalhista',
          status: 'ativo',
          cliente: 'João Silva',
          dataInicio: new Date('2024-01-15'),
          valor: 50000,
          descricao: 'Processo trabalhista por horas extras'
        },
        {
          id: '2',
          numero: 'TRT-002/2024',
          tipo: 'trabalhista',
          status: 'concluido',
          cliente: 'Maria Santos',
          dataInicio: new Date('2024-02-20'),
          dataFim: new Date('2024-06-15'),
          valor: 25000,
          descricao: 'Processo trabalhista por rescisão'
        },
        {
          id: '3',
          numero: 'INSS-001/2024',
          tipo: 'previdenciario',
          status: 'ativo',
          cliente: 'Pedro Costa',
          dataInicio: new Date('2024-03-10'),
          valor: 15000,
          descricao: 'Processo previdenciário por aposentadoria'
        }
      ];
      
      this.processosDisponiveis = [
        {
          id: '4',
          numero: 'CIV-001/2024',
          tipo: 'civil',
          status: 'ativo',
          cliente: 'Ana Oliveira',
          dataInicio: new Date('2024-04-05'),
          valor: 30000,
          descricao: 'Processo cível por danos morais'
        },
        {
          id: '5',
          numero: 'CRIM-001/2024',
          tipo: 'criminal',
          status: 'suspenso',
          cliente: 'Carlos Lima',
          dataInicio: new Date('2024-05-12'),
          valor: 0,
          descricao: 'Processo criminal por estelionato'
        }
      ];
      
      this.carregandoProcessos = false;
    }, 1000);
  }

  buscarProcessos(): void {
    this.carregandoProcessos = true;
    
    // Simular busca de processos
    setTimeout(() => {
      let processos = [...this.processosDisponiveis];
      
      if (this.filtroProcesso.busca) {
        processos = processos.filter(p => 
          p.numero.toLowerCase().includes(this.filtroProcesso.busca.toLowerCase()) ||
          p.cliente.toLowerCase().includes(this.filtroProcesso.busca.toLowerCase()) ||
          p.descricao.toLowerCase().includes(this.filtroProcesso.busca.toLowerCase())
        );
      }
      
      if (this.filtroProcesso.status) {
        processos = processos.filter(p => p.status === this.filtroProcesso.status);
      }
      
      if (this.filtroProcesso.tipo) {
        processos = processos.filter(p => p.tipo === this.filtroProcesso.tipo);
      }
      
      this.processosDisponiveis = processos;
      this.carregandoProcessos = false;
    }, 500);
  }

  vincularProcesso(processo: any): void {
    if (!this.selectedAdvogado || !this.selectedSindicado) return;

    this.confirmationService.confirm({
      message: `Deseja vincular o processo ${processo.numero} do advogado ${this.selectedAdvogado.nome} ao sindicado ${this.selectedSindicado.nome}?`,
      header: 'Confirmar Vinculação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Simular vinculação
        this.processosAdvogado.push(processo);
        this.processosDisponiveis = this.processosDisponiveis.filter(p => p.id !== processo.id);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Processo vinculado com sucesso'
        });
      }
    });
  }

  desvincularProcesso(processo: any): void {
    if (!this.selectedAdvogado || !this.selectedSindicado) return;

    this.confirmationService.confirm({
      message: `Deseja desvincular o processo ${processo.numero} do sindicado?`,
      header: 'Confirmar Desvinculação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Simular desvinculação
        this.processosAdvogado = this.processosAdvogado.filter(p => p.id !== processo.id);
        this.processosDisponiveis.push(processo);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Processo desvinculado com sucesso'
        });
      }
    });
  }

  isProcessoVinculado(processoId: string): boolean {
    return this.processosAdvogado.some(p => p.id === processoId);
  }

  getStatusProcessoLabel(status: string): string {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'arquivado': return 'Arquivado';
      case 'suspenso': return 'Suspenso';
      case 'concluido': return 'Concluído';
      default: return 'Desconhecido';
    }
  }

  getStatusProcessoSeverity(status: string): any {
    switch (status) {
      case 'ativo': return 'success';
      case 'arquivado': return 'secondary';
      case 'suspenso': return 'warning';
      case 'concluido': return 'info';
      default: return 'contrast';
    }
  }

  getTipoProcessoLabel(tipo: string): string {
    switch (tipo) {
      case 'trabalhista': return 'Trabalhista';
      case 'previdenciario': return 'Previdenciário';
      case 'civil': return 'Cível';
      case 'criminal': return 'Criminal';
      case 'tributario': return 'Tributário';
      default: return 'Desconhecido';
    }
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  gerenciarProcessos(sindicado: any): void {
    this.selectedSindicado = sindicado;
    this.showProcessosDialog = true;
  }

  importarAdvogados(sindicado: any): void {
    this.selectedSindicado = sindicado;
    this.showImportDialog = true;
  }

  onFileSelect(event: any): void {
    this.importFile = event.files[0];
  }

  executarImportacao(): void {
    if (!this.importFile || !this.selectedSindicado) return;

    this.importLoading = true;
    this.sindicadosMock.importarAdvogados(this.selectedSindicado.id, this.importFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
          next: (resultado: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Importação Concluída',
            detail: `${resultado.importados} advogados importados com sucesso`
          });
          this.showImportDialog = false;
          this.importFile = null;
          this.importLoading = false;
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro na Importação',
            detail: 'Erro ao importar advogados'
          });
          this.importLoading = false;
        }
      });
  }

  salvarSindicado(): void {
    if (!this.selectedSindicado) return;

    // Validações básicas
    if (!this.validarFormulario()) {
      return;
    }

    if (this.sindicadoDialogMode === 'create') {
      this.sindicadosMock.criarSindicado(this.selectedSindicado)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (novoSindicado: any) => {
            // Processar documentos temporários após a criação
            this.processarDocumentosTemporarios(novoSindicado.id);
            
            this.messageService.add({
              severity: 'success',
              summary: 'Sindicado Criado',
              detail: 'Sindicado criado com sucesso'
            });
            this.showSindicadoDialog = false;
            this.loadData();
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar sindicado'
            });
          }
        });
    } else {
      this.sindicadosMock.atualizarSindicado(this.selectedSindicado.id, this.selectedSindicado)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sindicado Atualizado',
              detail: 'Sindicado atualizado com sucesso'
            });
            this.showSindicadoDialog = false;
            this.loadData();
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao atualizar sindicado'
            });
          }
        });
    }
  }

  validarFormulario(): boolean {
    const sindicado = this.selectedSindicado;
    
    // Campos obrigatórios
    if (!sindicado.nome?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'Nome é obrigatório'
      });
      return false;
    }

    if (!sindicado.email?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'E-mail é obrigatório'
      });
      return false;
    }

    if (!this.validarEmail(sindicado.email)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'E-mail inválido'
      });
      return false;
    }

    if (!sindicado.telefone?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'Telefone é obrigatório'
      });
      return false;
    }

    if (!sindicado.cnpj?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'CNPJ é obrigatório'
      });
      return false;
    }

    if (!this.validarCNPJ(sindicado.cnpj)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'CNPJ inválido'
      });
      return false;
    }

    if (!sindicado.razaoSocial?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'Razão Social é obrigatória'
      });
      return false;
    }

    if (!sindicado.nomeResponsavel?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'Nome do Responsável é obrigatório'
      });
      return false;
    }

    if (!sindicado.tipo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'Tipo é obrigatório'
      });
      return false;
    }

    // Validações de endereço
    if (!sindicado.cep?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'CEP é obrigatório'
      });
      return false;
    }

    if (!this.validarCEP(sindicado.cep)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'CEP inválido'
      });
      return false;
    }

    if (!sindicado.endereco?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'Endereço é obrigatório'
      });
      return false;
    }

    if (!sindicado.numero?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'Número é obrigatório'
      });
      return false;
    }

    if (!sindicado.bairro?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'Bairro é obrigatório'
      });
      return false;
    }

    if (!sindicado.cidade?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'Cidade é obrigatória'
      });
      return false;
    }

    if (!sindicado.estado) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'Estado é obrigatório'
      });
      return false;
    }

    // Validações de dados jurídicos
    if (!sindicado.representanteLegal?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'Representante Legal é obrigatório'
      });
      return false;
    }

    if (!sindicado.cpfRepresentante?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'CPF do Representante é obrigatório'
      });
      return false;
    }

    if (!this.validarCPF(sindicado.cpfRepresentante)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'CPF do Representante inválido'
      });
      return false;
    }

    if (sindicado.emailRepresentante && !this.validarEmail(sindicado.emailRepresentante)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'E-mail do Representante inválido'
      });
      return false;
    }

    return true;
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validarCNPJ(cnpj: string): boolean {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    // Verifica se tem 14 dígitos
    if (cnpj.length !== 14) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpj)) return false;
    
    // Validação do CNPJ
    let soma = 0;
    let peso = 2;
    
    // Calcula o primeiro dígito verificador
    for (let i = 11; i >= 0; i--) {
      soma += parseInt(cnpj.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    
    let resto = soma % 11;
    let dv1 = resto < 2 ? 0 : 11 - resto;
    
    if (parseInt(cnpj.charAt(12)) !== dv1) return false;
    
    // Calcula o segundo dígito verificador
    soma = 0;
    peso = 2;
    
    for (let i = 12; i >= 0; i--) {
      soma += parseInt(cnpj.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    
    resto = soma % 11;
    let dv2 = resto < 2 ? 0 : 11 - resto;
    
    return parseInt(cnpj.charAt(13)) === dv2;
  }

  validarCEP(cep: string): boolean {
    // Remove caracteres não numéricos
    cep = cep.replace(/[^\d]/g, '');
    return cep.length === 8;
  }

  validarCPF(cpf: string): boolean {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Validação do CPF
    let soma = 0;
    let resto;
    
    // Calcula o primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  }

  // Utilitários
  getSindicadoIcon(tipo: string): string {
    return this.sindicadosMock.getTipoIcon(tipo);
  }

  getSindicadoLabel(tipo: string): string {
    return this.sindicadosMock.getTipoLabel(tipo);
  }


  // Navegação
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  onNotifications(): void {
    // Implementar notificações
  }

  onProfile(): void {
    this.router.navigate(['/admin/perfil']);
  }

  // Métodos para documentos comprobatórios
  carregarDocumentosComprobatorios(): void {
    if (!this.selectedSindicado?.id) return;

    this.sindicadosMock.buscarDocumentosComprobatorios(this.selectedSindicado.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (documentos: DocumentoComprobatorio[]) => {
          this.documentosComprobatorios = documentos;
        },
        error: (error: any) => {
          console.error('Erro ao carregar documentos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar documentos comprobatórios'
          });
        }
      });
  }

  onDocumentoSelect(event: any): void {
    this.novoDocumento.arquivo = event.files[0];
  }

  // Métodos para botões de upload específicos
  triggerMainFileInput(): void {
    if (this.mainInput) {
      this.mainInput.nativeElement.click();
    }
  }

  triggerFileInput(type: string): void {
    const inputId = type + 'Input';
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  onFileInputChange(event: any, type: string): void {
    const file = event.target.files[0];
    if (file) {
      this.novoDocumento.arquivo = file;
      
      // Feedback visual baseado no tipo
      this.showFileTypeFeedback(type, file);
    }
  }

  showFileTypeFeedback(type: string, file: File): void {
    const typeMessages: { [key: string]: string } = {
      'pdf': 'Arquivo PDF selecionado com sucesso!',
      'image': 'Imagem selecionada com sucesso!',
      'word': 'Documento Word selecionado com sucesso!',
      'all': 'Arquivo selecionado com sucesso!'
    };

    this.messageService.add({
      severity: 'success',
      summary: 'Arquivo Selecionado',
      detail: typeMessages[type] || 'Arquivo selecionado com sucesso!'
    });
  }

  anexarDocumento(): void {
    if (!this.novoDocumento.arquivo || !this.novoDocumento.tipo) return;

    // Validações específicas por tipo de documento
    if (!this.validarDocumentoComprobatorio()) {
      return;
    }

    // Se estiver no modo de criação, armazenar temporariamente
    if (this.sindicadoDialogMode === 'create') {
      this.documentosTemporarios.push({
        tipo: this.novoDocumento.tipo,
        arquivo: this.novoDocumento.arquivo,
        observacoes: this.novoDocumento.observacoes,
        dataVencimento: this.novoDocumento.dataVencimento,
        prioridade: this.novoDocumento.prioridade
      });

      this.novoDocumento = { 
        tipo: '', 
        arquivo: null,
        observacoes: '',
        prioridade: 'media'
      };

      this.messageService.add({
        severity: 'success',
        summary: 'Documento Adicionado',
        detail: 'Documento será anexado após a criação do sindicado'
      });
      return;
    }

    // Se não estiver no modo de criação, fazer upload normalmente
    if (!this.selectedSindicado?.id) return;

    this.uploadingDocumento = true;
    this.sindicadosMock.uploadDocumentoComprobatorio(
      this.selectedSindicado.id, 
      this.novoDocumento.arquivo, 
      this.novoDocumento.tipo
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (documento: DocumentoComprobatorio) => {
          this.documentosComprobatorios.push(documento);
          this.novoDocumento = { 
            tipo: '', 
            arquivo: null,
            observacoes: '',
            prioridade: 'media'
          };
          this.messageService.add({
            severity: 'success',
            summary: 'Documento Anexado',
            detail: 'Documento anexado com sucesso'
          });
          this.uploadingDocumento = false;
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao anexar documento'
          });
          this.uploadingDocumento = false;
        }
      });
  }

  processarDocumentosTemporarios(sindicadoId: string): void {
    if (this.documentosTemporarios.length === 0) return;

    // Processar cada documento temporário
    this.documentosTemporarios.forEach((docTemp, index) => {
      setTimeout(() => {
        this.sindicadosMock.uploadDocumentoComprobatorio(
          sindicadoId,
          docTemp.arquivo,
          docTemp.tipo
        ).subscribe({
          next: (documento: DocumentoComprobatorio) => {
            console.log(`Documento ${index + 1} anexado com sucesso`);
          },
          error: (error: any) => {
            console.error(`Erro ao anexar documento ${index + 1}:`, error);
          }
        });
      }, index * 500); // Delay entre uploads para evitar sobrecarga
    });

    // Limpar documentos temporários
    this.documentosTemporarios = [];
  }

  removerDocumentoTemporario(index: number): void {
    this.documentosTemporarios.splice(index, 1);
    this.messageService.add({
      severity: 'info',
      summary: 'Documento Removido',
      detail: 'Documento removido da lista de pendências'
    });
  }

  validarDocumentoComprobatorio(): boolean {
    const arquivo = this.novoDocumento.arquivo;
    const tipo = this.novoDocumento.tipo;

    if (!arquivo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'Selecione um arquivo para anexar'
      });
      return false;
    }

    // Validação de tamanho (50MB máximo)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (arquivo.size > maxSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'O arquivo deve ter no máximo 50MB'
      });
      return false;
    }

    // Validação de tipo de arquivo
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff'
    ];

    if (!allowedTypes.includes(arquivo.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação',
        detail: 'Tipo de arquivo não suportado. Use PDF, DOC, DOCX, JPG, PNG, GIF, BMP ou TIFF'
      });
      return false;
    }

    // Validações específicas por tipo de documento
    switch (tipo) {
      case 'cnpj':
        if (!this.validarArquivoCNPJ(arquivo)) {
          return false;
        }
        break;
      case 'estatuto':
        if (!this.validarArquivoEstatuto(arquivo)) {
          return false;
        }
        break;
      case 'certidao_fgts':
      case 'certidao_inss':
      case 'certidao_trabalhista':
        if (!this.validarArquivoCertidao(arquivo)) {
          return false;
        }
        break;
      case 'balancete':
        if (!this.validarArquivoBalancete(arquivo)) {
          return false;
        }
        break;
    }

    return true;
  }

  validarArquivoCNPJ(arquivo: File): boolean {
    // CNPJ deve ser PDF ou imagem
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(arquivo.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação CNPJ',
        detail: 'Documento de CNPJ deve ser PDF ou imagem (JPG, PNG)'
      });
      return false;
    }
    return true;
  }

  validarArquivoEstatuto(arquivo: File): boolean {
    // Estatuto deve ser PDF ou DOC
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(arquivo.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação Estatuto',
        detail: 'Estatuto deve ser PDF ou documento Word (DOC, DOCX)'
      });
      return false;
    }
    return true;
  }

  validarArquivoCertidao(arquivo: File): boolean {
    // Certidões devem ser PDF ou imagem
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(arquivo.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação Certidão',
        detail: 'Certidão deve ser PDF ou imagem (JPG, PNG)'
      });
      return false;
    }
    return true;
  }

  validarArquivoBalancete(arquivo: File): boolean {
    // Balancete deve ser PDF, DOC ou Excel
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (!allowedTypes.includes(arquivo.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validação Balancete',
        detail: 'Balancete deve ser PDF, Word ou Excel'
      });
      return false;
    }
    return true;
  }

  removerDocumento(documento: DocumentoComprobatorio): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja remover o documento "${documento.nome}"?`,
      header: 'Confirmar Remoção',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, remover',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.sindicadosMock.removerDocumentoComprobatorio(this.selectedSindicado.id, documento.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.documentosComprobatorios = this.documentosComprobatorios.filter(d => d.id !== documento.id);
              this.messageService.add({
                severity: 'success',
                summary: 'Documento Removido',
                detail: 'Documento removido com sucesso'
              });
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao remover documento'
              });
            }
          });
      }
    });
  }

  downloadDocumento(documento: DocumentoComprobatorio): void {
    // Implementar download do documento
    window.open(documento.arquivo, '_blank');
  }

  getTipoDocumentoLabel(tipo: string): string {
    const tipoOption = this.tiposDocumentoOptions.find(t => t.value === tipo);
    return tipoOption ? tipoOption.label : tipo;
  }

  formatarTamanho(tamanho: number): string {
    if (tamanho < 1024) return tamanho + ' B';
    if (tamanho < 1024 * 1024) return (tamanho / 1024).toFixed(1) + ' KB';
    return (tamanho / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // Buscar CEP
  buscarCep(): void {
    if (!this.selectedSindicado.cep || this.selectedSindicado.cep.length < 8) return;

    // Implementar busca de CEP via API
    // Por enquanto, apenas um placeholder
    console.log('Buscando CEP:', this.selectedSindicado.cep);
  }

  // Métodos para drag-and-drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.novoDocumento.arquivo = files[0];
    }
  }

  // Métodos para gerenciamento de arquivos
  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pi pi-file-pdf text-red-500';
      case 'doc':
      case 'docx':
        return 'pi pi-file-word text-blue-500';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'tiff':
        return 'pi pi-image text-green-500';
      default:
        return 'pi pi-file text-gray-500';
    }
  }

  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toUpperCase();
    return extension || 'Arquivo';
  }

  removerArquivoSelecionado(): void {
    this.novoDocumento.arquivo = null;
  }

  cancelarUpload(): void {
    this.novoDocumento = { 
      tipo: '', 
      arquivo: null,
      observacoes: '',
      prioridade: 'media'
    };
  }

  onTipoDocumentoChange(): void {
    // Lógica adicional quando o tipo de documento muda
    console.log('Tipo de documento selecionado:', this.novoDocumento.tipo);
  }

  // Métodos para exibição de documentos
  getDocumentoCardClass(documento: DocumentoComprobatorio): string {
    let classes = 'documento-card';
    if (documento.status === 'aprovado') classes += ' documento-aprovado';
    if (documento.status === 'rejeitado') classes += ' documento-rejeitado';
    if (documento.status === 'em_analise') classes += ' documento-analise';
    return classes;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'aprovado':
        return 'pi pi-check-circle text-green-500';
      case 'rejeitado':
        return 'pi pi-times-circle text-red-500';
      case 'em_analise':
        return 'pi pi-clock text-yellow-500';
      default:
        return 'pi pi-question-circle text-gray-500';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'aprovado':
        return 'text-green-600';
      case 'rejeitado':
        return 'text-red-600';
      case 'em_analise':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'aprovado':
        return 'Aprovado';
      case 'rejeitado':
        return 'Rejeitado';
      case 'em_analise':
        return 'Em Análise';
      default:
        return 'Pendente';
    }
  }

  getStatusSeverity(status: string): any {
    switch (status) {
      case 'aprovado':
        return 'success';
      case 'rejeitado':
        return 'danger';
      case 'em_analise':
        return 'warning';
      default:
        return 'info';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'aprovado':
        return 'badge-success';
      case 'rejeitado':
        return 'badge-danger';
      case 'em_analise':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }

  getStatusBadgeText(status: string): string {
    switch (status) {
      case 'aprovado':
        return '✓ Aprovado';
      case 'rejeitado':
        return '✗ Rejeitado';
      case 'em_analise':
        return '⏳ Em Análise';
      default:
        return '⏸ Pendente';
    }
  }

  getPrioridadeIcon(prioridade: string): string {
    switch (prioridade) {
      case 'alta':
        return 'text-red-500';
      case 'media':
        return 'text-yellow-500';
      case 'baixa':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  }

  getPrioridadeLabel(prioridade: string): string {
    switch (prioridade) {
      case 'alta':
        return 'Alta Prioridade';
      case 'media':
        return 'Média Prioridade';
      case 'baixa':
        return 'Baixa Prioridade';
      default:
        return 'Prioridade';
    }
  }

  formatarData(data: string | Date): string {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  }

  visualizarDocumento(documento: DocumentoComprobatorio): void {
    // Implementar visualização do documento
    window.open(documento.arquivo, '_blank');
  }
}

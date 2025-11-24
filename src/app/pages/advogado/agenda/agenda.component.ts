import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AgendaService, AgendaEvent } from '../../../core/services/agenda.service';
import { DataState } from '../../../shared/types/data-state';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/user.model';
import { MenuItem } from 'primeng/api';
import { ProcessStatus } from '../processos/processos.component';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
  state$: Observable<DataState<AgendaEvent[]>>;
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};
  currentUser: AuthUser | null = null;
  hasNotifications = true;

  // Modal Novo Compromisso
  showNovoCompromissoModal = false;
  salvandoCompromisso = false;
  novoCompromisso: any = {};

  // Filtros
  filtroAtivo = 'todos';
  eventosFiltrados: AgendaEvent[] = [];
  todosEventos: AgendaEvent[] = [];

  // Opções para dropdowns
  tipoOptions = [
    { label: 'Audiência', value: 'audiência' },
    { label: 'Reunião', value: 'reunião' },
    { label: 'Prazo', value: 'prazo' },
    { label: 'Entrega', value: 'entrega' },
    { label: 'Consulta', value: 'consulta' }
  ];

  prioridadeOptions = [
    { label: 'Baixa', value: 'baixa' },
    { label: 'Média', value: 'média' },
    { label: 'Alta', value: 'alta' },
    { label: 'Urgente', value: 'urgente' }
  ];

  clienteOptions = [
    { label: 'João Silva', value: '1' },
    { label: 'Maria Santos', value: '2' },
    { label: 'Pedro Oliveira', value: '3' }
  ];

  processoOptions = [
    { label: 'P001 - Trabalhista', value: 'P001' },
    { label: 'P002 - Civil', value: 'P002' },
    { label: 'P003 - Família', value: 'P003' }
  ];

  // Localização brasileira para calendários
  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar',
    weekHeader: 'Sem',
    dateFormat: 'dd/mm/yy',
    weak: 'Fraco',
    medium: 'Médio',
    strong: 'Forte',
    passwordPrompt: 'Digite uma senha',
    emptyFilterMessage: 'Nenhum resultado encontrado',
    emptyMessage: 'Nenhum registro encontrado'
  };

  constructor(
    private agendaService: AgendaService,
    private breadcrumbService: BreadcrumbService,
    private authService: AuthService,
    private router: Router,
    private config: PrimeNGConfig
  ) {
    this.state$ = this.agendaService.getAgendaState();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.setupBreadcrumb();
    this.configurarLocalizacao();
    this.carregarDadosComFiltros();
  }

  private configurarLocalizacao(): void {
    this.config.setTranslation(this.ptBR);
  }

  private setupBreadcrumb(): void {
    this.breadcrumbHome = { icon: 'pi pi-home', routerLink: '/advogado/dashboard' };
    this.breadcrumbItems = [
      { label: 'Agenda' }
    ];
  }

  getStatusSeverity(status: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" {
    switch (status) {
      case 'confirmado':
        return 'success';
      case 'agendado':
        return 'info';
      case 'realizado':
        return 'success';
      case 'cancelado':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'agendado':
        return 'Agendado';
      case 'realizado':
        return 'Realizado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  }

  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case 'audiência':
        return 'pi pi-briefcase';
      case 'reunião':
        return 'pi pi-users';
      case 'prazo':
        return 'pi pi-clock';
      case 'entrega':
        return 'pi pi-file';
      default:
        return 'pi pi-calendar';
    }
  }

  getPrioridadeSeverity(prioridade: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" {
    switch (prioridade) {
      case 'urgente':
        return 'danger';
      case 'alta':
        return 'warning';
      case 'média':
        return 'info';
      case 'baixa':
        return 'success';
      default:
        return 'secondary';
    }
  }

  formatarDataHora(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(data));
  }

  formatarData(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(data));
  }

  verProcesso(processId: string): void {
    // Navegar para a página de detalhes do processo
    this.router.navigate(['/shared/processo', processId]);
  }

  confirmarEvento(eventId: string): void {
    this.agendaService.updateEventStatus(eventId, 'confirmado').subscribe();
  }

  cancelarEvento(eventId: string): void {
    this.agendaService.updateEventStatus(eventId, 'cancelado').subscribe();
  }

  marcarComoRealizado(eventId: string): void {
    this.agendaService.updateEventStatus(eventId, 'realizado').subscribe();
  }

  // Event handlers para o header
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/onboarding/welcome']);
  }

  onNotifications(): void {
    console.log('Abrir notificações');
  }

  onProfile(): void {
    this.router.navigate(['/shared/perfil']);
  }

  abrirModalNovoCompromisso(): void {
    this.novoCompromisso = {
      titulo: '',
      tipo: '',
      prioridade: 'média',
      data: null,
      hora: null,
      clienteId: '',
      processoId: '',
      local: '',
      descricao: '',
      observacoes: ''
    };
    this.showNovoCompromissoModal = true;
  }

  fecharModalNovoCompromisso(): void {
    this.showNovoCompromissoModal = false;
    this.novoCompromisso = {};
  }

  isFormValid(): boolean {
    return !!(
      this.novoCompromisso.titulo &&
      this.novoCompromisso.tipo &&
      this.novoCompromisso.data &&
      this.novoCompromisso.hora
    );
  }

  salvarCompromisso(): void {
    if (!this.isFormValid()) return;

    this.salvandoCompromisso = true;

    // Simular salvamento
    setTimeout(() => {
      this.salvandoCompromisso = false;
      this.showNovoCompromissoModal = false;
      
      // Aqui você chamaria o serviço para salvar
      console.log('Salvando compromisso:', this.novoCompromisso);
      
      // Resetar formulário
      this.novoCompromisso = {};
    }, 2000);
  }

  criarConviteGoogle(): void {
    if (!this.isFormValid()) return;

    const evento = this.gerarEventoCalendario();
    const urlGoogle = this.gerarUrlGoogleCalendar(evento);
    
    // Abrir Google Calendar em nova aba
    window.open(urlGoogle, '_blank');
    
    console.log('Criando convite no Google Calendar:', evento);
  }

  criarConviteOutlook(): void {
    if (!this.isFormValid()) return;

    const evento = this.gerarEventoCalendario();
    this.downloadArquivoICS(evento);

    console.log('Criando arquivo ICS para Outlook:', evento);
  }

  private gerarEventoCalendario(): any {
    const dataHora = this.combinarDataHora(this.novoCompromisso.data, this.novoCompromisso.hora);
    const dataFim = new Date(dataHora.getTime() + (60 * 60 * 1000)); // +1 hora

    return {
      titulo: this.novoCompromisso.titulo,
      descricao: this.novoCompromisso.descricao || '',
      local: this.novoCompromisso.local || '',
      dataInicio: dataHora,
      dataFim: dataFim,
      cliente: this.obterNomeCliente(),
      processo: this.obterNomeProcesso()
    };
  }

  private combinarDataHora(data: Date, hora: Date): Date {
    if (!data || !hora) return new Date();
    
    const dataCombinada = new Date(data);
    const horaCombinada = new Date(hora);
    
    dataCombinada.setHours(horaCombinada.getHours());
    dataCombinada.setMinutes(horaCombinada.getMinutes());
    dataCombinada.setSeconds(0);
    dataCombinada.setMilliseconds(0);
    
    return dataCombinada;
  }

  private obterNomeCliente(): string {
    const cliente = this.clienteOptions.find(c => c.value === this.novoCompromisso.clienteId);
    return cliente ? cliente.label : 'Cliente não selecionado';
  }

  private obterNomeProcesso(): string {
    const processo = this.processoOptions.find(p => p.value === this.novoCompromisso.processoId);
    return processo ? processo.label : 'Processo não selecionado';
  }

  private gerarUrlGoogleCalendar(evento: any): string {
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: evento.titulo,
      dates: this.formatarDataGoogle(evento.dataInicio) + '/' + this.formatarDataGoogle(evento.dataFim),
      details: `${evento.descricao}\n\nCliente: ${evento.cliente}\nProcesso: ${evento.processo}`,
      location: evento.local,
      trp: 'false'
    });
    
    return `${baseUrl}?${params.toString()}`;
  }

  private formatarDataGoogle(data: Date): string {
    return data.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  private downloadArquivoICS(evento: any): void {
    // Gerar conteúdo do arquivo ICS
    const icsContent = this.gerarConteudoICS(evento);
    
    // Criar blob com o conteúdo
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    
    // Criar URL temporária
    const url = window.URL.createObjectURL(blob);
    
    // Criar elemento de download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${evento.titulo.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
    
    // Adicionar ao DOM, clicar e remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpar URL temporária
    window.URL.revokeObjectURL(url);
  }

  private gerarConteudoICS(evento: any): string {
    const dataInicio = this.formatarDataICS(evento.dataInicio);
    const dataFim = this.formatarDataICS(evento.dataFim);
    const dataAtual = this.formatarDataICS(new Date());
    
    // Gerar UID único
    const uid = this.gerarUID();
    
    // Criar conteúdo ICS
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Plataforma Jurídica//Agenda//PT',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART:${dataInicio}`,
      `DTEND:${dataFim}`,
      `DTSTAMP:${dataAtual}`,
      `SUMMARY:${evento.titulo}`,
      `DESCRIPTION:${evento.descricao}\\n\\nCliente: ${evento.cliente}\\nProcesso: ${evento.processo}`,
      `LOCATION:${evento.local || ''}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    return icsContent;
  }

  private formatarDataICS(data: Date): string {
    // Formatar data para ICS (YYYYMMDDTHHMMSSZ)
    return data.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  private gerarUID(): string {
    // Gerar UID único para o evento
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}-${random}@plataforma-juridica.com`;
  }

  // Métodos para Filtros
  aplicarFiltro(tipo: string): void {
    this.filtroAtivo = tipo;
    this.filtrarEventos();
  }

  private filtrarEventos(): void {
    if (this.filtroAtivo === 'todos') {
      this.eventosFiltrados = [...this.todosEventos];
    } else {
      this.eventosFiltrados = this.todosEventos.filter(evento => {
        switch (this.filtroAtivo) {
          case 'audiências':
            return evento.tipo === 'audiência';
          case 'reuniões':
            return evento.tipo === 'reunião';
          case 'prazos':
            return evento.tipo === 'prazo';
          case 'entregas':
            return evento.tipo === 'entrega';
          case 'consultas':
            return evento.tipo === 'consulta';
          default:
            return true;
        }
      });
    }
  }

  // Método para carregar dados e aplicar filtros
  private carregarDadosComFiltros(): void {
    this.agendaService.getAgendaState().subscribe(state => {
      if (state.status === 'success' && state.data) {
        this.todosEventos = state.data;
        this.filtrarEventos();
      }
    });
  }

  getFiltroLabel(): string {
    switch (this.filtroAtivo) {
      case 'audiências':
        return 'Audiências';
      case 'reuniões':
        return 'Reuniões';
      case 'prazos':
        return 'Prazos';
      case 'entregas':
        return 'Entregas';
      case 'consultas':
        return 'Consultas';
      default:
        return 'Todos';
    }
  }
}

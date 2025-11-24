import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { ChatService } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProcessoService } from '../../../core/services/processo.service';
import { ChatMessage, SendMessageRequest } from '../../../core/models/chat.model';
import { AuthUser } from '../../../core/models/user.model';
import { Processo } from '../../../core/models/processo.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [MessageService]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  processoId: string = '';
  processo: Processo | null = null;
  currentUser: AuthUser | null = null;
  messages: ChatMessage[] = [];
  novaMensagem: string = '';
    
  // Breadcrumb
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};
  
  loading = true;
  enviandoMensagem = false;
  
  // Controle de digitação
  private typingSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private shouldScrollToBottom = true;
  private autoResizeTimeout?: number;

  // Status da conversa
  participanteOnline = false;
  participanteDigitando = false;
  participanteNome = '';

  hasNotifications = true;


  // Responsividade
  isMobile = false;
  isTablet = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private authService: AuthService,
    private processoService: ProcessoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.processoId = this.route.snapshot.paramMap.get('processoId') || '';
    
    if (!this.processoId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'ID do processo não encontrado'
      });
      this.router.navigate(['/']);
      return;
    }

    this.checkScreenSize();
    this.setupBreadcrumb();
    this.loadProcessoInfo();
    this.loadMessages();
    this.setupTypingIndicator();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.autoResizeTimeout) {
      clearTimeout(this.autoResizeTimeout);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth < 768;
      this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    }
  }

  private setupBreadcrumb(): void {
    this.breadcrumbHome = { 
      icon: 'pi pi-home', 
      routerLink: this.getDashboardRoute() 
    };
    
    this.breadcrumbItems = [
      { label: 'Processos', routerLink: this.getProcessosRoute() },
      { label: `Processo ${this.processoId}`, routerLink: `/shared/processo/${this.processoId}` },
      { label: 'Chat' }
    ];
  }

  private getDashboardRoute(): string {
    switch (this.currentUser?.tipo) {
      case 'cliente': return '/cliente/dashboard';
      case 'advogado': return '/advogado/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  }

  private getProcessosRoute(): string {
    switch (this.currentUser?.tipo) {
      case 'cliente': return '/cliente/processos';
      case 'advogado': return '/advogado/processos';
      case 'admin': return '/admin/processos/todos';
      default: return '/';
    }
  }

  private loadProcessoInfo(): void {
    this.processoService.getProcessoById(this.processoId).subscribe({
      next: (processo) => {
        this.processo = processo;
        this.setParticipanteInfo();
      },
      error: (error) => {
        console.error('Erro ao carregar processo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Processo não encontrado'
        });
        this.router.navigate([this.getProcessosRoute()]);
      }
    });
  }

  private setParticipanteInfo(): void {
    if (this.currentUser?.tipo === 'cliente') {
      this.participanteNome = 'Dr. Carlos Oliveira';
      this.participanteOnline = Math.random() > 0.3; // Simular status online
    } else {
      this.participanteNome = 'João Silva';
      this.participanteOnline = Math.random() > 0.5;
    }
  }

  private loadMessages(): void {
    this.loading = true;
    
    this.chatService.getMessagesByProcesso(this.processoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (messages) => {
          this.messages = messages;
          this.loading = false;
          this.shouldScrollToBottom = true;
        },
        error: (error) => {
          console.error('Erro ao carregar mensagens:', error);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar mensagens'
          });
        }
      });
  }

  private setupTypingIndicator(): void {
    this.typingSubject.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // Simular indicador de digitação
      this.participanteDigitando = false;
    });
  }

  enviarMensagem(): void {
    if (!this.novaMensagem.trim() || this.enviandoMensagem) return;

    const request: SendMessageRequest = {
      processoId: this.processoId,
      conteudo: this.novaMensagem.trim(),
      tipo: 'texto'
    };

    this.enviandoMensagem = true;
    const mensagemTemp = this.novaMensagem;
    this.novaMensagem = '';

    this.chatService.sendMessage(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) => {
          this.enviandoMensagem = false;
          this.shouldScrollToBottom = true;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Mensagem Enviada',
            detail: 'Sua mensagem foi enviada com sucesso'
          });

          // Simular resposta automática após 3-5 segundos
          this.simulateAutoResponse();
        },
        error: (error) => {
          console.error('Erro ao enviar mensagem:', error);
          this.enviandoMensagem = false;
          this.novaMensagem = mensagemTemp; // Restaurar mensagem
          
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao enviar mensagem. Tente novamente.'
          });
        }
      });
  }

  private simulateAutoResponse(): void {
    const responses = [
      'Entendi. Vou verificar essa questão para você.',
      'Obrigado pela informação. Vou analisar.',
      'Perfeito! Vou providenciar isso.',
      'Recebi sua mensagem. Retorno em breve.',
      'Tudo certo! Vou dar andamento.',
    ];

    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const autoRequest: SendMessageRequest = {
        processoId: this.processoId,
        conteudo: randomResponse,
        tipo: 'texto'
      };

      // Simular mensagem de outro usuário
      const autoMessage: ChatMessage = {
        id: Date.now().toString(),
        processoId: this.processoId,
        remetente: {
          id: this.currentUser?.tipo === 'cliente' ? '1' : '1',
          nome: this.currentUser?.tipo === 'cliente' ? 'Dr. Carlos Oliveira' : 'João Silva',
          tipo: this.currentUser?.tipo === 'cliente' ? 'advogado' : 'cliente'
        },
        destinatario: {
          id: this.currentUser?.id || '1',
          nome: this.currentUser?.nome || 'Usuário',
          tipo: this.currentUser?.tipo || 'cliente'
        },
        conteudo: randomResponse,
        tipo: 'texto',
        dataEnvio: new Date(),
        status: 'entregue'
      };

      this.messages.push(autoMessage);
      this.shouldScrollToBottom = true;
    }, Math.random() * 3000 + 2000); // 2-5 segundos
  }


  mostrarAjuda(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Central de Ajuda',
      detail: 'Nossa central de ajuda será implementada em breve. Entre em contato conosco para suporte.'
    });
  }

  mostrarContato(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Contato',
      detail: 'Email: suporte@plataforma.com | Telefone: (11) 99999-9999'
    });
  }

  onMessageInput(): void {
    this.typingSubject.next(this.novaMensagem);
    this.autoResizeTextarea();
  }

  private autoResizeTextarea(): void {
    if (this.autoResizeTimeout) {
      clearTimeout(this.autoResizeTimeout);
    }

    this.autoResizeTimeout = window.setTimeout(() => {
      if (this.messageInput?.nativeElement) {
        const textarea = this.messageInput.nativeElement;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      }
    }, 0);
  }

  onEnterPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarMensagem();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        
        // Scroll suave para melhor UX
        element.scrollTo({
          top: element.scrollHeight,
          behavior: this.isMobile ? 'auto' : 'smooth'
        });
      }
    } catch (err) {
      console.error('Erro ao fazer scroll:', err);
    }
  }

  // Utilitários
  isMyMessage(message: ChatMessage): boolean {
    return message.remetente.id === this.currentUser?.id;
  }

  formatarHora(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  }

  formatarData(data: Date): string {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    if (data.toDateString() === hoje.toDateString()) {
      return 'Hoje';
    } else if (data.toDateString() === ontem.toDateString()) {
      return 'Ontem';
    } else {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(data);
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'enviando': return 'pi pi-clock';
      case 'enviado': return 'pi pi-check';
      case 'entregue': return 'pi pi-check-circle';
      case 'lido': return 'pi pi-eye';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'enviando': return '#6c757d';
      case 'enviado': return '#6c757d';
      case 'entregue': return '#28a745';
      case 'lido': return '#ffff';
      default: return '#6c757d';
    }
  }

  voltar(): void {
    this.router.navigate(['/shared/processo', this.processoId]);
  }

  irParaDetalhes(): void {
    this.router.navigate(['/shared/processo', this.processoId]);
  }

  trackByMessage(index: number, message: ChatMessage): string {
    return message.id;
  }

  shouldShowDateSeparator(message: ChatMessage, index: number): boolean {
    if (index === 0) return true;
    
    const previousMessage = this.messages[index - 1];
    const currentDate = new Date(message.dataEnvio).toDateString();
    const previousDate = new Date(previousMessage.dataEnvio).toDateString();
    
    return currentDate !== previousDate;
  }

  getStatusTooltip(status: string): string {
    switch (status) {
      case 'enviando': return 'Enviando...';
      case 'enviado': return 'Enviado';
      case 'entregue': return 'Entregue';
      case 'lido': return 'Lido';
      default: return '';
    }
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { UsuarioService, UsuarioEstatisticas, UsuarioFiltro } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class UsuariosComponent implements OnInit, OnDestroy {
  currentUser: AuthUser | null = null;
  usuarios: AuthUser[] = [];
  estatisticas: UsuarioEstatisticas | null = null;
  loading = true;

  // Notificações
  hasNotifications = true;

  // Breadcrumb
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};

  // Filtros
  filtros: UsuarioFiltro = {};
  tipoFiltro: string = '';
  statusFiltro: string = '';
  verificadoFiltro: string = '';
  buscaTexto: string = '';

  // Opções para dropdowns
  tiposUsuario = [
    { label: 'Todos os Tipos', value: '' },
    { label: 'Clientes', value: 'cliente' },
    { label: 'Advogados', value: 'advogado' },
    { label: 'Administradores', value: 'admin' }
    // { label: 'Sindicados/Cooperativas', value: 'sindicado' } // Temporariamente desabilitado
  ];

  statusOptions = [
    { label: 'Todos os Status', value: '' },
    { label: 'Ativo', value: 'ativo' },
    { label: 'Inativo', value: 'inativo' },
    { label: 'Pendente', value: 'pendente' },
    { label: 'Suspenso', value: 'suspenso' }
  ];

  verificacaoOptions = [
    { label: 'Todos', value: '' },
    { label: 'Verificados', value: 'true' },
    { label: 'Não Verificados', value: 'false' }
  ];

  // Dialogs
  showUserDialog = false;
  showVerificationDialog = false;
  selectedUser: AuthUser | null = null;
  userDialogMode: 'view' | 'edit' = 'view';

  private destroy$ = new Subject<void>();

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
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


  private setupBreadcrumb(): void {
    this.breadcrumbHome = { icon: 'pi pi-home', routerLink: '/admin/dashboard' };
    this.breadcrumbItems = [
      { label: 'Gestão de Usuários' }
    ];
  }

  private loadData(): void {
    this.loading = true;
    this.loadUsuarios();
    this.loadEstatisticas();
  }

  private loadUsuarios(): void {
    this.usuarioService.getUsuarios(this.filtros)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar usuários:', error);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar usuários'
          });
        }
      });
  }

  private loadEstatisticas(): void {
    this.usuarioService.getEstatisticas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.estatisticas = stats;
        },
        error: (error) => {
          console.error('Erro ao carregar estatísticas:', error);
        }
      });
  }

  // Filtros e Busca
  aplicarFiltros(): void {
    this.filtros = {
      tipo: this.tipoFiltro as any || undefined,
      status: this.statusFiltro as any || undefined,
      verificado: this.verificadoFiltro ? this.verificadoFiltro === 'true' : undefined,
      busca: this.buscaTexto || undefined
    };

    this.loadUsuarios();
  }

  limparFiltros(): void {
    this.tipoFiltro = '';
    this.statusFiltro = '';
    this.verificadoFiltro = '';
    this.buscaTexto = '';
    this.filtros = {};
    this.loadUsuarios();
  }

  // Ações de Usuário
  verUsuario(usuario: AuthUser): void {
    this.selectedUser = usuario;
    this.userDialogMode = 'view';
    this.showUserDialog = true;
  }

  editarUsuario(usuario: AuthUser): void {
    this.selectedUser = { ...usuario };
    this.userDialogMode = 'edit';
    this.showUserDialog = true;
  }

  alterarStatus(usuario: AuthUser, novoStatus: string): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja alterar o status de "${usuario.nome}" para "${this.usuarioService.getStatusLabel(novoStatus)}"?`,
      header: 'Confirmar Alteração',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Alterar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.usuarioService.alterarStatusUsuario(usuario.id, novoStatus)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Status Alterado',
                detail: `Status de ${usuario.nome} alterado com sucesso`
              });
              this.loadData();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao alterar status do usuário'
              });
            }
          });
      }
    });
  }

  verificarAdvogado(usuario: AuthUser): void {
    const acao = usuario.verificado ? 'remover verificação' : 'verificar';
    
    this.confirmationService.confirm({
      message: `Tem certeza que deseja ${acao} o advogado "${usuario.nome}"?`,
      header: 'Confirmar Verificação',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sim, Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.usuarioService.verificarAdvogado(usuario.id, !usuario.verificado)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Verificação Atualizada',
                detail: `Advogado ${usuario.verificado ? 'não verificado' : 'verificado'} com sucesso`
              });
              this.loadData();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao atualizar verificação'
              });
            }
          });
      }
    });
  }

  excluirUsuario(usuario: AuthUser): void {
    this.confirmationService.confirm({
      message: `ATENÇÃO: Tem certeza que deseja excluir o usuário "${usuario.nome}"? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.usuarioService.excluirUsuario(usuario.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Usuário Excluído',
                detail: `Usuário ${usuario.nome} excluído com sucesso`
              });
              this.loadData();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir usuário'
              });
            }
          });
      }
    });
  }

  salvarUsuario(): void {
    if (!this.selectedUser) return;

    this.usuarioService.atualizarUsuario(this.selectedUser.id, this.selectedUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Usuário Atualizado',
            detail: 'Dados do usuário atualizados com sucesso'
          });
          this.showUserDialog = false;
          this.loadData();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar usuário'
          });
        }
      });
  }

  // Utilitários
  getUsuarioIcon(tipo: string): string {
    return this.usuarioService.getTipoIcon(tipo);
  }

  getStatusSeverity(status: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" {
    const severity = this.usuarioService.getStatusSeverity(status);
    return severity as "success" | "info" | "warning" | "danger" | "secondary" | "contrast";
  }

  getStatusLabel(status: string): string {
    return this.usuarioService.getStatusLabel(status);
  }

  getTipoLabel(tipo: string): string {
    return this.usuarioService.getTipoLabel(tipo);
  }

  formatarData(data: string | Date): string {
    return this.usuarioService.formatarData(data);
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

  // Novos métodos para funcionalidades adicionadas
  criarNovoUsuario(): void {
    // Implementar criação de novo usuário
    this.messageService.add({
      severity: 'info',
      summary: 'Funcionalidade em Desenvolvimento',
      detail: 'Criação de usuários será implementada em breve'
    });
  }

  exportarUsuarios(): void {
    // Implementar exportação de usuários
    this.messageService.add({
      severity: 'info',
      summary: 'Funcionalidade em Desenvolvimento',
      detail: 'Exportação de usuários será implementada em breve'
    });
  }

  navegarParaSindicados(): void {
    // Temporariamente desabilitado - fluxo de sindicados comentado
    this.messageService.add({
      severity: 'info',
      summary: 'Funcionalidade Temporariamente Indisponível',
      detail: 'Gestão de sindicados será reativada em breve'
    });
  }
}
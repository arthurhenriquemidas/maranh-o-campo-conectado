import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class PerfilComponent implements OnInit {
  currentUser: AuthUser | null = null;
  perfilForm!: FormGroup;
  senhaForm!: FormGroup;
  
  loading = true;
  editando = false;
  alterandoSenha = false;
  
  // Navegação
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};
  menuItems: MenuItem[] = [];
  
  // Tabs
  activeTab = 0;
  
  // Mobile Menu
  mobileMenuOpen = false;
  hasNotifications = false;
  
  // Estatísticas do perfil
  estatisticasPerfil = {
    processosTotal: 0,
    processosAtivos: 0,
    tempoPlataforma: '',
    ultimoAcesso: new Date()
  };

  // Opções
  especialidadesOptions: string[] = [
    'Trabalhista',
    'Civil',
    'Criminal',
    'Família',
    'Tributário',
    'Empresarial',
    'Previdenciário',
    'Consumidor',
    'Imobiliário',
    'Ambiental'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.setupBreadcrumb();
    this.initMenuItems();
    this.loadPerfilData();
    this.loadEstatisticas();
  }

  private initMenuItems(): void {
    const userType = this.currentUser?.tipo;
    
    switch (userType) {
      case 'cliente':
        this.menuItems = [
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: ['/cliente/dashboard']
          },
          {
            label: 'Meus Processos',
            icon: 'pi pi-briefcase',
            routerLink: ['/cliente/processos']
          }
        ];
        break;
        
      case 'advogado':
        this.menuItems = [
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: ['/advogado/dashboard']
          },
          {
            label: 'Meus Processos',
            icon: 'pi pi-folder',
            routerLink: ['/advogado/processos']
          }
        ];
        break;
        
      case 'admin':
        this.menuItems = [
          {
            label: 'Processos Disponíveis',
            icon: 'pi pi-briefcase',
            routerLink: ['/admin/processos-disponiveis']
          },
          {
            label: 'Usuários',
            icon: 'pi pi-users',
            routerLink: ['/admin/usuarios']
          }
        ];
        break;
        
      default:
        this.menuItems = [];
    }
  }

  private initializeForms(): void {
    // Formulário de Perfil
    this.perfilForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      // Endereço
      cep: [''],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      // Campos específicos por tipo
      cpf: [''],
      cnpj: [''],
      oab: [''],
      especialidades: [[]]
    });

    // Formulário de Senha
    this.senhaForm = this.fb.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private setupBreadcrumb(): void {
    this.breadcrumbHome = { 
      icon: 'pi pi-home', 
      routerLink: this.getDashboardRoute() 
    };
    
    this.breadcrumbItems = [
      { label: 'Meu Perfil' }
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

  private loadPerfilData(): void {
    if (this.currentUser) {
      this.perfilForm.patchValue({
        nome: this.currentUser.nome,
        email: this.currentUser.email,
        telefone: this.currentUser.telefone,
        // Endereço
        cep: (this.currentUser as any).cep,
        endereco: (this.currentUser as any).endereco,
        numero: (this.currentUser as any).numero,
        complemento: (this.currentUser as any).complemento,
        bairro: (this.currentUser as any).bairro,
        cidade: (this.currentUser as any).cidade,
        estado: (this.currentUser as any).estado,
        cpf: this.currentUser.cpf,
        cnpj: this.currentUser.cnpj,
        oab: this.currentUser.oab,
        especialidades: this.currentUser.especialidades
      });
    }
    
    this.loading = false;
  }

  private loadEstatisticas(): void {
    // Mock de estatísticas do perfil
    this.estatisticasPerfil = {
      processosTotal: this.currentUser?.tipo === 'cliente' ? 4 : 12,
      processosAtivos: this.currentUser?.tipo === 'cliente' ? 2 : 8,
      tempoPlataforma: '3 meses',
      ultimoAcesso: new Date()
    };
  }

  // Ações do Perfil
  iniciarEdicao(): void {
    this.editando = true;
  }

  cancelarEdicao(): void {
    this.editando = false;
    this.loadPerfilData(); // Recarregar dados originais
  }

  salvarPerfil(): void {
    if (this.perfilForm.valid && this.currentUser) {
      const dadosAtualizados = {
        ...this.currentUser,
        ...this.perfilForm.value
      };

      this.usuarioService.atualizarUsuario(this.currentUser.id, dadosAtualizados).subscribe({
        next: (usuario) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Perfil Atualizado',
            detail: 'Seus dados foram atualizados com sucesso'
          });
          
          this.editando = false;
          
          // Atualizar usuário na sessão
          localStorage.setItem('currentUser', JSON.stringify(usuario));
          this.currentUser = usuario;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar perfil'
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.perfilForm);
    }
  }

  alterarSenha(): void {
    if (this.senhaForm.valid) {
      this.alterandoSenha = true;

      // Simular alteração de senha
      setTimeout(() => {
        this.alterandoSenha = false;
        this.senhaForm.reset();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Senha Alterada',
          detail: 'Sua senha foi alterada com sucesso'
        });
      }, 1500);
    } else {
      this.markFormGroupTouched(this.senhaForm);
    }
  }

  excluirConta(): void {
    this.confirmationService.confirm({
      message: 'ATENÇÃO: Esta ação irá excluir permanentemente sua conta e todos os dados associados. Tem certeza?',
      header: 'Excluir Conta',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Funcionalidade Simulada',
          detail: 'Em produção, a conta seria excluída permanentemente'
        });
      }
    });
  }

  // Validadores
  private passwordMatchValidator(form: FormGroup) {
    const novaSenha = form.get('novaSenha');
    const confirmarSenha = form.get('confirmarSenha');
    
    if (novaSenha && confirmarSenha && novaSenha.value !== confirmarSenha.value) {
      confirmarSenha.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  private markFormGroupTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
    });
  }

  // Utilitários
  getTipoLabel(tipo: string): string {
    const labels: { [key: string]: string } = {
      'cliente': 'Cliente',
      'advogado': 'Advogado',
      'admin': 'Administrador'
    };
    return labels[tipo] || tipo;
  }

  getTipoIcon(tipo: string): string {
    const icons: { [key: string]: string } = {
      'cliente': 'pi pi-user',
      'advogado': 'pi pi-balance-scale',
      'admin': 'pi pi-cog'
    };
    return icons[tipo] || 'pi pi-user';
  }

  // Estados (mesma lista do cadastro)
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

  getEstadoLabel(value: string): string {
    const estado = this.estadosOptions.find(e => e.value === value);
    return estado ? estado.label : value;
  }

  formatarData(data: string | Date): string {
    const date = typeof data === 'string' ? new Date(data) : data;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  calcularTempoPlataforma(): string {
    if (!this.currentUser?.dataCadastro) return 'Recente';
    
    const cadastro = new Date(this.currentUser.dataCadastro);
    const agora = new Date();
    const diffMeses = (agora.getFullYear() - cadastro.getFullYear()) * 12 + (agora.getMonth() - cadastro.getMonth());
    
    if (diffMeses < 1) return 'Menos de 1 mês';
    if (diffMeses === 1) return '1 mês';
    return `${diffMeses} meses`;
  }

  voltar(): void {
    this.router.navigate([this.getDashboardRoute()]);
  }

  // Métodos de Menu e Header
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Logout realizado',
      detail: 'Você foi desconectado com sucesso!'
    });
    this.router.navigate(['/onboarding/welcome']);
  }

  openNotifications(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Notificações',
      detail: 'Sistema de notificações será implementado em breve'
    });
  }
}
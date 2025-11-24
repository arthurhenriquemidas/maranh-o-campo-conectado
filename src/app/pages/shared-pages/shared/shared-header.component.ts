import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/user.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss']
})
export class SharedHeaderComponent implements OnInit {
  
  @Input() currentUser: AuthUser | null = null;
  @Input() hasNotifications: boolean = false;
  @Output() onLogout = new EventEmitter<void>();
  @Output() onNotifications = new EventEmitter<void>();
  @Output() onProfile = new EventEmitter<void>();

  // Menu de Navegação
  menuItems: MenuItem[] = [];
  
  // Mobile States
  mobileMenuOpen = false;
  
  // Tipo de usuário detectado
  userType: 'cliente' | 'advogado' | 'admin' = 'cliente';
  currentUrl = '';

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.detectUserType();
    this.initMenuItems();
    
    // Escutar mudanças de rota para atualizar o tipo de usuário
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
        this.detectUserType();
        this.initMenuItems();
      });
  }

  detectUserType(): void {
    this.currentUrl = this.router.url;
    
    if (this.currentUrl.startsWith('/admin/')) {
      this.userType = 'admin';
    } else if (this.currentUrl.startsWith('/advogado/')) {
      this.userType = 'advogado';
    } else if (this.currentUrl.startsWith('/cliente/')) {
      this.userType = 'cliente';
    } else {
      // Fallback: detectar pelo tipo do usuário logado
      if (this.currentUser?.tipo === 'admin') {
        this.userType = 'admin';
      } else if (this.currentUser?.tipo === 'advogado') {
        this.userType = 'advogado';
      } else {
        this.userType = 'cliente';
      }
    }
  }

  initMenuItems(): void {
    if (this.userType === 'admin') {
      this.menuItems = [
        // {
        //   label: 'Dashboard',
        //   icon: 'pi pi-home',
        //   routerLink: ['/admin/dashboard']
        // },
        {
          label: 'Processos Disponíveis',
          icon: 'pi pi-list',
          routerLink: ['/admin/processos-disponiveis']
        },
        {
          label: 'Usuários',
          icon: 'pi pi-users',
          routerLink: ['/admin/usuarios']
        },
        // {
        //   label: 'Ajuda',
        //   icon: 'pi pi-question-circle',
        //   items: [
        //     {
        //       label: 'Central de Ajuda',
        //       icon: 'pi pi-info-circle',
        //       command: () => this.mostrarAjuda()
        //     },
        //     {
        //       label: 'Dúvidas Frequentes',
        //       icon: 'pi pi-question-circle',
        //       command: () => this.mostrarDuvidas()
        //     }
        //   ]
        // }
      ];
    } else if (this.userType === 'advogado') {
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
        },
        // {
        //   label: 'Agenda',
        //   icon: 'pi pi-calendar',
        //   routerLink: ['/advogado/agenda']
        // },
        // {
        //   label: 'Ajuda',
        //   icon: 'pi pi-question-circle',
        //   items: [
        //     {
        //       label: 'Central de Ajuda',
        //       icon: 'pi pi-info-circle',
        //       command: () => this.mostrarAjuda()
        //     },
        //     {
        //       label: 'Dúvidas Frequentes',
        //       icon: 'pi pi-question-circle',
        //       command: () => this.mostrarDuvidas()
        //     }
        //   ]
        // }
      ];
    } else {
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
        },
        // {
        //   label: 'Ajuda',
        //   icon: 'pi pi-question-circle',
        //   items: [
        //     {
        //       label: 'Central de Ajuda',
        //       icon: 'pi pi-info-circle',
        //       command: () => this.mostrarAjuda()
        //     },
        //     {
        //       label: 'Dúvidas Frequentes',
        //       icon: 'pi pi-question-circle',
        //       command: () => this.mostrarDuvidas()
        //     }
        //   ]
        // }
      ];
    }
  }

  getRoleLabel(): string {
    switch (this.userType) {
      case 'admin':
        return 'Administrador';
      case 'advogado':
        return 'Advogado';
      default:
        return 'Cliente';
    }
  }

  getBrandSubtitle(): string {
    switch (this.userType) {
      case 'admin':
        return 'Administração';
      case 'advogado':
        return 'Advogado';
      default:
        return 'Plataforma Jurídica';
    }
  }

  logout(): void {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Logout realizado',
      detail: 'Você foi desconectado com sucesso!'
    });
    this.onLogout.emit();
    this.router.navigate(['/onboarding/welcome']);
  }

  openNotifications(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Notificações',
      detail: 'Sistema de notificações será implementado em breve'
    });
    this.onNotifications.emit();
  }

  irParaPerfil(): void {
    this.router.navigate(['/shared/perfil']);
    this.onProfile.emit();
  }

  // Métodos para menu mobile
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  mostrarAjuda(): void {
    this.router.navigate(['/shared/ajuda']);
  }

  mostrarDuvidas(): void {
    this.router.navigate(['/shared/duvidas-frequentes']);
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  
  @Input() currentUser: AuthUser | null = null;
  @Input() hasNotifications: boolean = false;
  @Output() onLogout = new EventEmitter<void>();
  @Output() onNotifications = new EventEmitter<void>();
  @Output() onProfile = new EventEmitter<void>();

  // Menu de Navegação
  menuItems: MenuItem[] = [];
  
  // Mobile States
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initMenuItems();
  }

  initMenuItems(): void {
    this.menuItems = [
      // {
      //   label: 'Dashboard',
      //   icon: 'pi pi-home',
      //   routerLink: ['/admin/dashboard']
      // },
      {
        label: 'Processos Disponíveis',
        icon: 'pi pi-briefcase',
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
    //   ,
    //   {
    //     label: 'Verificação',
    //     icon: 'pi pi-check-circle',
    //     routerLink: ['/admin/verificacao']
    //   },
    //   {
    //     label: 'Assinaturas',
    //     icon: 'pi pi-credit-card',
    //     routerLink: ['/admin/assinaturas']
    //   }
    ];
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

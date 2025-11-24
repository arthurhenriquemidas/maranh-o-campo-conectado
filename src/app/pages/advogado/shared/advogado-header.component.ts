import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-advogado-header',
  templateUrl: './advogado-header.component.html',
  styleUrls: ['./advogado-header.component.scss']
})
export class AdvogadoHeaderComponent implements OnInit {
  
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

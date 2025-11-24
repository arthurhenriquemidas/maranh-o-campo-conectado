import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { ClienteService } from '../services/cliente.service';
import { AuthUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-cliente-header',
  templateUrl: './cliente-header.component.html',
  styleUrls: ['./cliente-header.component.scss']
})
export class ClienteHeaderComponent implements OnInit {
  
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
    private clienteService: ClienteService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    this.clienteService.getMenuItems().subscribe({
      next: (menuItems) => {
        this.menuItems = menuItems;
      },
      error: (error) => {
        console.error('Erro ao carregar menu items:', error);
        // Fallback para menu items padrão
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
      }
    });
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

  mostrarAjuda(): void {
    this.router.navigate(['/shared/ajuda']);
  }

  mostrarDuvidas(): void {
    this.router.navigate(['/shared/duvidas-frequentes']);
  }

  // Métodos para menu mobile
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  // Dados do usuário
  currentUser: AuthUser | null = null;
  hasNotifications: boolean = false;

  // Breadcrumb
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: ['/onboarding/welcome'] };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initBreadcrumb();
  }

  initBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Ajuda', routerLink: ['/shared/ajuda'] },
      { label: 'Perguntas Frequentes' }
    ];
  }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
  }

  abrirChat(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Suporte',
      detail: 'Chat de suporte será implementado em breve. Use os contatos fornecidos na central de ajuda.'
    });
  }

  // Event handlers para o header
  onLogout(): void {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Logout realizado',
      detail: 'Você foi desconectado com sucesso!'
    });
    this.router.navigate(['/onboarding/welcome']);
  }

  onNotifications(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Notificações',
      detail: 'Sistema de notificações será implementado em breve'
    });
  }

  onProfile(): void {
    this.router.navigate(['/shared/perfil']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { ProcessoService } from '../../../core/services/processo.service';
import { ClienteService } from '../services/cliente.service';
import { AuthUser } from '../../../core/models/user.model';
import { Processo } from '../../../core/models/processo.model';
import { Compromisso } from '../models/cliente.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  currentUser: AuthUser | null = null;
  loading = true;
  
  // Breadcrumb
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};

  // Estatísticas
  stats = {
    total: 0,
    ativos: 0,
    concluidos: 0,
    pendentes: 0
  };

  // Dados
  processosRecentes: Processo[] = [];
  proximosCompromissos: Compromisso[] = [];
  
  // Notificações
  hasNotifications = true;

  // Dialog Novo Processo
  showNewProcessDialog = false;

  constructor(
    private authService: AuthService,
    private processoService: ProcessoService,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initBreadcrumb();
    this.loadData();
  }


  initBreadcrumb(): void {
    this.breadcrumbHome = { icon: 'pi pi-home', routerLink: '/cliente/dashboard' };
    this.breadcrumbItems = [
      { label: 'Dashboard' }
    ];
  }

  loadData(): void {
    this.loading = true;

    // Carregar estatísticas
    this.processoService.getEstatisticas().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
      }
    });

    // Carregar processos recentes
    this.processoService.getProcessos().subscribe({
      next: (processos) => {
        this.processosRecentes = processos.slice(0, 5); // Apenas os 5 mais recentes
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar processos:', error);
        this.loading = false;
      }
    });

    // Carregar próximos compromissos
    this.clienteService.getProximosCompromissos().subscribe({
      next: (compromissos) => {
        this.proximosCompromissos = compromissos;
      },
      error: (error) => {
        console.error('Erro ao carregar compromissos:', error);
      }
    });
  }


  navegarPara(rota: string): void {
    this.router.navigate([rota]);
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

  onProcessoCriado(): void {
    this.loadData(); // Recarregar dados após criar processo
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'aberto': 'Aguardando',
      'em_andamento': 'Em Andamento',
      'aguardando_cliente': 'Aguardando Sua Resposta',
      'concluido': 'Concluído',
      'arquivado': 'Arquivado'
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    const severities: { [key: string]: 'success' | 'info' | 'warning' | 'danger' } = {
      'aberto': 'info',
      'em_andamento': 'warning',
      'aguardando_cliente': 'warning',
      'concluido': 'success',
      'arquivado': 'info'
    };
    return severities[status] || 'info';
  }


  verProcesso(processo: Processo): void {
    this.router.navigate(['/shared/processo', processo.id]);
  }

  iniciarChat(processo: Processo): void {
    this.router.navigate(['/shared/chat', processo.id]);
  }


}

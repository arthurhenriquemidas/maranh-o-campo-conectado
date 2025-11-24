import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';

import { ProcessoSindicadoService, ProcessoSindicado, ProcessoSindicadoFiltro } from '../../../../../core/services/processo-sindicado.service';
import { SindicadoService } from '../../../../../core/services/sindicado.service';

@Component({
  selector: 'app-gerenciar-processos',
  templateUrl: './gerenciar-processos.component.html',
  styleUrls: ['./gerenciar-processos.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class GerenciarProcessosComponent implements OnInit, OnDestroy {
  @Input() sindicadoId: string = '';
  @Input() sindicadoNome: string = '';

  vinculacoes: ProcessoSindicado[] = [];
  processosDisponiveis: any[] = [];
  loading = true;

  // Filtros
  filtros: ProcessoSindicadoFiltro = {};
  statusFiltro: string = '';
  tipoProcessoFiltro: string = '';

  // Dialogs
  showVincularDialog = false;
  showAlterarAdvogadoDialog = false;
  showAlterarProcessoDialog = false;
  showHistoricoDialog = false;

  // Dados para formulários
  selectedProcesso: any = null;
  selectedVinculacao: ProcessoSindicado | null = null;
  novoAdvogadoId: string = '';
  motivoAlteracao: string = '';
  dadosAlteracao: any = {};

  // Opções
  statusOptions = [
    { label: 'Todos os Status', value: '' },
    { label: 'Ativo', value: 'ativo' },
    { label: 'Inativo', value: 'inativo' },
    { label: 'Suspenso', value: 'suspenso' }
  ];

  tipoProcessoOptions = [
    { label: 'Todos os Tipos', value: '' },
    { label: 'Trabalhista', value: 'trabalhista' },
    { label: 'Civil', value: 'civil' },
    { label: 'Criminal', value: 'criminal' },
    { label: 'Família', value: 'familia' },
    { label: 'Tributário', value: 'tributario' },
    { label: 'Empresarial', value: 'empresarial' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private processoSindicadoService: ProcessoSindicadoService,
    private sindicadoService: SindicadoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    if (this.sindicadoId) {
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading = true;
    
    // Carregar vinculações
    this.processoSindicadoService.buscarProcessosVinculados(this.sindicadoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vinculacoes: ProcessoSindicado[]) => {
          this.vinculacoes = vinculacoes;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar vinculações:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar vinculações'
          });
          this.loading = false;
        }
      });
  }

  aplicarFiltros(): void {
    this.filtros = {
      sindicadoId: this.sindicadoId,
      status: this.statusFiltro as 'ativo' | 'inativo' | 'suspenso' || undefined,
      tipoProcesso: this.tipoProcessoFiltro || undefined
    };
    this.loadData();
  }

  limparFiltros(): void {
    this.filtros = {};
    this.statusFiltro = '';
    this.tipoProcessoFiltro = '';
    this.loadData();
  }

  abrirDialogVincular(): void {
    this.processoSindicadoService.buscarProcessosDisponiveis(this.sindicadoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (processos: any[]) => {
          this.processosDisponiveis = processos;
          this.showVincularDialog = true;
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar processos disponíveis'
          });
        }
      });
  }

  vincularProcesso(): void {
    if (!this.selectedProcesso) return;

    this.processoSindicadoService.vincularProcesso(
      this.selectedProcesso.id, 
      this.sindicadoId
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Processo Vinculado',
          detail: 'Processo vinculado com sucesso'
        });
        this.showVincularDialog = false;
        this.selectedProcesso = null;
        this.loadData();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao vincular processo'
        });
      }
    });
  }

  desvincularProcesso(vinculacao: ProcessoSindicado): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja desvincular o processo "${vinculacao.processo?.titulo}"?`,
      header: 'Confirmar Desvinculação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, desvincular',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.processoSindicadoService.desvincularProcesso(vinculacao.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Processo Desvinculado',
                detail: 'Processo desvinculado com sucesso'
              });
              this.loadData();
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao desvincular processo'
              });
            }
          });
      }
    });
  }

  abrirDialogAlterarAdvogado(vinculacao: ProcessoSindicado): void {
    this.selectedVinculacao = vinculacao;
    this.novoAdvogadoId = '';
    this.motivoAlteracao = '';
    this.showAlterarAdvogadoDialog = true;
  }

  alterarAdvogado(): void {
    if (!this.selectedVinculacao || !this.novoAdvogadoId || !this.motivoAlteracao) return;

    this.processoSindicadoService.alterarAdvogadoProcesso(
      this.selectedVinculacao.id,
      this.novoAdvogadoId,
      this.motivoAlteracao
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Advogado Alterado',
          detail: 'Advogado alterado com sucesso'
        });
        this.showAlterarAdvogadoDialog = false;
        this.loadData();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao alterar advogado'
        });
      }
    });
  }

  abrirDialogAlterarProcesso(vinculacao: ProcessoSindicado): void {
    this.selectedVinculacao = vinculacao;
    this.dadosAlteracao = { ...vinculacao.processo };
    this.motivoAlteracao = '';
    this.showAlterarProcessoDialog = true;
  }

  alterarProcesso(): void {
    if (!this.selectedVinculacao || !this.motivoAlteracao) return;

    this.processoSindicadoService.alterarDadosProcesso(
      this.selectedVinculacao.id,
      this.dadosAlteracao,
      this.motivoAlteracao
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Processo Alterado',
          detail: 'Dados do processo alterados com sucesso'
        });
        this.showAlterarProcessoDialog = false;
        this.loadData();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao alterar processo'
        });
      }
    });
  }

  visualizarHistorico(vinculacao: ProcessoSindicado): void {
    this.selectedVinculacao = vinculacao;
    this.showHistoricoDialog = true;
  }

  // Utilitários
  getStatusIcon(status: string): string {
    return this.processoSindicadoService.getStatusIcon(status);
  }

  getStatusLabel(status: string): string {
    return this.processoSindicadoService.getStatusLabel(status);
  }

  formatarData(data: string | Date): string {
    return this.processoSindicadoService.formatarData(data);
  }
}

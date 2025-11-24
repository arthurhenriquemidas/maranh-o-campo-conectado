import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { DocumentoService } from '../../../core/services/documento.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProcessoService } from '../../../core/services/processo.service';
import { 
  Documento, 
  DocumentoUpload, 
  DocumentoFiltro, 
  DocumentoCategoria,
  DocumentoEstatisticas 
} from '../../../core/models/documento.model';
import { AuthUser } from '../../../core/models/user.model';
import { Processo } from '../../../core/models/processo.model';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class DocumentosComponent implements OnInit, OnDestroy {
  processoId: string = '';
  processo: Processo | null = null;
  currentUser: AuthUser | null = null;
  documentos: Documento[] = [];
  estatisticas: DocumentoEstatisticas | null = null;
  
  loading = true;
  uploadingFiles: File[] = [];
  
  // Navegação
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = {};
  
  // Filtros
  filtros: DocumentoFiltro = {};
  categorias: any[] = [];
  categoriaFiltro: string = '';
  buscaTexto: string = '';
  
  // Upload
  showUploadDialog = false;
  uploadCategoria: DocumentoCategoria = 'outros';
  uploadDescricao: string = '';
  uploadPublico: boolean = true;
  uploadTags: string = '';

  // Visualização
  viewMode: 'grid' | 'list' = 'grid';
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public documentoService: DocumentoService,
    private authService: AuthService,
    private processoService: ProcessoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

    this.setupBreadcrumb();
    this.setupCategorias();
    this.loadProcessoInfo();
    this.loadDocumentos();
    this.loadEstatisticas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupBreadcrumb(): void {
    this.breadcrumbHome = { 
      icon: 'pi pi-home', 
      routerLink: this.getDashboardRoute() 
    };
    
    this.breadcrumbItems = [
      { label: 'Processos', routerLink: this.getProcessosRoute() },
      { label: `Processo ${this.processoId}`, routerLink: `/shared/processo/${this.processoId}` },
      { label: 'Documentos' }
    ];
  }

  private setupCategorias(): void {
    this.categorias = this.documentoService.getCategorias().map(cat => ({
      label: this.documentoService.getCategoriaLabel(cat),
      value: cat
    }));
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

  private loadDocumentos(): void {
    this.loading = true;
    
    this.documentoService.getDocumentosByProcesso(this.processoId, this.filtros)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (documentos) => {
          this.documentos = documentos;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar documentos:', error);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar documentos'
          });
        }
      });
  }

  private loadEstatisticas(): void {
    this.documentoService.getEstatisticas(this.processoId)
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

  // Ações de Upload
  abrirUpload(): void {
    this.showUploadDialog = true;
    this.resetUploadForm();
  }

  onFileSelect(event: any): void {
    const files: File[] = event.files;
    
    for (let file of files) {
      const validation = this.documentoService.validateUpload(file);
      
      if (!validation.valid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Arquivo Inválido',
          detail: validation.error
        });
        continue;
      }

      this.uploadFile(file);
    }
  }

  private uploadFile(file: File): void {
    this.uploadingFiles.push(file);

    const upload: DocumentoUpload = {
      arquivo: file,
      processoId: this.processoId,
      categoria: this.uploadCategoria,
      descricao: this.uploadDescricao,
      tags: this.uploadTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      publico: this.uploadPublico
    };

    this.documentoService.uploadDocumento(upload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (documento) => {
          this.uploadingFiles = this.uploadingFiles.filter(f => f !== file);
          
          this.messageService.add({
            severity: 'success',
            summary: 'Upload Concluído',
            detail: `Arquivo "${file.name}" enviado com sucesso`
          });

          this.loadEstatisticas();
        },
        error: (error) => {
          this.uploadingFiles = this.uploadingFiles.filter(f => f !== file);
          
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no Upload',
            detail: `Erro ao enviar "${file.name}"`
          });
        }
      });
  }

  // Ações dos Documentos
  downloadDocumento(documento: Documento): void {
    this.documentoService.downloadDocumento(documento.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Download Iniciado',
            detail: `Download de "${documento.nomeOriginal}" iniciado`
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no Download',
            detail: 'Erro ao fazer download do arquivo'
          });
        }
      });
  }

  excluirDocumento(documento: Documento): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o documento "${documento.nomeOriginal}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.documentoService.excluirDocumento(documento.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Documento Excluído',
                detail: 'Documento removido com sucesso'
              });
              
              this.loadEstatisticas();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir documento'
              });
            }
          });
      }
    });
  }

  // Filtros e Busca
  aplicarFiltros(): void {
    this.filtros = {
      processoId: this.processoId,
      categoria: this.categoriaFiltro as DocumentoCategoria || undefined,
      busca: this.buscaTexto || undefined
    };
    
    this.loadDocumentos();
  }

  limparFiltros(): void {
    this.categoriaFiltro = '';
    this.buscaTexto = '';
    this.filtros = {};
    this.loadDocumentos();
  }

  // Utilitários
  canDeleteDocument(documento: Documento): boolean {
    return this.currentUser?.tipo === 'admin' || 
           documento.uploadedBy.id === this.currentUser?.id;
  }

  canViewDocument(documento: Documento): boolean {
    return this.currentUser?.tipo === 'admin' ||
           documento.publico ||
           documento.uploadedBy.id === this.currentUser?.id;
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'processando': return 'info';
      case 'disponivel': return 'success';
      case 'aprovado': return 'success';
      case 'rejeitado': return 'danger';
      case 'arquivado': return 'secondary';
      default: return 'info';
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'processando': 'Processando',
      'disponivel': 'Disponível',
      'aprovado': 'Aprovado',
      'rejeitado': 'Rejeitado',
      'arquivado': 'Arquivado'
    };
    return labels[status] || status;
  }

  formatarData(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  }

  private resetUploadForm(): void {
    this.uploadCategoria = 'outros';
    this.uploadDescricao = '';
    this.uploadPublico = true;
    this.uploadTags = '';
  }

  voltar(): void {
    this.router.navigate(['/shared/processo', this.processoId]);
  }

  irParaChat(): void {
    this.router.navigate(['/shared/chat', this.processoId]);
  }
}
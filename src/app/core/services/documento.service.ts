import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { 
  Documento, 
  DocumentoUpload, 
  DocumentoFiltro, 
  DocumentoEstatisticas,
  DocumentoCategoria,
  DocumentoTipo,
  DocumentoStatus 
} from '../models/documento.model';
import { AuthService } from './auth.service';
import { AuthUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private documentosSubject = new BehaviorSubject<Documento[]>([]);
  public documentos$ = this.documentosSubject.asObservable();

  private mockDocumentos: Documento[] = [];
  private currentUser: AuthUser | null = null;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.mockDocumentos = [
      {
        id: 'doc-001',
        nome: 'contrato_trabalho_joao_silva.pdf',
        nomeOriginal: 'Contrato de Trabalho.pdf',
        tipo: 'pdf',
        categoria: 'contratos',
        tamanho: 1245760, // 1.2 MB
        tamanhoFormatado: '1.2 MB',
        url: '/assets/mock/documentos/contrato_trabalho_joao_silva.pdf',
        processoId: 'P001',
        uploadedBy: {
          id: '1',
          nome: 'João Silva',
          tipo: 'cliente'
        },
        dataUpload: new Date(2024, 0, 15, 14, 30),
        versao: 1,
        descricao: 'Contrato de trabalho original da empresa XYZ',
        tags: ['contrato', 'trabalho', 'rescisao'],
        publico: true,
        status: 'aprovado'
      },
      {
        id: 'doc-002',
        nome: 'carteira_trabalho_frente.jpg',
        nomeOriginal: 'Carteira de Trabalho - Frente.jpg',
        tipo: 'jpg',
        categoria: 'identificacao',
        tamanho: 870400, // 850 KB
        tamanhoFormatado: '850 KB',
        url: '/assets/mock/documentos/carteira_trabalho_frente.jpg',
        processoId: 'P001',
        uploadedBy: {
          id: '1',
          nome: 'João Silva',
          tipo: 'cliente'
        },
        dataUpload: new Date(2024, 0, 15, 14, 35),
        versao: 1,
        descricao: 'Página de identificação da carteira de trabalho',
        tags: ['carteira', 'identificacao', 'trabalho'],
        publico: true,
        status: 'aprovado'
      },
      {
        id: 'doc-003',
        nome: 'peticao_inicial_rescisao.docx',
        nomeOriginal: 'Petição Inicial - Rescisão Trabalhista.docx',
        tipo: 'docx',
        categoria: 'peticoes',
        tamanho: 245760, // 240 KB
        tamanhoFormatado: '240 KB',
        url: '/assets/mock/documentos/peticao_inicial_rescisao.docx',
        processoId: 'P001',
        uploadedBy: {
          id: '1',
          nome: 'Dr. Carlos Oliveira',
          tipo: 'advogado'
        },
        dataUpload: new Date(2024, 0, 18, 10, 15),
        versao: 1,
        descricao: 'Petição inicial elaborada para o processo de rescisão',
        tags: ['peticao', 'inicial', 'rescisao'],
        publico: false, // Apenas para advogado/admin
        status: 'disponivel'
      },
      {
        id: 'doc-004',
        nome: 'holerites_ultimos_3_meses.pdf',
        nomeOriginal: 'Holerites - Últimos 3 Meses.pdf',
        tipo: 'pdf',
        categoria: 'comprovantes',
        tamanho: 532480, // 520 KB
        tamanhoFormatado: '520 KB',
        url: '/assets/mock/documentos/holerites_ultimos_3_meses.pdf',
        processoId: 'P001',
        uploadedBy: {
          id: '1',
          nome: 'João Silva',
          tipo: 'cliente'
        },
        dataUpload: new Date(2024, 0, 19, 16, 20),
        versao: 1,
        descricao: 'Comprovantes de salário dos últimos 3 meses',
        tags: ['holerite', 'salario', 'comprovante'],
        publico: true,
        status: 'disponivel'
      }
    ];

    this.documentosSubject.next(this.mockDocumentos);
  }

  // Métodos públicos
  getDocumentosByProcesso(processoId: string, filtro?: DocumentoFiltro): Observable<Documento[]> {
    return this.documentos$.pipe(
      delay(400),
      map(documentos => {
        let resultado = documentos.filter(doc => doc.processoId === processoId);

        // Aplicar filtros se necessário
        if (filtro) {
          if (filtro.categoria) {
            resultado = resultado.filter(doc => doc.categoria === filtro.categoria);
          }
          if (filtro.tipo) {
            resultado = resultado.filter(doc => doc.tipo === filtro.tipo);
          }
          if (filtro.status) {
            resultado = resultado.filter(doc => doc.status === filtro.status);
          }
          if (filtro.busca) {
            const busca = filtro.busca.toLowerCase();
            resultado = resultado.filter(doc => 
              doc.nome.toLowerCase().includes(busca) ||
              doc.descricao?.toLowerCase().includes(busca) ||
              doc.tags.some(tag => tag.toLowerCase().includes(busca))
            );
          }
          if (filtro.apenasPublicos && this.currentUser?.tipo === 'cliente') {
            resultado = resultado.filter(doc => doc.publico);
          }
        }

        // Filtrar por permissão do usuário
        if (this.currentUser?.tipo === 'cliente') {
          resultado = resultado.filter(doc => doc.publico || doc.uploadedBy.id === this.currentUser?.id);
        }

        return resultado.sort((a, b) => new Date(b.dataUpload).getTime() - new Date(a.dataUpload).getTime());
      })
    );
  }

  uploadDocumento(upload: DocumentoUpload): Observable<Documento> {
    return of(null).pipe(
      delay(2000), // Simular upload
      map(() => {
        const novoDocumento: Documento = {
          id: 'doc-' + Date.now(),
          nome: this.generateFileName(upload.arquivo.name),
          nomeOriginal: upload.arquivo.name,
          tipo: this.getFileType(upload.arquivo.name),
          categoria: upload.categoria,
          tamanho: upload.arquivo.size,
          tamanhoFormatado: this.formatFileSize(upload.arquivo.size),
          url: '/assets/mock/documentos/' + this.generateFileName(upload.arquivo.name),
          processoId: upload.processoId,
          uploadedBy: {
            id: this.currentUser?.id || '1',
            nome: this.currentUser?.nome || 'Usuário',
            tipo: this.currentUser?.tipo || 'cliente'
          },
          dataUpload: new Date(),
          versao: 1,
          descricao: upload.descricao,
          tags: upload.tags || [],
          publico: upload.publico !== false, // Default true
          status: 'processando'
        };

        this.mockDocumentos.push(novoDocumento);
        this.documentosSubject.next([...this.mockDocumentos]);

        // Simular processamento
        setTimeout(() => {
          novoDocumento.status = 'disponivel';
          this.documentosSubject.next([...this.mockDocumentos]);
        }, 1000);

        return novoDocumento;
      })
    );
  }

  downloadDocumento(documentoId: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        // Simular download
        const documento = this.mockDocumentos.find(d => d.id === documentoId);
        if (documento) {
          // Em produção, aqui seria feito o download real
          console.log('Download iniciado:', documento.nome);
          return true;
        }
        throw new Error('Documento não encontrado');
      })
    );
  }

  excluirDocumento(documentoId: string): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      map(() => {
        const index = this.mockDocumentos.findIndex(d => d.id === documentoId);
        if (index >= 0) {
          this.mockDocumentos.splice(index, 1);
          this.documentosSubject.next([...this.mockDocumentos]);
          return true;
        }
        throw new Error('Documento não encontrado');
      })
    );
  }

  atualizarDocumento(documentoId: string, updates: Partial<Documento>): Observable<Documento> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const documento = this.mockDocumentos.find(d => d.id === documentoId);
        if (!documento) {
          throw new Error('Documento não encontrado');
        }

        Object.assign(documento, updates);
        documento.dataModificacao = new Date();
        
        this.documentosSubject.next([...this.mockDocumentos]);
        return documento;
      })
    );
  }

  getEstatisticas(processoId?: string): Observable<DocumentoEstatisticas> {
    return this.documentos$.pipe(
      delay(200),
      map(documentos => {
        let docs = documentos;
        
        if (processoId) {
          docs = documentos.filter(d => d.processoId === processoId);
        }

        // Filtrar por permissão
        if (this.currentUser?.tipo === 'cliente') {
          docs = docs.filter(d => d.publico || d.uploadedBy.id === this.currentUser?.id);
        }

        const tamanhoTotal = docs.reduce((total, doc) => total + doc.tamanho, 0);
        
        return {
          total: docs.length,
          tamanhoTotal,
          tamanhoTotalFormatado: this.formatFileSize(tamanhoTotal),
          porTipo: this.groupBy(docs, 'tipo'),
          porCategoria: this.groupBy(docs, 'categoria'),
          porStatus: this.groupBy(docs, 'status'),
          uploadsRecentes: docs.filter(d => {
            const umaSemanaAtras = new Date();
            umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
            return new Date(d.dataUpload) > umaSemanaAtras;
          }).length,
          limitesUsados: {
            espaco: Math.min((tamanhoTotal / (100 * 1024 * 1024)) * 100, 100), // 100MB limite
            quantidade: Math.min((docs.length / 50) * 100, 100) // 50 arquivos limite
          }
        };
      })
    );
  }

  getCategorias(): DocumentoCategoria[] {
    return [
      'inicial',
      'identificacao', 
      'comprovantes',
      'contratos',
      'peticoes',
      'sentencas',
      'evidencias',
      'correspondencia',
      'outros'
    ];
  }

  getCategoriaLabel(categoria: DocumentoCategoria): string {
    const labels: { [key: string]: string } = {
      'inicial': 'Documentos Iniciais',
      'identificacao': 'Identificação',
      'comprovantes': 'Comprovantes',
      'contratos': 'Contratos',
      'peticoes': 'Petições',
      'sentencas': 'Sentenças',
      'evidencias': 'Evidências',
      'correspondencia': 'Correspondência',
      'outros': 'Outros'
    };
    return labels[categoria] || categoria;
  }

  getTipoIcon(tipo: DocumentoTipo): string {
    const icons: { [key: string]: string } = {
      'pdf': 'pi pi-file-pdf',
      'doc': 'pi pi-file-word',
      'docx': 'pi pi-file-word',
      'txt': 'pi pi-file',
      'jpg': 'pi pi-image',
      'jpeg': 'pi pi-image',
      'png': 'pi pi-image',
      'gif': 'pi pi-image',
      'xls': 'pi pi-file-excel',
      'xlsx': 'pi pi-file-excel',
      'zip': 'pi pi-file-zip',
      'rar': 'pi pi-file-zip',
      'outros': 'pi pi-file'
    };
    return icons[tipo] || 'pi pi-file';
  }

  // Métodos utilitários
  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const safeName = nameWithoutExt.toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');
    
    return `${safeName}_${timestamp}.${extension}`;
  }

  private getFileType(fileName: string): DocumentoTipo {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf': return 'pdf';
      case 'doc': return 'doc';
      case 'docx': return 'docx';
      case 'txt': return 'txt';
      case 'jpg': case 'jpeg': return 'jpeg';
      case 'png': return 'png';
      case 'gif': return 'gif';
      case 'xls': return 'xls';
      case 'xlsx': return 'xlsx';
      case 'zip': return 'zip';
      case 'rar': return 'rar';
      default: return 'outros';
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private groupBy(array: any[], key: string): { [key: string]: number } {
    return array.reduce((result, item) => {
      const group = item[key];
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }

  // Validações
  isFileTypeAllowed(fileName: string): boolean {
    const allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'xls', 'xlsx', 'zip', 'rar'];
    const extension = fileName.split('.').pop()?.toLowerCase();
    return allowedTypes.includes(extension || '');
  }

  isFileSizeAllowed(size: number): boolean {
    const maxSize = 10 * 1024 * 1024; // 10 MB
    return size <= maxSize;
  }

  validateUpload(file: File): { valid: boolean; error?: string } {
    if (!this.isFileTypeAllowed(file.name)) {
      return {
        valid: false,
        error: 'Tipo de arquivo não permitido. Use: PDF, Word, Excel, imagens ou ZIP.'
      };
    }

    if (!this.isFileSizeAllowed(file.size)) {
      return {
        valid: false,
        error: 'Arquivo muito grande. Tamanho máximo: 10 MB.'
      };
    }

    return { valid: true };
  }
}
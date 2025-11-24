import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sindicado, DocumentoComprobatorio } from '../models/user.model';

export interface SindicadoFiltro {
  nome?: string;
  tipo?: 'cooperativa' | 'sindicato';
  status?: 'ativo' | 'inativo' | 'pendente';
  verificado?: boolean;
}

export interface SindicadoEstatisticas {
  total: number;
  ativos: number;
  inativos: number;
  pendentes: number;
  cooperativas: number;
  sindicatos: number;
  verificados: number;
  naoVerificados: number;
}

@Injectable({
  providedIn: 'root'
})
export class SindicadoService {
  private apiUrl = '/api/sindicados';
  private sindicadosSubject = new BehaviorSubject<Sindicado[]>([]);
  public sindicados$ = this.sindicadosSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Buscar todos os sindicados
  buscarSindicados(filtros?: SindicadoFiltro): Observable<Sindicado[]> {
    const params = this.buildFilterParams(filtros);
    return this.http.get<Sindicado[]>(this.apiUrl, { params })
      .pipe(
        map(sindicados => {
          this.sindicadosSubject.next(sindicados);
          return sindicados;
        })
      );
  }

  // Buscar sindicado por ID
  buscarSindicadoPorId(id: string): Observable<Sindicado> {
    return this.http.get<Sindicado>(`${this.apiUrl}/${id}`);
  }

  // Criar novo sindicado
  criarSindicado(sindicado: Partial<Sindicado>): Observable<Sindicado> {
    return this.http.post<Sindicado>(this.apiUrl, sindicado)
      .pipe(
        map(novoSindicado => {
          const sindicados = this.sindicadosSubject.value;
          this.sindicadosSubject.next([...sindicados, novoSindicado]);
          return novoSindicado;
        })
      );
  }

  // Atualizar sindicado
  atualizarSindicado(id: string, sindicado: Partial<Sindicado>): Observable<Sindicado> {
    return this.http.put<Sindicado>(`${this.apiUrl}/${id}`, sindicado)
      .pipe(
        map(sindicadoAtualizado => {
          const sindicados = this.sindicadosSubject.value;
          const index = sindicados.findIndex(s => s.id === id);
          if (index !== -1) {
            sindicados[index] = sindicadoAtualizado;
            this.sindicadosSubject.next([...sindicados]);
          }
          return sindicadoAtualizado;
        })
      );
  }

  // Excluir sindicado
  excluirSindicado(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        map(() => {
          const sindicados = this.sindicadosSubject.value;
          const sindicadosFiltrados = sindicados.filter(s => s.id !== id);
          this.sindicadosSubject.next(sindicadosFiltrados);
        })
      );
  }

  // Buscar estatísticas
  buscarEstatisticas(): Observable<SindicadoEstatisticas> {
    return this.http.get<SindicadoEstatisticas>(`${this.apiUrl}/estatisticas`);
  }

  // Vincular advogado ao sindicado
  vincularAdvogado(sindicadoId: string, advogadoId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${sindicadoId}/advogados/${advogadoId}`, {});
  }

  // Desvincular advogado do sindicado
  desvincularAdvogado(sindicadoId: string, advogadoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${sindicadoId}/advogados/${advogadoId}`);
  }

  // Buscar advogados vinculados ao sindicado
  buscarAdvogadosVinculados(sindicadoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${sindicadoId}/advogados`);
  }

  // Vincular processo ao sindicado
  vincularProcesso(sindicadoId: string, processoId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${sindicadoId}/processos/${processoId}`, {});
  }

  // Desvincular processo do sindicado
  desvincularProcesso(sindicadoId: string, processoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${sindicadoId}/processos/${processoId}`);
  }

  // Buscar processos vinculados ao sindicado
  buscarProcessosVinculados(sindicadoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${sindicadoId}/processos`);
  }

  // Importar advogados (CSV/Excel)
  importarAdvogados(sindicadoId: string, arquivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    return this.http.post<any>(`${this.apiUrl}/${sindicadoId}/importar-advogados`, formData);
  }

  // Verificar sindicado
  verificarSindicado(id: string): Observable<Sindicado> {
    return this.http.post<Sindicado>(`${this.apiUrl}/${id}/verificar`, {});
  }

  // Rejeitar verificação do sindicado
  rejeitarSindicado(id: string, motivo: string): Observable<Sindicado> {
    return this.http.post<Sindicado>(`${this.apiUrl}/${id}/rejeitar`, { motivo });
  }

  // Upload de documento comprobatório
  uploadDocumentoComprobatorio(sindicadoId: string, arquivo: File, tipo: string): Observable<DocumentoComprobatorio> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('tipo', tipo);
    return this.http.post<DocumentoComprobatorio>(`${this.apiUrl}/${sindicadoId}/documentos`, formData);
  }

  // Remover documento comprobatório
  removerDocumentoComprobatorio(sindicadoId: string, documentoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${sindicadoId}/documentos/${documentoId}`);
  }

  // Buscar documentos comprobatórios
  buscarDocumentosComprobatorios(sindicadoId: string): Observable<DocumentoComprobatorio[]> {
    return this.http.get<DocumentoComprobatorio[]>(`${this.apiUrl}/${sindicadoId}/documentos`);
  }

  // Verificar documento
  verificarDocumento(sindicadoId: string, documentoId: string): Observable<DocumentoComprobatorio> {
    return this.http.post<DocumentoComprobatorio>(`${this.apiUrl}/${sindicadoId}/documentos/${documentoId}/verificar`, {});
  }

  // Utilitários
  private buildFilterParams(filtros?: SindicadoFiltro): any {
    if (!filtros) return {};
    
    const params: any = {};
    if (filtros.nome) params.nome = filtros.nome;
    if (filtros.tipo) params.tipo = filtros.tipo;
    if (filtros.status) params.status = filtros.status;
    if (filtros.verificado !== undefined) params.verificado = filtros.verificado;
    
    return params;
  }

  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case 'cooperativa':
        return 'pi pi-building';
      case 'sindicato':
        return 'pi pi-users';
      default:
        return 'pi pi-building';
    }
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'cooperativa':
        return 'Cooperativa';
      case 'sindicato':
        return 'Sindicato';
      default:
        return 'Sindicado';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ativo':
        return 'pi pi-check-circle text-green-500';
      case 'inativo':
        return 'pi pi-times-circle text-red-500';
      case 'pendente':
        return 'pi pi-clock text-yellow-500';
      default:
        return 'pi pi-question-circle text-gray-500';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'inativo':
        return 'Inativo';
      case 'pendente':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  }
}

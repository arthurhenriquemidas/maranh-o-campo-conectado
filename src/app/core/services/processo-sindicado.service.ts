import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ProcessoSindicado {
  id: string;
  processoId: string;
  sindicadoId: string;
  dataVinculacao: string;
  status: 'ativo' | 'inativo' | 'suspenso';
  observacoes?: string;
  // Dados do processo
  processo?: {
    id: string;
    titulo: string;
    descricao: string;
    tipo: string;
    status: string;
    cliente: {
      id: string;
      nome: string;
      email: string;
    };
    advogado?: {
      id: string;
      nome: string;
      email: string;
    };
  };
  // Dados do sindicado
  sindicado?: {
    id: string;
    nome: string;
    tipo: 'cooperativa' | 'sindicato';
    cnpj: string;
  };
}

export interface ProcessoSindicadoFiltro {
  sindicadoId?: string;
  processoId?: string;
  status?: 'ativo' | 'inativo' | 'suspenso';
  tipoProcesso?: string;
  dataInicio?: string;
  dataFim?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProcessoSindicadoService {
  private apiUrl = '/api/processo-sindicado';
  private vinculacoesSubject = new BehaviorSubject<ProcessoSindicado[]>([]);
  public vinculacoes$ = this.vinculacoesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Buscar todas as vinculações
  buscarVinculacoes(filtros?: ProcessoSindicadoFiltro): Observable<ProcessoSindicado[]> {
    const params = this.buildFilterParams(filtros);
    return this.http.get<ProcessoSindicado[]>(this.apiUrl, { params })
      .pipe(
        map(vinculacoes => {
          this.vinculacoesSubject.next(vinculacoes);
          return vinculacoes;
        })
      );
  }

  // Buscar vinculação por ID
  buscarVinculacaoPorId(id: string): Observable<ProcessoSindicado> {
    return this.http.get<ProcessoSindicado>(`${this.apiUrl}/${id}`);
  }

  // Vincular processo ao sindicado
  vincularProcesso(processoId: string, sindicadoId: string, observacoes?: string): Observable<ProcessoSindicado> {
    const dados = {
      processoId,
      sindicadoId,
      observacoes
    };
    return this.http.post<ProcessoSindicado>(this.apiUrl, dados)
      .pipe(
        map(vinculacao => {
          const vinculacoes = this.vinculacoesSubject.value;
          this.vinculacoesSubject.next([...vinculacoes, vinculacao]);
          return vinculacao;
        })
      );
  }

  // Desvincular processo do sindicado
  desvincularProcesso(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        map(() => {
          const vinculacoes = this.vinculacoesSubject.value;
          const vinculacoesFiltradas = vinculacoes.filter(v => v.id !== id);
          this.vinculacoesSubject.next(vinculacoesFiltradas);
        })
      );
  }

  // Atualizar vinculação
  atualizarVinculacao(id: string, dados: Partial<ProcessoSindicado>): Observable<ProcessoSindicado> {
    return this.http.put<ProcessoSindicado>(`${this.apiUrl}/${id}`, dados)
      .pipe(
        map(vinculacaoAtualizada => {
          const vinculacoes = this.vinculacoesSubject.value;
          const index = vinculacoes.findIndex(v => v.id === id);
          if (index !== -1) {
            vinculacoes[index] = vinculacaoAtualizada;
            this.vinculacoesSubject.next([...vinculacoes]);
          }
          return vinculacaoAtualizada;
        })
      );
  }

  // Buscar processos disponíveis para vinculação
  buscarProcessosDisponiveis(sindicadoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/processos-disponiveis/${sindicadoId}`);
  }

  // Buscar processos vinculados ao sindicado
  buscarProcessosVinculados(sindicadoId: string): Observable<ProcessoSindicado[]> {
    return this.http.get<ProcessoSindicado[]>(`${this.apiUrl}/sindicado/${sindicadoId}/processos`);
  }

  // Buscar sindicados vinculados ao processo
  buscarSindicadosVinculados(processoId: string): Observable<ProcessoSindicado[]> {
    return this.http.get<ProcessoSindicado[]>(`${this.apiUrl}/processo/${processoId}/sindicados`);
  }

  // Alterar advogado do processo (apenas para sindicados)
  alterarAdvogadoProcesso(vinculacaoId: string, novoAdvogadoId: string, motivo: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${vinculacaoId}/alterar-advogado`, {
      novoAdvogadoId,
      motivo
    });
  }

  // Alterar dados do processo (apenas para sindicados)
  alterarDadosProcesso(vinculacaoId: string, dados: any, motivo: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${vinculacaoId}/alterar-processo`, {
      dados,
      motivo
    });
  }

  // Buscar histórico de alterações
  buscarHistoricoAlteracoes(vinculacaoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${vinculacaoId}/historico`);
  }

  // Utilitários
  private buildFilterParams(filtros?: ProcessoSindicadoFiltro): any {
    if (!filtros) return {};
    
    const params: any = {};
    if (filtros.sindicadoId) params.sindicadoId = filtros.sindicadoId;
    if (filtros.processoId) params.processoId = filtros.processoId;
    if (filtros.status) params.status = filtros.status;
    if (filtros.tipoProcesso) params.tipoProcesso = filtros.tipoProcesso;
    if (filtros.dataInicio) params.dataInicio = filtros.dataInicio;
    if (filtros.dataFim) params.dataFim = filtros.dataFim;
    
    return params;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ativo':
        return 'pi pi-check-circle text-green-500';
      case 'inativo':
        return 'pi pi-times-circle text-red-500';
      case 'suspenso':
        return 'pi pi-pause-circle text-yellow-500';
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
      case 'suspenso':
        return 'Suspenso';
      default:
        return 'Desconhecido';
    }
  }

  formatarData(data: string | Date): string {
    const date = typeof data === 'string' ? new Date(data) : data;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}

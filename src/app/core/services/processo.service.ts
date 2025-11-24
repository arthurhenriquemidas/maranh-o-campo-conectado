import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map, filter, take } from 'rxjs/operators';
import { 
  Processo, 
  ProcessoDetalhes, 
  CreateProcessoData, 
  ProcessoFiltros,
  ProcessoTipoOption,
  ProcessoStatusOption
} from '../models/processo.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessoService {
  private processosSubject = new BehaviorSubject<Processo[]>([]);
  public processos$ = this.processosSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadProcessos();
  }

  private async loadProcessos(): Promise<void> {
    try {
      // Carregar dados do processos.json (formato antigo)
      const dataProcessos = await this.http.get<any>('assets/mock/processos.json').toPromise();
      
      // Carregar dados do processes.json (formato novo)
      const dataProcesses = await this.http.get<any>('assets/mock/processes.json').toPromise();
      
      // Converter processos do formato novo para o formato antigo
      const processosConvertidos = dataProcesses.map((proc: any) => ({
        id: proc.id,
        titulo: proc.title,
        descricao: proc.description,
        tipo: this.convertAreaToTipo(proc.area),
        status: this.convertStatus(proc.status),
        clienteId: proc.customerId,
        advogadoId: proc.lawyerId,
        valor: 0, // Valor não disponível no formato novo
        dataCriacao: proc.createdAt,
        dataAtribuicao: proc.lawyerId ? proc.createdAt : null,
        prazoEstimado: proc.nextDeadline,
        urgencia: this.convertPriority(proc.priority),
        documentosCount: proc.documents?.length || 0,
        mensagensCount: 0 // Será calculado pelo chat service
      }));
      
      // Combinar ambos os formatos
      const todosProcessos = [...dataProcessos.processos, ...processosConvertidos];
      this.processosSubject.next(todosProcessos);
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    }
  }

  private convertAreaToTipo(area: string): string {
    const areaMap: { [key: string]: string } = {
      'Direito Civil': 'civil',
      'Direito de Família': 'familia',
      'Direito do Trabalho': 'trabalhista',
      'Direito Empresarial': 'empresarial',
      'Direito Tributário': 'tributario',
      'Direito Criminal': 'criminal'
    };
    return areaMap[area] || 'civil';
  }

  private convertStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'ABERTO': 'aberto',
      'EM_ANDAMENTO': 'em_andamento',
      'AGUARDANDO_CLIENTE': 'aguardando_cliente',
      'AGUARDANDO_APROVACAO': 'aguardando_aprovacao',
      'CONCLUIDO': 'concluido',
      'ARQUIVADO': 'arquivado'
    };
    return statusMap[status] || 'aberto';
  }

  private convertPriority(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'baixa': 'baixa',
      'media': 'media',
      'alta': 'alta'
    };
    return priorityMap[priority] || 'media';
  }

  getProcessos(filtros?: ProcessoFiltros): Observable<Processo[]> {
    return this.processos$.pipe(
      delay(800), // Simular carregamento
      map(processos => {
        let resultado = [...processos];
        const currentUser = this.authService.getCurrentUser();

        // Filtrar por usuário
        if (currentUser) {
          if (currentUser.tipo === 'cliente') {
            resultado = resultado.filter(p => p.clienteId === currentUser.id);
          } else if (currentUser.tipo === 'advogado') {
            resultado = resultado.filter(p => p.advogadoId === currentUser.id);
          }
          // Admin vê todos
        }

        // Aplicar filtros
        if (filtros) {
          if (filtros.status?.length) {
            resultado = resultado.filter(p => filtros.status!.includes(p.status));
          }
          if (filtros.tipo?.length) {
            resultado = resultado.filter(p => filtros.tipo!.includes(p.tipo));
          }
          if (filtros.urgencia?.length) {
            resultado = resultado.filter(p => filtros.urgencia!.includes(p.urgencia));
          }
          if (filtros.busca) {
            const busca = filtros.busca.toLowerCase();
            resultado = resultado.filter(p => 
              p.titulo.toLowerCase().includes(busca) ||
              p.descricao.toLowerCase().includes(busca)
            );
          }
        }

        return resultado;
      })
    );
  }

  // Função duplicada removida

  createProcesso(data: CreateProcessoData): Observable<Processo> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const novoProcesso: Processo = {
          id: 'P' + String(Date.now()).slice(-3),
          titulo: data.titulo,
          descricao: data.descricao,
          tipo: data.tipo,
          status: 'aberto',
          clienteId: data.clienteId,
          advogadoId: null,
          valor: data.valor,
          dataCriacao: new Date().toISOString(),
          dataAtribuicao: null,
          prazoEstimado: data.prazoEstimado,
          urgencia: data.urgencia,
          documentosCount: 0,
          mensagensCount: 0
        };

        // Adicionar à lista local
        const processos = this.processosSubject.value;
        this.processosSubject.next([novoProcesso, ...processos]);

        return novoProcesso;
      })
    );
  }

  updateProcesso(id: string, data: Partial<Processo>): Observable<Processo> {
    return of(null).pipe(
      delay(800),
      map(() => {
        const processos = this.processosSubject.value;
        const index = processos.findIndex(p => p.id === id);
        
        if (index === -1) {
          throw new Error('Processo não encontrado');
        }

        const processoAtualizado = { ...processos[index], ...data };
        processos[index] = processoAtualizado;
        this.processosSubject.next([...processos]);

        return processoAtualizado;
      })
    );
  }

  deleteProcesso(id: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const processos = this.processosSubject.value;
        const novosProcessos = processos.filter(p => p.id !== id);
        this.processosSubject.next(novosProcessos);
        return true;
      })
    );
  }

  atribuirAdvogado(processoId: string, advogadoId: string): Observable<boolean> {
    return this.updateProcesso(processoId, {
      advogadoId,
      status: 'em_andamento',
      dataAtribuicao: new Date().toISOString()
    }).pipe(
      map(() => true)
    );
  }

  solicitarConclusao(processoId: string): Observable<boolean> {
    return this.updateProcesso(processoId, {
      status: 'aguardando_cliente'
    }).pipe(
      map(() => true)
    );
  }

  aprovarConclusao(processoId: string): Observable<boolean> {
    return this.updateProcesso(processoId, {
      status: 'concluido',
      dataConclusao: new Date().toISOString()
    }).pipe(
      map(() => true)
    );
  }

  rejeitarConclusao(processoId: string): Observable<boolean> {
    return this.updateProcesso(processoId, {
      status: 'em_andamento'
    }).pipe(
      map(() => true)
    );
  }

  getTiposProcesso(): Observable<ProcessoTipoOption[]> {
    return this.http.get<any>('assets/mock/processos.json').pipe(
      map(data => data.tipos)
    );
  }

  getStatusProcesso(): Observable<ProcessoStatusOption[]> {
    return this.http.get<any>('assets/mock/processos.json').pipe(
      map(data => data.status)
    );
  }

  getProcessosByAdvogado(advogadoId: string): Observable<Processo[]> {
    return this.processos$.pipe(
      delay(800),
      map(processos => processos.filter(p => p.advogadoId === advogadoId))
    );
  }

  getProcessoById(id: string): Observable<Processo> {
    return this.processos$.pipe(
      filter(processos => processos.length > 0), // Aguardar até ter processos carregados
      map(processos => {
        const processo = processos.find(p => p.id === id);
        if (!processo) {
          throw new Error('Processo não encontrado');
        }
        return processo;
      }),
      take(1) // Garantir que só emite uma vez
    );
  }

  getEstatisticas(): Observable<any> {
    return this.processos$.pipe(
      delay(600),
      map(processos => {
        const currentUser = this.authService.getCurrentUser();
        let processosUsuario = processos;

        // Filtrar por usuário
        if (currentUser?.tipo === 'cliente') {
          processosUsuario = processos.filter(p => p.clienteId === currentUser.id);
        } else if (currentUser?.tipo === 'advogado') {
          processosUsuario = processos.filter(p => p.advogadoId === currentUser.id);
        }

        return {
          total: processosUsuario.length,
          ativos: processosUsuario.filter(p => p.status === 'em_andamento').length,
          concluidos: processosUsuario.filter(p => p.status === 'concluido').length,
          pendentes: processosUsuario.filter(p => p.status === 'aberto' || p.status === 'aguardando_cliente').length,
          porTipo: this.groupBy(processosUsuario, 'tipo'),
          porStatus: this.groupBy(processosUsuario, 'status'),
          porUrgencia: this.groupBy(processosUsuario, 'urgencia')
        };
      })
    );
  }

  private groupBy(array: any[], key: string): { [key: string]: number } {
    return array.reduce((result, item) => {
      const group = item[key];
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }
}

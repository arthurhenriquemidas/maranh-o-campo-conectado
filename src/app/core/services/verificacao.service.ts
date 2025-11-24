import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  VerificacaoIdentidade, 
  VerificacaoAdvogado, 
  VerificacaoCliente,
  EstatisticasVerificacao,
  FiltroVerificacao,
  VerificacaoStatus,
  DocumentoVerificacao,
  TipoDocumentoVerificacao,
  DocumentoStatus
} from '../models/verificacao.model';

@Injectable({
  providedIn: 'root'
})
export class VerificacaoService {
  
  private verificacoesSubject = new BehaviorSubject<VerificacaoIdentidade[]>([]);
  public verificacoes$ = this.verificacoesSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const mockVerificacoes: VerificacaoIdentidade[] = [
      {
        id: 'V001',
        usuarioId: 'U001',
        usuarioNome: 'João Silva',
        usuarioEmail: 'joao.silva@email.com',
        tipoUsuario: 'cliente',
        status: 'pendente',
        documentos: [
          {
            id: 'D001',
            tipo: 'rg',
            nome: 'RG-Joao-Silva.pdf',
            url: '/assets/mock/documentos/rg-joao.pdf',
            status: 'pendente',
            dataUpload: new Date('2024-01-15')
          },
          {
            id: 'D002',
            tipo: 'cpf',
            nome: 'CPF-Joao-Silva.pdf',
            url: '/assets/mock/documentos/cpf-joao.pdf',
            status: 'pendente',
            dataUpload: new Date('2024-01-15')
          }
        ],
        dataSubmissao: new Date('2024-01-15')
      },
      {
        id: 'V002',
        usuarioId: 'U002',
        usuarioNome: 'Dr. Carlos Oliveira',
        usuarioEmail: 'carlos.oliveira@adv.com',
        tipoUsuario: 'advogado',
        status: 'aprovado',
        documentos: [
          {
            id: 'D003',
            tipo: 'oab',
            nome: 'OAB-Carlos-Oliveira.pdf',
            url: '/assets/mock/documentos/oab-carlos.pdf',
            status: 'aprovado',
            dataUpload: new Date('2024-01-10')
          },
          {
            id: 'D004',
            tipo: 'foto_oab',
            nome: 'Foto-OAB-Carlos.jpg',
            url: '/assets/mock/documentos/foto-oab-carlos.jpg',
            status: 'aprovado',
            dataUpload: new Date('2024-01-10')
          }
        ],
        dataSubmissao: new Date('2024-01-10'),
        dataAnalise: new Date('2024-01-12'),
        analisadoPor: 'Admin Sistema'
      },
      {
        id: 'V003',
        usuarioId: 'U003',
        usuarioNome: 'Maria Santos',
        usuarioEmail: 'maria.santos@empresa.com',
        tipoUsuario: 'cliente',
        status: 'em_analise',
        documentos: [
          {
            id: 'D005',
            tipo: 'cnpj',
            nome: 'CNPJ-Empresa-Santos.pdf',
            url: '/assets/mock/documentos/cnpj-maria.pdf',
            status: 'aprovado',
            dataUpload: new Date('2024-01-12')
          },
          {
            id: 'D006',
            tipo: 'contrato_social',
            nome: 'Contrato-Social.pdf',
            url: '/assets/mock/documentos/contrato-social-maria.pdf',
            status: 'pendente',
            observacoes: 'Documento com baixa qualidade, solicitar reenvio',
            dataUpload: new Date('2024-01-12')
          }
        ],
        dataSubmissao: new Date('2024-01-12'),
        observacoes: 'Empresa de grande porte, verificar documentação societária'
      },
      {
        id: 'V004',
        usuarioId: 'U004',
        usuarioNome: 'Dra. Ana Costa',
        usuarioEmail: 'ana.costa@adv.com',
        tipoUsuario: 'advogado',
        status: 'rejeitado',
        documentos: [
          {
            id: 'D007',
            tipo: 'oab',
            nome: 'OAB-Ana-Costa.pdf',
            url: '/assets/mock/documentos/oab-ana.pdf',
            status: 'rejeitado',
            observacoes: 'Documento ilegível',
            dataUpload: new Date('2024-01-08')
          }
        ],
        dataSubmissao: new Date('2024-01-08'),
        dataAnalise: new Date('2024-01-09'),
        analisadoPor: 'Admin Sistema',
        motivoRejeicao: 'Documento da OAB ilegível. Favor reenviar documento com melhor qualidade.'
      }
    ];

    this.verificacoesSubject.next(mockVerificacoes);
  }

  getVerificacoes(filtro?: FiltroVerificacao): Observable<VerificacaoIdentidade[]> {
    return this.verificacoes$.pipe(
      map(verificacoes => {
        if (!filtro) return verificacoes;

        return verificacoes.filter(v => {
          if (filtro.status && !filtro.status.includes(v.status)) return false;
          if (filtro.tipoUsuario && !filtro.tipoUsuario.includes(v.tipoUsuario)) return false;
          if (filtro.busca) {
            const busca = filtro.busca.toLowerCase();
            if (!v.usuarioNome.toLowerCase().includes(busca) && 
                !v.usuarioEmail.toLowerCase().includes(busca)) return false;
          }
          if (filtro.dataInicio && v.dataSubmissao < filtro.dataInicio) return false;
          if (filtro.dataFim && v.dataSubmissao > filtro.dataFim) return false;
          
          return true;
        });
      }),
      delay(300) // Simular latência da API
    );
  }

  getVerificacaoById(id: string): Observable<VerificacaoIdentidade | null> {
    return this.verificacoes$.pipe(
      map(verificacoes => verificacoes.find(v => v.id === id) || null),
      delay(200)
    );
  }

  getVerificacoesPendentes(): Observable<VerificacaoIdentidade[]> {
    return this.getVerificacoes({ status: ['pendente', 'em_analise'] });
  }

  getEstatisticas(): Observable<EstatisticasVerificacao> {
    return this.verificacoes$.pipe(
      map(verificacoes => {
        const stats: EstatisticasVerificacao = {
          totalPendentes: verificacoes.filter(v => v.status === 'pendente').length,
          totalAprovados: verificacoes.filter(v => v.status === 'aprovado').length,
          totalRejeitados: verificacoes.filter(v => v.status === 'rejeitado').length,
          totalEmAnalise: verificacoes.filter(v => v.status === 'em_analise').length,
          tempoMedioAnalise: this.calcularTempoMedioAnalise(verificacoes),
          advogadosPendentes: verificacoes.filter(v => 
            v.tipoUsuario === 'advogado' && ['pendente', 'em_analise'].includes(v.status)
          ).length,
          clientesPendentes: verificacoes.filter(v => 
            v.tipoUsuario === 'cliente' && ['pendente', 'em_analise'].includes(v.status)
          ).length
        };
        return stats;
      }),
      delay(200)
    );
  }

  private calcularTempoMedioAnalise(verificacoes: VerificacaoIdentidade[]): number {
    const analisadas = verificacoes.filter(v => v.dataAnalise);
    if (analisadas.length === 0) return 0;

    const tempoTotal = analisadas.reduce((acc, v) => {
      if (v.dataAnalise && v.dataSubmissao) {
        const diff = v.dataAnalise.getTime() - v.dataSubmissao.getTime();
        return acc + (diff / (1000 * 60 * 60)); // converter para horas
      }
      return acc;
    }, 0);

    return Math.round(tempoTotal / analisadas.length);
  }

  aprovarVerificacao(id: string, observacoes?: string): Observable<boolean> {
    const verificacoes = this.verificacoesSubject.value;
    const index = verificacoes.findIndex(v => v.id === id);
    
    if (index !== -1) {
      verificacoes[index] = {
        ...verificacoes[index],
        status: 'aprovado',
        dataAnalise: new Date(),
        analisadoPor: 'Admin Sistema',
        observacoes: observacoes || verificacoes[index].observacoes
      };
      
      // Aprovar todos os documentos
      verificacoes[index].documentos = verificacoes[index].documentos.map(doc => ({
        ...doc,
        status: 'aprovado'
      }));
      
      this.verificacoesSubject.next([...verificacoes]);
      return of(true).pipe(delay(500));
    }
    
    return of(false);
  }

  rejeitarVerificacao(id: string, motivo: string, observacoes?: string): Observable<boolean> {
    const verificacoes = this.verificacoesSubject.value;
    const index = verificacoes.findIndex(v => v.id === id);
    
    if (index !== -1) {
      verificacoes[index] = {
        ...verificacoes[index],
        status: 'rejeitado',
        dataAnalise: new Date(),
        analisadoPor: 'Admin Sistema',
        motivoRejeicao: motivo,
        observacoes: observacoes || verificacoes[index].observacoes
      };
      
      this.verificacoesSubject.next([...verificacoes]);
      return of(true).pipe(delay(500));
    }
    
    return of(false);
  }

  iniciarAnalise(id: string): Observable<boolean> {
    const verificacoes = this.verificacoesSubject.value;
    const index = verificacoes.findIndex(v => v.id === id);
    
    if (index !== -1) {
      verificacoes[index] = {
        ...verificacoes[index],
        status: 'em_analise'
      };
      
      this.verificacoesSubject.next([...verificacoes]);
      return of(true).pipe(delay(300));
    }
    
    return of(false);
  }

  solicitarDocumento(verificacaoId: string, tipoDocumento: TipoDocumentoVerificacao, observacoes?: string): Observable<boolean> {
    const verificacoes = this.verificacoesSubject.value;
    const index = verificacoes.findIndex(v => v.id === verificacaoId);
    
    if (index !== -1) {
      verificacoes[index] = {
        ...verificacoes[index],
        status: 'documentos_pendentes',
        observacoes: observacoes
      };
      
      this.verificacoesSubject.next([...verificacoes]);
      return of(true).pipe(delay(300));
    }
    
    return of(false);
  }

  getStatusLabel(status: VerificacaoStatus): string {
    const labels: Record<VerificacaoStatus, string> = {
      'pendente': 'Pendente',
      'em_analise': 'Em Análise',
      'aprovado': 'Aprovado',
      'rejeitado': 'Rejeitado',
      'documentos_pendentes': 'Documentos Pendentes'
    };
    return labels[status];
  }

  getStatusSeverity(status: VerificacaoStatus): 'success' | 'info' | 'warning' | 'danger' {
    const severities: Record<VerificacaoStatus, 'success' | 'info' | 'warning' | 'danger'> = {
      'pendente': 'warning',
      'em_analise': 'info',
      'aprovado': 'success',
      'rejeitado': 'danger',
      'documentos_pendentes': 'warning'
    };
    return severities[status];
  }

  getTipoDocumentoLabel(tipo: TipoDocumentoVerificacao): string {
    const labels: Record<TipoDocumentoVerificacao, string> = {
      'rg': 'RG',
      'cpf': 'CPF',
      'cnpj': 'CNPJ',
      'comprovante_residencia': 'Comprovante de Residência',
      'comprovante_renda': 'Comprovante de Renda',
      'oab': 'Carteira OAB',
      'foto_oab': 'Foto da OAB',
      'selfie_documento': 'Selfie com Documento',
      'contrato_social': 'Contrato Social',
      'procuracao': 'Procuração'
    };
    return labels[tipo];
  }
}


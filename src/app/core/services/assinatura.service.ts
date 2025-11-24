import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  AssinaturaEletronica, 
  TermoLGPD, 
  EstatisticasAssinatura,
  FiltroAssinatura,
  StatusAssinatura,
  StatusTermo,
  TipoDocumentoAssinatura,
  ConsentimentoLGPD,
  LogAceiteTermo,
  AssinanteDocumento
} from '../models/assinatura.model';

@Injectable({
  providedIn: 'root'
})
export class AssinaturaService {
  
  private assinaturasSubject = new BehaviorSubject<AssinaturaEletronica[]>([]);
  public assinaturas$ = this.assinaturasSubject.asObservable();
  
  private termosSubject = new BehaviorSubject<TermoLGPD[]>([]);
  public termos$ = this.termosSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const mockAssinaturas: AssinaturaEletronica[] = [
      {
        id: 'AS001',
        documentoId: 'DOC001',
        documentoTitulo: 'Contrato de Prestação de Serviços Jurídicos',
        documentoTipo: 'contrato_advogado_cliente',
        processoId: 'P001',
        assinantes: [
          {
            id: 'ASS001',
            usuarioId: 'U001',
            usuarioNome: 'João Silva',
            usuarioEmail: 'joao.silva@email.com',
            tipoAssinante: 'cliente',
            statusAssinatura: 'assinado',
            dataAssinatura: new Date('2024-01-15T10:30:00'),
            ipAssinatura: '192.168.1.100',
            assinaturaDigital: 'hash_assinatura_joao_123',
            tokenAssinatura: 'token_abc123'
          },
          {
            id: 'ASS002',
            usuarioId: 'U002',
            usuarioNome: 'Dr. Carlos Oliveira',
            usuarioEmail: 'carlos.oliveira@adv.com',
            tipoAssinante: 'advogado',
            statusAssinatura: 'pendente'
          }
        ],
        status: 'aguardando_assinaturas',
        dataCreacao: new Date('2024-01-15T09:00:00'),
        hashDocumento: 'sha256_hash_documento_001',
        versaoDocumento: '1.0',
        ipOrigem: '192.168.1.100'
      },
      {
        id: 'AS002',
        documentoId: 'DOC002',
        documentoTitulo: 'Termo de Confidencialidade',
        documentoTipo: 'termo_confidencialidade',
        processoId: 'P002',
        assinantes: [
          {
            id: 'ASS003',
            usuarioId: 'U003',
            usuarioNome: 'Maria Santos',
            usuarioEmail: 'maria.santos@empresa.com',
            tipoAssinante: 'cliente',
            statusAssinatura: 'assinado',
            dataAssinatura: new Date('2024-01-12T14:20:00'),
            ipAssinatura: '192.168.1.101',
            assinaturaDigital: 'hash_assinatura_maria_456'
          },
          {
            id: 'ASS004',
            usuarioId: 'U002',
            usuarioNome: 'Dr. Carlos Oliveira',
            usuarioEmail: 'carlos.oliveira@adv.com',
            tipoAssinante: 'advogado',
            statusAssinatura: 'assinado',
            dataAssinatura: new Date('2024-01-12T15:45:00'),
            ipAssinatura: '192.168.1.102',
            assinaturaDigital: 'hash_assinatura_carlos_789'
          }
        ],
        status: 'concluido',
        dataCreacao: new Date('2024-01-12T13:00:00'),
        dataConclusao: new Date('2024-01-12T15:45:00'),
        hashDocumento: 'sha256_hash_documento_002',
        versaoDocumento: '1.0'
      }
    ];

    const mockTermos: TermoLGPD[] = [
      {
        id: 'TERMO001',
        usuarioId: 'U001',
        usuarioNome: 'João Silva',
        usuarioEmail: 'joao.silva@email.com',
        versaoTermo: '2.1',
        tipoTermo: 'consentimento_lgpd',
        status: 'aceito',
        dataAceite: new Date('2024-01-10T08:30:00'),
        dataExpiracao: new Date('2025-01-10T08:30:00'),
        ipAceite: '192.168.1.100',
        userAgentAceite: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        hashTermo: 'sha256_termo_lgpd_v21',
        consentimentos: [
          {
            id: 'CONS001',
            tipo: 'dados_pessoais',
            descricao: 'Tratamento de dados pessoais para prestação de serviços jurídicos',
            obrigatorio: true,
            aceito: true,
            dataAceite: new Date('2024-01-10T08:30:00')
          },
          {
            id: 'CONS002',
            tipo: 'marketing',
            descricao: 'Envio de comunicações promocionais e newsletters',
            obrigatorio: false,
            aceito: true,
            dataAceite: new Date('2024-01-10T08:30:00')
          },
          {
            id: 'CONS003',
            tipo: 'cookies_funcionais',
            descricao: 'Uso de cookies essenciais para funcionamento da plataforma',
            obrigatorio: true,
            aceito: true,
            dataAceite: new Date('2024-01-10T08:30:00')
          }
        ]
      },
      {
        id: 'TERMO002',
        usuarioId: 'U002',
        usuarioNome: 'Dr. Carlos Oliveira',
        usuarioEmail: 'carlos.oliveira@adv.com',
        versaoTermo: '2.1',
        tipoTermo: 'termo_uso',
        status: 'aceito',
        dataAceite: new Date('2024-01-08T16:15:00'),
        dataExpiracao: new Date('2025-01-08T16:15:00'),
        ipAceite: '192.168.1.102',
        hashTermo: 'sha256_termo_uso_v21',
        consentimentos: [
          {
            id: 'CONS004',
            tipo: 'dados_pessoais',
            descricao: 'Tratamento de dados para uso da plataforma jurídica',
            obrigatorio: true,
            aceito: true,
            dataAceite: new Date('2024-01-08T16:15:00')
          }
        ]
      },
      {
        id: 'TERMO003',
        usuarioId: 'U003',
        usuarioNome: 'Maria Santos',
        usuarioEmail: 'maria.santos@empresa.com',
        versaoTermo: '2.0',
        tipoTermo: 'consentimento_lgpd',
        status: 'revogado',
        dataAceite: new Date('2023-12-15T10:00:00'),
        dataRevogacao: new Date('2024-01-05T14:30:00'),
        ipAceite: '192.168.1.101',
        hashTermo: 'sha256_termo_lgpd_v20',
        consentimentos: [
          {
            id: 'CONS005',
            tipo: 'marketing',
            descricao: 'Comunicações promocionais',
            obrigatorio: false,
            aceito: false,
            dataRevogacao: new Date('2024-01-05T14:30:00')
          }
        ],
        observacoes: 'Cliente revogou consentimento para marketing'
      }
    ];

    this.assinaturasSubject.next(mockAssinaturas);
    this.termosSubject.next(mockTermos);
  }

  // Métodos para Assinaturas Eletrônicas
  getAssinaturas(filtro?: FiltroAssinatura): Observable<AssinaturaEletronica[]> {
    return this.assinaturas$.pipe(
      map(assinaturas => {
        if (!filtro) return assinaturas;

        return assinaturas.filter(a => {
          if (filtro.status && !filtro.status.includes(a.status)) return false;
          if (filtro.tipoDocumento && !filtro.tipoDocumento.includes(a.documentoTipo)) return false;
          if (filtro.busca) {
            const busca = filtro.busca.toLowerCase();
            if (!a.documentoTitulo.toLowerCase().includes(busca) &&
                !a.assinantes.some(ass => 
                  ass.usuarioNome.toLowerCase().includes(busca) ||
                  ass.usuarioEmail.toLowerCase().includes(busca)
                )) return false;
          }
          if (filtro.dataInicio && a.dataCreacao < filtro.dataInicio) return false;
          if (filtro.dataFim && a.dataCreacao > filtro.dataFim) return false;
          
          return true;
        });
      }),
      delay(300)
    );
  }

  getAssinaturaById(id: string): Observable<AssinaturaEletronica | null> {
    return this.assinaturas$.pipe(
      map(assinaturas => assinaturas.find(a => a.id === id) || null),
      delay(200)
    );
  }

  assinarDocumento(assinaturaId: string, assinanteId: string, dadosAssinatura: any): Observable<boolean> {
    const assinaturas = this.assinaturasSubject.value;
    const index = assinaturas.findIndex(a => a.id === assinaturaId);
    
    if (index !== -1) {
      const assinatura = { ...assinaturas[index] };
      const assinanteIndex = assinatura.assinantes.findIndex(a => a.id === assinanteId);
      
      if (assinanteIndex !== -1) {
        assinatura.assinantes[assinanteIndex] = {
          ...assinatura.assinantes[assinanteIndex],
          statusAssinatura: 'assinado',
          dataAssinatura: new Date(),
          ipAssinatura: dadosAssinatura.ip || '192.168.1.1',
          assinaturaDigital: `hash_${Date.now()}`,
          tokenAssinatura: `token_${Date.now()}`
        };

        // Verificar se todas as assinaturas foram concluídas
        const todasAssinadas = assinatura.assinantes.every(a => a.statusAssinatura === 'assinado');
        if (todasAssinadas) {
          assinatura.status = 'concluido';
          assinatura.dataConclusao = new Date();
        } else {
          assinatura.status = 'parcialmente_assinado';
        }

        assinaturas[index] = assinatura;
        this.assinaturasSubject.next([...assinaturas]);
        
        return of(true).pipe(delay(500));
      }
    }
    
    return of(false);
  }

  recusarAssinatura(assinaturaId: string, assinanteId: string, motivo: string): Observable<boolean> {
    const assinaturas = this.assinaturasSubject.value;
    const index = assinaturas.findIndex(a => a.id === assinaturaId);
    
    if (index !== -1) {
      const assinatura = { ...assinaturas[index] };
      const assinanteIndex = assinatura.assinantes.findIndex(a => a.id === assinanteId);
      
      if (assinanteIndex !== -1) {
        assinatura.assinantes[assinanteIndex] = {
          ...assinatura.assinantes[assinanteIndex],
          statusAssinatura: 'recusado',
          motivoRecusa: motivo
        };

        assinaturas[index] = assinatura;
        this.assinaturasSubject.next([...assinaturas]);
        
        return of(true).pipe(delay(500));
      }
    }
    
    return of(false);
  }

  // Métodos para Termos LGPD
  getTermos(): Observable<TermoLGPD[]> {
    return this.termos$.pipe(delay(200));
  }

  getTermoByUsuario(usuarioId: string, tipoTermo?: string): Observable<TermoLGPD[]> {
    return this.termos$.pipe(
      map(termos => termos.filter(t => {
        if (t.usuarioId !== usuarioId) return false;
        if (tipoTermo && t.tipoTermo !== tipoTermo) return false;
        return true;
      })),
      delay(200)
    );
  }

  aceitarTermo(usuarioId: string, tipoTermo: string, consentimentos: ConsentimentoLGPD[], dadosAceite: any): Observable<boolean> {
    const novoTermo: TermoLGPD = {
      id: `TERMO${Date.now()}`,
      usuarioId,
      usuarioNome: dadosAceite.usuarioNome,
      usuarioEmail: dadosAceite.usuarioEmail,
      versaoTermo: '2.1',
      tipoTermo: tipoTermo as any,
      status: 'aceito',
      dataAceite: new Date(),
      dataExpiracao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
      ipAceite: dadosAceite.ip,
      userAgentAceite: dadosAceite.userAgent,
      hashTermo: `sha256_${tipoTermo}_v21_${Date.now()}`,
      consentimentos: consentimentos.map(c => ({
        ...c,
        aceito: true,
        dataAceite: new Date()
      }))
    };

    const termos = this.termosSubject.value;
    termos.push(novoTermo);
    this.termosSubject.next([...termos]);

    return of(true).pipe(delay(500));
  }

  revogarConsentimento(termoId: string, consentimentoId: string): Observable<boolean> {
    const termos = this.termosSubject.value;
    const index = termos.findIndex(t => t.id === termoId);
    
    if (index !== -1) {
      const termo = { ...termos[index] };
      const consIndex = termo.consentimentos.findIndex(c => c.id === consentimentoId);
      
      if (consIndex !== -1) {
        termo.consentimentos[consIndex] = {
          ...termo.consentimentos[consIndex],
          aceito: false,
          dataRevogacao: new Date()
        };

        termos[index] = termo;
        this.termosSubject.next([...termos]);
        
        return of(true).pipe(delay(500));
      }
    }
    
    return of(false);
  }

  // Estatísticas
  getEstatisticas(): Observable<EstatisticasAssinatura> {
    return this.assinaturas$.pipe(
      map(assinaturas => {
        const stats: EstatisticasAssinatura = {
          totalDocumentos: assinaturas.length,
          documentosPendentes: assinaturas.filter(a => a.status === 'aguardando_assinaturas').length,
          documentosAssinados: assinaturas.filter(a => a.status === 'concluido').length,
          documentosCancelados: assinaturas.filter(a => a.status === 'cancelado').length,
          tempoMedioAssinatura: this.calcularTempoMedioAssinatura(assinaturas),
          taxaAceite: this.calcularTaxaAceite(assinaturas),
          termosLGPDAtivos: this.termosSubject.value.filter(t => t.status === 'aceito').length,
          consentimentosRevogados: this.contarConsentimentosRevogados()
        };
        return stats;
      }),
      delay(200)
    );
  }

  private calcularTempoMedioAssinatura(assinaturas: AssinaturaEletronica[]): number {
    const concluidas = assinaturas.filter(a => a.status === 'concluido' && a.dataConclusao);
    if (concluidas.length === 0) return 0;

    const tempoTotal = concluidas.reduce((acc, a) => {
      if (a.dataConclusao) {
        const diff = a.dataConclusao.getTime() - a.dataCreacao.getTime();
        return acc + (diff / (1000 * 60 * 60)); // converter para horas
      }
      return acc;
    }, 0);

    return Math.round(tempoTotal / concluidas.length);
  }

  private calcularTaxaAceite(assinaturas: AssinaturaEletronica[]): number {
    if (assinaturas.length === 0) return 0;
    const concluidas = assinaturas.filter(a => a.status === 'concluido').length;
    return Math.round((concluidas / assinaturas.length) * 100);
  }

  private contarConsentimentosRevogados(): number {
    return this.termosSubject.value.reduce((acc, termo) => {
      return acc + termo.consentimentos.filter(c => c.dataRevogacao).length;
    }, 0);
  }

  // Utilitários
  getStatusLabel(status: StatusAssinatura): string {
    const labels: Record<StatusAssinatura, string> = {
      'rascunho': 'Rascunho',
      'aguardando_assinaturas': 'Aguardando Assinaturas',
      'parcialmente_assinado': 'Parcialmente Assinado',
      'concluido': 'Concluído',
      'cancelado': 'Cancelado',
      'expirado': 'Expirado'
    };
    return labels[status];
  }

  getStatusSeverity(status: StatusAssinatura): 'success' | 'info' | 'warning' | 'danger' {
    const severities: Record<StatusAssinatura, 'success' | 'info' | 'warning' | 'danger'> = {
      'rascunho': 'info',
      'aguardando_assinaturas': 'warning',
      'parcialmente_assinado': 'info',
      'concluido': 'success',
      'cancelado': 'danger',
      'expirado': 'danger'
    };
    return severities[status];
  }

  getTipoDocumentoLabel(tipo: TipoDocumentoAssinatura): string {
    const labels: Record<TipoDocumentoAssinatura, string> = {
      'contrato_servico': 'Contrato de Serviço',
      'termo_uso': 'Termo de Uso',
      'politica_privacidade': 'Política de Privacidade',
      'contrato_advogado_cliente': 'Contrato Advogado-Cliente',
      'procuracao': 'Procuração',
      'termo_confidencialidade': 'Termo de Confidencialidade',
      'acordo_honorarios': 'Acordo de Honorários',
      'outros': 'Outros'
    };
    return labels[tipo];
  }
}

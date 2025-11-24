export interface AssinaturaEletronica {
  id: string;
  documentoId: string;
  documentoTitulo: string;
  documentoTipo: TipoDocumentoAssinatura;
  processoId?: string;
  
  // Assinantes
  assinantes: AssinanteDocumento[];
  
  // Status e controle
  status: StatusAssinatura;
  dataCreacao: Date;
  dataConclusao?: Date;
  validadeDocumento?: Date;
  
  // Segurança e compliance
  hashDocumento: string;
  versaoDocumento: string;
  ipOrigem?: string;
  
  // Observações e metadados
  observacoes?: string;
  metadados?: { [key: string]: any };
}

export interface AssinanteDocumento {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  usuarioEmail: string;
  tipoAssinante: TipoAssinante;
  
  // Status da assinatura
  statusAssinatura: StatusAssinaturaIndividual;
  dataAssinatura?: Date;
  ipAssinatura?: string;
  
  // Dados da assinatura
  assinaturaDigital?: string;
  certificadoDigital?: string;
  tokenAssinatura?: string;
  
  // Observações
  observacoes?: string;
  motivoRecusa?: string;
}

export interface TermoLGPD {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  usuarioEmail: string;
  
  // Versão e tipo do termo
  versaoTermo: string;
  tipoTermo: TipoTermo;
  
  // Status e datas
  status: StatusTermo;
  dataAceite?: Date;
  dataExpiracao?: Date;
  dataRevogacao?: Date;
  
  // Dados do aceite
  ipAceite?: string;
  userAgentAceite?: string;
  hashTermo: string;
  
  // Consentimentos específicos
  consentimentos: ConsentimentoLGPD[];
  
  // Observações
  observacoes?: string;
}

export interface ConsentimentoLGPD {
  id: string;
  tipo: TipoConsentimento;
  descricao: string;
  obrigatorio: boolean;
  aceito: boolean;
  dataAceite?: Date;
  dataRevogacao?: Date;
}

export interface LogAceiteTermo {
  id: string;
  termoId: string;
  usuarioId: string;
  acao: AcaoTermo;
  dataAcao: Date;
  ipOrigem?: string;
  userAgent?: string;
  detalhes?: string;
}

export type TipoDocumentoAssinatura = 
  | 'contrato_servico' 
  | 'termo_uso' 
  | 'politica_privacidade'
  | 'contrato_advogado_cliente'
  | 'procuracao'
  | 'termo_confidencialidade'
  | 'acordo_honorarios'
  | 'outros';

export type StatusAssinatura = 
  | 'rascunho' 
  | 'aguardando_assinaturas' 
  | 'parcialmente_assinado'
  | 'concluido' 
  | 'cancelado' 
  | 'expirado';

export type StatusAssinaturaIndividual = 
  | 'pendente' 
  | 'assinado' 
  | 'recusado' 
  | 'expirado';

export type TipoAssinante = 
  | 'cliente' 
  | 'advogado' 
  | 'testemunha' 
  | 'admin';

export type TipoTermo = 
  | 'termo_uso' 
  | 'politica_privacidade' 
  | 'consentimento_lgpd'
  | 'termo_servico'
  | 'cookies';

export type StatusTermo = 
  | 'pendente' 
  | 'aceito' 
  | 'rejeitado' 
  | 'revogado' 
  | 'expirado';

export type TipoConsentimento = 
  | 'dados_pessoais' 
  | 'dados_sensiveis' 
  | 'marketing' 
  | 'cookies_funcionais'
  | 'cookies_marketing' 
  | 'compartilhamento_dados'
  | 'tratamento_automatizado';

export type AcaoTermo = 
  | 'aceite' 
  | 'rejeicao' 
  | 'revogacao' 
  | 'visualizacao'
  | 'download';

export interface EstatisticasAssinatura {
  totalDocumentos: number;
  documentosPendentes: number;
  documentosAssinados: number;
  documentosCancelados: number;
  tempoMedioAssinatura: number; // em horas
  taxaAceite: number; // percentual
  termosLGPDAtivos: number;
  consentimentosRevogados: number;
}

export interface FiltroAssinatura {
  status?: StatusAssinatura[];
  tipoDocumento?: TipoDocumentoAssinatura[];
  dataInicio?: Date;
  dataFim?: Date;
  assinante?: string;
  busca?: string;
}

export interface VerificacaoIdentidade {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  usuarioEmail: string;
  tipoUsuario: 'cliente' | 'advogado';
  status: VerificacaoStatus;
  documentos: DocumentoVerificacao[];
  observacoes?: string;
  dataSubmissao: Date;
  dataAnalise?: Date;
  analisadoPor?: string;
  motivoRejeicao?: string;
}

export interface DocumentoVerificacao {
  id: string;
  tipo: TipoDocumentoVerificacao;
  nome: string;
  url: string;
  status: DocumentoStatus;
  observacoes?: string;
  dataUpload: Date;
}

export type VerificacaoStatus = 
  | 'pendente' 
  | 'em_analise' 
  | 'aprovado' 
  | 'rejeitado' 
  | 'documentos_pendentes';

export type DocumentoStatus = 
  | 'pendente' 
  | 'aprovado' 
  | 'rejeitado' 
  | 'requer_reenvio';

export type TipoDocumentoVerificacao = 
  | 'rg' 
  | 'cpf' 
  | 'cnpj' 
  | 'comprovante_residencia' 
  | 'comprovante_renda'
  | 'oab' 
  | 'foto_oab'
  | 'selfie_documento'
  | 'contrato_social'
  | 'procuracao';

export interface VerificacaoAdvogado extends VerificacaoIdentidade {
  numeroOAB: string;
  ufOAB: string;
  situacaoOAB: 'ativo' | 'suspenso' | 'cancelado';
  dataInscricaoOAB?: Date;
}

export interface VerificacaoCliente extends VerificacaoIdentidade {
  tipoPessoa: 'fisica' | 'juridica';
  documento: string; // CPF ou CNPJ
  telefoneVerificado: boolean;
  emailVerificado: boolean;
}

export interface EstatisticasVerificacao {
  totalPendentes: number;
  totalAprovados: number;
  totalRejeitados: number;
  totalEmAnalise: number;
  tempoMedioAnalise: number; // em horas
  advogadosPendentes: number;
  clientesPendentes: number;
}

export interface FiltroVerificacao {
  status?: VerificacaoStatus[];
  tipoUsuario?: ('cliente' | 'advogado')[];
  dataInicio?: Date;
  dataFim?: Date;
  busca?: string;
}


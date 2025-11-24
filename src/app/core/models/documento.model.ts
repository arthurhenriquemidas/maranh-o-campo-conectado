export interface Documento {
  id: string;
  nome: string;
  nomeOriginal: string;
  tipo: DocumentoTipo;
  categoria: DocumentoCategoria;
  tamanho: number;
  tamanhoFormatado: string;
  url: string;
  processoId: string;
  uploadedBy: {
    id: string;
    nome: string;
    tipo: 'cliente' | 'advogado' | 'admin' | 'sindicado';
  };
  dataUpload: Date;
  dataModificacao?: Date;
  versao: number;
  descricao?: string;
  tags: string[];
  publico: boolean; // Visível para cliente
  status: DocumentoStatus;
  checksum?: string;
}

export type DocumentoTipo = 
  | 'pdf' 
  | 'doc' 
  | 'docx' 
  | 'txt' 
  | 'jpg' 
  | 'jpeg' 
  | 'png' 
  | 'gif'
  | 'xls'
  | 'xlsx'
  | 'zip'
  | 'rar'
  | 'outros';

export type DocumentoCategoria = 
  | 'inicial'        // Documentos iniciais do cliente
  | 'identificacao'  // RG, CPF, CNH
  | 'comprovantes'   // Comprovantes diversos
  | 'contratos'      // Contratos e acordos
  | 'peticoes'       // Petições e documentos jurídicos
  | 'sentencas'      // Sentenças e decisões
  | 'evidencias'     // Provas e evidências
  | 'correspondencia' // E-mails e cartas
  | 'outros';

export type DocumentoStatus = 
  | 'processando'    // Upload em andamento
  | 'disponivel'     // Pronto para uso
  | 'aprovado'       // Aprovado pelo advogado
  | 'rejeitado'      // Rejeitado (problema no documento)
  | 'arquivado';     // Arquivado (não mais necessário)

export interface DocumentoUpload {
  arquivo: File;
  processoId: string;
  categoria: DocumentoCategoria;
  descricao?: string;
  tags?: string[];
  publico?: boolean;
}

export interface DocumentoFiltro {
  processoId?: string;
  categoria?: DocumentoCategoria;
  tipo?: DocumentoTipo;
  status?: DocumentoStatus;
  uploadedBy?: string;
  dataInicio?: Date;
  dataFim?: Date;
  busca?: string;
  apenasPublicos?: boolean;
}

export interface DocumentoEstatisticas {
  total: number;
  tamanhoTotal: number;
  tamanhoTotalFormatado: string;
  porTipo: { [key: string]: number };
  porCategoria: { [key: string]: number };
  porStatus: { [key: string]: number };
  uploadsRecentes: number;
  limitesUsados: {
    espaco: number; // Percentual usado
    quantidade: number; // Quantidade de arquivos
  };
}

export interface DocumentoPreview {
  id: string;
  url: string;
  tipo: DocumentoTipo;
  podeVisualizar: boolean;
  urlPreview?: string; // Para imagens e PDFs
}

export interface DocumentoHistorico {
  id: string;
  documentoId: string;
  acao: 'upload' | 'download' | 'visualizacao' | 'edicao' | 'exclusao' | 'aprovacao' | 'rejeicao';
  usuario: {
    id: string;
    nome: string;
    tipo: 'cliente' | 'advogado' | 'admin' | 'sindicado';
  };
  data: Date;
  detalhes?: string;
  ip?: string;
}

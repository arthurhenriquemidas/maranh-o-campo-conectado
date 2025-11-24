export interface BaseUser {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: 'ativo' | 'inativo' | 'pendente';
  dataCadastro: string;
}

export interface Cliente extends BaseUser {
  cpf?: string;
  cnpj?: string;
  tipo: 'PF' | 'PJ';
  verificado: boolean;
}

export interface Advogado extends BaseUser {
  oab: string;
  especialidades: string[];
  verificado: boolean;
  avaliacaoMedia: number;
  totalProcessos: number;
}

export interface Admin extends BaseUser {
  // Admin-specific properties can be added here
}

export interface Sindicado extends BaseUser {
  cnpj: string;
  razaoSocial: string;
  nomeResponsavel: string;
  tipo: 'cooperativa' | 'sindicato';
  verificado: boolean;
  advogadosVinculados?: string[]; // IDs dos advogados vinculados
  processosVinculados?: string[]; // IDs dos processos vinculados
  
  // Dados de endereço
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  
  // Dados adicionais
  dataFundacao?: string;
  numeroAssociados?: number;
  areaAtuacao?: string;
  observacoes?: string;
  
  // Dados jurídicos específicos
  registroSindical?: string;
  dataRegistroSindical?: string;
  orgaoRegistro?: string;
  representanteLegal?: string;
  cpfRepresentante?: string;
  cargoRepresentante?: string;
  emailRepresentante?: string;
  telefoneRepresentante?: string;
  
  // Documentos e anexos
  documentosComprobatorios?: DocumentoComprobatorio[];
  statusVerificacao?: 'pendente' | 'aprovado' | 'rejeitado';
  motivoRejeicao?: string;
  dataVerificacao?: string;
  verificadoPor?: string;
}

export interface DocumentoComprobatorio {
  id: string;
  nome: string;
  tipo: 'estatuto' | 'ata_constituicao' | 'cnpj' | 'alvara' | 'registro_mte' | 'certidao_fgts' | 'certidao_inss' | 'certidao_trabalhista' | 'balancete' | 'ata_assembleia' | 'regimento_interno' | 'comprovante_endereco' | 'outro';
  arquivo: string; // URL do arquivo
  tamanho: number;
  dataUpload: string;
  verificado: boolean;
  observacoes?: string;
  dataVencimento?: string; // Para documentos com validade
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';
  motivoRejeicao?: string;
  verificadoPor?: string;
  dataVerificacao?: string;
}

export type Usuario = Cliente | Advogado | Admin | Sindicado;

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  tipo: 'cliente' | 'advogado' | 'admin' | 'sindicado';
  token?: string;
  status?: 'ativo' | 'inativo' | 'pendente';
  dataCadastro?: string;
  verificado?: boolean;
  
  // Propriedades específicas do cliente
  cpf?: string;
  cnpj?: string;
  tipoCliente?: 'PF' | 'PJ';
  
  // Propriedades específicas do advogado
  oab?: string;
  especialidades?: string[];
  avaliacaoMedia?: number;
  totalProcessos?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  tipoUsuario: 'cliente' | 'advogado' | 'admin' | 'sindicado';
}

export interface RegisterData {
  nome?: string; // Opcional para advogados
  email: string;
  telefone: string;
  password: string;
  confirmPassword: string;
  tipoUsuario: 'cliente' | 'advogado' | 'sindicado';
  // Dados de endereço
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  // Cliente específico
  cpf?: string;
  cnpj?: string;
  razaoSocial?: string;
  nomeResponsavel?: string;
  tipo?: 'PF' | 'PJ';
  // Advogado específico
  oab?: string;
  especialidades?: string[];
  // Sindicado específico
  tipoSindicado?: 'cooperativa' | 'sindicato';
}

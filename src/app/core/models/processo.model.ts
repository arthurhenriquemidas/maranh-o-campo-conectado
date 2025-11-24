export interface Processo {
  id: string;
  titulo: string;
  descricao: string;
  tipo: ProcessoTipo;
  status: ProcessoStatus;
  clienteId: string;
  advogadoId: string | null;
  valor: number;
  dataCriacao: string;
  dataAtribuicao: string | null;
  dataConclusao?: string;
  prazoEstimado: string;
  urgencia: 'baixa' | 'media' | 'alta';
  documentosCount: number;
  mensagensCount: number;
  
  // Novas propriedades para configurações
  prioridade?: 'baixa' | 'normal' | 'alta' | 'critica';
  dataInicio?: string;
  dataLimite?: string;
  valorPretendido?: number;
  custosEnvolvidos?: number;
  honorarios?: number;
  localidade?: string;
  jurisdicao?: 'federal' | 'estadual' | 'municipal' | 'trabalhista' | 'eleitoral' | 'militar';
  tribunal?: string;
  observacoes?: string;
  instrucoes?: string;
}

export type ProcessoTipo = 'trabalhista' | 'civil' | 'criminal' | 'familia' | 'tributario' | 'empresarial';

export type ProcessoStatus = 'aberto' | 'em_andamento' | 'aguardando_cliente' | 'aguardando_aprovacao' | 'concluido' | 'arquivado' | 'rejeitado';

export interface ProcessoTipoOption {
  label: string;
  value: ProcessoTipo;
  icon: string;
}

export interface ProcessoStatusOption {
  label: string;
  value: ProcessoStatus;
  color: string;
}

export interface CreateProcessoData {
  titulo: string;
  descricao: string;
  tipo: ProcessoTipo;
  valor: number;
  prazoEstimado: string;
  urgencia: 'baixa' | 'media' | 'alta';
  clienteId: string;
}

export interface ProcessoDetalhes extends Processo {
  cliente?: {
    nome: string;
    email: string;
    telefone: string;
  };
  advogado?: {
    nome: string;
    email: string;
    oab: string;
    especialidades: string[];
  };
  atividades?: ProcessoAtividade[];
}

export interface ProcessoAtividade {
  id: string;
  processoId: string;
  tipo: 'criacao' | 'atribuicao' | 'mensagem' | 'documento' | 'status_change';
  descricao: string;
  usuarioId: string;
  usuarioNome: string;
  data: string;
  metadata?: any;
}

export interface ProcessoFiltros {
  status?: ProcessoStatus[];
  tipo?: ProcessoTipo[];
  urgencia?: ('baixa' | 'media' | 'alta')[];
  clienteId?: string;
  advogadoId?: string;
  dataInicio?: string;
  dataFim?: string;
  busca?: string;
}

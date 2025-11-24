export interface ChatMessage {
  id: string;
  processoId: string;
  remetente: {
    id: string;
    nome: string;
    tipo: 'cliente' | 'advogado' | 'admin' | 'sindicado';
    avatar?: string;
  };
  destinatario: {
    id: string;
    nome: string;
    tipo: 'cliente' | 'advogado' | 'admin' | 'sindicado';
  };
  conteudo: string;
  tipo: 'texto' | 'arquivo' | 'imagem' | 'sistema';
  dataEnvio: Date;
  dataLeitura?: Date;
  status: 'enviando' | 'enviado' | 'entregue' | 'lido';
  anexo?: {
    nome: string;
    url: string;
    tipo: string;
    tamanho: number;
  };
  editado?: boolean;
  dataEdicao?: Date;
}

export interface ChatConversation {
  id: string;
  processoId: string;
  participantes: ChatParticipant[];
  ultimaMensagem?: ChatMessage;
  totalMensagens: number;
  mensagensNaoLidas: number;
  ativo: boolean;
  dataCriacao: Date;
  dataUltimaAtividade: Date;
}

export interface ChatParticipant {
  id: string;
  nome: string;
  tipo: 'cliente' | 'advogado' | 'admin';
  avatar?: string;
  online: boolean;
  ultimaVezOnline?: Date;
}

export interface ChatNotification {
  id: string;
  processoId: string;
  remetente: string;
  conteudo: string;
  dataEnvio: Date;
  lida: boolean;
}

export interface TypingIndicator {
  usuarioId: string;
  usuarioNome: string;
  processoId: string;
  timestamp: Date;
}

export interface ChatStatus {
  online: boolean;
  digitando: boolean;
  ultimaVezOnline?: Date;
}

export interface SendMessageRequest {
  processoId: string;
  conteudo: string;
  tipo?: 'texto' | 'arquivo' | 'imagem';
  anexo?: {
    nome: string;
    dados: string; // base64 ou URL
    tipo: string;
    tamanho: number;
  };
}

export interface ChatFilter {
  processoId?: string;
  participanteId?: string;
  dataInicio?: Date;
  dataFim?: Date;
  tipo?: 'texto' | 'arquivo' | 'imagem' | 'sistema';
  apenasNaoLidas?: boolean;
}

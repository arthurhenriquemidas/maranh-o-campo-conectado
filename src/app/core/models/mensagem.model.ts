export interface Mensagem {
  id: string;
  processoId: string;
  remetenteId: string;
  remetenteTipo: 'cliente' | 'advogado' | 'admin';
  remetenteNome: string;
  conteudo: string;
  dataEnvio: string;
  lida: boolean;
  tipo: 'texto' | 'arquivo' | 'imagem';
  anexo?: {
    nome: string;
    url: string;
    tamanho: number;
    tipo: string;
  };
}

export interface Conversa {
  processoId: string;
  mensagens: Mensagem[];
  participantes: {
    cliente: {
      id: string;
      nome: string;
      avatar?: string;
    };
    advogado?: {
      id: string;
      nome: string;
      avatar?: string;
    };
  };
  ultimaMensagem?: Mensagem;
  mensagensNaoLidas: number;
}

export interface EnviarMensagemData {
  processoId: string;
  remetenteId: string;
  remetenteTipo: 'cliente' | 'advogado' | 'admin';
  conteudo: string;
  tipo?: 'texto' | 'arquivo' | 'imagem';
  anexo?: File;
}

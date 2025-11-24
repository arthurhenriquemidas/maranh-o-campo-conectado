/**
 * Constantes de strings utilizadas na aplicação
 * Centralizadas para facilitar manutenção e padronização
 */

export const STRINGS = {
  // Ações comuns
  ACTIONS: {
    SALVAR: 'Salvar',
    CANCELAR: 'Cancelar',
    EXCLUIR: 'Excluir',
    EDITAR: 'Editar',
    VISUALIZAR: 'Visualizar',
    CRIAR: 'Criar',
    BUSCAR: 'Buscar',
    FILTRAR: 'Filtrar',
    LIMPAR: 'Limpar',
    VOLTAR: 'Voltar',
    CONFIRMAR: 'Confirmar',
    FECHAR: 'Fechar',
    ENTRAR: 'Entrar',
    SAIR: 'Sair'
  },

  // Mensagens de status
  STATUS: {
    CARREGANDO: 'Carregando...',
    SALVANDO: 'Salvando...',
    SUCESSO: 'Sucesso',
    ERRO: 'Erro',
    AVISO: 'Aviso',
    INFORMACAO: 'Informação'
  },

  // Labels de formulário
  FORM: {
    CAMPO_OBRIGATORIO: 'Campo obrigatório',
    EMAIL: 'E-mail',
    SENHA: 'Senha',
    NOME: 'Nome',
    TELEFONE: 'Telefone',
    CPF: 'CPF',
    CNPJ: 'CNPJ',
    DESCRICAO: 'Descrição',
    TITULO: 'Título',
    TIPO: 'Tipo',
    SELECIONE_OPCAO: 'Selecione uma opção'
  },

  // Processos
  PROCESSOS: {
    TITULO: 'Processos',
    NOVO_PROCESSO: 'Novo Processo',
    CRIAR_PROCESSO: 'Criar Processo',
    TITULO_PROCESSO: 'Título do Processo',
    TIPO_PROCESSO: 'Tipo de Processo',
    DESCRICAO_SITUACAO: 'Descreva sua situação com suas próprias palavras...',
    EXEMPLO_TITULO: 'Ex: Rescisão trabalhista, Divórcio consensual...',
    DICA_DESCRICAO: 'Não se preocupe com termos jurídicos, descreva naturalmente sua situação.',
    NENHUM_PROCESSO: 'Nenhum processo encontrado',
    PROCESSO_CRIADO: 'Processo criado com sucesso!',
    PROCESSO_ATUALIZADO: 'Processo atualizado com sucesso!'
  },

  // Autenticação
  AUTH: {
    CRIAR_CONTA: 'Criar Conta',
    ESQUECEU_SENHA: 'Esqueceu sua senha?',
    LEMBRAR_ME: 'Lembrar de mim',
    VOLTAR_LOGIN: 'Voltar ao Login',
    TIPO_USUARIO: 'Tipo de usuário',
    SELECIONE_PERFIL: 'Selecione seu perfil',
    EMAIL_OBRIGATORIO: 'E-mail é obrigatório',
    SENHA_OBRIGATORIA: 'Senha é obrigatória',
    SELECIONE_TIPO_USUARIO: 'Selecione o tipo de usuário',
    EMAIL_INVALIDO: 'E-mail inválido',
    LOGIN_SUCESSO: 'Login realizado com sucesso!',
    LOGIN_ERRO: 'E-mail ou senha incorretos'
  },

  // Navegação
  NAV: {
    DASHBOARD: 'Dashboard',
    INICIO: 'Início',
    PAINEL: 'Painel',
    PROCESSOS: 'Processos',
    USUARIOS: 'Usuários',
    RELATORIOS: 'Relatórios',
    PERFIL: 'Perfil',
    CONFIGURACOES: 'Configurações',
    AJUDA: 'Passo a passo',
    CONTATO: 'Contato'
  },

  // Estados vazios
  EMPTY: {
    NENHUM_DADO: 'Nenhum dado encontrado',
    TENTAR_NOVAMENTE: 'Tentar novamente',
    CRIAR_PRIMEIRO: 'Criar o primeiro'
  },

  // Títulos de página
  TITLES: {
    BEM_VINDO: 'Bem-vindo',
    PLATAFORMA_JURIDICA: 'Plataforma Jurídica',
    ADMIN_LEGALTECH: 'Admin - 4Jus',
    CENTRAL_AJUDA: 'Passo a passo',
    PERGUNTAS_FREQUENTES: 'Perguntas Frequentes'
  },

  // Mensagens de desenvolvimento
  DEV: {
    EM_DESENVOLVIMENTO: 'Funcionalidade em Desenvolvimento',
    SERA_IMPLEMENTADO: 'será implementado em breve',
    USE_CREDENCIAIS_DEMO: 'Por enquanto, use as credenciais de demonstração para testar a plataforma.'
  }
};

// Tipos de processo padronizados
export const TIPOS_PROCESSO = [
  { label: 'Trabalhista', value: 'trabalhista' },
  { label: 'Civil', value: 'civil' },
  { label: 'Criminal', value: 'criminal' },
  { label: 'Família', value: 'familia' },
  { label: 'Tributário', value: 'tributario' },
  { label: 'Empresarial', value: 'empresarial' }
];

// Status de processo padronizados
export const STATUS_PROCESSO = {
  ABERTO: 'aberto',
  EM_ANDAMENTO: 'em_andamento',
  AGUARDANDO_CLIENTE: 'aguardando_cliente',
  CONCLUIDO: 'concluido',
  ARQUIVADO: 'arquivado'
};

// Labels dos status
export const STATUS_LABELS = {
  [STATUS_PROCESSO.ABERTO]: 'Aberto',
  [STATUS_PROCESSO.EM_ANDAMENTO]: 'Em Andamento',
  [STATUS_PROCESSO.AGUARDANDO_CLIENTE]: 'Aguardando Cliente',
  [STATUS_PROCESSO.CONCLUIDO]: 'Concluído',
  [STATUS_PROCESSO.ARQUIVADO]: 'Arquivado'
};

// Tipos de usuário
export const TIPOS_USUARIO = [
  { label: 'Cliente', value: 'cliente' },
  { label: 'Advogado', value: 'advogado' },
  { label: 'Administrador', value: 'admin' },
  { label: 'Sindicado/Cooperativa', value: 'sindicado' }
];

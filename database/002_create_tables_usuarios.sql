-- =====================================================
-- PLATAFORMA JURÍDICA - TABELAS DE USUÁRIOS
-- =====================================================
-- Descrição: Criação das tabelas de usuários e hierarquia
-- Versão: 1.0
-- Data: 2024
-- =====================================================

-- =====================================================
-- TABELA: usuarios (Tabela Pai)
-- =====================================================

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('cliente', 'advogado', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('ativo', 'inativo', 'pendente')),
    foto_perfil_url TEXT,
    
    -- Endereço
    cep VARCHAR(10),
    endereco VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    
    -- Controle e auditoria
    data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultimo_acesso TIMESTAMP WITH TIME ZONE,
    email_verificado BOOLEAN DEFAULT FALSE,
    data_verificacao_email TIMESTAMP WITH TIME ZONE,
    telefone_verificado BOOLEAN DEFAULT FALSE,
    
    -- Soft delete
    deletado BOOLEAN DEFAULT FALSE,
    data_delecao TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraints
    CONSTRAINT email_lowercase CHECK (email = LOWER(email)),
    CONSTRAINT email_valido CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT telefone_formato CHECK (telefone IS NULL OR telefone ~* '^\(\d{2}\) \d{4,5}-\d{4}$')
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email) WHERE deletado = FALSE;
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario) WHERE deletado = FALSE;
CREATE INDEX idx_usuarios_status ON usuarios(status) WHERE deletado = FALSE;
CREATE INDEX idx_usuarios_cadastro ON usuarios(data_cadastro DESC);
CREATE INDEX idx_usuarios_metadata ON usuarios USING GIN(metadata);

-- Comentários
COMMENT ON TABLE usuarios IS 'Tabela principal de usuários com herança por tipo';
COMMENT ON COLUMN usuarios.tipo_usuario IS 'Tipo: cliente, advogado, admin';
COMMENT ON COLUMN usuarios.metadata IS 'Dados flexíveis em formato JSON';

-- =====================================================
-- TABELA: clientes
-- =====================================================

CREATE TABLE clientes (
    id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    cpf VARCHAR(14) UNIQUE,
    cnpj VARCHAR(18) UNIQUE,
    tipo_pessoa VARCHAR(2) NOT NULL CHECK (tipo_pessoa IN ('PF', 'PJ')),
    razao_social VARCHAR(255),
    nome_responsavel VARCHAR(255),
    verificado BOOLEAN DEFAULT FALSE,
    data_verificacao TIMESTAMP WITH TIME ZONE,
    
    -- Informações adicionais PF
    data_nascimento DATE,
    profissao VARCHAR(100),
    estado_civil VARCHAR(50),
    rg VARCHAR(20),
    orgao_expedidor VARCHAR(10),
    
    -- Controle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT cpf_cnpj_check CHECK (
        (tipo_pessoa = 'PF' AND cpf IS NOT NULL AND cnpj IS NULL) OR
        (tipo_pessoa = 'PJ' AND cnpj IS NOT NULL AND cpf IS NULL)
    ),
    CONSTRAINT cpf_formato CHECK (cpf IS NULL OR cpf ~* '^\d{3}\.\d{3}\.\d{3}-\d{2}$'),
    CONSTRAINT cnpj_formato CHECK (cnpj IS NULL OR cnpj ~* '^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$')
);

CREATE INDEX idx_clientes_cpf ON clientes(cpf) WHERE cpf IS NOT NULL;
CREATE INDEX idx_clientes_cnpj ON clientes(cnpj) WHERE cnpj IS NOT NULL;
CREATE INDEX idx_clientes_verificado ON clientes(verificado);

COMMENT ON TABLE clientes IS 'Dados específicos de clientes (PF ou PJ)';
COMMENT ON CONSTRAINT cpf_cnpj_check ON clientes IS 'Garante que PF tem CPF e PJ tem CNPJ';

-- =====================================================
-- TABELA: advogados
-- =====================================================

CREATE TABLE advogados (
    id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    numero_oab VARCHAR(20) NOT NULL,
    uf_oab VARCHAR(2) NOT NULL,
    situacao_oab VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (situacao_oab IN ('ativo', 'suspenso', 'cancelado')),
    data_inscricao_oab DATE,
    especialidades TEXT[],
    verificado BOOLEAN DEFAULT FALSE,
    data_verificacao TIMESTAMP WITH TIME ZONE,
    verificado_por UUID REFERENCES usuarios(id),
    
    -- Avaliações e métricas
    avaliacao_media DECIMAL(3, 2) DEFAULT 0.0 CHECK (avaliacao_media >= 0 AND avaliacao_media <= 5),
    total_avaliacoes INTEGER DEFAULT 0,
    total_processos INTEGER DEFAULT 0,
    processos_ativos INTEGER DEFAULT 0,
    
    -- Disponibilidade
    disponivel_novos_casos BOOLEAN DEFAULT TRUE,
    capacidade_maxima_processos INTEGER DEFAULT 50,
    
    -- Informações profissionais
    biografia TEXT,
    formacao_academica JSONB DEFAULT '[]'::jsonb,
    experiencia_anos INTEGER,
    areas_atuacao TEXT[],
    
    -- Dados bancários
    banco VARCHAR(100),
    agencia VARCHAR(10),
    conta VARCHAR(20),
    tipo_conta VARCHAR(20) CHECK (tipo_conta IN ('corrente', 'poupanca')),
    pix_chave VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT oab_unica UNIQUE (numero_oab, uf_oab)
);

CREATE INDEX idx_advogados_oab ON advogados(numero_oab, uf_oab);
CREATE INDEX idx_advogados_verificado ON advogados(verificado);
CREATE INDEX idx_advogados_disponivel ON advogados(disponivel_novos_casos) WHERE disponivel_novos_casos = TRUE;
CREATE INDEX idx_advogados_especialidades ON advogados USING GIN(especialidades);
CREATE INDEX idx_advogados_areas_atuacao ON advogados USING GIN(areas_atuacao);

COMMENT ON TABLE advogados IS 'Dados específicos de advogados';
COMMENT ON COLUMN advogados.especialidades IS 'Array de especialidades jurídicas';
COMMENT ON COLUMN advogados.formacao_academica IS 'Array JSON com formações acadêmicas';

-- =====================================================
-- TABELA: admins
-- =====================================================

CREATE TABLE admins (
    id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    nivel_permissao VARCHAR(20) NOT NULL DEFAULT 'operador' CHECK (nivel_permissao IN ('super_admin', 'admin', 'operador', 'suporte')),
    departamento VARCHAR(100),
    cargo VARCHAR(100),
    permissoes JSONB DEFAULT '{}'::jsonb,
    
    -- Auditoria de ações
    total_acoes_realizadas INTEGER DEFAULT 0,
    ultima_acao_data TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admins_nivel ON admins(nivel_permissao);
CREATE INDEX idx_admins_permissoes ON admins USING GIN(permissoes);

COMMENT ON TABLE admins IS 'Administradores da plataforma';
COMMENT ON COLUMN admins.permissoes IS 'JSON com permissões granulares';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para atualizar updated_at
CREATE TRIGGER set_timestamp_clientes
BEFORE UPDATE ON clientes
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_advogados
BEFORE UPDATE ON advogados
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_admins
BEFORE UPDATE ON admins
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================


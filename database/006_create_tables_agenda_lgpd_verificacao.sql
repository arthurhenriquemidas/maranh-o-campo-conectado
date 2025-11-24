-- =====================================================
-- PLATAFORMA JURÍDICA - LGPD E VERIFICAÇÃO
-- =====================================================
-- Descrição: Tabelas de LGPD e verificação de identidade
-- Versão: 1.0
-- Data: 2024
-- =====================================================

-- =====================================================
-- TABELA: termos_lgpd
-- =====================================================

CREATE TABLE termos_lgpd (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Usuário
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    usuario_nome VARCHAR(255) NOT NULL,
    usuario_email VARCHAR(255) NOT NULL,
    
    -- Versão do termo
    versao_termo VARCHAR(20) NOT NULL,
    tipo_termo VARCHAR(30) NOT NULL CHECK (tipo_termo IN ('termo_uso', 'politica_privacidade', 'consentimento_lgpd', 'termo_servico', 'cookies')),
    hash_termo VARCHAR(64) NOT NULL,
    
    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceito', 'rejeitado', 'revogado', 'expirado')),
    
    -- Datas
    data_aceite TIMESTAMP WITH TIME ZONE,
    data_expiracao TIMESTAMP WITH TIME ZONE,
    data_revogacao TIMESTAMP WITH TIME ZONE,
    
    -- Dados do aceite
    ip_aceite INET,
    user_agent_aceite TEXT,
    
    -- Observações
    observacoes TEXT,
    motivo_revogacao TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_termos_usuario ON termos_lgpd(usuario_id);
CREATE INDEX idx_termos_tipo ON termos_lgpd(tipo_termo);
CREATE INDEX idx_termos_status ON termos_lgpd(status);
CREATE INDEX idx_termos_versao ON termos_lgpd(versao_termo);
CREATE INDEX idx_termos_aceite ON termos_lgpd(data_aceite DESC);

COMMENT ON TABLE termos_lgpd IS 'Registro de aceite de termos conforme LGPD';

-- =====================================================
-- TABELA: consentimentos_lgpd
-- =====================================================

CREATE TABLE consentimentos_lgpd (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    termo_lgpd_id UUID NOT NULL REFERENCES termos_lgpd(id) ON DELETE CASCADE,
    
    -- Tipo de consentimento
    tipo_consentimento VARCHAR(50) NOT NULL CHECK (tipo_consentimento IN ('dados_pessoais', 'dados_sensiveis', 'marketing', 'cookies_funcionais', 'cookies_marketing', 'compartilhamento_dados', 'tratamento_automatizado')),
    descricao TEXT NOT NULL,
    
    -- Status
    obrigatorio BOOLEAN DEFAULT FALSE,
    aceito BOOLEAN DEFAULT FALSE,
    
    -- Datas
    data_aceite TIMESTAMP WITH TIME ZONE,
    data_revogacao TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_consentimentos_termo ON consentimentos_lgpd(termo_lgpd_id);
CREATE INDEX idx_consentimentos_tipo ON consentimentos_lgpd(tipo_consentimento);
CREATE INDEX idx_consentimentos_aceito ON consentimentos_lgpd(aceito);

COMMENT ON TABLE consentimentos_lgpd IS 'Consentimentos granulares conforme LGPD';

-- =====================================================
-- TABELA: log_termos_lgpd
-- =====================================================

CREATE TABLE log_termos_lgpd (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    termo_lgpd_id UUID NOT NULL REFERENCES termos_lgpd(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    
    -- Ação
    acao VARCHAR(30) NOT NULL CHECK (acao IN ('aceite', 'rejeicao', 'revogacao', 'visualizacao', 'download')),
    
    -- Dados
    data_acao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ip_origem INET,
    user_agent TEXT,
    detalhes TEXT
);

CREATE INDEX idx_log_termos_termo ON log_termos_lgpd(termo_lgpd_id, data_acao DESC);
CREATE INDEX idx_log_termos_usuario ON log_termos_lgpd(usuario_id);
CREATE INDEX idx_log_termos_acao ON log_termos_lgpd(acao);
CREATE INDEX idx_log_termos_data ON log_termos_lgpd(data_acao DESC);

COMMENT ON TABLE log_termos_lgpd IS 'Auditoria de ações relacionadas a termos LGPD';

-- =====================================================
-- TABELA: verificacao_identidade
-- =====================================================

CREATE TABLE verificacao_identidade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Usuário
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    usuario_nome VARCHAR(255) NOT NULL,
    usuario_email VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('cliente', 'advogado')),
    
    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'aprovado', 'rejeitado', 'documentos_pendentes')),
    
    -- Informações específicas (advogados)
    numero_oab VARCHAR(20),
    uf_oab VARCHAR(2),
    situacao_oab VARCHAR(20),
    data_inscricao_oab DATE,
    
    -- Informações específicas (clientes)
    tipo_pessoa VARCHAR(2) CHECK (tipo_pessoa IN ('PF', 'PJ')),
    documento VARCHAR(18),
    telefone_verificado BOOLEAN DEFAULT FALSE,
    email_verificado BOOLEAN DEFAULT FALSE,
    
    -- Análise
    analisado_por UUID REFERENCES usuarios(id),
    data_submissao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    data_analise TIMESTAMP WITH TIME ZONE,
    
    -- Observações
    observacoes TEXT,
    motivo_rejeicao TEXT,
    
    -- Metadados
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_verificacao_usuario ON verificacao_identidade(usuario_id);
CREATE INDEX idx_verificacao_status ON verificacao_identidade(status);
CREATE INDEX idx_verificacao_tipo ON verificacao_identidade(tipo_usuario);
CREATE INDEX idx_verificacao_analisado ON verificacao_identidade(analisado_por);
CREATE INDEX idx_verificacao_pendentes ON verificacao_identidade(status) WHERE status IN ('pendente', 'em_analise');

COMMENT ON TABLE verificacao_identidade IS 'Processo de verificação de identidade de usuários';

-- =====================================================
-- TABELA: documentos_verificacao
-- =====================================================

CREATE TABLE documentos_verificacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verificacao_id UUID NOT NULL REFERENCES verificacao_identidade(id) ON DELETE CASCADE,
    
    -- Tipo de documento
    tipo_documento VARCHAR(50) NOT NULL CHECK (tipo_documento IN ('rg', 'cpf', 'cnpj', 'comprovante_residencia', 'comprovante_renda', 'oab', 'foto_oab', 'selfie_documento', 'contrato_social', 'procuracao')),
    
    -- Arquivo
    nome VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    tamanho_bytes BIGINT,
    
    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'requer_reenvio')),
    
    -- Análise
    data_upload TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    data_analise TIMESTAMP WITH TIME ZONE,
    observacoes TEXT,
    motivo_rejeicao TEXT
);

CREATE INDEX idx_doc_verificacao_verificacao ON documentos_verificacao(verificacao_id);
CREATE INDEX idx_doc_verificacao_tipo ON documentos_verificacao(tipo_documento);
CREATE INDEX idx_doc_verificacao_status ON documentos_verificacao(status);

COMMENT ON TABLE documentos_verificacao IS 'Documentos para verificação de identidade';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================


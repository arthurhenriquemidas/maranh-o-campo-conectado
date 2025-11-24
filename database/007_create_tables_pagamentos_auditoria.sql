-- =====================================================
-- PLATAFORMA JURÍDICA - PAGAMENTOS E AUDITORIA
-- =====================================================
-- Descrição: Tabelas de pagamentos, auditoria e configurações
-- Versão: 1.0
-- Data: 2024
-- =====================================================

-- =====================================================
-- TABELA: pagamentos
-- =====================================================

CREATE TABLE pagamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    processo_id UUID NOT NULL REFERENCES processos(id) ON DELETE RESTRICT,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    advogado_id UUID NOT NULL REFERENCES advogados(id) ON DELETE RESTRICT,
    
    -- Tipo e valor
    tipo_pagamento VARCHAR(50) NOT NULL CHECK (tipo_pagamento IN ('honorarios', 'custas', 'taxas', 'despesas', 'pericia', 'reembolso')),
    valor DECIMAL(15, 2) NOT NULL CHECK (valor > 0),
    descricao TEXT,
    
    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'processando', 'aprovado', 'pago', 'cancelado', 'estornado', 'falhado')),
    
    -- Método de pagamento
    metodo_pagamento VARCHAR(50) CHECK (metodo_pagamento IN ('cartao_credito', 'cartao_debito', 'boleto', 'pix', 'transferencia', 'dinheiro')),
    
    -- Dados da transação
    transacao_id VARCHAR(255),
    gateway VARCHAR(50),
    
    -- Datas
    data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    data_vencimento TIMESTAMP WITH TIME ZONE,
    data_pagamento TIMESTAMP WITH TIME ZONE,
    data_cancelamento TIMESTAMP WITH TIME ZONE,
    
    -- Informações adicionais
    comprovante_url TEXT,
    nota_fiscal_url TEXT,
    observacoes TEXT,
    motivo_cancelamento TEXT,
    
    -- Parcelamento
    parcelado BOOLEAN DEFAULT FALSE,
    numero_parcelas INTEGER DEFAULT 1,
    parcela_atual INTEGER DEFAULT 1,
    pagamento_pai_id UUID REFERENCES pagamentos(id),
    
    -- Metadados
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_pagamentos_processo ON pagamentos(processo_id);
CREATE INDEX idx_pagamentos_cliente ON pagamentos(cliente_id);
CREATE INDEX idx_pagamentos_advogado ON pagamentos(advogado_id);
CREATE INDEX idx_pagamentos_status ON pagamentos(status);
CREATE INDEX idx_pagamentos_vencimento ON pagamentos(data_vencimento) WHERE status = 'pendente';
CREATE INDEX idx_pagamentos_transacao ON pagamentos(transacao_id) WHERE transacao_id IS NOT NULL;
CREATE INDEX idx_pagamentos_data ON pagamentos(data_criacao DESC);

COMMENT ON TABLE pagamentos IS 'Gestão de pagamentos e honorários';

-- =====================================================
-- TABELA: auditoria
-- =====================================================

CREATE TABLE auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Usuário
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    usuario_nome VARCHAR(255),
    usuario_tipo VARCHAR(20),
    
    -- Ação
    acao VARCHAR(100) NOT NULL,
    entidade VARCHAR(100) NOT NULL,
    entidade_id UUID,
    
    -- Detalhes
    descricao TEXT,
    dados_anteriores JSONB,
    dados_novos JSONB,
    
    -- Contexto
    ip_address INET,
    user_agent TEXT,
    endpoint TEXT,
    metodo_http VARCHAR(10),
    
    -- Data
    data_acao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Severidade
    nivel VARCHAR(20) CHECK (nivel IN ('info', 'warning', 'error', 'critical'))
);

CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id, data_acao DESC);
CREATE INDEX idx_auditoria_entidade ON auditoria(entidade, entidade_id);
CREATE INDEX idx_auditoria_acao ON auditoria(acao);
CREATE INDEX idx_auditoria_data ON auditoria(data_acao DESC);
CREATE INDEX idx_auditoria_ip ON auditoria(ip_address);

COMMENT ON TABLE auditoria IS 'Log de auditoria geral do sistema';

-- =====================================================
-- TABELA: configuracoes_sistema
-- =====================================================

CREATE TABLE configuracoes_sistema (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave VARCHAR(255) NOT NULL UNIQUE,
    valor TEXT,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('string', 'number', 'boolean', 'json', 'array')),
    descricao TEXT,
    categoria VARCHAR(100),
    
    -- Controle
    editavel BOOLEAN DEFAULT TRUE,
    visivel_interface BOOLEAN DEFAULT FALSE,
    
    -- Auditoria
    criado_por UUID REFERENCES usuarios(id),
    atualizado_por UUID REFERENCES usuarios(id),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_config_chave ON configuracoes_sistema(chave);
CREATE INDEX idx_config_categoria ON configuracoes_sistema(categoria);

COMMENT ON TABLE configuracoes_sistema IS 'Configurações gerais da plataforma';

-- =====================================================
-- FUNÇÃO: Registrar ação na auditoria
-- =====================================================

CREATE OR REPLACE FUNCTION registrar_auditoria(
    p_usuario_id UUID,
    p_acao VARCHAR,
    p_entidade VARCHAR,
    p_entidade_id UUID DEFAULT NULL,
    p_descricao TEXT DEFAULT NULL,
    p_dados_anteriores JSONB DEFAULT NULL,
    p_dados_novos JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_nivel VARCHAR DEFAULT 'info'
)
RETURNS UUID AS $$
DECLARE
    v_auditoria_id UUID;
    v_usuario_nome VARCHAR(255);
    v_usuario_tipo VARCHAR(20);
BEGIN
    -- Buscar nome e tipo do usuário
    SELECT nome, tipo_usuario INTO v_usuario_nome, v_usuario_tipo
    FROM usuarios WHERE id = p_usuario_id;
    
    -- Inserir log
    INSERT INTO auditoria (
        usuario_id, usuario_nome, usuario_tipo, acao, entidade, entidade_id,
        descricao, dados_anteriores, dados_novos, ip_address, nivel
    ) VALUES (
        p_usuario_id, v_usuario_nome, v_usuario_tipo, p_acao, p_entidade, p_entidade_id,
        p_descricao, p_dados_anteriores, p_dados_novos, p_ip_address, p_nivel
    ) RETURNING id INTO v_auditoria_id;
    
    RETURN v_auditoria_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION registrar_auditoria IS 'Registra ação na tabela de auditoria';

-- =====================================================
-- FUNÇÃO: Limpar dados antigos
-- =====================================================

CREATE OR REPLACE FUNCTION limpar_dados_antigos()
RETURNS INTEGER AS $$
DECLARE
    v_rows_deleted INTEGER := 0;
BEGIN
    -- Deletar notificações expiradas
    DELETE FROM notificacoes 
    WHERE expira_em IS NOT NULL AND expira_em < NOW();
    
    GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
    
    -- Log da operação
    INSERT INTO auditoria (acao, entidade, descricao, nivel)
    VALUES ('limpeza_automatica', 'notificacoes', 
            'Removidas ' || v_rows_deleted || ' notificações expiradas', 'info');
    
    RETURN v_rows_deleted;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION limpar_dados_antigos IS 'Remove dados expirados automaticamente';

-- =====================================================
-- FUNÇÃO: Buscar processos com filtros
-- =====================================================

CREATE OR REPLACE FUNCTION buscar_processos(
    p_cliente_id UUID DEFAULT NULL,
    p_advogado_id UUID DEFAULT NULL,
    p_status TEXT[] DEFAULT NULL,
    p_tipo TEXT[] DEFAULT NULL,
    p_busca TEXT DEFAULT NULL,
    p_limite INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    titulo VARCHAR,
    tipo VARCHAR,
    status VARCHAR,
    data_criacao TIMESTAMP WITH TIME ZONE,
    cliente_nome VARCHAR,
    advogado_nome VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.titulo,
        p.tipo,
        p.status,
        p.data_criacao,
        uc.nome as cliente_nome,
        ua.nome as advogado_nome
    FROM processos p
    INNER JOIN clientes c ON p.cliente_id = c.id
    INNER JOIN usuarios uc ON c.id = uc.id
    LEFT JOIN advogados a ON p.advogado_id = a.id
    LEFT JOIN usuarios ua ON a.id = ua.id
    WHERE 
        p.deletado = FALSE
        AND (p_cliente_id IS NULL OR p.cliente_id = p_cliente_id)
        AND (p_advogado_id IS NULL OR p.advogado_id = p_advogado_id)
        AND (p_status IS NULL OR p.status = ANY(p_status))
        AND (p_tipo IS NULL OR p.tipo = ANY(p_tipo))
        AND (p_busca IS NULL OR 
             to_tsvector('portuguese', p.titulo || ' ' || p.descricao) @@ plainto_tsquery('portuguese', p_busca))
    ORDER BY p.data_criacao DESC
    LIMIT p_limite
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION buscar_processos IS 'Busca processos com múltiplos filtros';

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER set_timestamp_configuracoes
BEFORE UPDATE ON configuracoes_sistema
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================


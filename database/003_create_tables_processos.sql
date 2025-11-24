-- =====================================================
-- PLATAFORMA JURÍDICA - TABELAS DE PROCESSOS
-- =====================================================
-- Descrição: Criação das tabelas de processos e atividades
-- Versão: 1.0
-- Data: 2024
-- =====================================================

-- =====================================================
-- TABELA: processos
-- =====================================================

CREATE TABLE processos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_processo VARCHAR(50) UNIQUE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    
    -- Tipo e status
    tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('trabalhista', 'civil', 'criminal', 'familia', 'tributario', 'empresarial')),
    status VARCHAR(30) NOT NULL DEFAULT 'cadastro_pendente' CHECK (status IN ('cadastro_pendente', 'aberto', 'em_andamento', 'aguardando_cliente', 'aguardando_aprovacao', 'concluido', 'arquivado', 'rejeitado')),
    
    -- Relacionamentos
    cliente_id UUID REFERENCES clientes(id) ON DELETE RESTRICT, -- NULL para cadastro rápido
    advogado_id UUID REFERENCES advogados(id) ON DELETE SET NULL, -- Advogado principal (pode ser NULL se múltiplos)
    criado_por UUID REFERENCES usuarios(id), -- NULL quando cliente ainda não está cadastrado
    
    -- Dados temporários do cliente (para cadastro rápido)
    cliente_temp_nome VARCHAR(255) NOT NULL, -- Nome temporário até criar o cliente
    cliente_temp_email VARCHAR(255) NOT NULL, -- Email usado para cadastro
    cliente_temp_telefone VARCHAR(20),
    cliente_temp_cpf_cnpj VARCHAR(18) NOT NULL, -- CPF ou CNPJ sem formatação
    cliente_temp_tipo_pessoa VARCHAR(2) NOT NULL CHECK (cliente_temp_tipo_pessoa IN ('PF', 'PJ')),
    
    -- Rastreamento de sessão (para vincular após cadastro)
    sessao_token VARCHAR(255), -- Token único para vincular processo ao cliente após cadastro
    sessao_ip INET, -- IP de origem do cadastro rápido
    
    -- Valores e custos
    valor_causa DECIMAL(15, 2),
    valor_pretendido DECIMAL(15, 2),
    custos_envolvidos DECIMAL(15, 2) DEFAULT 0,
    honorarios DECIMAL(15, 2),
    forma_pagamento_honorarios VARCHAR(50),
    
    -- Datas
    data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    data_atribuicao TIMESTAMP WITH TIME ZONE,
    data_inicio TIMESTAMP WITH TIME ZONE,
    data_limite TIMESTAMP WITH TIME ZONE,
    prazo_estimado TIMESTAMP WITH TIME ZONE,
    data_conclusao TIMESTAMP WITH TIME ZONE,
    
    -- Prioridade e urgência
    urgencia VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (urgencia IN ('baixa', 'media', 'alta')),
    prioridade VARCHAR(20) DEFAULT 'normal' CHECK (prioridade IN ('baixa', 'normal', 'alta', 'critica')),
    
    -- Jurisdição
    jurisdicao VARCHAR(30) CHECK (jurisdicao IN ('federal', 'estadual', 'municipal', 'trabalhista', 'eleitoral', 'militar')),
    tribunal VARCHAR(255),
    comarca VARCHAR(100),
    vara VARCHAR(100),
    localidade VARCHAR(255),
    
    -- Contadores
    documentos_count INTEGER DEFAULT 0,
    mensagens_count INTEGER DEFAULT 0,
    mensagens_nao_lidas INTEGER DEFAULT 0,
    atividades_count INTEGER DEFAULT 0,
    
    -- Informações adicionais
    observacoes TEXT,
    instrucoes TEXT,
    tags TEXT[],
    
    -- Controle
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deletado BOOLEAN DEFAULT FALSE,
    data_delecao TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraint: Deve ter cliente_id OU dados temporários completos
    CONSTRAINT cliente_obrigatorio CHECK (
        cliente_id IS NOT NULL OR 
        (cliente_temp_nome IS NOT NULL AND 
         cliente_temp_email IS NOT NULL AND 
         cliente_temp_cpf_cnpj IS NOT NULL AND 
         cliente_temp_tipo_pessoa IS NOT NULL)
    ),
    -- Constraint: Se tem cliente_id, não deve ter dados temporários
    CONSTRAINT cliente_ou_temp CHECK (
        (cliente_id IS NULL) OR 
        (cliente_id IS NOT NULL AND cliente_temp_nome IS NULL)
    )
);

-- Índices
CREATE INDEX idx_processos_cliente ON processos(cliente_id) WHERE deletado = FALSE AND cliente_id IS NOT NULL;
CREATE INDEX idx_processos_advogado ON processos(advogado_id) WHERE deletado = FALSE;
CREATE INDEX idx_processos_status ON processos(status) WHERE deletado = FALSE;
CREATE INDEX idx_processos_tipo ON processos(tipo) WHERE deletado = FALSE;
CREATE INDEX idx_processos_urgencia ON processos(urgencia) WHERE deletado = FALSE;
CREATE INDEX idx_processos_criacao ON processos(data_criacao DESC);
CREATE INDEX idx_processos_prazo ON processos(prazo_estimado) WHERE status NOT IN ('concluido', 'arquivado');
CREATE INDEX idx_processos_tags ON processos USING GIN(tags);
CREATE INDEX idx_processos_metadata ON processos USING GIN(metadata);
CREATE INDEX idx_processos_busca ON processos USING GIN(to_tsvector('portuguese', titulo || ' ' || COALESCE(descricao, '')));
CREATE INDEX idx_processos_cadastro_pendente ON processos(status) WHERE status = 'cadastro_pendente' AND deletado = FALSE;
CREATE INDEX idx_processos_sem_cliente ON processos(data_criacao) WHERE cliente_id IS NULL AND deletado = FALSE;
CREATE INDEX idx_processos_sessao_token ON processos(sessao_token) WHERE sessao_token IS NOT NULL;
CREATE INDEX idx_processos_temp_email ON processos(cliente_temp_email) WHERE cliente_id IS NULL;
CREATE INDEX idx_processos_temp_cpf_cnpj ON processos(cliente_temp_cpf_cnpj) WHERE cliente_id IS NULL;

COMMENT ON TABLE processos IS 'Processos jurídicos da plataforma - suporta cadastro rápido pelo cliente';
COMMENT ON COLUMN processos.cliente_id IS 'ID do cliente - NULL quando processo criado antes do cadastro do cliente';
COMMENT ON COLUMN processos.criado_por IS 'ID do usuário que criou - NULL quando cliente ainda não está cadastrado';
COMMENT ON COLUMN processos.cliente_temp_nome IS 'Nome temporário do cliente para cadastro rápido';
COMMENT ON COLUMN processos.cliente_temp_email IS 'Email usado para vincular processo após cadastro';
COMMENT ON COLUMN processos.sessao_token IS 'Token único para vincular processo ao cliente após cadastro via email';
COMMENT ON COLUMN processos.status IS 'Status - cadastro_pendente quando aguarda conclusão do cadastro do cliente';
COMMENT ON COLUMN processos.tags IS 'Array de tags para categorização';
COMMENT ON INDEX idx_processos_busca IS 'Índice full-text search em português';

-- =====================================================
-- TABELA: processo_atividades
-- =====================================================

CREATE TABLE processo_atividades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    processo_id UUID NOT NULL REFERENCES processos(id) ON DELETE CASCADE,
    
    -- Tipo de atividade
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('criacao', 'atribuicao', 'mensagem', 'documento', 'status_change', 'comentario', 'prazo', 'audiencia', 'sentenca', 'recurso')),
    
    -- Dados da atividade
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    
    -- Usuário responsável
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    usuario_nome VARCHAR(255) NOT NULL,
    usuario_tipo VARCHAR(20) NOT NULL,
    
    -- Metadados
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Controle
    data_atividade TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    visivel_cliente BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_atividades_processo ON processo_atividades(processo_id, data_atividade DESC);
CREATE INDEX idx_atividades_tipo ON processo_atividades(tipo);
CREATE INDEX idx_atividades_usuario ON processo_atividades(usuario_id);
CREATE INDEX idx_atividades_data ON processo_atividades(data_atividade DESC);
CREATE INDEX idx_atividades_metadata ON processo_atividades USING GIN(metadata);

COMMENT ON TABLE processo_atividades IS 'Timeline de atividades do processo';
COMMENT ON COLUMN processo_atividades.visivel_cliente IS 'Define se cliente pode ver esta atividade';

-- =====================================================
-- TABELA: avaliacoes
-- =====================================================

CREATE TABLE avaliacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    processo_id UUID NOT NULL REFERENCES processos(id) ON DELETE CASCADE,
    advogado_id UUID NOT NULL REFERENCES advogados(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    
    -- Avaliação
    nota DECIMAL(3, 2) NOT NULL CHECK (nota >= 0 AND nota <= 5),
    
    -- Critérios específicos
    comunicacao INTEGER CHECK (comunicacao >= 1 AND comunicacao <= 5),
    conhecimento_tecnico INTEGER CHECK (conhecimento_tecnico >= 1 AND conhecimento_tecnico <= 5),
    prazo INTEGER CHECK (prazo >= 1 AND prazo <= 5),
    atendimento INTEGER CHECK (atendimento >= 1 AND atendimento <= 5),
    
    -- Comentário
    comentario TEXT,
    pontos_positivos TEXT,
    pontos_melhoria TEXT,
    
    -- Recomendação
    recomendaria BOOLEAN,
    
    -- Status
    aprovado BOOLEAN DEFAULT TRUE,
    publico BOOLEAN DEFAULT TRUE,
    
    -- Resposta do advogado
    resposta_advogado TEXT,
    data_resposta TIMESTAMP WITH TIME ZONE,
    
    -- Data
    data_avaliacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT avaliacao_unica UNIQUE (processo_id, cliente_id)
);

CREATE INDEX idx_avaliacoes_advogado ON avaliacoes(advogado_id) WHERE aprovado = TRUE;
CREATE INDEX idx_avaliacoes_processo ON avaliacoes(processo_id);
CREATE INDEX idx_avaliacoes_cliente ON avaliacoes(cliente_id);
CREATE INDEX idx_avaliacoes_nota ON avaliacoes(nota DESC);
CREATE INDEX idx_avaliacoes_data ON avaliacoes(data_avaliacao DESC);
CREATE INDEX idx_avaliacoes_publicas ON avaliacoes(advogado_id) WHERE publico = TRUE AND aprovado = TRUE;

COMMENT ON TABLE avaliacoes IS 'Avaliações de advogados por clientes';

-- =====================================================
-- TABELA: processo_advogados (N:N - múltiplos advogados por processo)
-- =====================================================

CREATE TABLE processo_advogados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    processo_id UUID NOT NULL REFERENCES processos(id) ON DELETE CASCADE,
    advogado_id UUID NOT NULL REFERENCES advogados(id) ON DELETE CASCADE,
    
    -- Status da atribuição/aprovação
    status VARCHAR(30) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'proposta_enviada', 'aguardando_aprovacao_cliente', 'aprovado_cliente', 'rejeitado_cliente', 'aceito', 'recusado_advogado', 'cancelado')),
    
    -- Quem atribuiu
    atribuido_por UUID REFERENCES usuarios(id), -- Admin ou cliente
    atribuido_por_nome VARCHAR(255),
    atribuido_por_tipo VARCHAR(20),
    data_atribuicao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Aprovação do cliente
    aprovado_por_cliente BOOLEAN DEFAULT FALSE,
    data_aprovacao_cliente TIMESTAMP WITH TIME ZONE,
    data_rejeicao_cliente TIMESTAMP WITH TIME ZONE,
    motivo_rejeicao_cliente TEXT,
    
    -- Aceite do advogado
    aceito_por_advogado BOOLEAN DEFAULT FALSE,
    data_aceite_advogado TIMESTAMP WITH TIME ZONE,
    data_recusa_advogado TIMESTAMP WITH TIME ZONE,
    motivo_recusa_advogado TEXT,
    
    -- Flag para advogado principal (caso múltiplos)
    principal BOOLEAN DEFAULT FALSE,
    
    -- Observações
    observacoes TEXT,
    
    -- Controle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT processo_advogado_unico UNIQUE (processo_id, advogado_id)
);

CREATE INDEX idx_proc_adv_processo ON processo_advogados(processo_id);
CREATE INDEX idx_proc_adv_advogado ON processo_advogados(advogado_id);
CREATE INDEX idx_proc_adv_status ON processo_advogados(status);
CREATE INDEX idx_proc_adv_aprovacao ON processo_advogados(processo_id) WHERE status IN ('aguardando_aprovacao_cliente', 'proposta_enviada');
CREATE INDEX idx_proc_adv_principal ON processo_advogados(processo_id, principal) WHERE principal = TRUE;
CREATE INDEX idx_proc_adv_aceito ON processo_advogados(processo_id) WHERE aceito_por_advogado = TRUE AND aprovado_por_cliente = TRUE;

COMMENT ON TABLE processo_advogados IS 'Relacionamento N:N entre processos e advogados - permite múltiplos advogados por processo';
COMMENT ON COLUMN processo_advogados.status IS 'Status do relacionamento: pendente, proposta_enviada, aguardando_aprovacao_cliente, aprovado_cliente, etc';
COMMENT ON COLUMN processo_advogados.principal IS 'True se este é o advogado principal do processo';

-- =====================================================
-- TABELA: propostas_advogados (propostas de cada advogado)
-- =====================================================

CREATE TABLE propostas_advogados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    processo_advogado_id UUID NOT NULL REFERENCES processo_advogados(id) ON DELETE CASCADE,
    processo_id UUID NOT NULL REFERENCES processos(id) ON DELETE CASCADE,
    advogado_id UUID NOT NULL REFERENCES advogados(id) ON DELETE CASCADE,
    
    -- Valores da proposta
    valor_honorarios DECIMAL(15, 2) NOT NULL CHECK (valor_honorarios >= 0),
    forma_pagamento VARCHAR(50) NOT NULL CHECK (forma_pagamento IN ('fixo', 'porcentagem', 'exito', 'mensal', 'hora_trabalhada', 'combinado')),
    porcentagem_exito DECIMAL(5, 2), -- Se forma_pagamento = 'porcentagem' ou 'exito'
    valor_minimo DECIMAL(15, 2), -- Valor mínimo garantido
    valor_maximo DECIMAL(15, 2), -- Valor máximo (se houver)
    
    -- Custas e despesas
    responsavel_custas VARCHAR(30) CHECK (responsavel_custas IN ('cliente', 'advogado', 'compartilhado', 'exito')),
    responsavel_despesas VARCHAR(30) CHECK (responsavel_despesas IN ('cliente', 'advogado', 'compartilhado')),
    
    -- Prazo e condições
    prazo_estimado_meses INTEGER,
    prazo_estimado_dias INTEGER,
    condicoes_especiais TEXT,
    
    -- Descrição da proposta
    descricao_proposta TEXT NOT NULL,
    estrategia_acao TEXT, -- Estratégia proposta pelo advogado
    pontos_fortes TEXT, -- Pontos fortes do caso segundo o advogado
    riscos_identificados TEXT, -- Riscos identificados
    expectativa_resultado TEXT, -- Expectativa de resultado
    
    -- Documentos/arquivos da proposta
    anexos JSONB DEFAULT '[]'::jsonb, -- Array de URLs de documentos
    
    -- Status da proposta
    status VARCHAR(30) NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviada', 'em_analise_cliente', 'aprovada', 'rejeitada', 'expirada')),
    
    -- Datas
    data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    data_envio TIMESTAMP WITH TIME ZONE,
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    data_rejeicao TIMESTAMP WITH TIME ZONE,
    data_expiracao TIMESTAMP WITH TIME ZONE, -- Proposta pode expirar
    
    -- Respostas e feedback
    aprovado_por_cliente BOOLEAN DEFAULT FALSE,
    observacoes_cliente TEXT,
    motivo_rejeicao_cliente TEXT,
    
    -- Controle
    versao INTEGER DEFAULT 1, -- Versão da proposta (advogado pode atualizar)
    proposta_anterior_id UUID REFERENCES propostas_advogados(id), -- Para histórico de versões
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_propostas_proc_adv ON propostas_advogados(processo_advogado_id);
CREATE INDEX idx_propostas_processo ON propostas_advogados(processo_id);
CREATE INDEX idx_propostas_advogado ON propostas_advogados(advogado_id);
CREATE INDEX idx_propostas_status ON propostas_advogados(status);
CREATE INDEX idx_propostas_enviadas ON propostas_advogados(processo_id) WHERE status = 'enviada';
CREATE INDEX idx_propostas_aprovacao ON propostas_advogados(processo_id) WHERE status = 'em_analise_cliente';
CREATE INDEX idx_propostas_data_envio ON propostas_advogados(data_envio DESC);

COMMENT ON TABLE propostas_advogados IS 'Propostas de honorários e condições de cada advogado para um processo';
COMMENT ON COLUMN propostas_advogados.versao IS 'Versão da proposta - advogado pode atualizar e enviar nova versão';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Atualizar updated_at em processos
CREATE TRIGGER set_timestamp_processos
BEFORE UPDATE ON processos
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_processo_advogados
BEFORE UPDATE ON processo_advogados
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_propostas_advogados
BEFORE UPDATE ON propostas_advogados
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Trigger: Atualizar status do processo quando advogado aceita
CREATE OR REPLACE FUNCTION atualizar_status_processo_advogado()
RETURNS TRIGGER AS $$
BEGIN
    -- Se advogado aceitou e cliente aprovou, atualizar processo
    IF NEW.aceito_por_advogado = TRUE AND NEW.aprovado_por_cliente = TRUE AND NEW.status = 'aceito' THEN
        -- Atualizar processo para em_andamento se ainda estiver aberto
        UPDATE processos
        SET 
            status = CASE 
                WHEN status = 'aberto' OR status = 'aguardando_aprovacao' THEN 'em_andamento'
                ELSE status
            END,
            advogado_id = CASE 
                WHEN advogado_id IS NULL THEN NEW.advogado_id
                ELSE advogado_id
            END,
            data_atribuicao = COALESCE(data_atribuicao, NOW()),
            data_inicio = COALESCE(data_inicio, NOW()),
            updated_at = NOW()
        WHERE id = NEW.processo_id;
        
        -- Criar atividade
        INSERT INTO processo_atividades (
            processo_id, tipo, titulo, descricao, usuario_id, usuario_nome, usuario_tipo
        )
        SELECT
            NEW.processo_id,
            'atribuicao',
            'Advogado aceito pelo cliente',
            'Advogado ' || u.nome || ' foi aceito pelo cliente e início o trabalho no processo',
            NEW.advogado_id,
            u.nome,
            u.tipo_usuario
        FROM usuarios u
        WHERE u.id = NEW.advogado_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_status_advogado
AFTER UPDATE ON processo_advogados
FOR EACH ROW
WHEN (OLD.aceito_por_advogado IS DISTINCT FROM NEW.aceito_por_advogado 
      OR OLD.aprovado_por_cliente IS DISTINCT FROM NEW.aprovado_por_cliente)
EXECUTE FUNCTION atualizar_status_processo_advogado();

-- Trigger: Atualizar processo_advogados quando proposta é enviada
CREATE OR REPLACE FUNCTION atualizar_status_proposta_enviada()
RETURNS TRIGGER AS $$
BEGIN
    -- Quando proposta é enviada, atualizar status do processo_advogados
    IF NEW.status = 'enviada' AND OLD.status != 'enviada' THEN
        UPDATE processo_advogados
        SET 
            status = 'proposta_enviada',
            updated_at = NOW()
        WHERE id = NEW.processo_advogado_id;
        
        -- Atualizar processo para aguardando aprovação
        UPDATE processos
        SET 
            status = 'aguardando_aprovacao',
            updated_at = NOW()
        WHERE id = NEW.processo_id
          AND status = 'aberto';
          
        -- Criar atividade
        INSERT INTO processo_atividades (
            processo_id, tipo, titulo, descricao, usuario_id, usuario_nome, usuario_tipo
        )
        SELECT
            NEW.processo_id,
            'documento',
            'Proposta de advogado enviada',
            'Advogado ' || u.nome || ' enviou proposta de honorários',
            NEW.advogado_id,
            u.nome,
            u.tipo_usuario
        FROM usuarios u
        WHERE u.id = NEW.advogado_id;
    END IF;
    
    -- Quando proposta é aprovada pelo cliente
    IF NEW.aprovado_por_cliente = TRUE AND OLD.aprovado_por_cliente = FALSE THEN
        UPDATE processo_advogados
        SET 
            status = 'aprovado_cliente',
            aprovado_por_cliente = TRUE,
            data_aprovacao_cliente = NOW(),
            updated_at = NOW()
        WHERE id = NEW.processo_advogado_id;
        
        -- Criar atividade
        INSERT INTO processo_atividades (
            processo_id, tipo, titulo, descricao, usuario_id, usuario_nome, usuario_tipo
        )
        SELECT
            NEW.processo_id,
            'atribuicao',
            'Proposta aprovada pelo cliente',
            'Cliente aprovou a proposta do advogado ' || u.nome,
            p.cliente_id,
            uc.nome,
            uc.tipo_usuario
        FROM processos p
        INNER JOIN usuarios uc ON p.cliente_id = uc.id
        INNER JOIN advogados a ON NEW.advogado_id = a.id
        INNER JOIN usuarios u ON a.id = u.id
        WHERE p.id = NEW.processo_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_proposta_status
AFTER INSERT OR UPDATE ON propostas_advogados
FOR EACH ROW
EXECUTE FUNCTION atualizar_status_proposta_enviada();

-- Trigger: Criar atividade ao mudar status
CREATE OR REPLACE FUNCTION criar_atividade_status_processo()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO processo_atividades (
      processo_id, tipo, titulo, descricao, usuario_id, usuario_nome, usuario_tipo
    )
    SELECT
      NEW.id,
      'status_change',
      'Status alterado',
      'Status mudou de "' || OLD.status || '" para "' || NEW.status || '"',
      NEW.criado_por,
      u.nome,
      u.tipo_usuario
    FROM usuarios u
    WHERE u.id = NEW.criado_por;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atividade_status
AFTER UPDATE ON processos
FOR EACH ROW
EXECUTE FUNCTION criar_atividade_status_processo();

-- Trigger: Atualizar avaliação média do advogado
CREATE OR REPLACE FUNCTION atualizar_avaliacao_advogado()
RETURNS TRIGGER AS $$
DECLARE
  nova_media DECIMAL(3,2);
  total_aval INTEGER;
BEGIN
  SELECT AVG(nota), COUNT(*)
  INTO nova_media, total_aval
  FROM avaliacoes
  WHERE advogado_id = COALESCE(NEW.advogado_id, OLD.advogado_id)
    AND aprovado = TRUE;
  
  UPDATE advogados
  SET 
    avaliacao_media = COALESCE(nova_media, 0),
    total_avaliacoes = total_aval
  WHERE id = COALESCE(NEW.advogado_id, OLD.advogado_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_avaliacao_advogado
AFTER INSERT OR UPDATE OR DELETE ON avaliacoes
FOR EACH ROW
EXECUTE FUNCTION atualizar_avaliacao_advogado();

-- =====================================================
-- FUNÇÃO: Vincular cliente ao processo (após cadastro)
-- Busca processos pendentes por email ou token
-- =====================================================

CREATE OR REPLACE FUNCTION vincular_cliente_processo(
    p_cliente_id UUID,
    p_email VARCHAR(255) DEFAULT NULL,
    p_sessao_token VARCHAR(255) DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    v_affected INTEGER := 0;
    v_processo_id UUID;
    v_cliente_email VARCHAR(255);
BEGIN
    -- Buscar email do cliente se não foi passado
    IF p_email IS NULL THEN
        SELECT email INTO v_cliente_email
        FROM usuarios
        WHERE id = p_cliente_id;
        
        IF v_cliente_email IS NULL THEN
            RETURN 0;
        END IF;
    ELSE
        v_cliente_email := LOWER(p_email);
    END IF;
    
    -- Buscar processos pendentes por email ou token
    FOR v_processo_id IN
        SELECT id
        FROM processos
        WHERE cliente_id IS NULL
          AND status = 'cadastro_pendente'
          AND deletado = FALSE
          AND (
              LOWER(cliente_temp_email) = v_cliente_email
              OR (p_sessao_token IS NOT NULL AND sessao_token = p_sessao_token)
          )
        ORDER BY data_criacao ASC
    LOOP
        -- Atualizar processo com cliente e mudar status
        UPDATE processos 
        SET 
            cliente_id = p_cliente_id,
            criado_por = p_cliente_id, -- Atualizar criado_por agora que cliente está cadastrado
            status = CASE 
                WHEN status = 'cadastro_pendente' THEN 'aberto' 
                ELSE status 
            END,
            -- Limpar dados temporários
            cliente_temp_nome = NULL,
            cliente_temp_email = NULL,
            cliente_temp_telefone = NULL,
            cliente_temp_cpf_cnpj = NULL,
            cliente_temp_tipo_pessoa = NULL,
            sessao_token = NULL, -- Limpar token após vinculação
            updated_at = NOW()
        WHERE id = v_processo_id;
        
        -- Criar atividade de vinculação
        INSERT INTO processo_atividades (
            processo_id, tipo, titulo, descricao, usuario_id, usuario_nome, usuario_tipo
        )
        SELECT
            v_processo_id,
            'atribuicao',
            'Cliente vinculado ao processo',
            'Cliente completou cadastro e foi vinculado ao processo',
            u.id,
            u.nome,
            u.tipo_usuario
        FROM usuarios u
        WHERE u.id = p_cliente_id;
        
        v_affected := v_affected + 1;
    END LOOP;
    
    RETURN v_affected;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION vincular_cliente_processo IS 'Vincula automaticamente processos pendentes ao cliente após cadastro (busca por email ou token)';

-- =====================================================
-- FUNÇÃO: Vincular processo específico (uso administrativo)
-- =====================================================

CREATE OR REPLACE FUNCTION vincular_processo_cliente(
    p_processo_id UUID,
    p_cliente_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_affected INTEGER;
BEGIN
    -- Atualizar processo com cliente e mudar status
    UPDATE processos 
    SET 
        cliente_id = p_cliente_id,
        criado_por = p_cliente_id,
        status = CASE 
            WHEN status = 'cadastro_pendente' THEN 'aberto' 
            ELSE status 
        END,
        -- Limpar dados temporários
        cliente_temp_nome = NULL,
        cliente_temp_email = NULL,
        cliente_temp_telefone = NULL,
        cliente_temp_cpf_cnpj = NULL,
        cliente_temp_tipo_pessoa = NULL,
        sessao_token = NULL,
        updated_at = NOW()
    WHERE id = p_processo_id
      AND cliente_id IS NULL;
    
    GET DIAGNOSTICS v_affected = ROW_COUNT;
    
    -- Criar atividade de vinculação
    IF v_affected > 0 THEN
        INSERT INTO processo_atividades (
            processo_id, tipo, titulo, descricao, usuario_id, usuario_nome, usuario_tipo
        )
        SELECT
            p_processo_id,
            'atribuicao',
            'Cliente vinculado ao processo',
            'Cliente foi vinculado ao processo',
            u.id,
            u.nome,
            u.tipo_usuario
        FROM usuarios u
        WHERE u.id = p_cliente_id;
        
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION vincular_processo_cliente IS 'Vincula um processo específico a um cliente (uso administrativo)';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================


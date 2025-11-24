-- =====================================================
-- PLATAFORMA JURÍDICA - TABELAS DE COMUNICAÇÃO
-- =====================================================
-- Descrição: Mensagens e notificações
-- Versão: 1.0
-- Data: 2024
-- =====================================================

-- =====================================================
-- TABELA: mensagens
-- =====================================================

CREATE TABLE mensagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    processo_id UUID NOT NULL REFERENCES processos(id) ON DELETE CASCADE,
    
    -- Remetente
    remetente_id UUID NOT NULL REFERENCES usuarios(id),
    remetente_nome VARCHAR(255) NOT NULL,
    remetente_tipo VARCHAR(20) NOT NULL CHECK (remetente_tipo IN ('cliente', 'advogado', 'admin')),
    
    -- Destinatário
    destinatario_id UUID REFERENCES usuarios(id),
    destinatario_nome VARCHAR(255),
    destinatario_tipo VARCHAR(20) CHECK (destinatario_tipo IN ('cliente', 'advogado', 'admin')),
    
    -- Conteúdo
    conteudo TEXT NOT NULL,
    tipo_mensagem VARCHAR(20) NOT NULL DEFAULT 'texto' CHECK (tipo_mensagem IN ('texto', 'arquivo', 'imagem', 'sistema')),
    
    -- Anexo
    anexo_nome VARCHAR(255),
    anexo_url TEXT,
    anexo_tipo VARCHAR(100),
    anexo_tamanho BIGINT,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'enviado' CHECK (status IN ('enviando', 'enviado', 'entregue', 'lido', 'erro')),
    lida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    data_leitura TIMESTAMP WITH TIME ZONE,
    data_entrega TIMESTAMP WITH TIME ZONE,
    
    -- Edição
    editada BOOLEAN DEFAULT FALSE,
    data_edicao TIMESTAMP WITH TIME ZONE,
    
    -- Resposta
    mensagem_pai_id UUID REFERENCES mensagens(id),
    
    -- Soft delete
    deletada BOOLEAN DEFAULT FALSE,
    data_delecao TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_mensagens_processo ON mensagens(processo_id, data_envio DESC) WHERE deletada = FALSE;
CREATE INDEX idx_mensagens_remetente ON mensagens(remetente_id);
CREATE INDEX idx_mensagens_destinatario ON mensagens(destinatario_id);
CREATE INDEX idx_mensagens_nao_lidas ON mensagens(processo_id, destinatario_id) WHERE lida = FALSE AND deletada = FALSE;
CREATE INDEX idx_mensagens_tipo ON mensagens(tipo_mensagem);
CREATE INDEX idx_mensagens_data ON mensagens(data_envio DESC);

COMMENT ON TABLE mensagens IS 'Sistema de mensagens/chat entre usuários';

-- =====================================================
-- TABELA: notificacoes
-- =====================================================

CREATE TABLE notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Destinatário
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Tipo e categoria
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('mensagem', 'documento', 'processo', 'agenda', 'assinatura', 'pagamento', 'sistema', 'avaliacao', 'verificacao')),
    categoria VARCHAR(30) CHECK (categoria IN ('info', 'sucesso', 'aviso', 'erro', 'urgente')),
    
    -- Conteúdo
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    
    -- Dados relacionados
    processo_id UUID REFERENCES processos(id) ON DELETE CASCADE,
    documento_id UUID REFERENCES documentos(id) ON DELETE CASCADE,
    
    -- Link de ação
    link_acao TEXT,
    label_acao VARCHAR(100),
    
    -- Status
    lida BOOLEAN DEFAULT FALSE,
    data_leitura TIMESTAMP WITH TIME ZONE,
    
    -- Envio
    enviar_email BOOLEAN DEFAULT FALSE,
    email_enviado BOOLEAN DEFAULT FALSE,
    data_email TIMESTAMP WITH TIME ZONE,
    
    enviar_push BOOLEAN DEFAULT FALSE,
    push_enviado BOOLEAN DEFAULT FALSE,
    data_push TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Datas
    data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expira_em TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id, data_criacao DESC);
CREATE INDEX idx_notificacoes_nao_lidas ON notificacoes(usuario_id) WHERE lida = FALSE;
CREATE INDEX idx_notificacoes_tipo ON notificacoes(tipo);
CREATE INDEX idx_notificacoes_processo ON notificacoes(processo_id);
CREATE INDEX idx_notificacoes_data ON notificacoes(data_criacao DESC);
CREATE INDEX idx_notificacoes_expiracao ON notificacoes(expira_em) WHERE expira_em IS NOT NULL;

COMMENT ON TABLE notificacoes IS 'Sistema de notificações da plataforma';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Atualizar contador de mensagens no processo
CREATE OR REPLACE FUNCTION atualizar_contador_mensagens()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.deletada = FALSE THEN
    UPDATE processos 
    SET mensagens_count = mensagens_count + 1 
    WHERE id = NEW.processo_id;
    
    -- Incrementar não lidas se não é do tipo sistema
    IF NEW.tipo_mensagem != 'sistema' AND NEW.destinatario_id IS NOT NULL THEN
      UPDATE processos 
      SET mensagens_nao_lidas = mensagens_nao_lidas + 1 
      WHERE id = NEW.processo_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' AND OLD.lida = FALSE AND NEW.lida = TRUE THEN
    -- Decrementar não lidas quando mensagem é lida
    UPDATE processos 
    SET mensagens_nao_lidas = GREATEST(0, mensagens_nao_lidas - 1)
    WHERE id = NEW.processo_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contador_mensagens
AFTER INSERT OR UPDATE ON mensagens
FOR EACH ROW
EXECUTE FUNCTION atualizar_contador_mensagens();

-- Trigger: Criar notificação ao receber mensagem
CREATE OR REPLACE FUNCTION criar_notificacao_mensagem()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tipo_mensagem != 'sistema' AND NEW.destinatario_id IS NOT NULL THEN
    INSERT INTO notificacoes (
      usuario_id, tipo, categoria, titulo, mensagem, processo_id, link_acao, enviar_email, enviar_push
    ) VALUES (
      NEW.destinatario_id,
      'mensagem',
      'info',
      'Nova mensagem de ' || NEW.remetente_nome,
      LEFT(NEW.conteudo, 200),
      NEW.processo_id,
      '/processo/' || NEW.processo_id::text || '/chat',
      TRUE,
      TRUE
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notificacao_mensagem
AFTER INSERT ON mensagens
FOR EACH ROW
EXECUTE FUNCTION criar_notificacao_mensagem();

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================


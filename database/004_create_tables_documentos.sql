-- =====================================================
-- PLATAFORMA JURÍDICA - TABELAS DE DOCUMENTOS
-- =====================================================
-- Descrição: Criação das tabelas de documentos e assinaturas
-- Versão: 1.0
-- Data: 2024
-- =====================================================

-- =====================================================
-- TABELA: documentos
-- =====================================================

CREATE TABLE documentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    processo_id UUID NOT NULL REFERENCES processos(id) ON DELETE CASCADE,
    
    -- Informações do arquivo
    nome VARCHAR(255) NOT NULL,
    nome_original VARCHAR(255) NOT NULL,
    caminho_arquivo TEXT NOT NULL,
    url_publica TEXT,
    
    -- Tipo e categoria
    tipo_arquivo VARCHAR(10) NOT NULL CHECK (tipo_arquivo IN ('pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'xls', 'xlsx', 'zip', 'rar', 'outros')),
    categoria VARCHAR(30) NOT NULL CHECK (categoria IN ('inicial', 'identificacao', 'comprovantes', 'contratos', 'peticoes', 'sentencas', 'evidencias', 'correspondencia', 'outros')),
    
    -- Tamanho e hash
    tamanho_bytes BIGINT NOT NULL,
    tamanho_formatado VARCHAR(20),
    checksum VARCHAR(64),
    mime_type VARCHAR(100),
    
    -- Controle de versão
    versao INTEGER NOT NULL DEFAULT 1,
    documento_pai_id UUID REFERENCES documentos(id),
    
    -- Upload e status
    uploaded_by UUID NOT NULL REFERENCES usuarios(id),
    uploaded_by_nome VARCHAR(255) NOT NULL,
    uploaded_by_tipo VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'disponivel' CHECK (status IN ('processando', 'disponivel', 'aprovado', 'rejeitado', 'arquivado')),
    
    -- Permissões
    publico BOOLEAN DEFAULT TRUE,
    assinado BOOLEAN DEFAULT FALSE,
    
    -- Informações adicionais
    descricao TEXT,
    tags TEXT[],
    observacoes TEXT,
    
    -- Datas
    data_upload TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    data_modificacao TIMESTAMP WITH TIME ZONE,
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    data_arquivamento TIMESTAMP WITH TIME ZONE,
    
    -- Soft delete
    deletado BOOLEAN DEFAULT FALSE,
    data_delecao TIMESTAMP WITH TIME ZONE,
    deletado_por UUID REFERENCES usuarios(id)
);

CREATE INDEX idx_documentos_processo ON documentos(processo_id) WHERE deletado = FALSE;
CREATE INDEX idx_documentos_categoria ON documentos(categoria);
CREATE INDEX idx_documentos_tipo ON documentos(tipo_arquivo);
CREATE INDEX idx_documentos_status ON documentos(status);
CREATE INDEX idx_documentos_upload ON documentos(data_upload DESC);
CREATE INDEX idx_documentos_publico ON documentos(publico);
CREATE INDEX idx_documentos_tags ON documentos USING GIN(tags);
CREATE INDEX idx_documentos_checksum ON documentos(checksum);

COMMENT ON TABLE documentos IS 'Documentos dos processos';
COMMENT ON COLUMN documentos.checksum IS 'SHA-256 para integridade e detecção de duplicatas';

-- =====================================================
-- TABELA: documento_historico
-- =====================================================

CREATE TABLE documento_historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    documento_id UUID NOT NULL REFERENCES documentos(id) ON DELETE CASCADE,
    
    -- Ação
    acao VARCHAR(30) NOT NULL CHECK (acao IN ('upload', 'download', 'visualizacao', 'edicao', 'exclusao', 'aprovacao', 'rejeicao', 'compartilhamento')),
    
    -- Usuário
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    usuario_nome VARCHAR(255) NOT NULL,
    usuario_tipo VARCHAR(20) NOT NULL,
    
    -- Detalhes
    detalhes TEXT,
    ip_address INET,
    user_agent TEXT,
    
    -- Data
    data_acao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_doc_historico_documento ON documento_historico(documento_id, data_acao DESC);
CREATE INDEX idx_doc_historico_usuario ON documento_historico(usuario_id);
CREATE INDEX idx_doc_historico_acao ON documento_historico(acao);
CREATE INDEX idx_doc_historico_data ON documento_historico(data_acao DESC);

COMMENT ON TABLE documento_historico IS 'Histórico de ações em documentos para auditoria';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Atualizar contador de documentos no processo
CREATE OR REPLACE FUNCTION atualizar_contador_documentos()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE processos 
    SET documentos_count = documentos_count + 1 
    WHERE id = NEW.processo_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE processos 
    SET documentos_count = documentos_count - 1 
    WHERE id = OLD.processo_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contador_documentos
AFTER INSERT OR DELETE ON documentos
FOR EACH ROW
EXECUTE FUNCTION atualizar_contador_documentos();

-- Trigger: Registrar histórico ao fazer upload
CREATE OR REPLACE FUNCTION registrar_upload_documento()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO documento_historico (
    documento_id, acao, usuario_id, usuario_nome, usuario_tipo, detalhes
  ) VALUES (
    NEW.id, 'upload', NEW.uploaded_by, NEW.uploaded_by_nome, NEW.uploaded_by_tipo, 
    'Documento enviado: ' || NEW.nome_original
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_registrar_upload
AFTER INSERT ON documentos
FOR EACH ROW
EXECUTE FUNCTION registrar_upload_documento();

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================


-- =====================================================
-- PLATAFORMA JURÍDICA - VIEWS
-- =====================================================
-- Descrição: Views úteis para consultas frequentes
-- Versão: 1.0
-- Data: 2024
-- =====================================================

-- =====================================================
-- VIEW: vw_processos_completos
-- =====================================================

CREATE OR REPLACE VIEW vw_processos_completos AS
SELECT 
    p.*,
    -- Se tem cliente vinculado, usar dados do cliente; senão usar dados temporários
    COALESCE(uc.nome, p.cliente_temp_nome) as cliente_nome,
    COALESCE(uc.email, p.cliente_temp_email) as cliente_email,
    COALESCE(uc.telefone, p.cliente_temp_telefone) as cliente_telefone,
    COALESCE(c.tipo_pessoa, p.cliente_temp_tipo_pessoa) as cliente_tipo_pessoa,
    c.cpf as cliente_cpf,
    c.cnpj as cliente_cnpj,
    COALESCE(c.cpf, c.cnpj, p.cliente_temp_cpf_cnpj) as cliente_documento,
    CASE WHEN p.cliente_id IS NULL THEN TRUE ELSE FALSE END as cliente_temporario,
    CASE WHEN p.cliente_id IS NULL THEN TRUE ELSE FALSE END as aguardando_cadastro,
    -- Advogado principal (se houver)
    ua.nome as advogado_principal_nome,
    ua.email as advogado_principal_email,
    a.numero_oab as advogado_principal_oab,
    a.uf_oab as advogado_principal_uf,
    a.avaliacao_media as advogado_principal_avaliacao,
    -- Contadores de advogados
    (SELECT COUNT(*) FROM processo_advogados pa WHERE pa.processo_id = p.id AND pa.status = 'aceito') as total_advogados_aceitos,
    (SELECT COUNT(*) FROM processo_advogados pa WHERE pa.processo_id = p.id AND pa.status IN ('proposta_enviada', 'aguardando_aprovacao_cliente')) as total_advogados_aguardando_aprovacao,
    (SELECT COUNT(*) FROM processo_advogados pa WHERE pa.processo_id = p.id) as total_advogados_atribuidos,
    (SELECT COUNT(*) FROM propostas_advogados prop WHERE prop.processo_id = p.id AND prop.status = 'enviada') as total_propostas_enviadas,
    (SELECT COUNT(*) FROM propostas_advogados prop WHERE prop.processo_id = p.id AND prop.status = 'aprovada') as total_propostas_aprovadas,
    (SELECT COUNT(*) FROM documentos d WHERE d.processo_id = p.id AND d.deletado = FALSE) as total_documentos,
    (SELECT COUNT(*) FROM mensagens m WHERE m.processo_id = p.id AND m.deletada = FALSE) as total_mensagens,
    (SELECT COUNT(*) FROM mensagens m WHERE m.processo_id = p.id AND m.lida = FALSE AND m.deletada = FALSE) as mensagens_nao_lidas,
    (SELECT COUNT(*) FROM processo_atividades pa WHERE pa.processo_id = p.id) as total_atividades
FROM processos p
LEFT JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN usuarios uc ON c.id = uc.id
LEFT JOIN advogados a ON p.advogado_id = a.id
LEFT JOIN usuarios ua ON a.id = ua.id
WHERE p.deletado = FALSE;

COMMENT ON VIEW vw_processos_completos IS 'Processos com informações completas - suporta múltiplos advogados e propostas';

-- =====================================================
-- VIEW: vw_dashboard_advogado
-- =====================================================

CREATE OR REPLACE VIEW vw_dashboard_advogado AS
SELECT 
    a.id as advogado_id,
    u.nome,
    u.email,
    a.numero_oab,
    a.uf_oab,
    COUNT(DISTINCT p.id) FILTER (WHERE p.status IN ('em_andamento', 'aguardando_cliente')) as processos_ativos,
    COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'aberto' AND p.advogado_id IS NULL) as processos_disponiveis,
    COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'concluido') as processos_concluidos,
    COUNT(DISTINCT m.id) FILTER (WHERE m.destinatario_id = u.id AND m.lida = FALSE AND m.deletada = FALSE) as mensagens_nao_lidas,
    a.avaliacao_media,
    a.total_avaliacoes,
    a.disponivel_novos_casos,
    a.capacidade_maxima_processos
FROM advogados a
INNER JOIN usuarios u ON a.id = u.id
LEFT JOIN processos p ON p.advogado_id = a.id AND p.deletado = FALSE
LEFT JOIN mensagens m ON m.destinatario_id = u.id
WHERE u.deletado = FALSE
GROUP BY a.id, u.nome, u.email, a.numero_oab, a.uf_oab, a.avaliacao_media, 
         a.total_avaliacoes, a.disponivel_novos_casos, a.capacidade_maxima_processos;

COMMENT ON VIEW vw_dashboard_advogado IS 'Dashboard com métricas para advogados';

-- =====================================================
-- VIEW: vw_dashboard_cliente
-- =====================================================

CREATE OR REPLACE VIEW vw_dashboard_cliente AS
SELECT 
    c.id as cliente_id,
    u.nome,
    u.email,
    c.tipo_pessoa,
    c.verificado,
    -- Processos vinculados (após cadastro completo)
    COUNT(DISTINCT p.id) FILTER (WHERE p.cliente_id = c.id AND p.status NOT IN ('concluido', 'arquivado') AND p.deletado = FALSE) as processos_ativos,
    COUNT(DISTINCT p.id) FILTER (WHERE p.cliente_id = c.id AND p.status = 'concluido' AND p.deletado = FALSE) as processos_concluidos,
    -- Processos pendentes de cadastro (criados antes do cadastro)
    COUNT(DISTINCT p_pend.id) FILTER (WHERE p_pend.cliente_id IS NULL AND LOWER(p_pend.cliente_temp_email) = LOWER(u.email) AND p_pend.deletado = FALSE) as processos_cadastro_pendente,
    -- Propostas aguardando aprovação
    COUNT(DISTINCT prop.id) FILTER (WHERE prop.processo_id IN (SELECT id FROM processos WHERE cliente_id = c.id) AND prop.status IN ('enviada', 'em_analise_cliente') AND prop.aprovado_por_cliente = FALSE) as propostas_aguardando_aprovacao,
    COUNT(DISTINCT pa.id) FILTER (WHERE pa.processo_id IN (SELECT id FROM processos WHERE cliente_id = c.id) AND pa.status IN ('proposta_enviada', 'aguardando_aprovacao_cliente')) as advogados_aguardando_aprovacao,
    COUNT(DISTINCT m.id) FILTER (WHERE m.destinatario_id = u.id AND m.lida = FALSE AND m.deletada = FALSE) as mensagens_nao_lidas,
    COUNT(DISTINCT d.id) FILTER (WHERE d.status = 'disponivel' AND d.publico = TRUE AND d.deletado = FALSE) as documentos_disponiveis,
    SUM(p.valor_causa) FILTER (WHERE p.cliente_id = c.id AND p.status NOT IN ('concluido', 'arquivado', 'rejeitado') AND p.deletado = FALSE) as valor_total_causas,
    COUNT(DISTINCT n.id) FILTER (WHERE n.lida = FALSE) as notificacoes_nao_lidas
FROM clientes c
INNER JOIN usuarios u ON c.id = u.id
LEFT JOIN processos p ON p.cliente_id = c.id AND p.deletado = FALSE
LEFT JOIN processos p_pend ON p_pend.cliente_id IS NULL AND p_pend.deletado = FALSE
LEFT JOIN processo_advogados pa ON pa.processo_id IN (SELECT id FROM processos WHERE cliente_id = c.id)
LEFT JOIN propostas_advogados prop ON prop.processo_id IN (SELECT id FROM processos WHERE cliente_id = c.id)
LEFT JOIN mensagens m ON m.destinatario_id = u.id
LEFT JOIN documentos d ON d.processo_id = p.id
LEFT JOIN notificacoes n ON n.usuario_id = u.id
WHERE u.deletado = FALSE
GROUP BY c.id, u.nome, u.email, c.tipo_pessoa, c.verificado;

COMMENT ON VIEW vw_dashboard_cliente IS 'Dashboard com métricas para clientes';

-- =====================================================
-- VIEW: vw_dashboard_admin
-- =====================================================

CREATE OR REPLACE VIEW vw_dashboard_admin AS
SELECT
    COUNT(DISTINCT u.id) FILTER (WHERE u.tipo_usuario = 'cliente' AND u.deletado = FALSE) as total_clientes,
    COUNT(DISTINCT u.id) FILTER (WHERE u.tipo_usuario = 'advogado' AND u.deletado = FALSE) as total_advogados,
    COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'cadastro_pendente' AND p.deletado = FALSE) as processos_cadastro_pendente,
    COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'aberto' AND p.advogado_id IS NULL AND p.deletado = FALSE) as processos_aguardando_atribuicao,
    COUNT(DISTINCT p.id) FILTER (WHERE p.status IN ('em_andamento', 'aguardando_cliente') AND p.deletado = FALSE) as processos_em_andamento,
    COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'concluido' AND p.deletado = FALSE) as processos_concluidos,
    COUNT(DISTINCT v.id) FILTER (WHERE v.status IN ('pendente', 'em_analise')) as verificacoes_pendentes,
    COUNT(DISTINCT d.id) FILTER (WHERE d.data_upload >= NOW() - INTERVAL '7 days' AND d.deletado = FALSE) as documentos_recentes,
    COUNT(DISTINCT m.id) FILTER (WHERE m.data_envio >= NOW() - INTERVAL '24 hours' AND m.deletada = FALSE) as mensagens_24h
FROM usuarios u
LEFT JOIN processos p ON TRUE
LEFT JOIN verificacao_identidade v ON TRUE
LEFT JOIN documentos d ON TRUE
LEFT JOIN mensagens m ON TRUE;

COMMENT ON VIEW vw_dashboard_admin IS 'Dashboard com métricas para administradores';

-- =====================================================
-- VIEW: vw_processos_atrasados
-- =====================================================

CREATE OR REPLACE VIEW vw_processos_atrasados AS
SELECT 
    p.id,
    p.numero_processo,
    p.titulo,
    p.tipo,
    p.status,
    p.urgencia,
    p.prazo_estimado,
    NOW() - p.prazo_estimado as dias_atraso,
    COALESCE(uc.nome, p.cliente_temp_nome) as cliente_nome,
    ua.nome as advogado_nome,
    ua.email as advogado_email
FROM processos p
LEFT JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN usuarios uc ON c.id = uc.id
LEFT JOIN advogados a ON p.advogado_id = a.id
LEFT JOIN usuarios ua ON a.id = ua.id
WHERE p.deletado = FALSE
  AND p.status NOT IN ('cadastro_pendente', 'concluido', 'arquivado', 'rejeitado')
  AND p.prazo_estimado < NOW()
ORDER BY p.urgencia DESC, p.prazo_estimado ASC;

COMMENT ON VIEW vw_processos_atrasados IS 'Processos que ultrapassaram o prazo estimado';

-- =====================================================
-- VIEW: vw_advogados_disponiveis
-- =====================================================

CREATE OR REPLACE VIEW vw_advogados_disponiveis AS
SELECT 
    a.id,
    u.nome,
    u.email,
    u.telefone,
    a.numero_oab,
    a.uf_oab,
    a.especialidades,
    a.areas_atuacao,
    a.avaliacao_media,
    a.total_avaliacoes,
    a.processos_ativos,
    a.capacidade_maxima_processos,
    (a.capacidade_maxima_processos - a.processos_ativos) as vagas_disponiveis,
    a.experiencia_anos
FROM advogados a
INNER JOIN usuarios u ON a.id = u.id
WHERE u.deletado = FALSE
  AND u.status = 'ativo'
  AND a.verificado = TRUE
  AND a.disponivel_novos_casos = TRUE
  AND a.processos_ativos < a.capacidade_maxima_processos
ORDER BY a.avaliacao_media DESC, a.experiencia_anos DESC;

COMMENT ON VIEW vw_advogados_disponiveis IS 'Advogados disponíveis para novos processos';

-- =====================================================
-- VIEW: vw_processos_cadastro_pendente
-- =====================================================

CREATE OR REPLACE VIEW vw_processos_cadastro_pendente AS
SELECT 
    p.id,
    p.numero_processo,
    p.titulo,
    p.tipo,
    p.urgencia,
    p.data_criacao,
    p.cliente_temp_nome,
    p.cliente_temp_email,
    p.cliente_temp_telefone,
    p.cliente_temp_cpf_cnpj,
    p.cliente_temp_tipo_pessoa,
    p.sessao_token,
    p.sessao_ip,
    -- Verificar se cliente já está cadastrado (para matching)
    CASE WHEN u.id IS NOT NULL THEN TRUE ELSE FALSE END as cliente_ja_cadastrado,
    u.id as cliente_id_existente,
    EXTRACT(DAY FROM (NOW() - p.data_criacao)) as dias_pendente
FROM processos p
LEFT JOIN usuarios u ON LOWER(u.email) = LOWER(p.cliente_temp_email)
WHERE p.deletado = FALSE
  AND p.status = 'cadastro_pendente'
  AND p.cliente_id IS NULL
ORDER BY p.urgencia DESC, p.data_criacao ASC;

COMMENT ON VIEW vw_processos_cadastro_pendente IS 'Processos aguardando conclusão do cadastro do cliente';

-- =====================================================
-- VIEW: vw_estatisticas_gerais
-- =====================================================

CREATE OR REPLACE VIEW vw_estatisticas_gerais AS
SELECT
    -- Usuários
    (SELECT COUNT(*) FROM usuarios WHERE deletado = FALSE) as total_usuarios,
    (SELECT COUNT(*) FROM clientes) as total_clientes,
    (SELECT COUNT(*) FROM advogados) as total_advogados,
    (SELECT COUNT(*) FROM admins) as total_admins,
    
    -- Processos
    (SELECT COUNT(*) FROM processos WHERE deletado = FALSE) as total_processos,
    (SELECT COUNT(*) FROM processos WHERE status = 'aberto' AND deletado = FALSE) as processos_abertos,
    (SELECT COUNT(*) FROM processos WHERE status = 'em_andamento' AND deletado = FALSE) as processos_andamento,
    (SELECT COUNT(*) FROM processos WHERE status = 'concluido' AND deletado = FALSE) as processos_concluidos,
    
    -- Documentos
    (SELECT COUNT(*) FROM documentos WHERE deletado = FALSE) as total_documentos,
    (SELECT COALESCE(SUM(tamanho_bytes), 0) FROM documentos WHERE deletado = FALSE) as tamanho_total_documentos,
    
    -- Mensagens
    (SELECT COUNT(*) FROM mensagens WHERE deletada = FALSE) as total_mensagens,
    (SELECT COUNT(*) FROM mensagens WHERE lida = FALSE AND deletada = FALSE) as mensagens_nao_lidas,
    
    -- Avaliações
    (SELECT AVG(nota) FROM avaliacoes WHERE aprovado = TRUE) as media_geral_avaliacoes,
    (SELECT COUNT(*) FROM avaliacoes) as total_avaliacoes;

COMMENT ON VIEW vw_estatisticas_gerais IS 'Estatísticas gerais da plataforma';

-- =====================================================
-- VIEW: vw_processos_advogados_propostas
-- =====================================================

CREATE OR REPLACE VIEW vw_processos_advogados_propostas AS
SELECT 
    pa.id as processo_advogado_id,
    pa.processo_id,
    pa.advogado_id,
    pa.status as status_atribuicao,
    pa.aprovado_por_cliente,
    pa.aceito_por_advogado,
    pa.principal,
    pa.data_atribuicao,
    pa.data_aprovacao_cliente,
    pa.data_aceite_advogado,
    
    -- Dados do advogado
    ua.nome as advogado_nome,
    ua.email as advogado_email,
    ua.telefone as advogado_telefone,
    a.numero_oab,
    a.uf_oab,
    a.avaliacao_media,
    a.total_avaliacoes,
    a.especialidades,
    a.areas_atuacao,
    
    -- Dados do processo
    p.titulo as processo_titulo,
    p.tipo as processo_tipo,
    p.status as processo_status,
    p.urgencia,
    p.valor_causa,
    
    -- Dados do cliente
    COALESCE(uc.nome, p.cliente_temp_nome) as cliente_nome,
    
    -- Proposta mais recente (se houver)
    prop.id as proposta_id,
    prop.valor_honorarios,
    prop.forma_pagamento,
    prop.porcentagem_exito,
    prop.descricao_proposta,
    prop.estrategia_acao,
    prop.prazo_estimado_meses,
    prop.status as proposta_status,
    prop.data_envio as proposta_data_envio,
    prop.data_aprovacao as proposta_data_aprovacao,
    prop.aprovado_por_cliente as proposta_aprovada,
    prop.versao as proposta_versao
    
FROM processo_advogados pa
INNER JOIN processos p ON pa.processo_id = p.id
INNER JOIN advogados a ON pa.advogado_id = a.id
INNER JOIN usuarios ua ON a.id = ua.id
LEFT JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN usuarios uc ON c.id = uc.id
LEFT JOIN LATERAL (
    SELECT *
    FROM propostas_advogados
    WHERE processo_advogado_id = pa.id
    ORDER BY versao DESC, data_criacao DESC
    LIMIT 1
) prop ON TRUE
WHERE p.deletado = FALSE;

COMMENT ON VIEW vw_processos_advogados_propostas IS 'Visão completa de advogados atribuídos e suas propostas para cada processo';

-- =====================================================
-- VIEW: vw_propostas_aguardando_aprovacao
-- =====================================================

CREATE OR REPLACE VIEW vw_propostas_aguardando_aprovacao AS
SELECT 
    prop.id as proposta_id,
    prop.processo_id,
    prop.advogado_id,
    prop.processo_advogado_id,
    p.titulo as processo_titulo,
    p.tipo as processo_tipo,
    p.urgencia,
    ua.nome as advogado_nome,
    ua.email as advogado_email,
    a.numero_oab,
    a.uf_oab,
    a.avaliacao_media,
    prop.valor_honorarios,
    prop.forma_pagamento,
    prop.porcentagem_exito,
    prop.prazo_estimado_meses,
    prop.descricao_proposta,
    prop.estrategia_acao,
    prop.status as proposta_status,
    prop.data_envio,
    prop.versao,
    COALESCE(uc.nome, p.cliente_temp_nome) as cliente_nome,
    COALESCE(uc.email, p.cliente_temp_email) as cliente_email,
    EXTRACT(DAY FROM (NOW() - prop.data_envio)) as dias_aguardando
FROM propostas_advogados prop
INNER JOIN processos p ON prop.processo_id = p.id
INNER JOIN advogados a ON prop.advogado_id = a.id
INNER JOIN usuarios ua ON a.id = ua.id
LEFT JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN usuarios uc ON c.id = uc.id
WHERE p.deletado = FALSE
  AND prop.status IN ('enviada', 'em_analise_cliente')
  AND prop.aprovado_por_cliente = FALSE
ORDER BY prop.data_envio ASC, p.urgencia DESC;

COMMENT ON VIEW vw_propostas_aguardando_aprovacao IS 'Propostas de advogados aguardando aprovação do cliente';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================


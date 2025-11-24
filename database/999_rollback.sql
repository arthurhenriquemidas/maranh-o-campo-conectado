-- =====================================================
-- PLATAFORMA JURÍDICA - ROLLBACK SCRIPT
-- =====================================================
-- Descrição: Remove todas as tabelas, views e funções criadas
-- Versão: 1.0
-- Data: 2024
--
-- ATENÇÃO: Este script irá DELETAR TODOS OS DADOS!
-- Use apenas em ambiente de desenvolvimento ou para reinstalação.
-- =====================================================

\echo '====================================================='
\echo 'PLATAFORMA JURÍDICA - ROLLBACK DO BANCO DE DADOS'
\echo '====================================================='
\echo ''
\echo 'ATENÇÃO: Este script irá deletar TODAS as tabelas e dados!'
\echo ''

-- Confirmar antes de prosseguir
\prompt 'Digite "CONFIRMAR" para continuar: ' confirmacao

DO $$
BEGIN
    IF :'confirmacao' != 'CONFIRMAR' THEN
        RAISE EXCEPTION 'Operação cancelada pelo usuário';
    END IF;
END $$;

\echo ''
\echo 'Iniciando rollback...'
\echo ''

-- Desabilitar constraints temporariamente
SET session_replication_role = 'replica';

\echo 'Removendo views...'

DROP VIEW IF EXISTS vw_propostas_aguardando_aprovacao CASCADE;
DROP VIEW IF EXISTS vw_processos_advogados_propostas CASCADE;
DROP VIEW IF EXISTS vw_estatisticas_gerais CASCADE;
DROP VIEW IF EXISTS vw_processos_cadastro_pendente CASCADE;
DROP VIEW IF EXISTS vw_advogados_disponiveis CASCADE;
DROP VIEW IF EXISTS vw_processos_atrasados CASCADE;
DROP VIEW IF EXISTS vw_dashboard_admin CASCADE;
DROP VIEW IF EXISTS vw_dashboard_cliente CASCADE;
DROP VIEW IF EXISTS vw_dashboard_advogado CASCADE;
DROP VIEW IF EXISTS vw_processos_completos CASCADE;

\echo 'Removendo tabelas...'

-- Ordem reversa de criação para respeitar foreign keys
DROP TABLE IF EXISTS configuracoes_sistema CASCADE;
DROP TABLE IF EXISTS auditoria CASCADE;
DROP TABLE IF EXISTS pagamentos CASCADE;

DROP TABLE IF EXISTS documentos_verificacao CASCADE;
DROP TABLE IF EXISTS verificacao_identidade CASCADE;
DROP TABLE IF EXISTS log_termos_lgpd CASCADE;
DROP TABLE IF EXISTS consentimentos_lgpd CASCADE;
DROP TABLE IF EXISTS termos_lgpd CASCADE;

DROP TABLE IF EXISTS notificacoes CASCADE;
DROP TABLE IF EXISTS mensagens CASCADE;

DROP TABLE IF EXISTS documento_historico CASCADE;
DROP TABLE IF EXISTS documentos CASCADE;

DROP TABLE IF EXISTS propostas_advogados CASCADE;
DROP TABLE IF EXISTS processo_advogados CASCADE;
DROP TABLE IF EXISTS avaliacoes CASCADE;
DROP TABLE IF EXISTS processo_atividades CASCADE;
DROP TABLE IF EXISTS processos CASCADE;

DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS advogados CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

\echo 'Removendo funções...'

DROP FUNCTION IF EXISTS buscar_processos CASCADE;
DROP FUNCTION IF EXISTS limpar_dados_antigos CASCADE;
DROP FUNCTION IF EXISTS registrar_auditoria CASCADE;
DROP FUNCTION IF EXISTS criar_notificacao_mensagem CASCADE;
DROP FUNCTION IF EXISTS atualizar_contador_mensagens CASCADE;
DROP FUNCTION IF EXISTS registrar_upload_documento CASCADE;
DROP FUNCTION IF EXISTS atualizar_contador_documentos CASCADE;
DROP FUNCTION IF EXISTS atualizar_avaliacao_advogado CASCADE;
DROP FUNCTION IF EXISTS criar_atividade_status_processo CASCADE;
DROP FUNCTION IF EXISTS atualizar_status_proposta_enviada CASCADE;
DROP FUNCTION IF EXISTS atualizar_status_processo_advogado CASCADE;
DROP FUNCTION IF EXISTS vincular_cliente_processo CASCADE;
DROP FUNCTION IF EXISTS vincular_processo_cliente CASCADE;
DROP FUNCTION IF EXISTS trigger_set_timestamp CASCADE;
DROP FUNCTION IF EXISTS validar_email CASCADE;
DROP FUNCTION IF EXISTS validar_cnpj_formato CASCADE;
DROP FUNCTION IF EXISTS validar_cpf_formato CASCADE;
DROP FUNCTION IF EXISTS verificar_senha CASCADE;
DROP FUNCTION IF EXISTS hash_senha CASCADE;

\echo 'Removendo extensões...'

DROP EXTENSION IF EXISTS unaccent CASCADE;
DROP EXTENSION IF EXISTS pg_trgm CASCADE;
DROP EXTENSION IF EXISTS pgcrypto CASCADE;
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

-- Reabilitar constraints
SET session_replication_role = 'origin';

\echo ''
\echo '====================================================='
\echo 'ROLLBACK CONCLUÍDO!'
\echo '====================================================='
\echo ''
\echo 'Todas as tabelas, views e funções foram removidas.'
\echo ''
\echo 'Para reinstalar, execute: \\i 000_master_setup.sql'
\echo ''

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================


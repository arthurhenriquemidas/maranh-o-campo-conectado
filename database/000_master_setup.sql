-- =====================================================
-- PLATAFORMA JURÍDICA - MASTER SETUP SCRIPT
-- =====================================================
-- Descrição: Script master que executa todos os scripts de criação
-- Versão: 1.0
-- Data: 2024
-- 
-- ATENÇÃO: Execute este script em um banco de dados PostgreSQL 14+
--
-- Ordem de execução:
--   1. Initial Setup (extensões e funções)
--   2. Tabelas de Usuários
--   3. Tabelas de Processos
--   4. Tabelas de Documentos
--   5. Tabelas de Comunicação
--   6. Tabelas de Agenda, LGPD e Verificação
--   7. Tabelas de Pagamentos e Auditoria
--   8. Views
-- =====================================================

\echo '====================================================='
\echo 'PLATAFORMA JURÍDICA - INSTALAÇÃO DO BANCO DE DADOS'
\echo '====================================================='
\echo ''

-- Verificar versão do PostgreSQL
DO $$
BEGIN
    IF (SELECT current_setting('server_version_num')::int < 140000) THEN
        RAISE EXCEPTION 'PostgreSQL 14 ou superior é necessário. Versão atual: %', version();
    END IF;
    RAISE NOTICE 'Versão do PostgreSQL: %', version();
END $$;

\echo ''
\echo '-----------------------------------------------------'
\echo 'Passo 1/8: Configuração Inicial e Extensões'
\echo '-----------------------------------------------------'
\i 001_initial_setup.sql

\echo ''
\echo '-----------------------------------------------------'
\echo 'Passo 2/8: Criando Tabelas de Usuários'
\echo '-----------------------------------------------------'
\i 002_create_tables_usuarios.sql

\echo ''
\echo '-----------------------------------------------------'
\echo 'Passo 3/8: Criando Tabelas de Processos'
\echo '-----------------------------------------------------'
\i 003_create_tables_processos.sql

\echo ''
\echo '-----------------------------------------------------'
\echo 'Passo 4/8: Criando Tabelas de Documentos'
\echo '-----------------------------------------------------'
\i 004_create_tables_documentos.sql

\echo ''
\echo '-----------------------------------------------------'
\echo 'Passo 5/8: Criando Tabelas de Comunicação'
\echo '-----------------------------------------------------'
\i 005_create_tables_comunicacao.sql

\echo ''
\echo '-----------------------------------------------------'
\echo 'Passo 6/8: Criando Tabelas de Agenda, LGPD e Verificação'
\echo '-----------------------------------------------------'
\i 006_create_tables_agenda_lgpd_verificacao.sql

\echo ''
\echo '-----------------------------------------------------'
\echo 'Passo 7/8: Criando Tabelas de Pagamentos e Auditoria'
\echo '-----------------------------------------------------'
\i 007_create_tables_pagamentos_auditoria.sql

\echo ''
\echo '-----------------------------------------------------'
\echo 'Passo 8/8: Criando Views'
\echo '-----------------------------------------------------'
\i 008_create_views.sql

\echo ''
\echo '====================================================='
\echo 'INSTALAÇÃO CONCLUÍDA COM SUCESSO!'
\echo '====================================================='
\echo ''

-- Estatísticas finais
\echo 'Estatísticas do Banco de Dados:'
\echo ''

SELECT 
    'Tabelas criadas: ' || COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

SELECT 
    'Views criadas: ' || COUNT(*) 
FROM information_schema.views 
WHERE table_schema = 'public';

SELECT 
    'Funções criadas: ' || COUNT(*) 
FROM pg_proc p 
JOIN pg_namespace n ON p.pronamespace = n.oid 
WHERE n.nspname = 'public';

SELECT 
    'Índices criados: ' || COUNT(*) 
FROM pg_indexes 
WHERE schemaname = 'public';

\echo ''
\echo 'Próximos passos:'
\echo '  1. Execute o script de dados iniciais (se houver)'
\echo '  2. Configure as permissões de acesso (RLS)'
\echo '  3. Configure o backup automático'
\echo '  4. Teste as funcionalidades básicas'
\echo ''
\echo 'Para desfazer a instalação, execute: \\i 999_rollback.sql'
\echo ''

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================


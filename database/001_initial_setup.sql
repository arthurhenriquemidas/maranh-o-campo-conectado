-- =====================================================
-- PLATAFORMA JURÍDICA - INITIAL SETUP
-- =====================================================
-- Descrição: Configurações iniciais e extensões
-- Versão: 1.0
-- Data: 2024
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- Para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Para criptografia
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Para busca fuzzy
CREATE EXTENSION IF NOT EXISTS "unaccent";       -- Para remover acentos em buscas

-- Configurar search_path
SET search_path TO public;

-- Configurar timezone
SET timezone TO 'UTC';

-- =====================================================
-- TYPES E ENUMS (usando CHECK constraints)
-- =====================================================

-- Comentários sobre tipos principais
COMMENT ON SCHEMA public IS 'Schema principal da Plataforma Jurídica';

-- =====================================================
-- FUNÇÕES UTILITÁRIAS
-- =====================================================

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION trigger_set_timestamp() IS 'Atualiza automaticamente o campo updated_at';

-- Função para hash de senha
CREATE OR REPLACE FUNCTION hash_senha(senha TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(senha, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION hash_senha(TEXT) IS 'Gera hash bcrypt para senha';

-- Função para verificar senha
CREATE OR REPLACE FUNCTION verificar_senha(senha TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN hash = crypt(senha, hash);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION verificar_senha(TEXT, TEXT) IS 'Verifica se senha corresponde ao hash';

-- Função para validar CPF (formato)
CREATE OR REPLACE FUNCTION validar_cpf_formato(cpf TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN cpf ~* '^\d{3}\.\d{3}\.\d{3}-\d{2}$';
END;
$$ LANGUAGE plpgsql;

-- Função para validar CNPJ (formato)
CREATE OR REPLACE FUNCTION validar_cnpj_formato(cnpj TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN cnpj ~* '^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$';
END;
$$ LANGUAGE plpgsql;

-- Função para validar email
CREATE OR REPLACE FUNCTION validar_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CONFIGURAÇÕES DE AUDITORIA
-- =====================================================

-- Habilitar log de queries lentas (>1 segundo)
ALTER DATABASE postgres SET log_min_duration_statement = 1000;

-- Habilitar log de DDL
ALTER DATABASE postgres SET log_statement = 'ddl';

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================

COMMENT ON EXTENSION "uuid-ossp" IS 'Geração de UUIDs versão 4';
COMMENT ON EXTENSION "pgcrypto" IS 'Funções de criptografia incluindo bcrypt';
COMMENT ON EXTENSION "pg_trgm" IS 'Suporte a trigramas para busca de similaridade';
COMMENT ON EXTENSION "unaccent" IS 'Remoção de acentos para buscas';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================


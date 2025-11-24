-- =====================================================
-- PLATAFORMA JURÍDICA - DADOS INICIAIS (SEED)
-- =====================================================
-- Descrição: Dados iniciais para testes e desenvolvimento
-- Versão: 1.0
-- Data: 2024
--
-- ATENÇÃO: Use apenas em ambiente de desenvolvimento!
-- =====================================================

\echo '====================================================='
\echo 'INSERINDO DADOS INICIAIS PARA TESTES'
\echo '====================================================='
\echo ''

-- =====================================================
-- CONFIGURAÇÕES DO SISTEMA
-- =====================================================

\echo 'Inserindo configurações do sistema...'

INSERT INTO configuracoes_sistema (chave, valor, tipo, descricao, categoria, editavel, visivel_interface)
VALUES 
    ('site_nome', 'Plataforma Jurídica', 'string', 'Nome da plataforma', 'geral', TRUE, TRUE),
    ('site_url', 'https://plataforma-juridica.com.br', 'string', 'URL da plataforma', 'geral', TRUE, FALSE),
    ('email_from', 'noreply@plataforma-juridica.com.br', 'string', 'Email remetente padrão', 'email', TRUE, FALSE),
    ('max_upload_size', '10485760', 'number', 'Tamanho máximo de upload em bytes (10MB)', 'arquivos', TRUE, TRUE),
    ('max_file_versions', '5', 'number', 'Número máximo de versões de arquivo', 'arquivos', TRUE, TRUE),
    ('processo_prazo_padrao_dias', '90', 'number', 'Prazo padrão para processos (dias)', 'processos', TRUE, TRUE),
    ('notificacao_email_ativo', 'true', 'boolean', 'Enviar notificações por email', 'notificacoes', TRUE, TRUE),
    ('notificacao_push_ativo', 'true', 'boolean', 'Enviar notificações push', 'notificacoes', TRUE, TRUE),
    ('manutencao_ativa', 'false', 'boolean', 'Modo manutenção ativo', 'sistema', TRUE, TRUE),
    ('versao_sistema', '1.0.0', 'string', 'Versão atual do sistema', 'sistema', FALSE, TRUE);

\echo 'Configurações inseridas: 10'
\echo ''

-- =====================================================
-- USUÁRIO ADMIN
-- =====================================================

\echo 'Criando usuário administrador...'

DO $$
DECLARE
    v_admin_id UUID;
BEGIN
    -- Inserir usuário admin
    INSERT INTO usuarios (
        nome, email, senha_hash, tipo_usuario, status, 
        email_verificado, telefone, cep, endereco, numero, 
        bairro, cidade, estado
    ) VALUES (
        'Admin Sistema',
        'admin@plataforma.com',
        hash_senha('Admin@123'),  -- Senha temporária
        'admin',
        'ativo',
        TRUE,
        '(11) 99999-9999',
        '01310-100',
        'Avenida Paulista',
        '1000',
        'Bela Vista',
        'São Paulo',
        'SP'
    ) RETURNING id INTO v_admin_id;
    
    -- Inserir dados específicos de admin
    INSERT INTO admins (id, nivel_permissao, departamento, cargo)
    VALUES (v_admin_id, 'super_admin', 'TI', 'Administrador de Sistema');
    
    RAISE NOTICE 'Admin criado - Email: admin@plataforma.com | Senha: Admin@123';
    RAISE NOTICE 'IMPORTANTE: Altere a senha no primeiro acesso!';
END $$;

\echo ''

-- =====================================================
-- USUÁRIOS DE TESTE
-- =====================================================

\echo 'Criando usuários de teste...'

-- Cliente Pessoa Física
DO $$
DECLARE
    v_cliente_pf_id UUID;
BEGIN
    INSERT INTO usuarios (
        nome, email, senha_hash, tipo_usuario, status, 
        email_verificado, telefone, cep, endereco, numero,
        bairro, cidade, estado
    ) VALUES (
        'João Silva',
        'joao.silva@email.com',
        hash_senha('Cliente@123'),
        'cliente',
        'ativo',
        TRUE,
        '(11) 98888-8888',
        '01310-100',
        'Rua Augusta',
        '500',
        'Consolação',
        'São Paulo',
        'SP'
    ) RETURNING id INTO v_cliente_pf_id;
    
    INSERT INTO clientes (
        id, cpf, tipo_pessoa, verificado, 
        data_nascimento, profissao, estado_civil
    ) VALUES (
        v_cliente_pf_id,
        '123.456.789-00',
        'PF',
        TRUE,
        '1985-05-15',
        'Engenheiro',
        'Casado'
    );
    
    RAISE NOTICE 'Cliente PF criado - Email: joao.silva@email.com | Senha: Cliente@123';
END $$;

-- Cliente Pessoa Jurídica
DO $$
DECLARE
    v_cliente_pj_id UUID;
BEGIN
    INSERT INTO usuarios (
        nome, email, senha_hash, tipo_usuario, status,
        email_verificado, telefone, cep, endereco, numero,
        bairro, cidade, estado
    ) VALUES (
        'Empresa ABC Ltda',
        'contato@empresaabc.com',
        hash_senha('Empresa@123'),
        'cliente',
        'ativo',
        TRUE,
        '(11) 97777-7777',
        '01310-100',
        'Avenida Paulista',
        '2000',
        'Bela Vista',
        'São Paulo',
        'SP'
    ) RETURNING id INTO v_cliente_pj_id;
    
    INSERT INTO clientes (
        id, cnpj, tipo_pessoa, razao_social, 
        nome_responsavel, verificado
    ) VALUES (
        v_cliente_pj_id,
        '12.345.678/0001-90',
        'PJ',
        'Empresa ABC Comércio Ltda',
        'Maria Santos',
        TRUE
    );
    
    RAISE NOTICE 'Cliente PJ criado - Email: contato@empresaabc.com | Senha: Empresa@123';
END $$;

-- Advogado
DO $$
DECLARE
    v_advogado_id UUID;
BEGIN
    INSERT INTO usuarios (
        nome, email, senha_hash, tipo_usuario, status,
        email_verificado, telefone, cep, endereco, numero,
        bairro, cidade, estado
    ) VALUES (
        'Dr. Carlos Oliveira',
        'carlos.oliveira@adv.com',
        hash_senha('Advogado@123'),
        'advogado',
        'ativo',
        TRUE,
        '(11) 96666-6666',
        '01310-100',
        'Rua da Consolação',
        '1500',
        'Consolação',
        'São Paulo',
        'SP'
    ) RETURNING id INTO v_advogado_id;
    
    INSERT INTO advogados (
        id, numero_oab, uf_oab, situacao_oab, verificado,
        especialidades, areas_atuacao, experiencia_anos,
        disponivel_novos_casos, biografia
    ) VALUES (
        v_advogado_id,
        '123456',
        'SP',
        'ativo',
        TRUE,
        ARRAY['trabalhista', 'civil'],
        ARRAY['Direito do Trabalho', 'Direito Civil'],
        10,
        TRUE,
        'Advogado especializado em Direito do Trabalho e Civil com 10 anos de experiência.'
    );
    
    RAISE NOTICE 'Advogado criado - Email: carlos.oliveira@adv.com | Senha: Advogado@123';
END $$;

\echo ''
\echo 'Usuários de teste criados: 4'
\echo ''

-- =====================================================
-- TERMOS LGPD (Versão Inicial)
-- =====================================================

\echo 'Criando termos LGPD iniciais...'

-- Este é apenas um placeholder
-- Em produção, você deve ter os termos completos

INSERT INTO configuracoes_sistema (chave, valor, tipo, descricao, categoria)
VALUES 
    ('termo_uso_atual', '1.0', 'string', 'Versão atual do termo de uso', 'lgpd'),
    ('politica_privacidade_atual', '1.0', 'string', 'Versão atual da política de privacidade', 'lgpd'),
    ('termo_uso_hash', hash_senha('termo_uso_v1.0'), 'string', 'Hash do termo de uso v1.0', 'lgpd'),
    ('politica_privacidade_hash', hash_senha('politica_privacidade_v1.0'), 'string', 'Hash da política de privacidade v1.0', 'lgpd');

\echo 'Termos LGPD configurados'
\echo ''

-- =====================================================
-- RESUMO
-- =====================================================

\echo '====================================================='
\echo 'DADOS INICIAIS INSERIDOS COM SUCESSO!'
\echo '====================================================='
\echo ''
\echo 'Credenciais de Teste:'
\echo ''
\echo '  ADMIN:'
\echo '    Email: admin@plataforma.com'
\echo '    Senha: Admin@123'
\echo ''
\echo '  CLIENTE (PF):'
\echo '    Email: joao.silva@email.com'
\echo '    Senha: Cliente@123'
\echo ''
\echo '  CLIENTE (PJ):'
\echo '    Email: contato@empresaabc.com'
\echo '    Senha: Empresa@123'
\echo ''
\echo '  ADVOGADO:'
\echo '    Email: carlos.oliveira@adv.com'
\echo '    Senha: Advogado@123'
\echo ''
\echo '⚠️  IMPORTANTE: Altere todas as senhas em produção!'
\echo ''

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================


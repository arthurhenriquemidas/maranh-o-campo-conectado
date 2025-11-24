# 🗄️ Scripts de Banco de Dados - Plataforma Jurídica

Scripts SQL para criação completa do banco de dados PostgreSQL da Plataforma Jurídica.

---

## 📋 Requisitos

- **PostgreSQL**: 14 ou superior
- **Extensões**: uuid-ossp, pgcrypto, pg_trgm, unaccent (instaladas automaticamente)
- **Permissões**: SUPERUSER ou CREATE DATABASE

---

## 📂 Estrutura de Arquivos

```
database/
├── 000_master_setup.sql                    ← Script master (executa tudo)
├── 001_initial_setup.sql                   ← Extensões e funções base
├── 002_create_tables_usuarios.sql          ← Tabelas de usuários
├── 003_create_tables_processos.sql         ← Tabelas de processos
├── 004_create_tables_documentos.sql        ← Tabelas de documentos
├── 005_create_tables_comunicacao.sql       ← Mensagens e notificações
├── 006_create_tables_agenda_lgpd_verificacao.sql  ← Agenda, LGPD, verificação
├── 007_create_tables_pagamentos_auditoria.sql     ← Pagamentos e auditoria
├── 008_create_views.sql                    ← Views úteis
├── 999_rollback.sql                        ← Remoção completa
└── README.md                               ← Este arquivo
```

---

## 🚀 Instalação Rápida

### Opção 1: Executar Tudo de Uma Vez (Recomendado)

```bash
# Conectar ao PostgreSQL
psql -U postgres -d nome_do_banco

# Executar o script master
\i 000_master_setup.sql
```

### Opção 2: Executar Scripts Individualmente

```bash
psql -U postgres -d nome_do_banco

\i 001_initial_setup.sql
\i 002_create_tables_usuarios.sql
\i 003_create_tables_processos.sql
\i 004_create_tables_documentos.sql
\i 005_create_tables_comunicacao.sql
\i 006_create_tables_agenda_lgpd_verificacao.sql
\i 007_create_tables_pagamentos_auditoria.sql
\i 008_create_views.sql
```

### Opção 3: Via Linha de Comando

```bash
# Criar banco de dados
createdb -U postgres plataforma_juridica

# Executar scripts
psql -U postgres -d plataforma_juridica -f 000_master_setup.sql
```

---

## 📊 O Que Será Criado

### Extensões (4)
- ✅ uuid-ossp (UUIDs)
- ✅ pgcrypto (Criptografia)
- ✅ pg_trgm (Busca fuzzy)
- ✅ unaccent (Remoção de acentos)

### Tabelas (25)

#### Usuários (5)
- `usuarios` (tabela pai)
- `clientes`
- `advogados`
- `admins`
- `sindicados`
- `advogado_sindicado` (N:N)

#### Processos (3)
- `processos`
- `processo_atividades`
- `avaliacoes`

#### Documentos (4)
- `documentos`
- `documento_historico`
- `assinaturas_eletronicas`
- `assinantes_documentos`

#### Comunicação (2)
- `mensagens`
- `notificacoes`

#### Agenda (1)
- `agenda_eventos`

#### LGPD (3)
- `termos_lgpd`
- `consentimentos_lgpd`
- `log_termos_lgpd`

#### Verificação (3)
- `verificacao_identidade`
- `documentos_verificacao`
- `documentos_comprobatorios_sindicado`

#### Outros (3)
- `pagamentos`
- `auditoria`
- `configuracoes_sistema`

### Views (8)
- `vw_processos_completos`
- `vw_dashboard_advogado`
- `vw_dashboard_cliente`
- `vw_dashboard_admin`
- `vw_processos_atrasados`
- `vw_advogados_disponiveis`
- `vw_documentos_pendentes_assinatura`
- `vw_estatisticas_gerais`

### Funções (13)
- `trigger_set_timestamp()`
- `hash_senha()`
- `verificar_senha()`
- `validar_cpf_formato()`
- `validar_cnpj_formato()`
- `validar_email()`
- `criar_atividade_status_processo()`
- `atualizar_avaliacao_advogado()`
- `atualizar_contador_documentos()`
- `registrar_upload_documento()`
- `atualizar_contador_mensagens()`
- `criar_notificacao_mensagem()`
- `registrar_auditoria()`
- `limpar_dados_antigos()`
- `buscar_processos()`

### Índices (~100)
- Índices simples
- Índices compostos
- Índices parciais
- Índices GIN (JSONB e Arrays)
- Índices full-text search

### Triggers (~15)
- Atualização automática de timestamps
- Contadores automáticos
- Criação de atividades
- Registros de auditoria
- Atualização de métricas

---

## 🔧 Verificação Pós-Instalação

```sql
-- Listar todas as tabelas
\dt

-- Listar todas as views
\dv

-- Listar todas as funções
\df

-- Verificar extensões instaladas
\dx

-- Contar registros (deve estar vazio)
SELECT 
    schemaname,
    tablename,
    (SELECT COUNT(*) FROM quote_ident(schemaname) || '.' || quote_ident(tablename)) as count
FROM pg_tables 
WHERE schemaname = 'public';
```

---

## 🗑️ Desinstalação

Para remover **TUDO** (tabelas, dados, views, funções):

```bash
psql -U postgres -d nome_do_banco

\i 999_rollback.sql
```

⚠️ **ATENÇÃO**: Isto irá deletar TODOS OS DADOS permanentemente!

---

## 📝 Detalhes Técnicos

### Estratégias Implementadas

#### 1. Soft Delete
Tabelas principais usam `deletado BOOLEAN` ao invés de `DELETE` físico:
- Permite auditoria completa
- Recuperação de dados
- Histórico preservado

#### 2. Timestamps Automáticos
Todas as tabelas têm:
- `data_criacao` (timestamp de criação)
- `updated_at` (atualizado via trigger)

#### 3. Versionamento
Documentos suportam versionamento via `documento_pai_id`

#### 4. Full-Text Search
Índices GIN para busca em português:
```sql
idx_processos_busca ON processos USING GIN(to_tsvector('portuguese', ...))
```

#### 5. Validações
Check constraints para:
- Emails
- CPF/CNPJ (formato)
- Telefones (formato brasileiro)
- Enums (status, tipos, etc.)

#### 6. Segurança
- Senhas com bcrypt (via pgcrypto)
- IP tracking
- User agent logging
- Auditoria completa

---

## 🎯 Próximos Passos Após Instalação

### 1. Criar Usuário Admin
```sql
-- Inserir primeiro usuário (admin)
INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, status, email_verificado)
VALUES (
    'Admin Sistema',
    'admin@plataforma.com',
    hash_senha('senha_temporaria_123'),
    'admin',
    'ativo',
    TRUE
) RETURNING id;

-- Usar o ID retornado para criar o registro em admins
INSERT INTO admins (id, nivel_permissao, departamento)
VALUES (
    '[ID_DO_USUARIO_ACIMA]',
    'super_admin',
    'TI'
);
```

### 2. Configurar Backup
```bash
# Backup diário automático
pg_dump plataforma_juridica > backup_$(date +%Y%m%d).sql

# Agendar no cron
0 2 * * * pg_dump plataforma_juridica > /backups/plataforma_$(date +\%Y\%m\%d).sql
```

### 3. Configurar Row Level Security (RLS)

Ver arquivo `docs/MODELAGEM_BANCO_DADOS.md` seção "Row Level Security"

### 4. Popular Dados Iniciais (Opcional)
```sql
-- Configurações do sistema
INSERT INTO configuracoes_sistema (chave, valor, tipo, descricao)
VALUES 
    ('site_nome', 'Plataforma Jurídica', 'string', 'Nome da plataforma'),
    ('max_upload_size', '10485760', 'number', 'Tamanho máximo de upload em bytes (10MB)'),
    ('email_from', 'noreply@plataforma.com', 'string', 'Email remetente padrão');
```

---

## 📊 Monitoramento

### Queries Úteis

#### Tamanho das Tabelas
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### Índices Não Utilizados
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as scans
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY tablename, indexname;
```

#### Queries Lentas
```sql
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## 🐛 Troubleshooting

### Erro: Extensão não encontrada
```sql
-- Verificar extensões disponíveis
SELECT * FROM pg_available_extensions WHERE name IN ('uuid-ossp', 'pgcrypto');

-- Instalar manualmente
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Erro: Permissão negada
```bash
# Conceder privilégios ao usuário
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE plataforma_juridica TO seu_usuario;"
```

### Erro: Tabela já existe
```sql
-- Fazer rollback primeiro
\i 999_rollback.sql

-- Depois reinstalar
\i 000_master_setup.sql
```

---

## 📚 Documentação Relacionada

- [MODELAGEM_BANCO_DADOS.md](../docs/MODELAGEM_BANCO_DADOS.md) - Modelagem completa
- [DIAGRAMAS_ER.md](../docs/DIAGRAMAS_ER.md) - Diagramas visuais
- [QUICK_REFERENCE.md](../docs/QUICK_REFERENCE.md) - Referência rápida

---

## ✅ Checklist de Instalação

- [ ] PostgreSQL 14+ instalado
- [ ] Banco de dados criado
- [ ] Scripts executados com sucesso
- [ ] Verificação pós-instalação OK
- [ ] Usuário admin criado
- [ ] Backup configurado
- [ ] Documentação lida
- [ ] Equipe treinada

---

## 📞 Suporte

Para questões sobre os scripts:
1. Consulte a documentação em `docs/`
2. Verifique os comentários nos próprios scripts
3. Revise os erros no log do PostgreSQL

---

**Versão**: 1.0  
**Última atualização**: 2024  
**PostgreSQL**: 14+  
**Charset**: UTF-8  
**Timezone**: UTC


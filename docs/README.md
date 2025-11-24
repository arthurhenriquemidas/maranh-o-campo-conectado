# 📚 Documentação - Plataforma Jurídica PrimeNG

Bem-vindo à documentação completa da Plataforma Jurídica! Este diretório contém toda a documentação técnica, funcional e de arquitetura do sistema.

---

## 📑 Índice de Documentos

```
docs/
├── 📊 MODELAGEM_BANCO_DADOS.md    ← Modelagem completa PostgreSQL
├── 📐 DIAGRAMAS_ER.md              ← Diagramas visuais Mermaid
├── 📑 INDICE_DIAGRAMAS.md          ← Catálogo de todos os diagramas
├── ⚡ QUICK_REFERENCE.md           ← Guia rápido e queries
├── ⚙️  funcionalidades.md          ← Features do sistema
├── 🗺️  SITEMAP_FLUXOS.md          ← Mapa e fluxos
└── 📚 README.md                    ← Este arquivo
```

### 🗄️ Modelagem de Banco de Dados

#### [MODELAGEM_BANCO_DADOS.md](./MODELAGEM_BANCO_DADOS.md)
Modelagem completa do banco de dados PostgreSQL com 25 tabelas principais.

**Conteúdo:**
- ✅ Estrutura completa de todas as tabelas
- ✅ Relacionamentos e dependências
- ✅ Índices otimizados para performance
- ✅ Triggers e stored procedures
- ✅ Row Level Security (RLS)
- ✅ Validações e constraints
- ✅ Scripts de manutenção
- ✅ Estratégias de backup e escalabilidade

**Tabelas Principais:**
- `usuarios` (tabela pai com herança)
- `clientes`, `advogados`, `admins`, `sindicados`
- `processos` e `processo_atividades`
- `documentos` e `documento_historico`
- `mensagens` e `notificacoes`
- `agenda_eventos`
- `assinaturas_eletronicas` e `assinantes_documentos`
- `termos_lgpd` e `consentimentos_lgpd`
- `verificacao_identidade`
- `pagamentos`
- `avaliacoes`
- `auditoria`

---

#### [DIAGRAMAS_ER.md](./DIAGRAMAS_ER.md)
Diagramas visuais completos em formato Mermaid.

**Conteúdo:**
- 📊 Diagrama Geral do Sistema
- 📊 Diagramas por Módulo:
  - Módulo de Usuários
  - Módulo de Processos
  - Módulo de Documentos
  - Módulo de Comunicação
  - Módulo de Agenda
  - Módulo de Assinaturas e LGPD
  - Módulo de Verificação
  - Módulo de Pagamentos
- 🔄 Diagramas de Fluxo de Dados
- 🔄 Diagramas de Sequência
- 📈 Diagrama de Estados do Processo
- 🏗️ Diagrama de Componentes
- 🚀 Diagrama de Implantação
- 📚 Diagrama de Classes

**Como visualizar:**
- Renderização automática no GitHub
- VS Code com extensão "Markdown Preview Mermaid Support"
- [Mermaid Live Editor](https://mermaid.live/)

---

#### [INDICE_DIAGRAMAS.md](./INDICE_DIAGRAMAS.md)
Catálogo completo de todos os 22 diagramas disponíveis.

**Conteúdo:**
- 📊 9 Diagramas ER por módulo
- 🔄 4 Diagramas de fluxo e sequência
- 🏗️ 3 Diagramas de arquitetura
- 📋 5 Diagramas ASCII simplificados
- 🎨 Guia de uso por persona
- 🔧 Ferramentas de visualização

**Diagramas Organizados por:**
- Tipo (ER, Fluxo, Sequência, Componentes)
- Módulo (Usuários, Processos, Documentos, etc.)
- Persona (Backend, Frontend, DBA, Arquiteto, PM)

---

#### [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
Referência rápida com diagramas ASCII e queries úteis.

**Conteúdo:**
- ⚡ Diagramas ASCII simplificados
- 🔍 Queries SQL mais comuns
- 📊 Índices e performance
- 🎯 Tipos de dados importantes
- 💡 Dicas de uso e boas práticas
- 🔄 Ciclo de vida dos dados
- 🛡️ Segurança em camadas

**Uso:**
- Consulta rápida durante desenvolvimento
- Referência de queries
- Guia de boas práticas

---

### ⚙️ Funcionalidades

#### [funcionalidades.md](./funcionalidades.md)
Documentação das funcionalidades implementadas e planejadas.

**Conteúdo:**
- Lista de funcionalidades por módulo
- Status de implementação
- Descrição detalhada de cada feature

---

#### [SITEMAP_FLUXOS.md](./SITEMAP_FLUXOS.md)
Mapa do site e fluxos de navegação.

**Conteúdo:**
- Estrutura de rotas da aplicação
- Fluxos de usuário por perfil
- Jornadas principais

---

## 🎯 Visão Geral do Sistema

### Tipos de Usuários

1. **👤 Clientes** (Pessoa Física ou Jurídica)
   - Criar e acompanhar processos
   - Enviar documentos
   - Comunicar com advogado
   - Acompanhar agenda

2. **⚖️ Advogados**
   - Atender processos
   - Gerenciar documentos
   - Chat com clientes
   - Agenda de compromissos
   - Receber avaliações

3. **👥 Administradores**
   - Verificar usuários
   - Gerenciar processos
   - Monitorar sistema
   - Gerar relatórios

4. **🏢 Sindicados** (Sindicatos/Cooperativas)
   - Vincular advogados
   - Acompanhar processos de associados
   - Gerenciar documentação

---

## 🏗️ Arquitetura Técnica

### Frontend
- **Framework**: Angular 14+
- **UI Library**: PrimeNG
- **Estilos**: SCSS com tema customizado
- **Gerenciamento de Estado**: RxJS + Services

### Backend (Planejado)
- **Linguagem**: Node.js / NestJS
- **API**: RESTful
- **Autenticação**: JWT
- **Documentação**: Swagger/OpenAPI

### Banco de Dados
- **SGBD**: PostgreSQL 14+
- **Features**:
  - JSONB para dados flexíveis
  - Full-text search em português
  - Row Level Security
  - Triggers automáticos
  - Particionamento de tabelas

### Armazenamento
- **Documentos**: S3 / Azure Blob Storage
- **Cache**: Redis
- **Busca**: Elasticsearch (opcional)

---

## 📊 Módulos Principais

### 1. Gestão de Usuários
- Cadastro multi-perfil
- Verificação de identidade
- Perfil e configurações
- Autenticação e autorização

### 2. Gestão de Processos
- Criação e atribuição
- Acompanhamento de status
- Timeline de atividades
- Filtros e buscas avançadas

### 3. Gestão de Documentos
- Upload com validação
- Versionamento
- Categorização
- Assinaturas eletrônicas
- Histórico de ações

### 4. Comunicação
- Chat em tempo real
- Sistema de notificações
- Email e push notifications
- Mensagens com anexos

### 5. Agenda
- Eventos e compromissos
- Lembretes automáticos
- Modalidades (presencial/online)
- Eventos recorrentes

### 6. LGPD e Compliance
- Termos de uso e privacidade
- Consentimentos granulares
- Auditoria completa
- Direito ao esquecimento

### 7. Pagamentos
- Múltiplos métodos
- Parcelamento
- Integração com gateways
- Comprovantes e notas fiscais

### 8. Avaliações
- Sistema multi-critério
- Moderação
- Resposta do advogado
- Cálculo de média automático

---

## 🔐 Segurança

### Implementações
- ✅ Criptografia de senhas (bcrypt)
- ✅ Row Level Security (RLS)
- ✅ Soft delete para auditoria
- ✅ Validação de dados (constraints)
- ✅ Logs de auditoria completos
- ✅ Controle de acesso granular

### LGPD
- ✅ Registro de consentimentos
- ✅ Direito de acesso aos dados
- ✅ Direito de correção
- ✅ Direito de exclusão
- ✅ Portabilidade de dados
- ✅ Auditoria completa

---

## 🚀 Performance

### Estratégias
- **Índices otimizados**: Simples, compostos, parciais e GIN
- **Particionamento**: Para tabelas de alto volume
- **Cache**: Redis para queries frequentes
- **CDN**: Para assets estáticos
- **Lazy Loading**: Componentes Angular
- **Virtual Scroll**: Para listas grandes

### Monitoramento
- **Banco de Dados**: pg_stat_statements
- **Aplicação**: Métricas de performance
- **Logs**: Agregação e análise
- **Alertas**: Notificações automáticas

---

## 📝 Convenções

### Nomenclatura
- **Tabelas**: Plural, snake_case (`usuarios`, `processos`)
- **Colunas**: Singular, snake_case (`nome`, `data_criacao`)
- **Chaves Primárias**: UUID com nome `id`
- **Chaves Estrangeiras**: `{tabela}_id` (`cliente_id`)
- **Timestamps**: `data_{acao}` ou `{acao}_at`

### Status e Enums
- Sempre em português
- Snake_case minúsculo
- Documentados em CHECK constraints

### JSONB
- Usado para metadados flexíveis
- Documentar estrutura esperada
- Indexar com GIN quando necessário

---

## 🧪 Testes

### Planejados
- [ ] Testes unitários (Jest)
- [ ] Testes de integração
- [ ] Testes E2E (Cypress)
- [ ] Testes de carga (K6)
- [ ] Testes de segurança

---

## 📦 Deployment

### Ambientes
- **Desenvolvimento**: Local
- **Staging**: Pré-produção
- **Produção**: Produção

### CI/CD
- Pipeline automatizado
- Testes automáticos
- Migrations automáticas
- Rollback automático

---

## 🔄 Versionamento

### Banco de Dados
- **Ferramenta**: Flyway / Liquibase
- **Convenção**: `V{versao}__{descricao}.sql`
- **Exemplo**: `V001__create_usuarios_table.sql`

### API
- **Versionamento**: Semântico (SemVer)
- **URL**: `/api/v1/...`

---

## 📞 Suporte e Contato

### Documentação Adicional
- **README Principal**: `../README.md`
- **Código Fonte**: `../src/`
- **Assets**: `../src/assets/`

### Próximas Implementações
1. API Backend completa
2. Integração com gateways de pagamento
3. Sistema de relatórios
4. App mobile (PWA)
5. Inteligência artificial para sugestões

---

## 📚 Glossário

| Termo | Significado |
|-------|-------------|
| **UUID** | Identificador Único Universal (128 bits) |
| **JSONB** | Tipo de dado JSON binário do PostgreSQL |
| **GIN** | Generalized Inverted Index (índice para JSONB e arrays) |
| **RLS** | Row Level Security (segurança em nível de linha) |
| **Soft Delete** | Exclusão lógica (marca como deletado sem remover fisicamente) |
| **OAB** | Ordem dos Advogados do Brasil |
| **LGPD** | Lei Geral de Proteção de Dados |
| **JWT** | JSON Web Token (autenticação) |

---

## 📈 Roadmap

### Fase 1 - MVP ✅
- [x] Frontend Angular com PrimeNG
- [x] Modelagem do banco de dados
- [x] Diagramas ER
- [x] Documentação inicial

### Fase 2 - Backend 🚧
- [ ] API REST completa
- [ ] Autenticação JWT
- [ ] Integração com banco
- [ ] Migrations

### Fase 3 - Integrações 📋
- [ ] Gateway de pagamento
- [ ] Envio de emails
- [ ] SMS
- [ ] Storage (S3)
- [ ] OCR de documentos

### Fase 4 - Avançado 🔮
- [ ] WebSocket para chat em tempo real
- [ ] Notificações push
- [ ] Relatórios avançados
- [ ] Dashboard analytics
- [ ] IA para sugestões

---

**Última atualização**: 2024  
**Versão da Documentação**: 1.0  
**Mantido por**: Equipe de Desenvolvimento


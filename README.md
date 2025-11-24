# 🏛️ Plataforma Jurídica PrimeNG

![Angular](https://img.shields.io/badge/Angular-17.3-red?logo=angular)
![PrimeNG](https://img.shields.io/badge/PrimeNG-17.18-blue?logo=primeng)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

Plataforma web completa para gestão de processos jurídicos, desenvolvida com Angular 17 e PrimeNG. Sistema moderno e responsivo que conecta clientes, advogados, administradores e sindicatos em um ambiente seguro e eficiente.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Executando o Projeto](#-executando-o-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Banco de Dados](#-banco-de-dados)
- [Configuração](#-configuração)
- [Docker](#-docker)
- [Deployment](#-deployment)
- [Documentação](#-documentação)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

A **Plataforma Jurídica** é uma solução completa para gerenciamento de processos jurídicos que facilita a comunicação entre diferentes atores do sistema judiciário:

### 👥 Perfis de Usuário

- **👤 Clientes** (PF/PJ): Acompanham processos, enviam documentos e comunicam com advogados
- **⚖️ Advogados**: Gerenciam processos, documentos e agenda de compromissos
- **👨‍💼 Administradores**: Verificam usuários, gerenciam processos e monitoram o sistema
- **🏢 Sindicados**: Vinculam advogados e acompanham processos de associados

---

## ✨ Funcionalidades

### 📂 Gestão de Processos
- ✅ Criação e acompanhamento de processos jurídicos
- ✅ Timeline de atividades e atualizações
- ✅ Atribuição automática de advogados
- ✅ Sistema de status e prioridades
- ✅ Filtros e busca avançada

### 📄 Gestão de Documentos
- ✅ Upload e download de documentos
- ✅ Versionamento de arquivos
- ✅ Categorização automática
- ✅ Assinaturas eletrônicas
- ✅ Histórico completo de ações

### 💬 Comunicação
- ✅ Chat em tempo real
- ✅ Sistema de notificações
- ✅ Mensagens com anexos
- ✅ Notificações por email

### 📅 Agenda
- ✅ Calendário de eventos e compromissos
- ✅ Lembretes automáticos
- ✅ Eventos presenciais e online
- ✅ Integração com processos

### 🔐 Segurança e LGPD
- ✅ Autenticação segura
- ✅ Criptografia de senhas (bcrypt)
- ✅ Controle de acesso granular
- ✅ Conformidade com LGPD
- ✅ Auditoria completa
- ✅ Soft delete para rastreabilidade

### 💳 Pagamentos
- ✅ Múltiplos métodos de pagamento
- ✅ Parcelamento
- ✅ Comprovantes e recibos
- ✅ Histórico de transações

### ⭐ Avaliações
- ✅ Sistema de avaliação de advogados
- ✅ Critérios múltiplos
- ✅ Moderação de comentários
- ✅ Resposta do profissional

---

## 🚀 Tecnologias

### Frontend
- **[Angular 17.3](https://angular.io/)** - Framework principal
- **[PrimeNG 17.18](https://primeng.org/)** - Biblioteca de componentes UI
- **[PrimeFlex 3.3](https://primeflex.org/)** - Utilities CSS
- **[PrimeIcons 7.0](https://primefaces.org/primeicons/)** - Ícones
- **[Chart.js 4.4](https://www.chartjs.org/)** - Gráficos e dashboards
- **[date-fns 3.6](https://date-fns.org/)** - Manipulação de datas
- **[RxJS 7.8](https://rxjs.dev/)** - Programação reativa

### Backend (Planejado)
- **Node.js** / **NestJS**
- **JWT** para autenticação
- **RESTful API**

### Banco de Dados
- **[PostgreSQL 14+](https://www.postgresql.org/)** - Banco de dados principal
- **Extensões**: uuid-ossp, pgcrypto, pg_trgm, unaccent

### DevOps
- **[Docker](https://www.docker.com/)** - Containerização
- **[Git](https://git-scm.com/)** - Controle de versão

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **[Node.js](https://nodejs.org/)** (versão 20.x ou superior)
- **[npm](https://www.npmjs.com/)** (geralmente vem com Node.js)
- **[Git](https://git-scm.com/)**
- **[PostgreSQL 14+](https://www.postgresql.org/)** (para banco de dados)
- **[Docker](https://www.docker.com/)** (opcional, para containerização)

### Verificar Instalações

```bash
node --version  # Deve retornar v20.x ou superior
npm --version   # Deve retornar 9.x ou superior
git --version   # Qualquer versão recente
psql --version  # Deve retornar 14.x ou superior
```

---

## 🔧 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/plataforma-juridica-primeng.git
cd plataforma-juridica-primeng
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure o Banco de Dados

#### Opção A: PostgreSQL Local

```bash
# Crie o banco de dados
createdb plataforma_juridica

# Execute os scripts de configuração
psql -d plataforma_juridica -f database/000_master_setup.sql
psql -d plataforma_juridica -f database/001_initial_setup.sql
psql -d plataforma_juridica -f database/002_create_tables_usuarios.sql
psql -d plataforma_juridica -f database/003_create_tables_processos.sql
psql -d plataforma_juridica -f database/004_create_tables_documentos.sql
psql -d plataforma_juridica -f database/005_create_tables_comunicacao.sql
psql -d plataforma_juridica -f database/006_create_tables_agenda_lgpd_verificacao.sql
psql -d plataforma_juridica -f database/007_create_tables_pagamentos_auditoria.sql
psql -d plataforma_juridica -f database/008_create_views.sql
psql -d plataforma_juridica -f database/009_seed_data.sql
```

#### Opção B: Docker

```bash
# Subir PostgreSQL com Docker
docker run --name plataforma-juridica-db \
  -e POSTGRES_DB=plataforma_juridica \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:14-alpine
```

### 4. Configure as Variáveis de Ambiente

Edite o arquivo `src/environments/environment.ts` conforme necessário:

```typescript
export const environment = {
  production: false,
  port: 5050,
  useMock: true, // true para usar dados mock, false para API real
  apiUrl: 'http://localhost:3000/api' // URL da API backend (quando disponível)
};
```

---

## ▶️ Executando o Projeto

### Modo Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento na porta 5050
npm start

# Ou usando o comando completo
npm run start:dev
```

A aplicação estará disponível em **http://localhost:5050**

### Modo Produção (Build)

```bash
# Gera build de produção
npm run build:prod

# Os arquivos estarão em dist/plataforma-juridica-primeng/
```

### Usando Scripts Auxiliares (Windows)

```bash
# Configuração inicial
.\setup.bat

# Iniciar aplicação
.\start.bat
```

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia servidor dev (porta 5050)
npm run start:dev      # Inicia com configuração de desenvolvimento

# Build
npm run build          # Build padrão
npm run build:prod     # Build de produção otimizado
npm run build:dev      # Build de desenvolvimento

# Testes
npm test               # Executa testes unitários
npm run lint           # Verifica código com linter

# Outros
npm run watch          # Build incremental (watch mode)
npm run serve          # Serve build de produção
```

---

## 📁 Estrutura do Projeto

```
plataforma-juridica-primeng/
├── 📁 database/              # Scripts SQL do banco de dados
│   ├── 000_master_setup.sql
│   ├── 001_initial_setup.sql
│   ├── 002_create_tables_usuarios.sql
│   ├── 003_create_tables_processos.sql
│   ├── 004_create_tables_documentos.sql
│   ├── 005_create_tables_comunicacao.sql
│   ├── 006_create_tables_agenda_lgpd_verificacao.sql
│   ├── 007_create_tables_pagamentos_auditoria.sql
│   ├── 008_create_views.sql
│   ├── 009_seed_data.sql
│   ├── 999_rollback.sql
│   └── README.md
│
├── 📁 docs/                  # Documentação completa
│   ├── README.md             # Índice da documentação
│   ├── MODELAGEM_BANCO_DADOS.md
│   ├── DIAGRAMAS_ER.md
│   ├── INDICE_DIAGRAMAS.md
│   ├── QUICK_REFERENCE.md
│   ├── funcionalidades.md
│   └── SITEMAP_FLUXOS.md
│
├── 📁 src/                   # Código fonte
│   ├── 📁 app/
│   │   ├── 📁 core/         # Serviços e utilitários core
│   │   │   ├── constants/
│   │   │   ├── guards/      # Guards de autenticação
│   │   │   ├── models/      # Interfaces e modelos
│   │   │   ├── services/    # Serviços da aplicação
│   │   │   └── styles/      # Estilos globais
│   │   │
│   │   ├── 📁 pages/        # Páginas/módulos da aplicação
│   │   │   ├── admin/       # Módulo administrativo
│   │   │   ├── advogado/    # Módulo do advogado
│   │   │   ├── auth/        # Autenticação e login
│   │   │   ├── cliente/     # Módulo do cliente
│   │   │   ├── onboarding/  # Processo de cadastro
│   │   │   └── shared-pages/ # Páginas compartilhadas
│   │   │
│   │   ├── 📁 shared/       # Componentes compartilhados
│   │   │   ├── components/
│   │   │   └── types/
│   │   │
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   │
│   ├── 📁 assets/           # Assets estáticos
│   │   ├── img/
│   │   ├── mock/            # Dados mock para desenvolvimento
│   │   └── styles/
│   │
│   ├── 📁 environments/     # Configurações de ambiente
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss          # Estilos globais
│   └── polyfills.ts
│
├── 📁 dist/                 # Build de produção (gerado)
│
├── .gitignore
├── angular.json             # Configuração do Angular
├── Dockerfile               # Configuração Docker
├── package.json             # Dependências do projeto
├── tsconfig.json            # Configuração TypeScript
├── README.md               # Este arquivo
└── ...
```

---

## 🗄️ Banco de Dados

### Arquitetura

O banco de dados PostgreSQL possui **25 tabelas principais** organizadas em módulos:

- **Usuários**: `usuarios`, `clientes`, `advogados`, `admins`, `sindicados`
- **Processos**: `processos`, `processo_atividades`
- **Documentos**: `documentos`, `documento_historico`, `assinaturas_eletronicas`
- **Comunicação**: `mensagens`, `notificacoes`
- **Agenda**: `agenda_eventos`
- **LGPD**: `termos_lgpd`, `consentimentos_lgpd`
- **Pagamentos**: `pagamentos`
- **Outros**: `avaliacoes`, `auditoria`, `verificacao_identidade`

### Principais Features

- ✅ UUID como chave primária
- ✅ Timestamps automáticos (triggers)
- ✅ Soft delete para auditoria
- ✅ Índices otimizados (B-tree, GIN, parciais)
- ✅ Full-text search em português
- ✅ Row Level Security (RLS)
- ✅ Criptografia de senhas (bcrypt)
- ✅ Validações com constraints
- ✅ JSONB para metadados flexíveis

### Scripts de Banco

```bash
# Criar todas as tabelas
psql -d plataforma_juridica -f database/001_initial_setup.sql
# ... (executar demais scripts)

# Seed com dados de exemplo
psql -d plataforma_juridica -f database/009_seed_data.sql

# Rollback (se necessário)
psql -d plataforma_juridica -f database/999_rollback.sql
```

### Documentação Detalhada

Para mais informações sobre o banco de dados, consulte:
- [📊 Modelagem Completa](./docs/MODELAGEM_BANCO_DADOS.md)
- [📐 Diagramas ER](./docs/DIAGRAMAS_ER.md)
- [⚡ Referência Rápida](./docs/QUICK_REFERENCE.md)

---

## ⚙️ Configuração

### Ambiente de Desenvolvimento

O arquivo `src/environments/environment.ts` contém as configurações para desenvolvimento:

```typescript
export const environment = {
  production: false,
  port: 5050,
  useMock: true, // Usar dados mock
  apiUrl: 'http://localhost:3000/api'
};
```

### Ambiente de Produção

O arquivo `src/environments/environment.prod.ts` contém as configurações para produção:

```typescript
export const environment = {
  production: true,
  port: 80,
  useMock: false, // Usar API real
  apiUrl: 'https://api.plataforma-juridica.com.br/api'
};
```

### Temas PrimeNG

O projeto utiliza tema customizado do PrimeNG. Para alterar:

1. Edite `angular.json` na seção `styles`
2. Customize em `src/styles.scss`

---

## 🐳 Docker

### Desenvolvimento com Docker

```bash
# Build da imagem
docker build -t plataforma-juridica:dev .

# Executar container
docker run -d \
  --name plataforma-juridica-app \
  -p 5050:5050 \
  -v $(pwd):/app \
  -v /app/node_modules \
  plataforma-juridica:dev
```

### Docker Compose (Recomendado)

Crie um arquivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # Banco de dados
  db:
    image: postgres:14-alpine
    container_name: plataforma-juridica-db
    environment:
      POSTGRES_DB: plataforma_juridica
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database:/docker-entrypoint-initdb.d
    networks:
      - plataforma-network

  # Aplicação Angular
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: plataforma-juridica-app
    ports:
      - "5050:5050"
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db
    networks:
      - plataforma-network

volumes:
  postgres_data:

networks:
  plataforma-network:
    driver: bridge
```

Execute com:

```bash
docker-compose up -d
```

---

## 🚀 Deployment

### Build de Produção

```bash
# Gerar build otimizado
npm run build:prod

# Arquivos gerados em: dist/plataforma-juridica-primeng/
```

### Deploy Manual

```bash
# Copiar arquivos para servidor
scp -r dist/plataforma-juridica-primeng/* usuario@servidor:/var/www/html/

# Configurar servidor web (Nginx, Apache, etc.)
```

### Deploy com Scripts PowerShell

O projeto inclui scripts PowerShell para deployment:

```powershell
# Deploy completo
.\deploy-plataforma-juridica.ps1

# Deploy gerenciado
.\deploy-manager.ps1
```

### Servidores Recomendados

- **Vercel** - Deploy automático de Angular
- **Netlify** - Integração com Git
- **AWS S3 + CloudFront** - Hospedagem estática
- **Google Cloud Platform** - App Engine
- **Azure** - Static Web Apps

### Nginx (Exemplo de Configuração)

```nginx
server {
    listen 80;
    server_name plataforma-juridica.com.br;
    root /var/www/html/plataforma-juridica;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 📚 Documentação

### Documentação Completa

O projeto possui documentação extensa na pasta `docs/`:

| Documento | Descrição |
|-----------|-----------|
| [📚 Índice Principal](./docs/README.md) | Visão geral da documentação |
| [📊 Modelagem BD](./docs/MODELAGEM_BANCO_DADOS.md) | Estrutura completa do banco |
| [📐 Diagramas ER](./docs/DIAGRAMAS_ER.md) | Diagramas visuais Mermaid |
| [📑 Índice Diagramas](./docs/INDICE_DIAGRAMAS.md) | Catálogo de 22 diagramas |
| [⚡ Referência Rápida](./docs/QUICK_REFERENCE.md) | Guia rápido e queries |
| [⚙️ Funcionalidades](./docs/funcionalidades.md) | Features do sistema |
| [🗺️ Sitemap](./docs/SITEMAP_FLUXOS.md) | Mapa e fluxos |

### Módulos da Aplicação

- **Admin**: Gestão administrativa
- **Advogado**: Interface do advogado
- **Cliente**: Interface do cliente
- **Auth**: Sistema de autenticação
- **Onboarding**: Processo de cadastro
- **Shared**: Componentes compartilhados

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

### 1. Fork o Projeto

```bash
# Fork pelo GitHub e clone seu fork
git clone https://github.com/seu-usuario/plataforma-juridica-primeng.git
```

### 2. Crie uma Branch

```bash
git checkout -b feature/minha-funcionalidade
```

### 3. Faça suas Alterações

```bash
# Faça commits descritivos
git add .
git commit -m "feat: adiciona nova funcionalidade X"
```

### 4. Push e Pull Request

```bash
git push origin feature/minha-funcionalidade
```

Abra um Pull Request no GitHub descrevendo suas alterações.

### Padrões de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Alterações na documentação
- `style:` Formatação de código
- `refactor:` Refatoração de código
- `test:` Adição de testes
- `chore:` Tarefas de manutenção

### Code Style

- Use **4 espaços** para indentação
- Siga as convenções do **Angular Style Guide**
- Use **PascalCase** para classes
- Use **camelCase** para variáveis e funções
- Use **kebab-case** para nomes de arquivos

---

## 🧪 Testes

### Testes Unitários

```bash
# Executar testes
npm test

# Executar com coverage
npm test -- --code-coverage
```

### Testes E2E (Planejado)

```bash
# Cypress ou Playwright
npm run e2e
```

---

## 🐛 Problemas Conhecidos

- ⚠️ Backend em desenvolvimento (atualmente usa dados mock)
- ⚠️ Integração com gateway de pagamento pendente
- ⚠️ Notificações push em implementação

---

## 📞 Suporte

Para questões e suporte:

- 📧 Email: suporte@plataforma-juridica.com.br
- 📱 Telefone: (11) 9999-9999
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/plataforma-juridica-primeng/issues)

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 👏 Agradecimentos

- [Angular Team](https://angular.io/)
- [PrimeTek](https://www.primefaces.org/)
- [PostgreSQL Community](https://www.postgresql.org/)
- Comunidade Open Source

---

## 📊 Status do Projeto

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

### Roadmap

- [x] **Fase 1 - MVP Frontend** ✅
  - [x] Interface completa com Angular + PrimeNG
  - [x] Módulos de Admin, Advogado e Cliente
  - [x] Sistema de autenticação (mock)
  - [x] Modelagem completa do banco de dados
  
- [ ] **Fase 2 - Backend** 🚧
  - [ ] API REST com NestJS
  - [ ] Autenticação JWT
  - [ ] Integração com PostgreSQL
  - [ ] Migrations automáticas
  
- [ ] **Fase 3 - Integrações** 📋
  - [ ] Gateway de pagamento
  - [ ] Envio de emails (SendGrid/AWS SES)
  - [ ] Storage de arquivos (S3/Azure)
  - [ ] OCR de documentos
  
- [ ] **Fase 4 - Avançado** 🔮
  - [ ] WebSocket para chat em tempo real
  - [ ] Notificações push
  - [ ] Dashboard analytics
  - [ ] PWA (Progressive Web App)
  - [ ] IA para sugestões

---

<div align="center">

**Desenvolvido com ❤️ usando Angular e PrimeNG**

[⬆ Voltar ao topo](#-plataforma-jurídica-primeng)

</div>






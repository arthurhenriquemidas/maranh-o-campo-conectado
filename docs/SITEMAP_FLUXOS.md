# Sitemap e Fluxos - Plataforma Jurídica

## Análise dos Documentos

### Perfis de Usuário Identificados
1. **Cliente** (Pessoa Física/Jurídica) - Usuário leigo que precisa de serviços jurídicos
2. **Advogado** - Profissional que presta serviços jurídicos
3. **Administrador** - Gerencia a plataforma e atribui processos

### Funcionalidades Principais Extraídas
- Autenticação e cadastro para os 3 perfis
- Gestão de processos jurídicos com workflow
- Sistema de chat entre cliente e advogado
- Painel administrativo para atribuição de processos
- Upload e gestão de documentos
- Sistema de aprovação/rejeição de conclusão

## Sitemap (Árvore de Rotas)

```
/
├── auth/
│   ├── login
│   ├── register
│   │   ├── cliente
│   │   ├── advogado
│   │   └── admin
│   ├── forgot-password
│   └── reset-password
├── onboarding/
│   ├── welcome
│   ├── profile-setup
│   └── verification
├── cliente/
│   ├── dashboard
│   ├── processos/
│   │   ├── lista
│   │   ├── novo
│   │   ├── detalhes/:id
│   │   └── documentos/:id
│   ├── chat/:processoId
│   └── perfil
├── advogado/
│   ├── dashboard
│   ├── processos/
│   │   ├── lista
│   │   ├── detalhes/:id
│   │   └── documentos/:id
│   ├── chat/:processoId
│   └── perfil
├── admin/
│   ├── dashboard
│   ├── processos/
│   │   ├── disponíveis
│   │   ├── atribuir/:id
│   │   └── todos
│   ├── usuarios/
│   │   ├── clientes
│   │   ├── advogados
│   │   └── verificacao
│   └── configuracoes
├── shared/
│   ├── ajuda
│   ├── faq
│   ├── termos-uso
│   ├── politica-privacidade
│   └── contato
└── error/
    ├── 404
    └── 500
```

## Fluxos Principais

### 1. Fluxo de Onboarding do Cliente (Usuário Leigo)

```mermaid
flowchart TD
    A[Landing Page] --> B{Possui conta?}
    B -->|Não| C[Escolher Tipo: PF/PJ]
    B -->|Sim| D[Login]
    C --> E[Cadastro Cliente]
    E --> F[Verificação E-mail]
    F --> G[Bem-vindo - Tutorial]
    G --> H[Criar Primeiro Processo]
    H --> I[Dashboard Cliente]
    D --> I
```

### 2. Fluxo de Processo (Cliente → Advogado → Conclusão)

```mermaid
flowchart TD
    A[Cliente cria processo] --> B[Processo aguardando atribuição]
    B --> C[Admin atribui advogado]
    C --> D[Advogado aceita/rejeita]
    D -->|Aceita| E[Processo em andamento]
    D -->|Rejeita| B
    E --> F[Chat Cliente ↔ Advogado]
    F --> G[Upload documentos]
    G --> H[Advogado trabalha no caso]
    H --> I[Advogado solicita conclusão]
    I --> J{Cliente aprova?}
    J -->|Sim| K[Processo concluído]
    J -->|Não| L[Volta para andamento]
    L --> F
```

### 3. Fluxo de Verificação de Advogado

```mermaid
flowchart TD
    A[Advogado se cadastra] --> B[Upload OAB + Documentos]
    B --> C[Status: Pendente]
    C --> D[Admin analisa]
    D --> E{Aprovado?}
    E -->|Sim| F[Status: Verificado]
    E -->|Não| G[Status: Rejeitado]
    F --> H[Pode receber processos]
    G --> I[Reenviar documentação]
    I --> C
```

## Páginas Prioritárias para o Protótipo

### 1. Páginas de Autenticação
- **Login** - Simples, com opção de recuperar senha
- **Registro** - Wizard em 3 passos (tipo usuário → dados → verificação)
- **Esqueci Senha** - Form simples com feedback

### 2. Onboarding/Welcome
- **Boas-vindas** - Hero section com benefícios claros
- **Tutorial Interativo** - Para clientes leigos (opcional)

### 3. Dashboard por Perfil
- **Cliente**: Cards com métricas, processos recentes, próximos passos
- **Advogado**: Processos ativos, pendências, chat alerts
- **Admin**: Métricas gerais, processos para atribuir, alerts

### 4. Gestão de Processos
- **Lista** - DataTable com filtros, busca, paginação
- **Detalhes** - Timeline de atividades, documentos, chat
- **Criar/Editar** - Forms com wizard para clientes leigos

### 5. Sistema de Chat
- **Interface** - Similar WhatsApp, com anexos e status

### 6. Estados Especiais
- **Empty States** - Para listas vazias com CTAs claros
- **Loading** - Skeletons em todas as listas/forms
- **Error** - Páginas 404/500 amigáveis

## Considerações para Usuários Leigos

### Linguagem e Microcópias
- Evitar jargões jurídicos
- Tooltips explicativos com ícone (i)
- Textos de ajuda contextuais
- CTAs claros ("Criar meu primeiro processo" vs "Novo")

### Navegação Simplificada
- Breadcrumb sempre visível
- Menu com ícones e labels claros
- Progresso visível em wizards
- Confirmações para ações importantes

### Feedback Visual
- Toast notifications para todas as ações
- Estados de loading em botões
- Validação inline nos forms
- Progress bars para uploads

## Dados Mock Necessários

### Entidades Principais
```json
{
  "usuarios": {
    "clientes": [...],
    "advogados": [...],
    "admins": [...]
  },
  "processos": {
    "status": ["aberto", "em_andamento", "aguardando_cliente", "concluido"],
    "tipos": ["trabalhista", "civil", "criminal", "familia", "tributario"],
    "lista": [...]
  },
  "mensagens": [...],
  "documentos": [...],
  "atividades": [...]
}
```

## Próximos Passos
1. Configurar projeto Angular com PrimeNG
2. Implementar layout base responsivo
3. Criar serviços mock com delay simulado
4. Implementar páginas por ordem de prioridade
5. Adicionar estados de UI e i18n
6. Testes de usabilidade com foco em leigos

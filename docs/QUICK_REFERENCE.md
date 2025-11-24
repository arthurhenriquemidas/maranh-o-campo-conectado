# 🚀 Referência Rápida - Plataforma Jurídica

Guia visual rápido da estrutura do banco de dados.

---

## 📊 Visão Geral das Tabelas

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PLATAFORMA JURÍDICA - DATABASE                   │
│                          25 Tabelas Principais                       │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   USUÁRIOS   │    │   PROCESSOS  │    │  DOCUMENTOS  │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ • usuarios   │───▶│ • processos  │───▶│ • documentos │
│ • clientes   │    │ • atividades │    │ • historico  │
│ • advogados  │    │ • avaliacoes │    │ • assinaturas│
│ • admins     │    │              │    │              │
│ • sindicados │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ VERIFICAÇÃO  │    │ COMUNICAÇÃO  │    │    AGENDA    │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ • verificacao│    │ • mensagens  │    │ • eventos    │
│ • doc_verif  │    │ • notificacoes│   │              │
└──────────────┘    └──────────────┘    └──────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  LGPD/GDPR   │    │  PAGAMENTOS  │    │  AUDITORIA   │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ • termos     │    │ • pagamentos │    │ • auditoria  │
│ • consenti-  │    │              │    │ • logs       │
│   mentos     │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 🏗️ Hierarquia de Usuários

```
                    ┌─────────────────────┐
                    │      USUARIOS       │
                    │   (Tabela Pai)      │
                    │ ─────────────────── │
                    │ id (PK)             │
                    │ nome                │
                    │ email (UK)          │
                    │ senha_hash          │
                    │ tipo_usuario        │
                    │ status              │
                    │ endereco            │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                │              │              │
      ┌─────────▼────────┐   ┌▼──────────┐  ┌▼──────────┐
      │    CLIENTES      │   │ ADVOGADOS │  │  ADMINS   │
      │ ──────────────── │   │ ───────── │  │ ───────── │
      │ id (PK,FK)       │   │ id (PK,FK)│  │ id (PK,FK)│
      │ cpf/cnpj (UK)    │   │ numero_oab│  │ nivel     │
      │ tipo_pessoa      │   │ uf_oab    │  │ permissoes│
      │ verificado       │   │ especiali.│  │           │
      └──────────────────┘   │ avaliacao │  └───────────┘
                             │ verificado│
                             └───────────┘
                
      ┌─────────────────────────────────┐
      │         SINDICADOS              │
      │ ─────────────────────────────── │
      │ id (PK,FK)                      │
      │ cnpj (UK)                       │
      │ razao_social                    │
      │ tipo_sindicado                  │
      │ registro_sindical               │
      │ representante_legal             │
      └─────────────────────────────────┘
```

---

## 📝 Fluxo de Processo

```
┌──────────┐
│ CLIENTE  │
└────┬─────┘
     │ cria
     ▼
┌────────────────────┐
│   ABERTO           │──────┐
│ (sem advogado)     │      │ rejeita
└────────┬───────────┘      │
         │                  ▼
         │ atribui    ┌─────────────┐
         ▼            │  REJEITADO  │
┌────────────────────┐└─────────────┘
│  EM ANDAMENTO      │
│ (com advogado)     │
└────────┬───────────┘
         │
    ┌────┼────┐
    │    │    │
    ▼    ▼    ▼
 ┌─────┐ ┌─────┐ ┌─────┐
 │DOCS │ │MSGS │ │EVTS │
 └─────┘ └─────┘ └─────┘
    │
    ▼
┌────────────────────┐
│ AGUARDANDO CLIENTE │◄──┐
│ (precisa docs)     │   │
└────────┬───────────┘   │
         │                │
         │ cliente envia  │
         ▼                │
┌────────────────────┐   │
│ EM ANDAMENTO       │───┘
└────────┬───────────┘
         │
         │ advogado conclui
         ▼
┌────────────────────┐
│ AGUARDANDO         │
│ APROVAÇÃO          │
└────────┬───────────┘
         │
    ┌────┼────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────┐
│APROVADO │ │ REVISÃO  │
└────┬────┘ └────┬─────┘
     │           │
     │           └──────┐
     │                  │
     ▼                  ▼
┌─────────┐      ┌────────────┐
│CONCLUÍDO│      │ EM ANDAMEN.│
└────┬────┘      └────────────┘
     │
     │ pagamento + avaliação
     ▼
┌──────────┐
│ARQUIVADO │
└──────────┘
```

---

## 🔐 Relacionamentos Chave

### Cliente → Processos (1:N)
```
CLIENTES                    PROCESSOS
┌────────────┐             ┌────────────┐
│ id (PK)    │──────┐      │ id (PK)    │
│ nome       │      └─────▶│ cliente_id │
│ cpf/cnpj   │             │ advogado_id│
└────────────┘             │ status     │
                           │ tipo       │
                           └────────────┘
```

### Advogado → Processos (1:N)
```
ADVOGADOS                  PROCESSOS
┌────────────┐             ┌────────────┐
│ id (PK)    │──────┐      │ id (PK)    │
│ nome       │      └─────▶│ advogado_id│
│ numero_oab │             │ cliente_id │
│ avaliacao  │◄──┐         │ status     │
└────────────┘   │         └────────────┘
                 │                │
                 │                │
              ┌──┴────────┐      │
              │AVALIACOES │      │
              │───────────│◄─────┘
              │processo_id│
              │nota       │
              └───────────┘
```

### Processo → Documentos (1:N)
```
PROCESSOS                  DOCUMENTOS
┌────────────┐             ┌────────────┐
│ id (PK)    │──────┐      │ id (PK)    │
│ titulo     │      └─────▶│ processo_id│
│ status     │             │ nome       │
└────────────┘             │ categoria  │
                           │ versao     │
                           └──────┬─────┘
                                  │
                           ┌──────▼─────────┐
                           │ ASSINATURAS    │
                           │ ────────────── │
                           │ documento_id   │
                           │ hash_documento │
                           └────────────────┘
```

### Advogado ↔ Sindicado (N:N)
```
ADVOGADOS              ADVOGADO_SINDICADO           SINDICADOS
┌────────────┐         ┌──────────────────┐         ┌────────────┐
│ id (PK)    │◄────┐   │ id (PK)          │   ┌────▶│ id (PK)    │
│ nome       │     └───│ advogado_id (FK) │   │     │ razao_soc. │
│ oab        │         │ sindicado_id (FK)│───┘     │ cnpj       │
└────────────┘         │ status           │         └────────────┘
                       │ tipo_vinculo     │
                       └──────────────────┘
```

---

## 📊 Estatísticas e Métricas

### Contadores Automáticos (via Triggers)

```
PROCESSOS
┌─────────────────────────┐
│ documentos_count        │ ◄─── UPDATE via trigger
│ mensagens_count         │ ◄─── UPDATE via trigger
│ mensagens_nao_lidas     │ ◄─── UPDATE via trigger
│ atividades_count        │ ◄─── UPDATE via trigger
└─────────────────────────┘

ADVOGADOS
┌─────────────────────────┐
│ avaliacao_media         │ ◄─── UPDATE via trigger
│ total_avaliacoes        │ ◄─── UPDATE via trigger
│ total_processos         │ ◄─── UPDATE automático
│ processos_ativos        │ ◄─── UPDATE automático
└─────────────────────────┘
```

---

## 🔍 Índices Principais

### Usuários
```sql
idx_usuarios_email          → email (WHERE deletado = FALSE)
idx_usuarios_tipo           → tipo_usuario
idx_usuarios_status         → status
idx_usuarios_cadastro       → data_cadastro DESC
```

### Processos
```sql
idx_processos_cliente       → cliente_id
idx_processos_advogado      → advogado_id
idx_processos_status        → status
idx_processos_tipo          → tipo
idx_processos_prazo         → prazo_estimado
idx_processos_busca         → GIN(to_tsvector)
```

### Documentos
```sql
idx_documentos_processo     → processo_id
idx_documentos_categoria    → categoria
idx_documentos_checksum     → checksum (duplicatas)
idx_documentos_tags         → GIN(tags)
```

### Mensagens
```sql
idx_mensagens_processo      → processo_id, data_envio DESC
idx_mensagens_nao_lidas     → processo_id, destinatario_id
idx_mensagens_tipo          → tipo_mensagem
```

---

## 🎯 Tipos de Dados Importantes

### UUIDs (Chaves Primárias)
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

### Timestamps
```sql
data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### JSONB (Dados Flexíveis)
```sql
metadata JSONB DEFAULT '{}'::jsonb
-- Exemplo:
{
  "origem": "web",
  "navegador": "Chrome",
  "ip": "192.168.1.1"
}
```

### Arrays
```sql
especialidades TEXT[]
tags TEXT[]
-- Exemplo:
{'trabalhista', 'civil', 'familia'}
```

### Enums (CHECK Constraints)
```sql
status VARCHAR(30) CHECK (
  status IN ('aberto', 'em_andamento', 'concluido')
)
```

---

## ⚡ Queries Comuns

### 1. Buscar Processos do Cliente
```sql
SELECT p.*, 
       u.nome as advogado_nome,
       COUNT(d.id) as total_documentos
FROM processos p
LEFT JOIN advogados a ON p.advogado_id = a.id
LEFT JOIN usuarios u ON a.id = u.id
LEFT JOIN documentos d ON p.id = d.processo_id
WHERE p.cliente_id = :cliente_id
  AND p.deletado = FALSE
GROUP BY p.id, u.nome
ORDER BY p.data_criacao DESC;
```

### 2. Processos Disponíveis para Advogado
```sql
SELECT p.*, 
       uc.nome as cliente_nome,
       uc.telefone as cliente_telefone
FROM processos p
INNER JOIN clientes c ON p.cliente_id = c.id
INNER JOIN usuarios uc ON c.id = uc.id
WHERE p.status = 'aberto'
  AND p.advogado_id IS NULL
  AND p.tipo = ANY(:especialidades_advogado)
  AND p.deletado = FALSE
ORDER BY p.urgencia DESC, p.data_criacao ASC;
```

### 3. Mensagens Não Lidas
```sql
SELECT m.*,
       u.nome as remetente_nome
FROM mensagens m
INNER JOIN usuarios u ON m.remetente_id = u.id
WHERE m.destinatario_id = :usuario_id
  AND m.lida = FALSE
  AND m.deletada = FALSE
ORDER BY m.data_envio DESC;
```

### 4. Próximos Eventos da Agenda
```sql
SELECT ae.*,
       p.titulo as processo_titulo,
       uc.nome as cliente_nome
FROM agenda_eventos ae
LEFT JOIN processos p ON ae.processo_id = p.id
LEFT JOIN clientes c ON ae.cliente_id = c.id
LEFT JOIN usuarios uc ON c.id = uc.id
WHERE ae.advogado_id = :advogado_id
  AND ae.data_evento >= NOW()
  AND ae.status IN ('agendado', 'confirmado')
ORDER BY ae.data_evento ASC
LIMIT 10;
```

### 5. Documentos Pendentes de Assinatura
```sql
SELECT d.*,
       p.titulo as processo_titulo,
       COUNT(ad.id) FILTER (WHERE ad.status_assinatura = 'pendente') as assinaturas_pendentes
FROM documentos d
INNER JOIN processos p ON d.processo_id = p.id
INNER JOIN assinaturas_eletronicas ae ON d.id = ae.documento_id
INNER JOIN assinantes_documentos ad ON ae.id = ad.assinatura_eletronica_id
WHERE ad.usuario_id = :usuario_id
  AND ae.status = 'aguardando_assinaturas'
GROUP BY d.id, p.titulo
HAVING COUNT(ad.id) FILTER (WHERE ad.status_assinatura = 'pendente') > 0;
```

---

## 🛡️ Segurança em Camadas

```
┌─────────────────────────────────────────┐
│         NÍVEL APLICAÇÃO                 │
│  • Autenticação JWT                     │
│  • Autorização por Roles                │
│  • Validação de Inputs                  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      NÍVEL BANCO DE DADOS               │
│  • Row Level Security (RLS)             │
│  • Roles do PostgreSQL                  │
│  • Constraints de Validação             │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│       AUDITORIA E LOGS                  │
│  • Tabela de Auditoria                  │
│  • Triggers de Histórico                │
│  • Log de Ações Sensíveis               │
│  • IP e User Agent                      │
└─────────────────────────────────────────┘
```

---

## 📈 Métricas de Performance

### Tabelas por Volume Esperado

```
ALTO VOLUME (>100K registros/ano)
├─ mensagens
├─ notificacoes
├─ auditoria
├─ documento_historico
└─ log_termos_lgpd
    → Considerar particionamento

MÉDIO VOLUME (10K-100K registros/ano)
├─ processos
├─ documentos
├─ processo_atividades
└─ agenda_eventos
    → Índices otimizados

BAIXO VOLUME (<10K registros/ano)
├─ usuarios
├─ clientes
├─ advogados
├─ avaliacoes
└─ pagamentos
    → Índices básicos
```

---

## 🔄 Ciclo de Vida dos Dados

### Soft Delete
```
ATIVO                    DELETADO
┌──────────┐            ┌──────────┐
│deletado=F│   DELETE   │deletado=T│
│data_del= │  ──────▶   │data_del=▼│
│   NULL   │            │  NOW()   │
└──────────┘            └──────────┘
     │                       │
     │                       │
     ▼                       ▼
 Visível nas              Oculto nas
   queries                queries
(WHERE deletado          (filtrado)
    = FALSE)
```

### Versionamento de Documentos
```
v1                    v2                    v3
┌──────────┐         ┌──────────┐         ┌──────────┐
│ id: A    │         │ id: B    │         │ id: C    │
│ versao:1 │◄────────│ versao:2 │◄────────│ versao:3 │
│ pai:NULL │  pai:A  │ pai:B    │  pai:C  │ pai:B    │
└──────────┘         └──────────┘         └──────────┘
```

---

## 💡 Dicas de Uso

### 1. Sempre usar WHERE deletado = FALSE
```sql
-- ❌ Errado
SELECT * FROM processos WHERE cliente_id = :id;

-- ✅ Correto
SELECT * FROM processos 
WHERE cliente_id = :id AND deletado = FALSE;
```

### 2. Usar Transações para Múltiplas Operações
```sql
BEGIN;
  INSERT INTO processos (...) VALUES (...);
  INSERT INTO processo_atividades (...) VALUES (...);
  UPDATE usuarios SET ... WHERE ...;
COMMIT;
```

### 3. Validar Constraints no Application Layer
```typescript
// Validar antes de enviar ao banco
if (tipo_pessoa === 'PF' && !cpf) {
  throw new Error('CPF obrigatório para pessoa física');
}
```

### 4. Usar Prepared Statements
```sql
-- ✅ Correto (previne SQL Injection)
PREPARE get_processo AS
SELECT * FROM processos WHERE id = $1;

EXECUTE get_processo('uuid-aqui');
```

---

## 📞 Referências Rápidas

| Documento | Descrição |
|-----------|-----------|
| [MODELAGEM_BANCO_DADOS.md](./MODELAGEM_BANCO_DADOS.md) | Modelagem completa com DDL |
| [DIAGRAMAS_ER.md](./DIAGRAMAS_ER.md) | Diagramas visuais Mermaid |
| [README.md](./README.md) | Índice geral da documentação |
| [funcionalidades.md](./funcionalidades.md) | Funcionalidades do sistema |

---

**Última atualização**: 2024  
**Versão**: 1.0  
**Uso**: Referência rápida para desenvolvimento


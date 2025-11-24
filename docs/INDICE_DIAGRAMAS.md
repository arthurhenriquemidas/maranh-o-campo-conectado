# 📐 Índice de Diagramas - Plataforma Jurídica

Catálogo completo de todos os diagramas disponíveis na documentação.

---

## 📊 Diagramas de Banco de Dados

### 1. Diagrama Geral do Sistema
**Localização**: [DIAGRAMAS_ER.md - Diagrama Geral](./DIAGRAMAS_ER.md#diagrama-geral)  
**Tipo**: Entity-Relationship Diagram (Mermaid)  
**Descrição**: Visão geral de todas as entidades principais e seus relacionamentos  
**Quando usar**: Para entender a estrutura completa do banco

---

### 2. Módulo de Usuários
**Localização**: [DIAGRAMAS_ER.md - Módulo de Usuários](./DIAGRAMAS_ER.md#módulo-de-usuários)  
**Tipo**: ER Diagram com hierarquia  
**Descrição**: Estrutura de herança de usuários (clientes, advogados, admins, sindicados)  
**Quando usar**: Ao trabalhar com autenticação e perfis de usuário

**Preview**:
```
USUARIOS (pai)
    ├─ CLIENTES (PF/PJ)
    ├─ ADVOGADOS (OAB)
    ├─ ADMINS (níveis)
    └─ SINDICADOS (cooperativas/sindicatos)
```

---

### 3. Módulo de Processos
**Localização**: [DIAGRAMAS_ER.md - Módulo de Processos](./DIAGRAMAS_ER.md#módulo-de-processos)  
**Tipo**: ER Diagram  
**Descrição**: Processos jurídicos, atividades e avaliações  
**Quando usar**: Ao implementar funcionalidades de gestão de processos

**Entidades**:
- processos
- processo_atividades
- avaliacoes

---

### 4. Módulo de Documentos
**Localização**: [DIAGRAMAS_ER.md - Módulo de Documentos](./DIAGRAMAS_ER.md#módulo-de-documentos)  
**Tipo**: ER Diagram  
**Descrição**: Gestão de documentos, versionamento e assinaturas  
**Quando usar**: Ao implementar upload e gestão documental

**Entidades**:
- documentos
- documento_historico
- assinaturas_eletronicas
- assinantes_documentos

**Recursos**:
- Versionamento de documentos
- Assinaturas eletrônicas
- Histórico de ações
- Controle de acesso

---

### 5. Módulo de Comunicação
**Localização**: [DIAGRAMAS_ER.md - Módulo de Comunicação](./DIAGRAMAS_ER.md#módulo-de-comunicação)  
**Tipo**: ER Diagram  
**Descrição**: Sistema de mensagens e notificações  
**Quando usar**: Ao implementar chat e sistema de notificações

**Entidades**:
- mensagens
- notificacoes

**Recursos**:
- Chat com anexos
- Threads de respostas
- Notificações multi-canal
- Status de leitura

---

### 6. Módulo de Agenda
**Localização**: [DIAGRAMAS_ER.md - Módulo de Agenda](./DIAGRAMAS_ER.md#módulo-de-agenda)  
**Tipo**: ER Diagram  
**Descrição**: Eventos e compromissos jurídicos  
**Quando usar**: Ao implementar calendário e lembretes

**Entidades**:
- agenda_eventos

**Recursos**:
- Eventos recorrentes
- Lembretes automáticos
- Modalidades (presencial/online)
- Vinculação a processos

---

### 7. Módulo de Assinaturas e LGPD
**Localização**: [DIAGRAMAS_ER.md - Módulo de Assinaturas e LGPD](./DIAGRAMAS_ER.md#módulo-de-assinaturas-e-lgpd)  
**Tipo**: ER Diagram  
**Descrição**: Conformidade LGPD e assinaturas eletrônicas  
**Quando usar**: Ao implementar termos de uso e consentimentos

**Entidades**:
- termos_lgpd
- consentimentos_lgpd
- log_termos_lgpd
- assinaturas_eletronicas
- assinantes_documentos

**Recursos**:
- Versionamento de termos
- Consentimentos granulares
- Auditoria LGPD completa
- Assinaturas com hash

---

### 8. Módulo de Verificação
**Localização**: [DIAGRAMAS_ER.md - Módulo de Verificação](./DIAGRAMAS_ER.md#módulo-de-verificação)  
**Tipo**: ER Diagram  
**Descrição**: Verificação de identidade e documentos  
**Quando usar**: Ao implementar KYC e verificação de usuários

**Entidades**:
- verificacao_identidade
- documentos_verificacao
- documentos_comprobatorios_sindicado

**Recursos**:
- Verificação de OAB
- Validação de documentos
- Status de aprovação
- Motivos de rejeição

---

### 9. Módulo de Pagamentos
**Localização**: [DIAGRAMAS_ER.md - Módulo de Pagamentos](./DIAGRAMAS_ER.md#módulo-de-pagamentos)  
**Tipo**: ER Diagram  
**Descrição**: Gestão financeira e honorários  
**Quando usar**: Ao implementar sistema de pagamentos

**Entidades**:
- pagamentos

**Recursos**:
- Múltiplos métodos de pagamento
- Parcelamento
- Integração com gateways
- Comprovantes

---

## 🔄 Diagramas de Fluxo

### 10. Fluxo de Dados Principal
**Localização**: [DIAGRAMAS_ER.md - Diagrama de Fluxo de Dados](./DIAGRAMAS_ER.md#diagrama-de-fluxo-de-dados)  
**Tipo**: Flowchart  
**Descrição**: Fluxo completo desde cadastro até conclusão do processo  
**Quando usar**: Para entender a jornada completa do usuário

**Etapas**:
1. Cadastro e verificação
2. Criação de processo
3. Atribuição de advogado
4. Trabalho jurídico
5. Upload de documentos
6. Assinaturas
7. Pagamento
8. Avaliação
9. Arquivamento

---

### 11. Diagrama de Estados do Processo
**Localização**: [DIAGRAMAS_ER.md - Diagrama de Estados do Processo](./DIAGRAMAS_ER.md#diagrama-de-estados-do-processo)  
**Tipo**: State Diagram  
**Descrição**: Estados possíveis de um processo e transições  
**Quando usar**: Ao implementar máquina de estados do processo

**Estados**:
- Aberto
- Em Andamento
- Aguardando Cliente
- Aguardando Aprovação
- Concluído
- Arquivado
- Rejeitado

---

### 12. Sequência: Criação de Processo
**Localização**: [DIAGRAMAS_ER.md - Diagrama de Sequência: Criação de Processo](./DIAGRAMAS_ER.md#diagrama-de-sequência-criação-de-processo)  
**Tipo**: Sequence Diagram  
**Descrição**: Fluxo detalhado de criação e atribuição de processo  
**Quando usar**: Ao implementar API de criação de processos

**Participantes**:
- Cliente
- Sistema
- Banco de Dados
- Advogado
- Notificações

---

### 13. Sequência: Upload e Assinatura
**Localização**: [DIAGRAMAS_ER.md - Diagrama de Sequência: Upload e Assinatura](./DIAGRAMAS_ER.md#diagrama-de-sequência-upload-e-assinatura-de-documento)  
**Tipo**: Sequence Diagram  
**Descrição**: Processo de upload de documento e coleta de assinaturas  
**Quando usar**: Ao implementar sistema de assinaturas eletrônicas

**Etapas**:
1. Upload e validação
2. Geração de hash
3. Storage
4. Criação de assinatura
5. Notificação de assinantes
6. Coleta de assinaturas
7. Finalização

---

## 🏗️ Diagramas de Arquitetura

### 14. Diagrama de Classes
**Localização**: [DIAGRAMAS_ER.md - Diagrama de Classes](./DIAGRAMAS_ER.md#diagrama-de-classes-hierarquia-de-usuários)  
**Tipo**: Class Diagram  
**Descrição**: Hierarquia OOP de usuários  
**Quando usar**: Ao implementar models no backend

**Classes**:
- Usuario (base)
  - Cliente
  - Advogado
  - Admin
  - Sindicado

---

### 15. Diagrama de Componentes
**Localização**: [DIAGRAMAS_ER.md - Diagrama de Componentes](./DIAGRAMAS_ER.md#diagrama-de-componentes-arquitetura-do-sistema)  
**Tipo**: Component Diagram  
**Descrição**: Arquitetura em camadas do sistema  
**Quando usar**: Para entender a separação de responsabilidades

**Camadas**:
- Frontend (Angular)
- Backend API
- Banco de Dados
- Serviços Externos

---

### 16. Diagrama de Implantação
**Localização**: [DIAGRAMAS_ER.md - Diagrama de Implantação](./DIAGRAMAS_ER.md#diagrama-de-implantação)  
**Tipo**: Deployment Diagram  
**Descrição**: Infraestrutura e deployment  
**Quando usar**: Ao planejar infraestrutura e DevOps

**Componentes**:
- CDN
- Servidor Web
- Servidor de Aplicação
- Banco de Dados (Primary + Replica)
- Storage
- Monitoramento

---

## 📋 Diagramas Simplificados (ASCII)

### 17. Visão Geral das Tabelas
**Localização**: [QUICK_REFERENCE.md - Visão Geral](./QUICK_REFERENCE.md#-visão-geral-das-tabelas)  
**Tipo**: ASCII Art  
**Descrição**: Organização das 25 tabelas por módulo  
**Quando usar**: Para referência rápida da estrutura

---

### 18. Hierarquia de Usuários (ASCII)
**Localização**: [QUICK_REFERENCE.md - Hierarquia](./QUICK_REFERENCE.md#-hierarquia-de-usuários)  
**Tipo**: ASCII Tree  
**Descrição**: Estrutura de herança em formato texto  
**Quando usar**: Para consulta rápida sem renderização de Mermaid

---

### 19. Fluxo de Processo (ASCII)
**Localização**: [QUICK_REFERENCE.md - Fluxo](./QUICK_REFERENCE.md#-fluxo-de-processo)  
**Tipo**: ASCII Flowchart  
**Descrição**: Estados do processo em formato texto  
**Quando usar**: Para referência rápida do fluxo

---

### 20. Relacionamentos Chave (ASCII)
**Localização**: [QUICK_REFERENCE.md - Relacionamentos](./QUICK_REFERENCE.md#-relacionamentos-chave)  
**Tipo**: ASCII ER  
**Descrição**: Principais relacionamentos entre tabelas  
**Quando usar**: Para entender FKs rapidamente

---

### 21. Segurança em Camadas (ASCII)
**Localização**: [QUICK_REFERENCE.md - Segurança](./QUICK_REFERENCE.md#-segurança-em-camadas)  
**Tipo**: ASCII Layers  
**Descrição**: Camadas de segurança do sistema  
**Quando usar**: Ao implementar segurança

---

## 📝 Diagramas Textuais (Modelagem)

### 22. Diagrama de Relacionamentos (Texto)
**Localização**: [MODELAGEM_BANCO_DADOS.md - Diagrama](./MODELAGEM_BANCO_DADOS.md#diagrama-de-relacionamentos)  
**Tipo**: ASCII Art + Mermaid  
**Descrição**: Visão geral em formato texto  
**Quando usar**: Para documentação offline ou prints

---

## 🎨 Guia de Uso dos Diagramas

### Por Persona

#### 👨‍💻 Desenvolvedor Backend
Diagramas mais úteis:
1. Módulo de Usuários (#2)
2. Módulo de Processos (#3)
3. Sequência: Criação de Processo (#12)
4. Diagrama de Classes (#14)
5. Quick Reference (#17-21)

#### 👩‍💻 Desenvolvedor Frontend
Diagramas mais úteis:
1. Fluxo de Dados Principal (#10)
2. Estados do Processo (#11)
3. Sequência: Upload e Assinatura (#13)
4. Diagrama de Componentes (#15)

#### 🗄️ DBA
Diagramas mais úteis:
1. Diagrama Geral (#1)
2. Todos os Módulos (#2-9)
3. Quick Reference - Índices (#20)
4. Modelagem completa (MODELAGEM_BANCO_DADOS.md)

#### 🏗️ Arquiteto de Software
Diagramas mais úteis:
1. Diagrama de Componentes (#15)
2. Diagrama de Implantação (#16)
3. Fluxo de Dados Principal (#10)
4. Segurança em Camadas (#21)

#### 📊 Product Manager
Diagramas mais úteis:
1. Fluxo de Dados Principal (#10)
2. Estados do Processo (#11)
3. Visão Geral (#17)

---

## 🔧 Ferramentas de Visualização

### Mermaid Diagrams
- **GitHub**: Renderização automática
- **VS Code**: Extensão "Markdown Preview Mermaid Support"
- **Online**: [Mermaid Live Editor](https://mermaid.live/)
- **Export**: PNG, SVG, PDF

### ASCII Diagrams
- **Qualquer editor de texto**
- **Terminal**
- **README viewers**

---

## 📥 Exportação

### Para Apresentações
1. Abra diagrama Mermaid no [Mermaid Live Editor](https://mermaid.live/)
2. Exporte como PNG ou SVG
3. Importe no PowerPoint/Google Slides

### Para Documentação Externa
1. Copy diagrama ASCII
2. Use em wikis, Confluence, Notion
3. Mantenha formatação com blocos de código

### Para Impressão
1. Renderize Mermaid como SVG
2. Converta para PDF
3. Configure impressão para A3/A4

---

## 🔄 Manutenção dos Diagramas

### Quando Atualizar
- ✅ Ao adicionar nova tabela
- ✅ Ao modificar relacionamento
- ✅ Ao alterar fluxo de negócio
- ✅ Ao implementar novo módulo

### Checklist de Atualização
- [ ] Atualizar diagrama Mermaid correspondente
- [ ] Atualizar diagrama ASCII se houver
- [ ] Atualizar MODELAGEM_BANCO_DADOS.md
- [ ] Revisar QUICK_REFERENCE.md
- [ ] Atualizar este índice se necessário
- [ ] Testar renderização no GitHub

---

## 📞 Referências

| Documento | Link |
|-----------|------|
| Modelagem Completa | [MODELAGEM_BANCO_DADOS.md](./MODELAGEM_BANCO_DADOS.md) |
| Diagramas Mermaid | [DIAGRAMAS_ER.md](./DIAGRAMAS_ER.md) |
| Referência Rápida | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) |
| README Principal | [README.md](./README.md) |

---

**Total de Diagramas**: 22  
**Formatos**: Mermaid, ASCII Art, Texto  
**Última atualização**: 2024  
**Versão**: 1.0


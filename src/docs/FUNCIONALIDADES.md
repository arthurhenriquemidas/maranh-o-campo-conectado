# Funcionalidades a Desenvolver - Plataforma Jurídica

Abaixo estão listadas as funcionalidades necessárias para transformar o protótipo em uma aplicação real, considerando frontend (Angular + PrimeNG) e backend (Java 21 + Spring Boot).

## Funcionalidades Gerais
- Autenticação de usuários (login/logout)
- Cadastro de clientes (Pessoa Física e Jurídica)
- Cadastro de advogados
- Cadastro de administrador (ou seed inicial)
- Recuperação de senha
- Validação de dados nos formulários
- Layout responsivo e acessível
- Mobile first (Flutter Web )

## Cliente
- Cadastro de conta (PF/PJ)
- Login
- Visualização de painel com processos do cliente
- Cadastro de novo processo
- Visualização de detalhes do processo
- Chat com advogado (mensagens em tempo real ou polling)  
    -> Pesquisada de novos modulos de chat 
- Aprovação ou rejeição da conclusão do processo
- Logout 

## Advogado
- Cadastro de conta
- Login
- Visualização de painel com processos aceitos
- Visualização de detalhes do processo
- Chat com cliente (mensagens em tempo real ou polling)
- Solicitação de conclusão do processo
- Logout

## Administrador
- Login
- Painel de administração
- Visualização de processos aguardando atribuição
- Atribuição de processos a advogados
- Visualização de todos os usuários e processos (opcional)
- Logout

## Backend (Spring Boot)
- API REST para autenticação e autorização (JWT)
- API para cadastro e gerenciamento de clientes, advogados e administradores
- API para cadastro e gerenciamento de processos
- API para atribuição de processos a advogados
- API para chat entre cliente e advogado
- API para aprovação/rejeição de conclusão de processo
- Integração com banco de dados relacional (PostgreSQL/MySQL)
- Seed de dados iniciais (admin, advogados, clientes)
- Validação e tratamento de erros
- Testes unitários e de integração

## Recomendações Opcionais porem importantes para um produto mais completo
- Upload de documentos nos processos
	- Permitir anexar arquivos (PDF, imagens, etc.) ao cadastrar ou atualizar um processo
	- Visualização e download dos documentos anexados por cliente, advogado e admin

- Notificações (e-mail )
	- Envio de e-mails automáticos para clientes, advogados e admin em eventos importantes (atribuição, conclusão, mensagens, etc.)
	- Integração com serviço de e-mail (SMTP, SendGrid, etc.)

- Dashboard de métricas para admin
	- Visualização de estatísticas: total de processos, processos por status, usuários cadastrados, etc.
	- Gráficos e indicadores de desempenho
	- Filtros por período, tipo de usuário, status do processo


## Assinatura Eletrônica & Concordância

Assinatura de contrato/termos (cliente ↔ advogado): com log de aceite e hash do documento (integração simples com Clicksign/DocuSign ou aceite interno com carimbo de data/hora).

**Termos de Uso, Política de Privacidade e consentimento LGPD com versão e timestamp


## Fluxo Jurídico & Rastreabilidade

Workflow de processo com estados  (ABERTO → EM_ANDAMENTO → AGUARDANDO_CLIENTE → CONCLUÍDO → ARQUIVADO) + timeline de atividades (anexos, mensagens, mudanças).

Regras para validaçãoes de transições (ex.: só advogado pode marcar como CONCLUÍDO).
Regras de quantidade de processos por status (ex.: máximo 3 ABERTOS no plano gratuito).
Regras de SLA (ex.: advogado deve responder em até 48h).
Regras de quantidade de rejeições de conclusão (ex.: máximo 2 rejeições por processo).

Prazos & lembretes: datas de audiência/entrega, alertas automáticos (e-mail/app) D-7, D-1, H-2.

Modelos de documentos (templates) para petições/comunicados com variáveis (nome, nº processo etc.).

## Identidade & Compliance

Verificação mínima de advogado: nº OAB + foto do documento (storage e validação manual no MVP).

KYC leve de cliente: CPF/CNPJ + e-mail/telefone verificados.

status de verificação (pendente, aprovado, rejeitado) e bloqueio de ações se não verificado.
tela simples de dashboard de verificação para admin (lista, detalhes, aprovar/rejeitar).

-------------------
# Futuro 

## Produtividade do Advogado

Checklist/Kanban por processo (tarefas: criar petição, protocolar, preparar audiência).

Etiquetas e filtros avançados (status, área, urgência).

Busca full-text em processos e documentos (índice por título/metadata).
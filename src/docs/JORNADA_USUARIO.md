# Jornada do Usuário - Plataforma Jurídica

Este documento apresenta a jornada dos principais perfis de usuário do protótipo, utilizando diagramas Mermaid para ilustrar os fluxos de interação.

## Jornada do Cliente

```mermaid
flowchart TD
    A[Início - Login] -->|Não tem conta| B[Cadastro de Cliente]
    A -->|Login| C[Painel do Cliente]
    B -->|Cadastro realizado| A
    C --> D[Cadastrar Novo Processo]
    D --> E[Processo aguardando atribuição]
    E --> F[Processo atribuído a Advogado]
    F --> G[Chat com Advogado]
    G --> H[Processo em andamento]
    H --> I[Advogado solicita conclusão]
    I -->|Aceita| J[Processo Concluído]
    I -->|Rejeita| H
    C --> K[Sair]
```

## Jornada do Advogado

```mermaid
flowchart TD
    A[Início - Login] -->|Não tem conta| B[Cadastro de Advogado]
    A -->|Login| C[Painel do Advogado]
    B -->|Cadastro realizado| A
    C --> D[Visualiza Processos Aceitos]
    D --> E[Chat com Cliente]
    E --> F[Trabalha no Processo]
    F --> G[Solicita Conclusão ao Cliente]
    G -->|Aguardando aprovação| D
    C --> H[Sair]
```

## Jornada do Administrador

```mermaid
flowchart TD
    A[Início - Login] -->|Login como admin| B[Painel do Administrador]
    B --> C[Visualiza Processos Disponíveis]
    C --> D[Atribui Processo a Advogado]
    D --> B
    B --> E[Sair]
```

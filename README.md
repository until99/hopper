# Capa

- **Título do Projeto**: Sistema de Geração e Distribuição de Relatórios Dinâmicos com Power BI Embedded.
- **Nome do Estudante**: Gabriel Deglmann Kasten.
- **Curso**: Engenharia de Software.
- **Data de Entrega**: [Data].

# Resumo

Este projeto visa desenvolver uma plataforma integrada para automatizar processos de ETL (Extract, Transform, Load), gerar relatórios dinâmicos no Power BI e distribuí-los de forma segura em uma aplicação web. O sistema utiliza Airflow para orquestração de pipelines de dados, Power BI Embedded para disponibilização de dashboards e autenticação baseada em roles (RBAC) e RLS (Row-Level Security) para controle de acesso. Os principais pontos abordados são a integração de tecnologias de BI com sistemas web, segurança de dados e automação de workflows.

## 1. Introdução

- **Contexto**: Organizações modernas demandam relatórios atualizados e personalizados para tomada de decisão. Entretanto, processos manuais de ETL e a distribuição não centralizada de relatórios geram gargalos de eficiência e riscos de segurança. Este projeto propõe uma solução automatizada para esses desafios.

- **Justificativa**: A integração de ETL automatizado, ferramentas de BI e controle de acesso granular é essencial para a engenharia de software, envolvendo arquitetura de sistemas, segurança da informação e gestão de dados.

- **Objetivos**: 
    - Principal: Desenvolver um sistema que automatize a geração e distribuição de relatórios com controle de acesso e segurança.
    - Secundários:
        1. Implementar RLS para filtragem de dados conforme perfil do usuário.
        1. Criar uma interface web intuitiva para visualização de dashboards.
        1. Garantir escalabilidade do processo de ETL..

## 2. Descrição do Projeto

- **Tema do Projeto**: Sistema de gerenciamento de dados e relatórios com Power BI Embedded, autenticação customizada e pipelines ETL automatizados.

- **Problemas a Resolver**: 
    - Processos manuais de extração e transformação de dados.
    - Falta de centralização no acesso a relatórios.
    - Controle inadequado de permissões e visibilidade de dados.
- **Limitações**:
    - Não abordará análise de dados em tempo real.
    - Não incluirá desenvolvimento de visualizações personalizadas fora do Power BI.

## 3. Especificação Técnica

Descrição detalhada da proposta, incluindo requisitos de software, protocolos, algoritmos, procedimentos, formatos de dados, etc.

### 3.1. Requisitos de Software
- **Lista de Requisitos Funcionais:**

    - RF01: Execução automatizada de pipelines ETL com Airflow.
    - RF02: Geração de relatórios no Power BI com atualização programada.
    - RF03: Autenticação de usuários via sistema RBAC.
    - RF04: Aplicação de RLS conforme perfil do usuário.
    - RF05: Publicação de dashboards em uma aplicação web via Power BI Embedded.

- **Lista de Requisitos Não Funcionais:**

    - RNF01: Tempo máximo de 5 minutos para execução do ETL.
    - RNF02: Disponibilidade de 99,9% para a aplicação web.
    - RNF03: Criptografia de dados em trânsito e repouso.

- **Representação dos Requisitos:**

    - Atores: Administrador, Usuário Final.
    - Casos de Uso:
        1. Configurar pipeline ETL (Admin).
        1. Visualizar relatório (Usuário).
        1. Gerenciar permissões de acesso (Admin).

### 3.2. Considerações de Design

- **Visão Inicial da Arquitetura**: 
    - Camada ETL: Airflow para orquestração.
    - Camada de Dados: Banco de dados PostgreSQL.
    - Camada de BI: Power BI para modelagem e dashboards.
    - Camada Web: Aplicação usando ReactJS para o frontend e Golang para o backend.

- **Padrões de Arquitetura**: MVC na camada web, Microserviços para ETL.
- **Modelos C4**:
    - Contexto: Sistema interage com usuários, fontes de dados externas e Power BI.
    - Contêineres: Airflow, PostgreSQL, Power BI Service, Aplicação Web.

### 3.3. Stack Tecnológica

- **Linguagens de Programação**: 
    - Python (ETL),
    - JavaScript/React (frontend).
    - Golang (backend)

- **Frameworks e Bibliotecas**: 
    - Apache Airflow,
    - React,
    - Gin (API)
    - Power BI REST API.
    - Pandas
    - Numpy
    - Psycopg2

- **Ferramentas de Desenvolvimento e Gestão de Projeto**:
    - Docker (conteinerização)
    - Git (versionamento)
    - Azure/AWS (cloud).
    - Hostinger

### 3.4. Considerações de Segurança

Análise de possíveis questões de segurança e como mitigá-las.

- Autenticação via OAuth2.
- RLS no Power BI para restrição de dados.
- Auditoria de logs de acesso.

## 4. Próximos Passos

Descrição dos passos seguintes após a conclusão do documento, com uma visão geral do cronograma para Portfólio I e II.

- Finalização do design detalhado da arquitetura.
- Implementação do pipeline ETL com Airflow.
- Desenvolvimento da interface web com integração ao Power BI Embedded.
- Testes de segurança e carga.

## 5. Referências

Listagem de todas as fontes de pesquisa, frameworks, bibliotecas e ferramentas que serão utilizadas.

- [Airflow Docs](https://airflow.apache.org/docs/)
- [PowerBI API](https://learn.microsoft.com/pt-br/rest/api/power-bi/)
- [WSTG](https://owasp.org/www-project-web-security-testing-guide/stable/)
- [Gin (Golang)](https://gin-gonic.com/)
- [Pandas (Python Data Framework)](https://pandas.pydata.org/)
- [Numpy](https://numpy.org/)
- [Psycopg2 (Python Interface to Postgress)](https://pypi.org/project/psycopg2/)
- [Data Pipelines with Apache Airflow (Livro)](https://www.amazon.com.br/Data-Pipelines-Apache-Airflow-Harenslak/dp/1617296902)

## 6. Apêndices (Opcionais)

Informações complementares, dados de suporte ou discussões detalhadas fora do corpo principal.
## 7. Avaliações de Professores

Adicionar três páginas no final do RFC para que os Professores escolhidos possam fazer suas considerações e assinatura:
- Considerações Professor/a:
- Considerações Professor/a:
- Considerações Professor/a:

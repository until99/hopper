
# Hopper

![Grace Hopper](docs/images/gracehopperscreenshot.png)

- **Título do Projeto**: Sistema de Gerenciamento e Distribuição de Relatórios Dinâmicos com Power BI Embedded.
- **Nome do Estudante**: Gabriel Deglmann Kasten.
- **Curso**: Engenharia de Software.
- **Data de Entrega**: [Data].

## Resumo

Este projeto visa desenvolver uma plataforma integrada para gerenciar processos de ETL (Extract, Transform, Load), relatórios dinâmicos no Power BI e distribuí-los de forma segura em uma aplicação web. O sistema utiliza do Airflow para orquestração de pipelines de dados, Power BI Embedded para disponibilização de dashboards e autenticação baseada em cargos (RBAC) e RLS (Row-Level Security) para controle de acesso.

## 1. Introdução

Organizações modernas demandam relatórios atualizados e personalizados para tomada de decisão. Entretanto, processos manuais de ETL e a distribuição não centralizada de relatórios geram gargalos de eficiência e riscos de segurança. Este projeto propõe uma solução automatizada para esses desafios.

A integração de ETL, ferramentas de BI e controle de acesso granular é essencial para a engenharia de software, envolvendo arquitetura de sistemas, segurança da informação e gestão de dados.

## 2. Descrição do Projeto

O Hopper é um Sistema de gerenciamento de dados e relatórios com Power BI Embedded, autenticação customizada e pipelines ETL automatizados. O sistema visa mitigar processos manuais de extração, transformação e carga de dados, falta de centralização no acesso a relatórios e garantir um controle adequado de permissões e visibilidade de dados.

![Hopper_Technical_Implementation](docs/images/Hopper_Technical_Implementation.png)

Tendo em vista o tempo e conhecimento técnico, o sistema não abordará análise de dados em tempo real e não incluirá desenvolvimento de visualizações personalizadas fora do Power BI.

## 3. Especificação Técnica

### 3.1. Requisitos de Software

- **Lista de Requisitos Funcionais:**

  - **RF01:** O sistema deve permitir a execução automatizada de pipelines ETL
  - **RF02:** O sistema deve ser capaz de realizar a extração de dados de fontes heterogêneas (CSV, APIs REST, PostgreSQL)
  - **RF03:** O sistema deve ser capaz de realizar a transformação (limpeza, enriquecimento, agregação e etc) de dados
  - **RF04:** O sistema deve ser capaz de realizar a carga incremental de dados em tabelas. 
  - **RF05:** O sistema deve ser capaz de gerar relatórios no Power BI.
  - **RF06:** O sistema deve permitir autenticação de usuários.
  - **RF07:** O sistema deve aplicar regras de segurança em nível de linha (RLS) nos relatórios do Power BI com base no perfil do usuário autenticado.
  - **RF08:** O sistema deve permitir a publicação de dashboards do Power BI em uma aplicação web.
  - **RF09:** O sistema deve monitorar a execução de pipelines ETL, exibindo métricas como taxa de sucesso/falha e tempo médio por task.
  - **RF010:** O sistema deve oferecer uma interface self-service para upload e gerenciamento de relatórios (.pbix) por administradores.
  - **RNF11:** O sistema deve permitir a atualização programada dos relatórios.

- **Lista de Requisitos Não Funcionais:**
  - **RNF01:** O sistema deve ser capaz de definir cargos (Admin, Analista, Visualizador) e integrar com provedores OAuth2 (Google/Microsoft).
  - **RNF02:** O sistema deve utilizar DAGs no Airflow para orquestração de pipelines, com paralelização de tarefas e otimização de queries SQL (índices) para garantir tempo máximo de execução de 5 minutos.
  - **RNF03:** O sistema deve utilizar TLS 1.3 para criptografia de dados em trânsito e AES-256 para dados em repouso no PostgreSQL.
  - **RNF04:** O sistema deve ser implantado em ambiente com auto-scaling horizontal (ex: render.com) para garantir disponibilidade de 99.9%, usando balanceamento de carga e CDN para assets estáticos.
  - **RNF05:** O sistema deve gerar logs de auditoria centralizados (timestamp, user_id, endpoint).
  - **RNF06:** O sistema deve utilizar operadores customizados em Python (Pandas/Numpy) para transformação de dados e psycopg2 para carga incremental no PostgreSQL.
  - **RNF07:** O sistema deve integrar-se à Power BI REST API para atualização automática de datasets e publicação de relatórios em workspaces dedicados.
  - **RNF08:** O sistema deve utilizar tokens JWT no backend Golang para autorização e mapeamento dinâmico de grupos de segurança no Power BI Service.
  - **RNF9:** O sistema deve utilizar a biblioteca powerbi-client-react no frontend para embedar relatórios com tokens de acesso validados via JWT.

- **Representação dos Requisitos:**

![Hopper_Casos_de_Uso](docs/images/Hopper_Casos_de_Uso.png)

### 3.2. Considerações de Design

- **Visão Inicial da Arquitetura**:
  - Camada ETL: Airflow para orquestração.
  - Camada de Dados: Banco de dados PostgreSQL e modelagem.
  - Camada de BI: Power BI para visualização dos dashboards.
  - Camada Web: ReactJS (frontend) e Golang (backend).

- **Padrões de Arquitetura**: MVC na camada web e Microserviços para ETL.

- **Modelo C4**:

![c1_diagrama_contexto](docs/images/c1_diagrama_contexto.png)

![c3_diagrama_componentes](docs/images/c3_diagrama_componentes.png)

![Hopper_C4_Container_Diagram](docs/images/Hopper_C4_Container_Diagram.png)

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
  - Render (Deploy)

### 3.4. Considerações de Segurança

Análisando possíveis questões de segurança e como mitigá-las, foi decidido que como medida mínima de contenção, é necessário que os seguintes requisitos devem ser atendidos:

- Autenticação via OAuth2.
- RLS no Power BI para restrição de dados.
- Auditoria de logs de acesso.

## 4. Próximos Passos

Após aprovação do documento, os próximos passos são em ordem:

1. Criação de um backlog.
2. Implementação de um contâiner com Airflow e pipelines funcionais com diferentes peculiaridades.
3. Desenvolvimento de relatórios no Powerbi utilizando dos dados importados.
4. Desenvolvimento da interface web com integração ao Power BI Embedded.
5. Implementação de funcionalidades para ativação e desativação de cargas.
6. Permitir o gerenciamento facilitado das cargas, paineis, workspaces, grupos, RLS, etc.
7. Testes de segurança e carga.

## 5. Referências

Listagem das fontes de pesquisa, frameworks, bibliotecas e ferramentas que serão utilizadas.

- [Airflow Docs](https://airflow.apache.org/docs/)
- [PowerBI API](https://learn.microsoft.com/pt-br/rest/api/power-bi/)
- [WSTG](https://owasp.org/www-project-web-security-testing-guide/stable/)
- [Data Pipelines with Apache Airflow (Livro)](https://www.amazon.com.br/Data-Pipelines-Apache-Airflow-Harenslak/dp/1617296902)
- [Just the Docs (Documentação Geral)](https://just-the-docs.com/)
- [Plantuml (Diagramas)](https://plantuml.com/)
- [Docker](https://www.docker.com/)
- [React](https://react.dev/)
- [Pandas](https://pandas.pydata.org/)
- [Numpy](https://numpy.org/)
- [Psycopg2](https://pypi.org/project/psycopg2/)
- [Gin Gonic](https://gin-gonic.com/)
- [Render](https://render.com/)
- [Git](https://git-scm.com/)
- [Python](https://www.python.org/)
- [Golang](https://go.dev/)
- [Powerbi](https://www.microsoft.com/pt-br/power-platform/products/power-bi)
- [Powerbi Embedded](https://azure.microsoft.com/pt-br/products/power-bi-embedded)
- [Biblioteca de ícones](https://phosphoricons.com/)

Para controle de metas e entregas foi utilizado o [Trello](https://trello.com/b/CzrWYIOK/backlog).
Para o desenvolvimento do design foi utilizado o [Figma](https://www.figma.com/design/EyHG1Z3gfPZUhac4np9miy/Hopper?node-id=3-56&t=P5941xMAqUHPlukk-1).

<div style="page-break-after: always;"></div>

## 6. Avaliações de Professores

- Considerações Professor/a:

<div style="page-break-after: always;"></div>
- Considerações Professor/a:

<div style="page-break-after: always;"></div>
- Considerações Professor/a:

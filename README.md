# Hopper

![Grace Hopper](docs/images/gracehopperscreenshot.png)

- **Título do Projeto**: Sistema de Gerenciamento e Distribuição de Relatórios Dinâmicos com Power BI Embedded.
- **Nome do Estudante**: Gabriel Deglmann Kasten.
- **Curso**: Engenharia de Software.
- **Data de Entrega**: [Data].

## 1. Resumo

Em ambientes corporativos que lidam com grandes volumes de dados provenientes de múltiplas fontes (CSV, APIs REST, bancos de dados relacionais), equipes de negócios enfrentam atrasos e inconsistências ao consolidar e analisar informações manualmente. O Hopper surge para resolver esse problema, oferecendo uma plataforma que automatiza o fluxo de ETL — extração, transformação e carga incremental de dados —, centralizando e padronizando a preparação de dados. Em seguida, disponibiliza dashboards interativos via Power BI Embedded, garantindo relatórios sempre atualizados, seguros e escaláveis para suportar decisões estratégicas.

## 2. Introdução

Organizações modernas demandam relatórios precisos e personalizados para apoiar a tomada de decisão. No entanto, processos manuais de ETL e a distribuição descentralizada de relatórios geram gargalos de eficiência, atrasos na entrega de insights e riscos de segurança.

O Hopper mitiga esses desafios ao:

- Orquestrar pipelines de dados com Apache Airflow, automatizando completamente a extração, transformação e carga de informações.
- Realizar carga incremental para otimizar tempo de processamento e evitar duplicações.
- Centralizar dashboards no Power BI Embedded, oferecendo uma interface self-service e relatórios sempre atualizados.
- Implementar controle de acesso granular via RBAC e RLS, garantindo que cada usuário visualize apenas os dados autorizados.
- Monitorar métricas de execução (taxa de sucesso/falha e tempo médio por task), permitindo ações pró-ativas e maior confiabilidade.

Dessa forma, o sistema reduz erros manuais, acelera a disponibilização de insights e fortalece a governança de dados.

## 3. Especificação Técnica

### 3.1. Requisitos de Software

- **Lista de Requisitos Funcionais:**

  - **RF01:** O sistema deve permitir a execução automatizada de pipelines ETL com Apache Airflow, utilizando DAGs (Directed Acyclic Graphs), que representam o fluxo de tarefas dependentes entre si, garantindo a orquestração, agendamento e monitoramento das etapas de extração, transformação e carga de dados.
  - **RF02:** O sistema deve extrair dados de múltiplas fontes (CSV, APIs REST, PostgreSQL) usando operadores Python/Pandas em Airflow, agendados pelo mesmo.
  - **RF03:** O sistema deve transformar dados (limpeza, enriquecimento, agregação) por meio de scripts Python com Pandas e Numpy, executados em tarefas Airflow pelo administrador
  - **RF04:** O sistema deve realizar carga incremental no banco PostgreSQL usando a biblioteca psycopg2, orquestrada pelo Airflow.
  - **RF05:** O sistema deve gerar relatórios no Power BI importando datasets do PostgreSQL e publicando-os em workspaces dedicados da microsoft via Power BI REST API, configurado pelo administrador.
  - **RF06:** O sistema deve permitir autenticação de usuários via OAuth2 (Google/Microsoft) no backend Go (Gin).
  - **RF07:** O sistema deve aplicar regras de segurança em nível de linha (RLS) nos relatórios embedados com Power BI Embedded.
  - **RF08:** O sistema deve publicar dashboards do Power BI em uma aplicação Web React usando a biblioteca powerbi-client-react.
  - **RF09:** O sistema deve monitorar métricas de execução do Airfow (taxa de sucesso/falha e tempo médio por task).
  - **RF10:** O sistema deve permitir upload e gerenciamento de relatórios .pbix via Power BI REST API (criação e edição de arquivos realizados externamente no Power BI Desktop).
  - **RF11:** O sistema deve permitir atualização programada dos relatórios no Power BI por meio de tasks Airflow.

- **Lista de Requisitos Não Funcionais:**
  - **RNF01:** O sistema deve definir cargos (Admin, Analista, Visualizador) e integrar com provedores OAuth2 (Google/Microsoft) via Auth0, mantido pelo time de segurança.
  - **RNF02:** O sistema deve usar DAGs no Apache Airflow para paralelização de tasks e otimização de queries indexadas em SQL, garantindo tempo máximo de execução de 5 minutos, implementado pelos engenheiros de dados.
  - **RNF03:** O sistema deve criptografar dados em trânsito com TLS 1.3 e em repouso com AES-256 no PostgreSQL, configurado pelos engenheiros de infraestrutura.
  - **RNF04:** O sistema deve ser implantado com auto-scaling horizontal (render.com), balanceamento de carga e CDN para assets estáticos, gerenciado pelos engenheiros de DevOps.
  - **RNF05:** O sistema deve gerar logs de auditoria centralizados (timestamp, user_id, endpoint) no ELK Stack, mantido pelo time de segurança.
  - **RNF06:** O sistema deve utilizar operadores customizados em Python (Pandas/Numpy) e psycopg2 para transformação e carga incremental, desenvolvidos pela equipe de engenharia de dados.
  - **RNF07:** O sistema deve integrar-se à Power BI REST API para atualização automática de datasets e publicação em workspaces dedicados, executado por analistas de BI.
  - **RNF08:** O sistema deve utilizar tokens JWT no backend Python (FastAPI) para autorização e mapeamento dinâmico de grupos de segurança, implementado pelos desenvolvedores backend.
  - **RNF09:** O sistema deve utilizar a biblioteca powerbi-client-react no frontend para embed seguro de relatórios com validação de tokens JWT, desenvolvido pelos desenvolvedores frontend.

- **Representação dos Requisitos:**

![Hopper_Casos_de_Uso](docs/images/Hopper_Casos_de_Uso.png)

### 3.2. Considerações de Design

- **Visão Inicial da Arquitetura**:
  - Camada ETL: Airflow para orquestração.
  - Camada de Dados: Banco de dados PostgreSQL e modelagem.
  - Camada de BI: Power BI para visualização dos dashboards.
  - Camada Web: ReactJS (frontend) e Python (FastAPI) (backend).

- **Padrões de Arquitetura**: MVC na camada web e Microserviços para ETL.

- **Modelo C4**:

## Diagrama de Contexto

![c1_diagrama_contexto](docs/images/c1_diagrama_contexto.png)

<br><br>

## Diagrama de Container

![Hopper_C4_Container_Diagram](docs/images/Hopper_C4_Container_Diagram.png)

<br><br>

## Diagrama de Componentes

![c3_diagrama_componentes](docs/images/c3_diagrama_componentes.png)

<br><br>

### 3.3. Stack Tecnológica

- **Linguagens de Programação**:
  - Python (ETL e backend via FastAPI)
  - JavaScript/React (frontend)

- **Frameworks e Bibliotecas**:
  - Apache Airflow,
  - React,
  - FastAPI,
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

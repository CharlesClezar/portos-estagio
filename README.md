# Portos Estágio - Sistema de Análise Portuária

Este é um projeto fullstack para visualização e análise de atividades portuárias globais. A aplicação é composta por:

- **Frontend** (React + Vite + Tailwind + ShadCN)
- **Backend** (FastAPI)
- **ETL** (Python + SQLAlchemy + Pandas)
- **Banco de dados** (PostgreSQL + Views e Índices otimizados)
- **Docker** para orquestração de containers `Obrigatória instalação`

## Tecnologias Utilizadas

- React + TypeScript
- Vite + ShadCN UI + TailwindCSS
- FastAPI + SQLAlchemy
- PostgreSQL 15
- Docker e Docker Compose `Obrigatória instalação`
- Pandas para carga de dados

## Estrutura do Projeto

```
portos-estagio/
├── backend/         # FastAPI com rotas e modelos
├── db/              # Views e índices SQL
├── etl/             # ETL com Pandas + SQLAlchemy
├── frontend/        # App React com dashboards
├── docker-compose.yml
```
## Fonte dos Dados

Os dados são provenientes do Kaggle:
[Daily Port Activity Data and Trade Estimates](https://www.kaggle.com/datasets/arunvithyasegar/daily-port-activity-data-and-trade-estimates/data)

## Como Executar

### 1. Clone o projeto
```bash
git clone https://github.com/seu-usuario/portos-estagio.git
cd portos-estagio
```

### 2. Configure variáveis de ambiente (opcional)
O `docker-compose` já fornece o `DATABASE_URL`, mas você pode definir manualmente se rodar localmente.

### 3. Faça o download da base de dados

- Acesse o Kaggle
- Baixe o `Daily_Port_Activity_Data_and_Trade_Estimates.csv` (irá baixar zipado)
- Descompacte o arquivo
- Disponibilize o arquivo CSV na pasta etl/

### 4. Reexecutar ETL manualmente (opcional)
```bash
docker compose run etl python carregamento.py
```

### 5. Aplicar Views e Índices (se ainda não rodou)
```bash
docker compose run etl python init_db.py
```

### 6. Execute os containers
```bash
docker compose up --build
```

Isso irá:
- Subir o banco de dados
- Executar o ETL (carga do CSV local)
- Disponibilizar a API em `http://localhost:8000`
- Disponibilizar o frontend em `http://localhost:3000`


## Documentação da API

A documentação interativa (Swagger) pode ser acessada em:

[http://localhost:8000/docs](http://localhost:8000/docs)

## Funcionalidades
- Painel resumido (volume total, chamadas, média, portos)
- Filtros por data, tipo de embarcação, porto
- Gráficos temporais e distribuições
- Tabela detalhada dos dados
- Rankings de maiores portos

## Informações sobre o desenvolvimento
**Docker** - Utilizado docker para subir a aplicação, não sendo necessário demais instalações

## Melhorias futuras
 - Estão descritas na aba de [`Issues`](https://github.com/CharlesClezar/portos-estagio/issues) ajustes pertinentes para melhoria da aplicação 

---

> Projeto desenvolvido como parte do estágio. Todos os dados são fictícios ou derivados de fontes públicas.

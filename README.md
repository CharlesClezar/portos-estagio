# Portos Estágio - Sistema de Análise Portuária

Este é um projeto fullstack para visualização e análise de atividades portuárias globais. A aplicação é composta por:

- **Frontend** (React + Vite + Tailwind + ShadCN)
- **Backend** (FastAPI)
- **ETL** (Python + SQLAlchemy + Pandas)
- **Banco de dados** (PostgreSQL + Views e Índices otimizados)
- **Docker** para orquestração de containers

## 🔧 Tecnologias Utilizadas

- React + TypeScript
- Vite + ShadCN UI + TailwindCSS
- FastAPI + SQLAlchemy
- PostgreSQL 15
- Docker e Docker Compose
- Pandas para carga de dados

## 📦 Estrutura do Projeto

```
portos-estagio/
├── backend/         # FastAPI com rotas e modelos
├── db/              # Views e índices SQL
├── etl/             # ETL com Pandas + SQLAlchemy
├── frontend/        # App React com dashboards
├── docker-compose.yml
```

## 🚀 Como Executar

### 1. Clone o projeto
```bash
git clone https://github.com/seu-usuario/portos-estagio.git
cd portos-estagio
```

### 2. Configure variáveis de ambiente (opcional)
O `docker-compose` já fornece o `DATABASE_URL`, mas você pode definir manualmente se rodar localmente.

### 3. Execute os containers
```bash
docker compose up --build
```

Isso irá:
- Subir o banco de dados
- Executar o ETL (carga do CSV local)
- Disponibilizar a API em `http://localhost:8000`
- Disponibilizar o frontend em `http://localhost:3000`

### 4. Reexecutar ETL manualmente (opcional)
```bash
docker compose run etl python carregamento.py
```

### 5. Aplicar Views e Índices (se ainda não rodou)
```bash
docker compose run etl python init_db.py
```

## 📊 Funcionalidades
- Painel resumido (volume total, chamadas, média, portos)
- Filtros por data, tipo de embarcação, porto
- Gráficos temporais e distribuições
- Tabela detalhada dos dados
- Rankings de maiores portos

## 📁 Dados
O dataset é baseado em registros públicos de atividade portuária global:
- `Daily_Port_Activity_Data_and_Trade_Estimates.csv`

## 📬 Contato
Desenvolvido por [Seu Nome]. Para dúvidas ou sugestões:
- Email: seuemail@exemplo.com
- GitHub: https://github.com/seu-usuario

---

> Projeto desenvolvido como parte do estágio/TCC. Todos os dados são fictícios ou derivados de fontes públicas.

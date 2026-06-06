# TicketSave — Sistema de Gerenciamento de Tickets

> Projeto acadêmico — UNINOVE, Grupo 05 · Sistemas da Informação · 2026

Sistema web completo para gerenciamento de chamados de suporte técnico da loja fictícia **TechStore**. Desenvolvido com Spring Boot no back-end e React no front-end.

---

## Funcionalidades

- Cadastro e login de usuários
- Criação, edição e exclusão de tickets
- Filtragem por status, categoria e prioridade
- Alteração de status direto no card do ticket
- Dashboard com contadores em tempo real
- Exportação de tickets para Excel (`.xlsx`)
- Documentação automática da API via Swagger
- Vitrine de produtos e Central de Ajuda

---

## Stack

| Camada | Tecnologias |
|---|---|
| Back-end | Java 17, Spring Boot 3.4.5, Spring Data JPA, Hibernate, Apache POI |
| Banco de dados | H2 (desenvolvimento) · PostgreSQL (produção) |
| Front-end | React, Vite, Axios, React Router DOM |
| Documentação | Swagger / OpenAPI |
| Análise de dados | Excel · Power BI |

---

## Estrutura do Projeto

```
ticketsave/
├── backend/
│   ├── src/main/java/com/uninove/ecommerce/ticketsave/
│   │   ├── config/        # CORS, Swagger, dados iniciais
│   │   ├── controller/    # Endpoints REST (auth + tickets)
│   │   ├── dto/           # Objetos de entrada e saída da API
│   │   ├── entity/        # Entidades JPA: Ticket, Usuario
│   │   ├── enums/         # Status, Categoria, Prioridade
│   │   ├── exception/     # Tratamento global de erros
│   │   ├── repository/    # Repositórios JPA
│   │   └── service/       # Regras de negócio e exportação Excel
│   ├── database/
│   │   └── schema-postgres.sql
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/    # Sidebar
│   │   ├── pages/         # Login, Home, Tickets, Produtos, Ajuda
│   │   ├── services/      # Cliente HTTP (Axios)
│   │   └── styles.css
│   └── package.json
├── tools/
│   └── regenerate_powerbi_excel.py
├── tickets_powerbi.xlsx
├── GUIA_POWER_BI.md
├── docker-compose.yml
└── README.md
```

---

## Pré-requisitos

- Java 17 ou superior
- Maven 3.9+ (ou use o Maven Wrapper incluso)
- Node.js 18+
- PostgreSQL (opcional, apenas para ambiente de produção)
- Power BI Desktop (opcional, para gerar o `.pbix`)

---

## Como Rodar

### 1. Back-end

**Com H2 (banco em memória — padrão para desenvolvimento):**

```bash
cd backend
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`.

Links úteis:
- Swagger UI → `http://localhost:8080/swagger-ui.html`
- H2 Console → `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:ticketdb`
  - Usuário: `sa` · Senha: *(vazia)*

---

**Com PostgreSQL:**

Crie o banco antes:

```sql
CREATE DATABASE ticketdb;
```

Depois execute com o perfil `postgres`:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=postgres
```

As credenciais padrão ficam em `backend/src/main/resources/application-postgres.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ticketdb
spring.datasource.username=postgres
spring.datasource.password=postgres
```

---

### 2. Front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O front sobe em `http://localhost:5173` e aponta por padrão para `http://localhost:8080`.

Para usar outra URL de API:

```bash
# Linux / macOS
VITE_API_URL=http://localhost:8080 npm run dev

# Windows PowerShell
$env:VITE_API_URL="http://localhost:8080"
npm run dev
```

---

## Endpoints da API

### Autenticação

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/auth/cadastro` | Cadastra novo usuário |
| `POST` | `/auth/login` | Realiza login |

### Tickets

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/tickets` | Cria ticket |
| `GET` | `/tickets` | Lista todos |
| `GET` | `/tickets/{id}` | Busca por ID |
| `GET` | `/tickets/status/{status}` | Filtra por status |
| `PATCH` | `/tickets/{id}/status` | Atualiza somente o status |
| `PUT` | `/tickets/{id}` | Atualiza dados completos |
| `DELETE` | `/tickets/{id}` | Remove ticket |
| `GET` | `/tickets/export` | Exporta planilha Excel |

### Valores aceitos

| Campo | Opções |
|---|---|
| Status | `ABERTO` · `EM_ANDAMENTO` · `RESOLVIDO` · `CANCELADO` |
| Categoria | `PAGAMENTO` · `ENTREGA` · `DEFEITO` · `CANCELAMENTO` · `TROCA` · `OUTRO` |
| Prioridade | `BAIXA` · `MEDIA` · `ALTA` · `URGENTE` |

---

## Fluxo de Uso

1. Acesse `http://localhost:5173`
2. Cadastre um usuário ou faça login
3. Crie tickets pela página **Tickets** ou pela **Central de Ajuda**
4. Altere o status pelo dropdown em cada card
5. Acompanhe os indicadores no **Home**
6. Exporte os dados pelo botão **Excel**

---

## Excel e Power BI

O arquivo `tickets_powerbi.xlsx` já inclui:

- Aba **Tickets** — 15 chamados de exemplo
- Aba **Resumo** — indicadores por status, categoria e prioridade
- Aba **Home** — KPIs resumidos

Para gerar o dashboard no Power BI:

1. Abra o Power BI Desktop
2. Importe `tickets_powerbi.xlsx` → selecione a aba `Tickets`
3. Monte os gráficos seguindo o `GUIA_POWER_BI.md`
4. Salve como `Home_ticketsave.pbix`

Indicadores sugeridos: total de tickets · tickets por status · por categoria · por prioridade · taxa de resolução · urgentes pendentes · evolução por data.

Para regenerar o Excel com dados atualizados:

```bash
python tools/regenerate_powerbi_excel.py
```

---

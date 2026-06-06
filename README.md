# TicketSave

Projeto academico da UNINOVE para gerenciamento de chamados de suporte em um
e-commerce de eletronicos. O sistema possui API em Spring Boot, interface em
React, exportacao para Excel e dados preparados para Home no Power BI.

## Situacao em relacao ao TAP

| Item do TAP | Situacao |
| --- | --- |
| Criacao de tickets | Atendido |
| Listagem de chamados | Atendido |
| Atualizacao de status | Atendido |
| API Spring Boot | Atendido |
| Integracao com PostgreSQL | Parcial: configurada por perfil, mas o padrao local usa H2 |
| Interface front-end | Atendido |
| Exportacao Excel | Atendido |
| Home | Parcial: existe Home no React e guia Power BI; o arquivo `.pbix` ainda deve ser montado no Power BI Desktop |
| Autenticacao | Implementada como extra, embora o TAP diga que a primeira versao nao teria autenticacao |

## Estrutura

```text
backend/
  src/main/java/com/uninove/ecommerce/ticketsave/
    config/        Configuracoes de CORS, Swagger e dados iniciais
    controller/    Endpoints REST de autenticacao e tickets
    dto/           Objetos de entrada e saida da API
    entity/        Entidades JPA: Ticket e Usuario
    enums/         Status, categoria e prioridade dos tickets
    repository/    Repositorios JPA
    service/       Regras de negocio e exportacao Excel
  database/
    schema-postgres.sql
frontend/
  src/
    components/    Sidebar
    pages/         Login, Home, Tickets, Produtos e Ajuda
    services/      Cliente HTTP da API
tools/
  regenerate_powerbi_excel.py
GUIA_POWER_BI.md
tickets_powerbi.xlsx
docs/analise-projeto.md
```

## Requisitos

- Java 17 ou superior
- Maven 3.9 ou superior, ou Maven Wrapper
- Node.js 18 ou superior
- PostgreSQL, caso queira rodar com banco real
- Power BI Desktop, caso queira gerar o `.pbix`

## Como Rodar

### Back-end com H2

```bash
cd backend
mvn spring-boot:run
```

A API abre em `http://localhost:8080`.

Links uteis:

- Swagger: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console`
- JDBC URL do H2: `jdbc:h2:mem:ticketdb`
- Usuario H2: `sa`
- Senha H2: vazia

### Back-end com PostgreSQL

Crie o banco:

```sql
CREATE DATABASE ticketdb;
```

Depois rode:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=postgres
```

As credenciais padrao estao em
`backend/src/main/resources/application-postgres.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ticketdb
spring.datasource.username=postgres
spring.datasource.password=postgres
```

O arquivo `backend/database/schema-postgres.sql` documenta a estrutura SQL
esperada. A aplicacao ainda usa Hibernate para criar/atualizar as tabelas em
tempo de execucao.

### Front-end

```bash
cd frontend
npm install
npm run dev
```

O front abre em `http://localhost:5173`.

Por padrao ele chama `http://localhost:8080`. Para usar outra URL:

```bash
VITE_API_URL=http://localhost:8080 npm run dev
```

No Windows PowerShell:

```powershell
$env:VITE_API_URL="http://localhost:8080"
npm run dev
```

## Fluxo de Uso

1. Abra o front-end.
2. Cadastre um usuario ou faca login.
3. Crie tickets em `Tickets` ou pela `Central de Ajuda`.
4. Atualize o status pelo seletor de cada ticket.
5. Acompanhe indicadores no `Home`.
6. Exporte Excel pelo botao `Excel` ou `Exportar Excel`.

## Endpoints

### Autenticacao

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| POST | `/auth/cadastro` | Cadastra usuario |
| POST | `/auth/login` | Realiza login |

### Tickets

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| POST | `/tickets` | Cria ticket |
| GET | `/tickets` | Lista todos os tickets |
| GET | `/tickets/{id}` | Busca ticket por ID |
| GET | `/tickets/status/{status}` | Filtra por status |
| PATCH | `/tickets/{id}/status` | Atualiza somente o status |
| PUT | `/tickets/{id}` | Atualiza dados do ticket |
| DELETE | `/tickets/{id}` | Remove ticket |
| GET | `/tickets/export` | Exporta planilha Excel |

Valores aceitos:

- Status: `ABERTO`, `EM_ANDAMENTO`, `RESOLVIDO`, `CANCELADO`
- Categoria: `PAGAMENTO`, `ENTREGA`, `DEFEITO`, `CANCELAMENTO`, `TROCA`, `OUTRO`
- Prioridade: `BAIXA`, `MEDIA`, `ALTA`, `URGENTE`

## Excel e Home

O arquivo `tickets_powerbi.xlsx` ja possui:

- Aba `Tickets` com 15 chamados de exemplo
- Aba `Resumo - Home` com indicadores por status, categoria e prioridade
- Aba `Home` com KPIs resumidos para conferencia rapida no Excel

Para o Power BI:

1. Abra o Power BI Desktop.
2. Importe `tickets_powerbi.xlsx`.
3. Selecione a aba `Tickets`.
4. Monte os graficos seguindo `GUIA_POWER_BI.md`.
5. Salve como `Home_ticketsave.pbix`.

Indicadores recomendados:

- Total de tickets
- Tickets por status
- Tickets por categoria
- Tickets por prioridade
- Taxa de resolucao
- Urgentes pendentes
- Evolucao por data de criacao

## SQL

O projeto nao dependia de um arquivo `.sql` no pacote original. A modelagem
principal vem das entidades JPA:

- `tickets`
- `usuarios`

Para apresentar a estrutura do banco, use:

```text
backend/database/schema-postgres.sql
```

## Pontos de Melhoria

- Gerar e anexar o arquivo final `Home_ticketsave.pbix`.
- Trocar senhas em texto puro por hash, se o professor cobrar seguranca.
- Adicionar testes de service/controller.
- Criar script de dados de exemplo para PostgreSQL, alem do `DataSeeder`.
- Configurar variaveis de ambiente para usuario/senha do PostgreSQL.
- Publicar em um repositorio GitHub com instrucoes de execucao.

## Observacoes

O TAP informa que a primeira versao nao teria autenticacao, mas o projeto
entregue inclui login/cadastro. Isso pode ser apresentado como melhoria
adicional, desde que fique claro que a autenticacao ainda e simples e academica.

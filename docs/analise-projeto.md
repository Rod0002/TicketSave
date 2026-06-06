# Analise do Projeto TicketSave

## O que o TAP pede

O TAP descreve um sistema de chamados para e-commerce de eletronicos com:

- Criacao, listagem e atualizacao de status de tickets.
- API em Spring Boot integrada ao PostgreSQL.
- Interface inicial para interacao do usuario.
- Exportacao de dados para Excel.
- Home no Power BI com indicadores basicos.

## O que o projeto ja tem

- Back-end Spring Boot com CRUD de tickets.
- Endpoints de cadastro/login.
- Entidades `Ticket` e `Usuario`.
- Configuracao H2 para desenvolvimento rapido.
- Configuracao PostgreSQL por perfil.
- Front-end React com Login, Home, Tickets, Produtos e Ajuda.
- Exportacao Excel no endpoint `/tickets/export`.
- Planilha `tickets_powerbi.xlsx` com dados e resumo.
- Guia `GUIA_POWER_BI.md` para montar o Home.

## Excel

O arquivo `tickets_powerbi.xlsx` foi regenerado com 15 tickets, datas coerentes
para evolucao temporal e tres abas:

- `Tickets`: base de dados para Excel/Power BI.
- `Resumo - Home`: totais por status, categoria e prioridade.
- `Home`: KPIs resumidos para conferencia rapida.

A aba `Tickets` possui as colunas necessarias para BI:

- ID
- Titulo
- Descricao
- Cliente
- Status
- Categoria
- Prioridade
- Data Criacao
- Ultima Atualizacao
- Dias Aberto
- Mes/Ano
- Dia da Semana

Distribuicao atual dos dados:

- Status: 4 abertos, 5 em andamento, 4 resolvidos e 2 cancelados.
- Categoria: 4 pagamento, 3 entrega, 3 defeito, 2 cancelamento e 3 troca.
- Prioridade: 4 baixa, 4 media, 5 alta e 2 urgente.

Ponto corrigido: a planilha do pacote veio com datas muito parecidas, porque os
dados de exemplo estavam sendo sobrescritos na entidade. Isso foi ajustado em
`Ticket.onCreate()`, preservando datas informadas pelo `DataSeeder`, e a
planilha foi regenerada.

## SQL e banco

Nao havia script SQL no pacote original. A estrutura era criada pelo Hibernate
com base nas entidades JPA.

Agora existe um script de referencia em:

```text
backend/database/schema-postgres.sql
```

Esse script documenta as tabelas `tickets` e `usuarios`, incluindo restricoes
para status, categoria e prioridade.

## Coerencia entre front e back

O front e o back estao coerentes nos fluxos principais:

- `GET /tickets` alimenta a lista e o Home.
- `POST /tickets` cria tickets.
- `PATCH /tickets/{id}/status` atualiza status.
- `DELETE /tickets/{id}` remove tickets.
- `GET /tickets/export` exporta Excel.
- `/auth/cadastro` e `/auth/login` sustentam a tela de login.

Correcoes feitas:

- A Central de Ajuda agora envia `categoria` e `prioridade`, campos obrigatorios
  no back-end.
- O login agora mostra corretamente mensagens de erro do back-end.
- A URL da API no front pode ser configurada por `VITE_API_URL`.
- O Home ordena a evolucao por data real.
- As datas dos tickets de exemplo nao sao mais sobrescritas no `@PrePersist`.

## O que ainda falta para a entrega ficar mais forte

- Criar o arquivo final `Home_ticketsave.pbix` no Power BI Desktop.
- Rodar o projeto com PostgreSQL real e tirar prints da tabela `tickets`.
- Adicionar prints do Swagger, front-end, Excel e Home ao trabalho.
- Criar testes automatizados para services/controllers.
- Melhorar seguranca: senha com hash e autenticacao com token.
- Criar dados de exemplo via SQL para PostgreSQL.
- Corrigir textos sem acento se o professor exigir acabamento visual.

## Como apresentar

Uma boa ordem para a apresentacao:

1. Mostrar o objetivo do TAP.
2. Abrir o front e criar um ticket.
3. Atualizar o status do ticket.
4. Mostrar o Home do React.
5. Exportar o Excel.
6. Abrir o Excel ou Power BI.
7. Mostrar o SQL/schema e explicar as tabelas.
8. Abrir o Swagger para provar os endpoints.

# Guia: Criando o Home no Power BI

## Pre-requisitos
- Power BI Desktop instalado (gratuito): https://powerbi.microsoft.com/pt-br/desktop/
- O arquivo `tickets_powerbi.xlsx` (ja incluso neste zip, ou exporte pelo sistema clicando em "Exportar Excel")

---

## PASSO 1: Importar o Excel

1. Abra o **Power BI Desktop**
2. Clique em **"Obter Dados"** > **"Pasta de trabalho do Excel"**
3. Selecione o arquivo `tickets_powerbi.xlsx`
4. Na janela de navegacao, marque a aba **"Tickets"** e clique em **"Carregar"**

---

## PASSO 2: Criar o Grafico de Pizza - Tickets por Status

1. No painel direito, clique no icone de **Grafico de Pizza**
2. Arraste o campo **"Status"** para **Legenda**
3. Arraste o campo **"ID"** para **Valores** (vai contar automaticamente)
4. Clique no grafico e va em **Formatar** > **Titulo** > escreva: **"Tickets por Status"**
5. Em **Cores dos dados**, defina:
   - Aberto = Azul (#3B82F6)
   - Em Andamento = Amarelo (#F59E0B)
   - Resolvido = Verde (#10B981)
   - Cancelado = Vermelho (#EF4444)

---

## PASSO 3: Criar o Grafico de Barras - Tickets por Categoria

1. Clique em uma area vazia do relatorio
2. Selecione o icone de **Grafico de Barras Clusterizado**
3. Arraste **"Categoria"** para o **Eixo Y**
4. Arraste **"ID"** para o **Eixo X** (Contagem)
5. Titulo: **"Tickets por Categoria"**
6. Em **Cores dos dados**, defina cores diferentes para cada categoria:
   - Pagamento = Roxo (#8B5CF6)
   - Entrega = Ciano (#06B6D4)
   - Defeito = Rosa (#F43F5E)
   - Cancelamento = Cinza (#64748B)
   - Troca = Laranja (#F97316)

---

## PASSO 4: Criar o Grafico de Barras - Tickets por Prioridade

1. Clique em uma area vazia
2. Selecione **Grafico de Barras Clusterizado**
3. Arraste **"Prioridade"** para **Eixo Y**
4. Arraste **"ID"** para **Eixo X** (Contagem)
5. Titulo: **"Tickets por Prioridade"**
6. Cores:
   - Baixa = Verde (#10B981)
   - Media = Azul (#3B82F6)
   - Alta = Amarelo (#F59E0B)
   - Urgente = Vermelho (#EF4444)

---

## PASSO 5: Criar Cartoes de KPI

### Cartao 1 - Total de Tickets
1. Clique em area vazia > icone **Cartao**
2. Arraste **"ID"** para **Campos** (vai mostrar a contagem)
3. Titulo: **"Total de Tickets"**

### Cartao 2 - Taxa de Resolucao
1. Va em **Modelagem** > **Nova Medida**
2. Digite: `Taxa Resolucao = DIVIDE(COUNTROWS(FILTER(Tickets, Tickets[Status] = "Resolvido")), COUNTROWS(Tickets), 0)`
3. Crie um **Cartao** e arraste essa medida
4. Formate como porcentagem

### Cartao 3 - Tickets Urgentes
1. Nova Medida: `Urgentes Pendentes = COUNTROWS(FILTER(Tickets, Tickets[Prioridade] = "Urgente" && Tickets[Status] <> "Resolvido" && Tickets[Status] <> "Cancelado"))`
2. Crie um **Cartao** com essa medida

---

## PASSO 6: Criar Grafico de Linha - Evolucao no Tempo

1. Clique em area vazia > **Grafico de Linha**
2. Arraste **"Data Criacao"** para **Eixo X**
3. Arraste **"ID"** para **Valores** (Contagem)
4. Titulo: **"Evolucao de Tickets ao Longo do Tempo"**
5. Na hierarquia de datas, expanda ate o nivel de **Dia** ou **Semana**

---

## PASSO 7: Criar Tabela Detalhada

1. Clique em area vazia > icone **Tabela**
2. Arraste os campos: **ID, Titulo, Cliente, Status, Categoria, Prioridade, Data Criacao, Dias Aberto**
3. Ordene por **Data Criacao** decrescente

---

## PASSO 8: Adicionar Filtros (Slicers)

1. Clique em area vazia > icone **Segmentacao de Dados**
2. Arraste **"Status"** > cria filtro por status
3. Repita com **"Categoria"** e **"Prioridade"**
4. Agora voce pode filtrar todos os graficos clicando nos botoes

---

## PASSO 9: Formatar o Home

1. Va em **Formatar** > **Plano de fundo da pagina** > cor branca ou cinza claro (#F0F2F5)
2. Adicione um titulo no topo: Insira uma **Caixa de texto** > escreva **"Home TicketSave - TechStore"**
3. Organize os elementos no layout:

```
+----------------------------------------------------------+
|  Home TICKETSAVE - TECHSTORE                        |
+----------------------------------------------------------+
| [Total] [Abertos] [Resolvidos] [Taxa %] [Urgentes]      |
+----------------------------------------------------------+
| [Grafico Pizza - Status]  | [Barras - Categoria]         |
+----------------------------------------------------------+
| [Barras - Prioridade]     | [Linha - Evolucao]           |
+----------------------------------------------------------+
| [Filtro Status] [Filtro Categoria] [Filtro Prioridade]   |
+----------------------------------------------------------+
| [Tabela Detalhada]                                       |
+----------------------------------------------------------+
```

---

## PASSO 10: Salvar

1. **Ctrl+S** > salve como `Home_ticketsave.pbix`
2. Pronto! Seu Home esta completo.

---

## Dicas Extras

- **Atualizar dados**: Exporte novo Excel pelo sistema e clique em **"Atualizar"** no Power BI
- **Tema**: Va em **Exibicao** > **Temas** > escolha um tema escuro se preferir
- **Publicar**: Se tiver conta Power BI Pro, pode publicar online em **Publicar** > **Meu Workspace**
- Use o campo **"Dias Aberto"** para mostrar tempo medio de resolucao
- Use o campo **"Dia da Semana"** para ver em quais dias tem mais tickets
- Use o campo **"Mes/Ano"** para analise mensal

---

## Colunas Disponiveis no Excel

| Coluna | Descricao | Uso no Power BI |
|--------|-----------|-----------------|
| ID | Identificador unico | Contagem |
| Titulo | Titulo do ticket | Tabela/Detalhe |
| Descricao | Descricao completa | Detalhe |
| Cliente | Nome do cliente | Agrupamento |
| Status | Aberto/Em Andamento/Resolvido/Cancelado | Pizza/Filtro |
| Categoria | Pagamento/Entrega/Defeito/Cancelamento/Troca/Outro | Barras/Filtro |
| Prioridade | Baixa/Media/Alta/Urgente | Barras/Filtro |
| Data Criacao | Data e hora de criacao | Linha temporal |
| Ultima Atualizacao | Data da ultima alteracao | Calculo |
| Dias Aberto | Quantidade de dias desde a criacao | KPI/Media |
| Mes/Ano | Mes e ano da criacao | Agrupamento mensal |
| Dia da Semana | Dia da semana (Segunda-Domingo) | Analise semanal |

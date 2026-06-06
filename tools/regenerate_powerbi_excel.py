from datetime import datetime, timedelta
from pathlib import Path
from xml.sax.saxutils import escape
from zipfile import ZIP_DEFLATED, ZipFile


BASE_DATE = datetime(2026, 5, 27, 20, 0)

TICKETS = [
    (1, "Pagamento nao aprovado", "Tentei comprar um iPhone 15 e o pagamento no cartao foi recusado duas vezes, mas o valor foi debitado.", "Carlos Silva", "Aberto", "Pagamento", "Alta", BASE_DATE - timedelta(days=1)),
    (2, "Atraso na entrega", "Meu pedido #4521 deveria ter chegado ha 5 dias e ainda nao recebi nenhuma atualizacao de rastreio.", "Maria Oliveira", "Em Andamento", "Entrega", "Media", BASE_DATE - timedelta(days=3)),
    (3, "Produto com defeito - Galaxy S24", "O Samsung Galaxy S24 chegou com a tela com manchas roxas no canto inferior direito.", "Joao Santos", "Em Andamento", "Defeito", "Alta", BASE_DATE - timedelta(days=5)),
    (4, "Cancelamento de pedido", "Quero cancelar o pedido #4580 que fiz ontem pois encontrei preco melhor em outro lugar.", "Ana Costa", "Resolvido", "Cancelamento", "Baixa", BASE_DATE - timedelta(days=7)),
    (5, "Troca de produto", "Comprei um fone JBL e quero trocar pelo modelo superior, pagando a diferenca.", "Pedro Almeida", "Aberto", "Troca", "Media", BASE_DATE - timedelta(days=2)),
    (6, "Cobranca duplicada", "Fui cobrado duas vezes pelo mesmo pedido #4499. Preciso do estorno urgente.", "Fernanda Lima", "Aberto", "Pagamento", "Urgente", BASE_DATE - timedelta(hours=6)),
    (7, "Produto errado recebido", "Pedi um Notebook Dell e recebi um Notebook Lenovo. Preciso da troca.", "Lucas Martins", "Em Andamento", "Troca", "Alta", BASE_DATE - timedelta(days=4)),
    (8, "Entrega em endereco errado", "O pedido foi entregue no endereco antigo. Ja atualizei meu cadastro mas nao refletiu.", "Juliana Ferreira", "Resolvido", "Entrega", "Media", BASE_DATE - timedelta(days=10)),
    (9, "Smartwatch com defeito na bateria", "O Apple Watch comprado ha 2 semanas nao segura carga por mais de 3 horas.", "Ricardo Souza", "Aberto", "Defeito", "Alta", BASE_DATE - timedelta(days=1)),
    (10, "Reembolso nao processado", "Devolvi o produto ha 15 dias e ainda nao recebi o reembolso no cartao.", "Patricia Rocha", "Em Andamento", "Pagamento", "Urgente", BASE_DATE - timedelta(days=6)),
    (11, "Cancelar assinatura de garantia", "Quero cancelar a garantia estendida que contratei junto com o notebook.", "Bruno Nascimento", "Resolvido", "Cancelamento", "Baixa", BASE_DATE - timedelta(days=12)),
    (12, "Tela trincada no transporte", "O monitor LG chegou com a tela trincada. A embalagem estava danificada.", "Camila Dias", "Cancelado", "Defeito", "Alta", BASE_DATE - timedelta(days=15)),
    (13, "Problema com cupom de desconto", "O cupom TECH20 nao esta funcionando no checkout para compras acima de R$500.", "Rafael Mendes", "Resolvido", "Pagamento", "Baixa", BASE_DATE - timedelta(days=8)),
    (14, "Atraso pedido internacional", "Meu pedido importado esta parado na alfandega ha 20 dias sem movimentacao.", "Tatiane Barbosa", "Em Andamento", "Entrega", "Media", BASE_DATE - timedelta(days=9)),
    (15, "Trocar cor do produto", "Quero trocar o iPhone 15 azul pelo preto. O produto esta lacrado ainda.", "Gabriel Ribeiro", "Cancelado", "Troca", "Baixa", BASE_DATE - timedelta(days=11)),
]

HEADERS = [
    "ID",
    "Titulo",
    "Descricao",
    "Cliente",
    "Status",
    "Categoria",
    "Prioridade",
    "Data Criacao",
    "Ultima Atualizacao",
    "Dias Aberto",
    "Mes/Ano",
    "Dia da Semana",
]

DAYS = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"]


def build_ticket_rows():
    rows = []
    for ticket in sorted(TICKETS, key=lambda item: item[7], reverse=True):
        ticket_id, title, description, client, status, category, priority, created_at = ticket
        updated_at = created_at + timedelta(hours=2)
        end_date = updated_at if status in {"Resolvido", "Cancelado"} else BASE_DATE
        rows.append([
            ticket_id,
            title,
            description,
            client,
            status,
            category,
            priority,
            created_at.strftime("%d/%m/%Y %H:%M"),
            updated_at.strftime("%d/%m/%Y %H:%M"),
            (end_date.date() - created_at.date()).days,
            created_at.strftime("%m/%Y"),
            DAYS[created_at.weekday()],
        ])
    return rows


def count_by(rows, index):
    counts = {}
    for row in rows:
        counts[row[index]] = counts.get(row[index], 0) + 1
    return counts


def percent(value, total):
    return f"{value / total * 100:.1f}%" if total else "0.0%"


def build_summary(rows):
    status_counts = count_by(rows, 4)
    category_counts = count_by(rows, 5)
    priority_counts = count_by(rows, 6)

    summary = [
        ["RELATORIO TICKETSAVE - TECHSTORE"],
        ["Gerado em:", BASE_DATE.strftime("%d/%m/%Y %H:%M")],
        [],
        ["Total de Tickets", len(rows)],
        [],
        ["POR STATUS", "Quantidade", "Percentual"],
    ]

    for label in ["Aberto", "Em Andamento", "Resolvido", "Cancelado"]:
        value = status_counts.get(label, 0)
        summary.append([label, value, percent(value, len(rows))])

    summary += [[], ["POR CATEGORIA", "Quantidade", "Percentual"]]
    for label in ["Pagamento", "Entrega", "Defeito", "Cancelamento", "Troca", "Outro"]:
        value = category_counts.get(label, 0)
        summary.append([label, value, percent(value, len(rows))])

    summary += [[], ["POR PRIORIDADE", "Quantidade", "Percentual"]]
    for label in ["Baixa", "Media", "Alta", "Urgente"]:
        value = priority_counts.get(label, 0)
        summary.append([label, value, percent(value, len(rows))])

    urgent_open = sum(1 for row in rows if row[6] == "Urgente" and row[4] not in {"Resolvido", "Cancelado"})
    summary += [[], ["URGENTES PENDENTES", urgent_open]]
    return summary


def build_Home(rows):
    status_counts = count_by(rows, 4)
    urgent_open = sum(1 for row in rows if row[6] == "Urgente" and row[4] not in {"Resolvido", "Cancelado"})
    Home = [
        ["Home TicketSave - TechStore"],
        ["Indicador", "Valor"],
        ["Total de Tickets", len(rows)],
        ["Abertos", status_counts.get("Aberto", 0)],
        ["Em Andamento", status_counts.get("Em Andamento", 0)],
        ["Resolvidos", status_counts.get("Resolvido", 0)],
        ["Cancelados", status_counts.get("Cancelado", 0)],
        ["Taxa de Resolucao", percent(status_counts.get("Resolvido", 0), len(rows))],
        ["Urgentes Pendentes", urgent_open],
        [],
        ["Status", "Quantidade"],
    ]
    for label in ["Aberto", "Em Andamento", "Resolvido", "Cancelado"]:
        Home.append([label, status_counts.get(label, 0)])
    return Home


def column_name(number):
    result = ""
    while number:
        number, remainder = divmod(number - 1, 26)
        result = chr(65 + remainder) + result
    return result


def sheet_xml(rows):
    parts = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>',
    ]

    for row_index, row in enumerate(rows, 1):
        parts.append(f'<row r="{row_index}">')
        for column_index, value in enumerate(row, 1):
            ref = f"{column_name(column_index)}{row_index}"
            if isinstance(value, (int, float)):
                parts.append(f'<c r="{ref}"><v>{value}</v></c>')
            elif value == "":
                parts.append(f'<c r="{ref}"/>')
            else:
                parts.append(f'<c r="{ref}" t="inlineStr"><is><t>{escape(str(value))}</t></is></c>')
        parts.append("</row>")

    parts.append("</sheetData></worksheet>")
    return "".join(parts)


def write_workbook(path, sheets):
    content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>'''
    rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>'''
    workbook = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Tickets" sheetId="1" r:id="rId1"/>
    <sheet name="Resumo - Home" sheetId="2" r:id="rId2"/>
    <sheet name="Home" sheetId="3" r:id="rId3"/>
  </sheets>
</workbook>'''
    workbook_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/>
</Relationships>'''

    with ZipFile(path, "w", ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", content_types)
        archive.writestr("_rels/.rels", rels)
        archive.writestr("xl/workbook.xml", workbook)
        archive.writestr("xl/_rels/workbook.xml.rels", workbook_rels)
        for index, rows in enumerate(sheets, 1):
            archive.writestr(f"xl/worksheets/sheet{index}.xml", sheet_xml(rows))


def main():
    rows = build_ticket_rows()
    write_workbook(
        Path(__file__).resolve().parents[1] / "tickets_powerbi.xlsx",
        [
            [HEADERS] + rows,
            build_summary(rows),
            build_Home(rows),
        ],
    )
    print(f"Planilha atualizada com {len(rows)} tickets e 3 abas.")


if __name__ == "__main__":
    main()

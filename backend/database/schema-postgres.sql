-- TicketSave - estrutura SQL de referencia para PostgreSQL.
-- A aplicacao usa JPA/Hibernate para criar ou atualizar tabelas automaticamente.
-- Este arquivo serve para documentacao, revisao e criacao manual do banco.

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS tickets (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao VARCHAR(1000) NOT NULL,
    cliente_nome VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    prioridade VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,

    CONSTRAINT chk_tickets_status
        CHECK (status IN ('ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'CANCELADO')),
    CONSTRAINT chk_tickets_categoria
        CHECK (categoria IN ('PAGAMENTO', 'ENTREGA', 'DEFEITO', 'CANCELAMENTO', 'TROCA', 'OUTRO')),
    CONSTRAINT chk_tickets_prioridade
        CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE'))
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets (status);
CREATE INDEX IF NOT EXISTS idx_tickets_categoria ON tickets (categoria);
CREATE INDEX IF NOT EXISTS idx_tickets_prioridade ON tickets (prioridade);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets (created_at DESC);

package com.uninove.ecommerce.ticketsave.entity;

import com.uninove.ecommerce.ticketsave.enums.TicketCategoria;
import com.uninove.ecommerce.ticketsave.enums.TicketPrioridade;
import com.uninove.ecommerce.ticketsave.enums.TicketStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, length = 1000)
    private String descricao;

    @Column(nullable = false)
    private String clienteNome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketCategoria categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPrioridade prioridade;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Ticket() {
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = this.createdAt;
        }
        if (this.status == null) {
            this.status = TicketStatus.ABERTO;
        }
        if (this.categoria == null) {
            this.categoria = TicketCategoria.OUTRO;
        }
        if (this.prioridade == null) {
            this.prioridade = TicketPrioridade.MEDIA;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getClienteNome() {
        return clienteNome;
    }

    public void setClienteNome(String clienteNome) {
        this.clienteNome = clienteNome;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public TicketCategoria getCategoria() {
        return categoria;
    }

    public void setCategoria(TicketCategoria categoria) {
        this.categoria = categoria;
    }

    public TicketPrioridade getPrioridade() {
        return prioridade;
    }

    public void setPrioridade(TicketPrioridade prioridade) {
        this.prioridade = prioridade;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

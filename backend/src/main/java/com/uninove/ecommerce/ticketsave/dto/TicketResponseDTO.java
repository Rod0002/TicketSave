package com.uninove.ecommerce.ticketsave.dto;

import com.uninove.ecommerce.ticketsave.entity.Ticket;
import com.uninove.ecommerce.ticketsave.enums.TicketCategoria;
import com.uninove.ecommerce.ticketsave.enums.TicketPrioridade;
import com.uninove.ecommerce.ticketsave.enums.TicketStatus;

import java.time.LocalDateTime;

public class TicketResponseDTO {

    private Long id;
    private String titulo;
    private String descricao;
    private String clienteNome;
    private TicketStatus status;
    private TicketCategoria categoria;
    private TicketPrioridade prioridade;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TicketResponseDTO() {
    }

    public static TicketResponseDTO fromEntity(Ticket ticket) {
        TicketResponseDTO dto = new TicketResponseDTO();
        dto.setId(ticket.getId());
        dto.setTitulo(ticket.getTitulo());
        dto.setDescricao(ticket.getDescricao());
        dto.setClienteNome(ticket.getClienteNome());
        dto.setStatus(ticket.getStatus());
        dto.setCategoria(ticket.getCategoria());
        dto.setPrioridade(ticket.getPrioridade());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

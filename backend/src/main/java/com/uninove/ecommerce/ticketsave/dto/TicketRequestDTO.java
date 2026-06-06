package com.uninove.ecommerce.ticketsave.dto;

import com.uninove.ecommerce.ticketsave.enums.TicketCategoria;
import com.uninove.ecommerce.ticketsave.enums.TicketPrioridade;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TicketRequestDTO {

    @NotBlank(message = "O titulo e obrigatorio")
    @Size(min = 3, max = 100, message = "O titulo deve ter entre 3 e 100 caracteres")
    private String titulo;

    @NotBlank(message = "A descricao e obrigatoria")
    @Size(min = 10, max = 1000, message = "A descricao deve ter entre 10 e 1000 caracteres")
    private String descricao;

    @NotBlank(message = "O nome do cliente e obrigatorio")
    @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres")
    private String clienteNome;

    @NotNull(message = "A categoria e obrigatoria")
    private TicketCategoria categoria;

    @NotNull(message = "A prioridade e obrigatoria")
    private TicketPrioridade prioridade;

    public TicketRequestDTO() {
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
}

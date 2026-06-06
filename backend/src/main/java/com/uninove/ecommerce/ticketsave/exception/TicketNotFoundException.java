package com.uninove.ecommerce.ticketsave.exception;

public class TicketNotFoundException extends RuntimeException {

    public TicketNotFoundException(Long id) {
        super("Ticket com ID " + id + " não encontrado");
    }
}

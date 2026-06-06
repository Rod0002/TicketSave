package com.uninove.ecommerce.ticketsave.repository;

import com.uninove.ecommerce.ticketsave.entity.Ticket;
import com.uninove.ecommerce.ticketsave.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByClienteNomeContainingIgnoreCase(String clienteNome);

    List<Ticket> findAllByOrderByCreatedAtDesc();
}

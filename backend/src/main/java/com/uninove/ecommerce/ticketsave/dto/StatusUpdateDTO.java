package com.uninove.ecommerce.ticketsave.dto;

import com.uninove.ecommerce.ticketsave.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateDTO {

    @NotNull(message = "O status é obrigatório")
    private TicketStatus status;

    public StatusUpdateDTO() {
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }
}

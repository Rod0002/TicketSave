package com.uninove.ecommerce.ticketsave.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uninove.ecommerce.ticketsave.dto.StatusUpdateDTO;
import com.uninove.ecommerce.ticketsave.dto.TicketRequestDTO;
import com.uninove.ecommerce.ticketsave.dto.TicketResponseDTO;
import com.uninove.ecommerce.ticketsave.enums.TicketStatus;
import com.uninove.ecommerce.ticketsave.service.TicketService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/tickets")
@Tag(name = "Tickets", description = "API de Gerenciamento de Tickets de Suporte")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    @Operation(summary = "Criar novo ticket", description = "Cria um ticket de suporte com status ABERTO")
    public ResponseEntity<TicketResponseDTO> criar(@RequestBody @Valid TicketRequestDTO dto) {
        TicketResponseDTO ticket = ticketService.criarTicket(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
    }

    @GetMapping
    @Operation(summary = "Listar todos os tickets", description = "Retorna todos os tickets ordenados por data de criação (mais recente primeiro)")
    public ResponseEntity<List<TicketResponseDTO>> listar() {
        return ResponseEntity.ok(ticketService.listarTickets());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar ticket por ID")
    public ResponseEntity<TicketResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.buscarPorId(id));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Filtrar tickets por status", description = "Valores aceitos: ABERTO, EM_ANDAMENTO, RESOLVIDO, CANCELADO")
    public ResponseEntity<List<TicketResponseDTO>> buscarPorStatus(@PathVariable TicketStatus status) {
        return ResponseEntity.ok(ticketService.buscarPorStatus(status));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status do ticket", description = "Atualiza apenas o status de um ticket existente")
    public ResponseEntity<TicketResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestBody @Valid StatusUpdateDTO dto) {
        return ResponseEntity.ok(ticketService.atualizarStatus(id, dto.getStatus()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar ticket completo", description = "Atualiza título, descrição e nome do cliente")
    public ResponseEntity<TicketResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid TicketRequestDTO dto) {
        return ResponseEntity.ok(ticketService.atualizarTicket(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar ticket")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        ticketService.deletarTicket(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export")
    @Operation(summary = "Exportar tickets para CSV", description = "Gera um arquivo .csv com todos os tickets para o Power BI")
    public ResponseEntity<byte[]> exportarCSV() {
        byte[] arquivo = ticketService.exportarTicketsCSV(); // <--- AQUI DEVE SER EXATAMENTE O NOME DO MÉTODO NO SERVICE

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=tickets.csv")
                .contentType(MediaType.parseMediaType("text/csv; charset=utf-8"))
                .body(arquivo);
    }
}
package com.uninove.ecommerce.ticketsave.service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.uninove.ecommerce.ticketsave.dto.TicketRequestDTO;
import com.uninove.ecommerce.ticketsave.dto.TicketResponseDTO;
import com.uninove.ecommerce.ticketsave.entity.Ticket;
import com.uninove.ecommerce.ticketsave.enums.TicketCategoria;
import com.uninove.ecommerce.ticketsave.enums.TicketPrioridade;
import com.uninove.ecommerce.ticketsave.enums.TicketStatus;
import com.uninove.ecommerce.ticketsave.exception.TicketNotFoundException;
import com.uninove.ecommerce.ticketsave.repository.TicketRepository;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DateTimeFormatter MES_ANO_FMT = DateTimeFormatter.ofPattern("MM/yyyy");

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public TicketResponseDTO criarTicket(TicketRequestDTO dto) {
        Ticket ticket = new Ticket();
        ticket.setTitulo(dto.getTitulo());
        ticket.setDescricao(dto.getDescricao());
        ticket.setClienteNome(dto.getClienteNome());
        ticket.setCategoria(dto.getCategoria());
        ticket.setPrioridade(dto.getPrioridade());
        ticket.setStatus(TicketStatus.ABERTO);

        Ticket salvo = ticketRepository.save(ticket);
        return TicketResponseDTO.fromEntity(salvo);
    }

    public List<TicketResponseDTO> listarTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(TicketResponseDTO::fromEntity)
                .toList();
    }

    public TicketResponseDTO buscarPorId(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
        return TicketResponseDTO.fromEntity(ticket);
    }

    public List<TicketResponseDTO> buscarPorStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status)
                .stream()
                .map(TicketResponseDTO::fromEntity)
                .toList();
    }

    public TicketResponseDTO atualizarStatus(Long id, TicketStatus status) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));

        ticket.setStatus(status);
        Ticket atualizado = ticketRepository.save(ticket);
        return TicketResponseDTO.fromEntity(atualizado);
    }

    public TicketResponseDTO atualizarTicket(Long id, TicketRequestDTO dto) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));

        ticket.setTitulo(dto.getTitulo());
        ticket.setDescricao(dto.getDescricao());
        ticket.setClienteNome(dto.getClienteNome());
        ticket.setCategoria(dto.getCategoria());
        ticket.setPrioridade(dto.getPrioridade());

        Ticket atualizado = ticketRepository.save(ticket);
        return TicketResponseDTO.fromEntity(atualizado);
    }

    public void deletarTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
        ticketRepository.delete(ticket);
    }

    // AQUI É ONDE A MAGIA DO CSV ACONTECE (E O POI FOI REMOVIDO)
    public byte[] exportarTicketsCSV() {
        List<Ticket> tickets = ticketRepository.findAllByOrderByCreatedAtDesc();
        StringBuilder csvBuilder = new StringBuilder();

        csvBuilder.append("ID;Titulo;Descricao;Cliente;Status;Categoria;Prioridade;Data Criacao;Ultima Atualizacao;Dias Aberto;Mes/Ano;Dia da Semana\n");

        for (Ticket t : tickets) {
            String id = t.getId().toString();
            String titulo = limparTextoCsv(t.getTitulo());
            String descricao = limparTextoCsv(t.getDescricao());
            String cliente = limparTextoCsv(t.getClienteNome());
            String status = traduzirStatus(t.getStatus());
            String categoria = traduzirCategoria(t.getCategoria());
            String prioridade = traduzirPrioridade(t.getPrioridade());
            
            String dataCriacao = t.getCreatedAt() != null ? t.getCreatedAt().format(FMT) : "";
            String dataAtualizacao = t.getUpdatedAt() != null ? t.getUpdatedAt().format(FMT) : "";
            
            long diasAberto = 0;
            if (t.getCreatedAt() != null) {
                LocalDateTime fim = (t.getStatus() == TicketStatus.RESOLVIDO || t.getStatus() == TicketStatus.CANCELADO)
                        && t.getUpdatedAt() != null ? t.getUpdatedAt() : LocalDateTime.now();
                diasAberto = ChronoUnit.DAYS.between(t.getCreatedAt(), fim);
            }
            
            String mesAno = t.getCreatedAt() != null ? t.getCreatedAt().format(MES_ANO_FMT) : "";
            String diaSemana = t.getCreatedAt() != null ? traduzirDiaSemana(t.getCreatedAt()) : "";

            csvBuilder.append(String.format("%s;%s;%s;%s;%s;%s;%s;%s;%s;%d;%s;%s\n",
                    id, titulo, descricao, cliente, status, categoria, prioridade,
                    dataCriacao, dataAtualizacao, diasAberto, mesAno, diaSemana));
        }

        byte[] csvBytes = csvBuilder.toString().getBytes(StandardCharsets.UTF_8);
        byte[] utf8BOM = new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF};
        byte[] finalResult = new byte[utf8BOM.length + csvBytes.length];
        
        System.arraycopy(utf8BOM, 0, finalResult, 0, utf8BOM.length);
        System.arraycopy(csvBytes, 0, finalResult, utf8BOM.length, csvBytes.length);

        return finalResult;
    }

    private String limparTextoCsv(String texto) {
        if (texto == null) return "";
        return texto.replace(";", ",").replace("\n", " ").replace("\r", "");
    }

    private String traduzirStatus(TicketStatus status) {
        if (status == null) return "";
        return switch (status) {
            case ABERTO -> "Aberto";
            case EM_ANDAMENTO -> "Em Andamento";
            case RESOLVIDO -> "Resolvido";
            case CANCELADO -> "Cancelado";
        };
    }

    private String traduzirCategoria(TicketCategoria categoria) {
        if (categoria == null) return "";
        return switch (categoria) {
            case PAGAMENTO -> "Pagamento";
            case ENTREGA -> "Entrega";
            case DEFEITO -> "Defeito";
            case CANCELAMENTO -> "Cancelamento";
            case TROCA -> "Troca";
            case OUTRO -> "Outro";
        };
    }

    private String traduzirPrioridade(TicketPrioridade prioridade) {
        if (prioridade == null) return "";
        return switch (prioridade) {
            case BAIXA -> "Baixa";
            case MEDIA -> "Media";
            case ALTA -> "Alta";
            case URGENTE -> "Urgente";
        };
    }

    private String traduzirDiaSemana(LocalDateTime data) {
        if (data == null) return "";
        return switch (data.getDayOfWeek()) {
            case MONDAY -> "Segunda";
            case TUESDAY -> "Terca";
            case WEDNESDAY -> "Quarta";
            case THURSDAY -> "Quinta";
            case FRIDAY -> "Sexta";
            case SATURDAY -> "Sabado";
            case SUNDAY -> "Domingo";
        };
    }
}
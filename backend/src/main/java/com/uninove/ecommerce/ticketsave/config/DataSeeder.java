package com.uninove.ecommerce.ticketsave.config;

import com.uninove.ecommerce.ticketsave.entity.Ticket;
import com.uninove.ecommerce.ticketsave.enums.TicketCategoria;
import com.uninove.ecommerce.ticketsave.enums.TicketPrioridade;
import com.uninove.ecommerce.ticketsave.enums.TicketStatus;
import com.uninove.ecommerce.ticketsave.repository.TicketRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TicketRepository ticketRepository;

    public DataSeeder(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Override
    public void run(String... args) {
        if (ticketRepository.count() > 0) {
            return;
        }

        criarTicket("Pagamento nao aprovado", "Tentei comprar um iPhone 15 e o pagamento no cartao foi recusado duas vezes, mas o valor foi debitado.", "Carlos Silva", TicketStatus.ABERTO, TicketCategoria.PAGAMENTO, TicketPrioridade.ALTA, LocalDateTime.now().minusDays(1));
        criarTicket("Atraso na entrega", "Meu pedido #4521 deveria ter chegado ha 5 dias e ainda nao recebi nenhuma atualizacao de rastreio.", "Maria Oliveira", TicketStatus.EM_ANDAMENTO, TicketCategoria.ENTREGA, TicketPrioridade.MEDIA, LocalDateTime.now().minusDays(3));
        criarTicket("Produto com defeito - Galaxy S24", "O Samsung Galaxy S24 chegou com a tela com manchas roxas no canto inferior direito.", "Joao Santos", TicketStatus.EM_ANDAMENTO, TicketCategoria.DEFEITO, TicketPrioridade.ALTA, LocalDateTime.now().minusDays(5));
        criarTicket("Cancelamento de pedido", "Quero cancelar o pedido #4580 que fiz ontem pois encontrei preco melhor em outro lugar.", "Ana Costa", TicketStatus.RESOLVIDO, TicketCategoria.CANCELAMENTO, TicketPrioridade.BAIXA, LocalDateTime.now().minusDays(7));
        criarTicket("Troca de produto", "Comprei um fone JBL e quero trocar pelo modelo superior, pagando a diferenca.", "Pedro Almeida", TicketStatus.ABERTO, TicketCategoria.TROCA, TicketPrioridade.MEDIA, LocalDateTime.now().minusDays(2));
        criarTicket("Cobranca duplicada", "Fui cobrado duas vezes pelo mesmo pedido #4499. Preciso do estorno urgente.", "Fernanda Lima", TicketStatus.ABERTO, TicketCategoria.PAGAMENTO, TicketPrioridade.URGENTE, LocalDateTime.now().minusHours(6));
        criarTicket("Produto errado recebido", "Pedi um Notebook Dell e recebi um Notebook Lenovo. Preciso da troca.", "Lucas Martins", TicketStatus.EM_ANDAMENTO, TicketCategoria.TROCA, TicketPrioridade.ALTA, LocalDateTime.now().minusDays(4));
        criarTicket("Entrega em endereco errado", "O pedido foi entregue no endereco antigo. Ja atualizei meu cadastro mas nao refletiu.", "Juliana Ferreira", TicketStatus.RESOLVIDO, TicketCategoria.ENTREGA, TicketPrioridade.MEDIA, LocalDateTime.now().minusDays(10));
        criarTicket("Smartwatch com defeito na bateria", "O Apple Watch comprado ha 2 semanas nao segura carga por mais de 3 horas.", "Ricardo Souza", TicketStatus.ABERTO, TicketCategoria.DEFEITO, TicketPrioridade.ALTA, LocalDateTime.now().minusDays(1));
        criarTicket("Reembolso nao processado", "Devolvi o produto ha 15 dias e ainda nao recebi o reembolso no cartao.", "Patricia Rocha", TicketStatus.EM_ANDAMENTO, TicketCategoria.PAGAMENTO, TicketPrioridade.URGENTE, LocalDateTime.now().minusDays(6));
        criarTicket("Cancelar assinatura de garantia", "Quero cancelar a garantia estendida que contratei junto com o notebook.", "Bruno Nascimento", TicketStatus.RESOLVIDO, TicketCategoria.CANCELAMENTO, TicketPrioridade.BAIXA, LocalDateTime.now().minusDays(12));
        criarTicket("Tela trincada no transporte", "O monitor LG chegou com a tela trincada. A embalagem estava danificada.", "Camila Dias", TicketStatus.CANCELADO, TicketCategoria.DEFEITO, TicketPrioridade.ALTA, LocalDateTime.now().minusDays(15));
        criarTicket("Problema com cupom de desconto", "O cupom TECH20 nao esta funcionando no checkout para compras acima de R$500.", "Rafael Mendes", TicketStatus.RESOLVIDO, TicketCategoria.PAGAMENTO, TicketPrioridade.BAIXA, LocalDateTime.now().minusDays(8));
        criarTicket("Atraso pedido internacional", "Meu pedido importado esta parado na alfandega ha 20 dias sem movimentacao.", "Tatiane Barbosa", TicketStatus.EM_ANDAMENTO, TicketCategoria.ENTREGA, TicketPrioridade.MEDIA, LocalDateTime.now().minusDays(9));
        criarTicket("Trocar cor do produto", "Quero trocar o iPhone 15 azul pelo preto. O produto esta lacrado ainda.", "Gabriel Ribeiro", TicketStatus.CANCELADO, TicketCategoria.TROCA, TicketPrioridade.BAIXA, LocalDateTime.now().minusDays(11));
    }

    private void criarTicket(String titulo, String descricao, String clienteNome, TicketStatus status, TicketCategoria categoria, TicketPrioridade prioridade, LocalDateTime createdAt) {
        Ticket ticket = new Ticket();
        ticket.setTitulo(titulo);
        ticket.setDescricao(descricao);
        ticket.setClienteNome(clienteNome);
        ticket.setStatus(status);
        ticket.setCategoria(categoria);
        ticket.setPrioridade(prioridade);
        ticket.setCreatedAt(createdAt);
        ticket.setUpdatedAt(createdAt.plusHours(2));
        ticketRepository.save(ticket);
    }
}

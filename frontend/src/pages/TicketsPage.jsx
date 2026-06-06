import { useState, useEffect, useCallback } from 'react';
import { ticketService } from '../services/api';
import {
  FaPlus,
  FaSync,
  FaFileCsv,
  FaFilter,
  FaTrash,
  FaSpinner,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaTicketAlt,
  FaTimes,
  FaTag,
  FaExclamationCircle,
} from 'react-icons/fa';

const STATUS_OPTIONS = [
  { value: 'ABERTO', label: 'Aberto', color: '#3b82f6' },
  { value: 'EM_ANDAMENTO', label: 'Em Andamento', color: '#f59e0b' },
  { value: 'RESOLVIDO', label: 'Resolvido', color: '#10b981' },
  { value: 'CANCELADO', label: 'Cancelado', color: '#ef4444' },
];

const CATEGORIA_OPTIONS = [
  { value: 'PAGAMENTO', label: 'Pagamento' },
  { value: 'ENTREGA', label: 'Entrega' },
  { value: 'DEFEITO', label: 'Defeito' },
  { value: 'CANCELAMENTO', label: 'Cancelamento' },
  { value: 'TROCA', label: 'Troca' },
  { value: 'OUTRO', label: 'Outro' },
];

const PRIORIDADE_OPTIONS = [
  { value: 'BAIXA', label: 'Baixa', color: '#10b981' },
  { value: 'MEDIA', label: 'Média', color: '#3b82f6' },
  { value: 'ALTA', label: 'Alta', color: '#f59e0b' },
  { value: 'URGENTE', label: 'Urgente', color: '#ef4444' },
];

const CATEGORIA_LABELS = {
  PAGAMENTO: 'Pagamento',
  ENTREGA: 'Entrega',
  DEFEITO: 'Defeito',
  CANCELAMENTO: 'Cancelamento',
  TROCA: 'Troca',
  OUTRO: 'Outro',
};

const PRIORIDADE_LABELS = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  URGENTE: 'Urgente',
};

function TicketsPage({ usuario }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  
  // NOVO: Controle de visualização para o ADMIN
  const [visaoAdmin, setVisaoAdmin] = useState('TODOS'); // 'TODOS' ou 'MEUS'
  
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  
  const isAdmin = usuario?.perfil === 'ADMIN';

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    clienteNome: usuario?.nome || '',
    categoria: 'OUTRO',
    prioridade: 'MEDIA',
  });

  const carregarTickets = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (filtroStatus === 'TODOS') {
        res = await ticketService.listar();
      } else {
        res = await ticketService.buscarPorStatus(filtroStatus);
      }

      let dadosFiltrados = res.data;

      // LÓGICA DE PERFIL (RBAC)
      if (!isAdmin) {
        // Se for cliente comum, vê SÓ os tickets dele (filtra pelo nome)
        dadosFiltrados = dadosFiltrados.filter(t => t.clienteNome === usuario?.nome);
      } else if (visaoAdmin === 'MEUS') {
        // Se for Admin mas clicou na aba "Meus Tickets"
        dadosFiltrados = dadosFiltrados.filter(t => t.clienteNome === usuario?.nome);
      }

      setTickets(dadosFiltrados);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filtroStatus, isAdmin, usuario?.nome, visaoAdmin]);

  useEffect(() => {
    carregarTickets();
  }, [carregarTickets]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMensagem({ texto: '', tipo: '' });

    try {
      await ticketService.criar(form);
      setMensagem({ texto: 'Ticket criado com sucesso!', tipo: 'sucesso' });
      setForm({ titulo: '', descricao: '', clienteNome: usuario?.nome || '', categoria: 'OUTRO', prioridade: 'MEDIA' });
      setMostrarForm(false);
      carregarTickets();
    } catch (error) {
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).join(', ')
        : 'Erro ao criar ticket.';
      setMensagem({ texto: msg, tipo: 'erro' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (id, novoStatus) => {
    try {
      await ticketService.atualizarStatus(id, novoStatus);
      carregarTickets();
    } catch {
      alert('Erro ao atualizar status');
    }
  };

  const handleDelete = async (id, titulo) => {
    if (!window.confirm(`Excluir o ticket "${titulo}"?`)) return;
    try {
      await ticketService.deletar(id);
      carregarTickets();
    } catch {
      alert('Erro ao deletar ticket');
    }
  };

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleString('pt-BR');
  };

  const contadores = {
    aberto: tickets.filter((t) => t.status === 'ABERTO').length,
    em_andamento: tickets.filter((t) => t.status === 'EM_ANDAMENTO').length,
    resolvido: tickets.filter((t) => t.status === 'RESOLVIDO').length,
    cancelado: tickets.filter((t) => t.status === 'CANCELADO').length,
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Tickets</h1>
          <p className="page-subtitle">Gerencie seus tickets de suporte</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={carregarTickets}>
            <FaSync /> Atualizar
          </button>
          
          {/* Apenas Admins podem exportar o relatório geral CSV */}
          {isAdmin && (
            <button className="btn-outline" onClick={() => ticketService.exportarCSV()}>
              <FaFileCsv /> Exportar CSV
            </button>
          )}

          <button className="btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>
            {mostrarForm ? <><FaTimes /> Fechar</> : <><FaPlus /> Novo Ticket</>}
          </button>
        </div>
      </div>

      {mensagem.texto && (
        <div className={`alert alert-${mensagem.tipo}`}>
          {mensagem.texto}
          <button onClick={() => setMensagem({ texto: '', tipo: '' })}><FaTimes /></button>
        </div>
      )}

      {/* NOVO: Abas de navegação exclusivas para o ADMIN */}
      {isAdmin && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          <button 
            onClick={() => setVisaoAdmin('TODOS')}
            style={{ padding: '8px 16px', background: visaoAdmin === 'TODOS' ? '#ff4d00' : 'transparent', color: visaoAdmin === 'TODOS' ? '#fff' : '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Todos os Tickets (Visão Admin)
          </button>
          <button 
            onClick={() => setVisaoAdmin('MEUS')}
            style={{ padding: '8px 16px', background: visaoAdmin === 'MEUS' ? '#ff4d00' : 'transparent', color: visaoAdmin === 'MEUS' ? '#fff' : '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Apenas Meus Tickets
          </button>
        </div>
      )}

      {mostrarForm && (
        <div className="form-card">
          <h3>Novo Ticket</h3>
          <form onSubmit={handleSubmit} className="ticket-form-grid">
            <div className="form-group">
              <label>Nome do Cliente</label>
              <input
                type="text"
                name="clienteNome"
                placeholder="Ex: Rodrigo Silva"
                value={form.clienteNome}
                onChange={handleFormChange}
                required
                disabled={!isAdmin} // Cliente não pode mudar o próprio nome no ticket
              />
            </div>
            <div className="form-group">
              <label>Título do Problema</label>
              <input
                type="text"
                name="titulo"
                placeholder="Ex: Produto com defeito"
                value={form.titulo}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <select name="categoria" value={form.categoria} onChange={handleFormChange} required>
                {CATEGORIA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Prioridade</label>
              <select name="prioridade" value={form.prioridade} onChange={handleFormChange} required>
                {PRIORIDADE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group full-width">
              <label>Descrição</label>
              <textarea
                name="descricao"
                placeholder="Descreva detalhadamente o problema..."
                value={form.descricao}
                onChange={handleFormChange}
                required
                rows={3}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-outline" onClick={() => setMostrarForm(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={formLoading}>
                {formLoading ? 'Criando...' : 'Criar Ticket'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contadores */}
      <div className="mini-stats">
        <div className="mini-stat" style={{ borderColor: '#3b82f6' }}>
          <span className="mini-num">{contadores.aberto}</span>
          <span className="mini-label">Abertos</span>
        </div>
        <div className="mini-stat" style={{ borderColor: '#f59e0b' }}>
          <span className="mini-num">{contadores.em_andamento}</span>
          <span className="mini-label">Em Andamento</span>
        </div>
        <div className="mini-stat" style={{ borderColor: '#10b981' }}>
          <span className="mini-num">{contadores.resolvido}</span>
          <span className="mini-label">Resolvidos</span>
        </div>
        <div className="mini-stat" style={{ borderColor: '#ef4444' }}>
          <span className="mini-num">{contadores.cancelado}</span>
          <span className="mini-label">Cancelados</span>
        </div>
      </div>

      <div className="filter-bar">
        <FaFilter />
        <span>Filtrar por Status:</span>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
          <option value="TODOS">Todos</option>
          <option value="ABERTO">Aberto</option>
          <option value="EM_ANDAMENTO">Em Andamento</option>
          <option value="RESOLVIDO">Resolvido</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-state"><FaSpinner className="spinner" /> Carregando tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="empty-state-box">
          <FaTicketAlt className="empty-icon" />
          <p>Nenhum ticket encontrado.</p>
        </div>
      ) : (
        <div className="tickets-list">
          {tickets.map((ticket) => {
            const statusInfo = STATUS_OPTIONS.find((s) => s.value === ticket.status) || STATUS_OPTIONS[0];
            const prioridadeInfo = PRIORIDADE_OPTIONS.find((p) => p.value === ticket.prioridade);
            return (
              <div key={ticket.id} className="ticket-item" style={{ borderLeftColor: statusInfo.color }}>
                <div className="ticket-item-top">
                  <div className="ticket-item-info">
                    <span className="ticket-item-id">#{ticket.id}</span>
                    <h3>{ticket.titulo}</h3>
                  </div>
                  <div className="ticket-item-actions">
                    
                    {/* Apenas Admin pode mudar o status ou deletar */}
                    {isAdmin ? (
                      <>
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className="status-dropdown"
                          style={{ borderColor: statusInfo.color, color: statusInfo.color }}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <button
                          className="btn-icon-delete"
                          onClick={() => handleDelete(ticket.id, ticket.titulo)}
                          title="Excluir"
                        >
                          <FaTrash />
                        </button>
                      </>
                    ) : (
                      // Cliente vê apenas uma badge estática com o status
                      <span className={`badge badge-${ticket.status.toLowerCase()}`}>
                        {statusInfo.label}
                      </span>
                    )}

                  </div>
                </div>
                <p className="ticket-item-desc">{ticket.descricao}</p>
                <div className="ticket-item-meta">
                  <span><FaUser /> {ticket.clienteNome}</span>
                  <span>
                    <FaTag /> <span className={`badge-inline badge-cat-${(ticket.categoria || 'OUTRO').toLowerCase()}`}>
                      {CATEGORIA_LABELS[ticket.categoria] || 'Outro'}
                    </span>
                  </span>
                  <span>
                    <FaExclamationCircle style={{ color: prioridadeInfo?.color }} />
                    <span className={`badge-inline badge-pri-${(ticket.prioridade || 'MEDIA').toLowerCase()}`}>
                      {PRIORIDADE_LABELS[ticket.prioridade] || 'Média'}
                    </span>
                  </span>
                  <span><FaCalendarAlt /> {formatarData(ticket.createdAt)}</span>
                  {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                    <span><FaClock /> Atualizado: {formatarData(ticket.updatedAt)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TicketsPage;
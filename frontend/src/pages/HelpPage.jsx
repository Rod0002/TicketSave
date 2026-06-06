import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ticketService } from '../services/api';
import { FaChevronDown, FaChevronUp, FaTicketAlt, FaCheckCircle } from 'react-icons/fa';

const faqItems = [
  {
    pergunta: 'Compra não aprovada',
    resposta: [
      'Verifique os dados do cartão de crédito',
      'Confirme se o limite está disponível',
      'Tente outro método de pagamento (PIX, boleto)',
      'Fale com seu banco para desbloquear a compra',
    ],
  },
  {
    pergunta: 'Pagamento não confirmado',
    resposta: [
      'Aguarde até 48 horas úteis para confirmação',
      'Cheque seu e-mail (incluindo spam)',
      'Confirme no aplicativo do banco se foi debitado',
      'Para boleto, o prazo pode ser de até 3 dias úteis',
    ],
  },
  {
    pergunta: 'Atraso na entrega',
    resposta: [
      'Verifique o código de rastreio nos Correios',
      'Considere feriados e finais de semana no prazo',
      'Entre em contato com nossa central abrindo um ticket',
      'Em caso de extravio, enviaremos um novo aparelho',
    ],
  },
  {
    pergunta: 'Produto com defeito',
    resposta: [
      'Solicite a troca dentro do prazo de garantia',
      'Envie fotos e vídeos do defeito no ticket',
      'Prazo de 7 dias para troca/devolução (CDC)',
      'Opção de reembolso ou produto novo',
    ],
  },
  {
    pergunta: 'Cancelamento / Arrependimento',
    resposta: [
      'Solicite o cancelamento pelo site abrindo um ticket',
      'Prazo de 7 dias após o recebimento',
      'Reembolso automático no mesmo método de pagamento',
      'Para cartão, o estorno pode levar até 2 faturas',
    ],
  },
];

// Reutilizamos a lista de nomes dos produtos da vitrine
const aparelhos = [
  'Nenhum específico',
  'iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 15',
  'Samsung S24', 'Samsung Galaxy A54', 'Samsung Galaxy S23 FE',
  'Motorola Edge 50 Pro', 'Motorola Moto G84',
  'Xiaomi 14', 'Xiaomi Poco X6', 'Xiaomi Redmi Note 13'
];

function HelpPage({ usuario }) {
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(null);
  const [mostrarTicketForm, setMostrarTicketForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  
  // Novo estado para controlar o produto selecionado
  const [produtoSelecionado, setProdutoSelecionado] = useState('Nenhum específico');
  
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    clienteNome: usuario?.nome || '',
    categoria: 'DEFEITO', // Alterado o padrão de OUTRO para DEFEITO para fazer mais sentido com produtos
    prioridade: 'MEDIA',
  });

  const toggleFaq = (index) => {
    setAberto(aberto === index ? null : index);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProdutoChange = (e) => {
    setProdutoSelecionado(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMensagem({ texto: '', tipo: '' });

    // Se o usuário selecionou um produto, anexa essa informação no início da descrição para o suporte ver
    let descricaoFinal = form.descricao;
    if (produtoSelecionado !== 'Nenhum específico') {
      descricaoFinal = `[Produto Relacionado: ${produtoSelecionado}]\n\n${form.descricao}`;
    }

    const payload = {
      ...form,
      descricao: descricaoFinal
    };

    try {
      await ticketService.criar(payload);
      setMensagem({ texto: 'Ticket criado com sucesso! Nossa equipe entrará em contato.', tipo: 'sucesso' });
      
      // Limpa o form após sucesso
      setForm({
        titulo: '',
        descricao: '',
        clienteNome: usuario?.nome || '',
        categoria: 'DEFEITO',
        prioridade: 'MEDIA',
      });
      setProdutoSelecionado('Nenhum específico');
      
      // Esconde o form após 3 segundos
      setTimeout(() => {
        setMostrarTicketForm(false);
        setMensagem({ texto: '', tipo: '' });
      }, 3000);

    } catch (error) {
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).join(', ')
        : 'Erro ao criar ticket. Tente novamente.';
      setMensagem({ texto: msg, tipo: 'erro' });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Central de Ajuda</h1>
          <p className="page-subtitle">Encontre soluções rápidas para seus problemas com nossos smartphones</p>
        </div>
      </div>

      <div className="help-layout">
        <div className="faq-section">
          <h2>Perguntas Frequentes</h2>
          <div className="faq-list">
            {faqItems.map((item, idx) => (
              <div key={idx} className={`faq-item ${aberto === idx ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(idx)}>
                  <span>{item.pergunta}</span>
                  {aberto === idx ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {aberto === idx && (
                  <div className="faq-answer">
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                      {item.resposta.map((r, i) => (
                        <li key={i} style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <FaCheckCircle style={{ color: '#10b981', marginTop: '4px', flexShrink: 0 }} />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="help-sidebar">
          <div className="help-cta-card">
            <FaTicketAlt className="cta-icon" />
            <h3>Não encontrou sua resposta?</h3>
            <p>Abra um ticket detalhando o ocorrido e nossa equipe vai te ajudar.</p>
            <button
              className="btn-primary"
              onClick={() => setMostrarTicketForm(!mostrarTicketForm)}
            >
              {mostrarTicketForm ? 'Cancelar' : 'Abrir Ticket de Suporte'}
            </button>
            
            {usuario ? (
              <Link to="/tickets" className="help-link">Ver meus tickets abertos</Link>
            ) : (
              <button onClick={() => navigate('/login')} className="help-link" style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
                Fazer login para acompanhar tickets
              </button>
            )}
          </div>

          {mostrarTicketForm && (
            <div className="help-ticket-form-card" style={{ marginTop: '20px' }}>
              <h3>Abrir Novo Chamado</h3>

              {mensagem.texto && (
                <div className={`alert alert-${mensagem.tipo}`} style={{ marginBottom: '15px' }}>
                  {mensagem.texto}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Seu Nome</label>
                  <input
                    type="text"
                    name="clienteNome"
                    value={form.clienteNome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Produto Relacionado</label>
                  <select 
                    value={produtoSelecionado}
                    onChange={handleProdutoChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    {aparelhos.map(aparelho => (
                      <option key={aparelho} value={aparelho}>{aparelho}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Categoria do Problema</label>
                  <select 
                    name="categoria" 
                    value={form.categoria} 
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="DEFEITO">Defeito no Aparelho</option>
                    <option value="ENTREGA">Problemas na Entrega</option>
                    <option value="PAGAMENTO">Erro no Pagamento</option>
                    <option value="TROCA">Solicitar Troca</option>
                    <option value="CANCELAMENTO">Cancelamento</option>
                    <option value="OUTRO">Outros Assuntos</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Título (Resumo do problema)</label>
                  <input
                    type="text"
                    name="titulo"
                    placeholder="Ex: Tela arranhada, pedido não chegou..."
                    value={form.titulo}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Descrição Detalhada</label>
                  <textarea
                    name="descricao"
                    placeholder="Descreva com detalhes o que aconteceu..."
                    value={form.descricao}
                    onChange={handleChange}
                    required
                    rows={4}
                  />
                </div>
                
                <button type="submit" className="btn-primary" disabled={formLoading} style={{ width: '100%' }}>
                  {formLoading ? 'Enviando Chamado...' : 'Enviar Chamado'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
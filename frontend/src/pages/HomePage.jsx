 import { useState, useEffect, useCallback } from 'react';

import { Link } from 'react-router-dom';

import { ticketService } from '../services/api';

import {

  FaTicketAlt,

  FaHourglassHalf,

  FaCheckCircle,

  FaTimesCircle,

  FaPlus,

  FaArrowRight,

  FaExclamationTriangle,

  FaFileExcel,

} from 'react-icons/fa';

import {

  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,

  BarChart, Bar, XAxis, YAxis, CartesianGrid,

  AreaChart, Area,

} from 'recharts';


const STATUS_COLORS = {

  ABERTO: '#3b82f6',

  EM_ANDAMENTO: '#f59e0b',

  RESOLVIDO: '#10b981',

  CANCELADO: '#ef4444',

};


const CATEGORIA_COLORS = {

  PAGAMENTO: '#8b5cf6',

  ENTREGA: '#06b6d4',

  DEFEITO: '#f43f5e',

  CANCELAMENTO: '#64748b',

  TROCA: '#f97316',

  OUTRO: '#a3a3a3',

};


const PRIORIDADE_COLORS = {

  BAIXA: '#10b981',

  MEDIA: '#3b82f6',

  ALTA: '#f59e0b',

  URGENTE: '#ef4444',

};


const STATUS_LABELS = {

  ABERTO: 'Aberto',

  EM_ANDAMENTO: 'Em Andamento',

  RESOLVIDO: 'Resolvido',

  CANCELADO: 'Cancelado',

};


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

  MEDIA: 'Media',

  ALTA: 'Alta',

  URGENTE: 'Urgente',

};


function HomePage({ usuario })

{

  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);


  const carregarTickets = useCallback(async () => {

    try {

      const res = await ticketService.listar();

      setTickets(res.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }, []);


  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect

    carregarTickets();

  }, [carregarTickets]);


  const contadores = {

    total: tickets.length,

    aberto: tickets.filter((t) => t.status === 'ABERTO').length,

    em_andamento: tickets.filter((t) => t.status === 'EM_ANDAMENTO').length,

    resolvido: tickets.filter((t) => t.status === 'RESOLVIDO').length,

    cancelado: tickets.filter((t) => t.status === 'CANCELADO').length,

  };


  const statusData = [

    { name: 'Aberto', value: contadores.aberto, color: STATUS_COLORS.ABERTO },

    { name: 'Em Andamento', value: contadores.em_andamento, color: STATUS_COLORS.EM_ANDAMENTO },

    { name: 'Resolvido', value: contadores.resolvido, color: STATUS_COLORS.RESOLVIDO },

    { name: 'Cancelado', value: contadores.cancelado, color: STATUS_COLORS.CANCELADO },

  ].filter(d => d.value > 0);


  const categoriaMap = {};

  tickets.forEach(t => {

    const cat = t.categoria || 'OUTRO';

    categoriaMap[cat] = (categoriaMap[cat] || 0) + 1;

  });

  const categoriaData = Object.entries(categoriaMap).map(([key, value]) => ({

    name: CATEGORIA_LABELS[key] || key,

    quantidade: value,

    fill: CATEGORIA_COLORS[key] || '#a3a3a3',

  }));


  const prioridadeMap = {};

  tickets.forEach(t => {

    const pri = t.prioridade || 'MEDIA';

    prioridadeMap[pri] = (prioridadeMap[pri] || 0) + 1;

  });

  const prioridadeData = Object.entries(prioridadeMap).map(([key, value]) => ({

    name: PRIORIDADE_LABELS[key] || key,

    quantidade: value,

    fill: PRIORIDADE_COLORS[key] || '#a3a3a3',

  }));


  const diasMap = {};

  tickets.forEach(t => {

    if (t.createdAt) {

      const data = new Date(t.createdAt);

      if (Number.isNaN(data.getTime())) return;


      const dateKey = data.toISOString().slice(0, 10);

      if (!diasMap[dateKey]) {

        diasMap[dateKey] = {

          dateKey,

          dia: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),

          tickets: 0,

        };

      }

      diasMap[dateKey].tickets += 1;

    }

  });

  const evolucaoData = Object.values(diasMap)

    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));


  const recentes = tickets.slice(0, 5);


  const formatarData = (data) => {

    if (!data) return '-';

    return new Date(data).toLocaleString('pt-BR');

  };


  const taxaResolucao = contadores.total > 0

    ? Math.round((contadores.resolvido / contadores.total) * 100)

    : 0;


  const urgentes = tickets.filter(t => t.prioridade === 'URGENTE' && t.status !== 'RESOLVIDO' && t.status !== 'CANCELADO').length;


  if (loading) {

    return (

      <div className="page-container">

        <div className="loading-state">Carregando Home...</div>

      </div>

    );

  }


  return (

    <div className="page-container">

      <div className="page-header">

        <div>

          <h1>Home</h1>

          <p className="page-subtitle">

            Bem-vindo, <strong>{usuario.nome}</strong>! Aqui esta o resumo dos seus tickets.

          </p>

        </div>

        <div className="header-actions">

          <button className="btn-outline" onClick={() => ticketService.exportarCSV()}>

            <FaFileExcel /> Exportar Csv

          </button>

          <Link to="/tickets" className="btn-primary">

            <FaPlus /> Novo Ticket

          </Link>

        </div>

      </div>


      <div className="Home-cards">

        <div className="dash-card card-total">

          <div className="dash-card-icon"><FaTicketAlt /></div>

          <div className="dash-card-info">

            <span className="dash-card-num">{contadores.total}</span>

            <span className="dash-card-label">Total</span>

          </div>

        </div>

        <div className="dash-card card-aberto">

          <div className="dash-card-icon"><FaTicketAlt /></div>

          <div className="dash-card-info">

            <span className="dash-card-num">{contadores.aberto}</span>

            <span className="dash-card-label">Abertos</span>

          </div>

        </div>

        <div className="dash-card card-andamento">

          <div className="dash-card-icon"><FaHourglassHalf /></div>

          <div className="dash-card-info">

            <span className="dash-card-num">{contadores.em_andamento}</span>

            <span className="dash-card-label">Em Andamento</span>

          </div>

        </div>

        <div className="dash-card card-resolvido">

          <div className="dash-card-icon"><FaCheckCircle /></div>

          <div className="dash-card-info">

            <span className="dash-card-num">{contadores.resolvido}</span>

            <span className="dash-card-label">Resolvidos</span>

          </div>

        </div>

        <div className="dash-card card-cancelado">

          <div className="dash-card-icon"><FaTimesCircle /></div>

          <div className="dash-card-info">

            <span className="dash-card-num">{contadores.cancelado}</span>

            <span className="dash-card-label">Cancelados</span>

          </div>

        </div>

      </div>


      <div className="Home-metrics">

        <div className="metric-card">

          <span className="metric-value" style={{ color: '#10b981' }}>{taxaResolucao}%</span>

          <span className="metric-label">Taxa de Resolucao</span>

        </div>

        <div className="metric-card">

          <span className="metric-value" style={{ color: urgentes > 0 ? '#ef4444' : '#10b981' }}>

            {urgentes}

          </span>

          <span className="metric-label">

            <FaExclamationTriangle style={{ marginRight: 4 }} />

            Urgentes Pendentes

          </span>

        </div>

      </div>


      <div className="Home-charts">

        <div className="chart-card">

          <h3>Tickets por Status</h3>

          {statusData.length > 0 ? (

            <ResponsiveContainer width="100%" height={280}>

              <PieChart>

                <Pie

                  data={statusData}

                  cx="50%"

                  cy="50%"

                  innerRadius={55}

                  outerRadius={95}

                  paddingAngle={4}

                  dataKey="value"

                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}

                >

                  {statusData.map((entry, index) => (

                    <Cell key={`cell-${index}`} fill={entry.color} />

                  ))}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          ) : (

            <div className="empty-chart">Nenhum dado disponivel</div>

          )}

        </div>


        <div className="chart-card">

          <h3>Tickets por Categoria</h3>

          {categoriaData.length > 0 ? (

            <ResponsiveContainer width="100%" height={280}>

              <BarChart data={categoriaData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>

                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                <XAxis dataKey="name" tick={{ fontSize: 12 }} />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar dataKey="quantidade" radius={[6, 6, 0, 0]}>

                  {categoriaData.map((entry, index) => (

                    <Cell key={`cat-${index}`} fill={entry.fill} />

                  ))}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          ) : (

            <div className="empty-chart">Nenhum dado disponivel</div>

          )}

        </div>


        <div className="chart-card">

          <h3>Tickets por Prioridade</h3>

          {prioridadeData.length > 0 ? (

            <ResponsiveContainer width="100%" height={280}>

              <BarChart data={prioridadeData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>

                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                <XAxis type="number" allowDecimals={false} />

                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />

                <Tooltip />

                <Bar dataKey="quantidade" radius={[0, 6, 6, 0]} barSize={28}>

                  {prioridadeData.map((entry, index) => (

                    <Cell key={`pri-${index}`} fill={entry.fill} />

                  ))}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          ) : (

            <div className="empty-chart">Nenhum dado disponivel</div>

          )}

        </div>


        <div className="chart-card">

          <h3>Evolucao de Tickets</h3>

          {evolucaoData.length > 0 ? (

            <ResponsiveContainer width="100%" height={280}>

              <AreaChart data={evolucaoData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>

                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                <XAxis dataKey="dia" tick={{ fontSize: 12 }} />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Area

                  type="monotone"

                  dataKey="tickets"

                  stroke="#ff4d00"

                  fill="rgba(255, 77, 0, 0.15)"

                  strokeWidth={2}

                />

              </AreaChart>

            </ResponsiveContainer>

          ) : (

            <div className="empty-chart">Nenhum dado disponivel</div>

          )}

        </div>

      </div>


      <div className="Home-section">

        <div className="section-header">

          <h2>Tickets Recentes</h2>

          <Link to="/tickets" className="section-link">

            Ver todos <FaArrowRight />

          </Link>

        </div>


        {recentes.length === 0 ? (

          <div className="empty-state-box">

            <FaTicketAlt className="empty-icon" />

            <p>Nenhum ticket cadastrado ainda.</p>

            <Link to="/tickets" className="btn-primary">Criar primeiro ticket</Link>

          </div>

        ) : (

          <div className="table-container">

            <table className="data-table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Titulo</th>

                  <th>Cliente</th>

                  <th>Categoria</th>

                  <th>Prioridade</th>

                  <th>Status</th>

                  <th>Data</th>

                </tr>

              </thead>

              <tbody>

                {recentes.map((t) => (

                  <tr key={t.id}>

                    <td className="td-id">#{t.id}</td>

                    <td className="td-titulo">{t.titulo}</td>

                    <td>{t.clienteNome}</td>

                    <td>

                      <span className={`badge badge-cat-${(t.categoria || 'OUTRO').toLowerCase()}`}>

                        {CATEGORIA_LABELS[t.categoria] || t.categoria || 'Outro'}

                      </span>

                    </td>

                    <td>

                      <span className={`badge badge-pri-${(t.prioridade || 'MEDIA').toLowerCase()}`}>

                        {PRIORIDADE_LABELS[t.prioridade] || t.prioridade || 'Media'}

                      </span>

                    </td>

                    <td>

                      <span className={`badge badge-${t.status.toLowerCase()}`}>

                        {STATUS_LABELS[t.status] || t.status}

                      </span>

                    </td>

                    <td className="td-data">{formatarData(t.createdAt)}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}


export default HomePage;


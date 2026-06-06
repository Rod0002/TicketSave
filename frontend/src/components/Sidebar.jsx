import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaTicketAlt,
  FaShoppingBag,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBars,
  FaUserCircle,
  FaSignInAlt,
} from 'react-icons/fa';

function Sidebar({ usuario, aberta, onToggle, onLogout }) {
  const navigate = useNavigate();

  // Links que todo mundo pode ver (Visitantes e Logados)
  const linksPublicos = [
    { to: '/produtos', icon: <FaShoppingBag />, label: 'Produtos' },
    { to: '/ajuda', icon: <FaQuestionCircle />, label: 'Ajuda' },
  ];

  // Monta os links privados dependendo do perfil
  let linksPrivados = [];
  if (usuario) {
    // Se for ADMIN, ele vê o Dashboard (Home)
    if (usuario.perfil === 'ADMIN') {
      linksPrivados.push({ to: '/home', icon: <FaHome />, label: 'Home' });
    }
    // Todo mundo que está logado (ADMIN ou CLIENTE) vê a tela de Tickets
    linksPrivados.push({ to: '/tickets', icon: <FaTicketAlt />, label: 'Tickets' });
  }

  // Junta os arrays
  const links = usuario ? [...linksPrivados, ...linksPublicos] : linksPublicos;

  return (
    <aside className={`sidebar ${aberta ? 'open' : 'closed'}`}>
      <div className="sidebar-top">
        <button className="sidebar-toggle" onClick={onToggle}>
          <FaBars />
        </button>
        {aberta && (
          <div className="sidebar-brand">
            <span className="brand-tech">TECH</span>
            <span className="brand-store">Store</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title={link.label}
          >
            <span className="sidebar-icon">{link.icon}</span>
            {aberta && <span className="sidebar-label">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {aberta && (
          <div className="sidebar-user">
            <FaUserCircle className="user-avatar" />
            <div className="user-info">
              {/* Usa fallback se o usuário for nulo */}
              <span className="user-name">{usuario ? usuario.nome : 'Visitante'}</span>
              <span className="user-email">{usuario ? usuario.email : 'Faça login para gerenciar'}</span>
            </div>
          </div>
        )}
        
        {/* Troca o botão de Sair por Entrar baseado no login */}
        {usuario ? (
          <button className="sidebar-link logout-btn" onClick={onLogout} title="Sair">
            <span className="sidebar-icon"><FaSignOutAlt /></span>
            {aberta && <span className="sidebar-label">Sair</span>}
          </button>
        ) : (
          <button className="sidebar-link" onClick={() => navigate('/login')} title="Entrar" style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
            <span className="sidebar-icon"><FaSignInAlt /></span>
            {aberta && <span className="sidebar-label">Entrar</span>}
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
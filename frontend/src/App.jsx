import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TicketsPage from './pages/TicketsPage';
import HelpPage from './pages/HelpPage';
import ProdutosPage from './pages/ProdutosPage';
import './styles.css';

function App() {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('usuario');
    return saved ? JSON.parse(saved) : null;
  });
  const [sidebarAberta, setSidebarAberta] = useState(true);

  const handleLogin = (user) => {
    setUsuario(user);
    localStorage.setItem('usuario', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  return (
    <Router>
      <Routes>
        {/* 1. Rota de Login isolada */}
        <Route 
          path="/login" 
          element={usuario ? <Navigate to={usuario.perfil === 'ADMIN' ? "/home" : "/tickets"} /> : <LoginPage onLogin={handleLogin} />} 
        />

        {/* 2. Todas as outras rotas que dividem o layout com a Sidebar */}
        <Route
          path="*"
          element={
            <div className="app-layout">
              <Sidebar
                usuario={usuario}
                aberta={sidebarAberta}
                onToggle={() => setSidebarAberta(!sidebarAberta)}
                onLogout={handleLogout}
              />
              <div className={`main-area ${sidebarAberta ? '' : 'sidebar-collapsed'}`}>
                <Routes>
                  {/* Rotas Públicas */}
                  <Route path="/produtos" element={<ProdutosPage />} />
                  <Route path="/ajuda" element={<HelpPage usuario={usuario} />} />

                  {/* Rotas Privadas */}
                  {/* Home: Se não tiver logado vai pro Login. Se tiver, mas NÃO for admin, vai pros Tickets */}
                  <Route 
                    path="/home" 
                    element={
                      !usuario ? <Navigate to="/login" /> 
                      : (usuario.perfil === 'ADMIN' ? <HomePage usuario={usuario} /> : <Navigate to="/tickets" />)
                    } 
                  />
                  
                  {/* Tickets: Qualquer usuário logado (Cliente ou Admin) pode acessar */}
                  <Route 
                    path="/tickets" 
                    element={usuario ? <TicketsPage usuario={usuario} /> : <Navigate to="/login" />} 
                  />

                  {/* Regra da Página Inicial (Raiz) */}
                  <Route 
                    path="/" 
                    element={<Navigate to={!usuario ? "/produtos" : (usuario.perfil === 'ADMIN' ? "/home" : "/tickets")} />} 
                  />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
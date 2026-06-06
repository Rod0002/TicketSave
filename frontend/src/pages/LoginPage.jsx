import { useState } from 'react';
import { authService } from '../services/api';
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';

function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    codigoAdmin: '', // Novo campo adicionado
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      let usuarioRetornado = null;

      if (isLogin) {
        // Se for login, assumimos que o back-end devolve os dados do usuário.
        const res = await authService.login({
          email: form.email,
          senha: form.senha,
        });
        usuarioRetornado = res.data;
      } else {
        // Se for cadastro
        const res = await authService.cadastro({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
        });
        usuarioRetornado = res.data;
      }

      // LÓGICA DO PERFIL (RBAC Front-end)
      // Se na hora de criar a conta a pessoa digitou "admin", salva como ADMIN
      // Se for login, mantém o perfil que veio do banco, ou define CLIENTE como padrão
      const perfilDefinido = (!isLogin && form.codigoAdmin === 'admin') 
          ? 'ADMIN' 
          : (usuarioRetornado.perfil || 'CLIENTE');

      // Injetamos o perfil no objeto do usuário antes de salvar no sistema
      const usuarioComPerfil = {
        ...usuarioRetornado,
        perfil: perfilDefinido
      };

      onLogin(usuarioComPerfil);

    } catch (error) {
      const data = error.response?.data;
      const msg = data?.message
        || (data?.errors ? Object.values(data.errors).join(', ') : null)
        || 'Erro ao conectar. Verifique se o back-end está rodando.';
      setErro(typeof msg === 'string' ? msg : 'Erro ao processar requisição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <h1>
            <span className="brand-tech">TECH</span>
            <span className="brand-store">Store</span>
          </h1>
          <p className="login-tagline">Sistema de Gerenciamento de Tickets</p>
        </div>
        <div className="login-features">
          <div className="login-feature">
            <div className="feature-dot"></div>
            <span>Gerencie seus tickets de suporte</span>
          </div>
          <div className="login-feature">
            <div className="feature-dot"></div>
            <span>Acompanhe o status em tempo real</span>
          </div>
          <div className="login-feature">
            <div className="feature-dot"></div>
            <span>Exporte relatórios em CSV</span>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>{isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}</h2>
          <p className="login-subtitle">
            {isLogin
              ? 'Entre com suas credenciais para acessar o sistema.'
              : 'Preencha os dados abaixo para se cadastrar.'}
          </p>

          {erro && <div className="login-erro">{erro}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome completo"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={mostrarSenha ? 'text' : 'password'}
                name="senha"
                placeholder="Senha"
                value={form.senha}
                onChange={handleChange}
                required
                minLength={6}
              />
              <button
                type="button"
                className="toggle-senha"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* NOVO: Campo de Código de Acesso (Aparece só no Cadastro) */}
            {!isLogin && (
              <div className="input-group">
                <FaKey className="input-icon" />
                <input
                  type="text"
                  name="codigoAdmin"
                  placeholder="Código de Acesso (Opcional)"
                  value={form.codigoAdmin}
                  onChange={handleChange}
                  title="Digite 'admin' para criar uma conta de administrador"
                />
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading
                ? 'Carregando...'
                : isLogin
                ? 'Entrar'
                : 'Cadastrar'}
            </button>
          </form>

          <div className="login-switch">
            {isLogin ? (
              <p>
                Não tem conta?{' '}
                <button onClick={() => { setIsLogin(false); setErro(''); setForm({...form, codigoAdmin: ''}); }}>
                  Cadastre-se
                </button>
              </p>
            ) : (
              <p>
                Já tem conta?{' '}
                <button onClick={() => { setIsLogin(true); setErro(''); }}>
                  Faça login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { GoogleIcon } from '../components/Icons';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const handleLogin = () => {
    navigate('/perfil');
  };

  return (
    <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
      <div className="layout-container">
        <Header showNav={true} />
        <div style={{ padding: '20px 160px', display: 'flex', flex: 1, justifyContent: 'center' }}>
          <div className="login-container">
            <div className="tabs-container">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => setActiveTab('login')}
                >
                  Login
                </button>
                <button
                  className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => setActiveTab('register')}
                >
                  Criar Conta
                </button>
              </div>
            </div>

            {activeTab === 'login' && (
              <>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Senha</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Sua senha"
                  />
                </div>
                <p className="forgot-password">Esqueci minha senha</p>

                <div className="btn-container">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={handleLogin}
                  >
                    Entrar
                  </button>
                </div>

                <div className="btn-container">
                  <button
                    className="btn btn-secondary btn-block google-btn"
                    onClick={handleLogin}
                  >
                    <GoogleIcon />
                    Entrar com Google
                  </button>
                </div>
              </>
            )}

            {activeTab === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Senha</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Crie uma senha"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmar Senha</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Confirme sua senha"
                  />
                </div>

                <div className="btn-container">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={handleLogin}
                  >
                    Criar Conta
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

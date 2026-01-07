import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { UserIcon, LockIcon, SignOutIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      updateUser({ name, email });
      setMessage({ type: 'success', text: 'Dados salvos com sucesso!' });
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar dados.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="layout-container">
          <Header />
          <div style={{ padding: '40px', textAlign: 'center' }}>
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="layout-container">
        <Header />
        <div className="page-content">
          <Sidebar />
          <div className="main-content">
            <div className="profile-content">
              <div className="profile-card">
                <div className="profile-header">
                  <div
                    className="profile-avatar"
                    style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6_iY1LQAk_SuACxa6D6B6KeOdBmt7hMnR55M4K3fMLii6EmQY1bK1OlM0qaJ0YACo6uZyKX9iNY5_ZkE43fNtFMQi7bbI82NW7Ia8k_Gm0x8piELw-or5YXka1QJ_MAdJ_5LmfYFu7GshmQvvB6xHXL-1P6hCsQQGZdHCpRn2nYX9SxcjgMYE6jzNbWDhiE06yBymSYdzYooorWsqdQBvG6BzpD4ohuB45iD6Lm0RgF_3x1kz80MsRkVOFwZBMpF8HkypFTcxK9ll")',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ff6b93',
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold'
                    }}
                  >
                    {!user.name ? '' : user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <p className="profile-name">{user.name}</p>
                    <p className="profile-email">{user.email}</p>
                    <p className="profile-edit-link">Editar</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="profile-menu-item">
                  <div className="profile-menu-icon">
                    <UserIcon />
                  </div>
                  <p className="profile-menu-text">Meus Dados Pessoais</p>
                </div>

                {message && (
                  <div style={{ 
                    backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2', 
                    color: message.type === 'success' ? '#059669' : '#dc2626', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    marginBottom: '16px',
                    fontSize: '14px'
                  }}>
                    {message.text}
                  </div>
                )}

                {/* Form Fields */}
                <div className="form-group" style={{ maxWidth: '100%' }}>
                  <label className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ maxWidth: '100%' }}>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="btn-container">
                  <button 
                    className="btn btn-primary btn-block" 
                    style={{ backgroundColor: '#ff6b93' }}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>

                <div className="profile-menu-item" style={{ marginTop: '16px' }}>
                  <div className="profile-menu-icon">
                    <LockIcon />
                  </div>
                  <p className="profile-menu-text">Alterar Senha</p>
                </div>

                <div
                  onClick={handleLogout}
                  className="profile-menu-item"
                  style={{ marginBottom: '32px', cursor: 'pointer', borderRadius: '8px' }}
                >
                  <div className="profile-menu-icon">
                    <SignOutIcon />
                  </div>
                  <p className="profile-menu-text">Sair</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { UserIcon, LockIcon, SignOutIcon } from '../components/Icons';

const Profile = () => {
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
                      backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6_iY1LQAk_SuACxa6D6B6KeOdBmt7hMnR55M4K3fMLii6EmQY1bK1OlM0qaJ0YACo6uZyKX9iNY5_ZkE43fNtFMQi7bbI82NW7Ia8k_Gm0x8piELw-or5YXka1QJ_MAdJ_5LmfYFu7GshmQvvB6xHXL-1P6hCsQQGZdHCpRn2nYX9SxcjgMYE6jzNbWDhiE06yBymSYdzYooorWsqdQBvG6BzpD4ohuB45iD6Lm0RgF_3x1kz80MsRkVOFwZBMpF8HkypFTcxK9ll")'
                    }}
                  />
                  <div className="profile-info">
                    <p className="profile-name">Sophia Bennett</p>
                    <p className="profile-email">sophia.bennett@email.com</p>
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

                {/* Form Fields */}
                <div className="form-group" style={{ maxWidth: '100%' }}>
                  <label className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    className="form-input"
                    defaultValue="Sophia Bennett"
                  />
                </div>

                <div className="form-group" style={{ maxWidth: '100%' }}>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    defaultValue="sophia.bennett@email.com"
                  />
                </div>

                <div className="btn-container">
                  <button className="btn btn-primary btn-block" style={{ backgroundColor: '#ff6b93' }}>
                    Salvar
                  </button>
                </div>

                <div className="profile-menu-item" style={{ marginTop: '16px' }}>
                  <div className="profile-menu-icon">
                    <LockIcon />
                  </div>
                  <p className="profile-menu-text">Alterar Senha</p>
                </div>

                <Link
                  to="/login"
                  className="profile-menu-item"
                  style={{ marginBottom: '32px', cursor: 'pointer', borderRadius: '8px' }}
                >
                  <div className="profile-menu-icon">
                    <SignOutIcon />
                  </div>
                  <p className="profile-menu-text">Sair</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

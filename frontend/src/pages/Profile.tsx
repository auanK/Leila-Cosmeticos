import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { UserIcon, LockIcon, SignOutIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const IMGUR_CLIENT_ID = '2595b30a05bc570'; 

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
      setCpf(user.cpf || '');
      setPhone(user.phone || '');
      if (user.profile_image) {
        setAvatarUrl(user.profile_image);
      }
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToImgur = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Falha ao fazer upload da imagem');
    }

    return data.data.link;
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      let profileImageUrl = avatarUrl;

      if (avatarFile) {
        setIsUploading(true);
        try {
          profileImageUrl = await uploadImageToImgur(avatarFile);
        } catch {
          setMessage({ type: 'error', text: 'Erro ao fazer upload da imagem.' });
          setIsSaving(false);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const response = await api.updateProfile({
        name,
        email,
        phone,
        profile_image: profileImageUrl.startsWith('data:') ? undefined : profileImageUrl,
      });

      updateUser({ 
        name, 
        email, 
        phone,
        profile_image: response.user?.profile_image || profileImageUrl
      });
      
      setAvatarFile(null);
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
                {/* Avatar editável */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <div
                    onClick={handleAvatarClick}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      backgroundColor: avatarUrl ? 'transparent' : '#ff6b93',
                      backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      position: 'relative',
                      border: '3px solid #fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    {!avatarUrl && (user.name ? user.name.charAt(0).toUpperCase() : '')}
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      backgroundColor: '#ff6b93',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid white',
                      fontSize: '14px'
                    }}>
                      📷
                    </div>
                  </div>
                  <p style={{ marginTop: '8px', fontSize: '12px', color: '#9a4c66' }}>
                    Clique para alterar a foto
                  </p>
                </div>

                {/* Menu Item */}
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

                <div className="form-group" style={{ maxWidth: '100%' }}>
                  <label className="form-label">CPF</label>
                  <input
                    type="text"
                    className="form-input"
                    value={cpf}
                    disabled
                    style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed', color: '#6b7280' }}
                  />
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                    O CPF não pode ser alterado
                  </p>
                </div>

                <div className="form-group" style={{ maxWidth: '100%' }}>
                  <label className="form-label">Telefone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="btn-container">
                  <button 
                    className="btn btn-primary btn-block" 
                    style={{ backgroundColor: '#ff6b93' }}
                    onClick={handleSave}
                    disabled={isSaving || isUploading}
                  >
                    {isUploading ? 'Enviando imagem...' : isSaving ? 'Salvando...' : 'Salvar'}
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

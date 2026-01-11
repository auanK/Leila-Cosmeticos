import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/admin.css';

interface AdminHeaderProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  align?: 'space-between' | 'right';
}

const AdminHeader = ({
  showSearch = false,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  align = 'space-between'
}: AdminHeaderProps) => {
  const { user } = useAuth();
  const justifyContent = align === 'right' ? 'flex-end' : 'space-between';

  return (
    <header className="top-header" style={{ justifyContent }}>
      {showSearch && (
        <div className="search-box">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={onSearchChange ? searchValue ?? '' : undefined}
            onChange={onSearchChange ? (e) => onSearchChange(e.target.value) : undefined}
          />
        </div>
      )}

      <div className="header-actions">
        <div className="user-profile">
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px' }}>{user?.name || 'Usuário'}</p>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '10px' }}>Administrador(a)</p>
          </div>
          <div
            className="avatar"
            style={{
              backgroundImage: user?.profile_image ? `url('${user.profile_image}')` : 'none',
              backgroundColor: user?.profile_image ? 'transparent' : 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            {!user?.profile_image && user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

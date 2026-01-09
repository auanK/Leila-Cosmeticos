import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoIcon, SearchIcon, HeartIcon, ShoppingBagIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';

interface HeaderProps {
  showNav?: boolean;
}

const Header = ({ showNav = true }: HeaderProps) => {
  const { user, isAuthenticated } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const uniqueProductsCount = items.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/produtos?busca=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/" className="header-logo">
          <div className="header-logo-icon">
            <LogoIcon />
          </div>
          <h2 className="header-logo-text">Leila Cosméticos</h2>
        </Link>
        {showNav && (
          <nav className="header-nav">
            <Link to="/produtos" className="header-nav-link">Novidades</Link>
            <Link to="/produtos?categorias=maquiagem" className="header-nav-link">Maquiagem</Link>
            <Link to="/produtos?categorias=skincare" className="header-nav-link">Skincare</Link>
            <Link to="/produtos?categorias=cabelos" className="header-nav-link">Cabelos</Link>
            <Link to="/produtos?categorias=perfumes" className="header-nav-link">Perfumes</Link>
            <Link to="/produtos?promocoes=true" className="header-nav-link">Promoções</Link>
          </nav>
        )}
      </div>
      <div className="header-right">
        <form className="header-search" onSubmit={handleSearch}>
          <div className="header-search-container">
            <div className="header-search-icon">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="header-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </form>
        <div className="header-actions">
          <Link to="/favoritos" className="header-action-btn">
            <HeartIcon />
          </Link>
          <Link to="/carrinho" className="header-action-btn" style={{ position: 'relative' }}>
            <ShoppingBagIcon />
            {uniqueProductsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: '#be185d',
                color: 'white',
                fontSize: '11px',
                fontWeight: 600,
                minWidth: '18px',
                height: '18px',
                borderRadius: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px'
              }}>
                {uniqueProductsCount > 99 ? '99+' : uniqueProductsCount}
              </span>
            )}
          </Link>
        </div>
        {isAuthenticated ? (
          <Link
            to="/perfil"
            className="header-avatar"
            style={{
              backgroundImage: user?.profile_image ? `url("${user.profile_image}")` : 'none',
              backgroundColor: '#ff6b93',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Link>
        ) : (
          <Link
            to="/login"
            className="header-avatar"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC0qK1rRCblujxIaoQHfKUcDdzx4sHf6R406BE6-e7pi_ow-0_WH2bncnW1QSgN1j8gYXdOQAV-fuLaMa0aVaDvvzilmvPmRAH1NUJKqwG-4yLoXRram8-a-RVwR3FyyzT1hWVtjTRiSrVcgE56BG1Zxb8Kp88gqZMNqOIZEIM9p5ynHPc-plhMUMMCFFXf_X1Te93uAqlySJiBpdxRPhEWM_kER-lvPkJUyu5BRdAuObitiXxq1BuZlt4wVMmdbFmaint51WmogyJg")'
            }}
          />
        )}
      </div>
    </header>
  );
};

export default Header;

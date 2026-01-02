import { Link } from 'react-router-dom';
import { LogoIcon, SearchIcon, HeartIcon, ShoppingBagIcon } from './Icons';

interface HeaderProps {
  showNav?: boolean;
}

const Header = ({ showNav = true }: HeaderProps) => {
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
            <Link to="/produtos" className="header-nav-link">Maquiagem</Link>
            <Link to="/" className="header-nav-link">Skincare</Link>
            <Link to="/produtos" className="header-nav-link">Cabelo</Link>
            <Link to="/produtos" className="header-nav-link">Perfumes</Link>
            <Link to="/produtos" className="header-nav-link">Promoções</Link>
          </nav>
        )}
      </div>
      <div className="header-right">
        <label className="header-search">
          <div className="header-search-container">
            <div className="header-search-icon">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Buscar"
              className="header-search-input"
            />
          </div>
        </label>
        <div className="header-actions">
          <Link to="/favoritos" className="header-action-btn">
            <HeartIcon />
          </Link>
          <Link to="/carrinho" className="header-action-btn">
            <ShoppingBagIcon />
          </Link>
        </div>
        <Link
          to="/perfil"
          className="header-avatar"
          style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC0qK1rRCblujxIaoQHfKUcDdzx4sHf6R406BE6-e7pi_ow-0_WH2bncnW1QSgN1j8gYXdOQAV-fuLaMa0aVaDvvzilmvPmRAH1NUJKqwG-4yLoXRram8-a-RVwR3FyyzT1hWVtjTRiSrVcgE56BG1Zxb8Kp88gqZMNqOIZEIM9p5ynHPc-plhMUMMCFFXf_X1Te93uAqlySJiBpdxRPhEWM_kER-lvPkJUyu5BRdAuObitiXxq1BuZlt4wVMmdbFmaint51WmogyJg")'
          }}
        />
      </div>
    </header>
  );
};

export default Header;

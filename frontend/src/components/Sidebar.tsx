import { useLocation, useNavigate } from 'react-router-dom';
import { UserIcon, MapPinIcon, PackageIcon, HeartIcon, StarIcon } from './Icons';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/perfil', icon: <UserIcon />, label: 'Meus Dados' },
    { path: '/enderecos', icon: <MapPinIcon />, label: 'Endereços' },
    { path: '/pedidos', icon: <PackageIcon />, label: 'Meus Pedidos' },
    { path: '/favoritos', icon: <HeartIcon />, label: 'Lista de Desejos' },
    { path: '/avaliacoes', icon: <StarIcon />, label: 'Avaliações' },
  ];

  return (
    <div className="profile-sidebar">
      <div className="profile-sidebar-inner">
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={`sidebar-menu-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <div className="sidebar-menu-icon">{item.icon}</div>
              <p className="sidebar-menu-text">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

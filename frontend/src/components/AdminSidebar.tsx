import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: 'dashboard', label: 'Visão Geral' },
    { path: '/admin/produtos', icon: 'inventory_2', label: 'Produtos' },
    { path: '/admin/categorias', icon: 'category', label: 'Categorias' },
    { path: '/admin/pedidos', icon: 'shopping_bag', label: 'Pedidos' },
    { path: '/admin/clientes', icon: 'group', label: 'Clientes' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-area">
        <div className="logo-icon">
          <span className="material-symbols-outlined">auto_awesome</span>
        </div>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Leila Cosméticos</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Admin Panel</p>
        </div>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="nav-footer">
        <Link to="/admin/configuracoes" className="nav-item">
          <span className="material-symbols-outlined">settings</span>
          Configurações
        </Link>
        <Link to="/login" className="nav-item" style={{ color: '#ef4444' }}>
          <span className="material-symbols-outlined">logout</span>
          Sair
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;

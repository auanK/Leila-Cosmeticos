import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/pages/admin.css';

interface Product {
  id: number;
  name: string;
  price_from?: number;
  price_to?: number;
  current_stock?: number;
  main_image?: string;
  category_names?: string[];
}

interface Category {
  id: number;
  name: string;
}

interface Order {
  id: number;
  status: string;
  total_amount: string;
  created_at: string;
}

const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price_from: '',
    price_to: '',
    current_stock: '',
    category_ids: [] as number[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsData, categoriesData, ordersData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getOrders().catch(() => [])
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price_from) return;

    setIsLoading(true);
    try {
      await api.createProduct({
        name: newProduct.name,
        description: '',
        price_from: parseFloat(newProduct.price_from),
        price_to: parseFloat(newProduct.price_to || newProduct.price_from),
        current_stock: parseInt(newProduct.current_stock) || 0,
        main_image: '',
        category_id: newProduct.category_ids[0] || 0
      });
      setNewProduct({ name: '', price_from: '', price_to: '', current_stock: '', category_ids: [] });
      setIsModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { title: "Vendas Totais", value: "R$ 12.450,00", change: "+12.5%", icon: "payments" },
    { title: "Pedidos Realizados", value: orders.length.toString(), change: "+5.2%", icon: "shopping_cart" },
    { title: "Novos Clientes", value: "28", change: "+18.0%", icon: "person_add" }
  ];

  return (
    <div className="dashboard-container">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-icon">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <div>
            <h1 style={{fontSize: '16px', fontWeight: 'bold', margin: 0}}>Leila Cosméticos</h1>
            <p style={{fontSize: '12px', color: 'var(--text-muted)', margin: 0}}>Admin Panel</p>
          </div>
        </div>
        
        <nav className="nav-menu">
          <a href="#" className="nav-item active">
            <span className="material-symbols-outlined">dashboard</span>
            Visão Geral
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined">inventory_2</span>
            Produtos
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined">category</span>
            Categorias
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined">shopping_bag</span>
            Pedidos
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined">group</span>
            Clientes
          </a>
        </nav>

        <div className="nav-footer">
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined">settings</span>
            Configurações
          </a>
          <a href="#" className="nav-item" style={{color: '#ef4444'}}>
            <span className="material-symbols-outlined">logout</span>
            Sair
          </a>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="main-content">
        
        {/* Top Header */}
        <header className="top-header">
          <div className="search-box">
            <span className="material-symbols-outlined search-icon">search</span>
            <input type="text" placeholder="Buscar produtos, pedidos..." />
          </div>
          
          <div className="header-actions">
            <button className="btn btn-icon">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="user-profile">
              <div style={{textAlign: 'right'}}>
                <p style={{fontWeight: 'bold', margin: 0, fontSize: '14px'}}>Leila Souza</p>
                <p style={{color: 'var(--text-muted)', margin: 0, fontSize: '10px'}}>Administradora</p>
              </div>
              <div 
                className="avatar" 
                style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDEqI2geNVfiSWkVsgwXgt9RqnLZmla7AMT_lq1UAamW-TSMCJESlmr-NsilHqBh_Jtcdn3OI6qFms_bU1B9lgt2RTtV1w8FDvUMexNIQOGQ25qZntL706QEodWilON9q63h3G3a-MmVeexk3lVyjufgQJU40wD0oia1Hysp6G0pLodM_sDnwOI1VgKvoyd0CxZlnR48Scsfm1IsTwvqAkrtdmoRYZmx12OYVCniEa_7krsU3euq3JKldsvgkyfC-4fEQiqO1uIm5Y')"}}
              ></div>
            </div>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <div className="content-padding">
          
          {/* Título e Botão de Ação */}
          <div className="page-header">
            <div>
              <h2 className="page-title">Visão Geral</h2>
              <p className="page-subtitle">Acompanhe o desempenho da sua loja hoje.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <span className="material-symbols-outlined">add</span>
              Adicionar Produto
            </button>
          </div>

          {/* Cards de Estatística */}
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div className="card" key={idx}>
                <div className="card-header">
                  <div className="icon-box">
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <span className="badge-success">{stat.change}</span>
                </div>
                <p style={{color: 'var(--text-muted)', fontSize: '14px', margin: 0}}>{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Tabela de Produtos */}
          <div className="table-container">
            <div className="table-header">
              <h3 style={{margin: 0, fontSize: '18px'}}>Gestão de Produtos</h3>
              <div style={{display: 'flex', gap: '8px'}}>
                <button className="btn btn-outline">Filtrar</button>
                <button className="btn btn-outline">Exportar</button>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Status</th>
                  <th style={{textAlign: 'right'}}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-info">
                        <div 
                          className="product-img" 
                          style={{backgroundImage: `url('${product.main_image || 'https://via.placeholder.com/48'}')`}}
                        ></div>
                        <div>
                          <p style={{fontWeight: 'bold', margin: 0, fontSize: '14px'}}>{product.name}</p>
                          <p style={{color: 'var(--text-muted)', margin: 0, fontSize: '12px'}}>SKU: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="tag tag-makeup">{product.category_names?.[0] || 'Sem categoria'}</span>
                    </td>
                    <td style={{fontWeight: '600'}}>R$ {(product.price_to || product.price_from || 0).toFixed(2)}</td>
                    <td style={{color: (product.current_stock || 0) < 5 ? '#ef4444' : 'inherit', fontWeight: (product.current_stock || 0) < 5 ? 'bold' : 'normal'}}>
                      {product.current_stock || 0} un
                    </td>
                    <td>
                      <div className={`status-dot ${(product.current_stock || 0) < 5 ? 'status-low' : 'status-active'}`}>
                        <span className="dot"></span>
                        {(product.current_stock || 0) < 5 ? 'Baixo Estoque' : 'Ativo'}
                      </div>
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <button className="btn-icon" style={{border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)'}}>
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className="btn-icon" style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444'}}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="table-header">
              <h3 style={{margin: 0}}>Novo Produto</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form className="modal-body" onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label>Nome do Produto</label>
                <input 
                  className="form-input" 
                  placeholder="Ex: Batom Matte Coral" 
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div className="form-group">
                  <label>Preço (R$)</label>
                  <input 
                    className="form-input" 
                    placeholder="0,00" 
                    type="number" 
                    step="0.01"
                    value={newProduct.price_from}
                    onChange={(e) => setNewProduct({...newProduct, price_from: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Estoque</label>
                  <input 
                    className="form-input" 
                    placeholder="0" 
                    type="number"
                    value={newProduct.current_stock}
                    onChange={(e) => setNewProduct({...newProduct, current_stock: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <select 
                  className="form-input"
                  multiple
                  value={newProduct.category_ids.map(String)}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                    setNewProduct({...newProduct, category_ids: selected});
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline btn-full">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
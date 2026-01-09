import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
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
      <AdminSidebar />

      {/* Conteúdo Principal */}
      <main className="main-content">
        
        <AdminHeader searchPlaceholder="Buscar produtos, pedidos..." align="right" />

        {/* Conteúdo da Página */}
        <div className="content-padding">
          
          {/* Título e Botão de Ação */}
          <div className="page-header">
            <div>
              <h2 className="page-title">Visão Geral</h2>
              <p className="page-subtitle">Acompanhe o desempenho da sua loja hoje.</p>
            </div>
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
          <AdminTable
            title="Gestão de Produtos"
            data={products}
            filteredData={products}
            columns={[
              {
                key: 'name',
                label: 'Produto',
                render: (value, row) => (
                  <div className="product-info">
                    <div 
                      className="product-img" 
                      style={{backgroundImage: `url('${row.main_image || 'https://via.placeholder.com/48'}')`}}
                    ></div>
                    <div>
                      <p style={{fontWeight: 'bold', margin: 0, fontSize: '14px'}}>{value}</p>
                      <p style={{color: 'var(--text-muted)', margin: 0, fontSize: '12px'}}>SKU: {row.id}</p>
                    </div>
                  </div>
                )
              },
              {
                key: 'category_names',
                label: 'Categoria',
                render: (value) => (
                  <span className="tag tag-makeup">{value?.[0] || 'Sem categoria'}</span>
                )
              },
              {
                key: 'price_to',
                label: 'Preço',
                render: (value, row) => (
                  <span style={{fontWeight: '600'}}>R$ {(value || row.price_from || 0).toFixed(2)}</span>
                )
              },
              {
                key: 'current_stock',
                label: 'Estoque',
                render: (value) => (
                  <span style={{color: (value || 0) < 5 ? '#ef4444' : 'inherit', fontWeight: (value || 0) < 5 ? 'bold' : 'normal'}}>
                    {value || 0} un
                  </span>
                )
              },
              {
                key: 'current_stock',
                label: 'Status',
                render: (value) => (
                  <div className={`status-dot ${(value || 0) < 5 ? 'status-low' : 'status-active'}`}>
                    <span className="dot"></span>
                    {(value || 0) < 5 ? 'Baixo Estoque' : 'Ativo'}
                  </div>
                )
              }
            ]}
            isLoading={isLoading}
            emptyMessage="Nenhum produto cadastrado"
            countLabel="Produtos"
            onAdd={() => setIsModalOpen(true)}
            addButtonLabel="Novo Produto"
            addButtonIcon="add"
            showSortButton={true}
            actions={(row) => (
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                <button className="btn-icon" style={{border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)'}}>
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="btn-icon" style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444'}}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            )}
          />

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
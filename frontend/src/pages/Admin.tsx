import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { AdminOrder, AdminUser } from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/admin.css';

interface Product {
  id: number;
  name: string;
  price_from?: number;
  price_to?: number;
  current_stock?: number;
  main_image?: string;
  category_names?: string[];
  category_ids?: number[];
}

interface Category {
  id: number;
  name: string;
}

const Admin = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [clients, setClients] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_from: '',
    price_to: '',
    current_stock: '',
    brand: '',
    main_image: '',
    category_ids: [] as number[]
  });

  // Verificação imediata de permissão de admin
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.isAdmin && !authLoading) {
      fetchData();
    }
  }, [user?.isAdmin, authLoading]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsData, categoriesData, ordersData, clientsData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getAdminOrders().catch(() => []),
        api.getAdminUsers().catch(() => [])
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setOrders(ordersData);
      setClients(clientsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price_from: '',
      price_to: '',
      current_stock: '',
      brand: '',
      main_image: '',
      category_ids: []
    });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: '',
      price_from: String(product.price_from || ''),
      price_to: String(product.price_to || ''),
      current_stock: String(product.current_stock || ''),
      brand: '',
      main_image: product.main_image || '',
      category_ids: product.category_ids || []
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price_to) return;

    setIsSaving(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price_from: formData.price_from ? parseFloat(formData.price_from) : undefined,
        price_to: parseFloat(formData.price_to),
        current_stock: formData.current_stock ? parseInt(formData.current_stock) : 0,
        main_image: formData.main_image,
        brand: formData.brand,
        category_ids: formData.category_ids.length > 0 ? formData.category_ids : [categories[0]?.id || 1]
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
      } else {
        await api.createProduct(productData);
      }
      resetForm();
      setIsModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert(error instanceof Error ? error.message : 'Erro ao salvar produto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsSaving(true);
    try {
      await api.deleteProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      await fetchData();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert(error instanceof Error ? error.message : 'Erro ao excluir produto');
    } finally {
      setIsSaving(false);
    }
  };

  const stats = useMemo(() => {
    const totalSales = orders.reduce((acc, order) => acc + Number(order.total_amount || 0), 0);
    return [
      { 
        title: "Vendas Totais", 
        value: `R$ ${totalSales.toFixed(2).replace('.', ',')}`, 
        change: "+12.5%", 
        icon: "payments" 
      },
      { 
        title: "Pedidos Realizados", 
        value: orders.length.toString(), 
        change: "+5.2%", 
        icon: "shopping_cart" 
      },
      { 
        title: "Clientes Cadastrados", 
        value: clients.length.toString(), 
        change: "+18.0%", 
        icon: "person_add" 
      }
    ];
  }, [orders, clients]);

  // Se ainda está carregando auth ou não é admin, não renderiza nada
  if (authLoading || !user || !user.isAdmin) {
    return null;
  }

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
                  <span style={{fontWeight: '600'}}>R$ {Number(value || row.price_from || 0).toFixed(2)}</span>
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
                key: 'status',
                label: 'Status',
<<<<<<< Updated upstream
                render: (_value, row) => (
=======
                render: (value, row) => (
>>>>>>> Stashed changes
                  <div className={`status-dot ${(row.current_stock || 0) < 5 ? 'status-low' : 'status-active'}`}>
                    <span className="dot"></span>
                    {(row.current_stock || 0) < 5 ? 'Baixo Estoque' : 'Ativo'}
                  </div>
                )
              }
            ]}
            isLoading={isLoading}
            emptyMessage="Nenhum produto cadastrado"
            countLabel="Produtos"
            showSortButton={false}
            actions={(row) => (
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                <button className="btn-icon" style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#3b82f6'}} onClick={() => openEditModal(row)}>
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="btn-icon" style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444'}} onClick={() => openDeleteModal(row)}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            )}
          />

        </div>
      </main>

      {/* Modal Criar/Editar */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '520px'}}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="input-group">
                  <label className="input-label">Nome do Produto *</label>
                  <input 
                    className="form-input" 
                    placeholder="Ex: Batom Matte Coral" 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px'}}>
                  <div className="input-group">
                    <label className="input-label">Preço (R$) *</label>
                    <input 
                      className="form-input" 
                      placeholder="0,00" 
                      type="number" 
                      step="0.01"
                      value={formData.price_to}
                      onChange={(e) => setFormData({...formData, price_to: e.target.value})}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Estoque</label>
                    <input 
                      className="form-input" 
                      placeholder="0" 
                      type="number"
                      value={formData.current_stock}
                      onChange={(e) => setFormData({...formData, current_stock: e.target.value})}
                    />
                  </div>
                </div>
                <div className="input-group" style={{marginTop: '16px'}}>
                  <label className="input-label">URL da Imagem</label>
                  <input 
                    className="form-input" 
                    placeholder="https://exemplo.com/imagem.jpg" 
                    type="url"
                    value={formData.main_image}
                    onChange={(e) => setFormData({...formData, main_image: e.target.value})}
                  />
                  {formData.main_image && (
                    <div style={{marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <img 
                        src={formData.main_image} 
                        alt="Preview" 
                        style={{width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)'}}
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <span style={{fontSize: '12px', color: 'var(--text-muted)'}}>Preview da imagem</span>
                    </div>
                  )}
                </div>
                <div className="input-group" style={{marginTop: '16px'}}>
                  <label className="input-label">Categoria</label>
                  <select 
                    className="form-input"
                    value={formData.category_ids[0] || ''}
                    onChange={(e) => setFormData({...formData, category_ids: e.target.value ? [parseInt(e.target.value)] : []})}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Salvando...' : (editingProduct ? 'Salvar Alterações' : 'Criar Produto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmação de Exclusão */}
      {isDeleteModalOpen && productToDelete && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Exclusão</h3>
              <button className="btn-icon" onClick={() => setIsDeleteModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Tem certeza que deseja excluir o produto <strong>"{productToDelete.name}"</strong>?</p>
              <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>Esta ação não pode ser desfeita.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={isSaving}>
                {isSaving ? 'Excluindo...' : 'Excluir Produto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
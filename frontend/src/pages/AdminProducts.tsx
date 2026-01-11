import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
import { api } from '../services/api';
import type { Product, Category, CreateProductData } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/admin.css';

const AdminProducts = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
<<<<<<< Updated upstream
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_from: '',
    price_to: '',
    current_stock: '',
    brand: '',
    skin_type: '',
    weight_grams: '',
    main_image: '',
    category_ids: [] as number[],
    is_active: true
  });

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.isAdmin) return;
    fetchData();
  }, [user?.isAdmin]);

  const getStockStatus = (stock?: number) => {
    if (!stock || stock === 0) return { status: 'stock-out', label: 'ESGOTADO', isOut: true, isLow: false };
    if (stock < 10) return { status: 'stock-low', label: 'BAIXO', isOut: false, isLow: true };
    return { status: 'stock-ok', label: '', isOut: false, isLow: false };
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           String(product.id).includes(searchTerm);
      const matchesCategory = !categoryFilter || categoryFilter === '' || 
                             product.category_names?.some(c => c.toLowerCase() === categoryFilter.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price_from: '',
      price_to: '',
      current_stock: '',
      brand: '',
      skin_type: '',
      weight_grams: '',
      main_image: '',
      category_ids: [],
      is_active: true
    });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = async (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price_from: String(product.price_from || ''),
      price_to: String(product.price_to || ''),
      current_stock: String(product.current_stock || ''),
      brand: product.brand || '',
      skin_type: product.skin_type || '',
      weight_grams: String(product.weight_grams || ''),
      main_image: product.main_image || '',
      category_ids: product.category_ids || [],
      is_active: product.is_active ?? true
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const productData: CreateProductData = {
        name: formData.name,
        description: formData.description,
        price_from: formData.price_from ? parseFloat(formData.price_from) : undefined,
        price_to: parseFloat(formData.price_to),
        current_stock: formData.current_stock ? parseInt(formData.current_stock) : undefined,
        brand: formData.brand,
        skin_type: formData.skin_type,
        weight_grams: formData.weight_grams ? parseInt(formData.weight_grams) : undefined,
        main_image: formData.main_image,
        category_ids: formData.category_ids,
        is_active: formData.is_active
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
      } else {
        await api.createProduct(productData);
      }

      setIsModalOpen(false);
      resetForm();
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

  const handleCategoryToggle = (catId: number) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(catId) 
        ? prev.category_ids.filter(id => id !== catId)
        : [...prev.category_ids, catId]
    }));
  };

  if (authLoading || !user || !user.isAdmin) {
    return null;
  }
=======

  const getStockStatus = (stock: number | undefined) => {
    if (!stock || stock === 0) return { status: 'stock-out', label: 'ESGOTADO', isOut: true };
    if (stock < 10) return { status: 'stock-low', label: 'BAIXO', isLow: true };
    return { status: 'stock-ok', label: '' };
  };

  const getCategoryClass = (categoryName?: string) => {
    const nameUpper = (categoryName || '').toLowerCase();
    
    if (nameUpper.includes('skincare')) return 'tag-skincare';
    if (nameUpper.includes('maquiagem') || nameUpper.includes('makeup')) return 'badge-pill badge-purple';
    if (nameUpper.includes('fragr') || nameUpper.includes('parfum')) return 'badge-pill badge-amber';
    return 'tag-skincare';
  };

  const transformedProducts = apiProducts.map((product) => {
    const stockInfo = getStockStatus(product.current_stock);
    const categoryName = product.category_names?.[0] || 'N/A';
    const categoryId = product.category_ids?.[0];
    return {
      ...product,
      detail: product.description || product.brand || '',
      sku: `PROD-${product.id}`,
      category: categoryName,
      category_id: categoryId,
      catClass: getCategoryClass(categoryName),
      price: product.price_from ? `R$ ${Number(product.price_from).toFixed(2).replace('.', ',')}` : 'N/A',
      stock: product.current_stock || 0,
      stockStatus: stockInfo.status,
      isLow: stockInfo.isLow,
      isOut: stockInfo.isOut,
      img: product.main_image || 'https://via.placeholder.com/100'
    };
  });

  const filteredProducts = transformedProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || categoryFilter === '' || product.category_id === parseInt(categoryFilter);
    return matchesSearch && matchesCategory;
  });
>>>>>>> Stashed changes

  return (
    <div className="dashboard-container">
      <AdminSidebar />

      <main className="main-content">
        <AdminHeader align="right" />

        <div className="content-padding">
          <div className="page-header">
            <div>
              <h2 className="page-title">Gestão de Produtos</h2>
              <p className="page-subtitle">Gerencie seu catálogo, estoque e categorias em um só lugar.</p>
            </div>
          </div>

          <section className="filter-section">
            <div className="filter-card">
              <div className="input-group" style={{flex: '1 1 100%'}}>
                <label className="input-label">Busca</label>
                <div className="search-box">
                  <span className="material-symbols-outlined search-icon">search</span>
                  <input 
                    type="text" 
                    placeholder="Buscar por produto" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group" style={{width: '250px'}}>
                <label className="input-label">Categoria</label>
                <select 
                  className="form-input"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">Todas as Categorias</option>
<<<<<<< Updated upstream
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
=======
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
>>>>>>> Stashed changes
                  ))}
                </select>
              </div>
            </div>
          </section>

          <AdminTable
            title="Lista de Produtos"
            data={products}
            filteredData={filteredProducts}
            columns={[
              {
                key: 'main_image',
                label: 'Miniatura',
                render: (value, row) => {
                  const stockInfo = getStockStatus(row.current_stock);
                  return (
                    <div 
                      className={`thumb-img ${stockInfo.isOut ? 'grayscale' : ''}`} 
                      style={{
                        backgroundImage: `url('${value || 'https://via.placeholder.com/48'}')`,
                        opacity: stockInfo.isOut ? 0.7 : 1
                      }}
                    ></div>
                  );
                }
              },
              {
                key: 'name',
                label: 'Produto',
                render: (value, row) => (
                  <>
                    <p style={{fontWeight: 'bold', margin: 0, fontSize: '14px'}}>{value}</p>
                    <p style={{color: 'var(--text-muted)', margin: 0, fontSize: '10px'}}>{row.brand || 'Sem marca'}</p>
                  </>
                )
              },
              {
                key: 'id',
                label: 'SKU',
                render: (value) => (
                  <span style={{fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '14px'}}>LC-{String(value).padStart(4, '0')}</span>
                )
              },
              {
                key: 'category_names',
                label: 'Categoria',
                render: (value) => (
                  <span className="tag tag-skincare">{value?.[0] || 'Sem categoria'}</span>
                )
              },
              {
                key: 'price_to',
                label: 'Preço',
                render: (value, row) => (
                  <span style={{fontWeight: 'bold', fontSize: '14px'}}>
                    R$ {(Number(value) || Number(row.price_from) || 0).toFixed(2).replace('.', ',')}
                  </span>
                )
              },
              {
                key: 'current_stock',
                label: 'Estoque',
                render: (value) => {
                  const stockInfo = getStockStatus(value);
                  return (
                    <div className={`stock-indicator ${stockInfo.status}`}>
                      <div className="dot"></div>
                      <span style={{fontSize: '14px', fontWeight: '500'}}>{value || 0} unidades</span>
                      {stockInfo.isLow && <span className="badge-pill badge-amber" style={{marginLeft: '8px'}}>BAIXO</span>}
                      {stockInfo.isOut && <span className="badge-pill badge-red" style={{marginLeft: '8px'}}>ESGOTADO</span>}
                    </div>
                  );
                }
              }
            ]}
            isLoading={isLoading}
            emptyMessage="Nenhum produto cadastrado"
            emptyFilteredMessage="Nenhum produto encontrado"
            countLabel="Produtos"
            onAdd={openCreateModal}
            addButtonLabel="Novo Produto"
            addButtonIcon="add"
            actions={(row) => (
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                <button className="btn-icon" style={{color: 'var(--text-muted)'}} onClick={() => navigate(`/produto/${row.id}`)}>
                  <span className="material-symbols-outlined">visibility</span>
                </button>
                <button className="btn-icon" style={{color: '#3b82f6'}} onClick={() => openEditModal(row)}>
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="btn-icon" style={{color: '#ef4444'}} onClick={() => openDeleteModal(row)}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            )}
          />
        </div>
      </main>

      {/* Modal de Criar/Editar Produto */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="input-group" style={{gridColumn: 'span 2'}}>
                    <label className="input-label">Nome do Produto *</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="input-group" style={{gridColumn: 'span 2'}}>
                    <label className="input-label">Descrição</label>
                    <textarea 
                      className="form-input"
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Preço De (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="form-input"
                      value={formData.price_from}
                      onChange={e => setFormData({...formData, price_from: e.target.value})}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Preço Por (R$) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="form-input"
                      value={formData.price_to}
                      onChange={e => setFormData({...formData, price_to: e.target.value})}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Estoque</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={formData.current_stock}
                      onChange={e => setFormData({...formData, current_stock: e.target.value})}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Marca</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Tipo de Pele</label>
                    <select 
                      className="form-input"
                      value={formData.skin_type}
                      onChange={e => setFormData({...formData, skin_type: e.target.value})}
                    >
                      <option value="">Selecione</option>
                      <option value="normal">Normal</option>
                      <option value="oily">Oleosa</option>
                      <option value="dry">Seca</option>
                      <option value="mixed">Mista</option>
                      <option value="sensitive">Sensível</option>
                      <option value="all">Todos os tipos</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Peso (gramas)</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={formData.weight_grams}
                      onChange={e => setFormData({...formData, weight_grams: e.target.value})}
                    />
                  </div>
                  <div className="input-group" style={{gridColumn: 'span 2'}}>
                    <label className="input-label">URL da Imagem Principal *</label>
                    <input 
                      type="url" 
                      className="form-input"
                      value={formData.main_image}
                      onChange={e => setFormData({...formData, main_image: e.target.value})}
                      required
                    />
                  </div>
                  <div className="input-group" style={{gridColumn: 'span 2'}}>
                    <label className="input-label">Categorias *</label>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px'}}>
                      {categories.map(cat => (
                        <label key={cat.id} style={{display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer'}}>
                          <input 
                            type="checkbox" 
                            checked={formData.category_ids.includes(cat.id)}
                            onChange={() => handleCategoryToggle(cat.id)}
                          />
                          {cat.name}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="input-group">
                    <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                      <input 
                        type="checkbox" 
                        checked={formData.is_active}
                        onChange={e => setFormData({...formData, is_active: e.target.checked})}
                      />
                      Produto Ativo
                    </label>
                  </div>
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

      {/* Modal de Confirmação de Exclusão */}
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

export default AdminProducts;
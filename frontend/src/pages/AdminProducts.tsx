import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import '../styles/pages/admin.css';

const AdminProducts = () => {
  const { products: apiProducts, isLoading, error } = useProducts();
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const getStockStatus = (stock: number | undefined) => {
    if (!stock || stock === 0) return { status: 'stock-out', label: 'ESGOTADO', isOut: true };
    if (stock < 10) return { status: 'stock-low', label: 'BAIXO', isLow: true };
    return { status: 'stock-ok', label: '' };
  };

  const getCategoryClass = (categoryId?: number) => {
    const categoryName = categories.find(c => c.id === categoryId)?.name || '';
    const nameUpper = categoryName.toLowerCase();
    
    if (nameUpper.includes('skincare')) return 'tag-skincare';
    if (nameUpper.includes('maquiagem') || nameUpper.includes('makeup')) return 'badge-pill badge-purple';
    if (nameUpper.includes('fragr') || nameUpper.includes('parfum')) return 'badge-pill badge-amber';
    return 'tag-skincare';
  };

  const transformedProducts = apiProducts.map((product) => {
    const stockInfo = getStockStatus(product.current_stock);
    return {
      ...product,
      detail: product.description || product.brand || '',
      sku: `PROD-${product.id}`,
      category: categories.find(c => c.id === product.category_id)?.name || 'N/A',
      catClass: getCategoryClass(product.category_id),
      price: product.price_from ? `R$ ${product.price_from.toFixed(2).replace('.', ',')}` : 'N/A',
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
    const matchesCategory = !categoryFilter || categoryFilter === '' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              <button className="btn" style={{background: 'var(--bg-body)', height: '44px'}}>
                <span className="material-symbols-outlined">filter_list</span>
                Filtros Avançados
              </button>
            </div>
          </section>

          <AdminTable
            title="Lista de Produtos"
            data={transformedProducts}
            filteredData={filteredProducts}
            columns={[
              {
                key: 'img',
                label: 'Miniatura',
                render: (value, row) => (
                  <div 
                    className={`thumb-img ${row.isOut ? 'grayscale' : ''}`} 
                    style={{backgroundImage: `url('${value}')`, opacity: row.isOut ? 0.7 : 1}}
                  ></div>
                )
              },
              {
                key: 'name',
                label: 'Produto',
                render: (value, row) => (
                  <>
                    <p style={{fontWeight: 'bold', margin: 0, fontSize: '14px'}}>{value}</p>
                    <p style={{color: 'var(--text-muted)', margin: 0, fontSize: '10px'}}>{row.detail}</p>
                  </>
                )
              },
              {
                key: 'sku',
                label: 'SKU',
                render: (value) => (
                  <span style={{fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '14px'}}>{value}</span>
                )
              },
              {
                key: 'category',
                label: 'Categoria',
                render: (value, row) => (
                  <span className={row.catClass || "tag tag-skincare"}>{value}</span>
                )
              },
              {
                key: 'price',
                label: 'Preço',
                render: (value) => <span style={{fontWeight: 'bold', fontSize: '14px'}}>{value}</span>
              },
              {
                key: 'stock',
                label: 'Estoque',
                render: (value, row) => (
                  <div className={`stock-indicator ${row.stockStatus}`}>
                    <div className="dot"></div>
                    <span style={{fontSize: '14px', fontWeight: '500'}}>{value} unidades</span>
                    {row.isLow && <span className="badge-pill badge-amber" style={{marginLeft: '8px'}}>BAIXO</span>}
                    {row.isOut && <span className="badge-pill badge-red" style={{marginLeft: '8px'}}>ESGOTADO</span>}
                  </div>
                )
              }
            ]}
            isLoading={isLoading}
            emptyMessage="Nenhum produto cadastrado"
            emptyFilteredMessage="Nenhum produto encontrado"
            countLabel="Produtos"
            onAdd={() => console.log('Adicionar produto')}
            addButtonLabel="Novo Produto"
            addButtonIcon="add"
            actions={() => (
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                <button className="btn-icon" style={{color: 'var(--text-muted)'}}>
                  <span className="material-symbols-outlined">visibility</span>
                </button>
                <button className="btn-icon" style={{color: '#3b82f6'}}>
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="btn-icon" style={{color: '#ef4444'}}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            )}
          />
          {error && <div style={{color: 'red', marginTop: '16px'}}>Erro ao carregar produtos: {error}</div>}
        </div>
      </main>
    </div>
  );
};

export default AdminProducts;
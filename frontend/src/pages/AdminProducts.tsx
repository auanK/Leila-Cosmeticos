import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
import '../styles/pages/admin.css';

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const products = [
    {
      id: 1,
      name: "Sérum Facial Iluminador Rosa",
      detail: "Vitamina C + Ácido Hialurônico",
      sku: "LC-SK-001",
      category: "Skincare",
      catClass: "tag-skincare", 
      price: "R$ 129,90",
      stock: 85,
      stockStatus: "stock-ok",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCprCss1UmOE4N5XkFHyqOyejFJoGEW0oqXmcg80LKDGNVGNP9-F8is4BQqcmK3He4YX5kTP__u7SLPPr4lBSQ4bbSwadzKrjlo_3qAwhak6sBWxeKYpEx62uNDTyb_YbJDIGEhO2DY8cr-IUyXUxWn86-_k2jaIkWJfT9sLkzx0RbjnLG2qraR5Mj9ke1gyO3bfWEyTBinRoCCDqvAo1QeeudV5PnRj1Q-3Nt-_HFtP8NxyPYxBctb00M3JjjRpGB1kecDS-vsvEs"
    },
    {
      id: 2,
      name: "Batom Matte Velvet - Orquídea",
      detail: "Longa duração 12h",
      sku: "LC-MQ-042",
      category: "Maquiagem",
      catClass: "badge-pill badge-purple",
      price: "R$ 45,00",
      stock: 5,
      stockStatus: "stock-low",
      isLow: true,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlbouKeqyaIIWs2BWkyHPfjrOTPtTUpIz9jATPkaZvzSeNzs7_xvH62U73ukMCDw98YBopVfPHCgsf-M7DMNmi7SQCDRbDQphYkx-I8UyYuH6z8Kn2jDGrHqHgF1WEqnyV8dFt3plcQGcZdPTchw2xVTC1nKjXUBoGzgcJ2yR1_wAz9NEFXxXqONzqE8TwjuPswAbPJ9vTgMiLoOeLuGnswHQ6d0EnRKkWuYMUV0dmhrYGtwk9l3fwVB_hx86O23IVWPIxH6FuPxk"
    },
    {
      id: 3,
      name: "Eau de Parfum - Jardim Secreto",
      detail: "Fragrância Floral 50ml",
      sku: "LC-FR-015",
      category: "Fragrâncias",
      catClass: "badge-pill badge-amber",
      price: "R$ 289,00",
      stock: 12,
      stockStatus: "stock-ok",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1J2qGMDY4jDi-WdIfegVc50-jL126-mwTEbOJY3nV6bYwtJoD0_ttBGg1qjp3pbMytCxHA4xy2AxmE8Yn_C3BVnTfFcOmq7oBgsHXzB-tjgIT_0DPf2VUg6MXfgSFfK1ye4jTNGA00LQeB9SadN2C8j17q-MNQWezh-Gjr_tP-iJBzbBUJpUdU9yvt9_r_0z-wLx_nhjccT4ty4eRKlz9SMLCW26YAjwSdMKk2_IE0jbOgb6TP80Al7UbczllJYOBsvanh6pnT38"
    },
    {
      id: 4,
      name: "Pó Translúcido HD No-Filter",
      detail: "Acabamento Matte 20g",
      sku: "LC-MQ-088",
      category: "Maquiagem",
      catClass: "badge-pill badge-purple",
      price: "R$ 78,90",
      stock: 0,
      stockStatus: "stock-out",
      isOut: true,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZVLJxbEhSAfuZVws8RlRayfFfXrHb_ArX6AdUrU3HClR3YeCHF5f_zzqAxfLiIUTF2NtPhUtBcCPKeoIm1creyf4fjUFsMoyx1h7SBm9CjoKoBrl5ym7BNtXtPMB8roaPGm-f5GOfcmeNz8XWB6jgTNpiifhCehZ7Lo1SnrzEI9YhiM-tRQy8zTbGLAFByJ0FoqTNFWhtQeCp48LwVRh575fDMpJIl6K4VrO8wHualSfUSsZcXXnsb17fIJOpqg-x1jfGXHhpF7Q"
    }
  ];

  const filteredProducts = products.filter((product) => {
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
                  <option value="Skincare">Skincare</option>
                  <option value="Maquiagem">Maquiagem</option>
                  <option value="Fragrâncias">Fragrâncias</option>
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
            data={products}
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
            isLoading={false}
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
        </div>
      </main>
    </div>
  );
};

export default AdminProducts;
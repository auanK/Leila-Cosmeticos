import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300?text=Sem+Imagem';

const Home = () => {
  const { products, isLoading: productsLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  // Filtrar produtos pela categoria selecionada
  const filteredProducts = useMemo(() => {
    if (categories.length === 0) return products;
    
    const selectedCategory = categories[selectedCategoryIndex];
    if (!selectedCategory) return products;

    return products.filter(p => 
      p.category_ids?.includes(selectedCategory.id) || 
      p.category_names?.some(name => name.toLowerCase() === selectedCategory.name.toLowerCase())
    );
  }, [products, categories, selectedCategoryIndex]);

  const displayProducts = filteredProducts.slice(0, 4).map(p => {
    const priceFrom = Number(p.price_from) || 0;
    const priceTo = Number(p.price_to) || 0;
    const hasDiscount = priceFrom > 0 && priceTo > 0 && priceFrom > priceTo;
    return {
      id: p.id,
      title: p.name,
      priceFrom,
      priceTo,
      priceNum: priceTo || priceFrom,
      hasDiscount,
      discountPercent: hasDiscount ? Math.round((1 - priceTo / priceFrom) * 100) : 0,
      img: p.main_image || PLACEHOLDER_IMAGE
    };
  });

  const displayCategories = categories.map(c => c.name);

  return (
    <div className="page-container">
      <div className="layout-container">
        <Header />
        <div style={{ padding: '20px 16px', display: 'flex', flex: 1, justifyContent: 'center' }}>
          <div className="main-content">
            {/* Category */}
            <div className="category-nav">
              <div className="category-tabs">
                {categoriesLoading ? (
                  <span>Carregando...</span>
                ) : displayCategories.length === 0 ? (
                  <span style={{ color: '#6b7280' }}>Nenhuma categoria disponível</span>
                ) : (
                  displayCategories.map((cat, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedCategoryIndex(i)}
                      className={`tab ${i === selectedCategoryIndex ? 'active' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {cat}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Hero Banner */}
            <div
              className="hero-banner"
              style={{
                backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqkXSaKHlxvCJZrsM7wYLJiSXU6f0zXnLc2YBNF2-DusfZBWw3uglXTdEYYJgHI6h-AuLP3DJoTdijD1zE8vPlEAgAfnAaVSYUU3XHY-NfsOnG1SMQZRJ1jRBcEfWA-RFyPJ6VAZ4P6oLbiDd2tEylMXcBpYj69sNgqz_JputVCul41aHBKeilRhEyQ1_G2m7akeivFjr1jx6BwVLiDAZm-fkyJvEkNOVCRQxxoiY_7tUM_kvBLXcgGCBM_kV29QD3_meg_lqUT5dG")'
              }}
            >
              <div className="hero-dots">
                {[1, 2, 3, 4, 5].map((d, i) => (
                  <div key={d} className={`hero-dot ${i !== 0 ? 'inactive' : ''}`} />
                ))}
              </div>
            </div>

            <h2 className="section-title">Produtos em Destaque</h2>
            <div className="product-grid">
              {productsLoading ? (
                <p>Carregando produtos...</p>
              ) : displayProducts.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', gridColumn: '1 / -1' }}>
                  Nenhum produto disponível no momento.
                </p>
              ) : (
                displayProducts.map((p) => (
                  <Link to={`/produto/${p.id}`} key={p.id} className="product-card" style={{ position: 'relative' }}>
                    {p.hasDiscount && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        zIndex: 1
                      }}>
                        -{p.discountPercent}%
                      </div>
                    )}
                    <div
                      className="product-image"
                      style={{ backgroundImage: `url("${p.img}")` }}
                    />
                    <div className="product-info">
                      <p className="product-title">{p.title}</p>
                      {p.hasDiscount ? (
                        <div>
                          <p style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '13px', margin: 0 }}>
                            R$ {p.priceFrom.toFixed(2).replace('.', ',')}
                          </p>
                          <p className="product-price" style={{ margin: 0, color: '#16a34a' }}>
                            R$ {p.priceTo.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      ) : (
                        <p className="product-price">
                          R$ {p.priceNum.toFixed(2).replace('.', ',')}
                        </p>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>

            <footer className="footer">
              <p className="footer-text">@2026 Leila Cosméticos</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

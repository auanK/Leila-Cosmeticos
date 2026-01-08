import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300?text=Sem+Imagem';

const formatPrice = (priceFrom?: number | string, priceTo?: number | string) => {
  const pFrom = Number(priceFrom);
  const pTo = Number(priceTo);
  const price = pTo || pFrom || 0;
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
};

const Home = () => {
  const { products, isLoading: productsLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const displayProducts = products.slice(0, 4).map(p => ({
    id: p.id,
    title: p.name,
    price: formatPrice(p.price_from, p.price_to),
    img: p.main_image || PLACEHOLDER_IMAGE
  }));

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
                    <Link
                      key={i}
                      to={`/produtos?categorias=${encodeURIComponent(cat.toLowerCase())}`}
                      className={`tab ${i === 0 ? 'active' : ''}`}
                    >
                      {cat}
                    </Link>
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
                  <Link to={`/produto/${p.id}`} key={p.id} className="product-card">
                    <div
                      className="product-image"
                      style={{ backgroundImage: `url("${p.img}")` }}
                    />
                    <div className="product-info">
                      <p className="product-title">{p.title}</p>
                      <p className="product-price">{p.price}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <footer className="footer">
              <p className="footer-text">@2024 Leila Cosméticos</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

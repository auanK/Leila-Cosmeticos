import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const fallbackProducts = [
  { 
    title: "Sérum Facial Hidratante", 
    price: "R$ 89,90", 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg_mD4F4XUlE3Pw9hmjn7KY0hBMQrBbSZayv9L9bB0xtjcXjEIJeKL8Nl-kxDnEULdiwBduyZmOL7wH4Bz_jPNN-_Iutot0Cl4uYlD46lBRfDCqa7D-3N7uzpWUxY6d3xfoKMNKyWQNULfZaSPnpxf147woZUnxHuVvsYBHqbucIOvkXmp3qUcX7alUmknRMCGCiKKu_EaHhG4LSVKkMQevcSo5gv6m37IRsO7x3YVP3cvwUlPvS61vTqzIB9-3HMOiGXrlwRgh4gc" 
  },
  { 
    title: "Paleta de Sombras Neutras", 
    price: "R$ 129,90", 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf6M0MpDKAw_9TIk1fDcDC4bLVrWYxyo4r6o1b2eJBN0wo4k-4Ry6i0QNKAopACx4kblp7nMDo3UBHshKCLpq3lPYt7J9yCXXjJTcpwWoxCCZNbDTqbJT27aRU_npTtvRqoM9OxSGs3XHhqui240udPgSpTzhi4SS9s7wLYnFyVrmsvd1QwjU-vQUo5UrQNfprjsc1pdqlbF9Olvtj1st8FXe01lf5DTPGqx6sw7Sxeq1qUOJUi2FTKqirAkw5H7-qnTnLDizsSWCB" 
  },
  { 
    title: "Shampoo Revitalizante", 
    price: "R$ 49,90", 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdyxnsaMRMpamtdxM4Tu0ucm5lVvdMASb_lExH9KsyEStGVkRiG0Ojn0GdLJqE8C0jGa1f0-47Kmqo3x-p7m-hdY58-JRkrEsqUyju-61QTPL2OiD4KlOWUsECMLMuIe99Jd6g-O7-h9QlC81xlnL0WmiDNGE7-2JzfMFOPFzI4kqjC0HWvTVxaQ9DClBEXu5_owOkYaO_4s10bNelvrXDHLTN7yDLhJ0wo1VTk3n23TAH3aU3lf4bAo2v4cjvjag11JFeR9v1WrTc" 
  },
  { 
    title: "Loção Corporal Nutritiva", 
    price: "R$ 59,90", 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAG0_I8zAGlAOb7vi1Jq7zN5g5g3qGRf7M_TLX029cGdWhzNu2KWBv6CabJwSc6Mao0wQBRFXjg7bio_ePxqRardUDngfupWYdP244oEpOYPrFQ5iRiwHeGPrXJEtaYFsiwQfvDYcKMM2NdC5BXbAftV6Go4OGY1ANrJSCKIei3Zk25GtN9_iQBxVwZXBzfaVpsLAVKh9hmWNS94l1bIxv4sWnuYNEnrp-wB8fEztY2ZQ91Kwts1N660hUP55Kjdv8-5b4s1C1WqP_L" 
  },
];

const fallbackCategories = ['Skincare', 'Maquiagem', 'Cabelos', 'Corpo'];

const formatPrice = (priceFrom?: number, priceTo?: number) => {
  const price = priceTo || priceFrom || 0;
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
};

const Home = () => {
  const { products, isLoading: productsLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const displayProducts = products.length > 0 
    ? products.slice(0, 4).map(p => ({
        id: p.id,
        title: p.name,
        price: formatPrice(p.price_from, p.price_to),
        img: p.main_image || fallbackProducts[0].img
      }))
    : fallbackProducts;

  const displayCategories = categories.length > 0
    ? categories.map(c => c.name)
    : fallbackCategories;

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
                ) : (
                  displayCategories.map((cat, i) => (
                    <Link
                      key={i}
                      to="/produtos"
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
              ) : (
                displayProducts.map((p, i) => (
                  <Link to="/produto" key={i} className="product-card">
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

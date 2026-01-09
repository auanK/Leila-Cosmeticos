import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useWishlist';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300?text=Sem+Imagem';

const formatPrice = (priceFrom?: number | string, priceTo?: number | string) => {
  const pFrom = Number(priceFrom);
  const pTo = Number(priceTo);
  const price = pTo || pFrom || 0;
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
};

const Wishlist = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { items, loading, error, removeItem } = useWishlist();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleRemove = async (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeItem(productId);
    } catch {
    }
  };

  if (authLoading || loading) {
    return (
      <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
        <div className="layout-container">
          <Header />
          <div style={{ padding: '40px', textAlign: 'center' }}>
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
      <div className="layout-container">
        <Header />
        <div className="page-content">
          <Sidebar />
          <div className="main-content">
            <h1 className="page-title">Lista de Desejos ({items.length})</h1>

            {error && (
              <div style={{ 
                backgroundColor: '#fee2e2', 
                color: '#dc2626', 
                padding: '12px', 
                borderRadius: '8px', 
                marginBottom: '16px' 
              }}>
                {error}
              </div>
            )}

            {items.length === 0 ? (
              <div className="wishlist-empty">
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>💖</div>
                <div>
                  <p className="wishlist-empty-title">Sua lista de desejos está vazia</p>
                  <p className="wishlist-empty-text">
                    Adicione produtos para acompanhar seus favoritos e comprá-los mais tarde.
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/produtos')}
                >
                  Explorar Produtos
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {items.map((product) => {
                  const priceFrom = Number(product.price_from) || 0;
                  const priceTo = Number(product.price_to) || 0;
                  const hasDiscount = priceFrom > 0 && priceTo > 0 && priceFrom > priceTo;
                  const discountPercent = hasDiscount ? Math.round((1 - priceTo / priceFrom) * 100) : 0;

                  return (
                    <Link 
                      to={`/produto/${product.id}`} 
                      key={product.id} 
                      className="product-card"
                      style={{ position: 'relative' }}
                    >
                      {hasDiscount && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          backgroundColor: '#16a34a',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          zIndex: 1
                        }}>
                          -{discountPercent}%
                        </div>
                      )}
                      <button
                        onClick={(e) => handleRemove(product.id, e)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          zIndex: 1,
                          fontSize: '16px'
                        }}
                        title="Remover da lista"
                      >
                        ✕
                      </button>
                      <div
                        className="product-image"
                        style={{ backgroundImage: `url("${product.main_image || PLACEHOLDER_IMAGE}")` }}
                      />
                      <div className="product-info">
                        <p className="product-title">{product.name}</p>
                        {hasDiscount ? (
                          <div>
                            <p style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '13px', margin: 0 }}>
                              R$ {priceFrom.toFixed(2).replace('.', ',')}
                            </p>
                            <p className="product-price" style={{ margin: 0, color: '#16a34a' }}>
                              R$ {priceTo.toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        ) : (
                          <p className="product-price">{formatPrice(product.price_from, product.price_to)}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

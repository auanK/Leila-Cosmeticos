import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { StarIcon } from '../components/Icons';
import { api } from '../services/api';
import type { Product } from '../services/api';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';

const relatedProducts = [
  { id: 1, title: "Sérum Facial", price: "R$ 59,90", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBgHOuAvdAhTT5DFonTzTOfqcwx3jlFeSqYoHdkpB3tWtTIzeH9sHGJF_T6YjInc1C4nKxwlj4ow72EfveX1rAuhVV_kbaM_VbMEwIs48f9vwRcRbwmgEHK3XKVJHrMqncjLS_qTZvjWgK_qhGRc91NeEwDj4WRK9Wak1zMHV6qlQklshyc7wlXzLB39ddIgQtFi4qIA_nNg8oezxU2DW9YzmUQCbcCiMd3DMI8shL0FQDXLYBLafN4AqgAsxS0I5eePJUR9siQ1W8" },
  { id: 2, title: "Paleta de Sombras", price: "R$ 79,90", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyxfbpYdhhY3WvMUP-ImXBA3kCl2Bif_WEO1VBjmpImGZTwuxTXsLvUk6v_wPtN0pJFwIJw1XMJid7O-3QjWvBNtAesYuBQareoxkHw2SLHssoua5ZMAG8RXT_1xSGYFPUEMqpK8cCFzB7mRo1ztfngNT2uz4G92LQglkXd1NDvY024te_XRJ87SuYS_rWIW6zPymy9EIOiWetoNG_ozls8KNVHKHspi1z0VMomGr_Dpf_l_w4TUGQS5RGGdfZtE0LmBDzuth2hkj_" },
];

const formatPrice = (priceFrom?: number | string, priceTo?: number | string) => {
  const pFrom = Number(priceFrom);
  const pTo = Number(priceTo);
  const price = pTo || pFrom || 0;
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
};

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('ID do produto não encontrado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await api.getProduct(parseInt(id));
        if (data) {
          setProduct(data);
        } else {
          setError('Produto não encontrado');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      setAdding(true);
      setAddError(null);
      setAddSuccess(false);
      await addItem(product.id, quantity);
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Erro ao adicionar ao carrinho');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="layout-container">
          <Header />
          <div style={{ padding: '20px 16px', display: 'flex', flex: 1, justifyContent: 'center' }}>
            <div className="main-content">
              <p>Carregando produto...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container">
        <div className="layout-container">
          <Header />
          <div style={{ padding: '20px 16px', display: 'flex', flex: 1, justifyContent: 'center' }}>
            <div className="main-content">
              <p style={{ color: '#dc2626' }}>{error || 'Produto não encontrado'}</p>
              <button className="btn btn-primary" onClick={() => navigate('/produtos')}>
                Ver Produtos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="layout-container">
        <Header />
        <div style={{ padding: '20px 16px', display: 'flex', flex: 1, justifyContent: 'center' }}>
          <div className="main-content">
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
              <Link to="/" className="breadcrumb-link">Início</Link>
              <span className="breadcrumb-link">/</span>
              <Link to="/produtos" className="breadcrumb-link">Produtos</Link>
              <span className="breadcrumb-link">/</span>
              <span className="breadcrumb-current">{product.name}</span>
            </div>

            {/* Product Image */}
            {product.main_image && (
              <div
                style={{
                  width: '100%',
                  height: '300px',
                  backgroundImage: `url("${product.main_image}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '12px',
                  marginBottom: '16px'
                }}
              />
            )}

            <h2 className="section-title" style={{ fontSize: '22px' }}>{product.name}</h2>
            {product.brand && <p className="product-brand">Marca: {product.brand}</p>}

            {/* Rating */}
            <div className="rating-container">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p className="rating-score">4.5</p>
                <div className="rating-stars">
                  {[1, 2, 3, 4].map(s => (
                    <StarIcon key={s} filled />
                  ))}
                  <StarIcon />
                </div>
                <p className="rating-count">125 avaliações</p>
              </div>
            </div>

            <h3 className="sidebar-title">Preço</h3>
            <p className="product-brand" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#be185d' }}>
              {formatPrice(product.price_from, product.price_to)}
            </p>

            {/* Quantity */}
            <h3 className="sidebar-title">Quantidade</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '8px 16px' }}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span style={{ fontSize: '1.125rem', fontWeight: '500', minWidth: '40px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '8px 16px' }}
                onClick={() => setQuantity(q => q + 1)}
                disabled={product.current_stock !== undefined && quantity >= product.current_stock}
              >
                +
              </button>
              {product.current_stock !== undefined && (
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  ({product.current_stock} disponíveis)
                </span>
              )}
            </div>

            {addSuccess && (
              <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '16px' }}>
                Produto adicionado ao carrinho!
              </div>
            )}

            {addError && (
              <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px' }}>
                {addError}
              </div>
            )}

            <div className="action-buttons">
              <button className="btn btn-secondary btn-block">
                Adicionar à Lista de Desejos
              </button>
              <button
                className="btn btn-primary btn-block"
                onClick={handleAddToCart}
                disabled={adding || !product.is_active}
              >
                {adding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
              </button>
            </div>

            {!product.is_active && (
              <p style={{ color: '#dc2626', textAlign: 'center', marginTop: '8px' }}>
                Produto indisponível
              </p>
            )}

            {product.description && (
              <p className="product-description">{product.description}</p>
            )}

            {/* Related Products */}
            <h2 className="section-title">Complete Sua Rotina</h2>
            <div className="related-products">
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  className="related-product-card"
                  onClick={() => navigate(`/produto/${item.id}`)}
                >
                  <div
                    className="product-image"
                    style={{ backgroundImage: `url("${item.img}")` }}
                  />
                  <div className="product-info">
                    <p className="product-title">{item.title}</p>
                    <p className="product-price">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

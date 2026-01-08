import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { StarIcon, HeartIcon } from '../components/Icons';
import { api } from '../services/api';
import type { Product } from '../services/api';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400?text=Sem+Imagem';

const formatPrice = (priceFrom?: number | string, priceTo?: number | string) => {
  const pFrom = Number(priceFrom);
  const pTo = Number(priceTo);
  const price = pTo || pFrom || 0;
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
};

const formatPriceNumber = (priceFrom?: number | string, priceTo?: number | string) => {
  const pFrom = Number(priceFrom);
  const pTo = Number(priceTo);
  return pTo || pFrom || 0;
};

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('ID do produto não encontrado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setQuantity(1);
        const productId = parseInt(id);
        const data = await api.getProduct(productId);
        if (data) {
          setProduct(data);
          setSelectedImage(data.main_image || PLACEHOLDER_IMAGE);
          try {
            const related = await api.getRelatedProducts(productId);
            setRelatedProducts(related);
          } catch {
            setRelatedProducts([]);
          }
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

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    // Navega para checkout com os parâmetros de compra imediata
    navigate(`/checkout?productId=${product.id}&quantity=${quantity}`);
  };

  const hasDiscount = product?.price_from && product?.price_to && Number(product.price_from) > Number(product.price_to);
  const discountPercent = hasDiscount 
    ? Math.round((1 - Number(product!.price_to) / Number(product!.price_from)) * 100)
    : 0;

  if (loading) {
    return (
      <div className="page-container">
        <div className="layout-container">
          <Header />
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Carregando produto...</p>
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
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#dc2626', marginBottom: '16px' }}>{error || 'Produto não encontrado'}</p>
            <button className="btn btn-primary" onClick={() => navigate('/produtos')}>
              Ver Produtos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="layout-container">
        <Header />
        <div style={{ padding: '20px 16px', flex: 1 }}>
          {/* Breadcrumbs */}
          <div className="breadcrumbs" style={{ maxWidth: '1200px', margin: '0 auto 16px' }}>
            <Link to="/" className="breadcrumb-link">Início</Link>
            <span className="breadcrumb-link">/</span>
            <Link to="/produtos" className="breadcrumb-link">Produtos</Link>
            <span className="breadcrumb-link">/</span>
            <span className="breadcrumb-current">{product.name}</span>
          </div>

          {/* Main Content Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'minmax(0, 1fr) 320px',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Left Side - Images + Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Image Section */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '80px 1fr',
                gap: '16px',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                {/* Thumbnails */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    onClick={() => setSelectedImage(product.main_image || PLACEHOLDER_IMAGE)}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '8px',
                      border: selectedImage === (product.main_image || PLACEHOLDER_IMAGE) ? '2px solid #be185d' : '2px solid #e7cfd7',
                      backgroundImage: `url("${product.main_image || PLACEHOLDER_IMAGE}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                {/* Main Image */}
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      maxHeight: '450px',
                      backgroundImage: `url("${selectedImage}")`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      borderRadius: '8px'
                    }}
                  />
                  {/* Wishlist Button */}
                  <button 
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'white',
                      border: '1px solid #e7cfd7',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#9a4c66'
                    }}
                  >
                    <HeartIcon />
                  </button>
                </div>
              </div>

              {/* Product Info Section */}
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                {/* Brand Link */}
                {product.brand && (
                  <p style={{ color: '#be185d', fontSize: '14px', marginBottom: '8px', cursor: 'pointer' }}>
                    Ver mais produtos da marca {product.brand}
                  </p>
                )}

                {/* Title */}
                <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '12px', lineHeight: '1.3' }}>
                  {product.name}
                </h1>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <span style={{ color: '#1f2937', fontWeight: '500' }}>4.5</span>
                  <div style={{ display: 'flex', gap: '2px', color: '#be185d' }}>
                    {[1, 2, 3, 4].map(s => <StarIcon key={s} filled />)}
                    <StarIcon />
                  </div>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>(125)</span>
                </div>

                {/* Price Section */}
                <div style={{ marginBottom: '20px' }}>
                  {hasDiscount && (
                    <p style={{ color: '#6b7280', textDecoration: 'line-through', fontSize: '14px' }}>
                      R$ {Number(product.price_from).toFixed(2).replace('.', ',')}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '400', color: '#1f2937' }}>
                      R$ {formatPriceNumber(product.price_from, product.price_to).toFixed(2).replace('.', ',')}
                    </span>
                    {hasDiscount && (
                      <span style={{ 
                        backgroundColor: '#dcfce7', 
                        color: '#166534', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#166534', fontSize: '14px', marginTop: '4px' }}>
                    3x R$ {(formatPriceNumber(product.price_from, product.price_to) / 3).toFixed(2).replace('.', ',')} sem juros
                  </p>
                </div>

                {/* Skin Type / Variant */}
                {product.skin_type && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '14px', color: '#1f2937', marginBottom: '8px' }}>
                      Tipo de Pele: <strong>{product.skin_type}</strong>
                    </p>
                  </div>
                )}

                {/* Categories */}
                {product.category_names && product.category_names.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Categorias:</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {product.category_names.map((cat, i) => (
                        <span 
                          key={i}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid #e7cfd7',
                            borderRadius: '20px',
                            fontSize: '13px',
                            color: '#9a4c66',
                            cursor: 'pointer'
                          }}
                          onClick={() => navigate(`/produtos?categorias=${encodeURIComponent(cat.toLowerCase())}`)}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div style={{ borderTop: '1px solid #f3e8eb', paddingTop: '20px', marginTop: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                      O que você precisa saber sobre este produto
                    </h3>
                    <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '14px' }}>
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Weight */}
                {product.weight_grams && (
                  <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '16px' }}>
                    Peso: {product.weight_grams}g
                  </p>
                )}
              </div>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div style={{ 
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Produtos Relacionados
                  </h2>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '16px'
                  }}>
                    {relatedProducts.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/produto/${item.id}`)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          border: '1px solid #f3e8eb',
                          overflow: 'hidden',
                          transition: 'box-shadow 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                      >
                        <div
                          style={{
                            width: '100%',
                            aspectRatio: '1',
                            backgroundImage: `url("${item.main_image || PLACEHOLDER_IMAGE}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        <div style={{ padding: '12px' }}>
                          <p style={{ 
                            fontSize: '13px', 
                            color: '#1f2937', 
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#be185d' }}>
                            {formatPrice(item.price_from, item.price_to)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Purchase Card */}
            <div style={{ position: 'sticky', top: '20px', alignSelf: 'start' }}>
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #f3e8eb'
              }}>
                {/* Shipping Info */}
                <div style={{ 
                  backgroundColor: '#fdf2f4', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  marginBottom: '16px',
                  fontSize: '12px',
                  color: '#be185d',
                  fontWeight: '500'
                }}>
                  🚚 Frete grátis acima de R$ 99
                </div>

                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                  Chegará em até <strong style={{ color: '#1f2937' }}>5 dias úteis</strong>
                </p>
                <p style={{ fontSize: '13px', color: '#be185d', marginBottom: '16px', cursor: 'pointer' }}>
                  Calcular frete e prazo
                </p>

                {/* Stock */}
                <div style={{ marginBottom: '16px' }}>
                  {product.is_active ? (
                    <p style={{ color: '#166534', fontWeight: '500', fontSize: '14px' }}>
                      ✓ Estoque disponível
                    </p>
                  ) : (
                    <p style={{ color: '#dc2626', fontWeight: '500', fontSize: '14px' }}>
                      ✗ Produto indisponível
                    </p>
                  )}
                  {product.current_stock !== undefined && product.current_stock > 0 && (
                    <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
                      {product.current_stock} unidades disponíveis
                    </p>
                  )}
                </div>

                {/* Quantity Selector */}
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '14px', color: '#1f2937', marginBottom: '8px' }}>
                    Quantidade: <strong>{quantity} unidade{quantity > 1 ? 's' : ''}</strong>
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      style={{
                        width: '36px',
                        height: '36px',
                        border: '1px solid #e7cfd7',
                        borderRadius: '6px',
                        background: quantity <= 1 ? '#f9fafb' : 'white',
                        cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                        fontSize: '18px',
                        color: quantity <= 1 ? '#9ca3af' : '#1f2937'
                      }}
                    >
                      −
                    </button>
                    <span style={{ 
                      minWidth: '40px', 
                      textAlign: 'center', 
                      fontSize: '16px',
                      fontWeight: '500'
                    }}>
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      disabled={product.current_stock !== undefined && quantity >= product.current_stock}
                      style={{
                        width: '36px',
                        height: '36px',
                        border: '1px solid #e7cfd7',
                        borderRadius: '6px',
                        background: 'white',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: '#1f2937'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Success/Error Messages */}
                {addSuccess && (
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#dcfce7', 
                    color: '#166534', 
                    borderRadius: '6px', 
                    marginBottom: '12px',
                    fontSize: '13px',
                    textAlign: 'center'
                  }}>
                    ✓ Produto adicionado ao carrinho!
                  </div>
                )}

                {addError && (
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#fee2e2', 
                    color: '#dc2626', 
                    borderRadius: '6px', 
                    marginBottom: '12px',
                    fontSize: '13px',
                    textAlign: 'center'
                  }}>
                    {addError}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.is_active}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: '#be185d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: !product.is_active ? 'not-allowed' : 'pointer',
                      opacity: !product.is_active ? 0.6 : 1
                    }}
                  >
                    Comprar agora
                  </button>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={adding || !product.is_active}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: 'white',
                      color: '#be185d',
                      border: '1px solid #be185d',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: adding || !product.is_active ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    🛒 Adicionar ao carrinho
                  </button>
                </div>

                {/* Wishlist Link */}
                <button
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    padding: '10px',
                    background: 'none',
                    border: 'none',
                    color: '#be185d',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <HeartIcon /> Adicionar à lista de desejos
                </button>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #f3e8eb', margin: '16px 0' }} />

                {/* Seller Info */}
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Vendido por</p>
                  <p style={{ fontSize: '14px', color: '#be185d', fontWeight: '500' }}>Leila Cosméticos</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    ✓ 7 dias de garantia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

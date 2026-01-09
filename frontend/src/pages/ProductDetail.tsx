import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { StarIcon, HeartIcon } from '../components/Icons';
import { api } from '../services/api';
import type { Product } from '../services/api';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import { useReviews } from '../hooks/useReviews';

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
  const { token, isAuthenticated } = useAuth();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();
  const productId = id ? parseInt(id) : 0;
  const { reviews, loading: reviewsLoading, averageRating, ratingDistribution, submitReview } = useReviews(productId);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const isInWishlist = wishlistItems.some(item => item.id === productId);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

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

    navigate(`/checkout?productId=${product.id}&quantity=${quantity}`);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setWishlistLoading(true);
      if (isInWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch {
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (reviewRating === 0) {
      setReviewError('Selecione uma nota para avaliar');
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError(null);
      await submitReview(reviewRating, reviewComment);
      setReviewComment('');
      setReviewRating(0);
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Erro ao enviar avaliação');
    } finally {
      setReviewSubmitting(false);
    }
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
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: isInWishlist ? '#be185d' : 'white',
                      border: '1px solid #e7cfd7',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: wishlistLoading ? 'not-allowed' : 'pointer',
                      color: isInWishlist ? 'white' : '#9a4c66',
                      transition: 'all 0.2s ease',
                      opacity: wishlistLoading ? 0.7 : 1
                    }}
                    title={isInWishlist ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
                  >
                    <HeartIcon filled={isInWishlist} />
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

              {/* Reviews Section */}
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                  Avaliações dos Clientes
                </h2>

                {/* Average Rating Summary */}
                <div style={{ 
                  display: 'flex', 
                  gap: '32px', 
                  marginBottom: '24px',
                  padding: '16px',
                  backgroundColor: '#fdf2f4',
                  borderRadius: '8px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: '700', color: '#be185d' }}>
                      {averageRating.toFixed(1)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          style={{ 
                            color: star <= Math.round(averageRating) ? '#f59e0b' : '#d1d5db',
                            fontSize: '18px'
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>
                      {reviews.length} avaliação{reviews.length !== 1 ? 'ões' : ''}
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div style={{ flex: 1 }}>
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = ratingDistribution[stars] || 0;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', color: '#6b7280', width: '50px' }}>{stars} estrela{stars > 1 ? 's' : ''}</span>
                          <div style={{ flex: 1, height: '8px', backgroundColor: '#f3e8eb', borderRadius: '4px' }}>
                            <div style={{ 
                              width: `${percentage}%`, 
                              height: '100%', 
                              backgroundColor: '#be185d',
                              borderRadius: '4px'
                            }} />
                          </div>
                          <span style={{ fontSize: '12px', color: '#9ca3af', width: '30px' }}>({count})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Write Review Form */}
                {token && (
                  <div style={{ 
                    marginBottom: '24px', 
                    padding: '16px', 
                    border: '1px solid #e7cfd7', 
                    borderRadius: '8px' 
                  }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                      Escreva sua avaliação
                    </h3>
                    
                    {/* Star Rating Input */}
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Sua nota:</p>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '28px',
                              color: star <= reviewRating ? '#f59e0b' : '#d1d5db',
                              padding: '2px',
                              transition: 'transform 0.1s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Textarea */}
                    <div style={{ marginBottom: '12px' }}>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Conte sua experiência com este produto..."
                        style={{
                          width: '100%',
                          minHeight: '80px',
                          padding: '12px',
                          border: '1px solid #e7cfd7',
                          borderRadius: '6px',
                          fontSize: '14px',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    {reviewError && (
                      <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{reviewError}</p>
                    )}

                    <button
                      onClick={handleSubmitReview}
                      disabled={reviewSubmitting || reviewRating === 0}
                      style={{
                        backgroundColor: reviewRating === 0 ? '#d1d5db' : '#be185d',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: reviewRating === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        opacity: reviewSubmitting ? 0.7 : 1
                      }}
                    >
                      {reviewSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
                    </button>
                  </div>
                )}

                {!token && (
                  <div style={{ 
                    marginBottom: '24px', 
                    padding: '16px', 
                    backgroundColor: '#fdf2f4', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      Faça login para avaliar este produto
                    </p>
                    <button
                      onClick={() => navigate('/login')}
                      style={{
                        backgroundColor: '#be185d',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Fazer Login
                    </button>
                  </div>
                )}

                {/* Reviews List */}
                {reviewsLoading ? (
                  <p style={{ textAlign: 'center', color: '#6b7280' }}>Carregando avaliações...</p>
                ) : reviews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                      Este produto ainda não tem avaliações.
                    </p>
                    <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>
                      Seja o primeiro a avaliar!
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {reviews.map((review) => (
                      <div 
                        key={review.id} 
                        style={{ 
                          padding: '16px', 
                          border: '1px solid #f3e8eb', 
                          borderRadius: '8px' 
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#f3e8eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}>
                            {review.user_photo ? (
                              <img 
                                src={review.user_photo} 
                                alt={review.user_name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <span style={{ fontSize: '18px', color: '#be185d' }}>
                                {review.user_name?.charAt(0).toUpperCase() || '?'}
                              </span>
                            )}
                          </div>
                          <div>
                            <p style={{ fontWeight: '500', color: '#1f2937', fontSize: '14px' }}>
                              {review.user_name || 'Cliente'}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ display: 'flex' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span 
                                    key={star} 
                                    style={{ 
                                      color: star <= review.rating ? '#f59e0b' : '#d1d5db',
                                      fontSize: '14px'
                                    }}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                                {new Date(review.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>
                            {review.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
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
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    padding: '10px',
                    background: isInWishlist ? '#fdf2f4' : 'none',
                    border: isInWishlist ? '1px solid #be185d' : 'none',
                    borderRadius: '8px',
                    color: isInWishlist ? '#be185d' : '#6b7280',
                    fontSize: '14px',
                    cursor: wishlistLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    opacity: wishlistLoading ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <HeartIcon filled={isInWishlist} /> {isInWishlist ? 'Na sua lista de desejos ♥' : 'Adicionar à lista de desejos'}
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

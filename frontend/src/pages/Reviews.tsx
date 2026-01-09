import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { StarIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { api } from '../services/api';
import type { UserReview } from '../services/api';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/80x80?text=Sem+Imagem';

interface ProductToReview {
  product_id: number;
  name: string;
  quantity: number;
  unit_price: string;
  image: string;
  order_id: number;
  order_date: string;
}

const Reviews = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { orders, loading: ordersLoading } = useOrders();
  const navigate = useNavigate();
  
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [reviewedProductIds, setReviewedProductIds] = useState<number[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductToReview | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!isAuthenticated) return;
      
      try {
        const [reviews, productIds] = await Promise.all([
          api.getUserReviews(),
          api.getReviewedProductIds()
        ]);
        setUserReviews(reviews);
        setReviewedProductIds(productIds);
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchUserReviews();
  }, [isAuthenticated]);

  const handleOpenModal = (product: ProductToReview) => {
    setSelectedProduct(product);
    setReviewRating(5);
    setReviewComment('');
    setSubmitError(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleSubmitReview = async () => {
    if (!selectedProduct) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await api.createReview(selectedProduct.product_id, reviewRating, reviewComment);
      
      const [reviews, productIds] = await Promise.all([
        api.getUserReviews(),
        api.getReviewedProductIds()
      ]);
      setUserReviews(reviews);
      setReviewedProductIds(productIds);
      
      handleCloseModal();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Erro ao enviar avaliação');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || ordersLoading || loadingReviews) {
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


  const allOrders = orders;

  const productsToReview: ProductToReview[] = allOrders.flatMap(order => 
    order.items.map(item => ({
      ...item,
      order_id: order.id,
      order_date: order.created_at
    }))
  );

  const pendingReviews = productsToReview.reduce((acc, product) => {
    const alreadyAdded = acc.some(p => p.product_id === product.product_id);
    const alreadyReviewed = reviewedProductIds.includes(product.product_id);
    if (!alreadyAdded && !alreadyReviewed) {
      acc.push(product);
    }
    return acc;
  }, [] as ProductToReview[]);

  return (
    <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
      <div className="layout-container">
        <Header />
        <div className="page-content">
          <Sidebar />
          <div className="main-content">
            {/* Minhas Avaliações */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '24px'
            }}>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '8px' 
              }}>
                Minhas Avaliações
              </h1>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
                Veja as avaliações que você já fez
              </p>

              {userReviews.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: '#6b7280',
                  backgroundColor: '#fdf2f4',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>⭐</div>
                  <p style={{ fontSize: '14px' }}>
                    Você ainda não fez nenhuma avaliação.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {userReviews.map((review) => (
                    <div
                      key={review.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        padding: '16px',
                        border: '1px solid #f3e8eb',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/produto/${review.product_id}`)}
                    >
                      <img
                        src={review.product_image || PLACEHOLDER_IMAGE}
                        alt={review.product_name}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '15px', 
                          fontWeight: '500', 
                          color: '#1f2937', 
                          marginBottom: '4px' 
                        }}>
                          {review.product_name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon 
                                key={star} 
                                filled={star <= review.rating}
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                            {new Date(review.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {review.comment && (
                          <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
                            {review.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Produtos para Avaliar */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '8px' 
              }}>
                Produtos para Avaliar
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
                Avalie os produtos que você comprou e ajude outros clientes
              </p>

              {pendingReviews.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: '#6b7280',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
                  <p style={{ fontSize: '14px' }}>
                    {orders.length === 0 
                      ? 'Você ainda não fez nenhuma compra.' 
                      : 'Você já avaliou todos os produtos que comprou!'}
                  </p>
                  {orders.length === 0 && (
                    <button
                      onClick={() => navigate('/produtos')}
                      style={{
                        marginTop: '16px',
                        backgroundColor: '#be185d',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Explorar Produtos
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pendingReviews.map((product, index) => (
                    <div
                      key={`${product.product_id}-${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px',
                        border: '1px solid #f3e8eb',
                        borderRadius: '8px'
                      }}
                    >
                      <img
                        src={product.image || PLACEHOLDER_IMAGE}
                        alt={product.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '15px', 
                          fontWeight: '500', 
                          color: '#1f2937', 
                          marginBottom: '4px' 
                        }}>
                          {product.name}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                          Comprado em {new Date(product.order_date).toLocaleDateString('pt-BR')}
                        </p>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon 
                              key={star} 
                              filled={false}
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenModal(product)}
                        style={{
                          backgroundColor: '#be185d',
                          color: 'white',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Avaliar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Avaliação */}
      {showModal && selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                Avaliar Produto
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {/* Product Info */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', padding: '16px', backgroundColor: '#fdf2f4', borderRadius: '8px' }}>
              <img
                src={selectedProduct.image || PLACEHOLDER_IMAGE}
                alt={selectedProduct.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                  {selectedProduct.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>
                  Comprado em {new Date(selectedProduct.order_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Rating Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>
                Sua nota:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '32px',
                      color: star <= reviewRating ? '#f59e0b' : '#d1d5db',
                      padding: '4px',
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

            {/* Comment */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>
                Seu comentário (opcional):
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Conte sua experiência com este produto..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  border: '1px solid #e7cfd7',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {submitError && (
              <div style={{ 
                backgroundColor: '#fee2e2', 
                color: '#dc2626', 
                padding: '12px', 
                borderRadius: '8px', 
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {submitError}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '12px 20px',
                  border: '1px solid #e7cfd7',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#be185d',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'Enviando...' : 'Enviar Avaliação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;

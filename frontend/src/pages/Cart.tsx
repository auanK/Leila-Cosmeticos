import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  const { items, total, isValid, loading, error, removeItem, updateQuantity, refresh } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
        <div className="layout-container">
          <Header />
          <div className="cart-container">
            <div className="main-content">
              <h1 className="page-title">Carrinho de Compras</h1>
              <p>Carregando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleUpdateQuantity = async (itemId: number, delta: number, currentQty: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      return handleRemoveItem(itemId);
    }

    try {
      setUpdating(itemId);
      setActionError(null);
      await updateQuantity(itemId, newQty);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao atualizar quantidade');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      setUpdating(itemId);
      setActionError(null);
      await removeItem(itemId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao remover item');
    } finally {
      setUpdating(null);
    }
  };

  const shipping = items.length > 0 ? 15.00 : 0;
  const grandTotal = total + shipping;

  return (
    <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
      <div className="layout-container">
        <Header />
        <div className="cart-container">
          <div className="main-content">
            <h1 className="page-title">Carrinho de Compras</h1>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>
                {error}
                <button onClick={refresh} style={{ marginLeft: '1rem', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}>
                  Tentar novamente
                </button>
              </div>
            )}

            {actionError && (
              <div className="alert alert-error" style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>
                {actionError}
              </div>
            )}

            {items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ marginBottom: '1rem', color: '#6b7280' }}>Seu carrinho está vazio</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/produtos')}
                >
                  Ver Produtos
                </button>
              </div>
            ) : (
              <>
                {!isValid && (
                  <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '8px' }}>
                    Alguns itens do carrinho possuem problemas. Verifique os avisos abaixo.
                  </div>
                )}

                {items.map((item) => (
                  <div key={item.itemId}>
                    <div className="cart-item" style={{ opacity: updating === item.itemId ? 0.5 : 1 }}>
                      <div className="cart-item-left">
                        <div
                          className="cart-item-image"
                          style={{ backgroundImage: `url("${item.image || 'https://via.placeholder.com/100'}")` }}
                        />
                        <div className="cart-item-info">
                          <p className="cart-item-title">{item.name}</p>
                          <p className="cart-item-variant">
                            R$ {item.price.toFixed(2).replace('.', ',')} cada
                          </p>
                          {item.error && (
                            <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                              {item.error}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="cart-quantity">
                        <button
                          className="cart-quantity-btn"
                          onClick={() => handleUpdateQuantity(item.itemId, -1, item.quantity)}
                          disabled={updating === item.itemId}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="cart-quantity-input"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="cart-quantity-btn"
                          onClick={() => handleUpdateQuantity(item.itemId, 1, item.quantity)}
                          disabled={updating === item.itemId || item.quantity >= item.currentStock}
                        >
                          +
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
                          onClick={() => handleRemoveItem(item.itemId)}
                          disabled={updating === item.itemId}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                    <p className="cart-subtotal">
                      Subtotal: R$ {item.subtotal.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                ))}

                <div className="btn-container">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/produtos')}
                  >
                    Continuar Comprando
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          {items.length > 0 && (
            <div className="order-summary">
              <h2 className="order-summary-title">Resumo do Pedido</h2>
              <div className="order-summary-content">
                <div className="summary-row">
                  <p className="summary-label">Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</p>
                  <p className="summary-value">R$ {total.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="summary-row">
                  <p className="summary-label">Frete</p>
                  <p className="summary-value">R$ {shipping.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="summary-row">
                  <p className="summary-label">Total</p>
                  <p className="summary-value bold">R$ {grandTotal.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
              <div className="btn-container">
                <button
                  className="btn btn-primary btn-lg btn-block"
                  onClick={() => navigate('/checkout')}
                  disabled={!isValid}
                >
                  Finalizar Compra
                </button>
                {!isValid && (
                  <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.5rem', textAlign: 'center' }}>
                    Corrija os problemas no carrinho antes de continuar
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

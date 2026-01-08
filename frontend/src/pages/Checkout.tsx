import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../services/api';
import { useAddresses } from '../hooks/useAddresses';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import type { Product } from '../services/api';

const formatPrice = (price: number) => {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
};

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addresses, isLoading: addressesLoading } = useAddresses();
  const { cart, loading: cartLoading, refresh: refreshCart } = useCart();

  // Verifica se é "Comprar agora" (tem productId e quantity) ou checkout do carrinho
  const productId = searchParams.get('productId');
  const quantity = searchParams.get('quantity');
  const isBuyNow = productId && quantity;

  const [paymentMethod, setPaymentMethod] = useState('cartao');
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Para "Comprar agora", busca os dados do produto
  const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      // Seleciona o endereço principal ou o primeiro
      const mainAddress = addresses.find(a => a.is_main);
      setSelectedAddressId(mainAddress?.id || addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (isBuyNow && productId) {
      setLoadingProduct(true);
      api.getProduct(parseInt(productId))
        .then(product => {
          setBuyNowProduct(product);
        })
        .catch(() => {
          setError('Produto não encontrado');
        })
        .finally(() => {
          setLoadingProduct(false);
        });
    }
  }, [isBuyNow, productId]);

  const handleFinish = async () => {
    if (!selectedAddressId) {
      setError('Selecione um endereço de entrega');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      let response;
      if (isBuyNow && productId && quantity) {
        // Checkout "Comprar agora"
        response = await api.checkoutBuyNow(selectedAddressId, parseInt(productId), parseInt(quantity));
      } else {
        // Checkout do carrinho
        response = await api.checkoutCart(selectedAddressId);
        refreshCart(); // Atualiza o carrinho (agora vazio)
      }

      setOrderId(response.orderId);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao finalizar pedido');
    } finally {
      setProcessing(false);
    }
  };

  // Calcular total
  const getTotal = () => {
    if (isBuyNow && buyNowProduct) {
      const price = Number(buyNowProduct.price_to) || Number(buyNowProduct.price_from) || 0;
      return price * parseInt(quantity || '1');
    }
    return cart?.total || 0;
  };

  const getItemsCount = () => {
    if (isBuyNow) {
      return parseInt(quantity || '1');
    }
    return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  if (authLoading || addressesLoading || cartLoading || loadingProduct) {
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

  // Tela de sucesso
  if (success) {
    return (
      <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
        <div className="layout-container">
          <Header />
          <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '40px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
              <h1 style={{ color: '#166534', fontSize: '24px', marginBottom: '8px' }}>
                Pedido Realizado com Sucesso!
              </h1>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Seu pedido #{orderId} foi confirmado e está sendo processado.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/pedidos')}
                >
                  Ver Meus Pedidos
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/')}
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verificar se tem itens para checkout
  const hasItems = isBuyNow ? buyNowProduct !== null : (cart?.items.length || 0) > 0;

  if (!hasItems) {
    return (
      <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
        <div className="layout-container">
          <Header />
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ marginBottom: '16px' }}>Nenhum item para checkout.</p>
            <button className="btn btn-primary" onClick={() => navigate('/produtos')}>
              Ver Produtos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
      <div className="layout-container">
        <Header />
        <div style={{ padding: '20px 16px', display: 'flex', flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '24px', maxWidth: '1200px', width: '100%', flexWrap: 'wrap' }}>
            {/* Coluna Principal */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              {/* Breadcrumb */}
              <div className="checkout-steps">
                {!isBuyNow && <Link to="/carrinho" className="checkout-step">Carrinho</Link>}
                {!isBuyNow && <span className="checkout-step">/</span>}
                <span className="checkout-step active">Checkout</span>
              </div>

              {/* Itens */}
              <h2 className="form-section-title">
                {isBuyNow ? 'Produto' : 'Itens do Carrinho'}
              </h2>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '16px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                {isBuyNow && buyNowProduct ? (
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img 
                      src={buyNowProduct.main_image || '/placeholder.png'} 
                      alt={buyNowProduct.name}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 500, marginBottom: '4px' }}>{buyNowProduct.name}</p>
                      <p style={{ color: '#6b7280', fontSize: '14px' }}>Qtd: {quantity}</p>
                    </div>
                    <p style={{ fontWeight: 600, color: '#d14669' }}>
                      {formatPrice((Number(buyNowProduct.price_to) || Number(buyNowProduct.price_from) || 0) * parseInt(quantity || '1'))}
                    </p>
                  </div>
                ) : (
                  cart?.items.map(item => (
                    <div key={item.productId} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <img 
                        src={item.image || '/placeholder.png'} 
                        alt={item.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 500, marginBottom: '4px', fontSize: '14px' }}>{item.name}</p>
                        <p style={{ color: '#6b7280', fontSize: '13px' }}>Qtd: {item.quantity}</p>
                      </div>
                      <p style={{ fontWeight: 600, color: '#d14669', fontSize: '14px' }}>
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Endereço de Entrega */}
              <h2 className="form-section-title">Endereço de Entrega</h2>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '16px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                {addresses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <p style={{ marginBottom: '12px', color: '#6b7280' }}>Você não possui endereços cadastrados.</p>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => navigate('/enderecos')}
                    >
                      Cadastrar Endereço
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {addresses.map(addr => (
                      <label 
                        key={addr.id} 
                        style={{ 
                          display: 'flex', 
                          gap: '12px', 
                          padding: '12px', 
                          border: selectedAddressId === addr.id ? '2px solid #d14669' : '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: selectedAddressId === addr.id ? '#fef2f4' : 'white'
                        }}
                      >
                        <input 
                          type="radio" 
                          name="address" 
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          style={{ accentColor: '#d14669' }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 500, marginBottom: '4px' }}>
                            {addr.neighborhood}
                            {addr.is_main && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#d14669' }}>(Principal)</span>}
                          </p>
                          <p style={{ color: '#6b7280', fontSize: '14px' }}>
                            {addr.street}, {addr.number}{addr.complement ? ` - ${addr.complement}` : ''}
                          </p>
                          <p style={{ color: '#6b7280', fontSize: '14px' }}>
                            {addr.neighborhood} - {addr.city}/{addr.state}
                          </p>
                          <p style={{ color: '#6b7280', fontSize: '14px' }}>CEP: {addr.zip_code}</p>
                        </div>
                      </label>
                    ))}
                    <button 
                      className="btn btn-secondary" 
                      style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                      onClick={() => navigate('/enderecos')}
                    >
                      Gerenciar Endereços
                    </button>
                  </div>
                )}
              </div>

              {/* Pagamento */}
              <h2 className="form-section-title">Pagamento</h2>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '16px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div className="tabs-container">
                  <div className="payment-tabs">
                    <button
                      className={`payment-tab ${paymentMethod === 'cartao' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('cartao')}
                    >
                      Cartão
                    </button>
                    <button
                      className={`payment-tab ${paymentMethod === 'pix' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('pix')}
                    >
                      PIX
                    </button>
                    <button
                      className={`payment-tab ${paymentMethod === 'boleto' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('boleto')}
                    >
                      Boleto
                    </button>
                  </div>
                </div>

                {paymentMethod === 'cartao' && (
                  <div style={{ marginTop: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Número do cartão</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nome no cartão</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Nome como está no cartão"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Validade</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="MM/AA"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'pix' && (
                  <div style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📱</div>
                    <p style={{ color: '#1b0e12', marginBottom: '8px' }}>
                      Ao finalizar, você receberá o QR Code para pagamento via PIX.
                    </p>
                    <p style={{ color: '#16a34a', fontSize: '14px' }}>
                      Aprovação instantânea!
                    </p>
                  </div>
                )}

                {paymentMethod === 'boleto' && (
                  <div style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
                    <p style={{ color: '#1b0e12', marginBottom: '8px' }}>
                      Ao finalizar, você receberá o boleto para pagamento.
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                      Prazo de compensação: até 3 dias úteis
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Resumo Lateral */}
            <div style={{ width: '340px', minWidth: '280px' }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: '20px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Resumo</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280' }}>Subtotal ({getItemsCount()} {getItemsCount() === 1 ? 'item' : 'itens'})</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ color: '#6b7280' }}>Frete</span>
                  <span style={{ color: '#16a34a' }}>Grátis</span>
                </div>
                
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: '18px' }}>Total</span>
                    <span style={{ fontWeight: 600, fontSize: '18px', color: '#d14669' }}>{formatPrice(getTotal())}</span>
                  </div>
                </div>

                {error && (
                  <div style={{ 
                    backgroundColor: '#fef2f2', 
                    color: '#dc2626', 
                    padding: '12px', 
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '14px'
                  }}>
                    {error}
                  </div>
                )}

                <button
                  className="btn btn-primary btn-lg btn-block"
                  onClick={handleFinish}
                  disabled={processing || addresses.length === 0}
                  style={{ 
                    opacity: (processing || addresses.length === 0) ? 0.7 : 1,
                    cursor: (processing || addresses.length === 0) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {processing ? 'Processando...' : 'Finalizar Pedido'}
                </button>

                <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '12px' }}>
                  🔒 Pagamento 100% seguro
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

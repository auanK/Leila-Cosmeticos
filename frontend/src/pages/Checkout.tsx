import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('cartao');

  const handleFinish = () => {
    alert('Pedido Finalizado com Sucesso!');
  };

  return (
    <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
      <div className="layout-container">
        <Header />
        <div style={{ padding: '20px 16px', display: 'flex', flex: 1, justifyContent: 'center' }}>
          <div className="main-content">
            {/* Checkout */}
            <div className="checkout-steps">
              <Link to="/carrinho" className="checkout-step">Carrinho</Link>
              <span className="checkout-step">/</span>
              <span className="checkout-step">Identificação</span>
              <span className="checkout-step">/</span>
              <span className="checkout-step">Entrega</span>
              <span className="checkout-step">/</span>
              <span className="checkout-step active">Pagamento</span>
            </div>

            {/* Delivery */}
            <h2 className="form-section-title">Entrega</h2>
            <div className="form-group">
              <label className="form-label">CEP</label>
              <input
                type="text"
                className="form-input"
                placeholder="Digite seu CEP"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Endereço</label>
              <input
                type="text"
                className="form-input"
                placeholder="Rua, número"
              />
            </div>

            <h3 className="sidebar-title">Frete</h3>
            <div className="shipping-options">
              <label className="shipping-option">
                <input type="radio" name="shipping" defaultChecked />
                <span className="shipping-option-text">Econômico (5-8 dias)</span>
              </label>
              <label className="shipping-option">
                <input type="radio" name="shipping" />
                <span className="shipping-option-text">Expresso (2-3 dias)</span>
              </label>
            </div>

            {/* Payment */}
            <h2 className="form-section-title">Pagamento</h2>
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
              <>
                <div className="form-group">
                  <label className="form-label">Número do cartão</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Digite o número do cartão"
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
                      placeholder="Código"
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'pix' && (
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <p style={{ color: '#1b0e12', marginBottom: '16px' }}>
                  Ao finalizar, você receberá o QR Code para pagamento via PIX.
                </p>
              </div>
            )}

            {paymentMethod === 'boleto' && (
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <p style={{ color: '#1b0e12', marginBottom: '16px' }}>
                  Ao finalizar, você receberá o boleto para pagamento.
                </p>
              </div>
            )}

            <div className="btn-container" style={{ marginTop: '16px' }}>
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={handleFinish}
                style={{ maxWidth: '480px' }}
              >
                Finalizar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

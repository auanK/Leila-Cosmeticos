import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

interface CartItem {
  id: number;
  title: string;
  variant: string;
  price: number;
  quantity: number;
  img: string;
}

const initialItems: CartItem[] = [
  {
    id: 1,
    title: "Batom Matte de Longa Duração",
    variant: "Cor: Rosa Claro",
    price: 25.00,
    quantity: 2,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFRfgvxbVN0A4SMwj60WpZYOAcIa7yZXjLZd8p6iXH7er1JzwO0povlVsaIZ13vTJDzrCMVkw-N2aK5XTwx0k2687wFQAIEeSiCzKarc0SDyBThz0iyAaExUrEubMb2goTwKAHePQ7HpbWOPItnLMLDujQeU2Q0SMEKKARj74Ar4fJlNjOC9QKN9wAgJAydLSW4bCtDMbTWF8_xRCUQbS51gUKobXQxVsdgBMDfE8ZIowVBNABNj-YmF_HLEUL_biqMXC1MY06wfzx"
  },
  {
    id: 2,
    title: "Sérum Facial Hidratante",
    variant: "Tamanho: 50ml",
    price: 45.00,
    quantity: 1,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiLnjHv1cBNcZ07MHJ6D36FmBs7XggE0opm6gSyLtE9vvCVBwWfF9d24V0zJ1a4cr4xNyLsWX5788fcYzWUIHBUpZGmywU22H9CnP_9ZfuuEc_EzQ49hdfMlP3rp8pLLHn5h7XOm0sE07YMZKHFvr6cxgU3oepangfl8tM98KpuCETv_vHR7NOd6hVnVHXy5THIPW8ENe9B5To0USATLM40gZ0kAeN-5J9ra2e9zxV10PD4DbOHkt5I0CmzCRmHGgoBH9XeN63vf9j"
  }
];

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 15.00;
  const total = subtotal + shipping;

  return (
    <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
      <div className="layout-container">
        <Header />
        <div className="cart-container">
          <div className="main-content">
            <h1 className="page-title">Carrinho de Compras</h1>

            {items.map((item) => (
              <div key={item.id}>
                <div className="cart-item">
                  <div className="cart-item-left">
                    <div
                      className="cart-item-image"
                      style={{ backgroundImage: `url("${item.img}")` }}
                    />
                    <div className="cart-item-info">
                      <p className="cart-item-title">{item.title}</p>
                      <p className="cart-item-variant">{item.variant}</p>
                    </div>
                  </div>
                  <div className="cart-quantity">
                    <button
                      className="cart-quantity-btn"
                      onClick={() => updateQuantity(item.id, -1)}
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
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="cart-subtotal">
                  Subtotal: R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
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
          </div>

          {/* Summary Sidebar */}
          <div className="order-summary">
            <h2 className="order-summary-title">Resumo do Pedido</h2>
            <div className="order-summary-content">
              <div className="summary-row">
                <p className="summary-label">Subtotal</p>
                <p className="summary-value">R$ {subtotal.toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="summary-row">
                <p className="summary-label">Frete</p>
                <p className="summary-value">R$ {shipping.toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="summary-row">
                <p className="summary-label">Total</p>
                <p className="summary-value bold">R$ {total.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
            <div className="btn-container">
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={() => navigate('/checkout')}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

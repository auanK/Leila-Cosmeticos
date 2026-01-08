import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const orders = [
  { id: '#12345', date: '20 de Dezembro de 2025' },
  { id: '#67890', date: '15 de Novembro de 2025' },
  { id: '#11223', date: '03 de Outubro de 2025' }
];

const Orders = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
        <div className="layout-container">
          <Header showNav={true} />
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
        <Header showNav={true} />
        <div className="page-content">
          <Sidebar />
          <div className="main-content">
            <h1 className="page-title">Meus Pedidos</h1>

            {orders.map((order, i) => (
              <div key={i} className="order-item">
                <div className="order-info">
                  <p className="order-id">Pedido {order.id}</p>
                  <p className="order-date">{order.date}</p>
                </div>
                <button className="btn btn-secondary order-btn">
                  Ver Detalhes
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;

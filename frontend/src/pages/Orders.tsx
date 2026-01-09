import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../hooks/useOrders';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/80x80?text=Produto';

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `R$ ${num.toFixed(2).replace('.', ',')}`;
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
    case 'pendente':
      return { bg: '#fef3c7', text: '#d97706' };
    case 'processing':
    case 'processando':
      return { bg: '#dbeafe', text: '#2563eb' };
    case 'shipped':
    case 'enviado':
      return { bg: '#e0e7ff', text: '#4f46e5' };
    case 'delivered':
    case 'entregue':
      return { bg: '#d1fae5', text: '#059669' };
    case 'cancelled':
    case 'cancelado':
      return { bg: '#fee2e2', text: '#dc2626' };
    default:
      return { bg: '#f3f4f6', text: '#6b7280' };
  }
};

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'Pendente';
    case 'processing': return 'Processando';
    case 'shipped': return 'Enviado';
    case 'delivered': return 'Entregue';
    case 'cancelled': return 'Cancelado';
    default: return status;
  }
};

const Orders = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { orders, loading, error } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || loading) {
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
            <h1 className="page-title">Meus Pedidos ({orders.length})</h1>

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

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                  Você ainda não fez nenhum pedido.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/produtos')}
                >
                  Explorar Produtos
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map((order) => {
                  const statusColors = getStatusColor(order.status);
                  const isExpanded = expandedOrder === order.id;

                  return (
                    <div 
                      key={order.id} 
                      style={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px', 
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      {/* Header do Pedido */}
                      <div 
                        style={{ 
                          padding: '16px 20px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none'
                        }}
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                            <p style={{ fontWeight: 600, fontSize: '16px', margin: 0 }}>
                              Pedido #{order.id}
                            </p>
                            <span style={{ 
                              backgroundColor: statusColors.bg, 
                              color: statusColors.text,
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 500
                            }}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                            {formatDate(order.created_at)} • {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <p style={{ fontWeight: 600, color: '#be185d', fontSize: '18px', margin: 0 }}>
                            {formatPrice(order.total_amount)}
                          </p>
                          <span style={{ color: '#9a4c66', fontSize: '12px' }}>
                            {isExpanded ? '▲' : '▼'}
                          </span>
                        </div>
                      </div>

                      {/* Itens do Pedido (expandido) */}
                      {isExpanded && (
                        <div style={{ padding: '16px 20px' }}>
                          {order.items.map((item, idx) => (
                            <div 
                              key={idx}
                              style={{ 
                                display: 'flex', 
                                gap: '16px', 
                                alignItems: 'center',
                                padding: '12px 0',
                                borderBottom: idx < order.items.length - 1 ? '1px solid #f3f4f6' : 'none'
                              }}
                            >
                              <img 
                                src={item.image || PLACEHOLDER_IMAGE} 
                                alt={item.name}
                                style={{ 
                                  width: '60px', 
                                  height: '60px', 
                                  objectFit: 'cover', 
                                  borderRadius: '8px' 
                                }}
                              />
                              <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 500, marginBottom: '4px' }}>{item.name}</p>
                                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                                  Qtd: {item.quantity} × {formatPrice(item.unit_price)}
                                </p>
                              </div>
                              <p style={{ fontWeight: 500 }}>
                                {formatPrice(parseFloat(item.unit_price) * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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

export default Orders;

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const orders = [
  { id: '#12345', date: '22 de Julho de 2024' },
  { id: '#67890', date: '15 de Junho de 2024' },
  { id: '#11223', date: '03 de Maio de 2024' }
];

const Orders = () => {
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

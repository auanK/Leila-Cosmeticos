import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
import { api } from '../services/api';
import type { AdminOrder, AdminOrderDetail } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/admin.css';

const getStatusClass = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower === 'pendente' || statusLower === 'pending') return 'status-pendente';
  if (statusLower === 'processing') return 'status-processing';
  if (statusLower === 'shipped') return 'status-shipped';
  if (statusLower === 'pago' || statusLower === 'paid') return 'status-pago';
  if (statusLower === 'entregue' || statusLower === 'delivered') return 'status-entregue';
  if (statusLower === 'cancelado' || statusLower === 'cancelled') return 'status-cancelado';
  return 'status-pendente';
};

const getStatusLabel = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower === 'pending') return 'Pendente';
  if (statusLower === 'processing') return 'Processando';
  if (statusLower === 'shipped') return 'Enviado';
  if (statusLower === 'paid') return 'Pago';
  if (statusLower === 'delivered') return 'Entregue';
  if (statusLower === 'cancelled') return 'Cancelado';
  return status;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const AdminOrders = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);
  const [orderToUpdate, setOrderToUpdate] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminOrders();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.isAdmin) return;
    fetchOrders();
  }, [user?.isAdmin]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return orders.filter((order) => {
      return (
        String(order.id).includes(term) ||
        order.user_name.toLowerCase().includes(term) ||
        order.user_email.toLowerCase().includes(term)
      );
    });
  }, [orders, searchTerm]);

  const openViewModal = async (order: AdminOrder) => {
    try {
      const orderDetail = await api.getAdminOrder(order.id);
      setSelectedOrder(orderDetail);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes do pedido:', error);
      alert('Erro ao carregar detalhes do pedido');
    }
  };

  const openStatusModal = (order: AdminOrder) => {
    setOrderToUpdate(order);
    setNewStatus(order.status);
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!orderToUpdate || !newStatus) return;
    setIsSaving(true);
    try {
      await api.updateOrderStatus(orderToUpdate.id, newStatus);
      setIsStatusModalOpen(false);
      setOrderToUpdate(null);
      await fetchOrders();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert(error instanceof Error ? error.message : 'Erro ao atualizar status');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <AdminSidebar />

      <main className="main-content">
        <AdminHeader searchPlaceholder="" align="right" showSearch={false} searchValue={searchTerm} onSearchChange={setSearchTerm} />

        <div className="content-padding">
          <div className="page-header">
            <div>
              <h2 className="page-title">Gestão de Pedidos</h2>
              <p className="page-subtitle">Acompanhe e gerencie todos os pedidos realizados.</p>
            </div>
          </div>


<section className="filter-section">
          <div className="filter-card">
            <div className="input-group" style={{flex: 1}}>
              <label className="input-label">Busca</label>
              <div className="search-box">
                <span className="material-symbols-outlined search-icon">search</span>
                <input 
                  type="text" 
                  placeholder="Buscar por Cliente ou ID do Pedido" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>


          <AdminTable
            title="Lista de Pedidos"
            data={orders}
            filteredData={filteredOrders}
            columns={[
              {
                key: 'id',
                label: 'ID do Pedido',
                render: (value) => <span style={{fontWeight: 'bold', color: 'var(--text-muted)'}}>#{value}</span>
              },
              {
                key: 'user_name',
                label: 'Cliente',
                render: (value, row) => (
                  <div className="client-cell">
                    <div 
                      className="client-avatar" 
                      style={{
                        backgroundImage: row.user_photo ? `url('${row.user_photo}')` : 'none',
                        backgroundColor: !row.user_photo ? '#be185d' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {!row.user_photo && value?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{fontWeight: 'bold', margin: 0, fontSize: '14px'}}>{value}</p>
                      <p style={{color: 'var(--text-muted)', margin: 0, fontSize: '12px'}}>{row.user_email}</p>
                    </div>
                  </div>
                )
              },
              {
                key: 'created_at',
                label: 'Data',
                render: (value) => <span style={{fontSize: '14px', fontWeight: '500'}}>{formatDate(value)}</span>
              },
              {
                key: 'total_amount',
                label: 'Total',
                render: (value, row) => (
                  <span style={{
                    fontWeight: '800', 
                    fontSize: '14px', 
                    color: getStatusClass(row.status) === 'status-cancelado' ? 'var(--text-muted)' : 'inherit'
                  }}>
                    R$ {Number(value).toFixed(2).replace('.', ',')}
                  </span>
                )
              },
              {
                key: 'status',
                label: 'Status',
                render: (value) => (
                  <span className={`badge-status ${getStatusClass(value)}`}>
                    {getStatusLabel(value)}
                  </span>
                )
              }
            ]}
            isLoading={isLoading}
            emptyMessage="Nenhum pedido encontrado"
            countLabel="Pedidos"
            showSortButton={false}
            actions={(row) => (
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                <button className="btn-icon" style={{color: 'var(--text-muted)'}} onClick={() => openViewModal(row)}>
                  <span className="material-symbols-outlined">visibility</span>
                </button>
                <button className="btn-icon" style={{color: '#3b82f6'}} onClick={() => openStatusModal(row)}>
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
            )}
          />
        </div>
      </main>

      {/* Modal Detalhes do Pedido */}
      {isViewModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={() => setIsViewModalOpen(false)}>
          <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Pedido #{selectedOrder.id}</h3>
              <button className="btn-icon" onClick={() => setIsViewModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="order-detail-grid">
                <div className="order-section">
                  <h4>Informações do Cliente</h4>
                  <p><strong>Nome:</strong> {selectedOrder.user_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.user_email}</p>
                  {selectedOrder.user_phone && <p><strong>Telefone:</strong> {selectedOrder.user_phone}</p>}
                </div>
                
                <div className="order-section">
                  <h4>Endereço de Entrega</h4>
                  {selectedOrder.street ? (
                    <>
                      <p>{selectedOrder.street}, {selectedOrder.number}</p>
                      {selectedOrder.complement && <p>{selectedOrder.complement}</p>}
                      <p>{selectedOrder.neighborhood}</p>
                      <p>{selectedOrder.city} - {selectedOrder.state}</p>
                      <p>CEP: {selectedOrder.zip_code}</p>
                    </>
                  ) : (
                    <p style={{color: 'var(--text-muted)'}}>Endereço não disponível</p>
                  )}
                </div>

                <div className="order-section" style={{gridColumn: 'span 2'}}>
                  <h4>Itens do Pedido</h4>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Preço Unit.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            {item.image && (
                              <img src={item.image} alt={item.name} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} />
                            )}
                            {item.name}
                          </td>
                          <td>{item.quantity}</td>
                          <td>R$ {Number(item.unit_price).toFixed(2).replace('.', ',')}</td>
                          <td>R$ {(Number(item.unit_price) * item.quantity).toFixed(2).replace('.', ',')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="order-summary">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span>Status:</span>
                    <span className={`badge-status ${getStatusClass(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '18px'}}>
                    <span>Total:</span>
                    <span>R$ {Number(selectedOrder.total_amount).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>
                Fechar
              </button>
              <button className="btn btn-primary" onClick={() => {
                setIsViewModalOpen(false);
                openStatusModal(selectedOrder);
              }}>
                Alterar Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Alterar Status */}
      {isStatusModalOpen && orderToUpdate && (
        <div className="modal-overlay" onClick={() => setIsStatusModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Alterar Status - Pedido #{orderToUpdate.id}</h3>
              <button className="btn-icon" onClick={() => setIsStatusModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label className="input-label">Novo Status</label>
                <select 
                  className="form-input"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pendente</option>
                  <option value="processing">Processando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregue</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsStatusModalOpen(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
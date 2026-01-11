import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
import { useOrders } from '../hooks/useOrders';
import '../styles/pages/admin.css';

const AdminOrders = () => {
  const { orders: apiOrders, loading, error } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('pago') || statusLower === 'paid') return 'status-pago';
    if (statusLower.includes('pendente') || statusLower === 'pending') return 'status-pendente';
    if (statusLower.includes('entregue') || statusLower === 'delivered') return 'status-entregue';
    if (statusLower.includes('cancelado') || statusLower === 'cancelled') return 'status-cancelado';
    return 'status-pendente';
  };

  const transformedOrders = apiOrders.map((order) => ({
    id: `#${order.id}`,
    client: order.items[0]?.name || 'Cliente',
    email: 'N/A',
    date: new Date(order.created_at).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    }),
    total: order.total_amount,
    status: order.status,
    statusClass: getStatusClass(order.status),
    avatar: 'https://ui-avatars.com/api/?name=Cliente&background=random'
  }));

  const filteredOrders = transformedOrders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(term) ||
      order.client.toLowerCase().includes(term) ||
      order.email.toLowerCase().includes(term)
    );
  });

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
            <button className="btn" style={{background: 'var(--bg-body)', height: '44px'}}>
              <span className="material-symbols-outlined">filter_list</span>
              Filtros Avançados
            </button>
          </div>
        </section>


          <AdminTable
            title="Lista de Pedidos"
            data={transformedOrders}
            filteredData={filteredOrders}
            columns={[
              {
                key: 'id',
                label: 'ID do Pedido',
                render: (value) => <span style={{fontWeight: 'bold', color: 'var(--text-muted)'}}>{value}</span>
              },
              {
                key: 'client',
                label: 'Cliente',
                render: (value, row) => (
                  <div className="client-cell">
                    <div className="client-avatar" style={{backgroundImage: `url('${row.avatar}')`}}></div>
                    <div>
                      <p style={{fontWeight: 'bold', margin: 0, fontSize: '14px'}}>{value}</p>
                      <p style={{color: 'var(--text-muted)', margin: 0, fontSize: '12px'}}>{row.email}</p>
                    </div>
                  </div>
                )
              },
              {
                key: 'date',
                label: 'Data',
                render: (value) => <span style={{fontSize: '14px', fontWeight: '500'}}>{value}</span>
              },
              {
                key: 'total',
                label: 'Total',
                render: (value, row) => <span style={{fontWeight: '800', fontSize: '14px', color: row.totalClass || 'inherit'}}>{value}</span>
              },
              {
                key: 'status',
                label: 'Status',
                render: (value, row) => (
                  <span className={`badge-status ${row.statusClass}`}>
                    {value}
                  </span>
                )
              }
            ]}
            isLoading={loading}
            emptyMessage="Nenhum pedido encontrado"
            countLabel="Pedidos"
            showSortButton={false}
            actions={() => (
              <button className="btn-icon" style={{color: 'var(--text-muted)'}}>
                <span className="material-symbols-outlined">visibility</span>
              </button>
            )}
          />
          {error && <div style={{color: 'red', marginTop: '16px'}}>Erro ao carregar pedidos: {error}</div>}
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
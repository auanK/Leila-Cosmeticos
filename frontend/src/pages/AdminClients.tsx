import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
import { api } from '../services/api';
import type { AdminUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/admin.css';

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const AdminClients = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const data = await api.getAdminUsers();
        setClients(data);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [user?.isAdmin]);

  const filteredClients = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return clients.filter((client) => {
      return (
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        (client.phone || '').toLowerCase().includes(term)
      );
    });
  }, [clients, searchTerm]);

  const openViewModal = (client: AdminUser) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  if (authLoading || !user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <AdminSidebar />

      <main className="main-content">
        <AdminHeader searchPlaceholder="Buscar por nome ou email..." align="right" showSearch={false} searchValue={searchTerm} onSearchChange={setSearchTerm} />

        <div className="content-padding">
          <div className="page-header">
            <div>
              <h2 className="page-title">Gestão de Clientes</h2>
              <p className="page-subtitle">Visualize e gerencie todos os clientes cadastrados.</p>
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
                  placeholder="Buscar por Nome ou Telefone" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

          <AdminTable
            title="Lista de Clientes"
            data={clients}
            filteredData={filteredClients}
            columns={[
              {
                key: 'name',
                label: 'Cliente',
                render: (value, row) => (
                  <div className="client-cell">
                    <div 
                      className="client-avatar" 
                      style={{
                        backgroundImage: row.profile_image ? `url('${row.profile_image}')` : 'none',
                        backgroundColor: !row.profile_image ? '#be185d' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {!row.profile_image && value?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{fontWeight: 'bold', margin: 0, fontSize: '14px'}}>{value}</p>
                      <p style={{color: 'var(--text-muted)', margin: 0, fontSize: '12px'}}>{row.email}</p>
                    </div>
                  </div>
                )
              },
              {
                key: 'phone',
                label: 'Telefone',
                render: (value) => <span style={{fontSize: '14px', color: '#4b5563'}}>{value || '-'}</span>
              },
              {
                key: 'order_count',
                label: 'Pedidos',
                render: (value) => <span style={{fontSize: '14px', color: '#4b5563'}}>{value || 0}</span>
              },
              {
                key: 'total_spent',
                label: 'Total Gasto',
                render: (value) => (
                  <span style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)'}}>
                    R$ {Number(value || 0).toFixed(2).replace('.', ',')}
                  </span>
                )
              },
              {
                key: 'last_order_date',
                label: 'Última Compra',
                render: (value) => <span style={{fontSize: '14px', color: '#4b5563'}}>{formatDate(value)}</span>
              },
              {
                key: 'status',
                label: 'Status',
                render: (_value, row) => (
                  <span className={`badge-pill ${Number(row.order_count) > 0 ? 'badge-ativo' : 'badge-inativo'}`}>
                    {Number(row.order_count) > 0 ? 'Ativo' : 'Inativo'}
                  </span>
                )
              }
            ]}
            isLoading={isLoading}
            emptyMessage="Nenhum cliente encontrado"
            countLabel="Clientes"
            showSortButton={false}
            actions={(row) => (
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                <button className="btn-icon" style={{color: 'var(--text-muted)'}} onClick={() => openViewModal(row)}>
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            )}
          />
        </div>
      </main>

      {/* Modal Detalhes do Cliente */}
      {isViewModalOpen && selectedClient && (
        <div className="modal-overlay" onClick={() => setIsViewModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalhes do Cliente</h3>
              <button className="btn-icon" onClick={() => setIsViewModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
                <div 
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundImage: selectedClient.profile_image ? `url('${selectedClient.profile_image}')` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: !selectedClient.profile_image ? '#be185d' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '24px'
                  }}
                >
                  {!selectedClient.profile_image && selectedClient.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{margin: 0}}>{selectedClient.name}</h4>
                  <p style={{margin: 0, color: 'var(--text-muted)'}}>{selectedClient.email}</p>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div className="client-info-item">
                  <span className="info-label">Telefone</span>
                  <span className="info-value">{selectedClient.phone || 'Não informado'}</span>
                </div>
                <div className="client-info-item">
                  <span className="info-label">CPF</span>
                  <span className="info-value">{selectedClient.cpf || 'Não informado'}</span>
                </div>
                <div className="client-info-item">
                  <span className="info-label">Total de Pedidos</span>
                  <span className="info-value">{selectedClient.order_count || 0}</span>
                </div>
                <div className="client-info-item">
                  <span className="info-label">Total Gasto</span>
                  <span className="info-value" style={{color: 'var(--primary)', fontWeight: 'bold'}}>
                    R$ {Number(selectedClient.total_spent || 0).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="client-info-item">
                  <span className="info-label">Cadastro</span>
                  <span className="info-value">{formatDate(selectedClient.created_at)}</span>
                </div>
                <div className="client-info-item">
                  <span className="info-label">Última Compra</span>
                  <span className="info-value">{formatDate(selectedClient.last_order_date)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClients;
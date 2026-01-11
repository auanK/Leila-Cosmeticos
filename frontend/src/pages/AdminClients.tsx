import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
import { useClients } from '../hooks/useClients';
import '../styles/pages/admin.css';

const AdminClients = () => {
  const { clients: apiClients, isLoading, error } = useClients();
  const [searchTerm, setSearchTerm] = useState('');

  const transformedClients = apiClients.map((client) => ({
    id: client.id,
    name: client.name || 'N/A',
    email: client.email || 'N/A',
    phone: client.phone || 'N/A',
    location: 'N/A',
    total: 'R$ 0,00',
    lastBuy: 'N/A',
    status: 'Ativo',
    statusClass: 'badge-ativo',
    img: client.profile_image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(client.name || 'Cliente') + '&background=random'
  }));

  const filteredClients = transformedClients.filter((client) => {
    const term = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.phone.toLowerCase().includes(term) ||
      client.location.toLowerCase().includes(term)
    );
  });

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
            <button className="btn" style={{background: 'var(--bg-body)', height: '44px'}}>
              <span className="material-symbols-outlined">filter_list</span>
              Filtros Avançados
            </button>
          </div>
        </section>

          <AdminTable
            title="Lista de Clientes"
            data={transformedClients}
            filteredData={filteredClients}
            columns={[
              {
                key: 'name',
                label: 'Cliente',
                render: (value, row) => (
                  <div className="client-cell">
                    <div className="client-avatar" style={{backgroundImage: `url('${row.img}')`}}></div>
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
                render: (value) => <span style={{fontSize: '14px', color: '#4b5563'}}>{value}</span>
              },
              {
                key: 'location',
                label: 'Localização',
                render: (value) => <span style={{fontSize: '14px', color: '#4b5563'}}>{value}</span>
              },
              {
                key: 'total',
                label: 'Total Gasto',
                render: (value) => <span style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)'}}>{value}</span>
              },
              {
                key: 'lastBuy',
                label: 'Última Compra',
                render: (value) => <span style={{fontSize: '14px', color: '#4b5563'}}>{value}</span>
              },
              {
                key: 'status',
                label: 'Status',
                render: (value, row) => (
                  <span className={`badge-pill ${row.statusClass}`}>
                    {value}
                  </span>
                )
              }
            ]}
            isLoading={isLoading}
            emptyMessage="Nenhum cliente encontrado"
            countLabel="Clientes"
            showSortButton={false}
            actions={() => (
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                <button className="btn-icon" style={{color: 'var(--text-muted)'}}>
                  <span className="material-symbols-outlined">visibility</span>
                </button>
                <button className="btn-icon" style={{color: '#3b82f6'}}>
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="btn-icon" style={{color: '#ef4444'}}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            )}
          />
          {error && <div style={{color: 'red', marginTop: '16px'}}>Erro ao carregar clientes: {error}</div>}
        </div>
      </main>
    </div>
  );
};

export default AdminClients;
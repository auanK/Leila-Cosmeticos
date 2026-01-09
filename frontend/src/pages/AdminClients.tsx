import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
import '../styles/pages/admin.css';

const AdminClients = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    {
      id: 1,
      name: "Ana Silva",
      email: "ana.silva@email.com",
      phone: "(11) 98765-4321",
      location: "São Paulo/SP",
      total: "R$ 1.250,00",
      lastBuy: "12 Out 2023",
      status: "Ativo",
      statusClass: "badge-ativo",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLDXMenz1R6JI5g9JfZeMQquJIyHRYQDISquxG4ltmRDpKY8eH12Dad6eQDnNQzVbUFcjV3IGEvDiKBnorUSq0R1uTIckIyQv66N7rIoVQvC_uRVh0_oo6LEP9Gitiam_65BAwt5H6SS3vQEpPeol1Uyg2J5w72aAAr_ws3pkgxyg-VnTJ9j4GRxWNS-hq8fjzM6sDvVYTAfC8SxLf5X1WMAS0Ub_peuw5uLXN56TttutILpReIsXr_CQWvV8soeMSgtFUAxh4viw"
    },
    {
      id: 2,
      name: "Carlos Santos",
      email: "carlos.s@email.com",
      phone: "(21) 97766-5544",
      location: "Rio de Janeiro/RJ",
      total: "R$ 450,90",
      lastBuy: "05 Set 2023",
      status: "Inativo",
      statusClass: "badge-inativo",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD11PEpL85JSA_u1Q7bVe2vDBuwFlX-PnUuNgtSnVvnOVDahNhhd3E9h9WIRZRBRpmYA4dtum53_FMjRAJXzPNqKGPMRSaPKikN7pfYiPB_jXLC4BdJNn8EnWg7WFZYNntnBSBNmqA_LaEtVkI6ObNwapMFMGDAIdfVZBA04HFEd86kOuYU_Cwo8kMMxSh4uZVrAeUHOm7DXs_k-1wYmsrEfoBEKw-3cbPTIQ1fZYX74iMs4PrlbXmC2XeGVfDGvi0d2nyNK8cwync"
    },
    {
      id: 3,
      name: "Mariana Lopes",
      email: "mari.lopes@email.com",
      phone: "(31) 98877-6655",
      location: "Belo Horizonte/MG",
      total: "R$ 2.340,00",
      lastBuy: "28 Out 2023",
      status: "Ativo",
      statusClass: "badge-ativo",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyg13ne51azF3yO_FxasCw-wgYx6jP39tUNiIn5mWfhIwRy5XqCpzClS2dbLEnwK-OPVFdfxYsnlsd66Q5hPFlLVZNiBHimuhQD8EL2wSfcHfkv7nyYTdmOUQiu8M_cA5opW4vXLtuOmOQDgjQSwIfalvq8YpmnoTtmvVJSiZrNAwRpIxprj-sy-4k-ZsRKoghvq8Nx6N3ncsHM0FIaYBjgm4kzgWRKHtWOL7P-Lnk8VV0-OnzQOcDeni2stWxtVUJsdYCGZOC7uY"
    }
  ];

  const filteredClients = clients.filter((client) => {
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
        <AdminHeader searchPlaceholder="Buscar por nome ou email..." align="right" showSearch={true} searchValue={searchTerm} onSearchChange={setSearchTerm} />

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
            data={clients}
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
            isLoading={false}
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
        </div>
      </main>
    </div>
  );
};

export default AdminClients;
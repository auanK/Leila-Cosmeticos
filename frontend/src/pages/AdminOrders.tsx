import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
import '../styles/pages/admin.css';

const AdminOrders = () => {
  const orders = [
    {
      id: "#4592",
      client: "Ana Silva",
      email: "ana.silva@email.com",
      date: "12 de Out, 2023",
      total: "R$ 250,00",
      status: "Pendente",
      statusClass: "status-pendente",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGd-HUG1NzLziI_fAv_wthI-PAwlO-Wt-CTvid6ImZPhH6qZLDB5Dt-RipQX2fPL2B4gKoMG6__CmE6WAAZHRv8NdXFSHxvSRKUkQjrObW58iLSeYLdcwuaKPu9q8d12PIAKCpYDHiQTRG51FXOw8w3Up4RXwARPMOG0kImQOPSnfMibWFmn5rgAaMu-DCyKHfpkZwA7UJHTZQhwa_nQVXzHsalc7BYWOnrCL04KH-ljADYMDbDOuZEpDDfnDpIhPhCfzBn0ZMecg"
    },
    {
      id: "#4591",
      client: "Carlos Souza",
      email: "carlos.souza@gmail.com",
      date: "11 de Out, 2023",
      total: "R$ 180,50",
      status: "Pago",
      statusClass: "status-pago",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC40PTcaPlojW2fhhaexxrwzY_Oi-J4byn-yWIla72CgzIJrgO5rgs3eIeLoBMCj_-JzbgMl00QjyzIUepDgs_eSby3AKCUDUOpcvxtU8785JnIuCCl1OLMtPIArEJBE2b28_O1_llWVGpxvPFdsnVkTK_PkavOxDMfS4nl7cGI7p6tNWnmwlPWBQ1mpW3pxKy_1r3ikT8AH8BjkMCsWSICpbWcHc8O3kXQzl-V6U9GElHyEzlFt1kIYt0gYdC7uTzhC7xVvwsq3Kw"
    },
    {
      id: "#4590",
      client: "Maria Oliveira",
      email: "maria.oliveira@outlook.com",
      date: "10 de Out, 2023",
      total: "R$ 420,00",
      status: "Entregue",
      statusClass: "status-entregue",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDv_FJ60v1vMsLWObVTfqcUl6IqFFFLuN8dCOz76I43KSJYVpZhZDMnkfhT-RRJ3m00YGGBb6mr9zkEe_GIVbZ-1QsQ2LtWbQ6m8mnakQGHWUQRvfItNueEfaW7F5JYX0T3cyz9-mkCWms5ZWd-xOIYMJi6oxLeOnvSaEYHovacWHmSrIA8dCLpk9eELYHEhBxvtychCo79ey1xkArqPV8q8nxNxtEJD-2ullIZWC9N9OHJbngjfSwmxXgjW-pNQfkMfE5jZqcG_mo"
    },
    {
      id: "#4589",
      client: "João Pereira",
      email: "joao.p@empresa.com.br",
      date: "09 de Out, 2023",
      total: "R$ 95,00",
      status: "Cancelado",
      statusClass: "status-cancelado",
      totalClass: "text-muted", 
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUBawZ-MxwxN5zqhM21llEUn6I5IW4wvvG4HSf8y082UsUxlv1Hgf6R4DjziKzY3CbTmWRu6IqB_ltyzyOTKm5C84-bq7zXNnhENyWfbjdOyYu1mjCd-gfiALxPtOwKYFE32S7zzCsAog9q8e47xqQ9eKhUyTgupj_IYhxYcefql-Ss6Rfy4reEYC-Y6qbc_dfd0aQVo0jD9OvZvV-_CErQuFCbg0dEJHyO17ojfonugtCkShwtrsXCyr4SLRco9261hsj7zlDBqc"
    },
    {
      id: "#4588",
      client: "Lucia Santos",
      email: "lu.santos@gmail.com",
      date: "08 de Out, 2023",
      total: "R$ 310,00",
      status: "Pago",
      statusClass: "status-pago",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCF100QIe7KkV71dNAS1hjgSLnjAbaM-1OJ8L5WuFGQ3il3zJqvYs0b3HLP0vitzAMxenfSijgQCG4cTQ3TsdZwfJlHa6xNb3JIk4rIWGMNLT_a3GhUm_z7fCy5lLRxWPjoLX-dVKWbX-Msg9JeMiQrdKvDLAlCH0fhTtiqSuFxEcSSb2yKEhsPanQHU0eHqSRitP75XxW1ss1A-v3M-AfHnnnT0DosXUoS-9IO7V1zK-S4L06JxVkWezPO7DuVM_Jqvvgqym_8yk"
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((order) => {
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
            data={orders}
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
            isLoading={false}
            emptyMessage="Nenhum pedido encontrado"
            countLabel="Pedidos"
            showSortButton={false}
            actions={() => (
              <button className="btn-icon" style={{color: 'var(--text-muted)'}}>
                <span className="material-symbols-outlined">visibility</span>
              </button>
            )}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
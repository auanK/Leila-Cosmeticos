import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { api } from '../services/api';
import '../styles/pages/admin.css';

interface Category {
  id: number;
  name: string;
  description?: string;
  is_featured?: boolean;
  created_at?: string;
}

const Categories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;

    setIsLoading(true);
    try {
      await api.createCategory({
        name: newCategory.name,
        description: newCategory.description,
        is_featured: false
      });
      setNewCategory({ name: '', description: '' });
      setIsModalOpen(false);
      await fetchCategories();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <AdminSidebar />

      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="top-header">
          <div className="search-box">
            <span className="material-symbols-outlined search-icon">search</span>
            <input type="text" placeholder="Buscar categorias..." />
          </div>
          <div className="header-actions">
            <button className="btn btn-icon"><span className="material-symbols-outlined">notifications</span></button>
            <div className="user-profile">
              <div style={{textAlign: 'right'}}>
                <p style={{fontWeight: 'bold', margin: 0, fontSize: '14px'}}>Leila Souza</p>
                <p style={{color: 'var(--text-muted)', margin: 0, fontSize: '10px'}}>Administradora</p>
              </div>
              <div className="avatar" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDEqI2geNVfiSWkVsgwXgt9RqnLZmla7AMT_lq1UAamW-TSMCJESlmr-NsilHqBh_Jtcdn3OI6qFms_bU1B9lgt2RTtV1w8FDvUMexNIQOGQ25qZntL706QEodWilON9q63h3G3a-MmVeexk3lVyjufgQJU40wD0oia1Hysp6G0pLodM_sDnwOI1VgKvoyd0CxZlnR48Scsfm1IsTwvqAkrtdmoRYZmx12OYVCniEa_7krsU3euq3JKldsvgkyfC-4fEQiqO1uIm5Y')"}}></div>
            </div>
          </div>
        </header>

        <div className="content-padding">
          <div className="page-header">
            <div>
              <h2 className="page-title">Gestão de Categorias</h2>
              <p className="page-subtitle">Organize seus produtos por grupos e facilite a navegação.</p>
            </div>
          </div>

          <div className="table-container categories-table">
            <div className="table-header">
              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <h3 style={{margin: 0, fontSize: '18px'}}>Lista de Categorias</h3>
                <span className="tag" style={{background: 'var(--bg-body)', color: 'var(--text-muted)'}}>{categories.length} Categorias</span>
              </div>
              <div style={{display: 'flex', gap: '12px'}}>
                <button className="btn btn-outline">
                  <span className="material-symbols-outlined" style={{fontSize: '18px'}}>sort</span> Ordenar
                </button>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                  <span className="material-symbols-outlined">add_circle</span>
                  Nova Categoria
                </button>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome da Categoria</th>
                  <th>Descrição</th>
                  <th>Data de Criação</th>
                  <th style={{textAlign: 'right'}}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', padding: '40px'}}>
                      Carregando...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                      Nenhuma categoria cadastrada
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>
                        <span style={{fontWeight: 'bold'}}>#{cat.id}</span>
                      </td>
                      <td>
                        <p style={{fontWeight: 'bold', margin: 0, fontSize: '14px'}}>{cat.name}</p>
                      </td>
                      <td>
                        <p style={{color: 'var(--text-muted)', margin: 0, fontSize: '12px'}}>{cat.description || 'Sem descrição'}</p>
                      </td>
                      <td style={{fontSize: '14px'}}>
                        {cat.created_at ? new Date(cat.created_at).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td style={{textAlign: 'right'}}>
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                          <button className="btn-icon" style={{border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)'}}>
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button className="btn-icon" style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444'}}>
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            <div className="nav-footer" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)'}}>
                <p>Exibindo {categories.length} categori{categories.length === 1 ? 'a' : 'as'}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Nova Categoria */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" style={{maxWidth: '720px'}}>
            <div className="table-header">
              <h3 style={{margin: 0}}>Nova Categoria</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form className="modal-body" onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label>Nome da Categoria</label>
                <input 
                  className="form-input" 
                  placeholder="Ex: Higiene Corporal" 
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Descrição</label>
                <textarea 
                  className="form-input" 
                  placeholder="Descreva a categoria..." 
                  rows={3}
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline btn-full">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                  {isLoading ? 'Criando...' : 'Criar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
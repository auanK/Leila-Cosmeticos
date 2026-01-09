import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
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

  const filteredCategories = categories.filter((cat) => {
    const term = searchTerm.toLowerCase();
    const matchesTerm =
      cat.name.toLowerCase().includes(term) ||
      (cat.description || '').toLowerCase().includes(term) ||
      String(cat.id).includes(term);
    const matchesCategory = !categoryFilter || cat.name === categoryFilter;
    return matchesTerm && matchesCategory;
  });

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
        <AdminHeader align="right" />
        

        <div className="content-padding">
          <div className="page-header">
            <div>
              <h2 className="page-title">Gestão de Categorias</h2>
              <p className="page-subtitle">Organize seus produtos por grupos e facilite a navegação.</p>
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
                  placeholder="Buscar categoria" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="input-group" style={{width: '250px'}}>
              <label className="input-label">Categoria</label>
              <select 
                className="form-input"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Todas as Categorias</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <button className="btn" style={{background: 'var(--bg-body)', height: '44px'}}>
              <span className="material-symbols-outlined">filter_list</span>
              Filtros Avançados
            </button>
          </div>
        </section>

          <AdminTable
            title="Lista de Categorias"
            data={categories}
            filteredData={filteredCategories}
            columns={[
              {
                key: 'id',
                label: 'ID',
                render: (value) => <span style={{ fontWeight: 'bold' }}>#{value}</span>
              },
              {
                key: 'name',
                label: 'Nome da Categoria',
                render: (value) => <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px' }}>{value}</p>
              },
              {
                key: 'description',
                label: 'Descrição',
                render: (value) => (
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '12px' }}>
                    {value || 'Sem descrição'}
                  </p>
                )
              },
              {
                key: 'created_at',
                label: 'Data de Criação',
                render: (value) => (
                  <span style={{ fontSize: '14px' }}>
                    {value ? new Date(value).toLocaleDateString('pt-BR') : '-'}
                  </span>
                )
              }
            ]}
            isLoading={isLoading}
            emptyMessage="Nenhuma categoria cadastrada"
            emptyFilteredMessage="Nenhuma categoria encontrada"
            countLabel="Categorias"
            onAdd={() => setIsModalOpen(true)}
            addButtonLabel="Nova Categoria"
            addButtonIcon="add_circle"
            actions={(row) => (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  className="btn-icon"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  className="btn-icon"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            )}
            className="categories-table"
          />
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
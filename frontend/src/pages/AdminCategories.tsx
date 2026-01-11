import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/admin.css';

interface Category {
  id: number;
  name: string;
  description?: string;
  is_featured?: boolean;
  created_at?: string;
}

const Categories = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_featured: false
  });

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchCategories();
    }
  }, [user?.isAdmin]);

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

  const resetForm = () => {
    setFormData({ name: '', description: '', is_featured: false });
    setEditingCategory(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      is_featured: category.is_featured || false
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSaving(true);
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
      } else {
        await api.createCategory(formData);
      }
      resetForm();
      setIsModalOpen(false);
      await fetchCategories();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert(error instanceof Error ? error.message : 'Erro ao salvar categoria');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setIsSaving(true);
    try {
      await api.deleteCategory(categoryToDelete.id);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      await fetchCategories();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert(error instanceof Error ? error.message : 'Erro ao excluir categoria');
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
            onAdd={openCreateModal}
            addButtonLabel="Nova Categoria"
            addButtonIcon="add_circle"
            actions={(row) => (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  className="btn-icon"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#3b82f6' }}
                  onClick={() => openEditModal(row)}
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  className="btn-icon"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}
                  onClick={() => openDeleteModal(row)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            )}
            className="categories-table"
          />
        </div>
      </main>

      {/* Modal Criar/Editar Categoria */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '520px'}}>
            <div className="modal-header">
              <h3>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="input-group">
                  <label className="input-label">Nome da Categoria *</label>
                  <input 
                    className="form-input" 
                    placeholder="Ex: Higiene Corporal" 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Descrição</label>
                  <textarea 
                    className="form-input" 
                    placeholder="Descreva a categoria..." 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="input-group">
                  <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                    <input 
                      type="checkbox" 
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    />
                    Categoria em Destaque
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Salvando...' : (editingCategory ? 'Salvar Alterações' : 'Criar Categoria')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Exclusão */}
      {isDeleteModalOpen && categoryToDelete && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Exclusão</h3>
              <button className="btn-icon" onClick={() => setIsDeleteModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Tem certeza que deseja excluir a categoria <strong>"{categoryToDelete.name}"</strong>?</p>
              <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>
                Categorias com produtos associados não podem ser excluídas.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={isSaving}>
                {isSaving ? 'Excluindo...' : 'Excluir Categoria'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { PencilIcon, TrashIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';
import { useAddresses } from '../hooks/useAddresses';
import type { CreateAddressData, Address } from '../services/api';

const Addresses = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { addresses, isLoading, error, addAddress, updateAddress, removeAddress } = useAddresses();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateAddressData>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
    is_main: false
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const resetForm = () => {
    setFormData({
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zip_code: '',
      is_main: false
    });
    setEditingId(null);
    setFormError(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (address: Address) => {
    setFormData({
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      is_main: address.is_main
    });
    setEditingId(address.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      if (editingId) {
        await updateAddress(editingId, formData);
      } else {
        await addAddress(formData);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar endereço');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja remover este endereço?')) {
      try {
        await removeAddress(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erro ao remover endereço');
      }
    }
  };

  const formatAddress = (addr: Address) => {
    const parts = [
      addr.street,
      addr.number,
      addr.complement,
      addr.neighborhood,
      `${addr.city} - ${addr.state}`,
      addr.zip_code
    ].filter(Boolean);
    return parts.join(', ');
  };

  if (authLoading || isLoading) {
    return (
      <div className="page-container">
        <div className="layout-container">
          <Header />
          <div style={{ padding: '40px', textAlign: 'center' }}>
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="layout-container">
        <Header />
        <div className="page-content">
          <Sidebar />
          <div className="main-content">
            <div className="address-header">
              <h1 className="page-title" style={{ padding: 0 }}>Meus Endereços</h1>
              <button className="btn btn-secondary order-btn" onClick={openAddModal}>
                Adicionar Endereço
              </button>
            </div>

            {error && (
              <div style={{ padding: '16px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {addresses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p>Você ainda não tem endereços cadastrados.</p>
                <button className="btn btn-primary" onClick={openAddModal} style={{ marginTop: '16px' }}>
                  Adicionar primeiro endereço
                </button>
              </div>
            ) : (
              addresses.map((address) => (
                <div key={address.id} className="address-card">
                  <div className="address-content">
                    <div className="address-info">
                      <div>
                        <p className="address-title">
                          {address.is_main ? '⭐ Endereço Principal' : `Endereço #${address.id}`}
                        </p>
                        <p className="address-text">{formatAddress(address)}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary address-edit-btn"
                          onClick={() => openEditModal(address)}
                        >
                          <span>Editar</span>
                          <PencilIcon />
                        </button>
                        <button 
                          className="btn btn-secondary address-edit-btn"
                          onClick={() => handleDelete(address.id)}
                          style={{ color: '#dc2626' }}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Adicionar/Editar Endereço */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>
              {editingId ? 'Editar Endereço' : 'Novo Endereço'}
            </h2>

            {formError && (
              <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#374151' }}>Rua</label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={e => setFormData(prev => ({ ...prev, street: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #e7cfd7', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#374151' }}>Número</label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={e => setFormData(prev => ({ ...prev, number: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #e7cfd7', borderRadius: '8px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#374151' }}>Complemento</label>
                  <input
                    type="text"
                    value={formData.complement}
                    onChange={e => setFormData(prev => ({ ...prev, complement: e.target.value }))}
                    placeholder="Apto, Bloco, etc."
                    style={{ width: '100%', padding: '10px', border: '1px solid #e7cfd7', borderRadius: '8px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#374151' }}>Bairro</label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={e => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #e7cfd7', borderRadius: '8px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#374151' }}>Cidade</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #e7cfd7', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#374151' }}>UF</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={e => setFormData(prev => ({ ...prev, state: e.target.value.toUpperCase().slice(0, 2) }))}
                      required
                      maxLength={2}
                      placeholder="SP"
                      style={{ width: '100%', padding: '10px', border: '1px solid #e7cfd7', borderRadius: '8px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#374151' }}>CEP</label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={e => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                    required
                    placeholder="00000-000"
                    style={{ width: '100%', padding: '10px', border: '1px solid #e7cfd7', borderRadius: '8px' }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_main}
                    onChange={e => setFormData(prev => ({ ...prev, is_main: e.target.checked }))}
                  />
                  <span style={{ fontSize: '14px', color: '#374151' }}>Definir como endereço principal</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;

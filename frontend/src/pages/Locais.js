import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { localService } from '../services/api';
import './Common.css';

const Locais = () => {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    estado: ''
  });

  useEffect(() => {
    loadLocais();
  }, []);

  const loadLocais = async () => {
    try {
      const response = await localService.getAll();
      setLocais(response.data);
    } catch (error) {
      toast.error('Erro ao carregar locais');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await localService.update(editingId, formData);
        toast.success('Local atualizado com sucesso');
      } else {
        await localService.create(formData);
        toast.success('Local criado com sucesso');
      }
      resetForm();
      loadLocais();
    } catch (error) {
      toast.error('Erro ao salvar local');
    }
  };

  const handleEdit = (local) => {
    setFormData({
      nome: local.nome,
      endereco: local.endereco || '',
      cidade: local.cidade || '',
      estado: local.estado || ''
    });
    setEditingId(local.id);
    setShowForm(true);
  };

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Deseja realmente excluir o local "${nome}"?`)) {
      try {
        await localService.delete(id);
        toast.success('Local excluido com sucesso');
        loadLocais();
      } catch (error) {
        toast.error('Erro ao excluir local');
      }
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', endereco: '', cidade: '', estado: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Locais</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <FiPlus /> Novo Local
        </button>
      </div>

      {showForm && (
        <form className="form-card inline-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Editar Local' : 'Novo Local'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome *</label>
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endereco">Endereco</label>
              <input
                type="text"
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cidade">Cidade</label>
              <input
                type="text"
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <input
                type="text"
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                maxLength={2}
                placeholder="UF"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={resetForm}>
              <FiX /> Cancelar
            </button>
            <button type="submit" className="btn-primary">
              <FiSave /> Salvar
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Endereco</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {locais.length > 0 ? (
              locais.map(local => (
                <tr key={local.id}>
                  <td>{local.nome}</td>
                  <td>{local.endereco || '-'}</td>
                  <td>{local.cidade || '-'}</td>
                  <td>{local.estado || '-'}</td>
                  <td className="actions">
                    <button className="btn-icon edit" onClick={() => handleEdit(local)}>
                      <FiEdit2 />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(local.id, local.nome)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty">Nenhum local cadastrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .inline-form {
          margin-bottom: 25px;
        }
        .inline-form h3 {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default Locais;

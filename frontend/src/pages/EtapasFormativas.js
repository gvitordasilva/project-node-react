import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { etapaFormativaService } from '../services/api';
import './Common.css';

const EtapasFormativas = () => {
  const [etapas, setEtapas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    ordem: 0
  });

  useEffect(() => {
    loadEtapas();
  }, []);

  const loadEtapas = async () => {
    try {
      const response = await etapaFormativaService.getAll();
      setEtapas(response.data);
    } catch (error) {
      toast.error('Erro ao carregar etapas formativas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await etapaFormativaService.update(editingId, formData);
        toast.success('Etapa formativa atualizada com sucesso');
      } else {
        await etapaFormativaService.create(formData);
        toast.success('Etapa formativa criada com sucesso');
      }
      resetForm();
      loadEtapas();
    } catch (error) {
      toast.error('Erro ao salvar etapa formativa');
    }
  };

  const handleEdit = (etapa) => {
    setFormData({
      nome: etapa.nome,
      descricao: etapa.descricao || '',
      ordem: etapa.ordem || 0
    });
    setEditingId(etapa.id);
    setShowForm(true);
  };

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Deseja realmente excluir a etapa "${nome}"?`)) {
      try {
        await etapaFormativaService.delete(id);
        toast.success('Etapa formativa excluida com sucesso');
        loadEtapas();
      } catch (error) {
        toast.error('Erro ao excluir etapa formativa');
      }
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', descricao: '', ordem: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Etapas Formativas</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <FiPlus /> Nova Etapa
        </button>
      </div>

      {showForm && (
        <form className="form-card inline-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Editar Etapa Formativa' : 'Nova Etapa Formativa'}</h3>
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
              <label htmlFor="ordem">Ordem</label>
              <input
                type="number"
                id="ordem"
                value={formData.ordem}
                onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                min="0"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="descricao">Descricao</label>
            <textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descreva esta etapa formativa..."
            />
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
              <th>Ordem</th>
              <th>Nome</th>
              <th>Descricao</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {etapas.length > 0 ? (
              etapas.map(etapa => (
                <tr key={etapa.id}>
                  <td>{etapa.ordem}</td>
                  <td>{etapa.nome}</td>
                  <td>{etapa.descricao || '-'}</td>
                  <td className="actions">
                    <button className="btn-icon edit" onClick={() => handleEdit(etapa)}>
                      <FiEdit2 />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(etapa.id, etapa.nome)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty">Nenhuma etapa formativa cadastrada</td>
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

export default EtapasFormativas;

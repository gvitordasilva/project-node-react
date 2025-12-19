import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { funcaoService } from '../services/api';
import './Common.css';

const Funcoes = () => {
  const [funcoes, setFuncoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nome: '', descricao: '' });

  useEffect(() => {
    loadFuncoes();
  }, []);

  const loadFuncoes = async () => {
    try {
      const response = await funcaoService.getAll();
      setFuncoes(response.data);
    } catch (error) {
      toast.error('Erro ao carregar funcoes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await funcaoService.update(editingId, formData);
        toast.success('Funcao atualizada com sucesso');
      } else {
        await funcaoService.create(formData);
        toast.success('Funcao criada com sucesso');
      }
      resetForm();
      loadFuncoes();
    } catch (error) {
      toast.error('Erro ao salvar funcao');
    }
  };

  const handleEdit = (funcao) => {
    setFormData({ nome: funcao.nome, descricao: funcao.descricao || '' });
    setEditingId(funcao.id);
    setShowForm(true);
  };

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Deseja realmente excluir a funcao "${nome}"?`)) {
      try {
        await funcaoService.delete(id);
        toast.success('Funcao excluida com sucesso');
        loadFuncoes();
      } catch (error) {
        toast.error('Erro ao excluir funcao');
      }
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', descricao: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Funcoes</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <FiPlus /> Nova Funcao
        </button>
      </div>

      {showForm && (
        <form className="form-card inline-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Editar Funcao' : 'Nova Funcao'}</h3>
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
              <label htmlFor="descricao">Descricao</label>
              <input
                type="text"
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
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
              <th>Descricao</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {funcoes.length > 0 ? (
              funcoes.map(funcao => (
                <tr key={funcao.id}>
                  <td>{funcao.nome}</td>
                  <td>{funcao.descricao || '-'}</td>
                  <td className="actions">
                    <button className="btn-icon edit" onClick={() => handleEdit(funcao)}>
                      <FiEdit2 />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(funcao.id, funcao.nome)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="empty">Nenhuma funcao cadastrada</td>
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

export default Funcoes;

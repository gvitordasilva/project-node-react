import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiMessageSquare, FiEye } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { acompanhamentoService, userService } from '../services/api';
import './Common.css';

const Acompanhamentos = () => {
  const { user, isFormador } = useAuth();
  const [acompanhamentos, setAcompanhamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formandoFilter, setFormandoFilter] = useState('');
  const [formandos, setFormandos] = useState([]);
  const [selectedAcomp, setSelectedAcomp] = useState(null);

  useEffect(() => {
    loadFormandos();
    loadAcompanhamentos();
  }, []);

  const loadFormandos = async () => {
    try {
      const response = await userService.getFormandos();
      setFormandos(response.data);
    } catch (error) {
      console.error('Erro ao carregar formandos:', error);
    }
  };

  const loadAcompanhamentos = async () => {
    try {
      const params = {};
      if (formandoFilter) params.formandoId = formandoFilter;

      const response = await acompanhamentoService.getAll(params);
      setAcompanhamentos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar acompanhamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAcompanhamentos();
  }, [formandoFilter]);

  const handleDelete = async (id, titulo) => {
    if (window.confirm(`Deseja realmente excluir o acompanhamento "${titulo}"?`)) {
      try {
        await acompanhamentoService.delete(id);
        toast.success('Acompanhamento excluido com sucesso');
        loadAcompanhamentos();
      } catch (error) {
        toast.error('Erro ao excluir acompanhamento');
      }
    }
  };

  const canEdit = (acomp) => {
    return user.role === 'admin' || acomp.formadorId === user.id;
  };

  const filteredAcompanhamentos = acompanhamentos.filter(acomp =>
    acomp.titulo.toLowerCase().includes(search.toLowerCase()) ||
    acomp.conteudo.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Acompanhamentos</h2>
        {isFormador() && (
          <Link to="/acompanhamentos/new" className="btn-primary">
            <FiPlus /> Novo Acompanhamento
          </Link>
        )}
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Buscar acompanhamentos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isFormador() && (
          <select
            value={formandoFilter}
            onChange={(e) => setFormandoFilter(e.target.value)}
          >
            <option value="">Todos os formandos</option>
            {formandos.map(f => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
        )}
      </div>

      <div className="card-grid">
        {filteredAcompanhamentos.length > 0 ? (
          filteredAcompanhamentos.map(acomp => (
            <div key={acomp.id} className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <FiMessageSquare style={{ marginRight: 8 }} />
                    {acomp.titulo}
                  </h3>
                  <span className="card-subtitle">
                    {new Date(acomp.dataAcompanhamento).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="acomp-preview">
                  {acomp.conteudo.length > 150
                    ? acomp.conteudo.substring(0, 150) + '...'
                    : acomp.conteudo}
                </p>
                <div className="acomp-participants">
                  <p><strong>Formador:</strong> {acomp.formador?.nome}</p>
                  <p><strong>Formando:</strong> {acomp.formando?.nome}</p>
                </div>
              </div>
              <div className="card-footer">
                <span className="card-meta">
                  Criado em {new Date(acomp.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <div className="actions">
                  <button
                    className="btn-icon download"
                    onClick={() => setSelectedAcomp(acomp)}
                    title="Ver detalhes"
                  >
                    <FiEye />
                  </button>
                  {canEdit(acomp) && (
                    <>
                      <Link to={`/acompanhamentos/${acomp.id}/edit`} className="btn-icon edit" title="Editar">
                        <FiEdit2 />
                      </Link>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(acomp.id, acomp.titulo)}
                        title="Excluir"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <FiMessageSquare size={48} />
            <p>Nenhum acompanhamento encontrado</p>
          </div>
        )}
      </div>

      {selectedAcomp && (
        <div className="modal-overlay" onClick={() => setSelectedAcomp(null)}>
          <div className="modal-content acomp-modal" onClick={e => e.stopPropagation()}>
            <h3>{selectedAcomp.titulo}</h3>
            <div className="acomp-meta">
              <span>Data: {new Date(selectedAcomp.dataAcompanhamento).toLocaleDateString('pt-BR')}</span>
              <span>Formador: {selectedAcomp.formador?.nome}</span>
              <span>Formando: {selectedAcomp.formando?.nome}</span>
            </div>
            <div className="acomp-content">
              <h4>Conteudo</h4>
              <p>{selectedAcomp.conteudo}</p>
            </div>
            {selectedAcomp.observacoes && (
              <div className="acomp-obs">
                <h4>Observacoes</h4>
                <p>{selectedAcomp.observacoes}</p>
              </div>
            )}
            <button className="btn-secondary" onClick={() => setSelectedAcomp(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      <style>{`
        .acomp-preview {
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .acomp-participants {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
          font-size: 0.9rem;
        }
        .acomp-participants p {
          margin: 4px 0;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        .modal-content.acomp-modal {
          background: white;
          padding: 30px;
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }
        .acomp-modal h3 {
          margin-bottom: 15px;
          color: var(--text-primary);
        }
        .acomp-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }
        .acomp-content, .acomp-obs {
          margin-bottom: 20px;
        }
        .acomp-content h4, .acomp-obs h4 {
          margin-bottom: 10px;
          color: var(--text-primary);
          font-size: 1rem;
        }
        .acomp-content p, .acomp-obs p {
          color: var(--text-secondary);
          white-space: pre-wrap;
          line-height: 1.6;
        }
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px;
          color: var(--text-secondary);
        }
        .empty-state svg {
          margin-bottom: 15px;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default Acompanhamentos;

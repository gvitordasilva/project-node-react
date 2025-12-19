import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiSearch, FiFileText } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { documentService, etapaFormativaService, localService, userService } from '../services/api';
import './Common.css';

const Documents = () => {
  const { isFormador } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    etapaFormativaId: '',
    localId: '',
    pessoaId: ''
  });
  const [etapas, setEtapas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [pessoas, setPessoas] = useState([]);

  useEffect(() => {
    loadFilters();
    loadDocuments();
  }, []);

  const loadFilters = async () => {
    try {
      const [etapasRes, locaisRes, pessoasRes] = await Promise.all([
        etapaFormativaService.getAll(),
        localService.getAll(),
        userService.getAll()
      ]);
      setEtapas(etapasRes.data);
      setLocais(locaisRes.data);
      setPessoas(pessoasRes.data);
    } catch (error) {
      console.error('Erro ao carregar filtros:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const params = {};
      if (filters.etapaFormativaId) params.etapaFormativaId = filters.etapaFormativaId;
      if (filters.localId) params.localId = filters.localId;
      if (filters.pessoaId) params.pessoaId = filters.pessoaId;

      const response = await documentService.getAll(params);
      setDocuments(response.data);
    } catch (error) {
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [filters]);

  const handleDelete = async (id, titulo) => {
    if (window.confirm(`Deseja realmente excluir o documento "${titulo}"?`)) {
      try {
        await documentService.delete(id);
        toast.success('Documento excluido com sucesso');
        loadDocuments();
      } catch (error) {
        toast.error('Erro ao excluir documento');
      }
    }
  };

  const handleDownload = async (id, titulo) => {
    try {
      const response = await documentService.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', titulo);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Erro ao baixar documento');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.titulo.toLowerCase().includes(search.toLowerCase()) ||
    doc.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Documentos</h2>
        {isFormador() && (
          <Link to="/documents/new" className="btn-primary">
            <FiPlus /> Novo Documento
          </Link>
        )}
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={filters.etapaFormativaId}
          onChange={(e) => setFilters(prev => ({ ...prev, etapaFormativaId: e.target.value }))}
        >
          <option value="">Todas as etapas</option>
          {etapas.map(e => (
            <option key={e.id} value={e.id}>{e.nome}</option>
          ))}
        </select>
        <select
          value={filters.localId}
          onChange={(e) => setFilters(prev => ({ ...prev, localId: e.target.value }))}
        >
          <option value="">Todos os locais</option>
          {locais.map(l => (
            <option key={l.id} value={l.id}>{l.nome}</option>
          ))}
        </select>
        <select
          value={filters.pessoaId}
          onChange={(e) => setFilters(prev => ({ ...prev, pessoaId: e.target.value }))}
        >
          <option value="">Todas as pessoas</option>
          {pessoas.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>

      <div className="card-grid">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map(doc => (
            <div key={doc.id} className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <FiFileText style={{ marginRight: 8 }} />
                    {doc.titulo}
                  </h3>
                  <span className="card-subtitle">Por: {doc.autor?.nome}</span>
                </div>
              </div>
              <div className="card-body">
                <p>{doc.descricao || 'Sem descricao'}</p>
                {doc.EtapaFormativa && (
                  <p><strong>Etapa:</strong> {doc.EtapaFormativa.nome}</p>
                )}
                {doc.Local && (
                  <p><strong>Local:</strong> {doc.Local.nome}</p>
                )}
                {doc.pessoa && (
                  <p><strong>Pessoa:</strong> {doc.pessoa.nome}</p>
                )}
              </div>
              <div className="card-footer">
                <span className="card-meta">
                  {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <div className="actions">
                  <button
                    className="btn-icon download"
                    onClick={() => handleDownload(doc.id, doc.titulo)}
                    title="Download"
                  >
                    <FiDownload />
                  </button>
                  {isFormador() && (
                    <>
                      <Link to={`/documents/${doc.id}/edit`} className="btn-icon edit" title="Editar">
                        <FiEdit2 />
                      </Link>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(doc.id, doc.titulo)}
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
            <FiFileText size={48} />
            <p>Nenhum documento encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;

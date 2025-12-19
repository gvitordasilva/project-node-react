import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSave, FiArrowLeft, FiUpload } from 'react-icons/fi';
import { documentService, etapaFormativaService, localService, userService } from '../services/api';
import './Common.css';

const DocumentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    etapaFormativaId: '',
    localId: '',
    pessoaId: ''
  });

  const [arquivo, setArquivo] = useState(null);
  const [etapas, setEtapas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOptions();
    if (isEditing) {
      loadDocument();
    }
  }, [id]);

  const loadOptions = async () => {
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
      toast.error('Erro ao carregar opcoes');
    }
  };

  const loadDocument = async () => {
    try {
      const response = await documentService.getById(id);
      const doc = response.data;
      setFormData({
        titulo: doc.titulo,
        descricao: doc.descricao || '',
        etapaFormativaId: doc.etapaFormativaId || '',
        localId: doc.localId || '',
        pessoaId: doc.pessoaId || ''
      });
    } catch (error) {
      toast.error('Erro ao carregar documento');
      navigate('/documents');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setArquivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing && !arquivo) {
      toast.error('Selecione um arquivo');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('titulo', formData.titulo);
      data.append('descricao', formData.descricao);
      if (formData.etapaFormativaId) data.append('etapaFormativaId', formData.etapaFormativaId);
      if (formData.localId) data.append('localId', formData.localId);
      if (formData.pessoaId) data.append('pessoaId', formData.pessoaId);
      if (arquivo) data.append('arquivo', arquivo);

      if (isEditing) {
        await documentService.update(id, data);
        toast.success('Documento atualizado com sucesso');
      } else {
        await documentService.create(data);
        toast.success('Documento criado com sucesso');
      }

      navigate('/documents');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar documento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/documents')}>
          <FiArrowLeft /> Voltar
        </button>
        <h2>{isEditing ? 'Editar Documento' : 'Novo Documento'}</h2>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="titulo">Titulo *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descricao</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descreva o documento..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="etapaFormativaId">Etapa Formativa</label>
            <select
              id="etapaFormativaId"
              name="etapaFormativaId"
              value={formData.etapaFormativaId}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              {etapas.map(e => (
                <option key={e.id} value={e.id}>{e.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="localId">Local</label>
            <select
              id="localId"
              name="localId"
              value={formData.localId}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              {locais.map(l => (
                <option key={l.id} value={l.id}>{l.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="pessoaId">Pessoa</label>
            <select
              id="pessoaId"
              name="pessoaId"
              value={formData.pessoaId}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              {pessoas.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Arquivo {!isEditing && '*'}</label>
          <div className="file-input-wrapper">
            <div className="file-input-label">
              <FiUpload size={24} />
              <span>{arquivo ? arquivo.name : 'Clique para selecionar um arquivo'}</span>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
            />
          </div>
          {arquivo && (
            <div className="file-preview">
              Arquivo selecionado: {arquivo.name} ({(arquivo.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/documents')}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            <FiSave /> {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;

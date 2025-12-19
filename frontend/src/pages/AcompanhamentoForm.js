import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { acompanhamentoService, userService } from '../services/api';
import './Common.css';

const AcompanhamentoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    dataAcompanhamento: new Date().toISOString().split('T')[0],
    observacoes: '',
    formandoId: ''
  });

  const [formandos, setFormandos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFormandos();
    if (isEditing) {
      loadAcompanhamento();
    }
  }, [id]);

  const loadFormandos = async () => {
    try {
      const response = await userService.getFormandos();
      setFormandos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar formandos');
    }
  };

  const loadAcompanhamento = async () => {
    try {
      const response = await acompanhamentoService.getById(id);
      const acomp = response.data;
      setFormData({
        titulo: acomp.titulo,
        conteudo: acomp.conteudo,
        dataAcompanhamento: acomp.dataAcompanhamento,
        observacoes: acomp.observacoes || '',
        formandoId: acomp.formandoId
      });
    } catch (error) {
      toast.error('Erro ao carregar acompanhamento');
      navigate('/acompanhamentos');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await acompanhamentoService.update(id, formData);
        toast.success('Acompanhamento atualizado com sucesso');
      } else {
        await acompanhamentoService.create(formData);
        toast.success('Acompanhamento criado com sucesso');
      }

      navigate('/acompanhamentos');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar acompanhamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/acompanhamentos')}>
          <FiArrowLeft /> Voltar
        </button>
        <h2>{isEditing ? 'Editar Acompanhamento' : 'Novo Acompanhamento'}</h2>
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
              placeholder="Ex: Acompanhamento mensal"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataAcompanhamento">Data *</label>
            <input
              type="date"
              id="dataAcompanhamento"
              name="dataAcompanhamento"
              value={formData.dataAcompanhamento}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="formandoId">Formando *</label>
          <select
            id="formandoId"
            name="formandoId"
            value={formData.formandoId}
            onChange={handleChange}
            required
            disabled={isEditing}
          >
            <option value="">Selecione o formando...</option>
            {formandos.map(f => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
          {isEditing && (
            <small style={{ color: 'var(--text-secondary)', marginTop: 5 }}>
              O formando nao pode ser alterado apos a criacao.
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="conteudo">Conteudo do Acompanhamento *</label>
          <textarea
            id="conteudo"
            name="conteudo"
            value={formData.conteudo}
            onChange={handleChange}
            placeholder="Descreva os pontos discutidos, progresso, desafios..."
            required
            style={{ minHeight: '200px' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="observacoes">Observacoes</label>
          <textarea
            id="observacoes"
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            placeholder="Observacoes adicionais, proximos passos, lembretes..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/acompanhamentos')}>
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

export default AcompanhamentoForm;

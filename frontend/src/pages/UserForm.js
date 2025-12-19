import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { userService, funcaoService, localService, etapaFormativaService } from '../services/api';
import './Common.css';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'formando',
    formadorId: '',
    funcaoId: '',
    localId: '',
    etapaFormativaId: ''
  });

  const [formadores, setFormadores] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [locais, setLocais] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOptions();
    if (isEditing) {
      loadUser();
    }
  }, [id]);

  const loadOptions = async () => {
    try {
      const [formadoresRes, funcoesRes, locaisRes, etapasRes] = await Promise.all([
        userService.getFormadores(),
        funcaoService.getAll(),
        localService.getAll(),
        etapaFormativaService.getAll()
      ]);

      setFormadores(formadoresRes.data);
      setFuncoes(funcoesRes.data);
      setLocais(locaisRes.data);
      setEtapas(etapasRes.data);
    } catch (error) {
      toast.error('Erro ao carregar opcoes');
    }
  };

  const loadUser = async () => {
    try {
      const response = await userService.getById(id);
      const user = response.data;
      setFormData({
        nome: user.nome,
        email: user.email,
        senha: '',
        role: user.role,
        formadorId: user.formadorId || '',
        funcaoId: user.funcaoId || '',
        localId: user.localId || '',
        etapaFormativaId: user.etapaFormativaId || ''
      });
    } catch (error) {
      toast.error('Erro ao carregar usuario');
      navigate('/users');
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
      const data = { ...formData };

      // Remove senha vazia em edicao
      if (isEditing && !data.senha) {
        delete data.senha;
      }

      // Converte strings vazias para null
      ['formadorId', 'funcaoId', 'localId', 'etapaFormativaId'].forEach(field => {
        if (data[field] === '') data[field] = null;
      });

      if (isEditing) {
        await userService.update(id, data);
        toast.success('Usuario atualizado com sucesso');
      } else {
        await userService.create(data);
        toast.success('Usuario criado com sucesso');
      }

      navigate('/users');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/users')}>
          <FiArrowLeft /> Voltar
        </button>
        <h2>{isEditing ? 'Editar Usuario' : 'Novo Usuario'}</h2>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="senha">
              {isEditing ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required={!isEditing}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Perfil *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="formando">Formando</option>
              <option value="formador">Formador</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="formadorId">Formador</label>
            <select
              id="formadorId"
              name="formadorId"
              value={formData.formadorId}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              {formadores.map(f => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="funcaoId">Funcao</label>
            <select
              id="funcaoId"
              name="funcaoId"
              value={formData.funcaoId}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              {funcoes.map(f => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
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
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/users')}>
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

export default UserForm;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiVideo, FiPlay } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { videoService, etapaFormativaService, localService, userService } from '../services/api';
import './Common.css';

const Videos = () => {
  const { isFormador } = useAuth();
  const [videos, setVideos] = useState([]);
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
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    loadFilters();
    loadVideos();
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

  const loadVideos = async () => {
    try {
      const params = {};
      if (filters.etapaFormativaId) params.etapaFormativaId = filters.etapaFormativaId;
      if (filters.localId) params.localId = filters.localId;
      if (filters.pessoaId) params.pessoaId = filters.pessoaId;

      const response = await videoService.getAll(params);
      setVideos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [filters]);

  const handleDelete = async (id, titulo) => {
    if (window.confirm(`Deseja realmente excluir o video "${titulo}"?`)) {
      try {
        await videoService.delete(id);
        toast.success('Video excluido com sucesso');
        loadVideos();
      } catch (error) {
        toast.error('Erro ao excluir video');
      }
    }
  };

  const filteredVideos = videos.filter(video =>
    video.titulo.toLowerCase().includes(search.toLowerCase()) ||
    video.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Videos Formativos</h2>
        {isFormador() && (
          <Link to="/videos/new" className="btn-primary">
            <FiPlus /> Novo Video
          </Link>
        )}
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Buscar videos..."
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
        {filteredVideos.length > 0 ? (
          filteredVideos.map(video => (
            <div key={video.id} className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <FiVideo style={{ marginRight: 8 }} />
                    {video.titulo}
                  </h3>
                  <span className="card-subtitle">Por: {video.autor?.nome}</span>
                </div>
              </div>
              <div className="card-body">
                <p>{video.descricao || 'Sem descricao'}</p>
                {video.duracao && <p><strong>Duracao:</strong> {video.duracao}</p>}
                {video.EtapaFormativa && (
                  <p><strong>Etapa:</strong> {video.EtapaFormativa.nome}</p>
                )}
                {video.Local && (
                  <p><strong>Local:</strong> {video.Local.nome}</p>
                )}
                {video.pessoa && (
                  <p><strong>Pessoa:</strong> {video.pessoa.nome}</p>
                )}
              </div>
              <div className="card-footer">
                <span className="card-meta">
                  {new Date(video.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <div className="actions">
                  {(video.url || video.arquivo) && (
                    <button
                      className="btn-icon download"
                      onClick={() => setSelectedVideo(video)}
                      title="Assistir"
                    >
                      <FiPlay />
                    </button>
                  )}
                  {isFormador() && (
                    <>
                      <Link to={`/videos/${video.id}/edit`} className="btn-icon edit" title="Editar">
                        <FiEdit2 />
                      </Link>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(video.id, video.titulo)}
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
            <FiVideo size={48} />
            <p>Nenhum video encontrado</p>
          </div>
        )}
      </div>

      {selectedVideo && (
        <div className="modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{selectedVideo.titulo}</h3>
            {selectedVideo.url ? (
              <div className="video-wrapper">
                <iframe
                  src={selectedVideo.url.replace('watch?v=', 'embed/')}
                  title={selectedVideo.titulo}
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            ) : selectedVideo.arquivo ? (
              <video controls>
                <source src={`/api/videos/${selectedVideo.id}/stream`} type="video/mp4" />
                Seu navegador nao suporta videos.
              </video>
            ) : null}
            <button className="btn-secondary" onClick={() => setSelectedVideo(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      <style>{`
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
        }
        .modal-content {
          background: white;
          padding: 25px;
          border-radius: 12px;
          max-width: 800px;
          width: 90%;
        }
        .modal-content h3 {
          margin-bottom: 20px;
        }
        .modal-content video,
        .video-wrapper iframe {
          width: 100%;
          height: 400px;
          border-radius: 8px;
        }
        .modal-content button {
          margin-top: 20px;
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

export default Videos;

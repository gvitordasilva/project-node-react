import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiFileText, FiVideo, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { userService, documentService, videoService, acompanhamentoService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAdmin, isFormador } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    documents: 0,
    videos: 0,
    acompanhamentos: 0
  });
  const [recentAcompanhamentos, setRecentAcompanhamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [usersRes, docsRes, videosRes, acompRes] = await Promise.all([
        isAdmin() ? userService.getAll() : Promise.resolve({ data: [] }),
        documentService.getAll(),
        videoService.getAll(),
        acompanhamentoService.getAll()
      ]);

      setStats({
        users: usersRes.data.length,
        documents: docsRes.data.length,
        videos: videosRes.data.length,
        acompanhamentos: acompRes.data.length
      });

      setRecentAcompanhamentos(acompRes.data.slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard">
      <div className="welcome-card">
        <h2>Bem-vindo, {user?.nome}!</h2>
        <p>Voce esta logado como <strong>{user?.role}</strong></p>
        {user?.formador && (
          <p>Seu formador: <strong>{user.formador.nome}</strong></p>
        )}
      </div>

      <div className="stats-grid">
        {isAdmin() && (
          <Link to="/users" className="stat-card">
            <div className="stat-icon users">
              <FiUsers />
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats.users}</span>
              <span className="stat-label">Usuarios</span>
            </div>
          </Link>
        )}

        <Link to="/documents" className="stat-card">
          <div className="stat-icon documents">
            <FiFileText />
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.documents}</span>
            <span className="stat-label">Documentos</span>
          </div>
        </Link>

        <Link to="/videos" className="stat-card">
          <div className="stat-icon videos">
            <FiVideo />
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.videos}</span>
            <span className="stat-label">Videos</span>
          </div>
        </Link>

        <Link to="/acompanhamentos" className="stat-card">
          <div className="stat-icon acompanhamentos">
            <FiMessageSquare />
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.acompanhamentos}</span>
            <span className="stat-label">Acompanhamentos</span>
          </div>
        </Link>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Acompanhamentos Recentes</h3>
          <Link to="/acompanhamentos" className="view-all">Ver todos</Link>
        </div>

        {recentAcompanhamentos.length > 0 ? (
          <div className="recent-list">
            {recentAcompanhamentos.map(acomp => (
              <div key={acomp.id} className="recent-item">
                <div className="recent-info">
                  <h4>{acomp.titulo}</h4>
                  <p>
                    <span>Formador: {acomp.formador?.nome}</span>
                    <span>Formando: {acomp.formando?.nome}</span>
                  </p>
                </div>
                <span className="recent-date">
                  {new Date(acomp.dataAcompanhamento).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">Nenhum acompanhamento encontrado.</p>
        )}
      </div>

      {isFormador() && (
        <div className="quick-actions">
          <h3>Acoes Rapidas</h3>
          <div className="actions-grid">
            <Link to="/documents/new" className="action-btn">
              <FiFileText /> Novo Documento
            </Link>
            <Link to="/videos/new" className="action-btn">
              <FiVideo /> Novo Video
            </Link>
            <Link to="/acompanhamentos/new" className="action-btn">
              <FiMessageSquare /> Novo Acompanhamento
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiMapPin, FiLayers, FiSave } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import './Common.css';

const Profile = () => {
  const { user } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      toast.error('As senhas nao coincidem');
      return;
    }

    if (passwordData.novaSenha.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword({
        senhaAtual: passwordData.senhaAtual,
        novaSenha: passwordData.novaSenha
      });

      toast.success('Senha alterada com sucesso');
      setPasswordData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Meu Perfil</h2>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <FiUser size={48} />
            </div>
            <div className="profile-info">
              <h3>{user?.nome}</h3>
              <span className={`badge badge-${user?.role}`}>{user?.role}</span>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <FiMail />
              <div>
                <label>Email</label>
                <span>{user?.email}</span>
              </div>
            </div>

            {user?.Funcao && (
              <div className="detail-item">
                <FiUser />
                <div>
                  <label>Funcao</label>
                  <span>{user.Funcao.nome}</span>
                </div>
              </div>
            )}

            {user?.Local && (
              <div className="detail-item">
                <FiMapPin />
                <div>
                  <label>Local</label>
                  <span>{user.Local.nome}</span>
                </div>
              </div>
            )}

            {user?.EtapaFormativa && (
              <div className="detail-item">
                <FiLayers />
                <div>
                  <label>Etapa Formativa</label>
                  <span>{user.EtapaFormativa.nome}</span>
                </div>
              </div>
            )}

            {user?.formador && (
              <div className="detail-item">
                <FiUser />
                <div>
                  <label>Formador</label>
                  <span>{user.formador.nome}</span>
                </div>
              </div>
            )}
          </div>

          <div className="profile-actions">
            <button
              className="btn-secondary"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? 'Cancelar' : 'Alterar Senha'}
            </button>
          </div>

          {showPasswordForm && (
            <form className="password-form" onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label htmlFor="senhaAtual">Senha Atual</label>
                <input
                  type="password"
                  id="senhaAtual"
                  value={passwordData.senhaAtual}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, senhaAtual: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="novaSenha">Nova Senha</label>
                <input
                  type="password"
                  id="novaSenha"
                  value={passwordData.novaSenha}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, novaSenha: e.target.value }))}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
                <input
                  type="password"
                  id="confirmarSenha"
                  value={passwordData.confirmarSenha}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                <FiSave /> {loading ? 'Salvando...' : 'Salvar Nova Senha'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .profile-grid {
          max-width: 600px;
        }
        .profile-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: var(--shadow);
        }
        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 20px;
        }
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }
        .profile-info h3 {
          font-size: 1.3rem;
          margin-bottom: 8px;
        }
        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .detail-item svg {
          color: var(--text-secondary);
        }
        .detail-item label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 2px;
        }
        .detail-item span {
          color: var(--text-primary);
        }
        .profile-actions {
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }
        .password-form {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }
        .password-form .form-group {
          margin-bottom: 15px;
        }
        .password-form button {
          width: 100%;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { userService } from '../services/api';
import './Common.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (error) {
      toast.error('Erro ao carregar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Deseja realmente desativar o usuario "${nome}"?`)) {
      try {
        await userService.delete(id);
        toast.success('Usuario desativado com sucesso');
        loadUsers();
      } catch (error) {
        toast.error('Erro ao desativar usuario');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.nome.toLowerCase().includes(search.toLowerCase()) ||
                       user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Gerenciamento de Usuarios</h2>
        <Link to="/users/new" className="btn-primary">
          <FiPlus /> Novo Usuario
        </Link>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">Todos os perfis</option>
          <option value="admin">Admin</option>
          <option value="formador">Formador</option>
          <option value="formando">Formando</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Formador</th>
              <th>Local</th>
              <th>Etapa</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.nome}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge badge-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.formador?.nome || '-'}</td>
                  <td>{user.Local?.nome || '-'}</td>
                  <td>{user.EtapaFormativa?.nome || '-'}</td>
                  <td className="actions">
                    <Link to={`/users/${user.id}/edit`} className="btn-icon edit">
                      <FiEdit2 />
                    </Link>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(user.id, user.nome)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty">Nenhum usuario encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;

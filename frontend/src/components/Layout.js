import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FiHome, FiUsers, FiFileText, FiVideo, FiMessageSquare,
  FiSettings, FiMapPin, FiLayers, FiMenu, FiX, FiLogOut, FiUser
} from 'react-icons/fi';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/documents', icon: FiFileText, label: 'Documentos' },
    { path: '/videos', icon: FiVideo, label: 'Videos' },
    { path: '/acompanhamentos', icon: FiMessageSquare, label: 'Acompanhamentos' },
  ];

  const adminMenuItems = [
    { path: '/users', icon: FiUsers, label: 'Usuarios' },
    { path: '/funcoes', icon: FiSettings, label: 'Funcoes' },
    { path: '/locais', icon: FiMapPin, label: 'Locais' },
    { path: '/etapas-formativas', icon: FiLayers, label: 'Etapas Formativas' },
  ];

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Sistema Formativo</h2>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}

            {isAdmin() && (
              <>
                <li className="menu-divider">Administracao</li>
                {adminMenuItems.map(item => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={location.pathname === item.path ? 'active' : ''}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <Link to="/profile" className="user-info" onClick={() => setSidebarOpen(false)}>
            <FiUser />
            <div>
              <span className="user-name">{user?.nome}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <h1>Sistema de Gerenciamento Formativo</h1>
        </header>

        <div className="content">
          {children}
        </div>
      </main>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default Layout;

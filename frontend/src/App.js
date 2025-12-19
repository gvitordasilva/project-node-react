import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserForm from './pages/UserForm';
import Documents from './pages/Documents';
import DocumentForm from './pages/DocumentForm';
import Videos from './pages/Videos';
import VideoForm from './pages/VideoForm';
import Acompanhamentos from './pages/Acompanhamentos';
import AcompanhamentoForm from './pages/AcompanhamentoForm';
import Funcoes from './pages/Funcoes';
import Locais from './pages/Locais';
import EtapasFormativas from './pages/EtapasFormativas';
import Profile from './pages/Profile';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return <Layout>{children}</Layout>;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />

          <Route path="/users" element={
            <PrivateRoute adminOnly><Users /></PrivateRoute>
          } />
          <Route path="/users/new" element={
            <PrivateRoute adminOnly><UserForm /></PrivateRoute>
          } />
          <Route path="/users/:id/edit" element={
            <PrivateRoute adminOnly><UserForm /></PrivateRoute>
          } />

          <Route path="/documents" element={
            <PrivateRoute><Documents /></PrivateRoute>
          } />
          <Route path="/documents/new" element={
            <PrivateRoute><DocumentForm /></PrivateRoute>
          } />
          <Route path="/documents/:id/edit" element={
            <PrivateRoute><DocumentForm /></PrivateRoute>
          } />

          <Route path="/videos" element={
            <PrivateRoute><Videos /></PrivateRoute>
          } />
          <Route path="/videos/new" element={
            <PrivateRoute><VideoForm /></PrivateRoute>
          } />
          <Route path="/videos/:id/edit" element={
            <PrivateRoute><VideoForm /></PrivateRoute>
          } />

          <Route path="/acompanhamentos" element={
            <PrivateRoute><Acompanhamentos /></PrivateRoute>
          } />
          <Route path="/acompanhamentos/new" element={
            <PrivateRoute><AcompanhamentoForm /></PrivateRoute>
          } />
          <Route path="/acompanhamentos/:id/edit" element={
            <PrivateRoute><AcompanhamentoForm /></PrivateRoute>
          } />

          <Route path="/funcoes" element={
            <PrivateRoute adminOnly><Funcoes /></PrivateRoute>
          } />
          <Route path="/locais" element={
            <PrivateRoute adminOnly><Locais /></PrivateRoute>
          } />
          <Route path="/etapas-formativas" element={
            <PrivateRoute adminOnly><EtapasFormativas /></PrivateRoute>
          } />

          <Route path="/profile" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
};

export default App;

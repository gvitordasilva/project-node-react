require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const funcaoRoutes = require('./routes/funcoes');
const localRoutes = require('./routes/locais');
const etapaFormativaRoutes = require('./routes/etapasFormativas');
const documentRoutes = require('./routes/documents');
const videoRoutes = require('./routes/videos');
const acompanhamentoRoutes = require('./routes/acompanhamentos');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/funcoes', funcaoRoutes);
app.use('/api/locais', localRoutes);
app.use('/api/etapas-formativas', etapaFormativaRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/acompanhamentos', acompanhamentoRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sistema Formativo API funcionando!' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 5000;

// Sincronizar banco e iniciar servidor
sequelize.sync({ alter: true }).then(() => {
  console.log('Banco de dados sincronizado.');
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao sincronizar banco de dados:', err);
});

const jwt = require('jsonwebtoken');
const { User, Funcao, Local, EtapaFormativa } = require('../models');

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        { model: Funcao },
        { model: Local },
        { model: EtapaFormativa },
        { model: User, as: 'formador', attributes: ['id', 'nome', 'email'] }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    if (!user.ativo) {
      return res.status(401).json({ error: 'Usuário inativo.' });
    }

    const senhaValida = await user.validarSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        funcao: user.Funcao,
        local: user.Local,
        etapaFormativa: user.EtapaFormativa,
        formador: user.formador
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['senha'] },
      include: [
        { model: Funcao },
        { model: Local },
        { model: EtapaFormativa },
        { model: User, as: 'formador', attributes: ['id', 'nome', 'email'] }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const user = await User.findByPk(req.userId);

    const senhaValida = await user.validarSenha(senhaAtual);
    if (!senhaValida) {
      return res.status(400).json({ error: 'Senha atual incorreta.' });
    }

    user.senha = novaSenha;
    await user.save();

    res.json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { login, me, changePassword };

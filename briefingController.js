// controllers/briefingController.js — lógica de negócio

const db           = require('./db');
const { sendBriefingEmails } = require('../services/emailService');

/** Valida campos obrigatórios */
function validate(data) {
  const errors = [];
  if (!data.nome?.trim())     errors.push('nome é obrigatório');
  if (!data.telefone?.trim()) errors.push('telefone é obrigatório');
  if (!data.email?.trim())    errors.push('e-mail é obrigatório');
  if (!data.endereco?.trim()) errors.push('endereço é obrigatório');

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRe.test(data.email)) errors.push('e-mail inválido');

  return errors;
}

/** POST /api/briefing */
exports.create = (req, res) => {
  const data   = req.body;
  const errors = validate(data);

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, message: errors.join('; ') });
  }

  const entry = {
    id:        Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...data,
  };

  db.insert(entry);

  console.log(`[${new Date().toLocaleString('pt-BR')}] Novo briefing — ${entry.nome} (${entry.email})`);

  // Dispara e-mails em background (não bloqueia a resposta ao cliente)
  sendBriefingEmails(entry);

  return res.status(201).json({
    ok:      true,
    message: 'Briefing recebido com sucesso!',
    id:      entry.id,
  });
};

/** GET /api/briefings */
exports.list = (req, res) => {
  const all = db.findAll();
  return res.json({ ok: true, total: all.length, briefings: all });
};

/** GET /api/briefings/:id */
exports.getById = (req, res) => {
  const item = db.findById(req.params.id);
  if (!item) return res.status(404).json({ ok: false, message: 'Briefing não encontrado.' });
  return res.json({ ok: true, briefing: item });
};

/** DELETE /api/briefings/:id */
exports.remove = (req, res) => {
  const removed = db.deleteById(req.params.id);
  if (!removed) return res.status(404).json({ ok: false, message: 'Briefing não encontrado.' });
  return res.json({ ok: true, message: 'Briefing removido com sucesso.' });
};

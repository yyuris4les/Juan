// server.js — entry point do backend
// Uso: node server.js

require('dotenv').config(); // carrega variáveis do .env

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const briefingRoutes = require('./routes/briefings');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve o frontend estático
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Rotas da API ─────────────────────────────────────────
app.use('/api', briefingRoutes);

// ── 404 ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, message: 'Rota não encontrada.' });
});

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  const token = process.env.ADMIN_TOKEN || 'studio2025';
  console.log('');
  console.log('  ✦ Studio Briefing — Servidor iniciado');
  console.log(`  → Site:  http://localhost:${PORT}`);
  console.log(`  → API:   http://localhost:${PORT}/api/briefing`);
  console.log(`  → Admin: http://localhost:${PORT}/api/briefings?token=${token}`);
  console.log('');
});

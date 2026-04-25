import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Servir arquivos estáticos do dist/
app.use(express.static(join(__dirname, 'dist')));

// Servir service worker
app.get('/service-worker.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(join(__dirname, 'public/service-worker.js'));
});

// Servir manifest.json
app.get('/manifest.json', (req, res) => {
  res.type('application/json');
  res.sendFile(join(__dirname, 'public/manifest.json'));
});

// Fallback para SPA - serve index.html em todas as rotas
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Guardian CRM rodando em http://localhost:${PORT}`);
  console.log(`   Web:    http://localhost:${PORT}`);
  console.log(`   Mobile: http://localhost:${PORT}/m/`);
});

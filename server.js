import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Servir arquivos estáticos do dist/
app.use(express.static(join(__dirname, 'dist'), {
  maxAge: '1h',
  etag: false
}));

// Servir service worker (pode estar em dist ou public)
app.get('/service-worker.js', (req, res, next) => {
  const paths = [
    join(__dirname, 'dist/service-worker.js'),
    join(__dirname, 'public/service-worker.js')
  ];

  for (const path of paths) {
    try {
      res.type('application/javascript');
      res.sendFile(path);
      return;
    } catch (e) {
      // Tenta o próximo caminho
    }
  }
  next();
});

// Fallback para SPA - serve index.html em todas as rotas que não existem
app.get('*', (req, res) => {
  res.type('text/html');
  res.sendFile(join(__dirname, 'dist/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).send('Erro no servidor');
});

app.listen(PORT, () => {
  console.log(`✅ Guardian CRM rodando em porta ${PORT}`);
  console.log(`   Web:    http://localhost:${PORT}`);
  console.log(`   Mobile: http://localhost:${PORT}/m/`);
});

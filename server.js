import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const distPath = path.join(__dirname, 'dist');

console.log('🚀 Iniciando servidor...');
console.log('📁 Servindo arquivos de:', distPath);

// Servir todos os arquivos estáticos do dist/
app.use(express.static(distPath));

// SPA fallback - qualquer rota que não seja arquivo existente, serve index.html
app.get('*', (req, res) => {
  console.log(`📍 Rota: ${req.path}`);
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      console.error('❌ Erro ao servir index.html:', err);
      res.status(500).send('Erro ao carregar página');
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Guardian CRM rodando em http://0.0.0.0:${PORT}`);
  console.log(`   Acessa: http://localhost:${PORT}`);
  console.log(`   Mobile: http://localhost:${PORT}/m/login`);
});

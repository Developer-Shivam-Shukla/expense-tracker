import express from 'express';
import path from 'path';
import { app as apiApp } from './server/app.js';

const server = express();
const PORT = Number(process.env.PORT) || 3000;

// Mount API app
server.use(apiApp);

// Serve static files from Vite build output
const distPath = path.resolve(process.cwd(), 'dist');
server.use(express.static(distPath));

// SPA fallback for HTML5 History API routing
server.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`VaultFlow server listening on port ${PORT}`);
});

const express = require('express');
const cors = require('cors'); // Importando o pacote CORS
const app = express();
const port = process.env.PORT || 3000;

// Habilitar CORS para todas as rotas
app.use(cors());
app.use(express.json());

// Configurar o Express para servir arquivos estáticos da pasta raiz
// Isso é necessário para que os arquivos MP3 sejam acessíveis
app.use(express.static('.'));

// Importando a lista de músicas do arquivo musicas.js
let musicas = require('./musicas');

// GET - todas as músicas
app.get('/musicas', (req, res) => {
  res.json(musicas);
});

// GET - uma música por ID
app.get('/musicas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const musica = musicas.find(m => m.id === id);
  if (musica) {
    res.json(musica);
  } else {
    res.status(404).json({ mensagem: 'Música não encontrada' });
  }
});

// POST - adicionar música
app.post('/musicas', (req, res) => {
  const novaMusica = {
    id: musicas.length > 0 ? Math.max(...musicas.map(m => m.id)) + 1 : 1,
    titulo: req.body.titulo,
    artista: req.body.artista,
    estilo: req.body.estilo || "",
    url: req.body.url || ""
  };
  musicas.push(novaMusica);
  res.status(201).json(novaMusica);
});

// PUT - editar música
app.put('/musicas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = musicas.findIndex(m => m.id === id);
  if (index !== -1) {
    // Preserva o id original e substitui os outros campos
    musicas[index] = { id, ...req.body };
    res.json(musicas[index]);
  } else {
    res.status(404).json({ mensagem: 'Música não encontrada' });
  }
});

// DELETE - remover música
app.delete('/musicas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  musicas = musicas.filter(m => m.id !== id);
  res.status(204).send();
});

// Rota raiz para verificar se a API está funcionando
app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API de músicas funcionando! Acesse /musicas para ver a lista completa.',
    endpoints: {
      "/musicas": "GET - Lista todas as músicas",
      "/musicas/:id": "GET - Obtém uma música específica por ID",
      "/musicas": "POST - Adiciona uma nova música",
      "/musicas/:id": "PUT - Atualiza uma música existente",
      "/musicas/:id": "DELETE - Remove uma música"
    }
  });
});

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { transliterate } from './translit.js';
import { saveTranslation, getLastN, initDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Транслитерация. По умолчанию НЕ сохраняем в БД.
// Если передан { save: true } — сохраняем.
app.post('/api', async (req, res) => {
  const { data, save } = req.body || {};

  if (typeof data !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Field "data" must be a string'
    });
  }

  const translated = transliterate(data);

  if (save === true) {
    try {
      await saveTranslation(data, translated);
    } catch (e) {
      console.error('DB save error:', e);
    }
  }

  res.json({ status: 'success', data: translated });
});

// Явный эндпоинт сохранения — на всякий случай (например, по кнопке)
app.post('/api/save', async (req, res) => {
  const { input, output } = req.body || {};
  if (typeof input !== 'string' || typeof output !== 'string') {
    return res.status(400).json({ status: 'error' });
  }
  try {
    await saveTranslation(input, output);
    res.json({ status: 'success' });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

app.get('/history', async (req, res) => {
  const n = Math.max(1, Math.min(100, parseInt(req.query.n, 10) || 5));
  try {
    const records = await getLastN(n);
    res.json({ data: records.map(r => r.output) });
  } catch (e) {
    res.status(500).json({ data: [], error: e.message });
  }
});

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) res.status(404).send('Frontend not built. Run: cd frontend && npm run build');
  });
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
});
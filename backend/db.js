import { Level } from 'level';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'translit-db');

const db = new Level(dbPath, { valueEncoding: 'json' });

let counter = 0;
let lastOutput = null;

export async function initDb() {
  try {
    const keys = await db.keys().all();
    if (keys.length > 0) {
      counter = Math.max(...keys.map(k => Number(k))) + 1;
    }
    // запомним последний output, чтобы не писать дубли
    for await (const [, value] of db.iterator({ reverse: true, limit: 1 })) {
      lastOutput = value.output;
    }
  } catch {
    counter = 0;
  }
}

export async function saveTranslation(input, output) {
  // Дедупликация: не пишем то же самое, что уже было последним
  if (output === lastOutput) return null;

  const id = String(counter++).padStart(12, '0');
  await db.put(id, { input, output, ts: Date.now() });
  lastOutput = output;
  return id;
}

export async function getLastN(n) {
  const result = [];
  const iterator = db.iterator({ reverse: true, limit: n });
  for await (const [, value] of iterator) {
    result.push(value);
  }
  return result;
}

export default db;
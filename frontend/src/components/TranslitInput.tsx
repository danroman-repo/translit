import { useState, useEffect, useRef } from 'react';

interface Props {
  onTranslated?: () => void;
}

const TRANSLIT_DEBOUNCE = 200;   // для UI — быстро
const SAVE_DEBOUNCE = 1500;      // для БД — только когда точно закончил

export default function TranslitInput({ onTranslated }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const translitTimer = useRef<number | null>(null);
  const saveTimer = useRef<number | null>(null);

  // Запрос транслитерации (без сохранения) — для UI
  useEffect(() => {
    if (translitTimer.current) window.clearTimeout(translitTimer.current);
    if (saveTimer.current) window.clearTimeout(saveTimer.current);

    if (!input) {
      setOutput('');
      return;
    }

    // быстрый запрос — только транслит, без save
    translitTimer.current = window.setTimeout(() => {
      fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: input })
      })
        .then(res => res.json())
        .then(json => {
          if (json.status === 'success') setOutput(json.data);
        })
        .catch(console.error);
    }, TRANSLIT_DEBOUNCE);

    // медленный запрос — сохраняем в БД только когда пользователь «остановился»
    saveTimer.current = window.setTimeout(() => {
      fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: input, save: true })
      })
        .then(res => res.json())
        .then(json => {
          if (json.status === 'success') {
            setOutput(json.data);
            onTranslated?.();  // обновить историю
          }
        })
        .catch(console.error);
    }, SAVE_DEBOUNCE);

    return () => {
      if (translitTimer.current) window.clearTimeout(translitTimer.current);
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [input, onTranslated]);

  return (
    <div className="fields">
      <div className="field">
        <label>Ввод (кириллица)</label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="вода"
          autoFocus
        />
      </div>
      <div className="field">
        <label>Транслитерация</label>
        <input type="text" value={output} readOnly placeholder="voda" />
      </div>
    </div>
  );
}
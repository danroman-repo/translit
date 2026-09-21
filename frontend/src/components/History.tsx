import { useEffect, useState, useCallback } from 'react';

interface Props {
  refreshKey: number;
}

export default function History({ refreshKey }: Props) {
  const [history, setHistory] = useState<string[]>([]);
  const [n, setN] = useState(5);

  const load = useCallback(() => {
    fetch(`/history?n=${n}`)
      .then(res => res.json())
      .then(json => setHistory(json.data || []))
      .catch(() => setHistory([]));
  }, [n]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return (
    <div className="history">
      <h2>Последние {n} запросов</h2>
      <button className="refresh-btn" onClick={load}>
        Обновить
      </button>
      <ul className="history-list">
        {history.length === 0 && <li style={{ color: '#999' }}>Пока пусто</li>}
        {history.map((item, i) => (
          <li key={i} className="history-item">{item}</li>
        ))}
      </ul>
    </div>
  );
}
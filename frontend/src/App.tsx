import { useState, useCallback } from 'react';
import TranslitInput from './components/TranslitInput';
import History from './components/History';
import './App.css';

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTranslated = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  return (
    <div className="app">
      <h1 className="title">Транслитерация</h1>
      <p className="subtitle">Кириллица → Латиница в реальном времени</p>

      <TranslitInput onTranslated={handleTranslated} />
      <History refreshKey={refreshKey} />
    </div>
  );
}
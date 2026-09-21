# Translit — веб-приложение для транслитерации

<img src="/pic/screenshot-light.png" title="Translit — веб-приложение для транслитерации"> 

## Структура

- `backend/` — Node.js + Express + LevelDB
- `frontend/` — React 18 + TypeScript + Vite

## Функционал

1. Главная страница — два поля: кириллица → латиница в реальном времени.
2. `POST /api` — `{"data":"апишка"}` → `{"status":"success","data":"apishka"}`
3. `GET /history?n=5` — последние N транслитераций из LevelDB.
4. Все запросы сохраняются в LevelDB (`backend/translit-db/`).

## Установка

```bash
# backend
cd backend
npm install

# frontend
cd ../frontend
npm install



---

## 🚀 Пошаговый запуск (Windows / PowerShell)

```powershell
# 1. Перейти в корень проекта
cd C:\Git_online\cases\Frontend_developer\translit

# 2. Переименовать папки
Rename-Item server backend
mkdir frontend
# перенести в frontend всё, что раньше было в корне: src, public,
# index.html, vite.config.ts, tsconfig.json, package.json, package-lock.json, eslint.config.js
# перенести в backend: index.js, translit.js, db.js, package.json

# 3. Установить зависимости backend
cd backend
npm install
# должно появиться backend/node_modules с express, cors, level

# 4. Установить зависимости frontend
cd ..\frontend
npm install

# 5. Запустить backend (в отдельном терминале)
cd ..\backend
npm run dev
# 🚀 Server listening on http://localhost:3001

# 6. Запустить frontend (в ещё одном терминале)
cd ..\frontend
npm run dev
# VITE v5.x ready — http://localhost:5173
```

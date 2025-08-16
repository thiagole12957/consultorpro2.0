import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { ReuniaoRouter } from './components/Reunioes/ReuniaoRouter.tsx';
import './index.css';

console.log('main.tsx: Aplicação iniciando...');
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {console.log('main.tsx: BrowserRouter renderizado')}
      <Routes>
        <Route path="/reuniao/:reuniaoId" element={<ReuniaoRouter />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

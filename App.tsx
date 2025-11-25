
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ComfyUIPage from './pages/ComfyUIPage';
import OllamaPage from './pages/OllamaPage';
import MonitoringPage from './pages/MonitoringPage';
import SystemInfoPage from './pages/SystemInfoPage';
import CliPage from './pages/CliPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="system-info" element={<SystemInfoPage />} />
        <Route path="comfyui" element={<ComfyUIPage />} />
        <Route path="ollama" element={<OllamaPage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="cli" element={<CliPage />} />
      </Route>
    </Routes>
  );
}

export default App;

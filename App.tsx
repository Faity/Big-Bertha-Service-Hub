import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/SettingsPage';

// Placeholder components for routes not fully implemented in this step
const AiServicesPlaceholder = () => (
  <div className="p-8 text-center text-text-secondary border border-dashed border-border rounded-xl">
    <h2 className="text-2xl font-bold text-white mb-2">AI Services Detail View</h2>
    <p>Detailed queue management for ComfyUI and Model Browser for Ollama would go here.</p>
  </div>
);

const HardwarePlaceholder = () => (
    <div className="p-8 text-center text-text-secondary border border-dashed border-border rounded-xl">
    <h2 className="text-2xl font-bold text-white mb-2">Deep Hardware Telemetry</h2>
    <p>Raw Redfish JSON data explorer and detailed fan curves would go here.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="ai-services" element={<AiServicesPlaceholder />} />
        <Route path="hardware" element={<HardwarePlaceholder />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
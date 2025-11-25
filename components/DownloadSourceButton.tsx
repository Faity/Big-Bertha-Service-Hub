
import React from 'react';

const files = [
    {
        name: 'index.tsx',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);`
    },
    {
        name: 'metadata.json',
        content: `{
  "name": "Local Big Bertha Service Hub Ver2",
  "description": "A dashboard for managing local services like ComfyUI, Ollama, and server monitoring on an HPE ML350 Gen10 server. Provides a modern, centralized interface for accessing and managing powerful AI and system tools.",
  "requestFramePermissions": []
}`
    },
    {
        name: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Local Big Bertha Service Hub</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'primary': '#0D1B2A',
              'secondary': '#1B263B',
              'accent-blue': '#415A77',
              'accent-light': '#778DA9',
              'text-main': '#E0E1DD',
              'highlight-cyan': '#00F5D4',
              'highlight-green': '#9AE19D',
            },
            animation: {
              'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
              'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
            },
            keyframes: {
              fadeInUp: {
                '0%': { opacity: '0', transform: 'translateY(20px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
              },
              pulseGlow: {
                '0%, 100%': { boxShadow: '0 0 15px 0px rgba(0, 245, 212, 0.3)' },
                '50%': { boxShadow: '0 0 25px 5px rgba(0, 245, 212, 0.5)' },
              }
            }
          }
        }
      }
    </script>
  <script type="importmap">
{
  "imports": {
    "react/": "https://aistudiocdn.com/react@^19.1.1/",
    "react": "https://aistudiocdn.com/react@^19.1.1",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.1.1/",
    "react-router-dom": "https://aistudiocdn.com/react-router-dom@^7.8.2",
    "recharts": "https://aistudiocdn.com/recharts@^3.1.2"
  }
}
</script>
</head>
  <body class="bg-primary text-text-main">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>`
    },
    {
        name: 'App.tsx',
        content: `import React from 'react';
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

export default App;`
    },
    {
        name: 'components/Layout.tsx',
        content: `import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import ServerOffButton from './ServerOffButton';
import DownloadSourceButton from './DownloadSourceButton';

const CpuChipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M5 12h2a7 7 0 0110 0h2a9 9 0 00-14 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6v6H9z" />
    </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const InformationCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PaintBrushIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const ChatBubbleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const TerminalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
);


const navItems = [
    { path: '/', label: 'Dashboard', icon: <HomeIcon /> },
    { path: '/system-info', label: 'System Info', icon: <InformationCircleIcon /> },
    { path: '/comfyui', label: 'ComfyUI', icon: <PaintBrushIcon /> },
    { path: '/ollama', label: 'Ollama', icon: <ChatBubbleIcon /> },
    { path: '/monitoring', label: 'Monitoring', icon: <ChartBarIcon /> },
    { path: '/cli', label: 'Web CLI', icon: <TerminalIcon /> },
];

const Layout = () => {
    const navLinkClasses = 'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200';
    const inactiveClasses = 'text-accent-light hover:bg-accent-blue hover:text-white';
    const activeClasses = 'bg-highlight-cyan text-primary font-bold shadow-lg';

    return (
        <div className="flex h-screen bg-primary font-sans">
            <aside className="w-64 bg-secondary flex flex-col p-4 border-r border-accent-blue/20">
                <div className="flex items-center space-x-2 p-2 mb-8">
                    <CpuChipIcon />
                    <h1 className="text-xl font-bold text-text-main leading-tight">Big Bertha <br /> Service Hub</h1>
                </div>
                <nav className="flex flex-col space-y-2">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) => \`\${navLinkClasses} \${isActive ? activeClasses : inactiveClasses}\`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="mt-auto text-xs text-accent-light space-y-4">
                    <DownloadSourceButton />
                    <ServerOffButton />
                    <div className="text-center">
                      <p>HPE ML350 Gen10</p>
                      <p>&copy; 2024 Localhost Services</p>
                    </div>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8 bg-primary">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;`
    },
    {
        name: 'pages/HomePage.tsx',
        content: `import React from 'react';
import { Link } from 'react-router-dom';

const PaintBrushIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-highlight-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const ChatBubbleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-highlight-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-highlight-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const InformationCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-highlight-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const ServiceCard = ({ icon, title, description, to }: { icon: React.ReactNode, title: string, description: string, to: string }) => (
    <Link to={to} className="bg-secondary p-8 rounded-xl border border-accent-blue/20 hover:border-highlight-cyan/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-highlight-cyan/10 flex flex-col items-center text-center">
        {icon}
        <h3 className="text-2xl font-bold text-highlight-green mb-2">{title}</h3>
        <p className="text-accent-light">{description}</p>
    </Link>
);

const HomePage = () => {
    return (
        <div className="animate-fade-in-up">
            <div 
                className="relative bg-secondary p-12 rounded-2xl border border-accent-blue/20 mb-12 overflow-hidden"
                style={{
                    backgroundImage: \`
                        radial-gradient(circle at 1px 1px, rgba(119, 141, 169, 0.2) 1px, transparent 0),
                        radial-gradient(circle at top left, rgba(0, 245, 212, 0.1), transparent 40%),
                        radial-gradient(circle at bottom right, rgba(154, 225, 157, 0.1), transparent 40%)
                    \`,
                    backgroundSize: '20px 20px, 100% 100%, 100% 100%'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/30"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-left">
                        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">Local Big Bertha <br /> Service Hub</span>
                        </h1>
                        <p className="text-lg text-accent-light mb-6 max-w-2xl">
                            Your unified dashboard for the HPE ML350 Gen10. Access, manage, and monitor high-performance local services with ease.
                        </p>
                    </div>
                    <div className="flex-shrink-0 animate-pulse-glow rounded-xl w-[400px] h-[300px]">
                        <img 
                            src="https://storage.googleapis.com/bot-sandbox-public-images/51a316b2-658f-4f51-872f-524f0c4063bd.png"
                            alt="Ein HPE-Server in einer futuristischen, Hightech-Stadtlandschaft" 
                            className="w-full h-full rounded-xl object-cover shadow-2xl shadow-black/50 border-2 border-highlight-cyan/20"
                        />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ServiceCard 
                    icon={<InformationCircleIcon />}
                    title="System Info"
                    description="Detailed overview of system hardware, software, and storage."
                    to="/system-info"
                />
                 <ServiceCard 
                    icon={<PaintBrushIcon />}
                    title="ComfyUI"
                    description="Node-based interface for advanced image generation and workflow creation."
                    to="/comfyui"
                />
                <ServiceCard 
                    icon={<ChatBubbleIcon />}
                    title="Ollama"
                    description="Run powerful large language models like Llama 3 locally."
                    to="/ollama"
                />
                <ServiceCard 
                    icon={<ChartBarIcon />}
                    title="Server Monitoring"
                    description="Live performance metrics for CPU, RAM, Disk, and Network."
                    to="/monitoring"
                />
            </div>
        </div>
    );
};

export default HomePage;`
    },
    {
        name: 'pages/ComfyUIPage.tsx',
        content: `import React, { useState } from 'react';
import { useSystemData } from '../hooks/useSystemData';

const AccordionItem = ({ title, items }: { title: string, items: string[] | undefined }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    if (!items || items.length === 0) {
        return (
            <div className="border-b border-accent-blue/20">
                <div className="flex justify-between items-center p-4 cursor-not-allowed">
                    <h3 className="text-lg font-semibold text-accent-light">{title}</h3>
                    <span className="text-accent-light text-sm">No items</span>
                </div>
            </div>
        );
    }

    return (
        <div className="border-b border-accent-blue/20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full p-4 text-left focus:outline-none"
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold text-highlight-green">{title}</h3>
                <div className='flex items-center space-x-2'>
                    <span className="text-sm bg-accent-blue text-text-main rounded-full px-2 py-0.5">{items.length} items</span>
                    <svg
                        className={\`w-6 h-6 transform transition-transform duration-300 \${isOpen ? 'rotate-180' : ''}\`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            <div className={\`transition-all duration-300 ease-in-out overflow-hidden \${isOpen ? 'max-h-96' : 'max-h-0'}\`}>
                <ul className="p-4 pt-0 space-y-2 max-h-80 overflow-y-auto">
                    {items.map((item, index) => (
                        <li key={index} className="text-accent-light bg-primary p-2 rounded-md font-mono text-sm">{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


const ComfyUIPage = () => {
    const comfyUiUrl = 'http://localhost:8188';
    const { data, loading, error } = useSystemData();

    return (
        <div className="flex flex-col h-full animate-fade-in-up space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">ComfyUI Interface</h2>
                <div className="flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-highlight-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-highlight-green"></span>
                    </span>
                    <span className="text-highlight-green">Service Online</span>
                </div>
            </div>
            
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-100px)]">
                <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden border-2 border-accent-blue/30 shadow-2xl shadow-black/50">
                    <iframe
                        src={comfyUiUrl}
                        title="ComfyUI"
                        className="w-full h-full border-0"
                    />
                </div>

                <div className="lg:col-span-1 bg-secondary rounded-xl border border-accent-blue/20 flex flex-col">
                    <div className="p-4 border-b border-accent-blue/20">
                        <h3 className="text-xl font-bold text-highlight-cyan">ComfyUI Assets</h3>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {loading && <p className="p-4 text-accent-light">Loading assets...</p>}
                        {error && <p className="p-4 text-red-400">Error loading assets: {error}</p>}
                        {data && (
                            <div>
                                <AccordionItem title="Workflows" items={data.workflows} />
                                <AccordionItem title="Custom Nodes" items={data.models_and_assets.custom_nodes} />
                                <AccordionItem title="Checkpoints" items={data.models_and_assets.checkpoints} />
                                <AccordionItem title="LoRAs" items={data.models_and_assets.loras} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
             <div className="bg-secondary p-4 rounded-lg border border-accent-blue/20">
                <p className="text-accent-light text-sm">
                    Displaying ComfyUI from <a href={comfyUiUrl} target="_blank" rel="noopener noreferrer" className="text-highlight-cyan underline">{comfyUiUrl}</a>. If the content does not load, ensure the service is running and accessible.
                </p>
            </div>
        </div>
    );
};

export default ComfyUIPage;`
    },
    {
        name: 'pages/OllamaPage.tsx',
        content: `import React, { useState } from 'react';
import { useSystemData } from '../hooks/useSystemData';

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

const OllamaPage = () => {
    const { data, loading, error } = useSystemData();
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { sender: 'ai', text: 'Hello! I am your local AI assistant powered by Ollama. What can I help you with today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const newUserMessage = { sender: 'user', text: message };
        setChatHistory(prev => [...prev, newUserMessage]);
        setMessage('');
        setIsLoading(true);

        setTimeout(() => {
            const aiResponse = { sender: 'ai', text: \`This is a simulated response to: "\${message}". In a real application, this would be a generated response from an Ollama model.\` };
            setChatHistory(prev => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1500);
    };

    const ollamaStatus = data?.ollama_status;
    const serviceIsRunning = ollamaStatus?.status === 'running';

    return (
        <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-1 flex flex-col gap-8">
                <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20">
                    <h2 className="text-2xl font-bold mb-4 text-highlight-green">Ollama Control</h2>
                    <div className={\`flex items-center space-x-3 \${serviceIsRunning ? 'text-highlight-green' : 'text-red-400'}\`}>
                        <span className="relative flex h-3 w-3">
                            <span className={\`animate-ping absolute inline-flex h-full w-full rounded-full \${serviceIsRunning ? 'bg-green-400' : 'bg-red-400'} opacity-75\`}></span>
                            <span className={\`relative inline-flex rounded-full h-3 w-3 \${serviceIsRunning ? 'bg-green-500' : 'bg-red-500'}\`}></span>
                        </span>
                        <span>{serviceIsRunning ? \`Service Active (\${ollamaStatus?.version})\` : 'Service Offline'}</span>
                    </div>
                </div>
                <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20 flex-grow">
                    <h3 className="text-xl font-bold mb-4 text-highlight-green">Installed Models</h3>
                    {loading && <p className="text-accent-light">Loading models...</p>}
                    {error && <p className="text-red-400">Error: {error}</p>}
                    {ollamaStatus?.installed_models ? (
                        <ul className="space-y-3">
                            {ollamaStatus.installed_models.map(model => (
                                <li key={model.name} className="bg-primary p-3 rounded-lg flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-mono text-text-main">{model.name}</p>
                                        <p className="text-xs text-accent-light">{\`\${model.digest} \${model.updated}\`}</p>
                                    </div>
                                    <span className="text-accent-light font-mono bg-accent-blue/20 px-2 py-1 rounded text-xs">{model.size}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !loading && <p className="text-accent-light">No models found.</p>
                    )}
                </div>
            </div>

            <div className="lg:col-span-2 bg-secondary rounded-xl border border-accent-blue/20 flex flex-col h-[85vh]">
                <div className="p-4 border-b border-accent-blue/20">
                    <h2 className="text-xl font-bold text-highlight-cyan">Model Chat (Simulation)</h2>
                </div>
                <div className="flex-grow p-6 overflow-y-auto space-y-4">
                    {chatHistory.map((chat, index) => (
                        <div key={index} className={\`flex \${chat.sender === 'user' ? 'justify-end' : 'justify-start'}\`}>
                            <div className={\`max-w-lg px-4 py-2 rounded-xl \${chat.sender === 'user' ? 'bg-highlight-cyan text-primary' : 'bg-accent-blue text-white'}\`}>
                                <p>{chat.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                            <div className="max-w-lg px-4 py-3 rounded-xl bg-accent-blue text-white">
                                <div className="flex items-center space-x-2">
                                    <span className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-white rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-accent-blue/20">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Send a message..."
                            className="w-full bg-primary p-3 rounded-lg border border-accent-blue/30 focus:outline-none focus:ring-2 focus:ring-highlight-cyan text-text-main"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="bg-highlight-cyan text-primary p-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <SendIcon />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OllamaPage;`
    },
    {
        name: 'pages/MonitoringPage.tsx',
        content: `import React from 'react';
import { useSystemData } from '../hooks/useSystemData';

const UsageBar = ({ value, total, color }: { value: number, total: number, color: string }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-sm font-mono">
                <span className="text-text-main">{value.toFixed(2)} GB / {total.toFixed(2)} GB</span>
                <span style={{ color }}>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-primary rounded-full h-2.5 border border-accent-blue/50">
                <div className="h-2.5 rounded-full" style={{ width: \`\${percentage}%\`, backgroundColor: color }}></div>
            </div>
        </div>
    );
};

const MonitoringCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20 min-h-[150px] flex flex-col justify-center">
        <h3 className="text-xl font-bold text-highlight-green mb-4">{title}</h3>
        {children}
    </div>
);


const MonitoringPage = () => {
    const { 
        data, 
        loading, 
        error,
    } = useSystemData();

    if (loading) return <p className="text-center text-accent-light">Loading monitoring data...</p>;
    if (error) return <p className="text-center text-red-400">Error: {error}</p>;
    if (!data) return <p className="text-center text-accent-light">No data available.</p>;

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">Server Performance Monitor</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MonitoringCard title="CPU Information">
                    <p className="text-md font-mono text-text-main">{data.system_info.cpu_info}</p>
                    <p className="text-sm text-accent-light mt-2">Live utilization tracking is disabled.</p>
                </MonitoringCard>
                <MonitoringCard title="Memory (RAM)">
                    <p className="text-2xl font-mono text-highlight-green">{data.system_info.total_ram_gb.toFixed(2)} GB Total</p>
                     <p className="text-sm text-accent-light mt-2">Live usage tracking is disabled.</p>
                </MonitoringCard>
                <MonitoringCard title="Disk I/O">
                     <p className="text-2xl font-mono text-accent-light">N/A</p>
                     <p className="text-sm text-accent-light mt-2">Live I/O monitoring is disabled.</p>
                </MonitoringCard>
                 <MonitoringCard title="Network Traffic">
                     <p className="text-2xl font-mono text-accent-light">N/A</p>
                     <p className="text-sm text-accent-light mt-2">Live traffic monitoring is disabled.</p>
                </MonitoringCard>

                {data.gpu_status.map((gpu, index) => (
                     <MonitoringCard key={index} title={\`\${gpu.name} VRAM\`}>
                        <UsageBar value={gpu.vram_used_mb / 1024} total={gpu.vram_total_mb / 1024} color={index === 0 ? "#BE95C4" : "#F3B391"} />
                    </MonitoringCard>
                ))}

                {data.storage_status.map((disk, index) => (
                    <MonitoringCard key={index} title={disk.description || disk.path}>
                        <UsageBar value={disk.used_gb} total={disk.total_gb} color={["#A9E5BB", "#86BBD8", "#F4A261"][index % 3]} />
                    </MonitoringCard>
                ))}
            </div>
        </div>
    );
};

export default MonitoringPage;`
    },
    {
        name: 'types.ts',
        content: `export interface ChartData {
    name: string;
    value: number;
}

export interface SystemInfo {
    os_name: string;
    os_version: string;
    kernel_version: string;
    architecture: string;
    python_version: string;
    total_ram_gb: number;
    cpu_info: string;
    comfyui_git_version: string;
}

export interface GpuStatus {
    name: string;
    vram_total_mb: number;
    vram_used_mb: number;
    vram_free_mb: number;
    note: string;
}

export interface OllamaModel {
    name: string;
    size: string;
    digest: string;
    updated: string;
}

export interface OllamaStatus {
    status: string;
    service_status: string;
    version: string;
    installed_models: OllamaModel[];
}

export interface ComfyUiPaths {
    base_path: string;
    custom_nodes: string;
    checkpoints: string;
    loras: string;
    vae: string;
    embeddings: string;
    controlnet: string;
    clip_vision: string;
    unclip: string;
    upscale_models: string;
    diffusers: string;
    gligen: string;
    t2i_adapter: string;
    video_models: string;
    workflows: string;
}

export interface ModelsAndAssets {
    custom_nodes: string[];
    checkpoints: string[];
    loras: string[];
    vae: string[];
    embeddings: string[];
    controlnet: string[];
    clip_vision: string[];
    upscale_models: string[];
    diffusers: string[];
    gligen: string[];
}

export interface StorageStatus {
    path: string;
    total_gb: number;
    used_gb: number;
    free_gb: number;
    filesystem_type: string;
    device: string;
    uuid: string | null;
    mount_options: string;
    error: string | null;
    description: string;
}

export interface SystemData {
    system_info: SystemInfo;
    gpu_status: GpuStatus[];
    ollama_status: OllamaStatus;
    comfyui_paths: ComfyUiPaths;
    models_and_assets: ModelsAndAssets;
    workflows: string[];
    storage_status: StorageStatus[];
}`
    },
    {
        name: 'hooks/useSystemData.ts',
        content: `import { useState, useEffect } from 'react';
import { SystemData } from '../types';

export const useSystemData = () => {
    const [data, setData] = useState<SystemData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/application.json');
                if (!response.ok) {
                    throw new Error(\`HTTP error! status: \${response.status}\`);
                }
                const jsonData: SystemData = await response.json();
                setData(jsonData);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};`
    },
    {
        name: 'pages/SystemInfoPage.tsx',
        content: `import React, { useState } from 'react';
import { useSystemData } from '../hooks/useSystemData';

const GpuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-highlight-cyan flex-shrink-0 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 7h20v10H2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12a2 2 0 100-4 2 2 0 000 4zM14 12a2 2 0 100-4 2 2 0 000 4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 17h3m14 0h3" />
    </svg>
);

const InfoCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20">
        <h3 className="text-xl font-bold text-highlight-cyan mb-4">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const InfoItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm">
        <p className="text-accent-light">{label}</p>
        <p className="text-text-main font-mono text-left sm:text-right">{value}</p>
    </div>
);

const UsageBar = ({ value, total, color, unit }: { value: number, total: number, color: string, unit: string }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-xs font-mono">
                <span className="text-text-main">{value.toFixed(2)} {unit} / {total.toFixed(2)} {unit}</span>
                <span style={{ color }}>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-primary rounded-full h-2 border border-accent-blue/50">
                <div className="h-1.5 rounded-full" style={{ width: \`\${percentage}%\`, backgroundColor: color }}></div>
            </div>
        </div>
    );
};

const TabButton = ({ label, tabKey, activeTab, setActiveTab }: { label: string, tabKey: string, activeTab: string, setActiveTab: (key: string) => void }) => {
    const isActive = activeTab === tabKey;
    const baseClasses = "px-6 py-3 text-sm font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight-cyan rounded-t-lg";
    const activeClasses = "border-b-2 border-highlight-cyan text-highlight-cyan";
    const inactiveClasses = "text-accent-light hover:text-white border-b-2 border-transparent";
    return (
        <button
            onClick={() => setActiveTab(tabKey)}
            className={\`\${baseClasses} \${isActive ? activeClasses : inactiveClasses}\`}
            role="tab"
            aria-selected={isActive}
            aria-controls={\`tabpanel-\${tabKey}\`}
            id={\`tab-\${tabKey}\`}
        >
            {label.toUpperCase()}
        </button>
    );
};

const TabPanel = ({ children, tabKey, activeTab }: { children: React.ReactNode, tabKey: string, activeTab: string }) => {
    const isHidden = activeTab !== tabKey;
    return (
        <div
            hidden={isHidden}
            role="tabpanel"
            id={\`tabpanel-\${tabKey}\`}
            aria-labelledby={\`tab-\${tabKey}\`}
            className="animate-fade-in-up"
        >
            {!isHidden && children}
        </div>
    );
};


const SystemInfoPage = () => {
    const { data, loading, error } = useSystemData();
    const [activeTab, setActiveTab] = useState('system');

    if (loading) {
        return <div className="text-center text-accent-light">Loading system information...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error loading data: {error}</div>;
    }

    if (!data) {
        return <div className="text-center text-accent-light">No system information available.</div>;
    }

    return (
        <div className="animate-fade-in-up space-y-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">System Overview</h2>
            
            <div className="w-full">
                <div className="flex border-b border-accent-blue/20" role="tablist" aria-label="System Information Tabs">
                    <TabButton label="System" tabKey="system" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton label="Hardware" tabKey="hardware" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton label="Service Details" tabKey="services" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                
                <div className="mt-8">
                    <TabPanel tabKey="system" activeTab={activeTab}>
                        <InfoCard title="System Information">
                            <InfoItem label="OS" value={\`\${data.system_info.os_name} \${data.system_info.os_version}\`} />
                            <InfoItem label="Kernel" value={data.system_info.kernel_version} />
                            <InfoItem label="Architecture" value={data.system_info.architecture} />
                            <InfoItem label="CPU" value={data.system_info.cpu_info} />
                            <InfoItem label="Total RAM" value={\`\${data.system_info.total_ram_gb.toFixed(2)} GB\`} />
                            <InfoItem label="Python Version" value={data.system_info.python_version} />
                            <InfoItem label="ComfyUI Git Hash" value={data.system_info.comfyui_git_version} />
                        </InfoCard>
                    </TabPanel>

                    <TabPanel tabKey="hardware" activeTab={activeTab}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <InfoCard title="GPU Status">
                                {data.gpu_status.map((gpu, index) => (
                                    <div key={index} className="bg-primary p-4 rounded-lg flex items-center">
                                        <GpuIcon />
                                        <div className="flex-grow">
                                            <p className="font-bold text-highlight-green mb-1">{gpu.name}</p>
                                            <UsageBar value={gpu.vram_used_mb} total={gpu.vram_total_mb} color="#00F5D4" unit="MB" />
                                        </div>
                                    </div>
                                ))}
                            </InfoCard>
                             <InfoCard title="Storage Status">
                                {data.storage_status.map((disk, index) => (
                                    <div key={index} className="space-y-2 bg-primary p-3 rounded-lg">
                                         <p className="font-bold text-highlight-green">{disk.description || disk.path}</p>
                                         <UsageBar value={disk.used_gb} total={disk.total_gb} color={["#9AE19D", "#FFD700", "#83C5BE"][index % 3]} unit="GB" />
                                    </div>
                                ))}
                            </InfoCard>
                        </div>
                    </TabPanel>
                    
                    <TabPanel tabKey="services" activeTab={activeTab}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <InfoCard title="Ollama Service">
                                <InfoItem label="Service Status" value={
                                    <span className={data.ollama_status.status === 'running' ? 'text-highlight-green' : 'text-red-400'}>
                                        {data.ollama_status.status}
                                    </span>
                                } />
                                <InfoItem label="Version" value={data.ollama_status.version} />
                                <InfoItem label="Installed Models" value={data.ollama_status.installed_models.length} />
                            </InfoCard>
                            <InfoCard title="ComfyUI Paths">
                                {Object.entries(data.comfyui_paths).map(([key, value]) => (
                                    <InfoItem key={key} label={key.replace(/_/g, ' ')} value={
                                        <span className={value.startsWith('Path not found') ? 'text-red-400/70' : ''}>
                                            {value.replace('/opt/ki_project/ComfyUI', '...')}
                                        </span>
                                    } />
                                ))}
                            </InfoCard>
                        </div>
                    </TabPanel>
                </div>
            </div>
        </div>
    );
};

export default SystemInfoPage;`
    },
    {
        name: 'contexts/SimulationContext.tsx',
        content: `import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SystemData, GpuStatus, StorageStatus, ChartData } from '../types';

// Utility to create a deeper copy for simulation
const deepCopy = <T,>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

const generateInitialData = (length: number, range: number): ChartData[] => {
    return Array.from({ length }, (_, i) => ({
        name: \`\${length - 1 - i}s ago\`,
        value: Math.floor(Math.random() * range),
    }));
};

const updateChartData = (prevData: ChartData[], range: number) => {
    const newData = [...prevData.slice(1)];
    const newValue = Math.floor(Math.random() * range);
    newData.push({ name: 'now', value: newValue });
    return newData.map((d, i) => ({ ...d, name: \`\${newData.length - 1 - i}s ago\` }));
};


interface AppDataContextType {
    baseData: SystemData | null;
    displayData: SystemData | null;
    loading: boolean;
    error: string | null;
    isSimulating: boolean;
    toggleSimulation: () => void;
    // Chart data
    cpuHistory: ChartData[];
    ramHistory: ChartData[];
    netHistory: ChartData[];
    diskHistory: ChartData[];
}

const SimulationContext = createContext<AppDataContextType | undefined>(undefined);

const HISTORY_LENGTH = 15;

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
    const [baseData, setBaseData] = useState<SystemData | null>(null);
    const [displayData, setDisplayData] = useState<SystemData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    
    // Time-series data states
    const [cpuHistory, setCpuHistory] = useState<ChartData[]>(generateInitialData(HISTORY_LENGTH, 100));
    const [ramHistory, setRamHistory] = useState<ChartData[]>([]);
    const [netHistory, setNetHistory] = useState<ChartData[]>(generateInitialData(HISTORY_LENGTH, 1000));
    const [diskHistory, setDiskHistory] = useState<ChartData[]>(generateInitialData(HISTORY_LENGTH, 500));


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/application.json');
                if (!response.ok) {
                    throw new Error(\`HTTP error! status: \${response.status}\`);
                }
                const jsonData: SystemData = await response.json();
                setBaseData(jsonData);
                setDisplayData(jsonData);
                // Initialize RAM history based on fetched data
                setRamHistory(generateInitialData(HISTORY_LENGTH, Math.round(jsonData.system_info.total_ram_gb)));
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const runSimulation = useCallback(() => {
        if (!baseData) return;

        const simulatedData = deepCopy(baseData);

        // Simulate GPU VRAM usage
        simulatedData.gpu_status = simulatedData.gpu_status.map((gpu: GpuStatus) => {
            const usageChange = (Math.random() - 0.45) * (gpu.vram_total_mb * 0.05); // Fluctuate by up to 5%, tend to increase slightly
            const newUsed = Math.max(3, Math.min(gpu.vram_total_mb * 0.95, gpu.vram_used_mb + usageChange));
            return {
                ...gpu,
                vram_used_mb: newUsed,
                vram_free_mb: gpu.vram_total_mb - newUsed,
            };
        });

        // Simulate Storage usage
        simulatedData.storage_status = simulatedData.storage_status.map((disk: StorageStatus) => {
             const usageChange = (Math.random() - 0.4) * 0.01; // Fluctuate by a small amount
             const newUsed = Math.max(0, Math.min(disk.total_gb * 0.98, disk.used_gb + usageChange));
             return {
                 ...disk,
                 used_gb: newUsed,
                 free_gb: disk.total_gb - newUsed,
             };
        });
        
        setDisplayData(simulatedData);

        // Update time-series data
        setCpuHistory(prev => updateChartData(prev, 100));
        setNetHistory(prev => updateChartData(prev, 1000));
        setDiskHistory(prev => updateChartData(prev, 500));
        setRamHistory(prev => updateChartData(prev, Math.round(baseData.system_info.total_ram_gb)));

    }, [baseData]);


    useEffect(() => {
        let intervalId: number | null = null;
        if (isSimulating && !loading) {
            intervalId = window.setInterval(runSimulation, 2000);
        } else {
            // When simulation stops, revert to base data
            setDisplayData(baseData);
            if(baseData) {
                // Also reset chart data to a static "snapshot"
                 setCpuHistory(generateInitialData(HISTORY_LENGTH, 100));
                 setRamHistory(generateInitialData(HISTORY_LENGTH, Math.round(baseData.system_info.total_ram_gb)));
                 setNetHistory(generateInitialData(HISTORY_LENGTH, 1000));
                 setDiskHistory(generateInitialData(HISTORY_LENGTH, 500));
            }
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isSimulating, baseData, loading, runSimulation]);

    const toggleSimulation = () => {
        setIsSimulating(prev => !prev);
    };

    return (
        <SimulationContext.Provider value={{ baseData, displayData, loading, error, isSimulating, toggleSimulation, cpuHistory, ramHistory, netHistory, diskHistory }}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useAppData = (): AppDataContextType => {
    const context = useContext(SimulationContext);
    if (context === undefined) {
        throw new Error('useAppData must be used within a SimulationProvider');
    }
    return context;
};`
    },
    {
        name: 'components/SimulationToggle.tsx',
        content: `import React from 'react';
import { useAppData } from '../contexts/SimulationContext';

const SimulationToggle = () => {
    const { isSimulating, toggleSimulation } = useAppData();

    return (
        <div className="flex flex-col items-center gap-2 p-3 bg-primary rounded-lg border border-accent-blue/20">
            <div className="flex items-center justify-between w-full">
                <label htmlFor="simulation-toggle" className="text-sm font-medium text-text-main cursor-pointer">
                    Server Simulation
                </label>
                <div 
                    className={\`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 \${isSimulating ? 'bg-highlight-cyan' : 'bg-accent-blue'}\`}
                    onClick={toggleSimulation}
                    role="switch"
                    aria-checked={isSimulating}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? toggleSimulation() : null}
                >
                    <span
                        className={\`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 \${isSimulating ? 'translate-x-6' : 'translate-x-1'}\`}
                    />
                </div>
            </div>
            <p className="text-xs text-accent-light text-center">
                {isSimulating ? 'Displaying dynamic, simulated data.' : 'Displaying static data from last report.'}
            </p>
        </div>
    );
};

export default SimulationToggle;`
    },
    {
        name: 'application.json',
        content: `{
    "system_info": {
        "os_name": "Linux",
        "os_version": "Ubuntu 24.04.2 LTS",
        "kernel_version": "6.11.0-29-generic",
        "architecture": "x86_64",
        "python_version": "3.12.3 (main, Jun 18 2025, 17:59:45) [GCC 13.3.0]",
        "total_ram_gb": 251.36,
        "cpu_info": "Intel(R) Xeon(R) Silver 4210R CPU @ 2.40GHz (x20)",
        "comfyui_git_version": "e18f53cc (Git HEAD)"
    },
    "gpu_status": [
        {
            "name": "NVIDIA GeForce RTX 3050",
            "vram_total_mb": 6144,
            "vram_used_mb": 3,
            "vram_free_mb": 6141,
            "note": "Basic CSV query used for compatibility."
        },
        {
            "name": "NVIDIA RTX 4000 Ada Generation",
            "vram_total_mb": 20475,
            "vram_used_mb": 3,
            "vram_free_mb": 20472,
            "note": "Basic CSV query used for compatibility."
        }
    ],
    "ollama_status": {
        "status": "running",
        "service_status": "active",
        "version": "ollama version is 0.8.0",
        "installed_models": [
            {
                "name": "comfyadmin_master:latest",
                "size": "727b32c80915",
                "digest": "4.9",
                "updated": "GB 18 hours ago"
            },
            {
                "name": "llama3.1:8b",
                "size": "46e0c10c039e",
                "digest": "4.9",
                "updated": "GB 18 hours ago"
            },
            {
                "name": "deepseek-r1:latest",
                "size": "6995872bfe4c",
                "digest": "5.2",
                "updated": "GB 19 hours ago"
            },
            {
                "name": "comfyadmin:latest",
                "size": "cf34f06eccdc",
                "digest": "4.1",
                "updated": "GB 4 weeks ago"
            },
            {
                "name": "comfy-admin:latest",
                "size": "5eb3ea4ba3f5",
                "digest": "4.1",
                "updated": "GB 7 weeks ago"
            },
            {
                "name": "mistral:latest",
                "size": "f974a74358d6",
                "digest": "4.1",
                "updated": "GB 7 weeks ago"
            }
        ]
    },
    "comfyui_paths": {
        "base_path": "/opt/ki_project/ComfyUI",
        "custom_nodes": "/opt/ki_project/ComfyUI/custom_nodes",
        "checkpoints": "/opt/ki_project/ComfyUI/models/checkpoints",
        "loras": "/opt/ki_project/ComfyUI/models/loras",
        "vae": "/opt/ki_project/ComfyUI/models/vae",
        "embeddings": "/opt/ki_project/ComfyUI/models/embeddings",
        "controlnet": "/opt/ki_project/ComfyUI/models/controlnet",
        "clip_vision": "/opt/ki_project/ComfyUI/models/clip_vision",
        "unclip": "Path not found: /opt/ki_project/ComfyUI/models/unclip",
        "upscale_models": "/opt/ki_project/ComfyUI/models/upscale_models",
        "diffusers": "/opt/ki_project/ComfyUI/models/diffusers",
        "gligen": "/opt/ki_project/ComfyUI/models/gligen",
        "t2i_adapter": "Path not found: /opt/ki_project/ComfyUI/models/t2i_adapter",
        "video_models": "Path not found: /opt/ki_project/ComfyUI/models/video_models",
        "workflows": "/opt/ki_project/ComfyUI/Workflow Store"
    },
    "models_and_assets": {
        "custom_nodes": [
            "ComfyUI-Copilot",
            "ComfyUI-Crystools",
            "ComfyUI-Impact-Pack",
            "ComfyUI-Iterative-Mixer",
            "ComfyUI-Manager",
            "ComfyUI-RMBG",
            "ComfyUI_IPAdapter_plus",
            "ComfyUI_bfl_api_pro_nodes",
            "ComfyUI_nodes",
            "Comfyui-Yolov8",
            "batchimg-rembg-comfyui-nodes",
            "comfy-mtb",
            "comfy_bfl_nodes",
            "comfyui-advanced-controlnet",
            "comfyui-cyclist",
            "comfyui-flux-bfl-api",
            "comfyui-if_gemini",
            "comfyui-impact-subpack",
            "comfyui-inpaint-cropandstitch",
            "comfyui-inpainteasy",
            "comfyui-inspire-pack",
            "comfyui-inspyrenet-rembg",
            "comfyui-job-iterator",
            "comfyui-kjnodes",
            "comfyui-logicutils",
            "comfyui-multigpu",
            "comfyui-my-nodes",
            "comfyui-ollama",
            "comfyui-ultralytics-yolo",
            "comfyui-utils-nodes",
            "comfyui-various",
            "comfyui_birefnet_ll",
            "comfyui_controlnet_aux",
            "comfyui_creepy_nodes",
            "comfyui_essentials",
            "comfyui_layerstyle",
            "comfyui_segment_anything_plus",
            "comfyui_soze",
            "example_node.py.example",
            "facerestore_cf",
            "krita-ai-diffusion",
            "portraittools-mw",
            "rembg-comfyui-node",
            "rgthree-comfy",
            "was-node-suite-comfyui",
            "was-ns",
            "websocket_image_save.py"
        ],
        "checkpoints": [
            "SDXL-TURBO",
            "juggernautXL_v8Rundiffusion.safetensors",
            "put_checkpoints_here",
            "v1-5-pruned-emaonly-fp16.safetensors",
            "v1-5-pruned-emaonly.safetensors"
        ],
        "loras": [
            "Funko_Pop_Flux.safetensors",
            "Funko_Pop_SDXL.safetensors",
            "put_loras_here"
        ],
        "vae": [
            "ae.safetensors",
            "ae.sft",
            "put_vae_here"
        ],
        "embeddings": [
            "put_embeddings_or_textual_inversion_concepts_here"
        ],
        "controlnet": [
            "diffusion_pytorch_model_promax.safetensors",
            "put_controlnets_and_t2i_here"
        ],
        "clip_vision": [
            "put_clip_vision_models_here"
        ],
        "upscale_models": [
            "4x-UltraSharp.pth",
            "8x_NMKD-Faces_160000_G.pth",
            "ldsr",
            "put_esrgan_and_other_upscale_models_here"
        ],
        "diffusers": [
            "put_diffusers_models_here"
        ],
        "gligen": [
            "put_gligen_models_here"
        ]
    },
    "workflows": [
        "01-faceswap.json",
        "Base SD Workflow.json",
        "FLUX.1 DEV 1.0【Zho】.json",
        "FLUX.1_DEV_1.0_Zho.json",
        "Miramonte_Gesicht_Isolieren.json",
        "Miramonte_Gesichter_Isolieren v1.json",
        "Miramonte_Person_Isolieren.json",
        "Miramonte_Testflow.json",
        "____inpaint_flux_1_fill_comfyworkflows.json",
        "api_google_gemini.json",
        "bastian4523_simple_workflow_for_beginners_with_lora___img2img_comfyworkflows.json"
    ],
    "storage_status": [
        {
            "path": "/opt/ki_project",
            "total_gb": 549.07,
            "used_gb": 13.03,
            "free_gb": 508.08,
            "filesystem_type": "ext4",
            "device": "/dev/sda1",
            "uuid": null,
            "mount_options": "rw,relatime,stripe=256",
            "error": null,
            "description": "AI Project Base (Local SSD)"
        },
        {
            "path": "/mnt/comfyui_iscsi_data",
            "total_gb": 782.43,
            "used_gb": 152.31,
            "free_gb": 590.31,
            "filesystem_type": "ext4",
            "device": "/dev/sdd1",
            "uuid": null,
            "mount_options": "rw,relatime,stripe=320",
            "error": null,
            "description": "ComfyUI Models & LoRAs (iSCSI NAS)"
        },
        {
            "path": "/mnt/ki_io_data",
            "total_gb": 3022.69,
            "used_gb": 0.18,
            "free_gb": 2868.89,
            "filesystem_type": "ext4",
            "device": "/dev/sde1",
            "uuid": null,
            "mount_options": "rw,relatime,stripe=320",
            "error": null,
            "description": "AI Generated Results (iSCSI NAS)"
        }
    ]
}`
    },
    {
        name: 'components/ServerOffButton.tsx',
        content: `import React, { useState } from 'react';

const ServerOffButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShutdown = () => {
        setIsModalOpen(false);
        // In a real app, this would trigger an API call.
        alert('Server shutdown command sent. This is a simulation.');
    };
    
    return (
        <>
            <div className="flex flex-col items-center gap-2 p-3 bg-primary rounded-lg border border-accent-blue/20">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-red-800/50 hover:bg-red-700/60 border border-red-500/50 text-red-200 font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    aria-label="Shut down server"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.99 5a1 1 0 011 1v4a1 1 0 11-2 0V6a1 1 0 011-1zM9 12a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                    </svg>
                    <span>Server OFF</span>
                </button>
            </div>

            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-up" 
                    style={{ animationDuration: '0.3s' }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="shutdown-modal-title"
                >
                    <div className="bg-secondary rounded-lg shadow-xl p-8 border border-accent-blue/30 max-w-md w-full" role="document">
                        <h2 id="shutdown-modal-title" className="text-2xl font-bold text-red-400 mb-4">Confirm Server Shutdown</h2>
                        <p className="text-accent-light mb-6">
                            Are you sure you want to shut down the server? This action cannot be undone and will terminate all running services.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 rounded-lg bg-accent-blue hover:bg-accent-light hover:text-primary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleShutdown}
                                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
                            >
                                Shut Down
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ServerOffButton;`
    },
    {
        name: 'pages/CliPage.tsx',
        content: `import React from 'react';

const CliPage = () => {
    return (
        <div className="animate-fade-in-up flex flex-col h-full">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">Web CLI</h2>
            <div className="flex-grow bg-black rounded-xl border-2 border-accent-blue/30 shadow-2xl shadow-black/50 p-4 font-mono text-sm text-green-400 overflow-y-auto">
                <p>Welcome to Big Bertha Service Hub CLI.</p>
                <p>Last login: {new Date().toUTCString()}</p>
                <p className="text-gray-500">NOTE: This is a simulated interface. SSH commands are not executed.</p>
                <br />
                <div className="flex items-center">
                    <span className="text-highlight-cyan">user@big-bertha</span>
                    <span className="text-text-main">:</span>
                    <span className="text-yellow-400">~</span>
                    <span className="text-text-main">$ &nbsp;</span>
                    <span
                        className="flex-1 bg-transparent outline-none text-white caret-green-400"
                        contentEditable
                        suppressContentEditableWarning
                        aria-label="CLI input"
                    />
                </div>
            </div>
             <div className="bg-secondary mt-6 p-4 rounded-lg border border-accent-blue/20">
                <p className="text-accent-light text-sm">
                    This interface provides a command-line prompt for server interaction. Type your commands to begin. For security, functionality is limited.
                </p>
            </div>
        </div>
    );
};

export default CliPage;`
    }
];

const DownloadSourceButton = () => {
    const handleDownload = () => {
        let fullText = "";
        files.forEach(f => {
            fullText += `--- START OF FILE ${f.name} ---\n\n${f.content}\n\n`;
        });
        
        const blob = new Blob([fullText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'LocalBigBertha_Source.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleDownload}
            className="w-full bg-accent-blue/20 hover:bg-accent-blue/40 border border-accent-blue/50 text-highlight-cyan font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mb-2"
            aria-label="Download Source Code"
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Source</span>
        </button>
    );
};

export default DownloadSourceButton;

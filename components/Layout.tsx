import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Server, Brain, Settings, Activity } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Command Center', icon: LayoutDashboard },
    { path: '/ai-services', label: 'AI Services', icon: Brain },
    { path: '/hardware', label: 'Hardware (iLO)', icon: Server },
    { path: '/settings', label: 'Configuration', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-border bg-panel">
        <div className="p-6 flex items-center gap-3 border-b border-border/50">
          <Activity className="text-hpe-green h-8 w-8" />
          <div>
            <h1 className="font-bold text-lg tracking-wider text-white">BERTHA<span className="text-hpe-green">HUB</span></h1>
            <p className="text-xs text-text-secondary font-mono">ML350 Gen10</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-hpe-green/10 text-hpe-green border-l-4 border-hpe-green' 
                  : 'text-text-secondary hover:bg-white/5 hover:text-white border-l-4 border-transparent'}
              `}
            >
              <item.icon size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="bg-black/30 rounded p-3 text-xs font-mono text-text-secondary">
            <div className="flex justify-between mb-1">
              <span>STATUS</span>
              <span className="text-hpe-green">NOMINAL</span>
            </div>
            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
              <div className="bg-hpe-green h-full w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-hpe-green/5 via-background to-background">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
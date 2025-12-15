import React from 'react';
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
                    backgroundImage: `
                        radial-gradient(circle at 1px 1px, rgba(119, 141, 169, 0.2) 1px, transparent 0),
                        radial-gradient(circle at top left, rgba(0, 245, 212, 0.1), transparent 40%),
                        radial-gradient(circle at bottom right, rgba(154, 225, 157, 0.1), transparent 40%)
                    `,
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
                            src="https://images.unsplash.com/photo-1558494949-ef526b0042a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Server Rack Dashboard Representation" 
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

export default HomePage;
import { useState, useEffect } from 'react';
import { Terminal, Code2, Sparkles } from 'lucide-react';

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [text, setText] = useState('');
  const fullText = '> 初始化系统...\n> 加载博客模块...\n> 连接数据库...\n> 启动完成 ✓';

  useEffect(() => {
    // Phase 0: Logo animation (1.5s)
    const timer1 = setTimeout(() => setPhase(1), 1500);
    
    // Phase 1: Terminal typing effect
    let charIndex = 0;
    const timer2 = setTimeout(() => {
      const interval = setInterval(() => {
        if (charIndex <= fullText.length) {
          setText(fullText.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(interval);
          // Phase 2: Fade out and complete
          setTimeout(() => setPhase(2), 800);
          setTimeout(() => onComplete(), 1200);
        }
      }, 50);
      return () => clearInterval(interval);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-500 ${
        phase === 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 -m-20 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Glowing Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />

        {/* Logo Section */}
        <div className={`relative text-center transition-all duration-500 ${phase >= 1 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {/* Logo Icon */}
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
            {/* Rotating Ring */}
            <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 border border-emerald-500/20 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            
            {/* Center Icon */}
            <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Code2 className="w-8 h-8 text-black" />
            </div>
            
            {/* Sparkles */}
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-emerald-400 animate-bounce" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold">
            <span className="text-white">Dev</span>
            <span className="text-emerald-400">Blog</span>
          </h1>
          
          {/* Loading Bar */}
          <div className="mt-6 w-48 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-[loading_1.5s_ease-out]" 
              style={{
                '@keyframes loading': {
                  '0%': { width: '0%' },
                  '100%': { width: '100%' }
                }
              } as any}
            />
          </div>
        </div>

        {/* Terminal Section */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 transition-all duration-500 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-gray-900/90 backdrop-blur-sm border border-emerald-500/30 rounded-lg overflow-hidden shadow-2xl shadow-emerald-500/10">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border-b border-emerald-500/20">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <Terminal className="w-4 h-4 text-emerald-400 ml-2" />
              <span className="text-xs text-gray-400 ml-1">terminal</span>
            </div>
            
            {/* Terminal Content */}
            <div className="p-4 font-mono text-sm text-emerald-400 min-h-[120px]">
              <pre className="whitespace-pre-wrap">{text}</pre>
              <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Bottom Glow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-emerald-500/50 rounded-full blur-sm" />
      </div>

      {/* CSS for loading animation */}
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
